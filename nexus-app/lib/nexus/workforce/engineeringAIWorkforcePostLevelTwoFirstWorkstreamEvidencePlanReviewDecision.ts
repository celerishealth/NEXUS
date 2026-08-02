import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
  type EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-first-workstream-evidence-plan-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_ONLY",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_RECORDED";
  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest:
    string;
  readonly sourceWorkstreamPreparationReviewDecisionId:
    string;
  readonly sourceWorkstreamPreparationReviewDecisionDigest:
    string;
  readonly sourceLevelTwoOwnerReviewDecisionId:
    string;
  readonly sourceLevelTwoOwnerReviewDecisionDigest:
    string;
  readonly sourceRuntimeIssuanceId: string;
  readonly sourceRuntimeIssuanceDigest:
    string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecisionType;
  readonly evidencePlanAccepted: boolean;
  readonly secondTaskExecutionDecisionPreparationAuthorized:
    boolean;
  readonly secondTaskExecutionAuthorized:
    false;
  readonly consequentialAuthorityGranted:
    false;
  readonly reviewedPlan: Readonly<{
    workstreamSequence: 1;
    workstreamId:
      "routine-engineering-second-task-evidence";
    evidenceClass:
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE";
    planOnly: true;
    candidatePlanCount: 8;
    firstTaskReviewedAndApprovedCount:
      8;
    activatedRuntimeCount: 8;
    secondTaskEvidencePlanPreparedCount:
      8;
    ownerExecutionDecisionRequiredCount:
      8;
    ownerExecutionDecisionRecordedCount:
      0;
    secondTaskExecutionAuthorizedCount:
      0;
    secondTaskExecutedCount: 0;
    concurrentExecutionAuthorizedCount:
      0;
    repositoryReadAuthorizedCount: 0;
    repositoryWriteAuthorizedCount: 0;
    syntheticSanitizedPlanCount: 8;
    deterministicEvidenceRequiredCount:
      8;
    independentValidationRequiredCount:
      8;
    sourceNextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW";
  }>;
  readonly authorityBoundary: Readonly<{
    ownerReviewDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePreparationIntegrityVerified:
      true;
    exactEightCandidatePlansReviewed:
      true;
    evidencePlanAccepted: boolean;
    secondTaskExecutionDecisionPreparationAuthorized:
      boolean;
    secondTaskExecutionAuthorized:
      false;
    consequentialAuthorityGranted:
      false;
    levelThreeAuthorityGranted: false;
    thirdTaskExecutionAuthorized: false;
    concurrentExecutionAuthorized:
      false;
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized:
      false;
    mergeAuthorized: false;
    secretsAccessAuthorized: false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized:
      false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
      false;
    productionDatabaseAuthorized:
      false;
    productionMutationAuthorized:
      false;
    productionDeploymentAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized: false;
    autonomousDecisionAuthorized:
      false;
    productionReadinessAuthorized:
      false;
    publicLaunchAuthorized: false;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution:
      false;
    monitoringRequired: true;
    emergencyPauseRequired: true;
    rollbackEvidenceRequired: true;
    ownerFinalAuthorityPreserved: true;
  }>;
  readonly reason: string;
  readonly nextStep:
    | "AWAIT_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION"
    | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW";
  readonly decidedAt: string;
  readonly decisionDigest: string;
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
    return value.map(stableNormalize);
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value as Record<string, unknown>,
      )
        .sort(
          ([left], [right]) =>
            left.localeCompare(right),
        )
        .map(
          ([key, nestedValue]) => [
            key,
            stableNormalize(nestedValue),
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
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (
    const nestedValue of
    Object.values(
      value as Record<string, unknown>,
    )
  ) {
    deepFreeze(nestedValue);
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!IDENTIFIER_PATTERN.test(value)) {
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
    Number.isNaN(Date.parse(value))
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
    normalized.length < 40 ||
    normalized.length > 1200
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review reason is invalid.",
    );
  }

  if (
    SENSITIVE_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review reason must not contain sensitive material.",
    );
  }
}

const canonicalPreparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
    canonicalPreparation,
  );

  if (
    canonicalPreparation.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARED" ||
    canonicalPreparation.planOnly !==
      true ||
    canonicalPreparation.candidatePlanCount !==
      8 ||
    canonicalPreparation.candidatePlans.length !==
      8 ||
    canonicalPreparation.ownerEvidencePlanReviewRequired !==
      true ||
    canonicalPreparation.ownerEvidencePlanReviewRecorded !==
      false ||
    canonicalPreparation.summary
      .ownerExecutionDecisionRecordedCount !==
      0 ||
    canonicalPreparation.summary
      .secondTaskExecutionAuthorizedCount !==
      0 ||
    canonicalPreparation.summary
      .secondTaskExecutedCount !==
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
      .secondTaskExecutionAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .productionDeploymentAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .paymentExecutionAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    canonicalPreparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW"
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan preparation is not eligible for owner review.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision,
): void {
  validateCanonicalPreparation();

  requireIdentifier(
    "Engineering first-workstream evidence-plan review decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering first-workstream evidence-plan review owner ID",
    record.ownerId,
  );

  requireTimestamp(
    "Engineering first-workstream evidence-plan review time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  if (
    !SHA256_PATTERN.test(
      record.decisionDigest,
    )
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review digest is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_ONLY";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_RECORDED" ||
    record.sourcePreparationId !==
      canonicalPreparation.preparationId ||
    record.sourcePreparationDigest !==
      canonicalPreparation.preparationDigest ||
    record.sourceWorkstreamPreparationReviewDecisionId !==
      canonicalPreparation.sourceWorkstreamPreparationReviewDecisionId ||
    record.sourceWorkstreamPreparationReviewDecisionDigest !==
      canonicalPreparation.sourceWorkstreamPreparationReviewDecisionDigest ||
    record.sourceLevelTwoOwnerReviewDecisionId !==
      canonicalPreparation.sourceLevelTwoOwnerReviewDecisionId ||
    record.sourceLevelTwoOwnerReviewDecisionDigest !==
      canonicalPreparation.sourceLevelTwoOwnerReviewDecisionDigest ||
    record.sourceRuntimeIssuanceId !==
      canonicalPreparation.sourceRuntimeIssuanceId ||
    record.sourceRuntimeIssuanceDigest !==
      canonicalPreparation.sourceRuntimeIssuanceDigest ||
    record.tenantId !==
      canonicalPreparation.tenantId ||
    record.ownerId !==
      canonicalPreparation.ownerId ||
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.evidencePlanAccepted !==
      approved ||
    record.secondTaskExecutionDecisionPreparationAuthorized !==
      approved ||
    record.secondTaskExecutionAuthorized !==
      false ||
    record.consequentialAuthorityGranted !==
      false ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalPreparation.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedPlan;

  if (
    reviewed.workstreamSequence !== 1 ||
    reviewed.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    reviewed.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" ||
    reviewed.planOnly !== true ||
    reviewed.candidatePlanCount !== 8 ||
    reviewed.firstTaskReviewedAndApprovedCount !==
      8 ||
    reviewed.activatedRuntimeCount !==
      8 ||
    reviewed.secondTaskEvidencePlanPreparedCount !==
      8 ||
    reviewed.ownerExecutionDecisionRequiredCount !==
      8 ||
    reviewed.ownerExecutionDecisionRecordedCount !==
      0 ||
    reviewed.secondTaskExecutionAuthorizedCount !==
      0 ||
    reviewed.secondTaskExecutedCount !==
      0 ||
    reviewed.concurrentExecutionAuthorizedCount !==
      0 ||
    reviewed.repositoryReadAuthorizedCount !==
      0 ||
    reviewed.repositoryWriteAuthorizedCount !==
      0 ||
    reviewed.syntheticSanitizedPlanCount !==
      8 ||
    reviewed.deterministicEvidenceRequiredCount !==
      8 ||
    reviewed.independentValidationRequiredCount !==
      8 ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW"
  ) {
    throw new Error(
      "Engineering reviewed first-workstream evidence plan is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.exactEightCandidatePlansReviewed !==
      true ||
    boundary.evidencePlanAccepted !==
      approved ||
    boundary.secondTaskExecutionDecisionPreparationAuthorized !==
      approved ||
    boundary.secondTaskExecutionAuthorized !==
      false ||
    boundary.consequentialAuthorityGranted !==
      false ||
    boundary.levelThreeAuthorityGranted !==
      false ||
    boundary.thirdTaskExecutionAuthorized !==
      false ||
    boundary.concurrentExecutionAuthorized !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !== false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseRequired !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision {
  validateCanonicalPreparation();

  if (
    input.sourcePreparation !==
      canonicalPreparation
  ) {
    validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
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
      "Engineering first-workstream owner review requires the canonical evidence-plan preparation.",
    );
  }

  requireIdentifier(
    "Engineering first-workstream evidence-plan review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Engineering first-workstream evidence-plan review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Engineering first-workstream evidence-plan review time",
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
      "Only the canonical NEXUS owner can issue the Engineering first-workstream evidence-plan review decision.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(
        canonicalPreparation.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan review cannot precede preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_ONLY";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_RECORDED" as const,
    sourcePreparationId:
      canonicalPreparation.preparationId,
    sourcePreparationDigest:
      canonicalPreparation.preparationDigest,
    sourceWorkstreamPreparationReviewDecisionId:
      canonicalPreparation.sourceWorkstreamPreparationReviewDecisionId,
    sourceWorkstreamPreparationReviewDecisionDigest:
      canonicalPreparation.sourceWorkstreamPreparationReviewDecisionDigest,
    sourceLevelTwoOwnerReviewDecisionId:
      canonicalPreparation.sourceLevelTwoOwnerReviewDecisionId,
    sourceLevelTwoOwnerReviewDecisionDigest:
      canonicalPreparation.sourceLevelTwoOwnerReviewDecisionDigest,
    sourceRuntimeIssuanceId:
      canonicalPreparation.sourceRuntimeIssuanceId,
    sourceRuntimeIssuanceDigest:
      canonicalPreparation.sourceRuntimeIssuanceDigest,
    tenantId:
      canonicalPreparation.tenantId,
    ownerId:
      input.ownerId,
    decision:
      input.decision,
    evidencePlanAccepted:
      approved,
    secondTaskExecutionDecisionPreparationAuthorized:
      approved,
    secondTaskExecutionAuthorized:
      false as const,
    consequentialAuthorityGranted:
      false as const,
    reviewedPlan: {
      workstreamSequence:
        canonicalPreparation.workstreamSequence,
      workstreamId:
        canonicalPreparation.workstreamId,
      evidenceClass:
        canonicalPreparation.evidenceClass,
      planOnly:
        canonicalPreparation.planOnly,
      candidatePlanCount:
        canonicalPreparation.candidatePlanCount,
      firstTaskReviewedAndApprovedCount:
        canonicalPreparation.summary
          .firstTaskReviewedAndApprovedCount,
      activatedRuntimeCount:
        canonicalPreparation.summary
          .activatedRuntimeCount,
      secondTaskEvidencePlanPreparedCount:
        canonicalPreparation.summary
          .secondTaskEvidencePlanPreparedCount,
      ownerExecutionDecisionRequiredCount:
        canonicalPreparation.summary
          .ownerExecutionDecisionRequiredCount,
      ownerExecutionDecisionRecordedCount:
        canonicalPreparation.summary
          .ownerExecutionDecisionRecordedCount,
      secondTaskExecutionAuthorizedCount:
        canonicalPreparation.summary
          .secondTaskExecutionAuthorizedCount,
      secondTaskExecutedCount:
        canonicalPreparation.summary
          .secondTaskExecutedCount,
      concurrentExecutionAuthorizedCount:
        canonicalPreparation.summary
          .concurrentExecutionAuthorizedCount,
      repositoryReadAuthorizedCount:
        canonicalPreparation.summary
          .repositoryReadAuthorizedCount,
      repositoryWriteAuthorizedCount:
        canonicalPreparation.summary
          .repositoryWriteAuthorizedCount,
      syntheticSanitizedPlanCount:
        canonicalPreparation.summary
          .syntheticSanitizedPlanCount,
      deterministicEvidenceRequiredCount:
        canonicalPreparation.summary
          .deterministicEvidenceRequiredCount,
      independentValidationRequiredCount:
        canonicalPreparation.summary
          .independentValidationRequiredCount,
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
      exactEightCandidatePlansReviewed:
        true as const,
      evidencePlanAccepted:
        approved,
      secondTaskExecutionDecisionPreparationAuthorized:
        approved,
      secondTaskExecutionAuthorized:
        false as const,
      consequentialAuthorityGranted:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      thirdTaskExecutionAuthorized:
        false as const,
      concurrentExecutionAuthorized:
        false as const,
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      branchCreationAuthorized:
        false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized: false as const,
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
      monitoringRequired: true as const,
      emergencyPauseRequired:
        true as const,
      rollbackEvidenceRequired:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    reason:
      input.reason.trim(),
    nextStep:
      approved
        ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW" as const,
    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision;

  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision(
    record,
  );

  return record;
}