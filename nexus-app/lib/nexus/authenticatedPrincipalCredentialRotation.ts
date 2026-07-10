import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import {
  AuthenticatedTenantSessionClaims,
} from "./sqliteAuthenticatedTenantSessionStore";

interface SQLiteRunResult {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}

interface SQLiteStatement {
  get(
    ...parameters: unknown[]
  ): Record<string, unknown> | undefined;

  run(
    ...parameters: unknown[]
  ): SQLiteRunResult;
}

interface SQLiteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SQLiteStatement;
  close(): void;
}

interface SQLiteModule {
  DatabaseSync: new (
    path: string,
  ) => SQLiteDatabase;
}

export interface RotateAuthenticatedPrincipalCredentialRequest {
  databasePath: string;
  claims: AuthenticatedTenantSessionClaims;
  currentPassword: string;
  newPassword: string;
  changedAt: string;
}

export interface AuthenticatedPrincipalCredentialRotationResult {
  passwordChanged: true;
  tenantId: string;
  actorId: string;
  role: string;
  credentialVersion: number;
  sessionsRevoked: number;
  changedAt: string;
  reauthenticationRequired: true;
  liveProviderExecutionAuthorized: false;
}

export class AuthenticatedCredentialRotationError
  extends Error {
  constructor() {
    super("Credential rotation failed.");
    this.name =
      "AuthenticatedCredentialRotationError";
  }
}

const PASSWORD_HASH_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

function requireNonEmpty(
  value: string,
  fieldName: string,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new Error(
      `${fieldName} is required.`,
    );
  }

  return normalized;
}

function validatePassword(
  value: string,
  fieldName: string,
): string {
  if (
    typeof value !== "string" ||
    value.length < 12 ||
    value.length > 256
  ) {
    throw new Error(
      `${fieldName} must contain between 12 and 256 characters.`,
    );
  }

  return value;
}

function parseTimestamp(
  value: string,
  fieldName: string,
): number {
  const timestamp =
    Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(
      `${fieldName} must be a valid timestamp.`,
    );
  }

  return timestamp;
}

function loadSQLiteModule():
  SQLiteModule {
  try {
    const runtimeRequire =
      eval("require") as NodeRequire;

    return runtimeRequire(
      "node:" + "sqlite",
    ) as SQLiteModule;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown SQLite runtime failure.";

    throw new Error(
      `Node SQLite runtime is unavailable: ${message}`,
    );
  }
}

function hashPassword(
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
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      maxmem:
        64 * 1024 * 1024,
    },
  ).toString("hex");
}

function secureHashEquals(
  actualHex: string,
  expectedHex: string,
): boolean {
  if (
    !/^[a-f0-9]{64}$/i.test(
      actualHex,
    ) ||
    !/^[a-f0-9]{64}$/i.test(
      expectedHex,
    )
  ) {
    return false;
  }

  const actual =
    Buffer.from(
      actualHex,
      "hex",
    );

  const expected =
    Buffer.from(
      expectedHex,
      "hex",
    );

  return (
    actual.length ===
      expected.length &&
    timingSafeEqual(
      actual,
      expected,
    )
  );
}

