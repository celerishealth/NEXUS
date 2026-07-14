
import {
  existsSync,
  readdirSync,
  rmSync,
} from "node:fs";

import {
  spawnSync,
  type SpawnSyncReturns,
} from "node:child_process";

import {
  EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT,
  createFinalReleaseFreezeReport,
  type FinalReleaseFreezeEvidence,
} from "../lib/nexus/finalReleaseFreeze";

const npmExecutable =
  process.platform === "win32"
    ? "npm.cmd"
    : "npm";

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

type BrowserIntegrationReport =
  Readonly<{
    passed?: unknown;
    productionDatabaseModified?: unknown;
    productionDeploymentModified?: unknown;
    liveProviderExecutionAuthorized?: unknown;
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

  const result:
    SpawnSyncReturns<string> =
      spawnSync(
        command,
        [...args],
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

  return (result.stdout ?? "").trim();
}

function parseBrowserReport(
  stdout: string,
): BrowserIntegrationReport | null {
  const start =
    stdout.indexOf("{");

  const end =
    stdout.lastIndexOf("}");

  if (
    start < 0 ||
    end <= start
  ) {
    return null;
  }

  try {
    return JSON.parse(
      stdout.slice(start, end + 1),
    ) as BrowserIntegrationReport;
  } catch {
    return null;
  }
}

function runDay781Regression(
  environment: NodeJS.ProcessEnv,
): boolean {
  const compiledDirectory =
    ".day781-compiled";

  rmSync(
    compiledDirectory,
    {
      recursive: true,
      force: true,
    },
  );

  try {
    const compile =
      runCommand(
        "DAY 781 CHECKPOINT COMPILE",
        npmExecutable,
        [
          "exec",
          "--",
          "tsc",
          "lib/nexus/finalCompletionCheckpoint.ts",
          "--module",
          "commonjs",
          "--target",
          "ES2022",
          "--moduleResolution",
          "node",
          "--esModuleInterop",
          "--skipLibCheck",
          "--outDir",
          compiledDirectory,
        ],
        { environment },
      );

    if (!compile.passed) {
      return false;
    }

    return runCommand(
      "DAY 781 CHECKPOINT REGRESSION",
      process.execPath,
      [
        "--test",
        "scripts/day781-final-completion-checkpoint.test.cjs",
      ],
      { environment },
    ).passed;
  } finally {
    rmSync(
      compiledDirectory,
      {
        recursive: true,
        force: true,
      },
    );
  }
}

const environment =
  safeEnvironment();

const day781FinalCompletionRegression =
  runDay781Regression(environment);

const day809SourceCommitAncestor =
  runCommand(
    "DAY 809 SOURCE COMMIT ANCESTOR",
    "git",
    [
      "merge-base",
      "--is-ancestor",
      EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT,
      "HEAD",
    ],
  ).passed;

const day809AuthorizationRegression =
  runCommand(
    "DAY 809 AUTHORIZATION REGRESSION",
    process.execPath,
    [
      "--import",
      "tsx",
      "--test",
      "--test-concurrency=1",
      "tests/nexus/authenticatedTenantWorkspace.test.ts",
      "tests/nexus/authenticatedControlledPilotAccess.test.ts",
      "tests/nexus/authenticatedControlledPilotOperationAdmission.test.ts",
      "tests/nexus/authenticatedControlledPilotOperationCompletion.test.ts",
    ],
    { environment },
  ).passed;

const criticalVitestFiles = [
  "lib/nexus/__tests__/finalReleaseFreeze.test.ts",
  "lib/nexus/__tests__/founderEmergencyApiRoute.test.ts",
  "lib/nexus/__tests__/founderEmergencyBrowserE2EIntegrationScript.test.ts",
  "lib/nexus/__tests__/founderEmergencyClient.test.ts",
  "lib/nexus/__tests__/founderEmergencyHttpIntegrationScript.test.ts",
  "lib/nexus/__tests__/founderEmergencyOperations.test.ts",
  "lib/nexus/__tests__/founderEmergencyRevocationHttpIntegrationScript.test.ts",
  "lib/nexus/__tests__/providerContinuityProductionBootstrap.test.ts",
  "lib/nexus/__tests__/providerContinuityProductionReadiness.test.ts",
];

const criticalVitestSuite =
  runCommand(
    "CRITICAL VITEST SUITE",
    npmExecutable,
    [
      "exec",
      "--",
      "vitest",
      "run",
      ...criticalVitestFiles,
    ],
    { environment },
  ).passed;

const authenticatedNodeTests =
  readdirSync(
    "tests/nexus",
    {
      withFileTypes: true,
    },
  )
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(
          ".test.ts",
        ),
    )
    .map(
      (entry) =>
        "tests/nexus/" +
        entry.name,
    )
    .sort();

