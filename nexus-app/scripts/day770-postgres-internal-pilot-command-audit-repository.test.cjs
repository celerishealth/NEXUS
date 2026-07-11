const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledPath = path.join(
  process.cwd(),
  ".day770-compiled",
  "postgresInternalPilotCommandAuditRepository.js",
);

const {
  createInternalPilotCommandAuditRecordHash,
  createPostgresInternalPilotCommandAuditAppender,
  PostgresInternalPilotAuditError,
} = require(compiledPath);

const migrationPath = path.join(
  process.cwd(),
  "db",
  "migrations",
  "0770_internal_pilot_command_audit.sql",
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const digestA = "a".repeat(64);
const digestB = "b".repeat(64);
const zeroHash = "0".repeat(64);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function authorizedRecord(overrides = {}) {
  return {
    tenantId: "tenant-a",
    actorId: "owner-770",
    requestId: "request-770-0001",
    requestDigest: digestA,
    stage: "authorized",
    failureCode: null,
    occurredAt:
      "2026-07-11T14:00:00.000Z",
    ...overrides,
  };
}

function completedRecord(overrides = {}) {
  return {
    tenantId: "tenant-a",
    actorId: "owner-770",
    requestId: "request-770-0001",
    requestDigest: digestA,
    stage: "completed",
    failureCode: null,
    occurredAt:
      "2026-07-11T14:00:01.000Z",
    ...overrides,
  };
}

function failedRecord(overrides = {}) {
  return {
    tenantId: "tenant-a",
    actorId: "owner-770",
    requestId: "request-770-0001",
    requestDigest: digestA,
    stage: "failed",
    failureCode:
      "CYCLE_EXECUTION_FAILED",
    occurredAt:
      "2026-07-11T14:00:01.000Z",
    ...overrides,
  };
}

function createMemoryRuntime(options = {}) {
  const records = new Map();
  const queries = [];
  let transactionCount = 0;

  function keyOf(tenantId, requestId) {
    return `${tenantId}::${requestId}`;
  }

  const client = {
    async query(text, values = []) {
      queries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day770:([a-z-]+)/,
        ) || []
      )[1];

      if (
        options.failQueryMarker &&
        marker === options.failQueryMarker
      ) {
        throw new Error(
          "postgres password=raw-secret connection failed",
        );
      }

      if (marker === "audit-select") {
        if (options.overrideSelectResult) {
          return options.overrideSelectResult(
            text,
            values,
          );
        }

        const [tenantId, requestId] = values;
        const list =
          records.get(
            keyOf(tenantId, requestId),
          ) || [];

        const latest =
          list.length > 0
            ? list[list.length - 1]
            : null;

        return {
          rows: latest
            ? [clone(latest)]
            : [],
          rowCount: latest ? 1 : 0,
        };
      }

      if (marker === "audit-insert") {
        if (options.overrideInsertResult) {
          return options.overrideInsertResult(
            text,
            values,
          );
        }

        const [
          tenantId,
          requestId,
          sequenceNo,
          actorId,
          requestDigest,
          stage,
          failureCode,
          previousHash,
          recordHash,
          occurredAt,
        ] = values;

        const key = keyOf(
          tenantId,
          requestId,
        );

        const list =
          records.get(key) || [];

        if (
          list.some(
            (record) =>
              record.sequence_no ===
                sequenceNo ||
              record.stage === stage,
          )
        ) {
          throw new Error(
            "duplicate audit constraint",
          );
        }

        list.push({
          tenant_id: tenantId,
          request_id: requestId,
          sequence_no: sequenceNo,
          actor_id: actorId,
          request_digest:
            requestDigest,
          stage,
          failure_code: failureCode,
          previous_hash: previousHash,
          record_hash: recordHash,
          occurred_at: occurredAt,
        });

        records.set(key, list);

        return {
          rows: [
            {
              sequence_no: sequenceNo,
              record_hash: recordHash,
            },
          ],
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

  const appendAudit =
    createPostgresInternalPilotCommandAuditAppender({
      withTransaction,
    });

  return {
    appendAudit,
    records,
    queries,
    keyOf,
    getTransactionCount:
      () => transactionCount,
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
          PostgresInternalPilotAuditError,
      );

      assert.equal(
        error.code,
        expectedCode,
      );

      return true;
    },
  );
}

check("migration defines tenant-bound append-only primary key", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /PRIMARY KEY\s*\(\s*tenant_id\s*,\s*request_id\s*,\s*sequence_no\s*\)/i,
  );
});

check("migration prevents duplicate request stages", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /UNIQUE\s*\(\s*tenant_id\s*,\s*request_id\s*,\s*stage\s*\)/i,
  );
});

