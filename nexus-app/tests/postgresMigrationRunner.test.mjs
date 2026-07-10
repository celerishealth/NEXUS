import assert from "node:assert/strict";
import test from "node:test";

import {
  NEXUS_MIGRATION_AUTHORIZATION,
  NEXUS_MIGRATION_LOCK_NAME,
  applyAuthorizedPostgresMigrations,
  createOfflineMigrationPlan,
  discoverPostgresMigrations,
  inspectPostgresMigrationStatus,
} from "../lib/nexus/postgresMigrationRunner.mjs";

function createFakeClient({
  applied = [],
  ledgerConflict = false,
  failMigrationVersion = null,
} = {}) {
  const queries = [];

  const ledger =
    new Map(
      applied.map(
        (item) => [
          item.version,
          {
            version:
              item.version,
            checksum_sha256:
              item.checksumSha256,
            execution_id:
              item.executionId ??
              "previous-execution",
            applied_at:
              "2026-07-10T10:00:00.000Z",
          },
        ],
      ),
    );

  return {
    queries,
    ledger,

    async query(
      sql,
      values = [],
    ) {
      const normalizedSql =
        String(sql)
          .replace(/\s+/g, " ")
          .trim();

      queries.push({
        sql: normalizedSql,
        values,
      });

      if (
        normalizedSql.includes(
          "SELECT version, checksum_sha256",
        )
      ) {
        return {
          rowCount:
            ledger.size,
          rows:
            [...ledger.values()],
        };
      }

      if (
        normalizedSql.includes(
          "INSERT INTO nexus_schema_migration",
        )
      ) {
        const [
          version,
          checksumSha256,
          executionId,
        ] = values;

        if (
          ledgerConflict ||
          ledger.has(version)
        ) {
          return {
            rowCount: 0,
            rows: [],
          };
        }

        ledger.set(
          version,
          {
            version,
            checksum_sha256:
              checksumSha256,
            execution_id:
              executionId,
            applied_at:
              "2026-07-10T10:00:00.000Z",
          },
        );

        return {
          rowCount: 1,
          rows: [
            { version },
          ],
        };
      }

      if (
        failMigrationVersion &&
        normalizedSql.includes(
          failMigrationVersion,
        )
      ) {
        throw new Error(
          "Simulated migration failure.",
        );
      }

      return {
        rowCount: 0,
        rows: [],
      };
    },
  };
}

test(
  "discovers the two security migrations in deterministic order",
  () => {
    const migrations =
      discoverPostgresMigrations();

    assert.equal(
      migrations.length,
      4,
    );

    assert.deepEqual(
      migrations.map(
        (item) =>
          item.version,
      ),
      [
        "0001_nexus_protected_api_nonce",
        "0002_nexus_tenant_owner_membership",
        "0003_nexus_rate_limit_security_event",
        "0004_nexus_operational_circuit_breaker",
      ],
    );

    for (
      const migration
      of migrations
    ) {
      assert.match(
        migration.checksumSha256,
        /^[a-f0-9]{64}$/,
      );
    }
  },
);

test(
  "creates an offline non-mutating migration plan",
  () => {
    const plan =
      createOfflineMigrationPlan();

    assert.equal(
      plan.mode,
      "OFFLINE_PLAN_ONLY",
    );

    assert.equal(
      plan.migrationCount,
      4,
    );

    assert.equal(
      plan.databaseMutationPerformed,
      false,
    );

    assert.equal(
      plan.liveMigrationPerformed,
      false,
    );
  },
);

test(
  "rejects migration application without explicit authorization",
  async () => {
    const client =
      createFakeClient();

    await assert.rejects(
      () =>
        applyAuthorizedPostgresMigrations({
          client,
          authorization: "",
        }),
      /Explicit NEXUS migration authorization is required/,
    );

    assert.equal(
      client.queries.length,
      0,
    );
  },
);

test(
  "applies pending migrations inside one locked transaction",
  async () => {
    const client =
      createFakeClient();

    const result =
      await applyAuthorizedPostgresMigrations({
        client,
        authorization:
          NEXUS_MIGRATION_AUTHORIZATION,
        executionId:
          "execution-day-672",
      });

    assert.equal(
      result.state,
      "MIGRATIONS_APPLIED",
    );

    assert.equal(
      result.appliedMigrationCount,
      4,
    );

    assert.equal(
      result.transactionCommitted,
      true,
    );

    assert.equal(
      result.advisoryLockUsed,
      true,
    );

    assert.equal(
      client.queries[0].sql,
      "BEGIN",
    );

    assert.ok(
      client.queries.some(
        (query) =>
          query.sql.includes(
            "pg_advisory_xact_lock",
          ) &&
          query.values[0] ===
            NEXUS_MIGRATION_LOCK_NAME,
      ),
    );

    assert.equal(
      client.queries.at(-1).sql,
      "COMMIT",
    );

    assert.equal(
      client.ledger.size,
      4,
    );
  },
);

test(
  "does not reapply migrations whose checksums match",
  async () => {
    const migrations =
      discoverPostgresMigrations();

    const client =
      createFakeClient({
        applied:
          migrations.map(
            (migration) => ({
              version:
                migration.version,
              checksumSha256:
                migration.checksumSha256,
            }),
          ),
      });

    const result =
      await applyAuthorizedPostgresMigrations({
        client,
        authorization:
          NEXUS_MIGRATION_AUTHORIZATION,
        executionId:
          "execution-current-672",
      });

    assert.equal(
      result.state,
      "MIGRATIONS_ALREADY_CURRENT",
    );

    assert.equal(
      result.appliedMigrationCount,
      0,
    );

    assert.equal(
      result.previouslyAppliedCount,
      4,
    );
  },
);

test(
  "detects checksum drift and rolls back",
  async () => {
    const migrations =
      discoverPostgresMigrations();

    const client =
      createFakeClient({
        applied: [
          {
            version:
              migrations[0].version,
            checksumSha256:
              "0".repeat(64),
          },
        ],
      });

    await assert.rejects(
      () =>
        applyAuthorizedPostgresMigrations({
          client,
          authorization:
            NEXUS_MIGRATION_AUTHORIZATION,
          executionId:
            "execution-drift-672",
        }),
      /Migration checksum drift detected/,
    );

    assert.equal(
      client.queries.at(-1).sql,
      "ROLLBACK",
    );
  },
);

test(
  "rolls back the transaction when a migration fails",
  async () => {
    const client =
      createFakeClient({
        failMigrationVersion:
          "CREATE TABLE IF NOT EXISTS nexus_tenant",
      });

    await assert.rejects(
      () =>
        applyAuthorizedPostgresMigrations({
          client,
          authorization:
            NEXUS_MIGRATION_AUTHORIZATION,
          executionId:
            "execution-failure-672",
        }),
      /Simulated migration failure/,
    );

    assert.equal(
      client.queries.at(-1).sql,
      "ROLLBACK",
    );
  },
);

test(
  "reports pending migration status without applying migrations",
  async () => {
    const client =
      createFakeClient();

    const status =
      await inspectPostgresMigrationStatus({
        client,
      });

    assert.equal(
      status.state,
      "MIGRATIONS_PENDING",
    );

    assert.equal(
      status.pendingMigrationCount,
      4,
    );

    assert.equal(
      status.databaseMutationPerformed,
      false,
    );

    assert.equal(
      status.liveMigrationPerformed,
      false,
    );
  },
);


