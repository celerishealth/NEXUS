import type {
  SandboxWorkerCycleCommandRequest,
  SandboxWorkerCycleCommandResult,
  TrustedSandboxWorkerActor,
} from "./sandboxWorkerCycleCommand";

import type {
  PostgresBackedSandboxWorkerCycleService,
} from "./postgresBackedSandboxWorkerCycleService";

export type InternalPilotEndpointErrorCode =
  | "METHOD_NOT_ALLOWED"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "INTERNAL_PILOT_HEADER_REQUIRED"
  | "REQUEST_TOO_LARGE"
  | "INVALID_JSON"
  | "INVALID_REQUEST"
  | "AUTHENTICATION_REQUIRED"
  | "OWNER_ROLE_REQUIRED"
  | "OWNER_APPROVAL_REQUIRED"
  | "TENANT_MISMATCH"
  | "SANDBOX_EXECUTION_REQUIRED"
  | "IDEMPOTENCY_HEADER_REQUIRED"
  | "IDEMPOTENCY_BINDING_MISMATCH"
  | "IDEMPOTENCY_CONFLICT"
  | "REQUEST_IN_PROGRESS"
  | "REQUEST_EXPIRED"
  | "REQUEST_FROM_FUTURE"
  | "BATCH_LIMIT_EXCEEDED"
  | "AUDIT_UNAVAILABLE"
  | "RECEIPT_UNAVAILABLE"
  | "CYCLE_EXECUTION_FAILED"
  | "CYCLE_RESULT_INVALID"
  | "INTERNAL_ERROR";

export interface TrustedInternalPilotSession {
  sessionId: string;
  actorId: string;
  tenantId: string;
  authenticated: boolean;
  role: "owner" | "operator";
  ownerApprovalGranted: boolean;
}

export interface InternalPilotHttpRequest {
  method: string;
  headers: Readonly<Record<string, string | undefined>>;
  bodyText: string;
}

export interface InternalPilotEndpointSuccessBody {
  ok: true;
  tenantId: string;
  requestId: string;
  requestDigest: string;
  cycle: SandboxWorkerCycleCommandResult["cycle"];
  ownerApprovalRequired: true;
  liveProviderExecution: "blocked";
  externalDelivery: "blocked";
  paymentExecution: "blocked";
  publicLaunch: "blocked";
}

export interface InternalPilotEndpointErrorBody {
  ok: false;
  error: {
    code: InternalPilotEndpointErrorCode;
    message: string;
  };
}

export interface InternalPilotHttpResponse {
  status: number;
  headers: Readonly<Record<string, string>>;
  body:
    | InternalPilotEndpointSuccessBody
    | InternalPilotEndpointErrorBody;
}

export interface InternalPilotSandboxWorkerEndpointRuntime {
  tenantId: string;
  service: PostgresBackedSandboxWorkerCycleService;
  maxBodyBytes?: number;
}

export type InternalPilotSandboxWorkerEndpoint = (
  session: TrustedInternalPilotSession,
  request: InternalPilotHttpRequest,
) => Promise<InternalPilotHttpResponse>;

const REQUEST_KEYS = [
  "batchSize",
  "executionMode",
  "idempotencyKey",
  "requestId",
  "requestedAt",
  "tenantId",
] as const;

const RESPONSE_HEADERS = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
});

const DEFAULT_MAX_BODY_BYTES = 16_384;

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
  const target = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (
      key.toLowerCase() === target &&
      typeof value === "string"
    ) {
      return value;
    }
  }

  return undefined;
}

function response(
  status: number,
  body:
    | InternalPilotEndpointSuccessBody
    | InternalPilotEndpointErrorBody,
): InternalPilotHttpResponse {
  return {
    status,
    headers: RESPONSE_HEADERS,
    body,
  };
}

function errorResponse(
  status: number,
  code: InternalPilotEndpointErrorCode,
  message: string,
): InternalPilotHttpResponse {
  return response(status, {
    ok: false,
    error: {
      code,
      message,
    },
  });
}

function validateSession(
  session: unknown,
  tenantId: string,
): InternalPilotHttpResponse | TrustedSandboxWorkerActor {
  if (
    !isPlainRecord(session) ||
    session.authenticated !== true
  ) {
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
    !isIdentifier(session.tenantId, 3)
  ) {
    return errorResponse(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authenticated owner access is required.",
    );
  }

  if (session.tenantId !== tenantId) {
    return errorResponse(
      403,
      "TENANT_MISMATCH",
      "Cross-tenant internal pilot access is blocked.",
    );
  }

  return {
    actorId: session.actorId,
    tenantId: session.tenantId,
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
  };
}