check("migration enforces authorization-first audit chain", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /sequence_no = 1[\s\S]*stage = 'authorized'/i,
  );

  assert.match(
    sql,
    /previous_hash\s*=\s*repeat\('0', 64\)/i,
  );
});

check("migration enforces terminal failure classification", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /stage = 'failed'[\s\S]*failure_code/i,
  );

  assert.match(
    sql,
    /stage IN \('authorized', 'completed'\)[\s\S]*failure_code IS NULL/i,
  );
});

check("invalid repository configuration is rejected", async () => {
  assert.throws(
    () =>
      createPostgresInternalPilotCommandAuditAppender(
        {},
      ),
    (error) => {
      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("authorization appends first immutable audit record", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "request-770-0001",
    ),
  );

  assert.equal(stored.length, 1);
  assert.equal(
    stored[0].sequence_no,
    1,
  );
  assert.equal(
    stored[0].stage,
    "authorized",
  );
  assert.equal(
    stored[0].previous_hash,
    zeroHash,
  );
});

check("completion appends second chained audit record", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await harness.appendAudit(
    completedRecord(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "request-770-0001",
    ),
  );

  assert.equal(stored.length, 2);
  assert.equal(
    stored[1].sequence_no,
    2,
  );
  assert.equal(
    stored[1].stage,
    "completed",
  );
  assert.equal(
    stored[1].previous_hash,
    stored[0].record_hash,
  );
});

check("failure appends classified terminal audit record", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await harness.appendAudit(
    failedRecord(),
  );

  const stored = harness.records.get(
    harness.keyOf(
      "tenant-a",
      "request-770-0001",
    ),
  );

  assert.equal(stored.length, 2);
  assert.equal(
    stored[1].stage,
    "failed",
  );
  assert.equal(
    stored[1].failure_code,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("completion without authorization is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      completedRecord(),
    ),
    "AUDIT_STATE_CONFLICT",
  );

  assert.equal(
    harness.records.size,
    0,
  );
});

check("failure without authorization is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      failedRecord(),
    ),
    "AUDIT_STATE_CONFLICT",
  );

  assert.equal(
    harness.records.size,
    0,
  );
});

check("duplicate authorization is blocked", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await expectCode(
    harness.appendAudit(
      authorizedRecord({
        occurredAt:
          "2026-07-11T14:00:01.000Z",
      }),
    ),
    "AUDIT_STATE_CONFLICT",
  );
});

check("event after completed terminal state is blocked", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await harness.appendAudit(
    completedRecord(),
  );

  await expectCode(
    harness.appendAudit(
      failedRecord({
        occurredAt:
          "2026-07-11T14:00:02.000Z",
      }),
    ),
    "AUDIT_STATE_CONFLICT",
  );
});

check("event after failed terminal state is blocked", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await harness.appendAudit(
    failedRecord(),
  );

  await expectCode(
    harness.appendAudit(
      completedRecord({
        occurredAt:
          "2026-07-11T14:00:02.000Z",
      }),
    ),
    "AUDIT_STATE_CONFLICT",
  );
});

check("request digest mutation is blocked", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await expectCode(
    harness.appendAudit(
      completedRecord({
        requestDigest: digestB,
      }),
    ),
    "AUDIT_STATE_CONFLICT",
  );
});

check("actor mutation is blocked", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await expectCode(
    harness.appendAudit(
      completedRecord({
        actorId: "owner-770-other",
      }),
    ),
    "AUDIT_STATE_CONFLICT",
  );
});

check("identical request identifiers remain tenant isolated", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  await harness.appendAudit(
    authorizedRecord({
      tenantId: "tenant-b",
      actorId: "owner-tenant-b",
    }),
  );

  assert.equal(
    harness.records.size,
    2,
  );
});

check("audit record hash is deterministic", async () => {
  const input = {
    tenantId: "tenant-a",
    requestId: "request-770-0001",
    sequenceNo: 1,
    actorId: "owner-770",
    requestDigest: digestA,
    stage: "authorized",
    failureCode: null,
    previousHash: zeroHash,
    occurredAt:
      "2026-07-11T14:00:00.000Z",
  };

  assert.equal(
    createInternalPilotCommandAuditRecordHash(
      input,
    ),
    createInternalPilotCommandAuditRecordHash(
      clone(input),
    ),
  );
});

check("audit hash changes when terminal stage changes", async () => {
  const base = {
    tenantId: "tenant-a",
    requestId: "request-770-0001",
    sequenceNo: 2,
    actorId: "owner-770",
    requestDigest: digestA,
    failureCode: null,
    previousHash: "c".repeat(64),
    occurredAt:
      "2026-07-11T14:00:01.000Z",
  };

  const completedHash =
    createInternalPilotCommandAuditRecordHash({
      ...base,
      stage: "completed",
    });

  const failedHash =
    createInternalPilotCommandAuditRecordHash({
      ...base,
      stage: "failed",
      failureCode:
        "CYCLE_EXECUTION_FAILED",
    });

  assert.notEqual(
    completedHash,
    failedHash,
  );
});

