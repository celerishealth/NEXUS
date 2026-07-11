import type { TenantScopedSql } from "./postgresTenantTransaction";

export interface EnqueueSandboxOutboxInput {
  readonly outboxId: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly actionKind: string;
  readonly idempotencyKey: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface SandboxOutboxRecord {
  readonly tenantId: string;
  readonly outboxId: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly actionKind: string;
  readonly idempotencyKey: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled";
  readonly createdAt: string;
  readonly inserted: boolean;
}

interface SandboxOutboxDatabaseRow extends Record<string, unknown> {
  readonly tenant_id: string;
  readonly outbox_id: string;
  readonly aggregate_type: string;
  readonly aggregate_id: string;
  readonly action_kind: string;
  readonly idempotency_key: string;
  readonly payload: unknown;
  readonly payload_canonical: string;
  readonly status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled";
  readonly created_at: string | Date;
}

export class SandboxOutboxValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxValidationError";
  }
}

export class SandboxOutboxPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxPersistenceError";
  }
}

export class SandboxOutboxIdempotencyConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxIdempotencyConflictError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SAFE_KIND_PATTERN = /^[a-z0-9._-]+$/;

function requireUuid(value: string, fieldName: string): string {
  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new SandboxOutboxValidationError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized;
}

function requireSafeKind(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > 64 ||
    !SAFE_KIND_PATTERN.test(normalized)
  ) {
    throw new SandboxOutboxValidationError(
      `${fieldName} must contain 1-64 lowercase safe identifier characters.`,
    );
  }

  return normalized;
}

function requireIdempotencyKey(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 1 || normalized.length > 128) {
    throw new SandboxOutboxValidationError(
      "idempotencyKey must contain between 1 and 128 characters.",
    );
  }

  if (/[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new SandboxOutboxValidationError(
      "idempotencyKey must not contain control characters.",
    );
  }

  return normalized;
}

