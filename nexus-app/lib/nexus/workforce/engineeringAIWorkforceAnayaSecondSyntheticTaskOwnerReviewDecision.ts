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
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceAnayaSecondSyntheticTaskExecution";

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-anaya-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ANAYA_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
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
      "Unsupported deterministic Anaya owner-review value.",
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
      "Anaya owner-review reason is invalid.",
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

const CANONICAL_ANAYA_EXECUTION =
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION;

const CANONICAL_ATHARV_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Atharv",
    );

const CANONICAL_ATHARV_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Atharv",
    );

const CANONICAL_ATHARV_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Atharv",
    );

if (
  !CANONICAL_ATHARV_PLAN ||
  !CANONICAL_ATHARV_PREPARATION ||
  !CANONICAL_ATHARV_DECISION
) {
  throw new Error(
    "Canonical Atharv second-task continuation sources are missing.",
  );
}

function getAtharvPlan():
  NonNullable<
    typeof CANONICAL_ATHARV_PLAN
  > {
  return CANONICAL_ATHARV_PLAN!;
}

function getAtharvPreparation():
  NonNullable<
    typeof CANONICAL_ATHARV_PREPARATION
  > {
  return CANONICAL_ATHARV_PREPARATION!;
}

function getAtharvDecision():
  NonNullable<
    typeof CANONICAL_ATHARV_DECISION
  > {
  return CANONICAL_ATHARV_DECISION!;
}

function validateCanonicalAtharvContinuation(): void {
  const plan =
    getAtharvPlan();

  const preparation =
    getAtharvPreparation();

  const decision =
    getAtharvDecision();

  if (
    plan.sequence !== 5 ||
    plan.employeeId !==
      "candidate-atharv-v1" ||
    plan.employeeCode !==
      "nx-engineering-005" ||
    plan.publicName !==
      "Atharv" ||
    plan.officialRole !==
      "AI Reliability Engineering Specialist" ||
    plan.scenarioId !==
      "RELIABILITY_RECOVERY_VALIDATION_PLAN" ||
    plan.objective !==
      "Plan one bounded synthetic reliability and recovery evidence task without live-provider or production execution." ||
    plan.expectedEvidence !==
      "A deterministic recovery validation plan with monitoring, graceful degradation, rollback, and audit checkpoints." ||
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
      "Canonical Atharv second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 5 ||
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
      "Canonical Atharv second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 5 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.publicName !==
      "Atharv" ||
    decision.officialRole !==
      "AI Reliability Engineering Specialist" ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      "RELIABILITY_RECOVERY_VALIDATION_PLAN" ||
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
      "Canonical Atharv second-task decision is invalid.",
    );
  }
}

export interface CreateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly decisionId: string;

  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

function securityEvidenceDigest(): string {
  return sha256(
    CANONICAL_ANAYA_EXECUTION
      .securityReviewPlan,
  );
}

