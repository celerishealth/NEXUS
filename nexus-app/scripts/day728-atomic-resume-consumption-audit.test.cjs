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
    "Compiled Day 728 module paths or migration path were not provided.",
  );
}

const {
  authorizeAtomicAuditedControlledPilotResume,
} = require(path.resolve(compiledServicePath));

const {
  SupabaseControlledPilotAtomicResumeCommitStore,
} = require(path.resolve(compiledStorePath));

const {
  issueControlledPilotOwnerResumeProof,
} = require(path.resolve(compiledProofPath));

const signingSecret =
  "day-728-atomic-resume-signing-secret-at-least-32-characters";

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
  signalId: "signal-728",
};

const issued = issueControlledPilotOwnerResumeProof(
  {
    tenantId: "tenant-728",
    signalId: "signal-728",
    ownerId: "owner-728",
    ownerRole: "owner",
    ownerApproved: true,
    recoveryDecision,
    ttlSeconds: 120,
  },
  signingSecret,
  60_000,
);

assert.equal(issued.ok, true);

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "owner-728",
    tenantId: "tenant-728",
    roles: ["owner"],
    sessionId: "session-728",
    ...overrides,
  };
}

class FakeCommitStore {
  constructor(status = "committed") {
    this.status = status;
    this.calls = [];
  }

  async commit(record) {
    this.calls.push({
      ...record,
    });

    if (this.status === "throw") {
      throw new Error(
        "simulated atomic transaction failure",
      );
    }

    if (this.status === "committed") {
      return {
        status: "committed",
        tokenId: record.tokenId,
        consumedAt: record.consumedAt,
        auditEventId: record.tokenId,
      };
    }

    if (
      this.status === "already-committed"
    ) {
      return {
        status: "already-committed",
        tokenId: record.tokenId,
        consumedAt: record.consumedAt,
        auditEventId: record.tokenId,
      };
    }

    return {
      status: this.status,
    };
  }
}

async function run() {
  const successStore =
    new FakeCommitStore();

  const success =
    await authorizeAtomicAuditedControlledPilotResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-728",
      signingSecret,
      commitStore: successStore,
      nowEpochSeconds: 60_050,
    });

  assert.equal(success.authorized, true);

  assert.equal(
    success.code,
    "ATOMIC_AUDITED_OWNER_RESUME_AUTHORIZED",
  );

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

  assert.equal(
    success.auditEventId,
    issued.tokenId,
  );

  assert.equal(successStore.calls.length, 1);

  assert.equal(
    successStore.calls[0].tenantId,
    "tenant-728",
  );

  assert.equal(
    successStore.calls[0].ownerId,
    "owner-728",
  );

  assert.equal(
    successStore.calls[0].sessionId,
    "session-728",
  );

  const wrongTenantStore =
    new FakeCommitStore();

  const wrongTenant =
    await authorizeAtomicAuditedControlledPilotResume({
      identity: identity({
        tenantId: "tenant-other",
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-728",
      signingSecret,
      commitStore: wrongTenantStore,
      nowEpochSeconds: 60_050,
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
    new FakeCommitStore();

  const wrongOwner =
    await authorizeAtomicAuditedControlledPilotResume({
      identity: identity({
        userId: "owner-other",
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-728",
      signingSecret,
      commitStore: wrongOwnerStore,
      nowEpochSeconds: 60_050,
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

  const replay =
    await authorizeAtomicAuditedControlledPilotResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-728",
      signingSecret,
      commitStore:
        new FakeCommitStore(
          "already-committed",
        ),
      nowEpochSeconds: 60_051,
    });

  assert.equal(replay.authorized, false);

  assert.equal(
    replay.code,
    "ATOMIC_COMMIT_REPLAY_BLOCKED",
  );

  const conflict =
    await authorizeAtomicAuditedControlledPilotResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-728",
      signingSecret,
      commitStore:
        new FakeCommitStore(
          "binding-conflict",
        ),
      nowEpochSeconds: 60_050,
    });

  assert.equal(conflict.authorized, false);

  assert.equal(
    conflict.code,
    "ATOMIC_COMMIT_BINDING_CONFLICT",
  );

  const unavailable =
    await authorizeAtomicAuditedControlledPilotResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-728",
      signingSecret,
      commitStore:
        new FakeCommitStore(
          "commit-unavailable",
        ),
      nowEpochSeconds: 60_050,
    });

  assert.equal(unavailable.authorized, false);

  assert.equal(
    unavailable.code,
    "ATOMIC_COMMIT_REQUIRED",
  );

  assert.equal(
    unavailable.pilotOperationPermitted,
    false,
  );

  const serviceRoleKey =
    "day-728-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseStore =
    new SupabaseControlledPilotAtomicResumeCommitStore({
      supabaseUrl:
        "https://example.supabase.co/",
      serviceRoleKey,
      createAttemptId: () =>
        "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
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
                  consumed_at_epoch:
                    "60050",
                  audit_event_id:
                    issued.tokenId,
                },
              ];
            },
          };
        },
    });

  const persisted =
    await supabaseStore.commit({
      tokenId: issued.tokenId,
      tenantId: "tenant-728",
      signalId: "signal-728",
      ownerId: "owner-728",
      sessionId: "session-728",
      issuedAt: 60_000,
      expiresAt: 60_120,
      consumedAt: 60_050,
    });

  assert.deepEqual(persisted, {
    status: "committed",
    tokenId: issued.tokenId,
    consumedAt: 60_050,
    auditEventId: issued.tokenId,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_commit_controlled_pilot_resume$/,
  );

  assert.equal(
    requests[0].options.headers.apikey,
    serviceRoleKey,
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
    issued.tokenId,
  );

  assert.equal(
    requestBody.p_audit_event_id,
    issued.tokenId,
  );

  assert.equal(
    requestBody.p_tenant_id,
    "tenant-728",
  );

  assert.equal(
    requestBody.p_signal_id,
    "signal-728",
  );

  const migration = fs.readFileSync(
    path.resolve(migrationPath),
    "utf8",
  );

  assert.match(
    migration,
    /nexus_commit_controlled_pilot_resume/i,
  );

  assert.match(
    migration,
    /insert into[\s\S]*nexus_controlled_pilot_resume_proof_consumptions/i,
  );

  assert.match(
    migration,
    /insert into[\s\S]*nexus_controlled_pilot_resume_audit_events/i,
  );

  assert.match(
    migration,
    /p_audit_event_id <> p_token_id/i,
  );

  assert.match(
    migration,
    /already-committed/i,
  );

  assert.match(
    migration,
    /binding-conflict/i,
  );

  assert.match(
    migration,
    /security definer/i,
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
    "DAY 728 TARGETED TEST PASS: authenticated owner verification, atomic proof consumption and audit persistence, transaction replay blocking, deterministic audit identity, tenant-owner-signal binding and fail-closed commit handling verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
