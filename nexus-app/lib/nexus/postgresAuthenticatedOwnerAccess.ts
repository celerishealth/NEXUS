import {
  createHash,
  randomBytes as nodeRandomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export type PostgresAuthenticatedOwnerAccessErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_INPUT"
  | "OWNER_APPROVAL_REQUIRED"
  | "OWNER_AUTHORITY_REQUIRED"
  | "CREDENTIAL_ACTIVATION_FAILED"
  | "AUTHENTICATION_FAILED"
  | "PRINCIPAL_LOCKED"
  | "SESSION_ISSUANCE_FAILED"
  | "SESSION_NOT_FOUND"
  | "SESSION_INVALID"
  | "SESSION_REVOKED"
  | "SESSION_EXPIRED"
  | "AUTHORITY_EPOCH_CHANGED"
  | "SESSION_REVOCATION_FAILED";

export class PostgresAuthenticatedOwnerAccessError
  extends Error {
  readonly code:
    PostgresAuthenticatedOwnerAccessErrorCode;

  readonly lockedUntil?: string;

  constructor(
    code:
      PostgresAuthenticatedOwnerAccessErrorCode,
    message: string,
    lockedUntil?: string,
  ) {
    super(message);
    this.name =
      "PostgresAuthenticatedOwnerAccessError";
    this.code = code;
    this.lockedUntil = lockedUntil;
  }
}

export interface PostgresAuthenticatedOwnerAccessQueryResult<
  Row extends Record<string, unknown>,
> {
  rows: Row[];
  rowCount: number | null;
}

export interface PostgresAuthenticatedOwnerAccessClient {
  query<Row extends Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<
    PostgresAuthenticatedOwnerAccessQueryResult<Row>
  >;
}

export type WithPostgresAuthenticatedOwnerAccessTransaction =
  <Result>(
    operation: (
      client:
        PostgresAuthenticatedOwnerAccessClient,
    ) => Promise<Result>,
  ) => Promise<Result>;

export interface ActivateAuthenticatedOwnerCredentialInput {
  ownerId: string;
  email: string;
  password: string;
  ownerApprovalGranted: true;
  activatedAt: string;
}

export interface AuthenticateAuthenticatedOwnerInput {
  email: string;
  password: string;
  ttlSeconds: number;
  authenticatedAt: string;
}

export interface ResolveAuthenticatedOwnerSessionInput {
  sessionToken: string;
  resolvedAt: string;
}

export interface RevokeAuthenticatedOwnerSessionInput {
  sessionToken: string;
  revokedAt: string;
}

export interface ActivatedAuthenticatedOwnerCredential {
  tenantId: string;
  ownerId: string;
  emailNormalized: string;
  status: "ACTIVE";
  credentialVersion: number;
}

export interface IssuedAuthenticatedOwnerSession {
  tenantId: string;
  ownerId: string;
  role: "OWNER";
  authorityEpoch: string;
  sessionId: string;
  sessionToken: string;
  sessionTokenDigest: string;
  issuedAt: string;
  expiresAt: string;
}

export interface ResolvedAuthenticatedOwnerSession {
  authenticated: true;
  tenantId: string;
  ownerId: string;
  role: "OWNER";
  authorityEpoch: string;
  sessionId: string;
  expiresAt: string;
}

export interface RevokedAuthenticatedOwnerSession {
  tenantId: string;
  ownerId: string;
  sessionId: string;
  revoked: true;
  revokedAt: string;
}

export interface PostgresAuthenticatedOwnerAccessRuntime {
  tenantId: string;
  withTransaction:
    WithPostgresAuthenticatedOwnerAccessTransaction;
  randomBytes?: (size: number) => Buffer;
}

export interface PostgresAuthenticatedOwnerAccess {
  activateCredential(
    input:
      ActivateAuthenticatedOwnerCredentialInput,
  ): Promise<
    ActivatedAuthenticatedOwnerCredential
  >;

  authenticateAndIssueSession(
    input:
      AuthenticateAuthenticatedOwnerInput,
  ): Promise<IssuedAuthenticatedOwnerSession>;

  resolveSession(
    input:
      ResolveAuthenticatedOwnerSessionInput,
  ): Promise<ResolvedAuthenticatedOwnerSession>;

  revokeSession(
    input:
      RevokeAuthenticatedOwnerSessionInput,
  ): Promise<RevokedAuthenticatedOwnerSession>;
}

interface CredentialRow
  extends Record<string, unknown> {
  tenant_id: unknown;
  owner_id: unknown;
  email_normalized: unknown;
  password_salt_hex: unknown;
  password_hash_hex: unknown;
  credential_status: unknown;
  credential_version: unknown;
  failed_attempt_count: unknown;
  locked_until: unknown;
  tenant_status: unknown;
  owner_status: unknown;
  membership_status: unknown;
  membership_role: unknown;
  authority_epoch: unknown;
}

interface ActivatedCredentialRow
  extends Record<string, unknown> {
  tenant_id: unknown;
  owner_id: unknown;
  email_normalized: unknown;
  status: unknown;
  credential_version: unknown;
}

interface IssuedSessionRow
  extends Record<string, unknown> {
  tenant_id: unknown;
  owner_id: unknown;
  session_id: unknown;
  authority_epoch: unknown;
  role: unknown;
  expires_at: unknown;
  revoked_at: unknown;
}

interface SessionResolutionRow
  extends Record<string, unknown> {
  tenant_id: unknown;
  owner_id: unknown;
  session_id: unknown;
  stored_authority_epoch: unknown;
  current_authority_epoch: unknown;
  role: unknown;
  expires_at: unknown;
  revoked_at: unknown;
  tenant_status: unknown;
  owner_status: unknown;
  membership_status: unknown;
  membership_role: unknown;
}

interface RevokedSessionRow
  extends Record<string, unknown> {
  tenant_id: unknown;
  owner_id: unknown;
  session_id: unknown;
  revoked_at: unknown;
}

const PASSWORD_SALT_BYTES = 16;
const PASSWORD_HASH_BYTES = 32;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const MIN_SESSION_TTL_SECONDS = 300;
const MAX_SESSION_TTL_SECONDS = 86_400;

const ACTIVATE_CREDENTIAL_SQL = `
/* nexus-launch-enable:credential-insert */
INSERT INTO nexus_authenticated_owner_credentials (
  tenant_id,
  owner_id,
  email_normalized,
  password_salt_hex,
  password_hash_hex,
  status,
  credential_version,
  failed_attempt_count,
  locked_until,
  last_authenticated_at,
  created_at,
  updated_at
)
SELECT
  membership.tenant_id,
  membership.owner_id,
  $3,
  $4,
  $5,
  'ACTIVE',
  1,
  0,
  NULL,
  NULL,
  $6::timestamptz,
  $6::timestamptz
FROM nexus_tenant_owner_membership AS membership
INNER JOIN nexus_tenant AS tenant
  ON tenant.tenant_id = membership.tenant_id
INNER JOIN nexus_owner_identity AS owner_identity
  ON owner_identity.owner_id = membership.owner_id
WHERE membership.tenant_id = $1
  AND membership.owner_id = $2
  AND tenant.status = 'ACTIVE'
  AND owner_identity.status = 'ACTIVE'
  AND membership.status = 'ACTIVE'
  AND membership.role = 'OWNER'
  AND length(trim(membership.authority_epoch)) > 0
ON CONFLICT DO NOTHING
RETURNING
  tenant_id,
  owner_id,
  email_normalized,
  status,
  credential_version
`;

const READ_CREDENTIAL_SQL = `
/* nexus-launch-enable:credential-read */
SELECT
  credential.tenant_id,
  credential.owner_id,
  credential.email_normalized,
  credential.password_salt_hex,
  credential.password_hash_hex,
  credential.status AS credential_status,
  credential.credential_version,
  credential.failed_attempt_count,
  credential.locked_until,
  tenant.status AS tenant_status,
  owner_identity.status AS owner_status,
  membership.status AS membership_status,
  membership.role AS membership_role,
  membership.authority_epoch
FROM nexus_authenticated_owner_credentials
  AS credential
INNER JOIN nexus_tenant_owner_membership
  AS membership
  ON membership.tenant_id = credential.tenant_id
  AND membership.owner_id = credential.owner_id
INNER JOIN nexus_tenant AS tenant
  ON tenant.tenant_id = membership.tenant_id
INNER JOIN nexus_owner_identity AS owner_identity
  ON owner_identity.owner_id = membership.owner_id
WHERE credential.tenant_id = $1
  AND credential.email_normalized = $2
LIMIT 1
FOR UPDATE
`;

const RECORD_AUTHENTICATION_FAILURE_SQL = `
/* nexus-launch-enable:credential-failure */
UPDATE nexus_authenticated_owner_credentials
SET
  failed_attempt_count = $1,
  locked_until = $2::timestamptz,
  updated_at = $3::timestamptz
WHERE tenant_id = $4
  AND owner_id = $5
`;

const RECORD_AUTHENTICATION_SUCCESS_SQL = `
/* nexus-launch-enable:credential-success */
UPDATE nexus_authenticated_owner_credentials
SET
  failed_attempt_count = 0,
  locked_until = NULL,
  last_authenticated_at = $1::timestamptz,
  updated_at = $1::timestamptz
WHERE tenant_id = $2
  AND owner_id = $3
`;

const INSERT_SESSION_SQL = `
/* nexus-launch-enable:session-insert */
INSERT INTO nexus_authenticated_owner_sessions (
  tenant_id,
  session_id,
  session_digest,
  owner_id,
  authority_epoch,
  role,
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
  $5,
  'OWNER',
  $6::timestamptz,
  NULL,
  $7::timestamptz,
  $7::timestamptz
)
RETURNING
  tenant_id,
  owner_id,
  session_id,
  authority_epoch,
  role,
  expires_at,
  revoked_at
`;

const RESOLVE_SESSION_SQL = `
/* nexus-launch-enable:session-resolve */
SELECT
  session.tenant_id,
  session.owner_id,
  session.session_id,
  session.authority_epoch
    AS stored_authority_epoch,
  membership.authority_epoch
    AS current_authority_epoch,
  session.role,
  session.expires_at,
  session.revoked_at,
  tenant.status AS tenant_status,
  owner_identity.status AS owner_status,
  membership.status AS membership_status,
  membership.role AS membership_role
FROM nexus_authenticated_owner_sessions AS session
INNER JOIN nexus_tenant_owner_membership
  AS membership
  ON membership.tenant_id = session.tenant_id
  AND membership.owner_id = session.owner_id
INNER JOIN nexus_tenant AS tenant
  ON tenant.tenant_id = membership.tenant_id
INNER JOIN nexus_owner_identity AS owner_identity
  ON owner_identity.owner_id = membership.owner_id
WHERE session.tenant_id = $1
  AND session.session_digest = $2
LIMIT 1
`;

const REVOKE_SESSION_SQL = `
/* nexus-launch-enable:session-revoke */
UPDATE nexus_authenticated_owner_sessions
SET
  revoked_at = COALESCE(
    revoked_at,
    $1::timestamptz
  ),
  updated_at = $1::timestamptz
WHERE tenant_id = $2
  AND session_digest = $3
RETURNING
  tenant_id,
  owner_id,
  session_id,
  revoked_at
`;

function accessError(
  code: PostgresAuthenticatedOwnerAccessErrorCode,
  message: string,
  lockedUntil?: string,
): PostgresAuthenticatedOwnerAccessError {
  return new PostgresAuthenticatedOwnerAccessError(
    code,
    message,
    lockedUntil,
  );
}

async function executeTransaction<Result>(
  runtime:
    PostgresAuthenticatedOwnerAccessRuntime,
  failureCode:
    PostgresAuthenticatedOwnerAccessErrorCode,
  failureMessage: string,
  operation: (
    client:
      PostgresAuthenticatedOwnerAccessClient,
  ) => Promise<Result>,
): Promise<Result> {
  try {
    return await runtime.withTransaction(
      operation,
    );
  } catch (error) {
    if (
      error instanceof
      PostgresAuthenticatedOwnerAccessError
    ) {
      throw error;
    }

    throw accessError(
      failureCode,
      failureMessage,
    );
  }
}

function requireText(
  value: unknown,
  name: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw accessError(
      "INVALID_INPUT",
      `${name} is required.`,
    );
  }

  return value.trim();
}