function buildAnayaOwnerReview(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const atharvPlan =
    getAtharvPlan();

  const atharvPreparation =
    getAtharvPreparation();

  const atharvDecision =
    getAtharvDecision();

  const approved =
    decision ===
      "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_ANAYA_EXECUTION
        .tenantId,

    ownerId,

    sourceExecutionId:
      CANONICAL_ANAYA_EXECUTION
        .executionId,

    sourceExecutionDigest:
      CANONICAL_ANAYA_EXECUTION
        .executionDigest,

    sourceVivaanOwnerReviewDecisionId:
      CANONICAL_ANAYA_EXECUTION
        .sourceVivaanOwnerReviewDecisionId,

    sourceVivaanOwnerReviewDecisionDigest:
      CANONICAL_ANAYA_EXECUTION
        .sourceVivaanOwnerReviewDecisionDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-anaya-v1" as const,

      employeeCode:
        "nx-engineering-004" as const,

      publicName:
        "Anaya" as const,

      officialRole:
        "AI Security Engineering Director" as const,

      runtimeId:
        CANONICAL_ANAYA_EXECUTION
          .runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "SECURITY_BOUNDARY_REVIEW_PLAN" as const,

      sourceCandidatePlanDigest:
        CANONICAL_ANAYA_EXECUTION
          .sourceCandidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        CANONICAL_ANAYA_EXECUTION
          .sourceCandidateDecisionPreparationDigest,

      candidateDecisionDigest:
        CANONICAL_ANAYA_EXECUTION
          .candidateDecisionDigest,
    },

    nextCandidate: {
      sequence:
        5 as const,

      employeeId:
        "candidate-atharv-v1" as const,

      employeeCode:
        "nx-engineering-005" as const,

      publicName:
        "Atharv" as const,

      officialRole:
        "AI Reliability Engineering Specialist" as const,

      runtimeId:
        atharvDecision.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "RELIABILITY_RECOVERY_VALIDATION_PLAN" as const,

      sourceCandidatePlanDigest:
        atharvPlan.candidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        atharvPreparation
          .candidateDecisionPreparationDigest,

      candidateDecisionDigest:
        atharvDecision
          .candidateDecisionDigest,
    },

    decision,

    anayaSecondTaskApproved:
      approved,

    atharvSecondTaskExecutionAuthorized:
      approved,

    atharvSecondTaskExecutionPerformed:
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
        "SECURITY_BOUNDARY_REVIEW_PLAN" as const,

      executionDigest:
        CANONICAL_ANAYA_EXECUTION
          .executionDigest,

      securityEvidenceDigest:
        securityEvidenceDigest(),

      deterministicEvidenceCreated:
        true as const,

      threatModelCount:
        5 as const,

      controlReviewCount:
        5 as const,

      failClosedRuleCount:
        6 as const,

      ownerEscalationRuleCount:
        5 as const,

      recoveryCheckCount:
        4 as const,

      protectedMaterialUsed:
        false as const,

      secretsAccessPerformed:
        false as const,

      repositoryAccessPerformed:
        false as const,

      productionAccessPerformed:
        false as const,

      ownerReviewCompleted:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalAnayaExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      sourceAtharvPlanBound:
        true as const,

      sourceAtharvDecisionPreparationBound:
        true as const,

      sourceAtharvCandidateDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      anayaSecondTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      anayaSecondTaskApproved:
        approved,

      atharvSecondTaskExecutionAuthorized:
        approved,

      atharvSecondTaskExecutionPerformed:
        false as const,

      onlyAtharvCurrentlyExecutable:
        approved,

      remainingThreeAuthorizedCandidatesWaiting:
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FIVE" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ANAYA_SECOND_TASK_ONLY" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision =
  ReturnType<
    typeof buildAnayaOwnerReview
  >;

