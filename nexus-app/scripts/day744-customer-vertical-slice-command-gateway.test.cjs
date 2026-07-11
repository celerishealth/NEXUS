/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY744_MODULE;

if (!modulePath) {
  throw new Error("DAY744_MODULE is required.");
}

const {
  CustomerVerticalSliceCommandGatewayError,
  executeCustomerVerticalSliceCommand,
} = require(modulePath);

const fixedNow = "2026-07-11T06:00:00.000Z";

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

const serviceContext = Object.freeze({
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

function createRepository(startState = initialState) {
  let state = clone(startState);
  let events = new Map();
  let audits = [];
  let transactionCalls = 0;
  let stateWriteCalls = 0;
  let auditWriteCalls = 0;

  return {
    async runInTransaction(operation) {
      transactionCalls += 1;

      const stateSnapshot = clone(state);

      const eventSnapshot = new Map(
        [...events.entries()].map(
          ([key, value]) => [key, clone(value)],
        ),
      );

      const auditSnapshot = audits.map(clone);

      const transitionRepository = {
        async findState({ tenantId, inquiryId }) {
          assert.equal(tenantId, "tenant-a");
          assert.equal(inquiryId, "inquiry-735");
          return clone(state);
        },

        async findEventByIdempotencyKey({
          tenantId,
          idempotencyKey,
        }) {
          assert.equal(tenantId, "tenant-a");

          const event = events.get(idempotencyKey);
          return event ? clone(event) : null;
        },

        async compareAndSet({
          tenantId,
          inquiryId,
          expectedVersion,
          nextState,
          event,
        }) {
          stateWriteCalls += 1;

          assert.equal(tenantId, "tenant-a");
          assert.equal(inquiryId, "inquiry-735");

          if (state.version !== expectedVersion) {
            return {
              applied: false,
              state: clone(state),
            };
          }

          state = clone(nextState);
          events.set(
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
          const entry = audits.find(
            (candidate) =>
              candidate.tenantId === tenantId &&
              candidate.sourceEventId === sourceEventId,
          );

          return entry ? clone(entry) : null;
        },

        async findLatest({ tenantId, inquiryId }) {
          const entries = audits.filter(
            (entry) =>
              entry.tenantId === tenantId &&
              entry.inquiryId === inquiryId,
          );

          return entries.length > 0
            ? clone(entries[entries.length - 1])
            : null;
        },

        async appendIfCurrent({
          entry,
          expectedSequence,
          expectedPreviousHash,
        }) {
          auditWriteCalls += 1;

          const latest =
            audits.length > 0
              ? audits[audits.length - 1]
              : null;

          const sequence = latest
            ? latest.sequence + 1
            : 1;

          const previousHash = latest
            ? latest.hash
            : "GENESIS";

          if (
            sequence !== expectedSequence ||
            previousHash !== expectedPreviousHash
          ) {
            return {
              created: false,
              entry: clone(latest ?? entry),
            };
          }

          audits.push(clone(entry));

          return {
            created: true,
            entry: clone(entry),
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
        events = eventSnapshot;
        audits = auditSnapshot;
        throw error;
      }
    },

    getState() {
      return clone(state);
    },

    getEvents() {
      return [...events.values()].map(clone);
    },

    getAudits() {
      return audits.map(clone);
    },

    getTransactionCalls() {
      return transactionCalls;
    },

    getStateWriteCalls() {
      return stateWriteCalls;
    },

    getAuditWriteCalls() {
      return auditWriteCalls;
    },
  };
}

async function expectGatewayCode(
  action,
  expectedCode,
) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof
        CustomerVerticalSliceCommandGatewayError &&
      error.code === expectedCode,
  );
}

async function execute(input) {
  return executeCustomerVerticalSliceCommand({
    auditContext,
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    executionMode: "sandbox",
    externalDeliveryRequested: false,
    publicLaunchRequested: false,
    nowIso: fixedNow,
    ...input,
  });
}

async function main() {
  const preflightRepository = createRepository();

  await expectGatewayCode(
    () =>
      execute({
        actorContext: serviceContext,
        expectedVersion: "initial-v1",
        command: "prepare_recommendation",
        requestId: "live-request",
        executionMode: "live",
        repository: preflightRepository,
      }),
    "LIVE_EXECUTION_NOT_AUTHORIZED",
  );

  await expectGatewayCode(
    () =>
      execute({
        actorContext: serviceContext,
        expectedVersion: "initial-v1",
        command: "prepare_recommendation",
        requestId: "external-request",
        externalDeliveryRequested: true,
        repository: preflightRepository,
      }),
    "EXTERNAL_DELIVERY_NOT_AUTHORIZED",
  );

  await expectGatewayCode(
    () =>
      execute({
        actorContext: serviceContext,
        expectedVersion: "initial-v1",
        command: "prepare_recommendation",
        requestId: "launch-request",
        publicLaunchRequested: true,
        repository: preflightRepository,
      }),
    "PUBLIC_LAUNCH_NOT_AUTHORIZED",
  );

  await expectGatewayCode(
    () =>
      execute({
        actorContext: ownerContext,
        expectedVersion: "initial-v1",
        command: "prepare_recommendation",
        requestId: "wrong-role",
        repository: preflightRepository,
      }),
    "COMMAND_ROLE_MISMATCH",
  );

  await expectGatewayCode(
    () =>
      execute({
        actorContext: serviceContext,
        expectedVersion: "initial-v1",
        command: "prepare_recommendation",
        requestId: " invalid request ",
        repository: preflightRepository,
      }),
    "INVALID_GATEWAY_REQUEST",
  );

  assert.equal(
    preflightRepository.getTransactionCalls(),
    0,
    "Gateway safety failures must occur before a transaction starts.",
  );

  await assert.rejects(
    () =>
      execute({
        actorContext: {
          ...serviceContext,
          authenticated: false,
        },
        expectedVersion: "initial-v1",
        command: "prepare_recommendation",
        requestId: "unauthenticated",
        repository: preflightRepository,
      }),
    (error) =>
      error &&
      error.code === "INVALID_COORDINATOR_CONTEXT",
  );

  await assert.rejects(
    () =>
      executeCustomerVerticalSliceCommand({
        actorContext: serviceContext,
        auditContext,
        requestedTenantId: "tenant-b",
        inquiryId: "inquiry-735",
        expectedVersion: "initial-v1",
        command: "prepare_recommendation",
        requestId: "cross-tenant",
        executionMode: "sandbox",
        externalDeliveryRequested: false,
        publicLaunchRequested: false,
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    (error) =>
      error &&
      error.code === "CROSS_TENANT_COORDINATION",
  );

  assert.equal(
    preflightRepository.getTransactionCalls(),
    0,
    "Authentication and tenant failures must occur before transaction access.",
  );

  const repository = createRepository();

  const recommendation = await execute({
    actorContext: serviceContext,
    expectedVersion: repository.getState().version,
    command: "prepare_recommendation",
    requestId: "request-recommendation-1",
    repository,
  });

  assert.equal(recommendation.outcome, "applied");
  assert.equal(
    recommendation.status,
    "recommendation_ready",
  );
  assert.equal(
    recommendation.nextAction,
    "owner_review_required",
  );
  assert.equal(recommendation.mode, "sandbox");
  assert.match(
    recommendation.receipt.auditHash,
    /^[a-f0-9]{64}$/,
  );

  const immediateReplay = await execute({
    actorContext: serviceContext,
    expectedVersion: "initial-v1",
    command: "prepare_recommendation",
    requestId: "request-recommendation-1",
    repository,
  });

  assert.equal(immediateReplay.outcome, "replayed");
  assert.equal(
    immediateReplay.receipt.eventId,
    recommendation.receipt.eventId,
  );
  assert.equal(repository.getStateWriteCalls(), 1);
  assert.equal(repository.getAuditWriteCalls(), 1);

  const approval = await execute({
    actorContext: ownerContext,
    expectedVersion: repository.getState().version,
    command: "approve_recommendation",
    requestId: "request-approval-1",
    repository,
  });

  assert.equal(approval.status, "owner_approved");
  assert.equal(
    approval.nextAction,
    "sandbox_execution_pending",
  );

  const executionStart = await execute({
    actorContext: serviceContext,
    expectedVersion: repository.getState().version,
    command: "start_sandbox_execution",
    requestId: "request-execution-start-1",
    repository,
  });

  assert.equal(
    executionStart.status,
    "sandbox_executing",
  );
  assert.equal(
    executionStart.nextAction,
    "sandbox_execution_in_progress",
  );

  const executionComplete = await execute({
    actorContext: serviceContext,
    expectedVersion: repository.getState().version,
    command: "complete_sandbox_execution",
    requestId: "request-execution-complete-1",
    repository,
  });

  assert.equal(
    executionComplete.status,
    "sandbox_succeeded",
  );
  assert.equal(
    executionComplete.nextAction,
    "owner_release_required",
  );

  const release = await execute({
    actorContext: ownerContext,
    expectedVersion: repository.getState().version,
    command: "release_result",
    requestId: "request-release-1",
    repository,
  });

  assert.equal(release.status, "result_released");
  assert.equal(
    release.nextAction,
    "customer_acknowledgement_required",
  );
  assert.match(
    release.receipt.auditHash,
    /^[a-f0-9]{64}$/,
  );

  const acknowledgement = await execute({
    actorContext: customerContext,
    expectedVersion: repository.getState().version,
    command: "acknowledge_result",
    requestId: "request-acknowledgement-1",
    repository,
  });

  assert.equal(
    acknowledgement.status,
    "customer_acknowledged",
  );
  assert.equal(acknowledgement.terminal, true);
  assert.equal(
    acknowledgement.nextAction,
    "complete",
  );
  assert.equal(
    acknowledgement.receipt.auditHash,
    null,
    "Customer receipts must not expose the internal audit hash.",
  );

  assert.equal(repository.getEvents().length, 6);
  assert.equal(repository.getAudits().length, 6);

  const advancedReplay = await execute({
    actorContext: serviceContext,
    expectedVersion: "initial-v1",
    command: "prepare_recommendation",
    requestId: "request-recommendation-1",
    repository,
  });

  assert.equal(
    advancedReplay.outcome,
    "replayed",
  );

  assert.equal(
    advancedReplay.status,
    "customer_acknowledged",
    "Advanced replay must return the current lifecycle state.",
  );

  assert.equal(
    repository.getStateWriteCalls(),
    6,
    "Advanced replay must not create another state write.",
  );

  assert.equal(
    repository.getAuditWriteCalls(),
    6,
    "Advanced replay must not append another audit entry.",
  );

  const rejectionRepository = createRepository();

  await execute({
    actorContext: serviceContext,
    expectedVersion:
      rejectionRepository.getState().version,
    command: "prepare_recommendation",
    requestId: "rejection-recommendation",
    repository: rejectionRepository,
  });

  const rejection = await execute({
    actorContext: ownerContext,
    expectedVersion:
      rejectionRepository.getState().version,
    command: "reject_recommendation",
    requestId: "rejection-decision",
    repository: rejectionRepository,
  });

  assert.equal(rejection.status, "owner_rejected");
  assert.equal(rejection.terminal, true);
  assert.equal(rejection.nextAction, "blocked");

  console.log("DAY 744 TARGETED TESTS PASS (18/18)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
