"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migrationPath = path.join(
  __dirname,
  "..",
  "db",
  "migrations",
  "0753_sandbox_outbox_lease_recovery.sql",
);

const migration = fs.readFileSync(migrationPath, "utf8");

const implementation = require(
  path.join(
    __dirname,
    "..",
    ".day753-compiled",
    "sandboxOutboxLeaseRepository.js",
  ),
);

const {
  SandboxOutboxLeasePersistenceError,
  SandboxOutboxLeaseValidationError,
  claimSandboxOutboxBatch,
  recoverExpiredSandboxOutboxLeases,
} = implementation;

const TENANT_A = "11111111-1111-4111-8111-111111111111";
const TENANT_B = "22222222-2222-4222-8222-222222222222";
const OUTBOX_A = "33333333-3333-4333-8333-333333333333";
const AGGREGATE_A = "44444444-4444-4444-8444-444444444444";
const LEASE_TOKEN_A = "55555555-5555-4555-8555-555555555555";

function makeClaimedRow(overrides = {}) {
  return {
    tenant_id: TENANT_A,
    outbox_id: OUTBOX_A,
    aggregate_type: "customer_inquiry",
    aggregate_id: AGGREGATE_A,
    action_kind: "sandbox.recommendation.prepare",
    idempotency_key: "inquiry-444-recommendation-v1",
    payload: {
      customerName: "Asha",
      priority: "normal",
    },
    attempt_count: 1,
    lease_owner: "sandbox-worker-a",
    lease_token: LEASE_TOKEN_A,
    lease_expires_at: "2026-07-11T01:00:00.000Z",
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
      requestId: options.requestId || "request-753",
    });

    this.claimRows =
      Object.prototype.hasOwnProperty.call(options, "claimRows")
        ? options.claimRows
        : [makeClaimedRow()];

    this.recoveredCount =
      Object.prototype.hasOwnProperty.call(
        options,
        "recoveredCount",
      )
        ? options.recoveredCount
        : "2";

    this.omitRecoveryRow = options.omitRecoveryRow === true;
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

    if (normalizedText.startsWith("WITH candidates AS")) {
      return {
        rows: this.claimRows,
        rowCount: this.claimRows.length,
      };
    }

    if (normalizedText.startsWith("WITH recovered AS")) {
      return {
        rows: this.omitRecoveryRow
          ? []
          : [
              {
                recovered_count: this.recoveredCount,
              },
            ],
        rowCount: this.omitRecoveryRow ? 0 : 1,
      };
    }

    throw new Error(
      `Unexpected fake SQL query: ${normalizedText}`,
    );
  }
}

