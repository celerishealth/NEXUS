const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day762-compiled",
);

const {
  createIdempotentSandboxWorkerCycleCommand,
  createSandboxWorkerCycleRequestDigest,
  IdempotentSandboxWorkerCycleCommandError,
} = require(
  path.join(
    compiledDirectory,
    "idempotentSandboxWorkerCycleCommand.js",
  ),
);

const {
  SandboxWorkerCycleCommandError,
} = require(
  path.join(
    compiledDirectory,
    "sandboxWorkerCycleCommand.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date("2026-07-11T06:00:00.000Z");

function baseActor(overrides = {}) {
  return {
    actorId: "owner-762",
    tenantId: "tenant-a",
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
    ...overrides,
  };
}

function baseRequest(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-762-0001",
    idempotencyKey: "idem-762-0001",
    batchSize: 2,
    requestedAt: "2026-07-11T06:00:00.000Z",
    executionMode: "sandbox",
    ...overrides,
  };
}

function baseResult(request, overrides = {}) {
  const requestDigest =
    createSandboxWorkerCycleRequestDigest(request);

  return {
    tenantId: request.tenantId,
    requestId: request.requestId,
    requestDigest,
    cycle: {
      tenantId: request.tenantId,
      recoveredLeaseCount: 0,
      claimedCount: 1,
      completedCount: 1,
      retryScheduledCount: 0,
      terminalFailedCount: 0,
      outcomes: [],
      ownerApprovalRequired: true,
      liveProviderExecution: "blocked",
      externalDelivery: "blocked",
      paymentExecution: "blocked",
      publicLaunch: "blocked",
    },
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...overrides,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createMemoryRepository(options = {}) {
  const records = new Map();
  const calls = {
    claim: [],
    complete: [],
    fail: [],
  };

  function keyOf(tenantId, idempotencyKey) {
    return `${tenantId}::${idempotencyKey}`;
  }

  const repository = {
    async claim(input) {
      calls.claim.push(clone(input));

      if (options.claim) {
        return options.claim(input, records, calls);
      }

      const key = keyOf(input.tenantId, input.idempotencyKey);
      const existing = records.get(key);

      if (!existing || existing.state === "failed") {
        const attempt = existing ? existing.attempt + 1 : 1;

        const record = {
          tenantId: input.tenantId,
          requestId: input.requestId,
          idempotencyKey: input.idempotencyKey,
          requestDigest: input.requestDigest,
          attempt,
          state: "in_progress",
          result: null,
        };

        records.set(key, record);

        return {
          status: "claimed",
          tenantId: record.tenantId,
          requestId: record.requestId,
          idempotencyKey: record.idempotencyKey,
          requestDigest: record.requestDigest,
          attempt: record.attempt,
          result: null,
        };
      }

      if (existing.requestDigest !== input.requestDigest) {
        return {
          status: "conflict",
          tenantId: existing.tenantId,
          requestId: existing.requestId,
          idempotencyKey: existing.idempotencyKey,
          requestDigest: existing.requestDigest,
          attempt: existing.attempt,
          result: null,
        };
      }

      if (existing.state === "in_progress") {
        return {
          status: "in_progress",
          tenantId: existing.tenantId,
          requestId: existing.requestId,
          idempotencyKey: existing.idempotencyKey,
          requestDigest: existing.requestDigest,
          attempt: existing.attempt,
          result: null,
        };
      }

      return {
        status: "replay",
        tenantId: existing.tenantId,
        requestId: existing.requestId,
        idempotencyKey: existing.idempotencyKey,
        requestDigest: existing.requestDigest,
        attempt: existing.attempt,
        result: clone(existing.result),
      };
    },

    async complete(input) {
      calls.complete.push(clone(input));

      if (options.complete) {
        return options.complete(input, records, calls);
      }

      const key = keyOf(input.tenantId, input.idempotencyKey);
      const existing = records.get(key);

      assert.ok(existing);
      assert.equal(existing.state, "in_progress");
      assert.equal(existing.requestDigest, input.requestDigest);

      existing.state = "completed";
      existing.result = clone(input.result);
    },

    async fail(input) {
      calls.fail.push(clone(input));

      if (options.fail) {
        return options.fail(input, records, calls);
      }

      const key = keyOf(input.tenantId, input.idempotencyKey);
      const existing = records.get(key);

      if (existing) {
        existing.state = "failed";
        existing.failureCode = input.failureCode;
      }
    },
  };

  return {
    repository,
    records,
    calls,
    keyOf,
  };
}

function makeHarness(options = {}) {
  const memory = createMemoryRepository(
    options.repositoryOptions || {},
  );

  const commandCalls = [];

  const command =
    options.command ||
    (async (actor, request) => {
      commandCalls.push({
        actor: clone(actor),
        request: clone(request),
      });

      return baseResult(request);
    });

  const execute = createIdempotentSandboxWorkerCycleCommand({
    tenantId: "tenant-a",
    command,
    repository: memory.repository,
    now: options.now || (() => new Date(fixedNow)),
  });

  return {
    execute,
    commandCalls,
    ...memory,
  };
}

async function expectCode(promise, expectedCode) {
  await assert.rejects(
    promise,
    (error) => {
      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

check("first request claims, executes and completes once", async () => {
  const harness = makeHarness();
  const request = baseRequest();

  const result = await harness.execute(baseActor(), request);

  assert.equal(result.requestDigest,
    createSandboxWorkerCycleRequestDigest(request));
  assert.equal(harness.commandCalls.length, 1);
  assert.equal(harness.calls.claim.length, 1);
  assert.equal(harness.calls.complete.length, 1);
  assert.equal(harness.calls.fail.length, 0);

  const stored = harness.records.get(
    harness.keyOf("tenant-a", "idem-762-0001"),
  );

  assert.equal(stored.state, "completed");
});

check("completed request replays without duplicate execution", async () => {
  const harness = makeHarness();
  const request = baseRequest();

  const first = await harness.execute(baseActor(), request);
  const second = await harness.execute(baseActor(), request);

  assert.deepEqual(second, first);
  assert.equal(harness.commandCalls.length, 1);
  assert.equal(harness.calls.claim.length, 2);
  assert.equal(harness.calls.complete.length, 1);
});

check("request digest is deterministic", async () => {
  const request = baseRequest();

  assert.equal(
    createSandboxWorkerCycleRequestDigest(request),
    createSandboxWorkerCycleRequestDigest(clone(request)),
  );
});

check("request digest changes when request binding changes", async () => {
  const first = baseRequest();
  const second = baseRequest({ batchSize: 3 });

  assert.notEqual(
    createSandboxWorkerCycleRequestDigest(first),
    createSandboxWorkerCycleRequestDigest(second),
  );
});

check("same idempotency key with different request is blocked", async () => {
  const harness = makeHarness();

  await harness.execute(baseActor(), baseRequest());

  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({
        requestId: "request-762-0002",
        batchSize: 3,
      }),
    ),
    "IDEMPOTENCY_CONFLICT",
  );

  assert.equal(harness.commandCalls.length, 1);
});

check("duplicate in-progress request is blocked", async () => {
  const request = baseRequest();
  const digest = createSandboxWorkerCycleRequestDigest(request);

  const harness = makeHarness();

  harness.records.set(
    harness.keyOf(request.tenantId, request.idempotencyKey),
    {
      tenantId: request.tenantId,
      requestId: request.requestId,
      idempotencyKey: request.idempotencyKey,
      requestDigest: digest,
      attempt: 1,
      state: "in_progress",
      result: null,
    },
  );

  await expectCode(
    harness.execute(baseActor(), request),
    "REQUEST_IN_PROGRESS",
  );

  assert.equal(harness.commandCalls.length, 0);
});

check("failed receipt permits controlled retry attempt", async () => {
  const request = baseRequest();
  const digest = createSandboxWorkerCycleRequestDigest(request);

  const harness = makeHarness();

  harness.records.set(
    harness.keyOf(request.tenantId, request.idempotencyKey),
    {
      tenantId: request.tenantId,
      requestId: request.requestId,
      idempotencyKey: request.idempotencyKey,
      requestDigest: digest,
      attempt: 1,
      state: "failed",
      result: null,
    },
  );

  await harness.execute(baseActor(), request);

  const stored = harness.records.get(
    harness.keyOf(request.tenantId, request.idempotencyKey),
  );

  assert.equal(stored.attempt, 2);
  assert.equal(stored.state, "completed");
  assert.equal(harness.commandCalls.length, 1);
});

check("unauthenticated actor is blocked before receipt claim", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor({ authenticated: false }),
      baseRequest(),
    ),
    "AUTHENTICATION_REQUIRED",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("non-owner actor is blocked before receipt claim", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor({ role: "operator" }),
      baseRequest(),
    ),
    "OWNER_ROLE_REQUIRED",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("missing owner approval is blocked before receipt claim", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor({ ownerApprovalGranted: false }),
      baseRequest(),
    ),
    "OWNER_APPROVAL_REQUIRED",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("cross-tenant actor is blocked before receipt claim", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor({ tenantId: "tenant-b" }),
      baseRequest(),
    ),
    "TENANT_MISMATCH",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("cross-tenant request is blocked before receipt claim", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ tenantId: "tenant-b" }),
    ),
    "TENANT_MISMATCH",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("non-sandbox execution is blocked before receipt claim", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ executionMode: "live" }),
    ),
    "SANDBOX_EXECUTION_REQUIRED",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("additional untrusted request fields are blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ externalDelivery: "allowed" }),
    ),
    "INVALID_REQUEST",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("missing request fields are blocked", async () => {
  const harness = makeHarness();
  const request = baseRequest();

  delete request.idempotencyKey;

  await expectCode(
    harness.execute(baseActor(), request),
    "INVALID_REQUEST",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("invalid request identifier is blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ requestId: "bad id" }),
    ),
    "INVALID_REQUEST",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("invalid idempotency key is blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ idempotencyKey: "short" }),
    ),
    "INVALID_REQUEST",
  );

  assert.equal(harness.calls.claim.length, 0);
});

