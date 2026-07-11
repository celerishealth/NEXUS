import { createHash } from "node:crypto";

import type {
  SandboxWorkerCycleCommandAuditRecord,
} from "./sandboxWorkerCycleCommand";

import type {
  PostgresSandboxReceiptClient,
  WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

export type PostgresInternalPilotAuditErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_INPUT"
  | "AUDIT_QUERY_FAILED"
  | "AUDIT_STATE_CONFLICT"
  | "AUDIT_ROW_INVALID";

export class PostgresInternalPilotAuditError extends Error {
  readonly code: PostgresInternalPilotAuditErrorCode;

  constructor(
    code: PostgresInternalPilotAuditErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PostgresInternalPilotAuditError";
    this.code = code;
  }
}

export interface PostgresInternalPilotAuditRuntime {
  withTransaction: WithPostgresSandboxReceiptTransaction;
}

export type PostgresInternalPilotAuditAppender = (
  record: SandboxWorkerCycleCommandAuditRecord,
) => Promise<void>;

interface LatestAuditRow extends Record<string, unknown> {
  tenant_id: unknown;
  request_id: unknown;
  sequence_no: unknown;
  actor_id: unknown;
  request_digest: unknown;
  stage: unknown;
  failure_code: unknown;
  record_hash: unknown;
}

interface InsertedAuditRow extends Record<string, unknown> {
  sequence_no: unknown;
  record_hash: unknown;
}

interface ParsedLatestAuditRow {
  tenantId: string;
  requestId: string;
  sequenceNo: number;
  actorId: string;
  requestDigest: string;
  stage: "authorized" | "completed" | "failed";
  failureCode: string | null;
  recordHash: string;
}

export interface InternalPilotCommandAuditHashInput {
  tenantId: string;
  requestId: string;
  sequenceNo: number;
  actorId: string;
  requestDigest: string;
  stage: "authorized" | "completed" | "failed";
  failureCode: string | null;
  previousHash: string;
  occurredAt: string;
}

const ZERO_HASH = "0".repeat(64);

const AUDIT_RECORD_KEYS = [
  "actorId",
  "failureCode",
  "occurredAt",
  "requestDigest",
  "requestId",
  "stage",
  "tenantId",
] as const;

const LATEST_ROW_KEYS = [
  "actor_id",
  "failure_code",
  "record_hash",
  "request_digest",
  "request_id",
  "sequence_no",
  "stage",
  "tenant_id",
] as const;

const INSERTED_ROW_KEYS = [
  "record_hash",
  "sequence_no",
] as const;

const SELECT_LATEST_SQL = `
/* nexus-day770:audit-select */
SELECT
  tenant_id,
  request_id,
  sequence_no,
  actor_id,
  request_digest,
  stage,
  failure_code,
  record_hash
FROM nexus_internal_pilot_command_audit
WHERE tenant_id = $1
  AND request_id = $2
ORDER BY sequence_no DESC
LIMIT 1
FOR UPDATE
`;

const INSERT_AUDIT_SQL = `
/* nexus-day770:audit-insert */
INSERT INTO nexus_internal_pilot_command_audit (
  tenant_id,
  request_id,
  sequence_no,
  actor_id,
  request_digest,
  stage,
  failure_code,
  previous_hash,
  record_hash,
  occurred_at,
  created_at
)
VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10::timestamptz,
  $10::timestamptz
)
RETURNING
  sequence_no,
  record_hash
`;

function auditError(
  code: PostgresInternalPilotAuditErrorCode,
  message: string,
): PostgresInternalPilotAuditError {
  return new PostgresInternalPilotAuditError(
    code,
    message,
  );
}

function isPlainRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function assertExactKeys(
  value: unknown,
  expectedKeys: readonly string[],
  code:
    | "INVALID_INPUT"
    | "AUDIT_ROW_INVALID",
  message: string,
): asserts value is Record<string, unknown> {
  if (!isPlainRecord(value)) {
    throw auditError(code, message);
  }

  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();

  if (
    actual.length !== expected.length ||
    actual.some(
      (key, index) => key !== expected[index],
    )
  ) {
    throw auditError(code, message);
  }
}

function isIdentifier(
  value: unknown,
  minimumLength: number,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= minimumLength &&
    value.length <= 128 &&
    /^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  );
}

