import {
  randomUUID,
} from "node:crypto";

import pg from "pg";

import {
  inspectPostgresMigrationStatus,
} from "../lib/nexus/postgresMigrationRunner.mjs";

import {
  PostgresProtectedApiReplayStore,
} from "../lib/nexus/protectedApiReplayStore.mjs";

import {
  PostgresProtectedApiTenantAuthorizationStore,
} from "../lib/nexus/protectedApiTenantAuthorizationStore.mjs";

const { Pool } = pg;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

const connectionString =
  normalizeString(
    process.env.DATABASE_URL,
  );

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required for the real PostgreSQL security integration gate.",
  );
}

const sslRequired =
  normalizeString(
    process.env.NEXUS_DATABASE_SSL_MODE,
  ).toLowerCase() !== "disable";

const pool =
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    ssl: sslRequired
      ? {
          rejectUnauthorized: false,
        }
      : false,
  });

const suffix =
  randomUUID()
    .replaceAll("-", "")
    .slice(0, 16);

const tenantId =
  `tenant-local-${suffix}`;

const ownerId =
  `owner-local-${suffix}`;

const foreignTenantId =
  `tenant-foreign-${suffix}`;

const authorityEpoch =
  `authority-epoch-${suffix}`;

const requestId =
  `request-local-${suffix}`;

const nonce =
  `nonce-local-${suffix}-0001`;

const nowMs = Date.now();

const expiresAtMs =
  nowMs + 5 * 60 * 1000;

const bodySha256 =
  "a".repeat(64);

const replayStore =
  new PostgresProtectedApiReplayStore({
    pool,
  });

const authorizationStore =
  new PostgresProtectedApiTenantAuthorizationStore({
    pool,
  });

let report = null;
let failure = null;

