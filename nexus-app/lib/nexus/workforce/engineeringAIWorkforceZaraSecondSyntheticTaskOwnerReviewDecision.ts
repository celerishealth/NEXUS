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
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceZaraSecondSyntheticTaskExecution";

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-zara-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ZARA_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
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
      "Unsupported deterministic Zara owner-review value.",
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
      "Zara owner-review reason is invalid.",
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

const CANONICAL_ZARA_EXECUTION =
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION;

const CANONICAL_ADVIK_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Advik",
    );

const CANONICAL_ADVIK_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Advik",
    );

const CANONICAL_ADVIK_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Advik",
    );

if (
  !CANONICAL_ADVIK_PLAN ||
  !CANONICAL_ADVIK_PREPARATION ||
  !CANONICAL_ADVIK_DECISION
) {
  throw new Error(
    "Canonical Advik second-task continuation sources are missing.",
  );
}

function getAdvikPlan():
  NonNullable<
    typeof CANONICAL_ADVIK_PLAN
  > {
  return CANONICAL_ADVIK_PLAN!;
}

function getAdvikPreparation():
  NonNullable<
    typeof CANONICAL_ADVIK_PREPARATION
  > {
  return CANONICAL_ADVIK_PREPARATION!;
}

function getAdvikDecision():
  NonNullable<
    typeof CANONICAL_ADVIK_DECISION
  > {
  return CANONICAL_ADVIK_DECISION!;
}

function validateCanonicalAdvikContinuation(): void {
  const plan =
    getAdvikPlan();

  const preparation =
    getAdvikPreparation();

  const decision =
    getAdvikDecision();

  if (
    plan.sequence !== 8 ||
    plan.employeeId !==
      "candidate-advik-v1" ||
    plan.employeeCode !==
      "nx-engineering-008" ||
    plan.publicName !==
      "Advik" ||
    plan.officialRole !==
      "AI Systems Evaluation & Red-Team Specialist" ||
    plan.scenarioId !==
      "SYSTEMS_EVALUATION_RED_TEAM_PLAN" ||
    plan.objective !==
      "Plan one bounded synthetic systems-evaluation and red-team evidence task without adversarial execution." ||
    plan.expectedEvidence !==
      "A deterministic evaluation plan covering evidence substitution, authority bypass, isolation, recovery, and owner control." ||
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
    plan.repositoryReadAuthorized !==
      false ||
    plan.repositoryWriteAuthorized !==
      false ||
    plan.secretsAccessAuthorized !==
      false ||
    plan.realCustomerDataAccessAuthorized !==
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
      "Canonical Advik second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 8 ||
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
    preparation.repositoryReadAuthorized !==
      false ||
    preparation.repositoryWriteAuthorized !==
      false ||
    preparation.liveProviderExecutionAuthorized !==
      false ||
    preparation.productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Advik second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 8 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.publicName !==
      "Advik" ||
    decision.officialRole !==
      "AI Systems Evaluation & Red-Team Specialist" ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      "SYSTEMS_EVALUATION_RED_TEAM_PLAN" ||
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
      .repositoryReadAuthorized !==
      false ||
    decision.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    decision.authorityBoundary
      .autonomousDecisionAuthorized !==
      false ||
    decision.authorityBoundary
      .productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Advik second-task decision is invalid.",
    );
  }
}

export interface CreateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly decisionId: string;

  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

function dataQualityEvidenceDigest(): string {
  return sha256(
    CANONICAL_ZARA_EXECUTION
      .dataQualityPlan,
  );
}

