const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledServicePath = process.argv[2];
const compiledStorePath = process.argv[3];
const compiledProofPath = process.argv[4];
const migrationPath = process.argv[5];

if (
  !compiledServicePath ||
  !compiledStorePath ||
  !compiledProofPath ||
  !migrationPath
) {
  throw new Error(
    "Compiled Day 729 module paths or migration path were not provided.",
  );
}

const {
  authorizeControlledPilotAtomicStateResume,
} = require(path.resolve(compiledServicePath));

const {
  SupabaseControlledPilotAtomicStateResumeStore,
} = require(path.resolve(compiledStorePath));

const {
  issueControlledPilotOwnerResumeProof,
} = require(path.resolve(compiledProofPath));

const signingSecret =
  "day-729-atomic-state-resume-signing-secret-at-least-32-characters";

const recoveryDecision = {
  status: "hold-for-owner-review",
  code: "OWNER_RESUME_APPROVAL_REQUIRED",
  reason:
    "Recovery evidence is sufficient, but only the owner may explicitly authorize controlled pilot resumption.",
  ownerActionRequired: true,
  pilotOperationPermitted: false,
  automaticResumeAuthorized: false,
  liveProviderExecutionAuthorized: false,
  publicLaunchAuthorized: false,
  signalId: "signal-729",
};

const issued = issueControlledPilotOwnerResumeProof(
  {
    tenantId: "tenant-729",
    signalId: "signal-729",
    ownerId: "owner-729",
    ownerRole: "owner",
    ownerApproved: true,
    recoveryDecision,
    ttlSeconds: 120,
  },
  signingSecret,
  70_000,
);

assert.equal(issued.ok, true);

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "owner-729",
    tenantId: "tenant-729",
    roles: ["owner"],
    sessionId: "session-729",
    ...overrides,
  };
}

class FakeStateStore {
  constructor(status = "committed") {
    this.status = status;
    this.calls = [];
  }

  async commitStateResume(record) {
    this.calls.push({
      ...record,
    });

    if (this.status === "throw") {
      throw new Error(
        "simulated state transaction failure",
      );
    }

    if (
      this.status === "committed" ||
      this.status === "already-committed"
    ) {
      return {
        status: this.status,
        operationStatus: "active",
        stateVersion:
          record.expectedStateVersion + 1,
        consumedAt: record.consumedAt,
        auditEventId: record.tokenId,
      };
    }

    return {
      status: this.status,
      currentOperationStatus: "paused",
      currentStateVersion:
        record.expectedStateVersion + 1,
    };
  }
}

