import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

import {
  CONTROLLED_ACTION_STATES,
  getControlledActionStorePosture,
} from "../lib/nexus/controlledActionStore.mjs";

test(
  "controlled action state machine excludes execution",
  () => {
    assert.equal(
      CONTROLLED_ACTION_STATES.includes(
        "EXECUTED",
      ),
      false,
    );

    assert.deepEqual(
      CONTROLLED_ACTION_STATES,
      [
        "CREATED",
        "PENDING_OWNER_REVIEW",
        "APPROVED_FOR_DRY_RUN",
        "SIMULATED",
        "APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW",
        "REWORK_REQUIRED",
        "REJECTED",
      ],
    );
  },
);

test(
  "migration enforces tenant idempotency and append-only evidence identity",
  () => {
    const migration =
      readFileSync(
        "db/migrations/0005_nexus_controlled_action_state.sql",
        "utf8",
      );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_controlled_action/,
    );

    assert.match(
      migration,
      /UNIQUE\s*\(\s*tenant_id,\s*idempotency_key\s*\)/s,
    );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_controlled_action_event/,
    );

    assert.match(
      migration,
      /PRIMARY KEY\s*\(\s*tenant_id,\s*action_id,\s*sequence\s*\)/s,
    );

    assert.doesNotMatch(
      migration,
      /'EXECUTED'/,
    );
  },
);

test(
  "protected controlled-action route uses the complete security chain",
  () => {
    const route =
      readFileSync(
        "app/api/nexus/controlled-action-state/route.js",
        "utf8",
      );

    const requiredControls = [
      "inspectProtectedApiRequest",
      "inspectProtectedApiSignedEnvelope",
      "getProtectedApiReplayStore",
      "authorizeProtectedApiTenantOwnerContext",
      "getProtectedApiTenantAuthorizationStore",
      "enforceProtectedApiOperationalControl",
      "getProtectedApiOperationalControlStore",
      "enforceProtectedApiRateLimit",
      "getProtectedApiRateLimitStore",
      "getControlledActionStore",
    ];

    for (
      const control
      of requiredControls
    ) {
      assert.match(
        route,
        new RegExp(control),
        control,
      );
    }

    assert.match(
      route,
      /operation === "CREATE"/,
    );

    assert.match(
      route,
      /operation === "TRANSITION"/,
    );

    assert.match(
      route,
      /executionAuthorized:\s*false/,
    );
  },
);

test(
  "real database gate verifies idempotency concurrency and hash continuity",
  () => {
    const gate =
      readFileSync(
        "scripts/nexus-local-postgres-controlled-action-gate.mjs",
        "utf8",
      );

    assert.match(
      gate,
      /CONTROLLED_ACTION_IDEMPOTENCY_CONFLICT/,
    );

    assert.match(
      gate,
      /successfulConcurrentTransitions/,
    );

    assert.match(
      gate,
      /versionConflicts\.length ===\s*15/,
    );

    assert.match(
      gate,
      /broken_hash_links/,
    );

    assert.match(
      gate,
      /EXECUTED_STATE_IMPOSSIBLE/,
    );

    assert.match(
      gate,
      /productionDatabaseModified:\s*false/,
    );
  },
);

test(
  "controlled action posture remains non-executing",
  () => {
    const posture =
      getControlledActionStorePosture();

    assert.equal(
      posture.tenantIsolated,
      true,
    );

    assert.equal(
      posture.idempotencyProtected,
      true,
    );

    assert.equal(
      posture.optimisticConcurrency,
      true,
    );

    assert.equal(
      posture.hashLinkedEvidence,
      true,
    );

    assert.equal(
      posture.executedStateExists,
      false,
    );

    assert.equal(
      posture.externalExecutionAuthorized,
      false,
    );
  },
);
