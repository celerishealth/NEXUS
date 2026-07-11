const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledPath = path.join(
  process.cwd(),
  ".day763-compiled",
  "postgresSandboxWorkerCommandReceiptRepository.js",
);

const {
  createPostgresSandboxWorkerCommandReceiptRepository,
  PostgresSandboxReceiptRepositoryError,
} = require(compiledPath);

const migrationPath = path.join(
  process.cwd(),
  "db",
  "migrations",
  "0763_sandbox_worker_command_receipts.sql",
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedTime = "2026-07-11T07:00:00.000Z";
const digestA = "a".repeat(64);
const digestB = "b".repeat(64);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseClaim(overrides = {}) {
  return {
    tenantId: "tenant-a",
    actorId: "owner-763",
    requestId: "request-763-0001",
    idempotencyKey: "idem-763-0001",
    requestDigest: digestA,
    occurredAt: fixedTime,
    ...overrides,
  };
}

function baseResult(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-763-0001",
    requestDigest: digestA,
    cycle: {
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
    },
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...overrides,
  };
}

function baseComplete(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-763-0001",
    idempotencyKey: "idem-763-0001",
    requestDigest: digestA,
    result: baseResult(),
    occurredAt: fixedTime,
    ...overrides,
  };
}

function baseFailure(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-763-0001",
    idempotencyKey: "idem-763-0001",
    requestDigest: digestA,
    failureCode: "CYCLE_EXECUTION_FAILED",
    occurredAt: fixedTime,
    ...overrides,
  };
}

function createMemoryRuntime(options = {}) {
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
        if (
          options.insertRowCount !== undefined
        ) {
          return {
            rows: [],
            rowCount: options.insertRowCount,
          };
        }

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
          return { rows: [], rowCount: 0 };
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

        if (options.dropAfterInsert) {
          records.delete(key);
        }

        return { rows: [], rowCount: 1 };
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
          rows: [{ attempt: row.attempt }],
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
          keyOf(tenantId, idempotencyKey),
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
          keyOf(tenantId, idempotencyKey),
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
        row.failure_code = failureCode;
        row.updated_at = occurredAt;

        return {
          rows: [],
          rowCount: 1,
        };
      }

      throw new Error(
        `Unknown query marker: ${marker}`,
      );
    },
  };

  const withTransaction = async (work) => {
    transactionCount += 1;

    if (options.failTransaction) {
      throw new Error(
        "database transaction password=raw-secret failed",
      );
    }

    return work(client);
  };

  const repository =
    createPostgresSandboxWorkerCommandReceiptRepository({
      withTransaction,
    });

  return {
    repository,
    records,
    queries,
    keyOf,
    getTransactionCount: () => transactionCount,
  };
}

async function expectCode(
  promise,
  expectedCode,
) {
  await assert.rejects(
    promise,
    (error) => {
      assert.ok(
        error instanceof
          PostgresSandboxReceiptRepositoryError,
      );
      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

check("migration defines tenant-isolated primary key", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /PRIMARY KEY\s*\(\s*tenant_id\s*,\s*idempotency_key\s*\)/i,
  );
});

check("migration defines tenant-scoped request uniqueness", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /UNIQUE\s*\(\s*tenant_id\s*,\s*request_id\s*\)/i,
  );
});

check("migration enforces protected receipt states", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /state IN \('in_progress', 'completed', 'failed'\)/,
  );
  assert.match(
    sql,
    /state = 'completed'[\s\S]*result_json IS NOT NULL/i,
  );
  assert.match(
    sql,
    /state = 'failed'[\s\S]*failure_code IS NOT NULL/i,
  );
});

check("first claim creates tenant-bound receipt", async () => {
  const harness = createMemoryRuntime();

  const receipt =
    await harness.repository.claim(
      baseClaim(),
    );

  assert.equal(receipt.status, "claimed");
  assert.equal(receipt.tenantId, "tenant-a");
  assert.equal(receipt.attempt, 1);
  assert.equal(
    harness.getTransactionCount(),
    1,
  );
});

check("duplicate active claim returns in-progress", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());

  const receipt =
    await harness.repository.claim(
      baseClaim(),
    );

  assert.equal(
    receipt.status,
    "in_progress",
  );
  assert.equal(receipt.attempt, 1);
});

check("completed receipt returns stored replay", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());
  await harness.repository.complete(
    baseComplete(),
  );

  const receipt =
    await harness.repository.claim(
      baseClaim(),
    );

  assert.equal(receipt.status, "replay");
  assert.deepEqual(
    receipt.result,
    baseResult(),
  );
});

check("same key with different digest returns conflict", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());

  const receipt =
    await harness.repository.claim(
      baseClaim({
        requestId: "request-763-0002",
        requestDigest: digestB,
      }),
    );

  assert.equal(receipt.status, "conflict");
  assert.equal(receipt.requestDigest, digestA);
});

