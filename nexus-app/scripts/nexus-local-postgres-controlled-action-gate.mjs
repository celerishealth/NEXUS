import {
  randomUUID,
} from "node:crypto";

import pg from "pg";

import {
  inspectPostgresMigrationStatus,
} from "../lib/nexus/postgresMigrationRunner.mjs";

import {
  PostgresControlledActionStore,
} from "../lib/nexus/controlledActionStore.mjs";

const { Pool } = pg;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

const connectionString =
  normalizeString(
    process.env.DATABASE_URL,
  );

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required for the real controlled-action gate.",
  );
}

const pool =
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    ssl: false,
  });

const suffix =
  randomUUID()
    .replaceAll("-", "")
    .slice(0, 16);

const tenantId =
  `tenant-action-${suffix}`;

const ownerId =
  `owner-action-${suffix}`;

const actionId =
  `action-${suffix}`;

const authorityEpoch =
  `authority-action-${suffix}`;

const idempotencyKey =
  `idempotency-${suffix}`;

const payload = {
  customerReference:
    `customer-${suffix}`,
  requestedOperation:
    "DRY_RUN_QUOTATION_REVIEW",
  amountMinor: 125000,
  currency: "INR",
};

const store =
  new PostgresControlledActionStore({
    pool,
  });

let report;
let failure = null;

