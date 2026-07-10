import assert from "node:assert/strict";
import test from "node:test";

import {
  createControlledActionReviewScenario,
} from "../lib/nexus/controlledActionReviewConsolePreview.mjs";

test(
  "completes the unified approved-candidate pipeline",
  () => {
    const result =
      createControlledActionReviewScenario();

    assert.equal(result.completed, true);

    assert.equal(
      result.state,
      "OWNER_APPROVED_CANDIDATE_VERIFIED",
    );

    assert.equal(
      result.nextRequiredAction,
      "CONTROLLED_EXECUTION_REVIEW_REQUIRED",
    );

    assert.equal(
      result.stages.length,
      8,
    );

    assert.ok(
      result.stages.every(
        (stage) => stage.passed,
      ),
    );

    assert.equal(
      result.verification.valid,
      true,
    );

    assert.equal(
      result.executionAuthorized,
      false,
    );

    assert.equal(
      result.providerInvocationPerformed,
      false,
    );

    assert.equal(
      result.persistencePerformed,
      false,
    );
  },
);

test(
  "keeps unified pipeline identities deterministic",
  () => {
    const first =
      createControlledActionReviewScenario();

    const second =
      createControlledActionReviewScenario();

    assert.equal(
      first.prepared.admission
        .admissionToken,
      second.prepared.admission
        .admissionToken,
    );

    assert.equal(
      first.prepared.handoff.handoffId,
      second.prepared.handoff.handoffId,
    );

    assert.equal(
      first.prepared.intent.intentId,
      second.prepared.intent.intentId,
    );

    assert.equal(
      first.prepared.plan.planId,
      second.prepared.plan.planId,
    );

    assert.equal(
      first.evidence.bundleId,
      second.evidence.bundleId,
    );
  },
);

test(
  "completes permanent owner rejection with verified evidence",
  () => {
    const result =
      createControlledActionReviewScenario({
        decision:
          "REJECT_PERMANENTLY",
      });

    assert.equal(result.completed, true);

    assert.equal(
      result.state,
      "OWNER_REJECTED_PERMANENTLY_VERIFIED",
    );

    assert.equal(
      result.nextRequiredAction,
      "NO_FURTHER_ACTION_PERMITTED",
    );

    assert.equal(
      result.ownerResolution
        .permanentStopRecord
        .blocksFutureExecution,
      true,
    );

    assert.equal(
      result.verification.valid,
      true,
    );
  },
);

test(
  "completes owner-required rework with verified evidence",
  () => {
    const result =
      createControlledActionReviewScenario({
        decision:
          "REQUIRE_REWORK",
      });

    assert.equal(result.completed, true);

    assert.equal(
      result.state,
      "OWNER_REWORK_REQUIRED_VERIFIED",
    );

    assert.equal(
      result.nextRequiredAction,
      "RETURN_TO_CONTROLLED_PLANNING",
    );

    assert.equal(
      result.ownerResolution
        .immutableDispatchCandidate,
      null,
    );
  },
);

test(
  "blocks a forged owner admission at the first stage",
  () => {
    const result =
      createControlledActionReviewScenario({
        forgedAdmission: true,
      });

    assert.equal(
      result.completed,
      false,
    );

    assert.equal(
      result.state,
      "BLOCKED_AT_ADMISSION",
    );

    assert.ok(
      result.prepared.admission
        .reasonCodes.includes(
          "RESOLUTION_SIGNATURE_INVALID",
        ),
    );

    assert.equal(
      result.executionAuthorized,
      false,
    );
  },
);

test(
  "blocks cross-tenant authority before handoff",
  () => {
    const result =
      createControlledActionReviewScenario({
        foreignTenant: true,
      });

    assert.equal(
      result.completed,
      false,
    );

    assert.equal(
      result.state,
      "BLOCKED_AT_ADMISSION",
    );

    assert.ok(
      result.prepared.admission
        .reasonCodes.includes(
          "TENANT_ISOLATION_VIOLATION",
        ),
    );
  },
);

test(
  "blocks single-provider dependency at recovery handoff",
  () => {
    const result =
      createControlledActionReviewScenario({
        singleProvider: true,
      });

    assert.equal(
      result.completed,
      false,
    );

    assert.equal(
      result.state,
      "BLOCKED_AT_HANDOFF",
    );

    assert.ok(
      result.prepared.handoff
        .reasonCodes.includes(
          "PROVIDER_FAILOVER_UNAVAILABLE",
        ),
    );
  },
);

test(
  "blocks a foreign owner claim",
  () => {
    const result =
      createControlledActionReviewScenario({
        foreignOwnerClaim: true,
      });

    assert.equal(
      result.completed,
      false,
    );

    assert.equal(
      result.state,
      "BLOCKED_AT_CLAIM",
    );

    assert.ok(
      result.prepared.claim
        .reasonCodes.includes(
          "TRUSTED_OWNER_CLAIM_REQUIRED",
        ),
    );
  },
);

test(
  "blocks approval after failover exhaustion",
  () => {
    const result =
      createControlledActionReviewScenario({
        simulationMode:
          "FAILOVER_EXHAUSTED",
      });

    assert.equal(
      result.completed,
      false,
    );

    assert.equal(
      result.state,
      "BLOCKED_AT_OWNER_REVIEW",
    );

    assert.ok(
      result.ownerResolution
        .reasonCodes.includes(
          "SUCCESSFUL_SIMULATION_REQUIRED_FOR_APPROVAL",
        ),
    );
  },
);

test(
  "blocks a forged signed owner review",
  () => {
    const result =
      createControlledActionReviewScenario({
        forgedReview: true,
      });

    assert.equal(
      result.completed,
      false,
    );

    assert.equal(
      result.state,
      "BLOCKED_AT_OWNER_REVIEW",
    );

    assert.ok(
      result.ownerResolution
        .reasonCodes.includes(
          "OWNER_REVIEW_SIGNATURE_INVALID",
        ),
    );

    assert.equal(
      result.evidence.created,
      false,
    );
  },
);
