import {
  randomUUID,
} from "node:crypto";

import pg from "pg";

const { Pool } = pg;

export const PROTECTED_API_OPERATIONAL_CONTROL_MODE =
  "postgres-circuit-breaker-v1";

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
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    ssl: sslRequired
      ? {
          rejectUnauthorized: false,
        }
      : false,
  });
}

export class PostgresProtectedApiOperationalControlStore {
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

  async evaluateAccess({
    tenantId,
    ownerId,
    routeKey,
    requestId,
  }) {
    const normalizedTenantId =
      normalizeString(tenantId);

    const normalizedOwnerId =
      normalizeString(ownerId);

    const normalizedRouteKey =
      normalizeString(routeKey);

    const normalizedRequestId =
      normalizeString(requestId);

    if (
      !normalizedTenantId ||
      !normalizedOwnerId ||
      !normalizedRouteKey ||
      !normalizedRequestId
    ) {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "OPERATIONAL_CONTROL_INPUT_INVALID",
      });
    }

    if (!this.available) {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "OPERATIONAL_CONTROL_STORE_UNAVAILABLE",
      });
    }

    const eventId =
      `security-${randomUUID()}`;

    try {
      const result =
        await this.pool.query(
          `
            WITH evaluation AS (
              SELECT
                (
                  COUNT(*) FILTER (
                    WHERE tenant_id = '*'
                      AND route_key = '*'
                  )
                )::INTEGER AS global_control_count,

                (
                  COUNT(*) FILTER (
                    WHERE mode <> 'OPEN'
                  )
                )::INTEGER AS blocking_control_count,

                MAX(mode) FILTER (
                  WHERE mode <> 'OPEN'
                ) AS blocking_mode,

                MAX(reason_code) FILTER (
                  WHERE mode <> 'OPEN'
                ) AS blocking_reason,

                MAX(authority_epoch) AS authority_epoch
              FROM nexus_protected_api_operational_state
              WHERE tenant_id IN ('*', $1)
                AND route_key IN ('*', $3)
            ),

            security_event AS (
              INSERT INTO nexus_security_event (
                event_id,
                severity,
                event_type,
                tenant_id,
                owner_id,
                request_id,
                route_key,
                decision,
                metadata_json
              )
              SELECT
                $5,

                CASE
                  WHEN global_control_count <> 1
                    THEN 'HIGH'
                  WHEN blocking_control_count > 0
                    THEN 'HIGH'
                  ELSE 'INFO'
                END,

                CASE
                  WHEN global_control_count <> 1
                    THEN 'OPERATIONAL_CONTROL_FAILED_CLOSED'
                  WHEN blocking_control_count > 0
                    THEN 'OPERATIONAL_CONTROL_BLOCKED'
                  ELSE 'OPERATIONAL_CONTROL_ALLOWED'
                END,

                $1,
                $2,
                $4,
                $3,

                CASE
                  WHEN global_control_count <> 1
                    THEN 'FAILED_CLOSED'
                  WHEN blocking_control_count > 0
                    THEN 'BLOCKED'
                  ELSE 'ALLOWED'
                END,

                JSONB_BUILD_OBJECT(
                  'globalControlCount',
                  global_control_count,
                  'blockingControlCount',
                  blocking_control_count,
                  'blockingMode',
                  blocking_mode,
                  'blockingReason',
                  blocking_reason,
                  'authorityEpoch',
                  authority_epoch
                )
              FROM evaluation
              RETURNING event_id
            )

            SELECT
              evaluation.global_control_count,
              evaluation.blocking_control_count,
              evaluation.blocking_mode,
              evaluation.blocking_reason,
              evaluation.authority_epoch,
              security_event.event_id
            FROM evaluation
            CROSS JOIN security_event
          `,
          [
            normalizedTenantId,
            normalizedOwnerId,
            normalizedRouteKey,
            normalizedRequestId,
            eventId,
          ],
        );

      const row =
        result.rows?.[0];

      const globalControlCount =
        Number(
          row?.global_control_count,
        );

      const blockingControlCount =
        Number(
          row?.blocking_control_count,
        );

      if (
        !Number.isSafeInteger(
          globalControlCount,
        ) ||
        !Number.isSafeInteger(
          blockingControlCount,
        ) ||
        !normalizeString(
          row?.event_id,
        )
      ) {
        return Object.freeze({
          ok: false,
          allowed: false,
          errorCode:
            "OPERATIONAL_CONTROL_RESULT_INVALID",
        });
      }

      const initialized =
        globalControlCount === 1;

      const allowed =
        initialized &&
        blockingControlCount === 0;

      return Object.freeze({
        ok: true,
        allowed,
        initialized,
        globalControlCount,
        blockingControlCount,
        blockingMode:
          normalizeString(
            row.blocking_mode,
          ) || null,
        blockingReason:
          normalizeString(
            row.blocking_reason,
          ) || null,
        authorityEpoch:
          normalizeString(
            row.authority_epoch,
          ) || null,
        eventId:
          normalizeString(
            row.event_id,
          ),
        durable: true,
      });
    } catch {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "OPERATIONAL_CONTROL_STORE_FAILURE",
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
              'public.nexus_protected_api_operational_state'
            ) AS operational_table,

            TO_REGCLASS(
              'public.nexus_security_event'
            ) AS security_event_table
        `);

      const row =
        result.rows?.[0] ?? {};

      const ready =
        Boolean(
          row.operational_table,
        ) &&
        Boolean(
          row.security_event_table,
        );

      return Object.freeze({
        ready,
        state: ready
          ? "OPERATIONAL_CONTROL_TABLE_READY"
          : "OPERATIONAL_CONTROL_MIGRATION_REQUIRED",
      });
    } catch {
      return Object.freeze({
        ready: false,
        state:
          "OPERATIONAL_CONTROL_DATABASE_UNREACHABLE",
      });
    }
  }
}

let storeSingleton;

export function getProtectedApiOperationalControlStore() {
  if (!storeSingleton) {
    storeSingleton =
      new PostgresProtectedApiOperationalControlStore();
  }

  return storeSingleton;
}

export function resetProtectedApiOperationalControlStoreForTests() {
  storeSingleton = undefined;
}

export function getProtectedApiOperationalControlPosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-operational-control-posture.v1",
    mode:
      PROTECTED_API_OPERATIONAL_CONTROL_MODE,
    databaseConfigured:
      Boolean(
        normalizeString(
          process.env.DATABASE_URL,
        ),
      ),
    migrationFile:
      "db/migrations/0004_nexus_operational_circuit_breaker.sql",
    scopes: Object.freeze([
      "GLOBAL",
      "TENANT",
      "ROUTE",
      "TENANT_ROUTE",
    ]),
    explicitGlobalOpenRequired:
      true,
    emergencyGlobalBlock:
      true,
    emergencyTenantBlock:
      true,
    emergencyRouteBlock:
      true,
    durableIncidentEvidence:
      true,
    liveMigrationPerformed:
      false,
    executionAuthorized:
      false,
    providerInvocationAuthorized:
      false,
  });
}
