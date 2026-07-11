import {
  withPostgreSqlTenantTransaction,
  type PostgreSqlConnectionPool,
  type TenantScopedSql,
  type TenantTransactionContext,
} from "./postgresTenantTransaction";

export interface CommitSandboxResultInput {
  readonly resultId: string;
  readonly outboxId: string;
  readonly actionKind: string;
  readonly leaseOwner: string;
  readonly leaseToken: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface AtomicSandboxResultCompletion {
  readonly tenantId: string;
  readonly resultId: string;
  readonly outboxId: string;
  readonly actionKind: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly completedAt: string;
  readonly replayed: boolean;
}

interface SandboxOutboxStateRow extends Record<string, unknown> {
  readonly tenant_id: string;
  readonly outbox_id: string;
  readonly action_kind: string;
  readonly status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled";
  readonly lease_owner: string | null;
  readonly lease_token: string | null;
  readonly lease_valid: boolean;
}

interface SandboxResultDatabaseRow extends Record<string, unknown> {
  readonly tenant_id: string;
  readonly result_id: string;
  readonly outbox_id: string;
  readonly action_kind: string;
  readonly payload: unknown;
  readonly payload_canonical: string;
  readonly created_at: string | Date;
}

interface CompletedOutboxDatabaseRow extends Record<string, unknown> {
  readonly tenant_id: string;
  readonly outbox_id: string;
  readonly status: "completed";
  readonly completed_at: string | Date;
}

export class AtomicSandboxResultValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtomicSandboxResultValidationError";
  }
}

export class AtomicSandboxResultLeaseFenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtomicSandboxResultLeaseFenceError";
  }
}

export class AtomicSandboxResultConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtomicSandboxResultConflictError";
  }
}

export class AtomicSandboxResultPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtomicSandboxResultPersistenceError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SANDBOX_ACTION_PATTERN =
  /^sandbox\.[a-z0-9][a-z0-9._-]{0,119}$/;

function requireContext(
  context: TenantTransactionContext,
): TenantTransactionContext {
  if (
    !context ||
    typeof context.tenantId !== "string" ||
    typeof context.actorId !== "string" ||
    typeof context.requestId !== "string"
  ) {
    throw new AtomicSandboxResultValidationError(
      "A complete PostgreSQL tenant transaction context is required.",
    );
  }

  return context;
}

