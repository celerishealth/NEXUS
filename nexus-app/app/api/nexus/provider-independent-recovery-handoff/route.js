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
import {
  createProviderIndependentRecoveryHandoff,
} from "../../../../lib/nexus/providerIndependentRecoveryHandoff.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_SECRET =
  "nexus-day-661-provider-independent-demo-secret";

function buildDemoInput() {
  const now = "2026-07-10T10:00:00.000Z";

  const action = {
    tenantId: "tenant-demo-001",
    actionId: "action-demo-661",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-661-preview-payload",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-demo-001",
    authorityEpoch: "authority-epoch-661",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-demo-661",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-demo-661",
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

  return {
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
  };
}

export async function GET() {
  const validInput = buildDemoInput();

  const preparedHandoff =
    createProviderIndependentRecoveryHandoff(validInput);

  const noFailoverInput = buildDemoInput();
  noFailoverInput.adapters = [
    noFailoverInput.adapters[0],
  ];

  const noFailoverHandoff =
    createProviderIndependentRecoveryHandoff(
      noFailoverInput,
    );

  return NextResponse.json({
    service:
      "NEXUS Provider-Independent Recovery Handoff Integration v1",
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
    scenarios: {
      durableProviderIndependentHandoff: preparedHandoff,
      missingProviderFailover: noFailoverHandoff,
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
    process.env.NEXUS_OWNER_RESOLUTION_SIGNING_SECRET?.trim();

  if (!signingSecret) {
    return NextResponse.json(
      {
        prepared: false,
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
        prepared: false,
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

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action: body?.action,
      authority: body?.authority,
      resolution: body?.resolution,
      replay: body?.replay,
      signingSecret,
      now: new Date().toISOString(),
    });

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action: body?.action,
      admission,
      adapters: body?.adapters,
      recovery: body?.recovery,
      now: new Date().toISOString(),
    });

  return NextResponse.json(
    {
      admission,
      handoff,
    },
    {
      status: handoff.prepared ? 200 : 403,
    },
  );
}





