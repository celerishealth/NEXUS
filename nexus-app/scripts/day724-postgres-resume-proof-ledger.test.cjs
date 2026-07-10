const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledModulePath = process.argv[2];
const migrationPath = process.argv[3];

if (!compiledModulePath || !migrationPath) {
  throw new Error(
    "Compiled Day 724 module path or migration path was not provided.",
  );
}

const {
  CONTROLLED_PILOT_RESUME_CONSUME_ONCE_SQL,
  PostgresControlledPilotResumeProofLedger,
} = require(path.resolve(compiledModulePath));

const attemptId =
  "22222222-2222-4222-8222-222222222222";

const replayAttemptId =
  "33333333-3333-4333-8333-333333333333";

const record = {
  tokenId:
    "11111111-1111-4111-8111-111111111111",
  tenantId: "tenant-724",
  signalId: "signal-724",
  ownerId: "owner-724",
  issuedAt: 20_000,
  expiresAt: 20_120,
  consumedAt: 20_050,
};

class FakeDatabase {
  constructor(mode) {
    this.mode = mode;
    this.calls = [];
  }

  async query(sql, values) {
    this.calls.push({
      sql,
      values,
    });

    if (this.mode === "throw") {
      throw new Error("simulated database failure");
    }

    if (this.mode === "empty") {
      return {
        rows: [],
      };
    }

    const row = {
      tokenId: values[0],
      tenantId: values[1],
      signalId: values[2],
      ownerId: values[3],
      issuedAt: String(values[4]),
      expiresAt: String(values[5]),
      consumedAt: String(values[6]),
      consumptionAttemptId:
        this.mode === "insert"
          ? values[7]
          : replayAttemptId,
    };

    if (this.mode === "conflict") {
      row.tenantId = "different-tenant";
    }

    if (this.mode === "invalid-row") {
      row.consumedAt = "not-an-epoch";
    }

    return {
      rows: [row],
    };
  }
}

async function run() {
  assert.match(
    CONTROLLED_PILOT_RESUME_CONSUME_ONCE_SQL,
    /on conflict \(token_id\)/i,
  );

  assert.match(
    CONTROLLED_PILOT_RESUME_CONSUME_ONCE_SQL,
    /consumption_attempt_id/i,
  );

  assert.match(
    CONTROLLED_PILOT_RESUME_CONSUME_ONCE_SQL,
    /returning/i,
  );

  const insertDatabase =
    new FakeDatabase("insert");

  const insertLedger =
    new PostgresControlledPilotResumeProofLedger(
      insertDatabase,
      () => attemptId,
    );

  const inserted =
    await insertLedger.consumeOnce(record);

  assert.deepEqual(inserted, {
    status: "consumed",
    consumedAt: 20_050,
  });

  assert.equal(insertDatabase.calls.length, 1);
  assert.equal(
    insertDatabase.calls[0].values[0],
    record.tokenId,
  );
  assert.equal(
    insertDatabase.calls[0].values[1],
    record.tenantId,
  );
  assert.equal(
    insertDatabase.calls[0].values[7],
    attemptId,
  );

  const replayLedger =
    new PostgresControlledPilotResumeProofLedger(
      new FakeDatabase("replay"),
      () => attemptId,
    );

  const replayed =
    await replayLedger.consumeOnce(record);

  assert.deepEqual(replayed, {
    status: "already-consumed",
    consumedAt: 20_050,
  });

  const conflictLedger =
    new PostgresControlledPilotResumeProofLedger(
      new FakeDatabase("conflict"),
      () => attemptId,
    );

  const conflicted =
    await conflictLedger.consumeOnce(record);

  assert.deepEqual(conflicted, {
    status: "binding-conflict",
  });

  const unavailableLedger =
    new PostgresControlledPilotResumeProofLedger(
      new FakeDatabase("throw"),
      () => attemptId,
    );

  const unavailable =
    await unavailableLedger.consumeOnce(record);

  assert.deepEqual(unavailable, {
    status: "ledger-unavailable",
  });

  const emptyLedger =
    new PostgresControlledPilotResumeProofLedger(
      new FakeDatabase("empty"),
      () => attemptId,
    );

  const empty =
    await emptyLedger.consumeOnce(record);

  assert.deepEqual(empty, {
    status: "ledger-unavailable",
  });

  const invalidRowLedger =
    new PostgresControlledPilotResumeProofLedger(
      new FakeDatabase("invalid-row"),
      () => attemptId,
    );

  const invalidRow =
    await invalidRowLedger.consumeOnce(record);

  assert.deepEqual(invalidRow, {
    status: "ledger-unavailable",
  });

  const invalidRecord =
    await insertLedger.consumeOnce({
      ...record,
      consumedAt: record.expiresAt,
    });

  assert.deepEqual(invalidRecord, {
    status: "ledger-unavailable",
  });

  const migration = fs.readFileSync(
    path.resolve(migrationPath),
    "utf8",
  );

  assert.match(
    migration,
    /token_id uuid primary key/i,
  );

  assert.match(
    migration,
    /consumption_attempt_id uuid not null unique/i,
  );

  assert.match(
    migration,
    /enable row level security/i,
  );

  assert.match(
    migration,
    /force row level security/i,
  );

  assert.match(
    migration,
    /revoke all[\s\S]*from public/i,
  );

  assert.match(
    migration,
    /service_role/i,
  );

  assert.match(
    migration,
    /consumed_at_epoch >= issued_at_epoch/i,
  );

  assert.match(
    migration,
    /consumed_at_epoch < expires_at_epoch/i,
  );

  console.log(
    "DAY 724 TARGETED TEST PASS: persistent schema, server-only access, atomic first-consumption detection, replay blocking, tenant binding conflict and database fail-closed handling verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