check("all audit queries contain tenant predicates or values", async () => {
  const harness = createMemoryRuntime();

  await harness.appendAudit(
    authorizedRecord(),
  );

  assert.match(
    harness.queries[0].text,
    /WHERE tenant_id = \$1/i,
  );

  assert.equal(
    harness.queries[0].values[0],
    "tenant-a",
  );

  assert.equal(
    harness.queries[1].values[0],
    "tenant-a",
  );
});

check("additional untrusted audit fields are blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit({
      ...authorizedRecord(),
      liveProviderExecution:
        "allowed",
    }),
    "INVALID_INPUT",
  );

  assert.equal(
    harness.queries.length,
    0,
  );
});

check("invalid tenant identifier is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      authorizedRecord({
        tenantId: "bad tenant",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("invalid request identifier is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      authorizedRecord({
        requestId: "bad id",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("invalid actor identifier is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      authorizedRecord({
        actorId: "bad actor",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("invalid request digest is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      authorizedRecord({
        requestDigest: "invalid",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("invalid audit timestamp is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      authorizedRecord({
        occurredAt: "not-a-date",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("completed event cannot contain failure code", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      completedRecord({
        failureCode:
          "CYCLE_EXECUTION_FAILED",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("failed event requires safe classification", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      failedRecord({
        failureCode: null,
      }),
    ),
    "INVALID_INPUT",
  );
});

check("unsafe raw failure detail is blocked", async () => {
  const harness = createMemoryRuntime();

  await expectCode(
    harness.appendAudit(
      failedRecord({
        failureCode:
          "postgres password=raw-secret",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("malformed latest audit row is blocked", async () => {
  const harness = createMemoryRuntime({
    overrideSelectResult: async () => ({
      rows: [
        {
          tenant_id: "tenant-a",
          request_id:
            "request-770-0001",
          sequence_no: 1,
          actor_id: "owner-770",
          request_digest: digestA,
          stage: "unknown",
          failure_code: null,
          record_hash:
            "c".repeat(64),
        },
      ],
      rowCount: 1,
    }),
  });

  await expectCode(
    harness.appendAudit(
      completedRecord(),
    ),
    "AUDIT_ROW_INVALID",
  );
});

check("malformed stored record hash is blocked", async () => {
  const harness = createMemoryRuntime({
    overrideSelectResult: async () => ({
      rows: [
        {
          tenant_id: "tenant-a",
          request_id:
            "request-770-0001",
          sequence_no: 1,
          actor_id: "owner-770",
          request_digest: digestA,
          stage: "authorized",
          failure_code: null,
          record_hash: "invalid",
        },
      ],
      rowCount: 1,
    }),
  });

  await expectCode(
    harness.appendAudit(
      completedRecord(),
    ),
    "AUDIT_ROW_INVALID",
  );
});

check("duplicate database rows are blocked", async () => {
  const row = {
    tenant_id: "tenant-a",
    request_id:
      "request-770-0001",
    sequence_no: 1,
    actor_id: "owner-770",
    request_digest: digestA,
    stage: "authorized",
    failure_code: null,
    record_hash:
      "c".repeat(64),
  };

  const harness = createMemoryRuntime({
    overrideSelectResult: async () => ({
      rows: [row, row],
      rowCount: 2,
    }),
  });

  await expectCode(
    harness.appendAudit(
      completedRecord(),
    ),
    "AUDIT_ROW_INVALID",
  );
});

check("invalid insert confirmation is blocked", async () => {
  const harness = createMemoryRuntime({
    overrideInsertResult:
      async () => ({
        rows: [
          {
            sequence_no: 99,
            record_hash:
              "d".repeat(64),
          },
        ],
        rowCount: 1,
      }),
  });

  await expectCode(
    harness.appendAudit(
      authorizedRecord(),
    ),
    "AUDIT_ROW_INVALID",
  );
});

check("audit query failure hides infrastructure details", async () => {
  const harness = createMemoryRuntime({
    failQueryMarker: "audit-select",
  });

  await assert.rejects(
    harness.appendAudit(
      authorizedRecord(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "AUDIT_QUERY_FAILED",
      );

      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );

      return true;
    },
  );
});

check("audit transaction failure hides infrastructure details", async () => {
  const harness = createMemoryRuntime({
    failTransaction: true,
  });

  await assert.rejects(
    harness.appendAudit(
      authorizedRecord(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "AUDIT_QUERY_FAILED",
      );

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
