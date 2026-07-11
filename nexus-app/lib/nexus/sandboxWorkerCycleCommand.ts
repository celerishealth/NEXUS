import { createHash } from "node:crypto";

import {
  runSandboxWorkerCycle,
  type RunSandboxWorkerCycleInput,
  type SandboxWorkerCycleResult,
} from "./sandboxWorkerCycle";

export type SandboxWorkerCycleRunner = typeof runSandboxWorkerCycle;

export type SandboxWorkerPoolInput =
  Parameters<SandboxWorkerCycleRunner>[0];

export type SandboxWorkerTenantContextInput =
  Parameters<SandboxWorkerCycleRunner>[1];

export type SandboxWorkerCycleCommandErrorCode =
  | "INVALID_RUNTIME_CONFIGURATION"
  | "INVALID_REQUEST"
  | "AUTHENTICATION_REQUIRED"
  | "OWNER_ROLE_REQUIRED"
  | "OWNER_APPROVAL_REQUIRED"
  | "TENANT_MISMATCH"
  | "SANDBOX_EXECUTION_REQUIRED"
  | "BATCH_LIMIT_EXCEEDED"
  | "REQUEST_EXPIRED"
  | "REQUEST_FROM_FUTURE"
  | "AUDIT_UNAVAILABLE"
  | "CYCLE_EXECUTION_FAILED"
  | "CYCLE_RESULT_INVALID";

export class SandboxWorkerCycleCommandError extends Error {
  readonly code: SandboxWorkerCycleCommandErrorCode;

  constructor(
    code: SandboxWorkerCycleCommandErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SandboxWorkerCycleCommandError";
    this.code = code;
  }
}

export interface TrustedSandboxWorkerActor {
  actorId: string;
  tenantId: string;
  authenticated: boolean;
  role: "owner" | "operator";
  ownerApprovalGranted: boolean;
}

export interface SandboxWorkerCycleCommandRequest {
  tenantId: string;
  requestId: string;
  idempotencyKey: string;
  batchSize: number;
  requestedAt: string;
  executionMode: "sandbox";
}

export interface SandboxWorkerCycleCommandAuditRecord {
  tenantId: string;
  actorId: string;
  requestId: string;
  requestDigest: string;
  stage: "authorized" | "completed" | "failed";
  failureCode: SandboxWorkerCycleCommandErrorCode | null;
  occurredAt: string;
}

export interface SandboxWorkerCycleCommandRuntime {
  tenantId: string;
  poolInput: SandboxWorkerPoolInput;
  contextInput: SandboxWorkerTenantContextInput;
  cycleInput: Omit<RunSandboxWorkerCycleInput, "batchSize">;
  maxBatchSize: number;
  requestMaxAgeSeconds: number;
  futureClockSkewSeconds: number;
  appendAudit(
    record: SandboxWorkerCycleCommandAuditRecord,
  ): Promise<void>;
  now?: () => Date;
  runCycle?: SandboxWorkerCycleRunner;
}

export interface SandboxWorkerCycleCommandResult {
  tenantId: string;
  requestId: string;
  requestDigest: string;
  cycle: SandboxWorkerCycleResult;
  ownerApprovalRequired: true;
  liveProviderExecution: "blocked";
  externalDelivery: "blocked";
  paymentExecution: "blocked";
  publicLaunch: "blocked";
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
  code: SandboxWorkerCycleCommandErrorCode,
  message: string,
): SandboxWorkerCycleCommandError {
  return new SandboxWorkerCycleCommandError(code, message);
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

function assertRuntimeConfiguration(
  runtime: SandboxWorkerCycleCommandRuntime,
): void {
  assertTenantIdentifier(runtime.tenantId);

  if (
    !Number.isInteger(runtime.maxBatchSize) ||
    runtime.maxBatchSize < 1 ||
    runtime.maxBatchSize > 100
  ) {
    throw commandError(
      "INVALID_RUNTIME_CONFIGURATION",
      "Sandbox worker maximum batch size is invalid.",
    );
  }

  if (
    !Number.isInteger(runtime.requestMaxAgeSeconds) ||
    runtime.requestMaxAgeSeconds < 1 ||
    runtime.requestMaxAgeSeconds > 3600
  ) {
    throw commandError(
      "INVALID_RUNTIME_CONFIGURATION",
      "Sandbox worker request age limit is invalid.",
    );
  }

  if (
    !Number.isInteger(runtime.futureClockSkewSeconds) ||
    runtime.futureClockSkewSeconds < 0 ||
    runtime.futureClockSkewSeconds > 300
  ) {
    throw commandError(
      "INVALID_RUNTIME_CONFIGURATION",
      "Sandbox worker clock-skew limit is invalid.",
    );
  }

  if (typeof runtime.appendAudit !== "function") {
    throw commandError(
      "INVALID_RUNTIME_CONFIGURATION",
      "Sandbox worker audit dependency is unavailable.",
    );
  }
}

function parseRequestedAt(value: unknown): Date {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  ) {
    throw commandError(
      "INVALID_REQUEST",
      "Sandbox worker request timestamp is invalid.",
    );
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw commandError(
      "INVALID_REQUEST",
      "Sandbox worker request timestamp is invalid.",
    );
  }

  return parsed;
}

