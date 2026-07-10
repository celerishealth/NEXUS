import {
  enforceProtectedApiOperationalControl,
} from "../../../../lib/nexus/protectedApiOperationalControlGuard.mjs";

import {
  getProtectedApiOperationalControlStore,
} from "../../../../lib/nexus/protectedApiOperationalControlStore.mjs";
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
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../../../../lib/nexus/ownerAuthorizedActionAdmission.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_SECRET = "nexus-day-660-preview-only-demo-secret";

function buildDemoInput() {
  const now = "2026-07-10T10:00:00.000Z";

  const action = {
    tenantId: "tenant-demo-001",
    actionId: "action-demo-001",
    actionType: "CUSTOMER_FOLLOW_UP_DRAFT_ADMISSION",
    payloadDigest: "sha256:preview-payload-digest",
  };

  const authority = {
    tenantId: "tenant-demo-001",
    ownerId: "owner-demo-001",
    authorityEpoch: "owner-epoch-007",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-demo-001",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-demo-001",
    issuedAt: "2026-07-10T09:55:00.000Z",
    expiresAt: "2026-07-10T10:15:00.000Z",
    signingSecret: DEMO_SECRET,
  });

  return {
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
  };
}

export async function GET() {
  const admittedPreview =
    evaluateOwnerAuthorizedActionAdmission(buildDemoInput());

  const replayInput = buildDemoInput();
  replayInput.replay.consumedResolutionIds.push(
    replayInput.resolution.resolutionId,
  );

  const replayBlockedPreview =
    evaluateOwnerAuthorizedActionAdmission(replayInput);

  return NextResponse.json({
    service:
      "NEXUS Owner-Authorized Durable Action Admission Integration v1",
    safetyBoundary: {
      previewOnly: true,
      persistencePerformed: false,
      externalExecutionPerformed: false,
      liveMigrationPerformed: false,
      paymentAutomationAuthorized: false,
      whatsappAutoSendAuthorized: false,
      uncontrolledAiActionAuthorized: false,
    },
    scenarios: {
      validOwnerAdmission: admittedPreview,
      replayAttempt: replayBlockedPreview,
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
  const operationalControlGuard =
    await enforceProtectedApiOperationalControl(
      signedEnvelopeGuard.authorizationContext,
      tenantAuthorizationGuard
        .tenantAuthorizationContext,
      {
        requestId:
          requestGuard.requestId,
        mode:
          process.env
            .NEXUS_PROTECTED_API_OPERATIONAL_CONTROL_MODE,
        store:
          getProtectedApiOperationalControlStore(),
      },
    );

  if (!operationalControlGuard.ok) {
    return NextResponse.json(
      operationalControlGuard.error,
      {
        status:
          operationalControlGuard.status,
        headers:
          operationalControlGuard.headers,
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
    process.env.NEXUS_OWNER_RESOLUTION_SIGNING_SECRET?.trim();

  if (!signingSecret) {
    return NextResponse.json(
      {
        admitted: false,
        mode: "FAIL_CLOSED",
        reasonCodes: ["SIGNING_AUTHORITY_UNAVAILABLE"],
        externalExecutionPerformed: false,
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
        admitted: false,
        mode: "FAIL_CLOSED",
        reasonCodes: ["REQUEST_BODY_INVALID"],
        externalExecutionPerformed: false,
        persistencePerformed: false,
      },
      { status: 400 },
    );
  }

  const result = evaluateOwnerAuthorizedActionAdmission({
    action: body?.action,
    authority: body?.authority,
    resolution: body?.resolution,
    replay: body?.replay,
    signingSecret,
    now: new Date().toISOString(),
  });

  return NextResponse.json(result, {
    status: result.admitted ? 200 : 403,
  });
}






