import { createHash } from "node:crypto";

import {
  handleCustomerVerticalSliceCommand,
  type CustomerVerticalSliceRateLimiter,
  type CustomerVerticalSliceSession,
} from "./customerVerticalSliceCommandHandler";

import type {
  AuthenticatedAuditWriterContext,
} from "./customerVerticalSliceAuditLedger";

import type {
  CustomerVerticalSliceTransactionalRepository,
} from "./customerVerticalSliceAuditedTransition";

export interface CustomerVerticalSliceHttpRouteDependencies {
  loadSession(
    request: Request,
  ): Promise<CustomerVerticalSliceSession>;

  verifyRequestIntegrity(input: {
    request: Request;
    session: CustomerVerticalSliceSession;
    rawBody: string;
  }): Promise<boolean>;

  auditContext: AuthenticatedAuditWriterContext;
  rateLimiter: CustomerVerticalSliceRateLimiter;
  repository: CustomerVerticalSliceTransactionalRepository;
  nowIso?: string;
}

const MAX_HTTP_BODY_BYTES = 8_192;

function securityHeaders(): Record<string, string> {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store, max-age=0",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "cross-origin-resource-policy": "same-origin",
    "x-nexus-response-version": "1",
  };
}

function createCorrelationId(source: string): string {
  return `vshr_${createHash("sha256")
    .update(source, "utf8")
    .digest("hex")
    .slice(0, 20)}`;
}

function jsonResponse(input: {
  status: number;
  correlationId: string;
  code: string;
  message: string;
  retryable: boolean;
  headers?: Record<string, string>;
}): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      correlationId: input.correlationId,
      error: {
        code: input.code,
        message: input.message,
        retryable: input.retryable,
      },
    }),
    {
      status: input.status,
      headers: {
        ...securityHeaders(),
        "x-correlation-id": input.correlationId,
        ...input.headers,
      },
    },
  );
}

function readContentLength(
  request: Request,
): number | null {
  const value = request.headers.get(
    "content-length",
  );

  if (value === null) {
    return null;
  }

  if (!/^[0-9]+$/.test(value)) {
    return Number.NaN;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed)
    ? parsed
    : Number.NaN;
}

function isJsonContentType(
  request: Request,
): boolean {
  const contentType = request.headers
    .get("content-type")
    ?.toLowerCase()
    .trim();

  if (!contentType) {
    return false;
  }

  const mediaType = contentType
    .split(";", 1)[0]
    .trim();

  return mediaType === "application/json";
}

function hasUnsupportedEncoding(
  request: Request,
): boolean {
  const encoding = request.headers
    .get("content-encoding")
    ?.trim()
    .toLowerCase();

  return (
    encoding !== undefined &&
    encoding !== "" &&
    encoding !== "identity"
  );
}

export async function handleCustomerVerticalSliceHttpRequest(
  request: Request,
  dependencies: CustomerVerticalSliceHttpRouteDependencies,
): Promise<Response> {
  const routeCorrelationId = createCorrelationId(
    [
      request.method,
      request.url,
      request.headers.get("x-request-id") ?? "",
    ].join("|"),
  );

  if (request.method.toUpperCase() !== "POST") {
    return jsonResponse({
      status: 405,
      correlationId: routeCorrelationId,
      code: "METHOD_NOT_ALLOWED",
      message: "Only POST requests are permitted.",
      retryable: false,
      headers: {
        allow: "POST",
      },
    });
  }

  if (!isJsonContentType(request)) {
    return jsonResponse({
      status: 415,
      correlationId: routeCorrelationId,
      code: "UNSUPPORTED_MEDIA_TYPE",
      message:
        "The request content type must be application/json.",
      retryable: false,
    });
  }

  if (hasUnsupportedEncoding(request)) {
    return jsonResponse({
      status: 415,
      correlationId: routeCorrelationId,
      code: "UNSUPPORTED_CONTENT_ENCODING",
      message:
        "Compressed request bodies are not permitted.",
      retryable: false,
    });
  }

  const declaredLength = readContentLength(request);

  if (
    Number.isNaN(declaredLength) ||
    (
      declaredLength !== null &&
      declaredLength > MAX_HTTP_BODY_BYTES
    )
  ) {
    return jsonResponse({
      status: 413,
      correlationId: routeCorrelationId,
      code: "REQUEST_TOO_LARGE",
      message: "The request body is too large.",
      retryable: false,
    });
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({
      status: 422,
      correlationId: routeCorrelationId,
      code: "INVALID_REQUEST_BODY",
      message:
        "The request body could not be read.",
      retryable: false,
    });
  }

  if (
    Buffer.byteLength(rawBody, "utf8") >
    MAX_HTTP_BODY_BYTES
  ) {
    return jsonResponse({
      status: 413,
      correlationId: routeCorrelationId,
      code: "REQUEST_TOO_LARGE",
      message: "The request body is too large.",
      retryable: false,
    });
  }

  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonResponse({
      status: 422,
      correlationId: routeCorrelationId,
      code: "INVALID_JSON",
      message:
        "The request body must contain valid JSON.",
      retryable: false,
    });
  }

  let session: CustomerVerticalSliceSession;

  try {
    session =
      await dependencies.loadSession(request);
  } catch {
    return jsonResponse({
      status: 503,
      correlationId: routeCorrelationId,
      code: "IDENTITY_SERVICE_UNAVAILABLE",
      message:
        "Authentication services are temporarily unavailable.",
      retryable: true,
    });
  }

  if (
    session.authenticated === true &&
    session.tenantId?.trim() &&
    session.actorId?.trim()
  ) {
    let integrityVerified: boolean;

    try {
      integrityVerified =
        await dependencies.verifyRequestIntegrity({
          request,
          session,
          rawBody,
        });
    } catch {
      return jsonResponse({
        status: 503,
        correlationId: routeCorrelationId,
        code: "INTEGRITY_SERVICE_UNAVAILABLE",
        message:
          "Request verification is temporarily unavailable.",
        retryable: true,
      });
    }

    if (integrityVerified !== true) {
      return jsonResponse({
        status: 403,
        correlationId: routeCorrelationId,
        code: "REQUEST_INTEGRITY_FAILED",
        message:
          "The request could not be verified.",
        retryable: false,
      });
    }
  }

  const handlerResponse =
    await handleCustomerVerticalSliceCommand({
      session,
      rawBody: parsedBody,
      auditContext:
        dependencies.auditContext,
      rateLimiter:
        dependencies.rateLimiter,
      repository:
        dependencies.repository,
      nowIso:
        dependencies.nowIso,
    });

  return new Response(
    JSON.stringify(handlerResponse.body),
    {
      status: handlerResponse.status,
      headers: {
        ...securityHeaders(),
        ...handlerResponse.headers,
        "x-correlation-id":
          handlerResponse.body.correlationId,
      },
    },
  );
}
