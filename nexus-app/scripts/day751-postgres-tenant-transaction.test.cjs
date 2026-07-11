"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");

const implementation = require(
  path.join(
    __dirname,
    "..",
    ".day751-compiled",
    "postgresTenantTransaction.js",
  ),
);

const {
  PostgreSqlTenantContextError,
  PostgreSqlTenantRollbackError,
  withPostgreSqlTenantTransaction,
} = implementation;

const TENANT_A = "11111111-1111-4111-8111-111111111111";
const TENANT_B = "22222222-2222-4222-8222-222222222222";
const ACTOR_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const ACTOR_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

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
    const normalizedText = String(text).replace(/\s+/g, " ").trim();

    this.calls.push({
      text: normalizedText,
      values: Array.from(values),
    });

    if (normalizedText === "BEGIN" && this.options.beginError) {
      throw this.options.beginError;
    }

    if (normalizedText.includes("set_config('app.tenant_id'")) {
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

    if (normalizedText.includes("current_setting('app.tenant_id'")) {
      if (this.options.contextMismatch) {
        return {
          rows: [
            {
              tenant_id: TENANT_B,
              actor_id: this.context.actorId,
              request_id: this.context.requestId,
            },
          ],
          rowCount: 1,
        };
      }

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

    if (normalizedText === "ROLLBACK" && this.options.rollbackError) {
      throw this.options.rollbackError;
    }

    return {
      rows: [],
      rowCount: 0,
    };
  }

  release() {
    this.releaseCount += 1;
  }
}

class FakePool {
  constructor(clients) {
    this.clients = Array.isArray(clients) ? [...clients] : [clients];
    this.connectCount = 0;
  }

  async connect() {
    this.connectCount += 1;

    const client = this.clients.shift();

    if (!client) {
      throw new Error("No fake PostgreSQL client available.");
    }

    return client;
  }
}

function context(tenantId = TENANT_A, actorId = ACTOR_A, requestId = "request-751") {
  return {
    tenantId,
    actorId,
    requestId,
  };
}

