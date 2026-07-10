import {
  inspectProtectedApiSignedEnvelope,
} from "../../../../lib/nexus/protectedApiSignedEnvelope.mjs";
import {
  inspectProtectedApiRequest,
} from "../../../../lib/nexus/protectedApiRequestGuard.mjs";
import { NextResponse } from "next/server";

import {
  createControlledActionEvidenceBundle,
  verifyControlledActionEvidenceBundle,
} from "../../../../lib/nexus/controlledActionEvidenceBundle.mjs";

import {
  createControlledActionEvidencePreview,
} from "../../../../lib/nexus/controlledActionEvidencePreview.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const valid =
    createControlledActionEvidencePreview();

  const tampered =
    createControlledActionEvidencePreview({
      tamper: true,
    });

  return NextResponse.json({
    service:
      "NEXUS Tamper-Evident Controlled Action Evidence Bundle v1",
    safetyBoundary: {
      evidenceOnly: true,
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
      verifiedEvidence: {
        bundle: valid.evidence,
        verification:
          valid.verification,
      },
      tamperedEvidence: {
        bundle: tampered.evidence,
        verification:
          tampered.verification,
      },
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
  const signingSecret =
    process.env
      .NEXUS_OWNER_RESOLUTION_SIGNING_SECRET
      ?.trim();

  if (!signingSecret) {
    return NextResponse.json(
      {
        created: false,
        valid: false,
        state: "FAIL_CLOSED",
        reasonCodes: [
          "SIGNING_AUTHORITY_UNAVAILABLE",
        ],
        executionAuthorized: false,
        externalExecutionPerformed: false,
        providerInvocationPerformed: false,
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
        created: false,
        valid: false,
        state: "FAIL_CLOSED",
        reasonCodes: [
          "REQUEST_BODY_INVALID",
        ],
        executionAuthorized: false,
        externalExecutionPerformed: false,
        providerInvocationPerformed: false,
        persistencePerformed: false,
      },
      { status: 400 },
    );
  }

  if (body?.bundle) {
    const verification =
      verifyControlledActionEvidenceBundle(
        body.bundle,
      );

    return NextResponse.json(
      { verification },
      {
        status: verification.valid
          ? 200
          : 403,
      },
    );
  }

  const bundle =
    createControlledActionEvidenceBundle({
      action: body?.action,
      admission: body?.admission,
      handoff: body?.handoff,
      intent: body?.intent,
      claim: body?.claim,
      plan: body?.plan,
      simulation: body?.simulation,
      ownerResolution:
        body?.ownerResolution,
      generatedAt:
        new Date().toISOString(),
    });

  const verification =
    verifyControlledActionEvidenceBundle(
      bundle,
    );

  return NextResponse.json(
    {
      bundle,
      verification,
    },
    {
      status:
        bundle.created &&
        verification.valid
          ? 200
          : 403,
    },
  );
}


