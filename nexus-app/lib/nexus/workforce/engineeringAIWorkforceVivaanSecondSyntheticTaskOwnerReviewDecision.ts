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
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceVivaanSecondSyntheticTaskExecution";

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-vivaan-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_VIVAAN_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
  )[number];

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
      "Unsupported deterministic Vivaan second-task owner-review value.",
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

function requireReason(
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length < 40 ||
    normalized.length > 1_000 ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Vivaan second-task owner-review reason is invalid.",
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

const CANONICAL_VIVAAN_EXECUTION =
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

const CANONICAL_ANAYA_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Anaya",
    );

const CANONICAL_ANAYA_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Anaya",
    );

const CANONICAL_ANAYA_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Anaya",
    );

if (
  !CANONICAL_ANAYA_PLAN ||
  !CANONICAL_ANAYA_PREPARATION ||
  !CANONICAL_ANAYA_DECISION
) {
  throw new Error(
    "Canonical Anaya second-task continuation sources are missing.",
  );
}

function getAnayaPlan():
  NonNullable<
    typeof CANONICAL_ANAYA_PLAN
  > {
  return CANONICAL_ANAYA_PLAN!;
}

function getAnayaPreparation():
  NonNullable<
    typeof CANONICAL_ANAYA_PREPARATION
  > {
  return CANONICAL_ANAYA_PREPARATION!;
}

function getAnayaDecision():
  NonNullable<
    typeof CANONICAL_ANAYA_DECISION
  > {
  return CANONICAL_ANAYA_DECISION!;
}

function validateCanonicalAnayaContinuation(): void {
  const plan =
    getAnayaPlan();

  const preparation =
    getAnayaPreparation();

  const decision =
    getAnayaDecision();

  if (
    plan.sequence !== 4 ||
    plan.employeeId !==
      "candidate-anaya-v1" ||
    plan.employeeCode !==
      "nx-engineering-004" ||
    plan.publicName !==
      "Anaya" ||
    plan.officialRole !==
      "AI Security Engineering Director" ||
    plan.scenarioId !==
      "SECURITY_BOUNDARY_REVIEW_PLAN" ||
    plan.objective !==
      "Plan one bounded synthetic security-boundary review evidence task without secrets, repository, or production access." ||
    plan.expectedEvidence !==
      "A deterministic threat and control review plan covering tenant isolation, fail-closed behavior, and owner escalation." ||
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
      "Canonical Anaya second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 4 ||
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
      "Canonical Anaya second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 4 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.publicName !==
      "Anaya" ||
    decision.officialRole !==
      "AI Security Engineering Director" ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      "SECURITY_BOUNDARY_REVIEW_PLAN" ||
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
      "Canonical Anaya second-task decision is invalid.",
    );
  }
}

export interface CreateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly decisionId: string;

  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

function regressionEvidenceDigest(): string {
  return sha256(
    CANONICAL_VIVAAN_EXECUTION
      .regressionRiskPlan,
  );
}