function normalizeEmail(
  value: unknown,
): string {
  const normalized =
    requireText(
      value,
      "Owner email",
    ).toLowerCase();

  if (
    normalized.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalized,
    )
  ) {
    throw accessError(
      "INVALID_INPUT",
      "Owner email is invalid.",
    );
  }

  return normalized;
}

function validatePassword(
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value.length < 12 ||
    value.length > 128
  ) {
    throw accessError(
      "INVALID_INPUT",
      "Owner password must contain between 12 and 128 characters.",
    );
  }

  return value;
}

function normalizeTimestamp(
  value: unknown,
  name: string,
  errorCode:
    PostgresAuthenticatedOwnerAccessErrorCode =
      "INVALID_INPUT",
  errorMessage:
    string = `${name} is invalid.`,
): string {
  const parsed =
    value instanceof Date
      ? new Date(
          value.getTime(),
        )
      : typeof value === "string"
        ? new Date(value)
        : null;

  if (
    parsed === null ||
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    throw accessError(
      errorCode,
      errorMessage,
    );
  }

  return parsed.toISOString();
}

function parseTimestamp(
  value: unknown,
  name: string,
): number {
  return Date.parse(
    normalizeTimestamp(
      value,
      name,
    ),
  );
}

function requirePositiveInteger(
  value: unknown,
  name: string,
): number {
  if (
    !Number.isSafeInteger(value) ||
    Number(value) <= 0
  ) {
    throw accessError(
      "INVALID_INPUT",
      `${name} is invalid.`,
    );
  }

  return Number(value);
}

