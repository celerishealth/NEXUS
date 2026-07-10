export type ControlledActionStatus =
  | "pending"
  | "authorized"
  | "executing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "blocked";

export interface DurableControlledActionLeaseRecord {
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
  lastHeartbeatToken: string | null;
  lastHeartbeatAt: string | null;
  lastHeartbeatLeaseOwner: string | null;
  lastHeartbeatLeaseFence: number | null;
  leaseRevokedAt: string | null;
  leaseRevocationReason: string | null;
}

export interface ControlledActionLeaseHeartbeatRequest {
  actionId: string;
  tenantId: string;
  expectedVersion: number;
  leaseOwner: string;
  leaseFence: number;
  now: string;
  extensionMs: number;
  heartbeatToken: string;
  auditId: string;
  killSwitchEngaged: boolean;
}

export type ControlledActionLeaseHeartbeatReason =
  | "LEASE_RENEWAL_ALLOWED"
  | "LEASE_RENEWAL_COMMITTED"
  | "LEASE_REVOCATION_REQUIRED"
  | "LEASE_REVOCATION_COMMITTED"
  | "HEARTBEAT_REPLAY_ACCEPTED"
  | "ACTION_NOT_FOUND"
  | "TENANT_MISMATCH"
  | "OWNER_AUTHORIZATION_REQUIRED"
  | "IDEMPOTENCY_KEY_REQUIRED"
  | "ACTION_NOT_EXECUTING"
  | "TERMINAL_STATE"
  | "VERSION_MISMATCH"
  | "LEASE_OWNER_MISMATCH"
  | "LEASE_FENCE_MISMATCH"
  | "LEASE_EXPIRED"
  | "LEASE_EXTENSION_NOT_REQUIRED"
  | "ATOMIC_VERSION_CONFLICT"
  | "ATOMIC_LEASE_CONFLICT"
  | "ATOMIC_AUDIT_CONFLICT";

export interface ControlledActionLeaseHeartbeatDecision {
  disposition: "renew" | "revoke" | "wait" | "complete" | "block";
  reason: ControlledActionLeaseHeartbeatReason;
}

export interface ControlledActionLeaseAuditEvent {
  auditId: string;
  tenantId: string;
  actionId: string;
  eventType:
    | "CONTROLLED_ACTION_LEASE_RENEWED"
    | "CONTROLLED_ACTION_LEASE_REVOKED";
  previousVersion: number;
  committedVersion: number;
  leaseOwner: string;
  leaseFence: number;
  heartbeatToken: string;
  previousLeaseExpiresAt: string | null;
  committedLeaseExpiresAt: string | null;
  revocationReason: string | null;
  occurredAt: string;
}

export type AtomicLeaseMutationCommitResult =
  | "committed"
  | "version_conflict"
  | "lease_conflict"
  | "audit_conflict";

export interface AtomicControlledActionLeaseMutationInput {
  actionId: string;
  expectedVersion: number;
  expectedLeaseOwner: string;
  expectedLeaseFence: number;
  nextRecord: DurableControlledActionLeaseRecord;
  auditEvent: ControlledActionLeaseAuditEvent;
}

export interface ControlledActionLeaseHeartbeatStore {
  read(
    actionId: string,
  ): Promise<DurableControlledActionLeaseRecord | null>;

  commitLeaseMutation(
    input: AtomicControlledActionLeaseMutationInput,
  ): Promise<AtomicLeaseMutationCommitResult>;
}

export interface ControlledActionLeaseHeartbeatResult {
  committed: boolean;
  decision: ControlledActionLeaseHeartbeatDecision;
  record: DurableControlledActionLeaseRecord | null;
  auditEvent: ControlledActionLeaseAuditEvent | null;
}

