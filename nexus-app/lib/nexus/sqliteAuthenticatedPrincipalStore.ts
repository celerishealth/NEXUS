import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import {
  mkdirSync,
} from "node:fs";
import {
  dirname,
} from "node:path";
import {
  isControlledActionGatewayRole,
} from "./controlledActionCommandGateway";

interface SQLiteRunResult {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}

interface SQLiteStatement {
  get(
    ...parameters: unknown[]
  ): Record<string, unknown> | undefined;

  all(
    ...parameters: unknown[]
  ): Record<string, unknown>[];

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

export type AuthenticatedPrincipalStatus =
  | "active"
  | "disabled";

export interface CreateAuthenticatedPrincipalRequest {
  principalId: string;
  tenantId: string;
  actorId: string;
  role: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AuthenticatePrincipalRequest {
  tenantId: string;
  email: string;
  password: string;
  authenticatedAt: string;
}

export interface DisableAuthenticatedPrincipalRequest {
  principalId: string;
  reason: string;
  disabledAt: string;
}

export interface AuthenticatedPrincipalRecord {
  principalId: string;
  tenantId: string;
  actorId: string;
  role: string;
  emailNormalized: string;
  status: AuthenticatedPrincipalStatus;
  credentialVersion: number;
  failedAttemptCount: number;
  lockedUntil: string | null;
  disabledReason: string | null;
  lastAuthenticatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StoredAuthenticatedPrincipal
  extends AuthenticatedPrincipalRecord {
  passwordSaltHex: string;
  passwordHashHex: string;
}

const PASSWORD_HASH_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export class AuthenticatedPrincipalAuthenticationError
  extends Error {
  constructor() {
    super("Authentication failed.");
    this.name =
      "AuthenticatedPrincipalAuthenticationError";
  }
}

export class AuthenticatedPrincipalLockedError
  extends Error {
  readonly lockedUntil: string;

  constructor(
    lockedUntil: string,
  ) {
    super(
      "Authentication is temporarily locked.",
    );

    this.name =
      "AuthenticatedPrincipalLockedError";

    this.lockedUntil =
      lockedUntil;
  }
}

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

function normalizeEmail(
  value: string,
): string {
  const normalized =
    requireNonEmpty(
      value,
      "Authenticated principal email",
    ).toLowerCase();

  if (
    normalized.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalized,
    )
  ) {
    throw new Error(
      "Authenticated principal email is invalid.",
    );
  }

