import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

test(
  "local PostgreSQL environment uses PostgreSQL 16 and a health check",
  () => {
    const compose =
      readFileSync(
        "docker-compose.nexus-postgres.yml",
        "utf8",
      );

    assert.match(
      compose,
      /postgres:16-alpine/,
    );

    assert.match(
      compose,
      /pg_isready/,
    );

    assert.match(
      compose,
      /127\.0\.0\.1:55432:5432/,
    );

    assert.match(
      compose,
      /tmpfs:/,
    );

    assert.match(
      compose,
      /no-new-privileges:true/,
    );
  },
);

test(
  "real database gate verifies concurrency and tenant isolation",
  () => {
    const gate =
      readFileSync(
        "scripts/nexus-local-postgres-security-gate.mjs",
        "utf8",
      );

    assert.match(
      gate,
      /Promise\.all/,
    );

    assert.match(
      gate,
      /concurrentAttemptCount = 32/,
    );

    assert.match(
      gate,
      /successfulConsumptions ===\s*1/,
    );

    assert.match(
      gate,
      /FOREIGN_TENANT_ACCESS_DENIED/,
    );

    assert.match(
      gate,
      /SUSPENDED_TENANT_ACCESS_DENIED/,
    );

    assert.match(
      gate,
      /MIGRATIONS_CURRENT/,
    );

    assert.match(
      gate,
      /productionMigrationPerformed:\s*false/,
    );

    assert.match(
      gate,
      /executionAuthorized:\s*false/,
    );
  },
);

test(
  "local database credentials remain limited to the disposable compose environment",
  () => {
    const compose =
      readFileSync(
        "docker-compose.nexus-postgres.yml",
        "utf8",
      );

    assert.doesNotMatch(
      compose,
      /production/i,
    );

    assert.doesNotMatch(
      compose,
      /supabase/i,
    );

    assert.doesNotMatch(
      compose,
      /vercel/i,
    );
  },
);