const MAX_LEASE_EXTENSION_MS = 300_000;

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
  record: DurableControlledActionLeaseRecord,
): void {
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

  if (
    !Number.isSafeInteger(record.leaseFence) ||
    record.leaseFence < 0
  ) {
    throw new Error(
      "Controlled action leaseFence must be a non-negative safe integer.",
    );
  }

  if (
    record.lastHeartbeatLeaseFence !== null &&
    (!Number.isSafeInteger(record.lastHeartbeatLeaseFence) ||
      record.lastHeartbeatLeaseFence < 1)
  ) {
    throw new Error(
      "Controlled action lastHeartbeatLeaseFence must be null or positive.",
    );
  }

  parseTimestamp(record.updatedAt, "Controlled action updatedAt");

  if (record.leaseExpiresAt) {
    parseTimestamp(
      record.leaseExpiresAt,
      "Controlled action leaseExpiresAt",
    );
  }

  if (record.lastHeartbeatAt) {
    parseTimestamp(
      record.lastHeartbeatAt,
      "Controlled action lastHeartbeatAt",
    );
  }

  if (record.leaseRevokedAt) {
    parseTimestamp(
      record.leaseRevokedAt,
      "Controlled action leaseRevokedAt",
    );
  }
}

function validateRequest(
  request: ControlledActionLeaseHeartbeatRequest,
): void {
  requireNonEmpty(request.actionId, "Heartbeat actionId");
  requireNonEmpty(request.tenantId, "Heartbeat tenantId");
  requireNonEmpty(request.leaseOwner, "Heartbeat leaseOwner");
  requireNonEmpty(request.heartbeatToken, "Heartbeat token");
  requireNonEmpty(request.auditId, "Heartbeat auditId");

  if (
    !Number.isSafeInteger(request.expectedVersion) ||
    request.expectedVersion < 0
  ) {
    throw new Error(
      "Heartbeat expectedVersion must be a non-negative safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(request.leaseFence) ||
    request.leaseFence < 1
  ) {
    throw new Error(
      "Heartbeat leaseFence must be a positive safe integer.",
    );
  }

  if (
    !Number.isSafeInteger(request.extensionMs) ||
    request.extensionMs < 1 ||
    request.extensionMs > MAX_LEASE_EXTENSION_MS
  ) {
    throw new Error(
      `Heartbeat extensionMs must be between 1 and ${MAX_LEASE_EXTENSION_MS}.`,
    );
  }

  parseTimestamp(request.now, "Heartbeat now");
}

function isTerminalStatus(status: ControlledActionStatus): boolean {
  return (
    status === "succeeded" ||
    status === "failed" ||
    status === "cancelled" ||
    status === "blocked"
  );
}

function isExactHeartbeatReplay(
  record: DurableControlledActionLeaseRecord,
  request: ControlledActionLeaseHeartbeatRequest,
): boolean {
  return (
    record.lastHeartbeatToken === request.heartbeatToken &&
    record.lastHeartbeatLeaseOwner === request.leaseOwner &&
    record.lastHeartbeatLeaseFence === request.leaseFence
  );
}

export function decideControlledActionLeaseHeartbeat(
  record: DurableControlledActionLeaseRecord,
  request: ControlledActionLeaseHeartbeatRequest,
): ControlledActionLeaseHeartbeatDecision {
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

  if (isExactHeartbeatReplay(record, request)) {
    return {
      disposition: "complete",
      reason: "HEARTBEAT_REPLAY_ACCEPTED",
    };
  }

  if (isTerminalStatus(record.status)) {
    return {
      disposition: "complete",
      reason: "TERMINAL_STATE",
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

  if (request.killSwitchEngaged) {
    return {
      disposition: "revoke",
      reason: "LEASE_REVOCATION_REQUIRED",
    };
  }

  if (!record.leaseExpiresAt) {
    return {
      disposition: "block",
      reason: "LEASE_EXPIRED",
    };
  }

  const now = parseTimestamp(request.now, "Heartbeat now");
  const currentLeaseExpiry = parseTimestamp(
    record.leaseExpiresAt,
    "Controlled action leaseExpiresAt",
  );

  if (currentLeaseExpiry <= now) {
    return {
      disposition: "block",
      reason: "LEASE_EXPIRED",
    };
  }

  const proposedLeaseExpiry = now + request.extensionMs;

  if (proposedLeaseExpiry <= currentLeaseExpiry) {
    return {
      disposition: "wait",
      reason: "LEASE_EXTENSION_NOT_REQUIRED",
    };
  }

  return {
    disposition: "renew",
    reason: "LEASE_RENEWAL_ALLOWED",
  };
}

function createRenewedRecord(
  record: DurableControlledActionLeaseRecord,
  request: ControlledActionLeaseHeartbeatRequest,
): DurableControlledActionLeaseRecord {
  const now = parseTimestamp(request.now, "Heartbeat now");

  return {
    ...record,
    version: record.version + 1,
    leaseExpiresAt: new Date(
      now + request.extensionMs,
    ).toISOString(),
    updatedAt: request.now,
    lastHeartbeatToken: request.heartbeatToken,
    lastHeartbeatAt: request.now,
    lastHeartbeatLeaseOwner: request.leaseOwner,
    lastHeartbeatLeaseFence: request.leaseFence,
  };
}

function createRevokedRecord(
  record: DurableControlledActionLeaseRecord,
  request: ControlledActionLeaseHeartbeatRequest,
): DurableControlledActionLeaseRecord {
  return {
    ...record,
    status: "blocked",
    version: record.version + 1,
    leaseOwner: null,
    leaseExpiresAt: null,
    updatedAt: request.now,
    lastHeartbeatToken: request.heartbeatToken,
    lastHeartbeatAt: request.now,
    lastHeartbeatLeaseOwner: request.leaseOwner,
    lastHeartbeatLeaseFence: request.leaseFence,
    leaseRevokedAt: request.now,
    leaseRevocationReason: "KILL_SWITCH_ENGAGED",
  };
}

function createLeaseAuditEvent(
  record: DurableControlledActionLeaseRecord,
  request: ControlledActionLeaseHeartbeatRequest,
  nextRecord: DurableControlledActionLeaseRecord,
  mutation: "renew" | "revoke",
): ControlledActionLeaseAuditEvent {
  return {
    auditId: request.auditId,
    tenantId: record.tenantId,
    actionId: record.actionId,
    eventType:
      mutation === "renew"
        ? "CONTROLLED_ACTION_LEASE_RENEWED"
        : "CONTROLLED_ACTION_LEASE_REVOKED",
    previousVersion: record.version,
    committedVersion: nextRecord.version,
    leaseOwner: request.leaseOwner,
    leaseFence: request.leaseFence,
    heartbeatToken: request.heartbeatToken,
    previousLeaseExpiresAt: record.leaseExpiresAt,
    committedLeaseExpiresAt: nextRecord.leaseExpiresAt,
    revocationReason:
      mutation === "revoke"
        ? "KILL_SWITCH_ENGAGED"
        : null,
    occurredAt: request.now,
  };
}

function mapAtomicConflict(
  result: Exclude<AtomicLeaseMutationCommitResult, "committed">,
): ControlledActionLeaseHeartbeatReason {
  switch (result) {
    case "version_conflict":
      return "ATOMIC_VERSION_CONFLICT";
    case "lease_conflict":
      return "ATOMIC_LEASE_CONFLICT";
    case "audit_conflict":
      return "ATOMIC_AUDIT_CONFLICT";
  }
}

export async function heartbeatControlledActionLease(
  store: ControlledActionLeaseHeartbeatStore,
  request: ControlledActionLeaseHeartbeatRequest,
): Promise<ControlledActionLeaseHeartbeatResult> {
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

  const decision = decideControlledActionLeaseHeartbeat(
    current,
    request,
  );

  if (
    decision.disposition === "block" ||
    decision.disposition === "wait" ||
    decision.disposition === "complete"
  ) {
    return {
      committed: false,
      decision,
      record: current,
      auditEvent: null,
    };
  }

  const mutation = decision.disposition;
  const nextRecord =
    mutation === "renew"
      ? createRenewedRecord(current, request)
      : createRevokedRecord(current, request);

  const auditEvent = createLeaseAuditEvent(
    current,
    request,
    nextRecord,
    mutation,
  );

  const commitResult = await store.commitLeaseMutation({
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
        reason:
          mutation === "renew"
            ? "LEASE_RENEWAL_COMMITTED"
            : "LEASE_REVOCATION_COMMITTED",
      },
      record: nextRecord,
      auditEvent,
    };
  }

  const latest = await store.read(request.actionId);

  if (
    latest &&
    latest.tenantId === request.tenantId &&
    isExactHeartbeatReplay(latest, request)
  ) {
    return {
      committed: false,
      decision: {
        disposition: "complete",
        reason: "HEARTBEAT_REPLAY_ACCEPTED",
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
