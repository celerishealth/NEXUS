import {
  randomUUID,
} from "node:crypto";

import {
  PROTECTED_API_OPERATIONAL_CONTROL_MODE,
} from "./protectedApiOperationalControlStore.mjs";

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function createRequestId(value) {
  return (
    normalizeString(value) ||
    `nexus-${randomUUID()}`
  );
}

function createHeaders({
  requestId,
  retryAfterSeconds = 0,
}) {
  const headers = {
    "Cache-Control":
      "no-store, max-age=0",
    "X-Content-Type-Options":
      "nosniff",
    "X-NEXUS-Request-ID":
      requestId,
    Vary: "Origin",
  };

  if (retryAfterSeconds > 0) {
    headers["Retry-After"] =
      String(
        retryAfterSeconds,
      );
  }

  return Object.freeze(headers);
}

function deny({
  status,
  errorCode,
  detail,
  requestId,
  securityEventId = null,
  retryAfterSeconds = 0,
}) {
  return Object.freeze({
    ok: false,
    status,
    requestId,
    headers:
      createHeaders({
        requestId,
        retryAfterSeconds,
      }),
    error: Object.freeze({
      accepted: false,
      mode: "FAIL_CLOSED",
      errorCode,
      detail,
      requestId,
      securityEventId,
      retryAfterSeconds,
      executionAuthorized: false,
      externalExecutionPerformed:
        false,
      providerInvocationPerformed:
        false,
      persistencePerformed:
        false,
    }),
  });
}

export async function enforceProtectedApiOperationalControl(
  signedAuthorizationContext,
  tenantAuthorizationContext,
  options = {},
) {
  const requestId =
    createRequestId(
      options.requestId,
    );

  const mode =
    normalizeString(
      options.mode ??
        process.env
          .NEXUS_PROTECTED_API_OPERATIONAL_CONTROL_MODE,
    );

  if (
    mode !==
    PROTECTED_API_OPERATIONAL_CONTROL_MODE
  ) {
    return deny({
      status: 503,
      errorCode:
        "OPERATIONAL_CONTROL_REQUIRED",
      detail:
        "Protected APIs require the durable PostgreSQL operational circuit breaker.",
      requestId,
      retryAfterSeconds: 60,
    });
  }

  if (
    signedAuthorizationContext
      ?.schemaVersion !==
      "nexus.protected-api-authorization-context.v1" ||
    signedAuthorizationContext
      ?.signatureVerified !== true ||
    signedAuthorizationContext
      ?.bodyIntegrityVerified !== true
  ) {
    return deny({
      status: 401,
      errorCode:
        "OPERATIONAL_CONTROL_SIGNED_CONTEXT_INVALID",
      detail:
        "A verified signed authorization context is required.",
      requestId,
    });
  }

  if (
    tenantAuthorizationContext
      ?.schemaVersion !==
      "nexus.protected-api-tenant-authorization-context.v1" ||
    tenantAuthorizationContext
      ?.durableMembershipVerified !==
      true
  ) {
    return deny({
      status: 401,
      errorCode:
        "OPERATIONAL_CONTROL_TENANT_CONTEXT_INVALID",
      detail:
        "A verified durable tenant-owner context is required.",
      requestId,
    });
  }

  const tenantId =
    normalizeString(
      signedAuthorizationContext
        .tenantId,
    );

  const ownerId =
    normalizeString(
      signedAuthorizationContext
        .ownerId,
    );

  const routeKey =
    normalizeString(
      signedAuthorizationContext
        .pathname,
    );

  if (
    tenantId !==
      normalizeString(
        tenantAuthorizationContext
          .tenantId,
      ) ||
    ownerId !==
      normalizeString(
        tenantAuthorizationContext
          .ownerId,
      )
  ) {
    return deny({
      status: 403,
      errorCode:
        "OPERATIONAL_CONTROL_IDENTITY_MISMATCH",
      detail:
        "Signed and durable tenant-owner identities do not match.",
      requestId,
    });
  }

  if (
    !tenantId ||
    !ownerId ||
    !routeKey
  ) {
    return deny({
      status: 401,
      errorCode:
        "OPERATIONAL_CONTROL_IDENTITY_INCOMPLETE",
      detail:
        "Tenant, owner, and route identities are required.",
      requestId,
    });
  }

  const store =
    options.store;

  if (
    !store ||
    typeof store.evaluateAccess !==
      "function"
  ) {
    return deny({
      status: 503,
      errorCode:
        "OPERATIONAL_CONTROL_STORE_UNAVAILABLE",
      detail:
        "The durable operational-control store is unavailable.",
      requestId,
      retryAfterSeconds: 60,
    });
  }

  const result =
    await store.evaluateAccess({
      tenantId,
      ownerId,
      routeKey,
      requestId,
    });

  if (!result?.ok) {
    return deny({
      status: 503,
      errorCode:
        result?.errorCode ??
        "OPERATIONAL_CONTROL_STORE_FAILURE",
      detail:
        "The operational circuit breaker failed closed.",
      requestId,
      retryAfterSeconds: 60,
    });
  }

  if (result.allowed !== true) {
    return deny({
      status: 503,
      errorCode:
        result.initialized === true
          ? "PROTECTED_API_OPERATIONALLY_BLOCKED"
          : "OPERATIONAL_CONTROL_NOT_INITIALIZED",
      detail:
        result.initialized === true
          ? "Protected API access is blocked by an authorized operational control."
          : "The mandatory global operational control has not been initialized.",
      requestId,
      securityEventId:
        result.eventId,
      retryAfterSeconds: 60,
    });
  }

  return Object.freeze({
    ok: true,
    status: 200,
    requestId,
    headers:
      createHeaders({
        requestId,
      }),
    operationalControlContext:
      Object.freeze({
        schemaVersion:
          "nexus.protected-api-operational-control-context.v1",
        tenantId,
        ownerId,
        routeKey,
        authorityEpoch:
          result.authorityEpoch,
        globalControlInitialized:
          true,
        accessOpen:
          true,
        durableControlVerified:
          true,
        durableIncidentEvidenceRecorded:
          true,
        securityEventId:
          result.eventId,
        executionAuthorized:
          false,
        providerInvocationAuthorized:
          false,
      }),
  });
}

export function getProtectedApiOperationalControlGuardPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-operational-control-guard-posture.v1",
    requiredMode:
      PROTECTED_API_OPERATIONAL_CONTROL_MODE,
    controls: Object.freeze([
      "SIGNED_CONTEXT_REQUIRED",
      "DURABLE_TENANT_CONTEXT_REQUIRED",
      "IDENTITY_BINDING_REQUIRED",
      "EXPLICIT_GLOBAL_OPEN_REQUIRED",
      "GLOBAL_EMERGENCY_BLOCK",
      "TENANT_EMERGENCY_BLOCK",
      "ROUTE_EMERGENCY_BLOCK",
      "TENANT_ROUTE_EMERGENCY_BLOCK",
      "DURABLE_ALLOWED_EVENT",
      "DURABLE_BLOCKED_EVENT",
      "UNINITIALIZED_STATE_FAIL_CLOSED",
      "DATABASE_FAILURE_FAIL_CLOSED",
    ]),
    executionAuthorized:
      false,
    providerInvocationAuthorized:
      false,
  });
}
