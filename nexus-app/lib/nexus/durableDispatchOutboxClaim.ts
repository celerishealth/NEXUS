export type DurableDispatchOutboxStatus =
  | "pending"
  | "retry_wait"
  | "delivering"
  | "delivered"
  | "dead_letter"
  | "cancelled";

export interface DurableDispatchOutboxClaimRecord {
  outboxId: string;
  tenantId: string;
  actionId: string;
  idempotencyKey: string;
  dispatchToken: string;
  effectType: string;
  payloadDigest: string;
  status: DurableDispatchOutboxStatus;
  version: number;
  deliveryAttemptCount: number;
  maxDeliveryAttempts: number;
  nextAttemptAt: string;
  leaseOwner: string | null;
  leaseFence: number;
  leaseExpiresAt: string | null;
  lastClaimToken: string | null;
  lastClaimedAt: string | null;
  lastClaimLeaseOwner: string | null;
  lastClaimLeaseFence: number | null;
  updatedAt: string;
}

export interface DurableDispatchOutboxClaimRequest {
  outboxId: string;
  tenantId: string;
  expectedVersion: number;
  workerId: string;
  claimToken: string;
  auditId: string;
  now: string;
  leaseDurationMs: number;
  killSwitchEngaged: boolean;
}

export interface DurableDispatchOutboxClaimAuditEvent {
  auditId: string;
  tenantId: string;
  actionId: string;
  outboxId: string;
  eventType: "DISPATCH_OUTBOX_CLAIMED";
  previousStatus: "pending" | "retry_wait" | "delivering";
  committedStatus: "delivering";
  previousVersion: number;
  committedVersion: number;
  deliveryAttemptCount: number;
  workerId: string;
  leaseFence: number;
  leaseExpiresAt: string;
  claimToken: string;
  occurredAt: string;
}

export type AtomicDispatchOutboxClaimCommitResult =
  | "committed"
  | "version_conflict"
  | "state_conflict"
  | "lease_conflict"
  | "audit_conflict";

export interface AtomicDispatchOutboxClaimInput {
  outboxId: string;
  expectedVersion: number;
  previousStatus: "pending" | "retry_wait" | "delivering";
  expectedLeaseOwner: string | null;
  expectedLeaseFence: number;
  nextRecord: DurableDispatchOutboxClaimRecord;
  auditEvent: DurableDispatchOutboxClaimAuditEvent;
}

export interface DurableDispatchOutboxClaimStore {
  readOutbox(
    outboxId: string,
  ): Promise<DurableDispatchOutboxClaimRecord | null>;

  commitClaim(
    input: AtomicDispatchOutboxClaimInput,
  ): Promise<AtomicDispatchOutboxClaimCommitResult>;
}

export type DurableDispatchOutboxClaimReason =
  | "CLAIM_ALLOWED"
  | "CLAIM_COMMITTED"
  | "CLAIM_REPLAY_ACCEPTED"
  | "OUTBOX_NOT_FOUND"
  | "TENANT_MISMATCH"
  | "KILL_SWITCH_ENGAGED"
  | "IDEMPOTENCY_KEY_REQUIRED"
  | "DISPATCH_TOKEN_REQUIRED"
  | "PAYLOAD_DIGEST_REQUIRED"
  | "VERSION_MISMATCH"
  | "DELIVERY_NOT_DUE"
  | "ACTIVE_DELIVERY_LEASE"
  | "DELIVERY_ATTEMPTS_EXHAUSTED"
  | "TERMINAL_OUTBOX_STATE"
  | "OUTBOX_STATE_NOT_CLAIMABLE"
  | "ATOMIC_VERSION_CONFLICT"
  | "ATOMIC_STATE_CONFLICT"
  | "ATOMIC_LEASE_CONFLICT"
  | "ATOMIC_AUDIT_CONFLICT";

export interface DurableDispatchOutboxClaimDecision {
  disposition: "claim" | "wait" | "complete" | "block";
  reason: DurableDispatchOutboxClaimReason;
}

