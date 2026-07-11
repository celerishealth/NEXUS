/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY741_MODULE;

if (!modulePath) {
  throw new Error("DAY741_MODULE is required.");
}

const {
  CustomerVerticalSliceTransitionError,
  applyCustomerVerticalSliceTransition,
} = require(modulePath);

const fixedNow = "2026-07-11T03:00:00.000Z";

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

function createRepository(startState = initialState) {
  let state = startState ? { ...startState } : null;
  const events = new Map();
  let compareAndSetCalls = 0;

  return {
    async findState({ tenantId, inquiryId }) {
      assert.equal(tenantId, "tenant-a");
      assert.equal(inquiryId, "inquiry-735");
      return state ? { ...state } : null;
    },

    async findEventByIdempotencyKey({
      tenantId,
      idempotencyKey,
    }) {
      assert.equal(tenantId, "tenant-a");
      return events.get(idempotencyKey) ?? null;
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

      if (!state || state.version !== expectedVersion) {
        return {
          applied: false,
          state: state ? { ...state } : { ...nextState },
        };
      }

      state = { ...nextState };
      events.set(event.idempotencyKey, { ...event });

      return {
        applied: true,
        state: { ...state },
      };
    },

    getState() {
      return state ? { ...state } : null;
    },

    getCompareAndSetCalls() {
      return compareAndSetCalls;
    },
  };
}

async function expectCode(action, expectedCode) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof CustomerVerticalSliceTransitionError &&
      error.code === expectedCode,
  );
}

async function apply(input) {
  return applyCustomerVerticalSliceTransition({
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    nowIso: fixedNow,
    ...input,
  });
}

async function main() {
  let preflightCalls = 0;

  const preflightRepository = {
    async findState() {
      preflightCalls += 1;
      return { ...initialState };
    },
    async findEventByIdempotencyKey() {
      preflightCalls += 1;
      return null;
    },
    async compareAndSet() {
      preflightCalls += 1;
      throw new Error("Must not persist.");
    },
  };

  await expectCode(
    () =>
      apply({
        context: {
          ...ownerContext,
          authenticated: false,
        },
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "event-1",
        repository: preflightRepository,
      }),
    "UNAUTHENTICATED",
  );

  await expectCode(
    () =>
      applyCustomerVerticalSliceTransition({
        context: ownerContext,
        requestedTenantId: "tenant-b",
        inquiryId: "inquiry-735",
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "event-2",
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "CROSS_TENANT_ACCESS",
  );

  assert.equal(
    preflightCalls,
    0,
    "Authentication and tenant checks must fail before repository access.",
  );

  await expectCode(
    () =>
      apply({
        context: ownerContext,
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "event-3",
        repository: createRepository(null),
      }),
    "LIFECYCLE_NOT_FOUND",
  );

  await expectCode(
    () =>
      apply({
        context: {
          ...ownerContext,
          actorId: "owner-b",
        },
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "event-4",
        repository: createRepository(),
      }),
    "ACTOR_ACCESS_DENIED",
  );

  await expectCode(
    () =>
      apply({
        context: serviceContext,
        expectedVersion: "initial-v1",
        transition: "approve_recommendation",
        idempotencyKey: "event-5",
        repository: createRepository({
          ...initialState,
          status: "recommendation_ready",
        }),
      }),
    "ACTOR_ACCESS_DENIED",
  );

  await expectCode(
    () =>
      apply({
        context: customerContext,
        expectedVersion: "initial-v1",
        transition: "release_result",
        idempotencyKey: "event-6",
        repository: createRepository({
          ...initialState,
          status: "sandbox_succeeded",
        }),
      }),
    "ACTOR_ACCESS_DENIED",
  );

  await expectCode(
    () =>
      apply({
        context: ownerContext,
        expectedVersion: "stale-version",
        transition: "generate_recommendation",
        idempotencyKey: "event-7",
        repository: createRepository(),
      }),
    "STALE_VERSION",
  );

  await expectCode(
    () =>
      apply({
        context: ownerContext,
        expectedVersion: "initial-v1",
        transition: "release_result",
        idempotencyKey: "event-8",
        repository: createRepository(),
      }),
    "TRANSITION_NOT_ALLOWED",
  );

  const repository = createRepository();

  const recommendation = await apply({
    context: serviceContext,
    expectedVersion: repository.getState().version,
    transition: "generate_recommendation",
    idempotencyKey: "inquiry-735:recommendation:v1",
    repository,
  });

  assert.equal(recommendation.applied, true);
  assert.equal(recommendation.idempotent, false);
  assert.equal(
    recommendation.state.status,
    "recommendation_ready",
  );
  assert.match(recommendation.state.version, /^lsv1_[a-f0-9]{8}$/);
  assert.match(recommendation.event.eventId, /^lse1_[a-f0-9]{8}$/);

  const recommendationReplay = await apply({
    context: serviceContext,
    expectedVersion: "initial-v1",
    transition: "generate_recommendation",
    idempotencyKey: "inquiry-735:recommendation:v1",
    repository,
  });

  assert.equal(recommendationReplay.applied, false);
  assert.equal(recommendationReplay.idempotent, true);
  assert.equal(
    repository.getCompareAndSetCalls(),
    1,
    "Idempotent replay must not create another persistence write.",
  );

  const approval = await apply({
    context: ownerContext,
    expectedVersion: repository.getState().version,
    transition: "approve_recommendation",
    idempotencyKey: "inquiry-735:owner-approval:v1",
    repository,
  });

  assert.equal(approval.state.status, "owner_approved");
  assert.equal(approval.event.actorRole, "owner");

  const executionStart = await apply({
    context: serviceContext,
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
    context: serviceContext,
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
    context: ownerContext,
    expectedVersion: repository.getState().version,
    transition: "release_result",
    idempotencyKey: "inquiry-735:result-release:v1",
    repository,
  });

  assert.equal(release.state.status, "result_released");
  assert.equal(release.event.actorRole, "owner");

  const acknowledgement = await apply({
    context: customerContext,
    expectedVersion: repository.getState().version,
    transition: "acknowledge_result",
    idempotencyKey: "inquiry-735:customer-ack:v1",
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

  const conflictRepository = createRepository();

  conflictRepository.compareAndSet = async ({
    nextState,
  }) => ({
    applied: false,
    state: {
      ...nextState,
      status: "recommendation_ready",
      version: "different-version",
    },
  });

  await expectCode(
    () =>
      apply({
        context: serviceContext,
        expectedVersion: "initial-v1",
        transition: "generate_recommendation",
        idempotencyKey: "concurrent-event",
        repository: conflictRepository,
      }),
    "CONCURRENT_MODIFICATION",
  );

  const idempotencyConflictRepository = createRepository();

  await apply({
    context: serviceContext,
    expectedVersion: "initial-v1",
    transition: "generate_recommendation",
    idempotencyKey: "shared-key",
    repository: idempotencyConflictRepository,
  });

  await expectCode(
    () =>
      apply({
        context: ownerContext,
        expectedVersion:
          idempotencyConflictRepository.getState().version,
        transition: "approve_recommendation",
        idempotencyKey: "shared-key",
        repository: idempotencyConflictRepository,
      }),
    "IDEMPOTENCY_CONFLICT",
  );

  console.log("DAY 741 TARGETED TESTS PASS (15/15)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
