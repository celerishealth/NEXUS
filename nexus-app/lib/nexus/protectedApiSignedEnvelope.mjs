import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import {
  DURABLE_REPLAY_MODE,
} from "./protectedApiReplayStore.mjs";

export const PROTECTED_API_ENVELOPE_VERSION =
  "nexus-hmac-sha256-v1";

export const PROTECTED_API_MAXIMUM_CLOCK_SKEW_MS =
  5 * 60 * 1000;

const IDENTITY_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/;

const NONCE_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9._:-]{15,127}$/;

const REQUEST_ID_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;

const processLocalNonceCache =
  new Map();

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function sha256(value) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function safeHexMatch(
  expected,
  received,
) {
  const normalizedExpected =
    normalizeString(
      expected,
    ).toLowerCase();

  const normalizedReceived =
    normalizeString(
      received,
    ).toLowerCase();

  if (
    !/^[a-f0-9]{64}$/.test(
      normalizedExpected,
    ) ||
    !/^[a-f0-9]{64}$/.test(
      normalizedReceived,
    )
  ) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(
      normalizedExpected,
      "utf8",
    ),
    Buffer.from(
      normalizedReceived,
      "utf8",
    ),
  );
}

function canonicalEnvelope({
  method,
  pathname,
  tenantId,
  ownerId,
  timestamp,
  nonce,
  bodySha256,
}) {
  return [
    PROTECTED_API_ENVELOPE_VERSION,
    normalizeString(method)
      .toUpperCase(),
    normalizeString(pathname),
    normalizeString(tenantId),
    normalizeString(ownerId),
    String(timestamp),
    normalizeString(nonce),
    normalizeString(
      bodySha256,
    ).toLowerCase(),
  ].join("\n");
}

function calculateSignature({
  secret,
  method,
  pathname,
  tenantId,
  ownerId,
  timestamp,
  nonce,
  bodySha256,
}) {
  return createHmac(
    "sha256",
    secret,
  )
    .update(
      canonicalEnvelope({
        method,
        pathname,
        tenantId,
        ownerId,
        timestamp,
        nonce,
        bodySha256,
      }),
    )
    .digest("hex");
}

function createRequestId(
  request,
  suppliedRequestId,
) {
  const preferred =
    normalizeString(
      suppliedRequestId,
    );

  if (
    preferred &&
    REQUEST_ID_PATTERN.test(
      preferred,
    )
  ) {
    return preferred;
  }

  const headerValue =
    normalizeString(
      request?.headers?.get(
        "x-nexus-request-id",
      ),
    );

  if (
    headerValue &&
    REQUEST_ID_PATTERN.test(
      headerValue,
    )
  ) {
    return headerValue;
  }

  return `nexus-${randomUUID()}`;
}

