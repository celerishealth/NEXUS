import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(testDirectory, "..");

const gatePath = path.join(
  appRoot,
  "supabase",
  "tests",
  "applied_catalog_security_gate.sql",
);

const workflowCandidates = [
  path.resolve(
    appRoot,
    "..",
    ".github",
    "workflows",
    "supabase-remote-catalog-verification.yml",
  ),
  path.resolve(
    appRoot,
    ".github",
    "workflows",
    "supabase-remote-catalog-verification.yml",
  ),
];

const workflowPath = workflowCandidates.find((candidate) =>
  fs.existsSync(candidate),
);

assert.ok(workflowPath, "Remote catalog verification workflow must exist.");

const gateSql = fs.readFileSync(gatePath, "utf8").replace(/\r\n/g, "\n").trim();
const workflow = fs
  .readFileSync(workflowPath, "utf8")
  .replace(/\r\n/g, "\n");

test("applied catalog gate executes inside an explicit read-only transaction", () => {
  assert.match(gateSql, /^START TRANSACTION READ ONLY;/i);

  assert.match(
    gateSql,
    /current_setting\('transaction_read_only'\)\s*<>\s*'on'/i,
  );

  assert.match(gateSql, /ROLLBACK;\s*$/i);
  assert.doesNotMatch(gateSql, /\bCOMMIT\s*;/i);
});

test("remote workflow verifies the applied database without migration execution", () => {
  assert.match(
    workflow,
    /name:\s*Supabase Remote Catalog Verification/i,
  );

  assert.match(
    workflow,
    /VERIFY APPLIED NEXUS CATALOG/,
  );

  assert.match(
    workflow,
    /supabase migration list --linked/,
  );

  assert.match(
    workflow,
    /supabase db query --linked --file supabase\/tests\/applied_catalog_security_gate\.sql/,
  );

  assert.doesNotMatch(workflow, /\bsupabase\s+db\s+push\b/i);
  assert.doesNotMatch(workflow, /\bsupabase\s+db\s+reset\b/i);
  assert.doesNotMatch(workflow, /\bsupabase\s+migration\s+repair\b/i);
  assert.doesNotMatch(workflow, /\bsupabase\s+migration\s+up\b/i);
  assert.doesNotMatch(workflow, /\bPGOPTIONS\b/i);

  const remoteQueryCommands =
    workflow.match(/\bsupabase\s+db\s+query\b/gi) ?? [];

  assert.equal(
    remoteQueryCommands.length,
    1,
    "Exactly one remote catalog query command is allowed.",
  );
});
