import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,
  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceAdvikSecondSyntheticTaskExecution";

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-advik-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ADVIK_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
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
      "Unsupported deterministic Advik owner-review value.",
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
      "Advik owner-review reason is invalid.",
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

const CANONICAL_ADVIK_EXECUTION =
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION;

export interface CreateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly decisionId: string;

  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

function systemsEvaluationEvidenceDigest(): string {
  return sha256(
    CANONICAL_ADVIK_EXECUTION
      .systemsEvaluationPlan,
  );
}

function buildAdvikOwnerReview(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_ADVIK_EXECUTION
        .tenantId,

    ownerId,

    sourceExecutionId:
      CANONICAL_ADVIK_EXECUTION
        .executionId,

    sourceExecutionDigest:
      CANONICAL_ADVIK_EXECUTION
        .executionDigest,

    sourceZaraOwnerReviewDecisionId:
      CANONICAL_ADVIK_EXECUTION
        .sourceZaraOwnerReviewDecisionId,

    sourceZaraOwnerReviewDecisionDigest:
      CANONICAL_ADVIK_EXECUTION
        .sourceZaraOwnerReviewDecisionDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-advik-v1" as const,

      employeeCode:
        "nx-engineering-008" as const,

      publicName:
        "Advik" as const,

      officialRole:
        "AI Systems Evaluation & Red-Team Specialist" as const,

      runtimeId:
        CANONICAL_ADVIK_EXECUTION
          .runtimeId,

      candidateSequence:
        8 as const,

      taskSequence:
        2 as const,

      scenarioId:
        "SYSTEMS_EVALUATION_RED_TEAM_PLAN" as const,

      sourceCandidatePlanDigest:
        CANONICAL_ADVIK_EXECUTION
          .sourceCandidatePlanDigest,

      sourceCandidateDecisionPreparationDigest:
        CANONICAL_ADVIK_EXECUTION
          .sourceCandidateDecisionPreparationDigest,

      candidateDecisionDigest:
        CANONICAL_ADVIK_EXECUTION
          .candidateDecisionDigest,
    },

    decision,

    advikSecondTaskApproved:
      approved,

    allEightCandidateSecondTaskExecutionsCompleted:
      approved,

    finalCandidateOwnerReviewRecorded:
      true as const,

    sequenceClosureEvidencePreparationAuthorized:
      approved,

    sequenceClosureEvidencePrepared:
      false as const,

    secondTaskSequenceClosed:
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

      candidateSequence:
        8 as const,

      taskSequence:
        2 as const,

      scenarioId:
        "SYSTEMS_EVALUATION_RED_TEAM_PLAN" as const,

      executionDigest:
        CANONICAL_ADVIK_EXECUTION
          .executionDigest,

      systemsEvaluationEvidenceDigest:
        systemsEvaluationEvidenceDigest(),

      deterministicEvidenceCreated:
        true as const,

      evidenceSubstitutionCheckCount:
        5 as const,

      authorityBypassCheckCount:
        5 as const,

      isolationCheckCount:
        5 as const,

      recoveryCheckCount:
        4 as const,

      ownerControlCheckCount:
        5 as const,

      stopConditionCount:
        6 as const,

      knownLimitationCount:
        4 as const,

      adversarialExecutionPerformed:
        false as const,

      authorityBypassPerformed:
        false as const,

      evidenceSubstitutionPerformed:
        false as const,

      ownerReviewCompleted:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalAdvikExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      employeeIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      advikSecondTaskReviewed:
        true as const,

      finalCandidateOwnerReviewRecorded:
        true as const,

      advikSecondTaskApproved:
        approved,

      allEightCandidateSecondTaskExecutionsCompleted:
        approved,

      allEightCandidateOwnerReviewsCompleted:
        approved,

      noCandidateExecutionRemaining:
        true as const,

      nextCandidateExecutionAuthorized:
        false as const,

      noLaterCandidateExecutionAuthorized:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      sequenceClosureEvidencePreparationAuthorized:
        approved,

      sequenceClosureEvidencePrepared:
        false as const,

      secondTaskSequenceClosed:
        false as const,

      sequenceClosureOwnerAcceptanceRecorded:
        false as const,

      levelThreeEvaluationAuthorized:
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
        ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ADVIK_SECOND_TASK_ONLY" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision =
  ReturnType<
    typeof buildAdvikOwnerReview
  >;

