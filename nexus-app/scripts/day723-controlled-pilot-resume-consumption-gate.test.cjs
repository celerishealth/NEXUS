const assert = require("node:assert/strict");
const path = require("node:path");

const compiledModulePath = process.argv[2];
const compiledProofModulePath = process.argv[3];

if (!compiledModulePath || !compiledProofModulePath) {
  throw new Error(
    "Compiled Day 723 module paths were not provided.",
  );
}

const {
  authorizeControlledPilotResume,
} = require(path.resolve(compiledModulePath));

const {
  issueControlledPilotOwnerResumeProof,
} = require(path.resolve(compiledProofModulePath));

const signingSecret =
  "day-723-test-secret-must-remain-at-least-32-characters-long";

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
  signalId: "signal-723",
};

const issued = issueControlledPilotOwnerResumeProof(
  {
    tenantId: "tenant-723",
    signalId: "signal-723",
    ownerId: "owner-723",
    ownerRole: "owner",
    ownerApproved: true,
    recoveryDecision,
    ttlSeconds: 120,
  },
  signingSecret,
  10_000,
);

assert.equal(issued.ok, true);

class AtomicTestLedger {
  constructor() {
    this.records = new Map();
    this.available = true;
  }

  async consumeOnce(record) {
    if (!this.available) {
      return {
        status: "ledger-unavailable",
      };
    }

    const existing = this.records.get(record.tokenId);

    if (existing) {
      const sameBinding =
        existing.tenantId === record.tenantId &&
        existing.signalId === record.signalId &&
        existing.ownerId === record.ownerId;

      if (!sameBinding) {
        return {
          status: "binding-conflict",
        };
      }

      return {
        status: "already-consumed",
        consumedAt: existing.consumedAt,
      };
    }

    this.records.set(record.tokenId, {
      ...record,
    });

    return {
      status: "consumed",
      consumedAt: record.consumedAt,
    };
  }
}

async function run() {
  const ledger = new AtomicTestLedger();

  const authorized =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-723",
      ledger,
      nowEpochSeconds: 10_050,
    });

  assert.equal(authorized.authorized, true);
  assert.equal(
    authorized.code,
    "CONTROLLED_PILOT_RESUME_AUTHORIZED",
  );
  assert.equal(authorized.pilotOperationPermitted, true);
  assert.equal(authorized.automaticResumeAuthorized, false);
  assert.equal(
    authorized.liveProviderExecutionAuthorized,
    false,
  );
  assert.equal(authorized.publicLaunchAuthorized, false);
  assert.equal(
    authorized.consumption.tokenId,
    issued.tokenId,
  );

  const replayAttempt =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-723",
      ledger,
      nowEpochSeconds: 10_051,
    });

  assert.equal(replayAttempt.authorized, false);
  assert.equal(
    replayAttempt.code,
    "PROOF_ALREADY_CONSUMED",
  );
  assert.equal(
    replayAttempt.pilotOperationPermitted,
    false,
  );

  const wrongTenant =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-other",
      expectedSignalId: "signal-723",
      ledger: new AtomicTestLedger(),
      nowEpochSeconds: 10_050,
    });

  assert.equal(wrongTenant.authorized, false);
  assert.equal(
    wrongTenant.code,
    "SIGNED_PROOF_REJECTED",
  );
  assert.equal(
    wrongTenant.verificationCode,
    "TENANT_BINDING_MISMATCH",
  );

  const wrongSignal =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-other",
      ledger: new AtomicTestLedger(),
      nowEpochSeconds: 10_050,
    });

  assert.equal(wrongSignal.authorized, false);
  assert.equal(
    wrongSignal.verificationCode,
    "SIGNAL_BINDING_MISMATCH",
  );

  const expired =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-723",
      ledger: new AtomicTestLedger(),
      nowEpochSeconds: 10_121,
    });

  assert.equal(expired.authorized, false);
  assert.equal(
    expired.verificationCode,
    "TOKEN_EXPIRED",
  );

  const unavailableLedger =
    new AtomicTestLedger();

  unavailableLedger.available = false;

  const unavailable =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-723",
      ledger: unavailableLedger,
      nowEpochSeconds: 10_050,
    });

  assert.equal(unavailable.authorized, false);
  assert.equal(
    unavailable.code,
    "CONSUMPTION_LEDGER_UNAVAILABLE",
  );

  const throwingLedger = {
    async consumeOnce() {
      throw new Error("simulated ledger failure");
    },
  };

  const ledgerFailure =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-723",
      ledger: throwingLedger,
      nowEpochSeconds: 10_050,
    });

  assert.equal(ledgerFailure.authorized, false);
  assert.equal(
    ledgerFailure.code,
    "CONSUMPTION_LEDGER_UNAVAILABLE",
  );

  const bindingConflictLedger = {
    async consumeOnce() {
      return {
        status: "binding-conflict",
      };
    },
  };

  const bindingConflict =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-723",
      ledger: bindingConflictLedger,
      nowEpochSeconds: 10_050,
    });

  assert.equal(bindingConflict.authorized, false);
  assert.equal(
    bindingConflict.code,
    "PROOF_BINDING_CONFLICT",
  );

  const invalidConsumptionLedger = {
    async consumeOnce() {
      return {
        status: "consumed",
        consumedAt: 99_999,
      };
    },
  };

  const invalidConsumption =
    await authorizeControlledPilotResume({
      proofToken: issued.token,
      signingSecret,
      expectedTenantId: "tenant-723",
      expectedSignalId: "signal-723",
      ledger: invalidConsumptionLedger,
      nowEpochSeconds: 10_050,
    });

  assert.equal(invalidConsumption.authorized, false);
  assert.equal(
    invalidConsumption.code,
    "INVALID_CONSUMPTION_RESPONSE",
  );

  console.log(
    "DAY 723 TARGETED TEST PASS: signed proof verification, atomic consumption, replay blocking, tenant binding, signal binding, expiry and fail-closed ledger handling verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
