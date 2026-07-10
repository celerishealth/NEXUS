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
  getControlledActionStore,
} from "../../../../lib/nexus/controlledActionStore.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail({
  status,
  errorCode,
  detail,
  requestId,
  headers,
}) {
  return NextResponse.json(
    {
      accepted: false,
      mode: "FAIL_CLOSED",
      errorCode,
      detail,
      requestId,
      executionAuthorized: false,
      providerInvocationPerformed:
        false,
      externalExecutionPerformed:
        false,
    },
    {
      status,
      headers,
    },
  );
}

export async function GET() {
  return NextResponse.json({
    service:
      "NEXUS Controlled Action State API v1",
    operations: [
      "CREATE",
      "TRANSITION",
    ],
    executedStateExists: false,
    executionAuthorized: false,
    providerInvocationPerformed: false,
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
    return fail({
      status: 503,
      errorCode:
        "OWNER_SIGNING_AUTHORITY_UNAVAILABLE",
      detail:
        "Owner signing authority is unavailable.",
      requestId:
        requestGuard.requestId,
      headers:
        requestGuard.headers,
    });
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

  let body;

  try {
    body =
      await request.json();
  } catch {
    return fail({
      status: 400,
      errorCode:
        "CONTROLLED_ACTION_BODY_INVALID",
      detail:
        "A valid JSON request body is required.",
      requestId:
        requestGuard.requestId,
      headers:
        rateLimitGuard.headers,
    });
  }

  const operation =
    typeof body?.operation ===
      "string"
      ? body.operation
          .trim()
          .toUpperCase()
      : "";

  const tenantContext =
    tenantAuthorizationGuard
      .tenantAuthorizationContext;

  const store =
    getControlledActionStore();

  if (operation === "CREATE") {
    const result =
      await store.createAction({
        tenantId:
          tenantContext.tenantId,
        ownerId:
          tenantContext.ownerId,
        actionId:
          body.actionId,
        actionType:
          body.actionType,
        idempotencyKey:
          body.idempotencyKey,
        payload:
          body.payload,
        requestId:
          requestGuard.requestId,
        authorityEpoch:
          tenantContext.authorityEpoch,
      });

    if (!result.ok) {
      return fail({
        status:
          result.conflict
            ? 409
            : 503,
        errorCode:
          result.errorCode,
        detail:
          result.conflict
            ? "The idempotency key is already bound to different action content."
            : "The controlled action could not be stored.",
        requestId:
          requestGuard.requestId,
        headers:
          rateLimitGuard.headers,
      });
    }

    return NextResponse.json(
      {
        accepted: true,
        operation:
          "CREATE",
        created:
          result.created,
        idempotentReplay:
          result.idempotentReplay,
        action:
          result.action,
        executionAuthorized:
          false,
        providerInvocationPerformed:
          false,
      },
      {
        status:
          result.created
            ? 201
            : 200,
        headers:
          rateLimitGuard.headers,
      },
    );
  }

  if (operation === "TRANSITION") {
    const result =
      await store.transitionAction({
        tenantId:
          tenantContext.tenantId,
        ownerId:
          tenantContext.ownerId,
        actionId:
          body.actionId,
        expectedVersion:
          body.expectedVersion,
        toState:
          body.toState,
        requestId:
          requestGuard.requestId,
        authorityEpoch:
          tenantContext.authorityEpoch,
      });

    if (!result.ok) {
      const status =
        result.notFound
          ? 404
          : result.forbidden
            ? 403
            : result.conflict
              ? 409
              : 503;

      return fail({
        status,
        errorCode:
          result.errorCode,
        detail:
          "The controlled action transition was rejected.",
        requestId:
          requestGuard.requestId,
        headers:
          rateLimitGuard.headers,
      });
    }

    return NextResponse.json(
      {
        accepted: true,
        operation:
          "TRANSITION",
        action:
          result.action,
        event:
          result.event,
        executionAuthorized:
          false,
        providerInvocationPerformed:
          false,
      },
      {
        status: 200,
        headers:
          rateLimitGuard.headers,
      },
    );
  }

  return fail({
    status: 400,
    errorCode:
      "CONTROLLED_ACTION_OPERATION_INVALID",
    detail:
      "Operation must be CREATE or TRANSITION.",
    requestId:
      requestGuard.requestId,
    headers:
      rateLimitGuard.headers,
  });
}
