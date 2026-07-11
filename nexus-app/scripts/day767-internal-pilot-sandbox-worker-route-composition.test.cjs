const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day767-compiled",
);

const {
  createInternalPilotSandboxWorkerRouteComposition,
  InternalPilotRouteCompositionError,
} = require(
  path.join(
    compiledDirectory,
    "internalPilotSandboxWorkerRouteComposition.js",
  ),
);

const {
  createInternalPilotCsrfDigest,
} = require(
  path.join(
    compiledDirectory,
    "internalPilotSandboxWorkerRoute.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T11:00:00.000Z",
);

const csrfToken =
  "csrf-token-767-abcdefghijklmnopqrstuvwxyz";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseSession(overrides = {}) {
  return {
    sessionId: "session-767-0001",
    actorId: "owner-767",
    tenantId: "tenant-a",
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
    csrfTokenDigest:
      createInternalPilotCsrfDigest(csrfToken),
    expiresAt: "2026-07-11T12:00:00.000Z",
    ...overrides,
  };
}

function baseCommand(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-767-0001",
    idempotencyKey: "idem-767-0001",
    batchSize: 2,
    requestedAt: "2026-07-11T11:00:00.000Z",
    executionMode: "sandbox",
    ...overrides,
  };
}

function baseRequest(
  command = baseCommand(),
  overrides = {},
) {
  return {
    method: "POST",
    headers: {
      origin: "https://pilot.nexus.test",
      "content-type": "application/json",
      "x-nexus-internal-pilot": "sandbox-v1",
      "x-nexus-idempotency-key":
        command.idempotencyKey,
      "x-nexus-csrf-token": csrfToken,
    },
    bodyText: JSON.stringify(command),
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
          "postgres password=raw-secret connection failed",
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
        if (options.failCompletionState) {
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
  const sessionCalls = [];

  const appendAudit =
    options.appendAudit ||
    (async (record) => {
      audits.push(clone(record));
    });

  const runCycle =
    async (poolInput, contextInput, cycleInput) => {
      cycleCalls.push({
        poolInput: clone(poolInput),
        contextInput: clone(contextInput),
        cycleInput: clone(cycleInput),
      });

      if (options.runCycle) {
        return options.runCycle(
          poolInput,
          contextInput,
          cycleInput,
        );
      }

      return baseCycleResult();
    };

  const resolveSession =
    options.resolveSession ||
    (async (request) => {
      sessionCalls.push(clone(request));
      return baseSession();
    });

  const route =
    createInternalPilotSandboxWorkerRouteComposition({
      tenantId: "tenant-a",
      allowedOrigins:
        options.allowedOrigins || [
          "https://pilot.nexus.test",
        ],
      resolveSession,
      withReceiptTransaction:
        database.withReceiptTransaction,
      maxBodyBytes:
        options.maxBodyBytes ?? 16_384,
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
          leaseOwner: "worker-767",
          leaseToken: "lease-token-767",
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
    route,
    audits,
    cycleCalls,
    sessionCalls,
    ...database,
  };
}

check("invalid composition configuration is rejected", async () => {
  assert.throws(
    () =>
      createInternalPilotSandboxWorkerRouteComposition({
        tenantId: "tenant-a",
        allowedOrigins: [
          "https://pilot.nexus.test",
        ],
        resolveSession: async () => null,
        commandRuntime: {},
      }),
    (error) => {
      assert.ok(
        error instanceof
          InternalPilotRouteCompositionError,
      );
      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );
      return true;
    },
  );
});

check("valid internal pilot request completes full route chain", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
});

check("full route chain executes sandbox cycle once", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.equal(harness.cycleCalls.length, 1);
  assert.equal(
    harness.cycleCalls[0].cycleInput.batchSize,
    2,
  );
});

check("successful route stores durable completed receipt", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-767-0001",
    ),
  );

  assert.equal(stored.state, "completed");
  assert.equal(
    stored.result_json.requestDigest,
    response.body.requestDigest,
  );
});

check("successful route records authorization and completion audit", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.deepEqual(
    harness.audits.map(
      (record) => record.stage,
    ),
    ["authorized", "completed"],
  );
});

check("completed request replays identical stored response", async () => {
  const harness = makeHarness();

  const first = await harness.route(
    baseRequest(),
  );

  const second = await harness.route(
    baseRequest(),
  );

  assert.deepEqual(second.body, first.body);
});

check("completed replay blocks duplicate cycle execution", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());
  await harness.route(baseRequest());

  assert.equal(harness.cycleCalls.length, 1);
});

check("same idempotency key with changed request is blocked", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  const changed = baseCommand({
    requestId: "request-767-0002",
    batchSize: 3,
  });

  const response = await harness.route(
    baseRequest(changed),
  );

  assert.equal(response.status, 409);
  assert.equal(
    response.body.error.code,
    "IDEMPOTENCY_CONFLICT",
  );
  assert.equal(harness.cycleCalls.length, 1);
});

check("in-progress durable receipt blocks duplicate execution", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failCompletionState: true,
    },
  });

  const first = await harness.route(
    baseRequest(),
  );

  assert.equal(first.status, 503);

  const second = await harness.route(
    baseRequest(),
  );

  assert.equal(second.status, 409);
  assert.equal(
    second.body.error.code,
    "REQUEST_IN_PROGRESS",
  );
  assert.equal(harness.cycleCalls.length, 1);
});