function requireUuid(value: string, fieldName: string): string {
  const normalized = value.trim().toLowerCase();

  if (!UUID_PATTERN.test(normalized)) {
    throw new AtomicSandboxResultValidationError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized;
}

function requireActionKind(value: string): string {
  const normalized = value.trim();

  if (!SANDBOX_ACTION_PATTERN.test(normalized)) {
    throw new AtomicSandboxResultValidationError(
      "actionKind must be a sandbox-only action identifier.",
    );
  }

  return normalized;
}

function requireLeaseOwner(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 1 || normalized.length > 128) {
    throw new AtomicSandboxResultValidationError(
      "leaseOwner must contain between 1 and 128 characters.",
    );
  }

  if (/[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new AtomicSandboxResultValidationError(
      "leaseOwner must not contain control characters.",
    );
  }

  return normalized;
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
      throw new AtomicSandboxResultValidationError(
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
    throw new AtomicSandboxResultValidationError(
      "payload contains an unsupported value.",
    );
  }

  if (typeof value !== "object") {
    throw new AtomicSandboxResultValidationError(
      "payload contains an unsupported value.",
    );
  }

  if (seen.has(value)) {
    throw new AtomicSandboxResultValidationError(
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
      throw new AtomicSandboxResultValidationError(
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
  value: Readonly<Record<string, unknown>>,
): {
  readonly canonical: string;
  readonly json: string;
} {
  if (!isPlainObject(value)) {
    throw new AtomicSandboxResultValidationError(
      "payload must be a plain JSON object.",
    );
  }

  const canonical = stableSerialize(value);

  if (canonical.length < 2 || canonical.length > 65536) {
    throw new AtomicSandboxResultValidationError(
      "payload canonical representation must contain between 2 and 65536 characters.",
    );
  }

  return Object.freeze({
    canonical,
    json: canonical,
  });
}

function normalizeDatabasePayload(
  value: unknown,
): Readonly<Record<string, unknown>> {
  let normalized = value;

  if (typeof normalized === "string") {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      throw new AtomicSandboxResultPersistenceError(
        "Stored sandbox result payload is not valid JSON.",
      );
    }
  }

  if (!isPlainObject(normalized)) {
    throw new AtomicSandboxResultPersistenceError(
      "Stored sandbox result payload is not a JSON object.",
    );
  }

  return Object.freeze({ ...normalized });
}

function requireIsoTimestamp(
  value: string | Date,
  fieldName: string,
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AtomicSandboxResultPersistenceError(
      `${fieldName} returned by PostgreSQL is invalid.`,
    );
  }

  return date.toISOString();
}

function verifyOutboxIdentity(
  row: SandboxOutboxStateRow,
  expected: {
    readonly tenantId: string;
    readonly outboxId: string;
    readonly actionKind: string;
  },
): void {
  if (
    row.tenant_id !== expected.tenantId ||
    row.outbox_id !== expected.outboxId
  ) {
    throw new AtomicSandboxResultPersistenceError(
      "Sandbox outbox state crossed the verified tenant or outbox boundary.",
    );
  }

  if (row.action_kind !== expected.actionKind) {
    throw new AtomicSandboxResultConflictError(
      "Sandbox result action does not match the claimed outbox action.",
    );
  }
}

function verifyActiveLease(
  row: SandboxOutboxStateRow,
  expected: {
    readonly leaseOwner: string;
    readonly leaseToken: string;
  },
): void {
  if (
    row.status !== "processing" ||
    row.lease_owner !== expected.leaseOwner ||
    row.lease_token !== expected.leaseToken ||
    row.lease_valid !== true
  ) {
    throw new AtomicSandboxResultLeaseFenceError(
      "Sandbox result completion was rejected because the lease is missing, expired, recovered or owned by another worker.",
    );
  }
}

function verifyResultRow(
  row: SandboxResultDatabaseRow,
  expected: {
    readonly tenantId: string;
    readonly resultId: string;
    readonly outboxId: string;
    readonly actionKind: string;
    readonly payloadCanonical: string;
  },
): SandboxResultDatabaseRow {
  if (
    row.tenant_id !== expected.tenantId ||
    row.outbox_id !== expected.outboxId
  ) {
    throw new AtomicSandboxResultPersistenceError(
      "Stored sandbox result crossed the verified tenant or outbox boundary.",
    );
  }

  if (
    row.result_id !== expected.resultId ||
    row.action_kind !== expected.actionKind ||
    row.payload_canonical !== expected.payloadCanonical
  ) {
    throw new AtomicSandboxResultConflictError(
      "The sandbox outbox already belongs to a different result intent.",
    );
  }

  return row;
}

async function readExistingResult(
  sql: TenantScopedSql,
  tenantId: string,
  outboxId: string,
): Promise<SandboxResultDatabaseRow> {
  const existing =
    await sql.query<SandboxResultDatabaseRow>(
      `
        SELECT
          tenant_id,
          result_id,
          outbox_id,
          action_kind,
          payload,
          payload_canonical,
          created_at
        FROM nexus_sandbox_outbox_results
        WHERE tenant_id = $1::uuid
          AND outbox_id = $2::uuid
        LIMIT 1
      `,
      [tenantId, outboxId],
    );

  const row = existing.rows[0];

  if (!row) {
    throw new AtomicSandboxResultPersistenceError(
      "Completed or conflicting sandbox outbox has no visible durable result.",
    );
  }

  return row;
}

function buildCompletion(
  resultRow: SandboxResultDatabaseRow,
  completedAt: string,
  replayed: boolean,
): AtomicSandboxResultCompletion {
  return Object.freeze({
    tenantId: resultRow.tenant_id,
    resultId: resultRow.result_id,
    outboxId: resultRow.outbox_id,
    actionKind: resultRow.action_kind,
    payload: normalizeDatabasePayload(resultRow.payload),
    completedAt,
    replayed,
  });
}

/**
 * Atomically records an immutable sandbox execution result and completes
 * its currently valid outbox lease.
 *
 * A previously completed identical result is returned idempotently.
 * Different result identity or payload reuse fails closed.
 *
 * This function records sandbox evidence only. It performs no provider
 * call, external delivery, payment action or public execution.
 */
export async function commitSandboxResultAndCompleteLease(
  pool: PostgreSqlConnectionPool,
  transactionContextInput: TenantTransactionContext,
  input: CommitSandboxResultInput,
): Promise<AtomicSandboxResultCompletion> {
  const transactionContext =
    requireContext(transactionContextInput);

  const tenantId = requireUuid(
    transactionContext.tenantId,
    "tenantId",
  );

  const resultId = requireUuid(input.resultId, "resultId");
  const outboxId = requireUuid(input.outboxId, "outboxId");
  const actionKind = requireActionKind(input.actionKind);
  const leaseOwner = requireLeaseOwner(input.leaseOwner);
  const leaseToken = requireUuid(
    input.leaseToken,
    "leaseToken",
  );
  const payload = requirePayload(input.payload);

  return withPostgreSqlTenantTransaction(
    pool,
    {
      tenantId,
      actorId: transactionContext.actorId,
      requestId: transactionContext.requestId,
    },
    async (sql) => {
      const outboxState =
        await sql.query<SandboxOutboxStateRow>(
          `
            SELECT
              tenant_id,
              outbox_id,
              action_kind,
              status,
              lease_owner,
              lease_token,
              (
                lease_expires_at IS NOT NULL
                AND lease_expires_at > now()
              ) AS lease_valid
            FROM nexus_sandbox_outbox
            WHERE tenant_id = $1::uuid
              AND outbox_id = $2::uuid
            LIMIT 1
            FOR UPDATE
          `,
          [tenantId, outboxId],
        );

      const outboxRow = outboxState.rows[0];

      if (!outboxRow) {
        throw new AtomicSandboxResultLeaseFenceError(
          "Sandbox outbox does not exist inside the verified tenant boundary.",
        );
      }

      verifyOutboxIdentity(outboxRow, {
        tenantId,
        outboxId,
        actionKind,
      });

      if (outboxRow.status === "completed") {
        const existingRow = verifyResultRow(
          await readExistingResult(
            sql,
            tenantId,
            outboxId,
          ),
          {
            tenantId,
            resultId,
            outboxId,
            actionKind,
            payloadCanonical: payload.canonical,
          },
        );

        return buildCompletion(
          existingRow,
          requireIsoTimestamp(
            existingRow.created_at,
            "createdAt",
          ),
          true,
        );
      }

      verifyActiveLease(outboxRow, {
        leaseOwner,
        leaseToken,
      });

      const inserted =
        await sql.query<SandboxResultDatabaseRow>(
          `
            INSERT INTO nexus_sandbox_outbox_results (
              tenant_id,
              result_id,
              outbox_id,
              action_kind,
              payload,
              payload_canonical
            )
            VALUES (
              $1::uuid,
              $2::uuid,
              $3::uuid,
              $4::text,
              $5::jsonb,
              $6::text
            )
            ON CONFLICT (tenant_id, outbox_id)
            DO NOTHING
            RETURNING
              tenant_id,
              result_id,
              outbox_id,
              action_kind,
              payload,
              payload_canonical,
              created_at
          `,
          [
            tenantId,
            resultId,
            outboxId,
            actionKind,
            payload.json,
            payload.canonical,
          ],
        );

      const resultRow = verifyResultRow(
        inserted.rows[0] ??
          (await readExistingResult(
            sql,
            tenantId,
            outboxId,
          )),
        {
          tenantId,
          resultId,
          outboxId,
          actionKind,
          payloadCanonical: payload.canonical,
        },
      );

      const completed =
        await sql.query<CompletedOutboxDatabaseRow>(
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
              completed_at
          `,
          [
            tenantId,
            outboxId,
            leaseOwner,
            leaseToken,
          ],
        );

      const completedRow = completed.rows[0];

      if (
        !completedRow ||
        completedRow.tenant_id !== tenantId ||
        completedRow.outbox_id !== outboxId ||
        completedRow.status !== "completed"
      ) {
        throw new AtomicSandboxResultLeaseFenceError(
          "Sandbox result was not completed because the lease fence changed before finalization.",
        );
      }

      return buildCompletion(
        resultRow,
        requireIsoTimestamp(
          completedRow.completed_at,
          "completedAt",
        ),
        inserted.rows.length === 0,
      );
    },
  );
}