function readString(
  row: Record<string, unknown>,
  fieldName: string,
): string {
  const value =
    row[fieldName];

  if (
    typeof value !== "string"
  ) {
    throw new Error(
      `SQLite credential-rotation field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function readInteger(
  row: Record<string, unknown>,
  fieldName: string,
): number {
  const value =
    row[fieldName];

  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value)
  ) {
    throw new Error(
      `SQLite credential-rotation field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function changesAsNumber(
  result: SQLiteRunResult,
): number {
  const changes =
    typeof result.changes === "bigint"
      ? Number(result.changes)
      : result.changes;

  if (
    !Number.isSafeInteger(changes) ||
    changes < 0
  ) {
    throw new Error(
      "SQLite credential-rotation change count is invalid.",
    );
  }

  return changes;
}

export async function rotateAuthenticatedPrincipalCredentialAndRevokeSessions(
  request:
    RotateAuthenticatedPrincipalCredentialRequest,
): Promise<AuthenticatedPrincipalCredentialRotationResult> {
  const databasePath =
    requireNonEmpty(
      request.databasePath,
      "Credential-rotation SQLite path",
    );

  const tenantId =
    requireNonEmpty(
      request.claims.tenantId,
      "Authenticated session tenantId",
    );

  const actorId =
    requireNonEmpty(
      request.claims.actorId,
      "Authenticated session actorId",
    );

  const role =
    requireNonEmpty(
      request.claims.role,
      "Authenticated session role",
    );

  const sessionId =
    requireNonEmpty(
      request.claims.sessionId,
      "Authenticated session ID",
    );

  const currentPassword =
    validatePassword(
      request.currentPassword,
      "Current password",
    );

  const newPassword =
    validatePassword(
      request.newPassword,
      "New password",
    );

  const changedAt =
    requireNonEmpty(
      request.changedAt,
      "Credential change time",
    );

  const changedAtMs =
    parseTimestamp(
      changedAt,
      "Credential change time",
    );

  const {
    DatabaseSync,
  } = loadSQLiteModule();

  const database =
    new DatabaseSync(
      databasePath,
    );

  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = FULL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
  `);

  database.exec(
    "BEGIN IMMEDIATE",
  );

  try {
    const sessionRow =
      database
        .prepare(`
          SELECT
            session_id,
            tenant_id,
            actor_id,
            role,
            expires_at_ms,
            revoked_at
          FROM nexus_authenticated_sessions
          WHERE session_id = ?
        `)
        .get(
          sessionId,
        );

    if (!sessionRow) {
      throw new AuthenticatedCredentialRotationError();
    }

    if (
      readString(
        sessionRow,
        "tenant_id",
      ) !== tenantId ||
      readString(
        sessionRow,
        "actor_id",
      ) !== actorId ||
      readString(
        sessionRow,
        "role",
      ) !== role ||
      sessionRow.revoked_at !== null ||
      readInteger(
        sessionRow,
        "expires_at_ms",
      ) <= changedAtMs
    ) {
      throw new AuthenticatedCredentialRotationError();
    }

    const principalRow =
      database
        .prepare(`
          SELECT
            principal_id,
            password_salt_hex,
            password_hash_hex,
            status,
            credential_version
          FROM nexus_authenticated_principals
          WHERE
            tenant_id = ?
            AND actor_id = ?
            AND role = ?
        `)
        .get(
          tenantId,
          actorId,
          role,
        );

    if (!principalRow) {
      throw new AuthenticatedCredentialRotationError();
    }

    if (
      readString(
        principalRow,
        "status",
      ) !== "active"
    ) {
      throw new AuthenticatedCredentialRotationError();
    }

    const passwordSaltHex =
      readString(
        principalRow,
        "password_salt_hex",
      );

    const passwordHashHex =
      readString(
        principalRow,
        "password_hash_hex",
      );

    const currentPasswordHash =
      hashPassword(
        currentPassword,
        passwordSaltHex,
      );

    if (
      !secureHashEquals(
        currentPasswordHash,
        passwordHashHex,
      )
    ) {
      throw new AuthenticatedCredentialRotationError();
    }

    const newPasswordAgainstCurrentSalt =
      hashPassword(
        newPassword,
        passwordSaltHex,
      );

    if (
      secureHashEquals(
        newPasswordAgainstCurrentSalt,
        passwordHashHex,
      )
    ) {
      throw new Error(
        "New password must be different from the current password.",
      );
    }

    const newPasswordSaltHex =
      randomBytes(
        PASSWORD_SALT_BYTES,
      ).toString("hex");

    const newPasswordHashHex =
      hashPassword(
        newPassword,
        newPasswordSaltHex,
      );

    const currentCredentialVersion =
      readInteger(
        principalRow,
        "credential_version",
      );

    const nextCredentialVersion =
      currentCredentialVersion + 1;

    const principalUpdate =
      database
        .prepare(`
          UPDATE nexus_authenticated_principals
          SET
            password_salt_hex = ?,
            password_hash_hex = ?,
            credential_version = ?,
            failed_attempt_count = 0,
            locked_until = NULL,
            locked_until_ms = NULL,
            updated_at = ?
          WHERE
            principal_id = ?
            AND status = 'active'
            AND credential_version = ?
        `)
        .run(
          newPasswordSaltHex,
          newPasswordHashHex,
          nextCredentialVersion,
          changedAt,
          readString(
            principalRow,
            "principal_id",
          ),
          currentCredentialVersion,
        );

    if (
      changesAsNumber(
        principalUpdate,
      ) !== 1
    ) {
      throw new Error(
        "Authenticated principal credential update lost concurrency control.",
      );
    }

    const sessionRevocation =
      database
        .prepare(`
          UPDATE nexus_authenticated_sessions
          SET
            revoked_at = ?,
            revoked_at_ms = ?,
            revocation_reason = ?,
            updated_at = ?
          WHERE
            tenant_id = ?
            AND actor_id = ?
            AND role = ?
            AND revoked_at IS NULL
        `)
        .run(
          changedAt,
          changedAtMs,
          "CREDENTIAL_ROTATED",
          changedAt,
          tenantId,
          actorId,
          role,
        );

    const sessionsRevoked =
      changesAsNumber(
        sessionRevocation,
      );

    if (
      sessionsRevoked < 1
    ) {
      throw new Error(
        "Credential rotation did not revoke the authenticated session.",
      );
    }

    const verificationRow =
      database
        .prepare(`
          SELECT credential_version
          FROM nexus_authenticated_principals
          WHERE
            tenant_id = ?
            AND actor_id = ?
            AND role = ?
        `)
        .get(
          tenantId,
          actorId,
          role,
        );

    if (
      !verificationRow ||
      readInteger(
        verificationRow,
        "credential_version",
      ) !== nextCredentialVersion
    ) {
      throw new Error(
        "Credential rotation verification failed.",
      );
    }

    database.exec(
      "COMMIT",
    );

    return {
      passwordChanged: true,
      tenantId,
      actorId,
      role,
      credentialVersion:
        nextCredentialVersion,
      sessionsRevoked,
      changedAt,
      reauthenticationRequired:
        true,
      liveProviderExecutionAuthorized:
        false,
    };
  } catch (error) {
    try {
      database.exec(
        "ROLLBACK",
      );
    } catch {
      // Original credential-rotation error remains authoritative.
    }

    throw error;
  } finally {
    database.close();
  }
}
