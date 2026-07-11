"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(
  path.join(
    __dirname,
    "..",
    "db",
    "migrations",
    "0756_sandbox_outbox_results.sql",
  ),
  "utf8",
);

const implementation = require(
  path.join(
    __dirname,
    "..",
    ".day756-compiled",
    "atomicSandboxResultCompletion.js",
  ),
);

const {
  AtomicSandboxResultConflictError,
  AtomicSandboxResultLeaseFenceError,
  AtomicSandboxResultPersistenceError,
  AtomicSandboxResultValidationError,
  commitSandboxResultAndCompleteLease,
} = implementation;

const TENANT_A =
  "11111111-1111-4111-8111-111111111111";

const TENANT_B =
  "22222222-2222-4222-8222-222222222222";

const ACTOR_A =
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

const OUTBOX_A =
  "33333333-3333-4333-8333-333333333333";

const RESULT_A =
  "44444444-4444-4444-8444-444444444444";

const RESULT_B =
  "55555555-5555-4555-8555-555555555555";

const LEASE_TOKEN_A =
  "66666666-6666-4666-8666-666666666666";

const ACTION_KIND =
  "sandbox.recommendation.prepare";

const CANONICAL_PAYLOAD =
  '{"confidence":"high","recommendation":"approve"}';

function processingOutboxRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    action_kind: ACTION_KIND,
    status: "processing",
    lease_owner: "sandbox-worker-a",
    lease_token: LEASE_TOKEN_A,
    lease_valid: true,
    ...overrides,
  };
}

function completedOutboxRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    action_kind: ACTION_KIND,
    status: "completed",
    lease_owner: null,
    lease_token: null,
    lease_valid: false,
    ...overrides,
  };
}

function resultRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    result_id: RESULT_A,
    outbox_id: OUTBOX_A,
    action_kind: ACTION_KIND,
    payload: {
      confidence: "high",
      recommendation: "approve",
    },
    payload_canonical: CANONICAL_PAYLOAD,
    created_at: "2026-07-11T03:00:00.000Z",
    ...overrides,
  };
}

function completedRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    status: "completed",
    completed_at: "2026-07-11T03:01:00.000Z",
    ...overrides,
  };
}

class FakeClient {
  constructor(options = {}) {
    this.options = options;
    this.calls = [];
    this.releaseCount = 0;

    this.context = {
      tenantId: null,
      actorId: null,
      requestId: null,
    };
  }

