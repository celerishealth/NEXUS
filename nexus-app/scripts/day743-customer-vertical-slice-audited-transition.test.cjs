/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY743_MODULE;
const auditModulePath = process.env.DAY743_AUDIT_MODULE;

if (!modulePath || !auditModulePath) {
  throw new Error(
    "DAY743_MODULE and DAY743_AUDIT_MODULE are required.",
  );
}

const {
  AuditedVerticalSliceTransitionError,
  applyAuditedCustomerVerticalSliceTransition,
} = require(modulePath);

const {
  verifyVerticalSliceAuditChain,
} = require(auditModulePath);

const fixedNow = "2026-07-11T05:00:00.000Z";

const ownerContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "owner-a",
  role: "owner",
});

const customerContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "customer-a",
  role: "customer",
});

const serviceActorContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "nexus-sandbox-service",
  role: "service",
});

const auditContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  serviceId: "nexus-audit-service",
  role: "service",
});

const initialState = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  status: "inquiry_received",
  version: "initial-v1",
  createdAt: "2026-07-11T00:00:00.000Z",
  updatedAt: "2026-07-11T00:00:00.000Z",
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createTransactionalRepository(options = {}) {
  let state = clone(options.initialState ?? initialState);
  let transitionEvents = new Map();
  let auditEntries = [];
  let transactionCalls = 0;
  let compareAndSetCalls = 0;
  let auditAppendCalls = 0;

  const repository = {
    async runInTransaction(operation) {
      transactionCalls += 1;

      const stateSnapshot = clone(state);
      const eventSnapshot = new Map(
        [...transitionEvents.entries()].map(
          ([key, value]) => [key, clone(value)],
        ),
      );
      const auditSnapshot = auditEntries.map(clone);

      const transitionRepository = {
        async findState({ tenantId, inquiryId }) {
          assert.equal(tenantId, "tenant-a");
          assert.equal(inquiryId, "inquiry-735");
          return state ? clone(state) : null;
        },

        async findEventByIdempotencyKey({
          tenantId,
          idempotencyKey,
        }) {
          assert.equal(tenantId, "tenant-a");
          const event =
            transitionEvents.get(idempotencyKey);
          return event ? clone(event) : null;
        },

        async compareAndSet({
          tenantId,
          inquiryId,
          expectedVersion,
          nextState,
          event,
        }) {
          compareAndSetCalls += 1;

          assert.equal(tenantId, "tenant-a");
          assert.equal(inquiryId, "inquiry-735");

          if (
            !state ||
            state.version !== expectedVersion
          ) {
            return {
              applied: false,
              state: clone(state ?? nextState),
            };
          }

          state = clone(nextState);
          transitionEvents.set(
            event.idempotencyKey,
            clone(event),
          );

          return {
            applied: true,
            state: clone(state),
          };
        },
      };

      const auditRepository = {
        async findBySourceEventId({
          tenantId,
          sourceEventId,
        }) {
          const entry = auditEntries.find(
            (candidate) =>
              candidate.tenantId === tenantId &&
              candidate.sourceEventId === sourceEventId,
          );

          return entry ? clone(entry) : null;
        },

        async findLatest({ tenantId, inquiryId }) {
          const matching = auditEntries.filter(
            (entry) =>
              entry.tenantId === tenantId &&
              entry.inquiryId === inquiryId,
          );

          return matching.length > 0
            ? clone(matching[matching.length - 1])
            : null;
        },

        async appendIfCurrent({
          entry,
          expectedSequence,
          expectedPreviousHash,
        }) {
          auditAppendCalls += 1;

          if (options.failAuditAppend === true) {
            throw new Error("forced audit failure");
          }

          const latest =
            auditEntries.length > 0
              ? auditEntries[auditEntries.length - 1]
              : null;

          const actualSequence = latest
            ? latest.sequence + 1
            : 1;

          const actualPreviousHash = latest
            ? latest.hash
            : "GENESIS";

          if (
            actualSequence !== expectedSequence ||
            actualPreviousHash !== expectedPreviousHash
          ) {
            return {
              created: false,
              entry: clone(latest ?? entry),
            };
          }

          const persisted = clone(entry);

          if (options.tamperAuditPersistence === true) {
            persisted.customerId = "customer-tampered";
          }

          auditEntries.push(persisted);

          return {
            created: true,
            entry: clone(persisted),
          };
        },
      };

      try {
        return await operation({
          transitionRepository,
          auditRepository,
        });
      } catch (error) {
        state = stateSnapshot;
        transitionEvents = eventSnapshot;
        auditEntries = auditSnapshot;
        throw error;
      }
    },

    getState() {
      return clone(state);
    },

    getTransitionEvents() {
      return [...transitionEvents.values()].map(clone);
    },

    getAuditEntries() {
      return auditEntries.map(clone);
    },

    getTransactionCalls() {
      return transactionCalls;
    },

    getCompareAndSetCalls() {
      return compareAndSetCalls;
    },

    getAuditAppendCalls() {
      return auditAppendCalls;
    },
  };

  return repository;
}

