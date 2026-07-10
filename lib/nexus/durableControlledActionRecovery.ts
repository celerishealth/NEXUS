export type ControlledActionStatus =
  | "pending"
  | "authorized"
  | "executing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "blocked";

export interface DurableControlledActionRecord {
  actionId: string;
  tenantId: string;
  idempotencyKey: string | null;
  ownerAuthorizationId: string | null;
  status: ControlledActionStatus;
  version: number;
  attemptCount: number;
  maxAttempts: number;
  retryable: boolean;
  updatedAt: string;
  leaseOwner: string | null;
  leaseExpiresAt: string | null;
  nextAttemptAt: string | null;
  lastError: string | null;
  lastRecoveryToken: string | null;
  lastRecoveredAt: string | null;
}

export interface ControlledActionRecoveryContext {
  tenantId: string;
  now: string;
  leaseOwner: string;
  leaseDurationMs: number;
  recoveryToken: string;
  killSwitchEngaged: boolean;
}

export type ControlledActionRecoveryDisposition =
  | "claim"
  | "wait"
  | "block"
  | "complete";

export interface ControlledActionRecoveryDecision {
  disposition: ControlledActionRecoveryDisposition;
  reason:
    | "RECOVERY_CLAIM_ALLOWED"
    | "ACTION_NOT_FOUND"
    | "TENANT_MISMATCH"
    | "KILL_SWITCH_ENGAGED"
    | "OWNER_AUTHORIZATION_REQUIRED"
    | "IDEMPOTENCY_KEY_REQUIRED"
    | "PENDING_NOT_AUTHORIZED"
    | "TERMINAL_STATE"
    | "ACTIVE_EXECUTION_LEASE"
    | "RETRY_NOT_ALLOWED"
    | "RETRY_NOT_DUE"
    | "ATTEMPTS_EXHAUSTED"
    | "DUPLICATE_RECOVERY_TOKEN"
    | "CONCURRENT_RECOVERY_CLAIM";
}

export interface ControlledActionRecoveryStore {
  read(actionId: string): Promise<DurableControlledActionRecord | null>;

  compareAndSet(
    actionId: string,
    expectedVersion: number,
    nextRecord: DurableControlledActionRecord,
  ): Promise<boolean>;
}

export interface ControlledActionRecoveryClaimResult {
  claimed: boolean;
  decision: ControlledActionRecoveryDecision;
  record: DurableControlledActionRecord | null;
}

