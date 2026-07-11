import {
  createHash,
  timingSafeEqual,
} from "node:crypto";

import type {
  InternalPilotEndpointErrorBody,
  InternalPilotHttpRequest,
  InternalPilotHttpResponse,
  InternalPilotSandboxWorkerEndpoint,
  TrustedInternalPilotSession,
} from "./internalPilotSandboxWorkerEndpoint";

export type InternalPilotRouteErrorCode =
  | "METHOD_NOT_ALLOWED"
  | "ORIGIN_REQUIRED"
  | "ORIGIN_NOT_ALLOWED"
  | "IDENTITY_HEADER_FORBIDDEN"
  | "AUTHENTICATION_REQUIRED"
  | "AUTHENTICATION_UNAVAILABLE"
  | "OWNER_ROLE_REQUIRED"
  | "OWNER_APPROVAL_REQUIRED"
  | "TENANT_MISMATCH"
  | "SESSION_INVALID"
  | "SESSION_EXPIRED"
  | "CSRF_TOKEN_REQUIRED"
  | "CSRF_TOKEN_INVALID"
  | "ENDPOINT_RESPONSE_INVALID"
  | "INTERNAL_ERROR";

export interface TrustedInternalPilotRouteSession {
  sessionId: string;
  actorId: string;
  tenantId: string;
  authenticated: boolean;
  role: "owner" | "operator";
  ownerApprovalGranted: boolean;
  csrfTokenDigest: string;
  expiresAt: string;
}

export interface InternalPilotRouteRuntime {
  tenantId: string;
  allowedOrigins: readonly string[];
  resolveSession(
    request: InternalPilotHttpRequest,
  ): Promise<TrustedInternalPilotRouteSession | null>;
  endpoint: InternalPilotSandboxWorkerEndpoint;
  now?: () => Date;
}

export type InternalPilotSandboxWorkerRoute = (
  request: InternalPilotHttpRequest,
) => Promise<InternalPilotHttpResponse>;

const ROUTE_RESPONSE_HEADERS = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy":
    "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

const SESSION_KEYS = [
  "actorId",
  "authenticated",
  "csrfTokenDigest",
  "expiresAt",
  "ownerApprovalGranted",
  "role",
  "sessionId",
  "tenantId",
] as const;

const FORBIDDEN_IDENTITY_HEADERS = [
  "x-nexus-actor-id",
  "x-nexus-owner-id",
  "x-nexus-tenant-id",
  "x-user-id",
  "x-tenant-id",
] as const;

function isPlainRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isIdentifier(
  value: unknown,
  minimumLength: number,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= minimumLength &&
    value.length <= 128 &&
    /^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  );
}

function getHeader(
  headers: Readonly<Record<string, string | undefined>>,
  name: string,
): string | undefined {
  const normalizedName = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (
      key.toLowerCase() === normalizedName &&
      typeof value === "string"
    ) {
      return value;
    }
  }

  return undefined;
}

function routeErrorResponse(
  status: number,
  code: InternalPilotRouteErrorCode,
  message: string,
): InternalPilotHttpResponse {
  const body: InternalPilotEndpointErrorBody = {
    ok: false,
    error: {
      code,
      message,
    },
  };

  return {
    status,
    headers: ROUTE_RESPONSE_HEADERS,
    body,
  };
}

function assertRuntime(
  runtime: unknown,
): asserts runtime is InternalPilotRouteRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    !Array.isArray(runtime.allowedOrigins) ||
    runtime.allowedOrigins.length < 1 ||
    typeof runtime.resolveSession !== "function" ||
    typeof runtime.endpoint !== "function" ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    )
  ) {
    throw new Error(
      "Internal pilot route configuration is invalid.",
    );
  }

  for (const origin of runtime.allowedOrigins) {
    if (
      typeof origin !== "string" ||
      origin.length < 8 ||
      origin.length > 512
    ) {
      throw new Error(
        "Internal pilot route origin configuration is invalid.",
      );
    }

    let parsed: URL;

    try {
      parsed = new URL(origin);
    } catch {
      throw new Error(
        "Internal pilot route origin configuration is invalid.",
      );
    }

    if (
      parsed.origin !== origin ||
      (
        parsed.protocol !== "https:" &&
        parsed.hostname !== "localhost" &&
        parsed.hostname !== "127.0.0.1"
      )
    ) {
      throw new Error(
        "Internal pilot route origin configuration is invalid.",
      );
    }
  }
}

