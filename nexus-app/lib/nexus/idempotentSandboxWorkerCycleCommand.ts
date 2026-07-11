import { createHash } from "node:crypto";

import {
  SandboxWorkerCycleCommandError,
  type SandboxWorkerCycleCommandRequest,
  type SandboxWorkerCycleCommandResult,
  type TrustedSandboxWorkerActor,
} from "./sandboxWorkerCycleCommand";

export type IdempotentSandboxWorkerCycleCommandErrorCode =
  | "INVALID_RUNTIME_CONFIGURATION"
  | "INVALID_REQUEST"
  | "AUTHENTICATION_REQUIRED"
  | "OWNER_ROLE_REQUIRED"
  | "OWNER_APPROVAL_REQUIRED"
  | "TENANT_MISMATCH"
  | "SANDBOX_EXECUTION_REQUIRED"
  | "IDEMPOTENCY_CONFLICT"
  | "REQUEST_IN_PROGRESS"
  | "RECEIPT_UNAVAILABLE"
  | "RECEIPT_INVALID"
  | "CYCLE_RESULT_INVALID"
  | "CYCLE_EXECUTION_FAILED";

export class IdempotentSandboxWorkerCycleCommandError extends Error {
  readonly code: IdempotentSandboxWorkerCycleCommandErrorCode;

  constructor(
    code: IdempotentSandboxWorkerCycleCommandErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "IdempotentSandboxWorkerCycleCommandError";
    this.code = code;
  }
}

export interface SandboxWorkerCommandReceiptClaimInput {
  tenantId: string;
  actorId: string;
  requestId: string;
  idempotencyKey: string;
  requestDigest: string;
  occurredAt: string;
}

export interface SandboxWorkerCommandReceiptClaim {
  status: "claimed" | "replay" | "in_progress" | "conflict";
  tenantId: string;
  requestId: string;
  idempotencyKey: string;
  requestDigest: string;
  attempt: number;
  result?: SandboxWorkerCycleCommandResult | null;
}

export interface SandboxWorkerCommandReceiptCompleteInput {
  tenantId: string;
  requestId: string;
  idempotencyKey: string;
  requestDigest: string;
  result: SandboxWorkerCycleCommandResult;
  occurredAt: string;
}

export interface SandboxWorkerCommandReceiptFailureInput {
  tenantId: string;
  requestId: string;
  idempotencyKey: string;
  requestDigest: string;
  failureCode: string;
  occurredAt: string;
}

export interface SandboxWorkerCommandReceiptRepository {
  claim(
    input: SandboxWorkerCommandReceiptClaimInput,
  ): Promise<SandboxWorkerCommandReceiptClaim>;

  complete(
    input: SandboxWorkerCommandReceiptCompleteInput,
  ): Promise<void>;

  fail(
    input: SandboxWorkerCommandReceiptFailureInput,
  ): Promise<void>;
}

export type SandboxWorkerCycleCommandExecutor = (
  actor: TrustedSandboxWorkerActor,
  request: SandboxWorkerCycleCommandRequest,
) => Promise<SandboxWorkerCycleCommandResult>;

export interface IdempotentSandboxWorkerCycleCommandRuntime {
  tenantId: string;
  command: SandboxWorkerCycleCommandExecutor;
  repository: SandboxWorkerCommandReceiptRepository;
  now?: () => Date;
}

const REQUEST_KEYS = [
  "batchSize",
  "executionMode",
  "idempotencyKey",
  "requestId",
  "requestedAt",
  "tenantId",
] as const;

function commandError(
  code: IdempotentSandboxWorkerCycleCommandErrorCode,
  message: string,
): IdempotentSandboxWorkerCycleCommandError {
  return new IdempotentSandboxWorkerCycleCommandError(code, message);
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

function assertTenantIdentifier(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.length < 3 ||
    value.length > 128 ||
    !/^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  ) {
    throw commandError(
      "INVALID_REQUEST",
      "Tenant identifier is invalid.",
    );
  }
}

function assertBoundedIdentifier(
  value: unknown,
  field: string,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    value.length > 128 ||
    !/^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  ) {
    throw commandError(
      "INVALID_REQUEST",
      `${field} is invalid.`,
    );
  }
}

function assertExactRequestContract(
  request: unknown,
): asserts request is SandboxWorkerCycleCommandRequest {
  if (!isPlainRecord(request)) {
    throw commandError(
      "INVALID_REQUEST",
      "Sandbox worker request is invalid.",
    );
  }

  const actualKeys = Object.keys(request).sort();
  const expectedKeys = [...REQUEST_KEYS].sort();

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw commandError(
      "INVALID_REQUEST",
      "Sandbox worker request contract is invalid.",
    );
  }
}

