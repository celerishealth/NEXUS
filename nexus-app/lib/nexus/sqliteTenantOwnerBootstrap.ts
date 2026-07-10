import {
  randomBytes,
  scryptSync,
} from "node:crypto";
import {
  mkdirSync,
} from "node:fs";
import {
  dirname,
} from "node:path";
import type {
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

export type NexusTenantStatus =
  | "active"
  | "suspended";

export type NexusTenantOnboardingState =
  | "OWNER_SESSION_READY";

export interface AtomicTenantOwnerBootstrapRequest {
  tenantId: string;
  tenantSlug: string;
  tenantDisplayName: string;
  principalId: string;
  actorId: string;
  ownerEmail: string;
  ownerPassword: string;
  sessionClaims:
    AuthenticatedTenantSessionClaims;
  createdAt: string;
}

export interface AtomicTenantOwnerBootstrapResult {
  tenant: {
    tenantId: string;
    tenantSlug: string;
    tenantDisplayName: string;
    status: NexusTenantStatus;
    onboardingState:
      NexusTenantOnboardingState;
    createdAt: string;
  };
  owner: {
    principalId: string;
    actorId: string;
    role: "owner";
    emailNormalized: string;
    credentialVersion: 1;
  };
  session: {
    sessionId: string;
    issuedAt: string;
    expiresAt: string;
  };
  liveProviderExecutionAuthorized: false;
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

function normalizeSlug(
  value: string,
): string {
  const normalized =
    requireNonEmpty(
      value,
      "Tenant slug",
    ).toLowerCase();

  if (
    normalized.length < 3 ||
    normalized.length > 63 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      normalized,
    )
  ) {
    throw new Error(
      "Tenant slug must contain 3 to 63 lowercase letters, numbers, or single hyphens.",
    );
  }

  return normalized;
}

function normalizeDisplayName(
  value: string,
): string {
  const normalized =
    requireNonEmpty(
      value,
      "Tenant display name",
    );

  if (
    normalized.length < 2 ||
    normalized.length > 120
  ) {
    throw new Error(
      "Tenant display name must contain between 2 and 120 characters.",
    );
  }

  return normalized;
}

function normalizeEmail(
  value: string,
): string {
  const normalized =
    requireNonEmpty(
      value,
      "Owner email",
    ).toLowerCase();

  if (
    normalized.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalized,
    )
  ) {
    throw new Error(
      "Owner email is invalid.",
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
      "Owner password must contain between 12 and 256 characters.",
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

function assertRequiredAuthTablesExist(
  database: SQLiteDatabase,
): void {
  const principalTable =
    database
      .prepare(`
        SELECT name
        FROM sqlite_master
        WHERE
          type = 'table'
          AND name =
            'nexus_authenticated_principals'
      `)
      .get();

  const sessionTable =
    database
      .prepare(`
        SELECT name
        FROM sqlite_master
        WHERE
          type = 'table'
          AND name =
            'nexus_authenticated_sessions'
      `)
      .get();

  if (
    !principalTable ||
    !sessionTable
  ) {
    throw new Error(
      "Authenticated principal and session schemas must exist before tenant onboarding.",
    );
  }
}

export class SQLiteTenantOwnerBootstrapStore {
  private readonly database:
    SQLiteDatabase;

  private closed = false;

  constructor(
    databasePath: string,
  ) {
    const normalizedPath =
      requireNonEmpty(
        databasePath,
        "Tenant-onboarding SQLite path",
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
    `);

    assertRequiredAuthTablesExist(
      this.database,
    );

    this.database.exec(`
      CREATE TABLE IF NOT EXISTS nexus_tenants (
        tenant_id TEXT PRIMARY KEY
          CHECK (length(tenant_id) > 0),
        tenant_slug TEXT NOT NULL UNIQUE
          CHECK (
            length(tenant_slug) >= 3
            AND length(tenant_slug) <= 63
          ),
        tenant_display_name TEXT NOT NULL
          CHECK (
            length(tenant_display_name) >= 2
            AND length(tenant_display_name) <= 120
          ),
        status TEXT NOT NULL
          CHECK (
            status IN (
              'active',
              'suspended'
            )
          ),
        onboarding_state TEXT NOT NULL
          CHECK (
            onboarding_state IN (
              'OWNER_SESSION_READY'
            )
          ),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS
        nexus_tenants_status_idx
      ON nexus_tenants (
        status,
        tenant_slug
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
        7,
        "atomic_tenant_owner_onboarding_v1",
        new Date().toISOString(),
      );
  }

  async bootstrapTenantOwner(
    request:
      AtomicTenantOwnerBootstrapRequest,
  ): Promise<AtomicTenantOwnerBootstrapResult> {
    this.ensureOpen();

    const tenantId =
      requireNonEmpty(
        request.tenantId,
        "Tenant ID",
      );

    const tenantSlug =
      normalizeSlug(
        request.tenantSlug,
      );

    const tenantDisplayName =
      normalizeDisplayName(
        request.tenantDisplayName,
      );

    const principalId =
      requireNonEmpty(
        request.principalId,
        "Owner principal ID",
      );

    const actorId =
      requireNonEmpty(
        request.actorId,
        "Owner actor ID",
      );

    const ownerEmail =
      normalizeEmail(
        request.ownerEmail,
      );

    const ownerPassword =
      validatePassword(
        request.ownerPassword,
      );

    const createdAt =
      requireNonEmpty(
        request.createdAt,
        "Tenant onboarding creation time",
      );

    parseTimestamp(
      createdAt,
      "Tenant onboarding creation time",
    );

    const claims =
      request.sessionClaims;

    if (
      claims.version !== 1 ||
      claims.tenantId !==
        tenantId ||
      claims.actorId !==
        actorId ||
      claims.role !==
        "owner"
    ) {
      throw new Error(
        "Onboarding session claims must match the new tenant owner exactly.",
      );
    }

    requireNonEmpty(
      claims.keyId,
      "Onboarding session keyId",
    );

    requireNonEmpty(
      claims.sessionId,
      "Onboarding session ID",
    );

    const issuedAtMs =
      parseTimestamp(
        claims.issuedAt,
        "Onboarding session issuedAt",
      );

    const expiresAtMs =
      parseTimestamp(
        claims.expiresAt,
        "Onboarding session expiresAt",
      );

    if (
      expiresAtMs <=
      issuedAtMs
    ) {
      throw new Error(
        "Onboarding session expiry must be after issue time.",
      );
    }

    this.database.exec(
      "BEGIN IMMEDIATE",
    );

    try {
      const tenantConflict =
        this.database
          .prepare(`
            SELECT tenant_id
            FROM nexus_tenants
            WHERE
              tenant_id = ?
              OR tenant_slug = ?
          `)
          .get(
            tenantId,
            tenantSlug,
          );

      if (tenantConflict) {
        throw new Error(
          "Tenant ID or tenant slug already exists.",
        );
      }

      const principalConflict =
        this.database
          .prepare(`
            SELECT principal_id
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
            ownerEmail,
          );

      if (principalConflict) {
        throw new Error(
          "Tenant owner identity or email already exists.",
        );
      }

      const sessionConflict =
        this.database
          .prepare(`
            SELECT session_id
            FROM nexus_authenticated_sessions
            WHERE session_id = ?
          `)
          .get(
            claims.sessionId,
          );

      if (sessionConflict) {
        throw new Error(
          "Onboarding session ID already exists.",
        );
      }

      const passwordSaltHex =
        randomBytes(
          PASSWORD_SALT_BYTES,
        ).toString("hex");

      const passwordHashHex =
        hashPassword(
          ownerPassword,
          passwordSaltHex,
        );

      this.database
        .prepare(`
          INSERT INTO nexus_tenants (
            tenant_id,
            tenant_slug,
            tenant_display_name,
            status,
            onboarding_state,
            created_at,
            updated_at
          )
          VALUES (
            ?,
            ?,
            ?,
            'active',
            'OWNER_SESSION_READY',
            ?,
            ?
          )
        `)
        .run(
          tenantId,
          tenantSlug,
          tenantDisplayName,
          createdAt,
          createdAt,
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
            ?,
            ?,
            ?,
            'owner',
            ?,
            ?,
            ?,
            'active',
            1,
            0,
            NULL,
            NULL,
            NULL,
            ?,
            ?,
            ?
          )
        `)
        .run(
          principalId,
          tenantId,
          actorId,
          ownerEmail,
          passwordSaltHex,
          passwordHashHex,
          createdAt,
          createdAt,
          createdAt,
        );

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
            ?,
            ?,
            ?,
            ?,
            'owner',
            ?,
            ?,
            ?,
            ?,
            NULL,
            NULL,
            NULL,
            ?,
            ?
          )
        `)
        .run(
          claims.sessionId,
          claims.keyId,
          tenantId,
          actorId,
          claims.issuedAt,
          issuedAtMs,
          claims.expiresAt,
          expiresAtMs,
          createdAt,
          createdAt,
        );

      const tenantRow =
        this.database
          .prepare(`
            SELECT
              tenant_id,
              tenant_slug,
              tenant_display_name,
              status,
              onboarding_state,
              created_at
            FROM nexus_tenants
            WHERE tenant_id = ?
          `)
          .get(
            tenantId,
          );

      const principalRow =
        this.database
          .prepare(`
            SELECT
              principal_id,
              actor_id,
              role,
              email_normalized,
              credential_version
            FROM nexus_authenticated_principals
            WHERE principal_id = ?
          `)
          .get(
            principalId,
          );

      const sessionRow =
        this.database
          .prepare(`
            SELECT
              session_id,
              issued_at,
              expires_at
            FROM nexus_authenticated_sessions
            WHERE session_id = ?
          `)
          .get(
            claims.sessionId,
          );

      if (
        !tenantRow ||
        !principalRow ||
        !sessionRow
      ) {
        throw new Error(
          "Atomic tenant onboarding evidence is incomplete.",
        );
      }

      this.database.exec(
        "COMMIT",
      );

      return {
        tenant: {
          tenantId,
          tenantSlug,
          tenantDisplayName,
          status:
            "active",
          onboardingState:
            "OWNER_SESSION_READY",
          createdAt,
        },
        owner: {
          principalId,
          actorId,
          role:
            "owner",
          emailNormalized:
            ownerEmail,
          credentialVersion:
            1,
        },
        session: {
          sessionId:
            claims.sessionId,
          issuedAt:
            claims.issuedAt,
          expiresAt:
            claims.expiresAt,
        },
        liveProviderExecutionAuthorized:
          false,
      };
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async readTenantSnapshot():
    Promise<
      Array<{
        tenantId: string;
        tenantSlug: string;
        tenantDisplayName: string;
        status: string;
        onboardingState: string;
      }>
    > {
    this.ensureOpen();

    return this.database
      .prepare(`
        SELECT
          tenant_id,
          tenant_slug,
          tenant_display_name,
          status,
          onboarding_state
        FROM nexus_tenants
        ORDER BY tenant_slug
      `)
      .all()
      .map(
        (row) => ({
          tenantId:
            String(
              row.tenant_id,
            ),
          tenantSlug:
            String(
              row.tenant_slug,
            ),
          tenantDisplayName:
            String(
              row.tenant_display_name,
            ),
          status:
            String(
              row.status,
            ),
          onboardingState:
            String(
              row.onboarding_state,
            ),
        }),
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
      // Original onboarding failure remains authoritative.
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "Tenant-owner bootstrap store is closed.",
      );
    }
  }
}
