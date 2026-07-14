
import {
  existsSync,
} from "node:fs";

import {
  spawnSync,
  type SpawnSyncReturns,
} from "node:child_process";

import {
  EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT,
  createFinalMarketLaunchDecision,
  type FinalMarketLaunchDecisionEvidence,
} from "../lib/nexus/finalMarketLaunchDecision";

const npmExecutable = "npm";

const blockedEnvironmentVariables = [
  "DATABASE_URL",
  "DIRECT_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "SUPABASE_DB_URL",
  "SUPABASE_DATABASE_URL",
  "SUPABASE_DB_PASSWORD",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_ACCESS_TOKEN",
] as const;

type CommandResult = Readonly<{
  passed: boolean;
  stdout: string;
  stderr: string;
}>;

type Day810ReleaseFreezeReport =
  Readonly<{
    status?: unknown;
    releaseFreezeSatisfied?: unknown;
    evidence?: Readonly<
      Record<string, unknown>
    >;
    safetyBoundary?: Readonly<{
      ownerApprovalRequired?: unknown;
      productionDatabaseMutationAuthorized?:
        unknown;
      productionDeploymentAuthorized?:
        unknown;
      liveProviderExecutionAuthorized?:
        unknown;
      customerMessageDeliveryAuthorized?:
        unknown;
      paymentExecutionAuthorized?:
        unknown;
      publicLaunchAuthorized?: unknown;
    }>;
  }>;

function safeEnvironment():
  NodeJS.ProcessEnv {
  const environment = {
    ...process.env,
  };

  for (
    const variableName of
    blockedEnvironmentVariables
  ) {
    delete environment[variableName];
  }

  const chromePath =
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  if (
    !environment
      .NEXUS_LOCAL_BROWSER_EXECUTABLE &&
    existsSync(chromePath)
  ) {
    environment
      .NEXUS_LOCAL_BROWSER_EXECUTABLE =
        chromePath;
  }

  return environment;
}

function runCommand(
  name: string,
  command: string,
  args: readonly string[],
  options: Readonly<{
    capture?: boolean;
    environment?: NodeJS.ProcessEnv;
  }> = {},
): CommandResult {
  process.stdout.write(
    "\n=== " + name + " ===\n",
  );

  const capture =
    options.capture === true;

  const windowsNpmInvocation =
    process.platform === "win32" &&
    command === npmExecutable;

  const resolvedCommand =
    windowsNpmInvocation
      ? process.env.ComSpec ?? "cmd.exe"
      : command;

  const resolvedArgs =
    windowsNpmInvocation
      ? [
          "/d",
          "/s",
          "/c",
          [
            "npm",
            ...args,
          ].join(" "),
        ]
      : [...args];

  const result:
    SpawnSyncReturns<string> =
      spawnSync(
        resolvedCommand,
        resolvedArgs,
        {
          cwd: process.cwd(),
          env:
            options.environment ??
            process.env,
          encoding: "utf8",
          stdio: capture
            ? "pipe"
            : "inherit",
          shell: false,
        },
      );

  const stdout =
    result.stdout ?? "";

  const stderr =
    result.stderr ?? "";

  if (capture) {
    if (stdout.length > 0) {
      process.stdout.write(stdout);
    }

    if (stderr.length > 0) {
      process.stderr.write(stderr);
    }
  }

  const passed =
    result.status === 0 &&
    result.error === undefined;

  process.stdout.write(
    name +
      ": " +
      (passed ? "PASS" : "FAIL") +
      "\n",
  );

  return {
    passed,
    stdout,
    stderr,
  };
}

function gitText(
  args: readonly string[],
): string {
  const result =
    spawnSync(
      "git",
      [...args],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: "pipe",
        shell: false,
      },
    );

  if (
    result.status !== 0 ||
    result.error
  ) {
    throw new Error(
      "Git command failed: git " +
        args.join(" "),
    );
  }

  return (
    result.stdout ?? ""
  ).trim();
}

function extractBalancedJson(
  text: string,
  marker: string,
): string | null {
  const markerIndex =
    text.lastIndexOf(marker);

  if (markerIndex < 0) {
    return null;
  }

  const start =
    text.indexOf(
      "{",
      markerIndex +
        marker.length,
    );

  if (start < 0) {
    return null;
  }

  let depth = 0;
  let insideString = false;
  let escaped = false;

  for (
    let index = start;
    index < text.length;
    index += 1
  ) {
    const character =
      text[index];

    if (insideString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === '"') {
        insideString = false;
      }

      continue;
    }

    if (character === '"') {
      insideString = true;
      continue;
    }

    if (character === "{") {
      depth += 1;
      continue;
    }

    if (character === "}") {
      depth -= 1;

      if (depth === 0) {
        return text.slice(
          start,
          index + 1,
        );
      }
    }
  }

  return null;
}

function parseDay810Report(
  stdout: string,
): Day810ReleaseFreezeReport | null {
  const json =
    extractBalancedJson(
      stdout,
      "DAY 810 FINAL RELEASE FREEZE REPORT",
    );

  if (!json) {
    return null;
  }

  try {
    return JSON.parse(
      json,
    ) as Day810ReleaseFreezeReport;
  } catch {
    return null;
  }
}

const environment =
  safeEnvironment();

