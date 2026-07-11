const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day769-compiled",
);

const {
  createPostgresBackedInternalPilotSandboxWorkerRoute,
  PostgresBackedInternalPilotRouteError,
} = require(
  path.join(
    compiledDirectory,
    "postgresBackedInternalPilotSandboxWorkerRoute.js",
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

const {
  createInternalPilotSessionTokenDigest,
} = require(
  path.join(
    compiledDirectory,
    "postgresInternalPilotSessionResolver.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T13:00:00.000Z",
);

const sessionToken =
  "session-token-769-abcdefghijklmnopqrstuvwxyz";

const csrfToken =
  "csrf-token-769-abcdefghijklmnopqrstuvwxyz";

const sessionDigest =
  createInternalPilotSessionTokenDigest(
    sessionToken,
  );

const csrfDigest =
  createInternalPilotCsrfDigest(
    csrfToken,
  );

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseSessionRow(overrides = {}) {
  return {
    tenant_id: "tenant-a",
    session_id: "session-769-0001",
    session_digest: sessionDigest,
    actor_id: "owner-769",
    role: "owner",
    owner_approval_granted: true,
    csrf_token_digest: csrfDigest,
    expires_at:
      "2026-07-11T14:00:00.000Z",
    ...overrides,
  };
}

function baseCommand(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-769-0001",
    idempotencyKey: "idem-769-0001",
    batchSize: 2,
    requestedAt:
      "2026-07-11T13:00:00.000Z",
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
      cookie:
        `theme=dark; nexus_internal_pilot_session=${sessionToken}; locale=en`,
      "content-type": "application/json",
      "x-nexus-internal-pilot":
        "sandbox-v1",
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

function createSessionDatabase(options = {}) {
  const queries = [];

  const sessionQuery = async (
    text,
    values = [],
  ) => {
    queries.push({
      text,
      values: clone(values),
    });

    if (options.fail) {
      throw new Error(
        "session postgres password=raw-secret connection failed",
      );
    }

    if (options.result) {
      return options.result(text, values);
    }

    return {
      rows: [
        baseSessionRow(
          options.rowOverrides || {},
        ),
      ],
      rowCount: 1,
    };
  };

  return {
    sessionQuery,
    sessionQueries: queries,
  };
}

function createReceiptDatabase(options = {}) {
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
        text.match(
          /nexus-day763:([a-z-]+)/,
        ) || []
      )[1];

      if (
        options.failQueryMarker &&
        marker === options.failQueryMarker
      ) {
        throw new Error(
          "receipt postgres password=raw-secret connection failed",
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
          idempotency_key:
            idempotencyKey,
          request_id: requestId,
          request_digest:
            requestDigest,
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
        const [
          tenantId,
          idempotencyKey,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        return {
          rows: row
            ? [clone(row)]
            : [],
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
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !==
            requestDigest ||
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
          rows: [
            {
              attempt: row.attempt,
            },
          ],
          rowCount: 1,
        };
      }

      if (marker === "complete") {
        const [
          serializedResult,
          occurredAt,
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !==
            requestDigest ||
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
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !==
            requestDigest ||
          row.state !== "in_progress"
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.state = "failed";
        row.result_json = null;
        row.failure_code =
          failureCode;
        row.updated_at = occurredAt;

        return {
          rows: [],
          rowCount: 1,
        };
      }

      throw new Error(
        `Unknown receipt SQL marker: ${marker}`,
      );
    },
  };

  const withReceiptTransaction =
    async (work) => {
      transactionCount += 1;

      if (options.failTransaction) {
        throw new Error(
          "receipt transaction password=raw-secret failed",
        );
      }

      return work(client);
    };

  return {
    records,
    receiptQueries: queries,
    keyOf,
    withReceiptTransaction,
    getTransactionCount:
      () => transactionCount,
  };
}

function makeHarness(options = {}) {
  const sessionDatabase =
    createSessionDatabase(
      options.sessionOptions || {},
    );

  const receiptDatabase =
    createReceiptDatabase(
      options.receiptOptions || {},
    );

  const audits = [];
  const cycleCalls = [];

  const appendAudit =
    options.appendAudit ||
    (async (record) => {
      audits.push(clone(record));
    });

  const runCycle =
    async (
      poolInput,
      contextInput,
      cycleInput,
    ) => {
      cycleCalls.push({
        poolInput: clone(poolInput),
        contextInput:
          clone(contextInput),
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

  const route =
    createPostgresBackedInternalPilotSandboxWorkerRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
      ],
      sessionQuery:
        sessionDatabase.sessionQuery,
      withReceiptTransaction:
        receiptDatabase.withReceiptTransaction,
      sessionCookieName:
        options.sessionCookieName,
      maxCookieHeaderBytes:
        options.maxCookieHeaderBytes,
      maxBodyBytes:
        options.maxBodyBytes ??
        16_384,
      now:
        options.now ||
        (() => new Date(fixedNow)),
      commandRuntime: {
        poolInput: {
          trustedPool: true,
        },
        contextInput: {
          trustedTenantContext: true,
        },
        cycleInput: {
          registry: {
            recommendation:
              async () => ({}),
          },
          leaseOwner: "worker-769",
          leaseToken:
            "lease-token-769",
          leaseSeconds: 30,
          handlerTimeoutMilliseconds:
            1000,
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
    ...sessionDatabase,
    ...receiptDatabase,
  };
}

check("invalid production route configuration is rejected", async () => {
  assert.throws(
    () =>
      createPostgresBackedInternalPilotSandboxWorkerRoute({
        tenantId: "tenant-a",
        allowedOrigins: [
          "https://pilot.nexus.test",
        ],
        commandRuntime: {},
      }),
    (error) => {
      assert.ok(
        error instanceof
          PostgresBackedInternalPilotRouteError,
      );

      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("valid request completes full Postgres-backed pilot route", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
});

check("session lookup uses tenant and credential digest", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.equal(
    harness.sessionQueries.length,
    1,
  );

  assert.equal(
    harness.sessionQueries[0].values[0],
    "tenant-a",
  );

  assert.equal(
    harness.sessionQueries[0].values[1],
    sessionDigest,
  );
});

check("trusted owner session executes sandbox cycle once", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.equal(
    harness.cycleCalls.length,
    1,
  );

  assert.equal(
    harness.cycleCalls[0]
      .cycleInput.batchSize,
    2,
  );
});

check("successful execution stores completed durable receipt", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-769-0001",
    ),
  );

  assert.equal(stored.state, "completed");

  assert.equal(
    stored.result_json.requestDigest,
    response.body.requestDigest,
  );
});

check("successful execution records authorized and completed audit", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.deepEqual(
    harness.audits.map(
      (record) => record.stage,
    ),
    ["authorized", "completed"],
  );
});

check("completed command replays identical durable result", async () => {
  const harness = makeHarness();

  const first = await harness.route(
    baseRequest(),
  );

  const second = await harness.route(
    baseRequest(),
  );

  assert.deepEqual(
    second.body,
    first.body,
  );
});

check("durable replay prevents duplicate worker execution", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());
  await harness.route(baseRequest());

  assert.equal(
    harness.cycleCalls.length,
    1,
  );
});

check("changed request with reused key is blocked", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  const changedCommand = baseCommand({
    requestId:
      "request-769-0002",
    batchSize: 3,
  });

  const response = await harness.route(
    baseRequest(changedCommand),
  );

  assert.equal(response.status, 409);

  assert.equal(
    response.body.error.code,
    "IDEMPOTENCY_CONFLICT",
  );

  assert.equal(
    harness.cycleCalls.length,
    1,
  );
});

check("missing session cookie is blocked before database receipt access", async () => {
  const request = baseRequest();

  delete request.headers.cookie;

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 401);

  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("malformed session credential is blocked before session query", async () => {
  const request = baseRequest();

  request.headers.cookie =
    "nexus_internal_pilot_session=short";

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 401);

  assert.equal(
    harness.sessionQueries.length,
    0,
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("unknown database session is blocked", async () => {
  const harness = makeHarness({
    sessionOptions: {
      result: async () => ({
        rows: [],
        rowCount: 0,
      }),
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 401);

  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("operator database session is blocked", async () => {
  const harness = makeHarness({
    sessionOptions: {
      rowOverrides: {
        role: "operator",
      },
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 403);

  assert.equal(
    response.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("unapproved database owner session is blocked", async () => {
  const harness = makeHarness({
    sessionOptions: {
      rowOverrides: {
        owner_approval_granted:
          false,
      },
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 403);

  assert.equal(
    response.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("cross-tenant database session row fails closed", async () => {
  const harness = makeHarness({
    sessionOptions: {
      rowOverrides: {
        tenant_id: "tenant-b",
      },
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);

  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_UNAVAILABLE",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("expired or revoked session lookup result is blocked", async () => {
  const harness = makeHarness({
    sessionOptions: {
      result: async () => ({
        rows: [],
        rowCount: 0,
      }),
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 401);
  assert.equal(
    harness.cycleCalls.length,
    0,
  );
});

check("session database failure is safely classified", async () => {
  const harness = makeHarness({
    sessionOptions: {
      fail: true,
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);

  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_UNAVAILABLE",
  );

  assert.doesNotMatch(
    response.body.error.message,
    /postgres|password|raw-secret|connection/i,
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("untrusted origin is blocked before session database access", async () => {
  const request = baseRequest();

  request.headers.origin =
    "https://attacker.example";

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 403);

  assert.equal(
    response.body.error.code,
    "ORIGIN_NOT_ALLOWED",
  );

  assert.equal(
    harness.sessionQueries.length,
    0,
  );
});

check("client-forged identity header is blocked", async () => {
  const request = baseRequest();

  request.headers[
    "x-nexus-tenant-id"
  ] = "tenant-b";

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 400);

  assert.equal(
    response.body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );

  assert.equal(
    harness.sessionQueries.length,
    0,
  );
});

check("missing CSRF token is blocked before receipt access", async () => {
  const request = baseRequest();

  delete request.headers[
    "x-nexus-csrf-token"
  ];

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 403);

  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_REQUIRED",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("mismatched CSRF token is blocked before receipt access", async () => {
  const request = baseRequest();

  request.headers[
    "x-nexus-csrf-token"
  ] =
    "csrf-token-769-different-abcdefghijklmnop";

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 403);

  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_INVALID",
  );

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
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

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("live command execution request is blocked", async () => {
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

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("oversized command body is blocked", async () => {
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

  assert.equal(
    harness.getTransactionCount(),
    0,
  );
});

check("audit failure is fail-closed and persisted", async () => {
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

  assert.equal(
    harness.cycleCalls.length,
    0,
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-769-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "AUDIT_UNAVAILABLE",
  );
});

check("receipt claim failure is fail-closed", async () => {
  const harness = makeHarness({
    receiptOptions: {
      failQueryMarker:
        "claim-insert",
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

  assert.equal(
    harness.cycleCalls.length,
    0,
  );
});

check("raw sandbox cycle failure is safely persisted", async () => {
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
      "idem-769-0001",
    ),
  );

  assert.equal(stored.state, "failed");

  assert.equal(
    stored.failure_code,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("receipt completion failure remains fail-closed", async () => {
  const harness = makeHarness({
    receiptOptions: {
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
      "idem-769-0001",
    ),
  );

  assert.equal(
    stored.state,
    "in_progress",
  );

  assert.equal(
    harness.cycleCalls.length,
    1,
  );
});

check("raw session token is never sent to database", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  const serializedValues =
    JSON.stringify(
      harness.sessionQueries[0].values,
    );

  assert.doesNotMatch(
    serializedValues,
    new RegExp(sessionToken),
  );

  assert.match(
    serializedValues,
    new RegExp(sessionDigest),
  );
});

check("production route returns strict security headers", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(
    response.headers[
      "cache-control"
    ],
    "no-store",
  );

  assert.equal(
    response.headers[
      "x-content-type-options"
    ],
    "nosniff",
  );

  assert.equal(
    response.headers[
      "content-security-policy"
    ],
    "default-src 'none'; frame-ancestors 'none'",
  );

  assert.equal(
    response.headers[
      "referrer-policy"
    ],
    "no-referrer",
  );
});

check("successful route preserves every sandbox safety boundary", async () => {
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

check("custom secure session cookie name is supported", async () => {
  const customCookieName =
    "nexus_pilot_custom";

  const harness = makeHarness({
    sessionCookieName:
      customCookieName,
  });

  const request = baseRequest();

  request.headers.cookie =
    `${customCookieName}=${sessionToken}`;

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
});

(async () => {
  assert.equal(
    checks.length,
    32,
    `Expected 32 targeted checks, found ${checks.length}`,
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
