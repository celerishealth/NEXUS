/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY746_MODULE;

if (!modulePath) {
  throw new Error("DAY746_MODULE is required.");
}

const {
  handleCustomerVerticalSliceHttpRequest,
} = require(modulePath);

const fixedNow = "2026-07-11T08:00:00.000Z";

const serviceSession = Object.freeze({
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

function body(overrides = {}) {
  return {
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    expectedVersion: "initial-v1",
    command: "prepare_recommendation",
    requestId: "request-746-1",
    executionMode: "sandbox",
    externalDeliveryRequested: false,
    publicLaunchRequested: false,
    ...overrides,
  };
}

function createRequest(options = {}) {
  const method = options.method ?? "POST";

  const headers = {
    "content-type": "application/json",
    ...(options.headers ?? {}),
  };

  const requestBody =
    options.rawBody !== undefined
      ? options.rawBody
      : JSON.stringify(
          options.body ?? body(),
        );

  return new Request(
    "https://nexus.local/api/nexus/customer-vertical-slice/command",
    {
      method,
      headers,
      body:
        method === "GET" ||
        method === "HEAD"
          ? undefined
          : requestBody,
    },
  );
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
          ([key, value]) => [
            key,
            clone(value),
          ],
        ),
      );

      const auditSnapshot =
        audits.map(clone);

      const transitionRepository = {
        async findState() {
          return clone(state);
        },

        async findEventByIdempotencyKey({
          idempotencyKey,
        }) {
          const event =
            events.get(idempotencyKey);

          return event
            ? clone(event)
            : null;
        },

        async compareAndSet({
          expectedVersion,
          nextState,
          event,
        }) {
          if (
            state.version !== expectedVersion
          ) {
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
              candidate.sourceEventId ===
                sourceEventId,
          );

          return entry
            ? clone(entry)
            : null;
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
            ? clone(
                matches[
                  matches.length - 1
                ],
              )
            : null;
        },

        async appendIfCurrent({
          entry,
          expectedSequence,
          expectedPreviousHash,
        }) {
          const latest =
            audits.length > 0
              ? audits[
                  audits.length - 1
                ]
              : null;

          const nextSequence = latest
            ? latest.sequence + 1
            : 1;

          const previousHash = latest
            ? latest.hash
            : "GENESIS";

          if (
            nextSequence !==
              expectedSequence ||
            previousHash !==
              expectedPreviousHash
          ) {
            return {
              created: false,
              entry: clone(
                latest ?? entry,
              ),
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
    async consume() {
      calls += 1;

      if (options.fail === true) {
        throw new Error(
          "private-rate-limit-secret",
        );
      }

      return {
        allowed:
          options.allowed !== false,
        retryAfterSeconds:
          options.retryAfterSeconds ?? 30,
      };
    },

    getCalls() {
      return calls;
    },
  };
}

function createDependencies(options = {}) {
  let sessionCalls = 0;
  let integrityCalls = 0;

  const dependencies = {
    async loadSession() {
      sessionCalls += 1;

      if (
        options.sessionFailure === true
      ) {
        throw new Error(
          "private-identity-secret",
        );
      }

      return (
        options.session ??
        serviceSession
      );
    },

    async verifyRequestIntegrity() {
      integrityCalls += 1;

      if (
        options.integrityFailure === true
      ) {
        throw new Error(
          "private-integrity-secret",
        );
      }

      return (
        options.integrityVerified !==
        false
      );
    },

    auditContext,
    rateLimiter:
      options.rateLimiter ??
      createLimiter(),
    repository:
      options.repository ??
      createRepository(),
    nowIso: fixedNow,

    getSessionCalls() {
      return sessionCalls;
    },

    getIntegrityCalls() {
      return integrityCalls;
    },
  };

  return dependencies;
}

async function readJson(response) {
  return JSON.parse(
    await response.text(),
  );
}

async function main() {
  const methodDependencies =
    createDependencies();

  const methodResponse =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        method: "GET",
      }),
      methodDependencies,
    );

  assert.equal(methodResponse.status, 405);
  assert.equal(
    methodResponse.headers.get("allow"),
    "POST",
  );
  assert.equal(
    methodDependencies.getSessionCalls(),
    0,
  );

  const mediaDependencies =
    createDependencies();

  const mediaResponse =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        headers: {
          "content-type": "text/plain",
        },
      }),
      mediaDependencies,
    );

  assert.equal(mediaResponse.status, 415);
  assert.equal(
    mediaDependencies.getSessionCalls(),
    0,
  );

  const encodingResponse =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        headers: {
          "content-encoding": "gzip",
        },
      }),
      createDependencies(),
    );

  assert.equal(
    encodingResponse.status,
    415,
  );

  const declaredOversizeDependencies =
    createDependencies();

  const declaredOversize =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        headers: {
          "content-length": "9000",
        },
      }),
      declaredOversizeDependencies,
    );

  assert.equal(
    declaredOversize.status,
    413,
  );
  assert.equal(
    declaredOversizeDependencies
      .getSessionCalls(),
    0,
  );

  const actualOversize =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        rawBody: JSON.stringify({
          payload: "x".repeat(9000),
        }),
      }),
      createDependencies(),
    );

  assert.equal(
    actualOversize.status,
    413,
  );

  const invalidJson =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        rawBody: "{invalid-json",
      }),
      createDependencies(),
    );

  assert.equal(invalidJson.status, 422);

  const identityFailure =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      createDependencies({
        sessionFailure: true,
      }),
    );

  const identityFailureBody =
    await readJson(identityFailure);

  assert.equal(
    identityFailure.status,
    503,
  );
  assert.equal(
    JSON.stringify(
      identityFailureBody,
    ).includes(
      "private-identity-secret",
    ),
    false,
  );

  const unauthenticatedRepository =
    createRepository();

  const unauthenticatedDependencies =
    createDependencies({
      session: {
        ...serviceSession,
        authenticated: false,
      },
      repository:
        unauthenticatedRepository,
    });

  const unauthenticated =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      unauthenticatedDependencies,
    );

  assert.equal(
    unauthenticated.status,
    401,
  );
  assert.equal(
    unauthenticatedDependencies
      .getIntegrityCalls(),
    0,
  );
  assert.equal(
    unauthenticatedRepository
      .getTransactionCalls(),
    0,
  );

  const integrityRepository =
    createRepository();

  const failedIntegrity =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      createDependencies({
        integrityVerified: false,
        repository:
          integrityRepository,
      }),
    );

  assert.equal(
    failedIntegrity.status,
    403,
  );
  assert.equal(
    integrityRepository
      .getTransactionCalls(),
    0,
  );

  const integrityFailure =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      createDependencies({
        integrityFailure: true,
      }),
    );

  const integrityFailureBody =
    await readJson(integrityFailure);

  assert.equal(
    integrityFailure.status,
    503,
  );
  assert.equal(
    JSON.stringify(
      integrityFailureBody,
    ).includes(
      "private-integrity-secret",
    ),
    false,
  );

  const repository =
    createRepository();

  const success =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      createDependencies({
        repository,
      }),
    );

  const successBody =
    await readJson(success);

  assert.equal(success.status, 200);
  assert.equal(successBody.ok, true);
  assert.equal(
    successBody.data.status,
    "recommendation_ready",
  );
  assert.equal(
    successBody.data.mode,
    "sandbox",
  );
  assert.equal(
    success.headers.get(
      "cache-control",
    ),
    "no-store, max-age=0",
  );
  assert.match(
    success.headers.get(
      "x-correlation-id",
    ),
    /^vsc_[a-f0-9]{20}$/,
  );
  assert.equal(
    repository.getEventCount(),
    1,
  );
  assert.equal(
    repository.getAuditCount(),
    1,
  );

  const crossTenantRepository =
    createRepository();

  const crossTenant =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        body: body({
          requestedTenantId:
            "tenant-b",
        }),
      }),
      createDependencies({
        repository:
          crossTenantRepository,
      }),
    );

  assert.equal(
    crossTenant.status,
    403,
  );
  assert.equal(
    crossTenantRepository
      .getTransactionCalls(),
    0,
  );

  const liveMode =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest({
        body: body({
          executionMode: "live",
        }),
      }),
      createDependencies(),
    );

  assert.equal(liveMode.status, 403);

  const rateLimitedRepository =
    createRepository();

  const rateLimited =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      createDependencies({
        repository:
          rateLimitedRepository,
        rateLimiter:
          createLimiter({
            allowed: false,
            retryAfterSeconds: 60,
          }),
      }),
    );

  assert.equal(
    rateLimited.status,
    429,
  );
  assert.equal(
    rateLimited.headers.get(
      "retry-after",
    ),
    "60",
  );
  assert.equal(
    rateLimitedRepository
      .getTransactionCalls(),
    0,
  );

  const internalFailure =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      createDependencies({
        repository: {
          async runInTransaction() {
            throw new Error(
              "DATABASE_PASSWORD=private-secret",
            );
          },
        },
      }),
    );

  const internalFailureBody =
    await readJson(internalFailure);

  assert.equal(
    internalFailure.status,
    500,
  );
  assert.equal(
    JSON.stringify(
      internalFailureBody,
    ).includes(
      "private-secret",
    ),
    false,
  );

  const replayRepository =
    createRepository();

  const replayDependencies =
    createDependencies({
      repository:
        replayRepository,
    });

  const first =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      replayDependencies,
    );

  const second =
    await handleCustomerVerticalSliceHttpRequest(
      createRequest(),
      replayDependencies,
    );

  const firstBody =
    await readJson(first);

  const secondBody =
    await readJson(second);

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(
    firstBody.data.outcome,
    "applied",
  );
  assert.equal(
    secondBody.data.outcome,
    "replayed",
  );
  assert.equal(
    replayRepository.getEventCount(),
    1,
  );
  assert.equal(
    replayRepository.getAuditCount(),
    1,
  );

  console.log(
    "DAY 746 TARGETED TESTS PASS (16/16)",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