try {
  const migrationStatus =
    await inspectPostgresMigrationStatus({
      client: pool,
    });

  const readiness =
    await store.checkReadiness();

  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        INSERT INTO nexus_tenant (
          tenant_id,
          display_name,
          status
        )
        VALUES (
          $1,
          'Day 678 Controlled Action Tenant',
          'ACTIVE'
        )
      `,
      [
        tenantId,
      ],
    );

    await client.query(
      `
        INSERT INTO nexus_owner_identity (
          owner_id,
          status
        )
        VALUES (
          $1,
          'ACTIVE'
        )
      `,
      [
        ownerId,
      ],
    );

    await client.query(
      `
        INSERT INTO nexus_tenant_owner_membership (
          tenant_id,
          owner_id,
          role,
          status,
          authority_epoch
        )
        VALUES (
          $1,
          $2,
          'OWNER',
          'ACTIVE',
          $3
        )
      `,
      [
        tenantId,
        ownerId,
        authorityEpoch,
      ],
    );

    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query(
        "ROLLBACK",
      );
    } catch {
      // Original failure remains authoritative.
    }

    throw error;
  } finally {
    client.release();
  }

  const created =
    await store.createAction({
      tenantId,
      ownerId,
      actionId,
      actionType:
        "QUOTATION_REVIEW",
      idempotencyKey,
      payload,
      requestId:
        `request-create-${suffix}`,
      authorityEpoch,
    });

  const idempotentReplay =
    await store.createAction({
      tenantId,
      ownerId,
      actionId:
        `different-action-${suffix}`,
      actionType:
        "QUOTATION_REVIEW",
      idempotencyKey,
      payload: {
        currency: "INR",
        amountMinor: 125000,
        requestedOperation:
          "DRY_RUN_QUOTATION_REVIEW",
        customerReference:
          `customer-${suffix}`,
      },
      requestId:
        `request-idempotent-${suffix}`,
      authorityEpoch,
    });

  const idempotencyConflict =
    await store.createAction({
      tenantId,
      ownerId,
      actionId:
        `conflict-action-${suffix}`,
      actionType:
        "QUOTATION_REVIEW",
      idempotencyKey,
      payload: {
        ...payload,
        amountMinor: 999999,
      },
      requestId:
        `request-conflict-${suffix}`,
      authorityEpoch,
    });

  const concurrentTransitions =
    await Promise.all(
      Array.from(
        {
          length: 16,
        },
        (_, index) =>
          store.transitionAction({
            tenantId,
            actionId,
            ownerId,
            expectedVersion: 1,
            toState:
              "PENDING_OWNER_REVIEW",
            requestId:
              `request-transition-${suffix}-${index}`,
            authorityEpoch,
          }),
      ),
    );

  const successfulConcurrentTransitions =
    concurrentTransitions.filter(
      (result) =>
        result.ok === true,
    );

  const versionConflicts =
    concurrentTransitions.filter(
      (result) =>
        result.errorCode ===
        "CONTROLLED_ACTION_VERSION_CONFLICT",
    );

  const approvedDryRun =
    await store.transitionAction({
      tenantId,
      actionId,
      ownerId,
      expectedVersion: 2,
      toState:
        "APPROVED_FOR_DRY_RUN",
      requestId:
        `request-dry-run-${suffix}`,
      authorityEpoch,
    });

  const simulated =
    await store.transitionAction({
      tenantId,
      actionId,
      ownerId,
      expectedVersion: 3,
      toState:
        "SIMULATED",
      requestId:
        `request-simulated-${suffix}`,
      authorityEpoch,
    });

  const approvedReview =
    await store.transitionAction({
      tenantId,
      actionId,
      ownerId,
      expectedVersion: 4,
      toState:
        "APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW",
      requestId:
        `request-controlled-review-${suffix}`,
      authorityEpoch,
    });

  const forbiddenExecution =
    await store.transitionAction({
      tenantId,
      actionId,
      ownerId,
      expectedVersion: 5,
      toState:
        "EXECUTED",
      requestId:
        `request-executed-${suffix}`,
      authorityEpoch,
    });

  const databaseEvidence =
    await pool.query(
      `
        SELECT
          action.state,
          action.version,
          action.payload_sha256,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_controlled_action
            WHERE tenant_id = $1
              AND idempotency_key = $3
          ) AS idempotent_action_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_controlled_action_event
            WHERE tenant_id = $1
              AND action_id = $2
          ) AS event_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_controlled_action_event AS current_event
            LEFT JOIN nexus_controlled_action_event AS previous_event
              ON previous_event.tenant_id =
                   current_event.tenant_id
             AND previous_event.action_id =
                   current_event.action_id
             AND previous_event.sequence =
                   current_event.sequence - 1
            WHERE current_event.tenant_id = $1
              AND current_event.action_id = $2
              AND current_event.sequence > 1
              AND current_event.previous_evidence_hash <>
                  previous_event.evidence_hash
          ) AS broken_hash_links
        FROM nexus_controlled_action AS action
        WHERE action.tenant_id = $1
          AND action.action_id = $2
      `,
      [
        tenantId,
        actionId,
        idempotencyKey,
      ],
    );

  const evidence =
    databaseEvidence.rows?.[0] ??
    {};

  const controls = [
    {
      id:
        "FIVE_MIGRATIONS_CURRENT",
      passed:
        migrationStatus.state ===
          "MIGRATIONS_CURRENT" &&
        migrationStatus
          .totalMigrationCount ===
          5 &&
        migrationStatus
          .pendingMigrationCount ===
          0 &&
        migrationStatus
          .driftCount === 0,
    },
    {
      id:
        "CONTROLLED_ACTION_TABLES_READY",
      passed:
        readiness.ready === true,
    },
    {
      id:
        "ACTION_CREATED_DURABLY",
      passed:
        created.ok === true &&
        created.created === true &&
        created.action
          ?.state === "CREATED" &&
        created.action
          ?.version === 1,
    },
    {
      id:
        "IDEMPOTENT_RETRY_RETURNS_ORIGINAL",
      passed:
        idempotentReplay.ok ===
          true &&
        idempotentReplay
          .idempotentReplay ===
          true &&
        idempotentReplay.action
          ?.actionId === actionId &&
        evidence
          .idempotent_action_count ===
          1,
    },
    {
      id:
        "IDEMPOTENCY_CONTENT_CONFLICT_REJECTED",
      passed:
        idempotencyConflict.ok ===
          false &&
        idempotencyConflict
          .errorCode ===
          "CONTROLLED_ACTION_IDEMPOTENCY_CONFLICT",
    },
    {
      id:
        "CONCURRENT_TRANSITION_EXACTLY_ONCE",
      passed:
        successfulConcurrentTransitions
          .length === 1 &&
        versionConflicts.length ===
          15,
    },
    {
      id:
        "CONTROLLED_STATE_SEQUENCE_COMPLETED",
      passed:
        approvedDryRun.ok === true &&
        simulated.ok === true &&
        approvedReview.ok === true &&
        evidence.state ===
          "APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW" &&
        evidence.version === 5,
    },
    {
      id:
        "EXECUTED_STATE_IMPOSSIBLE",
      passed:
        forbiddenExecution.ok ===
          false &&
        forbiddenExecution
          .errorCode ===
          "CONTROLLED_ACTION_TRANSITION_INPUT_INVALID",
    },
    {
      id:
        "APPEND_ONLY_EVENT_COUNT_EXACT",
      passed:
        evidence.event_count === 5,
    },
    {
      id:
        "HASH_CHAIN_CONTINUITY_VERIFIED",
      passed:
        evidence.broken_hash_links ===
        0,
    },
  ];

  const passed =
    controls.every(
      (control) =>
        control.passed,
    );

  report = {
    schemaVersion:
      "nexus.real-controlled-action-state-gate.v1",
    passed,
    migrationState:
      migrationStatus.state,
    migrationCount:
      migrationStatus.totalMigrationCount,
    readiness:
      readiness.state,
    successfulConcurrentTransitions:
      successfulConcurrentTransitions.length,
    versionConflicts:
      versionConflicts.length,
    finalState:
      evidence.state,
    finalVersion:
      evidence.version,
    eventCount:
      evidence.event_count,
    brokenHashLinks:
      evidence.broken_hash_links,
    controls,
    realPostgresVerified:
      true,
    productionDatabaseModified:
      false,
    externalExecutionPerformed:
      false,
    providerInvocationPerformed:
      false,
    executionAuthorized:
      false,
  };

  if (!passed) {
    failure =
      new Error(
        "Real controlled-action state gate failed.",
      );
  }
} catch (error) {
  failure = error;

  report = {
    schemaVersion:
      "nexus.real-controlled-action-state-gate.v1",
    passed: false,
    error:
      error instanceof Error
        ? error.message
        : String(error),
    productionDatabaseModified:
      false,
    executionAuthorized:
      false,
  };
} finally {
  try {
    await pool.query(
      `
        DELETE FROM nexus_controlled_action_event
        WHERE tenant_id = $1
      `,
      [
        tenantId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_controlled_action
        WHERE tenant_id = $1
      `,
      [
        tenantId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_tenant_owner_membership
        WHERE tenant_id = $1
          AND owner_id = $2
      `,
      [
        tenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_owner_identity
        WHERE owner_id = $1
      `,
      [
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_tenant
        WHERE tenant_id = $1
      `,
      [
        tenantId,
      ],
    );
  } catch (cleanupError) {
    failure =
      failure ??
      cleanupError;
  }

  await pool.end();
}

console.log(
  JSON.stringify(
    report,
    null,
    2,
  ),
);

if (failure) {
  process.exit(1);
}