function parseTimestamp(value: string, fieldName: string): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid ${fieldName} timestamp.`);
  }

  return timestamp;
}

function validateContext(context: ControlledActionRecoveryContext): void {
  if (!context.tenantId.trim()) {
    throw new Error("Recovery tenantId is required.");
  }

  if (!context.leaseOwner.trim()) {
    throw new Error("Recovery leaseOwner is required.");
  }

  if (!context.recoveryToken.trim()) {
    throw new Error("Recovery token is required.");
  }

  if (
    !Number.isSafeInteger(context.leaseDurationMs) ||
    context.leaseDurationMs <= 0
  ) {
    throw new Error("Recovery leaseDurationMs must be a positive safe integer.");
  }

  parseTimestamp(context.now, "recovery now");
}

function validateRecord(record: DurableControlledActionRecord): void {
  if (!record.actionId.trim()) {
    throw new Error("Controlled action actionId is required.");
  }

  if (!record.tenantId.trim()) {
    throw new Error("Controlled action tenantId is required.");
  }

  if (!Number.isSafeInteger(record.version) || record.version < 0) {
    throw new Error("Controlled action version must be a non-negative integer.");
  }

  if (!Number.isSafeInteger(record.attemptCount) || record.attemptCount < 0) {
    throw new Error(
      "Controlled action attemptCount must be a non-negative integer.",
    );
  }

  if (!Number.isSafeInteger(record.maxAttempts) || record.maxAttempts < 1) {
    throw new Error("Controlled action maxAttempts must be at least one.");
  }

  parseTimestamp(record.updatedAt, "controlled action updatedAt");

  if (record.leaseExpiresAt) {
    parseTimestamp(record.leaseExpiresAt, "controlled action leaseExpiresAt");
  }

  if (record.nextAttemptAt) {
    parseTimestamp(record.nextAttemptAt, "controlled action nextAttemptAt");
  }
}

export function decideControlledActionRecovery(
  record: DurableControlledActionRecord,
  context: ControlledActionRecoveryContext,
): ControlledActionRecoveryDecision {
  validateRecord(record);
  validateContext(context);

  const now = parseTimestamp(context.now, "recovery now");

  if (record.tenantId !== context.tenantId) {
    return {
      disposition: "block",
      reason: "TENANT_MISMATCH",
    };
  }

  if (context.killSwitchEngaged) {
    return {
      disposition: "block",
      reason: "KILL_SWITCH_ENGAGED",
    };
  }

  if (!record.ownerAuthorizationId?.trim()) {
    return {
      disposition: "block",
      reason: "OWNER_AUTHORIZATION_REQUIRED",
    };
  }

  if (!record.idempotencyKey?.trim()) {
    return {
      disposition: "block",
      reason: "IDEMPOTENCY_KEY_REQUIRED",
    };
  }

  if (
    record.lastRecoveryToken === context.recoveryToken &&
    record.status === "executing"
  ) {
    return {
      disposition: "wait",
      reason: "DUPLICATE_RECOVERY_TOKEN",
    };
  }

  if (
    record.status === "succeeded" ||
    record.status === "cancelled" ||
    record.status === "blocked"
  ) {
    return {
      disposition: "complete",
      reason: "TERMINAL_STATE",
    };
  }

  if (record.status === "pending") {
    return {
      disposition: "block",
      reason: "PENDING_NOT_AUTHORIZED",
    };
  }

  if (record.attemptCount >= record.maxAttempts) {
    return {
      disposition: "block",
      reason: "ATTEMPTS_EXHAUSTED",
    };
  }

  if (record.status === "executing" && record.leaseExpiresAt) {
    const leaseExpiresAt = parseTimestamp(
      record.leaseExpiresAt,
      "controlled action leaseExpiresAt",
    );

    if (leaseExpiresAt > now) {
      return {
        disposition: "wait",
        reason: "ACTIVE_EXECUTION_LEASE",
      };
    }
  }

  if (record.status === "failed") {
    if (!record.retryable) {
      return {
        disposition: "block",
        reason: "RETRY_NOT_ALLOWED",
      };
    }

    if (
      record.nextAttemptAt &&
      parseTimestamp(
        record.nextAttemptAt,
        "controlled action nextAttemptAt",
      ) > now
    ) {
      return {
        disposition: "wait",
        reason: "RETRY_NOT_DUE",
      };
    }
  }

  return {
    disposition: "claim",
    reason: "RECOVERY_CLAIM_ALLOWED",
  };
}

export async function claimControlledActionRecovery(
  store: ControlledActionRecoveryStore,
  actionId: string,
  context: ControlledActionRecoveryContext,
): Promise<ControlledActionRecoveryClaimResult> {
  validateContext(context);

  if (!actionId.trim()) {
    throw new Error("Recovery actionId is required.");
  }

  const current = await store.read(actionId);

  if (!current) {
    return {
      claimed: false,
      decision: {
        disposition: "block",
        reason: "ACTION_NOT_FOUND",
      },
      record: null,
    };
  }

  const decision = decideControlledActionRecovery(current, context);

  if (decision.disposition !== "claim") {
    return {
      claimed: false,
      decision,
      record: current,
    };
  }

  const now = parseTimestamp(context.now, "recovery now");
  const leaseExpiresAt = new Date(
    now + context.leaseDurationMs,
  ).toISOString();

  const claimedRecord: DurableControlledActionRecord = {
    ...current,
    status: "executing",
    version: current.version + 1,
    attemptCount: current.attemptCount + 1,
    updatedAt: context.now,
    leaseOwner: context.leaseOwner,
    leaseExpiresAt,
    nextAttemptAt: null,
    lastRecoveryToken: context.recoveryToken,
    lastRecoveredAt: context.now,
  };

  const claimed = await store.compareAndSet(
    current.actionId,
    current.version,
    claimedRecord,
  );

  if (!claimed) {
    return {
      claimed: false,
      decision: {
        disposition: "wait",
        reason: "CONCURRENT_RECOVERY_CLAIM",
      },
      record: await store.read(actionId),
    };
  }

  return {
    claimed: true,
    decision,
    record: claimedRecord,
  };
}