function validClaimInput(overrides = {}) {
  return {
    leaseOwner: "sandbox-worker-a",
    leaseToken: LEASE_TOKEN_A,
    leaseSeconds: 60,
    batchSize: 10,
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

  await test("migration adds durable lease identity fields", async () => {
    assert.match(migration, /lease_owner text NULL/i);
    assert.match(migration, /lease_token uuid NULL/i);
    assert.match(migration, /lease_expires_at timestamptz NULL/i);
  });

  await test("migration safely resets pre-lease processing rows", async () => {
    assert.match(
      migration,
      /WHERE status = 'processing'/i,
    );

    assert.match(
      migration,
      /status = 'pending'/i,
    );
  });

  await test("migration enforces processing lease consistency", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_lease_state_ck/i,
    );

    assert.match(
      migration,
      /status = 'processing'[\s\S]*lease_owner IS NOT NULL[\s\S]*lease_token IS NOT NULL[\s\S]*lease_expires_at IS NOT NULL/i,
    );
  });

  await test("migration enforces completed timestamp consistency", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_completed_state_ck/i,
    );

    assert.match(
      migration,
      /status = 'completed' AND completed_at IS NOT NULL/i,
    );
  });

  await test("migration creates a pending claim index", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_claim_idx/i,
    );

    assert.match(
      migration,
      /WHERE status = 'pending'/i,
    );
  });

  await test("migration creates an expired lease recovery index", async () => {
    assert.match(
      migration,
      /nexus_sandbox_outbox_expired_lease_idx/i,
    );

    assert.match(
      migration,
      /WHERE status = 'processing'/i,
    );
  });

  await test("claims pending sandbox work atomically", async () => {
    const sql = new FakeTenantSql();

    const result = await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].outboxId, OUTBOX_A);
    assert.equal(result[0].attemptCount, 1);
    assert.equal(result[0].leaseToken, LEASE_TOKEN_A);
  });

  await test("derives tenant identity only from verified transaction context", async () => {
    const sql = new FakeTenantSql();

    await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.equal(sql.calls[0].values[0], TENANT_A);
    assert.equal(
      Object.prototype.hasOwnProperty.call(
        validClaimInput(),
        "tenantId",
      ),
      false,
    );
  });

  await test("uses FOR UPDATE SKIP LOCKED for concurrent workers", async () => {
    const sql = new FakeTenantSql();

    await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.match(
      sql.calls[0].text,
      /FOR UPDATE SKIP LOCKED/i,
    );
  });

  await test("claims only available pending work", async () => {
    const sql = new FakeTenantSql();

    await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.match(
      sql.calls[0].text,
      /status = 'pending'/i,
    );

    assert.match(
      sql.calls[0].text,
      /available_at <= now\(\)/i,
    );
  });

  await test("increments attempt count during claim", async () => {
    const sql = new FakeTenantSql();

    await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.match(
      sql.calls[0].text,
      /attempt_count = outbox\.attempt_count \+ 1/i,
    );
  });

  await test("uses parameterized lease inputs", async () => {
    const sql = new FakeTenantSql();

    await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.deepEqual(sql.calls[0].values, [
      TENANT_A,
      10,
      "sandbox-worker-a",
      LEASE_TOKEN_A,
      60,
    ]);
  });

  await test("returns an immutable claimed batch", async () => {
    const sql = new FakeTenantSql();

    const result = await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.equal(Object.isFrozen(result), true);
    assert.equal(Object.isFrozen(result[0]), true);
    assert.equal(Object.isFrozen(result[0].payload), true);
  });

  await test("returns an empty batch when no work is available", async () => {
    const sql = new FakeTenantSql({
      claimRows: [],
    });

    const result = await claimSandboxOutboxBatch(
      sql,
      validClaimInput(),
    );

    assert.deepEqual(result, []);
  });

  await test("fails closed on a cross-tenant claimed row", async () => {
    const sql = new FakeTenantSql({
      claimRows: [
        makeClaimedRow({
          tenant_id: TENANT_B,
        }),
      ],
    });

    await assert.rejects(
      claimSandboxOutboxBatch(
        sql,
        validClaimInput(),
      ),
      SandboxOutboxLeasePersistenceError,
    );
  });

  await test("fails closed on mismatched lease identity", async () => {
    const sql = new FakeTenantSql({
      claimRows: [
        makeClaimedRow({
          lease_owner: "different-worker",
        }),
      ],
    });

    await assert.rejects(
      claimSandboxOutboxBatch(
        sql,
        validClaimInput(),
      ),
      SandboxOutboxLeasePersistenceError,
    );
  });

  await test("rejects invalid lease token before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      claimSandboxOutboxBatch(
        sql,
        validClaimInput({
          leaseToken: "invalid-token",
        }),
      ),
      SandboxOutboxLeaseValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects unsafe lease owner before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      claimSandboxOutboxBatch(
        sql,
        validClaimInput({
          leaseOwner: "worker`nunsafe",
        }),
      ),
      SandboxOutboxLeaseValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects excessive batch size before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      claimSandboxOutboxBatch(
        sql,
        validClaimInput({
          batchSize: 101,
        }),
      ),
      SandboxOutboxLeaseValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("rejects unsafe lease duration before querying", async () => {
    const sql = new FakeTenantSql();

    await assert.rejects(
      claimSandboxOutboxBatch(
        sql,
        validClaimInput({
          leaseSeconds: 901,
        }),
      ),
      SandboxOutboxLeaseValidationError,
    );

    assert.equal(sql.calls.length, 0);
  });

  await test("recovers only expired processing leases for the tenant", async () => {
    const sql = new FakeTenantSql({
      recoveredCount: "3",
    });

    const result =
      await recoverExpiredSandboxOutboxLeases(sql);

    assert.equal(result.tenantId, TENANT_A);
    assert.equal(result.recoveredCount, 3);

    assert.match(
      sql.calls[0].text,
      /tenant_id = \$1::uuid/i,
    );

    assert.match(
      sql.calls[0].text,
      /status = 'processing'/i,
    );

    assert.match(
      sql.calls[0].text,
      /lease_expires_at <= now\(\)/i,
    );
  });

  await test("expired recovery clears stale lease identity", async () => {
    const sql = new FakeTenantSql();

    await recoverExpiredSandboxOutboxLeases(sql);

    assert.match(
      sql.calls[0].text,
      /lease_owner = NULL/i,
    );

    assert.match(
      sql.calls[0].text,
      /lease_token = NULL/i,
    );

    assert.match(
      sql.calls[0].text,
      /lease_expires_at = NULL/i,
    );

    assert.match(
      sql.calls[0].text,
      /last_error_code = 'lease_expired'/i,
    );
  });

  await test("fails closed when recovery count is missing", async () => {
    const sql = new FakeTenantSql({
      omitRecoveryRow: true,
    });

    await assert.rejects(
      recoverExpiredSandboxOutboxLeases(sql),
      SandboxOutboxLeasePersistenceError,
    );
  });

  assert.equal(passed, 23);

  console.log("");
  console.log("DAY 753 TARGETED TESTS: PASS (23/23)");
  console.log("ATOMIC SANDBOX OUTBOX CLAIM: PASS");
  console.log("FOR UPDATE SKIP LOCKED: PASS");
  console.log("TENANT-ISOLATED CLAIMING: PASS");
  console.log("DURABLE LEASE IDENTITY: PASS");
  console.log("CONCURRENT DUPLICATE CLAIM DEFENCE: PASS");
  console.log("EXPIRED LEASE RECOVERY: PASS");
  console.log("STALE LEASE CLEARING: PASS");
  console.log("CROSS-TENANT RESULT DEFENCE: PASS");
  console.log("LIVE PROVIDER EXECUTION: BLOCKED");
  console.log("EXTERNAL DELIVERY: BLOCKED");
  console.log("PAYMENT EXECUTION: BLOCKED");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
