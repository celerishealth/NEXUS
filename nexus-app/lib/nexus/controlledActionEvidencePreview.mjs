import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "./ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "./providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "./controlledExecutionIntent.mjs";

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "./dryRunDispatchPlan.mjs";

import {
  createSignedOwnerSimulationReview,
  evaluateOwnerSimulationReview,
} from "./ownerSimulationReview.mjs";

import {
  createControlledActionEvidenceBundle,
  verifyControlledActionEvidenceBundle,
} from "./controlledActionEvidenceBundle.mjs";

const SECRET =
  "nexus-day-666-local-preview-secret";

const NOW =
  "2026-07-10T10:00:00.000Z";

export function buildControlledActionEvidencePipeline({
  decision =
    "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
} = {}) {
  const action = {
    tenantId: "tenant-day-666",
    actionId: "action-day-666",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest:
      "sha256:day-666-evidence-payload",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-day-666",
    authorityEpoch: "epoch-day-666",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution =
    createSignedOwnerResolution({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      resolutionId:
        "admission-resolution-day-666",
      authorityEpoch:
        authority.authorityEpoch,
      nonce:
        "admission-nonce-day-666",
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
      resolution,
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
      adapterId: "adapter-alpha-day-666",
      providerId:
        "provider-alpha-day-666",
      status: "HEALTHY",
      priority: 1,
      capabilities: [
        "SAFE_DRAFT_ADMISSION",
      ],
    },
    {
      adapterId: "adapter-beta-day-666",
      providerId:
        "provider-beta-day-666",
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
        claimId: "claim-day-666",
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
      externalInvocationRequired: false,
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

  const outcomes = Object.fromEntries(
    plan.dispatchAttempts.map(
      (attempt, index) => [
        attempt.attemptId,
        index === 0
          ? "SIMULATED_RETRYABLE_FAILURE"
          : "SIMULATED_SUCCESS",
      ],
    ),
  );

  const simulation =
    simulateDryRunDispatch({
      plan,
      outcomes,
      now: NOW,
    });

  const review =
    createSignedOwnerSimulationReview({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      intentId: intent.intentId,
      claimId: claim.claimId,
      planId: plan.planId,
      simulationId:
        simulation.simulationId,
      reviewId:
        `review-day-666-${decision.toLowerCase()}`,
      nonce:
        `review-nonce-day-666-${decision.toLowerCase()}`,
      decision,
      issuedAt:
        "2026-07-10T10:00:00.000Z",
      expiresAt:
        "2026-07-10T10:10:00.000Z",
      ownerCommentDigest:
        "sha256:day-666-owner-review",
      signingSecret: SECRET,
    });

  const ownerResolution =
    evaluateOwnerSimulationReview({
      action,
      intent,
      claim,
      plan,
      simulation,
      review,
      replay: {
        consumedReviewIds: [],
        consumedNonces: [],
        permanentResolutionExists: false,
      },
      signingSecret: SECRET,
      now: NOW,
    });

  return {
    action,
    authority,
    admission,
    handoff,
    intent,
    claim,
    plan,
    simulation,
    ownerResolution,
    generatedAt: NOW,
  };
}

export function createControlledActionEvidencePreview({
  tamper = false,
  decision =
    "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
} = {}) {
  const pipeline =
    buildControlledActionEvidencePipeline({
      decision,
    });

  const evidence =
    createControlledActionEvidenceBundle(
      pipeline,
    );

  const bundleForVerification = tamper
    ? JSON.parse(JSON.stringify(evidence))
    : evidence;

  if (
    tamper &&
    bundleForVerification.records?.[5]
  ) {
    bundleForVerification.records[5]
      .payload.state =
      "UNTRUSTED_TAMPERED_STATE";
  }

  const verification =
    verifyControlledActionEvidenceBundle(
      bundleForVerification,
    );

  return {
    pipeline,
    evidence: bundleForVerification,
    verification,
  };
}