async function expectCoordinatorCode(
  action,
  expectedCode,
) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof AuditedVerticalSliceTransitionError &&
      error.code === expectedCode,
  );
}

async function apply(input) {
  return applyAuditedCustomerVerticalSliceTransition({
    auditContext,
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    nowIso: fixedNow,
    ...input,
  });
}

async function main() {
  const preflightRepository =
    createTransactionalRepository();

  await expectCoordinatorCode(
    () =>
      apply({
        actorContext: {
          ...serviceActorContext,
          authenticated: false,
        },
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "preflight-1",
        repository: preflightRepository,
      }),
    "INVALID_COORDINATOR_CONTEXT",
  );

  await expectCoordinatorCode(
    () =>
      applyAuditedCustomerVerticalSliceTransition({
        actorContext: serviceActorContext,
        auditContext: {
          ...auditContext,
          role: "owner",
        },
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "preflight-2",
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "AUDIT_SERVICE_NOT_AUTHORIZED",
  );

  await expectCoordinatorCode(
    () =>
      applyAuditedCustomerVerticalSliceTransition({
        actorContext: serviceActorContext,
        auditContext: {
          ...auditContext,
          tenantId: "tenant-b",
        },
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "preflight-3",
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "CROSS_TENANT_COORDINATION",
  );

  assert.equal(
    preflightRepository.getTransactionCalls(),
    0,
    "Invalid coordinator contexts must fail before a transaction starts.",
  );

  const rollbackRepository =
    createTransactionalRepository({
      failAuditAppend: true,
    });

  await assert.rejects(
    () =>
      apply({
        actorContext: serviceActorContext,
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "rollback-event",
        repository: rollbackRepository,
      }),
    /forced audit failure/,
  );

  assert.deepEqual(
    rollbackRepository.getState(),
    initialState,
    "Audit failure must roll back the lifecycle state change.",
  );

  assert.equal(
    rollbackRepository.getTransitionEvents().length,
    0,
    "Audit failure must roll back the transition event.",
  );

  assert.equal(
    rollbackRepository.getAuditEntries().length,
    0,
    "Audit failure must not leave a partial audit row.",
  );

  const tamperRepository =
    createTransactionalRepository({
      tamperAuditPersistence: true,
    });

  await assert.rejects(
    () =>
      apply({
        actorContext: serviceActorContext,
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "tamper-event",
        repository: tamperRepository,
      }),
    (error) =>
      error &&
      (
        error.code === "AUDIT_CHAIN_INVALID" ||
        error.code === "PERSISTENCE_MISMATCH" ||
        error.code === "COORDINATION_MISMATCH"
      ),
  );

  assert.deepEqual(
    tamperRepository.getState(),
    initialState,
    "Audit mismatch must roll back the state transition.",
  );

  const repository = createTransactionalRepository();

  const recommendation = await apply({
    actorContext: serviceActorContext,
    expectedVersion: repository.getState().version,
    transition: "generate_recommendation",
    idempotencyKey: "inquiry-735:recommendation:v1",
    repository,
  });

  assert.equal(recommendation.transitionApplied, true);
  assert.equal(recommendation.auditCreated, true);
  assert.equal(
    recommendation.state.status,
    "recommendation_ready",
  );
  assert.equal(
    recommendation.event.eventId,
    recommendation.auditEntry.sourceEventId,
  );
  assert.equal(
    recommendation.state.version,
    recommendation.auditEntry.nextVersion,
  );

  const recommendationReplay = await apply({
    actorContext: serviceActorContext,
    expectedVersion: "initial-v1",
    transition: "generate_recommendation",
    idempotencyKey: "inquiry-735:recommendation:v1",
    repository,
  });

  assert.equal(
    recommendationReplay.transitionIdempotent,
    true,
  );
  assert.equal(
    recommendationReplay.auditIdempotent,
    true,
  );
  assert.equal(
    recommendationReplay.recoveredMissingAudit,
    false,
  );
  assert.equal(
    repository.getCompareAndSetCalls(),
    1,
    "Idempotent replay must not repeat the state write.",
  );
  assert.equal(
    repository.getAuditAppendCalls(),
    1,
    "Idempotent replay must not repeat the audit append.",
  );

  await assert.rejects(
    () =>
      apply({
        actorContext: customerContext,
        expectedVersion: repository.getState().version,
        transition: "approve_recommendation",
        idempotencyKey: "unauthorized-approval",
        repository,
      }),
    (error) =>
      error &&
      error.code === "ACTOR_ACCESS_DENIED",
  );

  assert.equal(
    repository.getState().status,
    "recommendation_ready",
    "Unauthorized action must not change lifecycle state.",
  );

  const approval = await apply({
    actorContext: ownerContext,
    expectedVersion: repository.getState().version,
    transition: "approve_recommendation",
    idempotencyKey: "inquiry-735:approval:v1",
    repository,
  });

  assert.equal(approval.state.status, "owner_approved");
  assert.equal(approval.event.actorRole, "owner");

  const executionStart = await apply({
    actorContext: serviceActorContext,
    expectedVersion: repository.getState().version,
    transition: "start_sandbox_execution",
    idempotencyKey: "inquiry-735:execution-start:v1",
    repository,
  });

  assert.equal(
    executionStart.state.status,
    "sandbox_executing",
  );

  const executionSuccess = await apply({
    actorContext: serviceActorContext,
    expectedVersion: repository.getState().version,
    transition: "complete_sandbox_execution",
    idempotencyKey: "inquiry-735:execution-success:v1",
    repository,
  });

  assert.equal(
    executionSuccess.state.status,
    "sandbox_succeeded",
  );

  const release = await apply({
    actorContext: ownerContext,
    expectedVersion: repository.getState().version,
    transition: "release_result",
    idempotencyKey: "inquiry-735:release:v1",
    repository,
  });

  assert.equal(release.state.status, "result_released");
  assert.equal(release.event.actorRole, "owner");

  const acknowledgement = await apply({
    actorContext: customerContext,
    expectedVersion: repository.getState().version,
    transition: "acknowledge_result",
    idempotencyKey: "inquiry-735:acknowledgement:v1",
    repository,
  });

  assert.equal(
    acknowledgement.state.status,
    "customer_acknowledged",
  );
  assert.equal(
    acknowledgement.event.actorRole,
    "customer",
  );

  const entries = repository.getAuditEntries();

  assert.equal(entries.length, 6);
  assert.equal(
    repository.getTransitionEvents().length,
    6,
  );

  const verified = verifyVerticalSliceAuditChain({
    tenantId: "tenant-a",
    inquiryId: "inquiry-735",
    entries,
  });

  assert.equal(verified.valid, true);
  assert.equal(verified.entryCount, 6);
  assert.equal(
    verified.finalVersion,
    repository.getState().version,
  );
  assert.equal(
    verified.headHash,
    entries[entries.length - 1].hash,
  );

  console.log("DAY 743 TARGETED TESTS PASS (15/15)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
