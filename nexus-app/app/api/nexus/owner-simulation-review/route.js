import {
  authorizeProtectedApiTenantOwnerContext,
} from "../../../../lib/nexus/protectedApiTenantAuthorizationGuard.mjs";

import {
  getProtectedApiTenantAuthorizationStore,
} from "../../../../lib/nexus/protectedApiTenantAuthorizationStore.mjs";
import {
  getProtectedApiReplayStore,
} from "../../../../lib/nexus/protectedApiReplayStore.mjs";
import {
  inspectProtectedApiSignedEnvelope,
} from "../../../../lib/nexus/protectedApiSignedEnvelope.mjs";
import {
  inspectProtectedApiRequest,
} from "../../../../lib/nexus/protectedApiRequestGuard.mjs";
import { NextResponse } from "next/server";

import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../../../../lib/nexus/ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "../../../../lib/nexus/providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "../../../../lib/nexus/controlledExecutionIntent.mjs";

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "../../../../lib/nexus/dryRunDispatchPlan.mjs";

import {
  createSignedOwnerSimulationReview,
  evaluateOwnerSimulationReview,
} from "../../../../lib/nexus/ownerSimulationReview.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_SECRET =
  "nexus-day-665-owner-review-demo-secret";

function buildPipeline() {
  const now =
    "2026-07-10T10:00:00.000Z";

  const action = {
    tenantId: "tenant-demo-665",
    actionId: "action-demo-665",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest:
      "sha256:day-665-preview-payload",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-demo-665",
    authorityEpoch:
      "authority-epoch-665",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution =
    createSignedOwnerResolution({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      resolutionId:
        "resolution-demo-665",
      authorityEpoch:
        authority.authorityEpoch,
      nonce: "nonce-demo-665",
      issuedAt:
        "2026-07-10T09:55:00.000Z",
      expiresAt:
        "2026-07-10T10:15:00.000Z",
      signingSecret: DEMO_SECRET,
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
      signingSecret: DEMO_SECRET,
      now,
    });

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action,
      admission,
      adapters: [
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
      ],
      recovery: {
        retryCount: 0,
        permanentOutcome: false,
      },
      now,
    });

  const intent =
    createControlledExecutionIntent({
      action,
      admission,
      handoff,
      now,
    });

  const claim =
    claimControlledExecutionIntent({
      intent,
      claim: {
        claimId: "claim-demo-665",
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
      now,
    });

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests: [
        {
          adapterId:
            "adapter-alpha-665",
          providerId:
            "provider-alpha-665",
          contractVersion:
            "nexus.adapter.contract.v1",
          status: "READY",
          supportsDryRun: true,
          externalInvocationRequired:
            false,
        },
        {
          adapterId:
            "adapter-beta-665",
          providerId:
            "provider-beta-665",
          contractVersion:
            "nexus.adapter.contract.v1",
          status: "READY",
          supportsDryRun: true,
          externalInvocationRequired:
            false,
        },
      ],
      now,
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
      now,
    });

  return {
    now,
    action,
    authority,
    admission,
    handoff,
    intent,
    claim,
    plan,
    simulation,
  };
}

function createReview(
  pipeline,
  decision,
  reviewId,
  nonce,
) {
  return createSignedOwnerSimulationReview({
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
    reviewId,
    nonce,
    decision,
    issuedAt:
      "2026-07-10T10:00:00.000Z",
    expiresAt:
      "2026-07-10T10:10:00.000Z",
    ownerCommentDigest:
      "sha256:owner-reviewed-simulation",
    signingSecret: DEMO_SECRET,
  });
}

export async function GET() {
  const approvalPipeline =
    buildPipeline();

  const approvalReview = createReview(
    approvalPipeline,
    "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
    "review-approve-665",
    "review-nonce-approve-665",
  );

  const approved =
    evaluateOwnerSimulationReview({
      ...approvalPipeline,
      review: approvalReview,
      replay: {
        consumedReviewIds: [],
        consumedNonces: [],
        permanentResolutionExists:
          false,
      },
      signingSecret: DEMO_SECRET,
      now: approvalPipeline.now,
    });

  const rejectionPipeline =
    buildPipeline();

  const rejectionReview = createReview(
    rejectionPipeline,
    "REJECT_PERMANENTLY",
    "review-reject-665",
    "review-nonce-reject-665",
  );

  const rejected =
    evaluateOwnerSimulationReview({
      ...rejectionPipeline,
      review: rejectionReview,
      replay: {
        consumedReviewIds: [],
        consumedNonces: [],
        permanentResolutionExists:
          false,
      },
      signingSecret: DEMO_SECRET,
      now: rejectionPipeline.now,
    });

  const replayed =
    evaluateOwnerSimulationReview({
      ...approvalPipeline,
      review: approvalReview,
      replay: {
        consumedReviewIds: [
          approvalReview.reviewId,
        ],
        consumedNonces: [],
        permanentResolutionExists:
          false,
      },
      signingSecret: DEMO_SECRET,
      now: approvalPipeline.now,
    });

  return NextResponse.json({
    service:
      "NEXUS Signed Owner Simulation Review and Immutable Resolution Gate v1",
    safetyBoundary: {
      ownerReviewOnly: true,
      executionAuthorized: false,
      externalExecutionPerformed:
        false,
      providerInvocationPerformed:
        false,
      persistencePerformed: false,
      paymentAutomationAuthorized:
        false,
      whatsappAutoSendAuthorized:
        false,
      uncontrolledAiActionAuthorized:
        false,
    },
    scenarios: {
      approvedForFurtherControlledReview:
        approved,
      permanentlyRejected: rejected,
      replayedReviewBlocked:
        replayed,
    },
  });
}

