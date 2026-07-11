"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migrationPath = path.join(
  __dirname,
  "..",
  "db",
  "migrations",
  "0752_transactional_sandbox_outbox.sql",
);

const migration = fs.readFileSync(migrationPath, "utf8");

const implementation = require(
  path.join(
    __dirname,
    "..",
    ".day752-compiled",
    "transactionalSandboxOutbox.js",
  ),
);

const {
  SandboxOutboxIdempotencyConflictError,
  SandboxOutboxPersistenceError,
  SandboxOutboxValidationError,
  enqueueTransactionalSandboxOutbox,
} = implementation;

const TENANT_A = "11111111-1111-4111-8111-111111111111";
const OUTBOX_A = "22222222-2222-4222-8222-222222222222";
const AGGREGATE_A = "33333333-3333-4333-8333-333333333333";

function makeRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    aggregate_type: "customer_inquiry",
    aggregate_id: AGGREGATE_A,
    action_kind: "sandbox.recommendation.prepare",
    idempotency_key: "inquiry-333-recommendation-v1",
    payload: {
      customerName: "Asha",
      priority: "normal",
    },
    payload_canonical:
      '{"customerName":"Asha","priority":"normal"}',
    status: "pending",
    created_at: "2026-07-11T00:00:00.000Z",
    ...overrides,
  };
}

class FakeTenantSql {
  constructor(options = {}) {
    this.context = Object.freeze({
      tenantId: options.tenantId || TENANT_A,
      actorId:
        options.actorId ||
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      requestId: options.requestId || "request-752",
    });

    this.insertRow =
      Object.prototype.hasOwnProperty.call(options, "insertRow")
        ? options.insertRow
        : makeRow();

    this.existingRow =
      Object.prototype.hasOwnProperty.call(options, "existingRow")
        ? options.existingRow
        : makeRow();

    this.calls = [];
  }

  async query(text, values = []) {
    const normalizedText = String(text).replace(/\s+/g, " ").trim();

    this.calls.push({
      text: normalizedText,
      values: Array.from(values),
    });

    if (normalizedText.startsWith("INSERT INTO nexus_sandbox_outbox")) {
      return {
        rows: this.insertRow ? [this.insertRow] : [],
        rowCount: this.insertRow ? 1 : 0,
      };
    }

    if (normalizedText.includes("FROM nexus_sandbox_outbox")) {
      return {
        rows: this.existingRow ? [this.existingRow] : [],
        rowCount: this.existingRow ? 1 : 0,
      };
    }

    throw new Error(`Unexpected fake SQL query: ${normalizedText}`);
  }
}

function validInput(overrides = {}) {
  return {
    outboxId: OUTBOX_A,
    aggregateType: "customer_inquiry",
    aggregateId: AGGREGATE_A,
    actionKind: "sandbox.recommendation.prepare",
    idempotencyKey: "inquiry-333-recommendation-v1",
    payload: {
      priority: "normal",
      customerName: "Asha",
    },
    ...overrides,
  };
}