function assertTrustedActor(
  actor: unknown,
  tenantId: string,
): asserts actor is TrustedSandboxWorkerActor {
  if (!isPlainRecord(actor) || actor.authenticated !== true) {
    throw commandError(
      "AUTHENTICATION_REQUIRED",
      "Authenticated owner access is required.",
    );
  }

  if (actor.role !== "owner") {
    throw commandError(
      "OWNER_ROLE_REQUIRED",
      "Owner authority is required.",
    );
  }

  if (actor.ownerApprovalGranted !== true) {
    throw commandError(
      "OWNER_APPROVAL_REQUIRED",
      "Explicit owner approval is required.",
    );
  }

  assertTenantIdentifier(actor.actorId);
  assertTenantIdentifier(actor.tenantId);

  if (actor.tenantId !== tenantId) {
    throw commandError(
      "TENANT_MISMATCH",
      "Cross-tenant sandbox worker execution is blocked.",
    );
  }
}

function assertRequestPreconditions(
  request: unknown,
  tenantId: string,
): asserts request is SandboxWorkerCycleCommandRequest {
  assertExactRequestContract(request);
  assertTenantIdentifier(request.tenantId);
  assertBoundedIdentifier(request.requestId, "Request identifier");
  assertBoundedIdentifier(
    request.idempotencyKey,
    "Idempotency key",
  );

  if (request.tenantId !== tenantId) {
    throw commandError(
      "TENANT_MISMATCH",
      "Cross-tenant sandbox worker execution is blocked.",
    );
  }

  if (request.executionMode !== "sandbox") {
    throw commandError(
      "SANDBOX_EXECUTION_REQUIRED",
      "Only sandbox worker execution is authorized.",
    );
  }
}

export function createSandboxWorkerCycleRequestDigest(
  request: SandboxWorkerCycleCommandRequest,
): string {
  const canonicalRequest = JSON.stringify({
    tenantId: request.tenantId,
    requestId: request.requestId,
    idempotencyKey: request.idempotencyKey,
    batchSize: request.batchSize,
    requestedAt: request.requestedAt,
    executionMode: request.executionMode,
  });

  return createHash("sha256")
    .update(canonicalRequest, "utf8")
    .digest("hex");
}

function assertReceiptClaim(
  value: unknown,
  input: SandboxWorkerCommandReceiptClaimInput,
): asserts value is SandboxWorkerCommandReceiptClaim {
  if (!isPlainRecord(value)) {
    throw commandError(
      "RECEIPT_INVALID",
      "Sandbox worker command receipt is invalid.",
    );
  }

  if (
    value.status !== "claimed" &&
    value.status !== "replay" &&
    value.status !== "in_progress" &&
    value.status !== "conflict"
  ) {
    throw commandError(
      "RECEIPT_INVALID",
      "Sandbox worker command receipt status is invalid.",
    );
  }

  if (
    value.tenantId !== input.tenantId ||
    value.idempotencyKey !== input.idempotencyKey
  ) {
    throw commandError(
      "RECEIPT_INVALID",
      "Sandbox worker command receipt binding is invalid.",
    );
  }

  if (
    typeof value.requestDigest !== "string" ||
    !/^[a-f0-9]{64}$/.test(value.requestDigest)
  ) {
    throw commandError(
      "RECEIPT_INVALID",
      "Sandbox worker command receipt digest is invalid.",
    );
  }

  if (
    typeof value.requestId !== "string" ||
    value.requestId.length < 8 ||
    value.requestId.length > 128
  ) {
    throw commandError(
      "RECEIPT_INVALID",
      "Sandbox worker command receipt request is invalid.",
    );
  }

  if (
    !Number.isInteger(value.attempt) ||
    value.attempt < 1 ||
    value.attempt > 100
  ) {
    throw commandError(
      "RECEIPT_INVALID",
      "Sandbox worker command receipt attempt is invalid.",
    );
  }

  if (value.status === "conflict") {
    if (value.requestDigest === input.requestDigest) {
      throw commandError(
        "RECEIPT_INVALID",
        "Sandbox worker command conflict receipt is invalid.",
      );
    }

    return;
  }

  if (
    value.requestDigest !== input.requestDigest ||
    value.requestId !== input.requestId
  ) {
    throw commandError(
      "RECEIPT_INVALID",
      "Sandbox worker command receipt request binding is invalid.",
    );
  }
}

