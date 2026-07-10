import {
  createHash,
} from "node:crypto";

import pg from "pg";

const { Pool } = pg;

export const DURABLE_REPLAY_MODE =
  "postgres-atomic-v1";

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function hashNonce(nonce) {
  return createHash("sha256")
    .update(normalizeString(nonce))
    .digest("hex");
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
      process.env
        .NEXUS_DATABASE_SSL_MODE,
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

export class PostgresProtectedApiReplayStore {
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

  async consumeNonce({
    tenantId,
    ownerId,
    nonce,
    requestId,
    pathname,
    bodySha256,
    nowMs,
    expiresAtMs,
  }) {
    if (!this.available) {
      return Object.freeze({
        ok: false,
        consumed: false,
        errorCode:
          "DURABLE_REPLAY_STORE_UNAVAILABLE",
      });
    }

    const normalizedTenantId =
      normalizeString(tenantId);

    const normalizedOwnerId =
      normalizeString(ownerId);

    const normalizedNonce =
      normalizeString(nonce);

    const normalizedRequestId =
      normalizeString(requestId);

    const normalizedPathname =
      normalizeString(pathname);

    const normalizedBodySha256 =
      normalizeString(
        bodySha256,
      ).toLowerCase();

    if (
      !normalizedTenantId ||
      !normalizedOwnerId ||
      !normalizedNonce ||
      !normalizedRequestId ||
      !normalizedPathname ||
      !/^[a-f0-9]{64}$/.test(
        normalizedBodySha256,
      ) ||
      !Number.isSafeInteger(nowMs) ||
      !Number.isSafeInteger(
        expiresAtMs,
      ) ||
      expiresAtMs <= nowMs
    ) {
      return Object.freeze({
        ok: false,
        consumed: false,
        errorCode:
          "DURABLE_REPLAY_INPUT_INVALID",
      });
    }

    const nonceHash =
      hashNonce(normalizedNonce);

    try {
      const result =
        await this.pool.query(
          `
            INSERT INTO nexus_protected_api_nonce (
              tenant_id,
              owner_id,
              nonce_hash,
              request_id,
              pathname,
              body_sha256,
              consumed_at,
              expires_at
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              TO_TIMESTAMP($7 / 1000.0),
              TO_TIMESTAMP($8 / 1000.0)
            )
            ON CONFLICT (
              tenant_id,
              owner_id,
              nonce_hash
            )
            DO NOTHING
            RETURNING nonce_hash
          `,
          [
            normalizedTenantId,
            normalizedOwnerId,
            nonceHash,
            normalizedRequestId,
            normalizedPathname,
            normalizedBodySha256,
            nowMs,
            expiresAtMs,
          ],
        );

      return Object.freeze({
        ok: true,
        consumed:
          result.rowCount === 1,
        nonceHash,
        durable: true,
      });
    } catch {
      return Object.freeze({
        ok: false,
        consumed: false,
        errorCode:
          "DURABLE_REPLAY_STORE_FAILURE",
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
              'public.nexus_protected_api_nonce'
            ) AS table_name
        `);

      const ready =
        Boolean(
          result.rows?.[0]
            ?.table_name,
        );

      return Object.freeze({
        ready,
        state: ready
          ? "DURABLE_REPLAY_TABLE_READY"
          : "DURABLE_REPLAY_MIGRATION_REQUIRED",
      });
    } catch {
      return Object.freeze({
        ready: false,
        state:
          "DURABLE_REPLAY_DATABASE_UNREACHABLE",
      });
    }
  }
}

let replayStoreSingleton;

export function getProtectedApiReplayStore() {
  if (!replayStoreSingleton) {
    replayStoreSingleton =
      new PostgresProtectedApiReplayStore();
  }

  return replayStoreSingleton;
}

export function resetProtectedApiReplayStoreForTests() {
  replayStoreSingleton = undefined;
}

export function getProtectedApiReplayStorePosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.protected-api-durable-replay-posture.v1",
    mode:
      DURABLE_REPLAY_MODE,
    databaseConfigured:
      Boolean(
        normalizeString(
          process.env.DATABASE_URL,
        ),
      ),
    migrationFile:
      "db/migrations/0001_nexus_protected_api_nonce.sql",
    atomicControl:
      "POSTGRES_PRIMARY_KEY_AND_INSERT_ON_CONFLICT",
    tenantBound: true,
    ownerBound: true,
    rawNoncePersisted: false,
    nonceHashAlgorithm:
      "SHA-256",
    distributedReplayProtection:
      true,
    liveMigrationPerformed:
      false,
    executionAuthorized: false,
    providerInvocationAuthorized:
      false,
  });
}