function buildZaraOwnerReview(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const advikPlan =
    getAdvikPlan();

  const advikPreparation =
    getAdvikPreparation();

  const advikDecision =
    getAdvikDecision();

  const approved =
    decision ===
      "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_ZARA_EXECUTION
        .tenantId,

    ownerId,

    sourceExecutionId:
      CANONICAL_ZARA_EXECUTION
        .executionId,

    sourceExecutionDigest:
      CANONICAL_ZARA_EXECUTION
        .executionDigest,

    sourceMahirOwnerReviewDecisionId:
      CANONICAL_ZARA_EXECUTION
        .sourceMahirOwnerReviewDecisionId,

    sourceMahirOwnerReviewDecisionDigest:
      CANONICAL_ZARA_EXECUTION
        .sourceMahirOwnerReviewDecisionDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-zara-v1" as const,

      employeeCode:
        "nx-engineering-007" as const,

      publicName:
        "Zara" as const,

      officialRole:
        "AI Data Engineering & Analytics Specialist" as const,

      runtimeId:
        CANONICAL_ZARA_EXECUTION
          .runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "DATA_PIPELINE_QUALITY_PLAN" as const,

      sourceCandidatePlanDigest:
        CANONICAL_ZARA_EXECUTION
          .sourceCandidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        CANONICAL_ZARA_EXECUTION
          .sourceCandidateDecisionPreparationDigest,

      candidateDecisionDigest:
        CANONICAL_ZARA_EXECUTION
          .candidateDecisionDigest,
    },

    nextCandidate: {
      sequence:
        8 as const,

      employeeId:
        "candidate-advik-v1" as const,

      employeeCode:
        "nx-engineering-008" as const,

      publicName:
        "Advik" as const,

      officialRole:
        "AI Systems Evaluation & Red-Team Specialist" as const,

      runtimeId:
        advikDecision.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "SYSTEMS_EVALUATION_RED_TEAM_PLAN" as const,

      sourceCandidatePlanDigest:
        advikPlan.candidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        advikPreparation
          .candidateDecisionPreparationDigest,

      candidateDecisionDigest:
        advikDecision
          .candidateDecisionDigest,
    },

    decision,

    zaraSecondTaskApproved:
      approved,

    advikSecondTaskExecutionAuthorized:
      approved,

    advikSecondTaskExecutionPerformed:
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
        "DATA_PIPELINE_QUALITY_PLAN" as const,

      executionDigest:
        CANONICAL_ZARA_EXECUTION
          .executionDigest,

      dataQualityEvidenceDigest:
        dataQualityEvidenceDigest(),

      deterministicEvidenceCreated:
        true as const,

      schemaCheckCount:
        5 as const,

      tenantBoundaryCheckCount:
        5 as const,

      lineageCheckpointCount:
        5 as const,

      reconciliationCheckCount:
        4 as const,

      recoveryCheckCount:
        4 as const,

      stopConditionCount:
        6 as const,

      realCustomerDataUsed:
        false as const,

      databaseAccessPerformed:
        false as const,

      databaseMutationPerformed:
        false as const,

      ownerReviewCompleted:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalZaraExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      sourceAdvikPlanBound:
        true as const,

      sourceAdvikDecisionPreparationBound:
        true as const,

      sourceAdvikCandidateDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      zaraSecondTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      zaraSecondTaskApproved:
        approved,

      advikSecondTaskExecutionAuthorized:
        approved,

      advikSecondTaskExecutionPerformed:
        false as const,

      onlyAdvikCurrentlyExecutable:
        approved,

      advikIsFinalCandidate:
        true as const,

      noLaterCandidateExecutionAuthorized:
        true as const,

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

      adversarialExecutionAuthorized:
        false as const,

      authorityBypassAuthorized:
        false as const,

      evidenceSubstitutionAuthorized:
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_EIGHT" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ZARA_SECOND_TASK_ONLY" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision =
  ReturnType<
    typeof buildZaraOwnerReview
  >;

