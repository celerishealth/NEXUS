import {
  withPostgreSqlTenantTransaction,
  type PostgreSqlConnectionPool,
  type TenantTransactionContext,
} from "./postgresTenantTransaction";

import {
  claimSandboxOutboxBatch,
  recoverExpiredSandboxOutboxLeases,
  type ClaimedSandboxOutboxRecord,
} from "./sandboxOutboxLeaseRepository";

import {
  failSandboxOutboxLease,
} from "./sandboxOutboxLeaseFinalization";

import {
  commitSandboxResultAndCompleteLease,
} from "./atomicSandboxResultCompletion";

import {
  SandboxHandlerExecutionError,
  type SandboxHandlerRegistry,
  type ValidatedSandboxExecutionResult,
} from "./sandboxWorkerExecutionBoundary";

export interface RunSandboxWorkerCycleInput {
  readonly registry: SandboxHandlerRegistry;
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly leaseSeconds: number;
  readonly batchSize: number;
  readonly handlerTimeoutMilliseconds: number;
  readonly retryDelaySeconds: number;
  readonly maxAttempts: number;
}

export type SandboxWorkerOutcomeStatus =
  | "completed"
  | "retry_scheduled"
  | "terminal_failed";

export interface SandboxWorkerOutcome {
  readonly tenantId: string;
  readonly outboxId: string;
  readonly actionKind: string;
  readonly attemptCount: number;
  readonly status: SandboxWorkerOutcomeStatus;
  readonly resultId: string | null;
  readonly failureCode: string | null;
}

export interface SandboxWorkerCycleResult {
  readonly tenantId: string;
  readonly recoveredLeaseCount: number;
  readonly claimedCount: number;
  readonly completedCount: number;
  readonly retryScheduledCount: number;
  readonly terminalFailedCount: number;
  readonly outcomes: readonly SandboxWorkerOutcome[];
  readonly ownerApprovalRequired: true;
  readonly liveProviderExecution: "blocked";
  readonly externalDelivery: "blocked";
  readonly paymentExecution: "blocked";
  readonly publicLaunch: "blocked";
}

export class SandboxWorkerCycleValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxWorkerCycleValidationError";
  }
}

export class SandboxWorkerCycleInfrastructureError extends Error {
  readonly safeCode: string;

  constructor(safeCode: string) {
    super("Sandbox worker cycle infrastructure boundary failed.");
    this.name = "SandboxWorkerCycleInfrastructureError";
    this.safeCode = safeCode;
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SAFE_CODE_PATTERN =
  /^sandbox_[a-z0-9][a-z0-9._-]{0,119}$/;

function requirePool(
  pool: PostgreSqlConnectionPool,
): PostgreSqlConnectionPool {
  if (!pool || typeof pool.connect !== "function") {
    throw new SandboxWorkerCycleValidationError(
      "A PostgreSQL connection pool is required.",
    );
  }

  return pool;
}

function requireUuid(
  value: string,
  fieldName: string,
): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerCycleValidationError(
      `${fieldName} must be a UUID string.`,
    );
  }

  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new SandboxWorkerCycleValidationError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized;
}

function requireRequestId(value: string): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerCycleValidationError(
      "requestId must be a string.",
    );
  }

  const normalized = value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > 128 ||
    /[\u0000-\u001f\u007f]/.test(normalized)
  ) {
    throw new SandboxWorkerCycleValidationError(
      "requestId is invalid.",
    );
  }

  return normalized;
}

function requireLeaseOwner(value: string): string {
  if (typeof value !== "string") {
    throw new SandboxWorkerCycleValidationError(
      "leaseOwner must be a string.",
    );
  }

  const normalized = value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > 128 ||
    /[\u0000-\u001f\u007f]/.test(normalized)
  ) {
    throw new SandboxWorkerCycleValidationError(
      "leaseOwner is invalid.",
    );
  }

  return normalized;
}

