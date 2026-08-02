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
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceMahirSecondSyntheticTaskExecution";

export const ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-mahir-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_MAHIR_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
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
      "Unsupported deterministic Mahir owner-review value.",
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
      "Mahir owner-review reason is invalid.",
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

const CANONICAL_MAHIR_EXECUTION =
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION;

const CANONICAL_ZARA_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Zara",
    );

const CANONICAL_ZARA_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Zara",
    );

const CANONICAL_ZARA_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Zara",
    );

if (
  !CANONICAL_ZARA_PLAN ||
  !CANONICAL_ZARA_PREPARATION ||
  !CANONICAL_ZARA_DECISION
) {
  throw new Error(
    "Canonical Zara second-task continuation sources are missing.",
  );
}

function getZaraPlan():
  NonNullable<
    typeof CANONICAL_ZARA_PLAN
  > {
  return CANONICAL_ZARA_PLAN!;
}

function getZaraPreparation():
  NonNullable<
    typeof CANONICAL_ZARA_PREPARATION
  > {
  return CANONICAL_ZARA_PREPARATION!;
}

function getZaraDecision():
  NonNullable<
    typeof CANONICAL_ZARA_DECISION
  > {
  return CANONICAL_ZARA_DECISION!;
}

function validateCanonicalZaraContinuation(): void {
  const plan =
    getZaraPlan();

  const preparation =
    getZaraPreparation();

  const decision =
    getZaraDecision();

  if (
    plan.sequence !== 7 ||
    plan.employeeId !==
      "candidate-zara-v1" ||
    plan.employeeCode !==
      "nx-engineering-007" ||
    plan.publicName !==
      "Zara" ||
    plan.officialRole !==
      "AI Data Engineering & Analytics Specialist" ||
    plan.scenarioId !==
      "DATA_PIPELINE_QUALITY_PLAN" ||
    plan.objective !==
      "Plan one bounded synthetic data-pipeline quality evidence task without customer data or database mutation." ||
    plan.expectedEvidence !==
      "A deterministic data-quality plan with schema checks, tenant boundaries, lineage, reconciliation, and recovery evidence." ||
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
    plan.realCustomerDataAccessAuthorized !==
      false ||
    plan.productionDatabaseAuthorized !==
      false ||
    plan.productionMutationAuthorized !==
      false ||
    plan.productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Zara second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 7 ||
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
    preparation.realCustomerDataAccessAuthorized !==
      false ||
    preparation.productionDatabaseAuthorized !==
      false ||
    preparation.productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Zara second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 7 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.publicName !==
      "Zara" ||
    decision.officialRole !==
      "AI Data Engineering & Analytics Specialist" ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      "DATA_PIPELINE_QUALITY_PLAN" ||
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
      .realCustomerDataAccessAuthorized !==
      false ||
    decision.authorityBoundary
      .productionDatabaseAuthorized !==
      false ||
    decision.authorityBoundary
      .productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Zara second-task decision is invalid.",
    );
  }
}

export interface CreateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly decisionId: string;

  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

function chaosEvidenceDigest(): string {
  return sha256(
    CANONICAL_MAHIR_EXECUTION
      .chaosContainmentPlan,
  );
}

