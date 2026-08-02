import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-ishaan-second-synthetic-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO =
  "MODULAR_ARCHITECTURE_EVOLUTION_PLAN" as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE =
  "Plan one bounded synthetic architecture-evolution evidence task without repository access or implementation authority." as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE =
  "A deterministic architecture trade-off plan with tenant isolation, owner control, rollback, and audit requirements." as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_FIXTURE =
  {
    fixtureId:
      "engineering-ishaan-second-synthetic-architecture-fixture-001",

    systemName:
      "NEXUS Synthetic Owner-Controlled Work Orchestration Core",

    currentArchitecture:
      "BOUNDED_MODULAR_MONOLITH",

    proposedEvolutionQuestion:
      "Determine whether the synthetic orchestration core should remain a bounded modular monolith or introduce one isolated internal execution service while preserving tenant isolation, owner control, deterministic audit evidence, rollback, and fail-closed operation.",

    syntheticOnly:
      true,

    realCustomerDataUsed:
      false,

    repositoryEvidenceUsed:
      false,

    productionEvidenceUsed:
      false,

    externalProviderEvidenceUsed:
      false,

    baselineModules: [
      "Tenant Command Intake",
      "Owner Authority Policy",
      "Bounded Work Planner",
      "Synthetic Execution Coordinator",
      "Draft Result Store",
      "Immutable Audit Evidence",
      "Emergency Pause Coordinator",
    ],

    evolutionDrivers: [
      "Preserve fast and simple owner-controlled operation",
      "Prevent cross-tenant state leakage",
      "Keep authorization fail closed",
      "Support deterministic evidence reconstruction",
      "Allow reversible internal evolution",
      "Avoid premature distributed-system complexity",
    ],

    nonNegotiableInvariants: [
      "Every request remains tenant and owner bound",
      "No authority is inferred from workflow position",
      "Every execution remains explicitly approved",
      "No customer-facing delivery interface is introduced",
      "No repository or production access is required",
      "Emergency pause remains available",
      "Rollback evidence remains mandatory",
    ],

    prohibitedActions: [
      "No repository read or write",
      "No branch pull request or merge",
      "No implementation or deployment",
      "No production database access or mutation",
      "No customer contact or external delivery",
      "No live provider execution",
      "No payment financial or legal commitment",
      "No Level 3 authority",
    ],
  } as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_TRADE_OFF_PLAN =
  {
    planStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    evidenceClass:
      "DETERMINISTIC_ARCHITECTURE_TRADE_OFF_PLAN",

    reviewOutcome:
      "BOUNDED_INCREMENTAL_EVOLUTION_RECOMMENDED",

    recommendedOptionId:
      "OPTION_A_RETAIN_MODULAR_MONOLITH_WITH_STRONGER_INTERNAL_BOUNDARIES",

    recommendation:
      "Retain the bounded modular monolith for the synthetic orchestration core and strengthen typed internal boundaries around owner policy, execution coordination, audit evidence, and emergency pause. Defer service extraction until measured isolation or scaling evidence justifies the added operational risk.",

    options: [
      {
        optionId:
          "OPTION_A_RETAIN_MODULAR_MONOLITH_WITH_STRONGER_INTERNAL_BOUNDARIES",

        description:
          "Keep one deployable synthetic application boundary while enforcing narrow typed module interfaces and explicit owner-authority checks.",

        benefits: [
          "Lowest coordination and recovery complexity",
          "Simpler tenant-bound evidence reconstruction",
          "Fewer partial-failure modes",
          "Fast rollback to the prior internal module contract",
          "No new network trust boundary",
        ],

        tradeoffs: [
          "Requires disciplined prevention of direct cross-module state mutation",
          "Independent scaling remains limited",
          "Module ownership must remain explicit as the codebase grows",
        ],

        riskLevel:
          "LOW_TO_MODERATE",

        reversible:
          true,
      },

      {
        optionId:
          "OPTION_B_EXTRACT_INTERNAL_EXECUTION_COORDINATOR_SERVICE",

        description:
          "Extract the synthetic execution coordinator behind an internal tenant-bound interface while retaining owner policy and audit authority in the core.",

        benefits: [
          "Clearer runtime isolation for execution coordination",
          "Potential independent scaling",
          "More explicit failure containment boundary",
        ],

        tradeoffs: [
          "Introduces network and delivery failure modes",
          "Requires distributed tracing and idempotency evidence",
          "Complicates rollback and operational recovery",
          "Creates a larger security and monitoring surface",
        ],

        riskLevel:
          "MODERATE_TO_HIGH",

        reversible:
          true,
      },
    ],

    decisionCriteria: [
      {
        criterion:
          "Tenant isolation",

        preferredOptionId:
          "OPTION_A_RETAIN_MODULAR_MONOLITH_WITH_STRONGER_INTERNAL_BOUNDARIES",

        rationale:
          "Explicit in-process tenant context and typed module boundaries avoid a new network trust boundary while remaining fail closed.",
      },

      {
        criterion:
          "Owner authority preservation",

        preferredOptionId:
          "OPTION_A_RETAIN_MODULAR_MONOLITH_WITH_STRONGER_INTERNAL_BOUNDARIES",

        rationale:
          "A single owner-policy gate remains easier to verify and prevents authority expansion across service calls.",
      },

      {
        criterion:
          "Rollback and recovery",

        preferredOptionId:
          "OPTION_A_RETAIN_MODULAR_MONOLITH_WITH_STRONGER_INTERNAL_BOUNDARIES",

        rationale:
          "Internal contract rollback is simpler than coordinating application and service rollback.",
      },

      {
        criterion:
          "Operational complexity",

        preferredOptionId:
          "OPTION_A_RETAIN_MODULAR_MONOLITH_WITH_STRONGER_INTERNAL_BOUNDARIES",

        rationale:
          "The current synthetic evidence provides no verified need for distributed execution complexity.",
      },

      {
        criterion:
          "Future scalability",

        preferredOptionId:
          "OPTION_B_EXTRACT_INTERNAL_EXECUTION_COORDINATOR_SERVICE",

        rationale:
          "Service extraction may become appropriate only after measured load isolation and operational readiness evidence exists.",
      },
    ],

    tenantIsolationRequirements: [
      "Carry an immutable tenant identifier through every internal interface.",
      "Reject missing or conflicting tenant context before planning or execution.",
      "Prohibit cross-tenant reads writes caches queues and audit correlation.",
      "Bind every result and evidence digest to the same tenant and owner.",
      "Require tenant-scoped idempotency keys before any future persistence.",
    ],

    ownerControlRequirements: [
      "Run owner-authority policy before every executable operation.",
      "Reject inferred inherited or delegated authority.",
      "Stop after this task for immediate owner review.",
      "Do not authorize the next candidate through execution evidence.",
      "Keep emergency pause and owner override available.",
    ],

    auditRequirements: [
      "Bind the execution digest to the canonical owner decision.",
      "Bind the candidate decision and decision-preparation digests.",
      "Record scenario objective expected evidence and selected option.",
      "Retain both considered options and their tradeoffs.",
      "Record every blocked authority as false.",
      "Preserve append-only deterministic evidence.",
    ],

    rollbackPlan: [
      "Discard this synthetic trade-off draft if owner review rejects it.",
      "Retain immutable evidence that the rejected draft existed.",
      "Restore the prior bounded modular-monolith architecture assumption.",
      "Do not alter repository runtime deployment or production state.",
      "Keep all remaining candidates blocked until a separate owner review decision.",
      "Use emergency pause on any source identity digest or authority mismatch.",
    ],

    identifiedRisks: [
      {
        risk:
          "Internal boundaries become naming-only abstractions.",

        mitigation:
          "Require narrow typed interfaces and prohibit direct cross-module mutation.",
      },

      {
        risk:
          "A future service extraction expands authority implicitly.",

        mitigation:
          "Require a separate owner decision and independent security reliability and recovery evidence.",
      },

      {
        risk:
          "Synthetic planning is mistaken for implementation approval.",

        mitigation:
          "Keep repository implementation deployment customer and provider authority explicitly false.",
      },

      {
        risk:
          "Audit evidence diverges from the reviewed architecture choice.",

        mitigation:
          "Digest-bind the complete option comparison recommendation controls and rollback plan.",
      },
    ],

    deterministicEvidenceProduced:
      true,

    independentValidationCompleted:
      false,

    independentValidationRequired:
      true,

    assumptionsMade:
      false,

    unsupportedClaimsIncluded:
      false,

    ownerDecisionMade:
      false,

    ownerReviewPending:
      true,

    implementationPrepared:
      false,

    implementationExecuted:
      false,

    repositoryChangePrepared:
      false,

    repositoryChangeExecuted:
      false,

    productionDeploymentPrepared:
      false,

    productionDeploymentExecuted:
      false,

    customerDeliveryPrepared:
      false,

    customerDeliveryExecuted:
      false,
  } as const;

