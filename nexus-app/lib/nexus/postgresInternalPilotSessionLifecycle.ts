import {
  randomBytes as nodeRandomBytes,
} from "node:crypto";

import {
  createInternalPilotCsrfDigest,
} from "./internalPilotSandboxWorkerRoute";

import {
  createInternalPilotSessionTokenDigest,
} from "./postgresInternalPilotSessionResolver";

import type {
  PostgresSandboxReceiptClient,
  WithPostgresSandboxReceiptTransaction,
} from "./postgresSandboxWorkerCommandReceiptRepository";

export type PostgresInternalPilotSessionLifecycleErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_INPUT"
  | "OWNER_APPROVAL_REQUIRED"
  | "RANDOMNESS_UNAVAILABLE"
  | "SESSION_INSERT_FAILED"
  | "SESSION_REVOKE_FAILED"
  | "SESSION_NOT_FOUND"
  | "SESSION_ROW_INVALID";

export class PostgresInternalPilotSessionLifecycleError extends Error {
  readonly code: PostgresInternalPilotSessionLifecycleErrorCode;

  constructor(
    code: PostgresInternalPilotSessionLifecycleErrorCode,
    message: string,
  ) {
    super(message);
    this.name =
      "PostgresInternalPilotSessionLifecycleError";
    this.code = code;
  }
}

export interface InternalPilotOwnerSessionIssueInput {
  actorId: string;
  ownerApprovalGranted: true;
  ttlSeconds: number;
}

export interface InternalPilotOwnerSessionRevokeInput {
  sessionId: string;
  actorId: string;
}

export interface InternalPilotOwnerSessionIssueResult {
  tenantId: string;
  sessionId: string;
  actorId: string;
  role: "owner";
  ownerApprovalGranted: true;
  sessionToken: string;
  csrfToken: string;
  sessionTokenDigest: string;
  csrfTokenDigest: string;
  cookieName: string;
  setCookieHeader: string;
  issuedAt: string;
  expiresAt: string;
}

export interface InternalPilotOwnerSessionRevokeResult {
  tenantId: string;
  sessionId: string;
  actorId: string;
  revoked: true;
  replay: boolean;
  revokedAt: string;
}

export interface PostgresInternalPilotSessionLifecycleRuntime {
  tenantId: string;
  withTransaction: WithPostgresSandboxReceiptTransaction;
  cookieName?: string;
  now?: () => Date;
  randomBytes?: (size: number) => Buffer;
}

export interface PostgresInternalPilotSessionLifecycle {
  issue(
    input: InternalPilotOwnerSessionIssueInput,
  ): Promise<InternalPilotOwnerSessionIssueResult>;

  revoke(
    input: InternalPilotOwnerSessionRevokeInput,
  ): Promise<InternalPilotOwnerSessionRevokeResult>;
}

interface IssuedSessionRow extends Record<string, unknown> {
  tenant_id: unknown;
  session_id: unknown;
  actor_id: unknown;
  role: unknown;
  owner_approval_granted: unknown;
  expires_at: unknown;
  revoked_at: unknown;
}

interface RevokedSessionRow extends Record<string, unknown> {
  tenant_id: unknown;
  session_id: unknown;
  actor_id: unknown;
  revoked_at: unknown;
}

const DEFAULT_COOKIE_NAME =
  "nexus_internal_pilot_session";

const ISSUE_INPUT_KEYS = [
  "actorId",
  "ownerApprovalGranted",
  "ttlSeconds",
] as const;

const REVOKE_INPUT_KEYS = [
  "actorId",
  "sessionId",
] as const;

const ISSUED_ROW_KEYS = [
  "actor_id",
  "expires_at",
  "owner_approval_granted",
  "revoked_at",
  "role",
  "session_id",
  "tenant_id",
] as const;

const REVOKED_ROW_KEYS = [
  "actor_id",
  "revoked_at",
  "session_id",
  "tenant_id",
] as const;

const INSERT_SESSION_SQL = `
/* nexus-day772:session-insert */
INSERT INTO nexus_internal_pilot_owner_sessions (
  tenant_id,
  session_id,
  session_digest,
  actor_id,
  role,
  owner_approval_granted,
  csrf_token_digest,
  expires_at,
  revoked_at,
  created_at,
  updated_at
)
VALUES (
  $1,
  $2,
  $3,
  $4,
  'owner',
  TRUE,
  $5,
  $6::timestamptz,
  NULL,
  $7::timestamptz,
  $7::timestamptz
)
RETURNING
  tenant_id,
  session_id,
  actor_id,
  role,
  owner_approval_granted,
  expires_at,
  revoked_at
`;