function requireIntegerInRange(
  value: number,
  fieldName: string,
  minimum: number,
  maximum: number,
): number {
  if (
    !Number.isInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new SandboxWorkerCycleValidationError(
      `${fieldName} must be an integer between ${minimum} and ${maximum}.`,
    );
  }

  return value;
}

function requireRegistry(
  registry: SandboxHandlerRegistry,
): SandboxHandlerRegistry {
  if (
    !registry ||
    typeof registry !== "object" ||
    typeof registry.execute !== "function" ||
    !Array.isArray(registry.actionKinds)
  ) {
    throw new SandboxWorkerCycleValidationError(
      "A strict sandbox handler registry is required.",
    );
  }

  return registry;
}

function requireSafeCode(value: string): string {
  if (
    typeof value !== "string" ||
    !SAFE_CODE_PATTERN.test(value)
  ) {
    throw new SandboxWorkerCycleInfrastructureError(
      "sandbox_invalid_failure_code",
    );
  }

  return value;
}

function normalizeContext(
  context: TenantTransactionContext,
): TenantTransactionContext {
  if (!context || typeof context !== "object") {
    throw new SandboxWorkerCycleValidationError(
      "A complete tenant transaction context is required.",
    );
  }

  return Object.freeze({
    tenantId: requireUuid(
      context.tenantId,
      "tenantId",
    ),
    actorId: requireUuid(
      context.actorId,
      "actorId",
    ),
    requestId: requireRequestId(
      context.requestId,
    ),
  });
}

function normalizeExecutionError(
  error: unknown,
): SandboxHandlerExecutionError {
  if (error instanceof SandboxHandlerExecutionError) {
    return error;
  }

  return new SandboxHandlerExecutionError(
    "sandbox_worker_unexpected_error",
    true,
  );
}

function verifyClaimedBatch(
  claims: readonly ClaimedSandboxOutboxRecord[],
  expected: {
    readonly tenantId: string;
    readonly leaseOwner: string;
    readonly leaseToken: string;
  },
): void {
  const seenOutboxIds = new Set<string>();

  for (const claim of claims) {
    if (
      claim.tenantId !== expected.tenantId ||
      claim.leaseOwner !== expected.leaseOwner ||
      claim.leaseToken !== expected.leaseToken
    ) {
      throw new SandboxWorkerCycleInfrastructureError(
        "sandbox_claim_boundary_violation",
      );
    }

    if (seenOutboxIds.has(claim.outboxId)) {
      throw new SandboxWorkerCycleInfrastructureError(
        "sandbox_duplicate_claim_detected",
      );
    }

    seenOutboxIds.add(claim.outboxId);
  }
}

function verifyExecutionBinding(
  claim: ClaimedSandboxOutboxRecord,
  execution: ValidatedSandboxExecutionResult,
): void {
  if (
    execution.tenantId !== claim.tenantId ||
    execution.outboxId !== claim.outboxId ||
    execution.aggregateType !== claim.aggregateType ||
    execution.aggregateId !== claim.aggregateId ||
    execution.actionKind !== claim.actionKind ||
    execution.idempotencyKey !== claim.idempotencyKey ||
    execution.attemptCount !== claim.attemptCount ||
    execution.leaseOwner !== claim.leaseOwner ||
    execution.leaseToken !== claim.leaseToken
  ) {
    throw new SandboxHandlerExecutionError(
      "sandbox_worker_result_binding_mismatch",
      false,
    );
  }
}

function completedOutcome(
  claim: ClaimedSandboxOutboxRecord,
  resultId: string,
): SandboxWorkerOutcome {
  return Object.freeze({
    tenantId: claim.tenantId,
    outboxId: claim.outboxId,
    actionKind: claim.actionKind,
    attemptCount: claim.attemptCount,
    status: "completed",
    resultId,
    failureCode: null,
  });
}

