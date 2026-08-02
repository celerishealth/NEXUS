import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-second-task-sequence-closure-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE",
    "REJECT_AND_RETAIN_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PENDING",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISIONS
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
      "Unsupported deterministic sequence-closure owner-review value.",
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
      "Sequence-closure owner-review reason is invalid.",
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

const CANONICAL_CLOSURE_EVIDENCE =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION;

export interface CreateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecisionInput {
  readonly decisionId: string;

  readonly sourceClosureEvidence:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

function candidateEvidenceAggregateDigest(): string {
  return sha256(
    CANONICAL_CLOSURE_EVIDENCE
      .candidateEvidence,
  );
}

function buildSequenceClosureOwnerReview(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_CLOSURE_EVIDENCE
        .tenantId,

    ownerId,

    sourceClosureEvidenceId:
      CANONICAL_CLOSURE_EVIDENCE
        .evidenceId,

    sourceClosureEvidenceDigest:
      CANONICAL_CLOSURE_EVIDENCE
        .evidenceDigest,

    sourceAdvikOwnerReviewDecisionId:
      CANONICAL_CLOSURE_EVIDENCE
        .sourceAdvikOwnerReviewDecisionId,

    sourceAdvikOwnerReviewDecisionDigest:
      CANONICAL_CLOSURE_EVIDENCE
        .sourceAdvikOwnerReviewDecisionDigest,

    decision,

    closureEvidenceApproved:
      approved,

    sequenceClosureOwnerReviewCompleted:
      true as const,

    sequenceClosureOwnerAcceptanceRecorded:
      approved,

    secondTaskSequenceClosed:
      approved,

    reviewedEvidence: {
      workstreamId:
        "routine-engineering-second-task-evidence" as const,

      evidenceClass:
        "ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PREPARATION_EVIDENCE" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      preparationMode:
        "READ_ONLY_DETERMINISTIC_EVIDENCE_AGGREGATION" as const,

      candidateCount:
        8 as const,

      executedCandidateCount:
        8 as const,

      ownerReviewedCandidateCount:
        8 as const,

      taskSequence:
        2 as const,

      closureEvidenceDigest:
        CANONICAL_CLOSURE_EVIDENCE
          .evidenceDigest,

      candidateEvidenceAggregateDigest:
        candidateEvidenceAggregateDigest(),

      allEightCandidateSecondTaskExecutionsCompleted:
        true as const,

      allEightCandidateOwnerReviewsCompleted:
        true as const,

      exactCandidateOrderVerified:
        true as const,

      executionAndReviewDigestsBound:
        true as const,

      duplicateCandidateIdentityDetected:
        false as const,

      missingCandidateEvidenceDetected:
        false as const,

      unresolvedCandidateExecutionRemaining:
        false as const,

      closureEvidencePrepared:
        true as const,

      ownerReviewCompleted:
        true as const,
    },

    authorityBoundary: {
      canonicalClosureEvidenceBound:
        true as const,

      sourceClosureEvidenceIntegrityVerified:
        true as const,

      sourceAdvikOwnerReviewBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      exactEightCandidateSequenceBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      sequenceClosureEvidencePrepared:
        true as const,

      sequenceClosureOwnerReviewCompleted:
        true as const,

      sequenceClosureOwnerAcceptanceRecorded:
        approved,

      secondTaskSequenceClosed:
        approved,

      allEightCandidateSecondTaskExecutionsCompleted:
        true as const,

      allEightCandidateOwnerReviewsCompleted:
        true as const,

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

      levelThreeEvaluationAuthorized:
        false as const,

      levelThreeAuthorityGranted:
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
        ? "AWAIT_OWNER_NEXT_ENGINEERING_POST_LEVEL_TWO_OBJECTIVE" as const
        : "RETAIN_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PENDING" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision =
  ReturnType<
    typeof buildSequenceClosureOwnerReview
  >;

export function validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision,
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
      "Second-task sequence-closure owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
    CANONICAL_CLOSURE_EVIDENCE,
  );

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_REVIEW_RECORDED" ||
    record.tenantId !==
      CANONICAL_CLOSURE_EVIDENCE.tenantId ||
    record.ownerId !==
      CANONICAL_CLOSURE_EVIDENCE.ownerId ||
    record.sourceClosureEvidenceId !==
      CANONICAL_CLOSURE_EVIDENCE.evidenceId ||
    record.sourceClosureEvidenceDigest !==
      CANONICAL_CLOSURE_EVIDENCE.evidenceDigest ||
    record.sourceAdvikOwnerReviewDecisionId !==
      CANONICAL_CLOSURE_EVIDENCE
        .sourceAdvikOwnerReviewDecisionId ||
    record.sourceAdvikOwnerReviewDecisionDigest !==
      CANONICAL_CLOSURE_EVIDENCE
        .sourceAdvikOwnerReviewDecisionDigest
  ) {
    throw new Error(
      "Second-task sequence-closure owner-review source binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PENDING"
  ) {
    throw new Error(
      "Second-task sequence-closure owner decision is invalid.",
    );
  }

  if (
    record.closureEvidenceApproved !==
      approved ||
    record.sequenceClosureOwnerReviewCompleted !==
      true ||
    record.sequenceClosureOwnerAcceptanceRecorded !==
      approved ||
    record.secondTaskSequenceClosed !==
      approved
  ) {
    throw new Error(
      "Second-task sequence-closure decision state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.closureEvidenceDigest !==
      CANONICAL_CLOSURE_EVIDENCE
        .evidenceDigest ||
    evidence.candidateEvidenceAggregateDigest !==
      candidateEvidenceAggregateDigest() ||
    evidence.candidateCount !== 8 ||
    evidence.executedCandidateCount !==
      8 ||
    evidence.ownerReviewedCandidateCount !==
      8 ||
    evidence.taskSequence !== 2 ||
    evidence.allEightCandidateSecondTaskExecutionsCompleted !==
      true ||
    evidence.allEightCandidateOwnerReviewsCompleted !==
      true ||
    evidence.exactCandidateOrderVerified !==
      true ||
    evidence.executionAndReviewDigestsBound !==
      true ||
    evidence.duplicateCandidateIdentityDetected !==
      false ||
    evidence.missingCandidateEvidenceDetected !==
      false ||
    evidence.unresolvedCandidateExecutionRemaining !==
      false ||
    evidence.closureEvidencePrepared !==
      true ||
    evidence.ownerReviewCompleted !==
      true
  ) {
    throw new Error(
      "Second-task sequence-closure reviewed evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalClosureEvidenceBound,
    boundary.sourceClosureEvidenceIntegrityVerified,
    boundary.sourceAdvikOwnerReviewBound,
    boundary.tenantIdentityBound,
    boundary.ownerIdentityBound,
    boundary.exactEightCandidateSequenceBound,
    boundary.sequenceClosureEvidencePrepared,
    boundary.sequenceClosureOwnerReviewCompleted,
    boundary.allEightCandidateSecondTaskExecutionsCompleted,
    boundary.allEightCandidateOwnerReviewsCompleted,
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
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
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
    boundary.sequenceClosureOwnerAcceptanceRecorded !==
      approved ||
    boundary.secondTaskSequenceClosed !==
      approved
  ) {
    throw new Error(
      "Second-task sequence-closure authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "AWAIT_OWNER_NEXT_ENGINEERING_POST_LEVEL_TWO_OBJECTIVE"
      : "RETAIN_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PENDING";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        CANONICAL_CLOSURE_EVIDENCE
          .preparedAt,
      )
  ) {
    throw new Error(
      "Second-task sequence-closure transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Second-task sequence-closure owner review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision {
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
    input.sourceClosureEvidence,
  );

  if (
    input.sourceClosureEvidence.evidenceId !==
      CANONICAL_CLOSURE_EVIDENCE.evidenceId ||
    input.sourceClosureEvidence.evidenceDigest !==
      CANONICAL_CLOSURE_EVIDENCE.evidenceDigest
  ) {
    throw new Error(
      "Only the canonical second-task sequence-closure evidence can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Sequence-closure owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Sequence-closure owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_CLOSURE_EVIDENCE.ownerId
  ) {
    throw new Error(
      "Sequence-closure owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Sequence-closure owner-review time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_CLOSURE_EVIDENCE
          .preparedAt,
      )
  ) {
    throw new Error(
      "Sequence-closure owner review cannot precede evidence preparation.",
    );
  }

  const record =
    buildSequenceClosureOwnerReview(
      decisionId,
      ownerId,
      input.decision,
      reason,
      decidedAt,
    );

  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision({
    decisionId:
      "engineering-post-level-two-second-task-sequence-closure-owner-review-decision-001",

    sourceClosureEvidence:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE",

    reason:
      "Owner reviewed the deterministic closure evidence for all eight second synthetic task executions and reviews, accepted the complete bounded sequence, and closed only this second-task sequence without granting Level 3 or consequential authority.",

    decidedAt:
      "2026-08-02T11:50:00.000Z",
  });