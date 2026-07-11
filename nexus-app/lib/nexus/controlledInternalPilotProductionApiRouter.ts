import type {
  InternalPilotHttpRequest,
} from "./internalPilotSandboxWorkerEndpoint";

export const INTERNAL_PILOT_SESSION_ROUTE_PATH =
  "/api/nexus/internal-pilot/session-lifecycle";

export const INTERNAL_PILOT_WORKER_ROUTE_PATH =
  "/api/nexus/internal-pilot/sandbox-worker-cycle";

export type ControlledInternalPilotRouteKind =
  | "session-lifecycle"
  | "sandbox-worker-cycle";

export type ControlledInternalPilotApiErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_REQUEST"
  | "METHOD_NOT_ALLOWED"
  | "ROUTE_NOT_FOUND"
  | "ROUTE_EXECUTION_FAILED"
  | "ROUTE_RESPONSE_INVALID";

export class ControlledInternalPilotApiRouterError extends Error {
  readonly code: ControlledInternalPilotApiErrorCode;

  constructor(
    code: ControlledInternalPilotApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name =
      "ControlledInternalPilotApiRouterError";
    this.code = code;
  }
}

export interface ControlledInternalPilotApiRequest
  extends InternalPilotHttpRequest {
  path: string;
}

export interface ControlledInternalPilotApiResponse {
  status: number;
  headers: Readonly<Record<string, string>>;
  body: Readonly<Record<string, unknown>>;
}

export type ControlledInternalPilotRouteHandler = (
  request: InternalPilotHttpRequest,
) => Promise<unknown>;

export interface ControlledInternalPilotProductionApiRouterRuntime {
  sessionLifecycleRoute:
    ControlledInternalPilotRouteHandler;
  sandboxWorkerRoute:
    ControlledInternalPilotRouteHandler;
  cookieName?: string;
  maxResponseBodyBytes?: number;
}

export type ControlledInternalPilotProductionApiRouter = (
  request: ControlledInternalPilotApiRequest,
) => Promise<ControlledInternalPilotApiResponse>;

const DEFAULT_COOKIE_NAME =
  "nexus_internal_pilot_session";

const DEFAULT_MAX_RESPONSE_BODY_BYTES =
  65_536;

const SECURITY_HEADERS = Object.freeze({
  "content-type":
    "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy":
    "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

const REQUIRED_SECURITY_HEADER_NAMES =
  Object.keys(SECURITY_HEADERS).sort();

const FORBIDDEN_BODY_KEYS = new Set([
  "databaseUrl",
  "database_url",
  "password",
  "privateKey",
  "private_key",
  "rawError",
  "raw_error",
  "sessionToken",
  "session_token",
  "sessionTokenDigest",
  "session_token_digest",
  "csrfTokenDigest",
  "csrf_token_digest",
  "stack",
]);

function routerError(
  code: ControlledInternalPilotApiErrorCode,
  message: string,
): ControlledInternalPilotApiRouterError {
  return new ControlledInternalPilotApiRouterError(
    code,
    message,
  );
}

function isPlainRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) ===
      Object.prototype
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
    /^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(
      value,
    )
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

function isIsoTimestamp(
  value: unknown,
): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const parsed = new Date(value);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString() === value
  );
}

function safeErrorResponse(
  status: number,
  code: ControlledInternalPilotApiErrorCode,
  message: string,
): ControlledInternalPilotApiResponse {
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
): asserts runtime is ControlledInternalPilotProductionApiRouterRuntime {
  if (
    !isPlainRecord(runtime) ||
    typeof runtime.sessionLifecycleRoute !==
      "function" ||
    typeof runtime.sandboxWorkerRoute !==
      "function" ||
    (
      runtime.cookieName !== undefined &&
      (
        typeof runtime.cookieName !== "string" ||
        runtime.cookieName.length < 3 ||
        runtime.cookieName.length > 64 ||
        !/^[A-Za-z0-9_-]+$/.test(
          runtime.cookieName,
        )
      )
    ) ||
    (
      runtime.maxResponseBodyBytes !==
        undefined &&
      (
        !Number.isInteger(
          runtime.maxResponseBodyBytes,
        ) ||
        runtime.maxResponseBodyBytes < 1_024 ||
        runtime.maxResponseBodyBytes >
          131_072
      )
    )
  ) {
    throw routerError(
      "INVALID_CONFIGURATION",
      "The controlled internal pilot API router configuration is invalid.",
    );
  }
}

function normalizeHeaders(
  value: unknown,
): Record<string, string> | null {
  if (!isPlainRecord(value)) {
    return null;
  }

  const normalized:
    Record<string, string> = {};

  for (const [rawName, rawValue] of Object.entries(
    value,
  )) {
    if (
      typeof rawValue !== "string" ||
      rawName.length < 1 ||
      rawName.length > 128
    ) {
      return null;
    }

    const name = rawName.toLowerCase();

    if (
      !/^[a-z0-9-]+$/.test(name) ||
      Object.prototype.hasOwnProperty.call(
        normalized,
        name,
      ) ||
      /[\r\n]/.test(rawValue)
    ) {
      return null;
    }

    normalized[name] = rawValue;
  }

  return normalized;
}

