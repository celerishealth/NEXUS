import {
  enforceProtectedApiRateLimit,
} from "../../../../lib/nexus/protectedApiRateLimitGuard.mjs";

import {
  getProtectedApiRateLimitStore,
} from "../../../../lib/nexus/protectedApiRateLimitStore.mjs";
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
  finalizeControlledActionReviewPipeline,
  prepareControlledActionReviewPipeline,
} from "../../../../lib/nexus/controlledActionReviewOrchestrator.mjs";

import {
  createControlledActionReviewScenario,
} from "../../../../lib/nexus/controlledActionReviewConsolePreview.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    service:
      "NEXUS Unified Owner-Controlled Action Review Console v1",

    safetyBoundary: {
      reviewAndEvidenceOnly: true,
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
      publicLaunchAuthorized: false,
      paymentAutomationAuthorized: false,
      whatsappAutoSendAuthorized: false,
      uncontrolledAiActionAuthorized: false,
    },

    scenarios: {
      approvedCandidate:
        createControlledActionReviewScenario(),

      permanentOwnerRejection:
        createControlledActionReviewScenario({
          decision:
            "REJECT_PERMANENTLY",
        }),

      ownerReworkRequired:
        createControlledActionReviewScenario({
          decision:
            "REQUIRE_REWORK",
        }),

      forgedOwnerReviewBlocked:
        createControlledActionReviewScenario({
          forgedReview: true,
        }),
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
  const rateLimitGuard =
    await enforceProtectedApiRateLimit(
      signedEnvelopeGuard.authorizationContext,
      tenantAuthorizationGuard
        .tenantAuthorizationContext,
      {
        requestId:
          requestGuard.requestId,
        mode:
          process.env
            .NEXUS_PROTECTED_API_RATE_LIMIT_MODE,
        store:
          getProtectedApiRateLimitStore(),
        nowMs:
          Date.now(),
      },
    );

  if (!rateLimitGuard.ok) {
    return NextResponse.json(
      rateLimitGuard.error,
      {
        status:
          rateLimitGuard.status,
        headers:
          rateLimitGuard.headers,
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
        completed: false,
        state: "FAIL_CLOSED",
        reasonCodes: [
          "SIGNING_AUTHORITY_UNAVAILABLE",
        ],
        executionAuthorized: false,
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
        completed: false,
        state: "FAIL_CLOSED",
        reasonCodes: [
          "REQUEST_BODY_INVALID",
        ],
        executionAuthorized: false,
        providerInvocationPerformed:
          false,
        persistencePerformed: false,
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const prepared =
    prepareControlledActionReviewPipeline({
      action: body?.action,
      authority: body?.authority,
      resolution: body?.resolution,
      admissionReplay:
        body?.admissionReplay,
      adapters: body?.adapters,
      recovery: body?.recovery,
      claim: body?.claim,
      claimReplay: body?.claimReplay,
      adapterManifests:
        body?.adapterManifests,
      outcomes: body?.outcomes,
      simulationMode:
        body?.simulationMode,
      signingSecret,
      now,
    });

  if (!body?.review) {
    return NextResponse.json(
      {
        prepared,
        ownerReviewRequired:
          prepared.preparedForOwnerReview,
      },
      {
        status:
          prepared.preparedForOwnerReview
            ? 200
            : 403,
      },
    );
  }

  const result =
    finalizeControlledActionReviewPipeline({
      prepared,
      review: body.review,
      reviewReplay:
        body?.reviewReplay,
      signingSecret,
      now,
      generatedAt: now,
    });

  return NextResponse.json(result, {
    status: result.completed
      ? 200
      : 403,
  });
}





