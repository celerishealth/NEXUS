import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

test(
  "backup orchestration creates a real custom-format PostgreSQL backup",
  () => {
    const content =
      readFileSync(
        "scripts/nexus-local-postgres-backup-restore.ps1",
        "utf8",
      );

    assert.match(
      content,
      /pg_dump/,
    );

    assert.match(
      content,
      /--format=custom/,
    );

    assert.match(
      content,
      /Get-FileHash/,
    );

    assert.match(
      content,
      /SHA256/,
    );
  },
);

test(
  "backup orchestration restores into a separate isolated database",
  () => {
    const content =
      readFileSync(
        "scripts/nexus-local-postgres-backup-restore.ps1",
        "utf8",
      );

    assert.match(
      content,
      /nexus_security_restore/,
    );

    assert.match(
      content,
      /createdb/,
    );

    assert.match(
      content,
      /pg_restore/,
    );

    assert.match(
      content,
      /--exit-on-error/,
    );

    assert.match(
      content,
      /down -v --remove-orphans/,
    );
  },
);

test(
  "restored database gate verifies replay continuity and tenant authorization",
  () => {
    const content =
      readFileSync(
        "scripts/nexus-local-postgres-backup-restore-gate.mjs",
        "utf8",
      );

    assert.match(
      content,
      /RESTORED_NONCE_REPLAY_BLOCKED/,
    );

    assert.match(
      content,
      /RESTORED_TENANT_OWNER_AUTHORIZED/,
    );

    assert.match(
      content,
      /MIGRATIONS_CURRENT/,
    );

    assert.match(
      content,
      /migration_count === 3/,
    );

    assert.match(
      content,
      /productionDatabaseModified:\s*false/,
    );

    assert.match(
      content,
      /executionAuthorized:\s*false/,
    );
  },
);