function containsForbiddenBodyKey(
  value: unknown,
  depth = 0,
): boolean {
  if (depth > 8) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      containsForbiddenBodyKey(
        item,
        depth + 1,
      ),
    );
  }

  if (!isPlainRecord(value)) {
    return false;
  }

  for (const [key, child] of Object.entries(
    value,
  )) {
    if (
      FORBIDDEN_BODY_KEYS.has(key) ||
      containsForbiddenBodyKey(
        child,
        depth + 1,
      )
    ) {
      return true;
    }
  }

  return false;
}

function hasExactSecurityHeaders(
  headers: Record<string, string>,
  allowSetCookie: boolean,
): boolean {
  const allowedNames = allowSetCookie
    ? [
        ...REQUIRED_SECURITY_HEADER_NAMES,
        "set-cookie",
      ].sort()
    : REQUIRED_SECURITY_HEADER_NAMES;

  const actualNames =
    Object.keys(headers).sort();

  if (
    actualNames.length !==
      allowedNames.length ||
    actualNames.some(
      (name, index) =>
        name !== allowedNames[index],
    )
  ) {
    return false;
  }

  return (
    headers["content-type"] ===
      SECURITY_HEADERS["content-type"] &&
    headers["cache-control"] ===
      SECURITY_HEADERS["cache-control"] &&
    headers["x-content-type-options"] ===
      SECURITY_HEADERS[
        "x-content-type-options"
      ] &&
    headers["content-security-policy"] ===
      SECURITY_HEADERS[
        "content-security-policy"
      ] &&
    headers["referrer-policy"] ===
      SECURITY_HEADERS["referrer-policy"]
  );
}

function hasSafetyBoundaries(
  body: Record<string, unknown>,
): boolean {
  return (
    body.ownerApprovalRequired === true &&
    body.liveProviderExecution ===
      "blocked" &&
    body.externalDelivery === "blocked" &&
    body.paymentExecution === "blocked" &&
    body.publicLaunch === "blocked"
  );
}

function validateSafeErrorBody(
  body: Record<string, unknown>,
): boolean {
  const keys = Object.keys(body).sort();

  if (
    keys.length !== 2 ||
    keys[0] !== "error" ||
    keys[1] !== "ok" ||
    body.ok !== false ||
    !isPlainRecord(body.error)
  ) {
    return false;
  }

  const errorKeys =
    Object.keys(body.error).sort();

  return (
    errorKeys.length === 2 &&
    errorKeys[0] === "code" &&
    errorKeys[1] === "message" &&
    typeof body.error.code === "string" &&
    /^[A-Z][A-Z0-9_]{2,63}$/.test(
      body.error.code,
    ) &&
    typeof body.error.message === "string" &&
    body.error.message.length >= 1 &&
    body.error.message.length <= 256 &&
    !/[\r\n]/.test(body.error.message)
  );
}

function validateSessionSuccess(
  status: number,
  headers: Record<string, string>,
  body: Record<string, unknown>,
  cookieName: string,
): boolean {
  if (
    !hasSafetyBoundaries(body) ||
    body.ok !== true ||
    !isIdentifier(body.tenantId, 3) ||
    !isIdentifier(body.actorId, 3) ||
    !isIdentifier(body.sessionId, 8)
  ) {
    return false;
  }

  const setCookie = headers["set-cookie"];

  if (
    typeof setCookie !== "string" ||
    !setCookie.startsWith(
      `${cookieName}=`,
    ) ||
    !/;\s*Path=\//.test(setCookie) ||
    !/;\s*HttpOnly/.test(setCookie) ||
    !/;\s*Secure/.test(setCookie) ||
    !/;\s*SameSite=Strict/.test(
      setCookie,
    )
  ) {
    return false;
  }

  if (body.operation === "issue") {
    return (
      status === 201 &&
      isOpaqueToken(body.csrfToken) &&
      isIsoTimestamp(body.issuedAt) &&
      isIsoTimestamp(body.expiresAt) &&
      new Date(body.expiresAt).getTime() >
        new Date(body.issuedAt).getTime() &&
      /;\s*Max-Age=[1-9][0-9]*/.test(
        setCookie,
      ) &&
      !setCookie.startsWith(
        `${cookieName}=;`,
      )
    );
  }

  if (body.operation === "revoke") {
    return (
      status === 200 &&
      body.revoked === true &&
      typeof body.replay === "boolean" &&
      isIsoTimestamp(body.revokedAt) &&
      setCookie.startsWith(
        `${cookieName}=;`,
      ) &&
      /;\s*Max-Age=0/.test(setCookie)
    );
  }

  return false;
}

