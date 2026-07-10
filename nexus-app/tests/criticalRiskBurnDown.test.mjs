import assert from "node:assert/strict";
import test from "node:test";

import {
  runCriticalRiskAudit,
} from "../lib/nexus/criticalRiskBurnDown.mjs";

test(
  "closes every known Critical and High development risk",
  () => {
    const report = runCriticalRiskAudit({
      repositoryRoot: process.cwd(),
    });

    assert.equal(
      report.knownCriticalRiskCount,
      0,
      JSON.stringify(
        report.openCriticalRiskIds,
      ),
    );

    assert.equal(
      report.knownHighRiskCount,
      0,
      JSON.stringify(
        report.openHighRiskIds,
      ),
    );

    assert.equal(
      report.developmentGatePassed,
      true,
    );

    assert.equal(
      report.failedControlCount,
      0,
    );

    assert.equal(
      report.passedControlCount,
      report.totalControlCount,
    );
  },
);

test(
  "keeps every real-world execution authority locked",
  () => {
    const report = runCriticalRiskAudit({
      repositoryRoot: process.cwd(),
    });

    assert.equal(
      report.publicLaunchAuthorized,
      false,
    );

    assert.equal(
      report.realExecutionAuthorized,
      false,
    );

    assert.equal(
      report.paymentAutomationAuthorized,
      false,
    );

    assert.equal(
      report.whatsappAutoSendAuthorized,
      false,
    );

    assert.equal(
      report.liveMigrationAuthorized,
      false,
    );

    assert.equal(
      report.uncontrolledAiActionAuthorized,
      false,
    );

    assert.equal(
      report.safetyBoundary
        .databaseMutationPerformed,
      false,
    );

    assert.equal(
      report.safetyBoundary
        .providerInvocationPerformed,
      false,
    );

    assert.equal(
      report.safetyBoundary
        .externalExecutionPerformed,
      false,
    );
  },
);
