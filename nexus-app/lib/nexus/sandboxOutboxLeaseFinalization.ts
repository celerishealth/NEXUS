import type { TenantScopedSql } from "./postgresTenantTransaction";

export interface CompleteSandboxOutboxLeaseInput {
  readonly outboxId: string;
  readonly leaseOwner: string;
  readonly leaseToken: string;
}

export interface FailSandboxOutboxLeaseInput {
  readonly outboxId: string;
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly errorCode: string;
  readonly retryable: boolean;
  readonly retryDelaySeconds: number;
  readonly maxAttempts: number;
}

export interface SandboxOutboxFinalizationResult {
  readonly tenantId: string;
  readonly outboxId: string;
  readonly status: "pending" | "completed" | "failed";
  readonly attemptCount: number;
  readonly availableAt: string;
  readonly completedAt: string | null;
  readonly failedAt: string | null;
  readonly lastErrorCode: string | null;
}

interface SandboxOutboxFinalizationDatabaseRow
  extends Record<string, unknown> {
  readonly tenant_id: string;
  readonly outbox_id: string;
  readonly status: "pending" | "completed" | "failed";
  readonly attempt_count: number | string;
  readonly available_at: string | Date;
  readonly completed_at: string | Date | null;
  readonly failed_at: string | Date | null;
  readonly last_error_code: string | null;
}

export class SandboxOutboxFinalizationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxFinalizationValidationError";
  }
}

export class SandboxOutboxLeaseFenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxLeaseFenceError";
  }
}

export class SandboxOutboxFinalizationPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxOutboxFinalizationPersistenceError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ERROR_CODE_PATTERN = /^[a-z0-9._-]+$/;

function requireTenantSql(sql: TenantScopedSql): TenantScopedSql {
  if (
    !sql ||
    typeof sql.query !== "function" ||
    !sql.context ||
    typeof sql.context.tenantId !== "string"
  ) {
    throw new SandboxOutboxFinalizationValidationError(
      "A verified tenant-scoped PostgreSQL transaction is required.",
    );
  }

  return sql;
}

function requireUuid(value: string, fieldName: string): string {
  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new SandboxOutboxFinalizationValidationError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized;
}

function requireLeaseOwner(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 1 || normalized.length > 128) {
    throw new SandboxOutboxFinalizationValidationError(
      "leaseOwner must contain between 1 and 128 characters.",
    );
  }

  if (/[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new SandboxOutboxFinalizationValidationError(
      "leaseOwner must not contain control characters.",
    );
  }

  return normalized;
}