function assertProtectedResult(
  result: unknown,
  input: SandboxWorkerCommandReceiptClaimInput,
): asserts result is SandboxWorkerCycleCommandResult {
  if (!isPlainRecord(result)) {
    throw commandError(
      "CYCLE_RESULT_INVALID",
      "Sandbox worker command result is invalid.",
    );
  }

  if (
    result.tenantId !== input.tenantId ||
    result.requestId !== input.requestId ||
    result.requestDigest !== input.requestDigest ||
    result.ownerApprovalRequired !== true ||
    result.liveProviderExecution !== "blocked" ||
    result.externalDelivery !== "blocked" ||
    result.paymentExecution !== "blocked" ||
    result.publicLaunch !== "blocked"
  ) {
    throw commandError(
      "CYCLE_RESULT_INVALID",
      "Sandbox worker command result protection is invalid.",
    );
  }

  if (
    !isPlainRecord(result.cycle) ||
    result.cycle.tenantId !== input.tenantId ||
    result.cycle.ownerApprovalRequired !== true ||
    result.cycle.liveProviderExecution !== "blocked" ||
    result.cycle.externalDelivery !== "blocked" ||
    result.cycle.paymentExecution !== "blocked" ||
    result.cycle.publicLaunch !== "blocked"
  ) {
    throw commandError(
      "CYCLE_RESULT_INVALID",
      "Sandbox worker cycle result protection is invalid.",
    );
  }
}

function safeFailureCode(error: unknown): string {
  if (
    error instanceof SandboxWorkerCycleCommandError ||
    error instanceof IdempotentSandboxWorkerCycleCommandError
  ) {
    return error.code;
  }

  return "CYCLE_EXECUTION_FAILED";
}

async function recordFailureBestEffort(
  repository: SandboxWorkerCommandReceiptRepository,
  input: SandboxWorkerCommandReceiptClaimInput,
  failureCode: string,
  occurredAt: string,
): Promise<void> {
  try {
    await repository.fail({
      tenantId: input.tenantId,
      requestId: input.requestId,
      idempotencyKey: input.idempotencyKey,
      requestDigest: input.requestDigest,
      failureCode,
      occurredAt,
    });
  } catch {
    // The primary classified failure remains authoritative.
    // Raw repository or infrastructure errors are never exposed.
  }
}

export function createIdempotentSandboxWorkerCycleCommand(
  runtime: IdempotentSandboxWorkerCycleCommandRuntime,
): SandboxWorkerCycleCommandExecutor {
  assertTenantIdentifier(runtime.tenantId);

  if (
    typeof runtime.command !== "function" ||
    !runtime.repository ||
    typeof runtime.repository.claim !== "function" ||
    typeof runtime.repository.complete !== "function" ||
    typeof runtime.repository.fail !== "function"
  ) {
    throw commandError(
      "INVALID_RUNTIME_CONFIGURATION",
      "Sandbox worker idempotency runtime is invalid.",
    );
  }

  const now = runtime.now ?? (() => new Date());

  return async (
    actor: TrustedSandboxWorkerActor,
    request: SandboxWorkerCycleCommandRequest,
  ): Promise<SandboxWorkerCycleCommandResult> => {
    assertTrustedActor(actor, runtime.tenantId);
    assertRequestPreconditions(request, runtime.tenantId);

    const requestDigest =
      createSandboxWorkerCycleRequestDigest(request);

    const claimInput: SandboxWorkerCommandReceiptClaimInput = {
      tenantId: runtime.tenantId,
      actorId: actor.actorId,
      requestId: request.requestId,
      idempotencyKey: request.idempotencyKey,
      requestDigest,
      occurredAt: now().toISOString(),
    };

    let rawClaim: unknown;

    try {
      rawClaim = await runtime.repository.claim(claimInput);
    } catch {
      throw commandError(
        "RECEIPT_UNAVAILABLE",
        "Sandbox worker command receipt is unavailable.",
      );
    }

    assertReceiptClaim(rawClaim, claimInput);
    const claim = rawClaim;

    if (claim.status === "conflict") {
      throw commandError(
        "IDEMPOTENCY_CONFLICT",
        "The idempotency key is already bound to another request.",
      );
    }

    if (claim.status === "in_progress") {
      throw commandError(
        "REQUEST_IN_PROGRESS",
        "The sandbox worker request is already in progress.",
      );
    }

    if (claim.status === "replay") {
      assertProtectedResult(claim.result, claimInput);
      return claim.result;
    }

    let result: SandboxWorkerCycleCommandResult;

    try {
      result = await runtime.command(actor, request);
      assertProtectedResult(result, claimInput);
    } catch (error) {
      const failureCode = safeFailureCode(error);

      await recordFailureBestEffort(
        runtime.repository,
        claimInput,
        failureCode,
        now().toISOString(),
      );

      if (
        error instanceof SandboxWorkerCycleCommandError ||
        error instanceof IdempotentSandboxWorkerCycleCommandError
      ) {
        throw error;
      }

      throw commandError(
        "CYCLE_EXECUTION_FAILED",
        "Sandbox worker cycle could not be completed safely.",
      );
    }

    try {
      await runtime.repository.complete({
        tenantId: claimInput.tenantId,
        requestId: claimInput.requestId,
        idempotencyKey: claimInput.idempotencyKey,
        requestDigest: claimInput.requestDigest,
        result,
        occurredAt: now().toISOString(),
      });
    } catch {
      throw commandError(
        "RECEIPT_UNAVAILABLE",
        "Sandbox worker completion receipt is unavailable.",
      );
    }

    return result;
  };
}
