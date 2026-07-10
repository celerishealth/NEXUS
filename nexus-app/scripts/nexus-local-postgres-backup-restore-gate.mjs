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

function fail(message) {
  throw new Error(message);
}

const mode =
  process.argv.includes("--seed")
    ? "seed"
    : process.argv.includes("--verify")
      ? "verify"
      : "";

if (!mode) {
  fail("Use --seed or --verify.");
}

const connectionString =
  normalizeString(
    process.env.DATABASE_URL,
  );

const fixtureId =
  normalizeString(
    process.env
      .NEXUS_BACKUP_FIXTURE_ID,
  );

if (!connectionString) {
  fail("DATABASE_URL is required.");
}

if (
  !/^[a-z0-9]{12,32}$/.test(
    fixtureId,
  )
) {
  fail(
    "NEXUS_BACKUP_FIXTURE_ID must contain 12-32 lowercase letters or numbers.",
  );
}

const sslRequired =
  normalizeString(
    process.env
      .NEXUS_DATABASE_SSL_MODE,
  ).toLowerCase() !== "disable";

const pool =
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    ssl: sslRequired
      ? {
          rejectUnauthorized: false,
        }
      : false,
  });

const tenantId =
  `tenant-backup-${fixtureId}`;

const ownerId =
  `owner-backup-${fixtureId}`;

const authorityEpoch =
  `authority-epoch-${fixtureId}`;

const nonce =
  `nonce-backup-${fixtureId}-0001`;

const requestId =
  `request-backup-${fixtureId}`;

const pathname =
  "/api/nexus/controlled-action-review-console";

const bodySha256 =
  "d".repeat(64);

const consumedAtMs =
  1783680000000;

const expiresAtMs =
  consumedAtMs + 300000;

const replayStore =
  new PostgresProtectedApiReplayStore({
    pool,
  });

const authorizationStore =
  new PostgresProtectedApiTenantAuthorizationStore({
    pool,
  });

let report;
let exitCode = 0;

