import { createHash } from "node:crypto";

import {
  executeCustomerVerticalSliceCommand,
  type CustomerVerticalSliceCommand,
  type CustomerVerticalSliceCommandReceipt,
} from "./customerVerticalSliceCommandGateway";

import type { AuthenticatedAuditWriterContext } from "./customerVerticalSliceAuditLedger";
import type { CustomerVerticalSliceTransactionalRepository } from "./customerVerticalSliceAuditedTransition";
import type { VerticalSliceActorRole } from "./customerVerticalSliceTransitionGuard";

export interface CustomerVerticalSliceSession {
  authenticated: boolean;
  tenantId: string | null;
  actorId: string | null;
  role: VerticalSliceActorRole;
}

export interface CustomerVerticalSliceRateLimiter {
  consume(input: {
    tenantId: string;
    actorId: string;
    command: CustomerVerticalSliceCommand;
  }): Promise<{
    allowed: boolean;
    retryAfterSeconds: number;
  }>;
}

export type CustomerVerticalSliceHandlerResponse =
  | {
      status: 200;
      headers: Record<string, string>;
      body: {
        ok: true;
        correlationId: string;
        data: CustomerVerticalSliceCommandReceipt;
      };
    }
  | {
      status: 401 | 403 | 404 | 409 | 413 | 422 | 429 | 500 | 503;
      headers: Record<string, string>;
      body: {
        ok: false;
        correlationId: string;
        error: {
          code:
            | "AUTHENTICATION_REQUIRED"
            | "COMMAND_FORBIDDEN"
            | "LIFECYCLE_NOT_FOUND"
            | "COMMAND_CONFLICT"
            | "REQUEST_TOO_LARGE"
            | "INVALID_REQUEST"
            | "RATE_LIMITED"
            | "SERVICE_UNAVAILABLE"
            | "INTERNAL_ERROR";
          message: string;
          retryable: boolean;
        };
      };
    };

type RequestBody = {
  requestedTenantId: string;
  inquiryId: string;
  expectedVersion: string;
  command: CustomerVerticalSliceCommand;
  requestId: string;
  executionMode: "sandbox" | "live";
  externalDeliveryRequested: boolean;
  publicLaunchRequested: boolean;
};

const MAX_REQUEST_BYTES = 8192;

const ALLOWED_KEYS = new Set([
  "requestedTenantId",
  "inquiryId",
  "expectedVersion",
  "command",
  "requestId",
  "executionMode",
  "externalDeliveryRequested",
  "publicLaunchRequested",
]);

const COMMANDS = new Set<CustomerVerticalSliceCommand>([
  "prepare_recommendation",
  "approve_recommendation",
  "reject_recommendation",
  "start_sandbox_execution",
  "complete_sandbox_execution",
  "fail_sandbox_execution",
  "release_result",
  "acknowledge_result",
]);

function headers(): Record<string, string> {
  return {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store, max-age=0",
    "x-content-type-options": "nosniff",
  };
}

function correlationId(source: string): string {
  return `vsc_${createHash("sha256")
    .update(source, "utf8")
    .digest("hex")
    .slice(0, 20)}`;
}

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function readString(
  source: Record<string, unknown>,
  key: string,
  maximumLength = 512,
): string | null {
  const value = source[key];

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (
    normalized.length === 0 ||
    normalized.length > maximumLength
  ) {
    return null;
  }

  return normalized;
}

