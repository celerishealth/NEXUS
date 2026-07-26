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

import { evaluateOwnerAuthorizedActionAdmission } from "../../../../lib/nexus/ownerAuthorizedActionAdmission.mjs";

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

import { evaluateOwnerSimulationReview } from "../../../../lib/nexus/ownerSimulationReview.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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






