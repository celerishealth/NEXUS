/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY745_MODULE;

if (!modulePath) {
  throw new Error("DAY745_MODULE is required.");
}

const {
  handleCustomerVerticalSliceCommand,
} = require(modulePath);

const fixedNow = "2026-07-11T07:00:00.000Z";

const serviceSession = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "nexus-sandbox-service",
  role: "service",
});

const ownerSession = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "owner-a",
  role: "owner",
});

const customerSession = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "customer-a",
  role: "customer",
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
        async findState() {
          return clone(state);
        },

        async findEventByIdempotencyKey({
          idempotencyKey,
        }) {
          const event = events.get(idempotencyKey);
          return event ? clone(event) : null;
        },

        async compareAndSet({
          expectedVersion,
          nextState,
          event,
        }) {
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

        async findLatest({
          tenantId,
          inquiryId,
        }) {
          const matches = audits.filter(
            (entry) =>
              entry.tenantId === tenantId &&
              entry.inquiryId === inquiryId,
          );

          return matches.length > 0
            ? clone(matches[matches.length - 1])
            : null;
        },

        async appendIfCurrent({
          entry,
          expectedSequence,
          expectedPreviousHash,
        }) {
          const latest =
            audits.length > 0
              ? audits[audits.length - 1]
              : null;

          const nextSequence = latest
            ? latest.sequence + 1
            : 1;

          const previousHash = latest
            ? latest.hash
            : "GENESIS";

          if (
            nextSequence !== expectedSequence ||
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

    getTransactionCalls() {
      return transactionCalls;
    },

    getEventCount() {
      return events.size;
    },

    getAuditCount() {
      return audits.length;
    },
  };
}

function createLimiter(options = {}) {
  let calls = 0;

  return {
    async consume(input) {
      calls += 1;

      if (options.fail === true) {
        throw new Error("private limiter failure");
      }

      if (options.check) {
        options.check(input);
      }

      return {
        allowed: options.allowed !== false,
        retryAfterSeconds:
          options.retryAfterSeconds ?? 30,
      };
    },

    calls() {
      return calls;
    },
  };
}

function body(overrides = {}) {
  return {
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    expectedVersion: "initial-v1",
    command: "prepare_recommendation",
    requestId: "request-745-1",
    executionMode: "sandbox",
    externalDeliveryRequested: false,
    publicLaunchRequested: false,
    ...overrides,
  };
}

async function run(overrides = {}) {
  return handleCustomerVerticalSliceCommand({
    session: serviceSession,
    rawBody: body(),
    auditContext,
    rateLimiter: createLimiter(),
    repository: createRepository(),
    nowIso: fixedNow,
    ...overrides,
  });
}

async function main() {
  const oversizedRepository = createRepository();
  const oversizedLimiter = createLimiter();

  const oversized = await run({
    rawBody: body({
      requestId: "x".repeat(9000),
    }),
    repository: oversizedRepository,
    rateLimiter: oversizedLimiter,
  });

  assert.equal(oversized.status, 413);
  assert.equal(
    oversized.body.error.code,
    "REQUEST_TOO_LARGE",
  );
  assert.equal(oversizedLimiter.calls(), 0);
  assert.equal(
    oversizedRepository.getTransactionCalls(),
    0,
  );

  const nonObject = await run({
    rawBody: "invalid",
  });

  assert.equal(nonObject.status, 422);

  const unknownKey = await run({
    rawBody: {
      ...body(),
      internalOverride: true,
    },
  });

  assert.equal(unknownKey.status, 422);

  const malformedId = await run({
    rawBody: body({
      requestId: " invalid request ",
    }),
  });

  assert.equal(malformedId.status, 422);

  const unknownCommand = await run({
    rawBody: body({
      command: "execute_live_provider",
    }),
  });

  assert.equal(unknownCommand.status, 422);

  const unauthRepository = createRepository();
  const unauthLimiter = createLimiter();

  const unauthenticated = await run({
    session: {
      ...serviceSession,
      authenticated: false,
    },
    repository: unauthRepository,
    rateLimiter: unauthLimiter,
  });

  assert.equal(unauthenticated.status, 401);
  assert.equal(unauthLimiter.calls(), 0);
  assert.equal(
    unauthRepository.getTransactionCalls(),
    0,
  );

  const crossTenantRepository = createRepository();
  const crossTenantLimiter = createLimiter();

  const crossTenant = await run({
    rawBody: body({
      requestedTenantId: "tenant-b",
    }),
    repository: crossTenantRepository,
    rateLimiter: crossTenantLimiter,
  });

  assert.equal(crossTenant.status, 403);
  assert.equal(crossTenantLimiter.calls(), 0);
  assert.equal(
    crossTenantRepository.getTransactionCalls(),
    0,
  );

  const rateLimitedRepository = createRepository();

  const rateLimited = await run({
    repository: rateLimitedRepository,
    rateLimiter: createLimiter({
      allowed: false,
      retryAfterSeconds: 45,
    }),
  });

  assert.equal(rateLimited.status, 429);
  assert.equal(
    rateLimited.headers["retry-after"],
    "45",
  );
  assert.equal(
    rateLimitedRepository.getTransactionCalls(),
    0,
  );

  const limiterFailure = await run({
    rateLimiter: createLimiter({
      fail: true,
    }),
  });

  assert.equal(limiterFailure.status, 503);
  assert.equal(
    JSON.stringify(limiterFailure.body).includes(
      "private limiter failure",
    ),
    false,
  );

  const live = await run({
    rawBody: body({
      executionMode: "live",
    }),
  });

  assert.equal(live.status, 403);

  const delivery = await run({
    rawBody: body({
      externalDeliveryRequested: true,
    }),
  });

  assert.equal(delivery.status, 403);

  const launch = await run({
    rawBody: body({
      publicLaunchRequested: true,
    }),
  });

  assert.equal(launch.status, 403);

  const wrongRole = await run({
    session: ownerSession,
  });

  assert.equal(wrongRole.status, 403);

  const repository = createRepository();

  const success = await run({
    repository,
    rateLimiter: createLimiter({
      check(input) {
        assert.deepEqual(input, {
          tenantId: "tenant-a",
          actorId: "nexus-sandbox-service",
          command: "prepare_recommendation",
        });
      },
    }),
  });

  assert.equal(success.status, 200);
  assert.equal(success.body.ok, true);
  assert.equal(
    success.body.data.status,
    "recommendation_ready",
  );
  assert.equal(
    success.body.data.mode,
    "sandbox",
  );
  assert.equal(repository.getEventCount(), 1);
  assert.equal(repository.getAuditCount(), 1);

  const replay = await run({
    repository,
  });

  assert.equal(replay.status, 200);
  assert.equal(
    replay.body.data.outcome,
    "replayed",
  );
  assert.equal(repository.getEventCount(), 1);
  assert.equal(repository.getAuditCount(), 1);

  const conflict = await run({
    session: ownerSession,
    rawBody: body({
      expectedVersion:
        repository.getState().version,
      command: "release_result",
      requestId: "invalid-transition",
    }),
    repository,
  });

  assert.equal(conflict.status, 409);

  const acknowledgementRepository =
    createRepository({
      ...initialState,
      status: "result_released",
      version: "released-v1",
      updatedAt: "2026-07-11T06:30:00.000Z",
    });

  const acknowledgement =
    await handleCustomerVerticalSliceCommand({
      session: customerSession,
      rawBody: body({
        expectedVersion: "released-v1",
        command: "acknowledge_result",
        requestId: "customer-ack-745",
      }),
      auditContext,
      rateLimiter: createLimiter(),
      repository: acknowledgementRepository,
      nowIso: fixedNow,
    });

  assert.equal(acknowledgement.status, 200);
  assert.equal(
    acknowledgement.body.data.status,
    "customer_acknowledged",
  );
  assert.equal(
    acknowledgement.body.data.receipt.auditHash,
    null,
  );

  const secretFailure =
    await handleCustomerVerticalSliceCommand({
      session: serviceSession,
      rawBody: body(),
      auditContext,
      rateLimiter: createLimiter(),
      repository: {
        async runInTransaction() {
          throw new Error(
            "DATABASE_PASSWORD=private-secret",
          );
        },
      },
      nowIso: fixedNow,
    });

  assert.equal(secretFailure.status, 500);
  assert.equal(
    JSON.stringify(secretFailure.body).includes(
      "private-secret",
    ),
    false,
  );

  console.log(
    "DAY 745 TARGETED TESTS PASS (18/18)",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