function parseBody(rawBody: unknown):
  | {
      ok: true;
      body: RequestBody;
    }
  | {
      ok: false;
      tooLarge: boolean;
      correlationId: string;
    } {
  let serialized: string;

  try {
    serialized = JSON.stringify(rawBody);
  } catch {
    return {
      ok: false,
      tooLarge: false,
      correlationId: correlationId("unserializable"),
    };
  }

  if (
    Buffer.byteLength(serialized, "utf8") >
    MAX_REQUEST_BYTES
  ) {
    return {
      ok: false,
      tooLarge: true,
      correlationId: correlationId("oversized"),
    };
  }

  if (!isPlainObject(rawBody)) {
    return {
      ok: false,
      tooLarge: false,
      correlationId: correlationId("non-object"),
    };
  }

  const keys = Object.keys(rawBody);

  if (
    keys.length !== ALLOWED_KEYS.size ||
    keys.some((key) => !ALLOWED_KEYS.has(key))
  ) {
    return {
      ok: false,
      tooLarge: false,
      correlationId: correlationId("invalid-keys"),
    };
  }

  const requestedTenantId = readString(
    rawBody,
    "requestedTenantId",
  );

  const inquiryId = readString(
    rawBody,
    "inquiryId",
  );

  const expectedVersion = readString(
    rawBody,
    "expectedVersion",
  );

  const command = readString(
    rawBody,
    "command",
    64,
  );

  const requestId = readString(
    rawBody,
    "requestId",
    128,
  );

  const executionMode = rawBody.executionMode;
  const externalDeliveryRequested =
    rawBody.externalDeliveryRequested;
  const publicLaunchRequested =
    rawBody.publicLaunchRequested;

  const validRequestId =
    requestId !== null &&
    /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(
      requestId,
    );

  const validCommand =
    command !== null &&
    COMMANDS.has(
      command as CustomerVerticalSliceCommand,
    );

  if (
    !requestedTenantId ||
    !inquiryId ||
    !expectedVersion ||
    !validRequestId ||
    !validCommand ||
    (
      executionMode !== "sandbox" &&
      executionMode !== "live"
    ) ||
    typeof externalDeliveryRequested !== "boolean" ||
    typeof publicLaunchRequested !== "boolean"
  ) {
    return {
      ok: false,
      tooLarge: false,
      correlationId: correlationId(
        requestId ?? "invalid-request",
      ),
    };
  }

  return {
    ok: true,
    body: {
      requestedTenantId,
      inquiryId,
      expectedVersion,
      command:
        command as CustomerVerticalSliceCommand,
      requestId,
      executionMode,
      externalDeliveryRequested,
      publicLaunchRequested,
    },
  };
}

function fail(input: {
  status: 401 | 403 | 404 | 409 | 413 | 422 | 429 | 500 | 503;
  correlationId: string;
  code:
    | "AUTHENTICATION_REQUIRED"
    | "COMMAND_FORBIDDEN"
    | "LIFECYCLE_NOT_FOUND"
    | "COMMAND_CONFLICT"
    | "REQUEST_TOO_LARGE"
    | "INVALID_REQUEST"
    | "RATE_LIMITED"
    | "SERVICE_UNAVAILABLE"
    | "INTERNAL_ERROR";
  message: string;
  retryable: boolean;
  retryAfterSeconds?: number;
}): CustomerVerticalSliceHandlerResponse {
  const responseHeaders = headers();

  if (
    input.retryAfterSeconds !== undefined &&
    input.retryAfterSeconds > 0
  ) {
    responseHeaders["retry-after"] = String(
      Math.ceil(input.retryAfterSeconds),
    );
  }

  return {
    status: input.status,
    headers: responseHeaders,
    body: {
      ok: false,
      correlationId: input.correlationId,
      error: {
        code: input.code,
        message: input.message,
        retryable: input.retryable,
      },
    },
  };
}

function errorCode(error: unknown): string | null {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error)
  ) {
    return null;
  }

  const code = (
    error as {
      code?: unknown;
    }
  ).code;

  return typeof code === "string"
    ? code
    : null;
}

function mapError(
  error: unknown,
  requestCorrelationId: string,
): CustomerVerticalSliceHandlerResponse {
  const code = errorCode(error);

  if (
    code === "UNAUTHENTICATED" ||
    code === "INVALID_COORDINATOR_CONTEXT"
  ) {
    return fail({
      status: 401,
      correlationId: requestCorrelationId,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required.",
      retryable: false,
    });
  }

  if (
    code === "COMMAND_ROLE_MISMATCH" ||
    code === "LIVE_EXECUTION_NOT_AUTHORIZED" ||
    code === "EXTERNAL_DELIVERY_NOT_AUTHORIZED" ||
    code === "PUBLIC_LAUNCH_NOT_AUTHORIZED" ||
    code === "CROSS_TENANT_COORDINATION" ||
    code === "CROSS_TENANT_ACCESS" ||
    code === "ACTOR_ACCESS_DENIED" ||
    code === "WRITER_NOT_AUTHORIZED"
  ) {
    return fail({
      status: 403,
      correlationId: requestCorrelationId,
      code: "COMMAND_FORBIDDEN",
      message: "This command is not permitted.",
      retryable: false,
    });
  }

  if (code === "LIFECYCLE_NOT_FOUND") {
    return fail({
      status: 404,
      correlationId: requestCorrelationId,
      code: "LIFECYCLE_NOT_FOUND",
      message: "The inquiry lifecycle was not found.",
      retryable: false,
    });
  }

  if (
    code === "STALE_VERSION" ||
    code === "TRANSITION_NOT_ALLOWED" ||
    code === "IDEMPOTENCY_CONFLICT" ||
    code === "CONCURRENT_MODIFICATION" ||
    code === "CONCURRENT_APPEND" ||
    code === "CHAIN_VERSION_MISMATCH"
  ) {
    return fail({
      status: 409,
      correlationId: requestCorrelationId,
      code: "COMMAND_CONFLICT",
      message:
        "The lifecycle changed or the command conflicts with its current state.",
      retryable: true,
    });
  }

  if (
    code === "INVALID_GATEWAY_REQUEST" ||
    code === "INVALID_REQUEST"
  ) {
    return fail({
      status: 422,
      correlationId: requestCorrelationId,
      code: "INVALID_REQUEST",
      message: "The command request is invalid.",
      retryable: false,
    });
  }

  return fail({
    status: 500,
    correlationId: requestCorrelationId,
    code: "INTERNAL_ERROR",
    message:
      "The command could not be completed safely.",
    retryable: true,
  });
}

