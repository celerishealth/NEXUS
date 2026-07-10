import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

import {
  PROTECTED_API_OPERATIONAL_CONTROL_MODE,
  PostgresProtectedApiOperationalControlStore,
  getProtectedApiOperationalControlPosture,
} from "../lib/nexus/protectedApiOperationalControlStore.mjs";

import {
  enforceProtectedApiOperationalControl,
  getProtectedApiOperationalControlGuardPosture,
} from "../lib/nexus/protectedApiOperationalControlGuard.mjs";

const ROUTES = [
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/controlled-action-evidence/route.js",
  "app/api/nexus/controlled-action-review-console/route.js",
  "app/api/nexus/protected-api-security-probe/route.js",
  "app/api/nexus/controlled-action-state/route.js",
];

function signedContext() {
  return {
    schemaVersion:
      "nexus.protected-api-authorization-context.v1",
    tenantId:
      "tenant-day-677",
    ownerId:
      "owner-day-677",
    pathname:
      "/api/nexus/test",
    signatureVerified: true,
    bodyIntegrityVerified: true,
  };
}

function tenantContext() {
  return {
    schemaVersion:
      "nexus.protected-api-tenant-authorization-context.v1",
    tenantId:
      "tenant-day-677",
    ownerId:
      "owner-day-677",
    durableMembershipVerified:
      true,
  };
}

test(
  "allows access only when durable global control is initialized and open",
  async () => {
    const result =
      await enforceProtectedApiOperationalControl(
        signedContext(),
        tenantContext(),
        {
          requestId:
            "request-day-677",
          mode:
            PROTECTED_API_OPERATIONAL_CONTROL_MODE,
          store: {
            async evaluateAccess() {
              return {
                ok: true,
                allowed: true,
                initialized: true,
                authorityEpoch:
                  "authority-day-677",
                eventId:
                  "security-event-677",
              };
            },
          },
        },
      );

    assert.equal(result.ok, true);

    assert.equal(
      result.operationalControlContext
        .durableControlVerified,
      true,
    );

    assert.equal(
      result.operationalControlContext
        .durableIncidentEvidenceRecorded,
      true,
    );

    assert.equal(
      result.operationalControlContext
        .executionAuthorized,
      false,
    );
  },
);

test(
  "returns HTTP 503 when tenant or global control blocks access",
  async () => {
    const result =
      await enforceProtectedApiOperationalControl(
        signedContext(),
        tenantContext(),
        {
          mode:
            PROTECTED_API_OPERATIONAL_CONTROL_MODE,
          store: {
            async evaluateAccess() {
              return {
                ok: true,
                allowed: false,
                initialized: true,
                blockingMode:
                  "MAINTENANCE",
                eventId:
                  "security-block-677",
              };
            },
          },
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "PROTECTED_API_OPERATIONALLY_BLOCKED",
    );

    assert.equal(
      result.headers["Retry-After"],
      "60",
    );
  },
);

test(
  "fails closed when global control is not initialized",
  async () => {
    const result =
      await enforceProtectedApiOperationalControl(
        signedContext(),
        tenantContext(),
        {
          mode:
            PROTECTED_API_OPERATIONAL_CONTROL_MODE,
          store: {
            async evaluateAccess() {
              return {
                ok: true,
                allowed: false,
                initialized: false,
                eventId:
                  "security-uninitialized-677",
              };
            },
          },
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "OPERATIONAL_CONTROL_NOT_INITIALIZED",
    );
  },
);

test(
  "store evaluates control state and records security evidence in one query",
  async () => {
    const calls = [];

    const store =
      new PostgresProtectedApiOperationalControlStore({
        pool: {
          async query(sql, values) {
            calls.push({
              sql,
              values,
            });

            return {
              rows: [
                {
                  global_control_count: 1,
                  blocking_control_count: 0,
                  blocking_mode: null,
                  blocking_reason: null,
                  authority_epoch:
                    "authority-day-677",
                  event_id:
                    "security-event-677",
                },
              ],
            };
          },
        },
      });

    const result =
      await store.evaluateAccess({
        tenantId:
          "tenant-day-677",
        ownerId:
          "owner-day-677",
        routeKey:
          "/api/nexus/test",
        requestId:
          "request-day-677",
      });

    assert.equal(result.ok, true);
    assert.equal(result.allowed, true);
    assert.equal(calls.length, 1);

    assert.match(
      calls[0].sql,
      /nexus_protected_api_operational_state/,
    );

    assert.match(
      calls[0].sql,
      /nexus_security_event/,
    );

    assert.match(
      calls[0].sql,
      /OPERATIONAL_CONTROL_BLOCKED/,
    );
  },
);

test(
  "migration creates durable global tenant and route control boundary",
  () => {
    const migration =
      readFileSync(
        "db/migrations/0004_nexus_operational_circuit_breaker.sql",
        "utf8",
      );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_protected_api_operational_state/,
    );

    assert.match(
      migration,
      /PRIMARY KEY\s*\(\s*tenant_id,\s*route_key\s*\)/s,
    );

    assert.match(
      migration,
      /'OPEN'/,
    );

    assert.match(
      migration,
      /'BLOCKED'/,
    );

    assert.match(
      migration,
      /'MAINTENANCE'/,
    );
  },
);

test(
  "every protected route requires the operational circuit breaker",
  () => {
    for (const route of ROUTES) {
      const content =
        readFileSync(
          route,
          "utf8",
        );

      assert.match(
        content,
        /enforceProtectedApiOperationalControl/,
        route,
      );

      assert.match(
        content,
        /getProtectedApiOperationalControlStore/,
        route,
      );

      assert.match(
        content,
        /NEXUS_PROTECTED_API_OPERATIONAL_CONTROL_MODE/,
        route,
      );

      assert.match(
        content,
        /const operationalControlGuard/,
        route,
      );
    }
  },
);

test(
  "reports honest emergency-control posture",
  () => {
    const store =
      getProtectedApiOperationalControlPosture();

    const guard =
      getProtectedApiOperationalControlGuardPosture();

    assert.equal(
      store.mode,
      PROTECTED_API_OPERATIONAL_CONTROL_MODE,
    );

    assert.equal(
      store.explicitGlobalOpenRequired,
      true,
    );

    assert.equal(
      store.emergencyGlobalBlock,
      true,
    );

    assert.equal(
      store.emergencyTenantBlock,
      true,
    );

    assert.equal(
      store.liveMigrationPerformed,
      false,
    );

    assert.equal(
      store.executionAuthorized,
      false,
    );

    assert.equal(
      guard.executionAuthorized,
      false,
    );
  },
);

