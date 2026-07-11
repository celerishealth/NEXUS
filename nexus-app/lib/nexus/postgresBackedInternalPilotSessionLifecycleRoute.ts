import type {
  InternalPilotHttpRequest,
} from "./internalPilotSandboxWorkerEndpoint";

import {
  createPostgresInternalPilotSessionResolver,
  type PostgresInternalPilotSessionQuery,
} from "./postgresInternalPilotSessionResolver";

import {
  createPostgresInternalPilotSessionLifecycle,
} from "./postgresInternalPilotSessionLifecycle";

import type {
  WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

import {
  createInternalPilotSessionLifecycleEndpoint,
  type InternalPilotLifecycleHttpResponse,
} from "./internalPilotSessionLifecycleEndpoint";

export type PostgresBackedLifecycleRouteErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_REQUEST"
  | "ORIGIN_REQUIRED"
  | "ORIGIN_NOT_ALLOWED"
  | "IDENTITY_HEADER_FORBIDDEN"
  | "AUTHENTICATION_REQUIRED"
  | "AUTHENTICATION_UNAVAILABLE"
  | "ENDPOINT_RESPONSE_INVALID"
  | "INTERNAL_ERROR";

export class PostgresBackedLifecycleRouteError extends Error {
  readonly code: PostgresBackedLifecycleRouteErrorCode;

  constructor(
    code: PostgresBackedLifecycleRouteErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PostgresBackedLifecycleRouteError";
    this.code = code;
  }
}

export interface PostgresBackedInternalPilotSessionLifecycleRouteRuntime {
  tenantId: string;
  allowedOrigins: readonly string[];
  sessionQuery: PostgresInternalPilotSessionQuery;
  withLifecycleTransaction: WithPostgresSandboxReceiptTransaction;
  cookieName?: string;
  maxCookieHeaderBytes?: number;
  maxBodyBytes?: number;
  now?: () => Date;
  randomBytes?: (size: number) => Buffer;
}

export type PostgresBackedInternalPilotSessionLifecycleRoute = (
  request: InternalPilotHttpRequest,
) => Promise<InternalPilotLifecycleHttpResponse>;

const DEFAULT_COOKIE_NAME =
  "nexus_internal_pilot_session";

const SECURITY_HEADERS = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy":
    "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

const FORBIDDEN_IDENTITY_HEADERS = [
  "x-nexus-actor-id",
  "x-nexus-owner-id",
  "x-nexus-tenant-id",
  "x-user-id",
  "x-tenant-id",
] as const;

function routeError(
  code: PostgresBackedLifecycleRouteErrorCode,
  message: string,
): PostgresBackedLifecycleRouteError {
  return new PostgresBackedLifecycleRouteError(
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

function isTimestamp(
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

function readHeader(
  headers: Readonly<Record<string, string | undefined>>,
  name: string,
): string | undefined {
  const normalized = name.toLowerCase();
  let found: string | undefined;

  for (const [key, value] of Object.entries(headers)) {
    if (
      key.toLowerCase() !== normalized ||
      value === undefined
    ) {
      continue;
    }

    if (
      typeof value !== "string" ||
      found !== undefined
    ) {
      throw routeError(
        "INVALID_REQUEST",
        "The internal pilot lifecycle request headers are invalid.",
      );
    }

    found = value;
  }

  return found;
}

function errorResponse(
  status: number,
  code: PostgresBackedLifecycleRouteErrorCode,
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
): asserts runtime is PostgresBackedInternalPilotSessionLifecycleRouteRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    !Array.isArray(runtime.allowedOrigins) ||
    runtime.allowedOrigins.length < 1 ||
    typeof runtime.sessionQuery !== "function" ||
    typeof runtime.withLifecycleTransaction !== "function" ||
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
      runtime.maxCookieHeaderBytes !== undefined &&
      (
        typeof runtime.maxCookieHeaderBytes !== "number" ||
        !Number.isInteger(runtime.maxCookieHeaderBytes) ||
        runtime.maxCookieHeaderBytes < 512 ||
        runtime.maxCookieHeaderBytes > 16_384
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
    ) ||
    (
      runtime.randomBytes !== undefined &&
      typeof runtime.randomBytes !== "function"
    )
  ) {
    throw routeError(
      "INVALID_CONFIGURATION",
      "The Postgres-backed pilot lifecycle route configuration is invalid.",
    );
  }

  for (const origin of runtime.allowedOrigins) {
    if (
      typeof origin !== "string" ||
      origin.length < 8 ||
      origin.length > 512
    ) {
      throw routeError(
        "INVALID_CONFIGURATION",
        "The internal pilot lifecycle origin configuration is invalid.",
      );
    }

    let parsed: URL;

    try {
      parsed = new URL(origin);
    } catch {
      throw routeError(
        "INVALID_CONFIGURATION",
        "The internal pilot lifecycle origin configuration is invalid.",
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
      throw routeError(
        "INVALID_CONFIGURATION",
        "The internal pilot lifecycle origin configuration is invalid.",
      );
    }
  }
}

function hasProtectedBoundaries(
  body: Record<string, unknown>,
): boolean {
  return (
    body.ownerApprovalRequired === true &&
    body.liveProviderExecution === "blocked" &&
    body.externalDelivery === "blocked" &&
    body.paymentExecution === "blocked" &&
    body.publicLaunch === "blocked"
  );
}

function validateEndpointResponse(
  response: unknown,
  tenantId: string,
  actorId: string,
  cookieName: string,
): response is InternalPilotLifecycleHttpResponse {
  if (
    !isPlainRecord(response) ||
    typeof response.status !== "number" ||
    !Number.isInteger(response.status) ||
    response.status < 200 ||
    response.status > 599 ||
    !isPlainRecord(response.headers) ||
    !isPlainRecord(response.body)
  ) {
    return false;
  }

  if (
    response.headers["content-type"] !==
      "application/json; charset=utf-8" ||
    response.headers["cache-control"] !== "no-store" ||
    response.headers["x-content-type-options"] !== "nosniff"
  ) {
    return false;
  }

  if (response.body.ok === true) {
    if (
      response.body.tenantId !== tenantId ||
      response.body.actorId !== actorId ||
      !hasProtectedBoundaries(response.body)
    ) {
      return false;
    }

    if (response.body.operation === "issue") {
      const setCookie =
        response.headers["set-cookie"];

      return (
        response.status === 201 &&
        isIdentifier(response.body.sessionId, 8) &&
        isOpaqueToken(response.body.csrfToken) &&
        isTimestamp(response.body.issuedAt) &&
        isTimestamp(response.body.expiresAt) &&
        new Date(
          response.body.expiresAt,
        ).getTime() >
          new Date(
            response.body.issuedAt,
          ).getTime() &&
        !Object.prototype.hasOwnProperty.call(
          response.body,
          "sessionToken",
        ) &&
        typeof setCookie === "string" &&
        setCookie.startsWith(
          `${cookieName}=`,
        ) &&
        /;\s*Path=\//.test(setCookie) &&
        /;\s*HttpOnly/.test(setCookie) &&
        /;\s*Secure/.test(setCookie) &&
        /;\s*SameSite=Strict/.test(setCookie) &&
        /;\s*Max-Age=[1-9][0-9]*/.test(setCookie)
      );
    }

    if (response.body.operation === "revoke") {
      const setCookie =
        response.headers["set-cookie"];

      return (
        response.status === 200 &&
        isIdentifier(response.body.sessionId, 8) &&
        response.body.revoked === true &&
        typeof response.body.replay === "boolean" &&
        isTimestamp(response.body.revokedAt) &&
        typeof setCookie === "string" &&
        setCookie.startsWith(
          `${cookieName}=;`,
        ) &&
        /;\s*Path=\//.test(setCookie) &&
        /;\s*HttpOnly/.test(setCookie) &&
        /;\s*Secure/.test(setCookie) &&
        /;\s*SameSite=Strict/.test(setCookie) &&
        /;\s*Max-Age=0/.test(setCookie)
      );
    }

    return false;
  }

  return (
    response.body.ok === false &&
    response.status >= 400 &&
    isPlainRecord(response.body.error) &&
    typeof response.body.error.code === "string" &&
    /^[A-Z][A-Z0-9_]{2,63}$/.test(
      response.body.error.code,
    ) &&
    typeof response.body.error.message === "string" &&
    response.body.error.message.length >= 1 &&
    response.body.error.message.length <= 256 &&
    !/[\r\n]/.test(
      response.body.error.message,
    )
  );
}

function addRouteSecurityHeaders(
  response: InternalPilotLifecycleHttpResponse,
): InternalPilotLifecycleHttpResponse {
  return {
    status: response.status,
    headers: Object.freeze({
      ...response.headers,
      ...SECURITY_HEADERS,
    }),
    body: response.body,
  };
}

export function createPostgresBackedInternalPilotSessionLifecycleRoute(
  runtime: PostgresBackedInternalPilotSessionLifecycleRouteRuntime,
): PostgresBackedInternalPilotSessionLifecycleRoute {
  validateRuntime(runtime);

  const allowedOrigins =
    new Set(runtime.allowedOrigins);

  const now = runtime.now ?? (() => new Date());

  const cookieName =
    runtime.cookieName ?? DEFAULT_COOKIE_NAME;

  try {
    const resolveSession =
      createPostgresInternalPilotSessionResolver({
        tenantId: runtime.tenantId,
        query: runtime.sessionQuery,
        cookieName,
        maxCookieHeaderBytes:
          runtime.maxCookieHeaderBytes,
        now,
      });

    const lifecycle =
      createPostgresInternalPilotSessionLifecycle({
        tenantId: runtime.tenantId,
        withTransaction:
          runtime.withLifecycleTransaction,
        cookieName,
        now,
        randomBytes: runtime.randomBytes,
      });

    const endpoint =
      createInternalPilotSessionLifecycleEndpoint({
        tenantId: runtime.tenantId,
        lifecycle,
        cookieName,
        maxBodyBytes: runtime.maxBodyBytes,
        now,
      });

    return async (
      request: InternalPilotHttpRequest,
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

      let origin: string | undefined;

      try {
        origin = readHeader(
          request.headers,
          "origin",
        );
      } catch {
        return errorResponse(
          400,
          "INVALID_REQUEST",
          "The internal pilot lifecycle request headers are invalid.",
        );
      }

      if (!origin) {
        return errorResponse(
          403,
          "ORIGIN_REQUIRED",
          "A trusted internal pilot origin is required.",
        );
      }

      if (!allowedOrigins.has(origin)) {
        return errorResponse(
          403,
          "ORIGIN_NOT_ALLOWED",
          "The internal pilot lifecycle origin is not authorized.",
        );
      }

      for (
        const forbiddenHeader
        of FORBIDDEN_IDENTITY_HEADERS
      ) {
        try {
          if (
            readHeader(
              request.headers,
              forbiddenHeader,
            ) !== undefined
          ) {
            return errorResponse(
              400,
              "IDENTITY_HEADER_FORBIDDEN",
              "Client-supplied identity headers are forbidden.",
            );
          }
        } catch {
          return errorResponse(
            400,
            "INVALID_REQUEST",
            "The internal pilot lifecycle request headers are invalid.",
          );
        }
      }

      let session;

      try {
        session =
          await resolveSession(request);
      } catch {
        return errorResponse(
          503,
          "AUTHENTICATION_UNAVAILABLE",
          "The internal pilot authentication service is unavailable.",
        );
      }

      if (session === null) {
        return errorResponse(
          401,
          "AUTHENTICATION_REQUIRED",
          "Authenticated owner access is required.",
        );
      }

      let response:
        InternalPilotLifecycleHttpResponse;

      try {
        response = await endpoint(
          session,
          request,
        );
      } catch {
        return errorResponse(
          500,
          "INTERNAL_ERROR",
          "The internal pilot lifecycle request could not be completed safely.",
        );
      }

      if (
        !validateEndpointResponse(
          response,
          runtime.tenantId,
          session.actorId,
          cookieName,
        )
      ) {
        return errorResponse(
          503,
          "ENDPOINT_RESPONSE_INVALID",
          "The internal pilot lifecycle endpoint returned an invalid protected response.",
        );
      }

      return addRouteSecurityHeaders(
        response,
      );
    };
  } catch {
    throw routeError(
      "INVALID_CONFIGURATION",
      "The Postgres-backed pilot lifecycle route dependencies could not be composed safely.",
    );
  }
}
