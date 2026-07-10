const assert = require("node:assert/strict");
const path = require("node:path");

const compiledModulePath = process.argv[2];

if (!compiledModulePath) {
  throw new Error("Compiled Day 721 module path was not provided.");
}

const {
  evaluateControlledPilotRecovery,
} = require(path.resolve(compiledModulePath));

const invalidDecision = evaluateControlledPilotRecovery(null);

assert.equal(
  invalidDecision.code,
  "INVALID_INPUT_FAIL_CLOSED",
);

assert.equal(invalidDecision.pilotOperationPermitted, false);

const criticalDecision = evaluateControlledPilotRecovery({
  healthStatus: "critical",
  ownerAlertRequired: true,
  ownerAcknowledged: true,
  blockingFailureCount: 0,
  consecutiveHealthyChecks: 10,
  signalId: "signal-critical",
});

assert.equal(
  criticalDecision.code,
  "CRITICAL_HEALTH_PAUSE_REQUIRED",
);

assert.equal(criticalDecision.status, "pause-controlled-pilot");

const acknowledgementDecision = evaluateControlledPilotRecovery({
  healthStatus: "degraded",
  ownerAlertRequired: true,
  ownerAcknowledged: false,
  blockingFailureCount: 0,
  consecutiveHealthyChecks: 0,
  signalId: "signal-ack",
});

assert.equal(
  acknowledgementDecision.code,
  "OWNER_ACKNOWLEDGEMENT_REQUIRED",
);

const blockingFailureDecision = evaluateControlledPilotRecovery({
  healthStatus: "healthy",
  ownerAlertRequired: true,
  ownerAcknowledged: true,
  blockingFailureCount: 1,
  consecutiveHealthyChecks: 5,
  signalId: "signal-blocking",
});

assert.equal(
  blockingFailureDecision.code,
  "BLOCKING_FAILURES_REMAIN",
);

const evidenceDecision = evaluateControlledPilotRecovery({
  healthStatus: "healthy",
  ownerAlertRequired: true,
  ownerAcknowledged: true,
  blockingFailureCount: 0,
  consecutiveHealthyChecks: 2,
  signalId: "signal-evidence",
});

assert.equal(
  evidenceDecision.code,
  "RECOVERY_EVIDENCE_REQUIRED",
);

const ownerResumeDecision = evaluateControlledPilotRecovery({
  healthStatus: "healthy",
  ownerAlertRequired: true,
  ownerAcknowledged: true,
  blockingFailureCount: 0,
  consecutiveHealthyChecks: 3,
  signalId: "signal-owner-resume",
});

assert.equal(
  ownerResumeDecision.code,
  "OWNER_RESUME_APPROVAL_REQUIRED",
);

assert.equal(ownerResumeDecision.pilotOperationPermitted, false);
assert.equal(ownerResumeDecision.ownerActionRequired, true);

const healthyDecision = evaluateControlledPilotRecovery({
  healthStatus: "healthy",
  ownerAlertRequired: false,
  ownerAcknowledged: false,
  blockingFailureCount: 0,
  consecutiveHealthyChecks: 0,
  signalId: "signal-healthy",
});

assert.equal(
  healthyDecision.code,
  "CONTROLLED_PILOT_HEALTHY",
);

assert.equal(
  healthyDecision.status,
  "continue-controlled-pilot",
);

assert.equal(healthyDecision.pilotOperationPermitted, true);

for (const decision of [
  invalidDecision,
  criticalDecision,
  acknowledgementDecision,
  blockingFailureDecision,
  evidenceDecision,
  ownerResumeDecision,
  healthyDecision,
]) {
  assert.equal(decision.automaticResumeAuthorized, false);
  assert.equal(decision.liveProviderExecutionAuthorized, false);
  assert.equal(decision.publicLaunchAuthorized, false);
}

console.log(
  "DAY 721 TARGETED TEST PASS: fail-closed recovery, owner acknowledgement, recovery evidence and owner resume authority verified.",
);
