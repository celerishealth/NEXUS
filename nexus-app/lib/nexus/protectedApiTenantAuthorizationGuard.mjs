import {
  randomUUID,
} from "node:crypto";

import {
  TENANT_AUTHORIZATION_MODE,
} from "./protectedApiTenantAuthorizationStore.mjs";

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function createRequestId(requestId) {
  const normalized =
    normalizeString(requestId);

  return normalized ||
    `nexus-${randomUUID()}`;
}

function createHeaders(requestId) {
  return Object.freeze({
    "Cache-Control":
      "no-store, max-age=0",
    "X-Content-Type-Options":
      "nosniff",
    "X-NEXUS-Request-ID":
      requestId,
    Vary: "Origin",
  });
}

function deny({
  status,
  errorCode,
  detail,
  requestId,
}) {
  return Object.freeze({
    ok: false,
    status,
    requestId,
    headers:
      createHeaders(requestId),
    error: Object.freeze({
      accepted: false,
      mode: "FAIL_CLOSED",
      errorCode,
      detail,
      requestId,
      executionAuthorized: false,
      externalExecutionPerformed:
        false,
      providerInvocationPerformed:
        false,
      persistencePerformed: false,
    }),
  });
}

export async function authorizeProtectedApiTenantOwnerContext(
  authorizationContext,
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
          .NEXUS_TENANT_AUTHORIZATION_MODE,
    );

  if (
    mode !==
    TENANT_AUTHORIZATION_MODE
  ) {
    return deny({
      status: 503,
      errorCode:
        "TENANT_AUTHORIZATION_REQUIRED",
      detail:
        "Protected APIs require the PostgreSQL tenant-owner membership authorization mode.",
      requestId,
    });
  }

  if (
    authorizationContext
      ?.schemaVersion !==
      "nexus.protected-api-authorization-context.v1" ||
    authorizationContext
      ?.signatureVerified !== true ||
    authorizationContext
      ?.timestampVerified !== true ||
    authorizationContext
      ?.bodyIntegrityVerified !== true
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_AUTHORIZATION_CONTEXT_INVALID",
      detail:
        "A verified signed request context is required.",
      requestId,
    });
  }

  const tenantId =
    normalizeString(
      authorizationContext.tenantId,
    );

  const ownerId =
    normalizeString(
      authorizationContext.ownerId,
    );

  if (!tenantId || !ownerId) {
    return deny({
      status: 401,
      errorCode:
        "TENANT_OWNER_IDENTITY_INVALID",
      detail:
        "A tenant-bound and owner-bound identity is required.",
      requestId,
    });
  }

  const isProduction =
    options.isProduction === true ||
    (
      options.isProduction ===
        undefined &&
      process.env.NODE_ENV ===
        "production"
    );

  if (
    isProduction &&
    authorizationContext
      .durableReplayPersistenceVerified !==
      true
  ) {
    return deny({
      status: 503,
      errorCode:
        "DURABLE_REPLAY_VERIFICATION_REQUIRED",
      detail:
        "Production tenant authorization requires verified durable replay protection.",
      requestId,
    });
  }

  const store =
    options.store;

  if (
    !store ||
    typeof store.authorizeOwner !==
      "function"
  ) {
    return deny({
      status: 503,
      errorCode:
        "TENANT_AUTHORIZATION_STORE_UNAVAILABLE",
      detail:
        "The durable tenant authorization store is unavailable.",
      requestId,
    });
  }

  const result =
    await store.authorizeOwner({
      tenantId,
      ownerId,
    });

  if (!result?.ok) {
    return deny({
      status: 503,
      errorCode:
        result?.errorCode ??
        "TENANT_AUTHORIZATION_STORE_FAILURE",
      detail:
        "The tenant authorization store failed closed.",
      requestId,
    });
  }

  if (result.allowed !== true) {
    return deny({
      status: 403,
      errorCode:
        "TENANT_OWNER_ACCESS_DENIED",
      detail:
        "The supplied owner is not authorized for this tenant.",
      requestId,
    });
  }

  const membership =
    result.membership ?? {};

  if (
    normalizeString(
      membership.tenantId,
    ) !== tenantId ||
    normalizeString(
      membership.ownerId,
    ) !== ownerId ||
    normalizeString(
      membership.role,
    ) !== "OWNER" ||
    !normalizeString(
      membership.authorityEpoch,
    )
  ) {
    return deny({
      status: 403,
      errorCode:
        "TENANT_MEMBERSHIP_BINDING_INVALID",
      detail:
        "The durable membership does not match the signed tenant-owner identity.",
      requestId,
    });
  }

  return Object.freeze({
    ok: true,
    status: 200,
    requestId,
    headers:
      createHeaders(requestId),
    tenantAuthorizationContext:
      Object.freeze({
        schemaVersion:
          "nexus.protected-api-tenant-authorization-context.v1",
        tenantId,
        ownerId,
        role: "OWNER",
        authorityEpoch:
          normalizeString(
            membership.authorityEpoch,
          ),
        signedEnvelopeVerified:
          true,
        durableMembershipVerified:
          true,
        crossTenantAccessAllowed:
          false,
        executionAuthorized:
          false,
        providerInvocationAuthorized:
          false,
        persistenceAuthorized:
          false,
      }),
  });
}

export function getProtectedApiTenantAuthorizationGuardPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-tenant-authorization-guard-posture.v1",
    requiredMode:
      TENANT_AUTHORIZATION_MODE,
    controls: Object.freeze([
      "SIGNED_CONTEXT_REQUIRED",
      "TENANT_IDENTITY_REQUIRED",
      "OWNER_IDENTITY_REQUIRED",
      "ACTIVE_TENANT_REQUIRED",
      "ACTIVE_OWNER_REQUIRED",
      "ACTIVE_MEMBERSHIP_REQUIRED",
      "OWNER_ROLE_REQUIRED",
      "AUTHORITY_EPOCH_REQUIRED",
      "CROSS_TENANT_ACCESS_DENIED",
      "PRODUCTION_DURABLE_REPLAY_REQUIRED",
      "DATABASE_FAILURE_FAIL_CLOSED",
    ]),
    executionAuthorized:
      false,
    providerInvocationAuthorized:
      false,
    persistenceAuthorized:
      false,
  });
}
