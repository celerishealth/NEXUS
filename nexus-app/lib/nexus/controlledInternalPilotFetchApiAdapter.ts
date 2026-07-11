import {
  TextDecoder,
} from "node:util";

import {
  INTERNAL_PILOT_SESSION_ROUTE_PATH,
  INTERNAL_PILOT_WORKER_ROUTE_PATH,
  type ControlledInternalPilotApiRequest,
  type ControlledInternalPilotApiResponse,
  type ControlledInternalPilotProductionApiRouter,
} from "./controlledInternalPilotProductionApiRouter";

export type ControlledInternalPilotFetchErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_REQUEST"
  | "INVALID_REQUEST_URL"
  | "HOST_NOT_ALLOWED"
  | "QUERY_NOT_ALLOWED"
  | "METHOD_NOT_ALLOWED"
  | "IDENTITY_HEADER_FORBIDDEN"
  | "REQUEST_HEADER_INVALID"
  | "CONTENT_LENGTH_INVALID"
  | "REQUEST_BODY_TOO_LARGE"
  | "REQUEST_BODY_LENGTH_MISMATCH"
  | "CONTENT_ENCODING_FORBIDDEN"
  | "BODY_READ_FAILED"
  | "ROUTER_EXECUTION_FAILED"
  | "ROUTER_RESPONSE_INVALID"
  | "RESPONSE_SERIALIZATION_FAILED";

export class ControlledInternalPilotFetchApiAdapterError extends Error {
  readonly code: ControlledInternalPilotFetchErrorCode;

  constructor(
    code: ControlledInternalPilotFetchErrorCode,
    message: string,
  ) {
    super(message);
    this.name =
      "ControlledInternalPilotFetchApiAdapterError";
    this.code = code;
  }
}

export interface ControlledInternalPilotFetchApiAdapterRuntime {
  router: ControlledInternalPilotProductionApiRouter;
  allowedHosts: readonly string[];
  maxRequestBodyBytes?: number;
  maxResponseBodyBytes?: number;
}

export type ControlledInternalPilotFetchApiHandler = (
  request: Request,
) => Promise<Response>;

const DEFAULT_MAX_REQUEST_BODY_BYTES =
  65_536;

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

const REQUIRED_RESPONSE_HEADER_NAMES =
  Object.keys(SECURITY_HEADERS).sort();

const FORWARDED_REQUEST_HEADERS = [
  "origin",
  "cookie",
  "content-type",
  "x-nexus-internal-pilot",
  "x-nexus-csrf-token",
  "x-nexus-idempotency-key",
] as const;

const SINGLE_VALUE_REQUEST_HEADERS = [
  "origin",
  "content-type",
  "x-nexus-internal-pilot",
  "x-nexus-csrf-token",
  "x-nexus-idempotency-key",
] as const;

const FORBIDDEN_IDENTITY_HEADERS = [
  "authorization",
  "x-nexus-actor-id",
  "x-nexus-owner-id",
  "x-nexus-tenant-id",
  "x-user-id",
  "x-tenant-id",
  "x-forwarded-user",
  "x-forwarded-email",
] as const;

