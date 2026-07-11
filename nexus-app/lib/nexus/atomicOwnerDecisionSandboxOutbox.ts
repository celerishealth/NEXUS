import {
  withPostgreSqlTenantTransaction,
  type PostgreSqlConnectionPool,
  type TenantScopedSql,
  type TenantTransactionContext,
} from "./postgresTenantTransaction";

import {
  enqueueTransactionalSandboxOutbox,
  type SandboxOutboxRecord,
} from "./transactionalSandboxOutbox";

export interface AtomicApprovedOwnerDecisionInput {
  readonly decisionId: string;
  readonly inquiryId: string;
  readonly ownerId: string;
  readonly expectedVersion: number;
  readonly outboxId: string;
  readonly actionKind: string;
  readonly idempotencyKey: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NormalizedApprovedOwnerDecisionInput {
  readonly decisionId: string;
  readonly inquiryId: string;
  readonly ownerId: string;
  readonly expectedVersion: number;
}

export interface PersistedApprovedOwnerDecision {
  readonly tenantId: string;
  readonly decisionId: string;
  readonly inquiryId: string;
  readonly ownerId: string;
  readonly status: "approved";
  readonly version: number;
  readonly auditRecordId: string;
}

export interface AtomicApprovedOwnerDecisionResult {
  readonly tenantId: string;
  readonly inquiryId: string;
  readonly decisionId: string;
  readonly ownerId: string;
  readonly decisionVersion: number;
  readonly auditRecordId: string;
  readonly outbox: SandboxOutboxRecord;
}

export type PersistApprovedOwnerDecision = (
  sql: TenantScopedSql,
  input: NormalizedApprovedOwnerDecisionInput,
) => Promise<PersistedApprovedOwnerDecision>;

export class AtomicOwnerDecisionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtomicOwnerDecisionValidationError";
  }
}

export class AtomicOwnerDecisionAuthorityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtomicOwnerDecisionAuthorityError";
  }
}

export class AtomicOwnerDecisionPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtomicOwnerDecisionPersistenceError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SANDBOX_ACTION_PATTERN =
  /^sandbox\.[a-z0-9][a-z0-9._-]{0,119}$/;

const RESERVED_PAYLOAD_KEYS = new Set([
  "ownerDecisionId",
  "ownerAuditRecordId",
  "ownerDecisionVersion",
]);

function requireUuid(value: string, fieldName: string): string {
  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new AtomicOwnerDecisionValidationError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized;
}

function requireExpectedVersion(value: number): number {
  if (
    !Number.isSafeInteger(value) ||
    value < 0 ||
    value > 2_147_483_646
  ) {
    throw new AtomicOwnerDecisionValidationError(
      "expectedVersion must be a safe integer between 0 and 2147483646.",
    );
  }

  return value;
}

function requireActionKind(value: string): string {
  const normalized = value.trim();

  if (!SANDBOX_ACTION_PATTERN.test(normalized)) {
    throw new AtomicOwnerDecisionValidationError(
      "actionKind must be a sandbox-only action identifier.",
    );
  }

  return normalized;
}

function requireIdempotencyKey(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 1 || normalized.length > 128) {
    throw new AtomicOwnerDecisionValidationError(
      "idempotencyKey must contain between 1 and 128 characters.",
    );
  }

  if (/[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new AtomicOwnerDecisionValidationError(
      "idempotencyKey must not contain control characters.",
    );
  }

  return normalized;
}

function requirePlainPayload(
  value: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new AtomicOwnerDecisionValidationError(
      "payload must be a plain JSON object.",
    );
  }

  const prototype = Object.getPrototypeOf(value);

  if (
    prototype !== Object.prototype &&
    prototype !== null
  ) {
    throw new AtomicOwnerDecisionValidationError(
      "payload must be a plain JSON object.",
    );
  }

  for (const reservedKey of RESERVED_PAYLOAD_KEYS) {
    if (
      Object.prototype.hasOwnProperty.call(
        value,
        reservedKey,
      )
    ) {
      throw new AtomicOwnerDecisionValidationError(
        `payload must not define reserved key ${reservedKey}.`,
      );
    }
  }

  return value;
}

function requirePersistenceCallback(
  value: PersistApprovedOwnerDecision,
): PersistApprovedOwnerDecision {
  if (typeof value !== "function") {
    throw new AtomicOwnerDecisionValidationError(
      "An approved owner decision persistence operation is required.",
    );
  }

  return value;
}