function buildMahirOwnerReview(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const zaraPlan =
    getZaraPlan();

  const zaraPreparation =
    getZaraPreparation();

  const zaraDecision =
    getZaraDecision();

  const approved =
    decision ===
      "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_MAHIR_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_MAHIR_EXECUTION
        .tenantId,

    ownerId,

    sourceExecutionId:
      CANONICAL_MAHIR_EXECUTION
        .executionId,

    sourceExecutionDigest:
      CANONICAL_MAHIR_EXECUTION
        .executionDigest,

    sourceAtharvOwnerReviewDecisionId:
      CANONICAL_MAHIR_EXECUTION
        .sourceAtharvOwnerReviewDecisionId,

    sourceAtharvOwnerReviewDecisionDigest:
      CANONICAL_MAHIR_EXECUTION
        .sourceAtharvOwnerReviewDecisionDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-mahir-v1" as const,

      employeeCode:
        "nx-engineering-006" as const,

      publicName:
        "Mahir" as const,

      officialRole:
        "AI Chaos Engineering Specialist" as const,

      runtimeId:
        CANONICAL_MAHIR_EXECUTION
          .runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "CHAOS_FAILURE_CONTAINMENT_PLAN" as const,

      sourceCandidatePlanDigest:
        CANONICAL_MAHIR_EXECUTION
          .sourceCandidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        CANONICAL_MAHIR_EXECUTION
          .sourceCandidateDecisionPreparationDigest,

      candidateDecisionDigest:
        CANONICAL_MAHIR_EXECUTION
          .candidateDecisionDigest,
    },

    nextCandidate: {
      sequence:
        7 as const,

      employeeId:
        "candidate-zara-v1" as const,

      employeeCode:
        "nx-engineering-007" as const,

      publicName:
        "Zara" as const,

      officialRole:
        "AI Data Engineering & Analytics Specialist" as const,

      runtimeId:
        zaraDecision.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "DATA_PIPELINE_QUALITY_PLAN" as const,

      sourceCandidatePlanDigest:
        zaraPlan.candidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        zaraPreparation
          .candidateDecisionPreparationDigest,

      candidateDecisionDigest:
        zaraDecision
          .candidateDecisionDigest,
    },

    decision,

    mahirSecondTaskApproved:
      approved,

    zaraSecondTaskExecutionAuthorized:
      approved,

    zaraSecondTaskExecutionPerformed:
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
        "CHAOS_FAILURE_CONTAINMENT_PLAN" as const,

      executionDigest:
        CANONICAL_MAHIR_EXECUTION
          .executionDigest,

      chaosEvidenceDigest:
        chaosEvidenceDigest(),

      deterministicEvidenceCreated:
        true as const,

      simulatedFailureScenarioCount:
        5 as const,

      blastRadiusControlCount:
        5 as const,

      emergencyPauseGateCount:
        5 as const,

      rollbackCheckpointCount:
        4 as const,

      ownerReviewGateCount:
        5 as const,

      stopConditionCount:
        6 as const,

      realFailureInjected:
        false as const,

      liveEnvironmentAffected:
        false as const,

      productionExecutionPerformed:
        false as const,

      ownerReviewCompleted:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalMahirExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      sourceZaraPlanBound:
        true as const,

      sourceZaraDecisionPreparationBound:
        true as const,

      sourceZaraCandidateDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      mahirSecondTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      mahirSecondTaskApproved:
        approved,

      zaraSecondTaskExecutionAuthorized:
        approved,

      zaraSecondTaskExecutionPerformed:
        false as const,

      onlyZaraCurrentlyExecutable:
        approved,

      remainingOneAuthorizedCandidateWaiting:
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SEVEN" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_MAHIR_SECOND_TASK_ONLY" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision =
  ReturnType<
    typeof buildMahirOwnerReview
  >;