export interface CreateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecutionInput {
  readonly executionId: string;

  readonly ownerSecondTaskExecutionDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

  readonly executedAt: string;
}

export interface EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION;

  readonly executionId: string;

  readonly executionState:
    "ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTED";

  readonly tenantId: string;

  readonly ownerId: string;

  readonly employeeId: string;

  readonly employeeCode: string;

  readonly publicName: "Ishaan";

  readonly officialRole: string;

  readonly runtimeId: string;

  readonly ownerSecondTaskExecutionDecisionId:
    string;

  readonly ownerSecondTaskExecutionDecisionDigest:
    string;

  readonly sourceDecisionPreparationId:
    string;

  readonly sourceDecisionPreparationDigest:
    string;

  readonly sourceCandidateDecisionPreparationDigest:
    string;

  readonly sourceCandidatePlanDigest:
    string;

  readonly candidateDecisionDigest:
    string;

  readonly taskSequence: 2;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO;

  readonly objective:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE;

  readonly expectedEvidence:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE;

  readonly taskContract: Readonly<{
    workstreamId:
      "routine-engineering-second-task-evidence";

    evidenceClass:
      "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    evidenceToolMode:
      "READ_ONLY";

    outputMode:
      "DRAFT_ONLY";

    maximumTaskCount: 1;

    executedTaskCount: 1;

    remainingTaskCapacity: 0;

    concurrentTaskLimit: 1;

    failureThreshold: 1;

    ownerReviewFrequency:
      "AFTER_EVERY_SYNTHETIC_TASK";
  }>;

  readonly syntheticArchitectureFixture:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_FIXTURE;

  readonly architectureTradeOffPlan:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_TRADE_OFF_PLAN;

  readonly executionBoundary: Readonly<{
    canonicalOwnerDecisionBound: true;

    ownerDecisionIntegrityVerified:
      true;

    canonicalDecisionPreparationBound:
      true;

    decisionPreparationIntegrityVerified:
      true;

    sourceCandidatePlanBound: true;

    candidateDecisionBound: true;

    tenantIdentityBound: true;

    ownerIdentityBound: true;

    employeeIdentityBound: true;

    runtimeIdentityBound: true;

    approvalBypassAllowed: false;

    exactIshaanSecondTaskExecuted:
      true;

    secondSyntheticTaskExecutionPerformed:
      true;

    taskExecutorInvocationCount: 1;

    deterministicEvidenceCreated:
      true;

    independentValidationRequired:
      true;

    independentValidationCompleted:
      false;

    ownerDecisionMade: false;

    ownerReviewRequired: true;

    ownerReviewRequiredImmediately:
      true;

    nextCandidateExecutionAuthorized:
      false;

    remainingSevenAuthorizedCandidatesWaiting:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    thirdSyntheticTaskExecutionAuthorized:
      false;

    repositoryReadPerformed: false;

    repositoryReadAuthorized: false;

    repositoryWritePerformed: false;

    repositoryWriteAuthorized: false;

    branchCreationAuthorized: false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized: false;

    secretsAccessPerformed: false;

    secretsAccessAuthorized: false;

    realCustomerDataUsed: false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactPerformed:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryPrepared: false;

    externalDeliveryExecuted: false;

    externalDeliveryAuthorized: false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAccessPerformed:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationPerformed:
      false;

    productionMutationAuthorized:
      false;

    productionDeploymentPrepared:
      false;

    productionDeploymentExecuted:
      false;

    productionDeploymentAuthorized:
      false;

    paymentExecutionPerformed: false;

    paymentExecutionAuthorized: false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized: false;

    autonomousDecisionAuthorized:
      false;

    levelThreeAuthorityGranted: false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized: false;

    founderLiberationAchieved: false;

    founderReleasedFromRoutineExecution:
      false;

    monitoringRequired: true;

    emergencyPauseAvailable: true;

    rollbackEvidenceRequired: true;

    ownerFinalAuthorityPreserved:
      true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW";

  readonly executedAt: string;

  readonly executionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Ishaan second synthetic task execution value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      value,
    )
  ) {
    throw new Error(
      `${label} is invalid or credential-bearing.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

const decision =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

function validateCanonicalSources(): void {
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision(
    decision,
  );

  const ishaanDecision =
    decision.candidateDecisions[0];

  const ishaanPreparation =
    preparation
      .candidateDecisionPreparations[0];

  if (
    !ishaanDecision ||
    !ishaanPreparation ||
    decision.candidateDecisions.length !==
      8 ||
    preparation
      .candidateDecisionPreparations
      .length !== 8 ||
    decision.aggregateSummary
      .approvedSecondTaskCount !== 8 ||
    decision.aggregateSummary
      .secondTaskExecutionAuthorizedCount !==
      8 ||
    decision.aggregateSummary
      .secondTaskExecutionPerformedCount !==
      0 ||
    decision.aggregateSummary
      .currentlyExecutableCandidateCount !==
      1 ||
    decision.aggregateSummary
      .pendingAuthorizedCandidateCount !==
      7 ||
    decision.authorityBoundary
      .aggregateConcurrentExecutionLimit !==
      1 ||
    decision.authorityBoundary
      .stopAfterEveryTaskForOwnerReview !==
      true ||
    decision.authorityBoundary
      .repositoryReadAuthorized !== false ||
    decision.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    decision.authorityBoundary
      .productionDeploymentAuthorized !==
      false ||
    decision.authorityBoundary
      .paymentExecutionAuthorized !==
      false ||
    decision.authorityBoundary
      .publicLaunchAuthorized !== false ||
    decision.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    decision.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    decision.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_ONE" ||
    ishaanDecision.sequence !== 1 ||
    ishaanDecision.publicName !==
      "Ishaan" ||
    ishaanDecision.taskSequence !== 2 ||
    ishaanDecision.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO ||
    ishaanDecision.secondTaskExecutionAuthorized !==
      true ||
    ishaanDecision.secondTaskExecutionPerformed !==
      false ||
    ishaanDecision.currentlyExecutable !==
      true ||
    ishaanDecision.waitingForPriorCandidateOwnerReview !==
      false ||
    ishaanDecision.sourceCandidateDecisionPreparationDigest !==
      ishaanPreparation
        .candidateDecisionPreparationDigest ||
    ishaanPreparation.publicName !==
      "Ishaan" ||
    ishaanPreparation.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO ||
    ishaanPreparation.objective !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    ishaanPreparation.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
    decision.candidateDecisions
      .slice(1)
      .some(
        (candidate) =>
          candidate.currentlyExecutable !==
            false ||
          candidate
            .waitingForPriorCandidateOwnerReview !==
            true ||
          candidate
            .secondTaskExecutionPerformed !==
            false,
      )
  ) {
    throw new Error(
      "Ishaan second synthetic task execution requires the exact canonical approved sequence-one decision.",
    );
  }
}

export function validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution(
  record:
    EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Ishaan second synthetic task execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Ishaan second synthetic task execution time",
    record.executedAt,
  );

  requireDigest(
    "Ishaan second synthetic task execution digest",
    record.executionDigest,
  );

  const ishaanDecision =
    decision.candidateDecisions[0];

  const ishaanPreparation =
    preparation
      .candidateDecisionPreparations[0];

  if (
    !ishaanDecision ||
    !ishaanPreparation
  ) {
    throw new Error(
      "Canonical Ishaan second-task source is missing.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTED" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.employeeId !==
      ishaanDecision.employeeId ||
    record.employeeCode !==
      ishaanDecision.employeeCode ||
    record.publicName !== "Ishaan" ||
    record.officialRole !==
      ishaanDecision.officialRole ||
    record.runtimeId !==
      ishaanDecision.runtimeId ||
    record.ownerSecondTaskExecutionDecisionId !==
      decision.decisionId ||
    record.ownerSecondTaskExecutionDecisionDigest !==
      decision.decisionDigest ||
    record.sourceDecisionPreparationId !==
      decision.sourcePreparationId ||
    record.sourceDecisionPreparationDigest !==
      decision.sourcePreparationDigest ||
    record.sourceCandidateDecisionPreparationDigest !==
      ishaanDecision
        .sourceCandidateDecisionPreparationDigest ||
    record.sourceCandidatePlanDigest !==
      ishaanPreparation
        .sourceCandidatePlanDigest ||
    record.candidateDecisionDigest !==
      ishaanDecision.candidateDecisionDigest ||
    record.taskSequence !== 2 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO ||
    record.objective !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    record.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE
  ) {
    throw new Error(
      "Ishaan second synthetic task execution source binding is invalid.",
    );
  }

  const task =
    record.taskContract;

  if (
    task.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    task.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE" ||
    task.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    task.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    task.executionMode !==
      "SANDBOX_ONLY" ||
    task.evidenceToolMode !==
      "READ_ONLY" ||
    task.outputMode !==
      "DRAFT_ONLY" ||
    task.maximumTaskCount !== 1 ||
    task.executedTaskCount !== 1 ||
    task.remainingTaskCapacity !== 0 ||
    task.concurrentTaskLimit !== 1 ||
    task.failureThreshold !== 1 ||
    task.ownerReviewFrequency !==
      "AFTER_EVERY_SYNTHETIC_TASK"
  ) {
    throw new Error(
      "Ishaan second synthetic task contract is invalid.",
    );
  }

  if (
    stableStringify(
      record.syntheticArchitectureFixture,
    ) !==
      stableStringify(
        ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_FIXTURE,
      ) ||
    stableStringify(
      record.architectureTradeOffPlan,
    ) !==
      stableStringify(
        ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_TRADE_OFF_PLAN,
      )
  ) {
    throw new Error(
      "Ishaan second synthetic architecture evidence is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalOwnerDecisionBound !==
      true ||
    boundary.ownerDecisionIntegrityVerified !==
      true ||
    boundary.canonicalDecisionPreparationBound !==
      true ||
    boundary.decisionPreparationIntegrityVerified !==
      true ||
    boundary.sourceCandidatePlanBound !==
      true ||
    boundary.candidateDecisionBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.employeeIdentityBound !==
      true ||
    boundary.runtimeIdentityBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.exactIshaanSecondTaskExecuted !==
      true ||
    boundary.secondSyntheticTaskExecutionPerformed !==
      true ||
    boundary.taskExecutorInvocationCount !==
      1 ||
    boundary.deterministicEvidenceCreated !==
      true ||
    boundary.independentValidationRequired !==
      true ||
    boundary.independentValidationCompleted !==
      false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !==
      true ||
    boundary.nextCandidateExecutionAuthorized !==
      false ||
    boundary.remainingSevenAuthorizedCandidatesWaiting !==
      true ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.thirdSyntheticTaskExecutionAuthorized !==
      false ||
    boundary.repositoryReadPerformed !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWritePerformed !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !== false ||
    boundary.secretsAccessPerformed !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataUsed !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactPerformed !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryPrepared !==
      false ||
    boundary.externalDeliveryExecuted !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAccessPerformed !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationPerformed !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionDeploymentPrepared !==
      false ||
    boundary.productionDeploymentExecuted !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.paymentExecutionPerformed !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.levelThreeAuthorityGranted !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false ||
    boundary.monitoringRequired !== true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW"
  ) {
    throw new Error(
      "Ishaan second synthetic task execution boundary is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
      Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Ishaan second synthetic task execution cannot precede owner approval.",
    );
  }

  const {
    executionDigest,
    ...recordCore
  } = record;

  if (
    sha256(recordCore) !==
      executionDigest
  ) {
    throw new Error(
      "Ishaan second synthetic task execution integrity verification failed.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.taskContract,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture
        .baselineModules,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture
        .evolutionDrivers,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture
        .nonNegotiableInvariants,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture
        .prohibitedActions,
    ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan,
    ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan.options,
    ) ||
    record.architectureTradeOffPlan.options.some(
      (option) =>
        !Object.isFrozen(option) ||
        !Object.isFrozen(option.benefits) ||
        !Object.isFrozen(option.tradeoffs),
    ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan
        .decisionCriteria,
    ) ||
    record.architectureTradeOffPlan
      .decisionCriteria
      .some(
        (criterion) =>
          !Object.isFrozen(criterion),
      ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan
        .tenantIsolationRequirements,
    ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan
        .ownerControlRequirements,
    ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan
        .auditRequirements,
    ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan
        .rollbackPlan,
    ) ||
    !Object.isFrozen(
      record.architectureTradeOffPlan
        .identifiedRisks,
    ) ||
    record.architectureTradeOffPlan
      .identifiedRisks
      .some(
        (risk) =>
          !Object.isFrozen(risk),
      ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Ishaan second synthetic task execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceIshaanSecondSyntheticTask(
  input:
    CreateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecutionInput,
): EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution {
  if (
    input.ownerSecondTaskExecutionDecision !==
      decision
  ) {
    throw new Error(
      "Ishaan second synthetic task execution requires the canonical owner second-task execution decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Ishaan second synthetic task execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Ishaan second synthetic task execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
      Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Ishaan second synthetic task execution cannot precede owner approval.",
    );
  }

  const ishaanDecision =
    decision.candidateDecisions[0];

  const ishaanPreparation =
    preparation
      .candidateDecisionPreparations[0];

  if (
    !ishaanDecision ||
    !ishaanPreparation
  ) {
    throw new Error(
      "Canonical Ishaan second-task source is missing.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTED" as const,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    employeeId:
      ishaanDecision.employeeId,

    employeeCode:
      ishaanDecision.employeeCode,

    publicName:
      "Ishaan" as const,

    officialRole:
      ishaanDecision.officialRole,

    runtimeId:
      ishaanDecision.runtimeId,

    ownerSecondTaskExecutionDecisionId:
      decision.decisionId,

    ownerSecondTaskExecutionDecisionDigest:
      decision.decisionDigest,

    sourceDecisionPreparationId:
      decision.sourcePreparationId,

    sourceDecisionPreparationDigest:
      decision.sourcePreparationDigest,

    sourceCandidateDecisionPreparationDigest:
      ishaanDecision
        .sourceCandidateDecisionPreparationDigest,

    sourceCandidatePlanDigest:
      ishaanPreparation
        .sourceCandidatePlanDigest,

    candidateDecisionDigest:
      ishaanDecision
        .candidateDecisionDigest,

    taskSequence:
      2 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO,

    objective:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE,

    expectedEvidence:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

    taskContract: {
      workstreamId:
        "routine-engineering-second-task-evidence" as const,

      evidenceClass:
        "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      evidenceToolMode:
        "READ_ONLY" as const,

      outputMode:
        "DRAFT_ONLY" as const,

      maximumTaskCount:
        1 as const,

      executedTaskCount:
        1 as const,

      remainingTaskCapacity:
        0 as const,

      concurrentTaskLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_SYNTHETIC_TASK" as const,
    },

    syntheticArchitectureFixture:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_FIXTURE,

    architectureTradeOffPlan:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_TRADE_OFF_PLAN,

    executionBoundary: {
      canonicalOwnerDecisionBound:
        true as const,

      ownerDecisionIntegrityVerified:
        true as const,

      canonicalDecisionPreparationBound:
        true as const,

      decisionPreparationIntegrityVerified:
        true as const,

      sourceCandidatePlanBound:
        true as const,

      candidateDecisionBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      employeeIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      exactIshaanSecondTaskExecuted:
        true as const,

      secondSyntheticTaskExecutionPerformed:
        true as const,

      taskExecutorInvocationCount:
        1 as const,

      deterministicEvidenceCreated:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

      ownerReviewRequiredImmediately:
        true as const,

      nextCandidateExecutionAuthorized:
        false as const,

      remainingSevenAuthorizedCandidatesWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      repositoryReadPerformed:
        false as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWritePerformed:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      secretsAccessPerformed:
        false as const,

      secretsAccessAuthorized:
        false as const,

      realCustomerDataUsed:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactPerformed:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryPrepared:
        false as const,

      externalDeliveryExecuted:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAccessPerformed:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationPerformed:
        false as const,

      productionMutationAuthorized:
        false as const,

      productionDeploymentPrepared:
        false as const,

      productionDeploymentExecuted:
        false as const,

      productionDeploymentAuthorized:
        false as const,

      paymentExecutionPerformed:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      financialCommitmentAuthorized:
        false as const,

      legalCommitmentAuthorized:
        false as const,

      autonomousDecisionAuthorized:
        false as const,

      levelThreeAuthorityGranted:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      founderLiberationAchieved:
        false as const,

      founderReleasedFromRoutineExecution:
        false as const,

      monitoringRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,

      rollbackEvidenceRequired:
        true as const,

      ownerFinalAuthorityPreserved:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution;

  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION =
  executeEngineeringAIWorkforceIshaanSecondSyntheticTask({
    executionId:
      "engineering-ishaan-second-synthetic-task-execution-001",

    ownerSecondTaskExecutionDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,

    executedAt:
      "2026-08-02T05:15:00.000Z",
  });