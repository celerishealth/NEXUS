import type {
  SandboxWorkerCycleCommandResult,
} from "./sandboxWorkerCycleCommand";

import type {
  SandboxWorkerCommandReceiptClaim,
  SandboxWorkerCommandReceiptClaimInput,
  SandboxWorkerCommandReceiptCompleteInput,
  SandboxWorkerCommandReceiptFailureInput,
  SandboxWorkerCommandReceiptRepository,
} from "./idempotentSandboxWorkerCycleCommand";

export type PostgresSandboxReceiptRepositoryErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_INPUT"
  | "RECEIPT_QUERY_FAILED"
  | "RECEIPT_INVALID"
  | "RECEIPT_STATE_CONFLICT"
  | "ATTEMPT_LIMIT_REACHED";

export class PostgresSandboxReceiptRepositoryError extends Error {
  readonly code: PostgresSandboxReceiptRepositoryErrorCode;

  constructor(
    code: PostgresSandboxReceiptRepositoryErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PostgresSandboxReceiptRepositoryError";
    this.code = code;
  }
}

export interface PostgresSandboxReceiptQueryResult<
  Row extends Record<string, unknown> = Record<string, unknown>,
> {
  rows: Row[];
  rowCount: number | null;
}

export interface PostgresSandboxReceiptClient {
  query<Row extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<PostgresSandboxReceiptQueryResult<Row>>;
}

export type WithPostgresSandboxReceiptTransaction = <T>(
  work: (client: PostgresSandboxReceiptClient) => Promise<T>,
) => Promise<T>;

export interface PostgresSandboxReceiptRepositoryRuntime {
  withTransaction: WithPostgresSandboxReceiptTransaction;
}

interface ReceiptRow extends Record<string, unknown> {
  tenant_id: unknown;
  idempotency_key: unknown;
  request_id: unknown;
  request_digest: unknown;
  state: unknown;
  attempt: unknown;
  result_json: unknown;
}

const TABLE_NAME =
  "nexus_sandbox_worker_command_receipts";

const CLAIM_KEYS = [
  "actorId",
  "idempotencyKey",
  "occurredAt",
  "requestDigest",
  "requestId",
  "tenantId",
] as const;

const COMPLETE_KEYS = [
  "idempotencyKey",
  "occurredAt",
  "requestDigest",
  "requestId",
  "result",
  "tenantId",
] as const;

const FAILURE_KEYS = [
  "failureCode",
  "idempotencyKey",
  "occurredAt",
  "requestDigest",
  "requestId",
  "tenantId",
] as const;

const CLAIM_INSERT_SQL = `
/* nexus-day763:claim-insert */
INSERT INTO ${TABLE_NAME} (
  tenant_id,
  idempotency_key,
  request_id,
  request_digest,
  actor_id,
  state,
  attempt,
  result_json,
  failure_code,
  created_at,
  updated_at
)
VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  'in_progress',
  1,
  NULL,
  NULL,
  $6::timestamptz,
  $6::timestamptz
)
ON CONFLICT (tenant_id, idempotency_key)
DO NOTHING
`;

const CLAIM_SELECT_SQL = `
/* nexus-day763:claim-select */
SELECT
  tenant_id,
  idempotency_key,
  request_id,
  request_digest,
  state,
  attempt,
  result_json
FROM ${TABLE_NAME}
WHERE tenant_id = $1
  AND idempotency_key = $2
FOR UPDATE
`;

const CLAIM_RETRY_SQL = `
/* nexus-day763:claim-retry */
UPDATE ${TABLE_NAME}
SET
  state = 'in_progress',
  attempt = attempt + 1,
  result_json = NULL,
  failure_code = NULL,
  updated_at = $1::timestamptz
WHERE tenant_id = $2
  AND idempotency_key = $3
  AND request_id = $4
  AND request_digest = $5
  AND state = 'failed'
  AND attempt < 100
RETURNING attempt
`;

const COMPLETE_SQL = `
/* nexus-day763:complete */
UPDATE ${TABLE_NAME}
SET
  state = 'completed',
  result_json = $1::jsonb,
  failure_code = NULL,
  updated_at = $2::timestamptz
WHERE tenant_id = $3
  AND idempotency_key = $4
  AND request_id = $5
  AND request_digest = $6
  AND state = 'in_progress'
`;

const FAIL_SQL = `
/* nexus-day763:fail */
UPDATE ${TABLE_NAME}
SET
  state = 'failed',
  result_json = NULL,
  failure_code = $1,
  updated_at = $2::timestamptz
WHERE tenant_id = $3
  AND idempotency_key = $4
  AND request_id = $5
  AND request_digest = $6
  AND state = 'in_progress'
`;

