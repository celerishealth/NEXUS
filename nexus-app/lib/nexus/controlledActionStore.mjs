import {
  createHash,
  randomUUID,
} from "node:crypto";

import pg from "pg";

const { Pool } = pg;

export const CONTROLLED_ACTION_STORE_MODE =
  "postgres-controlled-action-v1";

export const CONTROLLED_ACTION_STATES =
  Object.freeze([
    "CREATED",
    "PENDING_OWNER_REVIEW",
    "APPROVED_FOR_DRY_RUN",
    "SIMULATED",
    "APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW",
    "REWORK_REQUIRED",
    "REJECTED",
  ]);

const GENESIS_HASH =
  "0".repeat(64);

const ALLOWED_TRANSITIONS =
  Object.freeze({
    CREATED: Object.freeze([
      "PENDING_OWNER_REVIEW",
      "REWORK_REQUIRED",
      "REJECTED",
    ]),

    PENDING_OWNER_REVIEW:
      Object.freeze([
        "APPROVED_FOR_DRY_RUN",
        "REWORK_REQUIRED",
        "REJECTED",
      ]),

    APPROVED_FOR_DRY_RUN:
      Object.freeze([
        "SIMULATED",
        "REWORK_REQUIRED",
        "REJECTED",
      ]),

    SIMULATED:
      Object.freeze([
        "APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW",
        "REWORK_REQUIRED",
        "REJECTED",
      ]),

    REWORK_REQUIRED:
      Object.freeze([
        "PENDING_OWNER_REVIEW",
        "REJECTED",
      ]),

    APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW:
      Object.freeze([]),

    REJECTED:
      Object.freeze([]),
  });

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function stableSerialize(value) {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return `[${value
      .map(stableSerialize)
      .join(",")}]`;
  }

  if (
    typeof value === "object"
  ) {
    const entries =
      Object.keys(value)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableSerialize(value[key])}`,
        );

    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256")
    .update(value)
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

function createEvidenceHash({
  tenantId,
  actionId,
  sequence,
  eventId,
  fromState,
  toState,
  ownerId,
  requestId,
  authorityEpoch,
  previousEvidenceHash,
  payloadSha256,
}) {
  return sha256(
    [
      "nexus.controlled-action-event.v1",
      tenantId,
      actionId,
      String(sequence),
      eventId,
      fromState ?? "",
      toState,
      ownerId,
      requestId,
      authorityEpoch,
      previousEvidenceHash,
      payloadSha256,
    ].join("\n"),
  );
}

function mapAction(row) {
  if (!row) {
    return null;
  }

  return Object.freeze({
    tenantId:
      normalizeString(
        row.tenant_id,
      ),
    actionId:
      normalizeString(
        row.action_id,
      ),
    ownerId:
      normalizeString(
        row.owner_id,
      ),
    actionType:
      normalizeString(
        row.action_type,
      ),
    idempotencyKey:
      normalizeString(
        row.idempotency_key,
      ),
    payload:
      row.payload_json,
    payloadSha256:
      normalizeString(
        row.payload_sha256,
      ),
    state:
      normalizeString(
        row.state,
      ),
    version:
      Number(row.version),
  });
}

export class PostgresControlledActionStore {
  constructor({
    pool,
  } = {}) {
    this.pool =
      pool ?? createPoolFromEnvironment();
  }

  get available() {
    return Boolean(
      this.pool &&
      typeof this.pool.connect === "function",
    );
  }

  async createAction({
    tenantId,
    ownerId,
    actionId =
      `action-${randomUUID()}`,
    actionType,
    idempotencyKey,
    payload,
    requestId,
    authorityEpoch,
  }) {
    const normalizedTenantId =
      normalizeString(tenantId);

    const normalizedOwnerId =
      normalizeString(ownerId);

    const normalizedActionId =
      normalizeString(actionId);

    const normalizedActionType =
      normalizeString(actionType);

    const normalizedIdempotencyKey =
      normalizeString(idempotencyKey);

    const normalizedRequestId =
      normalizeString(requestId);

    const normalizedAuthorityEpoch =
      normalizeString(authorityEpoch);

    if (
      !normalizedTenantId ||
      !normalizedOwnerId ||
      !normalizedActionId ||
      !normalizedActionType ||
      !normalizedIdempotencyKey ||
      !normalizedRequestId ||
      !normalizedAuthorityEpoch ||
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        ok: false,
        errorCode:
          "CONTROLLED_ACTION_INPUT_INVALID",
      });
    }

    if (!this.available) {
      return Object.freeze({
        ok: false,
        errorCode:
          "CONTROLLED_ACTION_STORE_UNAVAILABLE",
      });
    }

    const payloadCanonical =
      stableSerialize(payload);

    const payloadSha256 =
      sha256(payloadCanonical);

    const client =
      await this.pool.connect();

    let transactionStarted =
      false;

    try {
      await client.query("BEGIN");
      transactionStarted = true;

      const insertResult =
        await client.query(
          `
            INSERT INTO nexus_controlled_action (
              tenant_id,
              action_id,
              owner_id,
              action_type,
              idempotency_key,
              payload_json,
              payload_sha256,
              state,
              version
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6::JSONB,
              $7,
              'CREATED',
              1
            )
            ON CONFLICT (
              tenant_id,
              idempotency_key
            )
            DO NOTHING
            RETURNING *
          `,
          [
            normalizedTenantId,
            normalizedActionId,
            normalizedOwnerId,
            normalizedActionType,
            normalizedIdempotencyKey,
            payloadCanonical,
            payloadSha256,
          ],
        );

      if (
        insertResult.rowCount === 1
      ) {
        const action =
          mapAction(
            insertResult.rows[0],
          );

        const eventId =
          `event-${randomUUID()}`;

        const evidenceHash =
          createEvidenceHash({
            tenantId:
              normalizedTenantId,
            actionId:
              normalizedActionId,
            sequence: 1,
            eventId,
            fromState: null,
            toState: "CREATED",
            ownerId:
              normalizedOwnerId,
            requestId:
              normalizedRequestId,
            authorityEpoch:
              normalizedAuthorityEpoch,
            previousEvidenceHash:
              GENESIS_HASH,
            payloadSha256,
          });

        await client.query(
          `
            INSERT INTO nexus_controlled_action_event (
              tenant_id,
              action_id,
              sequence,
              event_id,
              from_state,
              to_state,
              owner_id,
              request_id,
              authority_epoch,
              previous_evidence_hash,
              evidence_hash
            )
            VALUES (
              $1,
              $2,
              1,
              $3,
              NULL,
              'CREATED',
              $4,
              $5,
              $6,
              $7,
              $8
            )
          `,
          [
            normalizedTenantId,
            normalizedActionId,
            eventId,
            normalizedOwnerId,
            normalizedRequestId,
            normalizedAuthorityEpoch,
            GENESIS_HASH,
            evidenceHash,
          ],
        );

        await client.query("COMMIT");
        transactionStarted = false;

        return Object.freeze({
          ok: true,
          created: true,
          idempotentReplay:
            false,
          action,
          evidenceHash,
          executionAuthorized:
            false,
        });
      }

      const existingResult =
        await client.query(
          `
            SELECT *
            FROM nexus_controlled_action
            WHERE tenant_id = $1
              AND idempotency_key = $2
            FOR UPDATE
          `,
          [
            normalizedTenantId,
            normalizedIdempotencyKey,
          ],
        );

      const existing =
        mapAction(
          existingResult.rows?.[0],
        );

      if (!existing) {
        throw new Error(
          "Idempotency conflict resolved without an existing action.",
        );
      }

      const equivalent =
        existing.ownerId ===
          normalizedOwnerId &&
        existing.actionType ===
          normalizedActionType &&
        existing.payloadSha256 ===
          payloadSha256;

      if (!equivalent) {
        await client.query(
          "ROLLBACK",
        );

        transactionStarted = false;

        return Object.freeze({
          ok: false,
          conflict: true,
          errorCode:
            "CONTROLLED_ACTION_IDEMPOTENCY_CONFLICT",
        });
      }

      await client.query("COMMIT");
      transactionStarted = false;

      return Object.freeze({
        ok: true,
        created: false,
        idempotentReplay:
          true,
        action:
          existing,
        executionAuthorized:
          false,
      });
    } catch {
      if (transactionStarted) {
        try {
          await client.query(
            "ROLLBACK",
          );
        } catch {
          // Original failure remains authoritative.
        }
      }

      return Object.freeze({
        ok: false,
        errorCode:
          "CONTROLLED_ACTION_STORE_FAILURE",
      });
    } finally {
      client.release();
    }
  }

  async transitionAction({
    tenantId,
    actionId,
    ownerId,
    expectedVersion,
    toState,
    requestId,
    authorityEpoch,
  }) {
    const normalizedTenantId =
      normalizeString(tenantId);

    const normalizedActionId =
      normalizeString(actionId);

    const normalizedOwnerId =
      normalizeString(ownerId);

    const normalizedToState =
      normalizeString(toState);

    const normalizedRequestId =
      normalizeString(requestId);

    const normalizedAuthorityEpoch =
      normalizeString(authorityEpoch);

    if (
      !normalizedTenantId ||
      !normalizedActionId ||
      !normalizedOwnerId ||
      !Number.isSafeInteger(
        expectedVersion,
      ) ||
      expectedVersion < 1 ||
      !CONTROLLED_ACTION_STATES.includes(
        normalizedToState,
      ) ||
      !normalizedRequestId ||
      !normalizedAuthorityEpoch
    ) {
      return Object.freeze({
        ok: false,
        errorCode:
          "CONTROLLED_ACTION_TRANSITION_INPUT_INVALID",
      });
    }

    if (!this.available) {
      return Object.freeze({
        ok: false,
        errorCode:
          "CONTROLLED_ACTION_STORE_UNAVAILABLE",
      });
    }

    const client =
      await this.pool.connect();

    let transactionStarted =
      false;

    try {
      await client.query("BEGIN");
      transactionStarted = true;

      const actionResult =
        await client.query(
          `
            SELECT *
            FROM nexus_controlled_action
            WHERE tenant_id = $1
              AND action_id = $2
            FOR UPDATE
          `,
          [
            normalizedTenantId,
            normalizedActionId,
          ],
        );

      const current =
        mapAction(
          actionResult.rows?.[0],
        );

      if (!current) {
        await client.query(
          "ROLLBACK",
        );

        transactionStarted = false;

        return Object.freeze({
          ok: false,
          notFound: true,
          errorCode:
            "CONTROLLED_ACTION_NOT_FOUND",
        });
      }

      if (
        current.ownerId !==
        normalizedOwnerId
      ) {
        await client.query(
          "ROLLBACK",
        );

        transactionStarted = false;

        return Object.freeze({
          ok: false,
          forbidden: true,
          errorCode:
            "CONTROLLED_ACTION_OWNER_MISMATCH",
        });
      }

      if (
        current.version !==
        expectedVersion
      ) {
        await client.query(
          "ROLLBACK",
        );

        transactionStarted = false;

        return Object.freeze({
          ok: false,
          conflict: true,
          currentVersion:
            current.version,
          currentState:
            current.state,
          errorCode:
            "CONTROLLED_ACTION_VERSION_CONFLICT",
        });
      }

      const allowedTargets =
        ALLOWED_TRANSITIONS[
          current.state
        ] ?? [];

      if (
        !allowedTargets.includes(
          normalizedToState,
        )
      ) {
        await client.query(
          "ROLLBACK",
        );

        transactionStarted = false;

        return Object.freeze({
          ok: false,
          conflict: true,
          currentState:
            current.state,
          requestedState:
            normalizedToState,
          errorCode:
            "CONTROLLED_ACTION_TRANSITION_NOT_ALLOWED",
        });
      }

      const previousEvent =
        await client.query(
          `
            SELECT
              sequence,
              evidence_hash
            FROM nexus_controlled_action_event
            WHERE tenant_id = $1
              AND action_id = $2
            ORDER BY sequence DESC
            LIMIT 1
            FOR UPDATE
          `,
          [
            normalizedTenantId,
            normalizedActionId,
          ],
        );

      const previousSequence =
        Number(
          previousEvent.rows?.[0]
            ?.sequence,
        );

      const previousEvidenceHash =
        normalizeString(
          previousEvent.rows?.[0]
            ?.evidence_hash,
        );

      if (
        !Number.isSafeInteger(
          previousSequence,
        ) ||
        !/^[a-f0-9]{64}$/.test(
          previousEvidenceHash,
        )
      ) {
        throw new Error(
          "Controlled-action evidence chain is invalid.",
        );
      }

      const nextSequence =
        previousSequence + 1;

      const nextVersion =
        current.version + 1;

      const eventId =
        `event-${randomUUID()}`;

      const evidenceHash =
        createEvidenceHash({
          tenantId:
            normalizedTenantId,
          actionId:
            normalizedActionId,
          sequence:
            nextSequence,
          eventId,
          fromState:
            current.state,
          toState:
            normalizedToState,
          ownerId:
            normalizedOwnerId,
          requestId:
            normalizedRequestId,
          authorityEpoch:
            normalizedAuthorityEpoch,
          previousEvidenceHash,
          payloadSha256:
            current.payloadSha256,
        });

      const updateResult =
        await client.query(
          `
            UPDATE nexus_controlled_action
            SET
              state = $3,
              version = $4,
              updated_at = NOW()
            WHERE tenant_id = $1
              AND action_id = $2
              AND version = $5
            RETURNING *
          `,
          [
            normalizedTenantId,
            normalizedActionId,
            normalizedToState,
            nextVersion,
            expectedVersion,
          ],
        );

      if (
        updateResult.rowCount !== 1
      ) {
        throw new Error(
          "Atomic controlled-action transition failed.",
        );
      }

      await client.query(
        `
          INSERT INTO nexus_controlled_action_event (
            tenant_id,
            action_id,
            sequence,
            event_id,
            from_state,
            to_state,
            owner_id,
            request_id,
            authority_epoch,
            previous_evidence_hash,
            evidence_hash
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11
          )
        `,
        [
          normalizedTenantId,
          normalizedActionId,
          nextSequence,
          eventId,
          current.state,
          normalizedToState,
          normalizedOwnerId,
          normalizedRequestId,
          normalizedAuthorityEpoch,
          previousEvidenceHash,
          evidenceHash,
        ],
      );

      await client.query("COMMIT");
      transactionStarted = false;

      return Object.freeze({
        ok: true,
        transitioned: true,
        action:
          mapAction(
            updateResult.rows[0],
          ),
        event: Object.freeze({
          eventId,
          sequence:
            nextSequence,
          fromState:
            current.state,
          toState:
            normalizedToState,
          previousEvidenceHash,
          evidenceHash,
        }),
        executionAuthorized:
          false,
      });
    } catch {
      if (transactionStarted) {
        try {
          await client.query(
            "ROLLBACK",
          );
        } catch {
          // Original failure remains authoritative.
        }
      }

      return Object.freeze({
        ok: false,
        errorCode:
          "CONTROLLED_ACTION_STORE_FAILURE",
      });
    } finally {
      client.release();
    }
  }

  async checkReadiness() {
    if (!this.pool) {
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
              'public.nexus_controlled_action'
            ) AS action_table,

            TO_REGCLASS(
              'public.nexus_controlled_action_event'
            ) AS event_table
        `);

      const row =
        result.rows?.[0] ?? {};

      const ready =
        Boolean(row.action_table) &&
        Boolean(row.event_table);

      return Object.freeze({
        ready,
        state: ready
          ? "CONTROLLED_ACTION_TABLES_READY"
          : "CONTROLLED_ACTION_MIGRATION_REQUIRED",
      });
    } catch {
      return Object.freeze({
        ready: false,
        state:
          "CONTROLLED_ACTION_DATABASE_UNREACHABLE",
      });
    }
  }
}

let storeSingleton;

export function getControlledActionStore() {
  if (!storeSingleton) {
    storeSingleton =
      new PostgresControlledActionStore();
  }

  return storeSingleton;
}

export function resetControlledActionStoreForTests() {
  storeSingleton = undefined;
}

export function getControlledActionStorePosture() {
  return Object.freeze({
    schemaVersion:
      "nexus.controlled-action-store-posture.v1",
    mode:
      CONTROLLED_ACTION_STORE_MODE,
    migrationFile:
      "db/migrations/0005_nexus_controlled_action_state.sql",
    tenantIsolated:
      true,
    ownerBound:
      true,
    idempotencyProtected:
      true,
    optimisticConcurrency:
      true,
    appendOnlyEvidence:
      true,
    hashLinkedEvidence:
      true,
    executedStateExists:
      false,
    externalExecutionAuthorized:
      false,
    providerInvocationAuthorized:
      false,
    liveMigrationPerformed:
      false,
  });
}
