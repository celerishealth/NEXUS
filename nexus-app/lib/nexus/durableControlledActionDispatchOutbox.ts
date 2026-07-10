export type DispatchableControlledActionStatus =
  | "pending"
  | "authorized"
  | "dispatch_pending"
  | "executing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "blocked";

export interface DispatchableControlledActionRecord {
  actionId: string;
  tenantId: string;
  idempotencyKey: string | null;
  ownerAuthorizationId: string | null;
  status: DispatchableControlledActionStatus;
  version: number;
  updatedAt: string;
  dispatchToken: string | null;
  dispatchOutboxId: string | null;
  dispatchEffectType: string | null;
  dispatchPayloadDigest: string | null;
  dispatchRequestedAt: string | null;
}

export interface ControlledActionDispatchRequest {
  actionId: string;
  tenantId: string;
  expectedVersion: number;
  dispatchToken: string;
  outboxId: string;
  auditId: string;
  effectType: string;
  payloadDigest: string;
  now: string;
  killSwitchEngaged: boolean;
}

export interface DurableDispatchOutboxRecord {
  outboxId: string;
  tenantId: string;
  actionId: string;
  idempotencyKey: string;
  dispatchToken: string;
  effectType: string;
  payloadDigest: string;
  status: "pending";
  version: number;
  deliveryAttemptCount: number;
  nextAttemptAt: string;
  leaseOwner: null;
  leaseFence: number;
  leaseExpiresAt: null;
  createdAt: string;
  updatedAt: string;
}

export interface ControlledActionDispatchAuditEvent {
  auditId: string;
  tenantId: string;
  actionId: string;
  outboxId: string;
  eventType: "CONTROLLED_ACTION_DISPATCH_ENQUEUED";
  previousStatus: "authorized";
  committedStatus: "dispatch_pending";
  previousVersion: number;
  committedVersion: number;
  dispatchToken: string;
  effectType: string;
  payloadDigest: string;
  occurredAt: string;
}

export type AtomicDispatchCommitResult =
  | "committed"
  | "version_conflict"
  | "action_conflict"
  | "outbox_conflict"
  | "audit_conflict";

export interface AtomicControlledActionDispatchInput {
  actionId: string;
  expectedVersion: number;
  nextAction: DispatchableControlledActionRecord;
  outboxRecord: DurableDispatchOutboxRecord;
  auditEvent: ControlledActionDispatchAuditEvent;
}

export interface ControlledActionDispatchStore {
  readAction(
    actionId: string,
  ): Promise<DispatchableControlledActionRecord | null>;

  commitDispatchIntent(
    input: AtomicControlledActionDispatchInput,
  ): Promise<AtomicDispatchCommitResult>;
}

export type ControlledActionDispatchReason =
  | "DISPATCH_ALLOWED"
  | "DISPATCH_COMMITTED"
  | "DISPATCH_REPLAY_ACCEPTED"
  | "ACTION_NOT_FOUND"
  | "TENANT_MISMATCH"
  | "KILL_SWITCH_ENGAGED"
  | "OWNER_AUTHORIZATION_REQUIRED"
  | "IDEMPOTENCY_KEY_REQUIRED"
  | "ACTION_NOT_AUTHORIZED"
  | "VERSION_MISMATCH"
  | "DISPATCH_CONFLICT"
  | "TERMINAL_STATE"
  | "ATOMIC_VERSION_CONFLICT"
  | "ATOMIC_ACTION_CONFLICT"
  | "ATOMIC_OUTBOX_CONFLICT"
  | "ATOMIC_AUDIT_CONFLICT";

export interface ControlledActionDispatchDecision {
  disposition: "commit" | "complete" | "block";
  reason: ControlledActionDispatchReason;
}