function requireRowCount(
  value: number | null,
  allowed: readonly number[],
  code:
    PostgresAuthenticatedOwnerAccessErrorCode,
  message: string,
): number {
  if (
    value === null ||
    !allowed.includes(value)
  ) {
    throw accessError(
      code,
      message,
    );
  }

  return value;
}

function createPasswordHash(
  password: string,
  saltHex: string,
): string {
  return scryptSync(
    password,
    Buffer.from(
      saltHex,
      "hex",
    ),
    PASSWORD_HASH_BYTES,
    {
      N: 16_384,
      r: 8,
      p: 1,
      maxmem:
        64 * 1024 * 1024,
    },
  ).toString("hex");
}

function consumeDummyPasswordWork(
  password: string,
): void {
  createPasswordHash(
    password,
    "00000000000000000000000000000000",
  );
}

function secureHashEquals(
  suppliedHex: string,
  storedHex: string,
): boolean {
  const supplied =
    Buffer.from(
      suppliedHex,
      "hex",
    );

  const stored =
    Buffer.from(
      storedHex,
      "hex",
    );

  return (
    supplied.length === stored.length &&
    timingSafeEqual(
      supplied,
      stored,
    )
  );
}

function createSessionDigest(
  sessionToken: string,
): string {
  return createHash("sha256")
    .update(
      sessionToken,
      "utf8",
    )
    .digest("hex");
}