function createRequestDigest(
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

function validateCycleResult(
  result: SandboxWorkerCycleResult,
  tenantId: string,
): void {
  if (
    !result ||
    result.tenantId !== tenantId ||
    result.ownerApprovalRequired !== true ||
    result.liveProviderExecution !== "blocked" ||
    result.externalDelivery !== "blocked" ||
    result.paymentExecution !== "blocked" ||
    result.publicLaunch !== "blocked"
  ) {
    throw commandError(
      "CYCLE_RESULT_INVALID",
      "Sandbox worker cycle returned an invalid protected result.",
    );
  }
}

async function appendAuditOrFail(
  runtime: SandboxWorkerCycleCommandRuntime,
  record: SandboxWorkerCycleCommandAuditRecord,
): Promise<void> {
  try {
    await runtime.appendAudit(record);
  } catch {
    throw commandError(
      "AUDIT_UNAVAILABLE",
      "Sandbox worker audit recording is unavailable.",
    );
  }
}

export function createAuthenticatedOwnerSandboxWorkerCommand(
  runtime: SandboxWorkerCycleCommandRuntime,
): (
  actor: TrustedSandboxWorkerActor,
  request: SandboxWorkerCycleCommandRequest,
) => Promise<SandboxWorkerCycleCommandResult> {
  assertRuntimeConfiguration(runtime);

  const now = runtime.now ?? (() => new Date());
  const runCycle = runtime.runCycle ?? runSandboxWorkerCycle;

  return async (
    actor: TrustedSandboxWorkerActor,
    request: SandboxWorkerCycleCommandRequest,
  ): Promise<SandboxWorkerCycleCommandResult> => {
    if (!actor || actor.authenticated !== true) {
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
    assertExactRequestContract(request);
    assertTenantIdentifier(request.tenantId);
    assertBoundedIdentifier(request.requestId, "Request identifier");
    assertBoundedIdentifier(
      request.idempotencyKey,
      "Idempotency key",
    );

    if (
      actor.tenantId !== runtime.tenantId ||
      request.tenantId !== runtime.tenantId
    ) {
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

    if (
      !Number.isInteger(request.batchSize) ||
      request.batchSize < 1 ||
      request.batchSize > runtime.maxBatchSize
    ) {
      throw commandError(
        "BATCH_LIMIT_EXCEEDED",
        "Sandbox worker batch size is outside the authorized limit.",
      );
    }

    const currentTime = now();
    const requestedAt = parseRequestedAt(request.requestedAt);
    const ageMilliseconds =
      currentTime.getTime() - requestedAt.getTime();

    if (
      ageMilliseconds >
      runtime.requestMaxAgeSeconds * 1000
    ) {
      throw commandError(
        "REQUEST_EXPIRED",
        "Sandbox worker request has expired.",
      );
    }

    if (
      ageMilliseconds <
      runtime.futureClockSkewSeconds * -1000
    ) {
      throw commandError(
        "REQUEST_FROM_FUTURE",
        "Sandbox worker request timestamp is outside the allowed clock skew.",
      );
    }

    const requestDigest = createRequestDigest(request);
    const occurredAt = currentTime.toISOString();

    await appendAuditOrFail(runtime, {
      tenantId: runtime.tenantId,
      actorId: actor.actorId,
      requestId: request.requestId,
      requestDigest,
      stage: "authorized",
      failureCode: null,
      occurredAt,
    });

    try {
      const cycle = await runCycle(
        runtime.poolInput,
        runtime.contextInput,
        {
          ...runtime.cycleInput,
          batchSize: request.batchSize,
        },
      );

      validateCycleResult(cycle, runtime.tenantId);

      await appendAuditOrFail(runtime, {
        tenantId: runtime.tenantId,
        actorId: actor.actorId,
        requestId: request.requestId,
        requestDigest,
        stage: "completed",
        failureCode: null,
        occurredAt: now().toISOString(),
      });

      return {
        tenantId: runtime.tenantId,
        requestId: request.requestId,
        requestDigest,
        cycle,
        ownerApprovalRequired: true,
        liveProviderExecution: "blocked",
        externalDelivery: "blocked",
        paymentExecution: "blocked",
        publicLaunch: "blocked",
      };
    } catch (error) {
      const failureCode =
        error instanceof SandboxWorkerCycleCommandError
          ? error.code
          : "CYCLE_EXECUTION_FAILED";

      try {
        await runtime.appendAudit({
          tenantId: runtime.tenantId,
          actorId: actor.actorId,
          requestId: request.requestId,
          requestDigest,
          stage: "failed",
          failureCode,
          occurredAt: now().toISOString(),
        });
      } catch {
        // The primary failure remains safely classified. Raw audit or
        // infrastructure errors are never exposed to the caller.
      }

      if (error instanceof SandboxWorkerCycleCommandError) {
        throw error;
      }

      throw commandError(
        "CYCLE_EXECUTION_FAILED",
        "Sandbox worker cycle could not be completed safely.",
      );
    }
  };
}
