import type { TenantScopedSql } from "./postgresTenantTransaction";

export interface ClaimSandboxOutboxBatchInput {
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly leaseSeconds: number;
  readonly batchSize: number;
}

export interface ClaimedSandboxOutboxRecord {
  readonly tenantId: string;
  readonly outboxId: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly actionKind: string;
  readonly idempotencyKey: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly attemptCount: number;
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly leaseExpiresAt: string;
}

export interface RecoverExpiredSandboxOutboxResult {
  readonly tenantId: string;
  readonly recoveredCount: number;
}

interface ClaimedSandboxOutboxDatabaseRow
  extends Record<string, unknown> {
  readonly tenant_id: string;
  readonly outbox_id: string;
  readonly aggregate_type: string;
  readonly aggregate_id: string;
  readonly action_kind: string;
  readonly idempotency_key: string;
  readonly payload: unknown;
  readonly attempt_count: number | string;
  readonly lease_owner: string;
  readonly lease_token: string;
  readonly lease_expires_at: string | Date;
}

interface RecoveredCountDatabaseRow
  extends Record<string, unknown> {
  readonly recovered_count: number | string;
}

export class SandboxOutboxLeaseValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxLeaseValidationError";
  }
}

export class SandboxOutboxLeasePersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxLeasePersistenceError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requireTenantSql(sql: TenantScopedSql): TenantScopedSql {
  if (
    !sql ||
    typeof sql.query !== "function" ||
    !sql.context ||
    typeof sql.context.tenantId !== "string"
  ) {
    throw new SandboxOutboxLeaseValidationError(
      "A verified tenant-scoped PostgreSQL transaction is required.",
    );
  }

  return sql;
}

function requireUuid(value: string, fieldName: string): string {
  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new SandboxOutboxLeaseValidationError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized;
}