function parseRequestBody(
  bodyText: string,
): SandboxWorkerCycleCommandRequest | InternalPilotHttpResponse {
  let parsed: unknown;

  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return errorResponse(
      400,
      "INVALID_JSON",
      "The request body must contain valid JSON.",
    );
  }

  if (!isPlainRecord(parsed)) {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      "The sandbox command request is invalid.",
    );
  }

  const actualKeys = Object.keys(parsed).sort();
  const expectedKeys = [...REQUEST_KEYS].sort();

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some(
      (key, index) => key !== expectedKeys[index],
    )
  ) {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      "The sandbox command request contract is invalid.",
    );
  }

  return parsed as unknown as SandboxWorkerCycleCommandRequest;
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

function validateProtectedResult(
  result: unknown,
  tenantId: string,
  request: SandboxWorkerCycleCommandRequest,
): result is SandboxWorkerCycleCommandResult {
  if (!isPlainRecord(result)) {
    return false;
  }

  if (
    result.tenantId !== tenantId ||
    result.requestId !== request.requestId ||
    typeof result.requestDigest !== "string" ||
    !/^[a-f0-9]{64}$/.test(result.requestDigest) ||
    result.ownerApprovalRequired !== true ||
    result.liveProviderExecution !== "blocked" ||
    result.externalDelivery !== "blocked" ||
    result.paymentExecution !== "blocked" ||
    result.publicLaunch !== "blocked"
  ) {
    return false;
  }

  if (
    !isPlainRecord(result.cycle) ||
    result.cycle.tenantId !== tenantId ||
    result.cycle.ownerApprovalRequired !== true ||
    result.cycle.liveProviderExecution !== "blocked" ||
    result.cycle.externalDelivery !== "blocked" ||
    result.cycle.paymentExecution !== "blocked" ||
    result.cycle.publicLaunch !== "blocked"
  ) {
    return false;
  }

  return true;
}

function readErrorCode(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return null;
}

function mapServiceFailure(
  error: unknown,
): InternalPilotHttpResponse {
  const code = readErrorCode(error);

  switch (code) {
    case "AUTHENTICATION_REQUIRED":
      return errorResponse(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authenticated owner access is required.",
      );

    case "OWNER_ROLE_REQUIRED":
      return errorResponse(
        403,
        "OWNER_ROLE_REQUIRED",
        "Owner authority is required.",
      );

    case "OWNER_APPROVAL_REQUIRED":
      return errorResponse(
        403,
        "OWNER_APPROVAL_REQUIRED",
        "Explicit owner approval is required.",
      );

    case "TENANT_MISMATCH":
      return errorResponse(
        403,
        "TENANT_MISMATCH",
        "Cross-tenant internal pilot access is blocked.",
      );

    case "SANDBOX_EXECUTION_REQUIRED":
      return errorResponse(
        403,
        "SANDBOX_EXECUTION_REQUIRED",
        "Only sandbox execution is authorized.",
      );

    case "IDEMPOTENCY_CONFLICT":
      return errorResponse(
        409,
        "IDEMPOTENCY_CONFLICT",
        "The idempotency key is bound to another request.",
      );

    case "REQUEST_IN_PROGRESS":
      return errorResponse(
        409,
        "REQUEST_IN_PROGRESS",
        "The sandbox command request is already in progress.",
      );

    case "REQUEST_EXPIRED":
      return errorResponse(
        410,
        "REQUEST_EXPIRED",
        "The sandbox command request has expired.",
      );

    case "REQUEST_FROM_FUTURE":
      return errorResponse(
        400,
        "REQUEST_FROM_FUTURE",
        "The request timestamp is outside the allowed clock skew.",
      );

    case "BATCH_LIMIT_EXCEEDED":
      return errorResponse(
        400,
        "BATCH_LIMIT_EXCEEDED",
        "The requested batch size is outside the authorized limit.",
      );

    case "INVALID_REQUEST":
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "The sandbox command request is invalid.",
      );

    case "AUDIT_UNAVAILABLE":
      return errorResponse(
        503,
        "AUDIT_UNAVAILABLE",
        "The internal pilot audit service is unavailable.",
      );

    case "RECEIPT_UNAVAILABLE":
      return errorResponse(
        503,
        "RECEIPT_UNAVAILABLE",
        "The internal pilot command receipt service is unavailable.",
      );

    case "CYCLE_RESULT_INVALID":
      return errorResponse(
        503,
        "CYCLE_RESULT_INVALID",
        "The sandbox command returned an invalid protected result.",
      );

    case "CYCLE_EXECUTION_FAILED":
      return errorResponse(
        503,
        "CYCLE_EXECUTION_FAILED",
        "The sandbox command could not be completed safely.",
      );

    default:
      return errorResponse(
        500,
        "INTERNAL_ERROR",
        "The internal pilot request could not be completed safely.",
      );
  }
}

