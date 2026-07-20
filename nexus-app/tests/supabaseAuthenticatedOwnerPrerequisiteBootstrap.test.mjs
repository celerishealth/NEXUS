import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentFile =
  fileURLToPath(import.meta.url);

const appRoot =
  path.resolve(
    path.dirname(currentFile),
    "..",
  );

const repoRoot =
  path.resolve(
    appRoot,
    "..",
  );

const sqlPath =
  path.join(
    appRoot,
    "supabase",
    "operations",
    "authenticated_owner_prerequisite_bootstrap.sql",
  );

const workflowPath =
  path.join(
    repoRoot,
    ".github",
    "workflows",
    "supabase-authenticated-owner-prerequisite-bootstrap.yml",
  );

const sql =
  fs.readFileSync(
    sqlPath,
    "utf8",
  );

const workflow =
  fs.readFileSync(
    workflowPath,
    "utf8",
  );

test(
  "bootstrap SQL is transactional, bounded and fail-closed",
  () => {
    assert.match(
      sql,
      /^\\set ON_ERROR_STOP on$/m,
    );

    assert.match(
      sql,
      /^BEGIN;$/m,
    );

    assert.match(
      sql,
      /^COMMIT;\s*$/m,
    );

    assert.match(
      sql,
      /SET LOCAL lock_timeout = '10s'/,
    );

    assert.match(
      sql,
      /SET LOCAL statement_timeout = '30s'/,
    );

    assert.match(
      sql,
      /pg_advisory_xact_lock/,
    );
  },
);

test(
  "bootstrap SQL requires bounded owner-controlled values",
  () => {
    for (const marker of [
      "nexus.bootstrap.tenant_id",
      "nexus.bootstrap.tenant_display_name",
      "nexus.bootstrap.owner_id",
      "nexus.bootstrap.authority_epoch",
    ]) {
      assert.match(
        sql,
        new RegExp(
          marker.replaceAll(".", "\\."),
        ),
      );
    }

    assert.match(
      sql,
      /length\(v_tenant_id\) > 128/,
    );

    assert.match(
      sql,
      /length\(v_tenant_display_name\) > 200/,
    );

    assert.match(
      sql,
      /length\(v_owner_id\) > 128/,
    );

    assert.match(
      sql,
      /length\(v_authority_epoch\) > 128/,
    );

    assert.match(
      sql,
      /bootstrap input contract is invalid/,
    );
  },
);

test(
  "bootstrap SQL creates only the exact prerequisite chain",
  () => {
    assert.match(
      sql,
      /INSERT INTO public\.nexus_tenant \(/,
    );

    assert.match(
      sql,
      /INSERT INTO public\.nexus_owner_identity \(/,
    );

    assert.match(
      sql,
      /INSERT INTO public\.nexus_tenant_owner_membership \(/,
    );

    assert.equal(
      (
        sql.match(
          /ON CONFLICT[\s\S]*?DO NOTHING;/g,
        ) ?? []
      ).length,
      3,
    );

    assert.equal(
      (
        sql.match(
          /INSERT INTO/g,
        ) ?? []
      ).length,
      3,
    );
  },
);

test(
  "bootstrap SQL is idempotent and rejects conflicting state",
  () => {
    assert.match(
      sql,
      /tenant prerequisite conflicts with existing state/,
    );

    assert.match(
      sql,
      /owner prerequisite conflicts with existing state/,
    );

    assert.match(
      sql,
      /owner-membership prerequisite conflicts with existing state/,
    );

    assert.match(
      sql,
      /role = 'OWNER'/,
    );

    assert.match(
      sql,
      /status = 'ACTIVE'/,
    );

    assert.match(
      sql,
      /authority_epoch =/,
    );
  },
);

test(
  "bootstrap SQL cannot activate credentials or sessions",
  () => {
    assert.doesNotMatch(
      sql,
      /nexus_authenticated_owner_credentials/i,
    );

    assert.doesNotMatch(
      sql,
      /nexus_authenticated_owner_sessions/i,
    );

    assert.doesNotMatch(
      sql,
      /\b(?:password|email|session_token|session_digest)\b/i,
    );

    assert.doesNotMatch(
      sql,
      /\b(?:UPDATE|DELETE|TRUNCATE|DROP|ALTER|CREATE|GRANT|REVOKE)\b/i,
    );
  },
);

test(
  "bootstrap SQL emits only the exact counts marker",
  () => {
    assert.match(
      sql,
      /NEXUS_AUTHENTICATED_OWNER_PREREQUISITE_BOOTSTRAP=TENANT:%s\/OWNER:%s\/MEMBERSHIP:%s\/ACTIVE_OWNER_MEMBERSHIP:%s/,
    );

    assert.doesNotMatch(
      sql,
      /SELECT\s+(?:v_)?tenant_id\b/i,
    );

    assert.doesNotMatch(
      sql,
      /SELECT\s+(?:v_)?owner_id\b/i,
    );
  },
);

test(
  "workflow requires exact owner authorization and protected secrets",
  () => {
    const confirmation =
      "APPLY AUTHENTICATED OWNER PREREQUISITE BOOTSTRAP";

    assert.ok(
      workflow.split(confirmation).length - 1 >= 2,
    );

    assert.match(
      workflow,
      /permissions:\s*\n\s*contents: read/,
    );

    for (const secretName of [
      "NEXUS_BOOTSTRAP_TENANT_ID",
      "NEXUS_BOOTSTRAP_TENANT_DISPLAY_NAME",
      "NEXUS_BOOTSTRAP_OWNER_ID",
      "NEXUS_BOOTSTRAP_AUTHORITY_EPOCH",
    ]) {
      assert.match(
        workflow,
        new RegExp(secretName),
      );
    }

    assert.doesNotMatch(
      workflow,
      /^\s{6}(?:tenant_id|owner_id|authority_epoch):\s*$/im,
    );
  },
);

test(
  "workflow executes one bounded bootstrap and suppresses raw failures",
  () => {
    assert.equal(
      (
        workflow.match(
          /--file supabase\/operations\/authenticated_owner_prerequisite_bootstrap\.sql/g,
        ) ?? []
      ).length,
      1,
    );

    assert.match(
      workflow,
      /Raw database output was suppressed/,
    );

    assert.match(
      workflow,
      /NEXUS_AUTHENTICATED_OWNER_PREREQUISITE_BOOTSTRAP=TENANT:1\/OWNER:1\/MEMBERSHIP:1\/ACTIVE_OWNER_MEMBERSHIP:1/,
    );

    assert.match(
      workflow,
      /BOOTSTRAP COMMIT: \$\{GITHUB_SHA\}/,
    );

    assert.match(
      workflow,
      /timeout-minutes: 10/,
    );
  },
);

test(
  "workflow cannot deploy schema or activate credentials",
  () => {
    assert.doesNotMatch(
      workflow,
      /supabase\s+db\s+(?:push|reset|repair|diff|dump)/i,
    );

    assert.doesNotMatch(
      workflow,
      /supabase\s+migration\s+(?:up|repair|new)/i,
    );

    assert.doesNotMatch(
      workflow,
      /credential\/activate|session\/route|password_hash_hex|password_salt_hex/i,
    );

    assert.doesNotMatch(
      workflow,
      /\bpsql\b[\s\S]*?\b(?:UPDATE|DELETE|TRUNCATE|DROP|ALTER|CREATE|GRANT|REVOKE)\b/i,
    );
  },
);