function repositoryError(
  code: PostgresSandboxReceiptRepositoryErrorCode,
  message: string,
): PostgresSandboxReceiptRepositoryError {
  return new PostgresSandboxReceiptRepositoryError(
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
): asserts value is Record<string, unknown> {
  if (!isPlainRecord(value)) {
    throw repositoryError(
      "INVALID_INPUT",
      "Sandbox command receipt input is invalid.",
    );
  }

  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();

  if (
    actual.length !== expected.length ||
    actual.some((key, index) => key !== expected[index])
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      "Sandbox command receipt input contract is invalid.",
    );
  }
}

function assertTenantIdentifier(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.length < 3 ||
    value.length > 128 ||
    !/^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      "Tenant identifier is invalid.",
    );
  }
}

function assertBoundedIdentifier(
  value: unknown,
  field: string,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    value.length > 128 ||
    !/^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      `${field} is invalid.`,
    );
  }
}

function assertDigest(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !/^[a-f0-9]{64}$/.test(value)
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      "Request digest is invalid.",
    );
  }
}

function assertTimestamp(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(
      value,
    ) ||
    Number.isNaN(new Date(value).getTime())
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      "Receipt timestamp is invalid.",
    );
  }
}

function assertFailureCode(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.length < 3 ||
    value.length > 64 ||
    !/^[A-Z][A-Z0-9_]*$/.test(value)
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      "Receipt failure classification is invalid.",
    );
  }
}

function assertClaimInput(
  input: unknown,
): asserts input is SandboxWorkerCommandReceiptClaimInput {
  assertExactKeys(input, CLAIM_KEYS);
  assertTenantIdentifier(input.tenantId);
  assertTenantIdentifier(input.actorId);
  assertBoundedIdentifier(
    input.requestId,
    "Request identifier",
  );
  assertBoundedIdentifier(
    input.idempotencyKey,
    "Idempotency key",
  );
  assertDigest(input.requestDigest);
  assertTimestamp(input.occurredAt);
}

function assertProtectedResult(
  result: unknown,
  input: {
    tenantId: string;
    requestId: string;
    requestDigest: string;
  },
): asserts result is SandboxWorkerCycleCommandResult {
  if (!isPlainRecord(result)) {
    throw repositoryError(
      "INVALID_INPUT",
      "Sandbox command result is invalid.",
    );
  }

  if (
    result.tenantId !== input.tenantId ||
    result.requestId !== input.requestId ||
    result.requestDigest !== input.requestDigest ||
    result.ownerApprovalRequired !== true ||
    result.liveProviderExecution !== "blocked" ||
    result.externalDelivery !== "blocked" ||
    result.paymentExecution !== "blocked" ||
    result.publicLaunch !== "blocked"
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      "Sandbox command result protection is invalid.",
    );
  }

  if (
    !isPlainRecord(result.cycle) ||
    result.cycle.tenantId !== input.tenantId ||
    result.cycle.ownerApprovalRequired !== true ||
    result.cycle.liveProviderExecution !== "blocked" ||
    result.cycle.externalDelivery !== "blocked" ||
    result.cycle.paymentExecution !== "blocked" ||
    result.cycle.publicLaunch !== "blocked"
  ) {
    throw repositoryError(
      "INVALID_INPUT",
      "Sandbox worker cycle protection is invalid.",
    );
  }
}

function assertCompleteInput(
  input: unknown,
): asserts input is SandboxWorkerCommandReceiptCompleteInput {
  assertExactKeys(input, COMPLETE_KEYS);
  assertTenantIdentifier(input.tenantId);
  assertBoundedIdentifier(
    input.requestId,
    "Request identifier",
  );
  assertBoundedIdentifier(
    input.idempotencyKey,
    "Idempotency key",
  );
  assertDigest(input.requestDigest);
  assertTimestamp(input.occurredAt);
  assertProtectedResult(input.result, {
    tenantId: input.tenantId,
    requestId: input.requestId,
    requestDigest: input.requestDigest,
  });
}

function assertFailureInput(
  input: unknown,
): asserts input is SandboxWorkerCommandReceiptFailureInput {
  assertExactKeys(input, FAILURE_KEYS);
  assertTenantIdentifier(input.tenantId);
  assertBoundedIdentifier(
    input.requestId,
    "Request identifier",
  );
  assertBoundedIdentifier(
    input.idempotencyKey,
    "Idempotency key",
  );
  assertDigest(input.requestDigest);
  assertFailureCode(input.failureCode);
  assertTimestamp(input.occurredAt);
}

