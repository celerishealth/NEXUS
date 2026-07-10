export type ControlledActionStatus =
  | "pending"
  | "authorized"
  | "executing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "blocked";

export type ControlledActionTerminalStatus =
  | "succeeded"
  | "failed"
  | "cancelled";

export interface FencedControlledActionRecord {
  actionId: string;
  tenantId: string;
  idempotencyKey: string | null;
  ownerAuthorizationId: string | null;
  status: ControlledActionStatus;
  version: number;
  attemptCount: number;
  leaseOwner: string | null;
  leaseFence: number;
  leaseExpiresAt: string | null;
  updatedAt: string;
  terminalAt: string | null;
  terminalCommitToken: string | null;
  outcomeDigest: string | null;
  terminalReasonCode: string | null;
}

export interface ControlledActionFinalizationRequest {
  actionId: string;
  tenantId: string;
  expectedVersion: number;
  leaseOwner: string;
  leaseFence: number;
  now: string;
  finalStatus: ControlledActionTerminalStatus;
  terminalCommitToken: string;
  auditId: string;
  outcomeDigest: string | null;
  terminalReasonCode: string | null;
}

export interface ControlledActionFinalizationAuditEvent {
  auditId: string;
  tenantId: string;
  actionId: string;
  eventType: "CONTROLLED_ACTION_FINALIZED";
  previousStatus: "executing";
  finalStatus: ControlledActionTerminalStatus;
  previousVersion: number;
  committedVersion: number;
  attemptCount: number;
  leaseOwner: string;
  leaseFence: number;
  terminalCommitToken: string;
  outcomeDigest: string | null;
  terminalReasonCode: string | null;
  occurredAt: string;
}

export type AtomicFinalizationCommitResult =
  | "committed"
  | "version_conflict"
  | "lease_conflict"
  | "audit_conflict";

export interface AtomicControlledActionFinalizationInput {
  actionId: string;
  expectedVersion: number;
  expectedLeaseOwner: string;
  expectedLeaseFence: number;
  nextRecord: FencedControlledActionRecord;
  auditEvent: ControlledActionFinalizationAuditEvent;
}

export interface ControlledActionFinalizationStore {
  read(actionId: string): Promise<FencedControlledActionRecord | null>;

  commitFinalization(
    input: AtomicControlledActionFinalizationInput,
  ): Promise<AtomicFinalizationCommitResult>;
}

export type ControlledActionFinalizationReason =
  | "FINALIZATION_ALLOWED"
  | "FINALIZATION_COMMITTED"
  | "ACTION_NOT_FOUND"
  | "TENANT_MISMATCH"
  | "OWNER_AUTHORIZATION_REQUIRED"
  | "IDEMPOTENCY_KEY_REQUIRED"
  | "ACTION_NOT_EXECUTING"
  | "VERSION_MISMATCH"
  | "LEASE_OWNER_MISMATCH"
  | "LEASE_FENCE_MISMATCH"
  | "LEASE_EXPIRED"
  | "SUCCESS_OUTCOME_DIGEST_REQUIRED"
  | "FAILURE_REASON_REQUIRED"
  | "CANCELLATION_REASON_REQUIRED"
  | "TERMINAL_REPLAY_ACCEPTED"
  | "TERMINAL_COMMIT_CONFLICT"
  | "ATOMIC_VERSION_CONFLICT"
  | "ATOMIC_LEASE_CONFLICT"
  | "ATOMIC_AUDIT_CONFLICT";

export interface ControlledActionFinalizationDecision {
  disposition: "commit" | "complete" | "block";
  reason: ControlledActionFinalizationReason;
}

export interface ControlledActionFinalizationResult {
  committed: boolean;
  decision: ControlledActionFinalizationDecision;
  record: FencedControlledActionRecord | null;
  auditEvent: ControlledActionFinalizationAuditEvent | null;
}

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

