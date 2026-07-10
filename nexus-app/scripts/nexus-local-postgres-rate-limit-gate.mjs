import {
  randomUUID,
} from "node:crypto";

import pg from "pg";

import {
  inspectPostgresMigrationStatus,
} from "../lib/nexus/postgresMigrationRunner.mjs";

import {
  PostgresProtectedApiRateLimitStore,
} from "../lib/nexus/protectedApiRateLimitStore.mjs";

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
    "DATABASE_URL is required for the real rate-limit gate.",
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
  `tenant-rate-${suffix}`;

const secondTenantId =
  `tenant-rate-second-${suffix}`;

const ownerId =
  `owner-rate-${suffix}`;

const authorityEpoch =
  `rate-epoch-${suffix}`;

const routeKey =
  "/api/nexus/controlled-action-review-console";

const nowMs =
  1783680000000;

const windowMs =
  60000;

const maximumRequests =
  5;

const store =
  new PostgresProtectedApiRateLimitStore({
    pool,
  });

let report;
let failure = null;

try {
  const migrationStatus =
    await inspectPostgresMigrationStatus({
      client: pool,
    });

  const readiness =
    await store.checkReadiness();

  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        INSERT INTO nexus_tenant (
          tenant_id,
          display_name,
          status
        )
        VALUES
          ($1, 'Day 675 Rate Tenant', 'ACTIVE'),
          ($2, 'Day 675 Second Tenant', 'ACTIVE')
      `,
      [
        tenantId,
        secondTenantId,
      ],
    );

    await client.query(
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

    await client.query(
      `
        INSERT INTO nexus_tenant_owner_membership (
          tenant_id,
          owner_id,
          role,
          status,
          authority_epoch
        )
        VALUES
          (
            $1,
            $3,
            'OWNER',
            'ACTIVE',
            $4
          ),
          (
            $2,
            $3,
            'OWNER',
            'ACTIVE',
            $4
          )
      `,
      [
        tenantId,
        secondTenantId,
        ownerId,
        authorityEpoch,
      ],
    );

    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query(
        "ROLLBACK",
      );
    } catch {
      // Original failure remains authoritative.
    }

    throw error;
  } finally {
    client.release();
  }

  const requestCount =
    8;

  const concurrentResults =
    await Promise.all(
      Array.from(
        {
          length: requestCount,
        },
        (_, index) =>
          store.consume({
            tenantId,
            ownerId,
            routeKey,
            requestId:
              `rate-request-${suffix}-${index}`,
            nowMs,
            windowMs,
            maximumRequests,
          }),
      ),
    );

  const allowedCount =
    concurrentResults.filter(
      (result) =>
        result.ok === true &&
        result.allowed === true,
    ).length;

  const blockedCount =
    concurrentResults.filter(
      (result) =>
        result.ok === true &&
        result.allowed === false,
    ).length;

  const secondTenantResult =
    await store.consume({
      tenantId:
        secondTenantId,
      ownerId,
      routeKey,
      requestId:
        `rate-second-${suffix}`,
      nowMs,
      windowMs,
      maximumRequests,
    });

  const databaseEvidence =
    await pool.query(
      `
        SELECT
          (
            SELECT request_count
            FROM nexus_protected_api_rate_limit_bucket
            WHERE tenant_id = $1
              AND owner_id = $3
              AND route_key = $4
          ) AS first_tenant_count,

          (
            SELECT request_count
            FROM nexus_protected_api_rate_limit_bucket
            WHERE tenant_id = $2
              AND owner_id = $3
              AND route_key = $4
          ) AS second_tenant_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id IN ($1, $2)
              AND owner_id = $3
              AND route_key = $4
          ) AS security_event_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id = $1
              AND owner_id = $3
              AND route_key = $4
              AND decision = 'BLOCKED'
          ) AS blocked_event_count
      `,
      [
        tenantId,
        secondTenantId,
        ownerId,
        routeKey,
      ],
    );

  const evidence =
    databaseEvidence.rows?.[0] ?? {};

  const controls = [
    {
      id:
        "THREE_MIGRATIONS_CURRENT",
      passed:
        migrationStatus.state ===
          "MIGRATIONS_CURRENT" &&
        migrationStatus
          .totalMigrationCount ===
          4 &&
        migrationStatus
          .pendingMigrationCount ===
          0 &&
        migrationStatus
          .driftCount === 0,
    },
    {
      id:
        "RATE_LIMIT_TABLES_READY",
      passed:
        readiness.ready === true,
    },
    {
      id:
        "CONCURRENT_LIMIT_EXACTLY_ENFORCED",
      passed:
        allowedCount === 5 &&
        blockedCount === 3,
    },
    {
      id:
        "ATOMIC_COUNTER_RECORDED_ALL_REQUESTS",
      passed:
        evidence.first_tenant_count ===
        8,
    },
    {
      id:
        "TENANT_BUCKET_ISOLATION_VERIFIED",
      passed:
        secondTenantResult.ok ===
          true &&
        secondTenantResult.allowed ===
          true &&
        evidence.second_tenant_count ===
          1,
    },
    {
      id:
        "DURABLE_SECURITY_EVENTS_COMPLETE",
      passed:
        evidence.security_event_count ===
        9,
    },
    {
      id:
        "DURABLE_BLOCKED_EVENTS_EXACT",
      passed:
        evidence.blocked_event_count ===
        3,
    },
  ];

  const passed =
    controls.every(
      (control) =>
        control.passed,
    );

  report = {
    schemaVersion:
      "nexus.real-local-postgres-rate-limit-gate.v1",
    passed,
    migrationState:
      migrationStatus.state,
    migrationCount:
      migrationStatus.totalMigrationCount,
    readiness:
      readiness.state,
    concurrentRequestCount:
      requestCount,
    maximumRequests,
    allowedCount,
    blockedCount,
    firstTenantDatabaseCount:
      evidence.first_tenant_count,
    secondTenantDatabaseCount:
      evidence.second_tenant_count,
    securityEventCount:
      evidence.security_event_count,
    blockedSecurityEventCount:
      evidence.blocked_event_count,
    controls,
    realPostgresVerified:
      true,
    productionDatabaseModified:
      false,
    customerDataMutationPerformed:
      false,
    executionAuthorized:
      false,
    providerInvocationPerformed:
      false,
  };

  if (!passed) {
    failure =
      new Error(
        "Real PostgreSQL rate-limit gate failed.",
      );
  }
} catch (error) {
  failure = error;

  report = {
    schemaVersion:
      "nexus.real-local-postgres-rate-limit-gate.v1",
    passed: false,
    error:
      error instanceof Error
        ? error.message
        : String(error),
    productionDatabaseModified:
      false,
    executionAuthorized:
      false,
  };
} finally {
  try {
    await pool.query(
      `
        DELETE FROM nexus_security_event
        WHERE tenant_id IN ($1, $2)
          AND owner_id = $3
      `,
      [
        tenantId,
        secondTenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_protected_api_rate_limit_bucket
        WHERE tenant_id IN ($1, $2)
          AND owner_id = $3
      `,
      [
        tenantId,
        secondTenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_tenant_owner_membership
        WHERE tenant_id IN ($1, $2)
          AND owner_id = $3
      `,
      [
        tenantId,
        secondTenantId,
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
        WHERE tenant_id IN ($1, $2)
      `,
      [
        tenantId,
        secondTenantId,
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

