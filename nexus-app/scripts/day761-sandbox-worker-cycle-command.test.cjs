const assert = require("node:assert/strict");
const path = require("node:path");

const compiledPath = path.join(
  process.cwd(),
  ".day761-compiled",
  "sandboxWorkerCycleCommand.js",
);

const {
  createAuthenticatedOwnerSandboxWorkerCommand,
  SandboxWorkerCycleCommandError,
} = require(compiledPath);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date("2026-07-11T05:00:00.000Z");

function baseCycleResult(overrides = {}) {
  return {
    tenantId: "tenant-a",
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
    ...overrides,
  };
}

function baseActor(overrides = {}) {
  return {
    actorId: "owner-761",
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
    requestId: "request-761-0001",
    idempotencyKey: "idem-761-0001",
    batchSize: 2,
    requestedAt: "2026-07-11T05:00:00.000Z",
    executionMode: "sandbox",
    ...overrides,
  };
}

function makeHarness(options = {}) {
  const audits = [];
  const calls = [];

  const runCycle =
    options.runCycle ||
    (async (poolInput, contextInput, cycleInput) => {
      calls.push({ poolInput, contextInput, cycleInput });
      return baseCycleResult(options.resultPatch);
    });

  const appendAudit =
    options.appendAudit ||
    (async (record) => {
      audits.push(record);
    });

  const execute = createAuthenticatedOwnerSandboxWorkerCommand({
    tenantId: "tenant-a",
    poolInput: { trustedPool: true },
    contextInput: { trustedContext: true },
    cycleInput: {
      registry: { recommendation: async () => ({}) },
      leaseOwner: "worker-761",
      leaseToken: "lease-token-761",
      leaseSeconds: 30,
      handlerTimeoutMilliseconds: 1000,
      retryDelaySeconds: 10,
      maxAttempts: 3,
    },
    maxBatchSize: 5,
    requestMaxAgeSeconds: 300,
    futureClockSkewSeconds: 30,
    appendAudit,
    now: options.now || (() => new Date(fixedNow)),
    runCycle,
  });

  return { execute, audits, calls };
}

async function expectCode(promise, expectedCode) {
  await assert.rejects(
    promise,
    (error) => {
      assert.ok(error instanceof SandboxWorkerCycleCommandError);
      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

check("authenticated owner executes bounded sandbox cycle", async () => {
  const harness = makeHarness();
  const result = await harness.execute(baseActor(), baseRequest());

  assert.equal(result.tenantId, "tenant-a");
  assert.equal(result.requestId, "request-761-0001");
  assert.match(result.requestDigest, /^[a-f0-9]{64}$/);
  assert.equal(result.ownerApprovalRequired, true);
  assert.equal(result.liveProviderExecution, "blocked");
  assert.equal(result.externalDelivery, "blocked");
  assert.equal(result.paymentExecution, "blocked");
  assert.equal(result.publicLaunch, "blocked");
  assert.equal(harness.calls.length, 1);
  assert.equal(harness.calls[0].cycleInput.batchSize, 2);
  assert.equal(harness.calls[0].cycleInput.maxAttempts, 3);
  assert.deepEqual(
    harness.audits.map((record) => record.stage),
    ["authorized", "completed"],
  );
});

check("request digest is deterministic", async () => {
  const first = makeHarness();
  const second = makeHarness();

  const firstResult = await first.execute(baseActor(), baseRequest());
  const secondResult = await second.execute(baseActor(), baseRequest());

  assert.equal(firstResult.requestDigest, secondResult.requestDigest);
});

check("request digest changes when bounded request changes", async () => {
  const first = makeHarness();
  const second = makeHarness();

  const firstResult = await first.execute(baseActor(), baseRequest());
  const secondResult = await second.execute(
    baseActor(),
    baseRequest({ batchSize: 3 }),
  );

  assert.notEqual(firstResult.requestDigest, secondResult.requestDigest);
});

check("additional untrusted request fields are blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ liveProviderExecution: true }),
    ),
    "INVALID_REQUEST",
  );
  assert.equal(harness.calls.length, 0);
});

check("missing exact request fields are blocked", async () => {
  const harness = makeHarness();
  const request = baseRequest();
  delete request.idempotencyKey;

  await expectCode(
    harness.execute(baseActor(), request),
    "INVALID_REQUEST",
  );
});

check("unauthenticated actor is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor({ authenticated: false }),
      baseRequest(),
    ),
    "AUTHENTICATION_REQUIRED",
  );
});

