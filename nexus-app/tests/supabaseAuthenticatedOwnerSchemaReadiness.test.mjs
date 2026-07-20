import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory =
  path.dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );

const appRoot =
  path.resolve(
    testDirectory,
    "..",
  );

const sqlPath =
  path.join(
    appRoot,
    "supabase",
    "tests",
    "authenticated_owner_schema_readiness.sql",
  );

const workflowCandidates = [
  path.resolve(
    appRoot,
    "..",
    ".github",
    "workflows",
    "supabase-authenticated-owner-schema-readiness.yml",
  ),
  path.resolve(
    appRoot,
    ".github",
    "workflows",
    "supabase-authenticated-owner-schema-readiness.yml",
  ),
];

const workflowPath =
  workflowCandidates.find(
    (candidate) =>
      fs.existsSync(
        candidate,
      ),
  );

assert.ok(
  fs.existsSync(
    sqlPath,
  ),
  "Authenticated-owner schema readiness SQL must exist.",
);

assert.ok(
  workflowPath,
  "Authenticated-owner schema readiness workflow must exist.",
);

const sql =
  fs.readFileSync(
    sqlPath,
    "utf8",
  )
    .replace(
      /\r\n/g,
      "\n",
    )
    .trim();

const workflow =
  fs.readFileSync(
    workflowPath,
    "utf8",
  )
    .replace(
      /\r\n/g,
      "\n",
    );

test(
  "schema readiness SQL is explicitly read-only and reversible",
  () => {
    assert.match(
      sql,
      /^START TRANSACTION READ ONLY;/i,
    );

    assert.match(
      sql,
      /current_setting\('transaction_read_only'\)\s*<>\s*'on'/i,
    );

    assert.match(
      sql,
      /ROLLBACK;\s*$/i,
    );

    assert.doesNotMatch(
      sql,
      /\bCOMMIT\s*;/i,
    );

    assert.doesNotMatch(
      sql,
      /^\s*(INSERT|UPDATE|DELETE|ALTER|CREATE|DROP|TRUNCATE|GRANT|REVOKE)\b/im,
    );
  },
);

test(
  "schema readiness SQL verifies the exact authenticated-owner boundary",
  () => {
    assert.match(
      sql,
      /nexus_authenticated_owner_credentials/,
    );

    assert.match(
      sql,
      /nexus_authenticated_owner_sessions/,
    );

    assert.match(
      sql,
      /nexus_authenticated_owner_credentials_tenant_policy/,
    );

    assert.match(
      sql,
      /nexus_authenticated_owner_sessions_tenant_policy/,
    );

    assert.match(
      sql,
      /relrowsecurity/,
    );

    assert.match(
      sql,
      /relforcerowsecurity/,
    );

    assert.match(
      sql,
      /pg_catalog\.pg_policy/,
    );

    assert.match(
      sql,
      /pg_catalog\.pg_constraint/,
    );

    assert.match(
      sql,
      /pg_catalog\.pg_indexes/,
    );

    assert.match(
      sql,
      /password_hash_hex/,
    );

    assert.match(
      sql,
      /session_digest/,
    );

    assert.match(
      sql,
      /Unsafe plaintext credential or raw-token columns were found/,
    );

    assert.match(
      sql,
      /NEXUS_AUTHENTICATED_OWNER_SCHEMA_READINESS=2_TABLES\/2_POLICIES\/19_CONSTRAINTS\/3_INDEXES/,
    );
  },
);

test(
  "workflow requires explicit owner confirmation and executes one read-only probe",
  () => {
    assert.match(
      workflow,
      /name:\s*Supabase Authenticated Owner Schema Readiness/i,
    );

    assert.match(
      workflow,
      /VERIFY AUTHENTICATED OWNER SCHEMA READINESS/,
    );

    assert.match(
      workflow,
      /node --test tests\/supabaseAuthenticatedOwnerSchemaReadiness\.test\.mjs/,
    );

    assert.match(
      workflow,
      /supabase link --project-ref cvtjcysatndfzkszufen/,
    );

    assert.match(
      workflow,
      /supabase migration list --linked/,
    );

    assert.match(
      workflow,
      /PGPASSWORD="\$\{SUPABASE_DB_PASSWORD\}"/,
    );

    assert.match(
      workflow,
      /PGSSLMODE=require/,
    );

    assert.match(
      workflow,
      /PGCONNECT_TIMEOUT=20/,
    );

    assert.match(
      workflow,
      /psql -X -A -t -v ON_ERROR_STOP=1/,
    );

    assert.match(
      workflow,
      /--file supabase\/tests\/authenticated_owner_schema_readiness\.sql/,
    );

    assert.match(
      workflow,
      /NEXUS_AUTHENTICATED_OWNER_SCHEMA_READINESS=2_TABLES\/2_POLICIES\/19_CONSTRAINTS\/3_INDEXES/,
    );

    const readinessFileCommands =
      workflow.match(
        /--file supabase\/tests\/authenticated_owner_schema_readiness\.sql/g,
      ) ?? [];

    assert.equal(
      readinessFileCommands.length,
      1,
      "Exactly one remote authenticated-owner readiness query is allowed.",
    );
  },
);

test(
  "workflow cannot mutate or repair the linked database",
  () => {
    assert.doesNotMatch(
      workflow,
      /\bsupabase\s+db\s+push\b/i,
    );

    assert.doesNotMatch(
      workflow,
      /\bsupabase\s+db\s+reset\b/i,
    );

    assert.doesNotMatch(
      workflow,
      /\bsupabase\s+migration\s+repair\b/i,
    );

    assert.doesNotMatch(
      workflow,
      /\bsupabase\s+migration\s+up\b/i,
    );

    assert.doesNotMatch(
      workflow,
      /\bpsql\b[\s\S]*\b(-c|--command)\b/i,
    );
  },
);

test(
  "workflow preserves least privilege, masking and bounded execution",
  () => {
    assert.match(
      workflow,
      /permissions:\s*\n\s+contents:\s*read/i,
    );

    assert.match(
      workflow,
      /cancel-in-progress:\s*false/i,
    );

    assert.match(
      workflow,
      /timeout-minutes:\s*10/i,
    );

    assert.match(
      workflow,
      /::add-mask::\$\{SUPABASE_ACCESS_TOKEN\}/,
    );

    assert.match(
      workflow,
      /::add-mask::\$\{SUPABASE_DB_PASSWORD\}/,
    );

    assert.doesNotMatch(
      workflow,
      /\becho\s+"\$\{SUPABASE_DB_PASSWORD\}"/,
    );
  },
);