function isDigest(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-f0-9]{64}$/.test(value)
  );
}

function isFailureCode(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= 3 &&
    value.length <= 64 &&
    /^[A-Z][A-Z0-9_]*$/.test(value)
  );
}

function isTimestamp(
  value: unknown,
): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(
      value,
    )
  ) {
    return false;
  }

  const parsed = new Date(value);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString() === value
  );
}

function assertAuditRecord(
  value: unknown,
): asserts value is SandboxWorkerCycleCommandAuditRecord {
  assertExactKeys(
    value,
    AUDIT_RECORD_KEYS,
    "INVALID_INPUT",
    "The internal pilot audit record contract is invalid.",
  );

  if (
    !isIdentifier(value.tenantId, 3) ||
    !isIdentifier(value.actorId, 3) ||
    !isIdentifier(value.requestId, 8) ||
    !isDigest(value.requestDigest) ||
    !isTimestamp(value.occurredAt) ||
    (
      value.stage !== "authorized" &&
      value.stage !== "completed" &&
      value.stage !== "failed"
    )
  ) {
    throw auditError(
      "INVALID_INPUT",
      "The internal pilot audit record is invalid.",
    );
  }

  if (
    (
      value.stage === "failed" &&
      !isFailureCode(value.failureCode)
    ) ||
    (
      value.stage !== "failed" &&
      value.failureCode !== null
    )
  ) {
    throw auditError(
      "INVALID_INPUT",
      "The internal pilot audit failure classification is invalid.",
    );
  }
}

function assertQueryResult(
  result: {
    rows: Record<string, unknown>[];
    rowCount: number | null;
  },
  allowedRowCounts: readonly number[],
): number {
  if (
    typeof result.rowCount !== "number" ||
    !Number.isInteger(result.rowCount) ||
    !allowedRowCounts.includes(result.rowCount) ||
    result.rows.length !== result.rowCount
  ) {
    throw auditError(
      "AUDIT_ROW_INVALID",
      "The internal pilot audit database response is invalid.",
    );
  }

  return result.rowCount;
}

function parseLatestRow(
  value: unknown,
): ParsedLatestAuditRow {
  assertExactKeys(
    value,
    LATEST_ROW_KEYS,
    "AUDIT_ROW_INVALID",
    "The stored internal pilot audit record is invalid.",
  );

  if (
    !isIdentifier(value.tenant_id, 3) ||
    !isIdentifier(value.request_id, 8) ||
    typeof value.sequence_no !== "number" ||
    !Number.isInteger(value.sequence_no) ||
    value.sequence_no < 1 ||
    value.sequence_no > 2 ||
    !isIdentifier(value.actor_id, 3) ||
    !isDigest(value.request_digest) ||
    (
      value.stage !== "authorized" &&
      value.stage !== "completed" &&
      value.stage !== "failed"
    ) ||
    !isDigest(value.record_hash)
  ) {
    throw auditError(
      "AUDIT_ROW_INVALID",
      "The stored internal pilot audit record binding is invalid.",
    );
  }

  if (
    (
      value.stage === "failed" &&
      !isFailureCode(value.failure_code)
    ) ||
    (
      value.stage !== "failed" &&
      value.failure_code !== null
    )
  ) {
    throw auditError(
      "AUDIT_ROW_INVALID",
      "The stored internal pilot audit failure classification is invalid.",
    );
  }

  return {
    tenantId: value.tenant_id,
    requestId: value.request_id,
    sequenceNo: value.sequence_no,
    actorId: value.actor_id,
    requestDigest: value.request_digest,
    stage: value.stage,
    failureCode: value.failure_code,
    recordHash: value.record_hash,
  };
}

function parseInsertedRow(
  value: unknown,
  expectedSequenceNo: number,
  expectedRecordHash: string,
): void {
  assertExactKeys(
    value,
    INSERTED_ROW_KEYS,
    "AUDIT_ROW_INVALID",
    "The inserted internal pilot audit response is invalid.",
  );

  if (
    value.sequence_no !== expectedSequenceNo ||
    value.record_hash !== expectedRecordHash
  ) {
    throw auditError(
      "AUDIT_ROW_INVALID",
      "The inserted internal pilot audit binding is invalid.",
    );
  }
}