function validateWorkerSuccess(
  status: number,
  headers: Record<string, string>,
  body: Record<string, unknown>,
): boolean {
  return (
    status >= 200 &&
    status <= 299 &&
    body.ok === true &&
    hasSafetyBoundaries(body) &&
    !Object.prototype.hasOwnProperty.call(
      headers,
      "set-cookie",
    )
  );
}

function validateRouteResponse(
  routeKind: ControlledInternalPilotRouteKind,
  response: unknown,
  cookieName: string,
  maxResponseBodyBytes: number,
): response is ControlledInternalPilotApiResponse {
  if (
    !isPlainRecord(response) ||
    !Number.isInteger(response.status) ||
    response.status < 200 ||
    response.status > 599 ||
    !isPlainRecord(response.body)
  ) {
    return false;
  }

  const headers =
    normalizeHeaders(response.headers);

  if (headers === null) {
    return false;
  }

  let serializedBody: string;

  try {
    serializedBody =
      JSON.stringify(response.body);
  } catch {
    return false;
  }

  if (
    Buffer.byteLength(
      serializedBody,
      "utf8",
    ) > maxResponseBodyBytes ||
    containsForbiddenBodyKey(
      response.body,
    )
  ) {
    return false;
  }

  if (response.body.ok === false) {
    return (
      response.status >= 400 &&
      hasExactSecurityHeaders(
        headers,
        false,
      ) &&
      validateSafeErrorBody(
        response.body,
      )
    );
  }

  if (response.body.ok !== true) {
    return false;
  }

  if (
    routeKind === "session-lifecycle"
  ) {
    return (
      hasExactSecurityHeaders(
        headers,
        true,
      ) &&
      validateSessionSuccess(
        response.status,
        headers,
        response.body,
        cookieName,
      )
    );
  }

  return (
    hasExactSecurityHeaders(
      headers,
      false,
    ) &&
    validateWorkerSuccess(
      response.status,
      headers,
      response.body,
    )
  );
}

function stripPath(
  request: ControlledInternalPilotApiRequest,
): InternalPilotHttpRequest {
  return {
    method: request.method,
    headers: request.headers,
    bodyText: request.bodyText,
  };
}

export function createControlledInternalPilotProductionApiRouter(
  runtime: ControlledInternalPilotProductionApiRouterRuntime,
): ControlledInternalPilotProductionApiRouter {
  validateRuntime(runtime);

  const cookieName =
    runtime.cookieName ??
    DEFAULT_COOKIE_NAME;

  const maxResponseBodyBytes =
    runtime.maxResponseBodyBytes ??
    DEFAULT_MAX_RESPONSE_BODY_BYTES;

  return async (
    request: ControlledInternalPilotApiRequest,
  ): Promise<ControlledInternalPilotApiResponse> => {
    if (
      !isPlainRecord(request) ||
      typeof request.path !== "string" ||
      typeof request.method !== "string" ||
      !isPlainRecord(request.headers) ||
      typeof request.bodyText !== "string"
    ) {
      return safeErrorResponse(
        400,
        "INVALID_REQUEST",
        "The controlled internal pilot API request is invalid.",
      );
    }

    if (
      request.method.toUpperCase() !==
      "POST"
    ) {
      return safeErrorResponse(
        405,
        "METHOD_NOT_ALLOWED",
        "Only POST requests are accepted.",
      );
    }

    let routeKind:
      ControlledInternalPilotRouteKind;

    let handler:
      ControlledInternalPilotRouteHandler;

    if (
      request.path ===
      INTERNAL_PILOT_SESSION_ROUTE_PATH
    ) {
      routeKind = "session-lifecycle";
      handler =
        runtime.sessionLifecycleRoute;
    } else if (
      request.path ===
      INTERNAL_PILOT_WORKER_ROUTE_PATH
    ) {
      routeKind =
        "sandbox-worker-cycle";
      handler =
        runtime.sandboxWorkerRoute;
    } else {
      return safeErrorResponse(
        404,
        "ROUTE_NOT_FOUND",
        "The controlled internal pilot API route was not found.",
      );
    }

    let response: unknown;

    try {
      response = await handler(
        stripPath(request),
      );
    } catch {
      return safeErrorResponse(
        500,
        "ROUTE_EXECUTION_FAILED",
        "The controlled internal pilot route could not be completed safely.",
      );
    }

    if (
      !validateRouteResponse(
        routeKind,
        response,
        cookieName,
        maxResponseBodyBytes,
      )
    ) {
      return safeErrorResponse(
        503,
        "ROUTE_RESPONSE_INVALID",
        "The controlled internal pilot route returned an invalid protected response.",
      );
    }

    return response;
  };
}
