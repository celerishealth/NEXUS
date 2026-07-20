import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

const appRoot = path.resolve(
  testDirectory,
  "..",
);

const prerequisiteName =
  "20260720050000_authenticated_owner_prerequisites.sql";

const authenticatedOwnerName =
  "20260720050200_authenticated_owner_access.sql";

const prerequisitePath = path.join(
  appRoot,
  "supabase",
  "migrations",
  prerequisiteName,
);

const authenticatedOwnerPath = path.join(
  appRoot,
  "supabase",
  "migrations",
  authenticatedOwnerName,
);

function readSql(filePath) {
  return fs
    .readFileSync(
      filePath,
      "utf8",
    )
    .replace(
      /\r\n/g,
      "\n",
    )
    .trim();
}

function countMatches(value, pattern) {
  return [
    ...value.matchAll(pattern),
  ].length;
}

assert.ok(
  fs.existsSync(prerequisitePath),
  "Authenticated-owner prerequisite Supabase migration must exist.",
);

assert.ok(
  fs.existsSync(authenticatedOwnerPath),
  "Authenticated-owner access Supabase migration must exist.",
);

const prerequisiteSql =
  readSql(prerequisitePath);

const authenticatedOwnerSql =
  readSql(authenticatedOwnerPath);

const prerequisiteTables = [
  "nexus_tenant",
  "nexus_owner_identity",
  "nexus_tenant_owner_membership",
];

const authenticatedOwnerTables = [
  "nexus_authenticated_owner_credentials",
  "nexus_authenticated_owner_sessions",
];

const prerequisiteConstraints = [
  "nexus_tenant_status_check",
  "nexus_owner_identity_status_check",
  "nexus_tenant_owner_membership_pk",
  "nexus_tenant_owner_membership_tenant_fk",
  "nexus_tenant_owner_membership_owner_fk",
  "nexus_tenant_owner_membership_role_check",
  "nexus_tenant_owner_membership_status_check",
];

const authenticatedOwnerConstraints = [
  "nexus_authenticated_owner_credentials_pk",
  "nexus_authenticated_owner_credentials_membership_fk",
  "nexus_authenticated_owner_credentials_email_unique",
  "nexus_authenticated_owner_credentials_email_check",
  "nexus_authenticated_owner_credentials_salt_check",
  "nexus_authenticated_owner_credentials_hash_check",
  "nexus_authenticated_owner_credentials_status_check",
  "nexus_authenticated_owner_credentials_version_check",
  "nexus_authenticated_owner_credentials_failure_check",
  "nexus_authenticated_owner_credentials_lock_check",
  "nexus_authenticated_owner_sessions_pk",
  "nexus_authenticated_owner_sessions_id_unique",
  "nexus_authenticated_owner_sessions_membership_fk",
  "nexus_authenticated_owner_sessions_id_check",
  "nexus_authenticated_owner_sessions_digest_check",
  "nexus_authenticated_owner_sessions_authority_check",
  "nexus_authenticated_owner_sessions_role_check",
  "nexus_authenticated_owner_sessions_expiry_check",
  "nexus_authenticated_owner_sessions_revocation_check",
];

test(
  "authenticated-owner Supabase migrations are ordered and bounded",
  () => {
    assert.ok(
      prerequisiteName < authenticatedOwnerName,
      "Prerequisites must sort before authenticated-owner access.",
    );

    for (const sql of [
      prerequisiteSql,
      authenticatedOwnerSql,
    ]) {
      assert.match(
        sql,
        /^BEGIN;/i,
      );

      assert.match(
        sql,
        /COMMIT;\s*$/i,
      );

      assert.doesNotMatch(
        sql,
        /\b(?:DROP\s+TABLE|TRUNCATE|ALTER\s+SYSTEM|CREATE\s+ROLE|COPY\b[\s\S]*?\bPROGRAM)\b/i,
      );
    }
  },
);