function assertRowCount(
  rowCount: number | null,
  allowed: readonly number[],
): number {
  if (
    typeof rowCount !== "number" ||
    !Number.isInteger(rowCount) ||
    !allowed.includes(rowCount)
  ) {
    throw repositoryError(
      "RECEIPT_INVALID",
      "Sandbox command receipt database response is invalid.",
    );
  }

  return rowCount;
}

function parseReceiptRow(value: unknown): {
  tenantId: string;
  idempotencyKey: string;
  requestId: string;
  requestDigest: string;
  state: "in_progress" | "completed" | "failed";
  attempt: number;
  result: SandboxWorkerCycleCommandResult | null;
} {
  if (!isPlainRecord(value)) {
    throw repositoryError(
      "RECEIPT_INVALID",
      "Sandbox command receipt row is invalid.",
    );
  }

  const row = value as ReceiptRow;

  assertTenantIdentifier(row.tenant_id);
  assertBoundedIdentifier(
    row.idempotency_key,
    "Stored idempotency key",
  );
  assertBoundedIdentifier(
    row.request_id,
    "Stored request identifier",
  );
  assertDigest(row.request_digest);

  if (
    row.state !== "in_progress" &&
    row.state !== "completed" &&
    row.state !== "failed"
  ) {
    throw repositoryError(
      "RECEIPT_INVALID",
      "Sandbox command receipt state is invalid.",
    );
  }

  if (
    !Number.isInteger(row.attempt) ||
    (row.attempt as number) < 1 ||
    (row.attempt as number) > 100
  ) {
    throw repositoryError(
      "RECEIPT_INVALID",
      "Sandbox command receipt attempt is invalid.",
    );
  }

  let result: SandboxWorkerCycleCommandResult | null = null;

  if (row.state === "completed") {
    if (!isPlainRecord(row.result_json)) {
      throw repositoryError(
        "RECEIPT_INVALID",
        "Completed sandbox command receipt result is invalid.",
      );
    }

    result =
      row.result_json as unknown as SandboxWorkerCycleCommandResult;
  } else if (row.result_json !== null) {
    throw repositoryError(
      "RECEIPT_INVALID",
      "Incomplete sandbox command receipt contains a result.",
    );
  }

  return {
    tenantId: row.tenant_id,
    idempotencyKey: row.idempotency_key,
    requestId: row.request_id,
    requestDigest: row.request_digest,
    state: row.state,
    attempt: row.attempt as number,
    result,
  };
}

async function executeTransaction<T>(
  runtime: PostgresSandboxReceiptRepositoryRuntime,
  work: (
    client: PostgresSandboxReceiptClient,
  ) => Promise<T>,
): Promise<T> {
  try {
    return await runtime.withTransaction(work);
  } catch (error) {
    if (
      error instanceof PostgresSandboxReceiptRepositoryError
    ) {
      throw error;
    }

    throw repositoryError(
      "RECEIPT_QUERY_FAILED",
      "Sandbox command receipt storage is unavailable.",
    );
  }
}

