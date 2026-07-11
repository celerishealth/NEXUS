const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledModulePath = process.argv[2];
const migrationPath = process.argv[3];

if (!compiledModulePath || !migrationPath) {
  throw new Error(
    "Compiled Day 725 module path or migration path was not provided.",
  );
}

const {
  SupabaseControlledPilotResumeProofLedger,
  createSupabaseControlledPilotResumeLedgerFromEnvironment,
} = require(path.resolve(compiledModulePath));

const serviceRoleKey =
  "day-725-server-only-service-role-key-that-is-long-enough";

const attemptId =
  "55555555-5555-4555-8555-555555555555";

const record = {
  tokenId:
    "44444444-4444-4444-8444-444444444444",
  tenantId: "tenant-725",
  signalId: "signal-725",
  ownerId: "owner-725",
  issuedAt: 30_000,
  expiresAt: 30_120,
  consumedAt: 30_050,
};

function createResponse(
  ok,
  payload,
  status = ok ? 200 : 500,
) {
  return {
    ok,
    status,
    async json() {
      return payload;
    },
  };
}

async function run() {
  const requests = [];

  const successfulFetch =
    async (url, options) => {
      requests.push({
        url,
        options,
      });

      return createResponse(true, [
        {
          status: "consumed",
          consumed_at_epoch: "30050",
        },
      ]);
    };

  const ledger =
    new SupabaseControlledPilotResumeProofLedger({
      supabaseUrl:
        "https://example-project.supabase.co/",
      serviceRoleKey,
      fetchFunction: successfulFetch,
      timeoutMs: 1_000,
      createAttemptId: () => attemptId,
    });

  const consumed =
    await ledger.consumeOnce(record);

  assert.deepEqual(consumed, {
    status: "consumed",
    consumedAt: 30_050,
  });

  assert.equal(requests.length, 1);

  assert.equal(
    requests[0].url,
    "https://example-project.supabase.co/rest/v1/rpc/nexus_consume_controlled_pilot_resume_proof",
  );

  assert.equal(
    requests[0].options.method,
    "POST",
  );

  assert.equal(
    requests[0].options.headers.apikey,
    serviceRoleKey,
  );

  assert.equal(
    requests[0].options.headers.Authorization,
    `Bearer ${serviceRoleKey}`,
  );

  assert.equal(
    requests[0].options.cache,
    "no-store",
  );

  const requestBody = JSON.parse(
    requests[0].options.body,
  );

  assert.equal(
    requestBody.p_token_id,
    record.tokenId,
  );

  assert.equal(
    requestBody.p_tenant_id,
    record.tenantId,
  );

  assert.equal(
    requestBody.p_signal_id,
    record.signalId,
  );

  assert.equal(
    requestBody.p_owner_id,
    record.ownerId,
  );

  assert.equal(
    requestBody.p_consumption_attempt_id,
    attemptId,
  );

  const replayLedger =
    new SupabaseControlledPilotResumeProofLedger({
      supabaseUrl:
        "https://example-project.supabase.co",
      serviceRoleKey,
      fetchFunction: async () =>
        createResponse(true, [
          {
            status: "already-consumed",
            consumed_at_epoch: 30_050,
          },
        ]),
      createAttemptId: () => attemptId,
    });

  assert.deepEqual(
    await replayLedger.consumeOnce(record),
    {
      status: "already-consumed",
      consumedAt: 30_050,
    },
  );

  const conflictLedger =
    new SupabaseControlledPilotResumeProofLedger({
      supabaseUrl:
        "https://example-project.supabase.co",
      serviceRoleKey,
      fetchFunction: async () =>
        createResponse(true, [
          {
            status: "binding-conflict",
            consumed_at_epoch: null,
          },
        ]),
      createAttemptId: () => attemptId,
    });

  assert.deepEqual(
    await conflictLedger.consumeOnce(record),
    {
      status: "binding-conflict",
    },
  );

  const failedResponseLedger =
    new SupabaseControlledPilotResumeProofLedger({
      supabaseUrl:
        "https://example-project.supabase.co",
      serviceRoleKey,
      fetchFunction: async () =>
        createResponse(false, {
          message: "database unavailable",
        }),
      createAttemptId: () => attemptId,
    });

  assert.deepEqual(
    await failedResponseLedger.consumeOnce(record),
    {
      status: "ledger-unavailable",
    },
  );

  const throwingLedger =
    new SupabaseControlledPilotResumeProofLedger({
      supabaseUrl:
        "https://example-project.supabase.co",
      serviceRoleKey,
      fetchFunction: async () => {
        throw new Error(
          "simulated network failure",
        );
      },
      createAttemptId: () => attemptId,
    });

  assert.deepEqual(
    await throwingLedger.consumeOnce(record),
    {
      status: "ledger-unavailable",
    },
  );

  const malformedLedger =
    new SupabaseControlledPilotResumeProofLedger({
      supabaseUrl:
        "https://example-project.supabase.co",
      serviceRoleKey,
      fetchFunction: async () =>
        createResponse(true, [
          {
            status: "consumed",
            consumed_at_epoch: "invalid",
          },
        ]),
      createAttemptId: () => attemptId,
    });

  assert.deepEqual(
    await malformedLedger.consumeOnce(record),
    {
      status: "ledger-unavailable",
    },
  );

  const invalidRecord =
    await ledger.consumeOnce({
      ...record,
      consumedAt: record.expiresAt,
    });

  assert.deepEqual(invalidRecord, {
    status: "ledger-unavailable",
  });

  const missingUrl =
    createSupabaseControlledPilotResumeLedgerFromEnvironment(
      {
        SUPABASE_SERVICE_ROLE_KEY:
          serviceRoleKey,
      },
      successfulFetch,
    );

  assert.equal(missingUrl.ok, false);
  assert.equal(
    missingUrl.code,
    "SUPABASE_URL_MISSING",
  );

  const missingKey =
    createSupabaseControlledPilotResumeLedgerFromEnvironment(
      {
        SUPABASE_URL:
          "https://example-project.supabase.co",
      },
      successfulFetch,
    );

  assert.equal(missingKey.ok, false);
  assert.equal(
    missingKey.code,
    "SUPABASE_SERVICE_ROLE_KEY_MISSING",
  );

  const validFactory =
    createSupabaseControlledPilotResumeLedgerFromEnvironment(
      {
        SUPABASE_URL:
          "https://example-project.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY:
          serviceRoleKey,
      },
      successfulFetch,
    );

  assert.equal(validFactory.ok, true);

  const migration = fs.readFileSync(
    path.resolve(migrationPath),
    "utf8",
  );

  assert.match(
    migration,
    /security definer/i,
  );

  assert.match(
    migration,
    /set search_path = public, pg_temp/i,
  );

  assert.match(
    migration,
    /on conflict \(token_id\)[\s\S]*do nothing/i,
  );

  assert.match(
    migration,
    /binding-conflict/i,
  );

  assert.match(
    migration,
    /already-consumed/i,
  );

  assert.match(
    migration,
    /revoke all[\s\S]*from public/i,
  );

  assert.match(
    migration,
    /from authenticated/i,
  );

  assert.match(
    migration,
    /grant execute[\s\S]*to service_role/i,
  );

  console.log(
    "DAY 725 TARGETED TEST PASS: server-only Supabase RPC integration, atomic consumption, replay detection, tenant/signal binding conflict, environment validation and network/database fail-closed handling verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