export async function handleCustomerVerticalSliceCommand(input: {
  session: CustomerVerticalSliceSession;
  rawBody: unknown;
  auditContext: AuthenticatedAuditWriterContext;
  rateLimiter: CustomerVerticalSliceRateLimiter;
  repository: CustomerVerticalSliceTransactionalRepository;
  nowIso?: string;
}): Promise<CustomerVerticalSliceHandlerResponse> {
  const parsed = parseBody(input.rawBody);

  if (!parsed.ok) {
    return fail({
      status: parsed.tooLarge ? 413 : 422,
      correlationId: parsed.correlationId,
      code: parsed.tooLarge
        ? "REQUEST_TOO_LARGE"
        : "INVALID_REQUEST",
      message: parsed.tooLarge
        ? "The command request is too large."
        : "The command request is invalid.",
      retryable: false,
    });
  }

  const body = parsed.body;

  const requestCorrelationId = correlationId(
    [
      body.requestedTenantId,
      body.inquiryId,
      body.command,
      body.requestId,
    ].join("|"),
  );

  if (
    input.session.authenticated !== true ||
    !input.session.tenantId?.trim() ||
    !input.session.actorId?.trim()
  ) {
    return fail({
      status: 401,
      correlationId: requestCorrelationId,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required.",
      retryable: false,
    });
  }

  const sessionTenantId =
    input.session.tenantId.trim();

  const actorId = input.session.actorId.trim();

  if (
    sessionTenantId !== body.requestedTenantId
  ) {
    return fail({
      status: 403,
      correlationId: requestCorrelationId,
      code: "COMMAND_FORBIDDEN",
      message: "This command is not permitted.",
      retryable: false,
    });
  }

  let rateLimit: {
    allowed: boolean;
    retryAfterSeconds: number;
  };

  try {
    rateLimit = await input.rateLimiter.consume({
      tenantId: sessionTenantId,
      actorId,
      command: body.command,
    });
  } catch {
    return fail({
      status: 503,
      correlationId: requestCorrelationId,
      code: "SERVICE_UNAVAILABLE",
      message:
        "The command service is temporarily unavailable.",
      retryable: true,
    });
  }

  if (!rateLimit.allowed) {
    return fail({
      status: 429,
      correlationId: requestCorrelationId,
      code: "RATE_LIMITED",
      message:
        "Too many commands were submitted. Retry later.",
      retryable: true,
      retryAfterSeconds: Math.max(
        1,
        rateLimit.retryAfterSeconds,
      ),
    });
  }

  try {
    const receipt =
      await executeCustomerVerticalSliceCommand({
        actorContext: {
          authenticated: true,
          tenantId: sessionTenantId,
          actorId,
          role: input.session.role,
        },
        auditContext: input.auditContext,
        requestedTenantId:
          body.requestedTenantId,
        inquiryId: body.inquiryId,
        expectedVersion:
          body.expectedVersion,
        command: body.command,
        requestId: body.requestId,
        executionMode:
          body.executionMode,
        externalDeliveryRequested:
          body.externalDeliveryRequested,
        publicLaunchRequested:
          body.publicLaunchRequested,
        repository: input.repository,
        nowIso: input.nowIso,
      });

    return {
      status: 200,
      headers: headers(),
      body: {
        ok: true,
        correlationId: requestCorrelationId,
        data: receipt,
      },
    };
  } catch (error) {
    return mapError(
      error,
      requestCorrelationId,
    );
  }
}
