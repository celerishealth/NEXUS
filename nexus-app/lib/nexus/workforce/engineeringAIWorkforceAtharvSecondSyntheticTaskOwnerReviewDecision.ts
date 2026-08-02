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
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceAtharvSecondSyntheticTaskExecution";

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-atharv-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ATHARV_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
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
      "Unsupported deterministic Atharv owner-review value.",
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
      "Atharv owner-review reason is invalid.",
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

const CANONICAL_ATHARV_EXECUTION =
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION;

const CANONICAL_MAHIR_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Mahir",
    );

const CANONICAL_MAHIR_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Mahir",
    );

const CANONICAL_MAHIR_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Mahir",
    );

if (
  !CANONICAL_MAHIR_PLAN ||
  !CANONICAL_MAHIR_PREPARATION ||
  !CANONICAL_MAHIR_DECISION
) {
  throw new Error(
    "Canonical Mahir second-task continuation sources are missing.",
  );
}

function getMahirPlan():
  NonNullable<
    typeof CANONICAL_MAHIR_PLAN
  > {
  return CANONICAL_MAHIR_PLAN!;
}

function getMahirPreparation():
  NonNullable<
    typeof CANONICAL_MAHIR_PREPARATION
  > {
  return CANONICAL_MAHIR_PREPARATION!;
}

function getMahirDecision():
  NonNullable<
    typeof CANONICAL_MAHIR_DECISION
  > {
  return CANONICAL_MAHIR_DECISION!;
}

function validateCanonicalMahirContinuation(): void {
  const plan =
    getMahirPlan();

  const preparation =
    getMahirPreparation();

  const decision =
    getMahirDecision();

  if (
    plan.sequence !== 6 ||
    plan.employeeId !==
      "candidate-mahir-v1" ||
    plan.employeeCode !==
      "nx-engineering-006" ||
    plan.publicName !==
      "Mahir" ||
    plan.officialRole !==
      "AI Chaos Engineering Specialist" ||
    plan.scenarioId !==
      "CHAOS_FAILURE_CONTAINMENT_PLAN" ||
    plan.objective !==
      "Plan one bounded synthetic chaos and failure-containment evidence task without injecting any real failure." ||
    plan.expectedEvidence !==
      "A deterministic simulated-failure plan with blast-radius limits, emergency pause, rollback, and owner-review gates." ||
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
      false ||
    plan.liveProviderExecutionAuthorized !==
      false ||
    plan.productionDatabaseAuthorized !==
      false ||
    plan.productionMutationAuthorized !==
      false ||
    plan.productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Mahir second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 6 ||
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
      false ||
    preparation.liveProviderExecutionAuthorized !==
      false ||
    preparation.productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Mahir second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 6 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.publicName !==
      "Mahir" ||
    decision.officialRole !==
      "AI Chaos Engineering Specialist" ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      "CHAOS_FAILURE_CONTAINMENT_PLAN" ||
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
      true ||
    decision.authorityBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    decision.authorityBoundary
      .productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Mahir second-task decision is invalid.",
    );
  }
}

export interface CreateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly decisionId: string;

  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

function recoveryEvidenceDigest(): string {
  return sha256(
    CANONICAL_ATHARV_EXECUTION
      .recoveryValidationPlan,
  );
}

