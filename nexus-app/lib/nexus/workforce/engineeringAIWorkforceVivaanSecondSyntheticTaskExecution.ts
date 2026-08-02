import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-vivaan-second-synthetic-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_SCENARIO =
  "REGRESSION_RISK_CONTAINMENT_PLAN" as const;

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE =
  "Plan one bounded synthetic regression-risk containment evidence task without executing tests or changing code." as const;

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE =
  "A deterministic risk-based regression plan with coverage, stop conditions, evidence requirements, and recovery checks." as const;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,159}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer|credential|private[-_]?key|access[-_]?key)/i;

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
      "Unsupported deterministic Vivaan second-task value.",
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
    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }

    Object.freeze(value);
  }

  return value;
}

function requireSafeIdentifier(
  label: string,
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    !SAFE_IDENTIFIER_PATTERN.test(
      normalized,
    ) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  return normalized;
}

function requireIsoTimestamp(
  label: string,
  value: string,
): string {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be a canonical ISO timestamp.`,
    );
  }

  return value;
}

const CANONICAL_OWNER_REVIEW =
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

const CANONICAL_VIVAAN_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Vivaan",
    );

const CANONICAL_VIVAAN_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Vivaan",
    );

const CANONICAL_VIVAAN_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Vivaan",
    );

if (
  !CANONICAL_VIVAAN_PLAN ||
  !CANONICAL_VIVAAN_PREPARATION ||
  !CANONICAL_VIVAAN_DECISION
) {
  throw new Error(
    "Canonical Vivaan second-task sources are missing.",
  );
}

function getVivaanPlan():
  NonNullable<
    typeof CANONICAL_VIVAAN_PLAN
  > {
  return CANONICAL_VIVAAN_PLAN!;
}

function getVivaanPreparation():
  NonNullable<
    typeof CANONICAL_VIVAAN_PREPARATION
  > {
  return CANONICAL_VIVAAN_PREPARATION!;
}

function getVivaanDecision():
  NonNullable<
    typeof CANONICAL_VIVAAN_DECISION
  > {
  return CANONICAL_VIVAAN_DECISION!;
}

function validateCanonicalVivaanSources(): void {
  const plan =
    getVivaanPlan();

  const preparation =
    getVivaanPreparation();

  const decision =
    getVivaanDecision();

  if (
    plan.sequence !== 3 ||
    plan.employeeId !==
      "candidate-vivaan-v1" ||
    plan.employeeCode !==
      "nx-engineering-003" ||
    plan.publicName !==
      "Vivaan" ||
    plan.officialRole !==
      "AI Quality Assurance Director" ||
    plan.scenarioId !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_SCENARIO ||
    plan.objective !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    plan.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
    plan.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    plan.outputMode !==
      "PLAN_ONLY" ||
    plan.evidenceToolMode !==
      "READ_ONLY" ||
    plan.maximumTaskCount !== 1 ||
    plan.concurrentTaskLimit !== 0 ||
    plan.secondTaskExecutionAuthorized !==
      false ||
    plan.secondTaskExecuted !==
      false ||
    plan.concurrentExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Vivaan second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 3 ||
    preparation.employeeId !==
      plan.employeeId ||
    preparation.employeeCode !==
      plan.employeeCode ||
    preparation.runtimeId !==
      plan.runtimeId ||
    preparation.sourceCandidatePlanDigest !==
      plan.candidatePlanDigest ||
    preparation.scenarioId !==
      plan.scenarioId ||
    preparation.recommendedDecision !==
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    preparation.secondTaskExecutionAuthorized !==
      false ||
    preparation.secondTaskExecuted !==
      false ||
    preparation.concurrentExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Vivaan second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 3 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      plan.scenarioId ||
    decision.decision !==
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    decision.secondTaskExecutionAuthorized !==
      true ||
    decision.secondTaskExecutionPerformed !==
      false ||
    decision.currentlyExecutable !==
      false ||
    decision.waitingForPriorCandidateOwnerReview !==
      true ||
    decision.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    decision.authorityBoundary
      .ownerReviewRequiredImmediatelyAfterExecution !==
      true
  ) {
    throw new Error(
      "Canonical Vivaan second-task decision is invalid.",
    );
  }
}

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_REGRESSION_PLAN =
  deepFreeze({
    planId:
      "engineering-vivaan-second-synthetic-regression-risk-plan-001",

    evidenceClass:
      "DETERMINISTIC_REGRESSION_RISK_CONTAINMENT_PLAN",

    reviewOutcome:
      "BOUNDED_RISK_BASED_REGRESSION_PLAN_RECOMMENDED",

    planningMode:
      "PLAN_ONLY_NO_TEST_EXECUTION",

    testExecutionPerformed:
      false,

    codeChangePerformed:
      false,

    repositoryAccessPerformed:
      false,

    coverageMatrix: [
      {
        areaId:
          "CANONICAL_IDENTITY_AND_DIGEST_BINDING",

        riskLevel:
          "CRITICAL",

        coverageObjective:
          "Verify tenant, owner, candidate, runtime, scenario, sequence, and canonical digests remain exactly bound.",

        requiredEvidence: [
          "Leela owner-review decision digest",
          "Vivaan candidate-plan digest",
          "Vivaan decision-preparation digest",
          "Vivaan candidate-decision digest",
        ],

        passCondition:
          "Every canonical identity, sequence, scenario, and digest matches exactly.",

        stopCondition:
          "Stop immediately on any identity, sequence, scenario, or digest mismatch.",
      },
      {
        areaId:
          "SEQUENTIAL_EXECUTION_CONTROL",

        riskLevel:
          "CRITICAL",

        coverageObjective:
          "Verify only Vivaan is eligible and all five later candidates remain waiting.",

        requiredEvidence: [
          "Only-Vivaan executable marker",
          "Aggregate concurrency limit one",
          "Five candidates waiting marker",
          "Owner review after every task marker",
        ],

        passCondition:
          "Exactly one candidate is authorized and concurrent execution remains blocked.",

        stopCondition:
          "Stop if another candidate becomes executable or concurrency exceeds one.",
      },
      {
        areaId:
          "AUTHORITY_BOUNDARY_CONTAINMENT",

        riskLevel:
          "CRITICAL",

        coverageObjective:
          "Verify the synthetic task grants no repository, customer, provider, production, payment, legal, or launch authority.",

        requiredEvidence: [
          "Repository authority false",
          "Customer and delivery authority false",
          "Production and payment authority false",
          "Level 3 and Founder Liberation false",
        ],

        passCondition:
          "Every consequential authority remains explicitly false.",

        stopCondition:
          "Stop if any consequential authority becomes true, missing, or ambiguous.",
      },
      {
        areaId:
          "OWNER_REVIEW_AND_RECOVERY",

        riskLevel:
          "HIGH",

        coverageObjective:
          "Verify immediate owner review, emergency pause, rollback evidence, and canonical recovery checks remain mandatory.",

        requiredEvidence: [
          "Immediate owner-review marker",
          "Emergency-pause marker",
          "Rollback-evidence marker",
          "Next-candidate authorization false",
        ],

        passCondition:
          "Execution stops after one task and awaits a separate owner decision.",

        stopCondition:
          "Stop if continuation is attempted without owner review or recovery evidence.",
      },
      {
        areaId:
          "DETERMINISTIC_EVIDENCE_QUALITY",

        riskLevel:
          "HIGH",

        coverageObjective:
          "Verify the plan is complete, immutable, deterministic, and independently reviewable.",

        requiredEvidence: [
          "Coverage matrix",
          "Stop-condition register",
          "Evidence requirements",
          "Recovery-check register",
          "Execution digest",
        ],

        passCondition:
          "The same canonical input produces the same deeply immutable evidence digest.",

        stopCondition:
          "Stop if evidence is missing, mutable, non-deterministic, or inconsistent.",
      },
    ],

    stopConditions: [
      "Stop on the first canonical identity or digest mismatch.",
      "Stop if concurrent candidate execution is requested or detected.",
      "Stop if repository, customer, provider, production, payment, legal, or launch authority is introduced.",
      "Stop if evidence is missing, stale, cross-tenant, cross-owner, or inconsistent.",
      "Stop if emergency pause or rollback evidence is unavailable.",
      "Stop after this single synthetic task for mandatory owner review.",
    ],

    evidenceRequirements: [
      "Canonical Leela second-task owner-review decision",
      "Canonical Vivaan plan, preparation, and decision digests",
      "Five-area risk-based coverage matrix",
      "Explicit pass and stop conditions",
      "Pause, rollback, revalidation, and owner-continuation recovery checks",
      "Immutable deterministic execution digest",
    ],

    recoveryChecks: [
      {
        checkId:
          "RECOVERY_EMERGENCY_PAUSE",

        expectedState:
          "Emergency pause remains available before continuation.",
      },
      {
        checkId:
          "RECOVERY_ROLLBACK_EVIDENCE",

        expectedState:
          "Rollback evidence remains mandatory.",
      },
      {
        checkId:
          "RECOVERY_CANONICAL_REVALIDATION",

        expectedState:
          "Canonical identities and digests are revalidated after any defect.",
      },
      {
        checkId:
          "RECOVERY_OWNER_CONTINUATION",

        expectedState:
          "Only a separate owner-review decision can authorize the next candidate.",
      },
    ],

    knownLimitations: [
      "No real tests were executed by Vivaan.",
      "No repository content was read or changed by Vivaan.",
      "No production readiness was established.",
      "Independent validation remains pending.",
    ],
  } as const);

function validateRegressionPlan(): void {
  const plan =
    ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_REGRESSION_PLAN;

  if (
    plan.coverageMatrix.length !==
      5 ||
    plan.stopConditions.length !==
      6 ||
    plan.evidenceRequirements.length !==
      6 ||
    plan.recoveryChecks.length !==
      4 ||
    plan.testExecutionPerformed !==
      false ||
    plan.codeChangePerformed !==
      false ||
    plan.repositoryAccessPerformed !==
      false
  ) {
    throw new Error(
      "Vivaan regression-risk plan structure is invalid.",
    );
  }

  const areaIds =
    plan.coverageMatrix.map(
      (entry) =>
        entry.areaId,
    );

  if (
    new Set(areaIds).size !==
      areaIds.length ||
    plan.coverageMatrix.some(
      (entry) =>
        entry.requiredEvidence.some(
          (evidence) =>
            evidence.trim().length ===
              0,
        ) ||
        entry.passCondition.trim().length <
          20 ||
        entry.stopCondition.trim().length <
          20,
    )
  ) {
    throw new Error(
      "Vivaan regression-risk evidence is incomplete.",
    );
  }
}

export interface CreateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecutionInput {
  readonly executionId: string;

  readonly leelaOwnerReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

  readonly executedAt: string;
}

function buildVivaanExecution(
  executionId: string,
  executedAt: string,
) {
  const plan =
    getVivaanPlan();

  const preparation =
    getVivaanPreparation();

  const decision =
    getVivaanDecision();

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION,

    executionId,

    executionState:
      "ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTED" as const,

    tenantId:
      CANONICAL_OWNER_REVIEW.tenantId,

    ownerId:
      CANONICAL_OWNER_REVIEW.ownerId,

    employeeId:
      "candidate-vivaan-v1" as const,

    employeeCode:
      "nx-engineering-003" as const,

    publicName:
      "Vivaan" as const,

    officialRole:
      "AI Quality Assurance Director" as const,

    runtimeId:
      decision.runtimeId,

    sourceLeelaOwnerReviewDecisionId:
      CANONICAL_OWNER_REVIEW.decisionId,

    sourceLeelaOwnerReviewDecisionDigest:
      CANONICAL_OWNER_REVIEW.decisionDigest,

    sourceLeelaExecutionId:
      CANONICAL_OWNER_REVIEW.sourceExecutionId,

    sourceLeelaExecutionDigest:
      CANONICAL_OWNER_REVIEW.sourceExecutionDigest,

    sourceCandidatePlanDigest:
      plan.candidatePlanDigest,

    sourceCandidateDecisionPreparationDigest:
      preparation
        .candidateDecisionPreparationDigest,

    candidateDecisionDigest:
      decision.candidateDecisionDigest,

    taskSequence:
      2 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_SCENARIO,

    objective:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE,

    expectedEvidence:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

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

    regressionRiskPlan:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_REGRESSION_PLAN,

    executionBoundary: {
      canonicalLeelaOwnerReviewBound:
        true as const,

      sourceOwnerReviewIntegrityVerified:
        true as const,

      sourceCandidatePlanBound:
        true as const,

      sourceCandidateDecisionPreparationBound:
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

      exactVivaanSecondTaskExecuted:
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

      remainingFiveAuthorizedCandidatesWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      testsExecuted:
        false as const,

      codeChanged:
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
      "AWAIT_OWNER_ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_REVIEW" as const,

    executedAt,
  };

  return deepFreeze({
    ...executionCore,

    executionDigest:
      sha256(executionCore),
  });
}

export type EngineeringAIWorkforceVivaanSecondSyntheticTaskExecution =
  ReturnType<
    typeof buildVivaanExecution
  >;

export function validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution(
  record:
    EngineeringAIWorkforceVivaanSecondSyntheticTaskExecution,
): void {
  const {
    executionDigest,
    ...executionCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      executionDigest,
    ) ||
    executionDigest !==
      sha256(executionCore)
  ) {
    throw new Error(
      "Vivaan second-task execution integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
    CANONICAL_OWNER_REVIEW,
  );

  validateCanonicalVivaanSources();
  validateRegressionPlan();

  const plan =
    getVivaanPlan();

  const preparation =
    getVivaanPreparation();

  const decision =
    getVivaanDecision();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTED" ||
    record.tenantId !==
      CANONICAL_OWNER_REVIEW.tenantId ||
    record.ownerId !==
      CANONICAL_OWNER_REVIEW.ownerId ||
    record.employeeId !==
      "candidate-vivaan-v1" ||
    record.employeeCode !==
      "nx-engineering-003" ||
    record.publicName !==
      "Vivaan" ||
    record.officialRole !==
      "AI Quality Assurance Director" ||
    record.runtimeId !==
      decision.runtimeId ||
    record.sourceLeelaOwnerReviewDecisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    record.sourceLeelaOwnerReviewDecisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest ||
    record.sourceLeelaExecutionId !==
      CANONICAL_OWNER_REVIEW.sourceExecutionId ||
    record.sourceLeelaExecutionDigest !==
      CANONICAL_OWNER_REVIEW.sourceExecutionDigest ||
    record.sourceCandidatePlanDigest !==
      plan.candidatePlanDigest ||
    record.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    record.candidateDecisionDigest !==
      decision.candidateDecisionDigest ||
    record.taskSequence !== 2 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_SCENARIO ||
    record.objective !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    record.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE
  ) {
    throw new Error(
      "Vivaan second-task canonical binding is invalid.",
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
    task.remainingTaskCapacity !==
      0 ||
    task.concurrentTaskLimit !== 1 ||
    task.failureThreshold !== 1 ||
    task.ownerReviewFrequency !==
      "AFTER_EVERY_SYNTHETIC_TASK"
  ) {
    throw new Error(
      "Vivaan second-task contract is invalid.",
    );
  }

  if (
    record.regressionRiskPlan !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_REGRESSION_PLAN
  ) {
    throw new Error(
      "Vivaan regression-risk evidence binding is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  const requiredTrue = [
    boundary.canonicalLeelaOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceCandidatePlanBound,
    boundary.sourceCandidateDecisionPreparationBound,
    boundary.candidateDecisionBound,
    boundary.tenantIdentityBound,
    boundary.ownerIdentityBound,
    boundary.employeeIdentityBound,
    boundary.runtimeIdentityBound,
    boundary.exactVivaanSecondTaskExecuted,
    boundary.secondSyntheticTaskExecutionPerformed,
    boundary.deterministicEvidenceCreated,
    boundary.independentValidationRequired,
    boundary.ownerReviewRequired,
    boundary.ownerReviewRequiredImmediately,
    boundary.remainingFiveAuthorizedCandidatesWaiting,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.independentValidationCompleted,
    boundary.ownerDecisionMade,
    boundary.nextCandidateExecutionAuthorized,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
    boundary.testsExecuted,
    boundary.codeChanged,
    boundary.repositoryReadPerformed,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWritePerformed,
    boundary.repositoryWriteAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessPerformed,
    boundary.secretsAccessAuthorized,
    boundary.realCustomerDataUsed,
    boundary.realCustomerDataAccessAuthorized,
    boundary.realCustomerContactPerformed,
    boundary.realCustomerContactAuthorized,
    boundary.externalDeliveryPrepared,
    boundary.externalDeliveryExecuted,
    boundary.externalDeliveryAuthorized,
    boundary.liveProviderExecutionAuthorized,
    boundary.productionDatabaseAccessPerformed,
    boundary.productionDatabaseAuthorized,
    boundary.productionMutationPerformed,
    boundary.productionMutationAuthorized,
    boundary.productionDeploymentPrepared,
    boundary.productionDeploymentExecuted,
    boundary.productionDeploymentAuthorized,
    boundary.paymentExecutionPerformed,
    boundary.paymentExecutionAuthorized,
    boundary.financialCommitmentAuthorized,
    boundary.legalCommitmentAuthorized,
    boundary.autonomousDecisionAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    requiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    requiredFalse.some(
      (value) =>
        value !== false,
    ) ||
    boundary.taskExecutorInvocationCount !==
      1
  ) {
    throw new Error(
      "Vivaan second-task authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Vivaan second-task transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.taskContract,
    ) ||
    !Object.isFrozen(
      record.regressionRiskPlan,
    ) ||
    !Object.isFrozen(
      record.regressionRiskPlan
        .coverageMatrix,
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Vivaan second-task execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceVivaanSecondSyntheticTask(
  input:
    CreateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecutionInput,
): EngineeringAIWorkforceVivaanSecondSyntheticTaskExecution {
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
    input.leelaOwnerReviewDecision,
  );

  if (
    input.leelaOwnerReviewDecision.decisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    input.leelaOwnerReviewDecision.decisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest
  ) {
    throw new Error(
      "Only the canonical Leela second-task owner review can authorize Vivaan.",
    );
  }

  if (
    CANONICAL_OWNER_REVIEW.decision !==
      "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    CANONICAL_OWNER_REVIEW.vivaanSecondTaskExecutionAuthorized !==
      true ||
    CANONICAL_OWNER_REVIEW.vivaanSecondTaskExecutionPerformed !==
      false ||
    CANONICAL_OWNER_REVIEW.nextCandidate.employeeId !==
      "candidate-vivaan-v1" ||
    CANONICAL_OWNER_REVIEW.nextCandidate.taskSequence !==
      2 ||
    CANONICAL_OWNER_REVIEW.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_SCENARIO ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .onlyVivaanCurrentlyExecutable !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .remainingFiveAuthorizedCandidatesWaiting !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    CANONICAL_OWNER_REVIEW.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_THREE"
  ) {
    throw new Error(
      "Vivaan second synthetic task is not owner-authorized.",
    );
  }

  const executionId =
    requireSafeIdentifier(
      "Vivaan second-task execution identity",
      input.executionId,
    );

  const executedAt =
    requireIsoTimestamp(
      "Vivaan second-task execution time",
      input.executedAt,
    );

  if (
    Date.parse(executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Vivaan second-task execution cannot precede Leela owner review.",
    );
  }

  validateCanonicalVivaanSources();
  validateRegressionPlan();

  const record =
    buildVivaanExecution(
      executionId,
      executedAt,
    );

  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION =
  executeEngineeringAIWorkforceVivaanSecondSyntheticTask({
    executionId:
      "engineering-vivaan-second-synthetic-task-execution-001",

    leelaOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-08-02T08:35:00.000Z",
  });