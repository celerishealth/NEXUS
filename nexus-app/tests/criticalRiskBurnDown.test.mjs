import assert from "node:assert/strict";
import {
  execFileSync,
} from "node:child_process";
import {
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import {
  tmpdir,
} from "node:os";
import {
  join,
} from "node:path";
import test from "node:test";

import {
  runCriticalRiskAudit,
} from "../lib/nexus/criticalRiskBurnDown.mjs";

function createTemporaryGitRepository(
  fixtureContent,
) {
  const repositoryRoot =
    mkdtempSync(
      join(
        tmpdir(),
        "nexus-critical-risk-audit-",
      ),
    );

  execFileSync(
    "git",
    ["init"],
    {
      cwd: repositoryRoot,
      stdio: "ignore",
    },
  );

  writeFileSync(
    join(
      repositoryRoot,
      "fixture.ts",
    ),
    fixtureContent,
    "utf8",
  );

  execFileSync(
    "git",
    [
      "add",
      "fixture.ts",
    ],
    {
      cwd: repositoryRoot,
      stdio: "ignore",
    },
  );

  return repositoryRoot;
}

function getSecretControl(report) {
  return report.controls.find(
    (control) =>
      control.id ===
      "CRITICAL_NO_EXPOSED_PROVIDER_SECRETS",
  );
}

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

test(
  "does not classify embedded risk identifiers as provider secrets",
  () => {
    const repositoryRoot =
      createTemporaryGitRepository(
        [
          "export const routeMode =",
          '  "read-only-risk-scoring-action-class-contract";',
          "",
        ].join("\n"),
      );

    try {
      const report =
        runCriticalRiskAudit({
          repositoryRoot,
        });

      const control =
        getSecretControl(report);

      assert.ok(control);

      assert.equal(
        control.passed,
        true,
        JSON.stringify(
          control.evidence,
        ),
      );
    } finally {
      rmSync(
        repositoryRoot,
        {
          recursive: true,
          force: true,
        },
      );
    }
  },
);

test(
  "still detects a standalone OpenAI-style provider secret shape",
  () => {
    const fakeSecret =
      [
        "sk",
        "-",
        "A".repeat(24),
      ].join("");

    const repositoryRoot =
      createTemporaryGitRepository(
        [
          "export const credential =",
          `  "${fakeSecret}";`,
          "",
        ].join("\n"),
      );

    try {
      const report =
        runCriticalRiskAudit({
          repositoryRoot,
        });

      const control =
        getSecretControl(report);

      assert.ok(control);

      assert.equal(
        control.passed,
        false,
      );

      assert.deepEqual(
        control.evidence,
        [
          {
            file: "fixture.ts",
            pattern:
              "OPENAI_STYLE_SECRET",
          },
        ],
      );
    } finally {
      rmSync(
        repositoryRoot,
        {
          recursive: true,
          force: true,
        },
      );
    }
  },
);