export function createInternalPilotSandboxWorkerEndpoint(
  runtime: InternalPilotSandboxWorkerEndpointRuntime,
): InternalPilotSandboxWorkerEndpoint {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    !runtime.service ||
    typeof runtime.service.execute !== "function"
  ) {
    throw new Error(
      "Internal pilot sandbox endpoint configuration is invalid.",
    );
  }

  const maxBodyBytes =
    runtime.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;

  if (
    !Number.isInteger(maxBodyBytes) ||
    maxBodyBytes < 1_024 ||
    maxBodyBytes > 65_536
  ) {
    throw new Error(
      "Internal pilot sandbox endpoint body limit is invalid.",
    );
  }

  return async (
    session: TrustedInternalPilotSession,
    request: InternalPilotHttpRequest,
  ): Promise<InternalPilotHttpResponse> => {
    if (
      !isPlainRecord(request) ||
      typeof request.method !== "string" ||
      !isPlainRecord(request.headers) ||
      typeof request.bodyText !== "string"
    ) {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "The internal pilot HTTP request is invalid.",
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
      contentType
        .split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    ) {
      return errorResponse(
        415,
        "UNSUPPORTED_MEDIA_TYPE",
        "The request content type must be application/json.",
      );
    }

    const pilotHeader = getHeader(
      request.headers,
      "x-nexus-internal-pilot",
    );

    if (pilotHeader !== "sandbox-v1") {
      return errorResponse(
        403,
        "INTERNAL_PILOT_HEADER_REQUIRED",
        "The controlled internal pilot boundary is required.",
      );
    }

    if (
      Buffer.byteLength(request.bodyText, "utf8") >
      maxBodyBytes
    ) {
      return errorResponse(
        413,
        "REQUEST_TOO_LARGE",
        "The internal pilot request body exceeds the allowed size.",
      );
    }

    const actor = validateSession(
      session,
      runtime.tenantId,
    );

    if (isHttpResponse(actor)) {
      return actor;
    }

    const parsedRequest = parseRequestBody(
      request.bodyText,
    );

    if (isHttpResponse(parsedRequest)) {
      return parsedRequest;
    }

    if (parsedRequest.tenantId !== runtime.tenantId) {
      return errorResponse(
        403,
        "TENANT_MISMATCH",
        "Cross-tenant internal pilot access is blocked.",
      );
    }

    if (parsedRequest.executionMode !== "sandbox") {
      return errorResponse(
        403,
        "SANDBOX_EXECUTION_REQUIRED",
        "Only sandbox execution is authorized.",
      );
    }

    const idempotencyHeader = getHeader(
      request.headers,
      "x-nexus-idempotency-key",
    );

    if (!idempotencyHeader) {
      return errorResponse(
        400,
        "IDEMPOTENCY_HEADER_REQUIRED",
        "The idempotency header is required.",
      );
    }

    if (
      typeof parsedRequest.idempotencyKey !== "string" ||
      idempotencyHeader !== parsedRequest.idempotencyKey
    ) {
      return errorResponse(
        409,
        "IDEMPOTENCY_BINDING_MISMATCH",
        "The idempotency header does not match the request.",
      );
    }

    try {
      const result = await runtime.service.execute(
        actor,
        parsedRequest,
      );

      if (
        !validateProtectedResult(
          result,
          runtime.tenantId,
          parsedRequest,
        )
      ) {
        return errorResponse(
          503,
          "CYCLE_RESULT_INVALID",
          "The sandbox command returned an invalid protected result.",
        );
      }

      return response(200, {
        ok: true,
        tenantId: result.tenantId,
        requestId: result.requestId,
        requestDigest: result.requestDigest,
        cycle: result.cycle,
        ownerApprovalRequired: true,
        liveProviderExecution: "blocked",
        externalDelivery: "blocked",
        paymentExecution: "blocked",
        publicLaunch: "blocked",
      });
    } catch (error) {
      return mapServiceFailure(error);
    }
  };
}
