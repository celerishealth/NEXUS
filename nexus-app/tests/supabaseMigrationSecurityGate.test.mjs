import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSupabaseMigrationSecurityReport,
} from "../scripts/nexus-supabase-migration-security-gate.mjs";

test(
  "Supabase permanent migrations preserve the locked security contract",
  () => {
    const report =
      buildSupabaseMigrationSecurityReport();

    assert.equal(
      report.schemaVersion,
      "nexus.supabase-migration-security-gate.v1",
    );

    assert.equal(
      report.passed,
      true,
    );

    assert.equal(
      report.permanentMigrationCount,
      15,
    );

    assert.equal(
      report.publicTableCount,
      11,
    );

    assert.equal(
      report.rlsEnabledTableCount,
      11,
    );

    assert.deepEqual(
      report.missingRls,
      [],
    );

    assert.deepEqual(
      report.unknownRlsTargets,
      [],
    );

    assert.equal(
      report.policyCount,
      0,
    );

    assert.deepEqual(
      report.highRiskFindings,
      [],
    );

    assert.equal(
      report.unparsedPermissionStatementCount,
      0,
    );

    assert.deepEqual(
      report.uniqueRoles,
      [
        "anon",
        "authenticated",
        "public",
        "service_role",
      ],
    );

    assert.deepEqual(
      report.unexpectedRoles,
      [],
    );

    assert.equal(
      report.securityDefinerCount,
      17,
    );

    assert.deepEqual(
      report.securityDefinerFailures,
      [],
    );

    assert.equal(
      report.directServiceRoleTableCount,
      7,
    );

    assert.equal(
      report.securedFunctionOnlyTableCount,
      4,
    );

    assert.deepEqual(
      report.tableFailures,
      [],
    );

    assert.equal(
      report.productionDatabaseConfigured,
      false,
    );

    assert.equal(
      report.productionMigrationPerformed,
      false,
    );

    assert.equal(
      report.publicLaunchAuthorized,
      false,
    );
  },
);