const assert = require("node:assert/strict");
const path = require("node:path");

const compiledServicePath = process.argv[2];
const compiledProofPath = process.argv[3];

if (!compiledServicePath || !compiledProofPath) {
  throw new Error(
    "Compiled Day 726 service or proof module path was not provided.",
  );
}

const {
  authorizeAuthenticatedControlledPilotOwnerResume,
} = require(path.resolve(compiledServicePath));

const {
  issueControlledPilotOwnerResumeProof,
} = require(path.resolve(compiledProofPath));

const signingSecret =
  "day-726-owner-resume-signing-secret-at-least-32-characters";

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
  signalId: "signal-726",
};

const issued = issueControlledPilotOwnerResumeProof(
  {
    tenantId: "tenant-726",
    signalId: "signal-726",
    ownerId: "owner-726",
    ownerRole: "owner",
    ownerApproved: true,
    recoveryDecision,
    ttlSeconds: 120,
  },
  signingSecret,
  40_000,
);

assert.equal(issued.ok, true);

class AtomicTestLedger {
  constructor() {
    this.records = new Map();
    this.consumeCalls = 0;
  }

  async consumeOnce(record) {
    this.consumeCalls += 1;

    const existing =
      this.records.get(record.tokenId);

    if (existing) {
      const sameBinding =
        existing.tenantId ===
          record.tenantId &&
        existing.signalId ===
          record.signalId &&
        existing.ownerId ===
          record.ownerId;

      if (!sameBinding) {
        return {
          status: "binding-conflict",
        };
      }

      return {
        status: "already-consumed",
        consumedAt:
          existing.consumedAt,
      };
    }

    this.records.set(
      record.tokenId,
      {
        ...record,
      },
    );

    return {
      status: "consumed",
      consumedAt:
        record.consumedAt,
    };
  }
}

function createIdentity(overrides = {}) {
  return {
    authenticated: true,
    userId: "owner-726",
    tenantId: "tenant-726",
    roles: ["owner"],
    sessionId: "session-726",
    ...overrides,
  };
}

async function run() {
  const unauthenticatedLedger =
    new AtomicTestLedger();

  const unauthenticated =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity({
        authenticated: false,
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger:
        unauthenticatedLedger,
      nowEpochSeconds: 40_050,
    });

  assert.equal(
    unauthenticated.authorized,
    false,
  );

  assert.equal(
    unauthenticated.code,
    "AUTHENTICATION_REQUIRED",
  );

  assert.equal(
    unauthenticatedLedger.consumeCalls,
    0,
  );

  const nonOwnerLedger =
    new AtomicTestLedger();

  const nonOwner =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity({
        roles: ["operator"],
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger: nonOwnerLedger,
      nowEpochSeconds: 40_050,
    });

  assert.equal(nonOwner.authorized, false);

  assert.equal(
    nonOwner.code,
    "TENANT_OWNER_ROLE_REQUIRED",
  );

  assert.equal(
    nonOwnerLedger.consumeCalls,
    0,
  );

  const wrongTenantLedger =
    new AtomicTestLedger();

  const wrongTenant =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity({
        tenantId: "tenant-other",
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger: wrongTenantLedger,
      nowEpochSeconds: 40_050,
    });

  assert.equal(
    wrongTenant.authorized,
    false,
  );

  assert.equal(
    wrongTenant.code,
    "SIGNED_PROOF_REJECTED",
  );

  assert.equal(
    wrongTenant.verificationCode,
    "TENANT_BINDING_MISMATCH",
  );

  assert.equal(
    wrongTenantLedger.consumeCalls,
    0,
  );

  const wrongOwnerLedger =
    new AtomicTestLedger();

  const wrongOwner =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity({
        userId: "different-owner",
      }),
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger: wrongOwnerLedger,
      nowEpochSeconds: 40_050,
    });

  assert.equal(
    wrongOwner.authorized,
    false,
  );

  assert.equal(
    wrongOwner.code,
    "OWNER_BINDING_MISMATCH",
  );

  assert.equal(
    wrongOwnerLedger.consumeCalls,
    0,
  );

  const wrongSignalLedger =
    new AtomicTestLedger();

  const wrongSignal =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-other",
      signingSecret,
      ledger: wrongSignalLedger,
      nowEpochSeconds: 40_050,
    });

  assert.equal(
    wrongSignal.authorized,
    false,
  );

  assert.equal(
    wrongSignal.verificationCode,
    "SIGNAL_BINDING_MISMATCH",
  );

  assert.equal(
    wrongSignalLedger.consumeCalls,
    0,
  );

  const authorizedLedger =
    new AtomicTestLedger();

  const authorized =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger: authorizedLedger,
      nowEpochSeconds: 40_050,
    });

  assert.equal(
    authorized.authorized,
    true,
  );

  assert.equal(
    authorized.code,
    "AUTHENTICATED_OWNER_RESUME_AUTHORIZED",
  );

  assert.equal(
    authorized.tenantId,
    "tenant-726",
  );

  assert.equal(
    authorized.ownerId,
    "owner-726",
  );

  assert.equal(
    authorized.signalId,
    "signal-726",
  );

  assert.equal(
    authorized.tokenId,
    issued.tokenId,
  );

  assert.equal(
    authorized.pilotOperationPermitted,
    true,
  );

  assert.equal(
    authorized.automaticResumeAuthorized,
    false,
  );

  assert.equal(
    authorized.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    authorized.publicLaunchAuthorized,
    false,
  );

  assert.equal(
    authorizedLedger.consumeCalls,
    1,
  );

  const replay =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger: authorizedLedger,
      nowEpochSeconds: 40_051,
    });

  assert.equal(replay.authorized, false);

  assert.equal(
    replay.code,
    "RESUME_AUTHORIZATION_REJECTED",
  );

  assert.equal(
    replay.authorizationCode,
    "PROOF_ALREADY_CONSUMED",
  );

  assert.equal(
    replay.pilotOperationPermitted,
    false,
  );

  assert.equal(
    authorizedLedger.consumeCalls,
    2,
  );

  const expiredLedger =
    new AtomicTestLedger();

  const expired =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: createIdentity(),
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger: expiredLedger,
      nowEpochSeconds: 40_121,
    });

  assert.equal(expired.authorized, false);

  assert.equal(
    expired.verificationCode,
    "TOKEN_EXPIRED",
  );

  assert.equal(
    expiredLedger.consumeCalls,
    0,
  );

  const invalidIdentityLedger =
    new AtomicTestLedger();

  const invalidIdentity =
    await authorizeAuthenticatedControlledPilotOwnerResume({
      identity: {
        authenticated: true,
        userId: "",
        tenantId: "tenant-726",
        roles: ["owner"],
      },
      proofToken: issued.token,
      expectedSignalId:
        "signal-726",
      signingSecret,
      ledger:
        invalidIdentityLedger,
      nowEpochSeconds: 40_050,
    });

  assert.equal(
    invalidIdentity.authorized,
    false,
  );

  assert.equal(
    invalidIdentity.code,
    "INVALID_TRUSTED_IDENTITY",
  );

  assert.equal(
    invalidIdentityLedger.consumeCalls,
    0,
  );

  console.log(
    "DAY 726 TARGETED TEST PASS: trusted authentication, tenant-owner role, tenant binding, owner binding, signal binding, pre-consumption rejection, atomic consumption and replay blocking verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
