import assert from "node:assert/strict";
import test from "node:test";

import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../lib/nexus/ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "../lib/nexus/providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "../lib/nexus/controlledExecutionIntent.mjs";

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "../lib/nexus/dryRunDispatchPlan.mjs";

import {
  createSignedOwnerSimulationReview,
  evaluateOwnerSimulationReview,
} from "../lib/nexus/ownerSimulationReview.mjs";

const SECRET =
  "day-665-test-secret";

const NOW =
  "2026-07-10T10:00:00.000Z";

function createPipeline({
  simulationMode =
    "SIMULATED_SUCCESS",
} = {}) {
  const action = {
    tenantId: "tenant-665",
    actionId: "action-665",
    actionType:
      "SAFE_DRAFT_ADMISSION",
    payloadDigest:
      "sha256:day-665-test-payload",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-665",
    authorityEpoch: "epoch-665",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const admissionResolution =
    createSignedOwnerResolution({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      resolutionId:
        "admission-resolution-665",
      authorityEpoch:
        authority.authorityEpoch,
      nonce:
        "admission-nonce-665",
      issuedAt:
        "2026-07-10T09:55:00.000Z",
      expiresAt:
        "2026-07-10T10:15:00.000Z",
      signingSecret: SECRET,
    });

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action,
      authority,
      resolution:
        admissionResolution,
      replay: {
        consumedResolutionIds: [],
        consumedNonces: [],
        retryCount: 0,
        permanentOutcome: false,
      },
      signingSecret: SECRET,
      now: NOW,
    });

  const adapters = [
    {
      adapterId:
        "adapter-alpha-665",
      providerId:
        "provider-alpha-665",
      status: "HEALTHY",
      priority: 1,
      capabilities: [
        "SAFE_DRAFT_ADMISSION",
      ],
    },
    {
      adapterId:
        "adapter-beta-665",
      providerId:
        "provider-beta-665",
      status: "HEALTHY",
      priority: 2,
      capabilities: [
        "SAFE_DRAFT_ADMISSION",
      ],
    },
  ];

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action,
      admission,
      adapters,
      recovery: {
        retryCount: 0,
        permanentOutcome: false,
      },
      now: NOW,
    });

  const intent =
    createControlledExecutionIntent({
      action,
      admission,
      handoff,
      now: NOW,
    });

  const claim =
    claimControlledExecutionIntent({
      intent,
      claim: {
        claimId: "claim-665",
        intentId: intent.intentId,
        tenantId: action.tenantId,
        actionId: action.actionId,
        ownerId: authority.ownerId,
        role: "OWNER",
        issuedAt:
          "2026-07-10T09:59:00.000Z",
        expiresAt:
          "2026-07-10T10:10:00.000Z",
      },
      replay: {
        consumedClaimIds: [],
        activeClaimExists: false,
      },
      now: NOW,
    });

  const adapterManifests =
    adapters.map((adapter) => ({
      adapterId: adapter.adapterId,
      providerId: adapter.providerId,
      contractVersion:
        "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired:
        false,
    }));

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests,
      now: NOW,
    });

  const outcomes = {};

  plan.dispatchAttempts.forEach(
    (attempt, index) => {
      if (
        simulationMode ===
        "SIMULATED_SUCCESS"
      ) {
        outcomes[attempt.attemptId] =
          index === 0
            ? "SIMULATED_RETRYABLE_FAILURE"
            : "SIMULATED_SUCCESS";
      } else {
        outcomes[attempt.attemptId] =
          "SIMULATED_RETRYABLE_FAILURE";
      }
    },
  );

  const simulation =
    simulateDryRunDispatch({
      plan,
      outcomes,
      now: NOW,
    });

  return {
    action,
    authority,
    intent,
    claim,
    plan,
    simulation,
  };
}

function createReview(
  pipeline,
  overrides = {},
) {
  const review =
    createSignedOwnerSimulationReview({
      tenantId:
        pipeline.action.tenantId,
      ownerId:
        pipeline.authority.ownerId,
      actionId:
        pipeline.action.actionId,
      intentId:
        pipeline.intent.intentId,
      claimId:
        pipeline.claim.claimId,
      planId:
        pipeline.plan.planId,
      simulationId:
        pipeline.simulation.simulationId,
      reviewId: "review-665",
      nonce: "review-nonce-665",
      decision:
        "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
      issuedAt:
        "2026-07-10T10:00:00.000Z",
      expiresAt:
        "2026-07-10T10:10:00.000Z",
      ownerCommentDigest:
        "sha256:review-comment",
      signingSecret: SECRET,
      ...overrides.fields,
    });

  return {
    ...review,
    ...overrides.review,
  };
}

function evaluate(
  pipeline,
  {
    review,
    replay = {},
    signingSecret = SECRET,
  } = {},
) {
  return evaluateOwnerSimulationReview({
    ...pipeline,
    review:
      review ?? createReview(pipeline),
    replay: {
      consumedReviewIds: [],
      consumedNonces: [],
      permanentResolutionExists:
        false,
      ...replay,
    },
    signingSecret,
    now: NOW,
  });
}