check("failed durable receipt permits controlled retry", async () => {
  let shouldFail = true;

  const harness = makeHarness({
    runCycle: async () => {
      if (shouldFail) {
        shouldFail = false;
        throw new Error(
          "temporary worker secret=raw-secret",
        );
      }

      return baseCycleResult();
    },
  });

  const first = await harness.route(
    baseRequest(),
  );

  assert.equal(first.status, 503);

  const failed = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-767-0001",
    ),
  );

  assert.equal(failed.state, "failed");

  const second = await harness.route(
    baseRequest(),
  );

  assert.equal(second.status, 200);

  const completed = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-767-0001",
    ),
  );

  assert.equal(completed.state, "completed");
  assert.equal(completed.attempt, 2);
});

check("missing trusted origin is blocked before session resolution", async () => {
  const request = baseRequest();
  delete request.headers.origin;

  const harness = makeHarness();
  const response = await harness.route(request);

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "ORIGIN_REQUIRED",
  );
  assert.equal(harness.sessionCalls.length, 0);
});

check("untrusted origin is blocked before session resolution", async () => {
  const request = baseRequest();

  request.headers.origin =
    "https://attacker.example";

  const harness = makeHarness();
  const response = await harness.route(request);

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "ORIGIN_NOT_ALLOWED",
  );
  assert.equal(harness.sessionCalls.length, 0);
});

check("client-forged tenant identity is blocked", async () => {
  const request = baseRequest();

  request.headers["x-nexus-tenant-id"] =
    "tenant-b";

  const harness = makeHarness();
  const response = await harness.route(request);

  assert.equal(response.status, 400);
  assert.equal(
    response.body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("missing trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () => null,
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 401);
  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("non-owner session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({ role: "operator" }),
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("session without owner approval is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({
        ownerApprovalGranted: false,
      }),
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("cross-tenant trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({ tenantId: "tenant-b" }),
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "TENANT_MISMATCH",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("expired trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({
        expiresAt:
          "2026-07-11T11:00:00.000Z",
      }),
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 401);
  assert.equal(
    response.body.error.code,
    "SESSION_EXPIRED",
  );
});

check("missing CSRF token is blocked", async () => {
  const request = baseRequest();

  delete request.headers[
    "x-nexus-csrf-token"
  ];

  const harness = makeHarness();
  const response = await harness.route(request);

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_REQUIRED",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("mismatched CSRF token is blocked", async () => {
  const request = baseRequest();

  request.headers["x-nexus-csrf-token"] =
    "csrf-token-767-different-abcdefghijklmnop";

  const harness = makeHarness();
  const response = await harness.route(request);

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_INVALID",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("cross-tenant command request is blocked", async () => {
  const command = baseCommand({
    tenantId: "tenant-b",
  });

  const harness = makeHarness();
  const response = await harness.route(
    baseRequest(command),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "TENANT_MISMATCH",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("live execution command request is blocked", async () => {
  const command = baseCommand({
    executionMode: "live",
  });

  const harness = makeHarness();
  const response = await harness.route(
    baseRequest(command),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "SANDBOX_EXECUTION_REQUIRED",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("oversized internal pilot body is blocked", async () => {
  const command = baseCommand({
    requestId:
      `request-${"x".repeat(1200)}`,
  });

  const harness = makeHarness({
    maxBodyBytes: 1024,
  });

  const response = await harness.route(
    baseRequest(command),
  );

  assert.equal(response.status, 413);
  assert.equal(
    response.body.error.code,
    "REQUEST_TOO_LARGE",
  );
  assert.equal(harness.getTransactionCount(), 0);
});

check("audit infrastructure failure is fail-closed and persisted", async () => {
  const harness = makeHarness({
    appendAudit: async () => {
      throw new Error(
        "audit database password=raw-secret",
      );
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "AUDIT_UNAVAILABLE",
  );
  assert.equal(harness.cycleCalls.length, 0);

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-767-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "AUDIT_UNAVAILABLE",
  );
});

check("receipt claim failure is fail-closed before cycle execution", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failQueryMarker: "claim-insert",
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "RECEIPT_UNAVAILABLE",
  );
  assert.equal(harness.cycleCalls.length, 0);
});

check("raw cycle failure is safely classified and persisted", async () => {
  const harness = makeHarness({
    runCycle: async () => {
      throw new Error(
        "provider network secret=raw-secret",
      );
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "CYCLE_EXECUTION_FAILED",
  );

  assert.doesNotMatch(
    response.body.error.message,
    /provider|network|secret|raw-secret/i,
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-767-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("invalid cycle tenant result is blocked and persisted", async () => {
  const harness = makeHarness({
    runCycle: async () =>
      baseCycleResult({
        tenantId: "tenant-b",
      }),
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "CYCLE_RESULT_INVALID",
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-767-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "CYCLE_RESULT_INVALID",
  );
});

check("receipt completion failure remains fail-closed", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failQueryMarker: "complete",
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "RECEIPT_UNAVAILABLE",
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-767-0001",
    ),
  );

  assert.equal(stored.state, "in_progress");
  assert.equal(harness.cycleCalls.length, 1);
});

check("route response keeps strict security headers", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(
    response.headers["cache-control"],
    "no-store",
  );

  assert.equal(
    response.headers["x-content-type-options"],
    "nosniff",
  );

  assert.equal(
    response.headers["content-security-policy"],
    "default-src 'none'; frame-ancestors 'none'",
  );

  assert.equal(
    response.headers["referrer-policy"],
    "no-referrer",
  );
});

check("successful route keeps all execution boundaries blocked", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(
    response.body.ownerApprovalRequired,
    true,
  );

  assert.equal(
    response.body.liveProviderExecution,
    "blocked",
  );

  assert.equal(
    response.body.externalDelivery,
    "blocked",
  );

  assert.equal(
    response.body.paymentExecution,
    "blocked",
  );

  assert.equal(
    response.body.publicLaunch,
    "blocked",
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