check("non-owner actor is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor({ role: "operator" }),
      baseRequest(),
    ),
    "OWNER_ROLE_REQUIRED",
  );
});

check("missing explicit owner approval is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor({ ownerApprovalGranted: false }),
      baseRequest(),
    ),
    "OWNER_APPROVAL_REQUIRED",
  );
});

check("cross-tenant actor is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor({ tenantId: "tenant-b" }),
      baseRequest(),
    ),
    "TENANT_MISMATCH",
  );
});

check("cross-tenant request is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ tenantId: "tenant-b" }),
    ),
    "TENANT_MISMATCH",
  );
});

check("non-sandbox execution mode is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ executionMode: "live" }),
    ),
    "SANDBOX_EXECUTION_REQUIRED",
  );
});

check("zero batch size is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ batchSize: 0 }),
    ),
    "BATCH_LIMIT_EXCEEDED",
  );
});

check("batch size above trusted maximum is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ batchSize: 6 }),
    ),
    "BATCH_LIMIT_EXCEEDED",
  );
});

check("fractional batch size is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ batchSize: 1.5 }),
    ),
    "BATCH_LIMIT_EXCEEDED",
  );
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
});

check("invalid request timestamp is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({ requestedAt: "not-a-date" }),
    ),
    "INVALID_REQUEST",
  );
});

check("expired request is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({
        requestedAt: "2026-07-11T04:54:59.000Z",
      }),
    ),
    "REQUEST_EXPIRED",
  );
});

check("request beyond future clock skew is blocked", async () => {
  const harness = makeHarness();
  await expectCode(
    harness.execute(
      baseActor(),
      baseRequest({
        requestedAt: "2026-07-11T05:00:31.000Z",
      }),
    ),
    "REQUEST_FROM_FUTURE",
  );
});

check("authorization audit failure blocks execution", async () => {
  const harness = makeHarness({
    appendAudit: async () => {
      throw new Error("database password=raw-secret");
    },
  });

  await assert.rejects(
    harness.execute(baseActor(), baseRequest()),
    (error) => {
      assert.equal(error.code, "AUDIT_UNAVAILABLE");
      assert.doesNotMatch(error.message, /database|password|raw-secret/i);
      return true;
    },
  );

  assert.equal(harness.calls.length, 0);
});

check("raw worker infrastructure errors are safely classified", async () => {
  const audits = [];
  const harness = makeHarness({
    appendAudit: async (record) => {
      audits.push(record);
    },
    runCycle: async () => {
      throw new Error(
        "postgres connection failed password=raw-secret",
      );
    },
  });

  await assert.rejects(
    harness.execute(baseActor(), baseRequest()),
    (error) => {
      assert.equal(error.code, "CYCLE_EXECUTION_FAILED");
      assert.doesNotMatch(
        error.message,
        /postgres|connection|password|raw-secret/i,
      );
      return true;
    },
  );

  assert.deepEqual(
    audits.map((record) => record.stage),
    ["authorized", "failed"],
  );
  assert.equal(
    audits[1].failureCode,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("cycle result tenant mismatch is blocked", async () => {
  const harness = makeHarness({
    resultPatch: { tenantId: "tenant-b" },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "CYCLE_RESULT_INVALID",
  );
});

check("cycle result cannot remove owner approval requirement", async () => {
  const harness = makeHarness({
    resultPatch: { ownerApprovalRequired: false },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "CYCLE_RESULT_INVALID",
  );
});

check("cycle result cannot authorize live provider execution", async () => {
  const harness = makeHarness({
    resultPatch: { liveProviderExecution: "allowed" },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "CYCLE_RESULT_INVALID",
  );
});

check("cycle result cannot authorize external delivery", async () => {
  const harness = makeHarness({
    resultPatch: { externalDelivery: "allowed" },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "CYCLE_RESULT_INVALID",
  );
});

check("cycle result cannot authorize payment execution", async () => {
  const harness = makeHarness({
    resultPatch: { paymentExecution: "allowed" },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "CYCLE_RESULT_INVALID",
  );
});

check("cycle result cannot authorize public launch", async () => {
  const harness = makeHarness({
    resultPatch: { publicLaunch: "allowed" },
  });

  await expectCode(
    harness.execute(baseActor(), baseRequest()),
    "CYCLE_RESULT_INVALID",
  );
});

(async () => {
  assert.equal(
    checks.length,
    27,
    `Expected 27 targeted checks, found ${checks.length}`,
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

  console.log(`TARGETED TESTS: PASS (${passed}/${checks.length})`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