test(
  "accepts a signed owner approval and creates an immutable candidate",
  () => {
    const pipeline =
      createPipeline();

    const first =
      evaluate(pipeline);

    const second =
      evaluate(createPipeline());

    assert.equal(first.accepted, true);
    assert.equal(
      first.state,
      "APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW",
    );
    assert.match(
      first.resolutionId,
      /^[a-f0-9]{64}$/,
    );
    assert.match(
      first.immutableDispatchCandidate
        .candidateId,
      /^[a-f0-9]{64}$/,
    );
    assert.equal(
      first.resolutionId,
      second.resolutionId,
    );
    assert.equal(
      first.executionAuthorized,
      false,
    );
    assert.equal(
      first.providerInvocationPerformed,
      false,
    );
    assert.equal(
      first.persistencePerformed,
      false,
    );
  },
);

test(
  "blocks a forged owner review signature",
  () => {
    const pipeline =
      createPipeline();

    const review =
      createReview(pipeline);

    review.signature =
      "0".repeat(64);

    const result = evaluate(
      pipeline,
      { review },
    );

    assert.equal(
      result.accepted,
      false,
    );

    assert.ok(
      result.reasonCodes.includes(
        "OWNER_REVIEW_SIGNATURE_INVALID",
      ),
    );
  },
);

test(
  "blocks a foreign owner review",
  () => {
    const pipeline =
      createPipeline();

    const review =
      createReview(pipeline, {
        fields: {
          ownerId:
            "owner-foreign-665",
        },
      });

    const result = evaluate(
      pipeline,
      { review },
    );

    assert.equal(
      result.accepted,
      false,
    );

    assert.ok(
      result.reasonCodes.includes(
        "OWNER_REVIEW_PIPELINE_BINDING_MISMATCH",
      ),
    );
  },
);

test(
  "blocks replayed review identifiers",
  () => {
    const pipeline =
      createPipeline();

    const review =
      createReview(pipeline);

    const result = evaluate(
      pipeline,
      {
        review,
        replay: {
          consumedReviewIds: [
            review.reviewId,
          ],
        },
      },
    );

    assert.equal(
      result.accepted,
      false,
    );

    assert.ok(
      result.reasonCodes.includes(
        "OWNER_REVIEW_REPLAY_BLOCKED",
      ),
    );
  },
);

test(
  "blocks replayed review nonces",
  () => {
    const pipeline =
      createPipeline();

    const review =
      createReview(pipeline);

    const result = evaluate(
      pipeline,
      {
        review,
        replay: {
          consumedNonces: [
            review.nonce,
          ],
        },
      },
    );

    assert.equal(
      result.accepted,
      false,
    );

    assert.ok(
      result.reasonCodes.includes(
        "OWNER_REVIEW_NONCE_REPLAY_BLOCKED",
      ),
    );
  },
);

test(
  "blocks approval when failover simulation did not succeed",
  () => {
    const pipeline =
      createPipeline({
        simulationMode:
          "SIMULATED_FAILOVER_EXHAUSTED",
      });

    const result =
      evaluate(pipeline);

    assert.equal(
      result.accepted,
      false,
    );

    assert.ok(
      result.reasonCodes.includes(
        "SUCCESSFUL_SIMULATION_REQUIRED_FOR_APPROVAL",
      ),
    );
  },
);

test(
  "accepts permanent owner rejection and creates a stop record",
  () => {
    const pipeline =
      createPipeline();

    const review =
      createReview(pipeline, {
        fields: {
          decision:
            "REJECT_PERMANENTLY",
          reviewId:
            "review-reject-665",
          nonce:
            "review-reject-nonce-665",
        },
      });

    const result = evaluate(
      pipeline,
      { review },
    );

    assert.equal(
      result.accepted,
      true,
    );

    assert.equal(
      result.state,
      "REJECTED_PERMANENTLY",
    );

    assert.equal(
      result.permanentStopRecord
        .blocksFutureExecution,
      true,
    );

    assert.equal(
      result.immutableDispatchCandidate,
      null,
    );
  },
);

test(
  "accepts owner rework decision without creating a dispatch candidate",
  () => {
    const pipeline =
      createPipeline();

    const review =
      createReview(pipeline, {
        fields: {
          decision:
            "REQUIRE_REWORK",
          reviewId:
            "review-rework-665",
          nonce:
            "review-rework-nonce-665",
        },
      });

    const result = evaluate(
      pipeline,
      { review },
    );

    assert.equal(
      result.accepted,
      true,
    );

    assert.equal(
      result.state,
      "REWORK_REQUIRED",
    );

    assert.equal(
      result.immutableDispatchCandidate,
      null,
    );

    assert.equal(
      result.reworkRecord.nextState,
      "RETURN_TO_CONTROLLED_PLANNING",
    );
  },
);

test(
  "blocks a second resolution after a permanent owner outcome",
  () => {
    const pipeline =
      createPipeline();

    const result = evaluate(
      pipeline,
      {
        replay: {
          permanentResolutionExists:
            true,
        },
      },
    );

    assert.equal(
      result.accepted,
      false,
    );

    assert.ok(
      result.reasonCodes.includes(
        "PERMANENT_OWNER_RESOLUTION_ALREADY_EXISTS",
      ),
    );
  },
);

test(
  "fails closed when review signing authority is unavailable",
  () => {
    const pipeline =
      createPipeline();

    const result = evaluate(
      pipeline,
      {
        signingSecret: "",
      },
    );

    assert.equal(
      result.accepted,
      false,
    );

    assert.ok(
      result.reasonCodes.includes(
        "OWNER_REVIEW_SIGNING_AUTHORITY_UNAVAILABLE",
      ),
    );
  },
);