function failedOutcome(
  claim: ClaimedSandboxOutboxRecord,
  status: "retry_scheduled" | "terminal_failed",
  failureCode: string,
): SandboxWorkerOutcome {
  return Object.freeze({
    tenantId: claim.tenantId,
    outboxId: claim.outboxId,
    actionKind: claim.actionKind,
    attemptCount: claim.attemptCount,
    status,
    resultId: null,
    failureCode: requireSafeCode(failureCode),
  });
}

async function finalizeClaimFailure(
  pool: PostgreSqlConnectionPool,
  context: TenantTransactionContext,
  claim: ClaimedSandboxOutboxRecord,
  failure: SandboxHandlerExecutionError,
  retryDelaySeconds: number,
  maxAttempts: number,
): Promise<SandboxWorkerOutcome> {
  try {
    const finalization =
      await withPostgreSqlTenantTransaction(
        pool,
        context,
        async (sql) =>
          failSandboxOutboxLease(sql, {
            outboxId: claim.outboxId,
            leaseOwner: claim.leaseOwner,
            leaseToken: claim.leaseToken,
            errorCode: requireSafeCode(
              failure.safeCode,
            ),
            retryable: failure.retryable,
            retryDelaySeconds,
            maxAttempts,
          }),
      );

    if (finalization.status === "pending") {
      return failedOutcome(
        claim,
        "retry_scheduled",
        failure.safeCode,
      );
    }

    if (finalization.status === "failed") {
      return failedOutcome(
        claim,
        "terminal_failed",
        failure.safeCode,
      );
    }

    throw new SandboxWorkerCycleInfrastructureError(
      "sandbox_failure_transition_invalid_state",
    );
  } catch (error) {
    if (
      error instanceof
      SandboxWorkerCycleInfrastructureError
    ) {
      throw error;
    }

    throw new SandboxWorkerCycleInfrastructureError(
      "sandbox_failure_transition_failed",
    );
  }
}

async function executeClaim(
  pool: PostgreSqlConnectionPool,
  context: TenantTransactionContext,
  registry: SandboxHandlerRegistry,
  claim: ClaimedSandboxOutboxRecord,
  handlerTimeoutMilliseconds: number,
  retryDelaySeconds: number,
  maxAttempts: number,
): Promise<SandboxWorkerOutcome> {
  let execution: ValidatedSandboxExecutionResult;

  try {
    execution = await registry.execute(
      claim,
      {
        timeoutMilliseconds:
          handlerTimeoutMilliseconds,
      },
    );

    verifyExecutionBinding(
      claim,
      execution,
    );
  } catch (error) {
    return finalizeClaimFailure(
      pool,
      context,
      claim,
      normalizeExecutionError(error),
      retryDelaySeconds,
      maxAttempts,
    );
  }

  try {
    const completion =
      await commitSandboxResultAndCompleteLease(
        pool,
        context,
        {
          resultId: execution.resultId,
          outboxId: claim.outboxId,
          actionKind: claim.actionKind,
          leaseOwner: claim.leaseOwner,
          leaseToken: claim.leaseToken,
          payload: execution.payload,
        },
      );

    if (
      completion.tenantId !== claim.tenantId ||
      completion.outboxId !== claim.outboxId ||
      completion.resultId !== execution.resultId ||
      completion.actionKind !== claim.actionKind
    ) {
      throw new SandboxWorkerCycleInfrastructureError(
        "sandbox_completion_boundary_violation",
      );
    }

    return completedOutcome(
      claim,
      completion.resultId,
    );
  } catch (error) {
    if (
      error instanceof
      SandboxWorkerCycleInfrastructureError
    ) {
      throw error;
    }

    return finalizeClaimFailure(
      pool,
      context,
      claim,
      new SandboxHandlerExecutionError(
        "sandbox_result_commit_failed",
        true,
      ),
      retryDelaySeconds,
      maxAttempts,
    );
  }
}