function requireLeaseOwner(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 1 || normalized.length > 128) {
    throw new SandboxOutboxLeaseValidationError(
      "leaseOwner must contain between 1 and 128 characters.",
    );
  }

  if (/[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new SandboxOutboxLeaseValidationError(
      "leaseOwner must not contain control characters.",
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
    throw new SandboxOutboxLeaseValidationError(
      `${fieldName} must be an integer between ${minimum} and ${maximum}.`,
    );
  }

  return value;
}

function isPlainObject(
  value: unknown,
): value is Readonly<Record<string, unknown>> {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function normalizePayload(
  value: unknown,
): Readonly<Record<string, unknown>> {
  let normalizedValue = value;

  if (typeof normalizedValue === "string") {
    try {
      normalizedValue = JSON.parse(normalizedValue);
    } catch {
      throw new SandboxOutboxLeasePersistenceError(
        "Claimed sandbox outbox payload is not valid JSON.",
      );
    }
  }

  if (!isPlainObject(normalizedValue)) {
    throw new SandboxOutboxLeasePersistenceError(
      "Claimed sandbox outbox payload is not a JSON object.",
    );
  }

  return Object.freeze({ ...normalizedValue });
}

function requireNonNegativeInteger(
  value: number | string,
  fieldName: string,
): number {
  const normalized =
    typeof value === "number" ? value : Number(value);

  if (
    !Number.isSafeInteger(normalized) ||
    normalized < 0
  ) {
    throw new SandboxOutboxLeasePersistenceError(
      `${fieldName} returned by PostgreSQL is invalid.`,
    );
  }

  return normalized;
}

function requireIsoTimestamp(
  value: string | Date,
  fieldName: string,
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new SandboxOutboxLeasePersistenceError(
      `${fieldName} returned by PostgreSQL is invalid.`,
    );
  }

  return date.toISOString();
}

function mapClaimedRow(
  row: ClaimedSandboxOutboxDatabaseRow,
  expectedTenantId: string,
  expectedLeaseOwner: string,
  expectedLeaseToken: string,
): ClaimedSandboxOutboxRecord {
  if (row.tenant_id !== expectedTenantId) {
    throw new SandboxOutboxLeasePersistenceError(
      "Claimed sandbox outbox row crossed the verified tenant boundary.",
    );
  }

  if (
    row.lease_owner !== expectedLeaseOwner ||
    row.lease_token !== expectedLeaseToken
  ) {
    throw new SandboxOutboxLeasePersistenceError(
      "Claimed sandbox outbox lease identity did not match the request.",
    );
  }

  return Object.freeze({
    tenantId: row.tenant_id,
    outboxId: row.outbox_id,
    aggregateType: row.aggregate_type,
    aggregateId: row.aggregate_id,
    actionKind: row.action_kind,
    idempotencyKey: row.idempotency_key,
    payload: normalizePayload(row.payload),
    attemptCount: requireNonNegativeInteger(
      row.attempt_count,
      "attemptCount",
    ),
    leaseOwner: row.lease_owner,
    leaseToken: row.lease_token,
    leaseExpiresAt: requireIsoTimestamp(
      row.lease_expires_at,
      "leaseExpiresAt",
    ),
  });
}

/**
 * Atomically claims pending sandbox outbox work inside the caller's
 * verified tenant transaction.
 *
 * FOR UPDATE SKIP LOCKED prevents concurrent workers from claiming the
 * same rows. No provider or external delivery is executed here.
 */
export async function claimSandboxOutboxBatch(
  sqlInput: TenantScopedSql,
  input: ClaimSandboxOutboxBatchInput,
): Promise<readonly ClaimedSandboxOutboxRecord[]> {
  const sql = requireTenantSql(sqlInput);
  const tenantId = requireUuid(
    sql.context.tenantId,
    "tenantId",
  );
  const leaseOwner = requireLeaseOwner(input.leaseOwner);
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

  const claimed =
    await sql.query<ClaimedSandboxOutboxDatabaseRow>(
      `
        WITH candidates AS (
          SELECT
            tenant_id,
            outbox_id
          FROM nexus_sandbox_outbox
          WHERE tenant_id = $1::uuid
            AND status = 'pending'
            AND available_at <= now()
          ORDER BY
            available_at,
            created_at,
            outbox_id
          FOR UPDATE SKIP LOCKED
          LIMIT $2::integer
        )
        UPDATE nexus_sandbox_outbox AS outbox
        SET
          status = 'processing',
          attempt_count = outbox.attempt_count + 1,
          lease_owner = $3::text,
          lease_token = $4::uuid,
          lease_expires_at =
            now() + make_interval(secs => $5::integer),
          last_error_code = NULL
        FROM candidates
        WHERE outbox.tenant_id = candidates.tenant_id
          AND outbox.outbox_id = candidates.outbox_id
        RETURNING
          outbox.tenant_id,
          outbox.outbox_id,
          outbox.aggregate_type,
          outbox.aggregate_id,
          outbox.action_kind,
          outbox.idempotency_key,
          outbox.payload,
          outbox.attempt_count,
          outbox.lease_owner,
          outbox.lease_token,
          outbox.lease_expires_at
      `,
      [
        tenantId,
        batchSize,
        leaseOwner,
        leaseToken,
        leaseSeconds,
      ],
    );

  return Object.freeze(
    claimed.rows.map((row) =>
      mapClaimedRow(
        row,
        tenantId,
        leaseOwner,
        leaseToken,
      ),
    ),
  );
}

/**
 * Returns expired processing leases to pending state within the verified
 * tenant only. The expired lease identity is cleared before the work can
 * be claimed again.
 */
export async function recoverExpiredSandboxOutboxLeases(
  sqlInput: TenantScopedSql,
): Promise<RecoverExpiredSandboxOutboxResult> {
  const sql = requireTenantSql(sqlInput);
  const tenantId = requireUuid(
    sql.context.tenantId,
    "tenantId",
  );

  const result =
    await sql.query<RecoveredCountDatabaseRow>(
      `
        WITH recovered AS (
          UPDATE nexus_sandbox_outbox
          SET
            status = 'pending',
            lease_owner = NULL,
            lease_token = NULL,
            lease_expires_at = NULL,
            available_at = now(),
            last_error_code = 'lease_expired'
          WHERE tenant_id = $1::uuid
            AND status = 'processing'
            AND lease_expires_at IS NOT NULL
            AND lease_expires_at <= now()
          RETURNING outbox_id
        )
        SELECT count(*)::text AS recovered_count
        FROM recovered
      `,
      [tenantId],
    );

  const row = result.rows[0];

  if (!row) {
    throw new SandboxOutboxLeasePersistenceError(
      "PostgreSQL did not return the expired lease recovery count.",
    );
  }

  return Object.freeze({
    tenantId,
    recoveredCount: requireNonNegativeInteger(
      row.recovered_count,
      "recoveredCount",
    ),
  });
}
