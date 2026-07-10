import {
  execFileSync,
} from "node:child_process";

import {
  extname,
  join,
  relative,
} from "node:path";

import {
  readFileSync,
} from "node:fs";

import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "./ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "./providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "./controlledExecutionIntent.mjs";

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "./dryRunDispatchPlan.mjs";

const SECRET =
  "nexus-day-664-local-audit-fixture-secret";

const NOW = "2026-07-10T10:00:00.000Z";

const PROTECTED_ROUTE_FILES = [
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/controlled-action-evidence/route.js",
];

const SOURCE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".toml",
  ".txt",
]);

function normalizePath(value) {
  return String(value ?? "").replaceAll("\\", "/");
}

function safeReadText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

function inspectRepositoryFiles(repositoryRoot) {
  try {
    const trackedOutput = execFileSync(
      "git",
      ["ls-files"],
      {
        cwd: repositoryRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    const candidateOutput = execFileSync(
      "git",
      ["ls-files", "-co", "--exclude-standard"],
      {
        cwd: repositoryRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    return {
      available: true,
      trackedFiles: trackedOutput
        .split(/\r?\n/)
        .map(normalizePath)
        .filter(Boolean),
      candidateFiles: candidateOutput
        .split(/\r?\n/)
        .map(normalizePath)
        .filter(Boolean),
      error: null,
    };
  } catch (error) {
    return {
      available: false,
      trackedFiles: [],
      candidateFiles: [],
      error:
        error instanceof Error
          ? error.message
          : "Repository inspection unavailable.",
    };
  }
}

function detectTrackedEnvironmentFiles(trackedFiles) {
  const allowedNames = new Set([
    ".env.example",
    ".env.sample",
    ".env.template",
  ]);

  return trackedFiles.filter((file) => {
    const normalized = normalizePath(file);
    const name = normalized.split("/").at(-1) ?? "";

    return (
      name.startsWith(".env") &&
      !allowedNames.has(name)
    );
  });
}

function buildSecretPatterns() {
  return [
    {
      name: "OPENAI_STYLE_SECRET",
      expression: new RegExp(
        ["sk", "-", "[A-Za-z0-9_-]{20,}"].join(""),
        "g",
      ),
    },
    {
      name: "GOOGLE_API_KEY",
      expression: new RegExp(
        ["AIza", "[0-9A-Za-z_-]{35}"].join(""),
        "g",
      ),
    },
    {
      name: "AWS_ACCESS_KEY",
      expression: new RegExp(
        ["AKIA", "[0-9A-Z]{16}"].join(""),
        "g",
      ),
    },
    {
      name: "GITHUB_TOKEN",
      expression: new RegExp(
        ["ghp_", "[A-Za-z0-9]{30,}"].join(""),
        "g",
      ),
    },
    {
      name: "SLACK_BOT_TOKEN",
      expression: new RegExp(
        ["xoxb", "-", "[0-9A-Za-z-]{20,}"].join(""),
        "g",
      ),
    },
    {
      name: "PRIVATE_KEY_MATERIAL",
      expression: new RegExp(
        [
          "-----BEGIN",
          " (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        ].join(""),
        "g",
      ),
    },
  ];
}

function scanCandidateFilesForSecrets(
  repositoryRoot,
  candidateFiles,
) {
  const patterns = buildSecretPatterns();
  const findings = [];

  for (const file of candidateFiles) {
    const normalized = normalizePath(file);
    const name = normalized.split("/").at(-1) ?? "";
    const extension = extname(name).toLowerCase();

    if (
      !SOURCE_EXTENSIONS.has(extension) &&
      !name.startsWith(".env")
    ) {
      continue;
    }

    const content = safeReadText(
      join(repositoryRoot, ...normalized.split("/")),
    );

    if (content === null) {
      continue;
    }

    for (const pattern of patterns) {
      pattern.expression.lastIndex = 0;

      if (pattern.expression.test(content)) {
        findings.push({
          file: normalized,
          pattern: pattern.name,
        });
      }
    }
  }

  return findings;
}

function inspectProtectedRoutes(repositoryRoot) {
  const missingFiles = [];
  const unsafeIndicators = [];
  const missingSecretGates = [];

  const unsafePatterns = [
    {
      name: "EXECUTION_AUTHORIZED_TRUE",
      expression:
        /executionAuthorized\s*:\s*true/,
    },
    {
      name: "EXTERNAL_EXECUTION_TRUE",
      expression:
        /externalExecutionPerformed\s*:\s*true/,
    },
    {
      name: "PROVIDER_INVOCATION_TRUE",
      expression:
        /providerInvocationPerformed\s*:\s*true/,
    },
    {
      name: "NETWORK_FETCH_PRESENT",
      expression: /\bfetch\s*\(/,
    },
    {
      name: "AXIOS_INVOCATION_PRESENT",
      expression: /\baxios\s*\./,
    },
    {
      name: "PAYMENT_PROVIDER_INVOCATION_PRESENT",
      expression: /\bstripe\s*\./i,
    },
    {
      name: "MESSAGE_PROVIDER_INVOCATION_PRESENT",
      expression: /\b(?:twilio|whatsapp)\s*\./i,
    },
  ];

  for (const file of PROTECTED_ROUTE_FILES) {
    const absolutePath = join(
      repositoryRoot,
      ...file.split("/"),
    );

    const content = safeReadText(absolutePath);

    if (content === null) {
      missingFiles.push(file);
      continue;
    }

    if (
      !content.includes(
        "NEXUS_OWNER_RESOLUTION_SIGNING_SECRET",
      )
    ) {
      missingSecretGates.push(file);
    }

    for (const pattern of unsafePatterns) {
      if (pattern.expression.test(content)) {
        unsafeIndicators.push({
          file,
          indicator: pattern.name,
        });
      }
    }
  }

  return {
    missingFiles,
    unsafeIndicators,
    missingSecretGates,
  };
}

function createPipeline({
  authorityTenantId,
  resolutionSignature,
  consumedResolutionIds = [],
  permanentOutcome = false,
  adapters,
  claimantOwnerId,
  activeClaimExists = false,
  consumedClaimIds = [],
  adapterManifests,
  outcomes,
} = {}) {
  const action = {
    tenantId: "tenant-day-664",
    actionId: "action-day-664",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest:
      "sha256:day-664-critical-risk-audit",
  };

  const authority = {
    tenantId:
      authorityTenantId ?? action.tenantId,
    ownerId: "owner-day-664",
    authorityEpoch: "authority-epoch-day-664",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const signedResolution =
    createSignedOwnerResolution({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      resolutionId: "resolution-day-664",
      authorityEpoch: authority.authorityEpoch,
      nonce: "nonce-day-664",
      issuedAt: "2026-07-10T09:55:00.000Z",
      expiresAt: "2026-07-10T10:15:00.000Z",
      signingSecret: SECRET,
    });

  const resolution = {
    ...signedResolution,
    ...(resolutionSignature
      ? { signature: resolutionSignature }
      : {}),
  };

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action,
      authority,
      resolution,
      replay: {
        consumedResolutionIds,
        consumedNonces: [],
        retryCount: 0,
        permanentOutcome: false,
      },
      signingSecret: SECRET,
      now: NOW,
    });

  const defaultAdapters = [
    {
      adapterId: "adapter-alpha-day-664",
      providerId: "provider-alpha-day-664",
      status: "HEALTHY",
      priority: 1,
      capabilities: ["SAFE_DRAFT_ADMISSION"],
    },
    {
      adapterId: "adapter-beta-day-664",
      providerId: "provider-beta-day-664",
      status: "HEALTHY",
      priority: 2,
      capabilities: ["SAFE_DRAFT_ADMISSION"],
    },
  ];

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action,
      admission,
      adapters: adapters ?? defaultAdapters,
      recovery: {
        retryCount: 0,
        permanentOutcome,
      },
      now: NOW,
    });

  const intent = createControlledExecutionIntent({
    action,
    admission,
    handoff,
    now: NOW,
  });

  const claim = claimControlledExecutionIntent({
    intent,
    claim: {
      claimId: "claim-day-664",
      intentId: intent.intentId,
      tenantId: action.tenantId,
      actionId: action.actionId,
      ownerId:
        claimantOwnerId ?? authority.ownerId,
      role: "OWNER",
      issuedAt: "2026-07-10T09:59:00.000Z",
      expiresAt: "2026-07-10T10:10:00.000Z",
    },
    replay: {
      consumedClaimIds,
      activeClaimExists,
    },
    now: NOW,
  });

  const defaultManifests = [
    {
      adapterId: "adapter-alpha-day-664",
      providerId: "provider-alpha-day-664",
      contractVersion: "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired: false,
    },
    {
      adapterId: "adapter-beta-day-664",
      providerId: "provider-beta-day-664",
      contractVersion: "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired: false,
    },
  ];

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests:
        adapterManifests ?? defaultManifests,
      now: NOW,
    });

  const defaultOutcomes = Object.fromEntries(
    plan.dispatchAttempts.map(
      (attempt, index) => [
        attempt.attemptId,
        index === 0
          ? "SIMULATED_RETRYABLE_FAILURE"
          : "SIMULATED_SUCCESS",
      ],
    ),
  );

  const simulation = simulateDryRunDispatch({
    plan,
    outcomes: outcomes ?? defaultOutcomes,
    now: NOW,
  });

  return {
    action,
    authority,
    resolution,
    admission,
    handoff,
    intent,
    claim,
    plan,
    simulation,
    adapters: adapters ?? defaultAdapters,
    adapterManifests:
      adapterManifests ?? defaultManifests,
  };
}

function safetyFlagsRemainLocked(pipeline) {
  const checks = [
    pipeline.admission.auditRecord
      ?.externalExecutionPerformed === false,
    pipeline.admission.auditRecord
      ?.persistencePerformed === false,

    pipeline.handoff.executionAuthorized === false,
    pipeline.handoff
      .externalExecutionPerformed === false,
    pipeline.handoff
      .providerInvocationPerformed === false,
    pipeline.handoff.persistencePerformed === false,

    pipeline.intent.executionAuthorized === false,
    pipeline.intent
      .externalExecutionPerformed === false,
    pipeline.intent
      .providerInvocationPerformed === false,
    pipeline.intent.persistencePerformed === false,

    pipeline.claim.executionAuthorized === false,
    pipeline.claim
      .externalExecutionPerformed === false,
    pipeline.claim
      .providerInvocationPerformed === false,
    pipeline.claim.persistencePerformed === false,

    pipeline.plan.executionAuthorized === false,
    pipeline.plan
      .externalExecutionPerformed === false,
    pipeline.plan
      .providerInvocationPerformed === false,
    pipeline.plan.persistencePerformed === false,

    pipeline.simulation
      .executionAuthorized === false,
    pipeline.simulation
      .externalExecutionPerformed === false,
    pipeline.simulation
      .providerInvocationPerformed === false,
    pipeline.simulation
      .persistencePerformed === false,
  ];

  return checks.every(Boolean);
}

function createControl(
  id,
  severity,
  passed,
  evidence,
) {
  return Object.freeze({
    id,
    severity,
    passed,
    status: passed ? "CLOSED" : "OPEN",
    evidence,
  });
}

export function runCriticalRiskAudit({
  repositoryRoot = process.cwd(),
} = {}) {
  const repository =
    inspectRepositoryFiles(repositoryRoot);

  const trackedEnvironmentFiles =
    detectTrackedEnvironmentFiles(
      repository.trackedFiles,
    );

  const exposedSecretFindings =
    repository.available
      ? scanCandidateFilesForSecrets(
          repositoryRoot,
          repository.candidateFiles,
        )
      : [];

  const protectedRoutes =
    inspectProtectedRoutes(repositoryRoot);

  const validPipeline = createPipeline();
  const deterministicPipeline = createPipeline();

  const forgedSignaturePipeline = createPipeline({
    resolutionSignature: "0".repeat(64),
  });

  const crossTenantPipeline = createPipeline({
    authorityTenantId: "tenant-foreign-day-664",
  });

  const replayedResolutionPipeline = createPipeline({
    consumedResolutionIds: [
      "resolution-day-664",
    ],
  });

  const permanentOutcomePipeline = createPipeline({
    permanentOutcome: true,
  });

  const singleProviderPipeline = createPipeline({
    adapters: [
      {
        adapterId: "adapter-alpha-day-664",
        providerId: "provider-alpha-day-664",
        status: "HEALTHY",
        priority: 1,
        capabilities: ["SAFE_DRAFT_ADMISSION"],
      },
    ],
  });

  const foreignOwnerPipeline = createPipeline({
    claimantOwnerId: "owner-foreign-day-664",
  });

  const concurrentClaimPipeline = createPipeline({
    activeClaimExists: true,
  });

  const replayedClaimPipeline = createPipeline({
    consumedClaimIds: ["claim-day-664"],
  });

  const missingManifestPipeline = createPipeline({
    adapterManifests: [
      {
        adapterId: "adapter-alpha-day-664",
        providerId: "provider-alpha-day-664",
        contractVersion:
          "nexus.adapter.contract.v1",
        status: "READY",
        supportsDryRun: true,
        externalInvocationRequired: false,
      },
    ],
  });

  const missingOutcomeBase = createPipeline();

  const missingOutcomeSimulation =
    simulateDryRunDispatch({
      plan: missingOutcomeBase.plan,
      outcomes: {},
      now: NOW,
    });

  const providerIds =
    validPipeline.plan.dispatchAttempts.map(
      (attempt) => attempt.providerId,
    );

  const controls = [
    createControl(
      "CRITICAL_REPOSITORY_INSPECTION_AVAILABLE",
      "CRITICAL",
      repository.available,
      repository.available
        ? "Git repository inspection completed."
        : repository.error,
    ),

    createControl(
      "CRITICAL_NO_TRACKED_ENVIRONMENT_SECRET_FILES",
      "CRITICAL",
      trackedEnvironmentFiles.length === 0,
      trackedEnvironmentFiles.length === 0
        ? "No protected environment file is tracked."
        : trackedEnvironmentFiles,
    ),

    createControl(
      "CRITICAL_NO_EXPOSED_PROVIDER_SECRETS",
      "CRITICAL",
      exposedSecretFindings.length === 0,
      exposedSecretFindings.length === 0
        ? "No recognized provider secret pattern found in tracked or unignored source files."
        : exposedSecretFindings,
    ),

    createControl(
      "CRITICAL_PROTECTED_ROUTES_PRESENT",
      "CRITICAL",
      protectedRoutes.missingFiles.length === 0,
      protectedRoutes.missingFiles.length === 0
        ? "All protected pipeline routes are present."
        : protectedRoutes.missingFiles,
    ),

    createControl(
      "CRITICAL_PROTECTED_ROUTES_FAIL_CLOSED_ON_MISSING_SECRET",
      "CRITICAL",
      protectedRoutes.missingSecretGates.length === 0,
      protectedRoutes.missingSecretGates.length === 0
        ? "Every protected route requires the owner-resolution signing secret."
        : protectedRoutes.missingSecretGates,
    ),

    createControl(
      "CRITICAL_NO_REAL_EXECUTION_IN_PROTECTED_ROUTES",
      "CRITICAL",
      protectedRoutes.unsafeIndicators.length === 0,
      protectedRoutes.unsafeIndicators.length === 0
        ? "No provider, payment, messaging, network, or execution-enabling indicator found."
        : protectedRoutes.unsafeIndicators,
    ),

    createControl(
      "CRITICAL_VALID_PIPELINE_REACHES_LOCAL_SIMULATION",
      "CRITICAL",
      validPipeline.admission.admitted === true &&
        validPipeline.handoff.prepared === true &&
        validPipeline.intent.created === true &&
        validPipeline.claim.claimed === true &&
        validPipeline.plan.created === true &&
        validPipeline.simulation.completed === true &&
        validPipeline.simulation.state ===
          "SIMULATED_SUCCESS_FOR_OWNER_REVIEW",
      {
        admission: validPipeline.admission.admitted,
        handoff: validPipeline.handoff.prepared,
        intent: validPipeline.intent.created,
        claim: validPipeline.claim.claimed,
        plan: validPipeline.plan.created,
        simulation:
          validPipeline.simulation.state,
      },
    ),

    createControl(
      "CRITICAL_ALL_REAL_EXECUTION_FLAGS_LOCKED",
      "CRITICAL",
      safetyFlagsRemainLocked(validPipeline),
      "Execution, provider invocation, and persistence flags remain false through the complete pipeline.",
    ),

    createControl(
      "CRITICAL_FORGED_OWNER_SIGNATURE_BLOCKED",
      "CRITICAL",
      forgedSignaturePipeline.admission.admitted ===
        false &&
        forgedSignaturePipeline.admission.reasonCodes.includes(
          "RESOLUTION_SIGNATURE_INVALID",
        ),
      forgedSignaturePipeline.admission.reasonCodes,
    ),

    createControl(
      "CRITICAL_CROSS_TENANT_AUTHORITY_BLOCKED",
      "CRITICAL",
      crossTenantPipeline.admission.admitted ===
        false &&
        crossTenantPipeline.admission.reasonCodes.includes(
          "TENANT_ISOLATION_VIOLATION",
        ),
      crossTenantPipeline.admission.reasonCodes,
    ),

    createControl(
      "CRITICAL_RESOLUTION_REPLAY_BLOCKED",
      "CRITICAL",
      replayedResolutionPipeline.admission.admitted ===
        false &&
        replayedResolutionPipeline.admission.reasonCodes.includes(
          "RESOLUTION_REPLAY_BLOCKED",
        ),
      replayedResolutionPipeline.admission.reasonCodes,
    ),

    createControl(
      "HIGH_PERMANENT_OUTCOME_REENTRY_BLOCKED",
      "HIGH",
      permanentOutcomePipeline.handoff.prepared ===
        false &&
        permanentOutcomePipeline.handoff.reasonCodes.includes(
          "PERMANENT_OUTCOME_ALREADY_RECORDED",
        ),
      permanentOutcomePipeline.handoff.reasonCodes,
    ),

    createControl(
      "HIGH_SINGLE_PROVIDER_DEPENDENCY_BLOCKED",
      "HIGH",
      singleProviderPipeline.handoff.prepared ===
        false &&
        singleProviderPipeline.handoff.reasonCodes.includes(
          "PROVIDER_FAILOVER_UNAVAILABLE",
        ),
      singleProviderPipeline.handoff.reasonCodes,
    ),

    createControl(
      "HIGH_FOREIGN_OWNER_CLAIM_BLOCKED",
      "HIGH",
      foreignOwnerPipeline.claim.claimed === false &&
        foreignOwnerPipeline.claim.reasonCodes.includes(
          "TRUSTED_OWNER_CLAIM_REQUIRED",
        ),
      foreignOwnerPipeline.claim.reasonCodes,
    ),

    createControl(
      "HIGH_CONCURRENT_CLAIM_BLOCKED",
      "HIGH",
      concurrentClaimPipeline.claim.claimed ===
        false &&
        concurrentClaimPipeline.claim.reasonCodes.includes(
          "ACTIVE_CLAIM_ALREADY_EXISTS",
        ),
      concurrentClaimPipeline.claim.reasonCodes,
    ),

    createControl(
      "HIGH_CLAIM_REPLAY_BLOCKED",
      "HIGH",
      replayedClaimPipeline.claim.claimed ===
        false &&
        replayedClaimPipeline.claim.reasonCodes.includes(
          "CLAIM_REPLAY_BLOCKED",
        ),
      replayedClaimPipeline.claim.reasonCodes,
    ),

    createControl(
      "HIGH_MISSING_ADAPTER_MANIFEST_BLOCKED",
      "HIGH",
      missingManifestPipeline.plan.created ===
        false &&
        missingManifestPipeline.plan.reasonCodes.includes(
          "ADAPTER_MANIFEST_UNAVAILABLE",
        ),
      missingManifestPipeline.plan.reasonCodes,
    ),

    createControl(
      "HIGH_MISSING_SIMULATION_OUTCOME_BLOCKED",
      "HIGH",
      missingOutcomeSimulation.completed === false &&
        missingOutcomeSimulation.reasonCodes.includes(
          "SIMULATION_OUTCOME_MISSING_OR_INVALID",
        ),
      missingOutcomeSimulation.reasonCodes,
    ),

    createControl(
      "HIGH_PROVIDER_INDEPENDENCE_VERIFIED",
      "HIGH",
      providerIds.length >= 2 &&
        new Set(providerIds).size >= 2,
      providerIds,
    ),

    createControl(
      "HIGH_PIPELINE_IDENTITIES_DETERMINISTIC",
      "HIGH",
      validPipeline.admission.admissionToken ===
        deterministicPipeline.admission.admissionToken &&
        validPipeline.handoff.handoffId ===
          deterministicPipeline.handoff.handoffId &&
        validPipeline.intent.intentId ===
          deterministicPipeline.intent.intentId &&
        validPipeline.claim.claimToken ===
          deterministicPipeline.claim.claimToken &&
        validPipeline.plan.planId ===
          deterministicPipeline.plan.planId &&
        validPipeline.simulation.simulationId ===
          deterministicPipeline.simulation.simulationId,
      "Admission, handoff, intent, claim, plan, and simulation identities are deterministic.",
    ),
  ];

  const openCriticalRisks = controls.filter(
    (control) =>
      control.severity === "CRITICAL" &&
      !control.passed,
  );

  const openHighRisks = controls.filter(
    (control) =>
      control.severity === "HIGH" &&
      !control.passed,
  );

  const developmentGatePassed =
    openCriticalRisks.length === 0 &&
    openHighRisks.length === 0;

  return Object.freeze({
    schemaVersion:
      "nexus.critical-risk-burn-down-report.v1",
    generatedAt: NOW,
    developmentGatePassed,
    publicLaunchAuthorized: false,
    realExecutionAuthorized: false,
    paymentAutomationAuthorized: false,
    whatsappAutoSendAuthorized: false,
    liveMigrationAuthorized: false,
    uncontrolledAiActionAuthorized: false,
    knownCriticalRiskCount:
      openCriticalRisks.length,
    knownHighRiskCount:
      openHighRisks.length,
    totalControlCount: controls.length,
    passedControlCount: controls.filter(
      (control) => control.passed,
    ).length,
    failedControlCount: controls.filter(
      (control) => !control.passed,
    ).length,
    openCriticalRiskIds: Object.freeze(
      openCriticalRisks.map(
        (control) => control.id,
      ),
    ),
    openHighRiskIds: Object.freeze(
      openHighRisks.map(
        (control) => control.id,
      ),
    ),
    controls: Object.freeze(controls),
    safetyBoundary: Object.freeze({
      auditAndLocalSimulationOnly: true,
      databaseMutationPerformed: false,
      providerInvocationPerformed: false,
      externalExecutionPerformed: false,
      customerActionPerformed: false,
      persistencePerformed: false,
    }),
  });
}