export function createPostgresSandboxWorkerCommandReceiptRepository(
  runtime: PostgresSandboxReceiptRepositoryRuntime,
): SandboxWorkerCommandReceiptRepository {
  if (
    !runtime ||
    typeof runtime.withTransaction !== "function"
  ) {
    throw repositoryError(
      "INVALID_CONFIGURATION",
      "Postgres sandbox receipt runtime is invalid.",
    );
  }

  return {
    async claim(
      input: SandboxWorkerCommandReceiptClaimInput,
    ): Promise<SandboxWorkerCommandReceiptClaim> {
      assertClaimInput(input);

      return executeTransaction(runtime, async (client) => {
        const insertResult = await client.query(
          CLAIM_INSERT_SQL,
          [
            input.tenantId,
            input.idempotencyKey,
            input.requestId,
            input.requestDigest,
            input.actorId,
            input.occurredAt,
          ],
        );

        const inserted = assertRowCount(
          insertResult.rowCount,
          [0, 1],
        );

        const selectResult =
          await client.query<ReceiptRow>(
            CLAIM_SELECT_SQL,
            [
              input.tenantId,
              input.idempotencyKey,
            ],
          );

        assertRowCount(selectResult.rowCount, [1]);

        if (selectResult.rows.length !== 1) {
          throw repositoryError(
            "RECEIPT_INVALID",
            "Sandbox command receipt lookup is invalid.",
          );
        }

        const receipt = parseReceiptRow(
          selectResult.rows[0],
        );

        if (
          receipt.tenantId !== input.tenantId ||
          receipt.idempotencyKey !==
            input.idempotencyKey
        ) {
          throw repositoryError(
            "RECEIPT_INVALID",
            "Sandbox command receipt tenant binding is invalid.",
          );
        }

        if (inserted === 1) {
          if (
            receipt.requestId !== input.requestId ||
            receipt.requestDigest !==
              input.requestDigest ||
            receipt.state !== "in_progress" ||
            receipt.attempt !== 1
          ) {
            throw repositoryError(
              "RECEIPT_INVALID",
              "New sandbox command receipt binding is invalid.",
            );
          }

          return {
            status: "claimed",
            tenantId: receipt.tenantId,
            requestId: receipt.requestId,
            idempotencyKey:
              receipt.idempotencyKey,
            requestDigest:
              receipt.requestDigest,
            attempt: receipt.attempt,
            result: null,
          };
        }

        if (
          receipt.requestId !== input.requestId ||
          receipt.requestDigest !==
            input.requestDigest
        ) {
          return {
            status: "conflict",
            tenantId: receipt.tenantId,
            requestId: receipt.requestId,
            idempotencyKey:
              receipt.idempotencyKey,
            requestDigest:
              receipt.requestDigest,
            attempt: receipt.attempt,
            result: null,
          };
        }

        if (receipt.state === "completed") {
          return {
            status: "replay",
            tenantId: receipt.tenantId,
            requestId: receipt.requestId,
            idempotencyKey:
              receipt.idempotencyKey,
            requestDigest:
              receipt.requestDigest,
            attempt: receipt.attempt,
            result: receipt.result,
          };
        }

        if (receipt.state === "in_progress") {
          return {
            status: "in_progress",
            tenantId: receipt.tenantId,
            requestId: receipt.requestId,
            idempotencyKey:
              receipt.idempotencyKey,
            requestDigest:
              receipt.requestDigest,
            attempt: receipt.attempt,
            result: null,
          };
        }

        if (receipt.attempt >= 100) {
          throw repositoryError(
            "ATTEMPT_LIMIT_REACHED",
            "Sandbox command receipt retry limit has been reached.",
          );
        }

        const retryResult = await client.query<{
          attempt: unknown;
        }>(
          CLAIM_RETRY_SQL,
          [
            input.occurredAt,
            input.tenantId,
            input.idempotencyKey,
            input.requestId,
            input.requestDigest,
          ],
        );

        assertRowCount(retryResult.rowCount, [1]);

        if (
          retryResult.rows.length !== 1 ||
          !Number.isInteger(
            retryResult.rows[0]?.attempt,
          ) ||
          (retryResult.rows[0].attempt as number) !==
            receipt.attempt + 1
        ) {
          throw repositoryError(
            "RECEIPT_INVALID",
            "Sandbox command retry receipt is invalid.",
          );
        }

        return {
          status: "claimed",
          tenantId: receipt.tenantId,
          requestId: receipt.requestId,
          idempotencyKey:
            receipt.idempotencyKey,
          requestDigest:
            receipt.requestDigest,
          attempt:
            retryResult.rows[0]
              .attempt as number,
          result: null,
        };
      });
    },

    async complete(
      input: SandboxWorkerCommandReceiptCompleteInput,
    ): Promise<void> {
      assertCompleteInput(input);

      await executeTransaction(runtime, async (client) => {
        let serializedResult: string;

        try {
          serializedResult = JSON.stringify(input.result);
        } catch {
          throw repositoryError(
            "INVALID_INPUT",
            "Sandbox command result cannot be stored.",
          );
        }

        const result = await client.query(
          COMPLETE_SQL,
          [
            serializedResult,
            input.occurredAt,
            input.tenantId,
            input.idempotencyKey,
            input.requestId,
            input.requestDigest,
          ],
        );

        if (assertRowCount(result.rowCount, [0, 1]) !== 1) {
          throw repositoryError(
            "RECEIPT_STATE_CONFLICT",
            "Sandbox command receipt cannot be completed from its current state.",
          );
        }
      });
    },

    async fail(
      input: SandboxWorkerCommandReceiptFailureInput,
    ): Promise<void> {
      assertFailureInput(input);

      await executeTransaction(runtime, async (client) => {
        const result = await client.query(
          FAIL_SQL,
          [
            input.failureCode,
            input.occurredAt,
            input.tenantId,
            input.idempotencyKey,
            input.requestId,
            input.requestDigest,
          ],
        );

        if (assertRowCount(result.rowCount, [0, 1]) !== 1) {
          throw repositoryError(
            "RECEIPT_STATE_CONFLICT",
            "Sandbox command receipt cannot be failed from its current state.",
          );
        }
      });
    },
  };
}