check("same key with different request identifier returns conflict", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());

  const receipt =
    await harness.repository.claim(
      baseClaim({
        requestId: "request-763-0002",
      }),
    );

  assert.equal(receipt.status, "conflict");
});

check("failed receipt permits controlled retry", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());
  await harness.repository.fail(
    baseFailure(),
  );

  const receipt =
    await harness.repository.claim(
      baseClaim(),
    );

  assert.equal(receipt.status, "claimed");
  assert.equal(receipt.attempt, 2);

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-763-0001",
    ),
  );

  assert.equal(stored.state, "in_progress");
});

check("maximum attempt receipt blocks retry", async () => {
  const harness = createMemoryRuntime();

  harness.records.set(
    harness.keyOf(
      "tenant-a",
      "idem-763-0001",
    ),
    {
      tenant_id: "tenant-a",
      idempotency_key: "idem-763-0001",
      request_id: "request-763-0001",
      request_digest: digestA,
      actor_id: "owner-763",
      state: "failed",
      attempt: 100,
      result_json: null,
      failure_code:
        "CYCLE_EXECUTION_FAILED",
    },
  );

  await expectCode(
    harness.repository.claim(baseClaim()),
    "ATTEMPT_LIMIT_REACHED",
  );
});

check("identical keys remain isolated between tenants", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());

  const tenantBReceipt =
    await harness.repository.claim(
      baseClaim({
        tenantId: "tenant-b",
        actorId: "owner-tenant-b",
      }),
    );

  assert.equal(
    tenantBReceipt.status,
    "claimed",
  );
  assert.equal(
    harness.records.size,
    2,
  );
});

check("all receipt mutations include tenant predicates", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());
  await harness.repository.complete(
    baseComplete(),
  );

  const protectedQueries =
    harness.queries.filter(({ text }) =>
      /nexus-day763:(claim-select|claim-retry|complete|fail)/.test(
        text,
      ),
    );

  assert.ok(protectedQueries.length > 0);

  for (const query of protectedQueries) {
    assert.match(
      query.text,
      /WHERE tenant_id = \$\d+/,
    );
  }
});

check("malformed receipt state is blocked", async () => {
  const harness = createMemoryRuntime({
    overrideSelectRow: {
      tenant_id: "tenant-a",
      idempotency_key: "idem-763-0001",
      request_id: "request-763-0001",
      request_digest: digestA,
      state: "unknown",
      attempt: 1,
      result_json: null,
    },
  });

  await expectCode(
    harness.repository.claim(baseClaim()),
    "RECEIPT_INVALID",
  );
});

check("malformed receipt attempt is blocked", async () => {
  const harness = createMemoryRuntime({
    overrideSelectRow: {
      tenant_id: "tenant-a",
      idempotency_key: "idem-763-0001",
      request_id: "request-763-0001",
      request_digest: digestA,
      state: "in_progress",
      attempt: 0,
      result_json: null,
    },
  });

  await expectCode(
    harness.repository.claim(baseClaim()),
    "RECEIPT_INVALID",
  );
});

check("malformed stored digest is blocked", async () => {
  const harness = createMemoryRuntime({
    overrideSelectRow: {
      tenant_id: "tenant-a",
      idempotency_key: "idem-763-0001",
      request_id: "request-763-0001",
      request_digest: "invalid",
      state: "in_progress",
      attempt: 1,
      result_json: null,
    },
  });

  await expectCode(
    harness.repository.claim(baseClaim()),
    "INVALID_INPUT",
  );
});

check("completed receipt without result is blocked", async () => {
  const harness = createMemoryRuntime({
    overrideSelectRow: {
      tenant_id: "tenant-a",
      idempotency_key: "idem-763-0001",
      request_id: "request-763-0001",
      request_digest: digestA,
      state: "completed",
      attempt: 1,
      result_json: null,
    },
  });

  await expectCode(
    harness.repository.claim(baseClaim()),
    "RECEIPT_INVALID",
  );
});

check("unexpected insert row count is blocked", async () => {
  const harness = createMemoryRuntime({
    insertRowCount: 2,
  });

  await expectCode(
    harness.repository.claim(baseClaim()),
    "RECEIPT_INVALID",
  );
});

check("missing selected receipt is blocked", async () => {
  const harness = createMemoryRuntime({
    dropAfterInsert: true,
  });

  await expectCode(
    harness.repository.claim(baseClaim()),
    "RECEIPT_INVALID",
  );
});

check("claim query failure is safely classified", async () => {
  const harness = createMemoryRuntime({
    failQueryMarker: "claim-insert",
  });

  await assert.rejects(
    harness.repository.claim(baseClaim()),
    (error) => {
      assert.equal(
        error.code,
        "RECEIPT_QUERY_FAILED",
      );
      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );
      return true;
    },
  );
});

