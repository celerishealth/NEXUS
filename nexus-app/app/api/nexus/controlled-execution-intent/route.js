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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_SECRET =
  "nexus-day-662-controlled-intent-demo-secret";

function createPipeline() {
  const now = "2026-07-10T10:00:00.000Z";

  const action = {
    tenantId: "tenant-demo-662",
    actionId: "action-demo-662",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-662-preview-payload",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-demo-662",
    authorityEpoch: "authority-epoch-662",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-demo-662",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-demo-662",
    issuedAt: "2026-07-10T09:55:00.000Z",
    expiresAt: "2026-07-10T10:15:00.000Z",
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
          adapterId: "adapter-provider-alpha",
          providerId: "provider-alpha",
          status: "HEALTHY",
          priority: 1,
          capabilities: ["SAFE_DRAFT_ADMISSION"],
        },
        {
          adapterId: "adapter-provider-beta",
          providerId: "provider-beta",
          status: "HEALTHY",
          priority: 2,
          capabilities: ["SAFE_DRAFT_ADMISSION"],
        },
      ],
      recovery: {
        retryCount: 0,
        permanentOutcome: false,
      },
      now,
    });

  const intent = createControlledExecutionIntent({
    action,
    admission,
    handoff,
    now,
  });

  return {
    now,
    action,
    authority,
    admission,
    handoff,
    intent,
  };
}

export async function GET() {
  const pipeline = createPipeline();

  const validClaim = claimControlledExecutionIntent({
    intent: pipeline.intent,
    claim: {
      claimId: "claim-demo-662",
      intentId: pipeline.intent.intentId,
      tenantId: pipeline.action.tenantId,
      actionId: pipeline.action.actionId,
      ownerId: pipeline.authority.ownerId,
      role: "OWNER",
      issuedAt: "2026-07-10T09:59:00.000Z",
      expiresAt: "2026-07-10T10:10:00.000Z",
    },
    replay: {
      consumedClaimIds: [],
      activeClaimExists: false,
    },
    now: pipeline.now,
  });

  const replayedClaim =
    claimControlledExecutionIntent({
      intent: pipeline.intent,
      claim: {
        claimId: "claim-demo-662",
        intentId: pipeline.intent.intentId,
        tenantId: pipeline.action.tenantId,
        actionId: pipeline.action.actionId,
        ownerId: pipeline.authority.ownerId,
        role: "OWNER",
        issuedAt: "2026-07-10T09:59:00.000Z",
        expiresAt: "2026-07-10T10:10:00.000Z",
      },
      replay: {
        consumedClaimIds: ["claim-demo-662"],
        activeClaimExists: false,
      },
      now: pipeline.now,
    });

  return NextResponse.json({
    service:
      "NEXUS Controlled Execution Intent State Machine and Single-Owner Claim Guard v1",
    safetyBoundary: {
      previewOnly: true,
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
      liveMigrationPerformed: false,
      paymentAutomationAuthorized: false,
      whatsappAutoSendAuthorized: false,
      uncontrolledAiActionAuthorized: false,
    },
    pipeline: {
      admission: pipeline.admission,
      recoveryHandoff: pipeline.handoff,
      executionIntent: pipeline.intent,
      validOwnerClaim: validClaim,
      replayedClaim,
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
    process.env.NEXUS_OWNER_RESOLUTION_SIGNING_SECRET?.trim();

  if (!signingSecret) {
    return NextResponse.json(
      {
        created: false,
        claimed: false,
        mode: "FAIL_CLOSED",
        reasonCodes: ["SIGNING_AUTHORITY_UNAVAILABLE"],
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
        claimed: false,
        mode: "FAIL_CLOSED",
        reasonCodes: ["REQUEST_BODY_INVALID"],
        executionAuthorized: false,
        externalExecutionPerformed: false,
        providerInvocationPerformed: false,
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

  const intent = createControlledExecutionIntent({
    action: body?.action,
    admission,
    handoff,
    now,
  });

  const claim = body?.claim
    ? claimControlledExecutionIntent({
        intent,
        claim: body.claim,
        replay: body?.claimReplay,
        now,
      })
    : null;

  const accepted =
    intent.created === true &&
    (!claim || claim.claimed === true);

  return NextResponse.json(
    {
      admission,
      handoff,
      intent,
      claim,
    },
    {
      status: accepted ? 200 : 403,
    },
  );
}