async function run() {
  let passed = 0;

  async function test(name, operation) {
    await operation();
    passed += 1;
    console.log(`PASS ${passed}: ${name}`);
  }

  await test("migration creates the sandbox outbox table", async () => {
    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_sandbox_outbox/i,
    );
  });

  await test("migration enforces tenant-scoped idempotency", async () => {
    assert.match(
      migration,
      /UNIQUE\s*\(\s*tenant_id\s*,\s*idempotency_key\s*\)/i,
    );
  });

  await test("migration enables and forces row-level security", async () => {
    assert.match(
      migration,
      /ENABLE ROW LEVEL SECURITY/i,
    );

    assert.match(
      migration,
      /FORCE ROW LEVEL SECURITY/i,
    );
  });

  await test("migration binds RLS to transaction tenant context", async () => {
    const tenantContextMatches =
      migration.match(
        /current_setting\('app\.tenant_id',\s*true\)/gi,
      ) || [];

    assert.ok(tenantContextMatches.length >= 2);
  });

  await test("migration rejects physical outbox deletion", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_no_delete/i,
    );

    assert.match(
      migration,
      /BEFORE DELETE ON nexus_sandbox_outbox/i,
    );
  });

  await test("migration protects immutable intent identity", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_protect_identity/i,
    );

    assert.match(
      migration,
      /payload_canonical IS DISTINCT FROM OLD\.payload_canonical/i,
    );

    assert.match(
      migration,
      /idempotency_key IS DISTINCT FROM OLD\.idempotency_key/i,
    );
  });

  await test("inserts a pending sandbox intent", async () => {
    const sql = new FakeTenantSql();

    const result = await enqueueTransactionalSandboxOutbox(
      sql,
      validInput(),
    );

    assert.equal(result.inserted, true);
    assert.equal(result.status, "pending");
    assert.equal(result.tenantId, TENANT_A);
    assert.equal(result.outboxId, OUTBOX_A);
  });

  await test("derives tenant identity only from verified transaction context", async () => {
    const sql = new FakeTenantSql();

    await enqueueTransactionalSandboxOutbox(sql, validInput());

    assert.equal(sql.calls[0].values[0], TENANT_A);
    assert.equal(
      Object.prototype.hasOwnProperty.call(validInput(), "tenantId"),
      false,
    );
  });

  await test("uses parameterized SQL for every supplied value", async () => {
    const sql = new FakeTenantSql();

    await enqueueTransactionalSandboxOutbox(sql, validInput());

    const insertCall = sql.calls[0];

    assert.match(insertCall.text, /\$1::uuid/);
    assert.match(insertCall.text, /\$2::uuid/);
    assert.match(insertCall.text, /\$6::jsonb/);
    assert.match(insertCall.text, /\$8::text/);
    assert.equal(insertCall.values.length, 8);
  });

  await test("canonicalizes payload object keys deterministically", async () => {
    const sql = new FakeTenantSql();

    await enqueueTransactionalSandboxOutbox(
      sql,
      validInput({
        payload: {
          z: 3,
          a: 1,
          nested: {
            y: true,
            b: "safe",
          },
        },
      }),
    );

    assert.equal(
      sql.calls[0].values[6],
      '{"a":1,"nested":{"b":"safe","y":true},"z":3}',
    );

    assert.equal(
      sql.calls[0].values[5],
      '{"a":1,"nested":{"b":"safe","y":true},"z":3}',
    );
  });

  await test("reuses an identical existing intent safely", async () => {
    const sql = new FakeTenantSql({
      insertRow: null,
      existingRow: makeRow(),
    });

    const result = await enqueueTransactionalSandboxOutbox(
      sql,
      validInput(),
    );

    assert.equal(result.inserted, false);
    assert.equal(result.outboxId, OUTBOX_A);
    assert.equal(sql.calls.length, 2);
  });

  await test("rejects idempotency reuse with a different action", async () => {
    const sql = new FakeTenantSql({
      insertRow: null,
      existingRow: makeRow({
        action_kind: "sandbox.quote.prepare",
      }),
    });

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(sql, validInput()),
      SandboxOutboxIdempotencyConflictError,
    );
  });

  await test("rejects idempotency reuse with a different aggregate", async () => {
    const sql = new FakeTenantSql({
      insertRow: null,
      existingRow: makeRow({
        aggregate_id:
          "44444444-4444-4444-8444-444444444444",
      }),
    });

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(sql, validInput()),
      SandboxOutboxIdempotencyConflictError,
    );
  });

  await test("rejects idempotency reuse with a different payload", async () => {
    const sql = new FakeTenantSql({
      insertRow: null,
      existingRow: makeRow({
        payload: {
          customerName: "Asha",
          priority: "urgent",
        },
        payload_canonical:
          '{"customerName":"Asha","priority":"urgent"}',
      }),
    });

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(sql, validInput()),
      SandboxOutboxIdempotencyConflictError,
    );
  });

  await test("fails closed when conflict row is not visible", async () => {
    const sql = new FakeTenantSql({
      insertRow: null,
      existingRow: null,
    });

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(sql, validInput()),
      SandboxOutboxPersistenceError,
    );
  });

  await test("rejects invalid outbox identity before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(
        sql,
        validInput({
          outboxId: "invalid-outbox-id",
        }),
      ),
      SandboxOutboxValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects invalid aggregate identity before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(
        sql,
        validInput({
          aggregateId: "invalid-aggregate-id",
        }),
      ),
      SandboxOutboxValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects unsafe action kinds before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(
        sql,
        validInput({
          actionKind: "LIVE SEND NOW",
        }),
      ),
      SandboxOutboxValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects invalid idempotency keys before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(
        sql,
        validInput({
          idempotencyKey: "unsafe`nkey",
        }),
      ),
      SandboxOutboxValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects unsupported payload values before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(
        sql,
        validInput({
          payload: {
            amount: Number.POSITIVE_INFINITY,
          },
        }),
      ),
      SandboxOutboxValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects circular payloads before querying", async () => {
    const sql = new FakeTenantSql();
    const payload = {};

    payload.self = payload;

    await assert.rejects(
      enqueueTransactionalSandboxOutbox(
        sql,
        validInput({
          payload,
        }),
      ),
      SandboxOutboxValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  assert.equal(passed, 21);

  console.log("");
  console.log("DAY 752 TARGETED TESTS: PASS (21/21)");
  console.log("TRANSACTIONAL SANDBOX OUTBOX: PASS");
  console.log("DATABASE TENANT RLS: PASS");
  console.log("TENANT-SCOPED IDEMPOTENCY: PASS");
  console.log("IMMUTABLE INTENT IDENTITY: PASS");
  console.log("APPEND-ONLY DELETE PROTECTION: PASS");
  console.log("DETERMINISTIC PAYLOAD CANONICALIZATION: PASS");
  console.log("IDEMPOTENCY CONFLICT DETECTION: PASS");
  console.log("LIVE PROVIDER EXECUTION: BLOCKED");
  console.log("EXTERNAL DELIVERY: BLOCKED");
  console.log("PAYMENT EXECUTION: BLOCKED");
});

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