export function validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision,
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
      "Mahir second-task owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution(
    CANONICAL_MAHIR_EXECUTION,
  );

  validateCanonicalZaraContinuation();

  const zaraPlan =
    getZaraPlan();

  const zaraPreparation =
    getZaraPreparation();

  const zaraDecision =
    getZaraDecision();

  const approved =
    record.decision ===
      "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_MAHIR_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      CANONICAL_MAHIR_EXECUTION.tenantId ||
    record.ownerId !==
      CANONICAL_MAHIR_EXECUTION.ownerId ||
    record.sourceExecutionId !==
      CANONICAL_MAHIR_EXECUTION.executionId ||
    record.sourceExecutionDigest !==
      CANONICAL_MAHIR_EXECUTION.executionDigest ||
    record.sourceAtharvOwnerReviewDecisionId !==
      CANONICAL_MAHIR_EXECUTION
        .sourceAtharvOwnerReviewDecisionId ||
    record.sourceAtharvOwnerReviewDecisionDigest !==
      CANONICAL_MAHIR_EXECUTION
        .sourceAtharvOwnerReviewDecisionDigest
  ) {
    throw new Error(
      "Mahir owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-mahir-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-006" ||
    record.reviewedEmployee.publicName !==
      "Mahir" ||
    record.reviewedEmployee.officialRole !==
      "AI Chaos Engineering Specialist" ||
    record.reviewedEmployee.runtimeId !==
      CANONICAL_MAHIR_EXECUTION.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "CHAOS_FAILURE_CONTAINMENT_PLAN" ||
    record.reviewedEmployee.sourceCandidatePlanDigest !==
      CANONICAL_MAHIR_EXECUTION
        .sourceCandidatePlanDigest ||
    record.reviewedEmployee.sourceCandidateDecisionPreparationDigest !==
      CANONICAL_MAHIR_EXECUTION
        .sourceCandidateDecisionPreparationDigest ||
    record.reviewedEmployee.candidateDecisionDigest !==
      CANONICAL_MAHIR_EXECUTION
        .candidateDecisionDigest
  ) {
    throw new Error(
      "Mahir owner-review employee binding is invalid.",
    );
  }

  if (
    record.nextCandidate.sequence !==
      7 ||
    record.nextCandidate.employeeId !==
      "candidate-zara-v1" ||
    record.nextCandidate.employeeCode !==
      "nx-engineering-007" ||
    record.nextCandidate.publicName !==
      "Zara" ||
    record.nextCandidate.officialRole !==
      "AI Data Engineering & Analytics Specialist" ||
    record.nextCandidate.runtimeId !==
      zaraDecision.runtimeId ||
    record.nextCandidate.taskSequence !==
      2 ||
    record.nextCandidate.scenarioId !==
      "DATA_PIPELINE_QUALITY_PLAN" ||
    record.nextCandidate.sourceCandidatePlanDigest !==
      zaraPlan.candidatePlanDigest ||
    record.nextCandidate.sourceCandidateDecisionPreparationDigest !==
      zaraPreparation
        .candidateDecisionPreparationDigest ||
    record.nextCandidate.candidateDecisionDigest !==
      zaraDecision.candidateDecisionDigest
  ) {
    throw new Error(
      "Mahir owner-review Zara binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_MAHIR_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Mahir owner-review decision is invalid.",
    );
  }

  if (
    record.mahirSecondTaskApproved !==
      approved ||
    record.zaraSecondTaskExecutionAuthorized !==
      approved ||
    record.zaraSecondTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Mahir owner-review continuation state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.executionDigest !==
      CANONICAL_MAHIR_EXECUTION
        .executionDigest ||
    evidence.chaosEvidenceDigest !==
      chaosEvidenceDigest() ||
    evidence.deterministicEvidenceCreated !==
      true ||
    evidence.simulatedFailureScenarioCount !==
      5 ||
    evidence.blastRadiusControlCount !==
      5 ||
    evidence.emergencyPauseGateCount !==
      5 ||
    evidence.rollbackCheckpointCount !==
      4 ||
    evidence.ownerReviewGateCount !==
      5 ||
    evidence.stopConditionCount !==
      6 ||
    evidence.realFailureInjected !==
      false ||
    evidence.liveEnvironmentAffected !==
      false ||
    evidence.productionExecutionPerformed !==
      false ||
    evidence.ownerReviewCompleted !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false
  ) {
    throw new Error(
      "Mahir owner-review chaos evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalMahirExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.sourceZaraPlanBound,
    boundary.sourceZaraDecisionPreparationBound,
    boundary.sourceZaraCandidateDecisionBound,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.mahirSecondTaskReviewed,
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
    boundary.zaraSecondTaskExecutionPerformed,
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
    boundary.mahirSecondTaskApproved !==
      approved ||
    boundary.zaraSecondTaskExecutionAuthorized !==
      approved ||
    boundary.onlyZaraCurrentlyExecutable !==
      approved ||
    boundary.remainingOneAuthorizedCandidateWaiting !==
      approved ||
    boundary.aggregateConcurrentExecutionLimit !==
      1
  ) {
    throw new Error(
      "Mahir owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SEVEN"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_MAHIR_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        CANONICAL_MAHIR_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Mahir owner-review transition is invalid.",
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
      "Mahir owner review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision {
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution(
    input.sourceExecution,
  );

  if (
    input.sourceExecution.executionId !==
      CANONICAL_MAHIR_EXECUTION.executionId ||
    input.sourceExecution.executionDigest !==
      CANONICAL_MAHIR_EXECUTION.executionDigest
  ) {
    throw new Error(
      "Only the canonical Mahir second-task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Mahir owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Mahir owner-review owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_MAHIR_EXECUTION.ownerId
  ) {
    throw new Error(
      "Mahir owner-review owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Mahir owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_MAHIR_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Mahir owner review cannot precede execution.",
    );
  }

  validateCanonicalZaraContinuation();

  const record =
    buildMahirOwnerReview(
      decisionId,
      ownerId,
      input.decision,
      reason,
      decidedAt,
    );

  validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision({
    decisionId:
      "engineering-mahir-second-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION",

    reason:
      "Owner reviewed Mahir's deterministic bounded chaos and failure-containment evidence, approved the result, and authorized only Zara's second synthetic data-pipeline quality task next.",

    decidedAt:
      "2026-08-02T10:20:00.000Z",
  });