export async function POST(request) {
  const requestGuard =
    await inspectProtectedApiRequest(
      request,
    );

  if (!requestGuard.ok) {
    return NextResponse.json(
      requestGuard.error,
      {
        status:
          requestGuard.status,
        headers:
          requestGuard.headers,
      },
    );
  }
  const signedEnvelopeGuard =
    await inspectProtectedApiSignedEnvelope(
      request,
      {
        requestId:
          requestGuard.requestId,
        replayMode:
          process.env
            .NEXUS_PROTECTED_API_REPLAY_MODE,
        replayStore:
          getProtectedApiReplayStore(),
      },
    );

  if (!signedEnvelopeGuard.ok) {
    return NextResponse.json(
      signedEnvelopeGuard.error,
      {
        status:
          signedEnvelopeGuard.status,
        headers:
          signedEnvelopeGuard.headers,
      },
    );
  }
  const tenantAuthorizationGuard =
    await authorizeProtectedApiTenantOwnerContext(
      signedEnvelopeGuard.authorizationContext,
      {
        requestId:
          requestGuard.requestId,
        mode:
          process.env
            .NEXUS_TENANT_AUTHORIZATION_MODE,
        store:
          getProtectedApiTenantAuthorizationStore(),
      },
    );

  if (!tenantAuthorizationGuard.ok) {
    return NextResponse.json(
      tenantAuthorizationGuard.error,
      {
        status:
          tenantAuthorizationGuard.status,
        headers:
          tenantAuthorizationGuard.headers,
      },
    );
  }
  const signingSecret =
    process.env
      .NEXUS_OWNER_RESOLUTION_SIGNING_SECRET
      ?.trim();

  if (!signingSecret) {
    return NextResponse.json(
      {
        accepted: false,
        state: "FAIL_CLOSED",
        reasonCodes: [
          "OWNER_REVIEW_SIGNING_AUTHORITY_UNAVAILABLE",
        ],
        executionAuthorized: false,
        externalExecutionPerformed:
          false,
        providerInvocationPerformed:
          false,
        persistencePerformed: false,
      },
      { status: 503 },
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        accepted: false,
        state: "FAIL_CLOSED",
        reasonCodes: [
          "REQUEST_BODY_INVALID",
        ],
        executionAuthorized: false,
        externalExecutionPerformed:
          false,
        providerInvocationPerformed:
          false,
        persistencePerformed: false,
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action: body?.action,
      authority: body?.authority,
      resolution: body?.resolution,
      replay: body?.admissionReplay,
      signingSecret,
      now,
    });

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action: body?.action,
      admission,
      adapters: body?.adapters,
      recovery: body?.recovery,
      now,
    });

  const intent =
    createControlledExecutionIntent({
      action: body?.action,
      admission,
      handoff,
      now,
    });

  const claim =
    claimControlledExecutionIntent({
      intent,
      claim: body?.claim,
      replay: body?.claimReplay,
      now,
    });

  const plan =
    createDeterministicDryRunDispatchPlan({
      action: body?.action,
      handoff,
      intent,
      claim,
      adapterManifests:
        body?.adapterManifests,
      now,
    });

  const simulation =
    simulateDryRunDispatch({
      plan,
      outcomes: body?.outcomes,
      now,
    });

  const ownerResolution =
    evaluateOwnerSimulationReview({
      action: body?.action,
      intent,
      claim,
      plan,
      simulation,
      review: body?.review,
      replay: body?.reviewReplay,
      signingSecret,
      now,
    });

  return NextResponse.json(
    {
      admission,
      handoff,
      intent,
      claim,
      plan,
      simulation,
      ownerResolution,
    },
    {
      status:
        ownerResolution.accepted
          ? 200
          : 403,
    },
  );
}




