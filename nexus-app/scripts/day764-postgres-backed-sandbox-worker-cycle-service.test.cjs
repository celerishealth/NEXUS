const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day764-compiled",
);

const {
  createPostgresBackedSandboxWorkerCycleService,
  PostgresBackedSandboxWorkerServiceError,
} = require(
  path.join(
    compiledDirectory,
    "postgresBackedSandboxWorkerCycleService.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T08:00:00.000Z",
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseActor(overrides = {}) {
  return {
    actorId: "owner-764",
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
    requestId: "request-764-0001",
    idempotencyKey: "idem-764-0001",
    batchSize: 2,
    requestedAt: "2026-07-11T08:00:00.000Z",
    executionMode: "sandbox",
    ...overrides,
  };
}

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

function createDatabase(options = {}) {
  const records = new Map();
  const queries = [];
  let transactionCount = 0;

  function keyOf(tenantId, idempotencyKey) {
    return `${tenantId}::${idempotencyKey}`;
  }

  const client = {
    async query(text, values = []) {
      queries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(/nexus-day763:([a-z-]+)/) || []
      )[1];

      if (
        options.failQueryMarker &&
        marker === options.failQueryMarker
      ) {
        throw new Error(
          "postgres connection password=raw-secret failed",
        );
      }

      if (marker === "claim-insert") {
        const [
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
          actorId,
          occurredAt,
        ] = values;

        const key = keyOf(
          tenantId,
          idempotencyKey,
        );

        if (records.has(key)) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        records.set(key, {
          tenant_id: tenantId,
          idempotency_key: idempotencyKey,
          request_id: requestId,
          request_digest: requestDigest,
          actor_id: actorId,
          state: "in_progress",
          attempt: 1,
          result_json: null,
          failure_code: null,
          created_at: occurredAt,
          updated_at: occurredAt,
        });

        return {
          rows: [],
          rowCount: 1,
        };
      }

      if (marker === "claim-select") {
        const [tenantId, idempotencyKey] =
          values;

        if (options.overrideSelectRow) {
          return {
            rows: [
              clone(options.overrideSelectRow),
            ],
            rowCount: 1,
          };
        }

        const row = records.get(
          keyOf(tenantId, idempotencyKey),
        );

        return {
          rows: row ? [clone(row)] : [],
          rowCount: row ? 1 : 0,
        };
      }

      if (marker === "claim-retry") {
        const [
          occurredAt,
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
        ] = values;

        const row = records.get(
          keyOf(tenantId, idempotencyKey),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !== requestDigest ||
          row.state !== "failed" ||
          row.attempt >= 100
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.state = "in_progress";
        row.attempt += 1;
        row.result_json = null;
        row.failure_code = null;
        row.updated_at = occurredAt;

        return {
          rows: [{ attempt: row.attempt }],
          rowCount: 1,
        };
      }

      if (marker === "complete") {
        if (options.completeRowCountZero) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        const [
          serializedResult,
          occurredAt,
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
        ] = values;

        const row = records.get(
          keyOf(tenantId, idempotencyKey),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !== requestDigest ||
          row.state !== "in_progress"
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.state = "completed";
        row.result_json =
          JSON.parse(serializedResult);
        row.failure_code = null;
        row.updated_at = occurredAt;

        return {
          rows: [],
          rowCount: 1,
        };
      }

      if (marker === "fail") {
        const [
          failureCode,
          occurredAt,
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
        ] = values;

        const row = records.get(
          keyOf(tenantId, idempotencyKey),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !== requestDigest ||
          row.state !== "in_progress"
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.state = "failed";
        row.result_json = null;
        row.failure_code = failureCode;
        row.updated_at = occurredAt;

        return {
          rows: [],
          rowCount: 1,
        };
      }

      throw new Error(
        `Unknown SQL marker: ${marker}`,
      );
    },
  };

  const withReceiptTransaction = async (work) => {
    transactionCount += 1;

    if (options.failTransaction) {
      throw new Error(
        "database transaction password=raw-secret failed",
      );
    }

    return work(client);
  };

  return {
    records,
    queries,
    keyOf,
    withReceiptTransaction,
    getTransactionCount: () => transactionCount,
  };
}

function makeHarness(options = {}) {
  const database = createDatabase(
    options.databaseOptions || {},
  );

  const audits = [];
  const cycleCalls = [];

  const appendAudit =
    options.appendAudit ||
    (async (record) => {
      audits.push(clone(record));
    });

  const runCycle =
    options.runCycle ||
    (async (poolInput, contextInput, cycleInput) => {
      cycleCalls.push({
        poolInput: clone(poolInput),
        contextInput: clone(contextInput),
        cycleInput: clone(cycleInput),
      });

      return baseCycleResult();
    });

  const service =
    createPostgresBackedSandboxWorkerCycleService({
      tenantId: "tenant-a",
      withReceiptTransaction:
        database.withReceiptTransaction,
      now: options.now || (() => new Date(fixedNow)),
      commandRuntime: {
        poolInput: {
          trustedPool: true,
        },
        contextInput: {
          trustedTenantContext: true,
        },
        cycleInput: {
          registry: {
            recommendation: async () => ({}),
          },
          leaseOwner: "worker-764",
          leaseToken: "lease-token-764",
          leaseSeconds: 30,
          handlerTimeoutMilliseconds: 1000,
          retryDelaySeconds: 10,
          maxAttempts: 3,
        },
        maxBatchSize: 5,
        requestMaxAgeSeconds: 300,
        futureClockSkewSeconds: 30,
        appendAudit,
        runCycle,
      },
    });

  return {
    service,
    audits,
    cycleCalls,
    ...database,
  };
}

async function expectCode(
  promise,
  expectedCode,
) {
  await assert.rejects(
    promise,
    (error) => {
      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

check("service rejects invalid runtime configuration", async () => {
  assert.throws(
    () =>
      createPostgresBackedSandboxWorkerCycleService({
        tenantId: "tenant-a",
        commandRuntime: {},
      }),
    (error) => {
      assert.ok(
        error instanceof
          PostgresBackedSandboxWorkerServiceError,
      );
      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );
      return true;
    },
  );
});

check("first owner request executes protected cycle", async () => {
  const harness = makeHarness();

  const result = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  assert.equal(result.tenantId, "tenant-a");
  assert.equal(result.requestId, "request-764-0001");
  assert.match(result.requestDigest, /^[a-f0-9]{64}$/);
  assert.equal(harness.cycleCalls.length, 1);
});

check("first execution stores completed postgres receipt", async () => {
  const harness = makeHarness();

  await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(stored.state, "completed");
  assert.ok(stored.result_json);
  assert.equal(
    stored.result_json.tenantId,
    "tenant-a",
  );
});

check("completed request replays stored result", async () => {
  const harness = makeHarness();

  const first = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  const second = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  assert.deepEqual(second, first);
});

check("completed replay prevents duplicate cycle execution", async () => {
  const harness = makeHarness();

  await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  assert.equal(harness.cycleCalls.length, 1);
});

check("request digest is bound to stored receipt", async () => {
  const harness = makeHarness();

  const result = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(
    stored.request_digest,
    result.requestDigest,
  );
  assert.equal(
    stored.result_json.requestDigest,
    result.requestDigest,
  );
});

check("same key with different request is blocked", async () => {
  const harness = makeHarness();

  await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest({
        requestId: "request-764-0002",
        batchSize: 3,
      }),
    ),
    "IDEMPOTENCY_CONFLICT",
  );

  assert.equal(harness.cycleCalls.length, 1);
});

check("in-progress duplicate request is blocked", async () => {
  const harness = makeHarness();

  harness.records.set(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
    {
      tenant_id: "tenant-a",
      idempotency_key: "idem-764-0001",
      request_id: "request-764-0001",
      request_digest:
        "f4430bd617d881d902cdf81a10757a9039bfaecf305c4dd7198fb7294b4ea470",
      actor_id: "owner-764",
      state: "in_progress",
      attempt: 1,
      result_json: null,
      failure_code: null,
    },
  );

  const firstClaim =
    await harness.service.execute(
      baseActor(),
      baseRequest(),
    ).catch((error) => error);

  assert.ok(
    firstClaim.code === "REQUEST_IN_PROGRESS" ||
      firstClaim.code === "IDEMPOTENCY_CONFLICT",
  );
  assert.equal(harness.cycleCalls.length, 0);
});

check("failed receipt permits controlled retry", async () => {
  const harness = makeHarness({
    runCycle: async () => {
      throw new Error(
        "temporary worker failure",
      );
    },
  });

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    "CYCLE_EXECUTION_FAILED",
  );

  const storedAfterFailure =
    harness.records.get(
      harness.keyOf(
        "tenant-a",
        "idem-764-0001",
      ),
    );

  assert.equal(
    storedAfterFailure.state,
    "failed",
  );

  const retryHarness = makeHarness();

  retryHarness.records.set(
    retryHarness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
    clone(storedAfterFailure),
  );

  await retryHarness.service.execute(
    baseActor(),
    baseRequest(),
  );

  const storedAfterRetry =
    retryHarness.records.get(
      retryHarness.keyOf(
        "tenant-a",
        "idem-764-0001",
      ),
    );

  assert.equal(storedAfterRetry.state, "completed");
  assert.equal(storedAfterRetry.attempt, 2);
});

check("unauthenticated actor is blocked before database access", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor({ authenticated: false }),
      baseRequest(),
    ),
    "AUTHENTICATION_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("non-owner actor is blocked before database access", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor({ role: "operator" }),
      baseRequest(),
    ),
    "OWNER_ROLE_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("missing owner approval is blocked before database access", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor({
        ownerApprovalGranted: false,
      }),
      baseRequest(),
    ),
    "OWNER_APPROVAL_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("cross-tenant actor is blocked before database access", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor({ tenantId: "tenant-b" }),
      baseRequest(),
    ),
    "TENANT_MISMATCH",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("cross-tenant request is blocked before database access", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest({ tenantId: "tenant-b" }),
    ),
    "TENANT_MISMATCH",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("non-sandbox execution is blocked before database access", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest({
        executionMode: "live",
      }),
    ),
    "SANDBOX_EXECUTION_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("expired request fails and receipt records classification", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest({
        requestedAt:
          "2026-07-11T07:54:59.000Z",
      }),
    ),
    "REQUEST_EXPIRED",
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "REQUEST_EXPIRED",
  );
});