const REVOKE_SESSION_SQL = `
/* nexus-day772:session-revoke */
UPDATE nexus_internal_pilot_owner_sessions
SET
  revoked_at = $4::timestamptz,
  updated_at = $4::timestamptz
WHERE tenant_id = $1
  AND session_id = $2
  AND actor_id = $3
  AND revoked_at IS NULL
RETURNING
  tenant_id,
  session_id,
  actor_id,
  revoked_at
`;

const READ_REVOKED_SESSION_SQL = `
/* nexus-day772:session-read */
SELECT
  tenant_id,
  session_id,
  actor_id,
  revoked_at
FROM nexus_internal_pilot_owner_sessions
WHERE tenant_id = $1
  AND session_id = $2
  AND actor_id = $3
LIMIT 1
FOR UPDATE
`;

function lifecycleError(
  code: PostgresInternalPilotSessionLifecycleErrorCode,
  message: string,
): PostgresInternalPilotSessionLifecycleError {
  return new PostgresInternalPilotSessionLifecycleError(
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
    | "SESSION_ROW_INVALID",
  message: string,
): asserts value is Record<string, unknown> {
  if (!isPlainRecord(value)) {
    throw lifecycleError(code, message);
  }

  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();

  if (
    actual.length !== expected.length ||
    actual.some(
      (key, index) => key !== expected[index],
    )
  ) {
    throw lifecycleError(code, message);
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

function parseTimestamp(
  value: unknown,
): string {
  const parsed =
    value instanceof Date
      ? value
      : typeof value === "string"
        ? new Date(value)
        : null;

  if (
    parsed === null ||
    Number.isNaN(parsed.getTime())
  ) {
    throw lifecycleError(
      "SESSION_ROW_INVALID",
      "The internal pilot session timestamp is invalid.",
    );
  }

  return parsed.toISOString();
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is PostgresInternalPilotSessionLifecycleRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    typeof runtime.withTransaction !== "function" ||
    (
      runtime.cookieName !== undefined &&
      (
        typeof runtime.cookieName !== "string" ||
        runtime.cookieName.length < 3 ||
        runtime.cookieName.length > 64 ||
        !/^[A-Za-z0-9_-]+$/.test(
          runtime.cookieName,
        )
      )
    ) ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    ) ||
    (
      runtime.randomBytes !== undefined &&
      typeof runtime.randomBytes !== "function"
    )
  ) {
    throw lifecycleError(
      "INVALID_CONFIGURATION",
      "The internal pilot session lifecycle configuration is invalid.",
    );
  }
}

function validateNow(
  now: () => Date,
): Date {
  const value = now();

  if (
    !(value instanceof Date) ||
    Number.isNaN(value.getTime())
  ) {
    throw lifecycleError(
      "INVALID_CONFIGURATION",
      "The internal pilot session lifecycle clock is invalid.",
    );
  }

  return value;
}

function createSecureBytes(
  randomBytes: (size: number) => Buffer,
  size: number,
): Buffer {
  let value: Buffer;

  try {
    value = randomBytes(size);
  } catch {
    throw lifecycleError(
      "RANDOMNESS_UNAVAILABLE",
      "Secure internal pilot session credentials could not be generated.",
    );
  }

  if (
    !Buffer.isBuffer(value) ||
    value.length !== size
  ) {
    throw lifecycleError(
      "RANDOMNESS_UNAVAILABLE",
      "Secure internal pilot session credentials could not be generated.",
    );
  }

  return value;
}

function assertIssueInput(
  input: unknown,
): asserts input is InternalPilotOwnerSessionIssueInput {
  assertExactKeys(
    input,
    ISSUE_INPUT_KEYS,
    "INVALID_INPUT",
    "The internal pilot session issue request contract is invalid.",
  );

  if (
    !isIdentifier(input.actorId, 3) ||
    typeof input.ttlSeconds !== "number" ||
    !Number.isInteger(input.ttlSeconds) ||
    input.ttlSeconds < 300 ||
    input.ttlSeconds > 86_400
  ) {
    throw lifecycleError(
      "INVALID_INPUT",
      "The internal pilot session issue request is invalid.",
    );
  }

  if (input.ownerApprovalGranted !== true) {
    throw lifecycleError(
      "OWNER_APPROVAL_REQUIRED",
      "Explicit owner approval is required to issue an internal pilot session.",
    );
  }
}

function assertRevokeInput(
  input: unknown,
): asserts input is InternalPilotOwnerSessionRevokeInput {
  assertExactKeys(
    input,
    REVOKE_INPUT_KEYS,
    "INVALID_INPUT",
    "The internal pilot session revoke request contract is invalid.",
  );

  if (
    !isIdentifier(input.sessionId, 8) ||
    !isIdentifier(input.actorId, 3)
  ) {
    throw lifecycleError(
      "INVALID_INPUT",
      "The internal pilot session revoke request is invalid.",
    );
  }
}

function assertQueryResult(
  result: {
    rows: Record<string, unknown>[];
    rowCount: number | null;
  },
  allowedCounts: readonly number[],
): number {
  if (
    typeof result.rowCount !== "number" ||
    !Number.isInteger(result.rowCount) ||
    !allowedCounts.includes(result.rowCount) ||
    result.rows.length !== result.rowCount
  ) {
    throw lifecycleError(
      "SESSION_ROW_INVALID",
      "The internal pilot session database response is invalid.",
    );
  }

  return result.rowCount;
}

function parseIssuedRow(
  value: unknown,
  expected: {
    tenantId: string;
    sessionId: string;
    actorId: string;
    expiresAt: string;
  },
): void {
  assertExactKeys(
    value,
    ISSUED_ROW_KEYS,
    "SESSION_ROW_INVALID",
    "The issued internal pilot session record is invalid.",
  );

  if (
    value.tenant_id !== expected.tenantId ||
    value.session_id !== expected.sessionId ||
    value.actor_id !== expected.actorId ||
    value.role !== "owner" ||
    value.owner_approval_granted !== true ||
    value.revoked_at !== null ||
    parseTimestamp(value.expires_at) !==
      expected.expiresAt
  ) {
    throw lifecycleError(
      "SESSION_ROW_INVALID",
      "The issued internal pilot session binding is invalid.",
    );
  }
}

function parseRevokedRow(
  value: unknown,
  expected: {
    tenantId: string;
    sessionId: string;
    actorId: string;
  },
): string {
  assertExactKeys(
    value,
    REVOKED_ROW_KEYS,
    "SESSION_ROW_INVALID",
    "The revoked internal pilot session record is invalid.",
  );

  if (
    value.tenant_id !== expected.tenantId ||
    value.session_id !== expected.sessionId ||
    value.actor_id !== expected.actorId ||
    value.revoked_at === null
  ) {
    throw lifecycleError(
      "SESSION_ROW_INVALID",
      "The revoked internal pilot session binding is invalid.",
    );
  }

  return parseTimestamp(value.revoked_at);
}

async function executeTransaction<T>(
  runtime: PostgresInternalPilotSessionLifecycleRuntime,
  failureCode:
    | "SESSION_INSERT_FAILED"
    | "SESSION_REVOKE_FAILED",
  message: string,
  work: (
    client: PostgresSandboxReceiptClient,
  ) => Promise<T>,
): Promise<T> {
  try {
    return await runtime.withTransaction(work);
  } catch (error) {
    if (
      error instanceof
      PostgresInternalPilotSessionLifecycleError
    ) {
      throw error;
    }

    throw lifecycleError(
      failureCode,
      message,
    );
  }
}

export function createPostgresInternalPilotSessionLifecycle(
  runtime: PostgresInternalPilotSessionLifecycleRuntime,
): PostgresInternalPilotSessionLifecycle {
  validateRuntime(runtime);

  const now = runtime.now ?? (() => new Date());
  const randomBytes =
    runtime.randomBytes ?? nodeRandomBytes;
  const cookieName =
    runtime.cookieName ?? DEFAULT_COOKIE_NAME;

  return {
    async issue(
      input: InternalPilotOwnerSessionIssueInput,
    ): Promise<InternalPilotOwnerSessionIssueResult> {
      assertIssueInput(input);

      const issuedAtDate = validateNow(now);
      const issuedAt = issuedAtDate.toISOString();

      const expiresAt = new Date(
        issuedAtDate.getTime() +
        input.ttlSeconds * 1_000,
      ).toISOString();

      const sessionId =
        `session-${
          createSecureBytes(
            randomBytes,
            16,
          ).toString("hex")
        }`;

      const sessionToken =
        createSecureBytes(
          randomBytes,
          32,
        ).toString("base64url");

      const csrfToken =
        createSecureBytes(
          randomBytes,
          32,
        ).toString("base64url");

      const sessionTokenDigest =
        createInternalPilotSessionTokenDigest(
          sessionToken,
        );

      const csrfTokenDigest =
        createInternalPilotCsrfDigest(
          csrfToken,
        );

      await executeTransaction(
        runtime,
        "SESSION_INSERT_FAILED",
        "The internal pilot session could not be issued safely.",
        async (client) => {
          const result =
            await client.query<IssuedSessionRow>(
              INSERT_SESSION_SQL,
              [
                runtime.tenantId,
                sessionId,
                sessionTokenDigest,
                input.actorId,
                csrfTokenDigest,
                expiresAt,
                issuedAt,
              ],
            );

          assertQueryResult(result, [1]);

          parseIssuedRow(
            result.rows[0],
            {
              tenantId: runtime.tenantId,
              sessionId,
              actorId: input.actorId,
              expiresAt,
            },
          );
        },
      );

      return Object.freeze({
        tenantId: runtime.tenantId,
        sessionId,
        actorId: input.actorId,
        role: "owner" as const,
        ownerApprovalGranted: true as const,
        sessionToken,
        csrfToken,
        sessionTokenDigest,
        csrfTokenDigest,
        cookieName,
        setCookieHeader:
          `${cookieName}=${sessionToken}; ` +
          "Path=/; HttpOnly; Secure; " +
          "SameSite=Strict; " +
          `Max-Age=${input.ttlSeconds}`,
        issuedAt,
        expiresAt,
      });
    },

    async revoke(
      input: InternalPilotOwnerSessionRevokeInput,
    ): Promise<InternalPilotOwnerSessionRevokeResult> {
      assertRevokeInput(input);

      const revokedAt =
        validateNow(now).toISOString();

      return executeTransaction(
        runtime,
        "SESSION_REVOKE_FAILED",
        "The internal pilot session could not be revoked safely.",
        async (client) => {
          const updateResult =
            await client.query<RevokedSessionRow>(
              REVOKE_SESSION_SQL,
              [
                runtime.tenantId,
                input.sessionId,
                input.actorId,
                revokedAt,
              ],
            );

          const updated =
            assertQueryResult(
              updateResult,
              [0, 1],
            );

          if (updated === 1) {
            const storedRevokedAt =
              parseRevokedRow(
                updateResult.rows[0],
                {
                  tenantId:
                    runtime.tenantId,
                  sessionId:
                    input.sessionId,
                  actorId:
                    input.actorId,
                },
              );

            return Object.freeze({
              tenantId:
                runtime.tenantId,
              sessionId:
                input.sessionId,
              actorId:
                input.actorId,
              revoked: true as const,
              replay: false,
              revokedAt:
                storedRevokedAt,
            });
          }

          const readResult =
            await client.query<RevokedSessionRow>(
              READ_REVOKED_SESSION_SQL,
              [
                runtime.tenantId,
                input.sessionId,
                input.actorId,
              ],
            );

          const found =
            assertQueryResult(
              readResult,
              [0, 1],
            );

          if (found === 0) {
            throw lifecycleError(
              "SESSION_NOT_FOUND",
              "The internal pilot session was not found.",
            );
          }

          const storedRevokedAt =
            parseRevokedRow(
              readResult.rows[0],
              {
                tenantId:
                  runtime.tenantId,
                sessionId:
                  input.sessionId,
                actorId:
                  input.actorId,
              },
            );

          return Object.freeze({
            tenantId:
              runtime.tenantId,
            sessionId:
              input.sessionId,
            actorId:
              input.actorId,
            revoked: true as const,
            replay: true,
            revokedAt:
              storedRevokedAt,
          });
        },
      );
    },
  };
}
