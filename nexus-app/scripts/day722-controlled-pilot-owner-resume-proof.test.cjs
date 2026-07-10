const assert = require("node:assert/strict");
const path = require("node:path");

const compiledModulePath = process.argv[2];

if (!compiledModulePath) {
  throw new Error("Compiled Day 722 module path was not provided.");
}

const {
  issueControlledPilotOwnerResumeProof,
  verifyControlledPilotOwnerResumeProof,
} = require(path.resolve(compiledModulePath));

const signingSecret =
  "day-722-test-secret-must-remain-at-least-32-characters-long";

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
  signalId: "signal-722",
};

const rejectedWithoutOwnerApproval =
  issueControlledPilotOwnerResumeProof(
    {
      tenantId: "tenant-a",
      signalId: "signal-722",
      ownerId: "owner-a",
      ownerRole: "owner",
      ownerApproved: false,
      recoveryDecision,
    },
    signingSecret,
    1_000,
  );

assert.equal(rejectedWithoutOwnerApproval.ok, false);
assert.equal(
  rejectedWithoutOwnerApproval.code,
  "OWNER_APPROVAL_REQUIRED",
);

const rejectedWrongSignal =
  issueControlledPilotOwnerResumeProof(
    {
      tenantId: "tenant-a",
      signalId: "different-signal",
      ownerId: "owner-a",
      ownerRole: "owner",
      ownerApproved: true,
      recoveryDecision,
    },
    signingSecret,
    1_000,
  );

assert.equal(rejectedWrongSignal.ok, false);
assert.equal(
  rejectedWrongSignal.code,
  "RECOVERY_DECISION_NOT_READY",
);

const issued = issueControlledPilotOwnerResumeProof(
  {
    tenantId: "tenant-a",
    signalId: "signal-722",
    ownerId: "owner-a",
    ownerRole: "owner",
    ownerApproved: true,
    recoveryDecision,
    ttlSeconds: 120,
  },
  signingSecret,
  1_000,
);

assert.equal(issued.ok, true);
assert.equal(issued.automaticResumeAuthorized, false);
assert.equal(issued.pilotOperationPermitted, false);
assert.equal(issued.liveProviderExecutionAuthorized, false);
assert.equal(issued.publicLaunchAuthorized, false);

const validVerification =
  verifyControlledPilotOwnerResumeProof({
    token: issued.token,
    signingSecret,
    expectedTenantId: "tenant-a",
    expectedSignalId: "signal-722",
    consumedTokenIds: [],
    nowEpochSeconds: 1_050,
  });

assert.equal(validVerification.valid, true);
assert.equal(
  validVerification.code,
  "SIGNED_OWNER_RESUME_PROOF_VALID",
);
assert.equal(
  validVerification.persistentConsumptionRequired,
  true,
);
assert.equal(validVerification.pilotOperationPermitted, false);

const wrongTenantVerification =
  verifyControlledPilotOwnerResumeProof({
    token: issued.token,
    signingSecret,
    expectedTenantId: "tenant-b",
    expectedSignalId: "signal-722",
    consumedTokenIds: [],
    nowEpochSeconds: 1_050,
  });

assert.equal(wrongTenantVerification.valid, false);
assert.equal(
  wrongTenantVerification.code,
  "TENANT_BINDING_MISMATCH",
);

const wrongSignalVerification =
  verifyControlledPilotOwnerResumeProof({
    token: issued.token,
    signingSecret,
    expectedTenantId: "tenant-a",
    expectedSignalId: "signal-other",
    consumedTokenIds: [],
    nowEpochSeconds: 1_050,
  });

assert.equal(wrongSignalVerification.valid, false);
assert.equal(
  wrongSignalVerification.code,
  "SIGNAL_BINDING_MISMATCH",
);

const expiredVerification =
  verifyControlledPilotOwnerResumeProof({
    token: issued.token,
    signingSecret,
    expectedTenantId: "tenant-a",
    expectedSignalId: "signal-722",
    consumedTokenIds: [],
    nowEpochSeconds: 1_121,
  });

assert.equal(expiredVerification.valid, false);
assert.equal(expiredVerification.code, "TOKEN_EXPIRED");

const consumedVerification =
  verifyControlledPilotOwnerResumeProof({
    token: issued.token,
    signingSecret,
    expectedTenantId: "tenant-a",
    expectedSignalId: "signal-722",
    consumedTokenIds: [issued.tokenId],
    nowEpochSeconds: 1_050,
  });

assert.equal(consumedVerification.valid, false);
assert.equal(
  consumedVerification.code,
  "TOKEN_ALREADY_CONSUMED",
);

const tokenParts = issued.token.split(".");
const tamperedPayload = Buffer.from(
  JSON.stringify({
    tenantId: "attacker-tenant",
  }),
).toString("base64url");

const tamperedToken = [
  tokenParts[0],
  tamperedPayload,
  tokenParts[2],
].join(".");

const tamperedVerification =
  verifyControlledPilotOwnerResumeProof({
    token: tamperedToken,
    signingSecret,
    expectedTenantId: "tenant-a",
    expectedSignalId: "signal-722",
    consumedTokenIds: [],
    nowEpochSeconds: 1_050,
  });

assert.equal(tamperedVerification.valid, false);
assert.equal(
  tamperedVerification.code,
  "INVALID_TOKEN_SIGNATURE",
);

console.log(
  "DAY 722 TARGETED TEST PASS: owner approval, recovery binding, signature integrity, tenant isolation, signal isolation, expiry and replay detection verified.",
);
