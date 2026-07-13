import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(testDirectory, "..");

const sqlPath = path.join(
  appRoot,
  "supabase",
  "tests",
  "applied_runtime_interface_fingerprint.sql",
);

const workflowCandidates = [
  path.resolve(
    appRoot,
    "..",
    ".github",
    "workflows",
    "supabase-runtime-interface-verification.yml",
  ),
  path.resolve(
    appRoot,
    ".github",
    "workflows",
    "supabase-runtime-interface-verification.yml",
  ),
];

const workflowPath = workflowCandidates.find((candidate) =>
  fs.existsSync(candidate),
);

assert.ok(workflowPath, "Runtime interface verification workflow must exist.");
assert.ok(fs.existsSync(sqlPath), "Runtime interface fingerprint SQL must exist.");

const sql = fs.readFileSync(sqlPath, "utf8").replace(/\r\n/g, "\n").trim();
const workflow = fs
  .readFileSync(workflowPath, "utf8")
  .replace(/\r\n/g, "\n");

const expectedTables = [
  "nexus_controlled_customer_inquiries",
  "nexus_controlled_customer_recommendation_decisions",
  "nexus_controlled_customer_recommendations",
  "nexus_controlled_customer_sandbox_executions",
  "nexus_controlled_pilot_health_pause_events",
  "nexus_controlled_pilot_operation_states",
  "nexus_controlled_pilot_resume_audit_events",
  "nexus_controlled_pilot_resume_proof_consumptions",
  "nexus_provider_continuity_leases",
  "nexus_provider_continuity_records",
  "nexus_provider_continuity_scope_counters",
];

const expectedFunctions = [
  "nexus_acquire_provider_continuity_lease",
  "nexus_append_controlled_pilot_resume_audit_event",
  "nexus_commit_controlled_pilot_health_pause",
  "nexus_commit_controlled_pilot_resume",
  "nexus_commit_controlled_pilot_state_resume",
  "nexus_compare_and_swap_provider_continuity_record",
  "nexus_consume_controlled_pilot_resume_proof",
  "nexus_create_controlled_customer_inquiry",
  "nexus_create_sandbox_customer_recommendation",
  "nexus_decide_controlled_customer_recommendation",
  "nexus_execute_approved_customer_recommendation_sandbox",
  "nexus_get_provider_continuity_store_readiness",
  "nexus_list_active_provider_containments",
  "nexus_read_controlled_pilot_operation_state",
  "nexus_read_provider_continuity_record",
  "nexus_release_provider_continuity_lease",
];

test("runtime fingerprint is read-only, deterministic, and complete", () => {
  assert.match(sql, /^START TRANSACTION READ ONLY;/i);
  assert.match(
    sql,
    /current_setting\('transaction_read_only'\)\s*<>\s*'on'/i,
  );
  assert.match(sql, /string_agg\(line, E'\\n' ORDER BY line\)/i);
  assert.match(sql, /NEXUS_RUNTIME_INTERFACE_FINGERPRINT=/);
  assert.match(sql, /md5\(canonical_runtime_interface\.value\)/i);
  assert.match(sql, /ROLLBACK;\s*$/i);
  assert.doesNotMatch(sql, /\bCOMMIT\s*;/i);
  assert.doesNotMatch(
    sql,
    /\b(?:INSERT|UPDATE|DELETE|TRUNCATE|ALTER|DROP|CREATE)\b/i,
  );

  for (const tableName of expectedTables) {
    assert.match(
      sql,
      new RegExp(`\\('${tableName}'\\)`),
      `Missing protected table ${tableName}.`,
    );
  }

  for (const functionName of expectedFunctions) {
    assert.match(
      sql,
      new RegExp(`\\('${functionName}'\\)`),
      `Missing protected function ${functionName}.`,
    );
  }

  assert.equal(expectedTables.length, 11);
  assert.equal(expectedFunctions.length, 16);
});

test("workflow compares isolated and applied interfaces without production writes", () => {
  assert.match(workflow, /name:\s*Supabase Runtime Interface Verification/i);
  assert.match(workflow, /VERIFY NEXUS RUNTIME INTERFACE/);
  assert.match(workflow, /node-version:\s*22/);
  assert.match(workflow, /version:\s*2\.109\.1/);
  assert.match(
    workflow,
    /1c32e8c8c0214961f000f3db7e3bea7bc214b2f2b0a7d349079232c8e7d4942f/,
  );
  assert.match(workflow, /supabase db start/);
  assert.match(workflow, /supabase migration list --local/);
  assert.match(workflow, /supabase migration list --linked/);
  assert.match(
    workflow,
    /supabase db query --local[\s\\]*--file supabase\/tests\/applied_runtime_interface_fingerprint\.sql/,
  );
  assert.match(
    workflow,
    /supabase db query --linked[\s\\]*--file supabase\/tests\/applied_runtime_interface_fingerprint\.sql/,
  );
  assert.match(
    workflow,
    /NEXUS APPLIED RUNTIME INTERFACE PARITY: PASS/,
  );
  assert.match(workflow, /supabase stop --no-backup/);

  assert.doesNotMatch(workflow, /\bsupabase\s+db\s+push\b/i);
  assert.doesNotMatch(workflow, /\bsupabase\s+db\s+reset\b/i);
  assert.doesNotMatch(workflow, /\bsupabase\s+migration\s+repair\b/i);
  assert.doesNotMatch(workflow, /\bsupabase\s+migration\s+up\b/i);
  assert.doesNotMatch(workflow, /\bPGOPTIONS\b/i);

  const localQueries =
    workflow.match(/supabase\s+db\s+query\s+--local/gi) ?? [];
  const linkedQueries =
    workflow.match(/supabase\s+db\s+query\s+--linked/gi) ?? [];

  assert.equal(localQueries.length, 1);
  assert.equal(linkedQueries.length, 1);
});
