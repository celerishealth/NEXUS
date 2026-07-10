import pg from "pg";

import {
  NEXUS_MIGRATION_AUTHORIZATION,
  applyAuthorizedPostgresMigrations,
  createOfflineMigrationPlan,
  discoverPostgresMigrations,
  inspectPostgresMigrationStatus,
} from "../lib/nexus/postgresMigrationRunner.mjs";

const { Pool } = pg;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function createPool() {
  const connectionString =
    normalizeString(
      process.env.DATABASE_URL,
    );

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required for --status or --apply.",
    );
  }

  const sslRequired =
    normalizeString(
      process.env.NEXUS_DATABASE_SSL_MODE,
    ).toLowerCase() !== "disable";

  return new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    ssl: sslRequired
      ? {
          rejectUnauthorized: false,
        }
      : false,
  });
}

const mode =
  process.argv.includes("--apply")
    ? "apply"
    : process.argv.includes("--status")
      ? "status"
      : "plan";

const migrations =
  discoverPostgresMigrations();

if (mode === "plan") {
  console.log(
    JSON.stringify(
      createOfflineMigrationPlan({
        migrations,
      }),
      null,
      2,
    ),
  );

  process.exit(0);
}

const pool = createPool();
const client =
  await pool.connect();

try {
  if (mode === "status") {
    const status =
      await inspectPostgresMigrationStatus({
        client,
        migrations,
      });

    console.log(
      JSON.stringify(
        status,
        null,
        2,
      ),
    );

    process.exitCode =
      status.driftCount > 0
        ? 1
        : 0;
  } else {
    const authorization =
      normalizeString(
        process.env
          .NEXUS_MIGRATION_AUTHORIZATION,
      );

    if (
      authorization !==
      NEXUS_MIGRATION_AUTHORIZATION
    ) {
      throw new Error(
        "Set NEXUS_MIGRATION_AUTHORIZATION=APPLY_NEXUS_SECURITY_MIGRATIONS before using --apply.",
      );
    }

    const result =
      await applyAuthorizedPostgresMigrations({
        client,
        authorization,
        migrations,
      });

    console.log(
      JSON.stringify(
        result,
        null,
        2,
      ),
    );
  }
} finally {
  client.release();
  await pool.end();
}