  return normalized;
}

function validatePassword(
  value: string,
): string {
  if (
    typeof value !== "string" ||
    value.length < 12 ||
    value.length > 256
  ) {
    throw new Error(
      "Authenticated principal password must contain between 12 and 256 characters.",
    );
  }

  return value;
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
  const derivedKey =
    scryptSync(
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
    );

  return derivedKey.toString(
    "hex",
  );
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

function consumeDummyPasswordWork(
  password: string,
): void {
  hashPassword(
    password,
    "00000000000000000000000000000000",
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
      `SQLite authenticated-principal field ${fieldName} is invalid.`,
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
      `SQLite authenticated-principal field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function readNullableString(
  row: Record<string, unknown>,
  fieldName: string,
): string | null {
  const value =
    row[fieldName];

  if (value === null) {
    return null;
  }

  if (
    typeof value !== "string"
  ) {
    throw new Error(
      `SQLite authenticated-principal field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function parsePrincipalRow(
  row: Record<string, unknown>,
): StoredAuthenticatedPrincipal {
  const role =
    readString(
      row,
      "role",
    );

  if (
    !isControlledActionGatewayRole(
      role,
    )
  ) {
    throw new Error(
      "Stored authenticated-principal role is invalid.",
    );
  }

  const status =
    readString(
      row,
      "status",
    );

  if (
    status !== "active" &&
    status !== "disabled"
  ) {
    throw new Error(
      "Stored authenticated-principal status is invalid.",
    );
  }

  return {
    principalId:
      readString(
        row,
        "principal_id",
      ),
    tenantId:
      readString(
        row,
        "tenant_id",
      ),
    actorId:
      readString(
        row,
        "actor_id",
      ),
    role,
    emailNormalized:
      readString(
        row,
        "email_normalized",
      ),
    passwordSaltHex:
      readString(
        row,
        "password_salt_hex",
      ),
    passwordHashHex:
      readString(
        row,
        "password_hash_hex",
      ),
    status,
    credentialVersion:
      readInteger(
        row,
        "credential_version",
      ),
    failedAttemptCount:
      readInteger(
        row,
        "failed_attempt_count",
      ),
    lockedUntil:
      readNullableString(
        row,
        "locked_until",
      ),
    disabledReason:
      readNullableString(
        row,
        "disabled_reason",
      ),
    lastAuthenticatedAt:
      readNullableString(
        row,
        "last_authenticated_at",
      ),
    createdAt:
      readString(
        row,
        "created_at",
      ),
    updatedAt:
      readString(
        row,
        "updated_at",
      ),
  };
}

function publicPrincipal(
  record:
    StoredAuthenticatedPrincipal,
): AuthenticatedPrincipalRecord {
  return {
    principalId:
      record.principalId,
    tenantId:
      record.tenantId,
    actorId:
      record.actorId,
    role:
      record.role,
    emailNormalized:
      record.emailNormalized,
    status:
      record.status,
    credentialVersion:
      record.credentialVersion,
    failedAttemptCount:
      record.failedAttemptCount,
    lockedUntil:
      record.lockedUntil,
    disabledReason:
      record.disabledReason,
    lastAuthenticatedAt:
      record.lastAuthenticatedAt,
    createdAt:
      record.createdAt,
    updatedAt:
      record.updatedAt,
  };
}

export class SQLiteAuthenticatedPrincipalStore {
  private readonly database:
    SQLiteDatabase;

  private closed = false;

  constructor(
    databasePath: string,
  ) {
    const normalizedPath =
      requireNonEmpty(
        databasePath,
        "Authenticated-principal SQLite path",
      );

    mkdirSync(
      dirname(
        normalizedPath,
      ),
      {
        recursive: true,
      },
    );

    const {
      DatabaseSync,
    } = loadSQLiteModule();

    this.database =
      new DatabaseSync(
        normalizedPath,
      );

    this.database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = FULL;
      PRAGMA foreign_keys = ON;
      PRAGMA busy_timeout = 5000;

      CREATE TABLE IF NOT EXISTS nexus_schema_migrations (
        version INTEGER PRIMARY KEY,
        migration_name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS nexus_authenticated_principals (
        principal_id TEXT PRIMARY KEY
          CHECK (length(principal_id) > 0),
        tenant_id TEXT NOT NULL
          CHECK (length(tenant_id) > 0),
        actor_id TEXT NOT NULL
          CHECK (length(actor_id) > 0),
        role TEXT NOT NULL
          CHECK (
            role IN (
              'owner',
              'worker',
              'operator',
              'system_owner'
            )
          ),
        email_normalized TEXT NOT NULL
          CHECK (length(email_normalized) > 3),
        password_salt_hex TEXT NOT NULL
          CHECK (length(password_salt_hex) = 32),
        password_hash_hex TEXT NOT NULL
          CHECK (length(password_hash_hex) = 64),
        status TEXT NOT NULL
          CHECK (
            status IN (
              'active',
              'disabled'
            )
          ),
        credential_version INTEGER NOT NULL
          CHECK (credential_version >= 1),
        failed_attempt_count INTEGER NOT NULL
          CHECK (
            failed_attempt_count >= 0
            AND failed_attempt_count <= 5
          ),
        locked_until TEXT,
        locked_until_ms INTEGER,
        disabled_reason TEXT,
        last_authenticated_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE (
          tenant_id,
          actor_id
        ),
        UNIQUE (
          tenant_id,
          email_normalized
        ),
        CHECK (
          (
            locked_until IS NULL
            AND locked_until_ms IS NULL
          )
          OR
          (
            locked_until IS NOT NULL
            AND locked_until_ms IS NOT NULL
          )
        ),
        CHECK (
          (
            status = 'active'
            AND disabled_reason IS NULL
          )
          OR
          (
            status = 'disabled'
            AND length(
              disabled_reason
            ) > 0
          )
        )
      );

      CREATE INDEX IF NOT EXISTS
        nexus_authenticated_principals_login_idx
      ON nexus_authenticated_principals (
        tenant_id,
        email_normalized,
        status
      );

      CREATE INDEX IF NOT EXISTS
        nexus_authenticated_principals_actor_idx
      ON nexus_authenticated_principals (
        tenant_id,
        actor_id,
        role
      );
    `);

    this.database
      .prepare(`
        INSERT OR IGNORE INTO nexus_schema_migrations (
          version,
          migration_name,
          applied_at
        )
        VALUES (?, ?, ?)
      `)
      .run(
        6,
        "authenticated_tenant_principals_v1",
        new Date().toISOString(),
      );
  }

  async createPrincipal(
    request:
      CreateAuthenticatedPrincipalRequest,
  ): Promise<AuthenticatedPrincipalRecord> {
    this.ensureOpen();

    const principalId =
      requireNonEmpty(
        request.principalId,
        "Authenticated principal ID",
      );

    const tenantId =
      requireNonEmpty(
        request.tenantId,
        "Authenticated principal tenantId",
      );

    const actorId =
      requireNonEmpty(
        request.actorId,
        "Authenticated principal actorId",
      );

    const role =
      requireNonEmpty(
        request.role,
        "Authenticated principal role",
      );

    if (
      !isControlledActionGatewayRole(
        role,
      )
    ) {
      throw new Error(
        "Authenticated principal role is invalid.",
      );
    }

    if (
      role === "system_owner" &&
      tenantId !== "__system__"
    ) {
      throw new Error(
        "System-owner principal requires system tenant context.",
      );
    }

    if (
      role !== "system_owner" &&
      tenantId === "__system__"
    ) {
      throw new Error(
        "Non-system principal cannot use system tenant context.",
      );
    }

    const emailNormalized =
      normalizeEmail(
        request.email,
      );

    const password =
      validatePassword(
        request.password,
      );

    const createdAt =
      requireNonEmpty(
        request.createdAt,
        "Authenticated principal createdAt",
      );

    parseTimestamp(
      createdAt,
      "Authenticated principal createdAt",
    );

    this.database.exec(
      "BEGIN IMMEDIATE",
    );

    try {
      const existingRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_principals
            WHERE
              principal_id = ?
              OR (
                tenant_id = ?
                AND actor_id = ?
              )
              OR (
                tenant_id = ?
                AND email_normalized = ?
              )
          `)
          .get(
            principalId,
            tenantId,
            actorId,
            tenantId,
            emailNormalized,
          );

      if (existingRow) {
        throw new Error(
          "Authenticated principal identity, actor, or email conflicts with an existing record.",
        );
      }

      const passwordSaltHex =
        randomBytes(
          PASSWORD_SALT_BYTES,
        ).toString("hex");

      const passwordHashHex =
        hashPassword(
          password,
          passwordSaltHex,
        );

      this.database
        .prepare(`
          INSERT INTO nexus_authenticated_principals (
            principal_id,
            tenant_id,
            actor_id,
            role,
            email_normalized,
            password_salt_hex,
            password_hash_hex,
            status,
            credential_version,
            failed_attempt_count,
            locked_until,
            locked_until_ms,
            disabled_reason,
            last_authenticated_at,
            created_at,
            updated_at
          )
          VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            'active',
            1,
            0,
            NULL,
            NULL,
            NULL,
            NULL,
            ?,
            ?
          )
        `)
        .run(
          principalId,
          tenantId,
          actorId,
          role,
          emailNormalized,
          passwordSaltHex,
          passwordHashHex,
          createdAt,
          createdAt,
        );

      const insertedRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_principals
            WHERE principal_id = ?
          `)
          .get(
            principalId,
          );

      if (!insertedRow) {
        throw new Error(
          "Authenticated principal insert failed.",
        );
      }

      this.database.exec(
        "COMMIT",
      );

      return publicPrincipal(
        parsePrincipalRow(
          insertedRow,
        ),
      );
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async authenticate(
    request:
      AuthenticatePrincipalRequest,
  ): Promise<AuthenticatedPrincipalRecord> {
    this.ensureOpen();

    const tenantId =
      requireNonEmpty(
        request.tenantId,
        "Authentication tenantId",
      );

    const emailNormalized =
      normalizeEmail(
        request.email,
      );

    const password =
      validatePassword(
        request.password,
      );

    const authenticatedAt =
      requireNonEmpty(
        request.authenticatedAt,
        "Authentication time",
      );

    const authenticatedAtMs =
      parseTimestamp(
        authenticatedAt,
        "Authentication time",
      );

    this.database.exec(
      "BEGIN IMMEDIATE",
    );

    try {
      const row =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_principals
            WHERE
              tenant_id = ?
              AND email_normalized = ?
          `)
          .get(
            tenantId,
            emailNormalized,
          );

      if (!row) {
        consumeDummyPasswordWork(
          password,
        );

        this.database.exec(
          "COMMIT",
        );

        throw new AuthenticatedPrincipalAuthenticationError();
      }

      const principal =
        parsePrincipalRow(row);

      const storedLockedUntilMs =
        principal.lockedUntil
          ? parseTimestamp(
              principal.lockedUntil,
              "Stored principal lockedUntil",
            )
          : null;

      if (
        storedLockedUntilMs !==
          null &&
        storedLockedUntilMs >
          authenticatedAtMs
      ) {
        consumeDummyPasswordWork(
          password,
        );

        this.database.exec(
          "COMMIT",
        );

        throw new AuthenticatedPrincipalLockedError(
          principal.lockedUntil as string,
        );
      }

      const suppliedHash =
        hashPassword(
          password,
          principal.passwordSaltHex,
        );

      const passwordMatches =
        secureHashEquals(
          suppliedHash,
          principal.passwordHashHex,
        );

      if (
        principal.status !==
          "active" ||
        !passwordMatches
      ) {
        const previousFailures =
          storedLockedUntilMs !==
            null &&
          storedLockedUntilMs <=
            authenticatedAtMs
            ? 0
            : principal.failedAttemptCount;

        const nextFailureCount =
          Math.min(
            MAX_FAILED_ATTEMPTS,
            previousFailures + 1,
          );

        const shouldLock =
          nextFailureCount >=
          MAX_FAILED_ATTEMPTS;

        const lockedUntil =
          shouldLock
            ? new Date(
                authenticatedAtMs +
                  LOCK_DURATION_MS,
              ).toISOString()
            : null;

        this.database
          .prepare(`
            UPDATE nexus_authenticated_principals
            SET
              failed_attempt_count = ?,
              locked_until = ?,
              locked_until_ms = ?,
              updated_at = ?
            WHERE principal_id = ?
          `)
          .run(
            nextFailureCount,
            lockedUntil,
            lockedUntil
              ? Date.parse(
                  lockedUntil,
                )
              : null,
            authenticatedAt,
            principal.principalId,
          );

        this.database.exec(
          "COMMIT",
        );

        if (shouldLock) {
          throw new AuthenticatedPrincipalLockedError(
            lockedUntil as string,
          );
        }

        throw new AuthenticatedPrincipalAuthenticationError();
      }

      this.database
        .prepare(`
          UPDATE nexus_authenticated_principals
          SET
            failed_attempt_count = 0,
            locked_until = NULL,
            locked_until_ms = NULL,
            last_authenticated_at = ?,
            updated_at = ?
          WHERE principal_id = ?
        `)
        .run(
          authenticatedAt,
          authenticatedAt,
          principal.principalId,
        );

      const authenticatedRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_principals
            WHERE principal_id = ?
          `)
          .get(
            principal.principalId,
          );

      if (!authenticatedRow) {
        throw new Error(
          "Authenticated principal result is missing.",
        );
      }

      this.database.exec(
        "COMMIT",
      );

      return publicPrincipal(
        parsePrincipalRow(
          authenticatedRow,
        ),
      );
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async disablePrincipal(
    request:
      DisableAuthenticatedPrincipalRequest,
  ): Promise<AuthenticatedPrincipalRecord> {
    this.ensureOpen();

    const principalId =
      requireNonEmpty(
        request.principalId,
        "Authenticated principal ID",
      );

    const reason =
      requireNonEmpty(
        request.reason,
        "Principal disable reason",
      );

    const disabledAt =
      requireNonEmpty(
        request.disabledAt,
        "Principal disabledAt",
      );

    parseTimestamp(
      disabledAt,
      "Principal disabledAt",
    );

    this.database.exec(
      "BEGIN IMMEDIATE",
    );

    try {
      const row =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_principals
            WHERE principal_id = ?
          `)
          .get(
            principalId,
          );

      if (!row) {
        throw new Error(
          "Authenticated principal was not found.",
        );
      }

      const existing =
        parsePrincipalRow(row);

      if (
        existing.status ===
        "disabled"
      ) {
        if (
          existing.disabledReason !==
          reason
        ) {
          throw new Error(
            "Authenticated principal disable request conflicts with durable state.",
          );
        }

        this.database.exec(
          "COMMIT",
        );

        return publicPrincipal(
          existing,
        );
      }

      this.database
        .prepare(`
          UPDATE nexus_authenticated_principals
          SET
            status = 'disabled',
            disabled_reason = ?,
            updated_at = ?
          WHERE
            principal_id = ?
            AND status = 'active'
        `)
        .run(
          reason,
          disabledAt,
          principalId,
        );

      const disabledRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_principals
            WHERE principal_id = ?
          `)
          .get(
            principalId,
          );

      if (!disabledRow) {
        throw new Error(
          "Disabled authenticated-principal result is missing.",
        );
      }

      this.database.exec(
        "COMMIT",
      );

      return publicPrincipal(
        parsePrincipalRow(
          disabledRow,
        ),
      );
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async readSnapshot():
    Promise<AuthenticatedPrincipalRecord[]> {
    this.ensureOpen();

    return this.database
      .prepare(`
        SELECT *
        FROM nexus_authenticated_principals
        ORDER BY
          tenant_id,
          actor_id,
          principal_id
      `)
      .all()
      .map(
        (row) =>
          publicPrincipal(
            parsePrincipalRow(
              row,
            ),
          ),
      );
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.database.close();
    this.closed = true;
  }

  private rollbackQuietly(): void {
    try {
      this.database.exec(
        "ROLLBACK",
      );
    } catch {
      // Original authentication error remains authoritative.
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "Authenticated-principal store is closed.",
      );
    }
  }
}
