import {
  createHash,
  randomUUID,
} from "node:crypto";

import {
  existsSync,
  readFileSync,
  readdirSync,
} from "node:fs";

import {
  basename,
  join,
  resolve,
} from "node:path";

export const NEXUS_MIGRATION_AUTHORIZATION =
  "APPLY_NEXUS_SECURITY_MIGRATIONS";

export const NEXUS_MIGRATION_LOCK_NAME =
  "nexus-schema-migration-v1";

const MIGRATION_NAME_PATTERN =
  /^(\d{4})_([a-z0-9_]+)\.sql$/;

const LEDGER_DDL = `
  CREATE TABLE IF NOT EXISTS nexus_schema_migration (
    version VARCHAR(128) PRIMARY KEY,
    checksum_sha256 CHAR(64) NOT NULL,
    execution_id VARCHAR(128) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_schema_migration_checksum_check
      CHECK (
        checksum_sha256 ~ '^[a-f0-9]{64}$'
      )
  )
`;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function sha256(value) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function normalizeSql(sql) {
  return String(sql ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n");
}

export function discoverPostgresMigrations({
  directory =
    resolve("db", "migrations"),
} = {}) {
  if (!existsSync(directory)) {
    throw new Error(
      `Migration directory does not exist: ${directory}`,
    );
  }

  const migrations =
    readdirSync(directory, {
      withFileTypes: true,
    })
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith(".sql"),
      )
      .map((entry) => {
        const match =
          entry.name.match(
            MIGRATION_NAME_PATTERN,
          );

        if (!match) {
          throw new Error(
            `Invalid migration filename: ${entry.name}`,
          );
        }

        const filePath =
          join(directory, entry.name);

        const sql =
          normalizeSql(
            readFileSync(
              filePath,
              "utf8",
            ),
          );

        if (!sql.trim()) {
          throw new Error(
            `Migration is empty: ${entry.name}`,
          );
        }

        return Object.freeze({
          version:
            entry.name.replace(
              /\.sql$/,
              "",
            ),
          sequence:
            Number(match[1]),
          name: match[2],
          filename:
            basename(filePath),
          filePath,
          sql,
          checksumSha256:
            sha256(sql),
        });
      })
      .sort(
        (left, right) =>
          left.sequence -
            right.sequence ||
          left.filename.localeCompare(
            right.filename,
          ),
      );

  if (migrations.length === 0) {
    throw new Error(
      "No PostgreSQL migrations were found.",
    );
  }

  const versions =
    new Set();

  const sequences =
    new Set();

  for (const migration of migrations) {
    if (
      versions.has(
        migration.version,
      )
    ) {
      throw new Error(
        `Duplicate migration version: ${migration.version}`,
      );
    }

    if (
      sequences.has(
        migration.sequence,
      )
    ) {
      throw new Error(
        `Duplicate migration sequence: ${migration.sequence}`,
      );
    }

    versions.add(
      migration.version,
    );

    sequences.add(
      migration.sequence,
    );
  }

  return Object.freeze(
    migrations,
  );
}

export function createOfflineMigrationPlan({
  migrations =
    discoverPostgresMigrations(),
} = {}) {
  return Object.freeze({
    schemaVersion:
      "nexus.postgres-migration-plan.v1",
    mode: "OFFLINE_PLAN_ONLY",
    migrationCount:
      migrations.length,
    migrations: Object.freeze(
      migrations.map(
        (migration) =>
          Object.freeze({
            version:
              migration.version,
            sequence:
              migration.sequence,
            filename:
              migration.filename,
            checksumSha256:
              migration.checksumSha256,
          }),
      ),
    ),
    databaseMutationPerformed:
      false,
    liveMigrationPerformed:
      false,
  });
}

async function readAppliedMigrations(
  client,
) {
  const result =
    await client.query(`
      SELECT
        version,
        checksum_sha256,
        execution_id,
        applied_at
      FROM nexus_schema_migration
      ORDER BY version ASC
    `);

  return new Map(
    (result.rows ?? []).map(
      (row) => [
        normalizeString(
          row.version,
        ),
        {
          checksumSha256:
            normalizeString(
              row.checksum_sha256,
            ).toLowerCase(),
          executionId:
            normalizeString(
              row.execution_id,
            ),
          appliedAt:
            row.applied_at ?? null,
        },
      ],
    ),
  );
}

function compareMigrationState({
  migrations,
  appliedMigrations,
}) {
  const pending = [];
  const applied = [];
  const drift = [];

  for (const migration of migrations) {
    const existing =
      appliedMigrations.get(
        migration.version,
      );

    if (!existing) {
      pending.push(migration);
      continue;
    }

    if (
      existing.checksumSha256 !==
      migration.checksumSha256
    ) {
      drift.push(
        Object.freeze({
          version:
            migration.version,
          expectedChecksum:
            existing.checksumSha256,
          currentChecksum:
            migration.checksumSha256,
        }),
      );

      continue;
    }

    applied.push(
      Object.freeze({
        ...migration,
        executionId:
          existing.executionId,
        appliedAt:
          existing.appliedAt,
      }),
    );
  }

  return Object.freeze({
    pending: Object.freeze(
      pending,
    ),
    applied: Object.freeze(
      applied,
    ),
    drift: Object.freeze(
      drift,
    ),
  });
}