function requireRandomBytes(
  randomBytes: (size: number) => Buffer,
  size: number,
): Buffer {
  const value =
    randomBytes(size);

  if (
    !Buffer.isBuffer(value) ||
    value.length !== size
  ) {
    throw accessError(
      "INVALID_CONFIGURATION",
      "Secure randomness returned an invalid result.",
    );
  }

  return value;
}

function parseCredentialRow(
  row: CredentialRow,
): {
  tenantId: string;
  ownerId: string;
  passwordSaltHex: string;
  passwordHashHex: string;
  failedAttemptCount: number;
  lockedUntil: string | null;
  authorityEpoch: string;
  authorityActive: boolean;
} {
  const tenantId =
    requireText(
      row.tenant_id,
      "Stored credential tenant ID",
    );

  const ownerId =
    requireText(
      row.owner_id,
      "Stored credential owner ID",
    );

  const passwordSaltHex =
    requireText(
      row.password_salt_hex,
      "Stored password salt",
    );

  const passwordHashHex =
    requireText(
      row.password_hash_hex,
      "Stored password hash",
    );

  if (
    !/^[a-f0-9]{32}$/.test(
      passwordSaltHex,
    ) ||
    !/^[a-f0-9]{64}$/.test(
      passwordHashHex,
    )
  ) {
    throw accessError(
      "AUTHENTICATION_FAILED",
      "Authentication failed.",
    );
  }

  const failedAttemptCount =
    Number(
      row.failed_attempt_count,
    );

  if (
    !Number.isSafeInteger(
      failedAttemptCount,
    ) ||
    failedAttemptCount < 0 ||
    failedAttemptCount >
      MAX_FAILED_ATTEMPTS
  ) {
    throw accessError(
      "AUTHENTICATION_FAILED",
      "Authentication failed.",
    );
  }

  const lockedUntil =
    row.locked_until === null
      ? null
      : normalizeTimestamp(
          row.locked_until,
          "Stored credential lock time",
          "AUTHENTICATION_FAILED",
          "Authentication failed.",
        );

  const authorityEpoch =
    typeof row.authority_epoch === "string"
      ? row.authority_epoch.trim()
      : "";

  const authorityActive =
    row.credential_status === "ACTIVE" &&
    row.tenant_status === "ACTIVE" &&
    row.owner_status === "ACTIVE" &&
    row.membership_status === "ACTIVE" &&
    row.membership_role === "OWNER" &&
    authorityEpoch.length > 0;

  return {
    tenantId,
    ownerId,
    passwordSaltHex,
    passwordHashHex,
    failedAttemptCount,
    lockedUntil,
    authorityEpoch,
    authorityActive,
  };
}