check("future request fails and receipt records classification", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest({
        requestedAt:
          "2026-07-11T08:00:31.000Z",
      }),
    ),
    "REQUEST_FROM_FUTURE",
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "REQUEST_FROM_FUTURE",
  );
});

check("oversized batch fails and receipt records classification", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest({ batchSize: 6 }),
    ),
    "BATCH_LIMIT_EXCEEDED",
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "BATCH_LIMIT_EXCEEDED",
  );
});

check("authorization audit failure blocks cycle execution", async () => {
  const harness = makeHarness({
    appendAudit: async () => {
      throw new Error(
        "audit database password=raw-secret",
      );
    },
  });

  await assert.rejects(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "AUDIT_UNAVAILABLE",
      );
      assert.doesNotMatch(
        error.message,
        /database|password|raw-secret/i,
      );
      return true;
    },
  );

  assert.equal(harness.cycleCalls.length, 0);

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(stored.state, "failed");
});

check("successful execution records authorized and completed audit", async () => {
  const harness = makeHarness();

  await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  assert.deepEqual(
    harness.audits.map(
      (record) => record.stage,
    ),
    ["authorized", "completed"],
  );
});

check("raw cycle failure is safely classified and persisted", async () => {
  const harness = makeHarness({
    runCycle: async () => {
      throw new Error(
        "provider network secret=raw-secret",
      );
    },
  });

  await assert.rejects(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "CYCLE_EXECUTION_FAILED",
      );
      assert.doesNotMatch(
        error.message,
        /provider|network|secret|raw-secret/i,
      );
      return true;
    },
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("receipt claim database failure is safely classified", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failQueryMarker: "claim-insert",
    },
  });

  await assert.rejects(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "RECEIPT_UNAVAILABLE",
      );
      assert.doesNotMatch(
        error.message,
        /postgres|connection|password|raw-secret/i,
      );
      return true;
    },
  );

  assert.equal(harness.cycleCalls.length, 0);
});

