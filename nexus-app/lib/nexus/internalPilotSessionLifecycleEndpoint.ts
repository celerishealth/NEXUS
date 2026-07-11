import {
  timingSafeEqual,
} from "node:crypto";

import type {
  InternalPilotHttpRequest,
} from "./internalPilotSandboxWorkerEndpoint";

import {
  createInternalPilotCsrfDigest,
  type TrustedInternalPilotRouteSession,
} from "./internalPilotSandboxWorkerRoute";

import {
  PostgresInternalPilotSessionLifecycleError,
  type PostgresInternalPilotSessionLifecycle,
} from "./postgresInternalPilotSessionLifecycle";

import {
  createInternalPilotSessionTokenDigest,
} from "./postgresInternalPilotSessionResolver";

export type InternalPilotLifecycleEndpointErrorCode =
  | "METHOD_NOT_ALLOWED"
  | "CONTENT_TYPE_REQUIRED"
  | "PILOT_HEADER_REQUIRED"
  | "REQUEST_TOO_LARGE"
  | "INVALID_JSON"
  | "INVALID_REQUEST"
  | "AUTHENTICATION_REQUIRED"
  | "OWNER_ROLE_REQUIRED"
  | "OWNER_APPROVAL_REQUIRED"
  | "TENANT_MISMATCH"
  | "SESSION_EXPIRED"
  | "CSRF_TOKEN_REQUIRED"
  | "CSRF_TOKEN_INVALID"
  | "SESSION_NOT_FOUND"
  | "SESSION_SERVICE_UNAVAILABLE"
  | "SESSION_RESULT_INVALID"
  | "INTERNAL_ERROR";

export interface InternalPilotLifecycleHttpResponse {
  status: number;
  headers: Readonly<Record<string, string>>;
  body: Readonly<Record<string, unknown>>;
}

export interface InternalPilotSessionLifecycleEndpointRuntime {
  tenantId: string;
  lifecycle: PostgresInternalPilotSessionLifecycle;
  cookieName?: string;
  maxBodyBytes?: number;
  now?: () => Date;
}

export type InternalPilotSessionLifecycleEndpoint = (
  session: TrustedInternalPilotRouteSession,
  request: InternalPilotHttpRequest,
) => Promise<InternalPilotLifecycleHttpResponse>;

const DEFAULT_COOKIE_NAME =
  "nexus_internal_pilot_session";

const DEFAULT_MAX_BODY_BYTES = 8_192;

const SECURITY_HEADERS = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy":
    "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

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

function isOpaqueToken(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= 32 &&
    value.length <= 256 &&
    /^[A-Za-z0-9._~-]+$/.test(value)
  );
}

function isDigest(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-f0-9]{64}$/.test(value)
  );
}

function parseIsoTimestamp(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = new Date(value);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString() !== value
  ) {
    return null;
  }

  return value;
}

function getHeader(
  headers: Readonly<Record<string, string | undefined>>,
  name: string,
): string | undefined {
  const normalized = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (
      key.toLowerCase() === normalized &&
      typeof value === "string"
    ) {
      return value;
    }
  }

  return undefined;
}

function errorResponse(
  status: number,
  code: InternalPilotLifecycleEndpointErrorCode,
  message: string,
): InternalPilotLifecycleHttpResponse {
  return {
    status,
    headers: SECURITY_HEADERS,
    body: Object.freeze({
      ok: false,
      error: Object.freeze({
        code,
        message,
      }),
    }),
  };
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is InternalPilotSessionLifecycleEndpointRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    !isPlainRecord(runtime.lifecycle) ||
    typeof runtime.lifecycle.issue !== "function" ||
    typeof runtime.lifecycle.revoke !== "function" ||
    (
      runtime.cookieName !== undefined &&
      (
        typeof runtime.cookieName !== "string" ||
        runtime.cookieName.length < 3 ||
        runtime.cookieName.length > 64 ||
        !/^[A-Za-z0-9_-]+$/.test(runtime.cookieName)
      )
    ) ||
    (
      runtime.maxBodyBytes !== undefined &&
      (
        typeof runtime.maxBodyBytes !== "number" ||
        !Number.isInteger(runtime.maxBodyBytes) ||
        runtime.maxBodyBytes < 1_024 ||
        runtime.maxBodyBytes > 32_768
      )
    ) ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    )
  ) {
    throw new Error(
      "Internal pilot session lifecycle endpoint configuration is invalid.",
    );
  }
}