try {
  const migrationStatus =
    await inspectPostgresMigrationStatus({
      client: pool,
    });

  if (mode === "seed") {
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
          VALUES (
            $1,
            $2,
            'ACTIVE'
          )
        `,
        [
          tenantId,
          "NEXUS Day 674 Backup Fixture",
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

      await client.query("COMMIT");
    } catch (error) {
      try {
        await client.query(
          "ROLLBACK",
        );
      } catch {
        // Original seed failure remains authoritative.
      }

      throw error;
    } finally {
      client.release();
    }

    const nonceConsumption =
      await replayStore.consumeNonce({
        tenantId,
        ownerId,
        nonce,
        requestId,
        pathname,
        bodySha256,
        nowMs:
          consumedAtMs,
        expiresAtMs,
      });

    const authorization =
      await authorizationStore.authorizeOwner({
        tenantId,
        ownerId,
      });

    const passed =
      migrationStatus.state ===
        "MIGRATIONS_CURRENT" &&
      nonceConsumption.ok === true &&
      nonceConsumption.consumed ===
        true &&
      authorization.ok === true &&
      authorization.allowed ===
        true &&
      authorization.membership
        ?.authorityEpoch ===
        authorityEpoch;

    report = {
      schemaVersion:
        "nexus.local-postgres-backup-seed.v1",
      mode: "SEED",
      passed,
      fixture: {
        tenantId,
        ownerId,
        authorityEpoch,
        requestId,
      },
      migrationState:
        migrationStatus.state,
      nonceConsumed:
        nonceConsumption.consumed,
      tenantOwnerAuthorized:
        authorization.allowed,
      productionDatabaseModified:
        false,
      executionAuthorized:
        false,
      providerInvocationPerformed:
        false,
    };

    exitCode =
      passed ? 0 : 1;
  } else {
    const migrationReadiness =
      await inspectPostgresMigrationStatus({
        client: pool,
      });

    const replayReadiness =
      await replayStore.checkReadiness();

    const authorizationReadiness =
      await authorizationStore.checkReadiness();

    const authorization =
      await authorizationStore.authorizeOwner({
        tenantId,
        ownerId,
      });

    const replayAttempt =
      await replayStore.consumeNonce({
        tenantId,
        ownerId,
        nonce,
        requestId:
          `${requestId}-replayed`,
        pathname,
        bodySha256,
        nowMs:
          consumedAtMs,
        expiresAtMs,
      });

    const rowCounts =
      await pool.query(
        `
          SELECT
            (
              SELECT COUNT(*)::INTEGER
              FROM nexus_tenant
              WHERE tenant_id = $1
            ) AS tenant_count,

            (
              SELECT COUNT(*)::INTEGER
              FROM nexus_owner_identity
              WHERE owner_id = $2
            ) AS owner_count,

            (
              SELECT COUNT(*)::INTEGER
              FROM nexus_tenant_owner_membership
              WHERE tenant_id = $1
                AND owner_id = $2
            ) AS membership_count,

            (
              SELECT COUNT(*)::INTEGER
              FROM nexus_protected_api_nonce
              WHERE tenant_id = $1
                AND owner_id = $2
            ) AS nonce_count,

            (
              SELECT COUNT(*)::INTEGER
              FROM nexus_schema_migration
            ) AS migration_count
        `,
        [
          tenantId,
          ownerId,
        ],
      );

    const counts =
      rowCounts.rows?.[0] ?? {};

    const controls = [
      {
        id:
          "RESTORED_MIGRATION_LEDGER_CURRENT",
        passed:
          migrationReadiness.state ===
            "MIGRATIONS_CURRENT" &&
          migrationReadiness
            .pendingMigrationCount ===
            0 &&
          migrationReadiness
            .driftCount === 0,
      },
      {
        id:
          "RESTORED_REPLAY_LEDGER_READY",
        passed:
          replayReadiness.ready ===
          true,
      },
      {
        id:
          "RESTORED_AUTHORIZATION_TABLES_READY",
        passed:
          authorizationReadiness.ready ===
          true,
      },
      {
        id:
          "RESTORED_TENANT_OWNER_AUTHORIZED",
        passed:
          authorization.ok === true &&
          authorization.allowed ===
            true &&
          authorization.membership
            ?.tenantId === tenantId &&
          authorization.membership
            ?.ownerId === ownerId &&
          authorization.membership
            ?.authorityEpoch ===
            authorityEpoch,
      },
      {
        id:
          "RESTORED_NONCE_REPLAY_BLOCKED",
        passed:
          replayAttempt.ok === true &&
          replayAttempt.consumed ===
            false,
      },
      {
        id:
          "RESTORED_TENANT_ROW_EXACT",
        passed:
          counts.tenant_count === 1,
      },
      {
        id:
          "RESTORED_OWNER_ROW_EXACT",
        passed:
          counts.owner_count === 1,
      },
      {
        id:
          "RESTORED_MEMBERSHIP_ROW_EXACT",
        passed:
          counts.membership_count ===
          1,
      },
      {
        id:
          "RESTORED_NONCE_ROW_EXACT",
        passed:
          counts.nonce_count === 1,
      },
      {
        id:
          "RESTORED_MIGRATION_ROWS_EXACT",
        passed:
          counts.migration_count === 2,
      },
    ];

    const passed =
      controls.every(
        (control) =>
          control.passed,
      );

    report = {
      schemaVersion:
        "nexus.local-postgres-backup-restore-verification.v1",
      mode: "VERIFY_RESTORED_DATABASE",
      passed,
      backupSha256:
        normalizeString(
          process.env
            .NEXUS_BACKUP_SHA256,
        ) || null,
      migrationState:
        migrationReadiness.state,
      replayReadiness:
        replayReadiness.state,
      authorizationReadiness:
        authorizationReadiness.state,
      restoredCounts: counts,
      controls,
      realBackupRestored:
        true,
      replayContinuityVerified:
        replayAttempt.consumed ===
        false,
      tenantAuthorizationRecovered:
        authorization.allowed ===
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

    exitCode =
      passed ? 0 : 1;
  }
} catch (error) {
  report = {
    schemaVersion:
      "nexus.local-postgres-backup-restore-gate.v1",
    mode,
    passed: false,
    error:
      error instanceof Error
        ? error.message
        : String(error),
    productionDatabaseModified:
      false,
    executionAuthorized:
      false,
    providerInvocationPerformed:
      false,
  };

  exitCode = 1;
} finally {
  await pool.end();
}

console.log(
  JSON.stringify(
    report,
    null,
    2,
  ),
);

process.exit(exitCode);