const day810Command =
  runCommand(
    "DAY 810 EXECUTABLE RELEASE FREEZE",
    npmExecutable,
    [
      "run",
      "test:final-release-freeze",
    ],
    {
      capture: true,
      environment,
    },
  );

const day810Report =
  parseDay810Report(
    day810Command.stdout,
  );

const day810ReleaseFreezeVerified =
  day810Command.passed &&
  day810Report?.status ===
    "DAY_810_RELEASE_FROZEN" &&
  day810Report
    .releaseFreezeSatisfied === true;

const day810SourceCommitAncestor =
  runCommand(
    "DAY 810 SOURCE COMMIT ANCESTOR",
    "git",
    [
      "merge-base",
      "--is-ancestor",
      EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT,
      "HEAD",
    ],
  ).passed;

const day811ContractTests =
  runCommand(
    "DAY 811 CONTRACT TESTS",
    npmExecutable,
    [
      "exec",
      "--",
      "vitest",
      "run",
      "lib/nexus/__tests__/finalMarketLaunchDecision.test.ts",
    ],
    { environment },
  ).passed;

const projectTypecheck =
  runCommand(
    "DAY 811 PROJECT TYPESCRIPT CHECK",
    npmExecutable,
    [
      "exec",
      "--",
      "tsc",
      "--noEmit",
    ],
    { environment },
  ).passed;

const decisionLint =
  runCommand(
    "DAY 811 DECISION LINT",
    npmExecutable,
    [
      "exec",
      "--",
      "eslint",
      "lib/nexus/finalMarketLaunchDecision.ts",
      "lib/nexus/__tests__/finalMarketLaunchDecision.test.ts",
      "scripts/nexus-final-market-launch-decision.ts",
    ],
    { environment },
  ).passed;

const originFetch =
  runCommand(
    "FETCH ORIGIN MAIN",
    "git",
    [
      "fetch",
      "origin",
      "main",
    ],
  );

const decisionCommit =
  gitText([
    "rev-parse",
    "HEAD",
  ]);

const originMain =
  gitText([
    "rev-parse",
    "origin/main",
  ]);

const originMainSync =
  originFetch.passed &&
  decisionCommit === originMain;

const workingTreeClean =
  gitText([
    "status",
    "--porcelain",
  ]) === "";

const ownerApprovalLocked =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.safetyBoundary
    ?.ownerApprovalRequired === true;

const sandboxExecutionOnly =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.evidence
    ?.day809AuthorizationRegression ===
      true &&
  day810Report
    ?.evidence
    ?.fullAuthenticatedNodeSuite ===
      true &&
  day810Report
    ?.safetyBoundary
    ?.liveProviderExecutionAuthorized ===
      false;

const realBrowserEmergencyVerified =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.evidence
    ?.realBrowserEmergencyRehearsal ===
      true;

const productionDatabaseMutationBlocked =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.evidence
    ?.productionDatabaseUntouched ===
      true &&
  day810Report
    ?.safetyBoundary
    ?.productionDatabaseMutationAuthorized ===
      false;

const productionDeploymentBlocked =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.evidence
    ?.productionDeploymentUnmodified ===
      true &&
  day810Report
    ?.safetyBoundary
    ?.productionDeploymentAuthorized ===
      false;

const publicSignupBlocked =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.evidence
    ?.day809AuthorizationRegression ===
      true &&
  day810Report
    ?.evidence
    ?.fullAuthenticatedNodeSuite ===
      true &&
  day810Report
    ?.safetyBoundary
    ?.publicLaunchAuthorized ===
      false;

const liveProviderExecutionBlocked =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.evidence
    ?.liveProviderExecutionBlocked ===
      true &&
  day810Report
    ?.safetyBoundary
    ?.liveProviderExecutionAuthorized ===
      false;

const customerMessageDeliveryBlocked =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.safetyBoundary
    ?.customerMessageDeliveryAuthorized ===
      false;

const paymentExecutionBlocked =
  day810ReleaseFreezeVerified &&
  day810Report
    ?.safetyBoundary
    ?.paymentExecutionAuthorized ===
      false;

const engineeringCompletionConfirmed =
  day810ReleaseFreezeVerified &&
  day810SourceCommitAncestor &&
  day811ContractTests &&
  projectTypecheck &&
  decisionLint;

const evidence:
  FinalMarketLaunchDecisionEvidence = {
    day810ReleaseFreezeVerified,
    day810SourceCommitAncestor,
    engineeringCompletionConfirmed,
    ownerApprovalLocked,
    sandboxExecutionOnly,
    realBrowserEmergencyVerified,
    originMainSync,
    workingTreeClean,
    productionDatabaseMutationBlocked,
    productionDeploymentBlocked,
    publicSignupBlocked,
    liveProviderExecutionBlocked,
    customerMessageDeliveryBlocked,
    paymentExecutionBlocked,
  };

const report =
  createFinalMarketLaunchDecision({
    sourceCommit:
      EXPECTED_FINAL_MARKET_LAUNCH_SOURCE_COMMIT,
    decisionCommit,
    evidence,
  });

process.stdout.write(
  "\nDAY 811 FINAL MARKET-LAUNCH DECISION REPORT\n\n",
);

process.stdout.write(
  JSON.stringify(
    report,
    null,
    2,
  ) + "\n",
);

if (
  !report.finalCompletionConfirmed ||
  !report
    .controlledMarketEntryAuthorized
) {
  process.exitCode = 1;
}