function buildVivaanOwnerReview(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const anayaPlan =
    getAnayaPlan();

  const anayaPreparation =
    getAnayaPreparation();

  const anayaDecision =
    getAnayaDecision();

  const approved =
    decision ===
      "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_VIVAAN_EXECUTION
        .tenantId,

    ownerId,

    sourceExecutionId:
      CANONICAL_VIVAAN_EXECUTION
        .executionId,

    sourceExecutionDigest:
      CANONICAL_VIVAAN_EXECUTION
        .executionDigest,

    sourceLeelaOwnerReviewDecisionId:
      CANONICAL_VIVAAN_EXECUTION
        .sourceLeelaOwnerReviewDecisionId,

    sourceLeelaOwnerReviewDecisionDigest:
      CANONICAL_VIVAAN_EXECUTION
        .sourceLeelaOwnerReviewDecisionDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-vivaan-v1" as const,

      employeeCode:
        "nx-engineering-003" as const,

      publicName:
        "Vivaan" as const,

      officialRole:
        "AI Quality Assurance Director" as const,

      runtimeId:
        CANONICAL_VIVAAN_EXECUTION
          .runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "REGRESSION_RISK_CONTAINMENT_PLAN" as const,

      sourceCandidatePlanDigest:
        CANONICAL_VIVAAN_EXECUTION
          .sourceCandidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        CANONICAL_VIVAAN_EXECUTION
          .sourceCandidateDecisionPreparationDigest,

      candidateDecisionDigest:
        CANONICAL_VIVAAN_EXECUTION
          .candidateDecisionDigest,
    },

    nextCandidate: {
      sequence:
        4 as const,

      employeeId:
        "candidate-anaya-v1" as const,

      employeeCode:
        "nx-engineering-004" as const,

      publicName:
        "Anaya" as const,

      officialRole:
        "AI Security Engineering Director" as const,

      runtimeId:
        anayaDecision.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "SECURITY_BOUNDARY_REVIEW_PLAN" as const,

      sourceCandidatePlanDigest:
        anayaPlan.candidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        anayaPreparation
          .candidateDecisionPreparationDigest,

      candidateDecisionDigest:
        anayaDecision
          .candidateDecisionDigest,
    },

    decision,

    vivaanSecondTaskApproved:
      approved,

    anayaSecondTaskExecutionAuthorized:
      approved,

    anayaSecondTaskExecutionPerformed:
      false as const,

    reviewedEvidence: {
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

      taskSequence:
        2 as const,

      scenarioId:
        "REGRESSION_RISK_CONTAINMENT_PLAN" as const,

      executionDigest:
        CANONICAL_VIVAAN_EXECUTION
          .executionDigest,

      regressionEvidenceDigest:
        regressionEvidenceDigest(),

      deterministicEvidenceCreated:
        true as const,

      coverageAreaCount:
        5 as const,

      stopConditionCount:
        6 as const,

      evidenceRequirementCount:
        6 as const,

      recoveryCheckCount:
        4 as const,

      testExecutionPerformed:
        false as const,

      codeChangePerformed:
        false as const,

      repositoryAccessPerformed:
        false as const,

      ownerReviewCompleted:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalVivaanExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      sourceAnayaPlanBound:
        true as const,

      sourceAnayaDecisionPreparationBound:
        true as const,

      sourceAnayaCandidateDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      vivaanSecondTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      vivaanSecondTaskApproved:
        approved,

      anayaSecondTaskExecutionAuthorized:
        approved,

      anayaSecondTaskExecutionPerformed:
        false as const,

      onlyAnayaCurrentlyExecutable:
        approved,

      remainingFourAuthorizedCandidatesWaiting:
        approved,

      concurrentCandidateExecutionAuthorized:
        false as const,

      sequentialExecutionRequired:
        true as const,

      aggregateConcurrentExecutionLimit:
        1 as const,

      stopAfterEveryTaskForOwnerReview:
        true as const,

      stopOnFirstFailure:
        true as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      testsExecuted:
        false as const,

      codeChanged:
        false as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      secretsAccessAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      productionDeploymentAuthorized:
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

    reason,

    nextStep:
      approved
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FOUR" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_VIVAAN_SECOND_TASK_ONLY" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision =
  ReturnType<
    typeof buildVivaanOwnerReview
  >;

export function validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision,
): void {
  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      decisionDigest,
    ) ||
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Vivaan second-task owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution(
    CANONICAL_VIVAAN_EXECUTION,
  );

  validateCanonicalAnayaContinuation();

  const anayaPlan =
    getAnayaPlan();

  const anayaPreparation =
    getAnayaPreparation();

  const anayaDecision =
    getAnayaDecision();

  const approved =
    record.decision ===
      "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      CANONICAL_VIVAAN_EXECUTION.tenantId ||
    record.ownerId !==
      CANONICAL_VIVAAN_EXECUTION.ownerId ||
    record.sourceExecutionId !==
      CANONICAL_VIVAAN_EXECUTION.executionId ||
    record.sourceExecutionDigest !==
      CANONICAL_VIVAAN_EXECUTION.executionDigest ||
    record.sourceLeelaOwnerReviewDecisionId !==
      CANONICAL_VIVAAN_EXECUTION
        .sourceLeelaOwnerReviewDecisionId ||
    record.sourceLeelaOwnerReviewDecisionDigest !==
      CANONICAL_VIVAAN_EXECUTION
        .sourceLeelaOwnerReviewDecisionDigest
  ) {
    throw new Error(
      "Vivaan second-task owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-vivaan-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-003" ||
    record.reviewedEmployee.publicName !==
      "Vivaan" ||
    record.reviewedEmployee.officialRole !==
      "AI Quality Assurance Director" ||
    record.reviewedEmployee.runtimeId !==
      CANONICAL_VIVAAN_EXECUTION.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "REGRESSION_RISK_CONTAINMENT_PLAN" ||
    record.reviewedEmployee.sourceCandidatePlanDigest !==
      CANONICAL_VIVAAN_EXECUTION
        .sourceCandidatePlanDigest ||
    record.reviewedEmployee.sourceCandidateDecisionPreparationDigest !==
      CANONICAL_VIVAAN_EXECUTION
        .sourceCandidateDecisionPreparationDigest ||
    record.reviewedEmployee.candidateDecisionDigest !==
      CANONICAL_VIVAAN_EXECUTION
        .candidateDecisionDigest
  ) {
    throw new Error(
      "Vivaan second-task owner-review employee binding is invalid.",
    );
  }

  if (
    record.nextCandidate.sequence !==
      4 ||
    record.nextCandidate.employeeId !==
      "candidate-anaya-v1" ||
    record.nextCandidate.employeeCode !==
      "nx-engineering-004" ||
    record.nextCandidate.publicName !==
      "Anaya" ||
    record.nextCandidate.officialRole !==
      "AI Security Engineering Director" ||
    record.nextCandidate.runtimeId !==
      anayaDecision.runtimeId ||
    record.nextCandidate.taskSequence !==
      2 ||
    record.nextCandidate.scenarioId !==
      "SECURITY_BOUNDARY_REVIEW_PLAN" ||
    record.nextCandidate.sourceCandidatePlanDigest !==
      anayaPlan.candidatePlanDigest ||
    record.nextCandidate.sourceCandidateDecisionPreparationDigest !==
      anayaPreparation
        .candidateDecisionPreparationDigest ||
    record.nextCandidate.candidateDecisionDigest !==
      anayaDecision.candidateDecisionDigest
  ) {
    throw new Error(
      "Vivaan second-task owner-review Anaya binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_VIVAAN_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Vivaan second-task owner-review decision is invalid.",
    );
  }

  if (
    record.vivaanSecondTaskApproved !==
      approved ||
    record.anayaSecondTaskExecutionAuthorized !==
      approved ||
    record.anayaSecondTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Vivaan second-task owner-review continuation state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    evidence.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.evidenceToolMode !==
      "READ_ONLY" ||
    evidence.outputMode !==
      "DRAFT_ONLY" ||
    evidence.taskSequence !== 2 ||
    evidence.scenarioId !==
      "REGRESSION_RISK_CONTAINMENT_PLAN" ||
    evidence.executionDigest !==
      CANONICAL_VIVAAN_EXECUTION
        .executionDigest ||
    evidence.regressionEvidenceDigest !==
      regressionEvidenceDigest() ||
    evidence.deterministicEvidenceCreated !==
      true ||
    evidence.coverageAreaCount !==
      5 ||
    evidence.stopConditionCount !==
      6 ||
    evidence.evidenceRequirementCount !==
      6 ||
    evidence.recoveryCheckCount !==
      4 ||
    evidence.testExecutionPerformed !==
      false ||
    evidence.codeChangePerformed !==
      false ||
    evidence.repositoryAccessPerformed !==
      false ||
    evidence.ownerReviewCompleted !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false
  ) {
    throw new Error(
      "Vivaan second-task owner-review evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalVivaanExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.sourceAnayaPlanBound,
    boundary.sourceAnayaDecisionPreparationBound,
    boundary.sourceAnayaCandidateDecisionBound,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.vivaanSecondTaskReviewed,
    boundary.ownerReviewDecisionRecorded,
    boundary.sequentialExecutionRequired,
    boundary.stopAfterEveryTaskForOwnerReview,
    boundary.stopOnFirstFailure,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.anayaSecondTaskExecutionPerformed,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
    boundary.testsExecuted,
    boundary.codeChanged,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessAuthorized,
    boundary.realCustomerDataAccessAuthorized,
    boundary.realCustomerContactAuthorized,
    boundary.externalDeliveryAuthorized,
    boundary.liveProviderExecutionAuthorized,
    boundary.productionDatabaseAuthorized,
    boundary.productionMutationAuthorized,
    boundary.productionDeploymentAuthorized,
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
    boundary.vivaanSecondTaskApproved !==
      approved ||
    boundary.anayaSecondTaskExecutionAuthorized !==
      approved ||
    boundary.onlyAnayaCurrentlyExecutable !==
      approved ||
    boundary.remainingFourAuthorizedCandidatesWaiting !==
      approved ||
    boundary.aggregateConcurrentExecutionLimit !==
      1
  ) {
    throw new Error(
      "Vivaan second-task owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FOUR"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_VIVAAN_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        CANONICAL_VIVAAN_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Vivaan second-task owner-review transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedEmployee,
    ) ||
    !Object.isFrozen(
      record.nextCandidate,
    ) ||
    !Object.isFrozen(
      record.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Vivaan second-task owner review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision {
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution(
    input.sourceExecution,
  );

  if (
    input.sourceExecution.executionId !==
      CANONICAL_VIVAAN_EXECUTION.executionId ||
    input.sourceExecution.executionDigest !==
      CANONICAL_VIVAAN_EXECUTION.executionDigest
  ) {
    throw new Error(
      "Only the canonical Vivaan second-task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Vivaan second-task owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Vivaan second-task owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_VIVAAN_EXECUTION.ownerId
  ) {
    throw new Error(
      "Vivaan second-task owner-review owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Vivaan second-task owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_VIVAAN_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Vivaan second-task owner review cannot precede execution.",
    );
  }

  validateCanonicalAnayaContinuation();

  const record =
    buildVivaanOwnerReview(
      decisionId,
      ownerId,
      input.decision,
      reason,
      decidedAt,
    );

  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision({
    decisionId:
      "engineering-vivaan-second-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION",

    reason:
      "Owner reviewed Vivaan's deterministic bounded regression-risk containment evidence, approved the result, and authorized only Anaya's second synthetic security-boundary review task next.",

    decidedAt:
      "2026-08-02T08:50:00.000Z",
  });