function isPlainObject(
  value: unknown,
): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function stableSerialize(
  value: unknown,
  seen: Set<object> = new Set<object>(),
): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new SandboxOutboxValidationError(
        "payload must not contain non-finite numbers.",
      );
    }

    return JSON.stringify(value);
  }

  if (
    typeof value === "undefined" ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    throw new SandboxOutboxValidationError(
      "payload contains an unsupported value.",
    );
  }

  if (typeof value !== "object") {
    throw new SandboxOutboxValidationError(
      "payload contains an unsupported value.",
    );
  }

  if (seen.has(value)) {
    throw new SandboxOutboxValidationError(
      "payload must not contain circular references.",
    );
  }

  seen.add(value);

  try {
    if (Array.isArray(value)) {
      return `[${value
        .map((item) => stableSerialize(item, seen))
        .join(",")}]`;
    }

    if (!isPlainObject(value)) {
      throw new SandboxOutboxValidationError(
        "payload must contain only plain JSON objects.",
      );
    }

    const entries = Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableSerialize(value[key], seen)}`,
      );

    return `{${entries.join(",")}}`;
  } finally {
    seen.delete(value);
  }
}

function requirePayload(
  payload: Readonly<Record<string, unknown>>,
): {
  readonly canonical: string;
  readonly json: string;
} {
  if (!isPlainObject(payload)) {
    throw new SandboxOutboxValidationError(
      "payload must be a plain JSON object.",
    );
  }

  const canonical = stableSerialize(payload);

  return Object.freeze({
    canonical,
    json: canonical,
  });
}

function normalizeDatabasePayload(
  value: unknown,
): Readonly<Record<string, unknown>> {
  let normalizedValue = value;

  if (typeof normalizedValue === "string") {
    try {
      normalizedValue = JSON.parse(normalizedValue);
    } catch {
      throw new SandboxOutboxPersistenceError(
        "Stored sandbox outbox payload is not valid JSON.",
      );
    }
  }

  if (!isPlainObject(normalizedValue)) {
    throw new SandboxOutboxPersistenceError(
      "Stored sandbox outbox payload is not a JSON object.",
    );
  }

  return normalizedValue;
}

function toIsoString(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new SandboxOutboxPersistenceError(
      "Stored sandbox outbox timestamp is invalid.",
    );
  }

  return date.toISOString();
}

function mapDatabaseRow(
  row: SandboxOutboxDatabaseRow,
  inserted: boolean,
): SandboxOutboxRecord {
  return Object.freeze({
    tenantId: row.tenant_id,
    outboxId: row.outbox_id,
    aggregateType: row.aggregate_type,
    aggregateId: row.aggregate_id,
    actionKind: row.action_kind,
    idempotencyKey: row.idempotency_key,
    payload: normalizeDatabasePayload(row.payload),
    status: row.status,
    createdAt: toIsoString(row.created_at),
    inserted,
  });
}

function verifyExistingIntent(
  row: SandboxOutboxDatabaseRow,
  expected: {
    readonly tenantId: string;
    readonly aggregateType: string;
    readonly aggregateId: string;
    readonly actionKind: string;
    readonly idempotencyKey: string;
    readonly payloadCanonical: string;
  },
): void {
  if (
    row.tenant_id !== expected.tenantId ||
    row.aggregate_type !== expected.aggregateType ||
    row.aggregate_id !== expected.aggregateId ||
    row.action_kind !== expected.actionKind ||
    row.idempotency_key !== expected.idempotencyKey ||
    row.payload_canonical !== expected.payloadCanonical
  ) {
    throw new SandboxOutboxIdempotencyConflictError(
      "The idempotency key already belongs to a different sandbox outbox intent.",
    );
  }
}

/**
 * Persists a sandbox-only execution intent inside the caller's existing
 * PostgreSQL tenant transaction.
 *
 * This function does not execute a provider, deliver a message, charge a
 * payment method, or authorize public launch.
 */
export async function enqueueTransactionalSandboxOutbox(
  sql: TenantScopedSql,
  input: EnqueueSandboxOutboxInput,
): Promise<SandboxOutboxRecord> {
  if (!sql || typeof sql.query !== "function" || !sql.context) {
    throw new SandboxOutboxValidationError(
      "A verified tenant-scoped PostgreSQL transaction is required.",
    );
  }

  const tenantId = requireUuid(sql.context.tenantId, "tenantId");
  const outboxId = requireUuid(input.outboxId, "outboxId");
  const aggregateType = requireSafeKind(
    input.aggregateType,
    "aggregateType",
  );
  const aggregateId = requireUuid(input.aggregateId, "aggregateId");
  const actionKind = requireSafeKind(input.actionKind, "actionKind");
  const idempotencyKey = requireIdempotencyKey(input.idempotencyKey);
  const payload = requirePayload(input.payload);

  const inserted = await sql.query<SandboxOutboxDatabaseRow>(
    `
      INSERT INTO nexus_sandbox_outbox (
        tenant_id,
        outbox_id,
        aggregate_type,
        aggregate_id,
        action_kind,
        payload,
        payload_canonical,
        idempotency_key,
        status
      )
      VALUES (
        $1::uuid,
        $2::uuid,
        $3::text,
        $4::uuid,
        $5::text,
        $6::jsonb,
        $7::text,
        $8::text,
        'pending'
      )
      ON CONFLICT (tenant_id, idempotency_key)
      DO NOTHING
      RETURNING
        tenant_id,
        outbox_id,
        aggregate_type,
        aggregate_id,
        action_kind,
        idempotency_key,
        payload,
        payload_canonical,
        status,
        created_at
    `,
    [
      tenantId,
      outboxId,
      aggregateType,
      aggregateId,
      actionKind,
      payload.json,
      payload.canonical,
      idempotencyKey,
    ],
  );

  const insertedRow = inserted.rows[0];

  if (insertedRow) {
    return mapDatabaseRow(insertedRow, true);
  }

  const existing = await sql.query<SandboxOutboxDatabaseRow>(
    `
      SELECT
        tenant_id,
        outbox_id,
        aggregate_type,
        aggregate_id,
        action_kind,
        idempotency_key,
        payload,
        payload_canonical,
        status,
        created_at
      FROM nexus_sandbox_outbox
      WHERE tenant_id = $1::uuid
        AND idempotency_key = $2::text
      LIMIT 1
    `,
    [tenantId, idempotencyKey],
  );

  const existingRow = existing.rows[0];

  if (!existingRow) {
    throw new SandboxOutboxPersistenceError(
      "Sandbox outbox conflict occurred but the existing intent was not visible.",
    );
  }

  verifyExistingIntent(existingRow, {
    tenantId,
    aggregateType,
    aggregateId,
    actionKind,
    idempotencyKey,
    payloadCanonical: payload.canonical,
  });

  return mapDatabaseRow(existingRow, false);
}