function buildAtharvOwnerReview(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const mahirPlan =
    getMahirPlan();

  const mahirPreparation =
    getMahirPreparation();

  const mahirDecision =
    getMahirDecision();

  const approved =
    decision ===
      "APPROVE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_ATHARV_EXECUTION
        .tenantId,

    ownerId,

    sourceExecutionId:
      CANONICAL_ATHARV_EXECUTION
        .executionId,

    sourceExecutionDigest:
      CANONICAL_ATHARV_EXECUTION
        .executionDigest,

    sourceAnayaOwnerReviewDecisionId:
      CANONICAL_ATHARV_EXECUTION
        .sourceAnayaOwnerReviewDecisionId,

    sourceAnayaOwnerReviewDecisionDigest:
      CANONICAL_ATHARV_EXECUTION
        .sourceAnayaOwnerReviewDecisionDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-atharv-v1" as const,

      employeeCode:
        "nx-engineering-005" as const,

      publicName:
        "Atharv" as const,

      officialRole:
        "AI Reliability Engineering Specialist" as const,

      runtimeId:
        CANONICAL_ATHARV_EXECUTION
          .runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "RELIABILITY_RECOVERY_VALIDATION_PLAN" as const,

      sourceCandidatePlanDigest:
        CANONICAL_ATHARV_EXECUTION
          .sourceCandidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        CANONICAL_ATHARV_EXECUTION
          .sourceCandidateDecisionPreparationDigest,

      candidateDecisionDigest:
        CANONICAL_ATHARV_EXECUTION
          .candidateDecisionDigest,
    },

    nextCandidate: {
      sequence:
        6 as const,

      employeeId:
        "candidate-mahir-v1" as const,

      employeeCode:
        "nx-engineering-006" as const,

      publicName:
        "Mahir" as const,

      officialRole:
        "AI Chaos Engineering Specialist" as const,

      runtimeId:
        mahirDecision.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "CHAOS_FAILURE_CONTAINMENT_PLAN" as const,

      sourceCandidatePlanDigest:
        mahirPlan.candidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        mahirPreparation
          .candidateDecisionPreparationDigest,

      candidateDecisionDigest:
        mahirDecision
          .candidateDecisionDigest,
    },

    decision,

    atharvSecondTaskApproved:
      approved,

    mahirSecondTaskExecutionAuthorized:
      approved,

    mahirSecondTaskExecutionPerformed:
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
        "RELIABILITY_RECOVERY_VALIDATION_PLAN" as const,

      executionDigest:
        CANONICAL_ATHARV_EXECUTION
          .executionDigest,

      recoveryEvidenceDigest:
        recoveryEvidenceDigest(),

      deterministicEvidenceCreated:
        true as const,

      monitoringCheckpointCount:
        4 as const,

      gracefulDegradationCount:
        4 as const,

      rollbackPlanCount:
        4 as const,

      auditCheckpointCount:
        6 as const,

      stopConditionCount:
        6 as const,

      recoveryCheckCount:
        5 as const,

      liveProviderExecutionPerformed:
        false as const,

      productionExecutionPerformed:
        false as const,

      deploymentPerformed:
        false as const,

      ownerReviewCompleted:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalAtharvExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      sourceMahirPlanBound:
        true as const,

      sourceMahirDecisionPreparationBound:
        true as const,

      sourceMahirCandidateDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      atharvSecondTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      atharvSecondTaskApproved:
        approved,

      mahirSecondTaskExecutionAuthorized:
        approved,

      mahirSecondTaskExecutionPerformed:
        false as const,

      onlyMahirCurrentlyExecutable:
        approved,

      remainingTwoAuthorizedCandidatesWaiting:
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

      realFailureInjectionAuthorized:
        false as const,

      protectedMaterialUsed:
        false as const,

      secretsAccessAuthorized:
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SIX" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ATHARV_SECOND_TASK_ONLY" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision =
  ReturnType<
    typeof buildAtharvOwnerReview
  >;