check("transaction failure is safely classified", async () => {
  const harness = createMemoryRuntime({
    failTransaction: true,
  });

  await assert.rejects(
    harness.repository.claim(baseClaim()),
    (error) => {
      assert.equal(
        error.code,
        "RECEIPT_QUERY_FAILED",
      );
      assert.doesNotMatch(
        error.message,
        /database|password|raw-secret/i,
      );
      return true;
    },
  );
});

check("completion stores protected result atomically", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());
  await harness.repository.complete(
    baseComplete(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-763-0001",
    ),
  );

  assert.equal(stored.state, "completed");
  assert.deepEqual(
    stored.result_json,
    baseResult(),
  );
  assert.equal(stored.failure_code, null);
});

check("completion with wrong tenant fails closed", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());

  await expectCode(
    harness.repository.complete(
      baseComplete({
        tenantId: "tenant-b",
        result: baseResult({
          tenantId: "tenant-b",
          cycle: {
            ...baseResult().cycle,
            tenantId: "tenant-b",
          },
        }),
      }),
    ),
    "RECEIPT_STATE_CONFLICT",
  );
});

check("completion with wrong digest fails closed", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());

  await expectCode(
    harness.repository.complete(
      baseComplete({
        requestDigest: digestB,
        result: baseResult({
          requestDigest: digestB,
        }),
      }),
    ),
    "RECEIPT_STATE_CONFLICT",
  );
});

check("completion result tenant tampering is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.repository.complete(
      baseComplete({
        result: baseResult({
          tenantId: "tenant-b",
        }),
      }),
    ),
    "INVALID_INPUT",
  );
});

check("completion cycle tenant tampering is blocked", async () => {
  const harness = createMemoryRuntime();
  const result = baseResult();

  result.cycle.tenantId = "tenant-b";

  await expectCode(
    harness.repository.complete(
      baseComplete({ result }),
    ),
    "INVALID_INPUT",
  );
});

check("completion cannot authorize live execution", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.repository.complete(
      baseComplete({
        result: baseResult({
          liveProviderExecution: "allowed",
        }),
      }),
    ),
    "INVALID_INPUT",
  );
});

check("completion cannot authorize external delivery", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.repository.complete(
      baseComplete({
        result: baseResult({
          externalDelivery: "allowed",
        }),
      }),
    ),
    "INVALID_INPUT",
  );
});

check("completion query failure hides infrastructure details", async () => {
  const harness = createMemoryRuntime({
    failQueryMarker: "complete",
  });

  await harness.repository.claim(baseClaim());

  await assert.rejects(
    harness.repository.complete(
      baseComplete(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "RECEIPT_QUERY_FAILED",
      );
      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );
      return true;
    },
  );
});

check("failure transition stores safe classification", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());
  await harness.repository.fail(
    baseFailure(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "idem-763-0001",
    ),
  );

  assert.equal(stored.state, "failed");
  assert.equal(
    stored.failure_code,
    "CYCLE_EXECUTION_FAILED",
  );
  assert.equal(stored.result_json, null);
});

check("failure transition with wrong tenant fails closed", async () => {
  const harness = createMemoryRuntime();

  await harness.repository.claim(baseClaim());

  await expectCode(
    harness.repository.fail(
      baseFailure({
        tenantId: "tenant-b",
      }),
    ),
    "RECEIPT_STATE_CONFLICT",
  );
});

check("unsafe failure classification is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.repository.fail(
      baseFailure({
        failureCode:
          "postgres password=raw-secret",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("failure query error hides infrastructure details", async () => {
  const harness = createMemoryRuntime({
    failQueryMarker: "fail",
  });

  await harness.repository.claim(baseClaim());

  await assert.rejects(
    harness.repository.fail(baseFailure()),
    (error) => {
      assert.equal(
        error.code,
        "RECEIPT_QUERY_FAILED",
      );
      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );
      return true;
    },
  );
});

check("additional claim fields are blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.repository.claim({
      ...baseClaim(),
      liveProviderExecution: "allowed",
    }),
    "INVALID_INPUT",
  );

  assert.equal(harness.queries.length, 0);
});

check("additional completion fields are blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.repository.complete({
      ...baseComplete(),
      externalDelivery: "allowed",
    }),
    "INVALID_INPUT",
  );

  assert.equal(harness.queries.length, 0);
});

check("additional failure fields are blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.repository.fail({
      ...baseFailure(),
      rawError: "secret",
    }),
    "INVALID_INPUT",
  );

  assert.equal(harness.queries.length, 0);
});

(async () => {
  assert.equal(
    checks.length,
    35,
    `Expected 35 targeted checks, found ${checks.length}`,
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
