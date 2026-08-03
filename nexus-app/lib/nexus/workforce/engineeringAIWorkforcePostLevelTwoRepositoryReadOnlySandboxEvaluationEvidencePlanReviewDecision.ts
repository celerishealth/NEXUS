import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-plan-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN",
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|secret|credential|bearer|private[_ -]?key)\b/i;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, normalize(record[key])]),
    );
  }

  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(normalize(value)), "utf8")
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }

  return value;
}

function requireIdentifier(label: string, value: string): void {
  if (value.trim() !== value || !IDENTIFIER_PATTERN.test(value)) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireTimestamp(label: string, value: string): void {
  if (
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireReason(value: string): string {
  const normalized = value.trim();

  if (
    normalized !== value ||
    normalized.length < 40 ||
    normalized.length > 1400 ||
    SENSITIVE_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan review reason is invalid.",
    );
  }

  return normalized;
}

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation(
    preparation,
  );

  if (
    preparation.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARED" ||
    preparation.workstreamSequence !== 3 ||
    preparation.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    preparation.planOnly !== true ||
    preparation.evidenceItemCount !== 8 ||
    preparation.evidenceItems.length !== 8 ||
    preparation.ownerEvidencePlanReviewRequired !== true ||
    preparation.ownerEvidencePlanReviewRecorded !== false ||
    preparation.summary.evidenceItemCount !== 8 ||
    preparation.summary.planPreparationAuthorizedCount !== 8 ||
    preparation.summary.evidenceExecutionAuthorizedCount !== 0 ||
    preparation.summary.repositoryEvaluationAuthorizedCount !== 0 ||
    preparation.summary.repositoryReadAuthorizedCount !== 0 ||
    preparation.summary.repositoryWriteAuthorizedCount !== 0 ||
    preparation.summary.filesystemMutationAuthorizedCount !== 0 ||
    preparation.summary.gitMutationAuthorizedCount !== 0 ||
    preparation.summary.commandExecutionAuthorizedCount !== 0 ||
    preparation.summary.packageExecutionAuthorizedCount !== 0 ||
    preparation.summary.networkAccessAuthorizedCount !== 0 ||
    preparation.authorityBoundary.evidencePlanningOnly !== true ||
    preparation.authorityBoundary.priorWorkstreamClosed !== true ||
    preparation.authorityBoundary
      .workstreamThreePlanPreparationAuthorized !== true ||
    preparation.authorityBoundary
      .workstreamThreePlanPreparationPerformed !== true ||
    preparation.authorityBoundary
      .workstreamThreeEvidenceExecutionAuthorized !== false ||
    preparation.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    preparation.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    preparation.authorityBoundary.repositoryReadAuthorized !== false ||
    preparation.authorityBoundary.repositoryWriteAuthorized !== false ||
    preparation.authorityBoundary.commandExecutionAuthorized !== false ||
    preparation.authorityBoundary.networkAccessAuthorized !== false ||
    preparation.authorityBoundary.productionDeploymentAuthorized !== false ||
    preparation.authorityBoundary.publicLaunchAuthorized !== false ||
    preparation.authorityBoundary.founderLiberationAchieved !== false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox evidence-plan preparation is invalid.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_RECORDED" as const,
    tenantId: preparation.tenantId,
    ownerId,
    sourcePreparationId: preparation.preparationId,
    sourcePreparationDigest: preparation.preparationDigest,
    sourcePriorWorkstreamClosureDecisionId:
      preparation.sourcePriorWorkstreamClosureDecisionId,
    sourcePriorWorkstreamClosureDecisionDigest:
      preparation.sourcePriorWorkstreamClosureDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    decision,
    reason,
    evidencePlanAccepted: approved,
    evidencePlanReviewRecorded: true as const,
    reviewedPlan: {
      evidenceClass: preparation.evidenceClass,
      planOnly: preparation.planOnly,
      evidenceItemCount: preparation.evidenceItemCount,
      controlIds: preparation.evidenceItems.map(
        (item) => item.controlId,
      ),
      syntheticSanitizedEvidenceItemCount:
        preparation.summary.syntheticSanitizedEvidenceItemCount,
      deterministicEvidenceRequiredCount:
        preparation.summary.deterministicEvidenceRequiredCount,
      independentValidationRequiredCount:
        preparation.summary.independentValidationRequiredCount,
      ownerReviewRequiredCount:
        preparation.summary.ownerReviewRequiredCount,
      monitoringRequiredCount:
        preparation.summary.monitoringRequiredCount,
      emergencyPauseRequiredCount:
        preparation.summary.emergencyPauseRequiredCount,
      rollbackEvidenceRequiredCount:
        preparation.summary.rollbackEvidenceRequiredCount,
      tenantBindingRequiredCount:
        preparation.summary.tenantBindingRequiredCount,
      ownerBindingRequiredCount:
        preparation.summary.ownerBindingRequiredCount,
      pathContainmentRequiredCount:
        preparation.summary.pathContainmentRequiredCount,
      secretExclusionRequiredCount:
        preparation.summary.secretExclusionRequiredCount,
      immutableAuditRequiredCount:
        preparation.summary.immutableAuditRequiredCount,
      planPreparationAuthorizedCount:
        preparation.summary.planPreparationAuthorizedCount,
      evidenceExecutionAuthorizedCount:
        preparation.summary.evidenceExecutionAuthorizedCount,
      repositoryEvaluationAuthorizedCount:
        preparation.summary.repositoryEvaluationAuthorizedCount,
      repositoryReadAuthorizedCount:
        preparation.summary.repositoryReadAuthorizedCount,
      repositoryWriteAuthorizedCount:
        preparation.summary.repositoryWriteAuthorizedCount,
      filesystemMutationAuthorizedCount:
        preparation.summary.filesystemMutationAuthorizedCount,
      gitMutationAuthorizedCount:
        preparation.summary.gitMutationAuthorizedCount,
      commandExecutionAuthorizedCount:
        preparation.summary.commandExecutionAuthorizedCount,
      packageExecutionAuthorizedCount:
        preparation.summary.packageExecutionAuthorizedCount,
      networkAccessAuthorizedCount:
        preparation.summary.networkAccessAuthorizedCount,
      productionDeploymentAuthorizedCount:
        preparation.summary.productionDeploymentAuthorizedCount,
      paymentExecutionAuthorizedCount:
        preparation.summary.paymentExecutionAuthorizedCount,
      publicLaunchAuthorizedCount:
        preparation.summary.publicLaunchAuthorizedCount,
    },
    authorityBoundary: {
      canonicalPlanPreparationBound: true as const,
      sourcePreparationIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      planReviewRecorded: true as const,
      approvalBypassAuthorized: false as const,
      evidencePlanAccepted: approved,
      evidenceExecutionDecisionPreparationAuthorized: approved,
      evidenceExecutionDecisionPreparationPerformed: false as const,
      evidenceExecutionAuthorized: false as const,
      repositoryReadOnlySandboxEvaluationAuthorized: false as const,
      repositoryReadOnlySandboxExecutionAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      branchCreationAuthorized: false as const,
      pullRequestPreparationAuthorized: false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized: false as const,
      realCustomerDataAccessAuthorized: false as const,
      realCustomerContactAuthorized: false as const,
      externalDeliveryAuthorized: false as const,
      liveProviderExecutionAuthorized: false as const,
      productionDatabaseAuthorized: false as const,
      productionMutationAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      financialCommitmentAuthorized: false as const,
      legalCommitmentAuthorized: false as const,
      autonomousDecisionAuthorized: false as const,
      concurrentEngineeringWorkAuthorized: false as const,
      aggregateConcurrentEngineeringWorkLimit: 0 as const,
      levelThreeEvaluationAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      productionReadinessAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineExecution: false as const,
      monitoringRequired: true as const,
      emergencyPauseRequired: true as const,
      rollbackEvidenceRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: (
      approved
        ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_AWAITING_OWNER_REVIEW"
    ) as
      | "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision,
): void {
  validateCanonicalPreparation();

  requireIdentifier(
    "Repository read-only sandbox evidence-plan review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox evidence-plan review decision time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_RECORDED" ||
    record.tenantId !== preparation.tenantId ||
    record.ownerId !== preparation.ownerId ||
    record.sourcePreparationId !== preparation.preparationId ||
    record.sourcePreparationDigest !== preparation.preparationDigest ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      preparation.sourcePriorWorkstreamClosureDecisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      preparation.sourcePriorWorkstreamClosureDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.evidencePlanAccepted !== approved ||
    record.evidencePlanReviewRecorded !== true ||
    Date.parse(record.decidedAt) < Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan review identity is invalid.",
    );
  }

  const reviewed = record.reviewedPlan;

  if (
    reviewed.evidenceClass !==
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" ||
    reviewed.planOnly !== true ||
    reviewed.evidenceItemCount !== 8 ||
    reviewed.controlIds.length !== 8 ||
    new Set(reviewed.controlIds).size !== 8 ||
    reviewed.syntheticSanitizedEvidenceItemCount !== 8 ||
    reviewed.deterministicEvidenceRequiredCount !== 8 ||
    reviewed.independentValidationRequiredCount !== 8 ||
    reviewed.ownerReviewRequiredCount !== 8 ||
    reviewed.monitoringRequiredCount !== 8 ||
    reviewed.emergencyPauseRequiredCount !== 8 ||
    reviewed.rollbackEvidenceRequiredCount !== 8 ||
    reviewed.tenantBindingRequiredCount !== 8 ||
    reviewed.ownerBindingRequiredCount !== 8 ||
    reviewed.pathContainmentRequiredCount !== 8 ||
    reviewed.secretExclusionRequiredCount !== 8 ||
    reviewed.immutableAuditRequiredCount !== 8 ||
    reviewed.planPreparationAuthorizedCount !== 8 ||
    reviewed.evidenceExecutionAuthorizedCount !== 0 ||
    reviewed.repositoryEvaluationAuthorizedCount !== 0 ||
    reviewed.repositoryReadAuthorizedCount !== 0 ||
    reviewed.repositoryWriteAuthorizedCount !== 0 ||
    reviewed.filesystemMutationAuthorizedCount !== 0 ||
    reviewed.gitMutationAuthorizedCount !== 0 ||
    reviewed.commandExecutionAuthorizedCount !== 0 ||
    reviewed.packageExecutionAuthorizedCount !== 0 ||
    reviewed.networkAccessAuthorizedCount !== 0 ||
    reviewed.productionDeploymentAuthorizedCount !== 0 ||
    reviewed.paymentExecutionAuthorizedCount !== 0 ||
    reviewed.publicLaunchAuthorizedCount !== 0
  ) {
    throw new Error(
      "Repository read-only sandbox reviewed evidence plan is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalPlanPreparationBound,
    boundary.sourcePreparationIntegrityVerified,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.planReviewRecorded,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAuthorized,
    boundary.evidenceExecutionDecisionPreparationPerformed,
    boundary.evidenceExecutionAuthorized,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
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
    boundary.concurrentEngineeringWorkAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  const expectedNextStep =
    approved
      ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_AWAITING_OWNER_REVIEW";

  if (
    boundary.evidencePlanAccepted !== approved ||
    boundary.evidenceExecutionDecisionPreparationAuthorized !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedPlan) ||
    !Object.isFrozen(record.reviewedPlan.controlIds) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision {
  if (input.sourcePreparation !== preparation) {
    throw new Error(
      "Only the canonical repository read-only sandbox evidence-plan preparation can receive owner review.",
    );
  }

  validateCanonicalPreparation();

  requireIdentifier(
    "Repository read-only sandbox evidence-plan review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox evidence-plan review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== preparation.ownerId) {
    throw new Error(
      "Only the preparation-bound NEXUS owner can review this evidence plan.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-plan review decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(preparation.preparedAt)) {
    throw new Error(
      "Repository read-only sandbox evidence-plan review cannot precede preparation.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision(
    record,
  );

  return record;
}