export function validateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision,
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
      "Atharv second-task owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution(
    CANONICAL_ATHARV_EXECUTION,
  );

  validateCanonicalMahirContinuation();

  const mahirPlan =
    getMahirPlan();

  const mahirPreparation =
    getMahirPreparation();

  const mahirDecision =
    getMahirDecision();

  const approved =
    record.decision ===
      "APPROVE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      CANONICAL_ATHARV_EXECUTION.tenantId ||
    record.ownerId !==
      CANONICAL_ATHARV_EXECUTION.ownerId ||
    record.sourceExecutionId !==
      CANONICAL_ATHARV_EXECUTION.executionId ||
    record.sourceExecutionDigest !==
      CANONICAL_ATHARV_EXECUTION.executionDigest ||
    record.sourceAnayaOwnerReviewDecisionId !==
      CANONICAL_ATHARV_EXECUTION
        .sourceAnayaOwnerReviewDecisionId ||
    record.sourceAnayaOwnerReviewDecisionDigest !==
      CANONICAL_ATHARV_EXECUTION
        .sourceAnayaOwnerReviewDecisionDigest
  ) {
    throw new Error(
      "Atharv owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-atharv-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-005" ||
    record.reviewedEmployee.publicName !==
      "Atharv" ||
    record.reviewedEmployee.officialRole !==
      "AI Reliability Engineering Specialist" ||
    record.reviewedEmployee.runtimeId !==
      CANONICAL_ATHARV_EXECUTION.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "RELIABILITY_RECOVERY_VALIDATION_PLAN" ||
    record.reviewedEmployee.sourceCandidatePlanDigest !==
      CANONICAL_ATHARV_EXECUTION
        .sourceCandidatePlanDigest ||
    record.reviewedEmployee.sourceCandidateDecisionPreparationDigest !==
      CANONICAL_ATHARV_EXECUTION
        .sourceCandidateDecisionPreparationDigest ||
    record.reviewedEmployee.candidateDecisionDigest !==
      CANONICAL_ATHARV_EXECUTION
        .candidateDecisionDigest
  ) {
    throw new Error(
      "Atharv owner-review employee binding is invalid.",
    );
  }

  if (
    record.nextCandidate.sequence !==
      6 ||
    record.nextCandidate.employeeId !==
      "candidate-mahir-v1" ||
    record.nextCandidate.employeeCode !==
      "nx-engineering-006" ||
    record.nextCandidate.publicName !==
      "Mahir" ||
    record.nextCandidate.officialRole !==
      "AI Chaos Engineering Specialist" ||
    record.nextCandidate.runtimeId !==
      mahirDecision.runtimeId ||
    record.nextCandidate.taskSequence !==
      2 ||
    record.nextCandidate.scenarioId !==
      "CHAOS_FAILURE_CONTAINMENT_PLAN" ||
    record.nextCandidate.sourceCandidatePlanDigest !==
      mahirPlan.candidatePlanDigest ||
    record.nextCandidate.sourceCandidateDecisionPreparationDigest !==
      mahirPreparation
        .candidateDecisionPreparationDigest ||
    record.nextCandidate.candidateDecisionDigest !==
      mahirDecision.candidateDecisionDigest
  ) {
    throw new Error(
      "Atharv owner-review Mahir binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ATHARV_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Atharv owner-review decision is invalid.",
    );
  }

  if (
    record.atharvSecondTaskApproved !==
      approved ||
    record.mahirSecondTaskExecutionAuthorized !==
      approved ||
    record.mahirSecondTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Atharv owner-review continuation state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.executionDigest !==
      CANONICAL_ATHARV_EXECUTION
        .executionDigest ||
    evidence.recoveryEvidenceDigest !==
      recoveryEvidenceDigest() ||
    evidence.deterministicEvidenceCreated !==
      true ||
    evidence.monitoringCheckpointCount !==
      4 ||
    evidence.gracefulDegradationCount !==
      4 ||
    evidence.rollbackPlanCount !==
      4 ||
    evidence.auditCheckpointCount !==
      6 ||
    evidence.stopConditionCount !==
      6 ||
    evidence.recoveryCheckCount !==
      5 ||
    evidence.liveProviderExecutionPerformed !==
      false ||
    evidence.productionExecutionPerformed !==
      false ||
    evidence.deploymentPerformed !==
      false ||
    evidence.ownerReviewCompleted !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false
  ) {
    throw new Error(
      "Atharv owner-review recovery evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalAtharvExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.sourceMahirPlanBound,
    boundary.sourceMahirDecisionPreparationBound,
    boundary.sourceMahirCandidateDecisionBound,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.atharvSecondTaskReviewed,
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
    boundary.mahirSecondTaskExecutionPerformed,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
    boundary.realFailureInjectionAuthorized,
    boundary.protectedMaterialUsed,
    boundary.secretsAccessAuthorized,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
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
    boundary.atharvSecondTaskApproved !==
      approved ||
    boundary.mahirSecondTaskExecutionAuthorized !==
      approved ||
    boundary.onlyMahirCurrentlyExecutable !==
      approved ||
    boundary.remainingTwoAuthorizedCandidatesWaiting !==
      approved ||
    boundary.aggregateConcurrentExecutionLimit !==
      1
  ) {
    throw new Error(
      "Atharv owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SIX"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ATHARV_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        CANONICAL_ATHARV_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Atharv owner-review transition is invalid.",
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
      "Atharv owner review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision {
  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution(
    input.sourceExecution,
  );

  if (
    input.sourceExecution.executionId !==
      CANONICAL_ATHARV_EXECUTION.executionId ||
    input.sourceExecution.executionDigest !==
      CANONICAL_ATHARV_EXECUTION.executionDigest
  ) {
    throw new Error(
      "Only the canonical Atharv second-task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Atharv owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Atharv owner-review owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_ATHARV_EXECUTION.ownerId
  ) {
    throw new Error(
      "Atharv owner-review owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Atharv owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_ATHARV_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Atharv owner review cannot precede execution.",
    );
  }

  validateCanonicalMahirContinuation();

  const record =
    buildAtharvOwnerReview(
      decisionId,
      ownerId,
      input.decision,
      reason,
      decidedAt,
    );

  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision({
    decisionId:
      "engineering-atharv-second-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION",

    reason:
      "Owner reviewed Atharv's deterministic bounded reliability and recovery evidence, approved the result, and authorized only Mahir's second synthetic chaos and failure-containment task next.",

    decidedAt:
      "2026-08-02T09:50:00.000Z",
  });