function verifyPersistedDecision(
  decision: PersistedApprovedOwnerDecision,
  expected: {
    readonly tenantId: string;
    readonly decisionId: string;
    readonly inquiryId: string;
    readonly ownerId: string;
    readonly expectedVersion: number;
  },
): PersistedApprovedOwnerDecision {
  if (!decision || typeof decision !== "object") {
    throw new AtomicOwnerDecisionPersistenceError(
      "Owner decision persistence returned no decision.",
    );
  }

  if (decision.tenantId !== expected.tenantId) {
    throw new AtomicOwnerDecisionPersistenceError(
      "Persisted owner decision crossed the verified tenant boundary.",
    );
  }

  if (
    decision.decisionId !== expected.decisionId ||
    decision.inquiryId !== expected.inquiryId ||
    decision.ownerId !== expected.ownerId
  ) {
    throw new AtomicOwnerDecisionPersistenceError(
      "Persisted owner decision identity did not match the requested decision.",
    );
  }

  if (decision.status !== "approved") {
    throw new AtomicOwnerDecisionPersistenceError(
      "Only an explicitly approved owner decision may create a sandbox execution intent.",
    );
  }

  if (decision.version !== expected.expectedVersion + 1) {
    throw new AtomicOwnerDecisionPersistenceError(
      "Persisted owner decision version did not satisfy optimistic concurrency.",
    );
  }

  requireUuid(decision.auditRecordId, "auditRecordId");

  return decision;
}

function verifyOutboxBinding(
  outbox: SandboxOutboxRecord,
  expected: {
    readonly tenantId: string;
    readonly inquiryId: string;
    readonly actionKind: string;
    readonly idempotencyKey: string;
  },
): void {
  if (outbox.tenantId !== expected.tenantId) {
    throw new AtomicOwnerDecisionPersistenceError(
      "Sandbox outbox result crossed the verified tenant boundary.",
    );
  }

  if (
    outbox.aggregateType !== "customer_inquiry" ||
    outbox.aggregateId !== expected.inquiryId
  ) {
    throw new AtomicOwnerDecisionPersistenceError(
      "Sandbox outbox result was not bound to the approved customer inquiry.",
    );
  }

  if (
    outbox.actionKind !== expected.actionKind ||
    outbox.idempotencyKey !== expected.idempotencyKey
  ) {
    throw new AtomicOwnerDecisionPersistenceError(
      "Sandbox outbox action identity did not match the approved owner decision.",
    );
  }
}

/**
 * Persists an approved owner decision and its sandbox execution intent
 * inside one PostgreSQL transaction.
 *
 * Safety properties:
 * - The authenticated transaction actor must be the owner.
 * - Optimistic version advancement must be exact.
 * - A durable audit record must be returned by decision persistence.
 * - The outbox payload is bound to the exact decision, audit and version.
 * - Any decision, audit or outbox failure rolls back the entire unit.
 * - Only sandbox.* action kinds are accepted.
 * - No provider, delivery or payment execution occurs.
 */
export async function commitApprovedOwnerDecisionWithSandboxOutbox(
  pool: PostgreSqlConnectionPool,
  context: TenantTransactionContext,
  input: AtomicApprovedOwnerDecisionInput,
  persistApprovedDecisionInput: PersistApprovedOwnerDecision,
): Promise<AtomicApprovedOwnerDecisionResult> {
  const tenantId = requireUuid(
    context.tenantId,
    "tenantId",
  );
  const actorId = requireUuid(
    context.actorId,
    "actorId",
  );
  const decisionId = requireUuid(
    input.decisionId,
    "decisionId",
  );
  const inquiryId = requireUuid(
    input.inquiryId,
    "inquiryId",
  );
  const ownerId = requireUuid(
    input.ownerId,
    "ownerId",
  );
  const outboxId = requireUuid(
    input.outboxId,
    "outboxId",
  );
  const expectedVersion = requireExpectedVersion(
    input.expectedVersion,
  );
  const actionKind = requireActionKind(
    input.actionKind,
  );
  const idempotencyKey = requireIdempotencyKey(
    input.idempotencyKey,
  );
  const payload = requirePlainPayload(input.payload);
  const persistApprovedDecision =
    requirePersistenceCallback(
      persistApprovedDecisionInput,
    );

  if (actorId !== ownerId) {
    throw new AtomicOwnerDecisionAuthorityError(
      "The authenticated transaction actor is not the requested owner.",
    );
  }

  return withPostgreSqlTenantTransaction(
    pool,
    {
      tenantId,
      actorId,
      requestId: context.requestId,
    },
    async (sql) => {
      const decision = verifyPersistedDecision(
        await persistApprovedDecision(
          sql,
          Object.freeze({
            decisionId,
            inquiryId,
            ownerId,
            expectedVersion,
          }),
        ),
        {
          tenantId,
          decisionId,
          inquiryId,
          ownerId,
          expectedVersion,
        },
      );

      const outboxPayload = Object.freeze({
        ...payload,
        ownerDecisionId: decision.decisionId,
        ownerAuditRecordId: decision.auditRecordId,
        ownerDecisionVersion: decision.version,
      });

      const outbox =
        await enqueueTransactionalSandboxOutbox(
          sql,
          {
            outboxId,
            aggregateType: "customer_inquiry",
            aggregateId: inquiryId,
            actionKind,
            idempotencyKey,
            payload: outboxPayload,
          },
        );

      verifyOutboxBinding(outbox, {
        tenantId,
        inquiryId,
        actionKind,
        idempotencyKey,
      });

      return Object.freeze({
        tenantId,
        inquiryId,
        decisionId,
        ownerId,
        decisionVersion: decision.version,
        auditRecordId: decision.auditRecordId,
        outbox,
      });
    },
  );
}