function validateAuthority(
  session: unknown,
  tenantId: string,
  currentTime: Date,
): InternalPilotLifecycleHttpResponse | null {
  if (!isPlainRecord(session)) {
    return errorResponse(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authenticated owner access is required.",
    );
  }

  if (session.authenticated !== true) {
    return errorResponse(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authenticated owner access is required.",
    );
  }

  if (session.role !== "owner") {
    return errorResponse(
      403,
      "OWNER_ROLE_REQUIRED",
      "Owner authority is required.",
    );
  }

  if (session.ownerApprovalGranted !== true) {
    return errorResponse(
      403,
      "OWNER_APPROVAL_REQUIRED",
      "Explicit owner approval is required.",
    );
  }

  if (
    !isIdentifier(session.sessionId, 8) ||
    !isIdentifier(session.actorId, 3) ||
    !isIdentifier(session.tenantId, 3) ||
    !isDigest(session.csrfTokenDigest)
  ) {
    return errorResponse(
      401,
      "AUTHENTICATION_REQUIRED",
      "The authenticated owner session is invalid.",
    );
  }

  if (session.tenantId !== tenantId) {
    return errorResponse(
      403,
      "TENANT_MISMATCH",
      "Cross-tenant session lifecycle access is blocked.",
    );
  }

  const expiresAt =
    parseIsoTimestamp(session.expiresAt);

  if (
    expiresAt === null ||
    new Date(expiresAt).getTime() <=
      currentTime.getTime()
  ) {
    return errorResponse(
      401,
      "SESSION_EXPIRED",
      "The authenticated owner session has expired.",
    );
  }

  return null;
}

function validateCsrf(
  session: TrustedInternalPilotRouteSession,
  request: InternalPilotHttpRequest,
): InternalPilotLifecycleHttpResponse | null {
  const csrfToken = getHeader(
    request.headers,
    "x-nexus-csrf-token",
  );

  if (!csrfToken) {
    return errorResponse(
      403,
      "CSRF_TOKEN_REQUIRED",
      "The internal pilot CSRF token is required.",
    );
  }

  if (!isOpaqueToken(csrfToken)) {
    return errorResponse(
      403,
      "CSRF_TOKEN_INVALID",
      "The internal pilot CSRF token is invalid.",
    );
  }

  const supplied = Buffer.from(
    createInternalPilotCsrfDigest(csrfToken),
    "hex",
  );

  const trusted = Buffer.from(
    session.csrfTokenDigest,
    "hex",
  );

  if (
    supplied.length !== trusted.length ||
    !timingSafeEqual(supplied, trusted)
  ) {
    return errorResponse(
      403,
      "CSRF_TOKEN_INVALID",
      "The internal pilot CSRF token is invalid.",
    );
  }

  return null;
}

function parseRequestBody(
  bodyText: string,
  tenantId: string,
):
  | {
      operation: "issue";
      tenantId: string;
      ownerApprovalGranted: true;
      ttlSeconds: number;
    }
  | {
      operation: "revoke";
      tenantId: string;
      sessionId: string;
    }
  | InternalPilotLifecycleHttpResponse {
  let parsed: unknown;

  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return errorResponse(
      400,
      "INVALID_JSON",
      "The internal pilot lifecycle request must contain valid JSON.",
    );
  }

  if (!isPlainRecord(parsed)) {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      "The internal pilot lifecycle request is invalid.",
    );
  }

  if (parsed.operation === "issue") {
    const keys = Object.keys(parsed).sort();
    const expected = [
      "operation",
      "ownerApprovalGranted",
      "tenantId",
      "ttlSeconds",
    ].sort();

    if (
      keys.length !== expected.length ||
      keys.some(
        (key, index) => key !== expected[index],
      ) ||
      parsed.tenantId !== tenantId ||
      parsed.ownerApprovalGranted !== true ||
      typeof parsed.ttlSeconds !== "number" ||
      !Number.isInteger(parsed.ttlSeconds) ||
      parsed.ttlSeconds < 300 ||
      parsed.ttlSeconds > 86_400
    ) {
      return errorResponse(
        parsed.tenantId === tenantId ? 400 : 403,
        parsed.tenantId === tenantId
          ? "INVALID_REQUEST"
          : "TENANT_MISMATCH",
        parsed.tenantId === tenantId
          ? "The internal pilot session issue request is invalid."
          : "Cross-tenant session lifecycle access is blocked.",
      );
    }

    return {
      operation: "issue",
      tenantId,
      ownerApprovalGranted: true,
      ttlSeconds: parsed.ttlSeconds,
    };
  }

  if (parsed.operation === "revoke") {
    const keys = Object.keys(parsed).sort();
    const expected = [
      "operation",
      "sessionId",
      "tenantId",
    ].sort();

    if (
      keys.length !== expected.length ||
      keys.some(
        (key, index) => key !== expected[index],
      ) ||
      parsed.tenantId !== tenantId ||
      !isIdentifier(parsed.sessionId, 8)
    ) {
      return errorResponse(
        parsed.tenantId === tenantId ? 400 : 403,
        parsed.tenantId === tenantId
          ? "INVALID_REQUEST"
          : "TENANT_MISMATCH",
        parsed.tenantId === tenantId
          ? "The internal pilot session revoke request is invalid."
          : "Cross-tenant session lifecycle access is blocked.",
      );
    }

    return {
      operation: "revoke",
      tenantId,
      sessionId: parsed.sessionId,
    };
  }

  return errorResponse(
    400,
    "INVALID_REQUEST",
    "The internal pilot lifecycle operation is invalid.",
  );
}

