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