function createResponseHeaders(
  requestId,
) {
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
      createResponseHeaders(
        requestId,
      ),
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

function cleanExpiredNonces(
  nowMs,
) {
  for (
    const [key, expiresAt]
    of processLocalNonceCache
      .entries()
  ) {
    if (expiresAt <= nowMs) {
      processLocalNonceCache.delete(
        key,
      );
    }
  }
}

export function resetProtectedApiNonceCacheForTests() {
  processLocalNonceCache.clear();
}

export function createProtectedApiEnvelopeHeaders({
  url,
  method = "POST",
  bodyText,
  tenantId,
  ownerId,
  timestamp,
  nonce,
  secret,
  requestId =
    "nexus-signed-request",
}) {
  const signingSecret =
    normalizeString(secret);

  if (!signingSecret) {
    throw new Error(
      "A protected API HMAC secret is required.",
    );
  }

  const parsedUrl =
    new URL(url);

  const bodySha256 =
    sha256(
      String(bodyText ?? ""),
    );

  const signature =
    calculateSignature({
      secret: signingSecret,
      method,
      pathname:
        parsedUrl.pathname,
      tenantId,
      ownerId,
      timestamp,
      nonce,
      bodySha256,
    });

  return Object.freeze({
    "content-type":
      "application/json",
    "x-nexus-envelope-version":
      PROTECTED_API_ENVELOPE_VERSION,
    "x-nexus-tenant-id":
      normalizeString(tenantId),
    "x-nexus-owner-id":
      normalizeString(ownerId),
    "x-nexus-timestamp":
      String(timestamp),
    "x-nexus-nonce":
      normalizeString(nonce),
    "x-nexus-body-sha256":
      bodySha256,
    "x-nexus-signature":
      signature,
    "x-nexus-request-id":
      requestId,
  });
}

export async function inspectProtectedApiSignedEnvelope(
  request,
  options = {},
) {
  const requestId =
    createRequestId(
      request,
      options.requestId,
    );

  if (
    !request ||
    !request.headers ||
    typeof request.clone !==
      "function"
  ) {
    return deny({
      status: 400,
      errorCode:
        "SIGNED_ENVELOPE_REQUEST_INVALID",
      detail:
        "A valid Request object is required.",
      requestId,
    });
  }

  const signingSecret =
    normalizeString(
      options.secret ??
        process.env
          .NEXUS_PROTECTED_API_HMAC_SECRET,
    );

  if (!signingSecret) {
    return deny({
      status: 503,
      errorCode:
        "SIGNED_ENVELOPE_AUTHORITY_UNAVAILABLE",
      detail:
        "Protected API signing authority is unavailable.",
      requestId,
    });
  }

  const replayMode =
    normalizeString(
      options.replayMode ??
        process.env
          .NEXUS_PROTECTED_API_REPLAY_MODE,
    );

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
    replayMode !==
      DURABLE_REPLAY_MODE
  ) {
    return deny({
      status: 503,
      errorCode:
        "DURABLE_REPLAY_PROTECTION_REQUIRED",
      detail:
        "Production requests require the PostgreSQL atomic replay ledger.",
      requestId,
    });
  }

  if (
    isProduction &&
    (
      !options.replayStore ||
      typeof options
        .replayStore
        .consumeNonce !==
        "function"
    )
  ) {
    return deny({
      status: 503,
      errorCode:
        "DURABLE_REPLAY_STORE_UNAVAILABLE",
      detail:
        "The durable replay store is unavailable.",
      requestId,
    });
  }

  const envelopeVersion =
    normalizeString(
      request.headers.get(
        "x-nexus-envelope-version",
      ),
    );

  if (
    envelopeVersion !==
    PROTECTED_API_ENVELOPE_VERSION
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_ENVELOPE_VERSION_INVALID",
      detail:
        "Protected API envelope version is invalid.",
      requestId,
    });
  }

  const tenantId =
    normalizeString(
      request.headers.get(
        "x-nexus-tenant-id",
      ),
    );

  const ownerId =
    normalizeString(
      request.headers.get(
        "x-nexus-owner-id",
      ),
    );

  if (
    !IDENTITY_PATTERN.test(
      tenantId,
    ) ||
    !IDENTITY_PATTERN.test(
      ownerId,
    )
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_ENVELOPE_IDENTITY_INVALID",
      detail:
        "A valid tenant and owner identity are required.",
      requestId,
    });
  }

  const timestamp =
    Number(
      normalizeString(
        request.headers.get(
          "x-nexus-timestamp",
        ),
      ),
    );

  if (
    !Number.isSafeInteger(
      timestamp,
    ) ||
    timestamp <= 0
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_ENVELOPE_TIMESTAMP_INVALID",
      detail:
        "A valid millisecond timestamp is required.",
      requestId,
    });
  }

  const nowMs =
    Number.isSafeInteger(
      options.nowMs,
    )
      ? options.nowMs
      : Date.now();

  const maximumClockSkewMs =
    Number.isSafeInteger(
      options.maximumClockSkewMs,
    ) &&
    options.maximumClockSkewMs > 0
      ? options.maximumClockSkewMs
      : PROTECTED_API_MAXIMUM_CLOCK_SKEW_MS;

  if (
    Math.abs(
      nowMs - timestamp,
    ) > maximumClockSkewMs
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_ENVELOPE_EXPIRED",
      detail:
        "The signed timestamp is outside the accepted window.",
      requestId,
    });
  }

  const nonce =
    normalizeString(
      request.headers.get(
        "x-nexus-nonce",
      ),
    );

  if (
    !NONCE_PATTERN.test(nonce)
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_ENVELOPE_NONCE_INVALID",
      detail:
        "A valid unique nonce is required.",
      requestId,
    });
  }

  let bodyText;

  try {
    bodyText =
      await request
        .clone()
        .text();
  } catch {
    return deny({
      status: 400,
      errorCode:
        "SIGNED_ENVELOPE_BODY_UNREADABLE",
      detail:
        "The protected request body could not be read.",
      requestId,
    });
  }

  const actualBodySha256 =
    sha256(bodyText);

  const suppliedBodySha256 =
    normalizeString(
      request.headers.get(
        "x-nexus-body-sha256",
      ),
    ).toLowerCase();

  if (
    !safeHexMatch(
      actualBodySha256,
      suppliedBodySha256,
    )
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_ENVELOPE_BODY_DIGEST_MISMATCH",
      detail:
        "The body does not match its signed digest.",
      requestId,
    });
  }

  const pathname =
    new URL(
      request.url,
    ).pathname;

  const expectedSignature =
    calculateSignature({
      secret: signingSecret,
      method: request.method,
      pathname,
      tenantId,
      ownerId,
      timestamp,
      nonce,
      bodySha256:
        actualBodySha256,
    });

  const suppliedSignature =
    normalizeString(
      request.headers.get(
        "x-nexus-signature",
      ),
    ).toLowerCase();

  if (
    !safeHexMatch(
      expectedSignature,
      suppliedSignature,
    )
  ) {
    return deny({
      status: 401,
      errorCode:
        "SIGNED_ENVELOPE_SIGNATURE_INVALID",
      detail:
        "The protected API signature is invalid.",
      requestId,
    });
  }

  let durableReplayPersistenceVerified =
    false;

  if (
    replayMode ===
    DURABLE_REPLAY_MODE
  ) {
    if (
      !options.replayStore ||
      typeof options
        .replayStore
        .consumeNonce !==
        "function"
    ) {
      return deny({
        status: 503,
        errorCode:
          "DURABLE_REPLAY_STORE_UNAVAILABLE",
        detail:
          "The PostgreSQL replay ledger is unavailable.",
        requestId,
      });
    }

    const replayResult =
      await options
        .replayStore
        .consumeNonce({
          tenantId,
          ownerId,
          nonce,
          requestId,
          pathname,
          bodySha256:
            actualBodySha256,
          nowMs,
          expiresAtMs:
            timestamp +
            maximumClockSkewMs,
        });

    if (!replayResult.ok) {
      return deny({
        status: 503,
        errorCode:
          replayResult.errorCode ??
          "DURABLE_REPLAY_STORE_FAILURE",
        detail:
          "The durable replay ledger failed closed.",
        requestId,
      });
    }

    if (
      replayResult.consumed !==
      true
    ) {
      return deny({
        status: 409,
        errorCode:
          "SIGNED_ENVELOPE_REPLAY_BLOCKED",
        detail:
          "This nonce was already consumed.",
        requestId,
      });
    }

    durableReplayPersistenceVerified =
      true;
  } else {
    if (isProduction) {
      return deny({
        status: 503,
        errorCode:
          "DURABLE_REPLAY_PROTECTION_REQUIRED",
        detail:
          "Process-local replay protection is forbidden in production.",
        requestId,
      });
    }

    cleanExpiredNonces(nowMs);

    const nonceKey =
      `${tenantId}:${ownerId}:${nonce}`;

    if (
      processLocalNonceCache.has(
        nonceKey,
      )
    ) {
      return deny({
        status: 409,
        errorCode:
          "SIGNED_ENVELOPE_REPLAY_BLOCKED",
        detail:
          "This nonce was already consumed.",
        requestId,
      });
    }

    processLocalNonceCache.set(
      nonceKey,
      timestamp +
        maximumClockSkewMs,
    );
  }

  return Object.freeze({
    ok: true,
    status: 200,
    requestId,
    headers:
      createResponseHeaders(
        requestId,
      ),
    authorizationContext:
      Object.freeze({
        schemaVersion:
          "nexus.protected-api-authorization-context.v1",
        tenantId,
        ownerId,
        timestamp,
        nonce,
        bodySha256:
          actualBodySha256,
        pathname,
        envelopeVersion,
        signatureVerified: true,
        timestampVerified: true,
        bodyIntegrityVerified: true,
        replayProtectionMode:
          replayMode ||
          "process-local-development",
        durableReplayPersistenceVerified,
        executionAuthorized: false,
        providerInvocationAuthorized:
          false,
        persistenceAuthorized:
          false,
      }),
  });
}

export function getProtectedApiAuthenticationPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-authentication-posture.v2",
    envelopeVersion:
      PROTECTED_API_ENVELOPE_VERSION,
    maximumClockSkewMs:
      PROTECTED_API_MAXIMUM_CLOCK_SKEW_MS,
    durableReplayMode:
      DURABLE_REPLAY_MODE,
    controls: Object.freeze([
      "HMAC_SHA256_REQUEST_AUTHENTICATION",
      "HTTP_METHOD_BINDING",
      "API_PATH_BINDING",
      "TENANT_IDENTITY_BINDING",
      "OWNER_IDENTITY_BINDING",
      "TIMESTAMP_FRESHNESS_ENFORCEMENT",
      "NONCE_BOUND_SIGNATURE",
      "BODY_SHA256_INTEGRITY",
      "CONSTANT_TIME_SIGNATURE_COMPARISON",
      "POSTGRES_ATOMIC_NONCE_CONSUMPTION",
      "DISTRIBUTED_REPLAY_REJECTION",
      "PRODUCTION_FAIL_CLOSED_WITHOUT_POSTGRES_LEDGER",
    ]),
    developmentProcessLocalProtection:
      true,
    durableSharedReplayProtection:
      true,
    productionDefaultState:
      "BLOCKED_UNLESS_POSTGRES_ATOMIC_V1_IS_CONFIGURED",
    realExecutionAuthorized: false,
    providerInvocationAuthorized:
      false,
    persistenceAuthorizationLimitedTo:
      "SECURITY_NONCE_LEDGER_ONLY",
  });
}