export async function inspectPostgresMigrationStatus({
  client,
  migrations =
    discoverPostgresMigrations(),
} = {}) {
  if (
    !client ||
    typeof client.query !==
      "function"
  ) {
    throw new Error(
      "A PostgreSQL client is required.",
    );
  }

  await client.query(
    LEDGER_DDL,
  );

  const appliedMigrations =
    await readAppliedMigrations(
      client,
    );

  const comparison =
    compareMigrationState({
      migrations,
      appliedMigrations,
    });

  return Object.freeze({
    schemaVersion:
      "nexus.postgres-migration-status.v1",
    state:
      comparison.drift.length > 0
        ? "MIGRATION_DRIFT_DETECTED"
        : comparison.pending.length > 0
          ? "MIGRATIONS_PENDING"
          : "MIGRATIONS_CURRENT",
    totalMigrationCount:
      migrations.length,
    appliedMigrationCount:
      comparison.applied.length,
    pendingMigrationCount:
      comparison.pending.length,
    driftCount:
      comparison.drift.length,
    pendingVersions:
      Object.freeze(
        comparison.pending.map(
          (item) =>
            item.version,
        ),
      ),
    drift:
      comparison.drift,
    databaseMutationPerformed:
      false,
    liveMigrationPerformed:
      false,
  });
}

export async function applyAuthorizedPostgresMigrations({
  client,
  authorization,
  migrations =
    discoverPostgresMigrations(),
  executionId =
    `migration-${randomUUID()}`,
} = {}) {
  if (
    normalizeString(
      authorization,
    ) !==
    NEXUS_MIGRATION_AUTHORIZATION
  ) {
    throw new Error(
      "Explicit NEXUS migration authorization is required.",
    );
  }

  if (
    !client ||
    typeof client.query !==
      "function"
  ) {
    throw new Error(
      "A PostgreSQL client is required.",
    );
  }

  const normalizedExecutionId =
    normalizeString(
      executionId,
    );

  if (!normalizedExecutionId) {
    throw new Error(
      "A migration execution ID is required.",
    );
  }

  let transactionStarted =
    false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    await client.query(
      `
        SELECT pg_advisory_xact_lock(
          hashtext($1)
        )
      `,
      [
        NEXUS_MIGRATION_LOCK_NAME,
      ],
    );

    await client.query(
      LEDGER_DDL,
    );

    const appliedMigrations =
      await readAppliedMigrations(
        client,
      );

    const comparison =
      compareMigrationState({
        migrations,
        appliedMigrations,
      });

    if (
      comparison.drift.length > 0
    ) {
      const driftVersions =
        comparison.drift
          .map(
            (item) =>
              item.version,
          )
          .join(", ");

      throw new Error(
        `Migration checksum drift detected: ${driftVersions}`,
      );
    }

    const appliedNow = [];

    for (
      const migration
      of comparison.pending
    ) {
      await client.query(
        migration.sql,
      );

      const ledgerInsert =
        await client.query(
          `
            INSERT INTO nexus_schema_migration (
              version,
              checksum_sha256,
              execution_id
            )
            VALUES (
              $1,
              $2,
              $3
            )
            ON CONFLICT (version)
            DO NOTHING
            RETURNING version
          `,
          [
            migration.version,
            migration.checksumSha256,
            normalizedExecutionId,
          ],
        );

      if (
        ledgerInsert.rowCount !== 1
      ) {
        throw new Error(
          `Migration ledger conflict: ${migration.version}`,
        );
      }

      appliedNow.push(
        Object.freeze({
          version:
            migration.version,
          checksumSha256:
            migration.checksumSha256,
        }),
      );
    }

    await client.query("COMMIT");
    transactionStarted = false;

    return Object.freeze({
      schemaVersion:
        "nexus.postgres-migration-application.v1",
      state:
        appliedNow.length > 0
          ? "MIGRATIONS_APPLIED"
          : "MIGRATIONS_ALREADY_CURRENT",
      executionId:
        normalizedExecutionId,
      appliedMigrationCount:
        appliedNow.length,
      previouslyAppliedCount:
        comparison.applied.length,
      appliedMigrations:
        Object.freeze(
          appliedNow,
        ),
      driftDetected: false,
      transactionCommitted:
        true,
      advisoryLockUsed:
        true,
      executionAuthorized:
        false,
      providerInvocationPerformed:
        false,
      customerDataMutationPerformed:
        false,
    });
  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query(
          "ROLLBACK",
        );
      } catch {
        // Original migration failure remains authoritative.
      }
    }

    throw error;
  }
}

export function getPostgresMigrationRunnerPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.postgres-migration-runner-posture.v1",
    authorizationPhrase:
      NEXUS_MIGRATION_AUTHORIZATION,
    controls: Object.freeze([
      "EXPLICIT_APPLY_FLAG_REQUIRED",
      "EXPLICIT_AUTHORIZATION_PHRASE_REQUIRED",
      "POSTGRES_TRANSACTION_REQUIRED",
      "POSTGRES_ADVISORY_LOCK_REQUIRED",
      "SHA256_CHECKSUM_LEDGER",
      "MIGRATION_DRIFT_REJECTION",
      "ORDERED_MIGRATION_DISCOVERY",
      "DUPLICATE_SEQUENCE_REJECTION",
      "ROLLBACK_ON_FAILURE",
      "IDEMPOTENT_ALREADY_APPLIED_HANDLING",
    ]),
    migrationDirectory:
      "db/migrations",
    liveMigrationPerformed:
      false,
    customerDataMutationAuthorized:
      false,
    providerInvocationAuthorized:
      false,
  });
}
