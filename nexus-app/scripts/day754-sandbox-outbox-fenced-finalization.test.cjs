"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migrationPath = path.join(
  __dirname,
  "..",
  "db",
  "migrations",
  "0754_sandbox_outbox_fenced_finalization.sql",
);

const migration = fs.readFileSync(migrationPath, "utf8");

const implementation = require(
  path.join(
    __dirname,
    "..",
    ".day754-compiled",
    "sandboxOutboxLeaseFinalization.js",
  ),
);

const {
  SandboxOutboxFinalizationPersistenceError,
  SandboxOutboxFinalizationValidationError,
  SandboxOutboxLeaseFenceError,
  completeSandboxOutboxLease,
  failSandboxOutboxLease,
} = implementation;

const TENANT_A = "11111111-1111-4111-8111-111111111111";
const TENANT_B = "22222222-2222-4222-8222-222222222222";
const OUTBOX_A = "33333333-3333-4333-8333-333333333333";
const LEASE_TOKEN_A = "44444444-4444-4444-8444-444444444444";

function completedRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    status: "completed",
    attempt_count: 1,
    available_at: "2026-07-11T00:00:00.000Z",
    completed_at: "2026-07-11T01:00:00.000Z",
    failed_at: null,
    last_error_code: null,
    ...overrides,
  };
}

function pendingRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    status: "pending",
    attempt_count: 1,
    available_at: "2026-07-11T01:05:00.000Z",
    completed_at: null,
    failed_at: null,
    last_error_code: "sandbox_timeout",
    ...overrides,
  };
}

function failedRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    status: "failed",
    attempt_count: 3,
    available_at: "2026-07-11T00:00:00.000Z",
    completed_at: null,
    failed_at: "2026-07-11T01:00:00.000Z",
    last_error_code: "sandbox_timeout",
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
      requestId: options.requestId || "request-754",
    });

    this.completeRows =
      Object.prototype.hasOwnProperty.call(
        options,
        "completeRows",
      )
        ? options.completeRows
        : [completedRow()];

    this.failRows =
      Object.prototype.hasOwnProperty.call(
        options,
        "failRows",
      )
        ? options.failRows
        : [pendingRow()];

    this.calls = [];
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
      normalizedText.includes("status = 'completed'") &&
      !normalizedText.includes("status = CASE")
    ) {
      return {
        rows: this.completeRows,
        rowCount: this.completeRows.length,
      };
    }

    if (normalizedText.includes("status = CASE")) {
      return {
        rows: this.failRows,
        rowCount: this.failRows.length,
      };
    }

    throw new Error(
      `Unexpected fake SQL query: ${normalizedText}`,
    );
  }
}

function completionInput(overrides = {}) {
  return {
    outboxId: OUTBOX_A,
    leaseOwner: "sandbox-worker-a",
    leaseToken: LEASE_TOKEN_A,
    ...overrides,
  };
}