export function validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision,
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
      "Anaya second-task owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution(
    CANONICAL_ANAYA_EXECUTION,
  );

  validateCanonicalAtharvContinuation();

  const atharvPlan =
    getAtharvPlan();

  const atharvPreparation =
    getAtharvPreparation();

  const atharvDecision =
    getAtharvDecision();

  const approved =
    record.decision ===
      "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      CANONICAL_ANAYA_EXECUTION.tenantId ||
    record.ownerId !==
      CANONICAL_ANAYA_EXECUTION.ownerId ||
    record.sourceExecutionId !==
      CANONICAL_ANAYA_EXECUTION.executionId ||
    record.sourceExecutionDigest !==
      CANONICAL_ANAYA_EXECUTION.executionDigest ||
    record.sourceVivaanOwnerReviewDecisionId !==
      CANONICAL_ANAYA_EXECUTION
        .sourceVivaanOwnerReviewDecisionId ||
    record.sourceVivaanOwnerReviewDecisionDigest !==
      CANONICAL_ANAYA_EXECUTION
        .sourceVivaanOwnerReviewDecisionDigest
  ) {
    throw new Error(
      "Anaya owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-anaya-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-004" ||
    record.reviewedEmployee.publicName !==
      "Anaya" ||
    record.reviewedEmployee.officialRole !==
      "AI Security Engineering Director" ||
    record.reviewedEmployee.runtimeId !==
      CANONICAL_ANAYA_EXECUTION.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "SECURITY_BOUNDARY_REVIEW_PLAN" ||
    record.reviewedEmployee.sourceCandidatePlanDigest !==
      CANONICAL_ANAYA_EXECUTION
        .sourceCandidatePlanDigest ||
    record.reviewedEmployee.sourceCandidateDecisionPreparationDigest !==
      CANONICAL_ANAYA_EXECUTION
        .sourceCandidateDecisionPreparationDigest ||
    record.reviewedEmployee.candidateDecisionDigest !==
      CANONICAL_ANAYA_EXECUTION
        .candidateDecisionDigest
  ) {
    throw new Error(
      "Anaya owner-review employee binding is invalid.",
    );
  }

  if (
    record.nextCandidate.sequence !==
      5 ||
    record.nextCandidate.employeeId !==
      "candidate-atharv-v1" ||
    record.nextCandidate.employeeCode !==
      "nx-engineering-005" ||
    record.nextCandidate.publicName !==
      "Atharv" ||
    record.nextCandidate.officialRole !==
      "AI Reliability Engineering Specialist" ||
    record.nextCandidate.runtimeId !==
      atharvDecision.runtimeId ||
    record.nextCandidate.taskSequence !==
      2 ||
    record.nextCandidate.scenarioId !==
      "RELIABILITY_RECOVERY_VALIDATION_PLAN" ||
    record.nextCandidate.sourceCandidatePlanDigest !==
      atharvPlan.candidatePlanDigest ||
    record.nextCandidate.sourceCandidateDecisionPreparationDigest !==
      atharvPreparation
        .candidateDecisionPreparationDigest ||
    record.nextCandidate.candidateDecisionDigest !==
      atharvDecision.candidateDecisionDigest
  ) {
    throw new Error(
      "Anaya owner-review Atharv binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ANAYA_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Anaya owner-review decision is invalid.",
    );
  }

  if (
    record.anayaSecondTaskApproved !==
      approved ||
    record.atharvSecondTaskExecutionAuthorized !==
      approved ||
    record.atharvSecondTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Anaya owner-review continuation state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.executionDigest !==
      CANONICAL_ANAYA_EXECUTION
        .executionDigest ||
    evidence.securityEvidenceDigest !==
      securityEvidenceDigest() ||
    evidence.deterministicEvidenceCreated !==
      true ||
    evidence.threatModelCount !==
      5 ||
    evidence.controlReviewCount !==
      5 ||
    evidence.failClosedRuleCount !==
      6 ||
    evidence.ownerEscalationRuleCount !==
      5 ||
    evidence.recoveryCheckCount !==
      4 ||
    evidence.protectedMaterialUsed !==
      false ||
    evidence.secretsAccessPerformed !==
      false ||
    evidence.repositoryAccessPerformed !==
      false ||
    evidence.productionAccessPerformed !==
      false ||
    evidence.ownerReviewCompleted !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false
  ) {
    throw new Error(
      "Anaya owner-review security evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalAnayaExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.sourceAtharvPlanBound,
    boundary.sourceAtharvDecisionPreparationBound,
    boundary.sourceAtharvCandidateDecisionBound,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.anayaSecondTaskReviewed,
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
    boundary.atharvSecondTaskExecutionPerformed,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
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
    boundary.anayaSecondTaskApproved !==
      approved ||
    boundary.atharvSecondTaskExecutionAuthorized !==
      approved ||
    boundary.onlyAtharvCurrentlyExecutable !==
      approved ||
    boundary.remainingThreeAuthorizedCandidatesWaiting !==
      approved ||
    boundary.aggregateConcurrentExecutionLimit !==
      1
  ) {
    throw new Error(
      "Anaya owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FIVE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ANAYA_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        CANONICAL_ANAYA_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Anaya owner-review transition is invalid.",
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
      "Anaya owner review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision {
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution(
    input.sourceExecution,
  );

  if (
    input.sourceExecution.executionId !==
      CANONICAL_ANAYA_EXECUTION.executionId ||
    input.sourceExecution.executionDigest !==
      CANONICAL_ANAYA_EXECUTION.executionDigest
  ) {
    throw new Error(
      "Only the canonical Anaya second-task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Anaya owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Anaya owner-review owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_ANAYA_EXECUTION.ownerId
  ) {
    throw new Error(
      "Anaya owner-review owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Anaya owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_ANAYA_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Anaya owner review cannot precede execution.",
    );
  }

  validateCanonicalAtharvContinuation();

  const record =
    buildAnayaOwnerReview(
      decisionId,
      ownerId,
      input.decision,
      reason,
      decidedAt,
    );

  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision({
    decisionId:
      "engineering-anaya-second-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION",

    reason:
      "Owner reviewed Anaya's deterministic bounded security-boundary evidence, approved the result, and authorized only Atharv's second synthetic reliability and recovery validation task next.",

    decidedAt:
      "2026-08-02T09:20:00.000Z",
  });