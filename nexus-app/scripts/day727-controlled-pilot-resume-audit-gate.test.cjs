const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledAuditGatePath = process.argv[2];
const compiledAuditSinkPath = process.argv[3];
const compiledProofPath = process.argv[4];
const migrationPath = process.argv[5];

if (
  !compiledAuditGatePath ||
  !compiledAuditSinkPath ||
  !compiledProofPath ||
  !migrationPath
) {
  throw new Error(
    "Compiled Day 727 module paths or migration path were not provided.",
  );
}

const {
  authorizeAndAuditControlledPilotOwnerResume,
} = require(path.resolve(compiledAuditGatePath));

const {
  SupabaseControlledPilotResumeAuditSink,
} = require(path.resolve(compiledAuditSinkPath));

const {
  issueControlledPilotOwnerResumeProof,
} = require(path.resolve(compiledProofPath));

const signingSecret =
  "day-727-owner-resume-signing-secret-at-least-32-characters";

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
  signalId: "signal-727",
};

function issueProof() {
  return issueControlledPilotOwnerResumeProof(
    {
      tenantId: "tenant-727",
      signalId: "signal-727",
      ownerId: "owner-727",
      ownerRole: "owner",
      ownerApproved: true,
      recoveryDecision,
      ttlSeconds: 120,
    },
    signingSecret,
    50_000,
  );
}

class AtomicLedger {
  constructor() {
    this.records = new Map();
  }

  async consumeOnce(record) {
    const existing =
      this.records.get(record.tokenId);

    if (existing) {
      return {
        status: "already-consumed",
        consumedAt:
          existing.consumedAt,
      };
    }

    this.records.set(record.tokenId, {
      ...record,
    });

    return {
      status: "consumed",
      consumedAt:
        record.consumedAt,
    };
  }
}

class AuditSink {
  constructor(mode = "recorded") {
    this.mode = mode;
    this.records = [];
  }

  async appendOnce(record) {
    this.records.push({
      ...record,
    });

    if (this.mode === "throw") {
      throw new Error(
        "simulated audit failure",
      );
    }

    if (this.mode === "unavailable") {
      return {
        status: "audit-unavailable",
      };
    }

    if (this.mode === "conflict") {
      return {
        status: "binding-conflict",
      };
    }

    return {
      status: this.mode,
      eventId: record.eventId,
    };
  }
}

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "owner-727",
    tenantId: "tenant-727",
    roles: ["owner"],
    sessionId: "session-727",
    ...overrides,
  };
}