const fullAuthenticatedNodeSuite =
  runCommand(
    "FULL AUTHENTICATED NODE SUITE",
    process.execPath,
    [
      "--import",
      "tsx",
      "--test",
      "--test-concurrency=1",
      ...authenticatedNodeTests,
    ],
    { environment },
  ).passed;

const projectTypecheck =
  runCommand(
    "PROJECT TYPESCRIPT CHECK",
    npmExecutable,
    [
      "exec",
      "--",
      "tsc",
      "--noEmit",
    ],
    { environment },
  ).passed;

const releaseFreezeLint =
  runCommand(
    "RELEASE FREEZE LINT",
    npmExecutable,
    [
      "exec",
      "--",
      "eslint",
      "lib/nexus/finalReleaseFreeze.ts",
      "lib/nexus/__tests__/finalReleaseFreeze.test.ts",
      "scripts/nexus-final-release-freeze.ts",
      "lib/nexus/onboarding/authenticatedTenantWorkspace.ts",
      "lib/nexus/pilot/authenticatedControlledPilotAccess.ts",
      "tests/nexus/authenticatedTenantWorkspace.test.ts",
      "tests/nexus/authenticatedControlledPilotOperationCompletion.test.ts",
      "tests/nexus/customerVerticalSliceSecurityRegression.test.ts",
      "scripts/nexus-founder-emergency-http-integration.ts",
    ],
    { environment },
  ).passed;

const productionBuild =
  runCommand(
    "FRESH PRODUCTION BUILD",
    npmExecutable,
    [
      "run",
      "build",
    ],
    { environment },
  ).passed;

const browserCommand =
  runCommand(
    "REAL BROWSER EMERGENCY REHEARSAL",
    npmExecutable,
    [
      "run",
      "test:founder-emergency-http",
    ],
    {
      capture: true,
      environment,
    },
  );

const browserReport =
  parseBrowserReport(
    browserCommand.stdout,
  );

const realBrowserEmergencyRehearsal =
  browserCommand.passed &&
  browserReport?.passed === true;

const productionDatabaseUntouched =
  realBrowserEmergencyRehearsal &&
  browserReport
    ?.productionDatabaseModified ===
      false;

const productionDeploymentUnmodified =
  realBrowserEmergencyRehearsal &&
  browserReport
    ?.productionDeploymentModified ===
      false;

const liveProviderExecutionBlocked =
  realBrowserEmergencyRehearsal &&
  browserReport
    ?.liveProviderExecutionAuthorized ===
      false;

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

const freezeCommit =
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
  freezeCommit === originMain;

const workingTreeClean =
  gitText([
    "status",
    "--porcelain",
  ]) === "";

const evidence:
  FinalReleaseFreezeEvidence = {
    day781FinalCompletionRegression,
    day809SourceCommitAncestor,
    day809AuthorizationRegression,
    criticalVitestSuite,
    fullAuthenticatedNodeSuite,
    projectTypecheck,
    releaseFreezeLint,
    productionBuild,
    realBrowserEmergencyRehearsal,
    originMainSync,
    workingTreeClean,
    productionDatabaseUntouched,
    productionDeploymentUnmodified,
    liveProviderExecutionBlocked,
  };

const report =
  createFinalReleaseFreezeReport({
    sourceCommit:
      EXPECTED_RELEASE_FREEZE_SOURCE_COMMIT,
    freezeCommit,
    evidence,
  });

process.stdout.write(
  "\nDAY 810 FINAL RELEASE FREEZE REPORT\n\n",
);

process.stdout.write(
  JSON.stringify(
    report,
    null,
    2,
  ) + "\n",
);

if (!report.releaseFreezeSatisfied) {
  process.exitCode = 1;
}