function mapLifecycleFailure(
  error: unknown,
): InternalPilotLifecycleHttpResponse {
  if (
    error instanceof
    PostgresInternalPilotSessionLifecycleError
  ) {
    if (error.code === "SESSION_NOT_FOUND") {
      return errorResponse(
        404,
        "SESSION_NOT_FOUND",
        "The internal pilot session was not found.",
      );
    }

    if (error.code === "OWNER_APPROVAL_REQUIRED") {
      return errorResponse(
        403,
        "OWNER_APPROVAL_REQUIRED",
        "Explicit owner approval is required.",
      );
    }

    if (
      error.code === "INVALID_INPUT"
    ) {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "The internal pilot lifecycle request is invalid.",
      );
    }

    return errorResponse(
      503,
      "SESSION_SERVICE_UNAVAILABLE",
      "The internal pilot session service is unavailable.",
    );
  }

  return errorResponse(
    500,
    "INTERNAL_ERROR",
    "The internal pilot lifecycle request could not be completed safely.",
  );
}

export function createInternalPilotSessionLifecycleEndpoint(
  runtime: InternalPilotSessionLifecycleEndpointRuntime,
): InternalPilotSessionLifecycleEndpoint {
  validateRuntime(runtime);

  const cookieName =
    runtime.cookieName ?? DEFAULT_COOKIE_NAME;

  const maxBodyBytes =
    runtime.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;

  const now = runtime.now ?? (() => new Date());

  return async (
    session,
    request,
  ): Promise<InternalPilotLifecycleHttpResponse> => {
    if (
      !isPlainRecord(request) ||
      typeof request.method !== "string" ||
      !isPlainRecord(request.headers) ||
      typeof request.bodyText !== "string"
    ) {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "The internal pilot lifecycle request is invalid.",
      );
    }

    if (request.method.toUpperCase() !== "POST") {
      return errorResponse(
        405,
        "METHOD_NOT_ALLOWED",
        "Only POST requests are accepted.",
      );
    }

    const contentType = getHeader(
      request.headers,
      "content-type",
    );

    if (
      !contentType ||
      !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(
        contentType,
      )
    ) {
      return errorResponse(
        415,
        "CONTENT_TYPE_REQUIRED",
        "The request content type must be application/json.",
      );
    }

    if (
      getHeader(
        request.headers,
        "x-nexus-internal-pilot",
      ) !== "sandbox-v1"
    ) {
      return errorResponse(
        403,
        "PILOT_HEADER_REQUIRED",
        "The controlled internal pilot header is required.",
      );
    }

    if (
      Buffer.byteLength(
        request.bodyText,
        "utf8",
      ) > maxBodyBytes
    ) {
      return errorResponse(
        413,
        "REQUEST_TOO_LARGE",
        "The internal pilot lifecycle request is too large.",
      );
    }

    const currentTime = now();

    if (
      !(currentTime instanceof Date) ||
      Number.isNaN(currentTime.getTime())
    ) {
      return errorResponse(
        500,
        "INTERNAL_ERROR",
        "The internal pilot lifecycle clock is unavailable.",
      );
    }

    const authorityFailure =
      validateAuthority(
        session,
        runtime.tenantId,
        currentTime,
      );

    if (authorityFailure) {
      return authorityFailure;
    }

    const csrfFailure =
      validateCsrf(session, request);

    if (csrfFailure) {
      return csrfFailure;
    }

    const body = parseRequestBody(
      request.bodyText,
      runtime.tenantId,
    );

    if ("status" in body) {
      return body;
    }

    if (body.operation === "issue") {
      try {
        const result =
          await runtime.lifecycle.issue({
            actorId: session.actorId,
            ownerApprovalGranted: true,
            ttlSeconds: body.ttlSeconds,
          });

        const issuedAt =
          parseIsoTimestamp(result.issuedAt);

        const expiresAt =
          parseIsoTimestamp(result.expiresAt);

        const expectedCookie =
          `${cookieName}=${result.sessionToken}; ` +
          "Path=/; HttpOnly; Secure; " +
          "SameSite=Strict; " +
          `Max-Age=${body.ttlSeconds}`;

        if (
          result.tenantId !== runtime.tenantId ||
          result.actorId !== session.actorId ||
          result.role !== "owner" ||
          result.ownerApprovalGranted !== true ||
          !isIdentifier(result.sessionId, 8) ||
          !isOpaqueToken(result.sessionToken) ||
          !isOpaqueToken(result.csrfToken) ||
          !isDigest(result.sessionTokenDigest) ||
          !isDigest(result.csrfTokenDigest) ||
          result.sessionTokenDigest !==
            createInternalPilotSessionTokenDigest(
              result.sessionToken,
            ) ||
          result.csrfTokenDigest !==
            createInternalPilotCsrfDigest(
              result.csrfToken,
            ) ||
          result.cookieName !== cookieName ||
          result.setCookieHeader !==
            expectedCookie ||
          issuedAt === null ||
          expiresAt === null ||
          new Date(expiresAt).getTime() <=
            new Date(issuedAt).getTime()
        ) {
          return errorResponse(
            503,
            "SESSION_RESULT_INVALID",
            "The internal pilot session service returned an invalid protected result.",
          );
        }

        return {
          status: 201,
          headers: Object.freeze({
            ...SECURITY_HEADERS,
            "set-cookie":
              result.setCookieHeader,
          }),
          body: Object.freeze({
            ok: true,
            operation: "issue",
            tenantId: runtime.tenantId,
            sessionId: result.sessionId,
            actorId: session.actorId,
            csrfToken: result.csrfToken,
            issuedAt,
            expiresAt,
            ownerApprovalRequired: true,
            liveProviderExecution: "blocked",
            externalDelivery: "blocked",
            paymentExecution: "blocked",
            publicLaunch: "blocked",
          }),
        };
      } catch (error) {
        return mapLifecycleFailure(error);
      }
    }

    try {
      const result =
        await runtime.lifecycle.revoke({
          sessionId: body.sessionId,
          actorId: session.actorId,
        });

      const revokedAt =
        parseIsoTimestamp(result.revokedAt);

      if (
        result.tenantId !== runtime.tenantId ||
        result.sessionId !== body.sessionId ||
        result.actorId !== session.actorId ||
        result.revoked !== true ||
        typeof result.replay !== "boolean" ||
        revokedAt === null
      ) {
        return errorResponse(
          503,
          "SESSION_RESULT_INVALID",
          "The internal pilot session service returned an invalid protected result.",
        );
      }

      return {
        status: 200,
        headers: Object.freeze({
          ...SECURITY_HEADERS,
          "set-cookie":
            `${cookieName}=; Path=/; ` +
            "HttpOnly; Secure; " +
            "SameSite=Strict; Max-Age=0",
        }),
        body: Object.freeze({
          ok: true,
          operation: "revoke",
          tenantId: runtime.tenantId,
          sessionId: result.sessionId,
          actorId: session.actorId,
          revoked: true,
          replay: result.replay,
          revokedAt,
          ownerApprovalRequired: true,
          liveProviderExecution: "blocked",
          externalDelivery: "blocked",
          paymentExecution: "blocked",
          publicLaunch: "blocked",
        }),
      };
    } catch (error) {
      return mapLifecycleFailure(error);
    }
  };
}
