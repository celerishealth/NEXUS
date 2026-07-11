/* eslint-disable */
const assert = require("node:assert/strict");
const fs = require("node:fs");

const modulePath =
  process.env.DAY750_MODULE;

const migrationPath =
  process.env.DAY750_MIGRATION;

if (!modulePath || !migrationPath) {
  throw new Error(
    "DAY750_MODULE and DAY750_MIGRATION are required.",
  );
}

const {
  PostgresVerticalSliceRepositoryError,
  createPostgresCustomerVerticalSliceRepository,
} = require(modulePath);

const initialState = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-750",
  customerId: "customer-a",
  ownerId: "owner-a",
  status: "inquiry_received",
  version: "initial-v1",
  createdAt: "2026-07-11T11:00:00.000Z",
  updatedAt: "2026-07-11T11:00:00.000Z",
});

const nextState = Object.freeze({
  ...initialState,
  status: "recommendation_ready",
  version: "recommendation-v1",
  updatedAt: "2026-07-11T11:01:00.000Z",
});

const event = Object.freeze({
  eventId: "event-750",
  idempotencyKey: "idempotency-750",
  tenantId: "tenant-a",
  inquiryId: "inquiry-750",
  customerId: "customer-a",
  ownerId: "owner-a",
  actorId: "nexus-service",
  actorRole: "service",
  transition: "generate_recommendation",
  fromStatus: "inquiry_received",
  toStatus: "recommendation_ready",
  previousVersion: "initial-v1",
  nextVersion: "recommendation-v1",
  createdAt: "2026-07-11T11:01:00.000Z",
});

const audit = Object.freeze({
  auditId: "audit-750",
  tenantId: "tenant-a",
  inquiryId: "inquiry-750",
  sequence: 1,
  sourceEventId: "event-750",
  sourceIdempotencyKey: "idempotency-750",
  customerId: "customer-a",
  ownerId: "owner-a",
  actorId: "nexus-service",
  actorRole: "service",
  transition: "generate_recommendation",
  fromStatus: "inquiry_received",
  toStatus: "recommendation_ready",
  previousVersion: "initial-v1",
  nextVersion: "recommendation-v1",
  previousHash: "GENESIS",
  hash: "a".repeat(64),
  recordedByServiceId: "nexus-audit-service",
  sourceCreatedAt: "2026-07-11T11:01:00.000Z",
  recordedAt: "2026-07-11T11:01:00.000Z",
});

function row(value) {
  return {
    rows: value === null ? [] : [value],
    rowCount: value === null ? 0 : 1,
  };
}

function createScriptedPool(steps) {
  const queries = [];
  let released = 0;
  const remaining = [...steps];

  const client = {
    async query(text, values = []) {
      const normalized = String(text)
        .replace(/\s+/g, " ")
        .trim();

      queries.push({
        text: normalized,
        values,
      });

      const step = remaining.shift();

      if (!step) {
        throw new Error(
          `Unexpected query: ${normalized}`,
        );
      }

      assert.match(
        normalized,
        step.match,
      );

      if (step.check) {
        step.check(values, normalized);
      }

      if (step.error) {
        throw step.error;
      }

      return (
        step.result ?? {
          rows: [],
          rowCount: 0,
        }
      );
    },

    release() {
      released += 1;
    },
  };

  return {
    pool: {
      async connect() {
        return client;
      },
    },

    queries,
    remaining() {
      return remaining.length;
    },

    released() {
      return released;
    },
  };
}

async function expectCode(
  action,
  expectedCode,
) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof
        PostgresVerticalSliceRepositoryError &&
      error.code === expectedCode,
  );
}