function parseSessionRow(
  row: SessionResolutionRow,
  expectedTenantId: string,
  resolvedAtMs: number,
): ResolvedAuthenticatedOwnerSession {
  const tenantId =
    requireText(
      row.tenant_id,
      "Stored session tenant ID",
    );

  const ownerId =
    requireText(
      row.owner_id,
      "Stored session owner ID",
    );

  const sessionId =
    requireText(
      row.session_id,
      "Stored session ID",
    );

  const storedAuthorityEpoch =
    requireText(
      row.stored_authority_epoch,
      "Stored session authority epoch",
    );

  const currentAuthorityEpoch =
    requireText(
      row.current_authority_epoch,
      "Current owner authority epoch",
    );

  const expiresAt =
    normalizeTimestamp(
      row.expires_at,
      "Stored session expiry",
      "SESSION_INVALID",
      "Authenticated owner session is invalid.",
    );

  if (
    tenantId !== expectedTenantId ||
    row.role !== "OWNER" ||
    row.tenant_status !== "ACTIVE" ||
    row.owner_status !== "ACTIVE" ||
    row.membership_status !== "ACTIVE" ||
    row.membership_role !== "OWNER"
  ) {
    throw accessError(
      "SESSION_INVALID",
      "Authenticated owner session is invalid.",
    );
  }

  if (row.revoked_at !== null) {
    throw accessError(
      "SESSION_REVOKED",
      "Authenticated owner session has been revoked.",
    );
  }

  if (
    parseTimestamp(
      expiresAt,
      "Stored session expiry",
    ) <= resolvedAtMs
  ) {
    throw accessError(
      "SESSION_EXPIRED",
      "Authenticated owner session has expired.",
    );
  }

  if (
    storedAuthorityEpoch !==
    currentAuthorityEpoch
  ) {
    throw accessError(
      "AUTHORITY_EPOCH_CHANGED",
      "Authenticated owner authority has changed.",
    );
  }

  return Object.freeze({
    authenticated: true as const,
    tenantId,
    ownerId,
    role: "OWNER" as const,
    authorityEpoch:
      currentAuthorityEpoch,
    sessionId,
    expiresAt,
  });
}

function validateRuntime(
  runtime:
    PostgresAuthenticatedOwnerAccessRuntime,
): void {
  requireText(
    runtime?.tenantId,
    "Runtime tenant ID",
  );

  if (
    !runtime ||
    typeof runtime.withTransaction !==
      "function"
  ) {
    throw accessError(
      "INVALID_CONFIGURATION",
      "Postgres authenticated owner transaction runtime is unavailable.",
    );
  }

  if (
    runtime.randomBytes !== undefined &&
    typeof runtime.randomBytes !==
      "function"
  ) {
    throw accessError(
      "INVALID_CONFIGURATION",
      "Secure randomness is invalid.",
    );
  }
}