function requireErrorCode(value: string): string {
  const normalized = value.trim();

  if (
    normalized.length < 1 ||
    normalized.length > 128 ||
    !ERROR_CODE_PATTERN.test(normalized)
  ) {
    throw new SandboxOutboxFinalizationValidationError(
      "errorCode must contain 1-128 lowercase safe identifier characters.",
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
    throw new SandboxOutboxFinalizationValidationError(
      `${fieldName} must be an integer between ${minimum} and ${maximum}.`,
    );
  }

  return value;
}

function requireBoolean(
  value: boolean,
  fieldName: string,
): boolean {
  if (typeof value !== "boolean") {
    throw new SandboxOutboxFinalizationValidationError(
      `${fieldName} must be a boolean.`,
    );
  }

  return value;
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
    throw new SandboxOutboxFinalizationPersistenceError(
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
    throw new SandboxOutboxFinalizationPersistenceError(
      `${fieldName} returned by PostgreSQL is invalid.`,
    );
  }

  return date.toISOString();
}

function optionalIsoTimestamp(
  value: string | Date | null,
  fieldName: string,
): string | null {
  if (value === null) {
    return null;
  }

  return requireIsoTimestamp(value, fieldName);
}

function mapFinalizationRow(
  row: SandboxOutboxFinalizationDatabaseRow,
  expectedTenantId: string,
  expectedOutboxId: string,
): SandboxOutboxFinalizationResult {
  if (
    row.tenant_id !== expectedTenantId ||
    row.outbox_id !== expectedOutboxId
  ) {
    throw new SandboxOutboxFinalizationPersistenceError(
      "Sandbox outbox finalization crossed the verified tenant or outbox boundary.",
    );
  }

  if (
    row.status !== "pending" &&
    row.status !== "completed" &&
    row.status !== "failed"
  ) {
    throw new SandboxOutboxFinalizationPersistenceError(
      "PostgreSQL returned an invalid sandbox outbox finalization status.",
    );
  }

  const completedAt = optionalIsoTimestamp(
    row.completed_at,
    "completedAt",
  );

  const failedAt = optionalIsoTimestamp(
    row.failed_at,
    "failedAt",
  );

  if (row.status === "completed" && completedAt === null) {
    throw new SandboxOutboxFinalizationPersistenceError(
      "Completed sandbox outbox row is missing completedAt.",
    );
  }

  if (row.status !== "completed" && completedAt !== null) {
    throw new SandboxOutboxFinalizationPersistenceError(
      "Non-completed sandbox outbox row unexpectedly contains completedAt.",
    );
  }

  if (row.status === "failed" && failedAt === null) {
    throw new SandboxOutboxFinalizationPersistenceError(
      "Failed sandbox outbox row is missing failedAt.",
    );
  }

  if (row.status !== "failed" && failedAt !== null) {
    throw new SandboxOutboxFinalizationPersistenceError(
      "Non-failed sandbox outbox row unexpectedly contains failedAt.",
    );
  }

  return Object.freeze({
    tenantId: row.tenant_id,
    outboxId: row.outbox_id,
    status: row.status,
    attemptCount: requireNonNegativeInteger(
      row.attempt_count,
      "attemptCount",
    ),
    availableAt: requireIsoTimestamp(
      row.available_at,
      "availableAt",
    ),
    completedAt,
    failedAt,
    lastErrorCode: row.last_error_code,
  });
}

/**
 * Completes only the currently valid sandbox lease.
 *
 * Tenant identity is derived from the verified transaction. The lease
 * owner, token and unexpired lease form a fencing boundary that prevents
 * stale workers from completing recovered or reassigned work.
 */
export async function completeSandboxOutboxLease(
  sqlInput: TenantScopedSql,
  input: CompleteSandboxOutboxLeaseInput,
): Promise<SandboxOutboxFinalizationResult> {
  const sql = requireTenantSql(sqlInput);
  const tenantId = requireUuid(
    sql.context.tenantId,
    "tenantId",
  );
  const outboxId = requireUuid(input.outboxId, "outboxId");
  const leaseOwner = requireLeaseOwner(input.leaseOwner);
  const leaseToken = requireUuid(
    input.leaseToken,
    "leaseToken",
  );

  const result =
    await sql.query<SandboxOutboxFinalizationDatabaseRow>(
      `
        UPDATE nexus_sandbox_outbox
        SET
          status = 'completed',
          lease_owner = NULL,
          lease_token = NULL,
          lease_expires_at = NULL,
          completed_at = now(),
          failed_at = NULL,
          last_error_code = NULL
        WHERE tenant_id = $1::uuid
          AND outbox_id = $2::uuid
          AND status = 'processing'
          AND lease_owner = $3::text
          AND lease_token = $4::uuid
          AND lease_expires_at > now()
        RETURNING
          tenant_id,
          outbox_id,
          status,
          attempt_count,
          available_at,
          completed_at,
          failed_at,
          last_error_code
      `,
      [
        tenantId,
        outboxId,
        leaseOwner,
        leaseToken,
      ],
    );

  const row = result.rows[0];

  if (!row) {
    throw new SandboxOutboxLeaseFenceError(
      "Sandbox outbox completion was rejected because the lease is missing, expired, recovered or owned by another worker.",
    );
  }

  return mapFinalizationRow(row, tenantId, outboxId);
}

/**
 * Fails only the currently valid sandbox lease.
 *
 * Retryable work returns to pending only while attempt_count remains below
 * maxAttempts. Non-retryable or exhausted work becomes terminally failed.
 * This schedules sandbox work only; it does not execute any provider.
 */
export async function failSandboxOutboxLease(
  sqlInput: TenantScopedSql,
  input: FailSandboxOutboxLeaseInput,
): Promise<SandboxOutboxFinalizationResult> {
  const sql = requireTenantSql(sqlInput);
  const tenantId = requireUuid(
    sql.context.tenantId,
    "tenantId",
  );
  const outboxId = requireUuid(input.outboxId, "outboxId");
  const leaseOwner = requireLeaseOwner(input.leaseOwner);
  const leaseToken = requireUuid(
    input.leaseToken,
    "leaseToken",
  );
  const errorCode = requireErrorCode(input.errorCode);
  const retryable = requireBoolean(
    input.retryable,
    "retryable",
  );
  const retryDelaySeconds = requireIntegerInRange(
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

  const result =
    await sql.query<SandboxOutboxFinalizationDatabaseRow>(
      `
        UPDATE nexus_sandbox_outbox
        SET
          status = CASE
            WHEN $6::boolean
              AND attempt_count < $8::integer
            THEN 'pending'
            ELSE 'failed'
          END,
          lease_owner = NULL,
          lease_token = NULL,
          lease_expires_at = NULL,
          available_at = CASE
            WHEN $6::boolean
              AND attempt_count < $8::integer
            THEN now() + make_interval(secs => $7::integer)
            ELSE available_at
          END,
          completed_at = NULL,
          failed_at = CASE
            WHEN $6::boolean
              AND attempt_count < $8::integer
            THEN NULL
            ELSE now()
          END,
          last_error_code = $5::text
        WHERE tenant_id = $1::uuid
          AND outbox_id = $2::uuid
          AND status = 'processing'
          AND lease_owner = $3::text
          AND lease_token = $4::uuid
          AND lease_expires_at > now()
        RETURNING
          tenant_id,
          outbox_id,
          status,
          attempt_count,
          available_at,
          completed_at,
          failed_at,
          last_error_code
      `,
      [
        tenantId,
        outboxId,
        leaseOwner,
        leaseToken,
        errorCode,
        retryable,
        retryDelaySeconds,
        maxAttempts,
      ],
    );

  const row = result.rows[0];

  if (!row) {
    throw new SandboxOutboxLeaseFenceError(
      "Sandbox outbox failure transition was rejected because the lease is missing, expired, recovered or owned by another worker.",
    );
  }

  return mapFinalizationRow(row, tenantId, outboxId);
}
