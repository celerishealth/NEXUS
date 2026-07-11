"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  EXPECTED_FINAL_COMPLETION_SOURCE_COMMIT,
  REQUIRED_FINAL_COMPLETION_GATES,
  createFinalCompletionCheckpoint,
} = require(
  path.join(
    __dirname,
    "..",
    ".day781-compiled",
    "finalCompletionCheckpoint.js",
  ),
);

function passingEvidence() {
  return Object.fromEntries(
    REQUIRED_FINAL_COMPLETION_GATES.map(
      (gate) => [gate, true],
    ),
  );
}

function validInput(overrides = {}) {
  return {
    tenantId: "tenant-final-001",
    ownerId: "owner-final-001",
    sourceCommit:
      EXPECTED_FINAL_COMPLETION_SOURCE_COMMIT,
    checkpointCommit: "781781a",
    evidence: passingEvidence(),
    ...overrides,
  };
}

for (const gate of REQUIRED_FINAL_COMPLETION_GATES) {
  test(
    `fails closed when required gate ${gate} is false`,
    () => {
      const evidence = passingEvidence();
      evidence[gate] = false;

      const report =
        createFinalCompletionCheckpoint(
          validInput({ evidence }),
        );

      assert.equal(report.status, "NOT_COMPLETE");

      assert.equal(
        report.completionCheckpointSatisfied,
        false,
      );

      assert.deepEqual(
        report.failedGates,
        [gate],
      );

      assert.equal(
        report.finalStatement,
        "NEXUS_DAY_781_NOT_COMPLETE_RESOLVE_FAILED_GATES",
      );
    },
  );
}

test(
  "all required gates produce the Day 781 target-complete decision",
  () => {
    const report =
      createFinalCompletionCheckpoint(validInput());

    assert.equal(
      report.status,
      "DAY_781_TARGET_COMPLETE",
    );

    assert.equal(
      report.completionCheckpointSatisfied,
      true,
    );

    assert.deepEqual(
      report.failedGates,
      [],
    );

    assert.equal(
      report.finalStatement,
      "NEXUS_DAY_781_TARGET_COMPLETE_PUBLIC_LAUNCH_BLOCKED",
    );
  },
);

test(
  "identical evidence produces deterministic evidence and report digests",
  () => {
    const first =
      createFinalCompletionCheckpoint(validInput());

    const second =
      createFinalCompletionCheckpoint(validInput());

    assert.equal(
      first.evidenceDigest,
      second.evidenceDigest,
    );

    assert.equal(
      first.reportDigest,
      second.reportDigest,
    );

    assert.deepEqual(first, second);
  },
);

test(
  "evidence mutation changes both digests and returns NOT_COMPLETE",
  () => {
    const complete =
      createFinalCompletionCheckpoint(validInput());

    const evidence = passingEvidence();
    evidence.productionBuild = false;

    const incomplete =
      createFinalCompletionCheckpoint(
        validInput({ evidence }),
      );

    assert.notEqual(
      complete.evidenceDigest,
      incomplete.evidenceDigest,
    );

    assert.notEqual(
      complete.reportDigest,
      incomplete.reportDigest,
    );

    assert.equal(
      incomplete.status,
      "NOT_COMPLETE",
    );
  },
);

test(
  "source and checkpoint commit identities are validated",
  () => {
    assert.throws(
      () =>
        createFinalCompletionCheckpoint(
          validInput({
            sourceCommit: "abcdef0",
          }),
        ),
      /sourceCommit must equal f7698d4/,
    );

    assert.throws(
      () =>
        createFinalCompletionCheckpoint(
          validInput({
            checkpointCommit: "not-a-commit",
          }),
        ),
      /checkpointCommit must be a distinct lowercase hexadecimal Git commit/,
    );
  },
);

test(
  "credential-bearing identifiers are rejected",
  () => {
    assert.throws(
      () =>
        createFinalCompletionCheckpoint(
          validInput({
            tenantId: "tenant-secret-001",
          }),
        ),
      /credential-bearing term/,
    );
  },
);

test(
  "final completion report is deeply immutable",
  () => {
    const report =
      createFinalCompletionCheckpoint(validInput());

    assert.equal(
      Object.isFrozen(report),
      true,
    );

    assert.equal(
      Object.isFrozen(report.evidence),
      true,
    );

    assert.equal(
      Object.isFrozen(report.failedGates),
      true,
    );

    assert.equal(
      Object.isFrozen(report.safetyBoundary),
      true,
    );

    assert.throws(() => {
      report.evidence.productionBuild = false;
    }, TypeError);
  },
);

test(
  "target completion never authorizes live or public execution",
  () => {
    const report =
      createFinalCompletionCheckpoint(validInput());

    assert.equal(
      report.safetyBoundary.ownerApprovalRequired,
      true,
    );

    assert.equal(
      report.safetyBoundary
        .liveExecutionControlSurfacePresent,
      false,
    );

    assert.equal(
      report.safetyBoundary
        .liveProviderExecutionAuthorized,
      false,
    );

    assert.equal(
      report.safetyBoundary
        .externalDeliveryAuthorized,
      false,
    );

    assert.equal(
      report.safetyBoundary
        .paymentExecutionAuthorized,
      false,
    );

    assert.equal(
      report.safetyBoundary
        .publicLaunchAuthorized,
      false,
    );
  },
);