export function createPostgresAuthenticatedOwnerAccess(
  runtime:
    PostgresAuthenticatedOwnerAccessRuntime,
): PostgresAuthenticatedOwnerAccess {
  validateRuntime(runtime);

  const tenantId =
    requireText(
      runtime.tenantId,
      "Runtime tenant ID",
    );

  const randomBytes =
    runtime.randomBytes ??
    nodeRandomBytes;

  return {
    async activateCredential(
      input:
        ActivateAuthenticatedOwnerCredentialInput,
    ): Promise<
      ActivatedAuthenticatedOwnerCredential
    > {
      if (
        input.ownerApprovalGranted !== true
      ) {
        throw accessError(
          "OWNER_APPROVAL_REQUIRED",
          "Owner approval is required before credential activation.",
        );
      }

      const ownerId =
        requireText(
          input.ownerId,
          "Owner ID",
        );

      const emailNormalized =
        normalizeEmail(
          input.email,
        );

      const password =
        validatePassword(
          input.password,
        );

      parseTimestamp(
        input.activatedAt,
        "Credential activation time",
      );

      const saltHex =
        requireRandomBytes(
          randomBytes,
          PASSWORD_SALT_BYTES,
        ).toString("hex");

      const passwordHashHex =
        createPasswordHash(
          password,
          saltHex,
        );

      return executeTransaction(
        runtime,
        "CREDENTIAL_ACTIVATION_FAILED",
        "Owner credential storage is unavailable.",
        async (client) => {
          const result =
            await client.query<
              ActivatedCredentialRow
            >(
              ACTIVATE_CREDENTIAL_SQL,
              [
                tenantId,
                ownerId,
                emailNormalized,
                saltHex,
                passwordHashHex,
                input.activatedAt,
              ],
            );

          requireRowCount(
            result.rowCount,
            [1],
            "CREDENTIAL_ACTIVATION_FAILED",
            "Owner credential could not be activated safely.",
          );

          const row =
            result.rows[0];

          if (
            !row ||
            row.tenant_id !== tenantId ||
            row.owner_id !== ownerId ||
            row.email_normalized !==
              emailNormalized ||
            row.status !== "ACTIVE" ||
            row.credential_version !== 1
          ) {
            throw accessError(
              "CREDENTIAL_ACTIVATION_FAILED",
              "Owner credential activation returned invalid evidence.",
            );
          }

          return Object.freeze({
            tenantId,
            ownerId,
            emailNormalized,
            status: "ACTIVE" as const,
            credentialVersion: 1,
          });
        },
      );
    },

    async authenticateAndIssueSession(
      input:
        AuthenticateAuthenticatedOwnerInput,
    ): Promise<IssuedAuthenticatedOwnerSession> {
      const emailNormalized =
        normalizeEmail(
          input.email,
        );

      const password =
        validatePassword(
          input.password,
        );

      const authenticatedAtMs =
        parseTimestamp(
          input.authenticatedAt,
          "Authentication time",
        );

      const ttlSeconds =
        requirePositiveInteger(
          input.ttlSeconds,
          "Session TTL",
        );

      if (
        ttlSeconds <
          MIN_SESSION_TTL_SECONDS ||
        ttlSeconds >
          MAX_SESSION_TTL_SECONDS
      ) {
        throw accessError(
          "INVALID_INPUT",
          "Session TTL is outside the controlled range.",
        );
      }

      const sessionId =
        `session-${
          requireRandomBytes(
            randomBytes,
            16,
          ).toString("hex")
        }`;

      const sessionToken =
        requireRandomBytes(
          randomBytes,
          32,
        ).toString("base64url");

      const sessionTokenDigest =
        createSessionDigest(
          sessionToken,
        );

      const expiresAt =
        new Date(
          authenticatedAtMs +
          ttlSeconds * 1_000,
        ).toISOString();

      const outcome =
        await executeTransaction(
          runtime,
          "AUTHENTICATION_FAILED",
          "Authentication service is unavailable.",
          async (client) => {
            const credentialResult =
              await client.query<
                CredentialRow
              >(
                READ_CREDENTIAL_SQL,
                [
                  tenantId,
                  emailNormalized,
                ],
              );

            requireRowCount(
              credentialResult.rowCount,
              [0, 1],
              "AUTHENTICATION_FAILED",
              "Authentication failed.",
            );

            const rawRow =
              credentialResult.rows[0];

            if (!rawRow) {
              consumeDummyPasswordWork(
                password,
              );

              return {
                state:
                  "AUTHENTICATION_FAILED" as const,
              };
            }

            const credential =
              parseCredentialRow(
                rawRow,
              );

            const lockedUntilMs =
              credential.lockedUntil === null
                ? null
                : parseTimestamp(
                    credential.lockedUntil,
                    "Stored credential lock time",
                  );

            if (
              lockedUntilMs !== null &&
              lockedUntilMs >
                authenticatedAtMs
            ) {
              consumeDummyPasswordWork(
                password,
              );

              return {
                state:
                  "PRINCIPAL_LOCKED" as const,
                lockedUntil:
                  credential.lockedUntil,
              };
            }

            const suppliedHash =
              createPasswordHash(
                password,
                credential.passwordSaltHex,
              );

            const passwordMatches =
              secureHashEquals(
                suppliedHash,
                credential.passwordHashHex,
              );

            if (
              !credential.authorityActive ||
              !passwordMatches
            ) {
              const previousFailures =
                lockedUntilMs !== null &&
                lockedUntilMs <=
                  authenticatedAtMs
                  ? 0
                  : credential
                      .failedAttemptCount;

              const nextFailureCount =
                Math.min(
                  MAX_FAILED_ATTEMPTS,
                  previousFailures + 1,
                );

              const nextLockedUntil =
                nextFailureCount >=
                MAX_FAILED_ATTEMPTS
                  ? new Date(
                      authenticatedAtMs +
                      LOCK_DURATION_MS,
                    ).toISOString()
                  : null;

              const failureResult =
                await client.query(
                  RECORD_AUTHENTICATION_FAILURE_SQL,
                  [
                    nextFailureCount,
                    nextLockedUntil,
                    input.authenticatedAt,
                    tenantId,
                    credential.ownerId,
                  ],
                );

              requireRowCount(
                failureResult.rowCount,
                [1],
                "AUTHENTICATION_FAILED",
                "Authentication failed.",
              );

              return nextLockedUntil
                ? {
                    state:
                      "PRINCIPAL_LOCKED" as const,
                    lockedUntil:
                      nextLockedUntil,
                  }
                : {
                    state:
                      "AUTHENTICATION_FAILED" as const,
                  };
            }

            const successResult =
              await client.query(
                RECORD_AUTHENTICATION_SUCCESS_SQL,
                [
                  input.authenticatedAt,
                  tenantId,
                  credential.ownerId,
                ],
              );

            requireRowCount(
              successResult.rowCount,
              [1],
              "AUTHENTICATION_FAILED",
              "Authentication failed.",
            );

            const sessionResult =
              await client.query<
                IssuedSessionRow
              >(
                INSERT_SESSION_SQL,
                [
                  tenantId,
                  sessionId,
                  sessionTokenDigest,
                  credential.ownerId,
                  credential.authorityEpoch,
                  expiresAt,
                  input.authenticatedAt,
                ],
              );

            requireRowCount(
              sessionResult.rowCount,
              [1],
              "SESSION_ISSUANCE_FAILED",
              "Authenticated owner session could not be issued safely.",
            );

            const sessionRow =
              sessionResult.rows[0];

            const returnedExpiresAt =
              sessionRow
                ? normalizeTimestamp(
                    sessionRow.expires_at,
                    "Returned session expiry",
                    "SESSION_ISSUANCE_FAILED",
                    "Authenticated owner session returned invalid evidence.",
                  )
                : null;

            if (
              !sessionRow ||
              sessionRow.tenant_id !==
                tenantId ||
              sessionRow.owner_id !==
                credential.ownerId ||
              sessionRow.session_id !==
                sessionId ||
              sessionRow.authority_epoch !==
                credential.authorityEpoch ||
              sessionRow.role !== "OWNER" ||
              returnedExpiresAt !==
                expiresAt ||
              sessionRow.revoked_at !== null
            ) {
              throw accessError(
                "SESSION_ISSUANCE_FAILED",
                "Authenticated owner session returned invalid evidence.",
              );
            }

            return {
              state:
                "AUTHENTICATED" as const,
              ownerId:
                credential.ownerId,
              authorityEpoch:
                credential.authorityEpoch,
            };
          },
        );

      if (
        outcome.state ===
        "AUTHENTICATION_FAILED"
      ) {
        throw accessError(
          "AUTHENTICATION_FAILED",
          "Authentication failed.",
        );
      }

      if (
        outcome.state ===
        "PRINCIPAL_LOCKED"
      ) {
        throw accessError(
          "PRINCIPAL_LOCKED",
          "Authenticated owner principal is temporarily locked.",
          outcome.lockedUntil ??
            undefined,
        );
      }

      return Object.freeze({
        tenantId,
        ownerId:
          outcome.ownerId,
        role: "OWNER" as const,
        authorityEpoch:
          outcome.authorityEpoch,
        sessionId,
        sessionToken,
        sessionTokenDigest,
        issuedAt:
          input.authenticatedAt,
        expiresAt,
      });
    },

    async resolveSession(
      input:
        ResolveAuthenticatedOwnerSessionInput,
    ): Promise<ResolvedAuthenticatedOwnerSession> {
      const sessionToken =
        requireText(
          input.sessionToken,
          "Session token",
        );

      const resolvedAtMs =
        parseTimestamp(
          input.resolvedAt,
          "Session resolution time",
        );

      const digest =
        createSessionDigest(
          sessionToken,
        );

      return executeTransaction(
        runtime,
        "SESSION_INVALID",
        "Authenticated owner session service is unavailable.",
        async (client) => {
          const result =
            await client.query<
              SessionResolutionRow
            >(
              RESOLVE_SESSION_SQL,
              [
                tenantId,
                digest,
              ],
            );

          requireRowCount(
            result.rowCount,
            [0, 1],
            "SESSION_INVALID",
            "Authenticated owner session is invalid.",
          );

          const row =
            result.rows[0];

          if (!row) {
            throw accessError(
              "SESSION_NOT_FOUND",
              "Authenticated owner session was not found.",
            );
          }

          return parseSessionRow(
            row,
            tenantId,
            resolvedAtMs,
          );
        },
      );
    },

    async revokeSession(
      input:
        RevokeAuthenticatedOwnerSessionInput,
    ): Promise<RevokedAuthenticatedOwnerSession> {
      const sessionToken =
        requireText(
          input.sessionToken,
          "Session token",
        );

      parseTimestamp(
        input.revokedAt,
        "Session revocation time",
      );

      const digest =
        createSessionDigest(
          sessionToken,
        );

      return executeTransaction(
        runtime,
        "SESSION_REVOCATION_FAILED",
        "Authenticated owner session revocation service is unavailable.",
        async (client) => {
          const result =
            await client.query<
              RevokedSessionRow
            >(
              REVOKE_SESSION_SQL,
              [
                input.revokedAt,
                tenantId,
                digest,
              ],
            );

          requireRowCount(
            result.rowCount,
            [1],
            "SESSION_REVOCATION_FAILED",
            "Authenticated owner session could not be revoked safely.",
          );

          const row =
            result.rows[0];

          const revokedAt =
            row
              ? normalizeTimestamp(
                  row.revoked_at,
                  "Returned session revocation time",
                  "SESSION_REVOCATION_FAILED",
                  "Authenticated owner session revocation returned invalid evidence.",
                )
              : null;

          if (
            !row ||
            row.tenant_id !== tenantId ||
            typeof row.owner_id !==
              "string" ||
            typeof row.session_id !==
              "string" ||
            revokedAt === null
          ) {
            throw accessError(
              "SESSION_REVOCATION_FAILED",
              "Authenticated owner session revocation returned invalid evidence.",
            );
          }

          return Object.freeze({
            tenantId,
            ownerId:
              row.owner_id,
            sessionId:
              row.session_id,
            revoked: true as const,
            revokedAt,
          });
        },
      );
    },
  };
}