function parseTrustedSession(
  value: unknown,
  tenantId: string,
  now: Date,
):
  | TrustedInternalPilotSession
  | InternalPilotHttpResponse {
  if (!isPlainRecord(value)) {
    return routeErrorResponse(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authenticated owner access is required.",
    );
  }

  const actualKeys = Object.keys(value).sort();
  const expectedKeys = [...SESSION_KEYS].sort();

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some(
      (key, index) => key !== expectedKeys[index],
    )
  ) {
    return routeErrorResponse(
      401,
      "SESSION_INVALID",
      "The authenticated session is invalid.",
    );
  }

  if (value.authenticated !== true) {
    return routeErrorResponse(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authenticated owner access is required.",
    );
  }

  if (value.role !== "owner") {
    return routeErrorResponse(
      403,
      "OWNER_ROLE_REQUIRED",
      "Owner authority is required.",
    );
  }

  if (value.ownerApprovalGranted !== true) {
    return routeErrorResponse(
      403,
      "OWNER_APPROVAL_REQUIRED",
      "Explicit owner approval is required.",
    );
  }

  if (
    !isIdentifier(value.sessionId, 8) ||
    !isIdentifier(value.actorId, 3) ||
    !isIdentifier(value.tenantId, 3) ||
    typeof value.csrfTokenDigest !== "string" ||
    !/^[a-f0-9]{64}$/.test(value.csrfTokenDigest) ||
    typeof value.expiresAt !== "string"
  ) {
    return routeErrorResponse(
      401,
      "SESSION_INVALID",
      "The authenticated session is invalid.",
    );
  }

  const expiresAt = new Date(value.expiresAt);

  if (
    Number.isNaN(expiresAt.getTime()) ||
    expiresAt.toISOString() !== value.expiresAt
  ) {
    return routeErrorResponse(
      401,
      "SESSION_INVALID",
      "The authenticated session is invalid.",
    );
  }

  if (expiresAt.getTime() <= now.getTime()) {
    return routeErrorResponse(
      401,
      "SESSION_EXPIRED",
      "The authenticated session has expired.",
    );
  }

  if (value.tenantId !== tenantId) {
    return routeErrorResponse(
      403,
      "TENANT_MISMATCH",
      "Cross-tenant internal pilot access is blocked.",
    );
  }

  return {
    sessionId: value.sessionId,
    actorId: value.actorId,
    tenantId: value.tenantId,
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
  };
}

function isHttpResponse(
  value: unknown,
): value is InternalPilotHttpResponse {
  return (
    isPlainRecord(value) &&
    typeof value.status === "number" &&
    isPlainRecord(value.headers) &&
    isPlainRecord(value.body)
  );
}

export function createInternalPilotCsrfDigest(
  csrfToken: string,
): string {
  return createHash("sha256")
    .update(csrfToken, "utf8")
    .digest("hex");
}

function validateCsrfToken(
  request: InternalPilotHttpRequest,
  session: TrustedInternalPilotRouteSession,
): InternalPilotHttpResponse | null {
  const csrfToken = getHeader(
    request.headers,
    "x-nexus-csrf-token",
  );

  if (!csrfToken) {
    return routeErrorResponse(
      403,
      "CSRF_TOKEN_REQUIRED",
      "The internal pilot CSRF token is required.",
    );
  }

  if (
    csrfToken.length < 32 ||
    csrfToken.length > 256 ||
    !/^[A-Za-z0-9._~-]+$/.test(csrfToken)
  ) {
    return routeErrorResponse(
      403,
      "CSRF_TOKEN_INVALID",
      "The internal pilot CSRF token is invalid.",
    );
  }

  const suppliedDigest = Buffer.from(
    createInternalPilotCsrfDigest(csrfToken),
    "hex",
  );

  const trustedDigest = Buffer.from(
    session.csrfTokenDigest,
    "hex",
  );

  if (
    suppliedDigest.length !== trustedDigest.length ||
    !timingSafeEqual(suppliedDigest, trustedDigest)
  ) {
    return routeErrorResponse(
      403,
      "CSRF_TOKEN_INVALID",
      "The internal pilot CSRF token is invalid.",
    );
  }

  return null;
}