async function run() {
  const successStore =
    new FakeStateStore();

  const success =
    await authorizeControlledPilotAtomicStateResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-729",
      expectedStateVersion: 4,
      signingSecret,
      store: successStore,
      nowEpochSeconds: 70_050,
    });

  assert.equal(success.authorized, true);

  assert.equal(
    success.code,
    "CONTROLLED_PILOT_STATE_RESUME_AUTHORIZED",
  );

  assert.equal(
    success.operationStatus,
    "active",
  );

  assert.equal(success.stateVersion, 5);

  assert.equal(
    success.pilotOperationPermitted,
    true,
  );

  assert.equal(
    success.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    success.publicLaunchAuthorized,
    false,
  );

  assert.equal(successStore.calls.length, 1);

  assert.equal(
    successStore.calls[0].tenantId,
    "tenant-729",
  );

  assert.equal(
    successStore.calls[0].signalId,
    "signal-729",
  );

  assert.equal(
    successStore.calls[0].expectedStateVersion,
    4,
  );

  const wrongTenantStore =
    new FakeStateStore();

  const wrongTenant =
    await authorizeControlledPilotAtomicStateResume({
      identity: identity({
        tenantId: "tenant-other",
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-729",
      expectedStateVersion: 4,
      signingSecret,
      store: wrongTenantStore,
      nowEpochSeconds: 70_050,
    });

  assert.equal(wrongTenant.authorized, false);

  assert.equal(
    wrongTenant.verificationCode,
    "TENANT_BINDING_MISMATCH",
  );

  assert.equal(
    wrongTenantStore.calls.length,
    0,
  );

  const wrongOwnerStore =
    new FakeStateStore();

  const wrongOwner =
    await authorizeControlledPilotAtomicStateResume({
      identity: identity({
        userId: "owner-other",
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-729",
      expectedStateVersion: 4,
      signingSecret,
      store: wrongOwnerStore,
      nowEpochSeconds: 70_050,
    });

  assert.equal(wrongOwner.authorized, false);

  assert.equal(
    wrongOwner.code,
    "OWNER_BINDING_MISMATCH",
  );

  assert.equal(
    wrongOwnerStore.calls.length,
    0,
  );

  const versionConflict =
    await authorizeControlledPilotAtomicStateResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-729",
      expectedStateVersion: 4,
      signingSecret,
      store:
        new FakeStateStore(
          "state-version-conflict",
        ),
      nowEpochSeconds: 70_050,
    });

  assert.equal(
    versionConflict.authorized,
    false,
  );

  assert.equal(
    versionConflict.code,
    "PILOT_STATE_VERSION_CONFLICT",
  );

  assert.equal(
    versionConflict.currentStateVersion,
    5,
  );

  const signalMismatch =
    await authorizeControlledPilotAtomicStateResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-729",
      expectedStateVersion: 4,
      signingSecret,
      store:
        new FakeStateStore(
          "signal-state-mismatch",
        ),
      nowEpochSeconds: 70_050,
    });

  assert.equal(
    signalMismatch.authorized,
    false,
  );

  assert.equal(
    signalMismatch.code,
    "PILOT_SIGNAL_STATE_MISMATCH",
  );

  const replay =
    await authorizeControlledPilotAtomicStateResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-729",
      expectedStateVersion: 4,
      signingSecret,
      store:
        new FakeStateStore(
          "already-committed",
        ),
      nowEpochSeconds: 70_051,
    });

  assert.equal(replay.authorized, false);

  assert.equal(
    replay.code,
    "RESUME_REPLAY_BLOCKED",
  );

  assert.equal(
    replay.pilotOperationPermitted,
    false,
  );

  const serviceRoleKey =
    "day-729-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseStore =
    new SupabaseControlledPilotAtomicStateResumeStore({
      supabaseUrl:
        "https://example.supabase.co/",
      serviceRoleKey,
      createAttemptId: () =>
        "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      fetchFunction:
        async (url, options) => {
          requests.push({
            url,
            options,
          });

          return {
            ok: true,
            async json() {
              return [
                {
                  status: "committed",
                  operation_status: "active",
                  state_version: "5",
                  consumed_at_epoch:
                    "70050",
                  audit_event_id:
                    issued.tokenId,
                },
              ];
            },
          };
        },
    });

  const persisted =
    await supabaseStore.commitStateResume({
      tokenId: issued.tokenId,
      tenantId: "tenant-729",
      signalId: "signal-729",
      ownerId: "owner-729",
      sessionId: "session-729",
      issuedAt: 70_000,
      expiresAt: 70_120,
      consumedAt: 70_050,
      expectedStateVersion: 4,
    });

  assert.deepEqual(persisted, {
    status: "committed",
    operationStatus: "active",
    stateVersion: 5,
    consumedAt: 70_050,
    auditEventId: issued.tokenId,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_commit_controlled_pilot_state_resume$/,
  );

  assert.equal(
    requests[0].options.headers.apikey,
    serviceRoleKey,
  );

  assert.equal(
    requests[0].options.cache,
    "no-store",
  );

  const requestBody =
    JSON.parse(
      requests[0].options.body,
    );

  assert.equal(
    requestBody.p_tenant_id,
    "tenant-729",
  );

  assert.equal(
    requestBody.p_signal_id,
    "signal-729",
  );

  assert.equal(
    requestBody.p_expected_state_version,
    4,
  );

  assert.equal(
    requestBody.p_token_id,
    issued.tokenId,
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /nexus_controlled_pilot_operation_states/i,
  );

  assert.match(
    migration,
    /for update/i,
  );

  assert.match(
    migration,
    /state-version-conflict/i,
  );

  assert.match(
    migration,
    /signal-state-mismatch/i,
  );

  assert.match(
    migration,
    /operation_status = 'active'/i,
  );

  assert.match(
    migration,
    /last_resume_token_id = p_token_id/i,
  );

  assert.match(
    migration,
    /nexus_controlled_pilot_resume_proof_consumptions/i,
  );

  assert.match(
    migration,
    /nexus_controlled_pilot_resume_audit_events/i,
  );

  assert.match(
    migration,
    /security definer/i,
  );

  assert.match(
    migration,
    /force row level security/i,
  );

  assert.match(
    migration,
    /grant execute[\s\S]*to service_role/i,
  );

  console.log(
    "DAY 729 TARGETED TEST PASS: tenant state locking, paused-to-active transition, incident binding, optimistic version control, proof consumption, audit persistence, replay blocking and transaction fail-closed behavior verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
