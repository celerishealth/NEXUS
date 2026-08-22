import {
  describe,
  expect,
  it,
} from "vitest";

describe(
  "workforce exclusive task ownership migration",
  () => {
    it(
      "defines a tenant-isolated append-only exclusive bounded-task ownership ledger with stale-owner fencing and lineage-bound handoff evidence",
      async () => {
        const migration =
          await import(
            "node:fs/promises"
          ).then(
            ({ readFile }) =>
              readFile(
                "db/migrations/0772_workforce_exclusive_task_ownership.sql",
                "utf8",
              ),
          );

        expect(migration).toMatch(
          /CREATE TABLE IF NOT EXISTS nexus_workforce_task_ownership\s*\(/,
        );

        expect(migration).toMatch(
          /PRIMARY KEY\s*\(\s*tenant_id,\s*task_sequence,\s*scenario_id,\s*ownership_version\s*\)/,
        );

        expect(migration).toMatch(
          /FOREIGN KEY\s*\(\s*tenant_id,\s*owner_id\s*\)\s*REFERENCES nexus_tenant_owner_membership\s*\(\s*tenant_id,\s*owner_id\s*\)/,
        );

        expect(migration).toMatch(
          /CONSTRAINT nexus_workforce_task_ownership_lineage_fk\s*FOREIGN KEY\s*\(\s*tenant_id,\s*owner_id,\s*task_sequence,\s*scenario_id,\s*previous_fence_token,\s*from_employee_id,\s*from_runtime_id,\s*from_manifest_digest,\s*from_runtime_digest\s*\)\s*REFERENCES nexus_workforce_task_ownership\s*\(\s*tenant_id,\s*owner_id,\s*task_sequence,\s*scenario_id,\s*ownership_version,\s*to_employee_id,\s*to_runtime_id,\s*to_manifest_digest,\s*to_runtime_digest\s*\)/,
        );

        expect(migration).toMatch(
          /task_sequence INTEGER NOT NULL/,
        );

        expect(migration).toMatch(
          /scenario_id VARCHAR\(160\) NOT NULL/,
        );

        expect(migration).toMatch(
          /ownership_version BIGINT NOT NULL/,
        );

        expect(migration).toMatch(
          /transition_type VARCHAR\(32\) NOT NULL/,
        );

        expect(migration).toMatch(
          /to_employee_id VARCHAR\(128\) NOT NULL/,
        );

        expect(migration).toMatch(
          /to_runtime_id VARCHAR\(160\) NOT NULL/,
        );

        expect(migration).toMatch(
          /to_manifest_digest CHAR\(64\) NOT NULL/,
        );

        expect(migration).toMatch(
          /to_runtime_digest CHAR\(64\) NOT NULL/,
        );

        expect(migration).toMatch(
          /next_fence_token = ownership_version/,
        );

        expect(migration).toMatch(
          /previous_fence_token =\s*ownership_version - 1/,
        );

        expect(migration).toMatch(
          /next_fence_token =\s*previous_fence_token \+ 1/,
        );

        expect(migration).toMatch(
          /transition_type IN\s*\(\s*'CLAIMED',\s*'HANDED_OFF'\s*\)/,
        );

        expect(migration).not.toMatch(
          /actor_id/i,
        );

        expect(migration).not.toMatch(
          /workstream_id/i,
        );

        expect(migration).not.toMatch(
          /runtime_actor_bindings/i,
        );

        expect(migration).not.toMatch(
          /CREATE TABLE IF NOT EXISTS nexus_workforce_task_ownership_audit/,
        );

        expect(migration).toMatch(
          /CREATE OR REPLACE FUNCTION\s+nexus_claim_workforce_task_ownership/,
        );

        expect(migration).toMatch(
          /ON CONFLICT\s*\(\s*tenant_id,\s*task_sequence,\s*scenario_id,\s*ownership_version\s*\)\s*DO NOTHING/,
        );

        expect(migration).toMatch(
          /CREATE OR REPLACE FUNCTION\s+nexus_handoff_workforce_task_ownership/,
        );

        expect(migration).toMatch(
          /p_expected_employee_id VARCHAR/,
        );

        expect(migration).toMatch(
          /p_expected_runtime_id VARCHAR/,
        );

        expect(migration).toMatch(
          /p_expected_version BIGINT/,
        );

        expect(migration).toMatch(
          /p_expected_fence_token BIGINT/,
        );

        expect(migration).toMatch(
          /pg_advisory_xact_lock/,
        );
        const insertGuardStart =
          migration.indexOf(
            "nexus_validate_workforce_task_ownership_insert()",
          );
        const insertGuardEnd =
          migration.indexOf(
            "nexus_reject_workforce_task_ownership_mutation()",
            insertGuardStart,
          );
        const insertGuard =
          migration.slice(
            insertGuardStart,
            insertGuardEnd,
          );

        const insertGuardAdvisoryLockIndex =
          insertGuard.indexOf(
            "pg_advisory_xact_lock",
          );
        const insertGuardAuthorityLockIndex =
          insertGuard.indexOf(
            "FOR UPDATE OF membership, tenant, owner_identity",
          );

        expect(
          insertGuardAdvisoryLockIndex,
        ).toBeGreaterThanOrEqual(0);

        expect(
          insertGuardAuthorityLockIndex,
        ).toBeGreaterThan(
          insertGuardAdvisoryLockIndex,
        );

        expect(migration).toMatch(
          /ORDER BY ownership_version DESC\s*LIMIT 1/,
        );

        expect(migration).toMatch(
          /v_current\.to_employee_id\s*<>\s*btrim\(p_expected_employee_id\)/,
        );

        expect(migration).toMatch(
          /v_current\.to_runtime_id\s*<>\s*btrim\(p_expected_runtime_id\)/,
        );

        expect(migration).toMatch(
          /v_current\.ownership_version\s*<>\s*p_expected_version/,
        );

        expect(migration).toMatch(
          /v_current\.next_fence_token\s*<>\s*p_expected_fence_token/,
        );

        expect(migration).toMatch(
          /WORKFORCE_TASK_STALE_OWNER/,
        );

        expect(migration).toMatch(
          /v_next_version\s*=\s*v_current\.ownership_version \+ 1/,
        );

        expect(migration).toMatch(
          /v_next_fence\s*=\s*v_current\.next_fence_token \+ 1/,
        );

        expect(migration).toMatch(
          /CREATE OR REPLACE FUNCTION\s+nexus_validate_workforce_task_ownership_insert/,
        );

        expect(migration).toMatch(
          /CREATE TRIGGER\s+nexus_workforce_task_ownership_insert_guard_trg\s+BEFORE INSERT\s+ON nexus_workforce_task_ownership/,
        );
        expect(migration).toMatch(
          /membership\.status = 'ACTIVE'/,
        );

        expect(migration).toMatch(
          /tenant\.status = 'ACTIVE'/,
        );

        expect(migration).toMatch(
          /owner_identity\.status = 'ACTIVE'/,
        );

        expect(migration).toMatch(
          /FOR UPDATE OF membership, tenant, owner_identity/,
        );

        expect(migration).toMatch(
          /WORKFORCE_TASK_OWNER_AUTHORITY_INACTIVE/,
        );

        expect(migration).toMatch(
          /NEW\.ownership_version\s*<>\s*v_current\.ownership_version \+ 1/,
        );

        expect(migration).toMatch(
          /NEW\.previous_fence_token\s*<>\s*v_current\.next_fence_token/,
        );

        expect(migration).toMatch(
          /NEW\.from_employee_id\s*<>\s*v_current\.to_employee_id/,
        );

        expect(migration).toMatch(
          /NEW\.from_runtime_id\s*<>\s*v_current\.to_runtime_id/,
        );

        expect(migration).toMatch(
          /NEW\.from_manifest_digest\s*<>\s*v_current\.to_manifest_digest/,
        );

        expect(migration).toMatch(
          /NEW\.from_runtime_digest\s*<>\s*v_current\.to_runtime_digest/,
        );

        expect(migration).toMatch(
          /NEW\.created_at < v_current\.created_at/,
        );
        expect(migration).toMatch(
          /WORKFORCE_TASK_OWNERSHIP_APPEND_ONLY/,
        );

        expect(migration).toMatch(
          /BEFORE UPDATE OR DELETE\s+ON nexus_workforce_task_ownership/,
        );

        expect(migration).not.toMatch(
          /UPDATE\s+nexus_workforce_task_ownership\s+SET/i,
        );

        expect(migration).toMatch(
          /ALTER TABLE nexus_workforce_task_ownership\s+ENABLE ROW LEVEL SECURITY;/,
        );

        expect(migration).toMatch(
          /ALTER TABLE nexus_workforce_task_ownership\s+FORCE ROW LEVEL SECURITY;/,
        );

        expect(migration).toMatch(
          /CREATE POLICY\s+nexus_workforce_task_ownership_select_policy\s+ON nexus_workforce_task_ownership\s+FOR SELECT\s+USING/,
        );

        expect(migration).toMatch(
          /CREATE POLICY\s+nexus_workforce_task_ownership_insert_policy\s+ON nexus_workforce_task_ownership\s+FOR INSERT\s+WITH CHECK/,
        );

        expect(migration).not.toMatch(
          /CREATE POLICY\s+\S+\s+ON nexus_workforce_task_ownership\s+FOR (?:ALL|UPDATE|DELETE)/,
        );

        const tenantContextReferences =
          migration.match(
            /current_setting\('app\.tenant_id', true\)/g,
          ) ?? [];

        expect(
          tenantContextReferences,
        ).toHaveLength(2);
      },
    );
  },
);