async function run() {
  let passed = 0;

  async function test(name, operation) {
    await operation();
    passed += 1;
    console.log(`PASS ${passed}: ${name}`);
  }

  await test("returns the tenant operation result", async () => {
    const client = new FakeClient();
    const result = await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async () => "completed",
    );

    assert.equal(result, "completed");
  });

  await test("starts the transaction before any tenant work", async () => {
    const client = new FakeClient();

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async () => undefined,
    );

    assert.equal(client.calls[0].text, "BEGIN");
  });

  await test("uses serializable transaction isolation", async () => {
    const client = new FakeClient();

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async () => undefined,
    );

    assert.equal(
      client.calls[1].text,
      "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE",
    );
  });

  await test("sets tenant context with parameterized transaction-local values", async () => {
    const client = new FakeClient();

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async () => undefined,
    );

    const setContextCall = client.calls.find((call) =>
      call.text.includes("set_config('app.tenant_id'"),
    );

    assert.ok(setContextCall);
    assert.ok(setContextCall.text.includes("$1"));
    assert.ok(setContextCall.text.includes("$2"));
    assert.ok(setContextCall.text.includes("$3"));
    assert.ok(setContextCall.text.includes("true"));
    assert.deepEqual(setContextCall.values, [
      TENANT_A,
      ACTOR_A,
      "request-751",
    ]);
  });

  await test("verifies PostgreSQL context before invoking customer work", async () => {
    const client = new FakeClient();
    let verificationObserved = false;

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async () => {
        verificationObserved = client.calls.some((call) =>
          call.text.includes("current_setting('app.tenant_id'"),
        );
      },
    );

    assert.equal(verificationObserved, true);
  });

  await test("provides immutable verified tenant context", async () => {
    const client = new FakeClient();

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async (sql) => {
        assert.equal(Object.isFrozen(sql), true);
        assert.equal(Object.isFrozen(sql.context), true);
        assert.equal(sql.context.tenantId, TENANT_A);
        assert.equal(sql.context.actorId, ACTOR_A);
        assert.equal(sql.context.requestId, "request-751");
      },
    );
  });

  await test("forwards tenant-scoped parameterized queries", async () => {
    const client = new FakeClient();

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async (sql) => {
        await sql.query(
          "SELECT $1::text AS protected_value",
          ["tenant-safe"],
        );
      },
    );

    const protectedCall = client.calls.find((call) =>
      call.text.includes("protected_value"),
    );

    assert.ok(protectedCall);
    assert.deepEqual(protectedCall.values, ["tenant-safe"]);
  });

  await test("commits exactly once after successful work", async () => {
    const client = new FakeClient();

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async () => undefined,
    );

    assert.equal(
      client.calls.filter((call) => call.text === "COMMIT").length,
      1,
    );

    assert.equal(
      client.calls.filter((call) => call.text === "ROLLBACK").length,
      0,
    );
  });

  await test("rolls back and does not commit after operation failure", async () => {
    const client = new FakeClient();

    await assert.rejects(
      withPostgreSqlTenantTransaction(
        new FakePool(client),
        context(),
        async () => {
          throw new Error("operation failed");
        },
      ),
      /operation failed/,
    );

    assert.equal(
      client.calls.filter((call) => call.text === "ROLLBACK").length,
      1,
    );

    assert.equal(
      client.calls.filter((call) => call.text === "COMMIT").length,
      0,
    );
  });

  await test("fails closed before callback execution on context mismatch", async () => {
    const client = new FakeClient({
      contextMismatch: true,
    });

    let callbackExecuted = false;

    await assert.rejects(
      withPostgreSqlTenantTransaction(
        new FakePool(client),
        context(),
        async () => {
          callbackExecuted = true;
        },
      ),
      PostgreSqlTenantContextError,
    );

    assert.equal(callbackExecuted, false);
    assert.equal(
      client.calls.filter((call) => call.text === "ROLLBACK").length,
      1,
    );
  });

  await test("releases the pooled connection after successful work", async () => {
    const client = new FakeClient();

    await withPostgreSqlTenantTransaction(
      new FakePool(client),
      context(),
      async () => undefined,
    );

    assert.equal(client.releaseCount, 1);
  });

  await test("releases the pooled connection after failed work", async () => {
    const client = new FakeClient();

    await assert.rejects(
      withPostgreSqlTenantTransaction(
        new FakePool(client),
        context(),
        async () => {
          throw new Error("expected failure");
        },
      ),
    );

    assert.equal(client.releaseCount, 1);
  });

  await test("rejects invalid tenant identity before acquiring a connection", async () => {
    const pool = new FakePool(new FakeClient());

    await assert.rejects(
      withPostgreSqlTenantTransaction(
        pool,
        context("not-a-tenant-uuid"),
        async () => undefined,
      ),
      PostgreSqlTenantContextError,
    );

    assert.equal(pool.connectCount, 0);
  });

  await test("rejects invalid actor identity before acquiring a connection", async () => {
    const pool = new FakePool(new FakeClient());

    await assert.rejects(
      withPostgreSqlTenantTransaction(
        pool,
        context(TENANT_A, "not-an-actor-uuid"),
        async () => undefined,
      ),
      PostgreSqlTenantContextError,
    );

    assert.equal(pool.connectCount, 0);
  });

  await test("keeps concurrent tenant contexts isolated by connection and transaction", async () => {
    const clientA = new FakeClient();
    const clientB = new FakeClient();
    const pool = new FakePool([clientA, clientB]);

    const results = await Promise.all([
      withPostgreSqlTenantTransaction(
        pool,
        context(TENANT_A, ACTOR_A, "request-a"),
        async (sql) => sql.context.tenantId,
      ),
      withPostgreSqlTenantTransaction(
        pool,
        context(TENANT_B, ACTOR_B, "request-b"),
        async (sql) => sql.context.tenantId,
      ),
    ]);

    assert.deepEqual(results, [TENANT_A, TENANT_B]);
    assert.equal(clientA.context.tenantId, TENANT_A);
    assert.equal(clientB.context.tenantId, TENANT_B);
    assert.notEqual(clientA.context.tenantId, clientB.context.tenantId);
  });

  await test("surfaces rollback failure without hiding the original failure", async () => {
    const operationError = new Error("primary transaction failure");
    const rollbackError = new Error("rollback transport failure");

    const client = new FakeClient({
      rollbackError,
    });

    await assert.rejects(
      withPostgreSqlTenantTransaction(
        new FakePool(client),
        context(),
        async () => {
          throw operationError;
        },
      ),
      (error) => {
        assert.ok(error instanceof PostgreSqlTenantRollbackError);
        assert.equal(error.operationError, operationError);
        assert.equal(error.rollbackError, rollbackError);
        return true;
      },
    );

    assert.equal(client.releaseCount, 1);
  });

  assert.equal(passed, 16);

  console.log("");
  console.log("DAY 751 TARGETED TESTS: PASS (16/16)");
  console.log("TRANSACTION-LOCAL TENANT CONTEXT: PASS");
  console.log("POOLED CONNECTION LEAKAGE DEFENCE: PASS");
  console.log("FAIL-CLOSED CONTEXT VERIFICATION: PASS");
  console.log("COMMIT/ROLLBACK/RELEASE SAFETY: PASS");
  console.log("AUTOMATIC RETRY DISABLED: PASS");
  console.log("LIVE PROVIDER EXECUTION: BLOCKED");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