try {
  const migrationStatus =
    await inspectPostgresMigrationStatus({
      client: pool,
    });

  const replayReadiness =
    await replayStore.checkReadiness();

  const authorizationReadiness =
    await authorizationStore.checkReadiness();

  await pool.query(
    `
      INSERT INTO nexus_tenant (
        tenant_id,
        display_name,
        status
      )
      VALUES (
        $1,
        $2,
        'ACTIVE'
      )
    `,
    [
      tenantId,
      "NEXUS Day 673 Local Security Tenant",
    ],
  );

  await pool.query(
    `
      INSERT INTO nexus_owner_identity (
        owner_id,
        status
      )
      VALUES (
        $1,
        'ACTIVE'
      )
    `,
    [
      ownerId,
    ],
  );

  await pool.query(
    `
      INSERT INTO nexus_tenant_owner_membership (
        tenant_id,
        owner_id,
        role,
        status,
        authority_epoch
      )
      VALUES (
        $1,
        $2,
        'OWNER',
        'ACTIVE',
        $3
      )
    `,
    [
      tenantId,
      ownerId,
      authorityEpoch,
    ],
  );

  const authorized =
    await authorizationStore.authorizeOwner({
      tenantId,
      ownerId,
    });

  const foreignTenantAttempt =
    await authorizationStore.authorizeOwner({
      tenantId:
        foreignTenantId,
      ownerId,
    });

  await pool.query(
    `
      UPDATE nexus_tenant
      SET
        status = 'SUSPENDED',
        updated_at = NOW()
      WHERE tenant_id = $1
    `,
    [
      tenantId,
    ],
  );

  const suspendedTenantAttempt =
    await authorizationStore.authorizeOwner({
      tenantId,
      ownerId,
    });

  await pool.query(
    `
      UPDATE nexus_tenant
      SET
        status = 'ACTIVE',
        updated_at = NOW()
      WHERE tenant_id = $1
    `,
    [
      tenantId,
    ],
  );

  const concurrentAttemptCount = 32;

  const concurrentReplayResults =
    await Promise.all(
      Array.from(
        {
          length:
            concurrentAttemptCount,
        },
        () =>
          replayStore.consumeNonce({
            tenantId,
            ownerId,
            nonce,
            requestId,
            pathname:
              "/api/nexus/controlled-action-review-console",
            bodySha256,
            nowMs,
            expiresAtMs,
          }),
      ),
    );

  const successfulConsumptions =
    concurrentReplayResults.filter(
      (result) =>
        result.ok === true &&
        result.consumed === true,
    ).length;

  const rejectedReplays =
    concurrentReplayResults.filter(
      (result) =>
        result.ok === true &&
        result.consumed === false,
    ).length;

  const replayLedgerResult =
    await pool.query(
      `
        SELECT
          COUNT(*)::INTEGER AS count
        FROM nexus_protected_api_nonce
        WHERE tenant_id = $1
          AND owner_id = $2
          AND request_id = $3
      `,
      [
        tenantId,
        ownerId,
        requestId,
      ],
    );

  const replayLedgerRowCount =
    replayLedgerResult.rows?.[0]
      ?.count ?? 0;

  const controls = [
    {
      id:
        "REAL_POSTGRES_MIGRATIONS_CURRENT",
      passed:
        migrationStatus.state ===
          "MIGRATIONS_CURRENT" &&
        migrationStatus.pendingMigrationCount ===
          0 &&
        migrationStatus.driftCount ===
          0,
    },
    {
      id:
        "REPLAY_LEDGER_TABLE_READY",
      passed:
        replayReadiness.ready ===
        true,
    },
    {
      id:
        "TENANT_AUTHORIZATION_TABLES_READY",
      passed:
        authorizationReadiness.ready ===
        true,
    },
    {
      id:
        "ACTIVE_TENANT_OWNER_AUTHORIZED",
      passed:
        authorized.ok === true &&
        authorized.allowed === true &&
        authorized.membership
          ?.tenantId === tenantId &&
        authorized.membership
          ?.ownerId === ownerId &&
        authorized.membership
          ?.role === "OWNER" &&
        authorized.membership
          ?.authorityEpoch ===
          authorityEpoch,
    },
    {
      id:
        "FOREIGN_TENANT_ACCESS_DENIED",
      passed:
        foreignTenantAttempt.ok ===
          true &&
        foreignTenantAttempt.allowed ===
          false,
    },
    {
      id:
        "SUSPENDED_TENANT_ACCESS_DENIED",
      passed:
        suspendedTenantAttempt.ok ===
          true &&
        suspendedTenantAttempt.allowed ===
          false,
    },
    {
      id:
        "ATOMIC_CONCURRENT_NONCE_CONSUMPTION",
      passed:
        successfulConsumptions ===
          1 &&
        rejectedReplays ===
          concurrentAttemptCount - 1,
    },
    {
      id:
        "SINGLE_DURABLE_REPLAY_LEDGER_ROW",
      passed:
        replayLedgerRowCount === 1,
    },
  ];

  const passed =
    controls.every(
      (control) =>
        control.passed,
    );

  report = {
    schemaVersion:
      "nexus.real-local-postgres-security-gate.v1",
    passed,
    database:
      "PostgreSQL 16 disposable local integration",
    migrationState:
      migrationStatus.state,
    migrationCount:
      migrationStatus.totalMigrationCount,
    replayReadiness:
      replayReadiness.state,
    authorizationReadiness:
      authorizationReadiness.state,
    concurrentAttemptCount,
    successfulConsumptions,
    rejectedReplays,
    replayLedgerRowCount,
    controls,
    realPostgresVerified:
      true,
    productionDatabaseConfigured:
      false,
    productionMigrationPerformed:
      false,
    customerDataMutationPerformed:
      false,
    providerInvocationPerformed:
      false,
    executionAuthorized:
      false,
  };

  if (!passed) {
    failure =
      new Error(
        "Real PostgreSQL security integration gate failed.",
      );
  }
} catch (error) {
  failure = error;

  report = {
    schemaVersion:
      "nexus.real-local-postgres-security-gate.v1",
    passed: false,
    error:
      error instanceof Error
        ? error.message
        : String(error),
    realPostgresVerified:
      false,
    productionDatabaseConfigured:
      false,
    productionMigrationPerformed:
      false,
    customerDataMutationPerformed:
      false,
    providerInvocationPerformed:
      false,
    executionAuthorized:
      false,
  };
} finally {
  try {
    await pool.query(
      `
        DELETE FROM nexus_protected_api_nonce
        WHERE tenant_id = $1
          AND owner_id = $2
      `,
      [
        tenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_tenant_owner_membership
        WHERE tenant_id = $1
          AND owner_id = $2
      `,
      [
        tenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_owner_identity
        WHERE owner_id = $1
      `,
      [
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_tenant
        WHERE tenant_id = $1
      `,
      [
        tenantId,
      ],
    );
  } catch (cleanupError) {
    failure =
      failure ??
      cleanupError;
  }

  await pool.end();
}

console.log(
  JSON.stringify(
    report,
    null,
    2,
  ),
);

if (failure) {
  process.exit(1);
}
