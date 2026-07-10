import { createHash, randomUUID } from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname } from "node:path";

export type IntegratedControlledActionStatus =
  | "pending"
  | "authorized"
  | "dispatch_pending"
  | "executing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "blocked";

export type IntegratedDispatchOutboxStatus =
  | "pending"
  | "delivering"
  | "delivered"
  | "dead_letter"
  | "cancelled";

export interface IntegratedControlledAction {
  actionId: string;
  tenantId: string;
  idempotencyKey: string;
  effectType: string;
  payloadDigest: string;
  status: IntegratedControlledActionStatus;
  version: number;
  ownerAuthorizationId: string | null;
  dispatchToken: string | null;
  outboxId: string | null;
  leaseOwner: string | null;
  leaseFence: number;
  leaseExpiresAt: string | null;
  terminalCommitToken: string | null;
  resultDigest: string | null;
  terminalReasonCode: string | null;
  createdAt: string;
  updatedAt: string;
  terminalAt: string | null;
}

export interface IntegratedDispatchOutboxRecord {
  outboxId: string;
  tenantId: string;
  actionId: string;
  idempotencyKey: string;
  dispatchToken: string;
  effectType: string;
  payloadDigest: string;
  status: IntegratedDispatchOutboxStatus;
  version: number;
  deliveryAttemptCount: number;
  maxDeliveryAttempts: number;
  nextAttemptAt: string;
  leaseOwner: string | null;
  leaseFence: number;
  leaseExpiresAt: string | null;
  lastClaimToken: string | null;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
}

type AuditDetailValue = string | number | boolean | null;

export interface IntegratedAuditEvent {
  sequence: number;
  auditId: string;
  tenantId: string;
  actionId: string | null;
  outboxId: string | null;
  eventType:
    | "CONTROLLED_ACTION_CREATED"
    | "CONTROLLED_ACTION_AUTHORIZED"
    | "CONTROLLED_ACTION_DISPATCH_ENQUEUED"
    | "DISPATCH_OUTBOX_CLAIMED"
    | "CONTROLLED_ACTION_FINALIZED"
    | "OPERATIONAL_KILL_SWITCH_CHANGED";
  occurredAt: string;
  previousHash: string;
  details: Record<string, AuditDetailValue>;
  hash: string;
}

export interface PersistentControlledActionState {
  schemaVersion: 1;
  revision: number;
  killSwitch: {
    engaged: boolean;
    reason: string | null;
    updatedAt: string | null;
  };
  actions: Record<string, IntegratedControlledAction>;
  outbox: Record<string, IntegratedDispatchOutboxRecord>;
  audit: IntegratedAuditEvent[];
}

export interface CreateIntegratedActionRequest {
  actionId: string;
  tenantId: string;
  idempotencyKey: string;
  effectType: string;
  payloadDigest: string;
  auditId: string;
  now: string;
}

export interface AuthorizeIntegratedActionRequest {
  actionId: string;
  tenantId: string;
  ownerAuthorizationId: string;
  auditId: string;
  now: string;
}

export interface EnqueueIntegratedActionRequest {
  actionId: string;
  tenantId: string;
  outboxId: string;
  dispatchToken: string;
  maxDeliveryAttempts: number;
  auditId: string;
  now: string;
}

export interface ClaimIntegratedOutboxRequest {
  outboxId: string;
  tenantId: string;
  workerId: string;
  claimToken: string;
  leaseDurationMs: number;
  auditId: string;
  now: string;
}

export interface FinalizeIntegratedActionRequest {
  actionId: string;
  tenantId: string;
  workerId: string;
  leaseFence: number;
  terminalCommitToken: string;
  finalStatus: "succeeded" | "failed" | "cancelled";
  resultDigest: string | null;
  terminalReasonCode: string | null;
  auditId: string;
  now: string;
}

export interface SetIntegratedKillSwitchRequest {
  engaged: boolean;
  reason: string | null;
  auditId: string;
  now: string;
}

interface TransactionResult<T> {
  changed: boolean;
  value: T;
}

const MAX_LEASE_DURATION_MS = 300_000;
const LOCK_WAIT_TIMEOUT_MS = 5_000;
const STALE_LOCK_MS = 30_000;