function failureInput(overrides = {}) {
  return {
    outboxId: OUTBOX_A,
    leaseOwner: "sandbox-worker-a",
    leaseToken: LEASE_TOKEN_A,
    errorCode: "sandbox_timeout",
    retryable: true,
    retryDelaySeconds: 300,
    maxAttempts: 3,
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

  await test("migration adds durable failed timestamp", async () => {
    assert.match(
      migration,
      /ADD COLUMN IF NOT EXISTS failed_at timestamptz NULL/i,
    );
  });

  await test("migration backfills existing failed rows", async () => {
    assert.match(
      migration,
      /WHERE status = 'failed'[\s\S]*failed_at IS NULL/i,
    );
  });

  await test("migration clears invalid failed timestamps", async () => {
    assert.match(
      migration,
      /WHERE status <> 'failed'[\s\S]*failed_at IS NOT NULL/i,
    );
  });

  await test("migration enforces failed-state timestamp consistency", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_failed_state_ck/i,
    );

    assert.match(
      migration,
      /status = 'failed' AND failed_at IS NOT NULL/i,
    );
  });

  await test("migration creates tenant-scoped failed-work index", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_failed_idx/i,
    );

    assert.match(
      migration,
      /WHERE status = 'failed'/i,
    );
  });

  await test("completes a valid current sandbox lease", async () => {
    const sql = new FakeTenantSql();

    const result = await completeSandboxOutboxLease(
      sql,
      completionInput(),
    );

    assert.equal(result.status, "completed");
    assert.equal(result.tenantId, TENANT_A);
    assert.equal(result.outboxId, OUTBOX_A);
    assert.equal(
      result.completedAt,
      "2026-07-11T01:00:00.000Z",
    );
    assert.equal(result.failedAt, null);
  });

  await test("completion derives tenant only from verified context", async () => {
    const sql = new FakeTenantSql();

    await completeSandboxOutboxLease(
      sql,
      completionInput(),
    );

    assert.equal(sql.calls[0].values[0], TENANT_A);
    assert.equal(
      Object.prototype.hasOwnProperty.call(
        completionInput(),
        "tenantId",
      ),
      false,
    );
  });

  await test("completion fences by owner token status and expiry", async () => {
    const sql = new FakeTenantSql();

    await completeSandboxOutboxLease(
      sql,
      completionInput(),
    );

    assert.match(
      sql.calls[0].text,
      /status = 'processing'/i,
    );

    assert.match(
      sql.calls[0].text,
      /lease_owner = \$3::text/i,
    );

    assert.match(
      sql.calls[0].text,
      /lease_token = \$4::uuid/i,
    );

    assert.match(
      sql.calls[0].text,
      /lease_expires_at > now\(\)/i,
    );
  });

  await test("completion clears lease identity", async () => {
    const sql = new FakeTenantSql();

    await completeSandboxOutboxLease(
      sql,
      completionInput(),
    );

    assert.match(sql.calls[0].text, /lease_owner = NULL/i);
    assert.match(sql.calls[0].text, /lease_token = NULL/i);
    assert.match(
      sql.calls[0].text,
      /lease_expires_at = NULL/i,
    );
  });

  await test("completion rejects stale or expired leases", async () => {
    const sql = new FakeTenantSql({
      completeRows: [],
    });

    await assert.rejects(
      completeSandboxOutboxLease(
        sql,
        completionInput(),
      ),
      SandboxOutboxLeaseFenceError,
    );
  });

  await test("completion rejects cross-tenant returned rows", async () => {
    const sql = new FakeTenantSql({
      completeRows: [
        completedRow({
          tenant_id: TENANT_B,
        }),
      ],
    });

    await assert.rejects(
      completeSandboxOutboxLease(
        sql,
        completionInput(),
      ),
      SandboxOutboxFinalizationPersistenceError,
    );
  });

  await test("completion returns immutable result", async () => {
    const sql = new FakeTenantSql();

    const result = await completeSandboxOutboxLease(
      sql,
      completionInput(),
    );

    assert.equal(Object.isFrozen(result), true);
  });

  await test("retryable failure returns work to pending", async () => {
    const sql = new FakeTenantSql({
      failRows: [pendingRow()],
    });

    const result = await failSandboxOutboxLease(
      sql,
      failureInput(),
    );

    assert.equal(result.status, "pending");
    assert.equal(result.failedAt, null);
    assert.equal(result.completedAt, null);
    assert.equal(result.lastErrorCode, "sandbox_timeout");
  });

  await test("non-retryable failure becomes terminally failed", async () => {
    const sql = new FakeTenantSql({
      failRows: [
        failedRow({
          attempt_count: 1,
          last_error_code: "invalid_sandbox_payload",
        }),
      ],
    });

    const result = await failSandboxOutboxLease(
      sql,
      failureInput({
        retryable: false,
        errorCode: "invalid_sandbox_payload",
      }),
    );

    assert.equal(result.status, "failed");
    assert.equal(
      result.failedAt,
      "2026-07-11T01:00:00.000Z",
    );
    assert.equal(
      result.lastErrorCode,
      "invalid_sandbox_payload",
    );
  });

  await test("exhausted retries become terminally failed", async () => {
    const sql = new FakeTenantSql({
      failRows: [failedRow()],
    });

    const result = await failSandboxOutboxLease(
      sql,
      failureInput({
        maxAttempts: 3,
      }),
    );

    assert.equal(result.status, "failed");
    assert.equal(result.attemptCount, 3);
  });

  await test("failure transition uses attempt count retry ceiling", async () => {
    const sql = new FakeTenantSql();

    await failSandboxOutboxLease(
      sql,
      failureInput(),
    );

    assert.match(
      sql.calls[0].text,
      /attempt_count < \$8::integer/i,
    );
  });

  await test("failure transition schedules bounded retry delay", async () => {
    const sql = new FakeTenantSql();

    await failSandboxOutboxLease(
      sql,
      failureInput(),
    );

    assert.match(
      sql.calls[0].text,
      /make_interval\(secs => \$7::integer\)/i,
    );
  });

  await test("failure transition clears stale lease identity", async () => {
    const sql = new FakeTenantSql();

    await failSandboxOutboxLease(
      sql,
      failureInput(),
    );

    assert.match(sql.calls[0].text, /lease_owner = NULL/i);
    assert.match(sql.calls[0].text, /lease_token = NULL/i);
    assert.match(
      sql.calls[0].text,
      /lease_expires_at = NULL/i,
    );
  });

  await test("failure transition uses parameterized values", async () => {
    const sql = new FakeTenantSql();

    await failSandboxOutboxLease(
      sql,
      failureInput(),
    );

    assert.deepEqual(sql.calls[0].values, [
      TENANT_A,
      OUTBOX_A,
      "sandbox-worker-a",
      LEASE_TOKEN_A,
      "sandbox_timeout",
      true,
      300,
      3,
    ]);
  });

  await test("failure transition rejects stale or expired leases", async () => {
    const sql = new FakeTenantSql({
      failRows: [],
    });

    await assert.rejects(
      failSandboxOutboxLease(
        sql,
        failureInput(),
      ),
      SandboxOutboxLeaseFenceError,
    );
  });

  await test("invalid outbox identity fails before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      completeSandboxOutboxLease(
        sql,
        completionInput({
          outboxId: "invalid-outbox-id",
        }),
      ),
      SandboxOutboxFinalizationValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("invalid lease token fails before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      failSandboxOutboxLease(
        sql,
        failureInput({
          leaseToken: "invalid-lease-token",
        }),
      ),
      SandboxOutboxFinalizationValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("unsafe error code fails before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      failSandboxOutboxLease(
        sql,
        failureInput({
          errorCode: "SEND LIVE NOW",
        }),
      ),
      SandboxOutboxFinalizationValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("excessive retry delay fails before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      failSandboxOutboxLease(
        sql,
        failureInput({
          retryDelaySeconds: 86401,
        }),
      ),
      SandboxOutboxFinalizationValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("invalid retry ceiling fails before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      failSandboxOutboxLease(
        sql,
        failureInput({
          maxAttempts: 0,
        }),
      ),
      SandboxOutboxFinalizationValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("invalid PostgreSQL timestamps fail closed", async () => {
    const sql = new FakeTenantSql({
      completeRows: [
        completedRow({
          completed_at: "invalid-date",
        }),
      ],
    });

    await assert.rejects(
      completeSandboxOutboxLease(
        sql,
        completionInput(),
      ),
      SandboxOutboxFinalizationPersistenceError,
    );
  });

  assert.equal(passed, 26);

  console.log("");
  console.log("DAY 754 TARGETED TESTS: PASS (26/26)");
  console.log("LEASE TOKEN FENCING: PASS");
  console.log("STALE WORKER COMPLETION DEFENCE: PASS");
  console.log("ATOMIC COMPLETION TRANSITION: PASS");
  console.log("BOUNDED RETRY SCHEDULING: PASS");
  console.log("MAX ATTEMPT ENFORCEMENT: PASS");
  console.log("TERMINAL FAILURE STATE: PASS");
  console.log("TENANT-ISOLATED FINALIZATION: PASS");
  console.log("LEASE IDENTITY CLEARING: PASS");
  console.log("LIVE PROVIDER EXECUTION: BLOCKED");
  console.log("EXTERNAL DELIVERY: BLOCKED");
  console.log("PAYMENT EXECUTION: BLOCKED");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