async function run() {
  const issued = issueProof();

  assert.equal(issued.ok, true);

  const successAuditSink =
    new AuditSink();

  const success =
    await authorizeAndAuditControlledPilotOwnerResume({
      identity: identity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-727",
      signingSecret,
      ledger: new AtomicLedger(),
      auditSink:
        successAuditSink,
      nowEpochSeconds: 50_050,
      createAuditEventId: () =>
        "77777777-7777-4777-8777-777777777777",
    });

  assert.equal(success.authorized, true);

  assert.equal(
    success.code,
    "AUDITED_AUTHENTICATED_OWNER_RESUME_AUTHORIZED",
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
    successAuditSink.records.length,
    1,
  );

  assert.equal(
    successAuditSink.records[0].authorized,
    true,
  );

  assert.equal(
    successAuditSink.records[0].tenantId,
    "tenant-727",
  );

  assert.equal(
    successAuditSink.records[0].tokenId,
    issued.tokenId,
  );

  const rejectedAuditSink =
    new AuditSink();

  const rejected =
    await authorizeAndAuditControlledPilotOwnerResume({
      identity: identity({
        userId: "wrong-owner",
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-727",
      signingSecret,
      ledger: new AtomicLedger(),
      auditSink:
        rejectedAuditSink,
      nowEpochSeconds: 50_050,
      createAuditEventId: () =>
        "88888888-8888-4888-8888-888888888888",
    });

  assert.equal(rejected.authorized, false);

  assert.equal(
    rejected.code,
    "AUDITED_RESUME_REJECTED",
  );

  assert.equal(
    rejected.resumeCode,
    "OWNER_BINDING_MISMATCH",
  );

  assert.equal(
    rejectedAuditSink.records.length,
    1,
  );

  assert.equal(
    rejectedAuditSink.records[0].authorized,
    false,
  );

  assert.equal(
    rejectedAuditSink.records[0]
      .pilotOperationPermitted,
    false,
  );

  const auditFailureProof =
    issueProof();

  assert.equal(
    auditFailureProof.ok,
    true,
  );

  const auditFailureLedger =
    new AtomicLedger();

  const auditFailure =
    await authorizeAndAuditControlledPilotOwnerResume({
      identity: identity(),
      proofToken:
        auditFailureProof.token,
      expectedSignalId:
        "signal-727",
      signingSecret,
      ledger:
        auditFailureLedger,
      auditSink:
        new AuditSink("unavailable"),
      nowEpochSeconds: 50_050,
      createAuditEventId: () =>
        "99999999-9999-4999-8999-999999999999",
    });

  assert.equal(
    auditFailure.authorized,
    false,
  );

  assert.equal(
    auditFailure.code,
    "AUDIT_PERSISTENCE_REQUIRED",
  );

  assert.equal(
    auditFailure.pilotOperationPermitted,
    false,
  );

  assert.equal(
    auditFailureLedger.records.size,
    1,
  );

  const replayAfterAuditFailure =
    await authorizeAndAuditControlledPilotOwnerResume({
      identity: identity(),
      proofToken:
        auditFailureProof.token,
      expectedSignalId:
        "signal-727",
      signingSecret,
      ledger:
        auditFailureLedger,
      auditSink: new AuditSink(),
      nowEpochSeconds: 50_051,
      createAuditEventId: () =>
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });

  assert.equal(
    replayAfterAuditFailure.authorized,
    false,
  );

  assert.equal(
    replayAfterAuditFailure.code,
    "AUDITED_RESUME_REJECTED",
  );

  assert.equal(
    replayAfterAuditFailure.resumeCode,
    "RESUME_AUTHORIZATION_REJECTED",
  );

  const serviceRoleKey =
    "day-727-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseAuditSink =
    new SupabaseControlledPilotResumeAuditSink({
      supabaseUrl:
        "https://example.supabase.co/",
      serviceRoleKey,
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
                  status: "recorded",
                  stored_event_id:
                    "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
                },
              ];
            },
          };
        },
      timeoutMs: 1_000,
    });

  const auditRecord = {
    eventId:
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    tenantId: "tenant-727",
    ownerId: "owner-727",
    signalId: "signal-727",
    tokenId:
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    sessionId: "session-727",
    outcomeCode:
      "AUTHENTICATED_OWNER_RESUME_AUTHORIZED",
    authorized: true,
    pilotOperationPermitted: true,
    attemptedAt: 50_050,
  };

  const persisted =
    await supabaseAuditSink.appendOnce(
      auditRecord,
    );

  assert.deepEqual(persisted, {
    status: "recorded",
    eventId: auditRecord.eventId,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_append_controlled_pilot_resume_audit_event$/,
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
    "tenant-727",
  );

  assert.equal(
    requestBody.p_authorized,
    true,
  );

  assert.equal(
    requestBody.p_pilot_operation_permitted,
    true,
  );

  const failingSupabaseSink =
    new SupabaseControlledPilotResumeAuditSink({
      supabaseUrl:
        "https://example.supabase.co",
      serviceRoleKey,
      fetchFunction: async () => ({
        ok: false,
        async json() {
          return {
            message:
              "database unavailable",
          };
        },
      }),
    });

  assert.deepEqual(
    await failingSupabaseSink.appendOnce(
      auditRecord,
    ),
    {
      status: "audit-unavailable",
    },
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /create table if not exists[\s\S]*nexus_controlled_pilot_resume_audit_events/i,
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
    /security definer/i,
  );

  assert.match(
    migration,
    /on conflict \(event_id\)[\s\S]*do nothing/i,
  );

  assert.match(
    migration,
    /binding-conflict/i,
  );

  assert.match(
    migration,
    /grant execute[\s\S]*to service_role/i,
  );

  assert.match(
    migration,
    /from authenticated/i,
  );

  console.log(
    "DAY 727 TARGETED TEST PASS: successful and rejected resume auditing, persistent server-only RPC, no-unaudited-resume enforcement, consumed-proof fail-closed handling and public/provider execution blocking verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