export function createInternalPilotCommandAuditRecordHash(
  input: InternalPilotCommandAuditHashInput,
): string {
  const canonical = JSON.stringify({
    tenantId: input.tenantId,
    requestId: input.requestId,
    sequenceNo: input.sequenceNo,
    actorId: input.actorId,
    requestDigest: input.requestDigest,
    stage: input.stage,
    failureCode: input.failureCode,
    previousHash: input.previousHash,
    occurredAt: input.occurredAt,
  });

  return createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");
}

async function executeTransaction<T>(
  runtime: PostgresInternalPilotAuditRuntime,
  work: (
    client: PostgresSandboxReceiptClient,
  ) => Promise<T>,
): Promise<T> {
  try {
    return await runtime.withTransaction(work);
  } catch (error) {
    if (
      error instanceof PostgresInternalPilotAuditError
    ) {
      throw error;
    }

    throw auditError(
      "AUDIT_QUERY_FAILED",
      "The internal pilot audit store is unavailable.",
    );
  }
}

export function createPostgresInternalPilotCommandAuditAppender(
  runtime: PostgresInternalPilotAuditRuntime,
): PostgresInternalPilotAuditAppender {
  if (
    !runtime ||
    typeof runtime.withTransaction !== "function"
  ) {
    throw auditError(
      "INVALID_CONFIGURATION",
      "The internal pilot audit repository configuration is invalid.",
    );
  }

  return async (
    record: SandboxWorkerCycleCommandAuditRecord,
  ): Promise<void> => {
    assertAuditRecord(record);

    await executeTransaction(
      runtime,
      async (client) => {
        const latestResult =
          await client.query<LatestAuditRow>(
            SELECT_LATEST_SQL,
            [
              record.tenantId,
              record.requestId,
            ],
          );

        const latestRowCount =
          assertQueryResult(
            latestResult,
            [0, 1],
          );

        let sequenceNo: number;
        let previousHash: string;

        if (latestRowCount === 0) {
          if (record.stage !== "authorized") {
            throw auditError(
              "AUDIT_STATE_CONFLICT",
              "The first internal pilot audit event must be authorization.",
            );
          }

          sequenceNo = 1;
          previousHash = ZERO_HASH;
        } else {
          const latest = parseLatestRow(
            latestResult.rows[0],
          );

          if (
            latest.tenantId !== record.tenantId ||
            latest.requestId !== record.requestId
          ) {
            throw auditError(
              "AUDIT_ROW_INVALID",
              "The stored internal pilot audit tenant binding is invalid.",
            );
          }

          if (
            latest.actorId !== record.actorId ||
            latest.requestDigest !==
              record.requestDigest
          ) {
            throw auditError(
              "AUDIT_STATE_CONFLICT",
              "The internal pilot audit request binding has changed.",
            );
          }

          if (
            latest.sequenceNo !== 1 ||
            latest.stage !== "authorized" ||
            record.stage === "authorized"
          ) {
            throw auditError(
              "AUDIT_STATE_CONFLICT",
              "The internal pilot audit transition is not authorized.",
            );
          }

          sequenceNo = 2;
          previousHash = latest.recordHash;
        }

        const recordHash =
          createInternalPilotCommandAuditRecordHash({
            tenantId: record.tenantId,
            requestId: record.requestId,
            sequenceNo,
            actorId: record.actorId,
            requestDigest:
              record.requestDigest,
            stage: record.stage,
            failureCode:
              record.failureCode,
            previousHash,
            occurredAt: record.occurredAt,
          });

        const insertResult =
          await client.query<InsertedAuditRow>(
            INSERT_AUDIT_SQL,
            [
              record.tenantId,
              record.requestId,
              sequenceNo,
              record.actorId,
              record.requestDigest,
              record.stage,
              record.failureCode,
              previousHash,
              recordHash,
              record.occurredAt,
            ],
          );

        assertQueryResult(
          insertResult,
          [1],
        );

        parseInsertedRow(
          insertResult.rows[0],
          sequenceNo,
          recordHash,
        );
      },
    );
  };
}