const FORBIDDEN_RESPONSE_BODY_KEYS =
  new Set([
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

function adapterError(
  code: ControlledInternalPilotFetchErrorCode,
  message: string,
): ControlledInternalPilotFetchApiAdapterError {
  return new ControlledInternalPilotFetchApiAdapterError(
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

function safeErrorPayload(
  code: ControlledInternalPilotFetchErrorCode,
  message: string,
): Readonly<Record<string, unknown>> {
  return Object.freeze({
    ok: false,
    error: Object.freeze({
      code,
      message,
    }),
  });
}

function createJsonResponse(
  status: number,
  body: Readonly<Record<string, unknown>>,
  additionalHeaders?: Readonly<Record<string, string>>,
): Response {
  let serialized: string;

  try {
    serialized = JSON.stringify(body);
  } catch {
    serialized = JSON.stringify(
      safeErrorPayload(
        "RESPONSE_SERIALIZATION_FAILED",
        "The controlled internal pilot response could not be serialized safely.",
      ),
    );

    status = 500;
    additionalHeaders = undefined;
  }

  return new Response(serialized, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...additionalHeaders,
    },
  });
}

function safeErrorResponse(
  status: number,
  code: ControlledInternalPilotFetchErrorCode,
  message: string,
): Response {
  return createJsonResponse(
    status,
    safeErrorPayload(code, message),
  );
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is ControlledInternalPilotFetchApiAdapterRuntime {
  if (
    !isPlainRecord(runtime) ||
    typeof runtime.router !== "function" ||
    !Array.isArray(runtime.allowedHosts) ||
    runtime.allowedHosts.length < 1 ||
    (
      runtime.maxRequestBodyBytes !==
        undefined &&
      (
        !Number.isInteger(
          runtime.maxRequestBodyBytes,
        ) ||
        runtime.maxRequestBodyBytes < 1_024 ||
        runtime.maxRequestBodyBytes >
          1_048_576
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
          1_048_576
      )
    )
  ) {
    throw adapterError(
      "INVALID_CONFIGURATION",
      "The controlled internal pilot Fetch API adapter configuration is invalid.",
    );
  }

  const uniqueHosts = new Set<string>();

  for (const host of runtime.allowedHosts) {
    if (
      typeof host !== "string" ||
      host.length < 3 ||
      host.length > 253 ||
      !/^[A-Za-z0-9.-]+(?::[0-9]{1,5})?$/.test(
        host,
      ) ||
      uniqueHosts.has(host.toLowerCase())
    ) {
      throw adapterError(
        "INVALID_CONFIGURATION",
        "The controlled internal pilot host configuration is invalid.",
      );
    }

    uniqueHosts.add(host.toLowerCase());
  }
}

function isFetchRequestLike(
  value: unknown,
): value is Request {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate = value as {
    url?: unknown;
    method?: unknown;
    headers?: {
      get?: unknown;
    };
    arrayBuffer?: unknown;
  };

  return (
    typeof candidate.url === "string" &&
    typeof candidate.method === "string" &&
    typeof candidate.headers === "object" &&
    candidate.headers !== null &&
    typeof candidate.headers.get ===
      "function" &&
    typeof candidate.arrayBuffer ===
      "function"
  );
}

function getHeader(
  request: Request,
  name: string,
): string | null {
  const value = request.headers.get(name);

  if (
    value !== null &&
    (
      value.length > 8_192 ||
      /[\r\n\0]/.test(value)
    )
  ) {
    throw adapterError(
      "REQUEST_HEADER_INVALID",
      "The controlled internal pilot request headers are invalid.",
    );
  }

  return value;
}

function validateSingleValueHeaders(
  request: Request,
): void {
  for (
    const headerName
    of SINGLE_VALUE_REQUEST_HEADERS
  ) {
    const value = getHeader(
      request,
      headerName,
    );

    if (
      value !== null &&
      value.includes(",")
    ) {
      throw adapterError(
        "REQUEST_HEADER_INVALID",
        "The controlled internal pilot request headers are invalid.",
      );
    }
  }
}

function buildForwardedHeaders(
  request: Request,
): Readonly<Record<string, string>> {
  const headers: Record<string, string> =
    {};

  for (
    const headerName
    of FORWARDED_REQUEST_HEADERS
  ) {
    const value = getHeader(
      request,
      headerName,
    );

    if (value !== null) {
      headers[headerName] = value;
    }
  }

  return Object.freeze(headers);
}

function containsForbiddenResponseKey(
  value: unknown,
  depth = 0,
): boolean {
  if (depth > 8) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      containsForbiddenResponseKey(
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
      FORBIDDEN_RESPONSE_BODY_KEYS.has(
        key,
      ) ||
      containsForbiddenResponseKey(
        child,
        depth + 1,
      )
    ) {
      return true;
    }
  }

  return false;
}

function normalizeResponseHeaders(
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
      rawName.length > 128 ||
      rawValue.length > 8_192 ||
      /[\r\n\0]/.test(rawValue)
    ) {
      return null;
    }

    const name = rawName.toLowerCase();

    if (
      !/^[a-z0-9-]+$/.test(name) ||
      Object.prototype.hasOwnProperty.call(
        normalized,
        name,
      )
    ) {
      return null;
    }

    normalized[name] = rawValue;
  }

  return normalized;
}