export interface ControlledActionDispatchResult {
  committed: boolean;
  decision: ControlledActionDispatchDecision;
  action: DispatchableControlledActionRecord | null;
  outboxRecord: DurableDispatchOutboxRecord | null;
  auditEvent: ControlledActionDispatchAuditEvent | null;
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

function validateAction(
  action: DispatchableControlledActionRecord,
): void {
  requireNonEmpty(action.actionId, "Controlled action actionId");
  requireNonEmpty(action.tenantId, "Controlled action tenantId");

  if (!Number.isSafeInteger(action.version) || action.version < 0) {
    throw new Error(
      "Controlled action version must be a non-negative safe integer.",
    );
  }

  parseTimestamp(action.updatedAt, "Controlled action updatedAt");

  if (action.dispatchRequestedAt) {
    parseTimestamp(
      action.dispatchRequestedAt,
      "Controlled action dispatchRequestedAt",
    );
  }
}

function validateRequest(
  request: ControlledActionDispatchRequest,
): void {
  requireNonEmpty(request.actionId, "Dispatch actionId");
  requireNonEmpty(request.tenantId, "Dispatch tenantId");
  requireNonEmpty(request.dispatchToken, "Dispatch token");
  requireNonEmpty(request.outboxId, "Dispatch outboxId");
  requireNonEmpty(request.auditId, "Dispatch auditId");
  requireNonEmpty(request.effectType, "Dispatch effectType");
  requireNonEmpty(request.payloadDigest, "Dispatch payloadDigest");

  if (
    !Number.isSafeInteger(request.expectedVersion) ||
    request.expectedVersion < 0
  ) {
    throw new Error(
      "Dispatch expectedVersion must be a non-negative safe integer.",
    );
  }

  parseTimestamp(request.now, "Dispatch now");
}

function isTerminalStatus(
  status: DispatchableControlledActionStatus,
): boolean {
  return (
    status === "succeeded" ||
    status === "failed" ||
    status === "cancelled" ||
    status === "blocked"
  );
}

function isExactDispatchReplay(
  action: DispatchableControlledActionRecord,
  request: ControlledActionDispatchRequest,
): boolean {
  return (
    action.status === "dispatch_pending" &&
    action.dispatchToken === request.dispatchToken &&
    action.dispatchOutboxId === request.outboxId &&
    action.dispatchEffectType === request.effectType &&
    action.dispatchPayloadDigest === request.payloadDigest
  );
}

export function decideControlledActionDispatch(
  action: DispatchableControlledActionRecord,
  request: ControlledActionDispatchRequest,
): ControlledActionDispatchDecision {
  validateAction(action);
  validateRequest(request);

  if (action.actionId !== request.actionId) {
    return {
      disposition: "block",
      reason: "ACTION_NOT_FOUND",
    };
  }

  if (action.tenantId !== request.tenantId) {
    return {
      disposition: "block",
      reason: "TENANT_MISMATCH",
    };
  }

  if (isExactDispatchReplay(action, request)) {
    return {
      disposition: "complete",
      reason: "DISPATCH_REPLAY_ACCEPTED",
    };
  }

  if (action.status === "dispatch_pending") {
    return {
      disposition: "block",
      reason: "DISPATCH_CONFLICT",
    };
  }

  if (isTerminalStatus(action.status)) {
    return {
      disposition: "complete",
      reason: "TERMINAL_STATE",
    };
  }

  if (request.killSwitchEngaged) {
    return {
      disposition: "block",
      reason: "KILL_SWITCH_ENGAGED",
    };
  }

  if (!action.ownerAuthorizationId?.trim()) {
    return {
      disposition: "block",
      reason: "OWNER_AUTHORIZATION_REQUIRED",
    };
  }

  if (!action.idempotencyKey?.trim()) {
    return {
      disposition: "block",
      reason: "IDEMPOTENCY_KEY_REQUIRED",
    };
  }

  if (action.status !== "authorized") {
    return {
      disposition: "block",
      reason: "ACTION_NOT_AUTHORIZED",
    };
  }

  if (action.version !== request.expectedVersion) {
    return {
      disposition: "block",
      reason: "VERSION_MISMATCH",
    };
  }

  return {
    disposition: "commit",
    reason: "DISPATCH_ALLOWED",
  };
}

function createDispatchPendingAction(
  action: DispatchableControlledActionRecord,
  request: ControlledActionDispatchRequest,
): DispatchableControlledActionRecord {
  return {
    ...action,
    status: "dispatch_pending",
    version: action.version + 1,
    updatedAt: request.now,
    dispatchToken: request.dispatchToken,
    dispatchOutboxId: request.outboxId,
    dispatchEffectType: request.effectType,
    dispatchPayloadDigest: request.payloadDigest,
    dispatchRequestedAt: request.now,
  };
}

function createDispatchOutboxRecord(
  action: DispatchableControlledActionRecord,
  request: ControlledActionDispatchRequest,
): DurableDispatchOutboxRecord {
  const idempotencyKey = action.idempotencyKey?.trim();

  if (!idempotencyKey) {
    throw new Error(
      "Controlled action idempotencyKey is required for dispatch.",
    );
  }

  return {
    outboxId: request.outboxId,
    tenantId: action.tenantId,
    actionId: action.actionId,
    idempotencyKey,
    dispatchToken: request.dispatchToken,
    effectType: request.effectType,
    payloadDigest: request.payloadDigest,
    status: "pending",
    version: 0,
    deliveryAttemptCount: 0,
    nextAttemptAt: request.now,
    leaseOwner: null,
    leaseFence: 0,
    leaseExpiresAt: null,
    createdAt: request.now,
    updatedAt: request.now,
  };
}

function createDispatchAuditEvent(
  action: DispatchableControlledActionRecord,
  request: ControlledActionDispatchRequest,
): ControlledActionDispatchAuditEvent {
  return {
    auditId: request.auditId,
    tenantId: action.tenantId,
    actionId: action.actionId,
    outboxId: request.outboxId,
    eventType: "CONTROLLED_ACTION_DISPATCH_ENQUEUED",
    previousStatus: "authorized",
    committedStatus: "dispatch_pending",
    previousVersion: action.version,
    committedVersion: action.version + 1,
    dispatchToken: request.dispatchToken,
    effectType: request.effectType,
    payloadDigest: request.payloadDigest,
    occurredAt: request.now,
  };
}

function mapAtomicConflict(
  result: Exclude<AtomicDispatchCommitResult, "committed">,
): ControlledActionDispatchReason {
  switch (result) {
    case "version_conflict":
      return "ATOMIC_VERSION_CONFLICT";
    case "action_conflict":
      return "ATOMIC_ACTION_CONFLICT";
    case "outbox_conflict":
      return "ATOMIC_OUTBOX_CONFLICT";
    case "audit_conflict":
      return "ATOMIC_AUDIT_CONFLICT";
  }
}

export async function enqueueControlledActionDispatch(
  store: ControlledActionDispatchStore,
  request: ControlledActionDispatchRequest,
): Promise<ControlledActionDispatchResult> {
  validateRequest(request);

  const current = await store.readAction(request.actionId);

  if (!current) {
    return {
      committed: false,
      decision: {
        disposition: "block",
        reason: "ACTION_NOT_FOUND",
      },
      action: null,
      outboxRecord: null,
      auditEvent: null,
    };
  }

  const decision = decideControlledActionDispatch(current, request);

  if (decision.disposition !== "commit") {
    return {
      committed: false,
      decision,
      action: current,
      outboxRecord: null,
      auditEvent: null,
    };
  }

  const nextAction = createDispatchPendingAction(
    current,
    request,
  );

  const outboxRecord = createDispatchOutboxRecord(
    current,
    request,
  );

  const auditEvent = createDispatchAuditEvent(
    current,
    request,
  );

  const commitResult = await store.commitDispatchIntent({
    actionId: current.actionId,
    expectedVersion: current.version,
    nextAction,
    outboxRecord,
    auditEvent,
  });

  if (commitResult === "committed") {
    return {
      committed: true,
      decision: {
        disposition: "complete",
        reason: "DISPATCH_COMMITTED",
      },
      action: nextAction,
      outboxRecord,
      auditEvent,
    };
  }

  const latest = await store.readAction(request.actionId);

  if (
    latest &&
    latest.tenantId === request.tenantId &&
    isExactDispatchReplay(latest, request)
  ) {
    return {
      committed: false,
      decision: {
        disposition: "complete",
        reason: "DISPATCH_REPLAY_ACCEPTED",
      },
      action: latest,
      outboxRecord: null,
      auditEvent: null,
    };
  }

  return {
    committed: false,
    decision: {
      disposition: "block",
      reason: mapAtomicConflict(commitResult),
    },
    action: latest,
    outboxRecord: null,
    auditEvent: null,
  };
}
