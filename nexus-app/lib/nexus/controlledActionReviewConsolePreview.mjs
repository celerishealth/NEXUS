import {
  createSignedOwnerResolution,
} from "./ownerAuthorizedActionAdmission.mjs";

import {
  createSignedOwnerSimulationReview,
} from "./ownerSimulationReview.mjs";

import {
  finalizeControlledActionReviewPipeline,
  prepareControlledActionReviewPipeline,
} from "./controlledActionReviewOrchestrator.mjs";

const SECRET =
  "nexus-day-667-console-preview-secret";

const NOW =
  "2026-07-10T10:00:00.000Z";

export function createControlledActionReviewScenario({
  decision =
    "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
  simulationMode =
    "FAILOVER_SUCCESS",
  forgedAdmission = false,
  forgedReview = false,
  foreignTenant = false,
  foreignOwnerClaim = false,
  singleProvider = false,
} = {}) {
  const action = {
    tenantId:
      "tenant-day-667-preview",
    actionId:
      "action-day-667-preview",
    actionType:
      "SAFE_DRAFT_ADMISSION",
    payloadDigest:
      "sha256:day-667-console-preview",
  };

  const authority = {
    tenantId: foreignTenant
      ? "tenant-foreign-day-667"
      : action.tenantId,
    ownerId:
      "owner-day-667-preview",
    authorityEpoch:
      "authority-epoch-day-667",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const signedResolution =
    createSignedOwnerResolution({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      resolutionId:
        "resolution-day-667-preview",
      authorityEpoch:
        authority.authorityEpoch,
      nonce:
        "nonce-day-667-preview",
      issuedAt:
        "2026-07-10T09:55:00.000Z",
      expiresAt:
        "2026-07-10T10:15:00.000Z",
      signingSecret: SECRET,
    });

  const resolution = forgedAdmission
    ? {
        ...signedResolution,
        signature: "0".repeat(64),
      }
    : signedResolution;

  const adapters = [
    {
      adapterId:
        "adapter-alpha-day-667",
      providerId:
        "provider-alpha-day-667",
      status: "HEALTHY",
      priority: 1,
      capabilities: [
        "SAFE_DRAFT_ADMISSION",
      ],
    },
    {
      adapterId:
        "adapter-beta-day-667",
      providerId:
        "provider-beta-day-667",
      status: "HEALTHY",
      priority: 2,
      capabilities: [
        "SAFE_DRAFT_ADMISSION",
      ],
    },
  ];

  const selectedAdapters =
    singleProvider
      ? [adapters[0]]
      : adapters;

  const adapterManifests =
    selectedAdapters.map(
      (adapter) => ({
        adapterId: adapter.adapterId,
        providerId: adapter.providerId,
        contractVersion:
          "nexus.adapter.contract.v1",
        status: "READY",
        supportsDryRun: true,
        externalInvocationRequired:
          false,
      }),
    );

  const prepared =
    prepareControlledActionReviewPipeline({
      action,
      authority,
      resolution,
      admissionReplay: {
        consumedResolutionIds: [],
        consumedNonces: [],
        retryCount: 0,
        permanentOutcome: false,
      },
      adapters: selectedAdapters,
      recovery: {
        retryCount: 0,
        permanentOutcome: false,
      },
      claim: {
        claimId:
          "claim-day-667-preview",
        ownerId: foreignOwnerClaim
          ? "owner-foreign-day-667"
          : authority.ownerId,
        role: "OWNER",
        issuedAt:
          "2026-07-10T09:59:00.000Z",
        expiresAt:
          "2026-07-10T10:10:00.000Z",
      },
      claimReplay: {
        consumedClaimIds: [],
        activeClaimExists: false,
      },
      adapterManifests,
      simulationMode,
      signingSecret: SECRET,
      now: NOW,
    });

  const signedReview =
    createSignedOwnerSimulationReview({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      intentId:
        prepared.intent.intentId,
      claimId:
        prepared.claim.claimId,
      planId:
        prepared.plan.planId,
      simulationId:
        prepared.simulation
          .simulationId,
      reviewId:
        `review-day-667-${decision.toLowerCase()}`,
      nonce:
        `review-nonce-day-667-${decision.toLowerCase()}`,
      decision,
      issuedAt:
        "2026-07-10T10:00:00.000Z",
      expiresAt:
        "2026-07-10T10:10:00.000Z",
      ownerCommentDigest:
        "sha256:day-667-owner-review",
      signingSecret: SECRET,
    });

  const review = forgedReview
    ? {
        ...signedReview,
        signature: "0".repeat(64),
      }
    : signedReview;

  return finalizeControlledActionReviewPipeline({
    prepared,
    review,
    reviewReplay: {
      consumedReviewIds: [],
      consumedNonces: [],
      permanentResolutionExists:
        false,
    },
    signingSecret: SECRET,
    now: NOW,
    generatedAt: NOW,
  });
}