check("receipt infrastructure failure is safely classified", async () => {
  const harness = makeHarness({
    repositoryOptions: {
      claim: async () => {
        throw new Error(
          "postgres password=raw-secret connection failed",
        );
      },
    },
  });

  await assert.rejects(
    harness.execute(baseActor(), baseRequest()),
    (error) => {
      assert.equal(error.code, "RECEIPT_UNAVAILABLE");
      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );
      return true;
    },
  );

  assert.equal(harness.commandCalls.length, 0);
});

check("malformed receipt status is blocked", async () => {
  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "unknown",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: input.requestDigest,
        attempt: 1,
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "RECEIPT_INVALID",
  );
});

check("claimed receipt with wrong tenant is blocked", async () => {
  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "claimed",
        tenantId: "tenant-b",
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: input.requestDigest,
        attempt: 1,
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "RECEIPT_INVALID",
  );

  assert.equal(harness.commandCalls.length, 0);
});

check("claimed receipt with wrong idempotency key is blocked", async () => {
  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "claimed",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: "idem-incorrect-762",
        requestDigest: input.requestDigest,
        attempt: 1,
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "RECEIPT_INVALID",
  );
});

check("claimed receipt with wrong digest is blocked", async () => {
  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "claimed",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: "a".repeat(64),
        attempt: 1,
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "RECEIPT_INVALID",
  );
});