test(
  "tenant, owner, and membership prerequisites are public-schema qualified and RLS protected",
  () => {
    assert.equal(
      countMatches(
        prerequisiteSql,
        /\bCREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\./gi,
      ),
      3,
    );

    assert.equal(
      countMatches(
        prerequisiteSql,
        /\bENABLE\s+ROW\s+LEVEL\s+SECURITY\s*;/gi,
      ),
      3,
    );

    assert.equal(
      countMatches(
        prerequisiteSql,
        /\bFORCE\s+ROW\s+LEVEL\s+SECURITY\s*;/gi,
      ),
      3,
    );

    assert.equal(
      countMatches(
        prerequisiteSql,
        /\bCREATE\s+POLICY\b/gi,
      ),
      0,
    );

    for (const tableName of prerequisiteTables) {
      assert.match(
        prerequisiteSql,
        new RegExp(
          `CREATE TABLE IF NOT EXISTS public\\.${tableName}\\b`,
          "i",
        ),
      );

      assert.match(
        prerequisiteSql,
        new RegExp(
          `REVOKE ALL\\s+ON TABLE public\\.${tableName}\\s+FROM public, anon, authenticated, service_role\\s*;`,
          "i",
        ),
      );

      assert.match(
        prerequisiteSql,
        new RegExp(
          `GRANT SELECT, INSERT, UPDATE, DELETE\\s+ON TABLE public\\.${tableName}\\s+TO service_role\\s*;`,
          "i",
        ),
      );
    }

    for (
      const constraintName
      of prerequisiteConstraints
    ) {
      assert.match(
        prerequisiteSql,
        new RegExp(
          `\\b${constraintName}\\b`,
          "i",
        ),
      );
    }
  },
);

test(
  "authenticated-owner access preserves exact credential and session schema security",
  () => {
    assert.equal(
      countMatches(
        authenticatedOwnerSql,
        /\bCREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\./gi,
      ),
      2,
    );

    assert.equal(
      countMatches(
        authenticatedOwnerSql,
        /\bENABLE\s+ROW\s+LEVEL\s+SECURITY\s*;/gi,
      ),
      2,
    );

    assert.equal(
      countMatches(
        authenticatedOwnerSql,
        /\bFORCE\s+ROW\s+LEVEL\s+SECURITY\s*;/gi,
      ),
      2,
    );

    assert.equal(
      countMatches(
        authenticatedOwnerSql,
        /\bCREATE\s+POLICY\b/gi,
      ),
      2,
    );

    assert.match(
      authenticatedOwnerSql,
      /REFERENCES\s+public\.nexus_tenant_owner_membership/i,
    );

    assert.match(
      authenticatedOwnerSql,
      /current_setting\('app\.tenant_id',\s*true\)/i,
    );

    for (
      const tableName
      of authenticatedOwnerTables
    ) {
      assert.match(
        authenticatedOwnerSql,
        new RegExp(
          `CREATE TABLE IF NOT EXISTS public\\.${tableName}\\b`,
          "i",
        ),
      );

      assert.match(
        authenticatedOwnerSql,
        new RegExp(
          `REVOKE ALL\\s+ON TABLE public\\.${tableName}\\s+FROM public, anon, authenticated, service_role\\s*;`,
          "i",
        ),
      );

      assert.match(
        authenticatedOwnerSql,
        new RegExp(
          `GRANT SELECT, INSERT, UPDATE, DELETE\\s+ON TABLE public\\.${tableName}\\s+TO service_role\\s*;`,
          "i",
        ),
      );
    }

    for (
      const constraintName
      of authenticatedOwnerConstraints
    ) {
      assert.match(
        authenticatedOwnerSql,
        new RegExp(
          `\\b${constraintName}\\b`,
          "i",
        ),
      );
    }

    assert.doesNotMatch(
      authenticatedOwnerSql,
      /\b(?:password_plaintext|plain_password|raw_token|session_token)\b/i,
    );
  },
);