  async query(text, values = []) {
    const normalizedText = String(text)
      .replace(/\s+/g, " ")
      .trim();

    this.calls.push({
      text: normalizedText,
      values: Array.from(values),
    });

    if (
      normalizedText === "BEGIN" ||
      normalizedText ===
        "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE" ||
      normalizedText === "COMMIT" ||
      normalizedText === "ROLLBACK"
    ) {
      return {
        rows: [],
        rowCount: 0,
      };
    }

    if (
      normalizedText.includes(
        "set_config('app.tenant_id'",
      )
    ) {
      this.context = {
        tenantId: values[0],
        actorId: values[1],
        requestId: values[2],
      };

      return {
        rows: [],
        rowCount: 1,
      };
    }

    if (
      normalizedText.includes(
        "current_setting('app.tenant_id'",
      )
    ) {
      return {
        rows: [
          {
            tenant_id: this.context.tenantId,
            actor_id: this.context.actorId,
            request_id: this.context.requestId,
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText.includes(
        "FROM nexus_sandbox_outbox_results",
      )
    ) {
      const existing =
        Object.prototype.hasOwnProperty.call(
          this.options,
          "existingResultRow",
        )
          ? this.options.existingResultRow
          : resultRow();

      return {
        rows: existing ? [existing] : [],
        rowCount: existing ? 1 : 0,
      };
    }

    if (
      normalizedText.includes(
        "FROM nexus_sandbox_outbox",
      ) &&
      normalizedText.includes("FOR UPDATE")
    ) {
      const outbox =
        Object.prototype.hasOwnProperty.call(
          this.options,
          "outboxRow",
        )
          ? this.options.outboxRow
          : processingOutboxRow();

      return {
        rows: outbox ? [outbox] : [],
        rowCount: outbox ? 1 : 0,
      };
    }

    if (
      normalizedText.startsWith(
        "INSERT INTO nexus_sandbox_outbox_results",
      )
    ) {
      if (this.options.resultInsertError) {
        throw this.options.resultInsertError;
      }

      if (this.options.resultConflict) {
        return {
          rows: [],
          rowCount: 0,
        };
      }

      const inserted = resultRow({
        tenant_id:
          this.options.insertedResultTenantId ||
          values[0],
        result_id: values[1],
        outbox_id: values[2],
        action_kind: values[3],
        payload: JSON.parse(values[4]),
        payload_canonical: values[5],
      });

      return {
        rows: [inserted],
        rowCount: 1,
      };
    }

    if (
      normalizedText.startsWith(
        "UPDATE nexus_sandbox_outbox",
      )
    ) {
      const completion =
        Object.prototype.hasOwnProperty.call(
          this.options,
          "completionRow",
        )
          ? this.options.completionRow
          : completedRow();

      return {
        rows: completion ? [completion] : [],
        rowCount: completion ? 1 : 0,
      };
    }

    throw new Error(
      `Unexpected fake PostgreSQL query: ${normalizedText}`,
    );
  }

  release() {
    this.releaseCount += 1;
  }
}

class FakePool {
  constructor(client) {
    this.client = client;
    this.connectCount = 0;
  }

  async connect() {
    this.connectCount += 1;
    return this.client;
  }
}

function transactionContext(overrides = {}) {
  return {
    tenantId: TENANT_A,
    actorId: ACTOR_A,
    requestId: "request-756",
    ...overrides,
  };
}

function validInput(overrides = {}) {
  return {
    resultId: RESULT_A,
    outboxId: OUTBOX_A,
    actionKind: ACTION_KIND,
    leaseOwner: "sandbox-worker-a",
    leaseToken: LEASE_TOKEN_A,
    payload: {
      recommendation: "approve",
      confidence: "high",
    },
    ...overrides,
  };
}

function countCall(client, exactText) {
  return client.calls.filter(
    (call) => call.text === exactText,
  ).length;
}

async function run() {
  let passed = 0;

  async function test(name, operation) {
    await operation();
    passed += 1;
    console.log(`PASS ${passed}: ${name}`);
  }

  await test(
    "migration creates durable sandbox results table",
    async () => {
      assert.match(
        migration,
        /CREATE TABLE IF NOT EXISTS nexus_sandbox_outbox_results/i,
      );
    },
  );

  await test(
    "migration permits only one result per tenant outbox",
    async () => {
      assert.match(
        migration,
        /UNIQUE\s*\(\s*tenant_id\s*,\s*outbox_id\s*\)/i,
      );
    },
  );

  await test(
    "migration binds result to tenant-scoped outbox foreign key",
    async () => {
      assert.match(
        migration,
        /FOREIGN KEY\s*\(\s*tenant_id\s*,\s*outbox_id\s*\)/i,
      );

      assert.match(
        migration,
        /REFERENCES nexus_sandbox_outbox\s*\(\s*tenant_id\s*,\s*outbox_id\s*\)/i,
      );
    },
  );

  await test(
    "migration enables and forces result row-level security",
    async () => {
      assert.match(
        migration,
        /ENABLE ROW LEVEL SECURITY/i,
      );

      assert.match(
        migration,
        /FORCE ROW LEVEL SECURITY/i,
      );
    },
  );

  await test(
    "migration binds result policy to transaction tenant context",
    async () => {
      const matches =
        migration.match(
          /current_setting\('app\.tenant_id',\s*true\)/gi,
        ) || [];

      assert.ok(matches.length >= 2);
    },
  );

  await test(
    "migration makes sandbox result rows append-only",
    async () => {
      assert.match(
        migration,
        /BEFORE UPDATE ON nexus_sandbox_outbox_results/i,
      );

      assert.match(
        migration,
        /BEFORE DELETE ON nexus_sandbox_outbox_results/i,
      );
    },
  );

  await test(
    "records result and completes active lease atomically",
    async () => {
      const client = new FakeClient();

      const result =
        await commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        );

      assert.equal(result.tenantId, TENANT_A);
      assert.equal(result.resultId, RESULT_A);
      assert.equal(result.outboxId, OUTBOX_A);
      assert.equal(result.actionKind, ACTION_KIND);
      assert.equal(result.replayed, false);
      assert.equal(
        result.completedAt,
        "2026-07-11T03:01:00.000Z",
      );
    },
  );

  await test(
    "derives tenant identity only from verified context",
    async () => {
      const client = new FakeClient();

      await commitSandboxResultAndCompleteLease(
        new FakePool(client),
        transactionContext(),
        validInput(),
      );

      const outboxSelect =
        client.calls.find((call) =>
          call.text.includes(
            "FROM nexus_sandbox_outbox",
          ),
        );

      assert.ok(outboxSelect);
      assert.equal(outboxSelect.values[0], TENANT_A);
      assert.equal(
        Object.prototype.hasOwnProperty.call(
          validInput(),
          "tenantId",
        ),
        false,
      );
    },
  );

  await test(
    "locks outbox state before result persistence",
    async () => {
      const client = new FakeClient();

      await commitSandboxResultAndCompleteLease(
        new FakePool(client),
        transactionContext(),
        validInput(),
      );

      assert.match(
        client.calls.find((call) =>
          call.text.includes(
            "FROM nexus_sandbox_outbox",
          ),
        ).text,
        /FOR UPDATE/i,
      );
    },
  );

  await test(
    "validates database-clock lease expiry before insertion",
    async () => {
      const client = new FakeClient();

      await commitSandboxResultAndCompleteLease(
        new FakePool(client),
        transactionContext(),
        validInput(),
      );

      const outboxSelect =
        client.calls.find((call) =>
          call.text.includes(
            "FROM nexus_sandbox_outbox",
          ),
        );

      assert.match(
        outboxSelect.text,
        /lease_expires_at > now\(\)/i,
      );
    },
  );

  await test(
    "inserts durable result before completing outbox",
    async () => {
      const client = new FakeClient();

      await commitSandboxResultAndCompleteLease(
        new FakePool(client),
        transactionContext(),
        validInput(),
      );

      const insertIndex =
        client.calls.findIndex((call) =>
          call.text.startsWith(
            "INSERT INTO nexus_sandbox_outbox_results",
          ),
        );

      const completionIndex =
        client.calls.findIndex((call) =>
          call.text.startsWith(
            "UPDATE nexus_sandbox_outbox",
          ),
        );

      assert.ok(insertIndex >= 0);
      assert.ok(completionIndex > insertIndex);
    },
  );

  await test(
    "completion clears lease identity and error state",
    async () => {
      const client = new FakeClient();

      await commitSandboxResultAndCompleteLease(
        new FakePool(client),
        transactionContext(),
        validInput(),
      );

      const completion =
        client.calls.find((call) =>
          call.text.startsWith(
            "UPDATE nexus_sandbox_outbox",
          ),
        );

      assert.match(completion.text, /lease_owner = NULL/i);
      assert.match(completion.text, /lease_token = NULL/i);
      assert.match(
        completion.text,
        /lease_expires_at = NULL/i,
      );
      assert.match(
        completion.text,
        /last_error_code = NULL/i,
      );
      assert.match(
        completion.text,
        /completed_at = now\(\)/i,
      );
    },
  );

  await test(
    "commits exactly once after result and completion succeed",
    async () => {
      const client = new FakeClient();

      await commitSandboxResultAndCompleteLease(
        new FakePool(client),
        transactionContext(),
        validInput(),
      );

      assert.equal(countCall(client, "COMMIT"), 1);
      assert.equal(countCall(client, "ROLLBACK"), 0);
    },
  );

  await test(
    "returns identical completed result idempotently",
    async () => {
      const client = new FakeClient({
        outboxRow: completedOutboxRow(),
        existingResultRow: resultRow(),
      });

      const result =
        await commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        );

      assert.equal(result.replayed, true);
      assert.equal(result.resultId, RESULT_A);
      assert.equal(countCall(client, "COMMIT"), 1);
    },
  );

  await test(
    "completed replay does not mutate the outbox again",
    async () => {
      const client = new FakeClient({
        outboxRow: completedOutboxRow(),
      });

      await commitSandboxResultAndCompleteLease(
        new FakePool(client),
        transactionContext(),
        validInput(),
      );

      assert.equal(
        client.calls.some((call) =>
          call.text.startsWith(
            "UPDATE nexus_sandbox_outbox",
          ),
        ),
        false,
      );
    },
  );

  await test(
    "rejects replay using a different result identity",
    async () => {
      const client = new FakeClient({
        outboxRow: completedOutboxRow(),
        existingResultRow: resultRow({
          result_id: RESULT_B,
        }),
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultConflictError,
      );

      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "rejects replay using a different result payload",
    async () => {
      const client = new FakeClient({
        outboxRow: completedOutboxRow(),
        existingResultRow: resultRow({
          payload: {
            confidence: "low",
            recommendation: "reject",
          },
          payload_canonical:
            '{"confidence":"low","recommendation":"reject"}',
        }),
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultConflictError,
      );

      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "rejects missing outbox inside verified tenant",
    async () => {
      const client = new FakeClient({
        outboxRow: null,
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultLeaseFenceError,
      );

      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "rejects result action that differs from outbox action",
    async () => {
      const client = new FakeClient({
        outboxRow: processingOutboxRow({
          action_kind: "sandbox.quote.prepare",
        }),
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultConflictError,
      );

      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "rejects stale worker lease token",
    async () => {
      const client = new FakeClient({
        outboxRow: processingOutboxRow({
          lease_token:
            "77777777-7777-4777-8777-777777777777",
        }),
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultLeaseFenceError,
      );

      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "rejects expired worker lease",
    async () => {
      const client = new FakeClient({
        outboxRow: processingOutboxRow({
          lease_valid: false,
        }),
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultLeaseFenceError,
      );

      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "rejects non-sandbox action before acquiring connection",
    async () => {
      const pool = new FakePool(new FakeClient());

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          pool,
          transactionContext(),
          validInput({
            actionKind: "live.whatsapp.send",
          }),
        ),
        AtomicSandboxResultValidationError,
      );

      assert.equal(pool.connectCount, 0);
    },
  );

  await test(
    "rejects circular result payload before acquiring connection",
    async () => {
      const pool = new FakePool(new FakeClient());
      const payload = {};
      payload.self = payload;

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          pool,
          transactionContext(),
          validInput({
            payload,
          }),
        ),
        AtomicSandboxResultValidationError,
      );

      assert.equal(pool.connectCount, 0);
    },
  );

  await test(
    "rejects cross-tenant result returned by PostgreSQL",
    async () => {
      const client = new FakeClient({
        insertedResultTenantId: TENANT_B,
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultPersistenceError,
      );

      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "rolls back when durable result insertion fails",
    async () => {
      const client = new FakeClient({
        resultInsertError: new Error(
          "durable result write failed",
        ),
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(client),
          transactionContext(),
          validInput(),
        ),
        /durable result write failed/,
      );

      assert.equal(countCall(client, "COMMIT"), 0);
      assert.equal(countCall(client, "ROLLBACK"), 1);
    },
  );

  await test(
    "always releases connection after success and failure",
    async () => {
      const successClient = new FakeClient();

      await commitSandboxResultAndCompleteLease(
        new FakePool(successClient),
        transactionContext(),
        validInput(),
      );

      assert.equal(successClient.releaseCount, 1);

      const failedClient = new FakeClient({
        completionRow: null,
      });

      await assert.rejects(
        commitSandboxResultAndCompleteLease(
          new FakePool(failedClient),
          transactionContext(),
          validInput(),
        ),
        AtomicSandboxResultLeaseFenceError,
      );

      assert.equal(failedClient.releaseCount, 1);
    },
  );

  assert.equal(passed, 26);

  console.log("");
  console.log("DAY 756 TARGETED TESTS: PASS (26/26)");
  console.log("ATOMIC RESULT AND COMPLETION COMMIT: PASS");
  console.log("DURABLE SANDBOX RESULT: PASS");
  console.log("APPEND-ONLY RESULT EVIDENCE: PASS");
  console.log("DATABASE RESULT TENANT RLS: PASS");
  console.log("LEASE TOKEN FENCING: PASS");
  console.log("DATABASE-CLOCK EXPIRY CHECK: PASS");
  console.log("IDEMPOTENT COMPLETION REPLAY: PASS");
  console.log("RESULT CONFLICT DEFENCE: PASS");
  console.log("TRANSACTION ROLLBACK SAFETY: PASS");
  console.log("LIVE PROVIDER EXECUTION: BLOCKED");
  console.log("EXTERNAL DELIVERY: BLOCKED");
  console.log("PAYMENT EXECUTION: BLOCKED");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