check("replay receipt without stored result is blocked", async () => {
  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "replay",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: input.requestDigest,
        attempt: 1,
        result: null,
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "CYCLE_RESULT_INVALID",
  );

  assert.equal(harness.commandCalls.length, 0);
});

check("replay cannot remove owner approval requirement", async () => {
  const request = baseRequest();

  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "replay",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: input.requestDigest,
        attempt: 1,
        result: baseResult(request, {
          ownerApprovalRequired: false,
        }),
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), request),
    "CYCLE_RESULT_INVALID",
  );
});

check("replay cannot authorize live provider execution", async () => {
  const request = baseRequest();

  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "replay",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: input.requestDigest,
        attempt: 1,
        result: baseResult(request, {
          liveProviderExecution: "allowed",
        }),
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), request),
    "CYCLE_RESULT_INVALID",
  );
});

check("replay cannot authorize external delivery", async () => {
  const request = baseRequest();

  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "replay",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: input.requestDigest,
        attempt: 1,
        result: baseResult(request, {
          externalDelivery: "allowed",
        }),
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), request),
    "CYCLE_RESULT_INVALID",
  );
});

check("replay cycle tenant mismatch is blocked", async () => {
  const request = baseRequest();
  const result = baseResult(request);

  result.cycle.tenantId = "tenant-b";

  const harness = makeHarness({
    repositoryOptions: {
      claim: async (input) => ({
        status: "replay",
        tenantId: input.tenantId,
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        requestDigest: input.requestDigest,
        attempt: 1,
        result,
      }),
    },
  });

  await expectCode(
    harness.execute(baseActor(), request),
    "CYCLE_RESULT_INVALID",
  );
});

