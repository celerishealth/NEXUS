import {
  runCriticalRiskAudit,
} from "../lib/nexus/criticalRiskBurnDown.mjs";

const report = runCriticalRiskAudit({
  repositoryRoot: process.cwd(),
});

process.stdout.write(
  `${JSON.stringify(report, null, 2)}\n`,
);

if (!report.developmentGatePassed) {
  process.stderr.write(
    [
      "NEXUS CRITICAL RISK GATE FAILED.",
      `Open Critical risks: ${report.knownCriticalRiskCount}`,
      `Open High risks: ${report.knownHighRiskCount}`,
    ].join("\n") + "\n",
  );

  process.exitCode = 1;
}
