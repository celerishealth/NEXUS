import {
  createHmac,
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

export interface AuthenticatedTenantSessionClaims {
  version: 1;
  keyId: string;
  sessionId: string;
  tenantId: string;
  actorId: string;
  role: string;
  issuedAt: string;
  expiresAt: string;
}

export interface CreateAuthenticatedTenantSessionRequest
  extends AuthenticatedTenantSessionClaims {
  createdAt: string;
}

export interface AuthenticatedTenantSessionRecord
  extends AuthenticatedTenantSessionClaims {
  revokedAt: string | null;
  revocationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RevokeAuthenticatedTenantSessionRequest {
  sessionId: string;
  reason: string;
  revokedAt: string;
}

export interface VerifyAuthenticatedTenantSessionTokenOptions {
  now: string;
  maxClockSkewMs: number;
}

export interface GatewayIdentityContext {
  tenantId: string;
  actorId: string;
  role: string;
}

const MAX_SESSION_DURATION_MS =
  30 * 24 * 60 * 60 * 1000;

function requireNonEmpty(
  value: string,
  fieldName: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function parseTimestamp(
  value: string,
  fieldName: string,
): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(
      `${fieldName} must be a valid timestamp.`,
    );
  }

  return timestamp;
}

function loadSQLiteModule(): SQLiteModule {
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

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function validateClaims(
  value: unknown,
): AuthenticatedTenantSessionClaims {
  if (!isRecord(value)) {
    throw new Error(
      "Authenticated session claims must be an object.",
    );
  }

  if (value.version !== 1) {
    throw new Error(
      "Unsupported authenticated session token version.",
    );
  }

  const keyId =
    typeof value.keyId === "string"
      ? requireNonEmpty(
          value.keyId,
          "Authenticated session keyId",
        )
      : "";

  const sessionId =
    typeof value.sessionId === "string"
      ? requireNonEmpty(
          value.sessionId,
          "Authenticated session ID",
        )
      : "";

  const tenantId =
    typeof value.tenantId === "string"
      ? requireNonEmpty(
          value.tenantId,
          "Authenticated session tenantId",
        )
      : "";

  const actorId =
    typeof value.actorId === "string"
      ? requireNonEmpty(
          value.actorId,
          "Authenticated session actorId",
        )
      : "";

  const role =
    typeof value.role === "string"
      ? requireNonEmpty(
          value.role,
          "Authenticated session role",
        )
      : "";

  const issuedAt =
    typeof value.issuedAt === "string"
      ? requireNonEmpty(
          value.issuedAt,
          "Authenticated session issuedAt",
        )
      : "";

  const expiresAt =
    typeof value.expiresAt === "string"
      ? requireNonEmpty(
          value.expiresAt,
          "Authenticated session expiresAt",
        )
      : "";

  if (!isControlledActionGatewayRole(role)) {
    throw new Error(
      "Authenticated session role is invalid.",
    );
  }

  const issuedAtTimestamp =
    parseTimestamp(
      issuedAt,
      "Authenticated session issuedAt",
    );

  const expiresAtTimestamp =
    parseTimestamp(
      expiresAt,
      "Authenticated session expiresAt",
    );

  if (
    expiresAtTimestamp <=
    issuedAtTimestamp
  ) {
    throw new Error(
      "Authenticated session expiry must be after issue time.",
    );
  }

  if (
    expiresAtTimestamp -
      issuedAtTimestamp >
    MAX_SESSION_DURATION_MS
  ) {
    throw new Error(
      "Authenticated session duration exceeds the maximum permitted duration.",
    );
  }

  return {
    version: 1,
    keyId,
    sessionId,
    tenantId,
    actorId,
    role,
    issuedAt,
    expiresAt,
  };
}

function canonicalClaims(
  claims: AuthenticatedTenantSessionClaims,
): string {
  return JSON.stringify({
    version: claims.version,
    keyId: claims.keyId,
    sessionId: claims.sessionId,
    tenantId: claims.tenantId,
    actorId: claims.actorId,
    role: claims.role,
    issuedAt: claims.issuedAt,
    expiresAt: claims.expiresAt,
  });
}

function calculateSignature(
  encodedPayload: string,
  secret: string,
): string {
  return createHmac(
    "sha256",
    secret,
  )
    .update(
      encodedPayload,
      "utf8",
    )
    .digest("base64url");
}

function secureStringEquals(
  actual: string,
  expected: string,
): boolean {
  const actualBuffer =
    Buffer.from(actual, "utf8");

  const expectedBuffer =
    Buffer.from(expected, "utf8");

  return (
    actualBuffer.length ===
      expectedBuffer.length &&
    timingSafeEqual(
      actualBuffer,
      expectedBuffer,
    )
  );
}

function readString(
  row: Record<string, unknown>,
  fieldName: string,
): string {
  const value = row[fieldName];

  if (typeof value !== "string") {
    throw new Error(
      `SQLite session field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function readNullableString(
  row: Record<string, unknown>,
  fieldName: string,
): string | null {
  const value = row[fieldName];

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(
      `SQLite session field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function parseSessionRow(
  row: Record<string, unknown>,
): AuthenticatedTenantSessionRecord {
  const claims =
    validateClaims({
      version: 1,
      keyId:
        readString(
          row,
          "key_id",
        ),
      sessionId:
        readString(
          row,
          "session_id",
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
      role:
        readString(
          row,
          "role",
        ),
      issuedAt:
        readString(
          row,
          "issued_at",
        ),
      expiresAt:
        readString(
          row,
          "expires_at",
        ),
    });

  return {
    ...claims,
    revokedAt:
      readNullableString(
        row,
        "revoked_at",
      ),
    revocationReason:
      readNullableString(
        row,
        "revocation_reason",
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

export function signAuthenticatedTenantSessionToken(
  claims: AuthenticatedTenantSessionClaims,
  secret: string,
): string {
  const validatedClaims =
    validateClaims(claims);

  const normalizedSecret =
    requireNonEmpty(
      secret,
      "Authenticated session signing secret",
    );

  const encodedPayload =
    Buffer.from(
      canonicalClaims(
        validatedClaims,
      ),
      "utf8",
    ).toString("base64url");

  const signature =
    calculateSignature(
      encodedPayload,
      normalizedSecret,
    );

  return `${encodedPayload}.${signature}`;
}

export function verifyAuthenticatedTenantSessionToken(
  token: string,
  secrets:
    Readonly<Record<string, string>>,
  options:
    VerifyAuthenticatedTenantSessionTokenOptions,
): AuthenticatedTenantSessionClaims {
  const normalizedToken =
    requireNonEmpty(
      token,
      "Authenticated session token",
    );

  const tokenParts =
    normalizedToken.split(".");

  if (tokenParts.length !== 2) {
    throw new Error(
      "Authenticated session token format is invalid.",
    );
  }

  const [
    encodedPayload,
    suppliedSignature,
  ] = tokenParts;

  let parsedPayload: unknown;

  try {
    parsedPayload =
      JSON.parse(
        Buffer.from(
          encodedPayload,
          "base64url",
        ).toString("utf8"),
      );
  } catch {
    throw new Error(
      "Authenticated session token payload is invalid.",
    );
  }

  const claims =
    validateClaims(
      parsedPayload,
    );

  const configuredSecret =
    secrets[claims.keyId]
      ?.trim() ?? "";

  if (!configuredSecret) {
    throw new Error(
      "Authenticated session signing key is unknown or disabled.",
    );
  }

  const expectedSignature =
    calculateSignature(
      encodedPayload,
      configuredSecret,
    );

  if (
    !secureStringEquals(
      suppliedSignature,
      expectedSignature,
    )
  ) {
    throw new Error(
      "Authenticated session token signature verification failed.",
    );
  }

  if (
    !Number.isSafeInteger(
      options.maxClockSkewMs,
    ) ||
    options.maxClockSkewMs < 0 ||
    options.maxClockSkewMs >
      300_000
  ) {
    throw new Error(
      "Authenticated session maxClockSkewMs must be between 0 and 300000.",
    );
  }

  const nowTimestamp =
    parseTimestamp(
      options.now,
      "Authenticated session verification time",
    );

  const issuedAtTimestamp =
    parseTimestamp(
      claims.issuedAt,
      "Authenticated session issuedAt",
    );

  const expiresAtTimestamp =
    parseTimestamp(
      claims.expiresAt,
      "Authenticated session expiresAt",
    );

  if (
    issuedAtTimestamp -
      nowTimestamp >
    options.maxClockSkewMs
  ) {
    throw new Error(
      "Authenticated session token was issued too far in the future.",
    );
  }

  if (
    nowTimestamp >=
    expiresAtTimestamp
  ) {
    throw new Error(
      "Authenticated session token has expired.",
    );
  }

  return claims;
}

export function assertAuthenticatedSessionMatchesGatewayContext(
  claims:
    AuthenticatedTenantSessionClaims,
  context:
    GatewayIdentityContext,
): void {
  if (
    claims.tenantId !==
    context.tenantId
  ) {
    throw new Error(
      "Authenticated session tenant does not match the signed gateway context.",
    );
  }

  if (
    claims.actorId !==
    context.actorId
  ) {
    throw new Error(
      "Authenticated session actor does not match the signed gateway context.",
    );
  }

  if (
    claims.role !==
    context.role
  ) {
    throw new Error(
      "Authenticated session role does not match the signed gateway context.",
    );
  }

  if (
    claims.role ===
      "system_owner" &&
    claims.tenantId !==
      "__system__"
  ) {
    throw new Error(
      "System-owner authenticated sessions require system tenant context.",
    );
  }

  if (
    claims.role !==
      "system_owner" &&
    claims.tenantId ===
      "__system__"
  ) {
    throw new Error(
      "Non-system authenticated sessions cannot use system tenant context.",
    );
  }
}

export class SQLiteAuthenticatedTenantSessionStore {
  private readonly database:
    SQLiteDatabase;

  private closed = false;

  constructor(
    databasePath: string,
  ) {
    const normalizedPath =
      requireNonEmpty(
        databasePath,
        "Authenticated session SQLite path",
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

      CREATE TABLE IF NOT EXISTS nexus_authenticated_sessions (
        session_id TEXT PRIMARY KEY
          CHECK (length(session_id) > 0),
        key_id TEXT NOT NULL
          CHECK (length(key_id) > 0),
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
        issued_at TEXT NOT NULL,
        issued_at_ms INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        expires_at_ms INTEGER NOT NULL,
        revoked_at TEXT,
        revoked_at_ms INTEGER,
        revocation_reason TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        CHECK (
          expires_at_ms >
          issued_at_ms
        ),
        CHECK (
          (
            revoked_at IS NULL
            AND revoked_at_ms IS NULL
            AND revocation_reason IS NULL
          )
          OR
          (
            revoked_at IS NOT NULL
            AND revoked_at_ms IS NOT NULL
            AND length(
              revocation_reason
            ) > 0
          )
        )
      );

      CREATE INDEX IF NOT EXISTS
        nexus_authenticated_sessions_principal_idx
      ON nexus_authenticated_sessions (
        tenant_id,
        actor_id,
        role,
        expires_at_ms
      );

      CREATE INDEX IF NOT EXISTS
        nexus_authenticated_sessions_expiry_idx
      ON nexus_authenticated_sessions (
        expires_at_ms
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
        5,
        "authenticated_tenant_sessions_v1",
        new Date().toISOString(),
      );
  }

  async createSession(
    request:
      CreateAuthenticatedTenantSessionRequest,
  ): Promise<AuthenticatedTenantSessionRecord> {
    this.ensureOpen();

    const claims =
      validateClaims(
        request,
      );

    const createdAt =
      requireNonEmpty(
        request.createdAt,
        "Authenticated session createdAt",
      );

    parseTimestamp(
      createdAt,
      "Authenticated session createdAt",
    );

    this.database.exec(
      "BEGIN IMMEDIATE",
    );

    try {
      const existingRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_sessions
            WHERE session_id = ?
          `)
          .get(
            claims.sessionId,
          );

      if (existingRow) {
        const existing =
          parseSessionRow(
            existingRow,
          );

        const exactReplay =
          existing.keyId ===
            claims.keyId &&
          existing.tenantId ===
            claims.tenantId &&
          existing.actorId ===
            claims.actorId &&
          existing.role ===
            claims.role &&
          existing.issuedAt ===
            claims.issuedAt &&
          existing.expiresAt ===
            claims.expiresAt &&
          existing.createdAt ===
            createdAt;

        if (!exactReplay) {
          throw new Error(
            "Authenticated session ID conflicts with another durable session.",
          );
        }

        this.database.exec(
          "COMMIT",
        );

        return existing;
      }

      this.database
        .prepare(`
          INSERT INTO nexus_authenticated_sessions (
            session_id,
            key_id,
            tenant_id,
            actor_id,
            role,
            issued_at,
            issued_at_ms,
            expires_at,
            expires_at_ms,
            revoked_at,
            revoked_at_ms,
            revocation_reason,
            created_at,
            updated_at
          )
          VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?,
            NULL, NULL, NULL, ?, ?
          )
        `)
        .run(
          claims.sessionId,
          claims.keyId,
          claims.tenantId,
          claims.actorId,
          claims.role,
          claims.issuedAt,
          parseTimestamp(
            claims.issuedAt,
            "Authenticated session issuedAt",
          ),
          claims.expiresAt,
          parseTimestamp(
            claims.expiresAt,
            "Authenticated session expiresAt",
          ),
          createdAt,
          createdAt,
        );

      const insertedRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_sessions
            WHERE session_id = ?
          `)
          .get(
            claims.sessionId,
          );

      if (!insertedRow) {
        throw new Error(
          "Authenticated session insert failed.",
        );
      }

      this.database.exec(
        "COMMIT",
      );

      return parseSessionRow(
        insertedRow,
      );
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async assertActiveSession(
    claims:
      AuthenticatedTenantSessionClaims,
    now: string,
  ): Promise<AuthenticatedTenantSessionRecord> {
    this.ensureOpen();

    const validatedClaims =
      validateClaims(
        claims,
      );

    const nowTimestamp =
      parseTimestamp(
        now,
        "Authenticated session lookup time",
      );

    const row =
      this.database
        .prepare(`
          SELECT *
          FROM nexus_authenticated_sessions
          WHERE session_id = ?
        `)
        .get(
          validatedClaims.sessionId,
        );

    if (!row) {
      throw new Error(
        "Authenticated session was not found in durable storage.",
      );
    }

    const storedSession =
      parseSessionRow(row);

    if (
      storedSession.keyId !==
        validatedClaims.keyId ||
      storedSession.tenantId !==
        validatedClaims.tenantId ||
      storedSession.actorId !==
        validatedClaims.actorId ||
      storedSession.role !==
        validatedClaims.role ||
      storedSession.issuedAt !==
        validatedClaims.issuedAt ||
      storedSession.expiresAt !==
        validatedClaims.expiresAt
    ) {
      throw new Error(
        "Authenticated session token does not match the durable session record.",
      );
    }

    if (
      storedSession.revokedAt !==
      null
    ) {
      throw new Error(
        "Authenticated session has been revoked.",
      );
    }

    if (
      nowTimestamp >=
      parseTimestamp(
        storedSession.expiresAt,
        "Stored authenticated session expiresAt",
      )
    ) {
      throw new Error(
        "Authenticated session has expired.",
      );
    }

    return storedSession;
  }

  async revokeSession(
    request:
      RevokeAuthenticatedTenantSessionRequest,
  ): Promise<AuthenticatedTenantSessionRecord> {
    this.ensureOpen();

    const sessionId =
      requireNonEmpty(
        request.sessionId,
        "Authenticated session ID",
      );

    const reason =
      requireNonEmpty(
        request.reason,
        "Authenticated session revocation reason",
      );

    const revokedAt =
      requireNonEmpty(
        request.revokedAt,
        "Authenticated session revokedAt",
      );

    const revokedAtTimestamp =
      parseTimestamp(
        revokedAt,
        "Authenticated session revokedAt",
      );

    this.database.exec(
      "BEGIN IMMEDIATE",
    );

    try {
      const existingRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_sessions
            WHERE session_id = ?
          `)
          .get(
            sessionId,
          );

      if (!existingRow) {
        throw new Error(
          "Authenticated session was not found.",
        );
      }

      const existing =
        parseSessionRow(
          existingRow,
        );

      if (
        existing.revokedAt !==
        null
      ) {
        const exactReplay =
          existing.revokedAt ===
            revokedAt &&
          existing.revocationReason ===
            reason;

        if (!exactReplay) {
          throw new Error(
            "Authenticated session revocation conflicts with existing durable evidence.",
          );
        }

        this.database.exec(
          "COMMIT",
        );

        return existing;
      }

      this.database
        .prepare(`
          UPDATE nexus_authenticated_sessions
          SET
            revoked_at = ?,
            revoked_at_ms = ?,
            revocation_reason = ?,
            updated_at = ?
          WHERE
            session_id = ?
            AND revoked_at IS NULL
        `)
        .run(
          revokedAt,
          revokedAtTimestamp,
          reason,
          revokedAt,
          sessionId,
        );

      const revokedRow =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_authenticated_sessions
            WHERE session_id = ?
          `)
          .get(
            sessionId,
          );

      if (!revokedRow) {
        throw new Error(
          "Authenticated session revocation result is missing.",
        );
      }

      this.database.exec(
        "COMMIT",
      );

      return parseSessionRow(
        revokedRow,
      );
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async readSnapshot():
    Promise<AuthenticatedTenantSessionRecord[]> {
    this.ensureOpen();

    return this.database
      .prepare(`
        SELECT *
        FROM nexus_authenticated_sessions
        ORDER BY
          tenant_id,
          actor_id,
          session_id
      `)
      .all()
      .map(
        parseSessionRow,
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
      // Original transactional error remains authoritative.
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "Authenticated session store is closed.",
      );
    }
  }
}