function validateEndpointResponse(
  value: unknown,
  tenantId: string,
): value is InternalPilotHttpResponse {
  if (
    !isPlainRecord(value) ||
    !Number.isInteger(value.status) ||
    value.status < 200 ||
    value.status > 599 ||
    !isPlainRecord(value.headers) ||
    !isPlainRecord(value.body)
  ) {
    return false;
  }

  if (
    value.headers["content-type"] !==
      "application/json; charset=utf-8" ||
    value.headers["cache-control"] !== "no-store" ||
    value.headers["x-content-type-options"] !== "nosniff"
  ) {
    return false;
  }

  if (value.body.ok === true) {
    if (
      value.status !== 200 ||
      value.body.tenantId !== tenantId ||
      !isIdentifier(value.body.requestId, 8) ||
      typeof value.body.requestDigest !== "string" ||
      !/^[a-f0-9]{64}$/.test(value.body.requestDigest) ||
      value.body.ownerApprovalRequired !== true ||
      value.body.liveProviderExecution !== "blocked" ||
      value.body.externalDelivery !== "blocked" ||
      value.body.paymentExecution !== "blocked" ||
      value.body.publicLaunch !== "blocked" ||
      !isPlainRecord(value.body.cycle) ||
      value.body.cycle.tenantId !== tenantId ||
      value.body.cycle.ownerApprovalRequired !== true ||
      value.body.cycle.liveProviderExecution !== "blocked" ||
      value.body.cycle.externalDelivery !== "blocked" ||
      value.body.cycle.paymentExecution !== "blocked" ||
      value.body.cycle.publicLaunch !== "blocked"
    ) {
      return false;
    }

    return true;
  }

  if (
    value.body.ok !== false ||
    value.status < 400 ||
    !isPlainRecord(value.body.error) ||
    typeof value.body.error.code !== "string" ||
    !/^[A-Z][A-Z0-9_]{2,63}$/.test(value.body.error.code) ||
    typeof value.body.error.message !== "string" ||
    value.body.error.message.length < 1 ||
    value.body.error.message.length > 256 ||
    /[\r\n]/.test(value.body.error.message)
  ) {
    return false;
  }

  return true;
}

function addRouteSecurityHeaders(
  value: InternalPilotHttpResponse,
): InternalPilotHttpResponse {
  return {
    status: value.status,
    headers: Object.freeze({
      ...value.headers,
      ...ROUTE_RESPONSE_HEADERS,
    }),
    body: value.body,
  };
}

export function createInternalPilotSandboxWorkerRoute(
  runtime: InternalPilotRouteRuntime,
): InternalPilotSandboxWorkerRoute {
  assertRuntime(runtime);

  const allowedOrigins = new Set(runtime.allowedOrigins);
  const now = runtime.now ?? (() => new Date());

  return async (
    request: InternalPilotHttpRequest,
  ): Promise<InternalPilotHttpResponse> => {
    if (
      !isPlainRecord(request) ||
      typeof request.method !== "string" ||
      !isPlainRecord(request.headers) ||
      typeof request.bodyText !== "string"
    ) {
      return routeErrorResponse(
        400,
        "INTERNAL_ERROR",
        "The internal pilot request is invalid.",
      );
    }

    if (request.method.toUpperCase() !== "POST") {
      return routeErrorResponse(
        405,
        "METHOD_NOT_ALLOWED",
        "Only POST requests are accepted.",
      );
    }

    const origin = getHeader(
      request.headers,
      "origin",
    );

    if (!origin) {
      return routeErrorResponse(
        403,
        "ORIGIN_REQUIRED",
        "A trusted internal pilot origin is required.",
      );
    }

    if (!allowedOrigins.has(origin)) {
      return routeErrorResponse(
        403,
        "ORIGIN_NOT_ALLOWED",
        "The request origin is not authorized.",
      );
    }

    for (
      const forbiddenHeader
      of FORBIDDEN_IDENTITY_HEADERS
    ) {
      if (
        getHeader(
          request.headers,
          forbiddenHeader,
        ) !== undefined
      ) {
        return routeErrorResponse(
          400,
          "IDENTITY_HEADER_FORBIDDEN",
          "Client-supplied identity headers are forbidden.",
        );
      }
    }

    let rawSession: TrustedInternalPilotRouteSession | null;

    try {
      rawSession = await runtime.resolveSession(request);
    } catch {
      return routeErrorResponse(
        503,
        "AUTHENTICATION_UNAVAILABLE",
        "The internal pilot authentication service is unavailable.",
      );
    }

    if (rawSession === null) {
      return routeErrorResponse(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authenticated owner access is required.",
      );
    }

    const trustedSession = parseTrustedSession(
      rawSession,
      runtime.tenantId,
      now(),
    );

    if (isHttpResponse(trustedSession)) {
      return trustedSession;
    }

    const csrfFailure = validateCsrfToken(
      request,
      rawSession,
    );

    if (csrfFailure) {
      return csrfFailure;
    }

    let endpointResponse: InternalPilotHttpResponse;

    try {
      endpointResponse = await runtime.endpoint(
        trustedSession,
        request,
      );
    } catch {
      return routeErrorResponse(
        500,
        "INTERNAL_ERROR",
        "The internal pilot request could not be completed safely.",
      );
    }

    if (
      !validateEndpointResponse(
        endpointResponse,
        runtime.tenantId,
      )
    ) {
      return routeErrorResponse(
        503,
        "ENDPOINT_RESPONSE_INVALID",
        "The internal pilot endpoint returned an invalid protected response.",
      );
    }

    return addRouteSecurityHeaders(
      endpointResponse,
    );
  };
}