function normalizeOptional(value: string | null): string | null {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

function validateRecord(record: FencedControlledActionRecord): void {
  requireNonEmpty(record.actionId, "Controlled action actionId");
  requireNonEmpty(record.tenantId, "Controlled action tenantId");

  if (!Number.isSafeInteger(record.version) || record.version < 0) {
    throw new Error(
      "Controlled action version must be a non-negative safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(record.attemptCount) ||
    record.attemptCount < 0
  ) {
    throw new Error(
      "Controlled action attemptCount must be a non-negative safe integer.",
    );
  }

  if (!Number.isSafeInteger(record.leaseFence) || record.leaseFence < 0) {
    throw new Error(
      "Controlled action leaseFence must be a non-negative safe integer.",
    );
  }

  parseTimestamp(record.updatedAt, "Controlled action updatedAt");

  if (record.leaseExpiresAt) {
    parseTimestamp(
      record.leaseExpiresAt,
      "Controlled action leaseExpiresAt",
    );
  }

  if (record.terminalAt) {
    parseTimestamp(record.terminalAt, "Controlled action terminalAt");
  }
}

function validateRequest(
  request: ControlledActionFinalizationRequest,
): void {
  requireNonEmpty(request.actionId, "Finalization actionId");
  requireNonEmpty(request.tenantId, "Finalization tenantId");
  requireNonEmpty(request.leaseOwner, "Finalization leaseOwner");
  requireNonEmpty(
    request.terminalCommitToken,
    "Finalization terminalCommitToken",
  );
  requireNonEmpty(request.auditId, "Finalization auditId");

  if (
    !Number.isSafeInteger(request.expectedVersion) ||
    request.expectedVersion < 0
  ) {
    throw new Error(
      "Finalization expectedVersion must be a non-negative safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(request.leaseFence) ||
    request.leaseFence < 1
  ) {
    throw new Error(
      "Finalization leaseFence must be a positive safe integer.",
    );
  }

  parseTimestamp(request.now, "Finalization now");
}

function isTerminalStatus(
  status: ControlledActionStatus,
): status is ControlledActionTerminalStatus {
  return (
    status === "succeeded" ||
    status === "failed" ||
    status === "cancelled"
  );
}

function isMatchingTerminalReplay(
  record: FencedControlledActionRecord,
  request: ControlledActionFinalizationRequest,
): boolean {
  return (
    isTerminalStatus(record.status) &&
    record.status === request.finalStatus &&
    record.terminalCommitToken === request.terminalCommitToken &&
    record.outcomeDigest === normalizeOptional(request.outcomeDigest) &&
    record.terminalReasonCode ===
      normalizeOptional(request.terminalReasonCode)
  );
}

export function decideControlledActionFinalization(
  record: FencedControlledActionRecord,
  request: ControlledActionFinalizationRequest,
): ControlledActionFinalizationDecision {
  validateRecord(record);
  validateRequest(request);

  if (record.actionId !== request.actionId) {
    return {
      disposition: "block",
      reason: "ACTION_NOT_FOUND",
    };
  }

  if (record.tenantId !== request.tenantId) {
    return {
      disposition: "block",
      reason: "TENANT_MISMATCH",
    };
  }

  if (isTerminalStatus(record.status)) {
    if (isMatchingTerminalReplay(record, request)) {
      return {
        disposition: "complete",
        reason: "TERMINAL_REPLAY_ACCEPTED",
      };
    }

    return {
      disposition: "block",
      reason: "TERMINAL_COMMIT_CONFLICT",
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

  if (record.status !== "executing") {
    return {
      disposition: "block",
      reason: "ACTION_NOT_EXECUTING",
    };
  }

  if (record.version !== request.expectedVersion) {
    return {
      disposition: "block",
      reason: "VERSION_MISMATCH",
    };
  }

  if (record.leaseOwner !== request.leaseOwner) {
    return {
      disposition: "block",
      reason: "LEASE_OWNER_MISMATCH",
    };
  }

  if (record.leaseFence !== request.leaseFence) {
    return {
      disposition: "block",
      reason: "LEASE_FENCE_MISMATCH",
    };
  }

  if (!record.leaseExpiresAt) {
    return {
      disposition: "block",
      reason: "LEASE_EXPIRED",
    };
  }

  const now = parseTimestamp(request.now, "Finalization now");
  const leaseExpiresAt = parseTimestamp(
    record.leaseExpiresAt,
    "Controlled action leaseExpiresAt",
  );

  if (leaseExpiresAt <= now) {
    return {
      disposition: "block",
      reason: "LEASE_EXPIRED",
    };
  }

  if (
    request.finalStatus === "succeeded" &&
    !normalizeOptional(request.outcomeDigest)
  ) {
    return {
      disposition: "block",
      reason: "SUCCESS_OUTCOME_DIGEST_REQUIRED",
    };
  }

  if (
    request.finalStatus === "failed" &&
    !normalizeOptional(request.terminalReasonCode)
  ) {
    return {
      disposition: "block",
      reason: "FAILURE_REASON_REQUIRED",
    };
  }

  if (
    request.finalStatus === "cancelled" &&
    !normalizeOptional(request.terminalReasonCode)
  ) {
    return {
      disposition: "block",
      reason: "CANCELLATION_REASON_REQUIRED",
    };
  }

  return {
    disposition: "commit",
    reason: "FINALIZATION_ALLOWED",
  };
}

function createTerminalRecord(
  record: FencedControlledActionRecord,
  request: ControlledActionFinalizationRequest,
): FencedControlledActionRecord {
  return {
    ...record,
    status: request.finalStatus,
    version: record.version + 1,
    leaseOwner: null,
    leaseExpiresAt: null,
    updatedAt: request.now,
    terminalAt: request.now,
    terminalCommitToken: request.terminalCommitToken,
    outcomeDigest: normalizeOptional(request.outcomeDigest),
    terminalReasonCode: normalizeOptional(
      request.terminalReasonCode,
    ),
  };
}

function createFinalizationAuditEvent(
  record: FencedControlledActionRecord,
  request: ControlledActionFinalizationRequest,
): ControlledActionFinalizationAuditEvent {
  return {
    auditId: request.auditId,
    tenantId: record.tenantId,
    actionId: record.actionId,
    eventType: "CONTROLLED_ACTION_FINALIZED",
    previousStatus: "executing",
    finalStatus: request.finalStatus,
    previousVersion: record.version,
    committedVersion: record.version + 1,
    attemptCount: record.attemptCount,
    leaseOwner: request.leaseOwner,
    leaseFence: request.leaseFence,
    terminalCommitToken: request.terminalCommitToken,
    outcomeDigest: normalizeOptional(request.outcomeDigest),
    terminalReasonCode: normalizeOptional(
      request.terminalReasonCode,
    ),
    occurredAt: request.now,
  };
}

function mapAtomicConflict(
  result: Exclude<AtomicFinalizationCommitResult, "committed">,
): ControlledActionFinalizationReason {
  switch (result) {
    case "version_conflict":
      return "ATOMIC_VERSION_CONFLICT";
    case "lease_conflict":
      return "ATOMIC_LEASE_CONFLICT";
    case "audit_conflict":
      return "ATOMIC_AUDIT_CONFLICT";
  }
}

export async function finalizeControlledAction(
  store: ControlledActionFinalizationStore,
  request: ControlledActionFinalizationRequest,
): Promise<ControlledActionFinalizationResult> {
  validateRequest(request);

  const current = await store.read(request.actionId);

  if (!current) {
    return {
      committed: false,
      decision: {
        disposition: "block",
        reason: "ACTION_NOT_FOUND",
      },
      record: null,
      auditEvent: null,
    };
  }

  const decision = decideControlledActionFinalization(
    current,
    request,
  );

  if (decision.disposition === "complete") {
    return {
      committed: false,
      decision,
      record: current,
      auditEvent: null,
    };
  }

  if (decision.disposition === "block") {
    return {
      committed: false,
      decision,
      record: current,
      auditEvent: null,
    };
  }

  const nextRecord = createTerminalRecord(current, request);
  const auditEvent = createFinalizationAuditEvent(
    current,
    request,
  );

  const commitResult = await store.commitFinalization({
    actionId: current.actionId,
    expectedVersion: current.version,
    expectedLeaseOwner: request.leaseOwner,
    expectedLeaseFence: request.leaseFence,
    nextRecord,
    auditEvent,
  });

  if (commitResult === "committed") {
    return {
      committed: true,
      decision: {
        disposition: "complete",
        reason: "FINALIZATION_COMMITTED",
      },
      record: nextRecord,
      auditEvent,
    };
  }

  const latest = await store.read(request.actionId);

  if (
    latest &&
    latest.tenantId === request.tenantId &&
    isMatchingTerminalReplay(latest, request)
  ) {
    return {
      committed: false,
      decision: {
        disposition: "complete",
        reason: "TERMINAL_REPLAY_ACCEPTED",
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