function requireNonEmpty(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function parseTimestamp(value: string, fieldName: string): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`${fieldName} must be a valid timestamp.`);
  }

  return timestamp;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createInitialState(): PersistentControlledActionState {
  return {
    schemaVersion: 1,
    revision: 0,
    killSwitch: {
      engaged: false,
      reason: null,
      updatedAt: null,
    },
    actions: {},
    outbox: {},
    audit: [],
  };
}

function stableStringify(value: unknown): string {
  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "string"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const keys = Object.keys(objectValue).sort();

    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(objectValue[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error("Unsupported value in stable serialization.");
}

function hashAuditEvent(
  event: Omit<IntegratedAuditEvent, "hash">,
): string {
  return createHash("sha256")
    .update(stableStringify(event))
    .digest("hex");
}

function isTerminalActionStatus(
  status: IntegratedControlledActionStatus,
): boolean {
  return (
    status === "succeeded" ||
    status === "failed" ||
    status === "cancelled" ||
    status === "blocked"
  );
}

function isTerminalOutboxStatus(
  status: IntegratedDispatchOutboxStatus,
): boolean {
  return (
    status === "delivered" ||
    status === "dead_letter" ||
    status === "cancelled"
  );
}

function validateState(state: PersistentControlledActionState): void {
  if (state.schemaVersion !== 1) {
    throw new Error("Unsupported persistent state schema version.");
  }

  if (!Number.isSafeInteger(state.revision) || state.revision < 0) {
    throw new Error("Persistent state revision is invalid.");
  }

  let expectedPreviousHash = "";

  state.audit.forEach((event, index) => {
    if (event.sequence !== index + 1) {
      throw new Error("Persistent audit sequence is invalid.");
    }

    if (event.previousHash !== expectedPreviousHash) {
      throw new Error("Persistent audit previous hash mismatch.");
    }

    const { hash, ...unsignedEvent } = event;
    const expectedHash = hashAuditEvent(unsignedEvent);

    if (hash !== expectedHash) {
      throw new Error("Persistent audit hash mismatch.");
    }

    expectedPreviousHash = hash;
  });

  const idempotencyKeys = new Set<string>();

  for (const action of Object.values(state.actions)) {
    requireNonEmpty(action.actionId, "Stored action actionId");
    requireNonEmpty(action.tenantId, "Stored action tenantId");
    requireNonEmpty(
      action.idempotencyKey,
      "Stored action idempotencyKey",
    );

    const tenantIdempotencyKey =
      `${action.tenantId}:${action.idempotencyKey}`;

    if (idempotencyKeys.has(tenantIdempotencyKey)) {
      throw new Error(
        "Duplicate tenant-scoped action idempotency key detected.",
      );
    }

    idempotencyKeys.add(tenantIdempotencyKey);

    if (!Number.isSafeInteger(action.version) || action.version < 0) {
      throw new Error("Stored action version is invalid.");
    }

    if (
      !Number.isSafeInteger(action.leaseFence) ||
      action.leaseFence < 0
    ) {
      throw new Error("Stored action lease fence is invalid.");
    }

    parseTimestamp(action.createdAt, "Stored action createdAt");
    parseTimestamp(action.updatedAt, "Stored action updatedAt");

    if (action.leaseExpiresAt) {
      parseTimestamp(
        action.leaseExpiresAt,
        "Stored action leaseExpiresAt",
      );
    }

    if (action.terminalAt) {
      parseTimestamp(action.terminalAt, "Stored action terminalAt");
    }

    if (action.outboxId) {
      const outboxRecord = state.outbox[action.outboxId];

      if (!outboxRecord) {
        throw new Error("Stored action references a missing outbox record.");
      }

      if (
        outboxRecord.actionId !== action.actionId ||
        outboxRecord.tenantId !== action.tenantId
      ) {
        throw new Error(
          "Stored action and outbox tenant/action relationship is invalid.",
        );
      }
    }
  }

  for (const outboxRecord of Object.values(state.outbox)) {
    requireNonEmpty(outboxRecord.outboxId, "Stored outbox outboxId");
    requireNonEmpty(outboxRecord.tenantId, "Stored outbox tenantId");
    requireNonEmpty(outboxRecord.actionId, "Stored outbox actionId");

    const action = state.actions[outboxRecord.actionId];

    if (!action) {
      throw new Error("Stored outbox references a missing action.");
    }

    if (
      action.tenantId !== outboxRecord.tenantId ||
      action.outboxId !== outboxRecord.outboxId
    ) {
      throw new Error(
        "Stored outbox and action relationship is invalid.",
      );
    }

    if (
      !Number.isSafeInteger(outboxRecord.version) ||
      outboxRecord.version < 0
    ) {
      throw new Error("Stored outbox version is invalid.");
    }

    if (
      !Number.isSafeInteger(outboxRecord.deliveryAttemptCount) ||
      outboxRecord.deliveryAttemptCount < 0
    ) {
      throw new Error("Stored outbox attempt count is invalid.");
    }

    if (
      !Number.isSafeInteger(outboxRecord.maxDeliveryAttempts) ||
      outboxRecord.maxDeliveryAttempts < 1
    ) {
      throw new Error("Stored outbox maximum attempts is invalid.");
    }

    if (
      !Number.isSafeInteger(outboxRecord.leaseFence) ||
      outboxRecord.leaseFence < 0
    ) {
      throw new Error("Stored outbox lease fence is invalid.");
    }

    parseTimestamp(
      outboxRecord.nextAttemptAt,
      "Stored outbox nextAttemptAt",
    );
    parseTimestamp(outboxRecord.createdAt, "Stored outbox createdAt");
    parseTimestamp(outboxRecord.updatedAt, "Stored outbox updatedAt");

    if (outboxRecord.leaseExpiresAt) {
      parseTimestamp(
        outboxRecord.leaseExpiresAt,
        "Stored outbox leaseExpiresAt",
      );
    }

    if (outboxRecord.deliveredAt) {
      parseTimestamp(
        outboxRecord.deliveredAt,
        "Stored outbox deliveredAt",
      );
    }
  }
}

function appendAudit(
  state: PersistentControlledActionState,
  input: Omit<
    IntegratedAuditEvent,
    "sequence" | "previousHash" | "hash"
  >,
): IntegratedAuditEvent {
  if (state.audit.some((event) => event.auditId === input.auditId)) {
    throw new Error(`Audit ID already exists: ${input.auditId}`);
  }

  const previousHash =
    state.audit.length > 0
      ? state.audit[state.audit.length - 1].hash
      : "";

  const unsignedEvent: Omit<IntegratedAuditEvent, "hash"> = {
    sequence: state.audit.length + 1,
    auditId: input.auditId,
    tenantId: input.tenantId,
    actionId: input.actionId,
    outboxId: input.outboxId,
    eventType: input.eventType,
    occurredAt: input.occurredAt,
    previousHash,
    details: input.details,
  };

  const event: IntegratedAuditEvent = {
    ...unsignedEvent,
    hash: hashAuditEvent(unsignedEvent),
  };

  state.audit.push(event);
  return event;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function sleep(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class PersistentControlledActionVerticalSlice {
  private readonly backupPath: string;
  private readonly lockPath: string;

  constructor(private readonly statePath: string) {
    requireNonEmpty(statePath, "Persistent state path");
    this.backupPath = `${statePath}.bak`;
    this.lockPath = `${statePath}.lock`;
  }

  async readSnapshot(): Promise<PersistentControlledActionState> {
    const state = await this.readStateInternal();
    validateState(state);
    return clone(state);
  }

  async createAction(
    request: CreateIntegratedActionRequest,
  ): Promise<IntegratedControlledAction> {
    const actionId = requireNonEmpty(request.actionId, "Action actionId");
    const tenantId = requireNonEmpty(request.tenantId, "Action tenantId");
    const idempotencyKey = requireNonEmpty(
      request.idempotencyKey,
      "Action idempotencyKey",
    );
    const effectType = requireNonEmpty(
      request.effectType,
      "Action effectType",
    );
    const payloadDigest = requireNonEmpty(
      request.payloadDigest,
      "Action payloadDigest",
    );
    const auditId = requireNonEmpty(request.auditId, "Action auditId");

    parseTimestamp(request.now, "Action now");

    return this.transact((state) => {
      const existingById = state.actions[actionId];

      const existingByIdempotency = Object.values(state.actions).find(
        (action) =>
          action.tenantId === tenantId &&
          action.idempotencyKey === idempotencyKey,
      );

      const existing = existingById ?? existingByIdempotency;

      if (existing) {
        if (
          existing.actionId === actionId &&
          existing.tenantId === tenantId &&
          existing.idempotencyKey === idempotencyKey &&
          existing.effectType === effectType &&
          existing.payloadDigest === payloadDigest
        ) {
          return {
            changed: false,
            value: existing,
          };
        }

        throw new Error(
          "Controlled action identity or idempotency conflict.",
        );
      }

      const action: IntegratedControlledAction = {
        actionId,
        tenantId,
        idempotencyKey,
        effectType,
        payloadDigest,
        status: "pending",
        version: 0,
        ownerAuthorizationId: null,
        dispatchToken: null,
        outboxId: null,
        leaseOwner: null,
        leaseFence: 0,
        leaseExpiresAt: null,
        terminalCommitToken: null,
        resultDigest: null,
        terminalReasonCode: null,
        createdAt: request.now,
        updatedAt: request.now,
        terminalAt: null,
      };

      state.actions[actionId] = action;

      appendAudit(state, {
        auditId,
        tenantId,
        actionId,
        outboxId: null,
        eventType: "CONTROLLED_ACTION_CREATED",
        occurredAt: request.now,
        details: {
          idempotencyKey,
          effectType,
          payloadDigest,
        },
      });

      return {
        changed: true,
        value: action,
      };
    });
  }

  async authorizeAction(
    request: AuthorizeIntegratedActionRequest,
  ): Promise<IntegratedControlledAction> {
    const actionId = requireNonEmpty(
      request.actionId,
      "Authorization actionId",
    );
    const tenantId = requireNonEmpty(
      request.tenantId,
      "Authorization tenantId",
    );
    const ownerAuthorizationId = requireNonEmpty(
      request.ownerAuthorizationId,
      "Owner authorization ID",
    );
    const auditId = requireNonEmpty(
      request.auditId,
      "Authorization auditId",
    );

    parseTimestamp(request.now, "Authorization now");

    return this.transact((state) => {
      if (state.killSwitch.engaged) {
        throw new Error(
          "Operational kill switch is engaged. Authorization denied.",
        );
      }

      const action = state.actions[actionId];

      if (!action) {
        throw new Error("Controlled action not found.");
      }

      if (action.tenantId !== tenantId) {
        throw new Error("Controlled action tenant mismatch.");
      }

      if (action.ownerAuthorizationId) {
        if (action.ownerAuthorizationId === ownerAuthorizationId) {
          return {
            changed: false,
            value: action,
          };
        }

        throw new Error("Conflicting owner authorization detected.");
      }

      if (action.status !== "pending") {
        throw new Error(
          "Only pending controlled actions can be authorized.",
        );
      }

      action.ownerAuthorizationId = ownerAuthorizationId;
      action.status = "authorized";
      action.version += 1;
      action.updatedAt = request.now;

      appendAudit(state, {
        auditId,
        tenantId,
        actionId,
        outboxId: null,
        eventType: "CONTROLLED_ACTION_AUTHORIZED",
        occurredAt: request.now,
        details: {
          ownerAuthorizationId,
          committedVersion: action.version,
        },
      });

      return {
        changed: true,
        value: action,
      };
    });
  }

  async enqueueAction(
    request: EnqueueIntegratedActionRequest,
  ): Promise<IntegratedDispatchOutboxRecord> {
    const actionId = requireNonEmpty(
      request.actionId,
      "Dispatch actionId",
    );
    const tenantId = requireNonEmpty(
      request.tenantId,
      "Dispatch tenantId",
    );
    const outboxId = requireNonEmpty(
      request.outboxId,
      "Dispatch outboxId",
    );
    const dispatchToken = requireNonEmpty(
      request.dispatchToken,
      "Dispatch token",
    );
    const auditId = requireNonEmpty(
      request.auditId,
      "Dispatch auditId",
    );

    parseTimestamp(request.now, "Dispatch now");

    if (
      !Number.isSafeInteger(request.maxDeliveryAttempts) ||
      request.maxDeliveryAttempts < 1
    ) {
      throw new Error(
        "Dispatch maxDeliveryAttempts must be a positive safe integer.",
      );
    }

    return this.transact((state) => {
      if (state.killSwitch.engaged) {
        throw new Error(
          "Operational kill switch is engaged. Dispatch denied.",
        );
      }

      const action = state.actions[actionId];

      if (!action) {
        throw new Error("Controlled action not found.");
      }

      if (action.tenantId !== tenantId) {
        throw new Error("Controlled action tenant mismatch.");
      }

      if (
        action.outboxId === outboxId &&
        action.dispatchToken === dispatchToken
      ) {
        const existingOutbox = state.outbox[outboxId];

        if (!existingOutbox) {
          throw new Error(
            "Controlled action replay references a missing outbox.",
          );
        }

        return {
          changed: false,
          value: existingOutbox,
        };
      }

      if (!action.ownerAuthorizationId) {
        throw new Error(
          "Owner authorization is required before dispatch.",
        );
      }

      if (action.status !== "authorized") {
        throw new Error(
          "Only authorized controlled actions can be dispatched.",
        );
      }

      if (state.outbox[outboxId]) {
        throw new Error("Dispatch outbox ID conflict.");
      }

      const outboxRecord: IntegratedDispatchOutboxRecord = {
        outboxId,
        tenantId,
        actionId,
        idempotencyKey: action.idempotencyKey,
        dispatchToken,
        effectType: action.effectType,
        payloadDigest: action.payloadDigest,
        status: "pending",
        version: 0,
        deliveryAttemptCount: 0,
        maxDeliveryAttempts: request.maxDeliveryAttempts,
        nextAttemptAt: request.now,
        leaseOwner: null,
        leaseFence: 0,
        leaseExpiresAt: null,
        lastClaimToken: null,
        createdAt: request.now,
        updatedAt: request.now,
        deliveredAt: null,
      };

      action.status = "dispatch_pending";
      action.version += 1;
      action.dispatchToken = dispatchToken;
      action.outboxId = outboxId;
      action.updatedAt = request.now;

      state.outbox[outboxId] = outboxRecord;

      appendAudit(state, {
        auditId,
        tenantId,
        actionId,
        outboxId,
        eventType: "CONTROLLED_ACTION_DISPATCH_ENQUEUED",
        occurredAt: request.now,
        details: {
          dispatchToken,
          effectType: action.effectType,
          payloadDigest: action.payloadDigest,
          actionVersion: action.version,
        },
      });

      return {
        changed: true,
        value: outboxRecord,
      };
    });
  }

  async claimOutbox(
    request: ClaimIntegratedOutboxRequest,
  ): Promise<IntegratedDispatchOutboxRecord> {
    const outboxId = requireNonEmpty(
      request.outboxId,
      "Claim outboxId",
    );
    const tenantId = requireNonEmpty(
      request.tenantId,
      "Claim tenantId",
    );
    const workerId = requireNonEmpty(
      request.workerId,
      "Claim workerId",
    );
    const claimToken = requireNonEmpty(
      request.claimToken,
      "Claim token",
    );
    const auditId = requireNonEmpty(
      request.auditId,
      "Claim auditId",
    );

    const now = parseTimestamp(request.now, "Claim now");

    if (
      !Number.isSafeInteger(request.leaseDurationMs) ||
      request.leaseDurationMs < 1 ||
      request.leaseDurationMs > MAX_LEASE_DURATION_MS
    ) {
      throw new Error(
        `Claim leaseDurationMs must be between 1 and ${MAX_LEASE_DURATION_MS}.`,
      );
    }

    return this.transact((state) => {
      if (state.killSwitch.engaged) {
        throw new Error(
          "Operational kill switch is engaged. Worker claim denied.",
        );
      }

      const outboxRecord = state.outbox[outboxId];

      if (!outboxRecord) {
        throw new Error("Dispatch outbox record not found.");
      }

      if (outboxRecord.tenantId !== tenantId) {
        throw new Error("Dispatch outbox tenant mismatch.");
      }

      const action = state.actions[outboxRecord.actionId];

      if (!action || action.tenantId !== tenantId) {
        throw new Error(
          "Dispatch outbox action relationship is invalid.",
        );
      }

      if (
        outboxRecord.status === "delivering" &&
        outboxRecord.lastClaimToken === claimToken &&
        outboxRecord.leaseOwner === workerId
      ) {
        return {
          changed: false,
          value: outboxRecord,
        };
      }

      if (isTerminalOutboxStatus(outboxRecord.status)) {
        throw new Error(
          "Terminal dispatch outbox records cannot be claimed.",
        );
      }

      if (
        outboxRecord.deliveryAttemptCount >=
        outboxRecord.maxDeliveryAttempts
      ) {
        throw new Error("Dispatch delivery attempts are exhausted.");
      }

      if (outboxRecord.status === "delivering") {
        if (!outboxRecord.leaseExpiresAt) {
          throw new Error(
            "Delivering outbox record is missing lease expiry.",
          );
        }

        const leaseExpiresAt = parseTimestamp(
          outboxRecord.leaseExpiresAt,
          "Outbox leaseExpiresAt",
        );

        if (leaseExpiresAt > now) {
          throw new Error(
            "Dispatch outbox already has an active worker lease.",
          );
        }
      } else {
        const nextAttemptAt = parseTimestamp(
          outboxRecord.nextAttemptAt,
          "Outbox nextAttemptAt",
        );

        if (nextAttemptAt > now) {
          throw new Error("Dispatch outbox delivery is not due.");
        }
      }

      if (
        action.status !== "dispatch_pending" &&
        action.status !== "executing"
      ) {
        throw new Error(
          "Controlled action is not available for worker execution.",
        );
      }

      const nextFence = outboxRecord.leaseFence + 1;
      const leaseExpiresAt = new Date(
        now + request.leaseDurationMs,
      ).toISOString();

      outboxRecord.status = "delivering";
      outboxRecord.version += 1;
      outboxRecord.deliveryAttemptCount += 1;
      outboxRecord.leaseOwner = workerId;
      outboxRecord.leaseFence = nextFence;
      outboxRecord.leaseExpiresAt = leaseExpiresAt;
      outboxRecord.lastClaimToken = claimToken;
      outboxRecord.updatedAt = request.now;

      action.status = "executing";
      action.version += 1;
      action.leaseOwner = workerId;
      action.leaseFence = nextFence;
      action.leaseExpiresAt = leaseExpiresAt;
      action.updatedAt = request.now;

      appendAudit(state, {
        auditId,
        tenantId,
        actionId: action.actionId,
        outboxId,
        eventType: "DISPATCH_OUTBOX_CLAIMED",
        occurredAt: request.now,
        details: {
          workerId,
          claimToken,
          leaseFence: nextFence,
          leaseExpiresAt,
          deliveryAttemptCount:
            outboxRecord.deliveryAttemptCount,
        },
      });

      return {
        changed: true,
        value: outboxRecord,
      };
    });
  }

  async finalizeAction(
    request: FinalizeIntegratedActionRequest,
  ): Promise<IntegratedControlledAction> {
    const actionId = requireNonEmpty(
      request.actionId,
      "Finalization actionId",
    );
    const tenantId = requireNonEmpty(
      request.tenantId,
      "Finalization tenantId",
    );
    const workerId = requireNonEmpty(
      request.workerId,
      "Finalization workerId",
    );
    const terminalCommitToken = requireNonEmpty(
      request.terminalCommitToken,
      "Terminal commit token",
    );
    const auditId = requireNonEmpty(
      request.auditId,
      "Finalization auditId",
    );

    const now = parseTimestamp(request.now, "Finalization now");
    const normalizedResultDigest =
      request.resultDigest?.trim() || null;
    const normalizedReason =
      request.terminalReasonCode?.trim() || null;

    if (
      !Number.isSafeInteger(request.leaseFence) ||
      request.leaseFence < 1
    ) {
      throw new Error(
        "Finalization leaseFence must be a positive safe integer.",
      );
    }

    if (
      request.finalStatus === "succeeded" &&
      !normalizedResultDigest
    ) {
      throw new Error(
        "Successful finalization requires a result digest.",
      );
    }

    if (
      request.finalStatus !== "succeeded" &&
      !normalizedReason
    ) {
      throw new Error(
        "Failed or cancelled finalization requires a reason code.",
      );
    }

    return this.transact((state) => {
      const action = state.actions[actionId];

      if (!action) {
        throw new Error("Controlled action not found.");
      }

      if (action.tenantId !== tenantId) {
        throw new Error("Controlled action tenant mismatch.");
      }

      if (isTerminalActionStatus(action.status)) {
        if (
          action.terminalCommitToken === terminalCommitToken &&
          action.status === request.finalStatus &&
          action.resultDigest === normalizedResultDigest &&
          action.terminalReasonCode === normalizedReason
        ) {
          return {
            changed: false,
            value: action,
          };
        }

        throw new Error("Conflicting terminal action commit.");
      }

      if (state.killSwitch.engaged) {
        throw new Error(
          "Operational kill switch is engaged. Finalization denied.",
        );
      }

      if (action.status !== "executing") {
        throw new Error(
          "Only executing controlled actions can be finalized.",
        );
      }

      if (!action.outboxId) {
        throw new Error(
          "Executing controlled action is missing its outbox record.",
        );
      }

      const outboxRecord = state.outbox[action.outboxId];

      if (!outboxRecord) {
        throw new Error(
          "Executing controlled action outbox record is missing.",
        );
      }

      if (outboxRecord.status !== "delivering") {
        throw new Error(
          "Dispatch outbox is not in delivering state.",
        );
      }

      if (
        action.leaseOwner !== workerId ||
        outboxRecord.leaseOwner !== workerId
      ) {
        throw new Error("Finalization worker does not own the lease.");
      }

      if (
        action.leaseFence !== request.leaseFence ||
        outboxRecord.leaseFence !== request.leaseFence
      ) {
        throw new Error("Finalization lease fence mismatch.");
      }

      if (
        !action.leaseExpiresAt ||
        !outboxRecord.leaseExpiresAt
      ) {
        throw new Error("Finalization lease expiry is missing.");
      }

      if (
        parseTimestamp(
          action.leaseExpiresAt,
          "Action leaseExpiresAt",
        ) <= now ||
        parseTimestamp(
          outboxRecord.leaseExpiresAt,
          "Outbox leaseExpiresAt",
        ) <= now
      ) {
        throw new Error("Finalization lease has expired.");
      }

      action.status = request.finalStatus;
      action.version += 1;
      action.leaseOwner = null;
      action.leaseExpiresAt = null;
      action.terminalCommitToken = terminalCommitToken;
      action.resultDigest = normalizedResultDigest;
      action.terminalReasonCode = normalizedReason;
      action.updatedAt = request.now;
      action.terminalAt = request.now;

      outboxRecord.status =
        request.finalStatus === "succeeded"
          ? "delivered"
          : request.finalStatus === "failed"
            ? "dead_letter"
            : "cancelled";

      outboxRecord.version += 1;
      outboxRecord.leaseOwner = null;
      outboxRecord.leaseExpiresAt = null;
      outboxRecord.updatedAt = request.now;
      outboxRecord.deliveredAt =
        request.finalStatus === "succeeded"
          ? request.now
          : null;

      appendAudit(state, {
        auditId,
        tenantId,
        actionId,
        outboxId: outboxRecord.outboxId,
        eventType: "CONTROLLED_ACTION_FINALIZED",
        occurredAt: request.now,
        details: {
          finalStatus: request.finalStatus,
          workerId,
          leaseFence: request.leaseFence,
          terminalCommitToken,
          resultDigest: normalizedResultDigest,
          terminalReasonCode: normalizedReason,
          actionVersion: action.version,
          outboxVersion: outboxRecord.version,
        },
      });

      return {
        changed: true,
        value: action,
      };
    });
  }

  async setKillSwitch(
    request: SetIntegratedKillSwitchRequest,
  ): Promise<PersistentControlledActionState["killSwitch"]> {
    const auditId = requireNonEmpty(
      request.auditId,
      "Kill switch auditId",
    );
    const normalizedReason = request.reason?.trim() || null;

    parseTimestamp(request.now, "Kill switch now");

    if (request.engaged && !normalizedReason) {
      throw new Error(
        "Engaging the operational kill switch requires a reason.",
      );
    }

    return this.transact((state) => {
      if (
        state.killSwitch.engaged === request.engaged &&
        state.killSwitch.reason === normalizedReason
      ) {
        return {
          changed: false,
          value: state.killSwitch,
        };
      }

      let blockedActionCount = 0;
      let cancelledOutboxCount = 0;

      state.killSwitch = {
        engaged: request.engaged,
        reason: normalizedReason,
        updatedAt: request.now,
      };

      if (request.engaged) {
        for (const action of Object.values(state.actions)) {
          if (!isTerminalActionStatus(action.status)) {
            action.status = "blocked";
            action.version += 1;
            action.leaseOwner = null;
            action.leaseExpiresAt = null;
            action.terminalReasonCode =
              "OPERATIONAL_KILL_SWITCH_ENGAGED";
            action.updatedAt = request.now;
            action.terminalAt = request.now;
            blockedActionCount += 1;
          }
        }

        for (const outboxRecord of Object.values(state.outbox)) {
          if (!isTerminalOutboxStatus(outboxRecord.status)) {
            outboxRecord.status = "cancelled";
            outboxRecord.version += 1;
            outboxRecord.leaseOwner = null;
            outboxRecord.leaseExpiresAt = null;
            outboxRecord.updatedAt = request.now;
            cancelledOutboxCount += 1;
          }
        }
      }

      appendAudit(state, {
        auditId,
        tenantId: "__system__",
        actionId: null,
        outboxId: null,
        eventType: "OPERATIONAL_KILL_SWITCH_CHANGED",
        occurredAt: request.now,
        details: {
          engaged: request.engaged,
          reason: normalizedReason,
          blockedActionCount,
          cancelledOutboxCount,
        },
      });

      return {
        changed: true,
        value: state.killSwitch,
      };
    });
  }

  private async transact<T>(
    mutator: (
      state: PersistentControlledActionState,
    ) => TransactionResult<T>,
  ): Promise<T> {
    const releaseLock = await this.acquireLock();

    try {
      const currentState = await this.readStateInternal();
      validateState(currentState);

      const workingState = clone(currentState);
      const result = mutator(workingState);

      if (!result.changed) {
        return clone(result.value);
      }

      workingState.revision = currentState.revision + 1;
      validateState(workingState);
      await this.persistState(workingState);

      return clone(result.value);
    } finally {
      await releaseLock();
    }
  }

  private async acquireLock(): Promise<() => Promise<void>> {
    await mkdir(dirname(this.statePath), { recursive: true });

    const startedAt = Date.now();

    while (true) {
      try {
        const lockHandle = await open(this.lockPath, "wx");

        await lockHandle.writeFile(
          JSON.stringify({
            owner: randomUUID(),
            createdAt: new Date().toISOString(),
          }),
          "utf8",
        );

        await lockHandle.sync();

        return async () => {
          await lockHandle.close();
          await rm(this.lockPath, { force: true });
        };
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;

        if (code !== "EEXIST") {
          throw error;
        }

        try {
          const lockStat = await stat(this.lockPath);

          if (Date.now() - lockStat.mtimeMs > STALE_LOCK_MS) {
            await rm(this.lockPath, { force: true });
            continue;
          }
        } catch (lockStatError) {
          const lockStatCode = (
            lockStatError as NodeJS.ErrnoException
          ).code;

          if (lockStatCode !== "ENOENT") {
            throw lockStatError;
          }

          continue;
        }

        if (Date.now() - startedAt >= LOCK_WAIT_TIMEOUT_MS) {
          throw new Error(
            "Timed out waiting for the persistent state lock.",
          );
        }

        await sleep(10);
      }
    }
  }

  private async readStateInternal(): Promise<PersistentControlledActionState> {
    let selectedPath: string | null = null;

    if (await pathExists(this.statePath)) {
      selectedPath = this.statePath;
    } else if (await pathExists(this.backupPath)) {
      selectedPath = this.backupPath;
    }

    if (!selectedPath) {
      return createInitialState();
    }

    const rawState = await readFile(selectedPath, "utf8");
    const parsedState = JSON.parse(
      rawState,
    ) as PersistentControlledActionState;

    validateState(parsedState);
    return parsedState;
  }

  private async persistState(
    state: PersistentControlledActionState,
  ): Promise<void> {
    await mkdir(dirname(this.statePath), { recursive: true });

    const temporaryPath =
      `${this.statePath}.${randomUUID()}.tmp`;

    const serializedState =
      `${JSON.stringify(state, null, 2)}\n`;

    const temporaryHandle = await open(temporaryPath, "wx");

    try {
      await temporaryHandle.writeFile(serializedState, "utf8");
      await temporaryHandle.sync();
    } finally {
      await temporaryHandle.close();
    }

    await rm(this.backupPath, { force: true });

    if (await pathExists(this.statePath)) {
      await rename(this.statePath, this.backupPath);
    }

    try {
      await rename(temporaryPath, this.statePath);
      await rm(this.backupPath, { force: true });
    } catch (error) {
      if (
        !(await pathExists(this.statePath)) &&
        (await pathExists(this.backupPath))
      ) {
        await rename(this.backupPath, this.statePath);
      }

      await rm(temporaryPath, { force: true });
      throw error;
    }
  }
}