export interface DurableDispatchOutboxClaimResult {
  committed: boolean;
  decision: DurableDispatchOutboxClaimDecision;
  record: DurableDispatchOutboxClaimRecord | null;
  auditEvent: DurableDispatchOutboxClaimAuditEvent | null;
}

const MAX_LEASE_DURATION_MS = 300_000;

function requireNonEmpty(value: string, fieldName: string): void {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }
}

function parseTimestamp(value: string, fieldName: string): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`${fieldName} must be a valid timestamp.`);
  }

  return timestamp;
}

function validateRecord(
  record: DurableDispatchOutboxClaimRecord,
): void {
  requireNonEmpty(record.outboxId, "Outbox outboxId");
  requireNonEmpty(record.tenantId, "Outbox tenantId");
  requireNonEmpty(record.actionId, "Outbox actionId");

  if (!Number.isSafeInteger(record.version) || record.version < 0) {
    throw new Error(
      "Outbox version must be a non-negative safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(record.deliveryAttemptCount) ||
    record.deliveryAttemptCount < 0
  ) {
    throw new Error(
      "Outbox deliveryAttemptCount must be a non-negative safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(record.maxDeliveryAttempts) ||
    record.maxDeliveryAttempts < 1
  ) {
    throw new Error(
      "Outbox maxDeliveryAttempts must be a positive safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(record.leaseFence) ||
    record.leaseFence < 0
  ) {
    throw new Error(
      "Outbox leaseFence must be a non-negative safe integer.",
    );
  }

  if (
    record.lastClaimLeaseFence !== null &&
    (!Number.isSafeInteger(record.lastClaimLeaseFence) ||
      record.lastClaimLeaseFence < 1)
  ) {
    throw new Error(
      "Outbox lastClaimLeaseFence must be null or positive.",
    );
  }

  parseTimestamp(record.nextAttemptAt, "Outbox nextAttemptAt");
  parseTimestamp(record.updatedAt, "Outbox updatedAt");

  if (record.leaseExpiresAt) {
    parseTimestamp(record.leaseExpiresAt, "Outbox leaseExpiresAt");
  }

  if (record.lastClaimedAt) {
    parseTimestamp(record.lastClaimedAt, "Outbox lastClaimedAt");
  }
}

function validateRequest(
  request: DurableDispatchOutboxClaimRequest,
): void {
  requireNonEmpty(request.outboxId, "Claim outboxId");
  requireNonEmpty(request.tenantId, "Claim tenantId");
  requireNonEmpty(request.workerId, "Claim workerId");
  requireNonEmpty(request.claimToken, "Claim token");
  requireNonEmpty(request.auditId, "Claim auditId");

  if (
    !Number.isSafeInteger(request.expectedVersion) ||
    request.expectedVersion < 0
  ) {
    throw new Error(
      "Claim expectedVersion must be a non-negative safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(request.leaseDurationMs) ||
    request.leaseDurationMs < 1 ||
    request.leaseDurationMs > MAX_LEASE_DURATION_MS
  ) {
    throw new Error(
      `Claim leaseDurationMs must be between 1 and ${MAX_LEASE_DURATION_MS}.`,
    );
  }

  parseTimestamp(request.now, "Claim now");
}

function isTerminalStatus(
  status: DurableDispatchOutboxStatus,
): boolean {
  return (
    status === "delivered" ||
    status === "dead_letter" ||
    status === "cancelled"
  );
}

function isExactClaimReplay(
  record: DurableDispatchOutboxClaimRecord,
  request: DurableDispatchOutboxClaimRequest,
): boolean {
  return (
    record.status === "delivering" &&
    record.lastClaimToken === request.claimToken &&
    record.lastClaimLeaseOwner === request.workerId &&
    record.leaseOwner === request.workerId
  );
}

export function decideDurableDispatchOutboxClaim(
  record: DurableDispatchOutboxClaimRecord,
  request: DurableDispatchOutboxClaimRequest,
): DurableDispatchOutboxClaimDecision {
  validateRecord(record);
  validateRequest(request);

  if (record.outboxId !== request.outboxId) {
    return {
      disposition: "block",
      reason: "OUTBOX_NOT_FOUND",
    };
  }

  if (record.tenantId !== request.tenantId) {
    return {
      disposition: "block",
      reason: "TENANT_MISMATCH",
    };
  }

  if (isExactClaimReplay(record, request)) {
    return {
      disposition: "complete",
      reason: "CLAIM_REPLAY_ACCEPTED",
    };
  }

  if (isTerminalStatus(record.status)) {
    return {
      disposition: "complete",
      reason: "TERMINAL_OUTBOX_STATE",
    };
  }

  if (request.killSwitchEngaged) {
    return {
      disposition: "block",
      reason: "KILL_SWITCH_ENGAGED",
    };
  }

  if (!record.idempotencyKey.trim()) {
    return {
      disposition: "block",
      reason: "IDEMPOTENCY_KEY_REQUIRED",
    };
  }

  if (!record.dispatchToken.trim()) {
    return {
      disposition: "block",
      reason: "DISPATCH_TOKEN_REQUIRED",
    };
  }

  if (!record.payloadDigest.trim()) {
    return {
      disposition: "block",
      reason: "PAYLOAD_DIGEST_REQUIRED",
    };
  }

  if (record.version !== request.expectedVersion) {
    return {
      disposition: "block",
      reason: "VERSION_MISMATCH",
    };
  }

  if (
    record.deliveryAttemptCount >= record.maxDeliveryAttempts
  ) {
    return {
      disposition: "block",
      reason: "DELIVERY_ATTEMPTS_EXHAUSTED",
    };
  }

  const now = parseTimestamp(request.now, "Claim now");

  if (record.status === "delivering") {
    if (!record.leaseExpiresAt) {
      return {
        disposition: "block",
        reason: "OUTBOX_STATE_NOT_CLAIMABLE",
      };
    }

    const leaseExpiresAt = parseTimestamp(
      record.leaseExpiresAt,
      "Outbox leaseExpiresAt",
    );

    if (leaseExpiresAt > now) {
      return {
        disposition: "wait",
        reason: "ACTIVE_DELIVERY_LEASE",
      };
    }

    return {
      disposition: "claim",
      reason: "CLAIM_ALLOWED",
    };
  }

  if (
    record.status !== "pending" &&
    record.status !== "retry_wait"
  ) {
    return {
      disposition: "block",
      reason: "OUTBOX_STATE_NOT_CLAIMABLE",
    };
  }

  const nextAttemptAt = parseTimestamp(
    record.nextAttemptAt,
    "Outbox nextAttemptAt",
  );

  if (nextAttemptAt > now) {
    return {
      disposition: "wait",
      reason: "DELIVERY_NOT_DUE",
    };
  }

  return {
    disposition: "claim",
    reason: "CLAIM_ALLOWED",
  };
}

function createClaimedRecord(
  record: DurableDispatchOutboxClaimRecord,
  request: DurableDispatchOutboxClaimRequest,
): DurableDispatchOutboxClaimRecord {
  const now = parseTimestamp(request.now, "Claim now");
  const nextLeaseFence = record.leaseFence + 1;

  return {
    ...record,
    status: "delivering",
    version: record.version + 1,
    deliveryAttemptCount: record.deliveryAttemptCount + 1,
    leaseOwner: request.workerId,
    leaseFence: nextLeaseFence,
    leaseExpiresAt: new Date(
      now + request.leaseDurationMs,
    ).toISOString(),
    lastClaimToken: request.claimToken,
    lastClaimedAt: request.now,
    lastClaimLeaseOwner: request.workerId,
    lastClaimLeaseFence: nextLeaseFence,
    updatedAt: request.now,
  };
}

function createClaimAuditEvent(
  record: DurableDispatchOutboxClaimRecord,
  request: DurableDispatchOutboxClaimRequest,
  nextRecord: DurableDispatchOutboxClaimRecord,
): DurableDispatchOutboxClaimAuditEvent {
  const leaseExpiresAt = nextRecord.leaseExpiresAt;

  if (!leaseExpiresAt) {
    throw new Error("Claimed outbox lease expiry is required.");
  }

  if (
    record.status !== "pending" &&
    record.status !== "retry_wait" &&
    record.status !== "delivering"
  ) {
    throw new Error("Previous outbox status is not claimable.");
  }

  return {
    auditId: request.auditId,
    tenantId: record.tenantId,
    actionId: record.actionId,
    outboxId: record.outboxId,
    eventType: "DISPATCH_OUTBOX_CLAIMED",
    previousStatus: record.status,
    committedStatus: "delivering",
    previousVersion: record.version,
    committedVersion: nextRecord.version,
    deliveryAttemptCount: nextRecord.deliveryAttemptCount,
    workerId: request.workerId,
    leaseFence: nextRecord.leaseFence,
    leaseExpiresAt,
    claimToken: request.claimToken,
    occurredAt: request.now,
  };
}

function mapAtomicConflict(
  result: Exclude<
    AtomicDispatchOutboxClaimCommitResult,
    "committed"
  >,
): DurableDispatchOutboxClaimReason {
  switch (result) {
    case "version_conflict":
      return "ATOMIC_VERSION_CONFLICT";
    case "state_conflict":
      return "ATOMIC_STATE_CONFLICT";
    case "lease_conflict":
      return "ATOMIC_LEASE_CONFLICT";
    case "audit_conflict":
      return "ATOMIC_AUDIT_CONFLICT";
  }
}

export async function claimDurableDispatchOutbox(
  store: DurableDispatchOutboxClaimStore,
  request: DurableDispatchOutboxClaimRequest,
): Promise<DurableDispatchOutboxClaimResult> {
  validateRequest(request);

  const current = await store.readOutbox(request.outboxId);

  if (!current) {
    return {
      committed: false,
      decision: {
        disposition: "block",
        reason: "OUTBOX_NOT_FOUND",
      },
      record: null,
      auditEvent: null,
    };
  }

  const decision = decideDurableDispatchOutboxClaim(
    current,
    request,
  );

  if (decision.disposition !== "claim") {
    return {
      committed: false,
      decision,
      record: current,
      auditEvent: null,
    };
  }

  const nextRecord = createClaimedRecord(current, request);
  const auditEvent = createClaimAuditEvent(
    current,
    request,
    nextRecord,
  );

  if (
    current.status !== "pending" &&
    current.status !== "retry_wait" &&
    current.status !== "delivering"
  ) {
    throw new Error("Current outbox status is not claimable.");
  }

  const commitResult = await store.commitClaim({
    outboxId: current.outboxId,
    expectedVersion: current.version,
    previousStatus: current.status,
    expectedLeaseOwner: current.leaseOwner,
    expectedLeaseFence: current.leaseFence,
    nextRecord,
    auditEvent,
  });

  if (commitResult === "committed") {
    return {
      committed: true,
      decision: {
        disposition: "complete",
        reason: "CLAIM_COMMITTED",
      },
      record: nextRecord,
      auditEvent,
    };
  }

  const latest = await store.readOutbox(request.outboxId);

  if (
    latest &&
    latest.tenantId === request.tenantId &&
    isExactClaimReplay(latest, request)
  ) {
    return {
      committed: false,
      decision: {
        disposition: "complete",
        reason: "CLAIM_REPLAY_ACCEPTED",
      },
      record: latest,
      auditEvent: null,
    };
  }

  return {
    committed: false,
    decision: {
      disposition: "block",
      reason: mapAtomicConflict(commitResult),
    },
    record: latest,
    auditEvent: null,
  };
}