check("receipt completion failure remains fail-closed", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failQueryMarker: "complete",
    },
  });

  await assert.rejects(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "RECEIPT_UNAVAILABLE",
      );
      assert.doesNotMatch(
        error.message,
        /postgres|connection|password|raw-secret/i,
      );
      return true;
    },
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  assert.equal(stored.state, "in_progress");
  assert.equal(harness.cycleCalls.length, 1);
});

check("malformed database receipt is blocked safely", async () => {
  const harness = makeHarness({
    databaseOptions: {
      overrideSelectRow: {
        tenant_id: "tenant-a",
        idempotency_key:
          "idem-764-0001",
        request_id: "request-764-0001",
        request_digest: "invalid",
        state: "completed",
        attempt: 1,
        result_json: null,
      },
    },
  });

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    "RECEIPT_UNAVAILABLE",
  );

  assert.equal(harness.cycleCalls.length, 0);
});

check("tampered replay owner approval boundary is blocked", async () => {
  const harness = makeHarness();

  const first = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  stored.result_json = {
    ...first,
    ownerApprovalRequired: false,
  };

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    "CYCLE_RESULT_INVALID",
  );

  assert.equal(harness.cycleCalls.length, 1);
});

check("tampered replay tenant binding is blocked", async () => {
  const harness = makeHarness();

  const first = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-764-0001",
    ),
  );

  stored.result_json = {
    ...first,
    tenantId: "tenant-b",
  };

  await expectCode(
    harness.service.execute(
      baseActor(),
      baseRequest(),
    ),
    "CYCLE_RESULT_INVALID",
  );
});

check("successful result keeps live provider execution blocked", async () => {
  const harness = makeHarness();

  const result = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  assert.equal(
    result.liveProviderExecution,
    "blocked",
  );
  assert.equal(
    result.cycle.liveProviderExecution,
    "blocked",
  );
});

check("successful result keeps delivery payment and launch blocked", async () => {
  const harness = makeHarness();

  const result = await harness.service.execute(
    baseActor(),
    baseRequest(),
  );

  assert.equal(
    result.externalDelivery,
    "blocked",
  );
  assert.equal(
    result.paymentExecution,
    "blocked",
  );
  assert.equal(
    result.publicLaunch,
    "blocked",
  );
  assert.equal(
    result.ownerApprovalRequired,
    true,
  );
});

(async () => {
  assert.equal(
    checks.length,
    28,
    `Expected 28 targeted checks, found ${checks.length}`,
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