/**
 * Runs one bounded tenant-isolated sandbox worker cycle.
 *
 * Order:
 * 1. Recover expired leases and claim pending work atomically.
 * 2. Commit the lease transaction before handler execution.
 * 3. Execute each claimed sandbox action sequentially.
 * 4. Atomically persist successful results and complete leases.
 * 5. Safely schedule retry or terminal failure for failed work.
 *
 * No live provider execution, external delivery, payment execution or
 * public launch authority is introduced by this orchestration boundary.
 */
export async function runSandboxWorkerCycle(
  poolInput: PostgreSqlConnectionPool,
  contextInput: TenantTransactionContext,
  input: RunSandboxWorkerCycleInput,
): Promise<SandboxWorkerCycleResult> {
  const pool = requirePool(poolInput);
  const context = normalizeContext(contextInput);

  if (!input || typeof input !== "object") {
    throw new SandboxWorkerCycleValidationError(
      "Sandbox worker-cycle input is required.",
    );
  }

  const registry = requireRegistry(
    input.registry,
  );

  const leaseOwner = requireLeaseOwner(
    input.leaseOwner,
  );

  const leaseToken = requireUuid(
    input.leaseToken,
    "leaseToken",
  );

  const leaseSeconds = requireIntegerInRange(
    input.leaseSeconds,
    "leaseSeconds",
    5,
    900,
  );

  const batchSize = requireIntegerInRange(
    input.batchSize,
    "batchSize",
    1,
    100,
  );

  const handlerTimeoutMilliseconds =
    requireIntegerInRange(
      input.handlerTimeoutMilliseconds,
      "handlerTimeoutMilliseconds",
      10,
      30000,
    );

  const retryDelaySeconds =
    requireIntegerInRange(
      input.retryDelaySeconds,
      "retryDelaySeconds",
      0,
      86400,
    );

  const maxAttempts = requireIntegerInRange(
    input.maxAttempts,
    "maxAttempts",
    1,
    100,
  );

  let recoveredLeaseCount: number;
  let claims: readonly ClaimedSandboxOutboxRecord[];

  try {
    const preparation =
      await withPostgreSqlTenantTransaction(
        pool,
        context,
        async (sql) => {
          const recovery =
            await recoverExpiredSandboxOutboxLeases(
              sql,
            );

          const claimed =
            await claimSandboxOutboxBatch(
              sql,
              {
                leaseOwner,
                leaseToken,
                leaseSeconds,
                batchSize,
              },
            );

          return Object.freeze({
            recoveredLeaseCount:
              recovery.recoveredCount,
            claims: claimed,
          });
        },
      );

    recoveredLeaseCount =
      preparation.recoveredLeaseCount;

    claims = preparation.claims;
  } catch {
    throw new SandboxWorkerCycleInfrastructureError(
      "sandbox_worker_prepare_failed",
    );
  }

  verifyClaimedBatch(
    claims,
    {
      tenantId: context.tenantId,
      leaseOwner,
      leaseToken,
    },
  );

  const outcomes: SandboxWorkerOutcome[] = [];

  for (const claim of claims) {
    outcomes.push(
      await executeClaim(
        pool,
        context,
        registry,
        claim,
        handlerTimeoutMilliseconds,
        retryDelaySeconds,
        maxAttempts,
      ),
    );
  }

  const completedCount =
    outcomes.filter(
      (outcome) =>
        outcome.status === "completed",
    ).length;

  const retryScheduledCount =
    outcomes.filter(
      (outcome) =>
        outcome.status === "retry_scheduled",
    ).length;

  const terminalFailedCount =
    outcomes.filter(
      (outcome) =>
        outcome.status === "terminal_failed",
    ).length;

  return Object.freeze({
    tenantId: context.tenantId,
    recoveredLeaseCount,
    claimedCount: claims.length,
    completedCount,
    retryScheduledCount,
    terminalFailedCount,
    outcomes: Object.freeze([...outcomes]),
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
  });
}
