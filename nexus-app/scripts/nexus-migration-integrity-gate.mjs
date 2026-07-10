import {
  existsSync,
  readFileSync,
} from "node:fs";

import {
  createOfflineMigrationPlan,
  discoverPostgresMigrations,
} from "../lib/nexus/postgresMigrationRunner.mjs";

const requiredFiles = [
  "db/migrations/0001_nexus_protected_api_nonce.sql",
  "db/migrations/0002_nexus_tenant_owner_membership.sql",
  "db/migrations/0003_nexus_rate_limit_security_event.sql",
  "db/migrations/0004_nexus_operational_circuit_breaker.sql",
  "db/migrations/0005_nexus_controlled_action_state.sql",
  "lib/nexus/postgresMigrationRunner.mjs",
  "scripts/nexus-postgres-migrate.mjs",
];

const missingFiles =
  requiredFiles.filter(
    (file) =>
      !existsSync(file),
  );

const unsafePatterns = [
  {
    code: "DROP_DATABASE",
    pattern:
      /\bDROP\s+DATABASE\b/i,
  },
  {
    code: "DROP_SCHEMA",
    pattern:
      /\bDROP\s+SCHEMA\b/i,
  },
  {
    code: "TRUNCATE",
    pattern:
      /\bTRUNCATE\b/i,
  },
  {
    code: "DELETE_WITHOUT_WHERE",
    pattern:
      /\bDELETE\s+FROM\s+[A-Za-z0-9_.]+\s*;/i,
  },
];

const unsafeFindings = [];

let plan = null;

if (missingFiles.length === 0) {
  const migrations =
    discoverPostgresMigrations();

  plan =
    createOfflineMigrationPlan({
      migrations,
    });

  for (const migration of migrations) {
    for (
      const unsafePattern
      of unsafePatterns
    ) {
      if (
        unsafePattern.pattern.test(
          migration.sql,
        )
      ) {
        unsafeFindings.push({
          version:
            migration.version,
          code:
            unsafePattern.code,
        });
      }
    }
  }

  const runner =
    readFileSync(
      "lib/nexus/postgresMigrationRunner.mjs",
      "utf8",
    );

  const requiredControls = [
    "BEGIN",
    "COMMIT",
    "ROLLBACK",
    "pg_advisory_xact_lock",
    "checksumSha256",
    "Migration checksum drift detected",
    "NEXUS_MIGRATION_AUTHORIZATION",
  ];

  for (
    const control
    of requiredControls
  ) {
    if (
      !runner.includes(control)
    ) {
      unsafeFindings.push({
        version:
          "MIGRATION_RUNNER",
        code:
          `MISSING_CONTROL_${control}`,
      });
    }
  }
}

const passed =
  missingFiles.length === 0 &&
  unsafeFindings.length === 0 &&
  plan?.migrationCount === 5;

const report = {
  schemaVersion:
    "nexus.postgres-migration-integrity-gate.v1",
  passed,
  missingFiles,
  unsafeFindings,
  migrationPlan: plan,
  liveMigrationPerformed:
    false,
};

console.log(
  JSON.stringify(
    report,
    null,
    2,
  ),
);

if (!passed) {
  process.exit(1);
}



