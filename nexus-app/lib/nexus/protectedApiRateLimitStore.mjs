import {
  randomUUID,
} from "node:crypto";

import pg from "pg";

const { Pool } = pg;

export const PROTECTED_API_RATE_LIMIT_MODE =
  "postgres-rate-limit-v1";

export const DEFAULT_RATE_LIMIT_WINDOW_MS =
  60 * 1000;

export const DEFAULT_RATE_LIMIT_MAX_REQUESTS =
  60;

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

export class PostgresProtectedApiRateLimitStore {
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

  async consume({
    tenantId,
    ownerId,
    routeKey,
    requestId,
    nowMs,
    windowMs =
      DEFAULT_RATE_LIMIT_WINDOW_MS,
    maximumRequests =
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
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
      !normalizedRequestId ||
      !Number.isSafeInteger(nowMs) ||
      !Number.isSafeInteger(windowMs) ||
      windowMs < 1000 ||
      !Number.isSafeInteger(
        maximumRequests,
      ) ||
      maximumRequests < 1
    ) {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "RATE_LIMIT_INPUT_INVALID",
      });
    }

    if (!this.available) {
      return Object.freeze({
        ok: false,
        allowed: false,
        errorCode:
          "RATE_LIMIT_STORE_UNAVAILABLE",
      });
    }

    const windowStartMs =
      Math.floor(
        nowMs / windowMs,
      ) * windowMs;

    const windowEndMs =
      windowStartMs + windowMs;

    const eventId =
      `security-${randomUUID()}`;

    try {
      const result =
        await this.pool.query(
          `
            WITH rate AS (
              INSERT INTO nexus_protected_api_rate_limit_bucket (
                tenant_id,
                owner_id,
                route_key,
                window_start,
                window_end,
                request_count,
                last_request_id,
                updated_at
              )
              VALUES (
                $1,
                $2,
                $3,
                TO_TIMESTAMP($4 / 1000.0),
                TO_TIMESTAMP($5 / 1000.0),
                1,
                $6,
                NOW()
              )
              ON CONFLICT (
                tenant_id,
                owner_id,
                route_key,
                window_start
              )
              DO UPDATE SET
                request_count =
                  nexus_protected_api_rate_limit_bucket.request_count + 1,
                last_request_id =
                  EXCLUDED.last_request_id,
                updated_at = NOW()
              RETURNING request_count
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
                $7,
                CASE
                  WHEN rate.request_count <= $8
                    THEN 'INFO'
                  ELSE 'WARN'
                END,
                CASE
                  WHEN rate.request_count <= $8
                    THEN 'RATE_LIMIT_ALLOWED'
                  ELSE 'RATE_LIMIT_BLOCKED'
                END,
                $1,
                $2,
                $6,
                $3,
                CASE
                  WHEN rate.request_count <= $8
                    THEN 'ALLOWED'
                  ELSE 'BLOCKED'
                END,
                JSONB_BUILD_OBJECT(
                  'requestCount',
                  rate.request_count,
                  'maximumRequests',
                  $8,
                  'windowMs',
                  $9,
                  'windowStartMs',
                  $4,
                  'windowEndMs',
                  $5
                )
              FROM rate
              RETURNING event_id
            )

            SELECT
              rate.request_count,
              security_event.event_id
            FROM rate
            CROSS JOIN security_event
          `,
          [
            normalizedTenantId,
            normalizedOwnerId,
            normalizedRouteKey,
            windowStartMs,
            windowEndMs,
            normalizedRequestId,
            eventId,
            maximumRequests,
            windowMs,
          ],
        );

      const row =
        result.rows?.[0];

      const requestCount =
        Number(
          row?.request_count,
        );

      if (
        !Number.isSafeInteger(
          requestCount,
        ) ||
        requestCount < 1 ||
        !normalizeString(
          row?.event_id,
        )
      ) {
        return Object.freeze({
          ok: false,
          allowed: false,
          errorCode:
            "RATE_LIMIT_STORE_RESULT_INVALID",
        });
      }

      const allowed =
        requestCount <=
        maximumRequests;

      return Object.freeze({
        ok: true,
        allowed,
        requestCount,
        maximumRequests,
        remaining:
          Math.max(
            0,
            maximumRequests -
              requestCount,
          ),
        windowStartMs,
        windowEndMs,
        retryAfterSeconds:
          allowed
            ? 0
            : Math.max(
                1,
                Math.ceil(
                  (
                    windowEndMs -
                    nowMs
                  ) / 1000,
                ),
              ),
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
          "RATE_LIMIT_STORE_FAILURE",
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
              'public.nexus_protected_api_rate_limit_bucket'
            ) AS rate_limit_table,

            TO_REGCLASS(
              'public.nexus_security_event'
            ) AS security_event_table
        `);

      const row =
        result.rows?.[0] ?? {};

      const ready =
        Boolean(
          row.rate_limit_table,
        ) &&
        Boolean(
          row.security_event_table,
        );

      return Object.freeze({
        ready,
        state: ready
          ? "RATE_LIMIT_AND_SECURITY_EVENT_TABLES_READY"
          : "RATE_LIMIT_MIGRATION_REQUIRED",
      });
    } catch {
      return Object.freeze({
        ready: false,
        state:
          "RATE_LIMIT_DATABASE_UNREACHABLE",
      });
    }
  }
}

let storeSingleton;

export function getProtectedApiRateLimitStore() {
  if (!storeSingleton) {
    storeSingleton =
      new PostgresProtectedApiRateLimitStore();
  }

  return storeSingleton;
}

export function resetProtectedApiRateLimitStoreForTests() {
  storeSingleton = undefined;
}

export function getProtectedApiRateLimitStorePosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-rate-limit-store-posture.v1",
    mode:
      PROTECTED_API_RATE_LIMIT_MODE,
    databaseConfigured:
      Boolean(
        normalizeString(
          process.env.DATABASE_URL,
        ),
      ),
    migrationFile:
      "db/migrations/0003_nexus_rate_limit_security_event.sql",
    defaultWindowMs:
      DEFAULT_RATE_LIMIT_WINDOW_MS,
    defaultMaximumRequests:
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
    distributedAtomicCounter:
      true,
    tenantBound: true,
    ownerBound: true,
    routeBound: true,
    durableSecurityEventEvidence:
      true,
    liveMigrationPerformed:
      false,
    executionAuthorized:
      false,
    providerInvocationAuthorized:
      false,
  });
}