async function main() {
  const migration = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    migration,
    /FORCE ROW LEVEL SECURITY/g,
  );

  assert.match(
    migration,
    /current_setting\('app\.tenant_id', true\)/,
  );

  assert.match(
    migration,
    /UNIQUE \(tenant_id, idempotency_key\)/,
  );

  assert.match(
    migration,
    /UNIQUE \(tenant_id, inquiry_id, sequence\)/,
  );

  assert.match(
    migration,
    /BEFORE UPDATE OR DELETE/,
  );

  assert.throws(
    () =>
      createPostgresCustomerVerticalSliceRepository({
        pool: null,
      }),
    (error) =>
      error instanceof
        PostgresVerticalSliceRepositoryError &&
      error.code ===
        "INVALID_CONFIGURATION",
  );

  const createPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
        check(values) {
          assert.deepEqual(values, [
            "tenant-a",
          ]);
        },
      },
      {
        match: /INSERT INTO nexus_customer_vertical_slice_state/,
        result: row(initialState),
      },
      {
        match: /^COMMIT$/,
      },
    ]);

  const created =
    await createPostgresCustomerVerticalSliceRepository({
      pool: createPool.pool,
    }).createInitialStateIfAbsent(
      initialState,
    );

  assert.equal(created.created, true);
  assert.deepEqual(
    created.state,
    initialState,
  );
  assert.equal(createPool.released(), 1);
  assert.equal(createPool.remaining(), 0);

  const replayPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /INSERT INTO nexus_customer_vertical_slice_state/,
        result: row(null),
      },
      {
        match: /FROM nexus_customer_vertical_slice_state/,
        result: row(initialState),
      },
      {
        match: /^COMMIT$/,
      },
    ]);

  const replay =
    await createPostgresCustomerVerticalSliceRepository({
      pool: replayPool.pool,
    }).createInitialStateIfAbsent(
      initialState,
    );

  assert.equal(replay.created, false);
  assert.deepEqual(
    replay.state,
    initialState,
  );

  const conflictPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /INSERT INTO nexus_customer_vertical_slice_state/,
        result: row(null),
      },
      {
        match: /FROM nexus_customer_vertical_slice_state/,
        result: row({
          ...initialState,
          ownerId: "owner-conflict",
        }),
      },
      {
        match: /^ROLLBACK$/,
      },
    ]);

  await expectCode(
    () =>
      createPostgresCustomerVerticalSliceRepository({
        pool: conflictPool.pool,
      }).createInitialStateIfAbsent(
        initialState,
      ),
    "INITIAL_STATE_CONFLICT",
  );

  assert.equal(conflictPool.released(), 1);

  const findPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /FROM nexus_customer_vertical_slice_state/,
        result: row(initialState),
      },
      {
        match: /^COMMIT$/,
      },
    ]);

  const found =
    await createPostgresCustomerVerticalSliceRepository({
      pool: findPool.pool,
    }).runInTransaction(
      async ({
        transitionRepository,
      }) =>
        transitionRepository.findState({
          tenantId: "tenant-a",
          inquiryId: "inquiry-750",
        }),
    );

  assert.deepEqual(found, initialState);

  const crossTenantPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /FROM nexus_customer_vertical_slice_state/,
        result: row(initialState),
      },
      {
        match: /^ROLLBACK$/,
      },
    ]);

  await expectCode(
    () =>
      createPostgresCustomerVerticalSliceRepository({
        pool: crossTenantPool.pool,
      }).runInTransaction(
        async ({
          transitionRepository,
        }) => {
          await transitionRepository.findState({
            tenantId: "tenant-a",
            inquiryId: "inquiry-750",
          });

          await transitionRepository.findState({
            tenantId: "tenant-b",
            inquiryId: "inquiry-750",
          });
        },
      ),
    "CROSS_TENANT_TRANSACTION",
  );

  const stalePool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /UPDATE nexus_customer_vertical_slice_state/,
        result: row(null),
      },
      {
        match: /FROM nexus_customer_vertical_slice_state/,
        result: row(initialState),
      },
      {
        match: /^COMMIT$/,
      },
    ]);

  const stale =
    await createPostgresCustomerVerticalSliceRepository({
      pool: stalePool.pool,
    }).runInTransaction(
      async ({
        transitionRepository,
      }) =>
        transitionRepository.compareAndSet({
          tenantId: "tenant-a",
          inquiryId: "inquiry-750",
          expectedVersion: "stale-version",
          nextState,
          event,
        }),
    );

  assert.equal(stale.applied, false);
  assert.deepEqual(
    stale.state,
    initialState,
  );

  const appliedPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /UPDATE nexus_customer_vertical_slice_state/,
        result: row(nextState),
      },
      {
        match: /INSERT INTO nexus_customer_vertical_slice_event/,
        result: row(event),
      },
      {
        match: /^COMMIT$/,
      },
    ]);

  const applied =
    await createPostgresCustomerVerticalSliceRepository({
      pool: appliedPool.pool,
    }).runInTransaction(
      async ({
        transitionRepository,
      }) =>
        transitionRepository.compareAndSet({
          tenantId: "tenant-a",
          inquiryId: "inquiry-750",
          expectedVersion: "initial-v1",
          nextState,
          event,
        }),
    );

  assert.equal(applied.applied, true);
  assert.deepEqual(
    applied.state,
    nextState,
  );

  const eventConflictPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /UPDATE nexus_customer_vertical_slice_state/,
        result: row(nextState),
      },
      {
        match: /INSERT INTO nexus_customer_vertical_slice_event/,
        result: row(null),
      },
      {
        match: /^ROLLBACK$/,
      },
    ]);

  await expectCode(
    () =>
      createPostgresCustomerVerticalSliceRepository({
        pool: eventConflictPool.pool,
      }).runInTransaction(
        async ({
          transitionRepository,
        }) =>
          transitionRepository.compareAndSet({
            tenantId: "tenant-a",
            inquiryId: "inquiry-750",
            expectedVersion: "initial-v1",
            nextState,
            event,
          }),
      ),
    "IDEMPOTENCY_CONFLICT",
  );

  const auditPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /pg_advisory_xact_lock/,
      },
      {
        match: /FROM nexus_customer_vertical_slice_audit/,
        result: row(null),
      },
      {
        match: /INSERT INTO nexus_customer_vertical_slice_audit/,
        result: row(audit),
      },
      {
        match: /^COMMIT$/,
      },
    ]);

  const auditResult =
    await createPostgresCustomerVerticalSliceRepository({
      pool: auditPool.pool,
    }).runInTransaction(
      async ({
        auditRepository,
      }) =>
        auditRepository.appendIfCurrent({
          entry: audit,
          expectedSequence: 1,
          expectedPreviousHash: "GENESIS",
        }),
    );

  assert.equal(
    auditResult.created,
    true,
  );

  assert.deepEqual(
    auditResult.entry,
    audit,
  );

  const auditConflictPool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /set_config/,
      },
      {
        match: /pg_advisory_xact_lock/,
      },
      {
        match: /FROM nexus_customer_vertical_slice_audit/,
        result: row(audit),
      },
      {
        match: /^ROLLBACK$/,
      },
    ]);

  await expectCode(
    () =>
      createPostgresCustomerVerticalSliceRepository({
        pool: auditConflictPool.pool,
      }).runInTransaction(
        async ({
          auditRepository,
        }) =>
          auditRepository.appendIfCurrent({
            entry: {
              ...audit,
              sequence: 2,
              previousHash: "b".repeat(64),
            },
            expectedSequence: 2,
            expectedPreviousHash:
              "b".repeat(64),
          }),
      ),
    "AUDIT_CHAIN_CONFLICT",
  );

  const operationFailurePool =
    createScriptedPool([
      {
        match: /^BEGIN$/,
      },
      {
        match: /^ROLLBACK$/,
      },
    ]);

  await assert.rejects(
    () =>
      createPostgresCustomerVerticalSliceRepository({
        pool: operationFailurePool.pool,
      }).runInTransaction(
        async () => {
          throw new Error(
            "forced-operation-failure",
          );
        },
      ),
    /forced-operation-failure/,
  );

  assert.equal(
    operationFailurePool.released(),
    1,
  );

  console.log(
    "DAY 750 TARGETED TESTS PASS (14/14)",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
