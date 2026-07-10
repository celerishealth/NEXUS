import { NextResponse } from "next/server";

import {
  inspectProtectedApiRequest,
} from "../../../../lib/nexus/protectedApiRequestGuard.mjs";

import {
  inspectProtectedApiSignedEnvelope,
} from "../../../../lib/nexus/protectedApiSignedEnvelope.mjs";

import {
  getProtectedApiReplayStore,
} from "../../../../lib/nexus/protectedApiReplayStore.mjs";

import {
  authorizeProtectedApiTenantOwnerContext,
} from "../../../../lib/nexus/protectedApiTenantAuthorizationGuard.mjs";

import {
  getProtectedApiTenantAuthorizationStore,
} from "../../../../lib/nexus/protectedApiTenantAuthorizationStore.mjs";

import {
  enforceProtectedApiRateLimit,
} from "../../../../lib/nexus/protectedApiRateLimitGuard.mjs";

import {
  getProtectedApiRateLimitStore,
} from "../../../../lib/nexus/protectedApiRateLimitStore.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    service:
      "NEXUS Protected API End-to-End Security Probe v1",
    state:
      "READY_FOR_SIGNED_POST_PROBE",
    protectedControls: [
      "REQUEST_SECURITY_GUARD",
      "OWNER_SIGNING_SECRET_GATE",
      "SIGNED_HMAC_ENVELOPE",
      "DURABLE_POSTGRES_REPLAY_LEDGER",
      "DURABLE_TENANT_OWNER_AUTHORIZATION",
      "DISTRIBUTED_POSTGRES_RATE_LIMIT",
      "DURABLE_SECURITY_EVENT_LEDGER",
    ],
    executionAuthorized: false,
    providerInvocationPerformed: false,
    customerDataMutationPerformed: false,
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

  const ownerResolutionSigningSecret =
    process.env
      .NEXUS_OWNER_RESOLUTION_SIGNING_SECRET
      ?.trim();

  if (!ownerResolutionSigningSecret) {
    return NextResponse.json(
      {
        accepted: false,
        mode: "FAIL_CLOSED",
        errorCode:
          "OWNER_SIGNING_AUTHORITY_UNAVAILABLE",
        requestId:
          requestGuard.requestId,
        executionAuthorized: false,
        providerInvocationPerformed: false,
        persistencePerformed: false,
      },
      {
        status: 503,
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

  return NextResponse.json(
    {
      accepted: true,
      state:
        "PROTECTED_API_SECURITY_CHAIN_VERIFIED",
      requestId:
        requestGuard.requestId,
      tenantId:
        tenantAuthorizationGuard
          .tenantAuthorizationContext
          .tenantId,
      ownerId:
        tenantAuthorizationGuard
          .tenantAuthorizationContext
          .ownerId,
      authorityEpoch:
        tenantAuthorizationGuard
          .tenantAuthorizationContext
          .authorityEpoch,
      signatureVerified:
        signedEnvelopeGuard
          .authorizationContext
          .signatureVerified,
      durableReplayVerified:
        signedEnvelopeGuard
          .authorizationContext
          .durableReplayPersistenceVerified,
      durableMembershipVerified:
        tenantAuthorizationGuard
          .tenantAuthorizationContext
          .durableMembershipVerified,
      durableRateLimitVerified:
        rateLimitGuard
          .rateLimitContext
          .durableCounterVerified,
      durableSecurityEventRecorded:
        rateLimitGuard
          .rateLimitContext
          .durableSecurityEventRecorded,
      remainingRequests:
        rateLimitGuard
          .rateLimitContext
          .remaining,
      executionAuthorized: false,
      providerInvocationPerformed: false,
      customerDataMutationPerformed: false,
    },
    {
      status: 200,
      headers:
        rateLimitGuard.headers,
    },
  );
}
