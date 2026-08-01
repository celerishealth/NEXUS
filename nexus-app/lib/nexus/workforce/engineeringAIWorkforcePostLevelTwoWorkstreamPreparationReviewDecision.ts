import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
  type EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation,
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation,
} from "./engineeringAIWorkforcePostLevelTwoWorkstreamPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-workstream-preparation-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_EVIDENCE_ONLY",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISION_RECORDED";
  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest:
    string;
  readonly sourceApprovalDecisionId:
    string;
  readonly sourceApprovalDecisionDigest:
    string;
  readonly sourceScopeId: string;
  readonly sourceScopeDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecisionType;
  readonly preparationEvidenceAccepted:
    boolean;
  readonly firstWorkstreamEvidencePlanPreparationAuthorized:
    boolean;
  readonly consequentialAuthorityGranted:
    false;
  readonly reviewedPreparation: Readonly<{
    preparationOnly: true;
    preparedWorkstreamCount: 4;
    totalMaximumPlannedEvidenceItemCount:
      32;
    syntheticSanitizedOnlyCount: 4;
    ownerReviewRequiredCount: 4;
    independentValidationRequiredCount:
      4;
    taskExecutionAuthorizedCount: 0;
    concurrentExecutionAuthorizedCount:
      0;
    repositoryReadAuthorizedCount: 0;
    repositoryWriteAuthorizedCount: 0;
    sourceNextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW";
  }>;
  readonly authorityBoundary: Readonly<{
    ownerReviewDecisionRecorded: true;
    ownerIdentityBound: true;
    sourcePreparationIntegrityVerified:
      true;
    preparationEvidenceAccepted:
      boolean;
    firstWorkstreamEvidencePlanPreparationAuthorized:
      boolean;
    workstreamExecutionAuthorized:
      false;
    consequentialAuthorityGranted:
      false;
    levelThreeAuthorityGranted: false;
    secondTaskExecutionAuthorized:
      false;
    thirdTaskExecutionAuthorized:
      false;
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
    | "AWAIT_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION"
    | "RETAIN_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW";
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
      "Engineering post-Level-2 workstream-preparation review reason is invalid.",
    );
  }

  if (
    SENSITIVE_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream-preparation review reason must not contain sensitive material.",
    );
  }
}

const canonicalPreparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
    canonicalPreparation,
  );

  if (
    canonicalPreparation.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_WORKSTREAMS_PREPARED" ||
    canonicalPreparation.boundedPreparationAuthorized !==
      true ||
    canonicalPreparation.consequentialAuthorityGranted !==
      false ||
    canonicalPreparation.workstreamCount !==
      4 ||
    canonicalPreparation.preparedWorkstreams.length !==
      4 ||
    canonicalPreparation.ownerPreparationReviewRequired !==
      true ||
    canonicalPreparation.ownerPreparationReviewRecorded !==
      false ||
    canonicalPreparation.evidencePlanSummary
      .taskExecutionAuthorizedCount !==
      0 ||
    canonicalPreparation.evidencePlanSummary
      .concurrentExecutionAuthorizedCount !==
      0 ||
    canonicalPreparation.evidencePlanSummary
      .repositoryReadAuthorizedCount !==
      0 ||
    canonicalPreparation.evidencePlanSummary
      .repositoryWriteAuthorizedCount !==
      0 ||
    canonicalPreparation.authorityBoundary
      .workstreamExecutionAuthorized !==
      false ||
    canonicalPreparation.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW"
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream preparation is not eligible for owner review.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision,
): void {
  validateCanonicalPreparation();

  requireIdentifier(
    "Engineering post-Level-2 workstream-preparation review decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering post-Level-2 workstream-preparation review owner ID",
    record.ownerId,
  );

  requireTimestamp(
    "Engineering post-Level-2 workstream-preparation review time",
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
      "Engineering post-Level-2 workstream-preparation review digest is invalid.",
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
      "Engineering post-Level-2 workstream-preparation review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_EVIDENCE_ONLY";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISION_RECORDED" ||
    record.sourcePreparationId !==
      canonicalPreparation.preparationId ||
    record.sourcePreparationDigest !==
      canonicalPreparation.preparationDigest ||
    record.sourceApprovalDecisionId !==
      canonicalPreparation.sourceApprovalDecisionId ||
    record.sourceApprovalDecisionDigest !==
      canonicalPreparation.sourceApprovalDecisionDigest ||
    record.sourceScopeId !==
      canonicalPreparation.sourceScopeId ||
    record.sourceScopeDigest !==
      canonicalPreparation.sourceScopeDigest ||
    record.tenantId !==
      canonicalPreparation.tenantId ||
    record.ownerId !==
      canonicalPreparation.ownerId ||
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.preparationEvidenceAccepted !==
      approved ||
    record.firstWorkstreamEvidencePlanPreparationAuthorized !==
      approved ||
    record.consequentialAuthorityGranted !==
      false ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalPreparation.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream-preparation review identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedPreparation;

  if (
    reviewed.preparationOnly !==
      true ||
    reviewed.preparedWorkstreamCount !==
      4 ||
    reviewed.totalMaximumPlannedEvidenceItemCount !==
      32 ||
    reviewed.syntheticSanitizedOnlyCount !==
      4 ||
    reviewed.ownerReviewRequiredCount !==
      4 ||
    reviewed.independentValidationRequiredCount !==
      4 ||
    reviewed.taskExecutionAuthorizedCount !==
      0 ||
    reviewed.concurrentExecutionAuthorizedCount !==
      0 ||
    reviewed.repositoryReadAuthorizedCount !==
      0 ||
    reviewed.repositoryWriteAuthorizedCount !==
      0 ||
    reviewed.sourceNextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW"
  ) {
    throw new Error(
      "Engineering post-Level-2 reviewed workstream preparation is invalid.",
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
    boundary.preparationEvidenceAccepted !==
      approved ||
    boundary.firstWorkstreamEvidencePlanPreparationAuthorized !==
      approved ||
    boundary.workstreamExecutionAuthorized !==
      false ||
    boundary.consequentialAuthorityGranted !==
      false ||
    boundary.levelThreeAuthorityGranted !==
      false ||
    boundary.secondTaskExecutionAuthorized !==
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
      "Engineering post-Level-2 workstream-preparation review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream-preparation review next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision {
  validateCanonicalPreparation();

  if (
    input.sourcePreparation !==
      canonicalPreparation
  ) {
    validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
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
      "Engineering post-Level-2 owner review requires the canonical workstream preparation.",
    );
  }

  requireIdentifier(
    "Engineering post-Level-2 workstream-preparation review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Engineering post-Level-2 workstream-preparation review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Engineering post-Level-2 workstream-preparation review time",
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
      "Only the canonical NEXUS owner can issue the Engineering post-Level-2 workstream-preparation review decision.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream-preparation review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(
        canonicalPreparation.preparedAt,
      )
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream-preparation review cannot precede preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_EVIDENCE_ONLY";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_DECISION_RECORDED" as const,
    sourcePreparationId:
      canonicalPreparation.preparationId,
    sourcePreparationDigest:
      canonicalPreparation.preparationDigest,
    sourceApprovalDecisionId:
      canonicalPreparation.sourceApprovalDecisionId,
    sourceApprovalDecisionDigest:
      canonicalPreparation.sourceApprovalDecisionDigest,
    sourceScopeId:
      canonicalPreparation.sourceScopeId,
    sourceScopeDigest:
      canonicalPreparation.sourceScopeDigest,
    tenantId:
      canonicalPreparation.tenantId,
    ownerId:
      input.ownerId,
    decision:
      input.decision,
    preparationEvidenceAccepted:
      approved,
    firstWorkstreamEvidencePlanPreparationAuthorized:
      approved,
    consequentialAuthorityGranted:
      false as const,
    reviewedPreparation: {
      preparationOnly:
        true as const,
      preparedWorkstreamCount:
        canonicalPreparation.evidencePlanSummary
          .preparedWorkstreamCount,
      totalMaximumPlannedEvidenceItemCount:
        canonicalPreparation.evidencePlanSummary
          .totalMaximumPlannedEvidenceItemCount,
      syntheticSanitizedOnlyCount:
        canonicalPreparation.evidencePlanSummary
          .syntheticSanitizedOnlyCount,
      ownerReviewRequiredCount:
        canonicalPreparation.evidencePlanSummary
          .ownerReviewRequiredCount,
      independentValidationRequiredCount:
        canonicalPreparation.evidencePlanSummary
          .independentValidationRequiredCount,
      taskExecutionAuthorizedCount:
        canonicalPreparation.evidencePlanSummary
          .taskExecutionAuthorizedCount,
      concurrentExecutionAuthorizedCount:
        canonicalPreparation.evidencePlanSummary
          .concurrentExecutionAuthorizedCount,
      repositoryReadAuthorizedCount:
        canonicalPreparation.evidencePlanSummary
          .repositoryReadAuthorizedCount,
      repositoryWriteAuthorizedCount:
        canonicalPreparation.evidencePlanSummary
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
      preparationEvidenceAccepted:
        approved,
      firstWorkstreamEvidencePlanPreparationAuthorized:
        approved,
      workstreamExecutionAuthorized:
        false as const,
      consequentialAuthorityGranted:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      secondTaskExecutionAuthorized:
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
    reason:
      input.reason.trim(),
    nextStep:
      approved
        ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW" as const,
    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision;

  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
    record,
  );

  return record;
}