function hasExactResponseHeaders(
  headers: Record<string, string>,
  allowSetCookie: boolean,
): boolean {
  const expectedNames = allowSetCookie
    ? [
        ...REQUIRED_RESPONSE_HEADER_NAMES,
        "set-cookie",
      ].sort()
    : REQUIRED_RESPONSE_HEADER_NAMES;

  const actualNames =
    Object.keys(headers).sort();

  if (
    actualNames.length !==
      expectedNames.length ||
    actualNames.some(
      (name, index) =>
        name !== expectedNames[index],
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
    !/[\r\n\0]/.test(
      body.error.message,
    )
  );
}

function validateRouterResponse(
  pathName: string,
  response: unknown,
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
    normalizeResponseHeaders(
      response.headers,
    );

  if (headers === null) {
    return false;
  }

  let serialized: string;

  try {
    serialized =
      JSON.stringify(response.body);
  } catch {
    return false;
  }

  if (
    Buffer.byteLength(
      serialized,
      "utf8",
    ) > maxResponseBodyBytes ||
    containsForbiddenResponseKey(
      response.body,
    )
  ) {
    return false;
  }

  if (response.body.ok === false) {
    return (
      response.status >= 400 &&
      hasExactResponseHeaders(
        headers,
        false,
      ) &&
      validateSafeErrorBody(
        response.body,
      )
    );
  }

  if (
    response.body.ok !== true ||
    !hasSafetyBoundaries(response.body)
  ) {
    return false;
  }

  if (
    pathName ===
    INTERNAL_PILOT_SESSION_ROUTE_PATH
  ) {
    return (
      hasExactResponseHeaders(
        headers,
        true,
      ) &&
      typeof headers["set-cookie"] ===
        "string" &&
      /;\s*HttpOnly/.test(
        headers["set-cookie"],
      ) &&
      /;\s*Secure/.test(
        headers["set-cookie"],
      ) &&
      /;\s*SameSite=Strict/.test(
        headers["set-cookie"],
      )
    );
  }

  return (
    pathName ===
      INTERNAL_PILOT_WORKER_ROUTE_PATH &&
    hasExactResponseHeaders(
      headers,
      false,
    )
  );
}

function toFetchResponse(
  response: ControlledInternalPilotApiResponse,
): Response {
  const headers =
    normalizeResponseHeaders(
      response.headers,
    );

  if (headers === null) {
    throw adapterError(
      "ROUTER_RESPONSE_INVALID",
      "The controlled internal pilot router returned invalid headers.",
    );
  }

  return createJsonResponse(
    response.status,
    response.body,
    headers["set-cookie"]
      ? {
          "set-cookie":
            headers["set-cookie"],
        }
      : undefined,
  );
}

export function createControlledInternalPilotFetchApiAdapter(
  runtime: ControlledInternalPilotFetchApiAdapterRuntime,
): ControlledInternalPilotFetchApiHandler {
  validateRuntime(runtime);

  const allowedHosts = new Set(
    runtime.allowedHosts.map((host) =>
      host.toLowerCase(),
    ),
  );

  const maxRequestBodyBytes =
    runtime.maxRequestBodyBytes ??
    DEFAULT_MAX_REQUEST_BODY_BYTES;

  const maxResponseBodyBytes =
    runtime.maxResponseBodyBytes ??
    DEFAULT_MAX_RESPONSE_BODY_BYTES;

  return async (
    request: Request,
  ): Promise<Response> => {
    if (!isFetchRequestLike(request)) {
      return safeErrorResponse(
        400,
        "INVALID_REQUEST",
        "The controlled internal pilot HTTP request is invalid.",
      );
    }

    let url: URL;

    try {
      url = new URL(request.url);
    } catch {
      return safeErrorResponse(
        400,
        "INVALID_REQUEST_URL",
        "The controlled internal pilot request URL is invalid.",
      );
    }

    if (
      url.username !== "" ||
      url.password !== "" ||
      (
        url.protocol !== "https:" &&
        !(
          url.protocol === "http:" &&
          (
            url.hostname === "localhost" ||
            url.hostname === "127.0.0.1"
          )
        )
      )
    ) {
      return safeErrorResponse(
        400,
        "INVALID_REQUEST_URL",
        "The controlled internal pilot request URL is invalid.",
      );
    }

    if (
      !allowedHosts.has(
        url.host.toLowerCase(),
      )
    ) {
      return safeErrorResponse(
        403,
        "HOST_NOT_ALLOWED",
        "The controlled internal pilot request host is not authorized.",
      );
    }

    if (
      url.search !== "" ||
      url.hash !== ""
    ) {
      return safeErrorResponse(
        400,
        "QUERY_NOT_ALLOWED",
        "Query strings and URL fragments are forbidden on controlled internal pilot routes.",
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

    try {
      for (
        const forbiddenHeader
        of FORBIDDEN_IDENTITY_HEADERS
      ) {
        if (
          getHeader(
            request,
            forbiddenHeader,
          ) !== null
        ) {
          return safeErrorResponse(
            400,
            "IDENTITY_HEADER_FORBIDDEN",
            "Client-supplied identity headers are forbidden.",
          );
        }
      }

      validateSingleValueHeaders(request);
    } catch (
      error
    ) {
      if (
        error instanceof
        ControlledInternalPilotFetchApiAdapterError
      ) {
        return safeErrorResponse(
          400,
          error.code,
          error.message,
        );
      }

      return safeErrorResponse(
        400,
        "REQUEST_HEADER_INVALID",
        "The controlled internal pilot request headers are invalid.",
      );
    }

    const contentEncoding =
      request.headers.get(
        "content-encoding",
      );

    if (
      contentEncoding !== null &&
      contentEncoding.toLowerCase() !==
        "identity"
    ) {
      return safeErrorResponse(
        415,
        "CONTENT_ENCODING_FORBIDDEN",
        "Compressed controlled internal pilot request bodies are forbidden.",
      );
    }

    const rawContentLength =
      request.headers.get(
        "content-length",
      );

    let declaredContentLength:
      number | null = null;

    if (rawContentLength !== null) {
      if (
        !/^(0|[1-9][0-9]*)$/.test(
          rawContentLength,
        )
      ) {
        return safeErrorResponse(
          400,
          "CONTENT_LENGTH_INVALID",
          "The controlled internal pilot request content length is invalid.",
        );
      }

      declaredContentLength =
        Number(rawContentLength);

      if (
        !Number.isSafeInteger(
          declaredContentLength,
        )
      ) {
        return safeErrorResponse(
          400,
          "CONTENT_LENGTH_INVALID",
          "The controlled internal pilot request content length is invalid.",
        );
      }

      if (
        declaredContentLength >
        maxRequestBodyBytes
      ) {
        return safeErrorResponse(
          413,
          "REQUEST_BODY_TOO_LARGE",
          "The controlled internal pilot request body is too large.",
        );
      }
    }

    let bodyBytes: ArrayBuffer;

    try {
      bodyBytes =
        await request.arrayBuffer();
    } catch {
      return safeErrorResponse(
        400,
        "BODY_READ_FAILED",
        "The controlled internal pilot request body could not be read safely.",
      );
    }

    if (
      bodyBytes.byteLength >
      maxRequestBodyBytes
    ) {
      return safeErrorResponse(
        413,
        "REQUEST_BODY_TOO_LARGE",
        "The controlled internal pilot request body is too large.",
      );
    }

    if (
      declaredContentLength !== null &&
      declaredContentLength !==
        bodyBytes.byteLength
    ) {
      return safeErrorResponse(
        400,
        "REQUEST_BODY_LENGTH_MISMATCH",
        "The controlled internal pilot request body length does not match its declaration.",
      );
    }

    let bodyText: string;

    try {
      bodyText = new TextDecoder(
        "utf-8",
        {
          fatal: true,
        },
      ).decode(bodyBytes);
    } catch {
      return safeErrorResponse(
        400,
        "BODY_READ_FAILED",
        "The controlled internal pilot request body is not valid UTF-8.",
      );
    }

    const routerRequest:
      ControlledInternalPilotApiRequest = {
        path: url.pathname,
        method: request.method,
        headers:
          buildForwardedHeaders(
            request,
          ),
        bodyText,
      };

    let routerResponse: unknown;

    try {
      routerResponse =
        await runtime.router(
          routerRequest,
        );
    } catch {
      return safeErrorResponse(
        500,
        "ROUTER_EXECUTION_FAILED",
        "The controlled internal pilot router could not be completed safely.",
      );
    }

    if (
      !validateRouterResponse(
        url.pathname,
        routerResponse,
        maxResponseBodyBytes,
      )
    ) {
      return safeErrorResponse(
        503,
        "ROUTER_RESPONSE_INVALID",
        "The controlled internal pilot router returned an invalid protected response.",
      );
    }

    try {
      return toFetchResponse(
        routerResponse,
      );
    } catch {
      return safeErrorResponse(
        500,
        "RESPONSE_SERIALIZATION_FAILED",
        "The controlled internal pilot response could not be serialized safely.",
      );
    }
  };
}
