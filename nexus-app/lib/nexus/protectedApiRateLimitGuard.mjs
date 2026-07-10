import {
  randomUUID,
} from "node:crypto";

import {
  DEFAULT_RATE_LIMIT_MAX_REQUESTS,
  DEFAULT_RATE_LIMIT_WINDOW_MS,
  PROTECTED_API_RATE_LIMIT_MODE,
} from "./protectedApiRateLimitStore.mjs";

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function boundedInteger(
  value,
  fallback,
  minimum,
  maximum,
) {
  const parsed =
    Number(value);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed < minimum ||
    parsed > maximum
  ) {
    return fallback;
  }

  return parsed;
}

function createRequestId(value) {
  return (
    normalizeString(value) ||
    `nexus-${randomUUID()}`
  );
}

function createHeaders({
  requestId,
  maximumRequests,
  remaining,
  windowEndMs,
  retryAfterSeconds,
}) {
  const headers = {
    "Cache-Control":
      "no-store, max-age=0",
    "X-Content-Type-Options":
      "nosniff",
    "X-NEXUS-Request-ID":
      requestId,
    "RateLimit-Limit":
      String(maximumRequests),
    "RateLimit-Remaining":
      String(remaining),
    "RateLimit-Reset":
      String(
        Math.ceil(
          windowEndMs / 1000,
        ),
      ),
    Vary: "Origin",
  };

  if (
    retryAfterSeconds > 0
  ) {
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
  maximumRequests = 0,
  remaining = 0,
  windowEndMs = 0,
  retryAfterSeconds = 0,
}) {
  return Object.freeze({
    ok: false,
    status,
    requestId,
    headers:
      createHeaders({
        requestId,
        maximumRequests,
        remaining,
        windowEndMs,
        retryAfterSeconds,
      }),
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
      persistencePerformed:
        false,
    }),
  });
}

export async function enforceProtectedApiRateLimit(
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
          .NEXUS_PROTECTED_API_RATE_LIMIT_MODE,
    );

  if (
    mode !==
    PROTECTED_API_RATE_LIMIT_MODE
  ) {
    return deny({
      status: 503,
      errorCode:
        "DISTRIBUTED_RATE_LIMIT_REQUIRED",
      detail:
        "Protected APIs require the PostgreSQL distributed rate-limit mode.",
      requestId,
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
        "RATE_LIMIT_SIGNED_CONTEXT_INVALID",
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
        "RATE_LIMIT_TENANT_CONTEXT_INVALID",
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
        "RATE_LIMIT_IDENTITY_BINDING_MISMATCH",
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
        "RATE_LIMIT_IDENTITY_INCOMPLETE",
      detail:
        "Tenant, owner, and route identities are required.",
      requestId,
    });
  }

  const store =
    options.store;

  if (
    !store ||
    typeof store.consume !==
      "function"
  ) {
    return deny({
      status: 503,
      errorCode:
        "RATE_LIMIT_STORE_UNAVAILABLE",
      detail:
        "The durable rate-limit store is unavailable.",
      requestId,
    });
  }

  const nowMs =
    Number.isSafeInteger(
      options.nowMs,
    )
      ? options.nowMs
      : Date.now();

  const windowMs =
    boundedInteger(
      options.windowMs ??
        process.env
          .NEXUS_PROTECTED_API_RATE_LIMIT_WINDOW_MS,
      DEFAULT_RATE_LIMIT_WINDOW_MS,
      1000,
      60 * 60 * 1000,
    );

  const maximumRequests =
    boundedInteger(
      options.maximumRequests ??
        process.env
          .NEXUS_PROTECTED_API_RATE_LIMIT_MAX_REQUESTS,
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
      1,
      10000,
    );

  const result =
    await store.consume({
      tenantId,
      ownerId,
      routeKey,
      requestId,
      nowMs,
      windowMs,
      maximumRequests,
    });

  if (!result?.ok) {
    return deny({
      status: 503,
      errorCode:
        result?.errorCode ??
        "RATE_LIMIT_STORE_FAILURE",
      detail:
        "The distributed rate limiter failed closed.",
      requestId,
      maximumRequests,
    });
  }

  const headers =
    createHeaders({
      requestId,
      maximumRequests:
        result.maximumRequests,
      remaining:
        result.remaining,
      windowEndMs:
        result.windowEndMs,
      retryAfterSeconds:
        result.retryAfterSeconds,
    });

  if (result.allowed !== true) {
    return Object.freeze({
      ok: false,
      status: 429,
      requestId,
      headers,
      error: Object.freeze({
        accepted: false,
        mode: "FAIL_CLOSED",
        errorCode:
          "PROTECTED_API_RATE_LIMIT_EXCEEDED",
        detail:
          "The protected API request limit was exceeded.",
        requestId,
        retryAfterSeconds:
          result.retryAfterSeconds,
        securityEventId:
          result.eventId,
        executionAuthorized:
          false,
        externalExecutionPerformed:
          false,
        providerInvocationPerformed:
          false,
        persistencePerformed:
          false,
      }),
    });
  }

  return Object.freeze({
    ok: true,
    status: 200,
    requestId,
    headers,
    rateLimitContext:
      Object.freeze({
        schemaVersion:
          "nexus.protected-api-rate-limit-context.v1",
        tenantId,
        ownerId,
        routeKey,
        requestCount:
          result.requestCount,
        maximumRequests:
          result.maximumRequests,
        remaining:
          result.remaining,
        windowStartMs:
          result.windowStartMs,
        windowEndMs:
          result.windowEndMs,
        securityEventId:
          result.eventId,
        durableCounterVerified:
          true,
        durableSecurityEventRecorded:
          true,
        executionAuthorized:
          false,
        providerInvocationAuthorized:
          false,
      }),
  });
}

export function getProtectedApiRateLimitGuardPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-rate-limit-guard-posture.v1",
    requiredMode:
      PROTECTED_API_RATE_LIMIT_MODE,
    controls: Object.freeze([
      "SIGNED_CONTEXT_REQUIRED",
      "DURABLE_TENANT_CONTEXT_REQUIRED",
      "TENANT_OWNER_BINDING_REQUIRED",
      "ROUTE_SPECIFIC_BUCKETS",
      "POSTGRES_ATOMIC_COUNTER",
      "DISTRIBUTED_INSTANCE_CONSISTENCY",
      "HTTP_429_RATE_LIMIT_RESPONSE",
      "RETRY_AFTER_RESPONSE_HEADER",
      "DURABLE_ALLOWED_EVENT",
      "DURABLE_BLOCKED_EVENT",
      "DATABASE_FAILURE_FAIL_CLOSED",
    ]),
    executionAuthorized:
      false,
    providerInvocationAuthorized:
      false,
  });
}