check("completion receipt failure blocks unsafe replay", async () => {
  const harness = makeHarness({
    repositoryOptions: {
      complete: async () => {
        throw new Error(
          "database write failed password=raw-secret",
        );
      },
    },
  });

  await assert.rejects(
    harness.execute(baseActor(), baseRequest()),
    (error) => {
      assert.equal(error.code, "RECEIPT_UNAVAILABLE");
      assert.doesNotMatch(
        error.message,
        /database|password|raw-secret/i,
      );
      return true;
    },
  );

  assert.equal(harness.commandCalls.length, 1);
  assert.equal(harness.calls.fail.length, 0);
});

check("classified command failure is recorded and preserved", async () => {
  const harness = makeHarness({
    command: async () => {
      throw new SandboxWorkerCycleCommandError(
        "REQUEST_EXPIRED",
        "Sandbox worker request has expired.",
      );
    },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "REQUEST_EXPIRED",
  );

  assert.equal(harness.calls.fail.length, 1);
  assert.equal(
    harness.calls.fail[0].failureCode,
    "REQUEST_EXPIRED",
  );
});

check("unknown command failure is safely classified", async () => {
  const harness = makeHarness({
    command: async () => {
      throw new Error(
        "provider secret=raw-secret network failure",
      );
    },
  });

  await assert.rejects(
    harness.execute(baseActor(), baseRequest()),
    (error) => {
      assert.ok(
        error instanceof
          IdempotentSandboxWorkerCycleCommandError,
      );
      assert.equal(error.code, "CYCLE_EXECUTION_FAILED");
      assert.doesNotMatch(
        error.message,
        /provider|secret|raw-secret|network/i,
      );
      return true;
    },
  );

  assert.equal(harness.calls.fail.length, 1);
  assert.equal(
    harness.calls.fail[0].failureCode,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("failure receipt error never overrides primary failure", async () => {
  const harness = makeHarness({
    command: async () => {
      throw new SandboxWorkerCycleCommandError(
        "OWNER_APPROVAL_REQUIRED",
        "Explicit owner approval is required.",
      );
    },
    repositoryOptions: {
      fail: async () => {
        throw new Error(
          "receipt database password=raw-secret",
        );
      },
    },
  });

  await assert.rejects(
    harness.execute(baseActor(), baseRequest()),
    (error) => {
      assert.equal(error.code, "OWNER_APPROVAL_REQUIRED");
      assert.doesNotMatch(
        error.message,
        /database|password|raw-secret/i,
      );
      return true;
    },
  );
});

(async () => {
  assert.equal(
    checks.length,
    30,
    `Expected 30 targeted checks, found ${checks.length}`,
  );

  let passed = 0;

  for (const item of checks) {
    try {
      await item.run();
      passed += 1;
      console.log(`PASS: ${item.name}`);
    } catch (error) {
      console.error(`FAIL: ${item.name}`);
      console.error(error);
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    `TARGETED TESTS: PASS (${passed}/${checks.length})`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
