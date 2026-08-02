import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
  type EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-second-workstream-evidence-plan-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_ONLY",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecisionInput {
  readonly decisionId: string;

  readonly sourcePreparation:
    EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|secret|credential|bearer|private[_ -]?key)\b/i;

function stableNormalize(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      stableNormalize,
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map(
          (key) => [
            key,
            stableNormalize(
              record[key],
            ),
          ],
        ),
    );
  }

  return value;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        stableNormalize(value),
      ),
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

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    value.trim() !== value ||
    !IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireReason(
  value: string,
): void {
  const normalized =
    value.trim();

  if (
    normalized !== value ||
    normalized.length < 40 ||
    normalized.length > 1200
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan review reason is invalid.",
    );
  }

  if (
    SENSITIVE_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan review reason must not contain sensitive material.",
    );
  }
}

const canonicalPreparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
    canonicalPreparation,
  );

  if (
    canonicalPreparation.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARED" ||
    canonicalPreparation.workstreamSequence !==
      2 ||
    canonicalPreparation.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    canonicalPreparation.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    canonicalPreparation.planOnly !==
      true ||
    canonicalPreparation.evidenceItemCount !==
      8 ||
    canonicalPreparation.evidenceItems.length !==
      8 ||
    canonicalPreparation.ownerEvidencePlanReviewRequired !==
      true ||
    canonicalPreparation.ownerEvidencePlanReviewRecorded !==
      false ||
    canonicalPreparation.summary
      .syntheticSanitizedEvidenceItemCount !==
      8 ||
    canonicalPreparation.summary
      .deterministicEvidenceRequiredCount !==
      8 ||
    canonicalPreparation.summary
      .independentValidationRequiredCount !==
      8 ||
    canonicalPreparation.summary
      .ownerReviewRequiredCount !==
      8 ||
    canonicalPreparation.summary
      .monitoringRequiredCount !==
      8 ||
    canonicalPreparation.summary
      .emergencyPauseRequiredCount !==
      8 ||
    canonicalPreparation.summary
      .rollbackEvidenceRequiredCount !==
      8 ||
    canonicalPreparation.summary
      .taskExecutionAuthorizedCount !==
      0 ||
    canonicalPreparation.summary
      .concurrentExecutionAuthorizedCount !==
      0 ||
    canonicalPreparation.summary
      .repositoryReadAuthorizedCount !==
      0 ||
    canonicalPreparation.summary
      .repositoryWriteAuthorizedCount !==
      0 ||
    canonicalPreparation.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .taskExecutionAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    canonicalPreparation.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    canonicalPreparation.authorityBoundary
      .monitoringRequired !==
      true ||
    canonicalPreparation.authorityBoundary
      .emergencyPauseRequired !==
      true ||
    canonicalPreparation.authorityBoundary
      .rollbackEvidenceRequired !==
      true ||
    canonicalPreparation.authorityBoundary
      .ownerFinalAuthorityPreserved !==
      true ||
    canonicalPreparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW"
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan preparation is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_ONLY";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_RECORDED" as const,

    sourcePreparationId:
      canonicalPreparation.preparationId,

    sourcePreparationDigest:
      canonicalPreparation.preparationDigest,

    sourceWorkstreamPreparationReviewDecisionId:
      canonicalPreparation
        .sourceWorkstreamPreparationReviewDecisionId,

    sourceWorkstreamPreparationReviewDecisionDigest:
      canonicalPreparation
        .sourceWorkstreamPreparationReviewDecisionDigest,

    sourcePriorWorkstreamClosureDecisionId:
      canonicalPreparation
        .sourcePriorWorkstreamClosureDecisionId,

    sourcePriorWorkstreamClosureDecisionDigest:
      canonicalPreparation
        .sourcePriorWorkstreamClosureDecisionDigest,

    tenantId:
      canonicalPreparation.tenantId,

    ownerId,

    decision,

    evidencePlanAccepted:
      approved,

    concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized:
      approved,

    concurrentCoordinationEvidenceExecutionAuthorized:
      false as const,

    consequentialAuthorityGranted:
      false as const,

    reviewedPlan: {
      workstreamSequence:
        canonicalPreparation
          .workstreamSequence,

      workstreamId:
        canonicalPreparation
          .workstreamId,

      evidenceClass:
        canonicalPreparation
          .evidenceClass,

      planOnly:
        canonicalPreparation.planOnly,

      evidenceItemCount:
        canonicalPreparation
          .evidenceItemCount,

      syntheticSanitizedEvidenceItemCount:
        canonicalPreparation.summary
          .syntheticSanitizedEvidenceItemCount,

      deterministicEvidenceRequiredCount:
        canonicalPreparation.summary
          .deterministicEvidenceRequiredCount,

      independentValidationRequiredCount:
        canonicalPreparation.summary
          .independentValidationRequiredCount,

      ownerReviewRequiredCount:
        canonicalPreparation.summary
          .ownerReviewRequiredCount,

      monitoringRequiredCount:
        canonicalPreparation.summary
          .monitoringRequiredCount,

      emergencyPauseRequiredCount:
        canonicalPreparation.summary
          .emergencyPauseRequiredCount,

      rollbackEvidenceRequiredCount:
        canonicalPreparation.summary
          .rollbackEvidenceRequiredCount,

      taskExecutionAuthorizedCount:
        canonicalPreparation.summary
          .taskExecutionAuthorizedCount,

      concurrentExecutionAuthorizedCount:
        canonicalPreparation.summary
          .concurrentExecutionAuthorizedCount,

      repositoryReadAuthorizedCount:
        canonicalPreparation.summary
          .repositoryReadAuthorizedCount,

      repositoryWriteAuthorizedCount:
        canonicalPreparation.summary
          .repositoryWriteAuthorizedCount,

      sourceNextStep:
        canonicalPreparation.nextStep,
    },

    authorityBoundary: {
      ownerReviewDecisionRecorded:
        true as const,

      ownerIdentityBound:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      exactEightEvidenceItemsReviewed:
        true as const,

      evidencePlanAccepted:
        approved,

      concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized:
        approved,

      concurrentCoordinationEvidenceExecutionAuthorized:
        false as const,

      consequentialAuthorityGranted:
        false as const,

      concurrentExecutionAuthorized:
        false as const,

      taskExecutionAuthorized:
        false as const,

      thirdTaskExecutionAuthorized:
        false as const,

      levelThreeEvaluationAuthorized:
        false as const,

      levelThreeAuthorityGranted:
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

      emergencyPauseRequired:
        true as const,

      rollbackEvidenceRequired:
        true as const,

      ownerFinalAuthorityPreserved:
        true as const,
    },

    reason,

    nextStep:
      approved
        ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW" as const,

    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision =
  ReturnType<
    typeof buildDecision
  >;

export function validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision,
): void {
  validateCanonicalPreparation();

  requireIdentifier(
    "Engineering second-workstream evidence-plan review decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering second-workstream evidence-plan review owner ID",
    record.ownerId,
  );

  requireTimestamp(
    "Engineering second-workstream evidence-plan review time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      decisionDigest,
    ) ||
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_ONLY";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_RECORDED" ||
    record.sourcePreparationId !==
      canonicalPreparation.preparationId ||
    record.sourcePreparationDigest !==
      canonicalPreparation.preparationDigest ||
    record.sourceWorkstreamPreparationReviewDecisionId !==
      canonicalPreparation.sourceWorkstreamPreparationReviewDecisionId ||
    record.sourceWorkstreamPreparationReviewDecisionDigest !==
      canonicalPreparation.sourceWorkstreamPreparationReviewDecisionDigest ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      canonicalPreparation.sourcePriorWorkstreamClosureDecisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      canonicalPreparation.sourcePriorWorkstreamClosureDecisionDigest ||
    record.tenantId !==
      canonicalPreparation.tenantId ||
    record.ownerId !==
      canonicalPreparation.ownerId ||
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.evidencePlanAccepted !==
      approved ||
    record.concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized !==
      approved ||
    record.concurrentCoordinationEvidenceExecutionAuthorized !==
      false ||
    record.consequentialAuthorityGranted !==
      false ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalPreparation.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan review identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedPlan;

  if (
    reviewed.workstreamSequence !==
      2 ||
    reviewed.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    reviewed.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    reviewed.planOnly !== true ||
    reviewed.evidenceItemCount !==
      8 ||
    reviewed.syntheticSanitizedEvidenceItemCount !==
      8 ||
    reviewed.deterministicEvidenceRequiredCount !==
      8 ||
    reviewed.independentValidationRequiredCount !==
      8 ||
    reviewed.ownerReviewRequiredCount !==
      8 ||
    reviewed.monitoringRequiredCount !==
      8 ||
    reviewed.emergencyPauseRequiredCount !==
      8 ||
    reviewed.rollbackEvidenceRequiredCount !==
      8 ||
    reviewed.taskExecutionAuthorizedCount !==
      0 ||
    reviewed.concurrentExecutionAuthorizedCount !==
      0 ||
    reviewed.repositoryReadAuthorizedCount !==
      0 ||
    reviewed.repositoryWriteAuthorizedCount !==
      0 ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW"
  ) {
    throw new Error(
      "Engineering reviewed second-workstream evidence plan is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.ownerReviewDecisionRecorded,
    boundary.ownerIdentityBound,
    boundary.sourcePreparationIntegrityVerified,
    boundary.exactEightEvidenceItemsReviewed,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const approvalBound = [
    boundary.evidencePlanAccepted,
    boundary.concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized,
  ];

  const requiredFalse = [
    boundary.concurrentCoordinationEvidenceExecutionAuthorized,
    boundary.consequentialAuthorityGranted,
    boundary.concurrentExecutionAuthorized,
    boundary.taskExecutionAuthorized,
    boundary.thirdTaskExecutionAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
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
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  const expectedNextStep =
    approved
      ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW";

  if (
    requiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    approvalBound.some(
      (value) =>
        value !== approved,
    ) ||
    requiredFalse.some(
      (value) =>
        value !== false,
    ) ||
    record.nextStep !==
      expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedPlan,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision {
  validateCanonicalPreparation();

  if (
    input.sourcePreparation !==
      canonicalPreparation
  ) {
    validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
      input.sourcePreparation,
    );
  }

  if (
    input.sourcePreparation.preparationId !==
      canonicalPreparation.preparationId ||
    input.sourcePreparation.preparationDigest !==
      canonicalPreparation.preparationDigest
  ) {
    throw new Error(
      "Engineering second-workstream owner review requires the canonical evidence-plan preparation.",
    );
  }

  requireIdentifier(
    "Engineering second-workstream evidence-plan review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Engineering second-workstream evidence-plan review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Engineering second-workstream evidence-plan review time",
    input.decidedAt,
  );

  requireReason(
    input.reason,
  );

  if (
    input.ownerId !==
      canonicalPreparation.ownerId
  ) {
    throw new Error(
      "Only the canonical NEXUS owner can issue the Engineering second-workstream evidence-plan review decision.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(
        canonicalPreparation.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan review cannot precede preparation.",
    );
  }

  const record =
    buildDecision(
      input.decisionId,
      input.ownerId,
      input.decision,
      input.reason.trim(),
      input.decidedAt,
    );

  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
    record,
  );

  return record;
}