export function validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision,
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
      "Advik second-task owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution(
    CANONICAL_ADVIK_EXECUTION,
  );

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      CANONICAL_ADVIK_EXECUTION.tenantId ||
    record.ownerId !==
      CANONICAL_ADVIK_EXECUTION.ownerId ||
    record.sourceExecutionId !==
      CANONICAL_ADVIK_EXECUTION.executionId ||
    record.sourceExecutionDigest !==
      CANONICAL_ADVIK_EXECUTION.executionDigest ||
    record.sourceZaraOwnerReviewDecisionId !==
      CANONICAL_ADVIK_EXECUTION
        .sourceZaraOwnerReviewDecisionId ||
    record.sourceZaraOwnerReviewDecisionDigest !==
      CANONICAL_ADVIK_EXECUTION
        .sourceZaraOwnerReviewDecisionDigest
  ) {
    throw new Error(
      "Advik owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-advik-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-008" ||
    record.reviewedEmployee.publicName !==
      "Advik" ||
    record.reviewedEmployee.officialRole !==
      "AI Systems Evaluation & Red-Team Specialist" ||
    record.reviewedEmployee.runtimeId !==
      CANONICAL_ADVIK_EXECUTION.runtimeId ||
    record.reviewedEmployee.candidateSequence !==
      8 ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "SYSTEMS_EVALUATION_RED_TEAM_PLAN" ||
    record.reviewedEmployee.sourceCandidatePlanDigest !==
      CANONICAL_ADVIK_EXECUTION
        .sourceCandidatePlanDigest ||
    record.reviewedEmployee.sourceCandidateDecisionPreparationDigest !==
      CANONICAL_ADVIK_EXECUTION
        .sourceCandidateDecisionPreparationDigest ||
    record.reviewedEmployee.candidateDecisionDigest !==
      CANONICAL_ADVIK_EXECUTION
        .candidateDecisionDigest
  ) {
    throw new Error(
      "Advik owner-review employee binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ADVIK_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Advik owner-review decision is invalid.",
    );
  }

  if (
    record.advikSecondTaskApproved !==
      approved ||
    record.allEightCandidateSecondTaskExecutionsCompleted !==
      approved ||
    record.finalCandidateOwnerReviewRecorded !==
      true ||
    record.sequenceClosureEvidencePreparationAuthorized !==
      approved ||
    record.sequenceClosureEvidencePrepared !==
      false ||
    record.secondTaskSequenceClosed !==
      false
  ) {
    throw new Error(
      "Advik owner-review sequence state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.executionDigest !==
      CANONICAL_ADVIK_EXECUTION
        .executionDigest ||
    evidence.systemsEvaluationEvidenceDigest !==
      systemsEvaluationEvidenceDigest() ||
    evidence.deterministicEvidenceCreated !==
      true ||
    evidence.evidenceSubstitutionCheckCount !==
      5 ||
    evidence.authorityBypassCheckCount !==
      5 ||
    evidence.isolationCheckCount !==
      5 ||
    evidence.recoveryCheckCount !==
      4 ||
    evidence.ownerControlCheckCount !==
      5 ||
    evidence.stopConditionCount !==
      6 ||
    evidence.knownLimitationCount !==
      4 ||
    evidence.adversarialExecutionPerformed !==
      false ||
    evidence.authorityBypassPerformed !==
      false ||
    evidence.evidenceSubstitutionPerformed !==
      false ||
    evidence.ownerReviewCompleted !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false
  ) {
    throw new Error(
      "Advik owner-review systems-evaluation evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalAdvikExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.employeeIdentityBound,
    boundary.runtimeIdentityBound,
    boundary.advikSecondTaskReviewed,
    boundary.finalCandidateOwnerReviewRecorded,
    boundary.noCandidateExecutionRemaining,
    boundary.noLaterCandidateExecutionAuthorized,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.nextCandidateExecutionAuthorized,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
    boundary.sequenceClosureEvidencePrepared,
    boundary.secondTaskSequenceClosed,
    boundary.sequenceClosureOwnerAcceptanceRecorded,
    boundary.levelThreeEvaluationAuthorized,
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
    boundary.advikSecondTaskApproved !==
      approved ||
    boundary.allEightCandidateSecondTaskExecutionsCompleted !==
      approved ||
    boundary.allEightCandidateOwnerReviewsCompleted !==
      approved ||
    boundary.sequenceClosureEvidencePreparationAuthorized !==
      approved
  ) {
    throw new Error(
      "Advik owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ADVIK_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        CANONICAL_ADVIK_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Advik owner-review transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedEmployee,
    ) ||
    !Object.isFrozen(
      record.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Advik owner review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision {
  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution(
    input.sourceExecution,
  );

  if (
    input.sourceExecution.executionId !==
      CANONICAL_ADVIK_EXECUTION.executionId ||
    input.sourceExecution.executionDigest !==
      CANONICAL_ADVIK_EXECUTION.executionDigest
  ) {
    throw new Error(
      "Only the canonical Advik second-task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Advik owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Advik owner-review owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_ADVIK_EXECUTION.ownerId
  ) {
    throw new Error(
      "Advik owner-review owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Advik owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_ADVIK_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Advik owner review cannot precede execution.",
    );
  }

  const record =
    buildAdvikOwnerReview(
      decisionId,
      ownerId,
      input.decision,
      reason,
      decidedAt,
    );

  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision({
    decisionId:
      "engineering-advik-second-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION",

    reason:
      "Owner reviewed Advik's deterministic bounded systems-evaluation evidence, approved the final candidate result, and authorized only preparation of the separate second-task sequence-closure evidence.",

    decidedAt:
      "2026-08-02T11:20:00.000Z",
  });