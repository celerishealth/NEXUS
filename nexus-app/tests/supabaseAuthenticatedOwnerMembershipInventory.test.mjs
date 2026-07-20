import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const appRoot = resolve(dirname(currentFile), "..");
const repositoryRoot = resolve(appRoot, "..");

const workflowPath = resolve(
  repositoryRoot,
  ".github",
  "workflows",
  "supabase-authenticated-owner-membership-inventory.yml",
);

const sqlPath = resolve(
  appRoot,
  "supabase",
  "tests",
  "authenticated_owner_membership_inventory.sql",
);

const workflow = readFileSync(workflowPath, "utf8");
const sql = readFileSync(sqlPath, "utf8");

test("membership inventory SQL is counts-only and explicitly read-only", () => {
  assert.match(
    sql,
    /^\s*START TRANSACTION READ ONLY;/,
  );

  assert.match(
    sql,
    /ROLLBACK;\s*$/,
  );

  for (const tableName of [
    "public.nexus_tenant",
    "public.nexus_owner_identity",
    "public.nexus_tenant_owner_membership",
    "public.nexus_authenticated_owner_credentials",
    "public.nexus_authenticated_owner_sessions",
  ]) {
    assert.match(
      sql,
      new RegExp(
        tableName.replaceAll(".", "\\."),
      ),
    );
  }

  assert.match(
    sql,
    /membership\.role = 'OWNER'/,
  );

  assert.match(
    sql,
    /membership\.status = 'ACTIVE'/,
  );

  assert.match(
    sql,
    /tenant\.status = 'ACTIVE'/,
  );

  assert.match(
    sql,
    /owner_identity\.status = 'ACTIVE'/,
  );

  assert.match(
    sql,
    /LENGTH\(TRIM\(membership\.authority_epoch\)\) > 0/,
  );

  assert.match(
    sql,
    /NEXUS_AUTHENTICATED_OWNER_MEMBERSHIP_INVENTORY=TENANTS:%s\/OWNERS:%s\/MEMBERSHIPS:%s\/ACTIVE_OWNER_MEMBERSHIPS:%s\/CREDENTIALS:%s\/SESSIONS:%s/,
  );

  assert.doesNotMatch(
    sql,
    /\b(?:INSERT|UPDATE|DELETE|TRUNCATE|DROP|ALTER|CREATE|GRANT|REVOKE)\b/i,
  );
});

test("membership inventory workflow requires exact owner confirmation", () => {
  assert.match(
    workflow,
    /Type VERIFY AUTHENTICATED OWNER MEMBERSHIP INVENTORY/,
  );

  assert.match(
    workflow,
    /\$\{\{\s*inputs\.confirmation\s*\}\}/,
  );

  assert.match(
    workflow,
    /OWNER_CONFIRMATION}" != "VERIFY AUTHENTICATED OWNER MEMBERSHIP INVENTORY"/,
  );

  assert.match(
    workflow,
    /permissions:\s*\n\s*contents: read/,
  );

  assert.match(
    workflow,
    /cancel-in-progress: false/,
  );
});

test("membership inventory workflow protects database credentials", () => {
  assert.match(
    workflow,
    /echo "::add-mask::\$\{SUPABASE_ACCESS_TOKEN\}"/,
  );

  assert.match(
    workflow,
    /echo "::add-mask::\$\{SUPABASE_DB_PASSWORD\}"/,
  );

  assert.match(
    workflow,
    /set \+x/,
  );

  assert.doesNotMatch(
    workflow,
    /\becho\s+"\$\{SUPABASE_DB_PASSWORD\}"/,
  );

  assert.doesNotMatch(
    workflow,
    /\becho\s+"\$\{SUPABASE_ACCESS_TOKEN\}"/,
  );
});

test("membership inventory workflow executes one read-only SQL file", () => {
  assert.match(
    workflow,
    /supabase\/tests\/authenticated_owner_membership_inventory\.sql/,
  );

  assert.equal(
    (
      workflow.match(
        /--file supabase\/tests\/authenticated_owner_membership_inventory\.sql/g,
      ) ?? []
    ).length,
    1,
  );

  assert.match(
    workflow,
    /psql -X -A -t -v ON_ERROR_STOP=1/,
  );

  assert.match(
    workflow,
    /PGSSLMODE=require/,
  );

  assert.match(
    workflow,
    /AUTHENTICATED OWNER REMOTE MEMBERSHIP INVENTORY: PASS/,
  );

  assert.match(
    workflow,
    /\^NEXUS_AUTHENTICATED_OWNER_MEMBERSHIP_INVENTORY=TENANTS:\[0-9\]\+\/OWNERS:\[0-9\]\+\/MEMBERSHIPS:\[0-9\]\+\/ACTIVE_OWNER_MEMBERSHIPS:\[0-9\]\+\/CREDENTIALS:\[0-9\]\+\/SESSIONS:\[0-9\]\+\$/,
  );
});

test("membership inventory workflow cannot deploy or mutate schema", () => {
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
    /\bpsql\b[\s\S]*?\b(?:INSERT|UPDATE|DELETE|TRUNCATE|DROP|ALTER|CREATE|GRANT|REVOKE)\b/i,
  );

  assert.doesNotMatch(
    workflow,
    /credential activation/i,
  );
});
