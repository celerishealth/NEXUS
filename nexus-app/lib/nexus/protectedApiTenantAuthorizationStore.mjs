import pg from "pg";

const { Pool } = pg;

export const TENANT_AUTHORIZATION_MODE =
  "postgres-membership-v1";

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function createPoolFromEnvironment() {
  const connectionString =
    normalizeString(
      process.env.DATABASE_URL,
    );

  if (!connectionString) {
    return null;
  }

  const sslRequired =
    normalizeString(
      process.env.NEXUS_DATABASE_SSL_MODE,
    ).toLowerCase() !== "disable";

  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    ssl: sslRequired
      ? {
          rejectUnauthorized: false,
        }
      : false,
  });
}

export class PostgresProtectedApiTenantAuthorizationStore {
  constructor({
    pool,
  } = {}) {
    this.pool =
      pool ?? createPoolFromEnvironment();
  }

  get available() {
    return Boolean(
      this.pool &&
      typeof this.pool.query === "function",
    );
  }

  async authorizeOwner({
    tenantId,
    ownerId,
  }) {
    const normalizedTenantId =
      normalizeString(tenantId);

    const normalizedOwnerId =
      normalizeString(ownerId);

    if (
      !normalizedTenantId ||
      !normalizedOwnerId
    ) {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "TENANT_AUTHORIZATION_INPUT_INVALID",
      });
    }

    if (!this.available) {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "TENANT_AUTHORIZATION_STORE_UNAVAILABLE",
      });
    }

    try {
      const result =
        await this.pool.query(
          `
            SELECT
              tenant.tenant_id,
              tenant.status AS tenant_status,
              owner_identity.owner_id,
              owner_identity.status AS owner_status,
              membership.role,
              membership.status AS membership_status,
              membership.authority_epoch
            FROM nexus_tenant_owner_membership AS membership
            INNER JOIN nexus_tenant AS tenant
              ON tenant.tenant_id = membership.tenant_id
            INNER JOIN nexus_owner_identity AS owner_identity
              ON owner_identity.owner_id = membership.owner_id
            WHERE membership.tenant_id = $1
              AND membership.owner_id = $2
            LIMIT 1
          `,
          [
            normalizedTenantId,
            normalizedOwnerId,
          ],
        );

      const row =
        result.rows?.[0];

      if (!row) {
        return Object.freeze({
          ok: true,
          allowed: false,
          reasonCode:
            "TENANT_OWNER_MEMBERSHIP_NOT_FOUND",
        });
      }

      const allowed =
        row.tenant_status === "ACTIVE" &&
        row.owner_status === "ACTIVE" &&
        row.membership_status === "ACTIVE" &&
        row.role === "OWNER" &&
        Boolean(
          normalizeString(
            row.authority_epoch,
          ),
        );

      return Object.freeze({
        ok: true,
        allowed,
        reasonCode: allowed
          ? null
          : "TENANT_OWNER_MEMBERSHIP_INACTIVE",
        membership: allowed
          ? Object.freeze({
              tenantId:
                normalizeString(
                  row.tenant_id,
                ),
              ownerId:
                normalizeString(
                  row.owner_id,
                ),
              role:
                normalizeString(
                  row.role,
                ),
              authorityEpoch:
                normalizeString(
                  row.authority_epoch,
                ),
            })
          : null,
      });
    } catch {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "TENANT_AUTHORIZATION_STORE_FAILURE",
      });
    }
  }

  async checkReadiness() {
    if (!this.available) {
      return Object.freeze({
        ready: false,
        state:
          "DATABASE_URL_UNAVAILABLE",
      });
    }

    try {
      const result =
        await this.pool.query(`
          SELECT
            TO_REGCLASS(
              'public.nexus_tenant'
            ) AS tenant_table,
            TO_REGCLASS(
              'public.nexus_owner_identity'
            ) AS owner_table,
            TO_REGCLASS(
              'public.nexus_tenant_owner_membership'
            ) AS membership_table
        `);

      const row =
        result.rows?.[0] ?? {};

      const ready =
        Boolean(row.tenant_table) &&
        Boolean(row.owner_table) &&
        Boolean(row.membership_table);

      return Object.freeze({
        ready,
        state: ready
          ? "TENANT_AUTHORIZATION_TABLES_READY"
          : "TENANT_AUTHORIZATION_MIGRATION_REQUIRED",
      });
    } catch {
      return Object.freeze({
        ready: false,
        state:
          "TENANT_AUTHORIZATION_DATABASE_UNREACHABLE",
      });
    }
  }
}

let storeSingleton;

export function getProtectedApiTenantAuthorizationStore() {
  if (!storeSingleton) {
    storeSingleton =
      new PostgresProtectedApiTenantAuthorizationStore();
  }

  return storeSingleton;
}

export function resetProtectedApiTenantAuthorizationStoreForTests() {
  storeSingleton = undefined;
}

export function getProtectedApiTenantAuthorizationPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-tenant-authorization-posture.v1",
    mode:
      TENANT_AUTHORIZATION_MODE,
    databaseConfigured:
      Boolean(
        normalizeString(
          process.env.DATABASE_URL,
        ),
      ),
    migrationFile:
      "db/migrations/0002_nexus_tenant_owner_membership.sql",
    tenantStatusRequired:
      "ACTIVE",
    ownerStatusRequired:
      "ACTIVE",
    membershipStatusRequired:
      "ACTIVE",
    requiredRole:
      "OWNER",
    authorityEpochRequired:
      true,
    crossTenantAccessAllowed:
      false,
    liveMigrationPerformed:
      false,
    executionAuthorized:
      false,
    providerInvocationAuthorized:
      false,
  });
}