export function validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision,
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
      "Zara second-task owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution(
    CANONICAL_ZARA_EXECUTION,
  );

  validateCanonicalAdvikContinuation();

  const advikPlan =
    getAdvikPlan();

  const advikPreparation =
    getAdvikPreparation();

  const advikDecision =
    getAdvikDecision();

  const approved =
    record.decision ===
      "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      CANONICAL_ZARA_EXECUTION.tenantId ||
    record.ownerId !==
      CANONICAL_ZARA_EXECUTION.ownerId ||
    record.sourceExecutionId !==
      CANONICAL_ZARA_EXECUTION.executionId ||
    record.sourceExecutionDigest !==
      CANONICAL_ZARA_EXECUTION.executionDigest ||
    record.sourceMahirOwnerReviewDecisionId !==
      CANONICAL_ZARA_EXECUTION
        .sourceMahirOwnerReviewDecisionId ||
    record.sourceMahirOwnerReviewDecisionDigest !==
      CANONICAL_ZARA_EXECUTION
        .sourceMahirOwnerReviewDecisionDigest
  ) {
    throw new Error(
      "Zara owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-zara-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-007" ||
    record.reviewedEmployee.publicName !==
      "Zara" ||
    record.reviewedEmployee.officialRole !==
      "AI Data Engineering & Analytics Specialist" ||
    record.reviewedEmployee.runtimeId !==
      CANONICAL_ZARA_EXECUTION.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "DATA_PIPELINE_QUALITY_PLAN" ||
    record.reviewedEmployee.sourceCandidatePlanDigest !==
      CANONICAL_ZARA_EXECUTION
        .sourceCandidatePlanDigest ||
    record.reviewedEmployee.sourceCandidateDecisionPreparationDigest !==
      CANONICAL_ZARA_EXECUTION
        .sourceCandidateDecisionPreparationDigest ||
    record.reviewedEmployee.candidateDecisionDigest !==
      CANONICAL_ZARA_EXECUTION
        .candidateDecisionDigest
  ) {
    throw new Error(
      "Zara owner-review employee binding is invalid.",
    );
  }

  if (
    record.nextCandidate.sequence !==
      8 ||
    record.nextCandidate.employeeId !==
      "candidate-advik-v1" ||
    record.nextCandidate.employeeCode !==
      "nx-engineering-008" ||
    record.nextCandidate.publicName !==
      "Advik" ||
    record.nextCandidate.officialRole !==
      "AI Systems Evaluation & Red-Team Specialist" ||
    record.nextCandidate.runtimeId !==
      advikDecision.runtimeId ||
    record.nextCandidate.taskSequence !==
      2 ||
    record.nextCandidate.scenarioId !==
      "SYSTEMS_EVALUATION_RED_TEAM_PLAN" ||
    record.nextCandidate.sourceCandidatePlanDigest !==
      advikPlan.candidatePlanDigest ||
    record.nextCandidate.sourceCandidateDecisionPreparationDigest !==
      advikPreparation
        .candidateDecisionPreparationDigest ||
    record.nextCandidate.candidateDecisionDigest !==
      advikDecision.candidateDecisionDigest
  ) {
    throw new Error(
      "Zara owner-review Advik binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ZARA_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Zara owner-review decision is invalid.",
    );
  }

  if (
    record.zaraSecondTaskApproved !==
      approved ||
    record.advikSecondTaskExecutionAuthorized !==
      approved ||
    record.advikSecondTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Zara owner-review continuation state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.executionDigest !==
      CANONICAL_ZARA_EXECUTION
        .executionDigest ||
    evidence.dataQualityEvidenceDigest !==
      dataQualityEvidenceDigest() ||
    evidence.deterministicEvidenceCreated !==
      true ||
    evidence.schemaCheckCount !==
      5 ||
    evidence.tenantBoundaryCheckCount !==
      5 ||
    evidence.lineageCheckpointCount !==
      5 ||
    evidence.reconciliationCheckCount !==
      4 ||
    evidence.recoveryCheckCount !==
      4 ||
    evidence.stopConditionCount !==
      6 ||
    evidence.realCustomerDataUsed !==
      false ||
    evidence.databaseAccessPerformed !==
      false ||
    evidence.databaseMutationPerformed !==
      false ||
    evidence.ownerReviewCompleted !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false
  ) {
    throw new Error(
      "Zara owner-review data-quality evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalZaraExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.sourceAdvikPlanBound,
    boundary.sourceAdvikDecisionPreparationBound,
    boundary.sourceAdvikCandidateDecisionBound,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.zaraSecondTaskReviewed,
    boundary.ownerReviewDecisionRecorded,
    boundary.advikIsFinalCandidate,
    boundary.noLaterCandidateExecutionAuthorized,
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
    boundary.advikSecondTaskExecutionPerformed,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
    boundary.adversarialExecutionAuthorized,
    boundary.authorityBypassAuthorized,
    boundary.evidenceSubstitutionAuthorized,
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
    boundary.zaraSecondTaskApproved !==
      approved ||
    boundary.advikSecondTaskExecutionAuthorized !==
      approved ||
    boundary.onlyAdvikCurrentlyExecutable !==
      approved ||
    boundary.aggregateConcurrentExecutionLimit !==
      1
  ) {
    throw new Error(
      "Zara owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_EIGHT"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ZARA_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        CANONICAL_ZARA_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Zara owner-review transition is invalid.",
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
      "Zara owner review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision {
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution(
    input.sourceExecution,
  );

  if (
    input.sourceExecution.executionId !==
      CANONICAL_ZARA_EXECUTION.executionId ||
    input.sourceExecution.executionDigest !==
      CANONICAL_ZARA_EXECUTION.executionDigest
  ) {
    throw new Error(
      "Only the canonical Zara second-task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Zara owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Zara owner-review owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_ZARA_EXECUTION.ownerId
  ) {
    throw new Error(
      "Zara owner-review owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Zara owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_ZARA_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Zara owner review cannot precede execution.",
    );
  }

  validateCanonicalAdvikContinuation();

  const record =
    buildZaraOwnerReview(
      decisionId,
      ownerId,
      input.decision,
      reason,
      decidedAt,
    );

  validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision({
    decisionId:
      "engineering-zara-second-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION",

    reason:
      "Owner reviewed Zara's deterministic bounded data-pipeline quality evidence, approved the result, and authorized only Advik's final second synthetic systems-evaluation and red-team planning task next.",

    decidedAt:
      "2026-08-02T10:50:00.000Z",
  });