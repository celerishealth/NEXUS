import {
  randomUUID,
} from "node:crypto";

export const PROTECTED_API_MAX_BODY_BYTES =
  64 * 1024;

const REQUEST_ID_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function parseAllowedOrigins(value) {
  return new Set(
    normalizeString(value)
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

function createRequestId(request) {
  const supplied = normalizeString(
    request?.headers?.get(
      "x-nexus-request-id",
    ),
  );

  if (
    supplied &&
    REQUEST_ID_PATTERN.test(supplied)
  ) {
    return supplied;
  }

  return `nexus-${randomUUID()}`;
}

function buildHeaders(requestId) {
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
  code,
  requestId,
  detail,
}) {
  return Object.freeze({
    ok: false,
    status,
    requestId,
    headers: buildHeaders(requestId),
    error: Object.freeze({
      accepted: false,
      mode: "FAIL_CLOSED",
      errorCode: code,
      detail,
      requestId,
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
    }),
  });
}

function validateOrigin(
  request,
  allowedOrigins,
) {
  const requestUrl = new URL(request.url);
  const requestOrigin = requestUrl.origin;

  const origin = normalizeString(
    request.headers.get("origin"),
  );

  const fetchSite = normalizeString(
    request.headers.get(
      "sec-fetch-site",
    ),
  ).toLowerCase();

  if (fetchSite === "cross-site") {
    return {
      allowed: false,
      reason:
        "Cross-site browser requests are blocked.",
    };
  }

  if (!origin) {
    return {
      allowed: true,
      reason:
        "No browser origin was supplied.",
    };
  }

  if (
    origin === requestOrigin ||
    allowedOrigins.has(origin)
  ) {
    return {
      allowed: true,
      reason:
        "Request origin is trusted.",
    };
  }

  return {
    allowed: false,
    reason:
      "Request origin is not trusted.",
  };
}

export async function inspectProtectedApiRequest(
  request,
  options = {},
) {
  const requestId =
    createRequestId(request);

  if (
    !request ||
    typeof request.clone !== "function" ||
    !request.headers
  ) {
    return deny({
      status: 400,
      code:
        "PROTECTED_REQUEST_INVALID",
      requestId,
      detail:
        "A valid Request object is required.",
    });
  }

  if (
    normalizeString(request.method)
      .toUpperCase() !== "POST"
  ) {
    return deny({
      status: 405,
      code:
        "PROTECTED_REQUEST_METHOD_NOT_ALLOWED",
      requestId,
      detail:
        "Only POST requests are accepted.",
    });
  }

  const contentType =
    normalizeString(
      request.headers.get(
        "content-type",
      ),
    ).toLowerCase();

  if (
    !contentType.startsWith(
      "application/json",
    )
  ) {
    return deny({
      status: 415,
      code:
        "PROTECTED_REQUEST_JSON_REQUIRED",
      requestId,
      detail:
        "Content-Type must be application/json.",
    });
  }

  const maximumBodyBytes =
    Number.isInteger(
      options.maximumBodyBytes,
    ) &&
    options.maximumBodyBytes > 0
      ? options.maximumBodyBytes
      : PROTECTED_API_MAX_BODY_BYTES;

  const declaredLength =
    normalizeString(
      request.headers.get(
        "content-length",
      ),
    );

  if (declaredLength) {
    const parsedLength =
      Number(declaredLength);

    if (
      !Number.isInteger(parsedLength) ||
      parsedLength < 0
    ) {
      return deny({
        status: 400,
        code:
          "PROTECTED_REQUEST_LENGTH_INVALID",
        requestId,
        detail:
          "Content-Length is invalid.",
      });
    }

    if (
      parsedLength >
      maximumBodyBytes
    ) {
      return deny({
        status: 413,
        code:
          "PROTECTED_REQUEST_TOO_LARGE",
        requestId,
        detail:
          `Request body exceeds ${maximumBodyBytes} bytes.`,
      });
    }
  }

  const allowedOrigins =
    options.allowedOrigins instanceof Set
      ? options.allowedOrigins
      : parseAllowedOrigins(
          options.allowedOrigins ??
            process.env
              .NEXUS_ALLOWED_ORIGINS,
        );

  const originCheck =
    validateOrigin(
      request,
      allowedOrigins,
    );

  if (!originCheck.allowed) {
    return deny({
      status: 403,
      code:
        "PROTECTED_REQUEST_ORIGIN_BLOCKED",
      requestId,
      detail: originCheck.reason,
    });
  }

  let rawBody;

  try {
    rawBody =
      await request.clone().text();
  } catch {
    return deny({
      status: 400,
      code:
        "PROTECTED_REQUEST_BODY_UNREADABLE",
      requestId,
      detail:
        "Request body could not be read.",
    });
  }

  const actualBodyBytes =
    new TextEncoder().encode(
      rawBody,
    ).byteLength;

  if (
    actualBodyBytes >
    maximumBodyBytes
  ) {
    return deny({
      status: 413,
      code:
        "PROTECTED_REQUEST_TOO_LARGE",
      requestId,
      detail:
        `Request body exceeds ${maximumBodyBytes} bytes.`,
    });
  }

  if (!rawBody.trim()) {
    return deny({
      status: 400,
      code:
        "PROTECTED_REQUEST_BODY_EMPTY",
      requestId,
      detail:
        "A JSON request body is required.",
    });
  }

  let parsedBody;

  try {
    parsedBody =
      JSON.parse(rawBody);
  } catch {
    return deny({
      status: 400,
      code:
        "PROTECTED_REQUEST_JSON_INVALID",
      requestId,
      detail:
        "Request body contains invalid JSON.",
    });
  }

  if (
    !parsedBody ||
    typeof parsedBody !== "object" ||
    Array.isArray(parsedBody)
  ) {
    return deny({
      status: 400,
      code:
        "PROTECTED_REQUEST_OBJECT_REQUIRED",
      requestId,
      detail:
        "The top-level JSON value must be an object.",
    });
  }

  return Object.freeze({
    ok: true,
    status: 200,
    requestId,
    headers:
      buildHeaders(requestId),
    bodyByteLength:
      actualBodyBytes,
    originState:
      originCheck.reason,
  });
}

export function getProtectedApiSecurityPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-security-posture.v1",
    maximumBodyBytes:
      PROTECTED_API_MAX_BODY_BYTES,
    controls: Object.freeze([
      "POST_ONLY",
      "APPLICATION_JSON_ONLY",
      "DECLARED_LENGTH_VALIDATION",
      "ACTUAL_UTF8_BODY_SIZE_VALIDATION",
      "MALFORMED_JSON_REJECTION",
      "TOP_LEVEL_OBJECT_REQUIRED",
      "CROSS_SITE_BROWSER_REQUEST_BLOCKING",
      "SAME_ORIGIN_OR_EXPLICIT_ALLOWLIST",
      "REQUEST_ID_VALIDATION_OR_GENERATION",
      "NO_STORE_ERROR_RESPONSES",
      "FAIL_CLOSED_SAFETY_FLAGS",
    ]),
    realExecutionAuthorized: false,
    providerInvocationAuthorized: false,
    persistenceAuthorized: false,
  });
}
