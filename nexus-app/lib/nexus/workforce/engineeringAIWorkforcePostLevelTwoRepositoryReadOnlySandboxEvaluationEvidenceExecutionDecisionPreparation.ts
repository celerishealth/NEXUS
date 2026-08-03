import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-execution-decision-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionOption =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS)[number];

export interface EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparationItem {
  readonly sequence: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  readonly preparationState:
    "ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_PREPARED";
  readonly sourceEvidenceItemDigest: string;
  readonly controlId: string;
  readonly objective: string;
  readonly expectedEvidence: string;
  readonly availableDecisions:
    typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS;
  readonly recommendedDecision:
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION";
  readonly recommendationReason: string;
  readonly executionMode: "SYNTHETIC_SANDBOX_EVIDENCE_ONLY";
  readonly evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY";
  readonly maximumEvidenceExecutionCount: 1;
  readonly concurrentExecutionLimit: 0;
  readonly deterministicEvidenceRequired: true;
  readonly independentValidationRequired: true;
  readonly ownerExecutionDecisionRequired: true;
  readonly ownerExecutionDecisionRecorded: false;
  readonly ownerReviewAfterExecutionRequired: true;
  readonly monitoringRequired: true;
  readonly emergencyPauseRequired: true;
  readonly rollbackEvidenceRequired: true;
  readonly tenantBindingRequired: true;
  readonly ownerBindingRequired: true;
  readonly pathContainmentRequired: true;
  readonly secretExclusionRequired: true;
  readonly immutableAuditRequired: true;
  readonly evidenceExecutionAuthorized: false;
  readonly evidenceExecutionPerformed: false;
  readonly repositoryEvaluationAuthorized: false;
  readonly repositoryReadAuthorized: false;
  readonly repositoryWriteAuthorized: false;
  readonly filesystemMutationAuthorized: false;
  readonly gitMutationAuthorized: false;
  readonly commandExecutionAuthorized: false;
  readonly packageExecutionAuthorized: false;
  readonly networkAccessAuthorized: false;
  readonly branchCreationAuthorized: false;
  readonly pullRequestPreparationAuthorized: false;
  readonly mergeAuthorized: false;
  readonly secretsAccessAuthorized: false;
  readonly realCustomerDataAccessAuthorized: false;
  readonly realCustomerContactAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly liveProviderExecutionAuthorized: false;
  readonly productionDatabaseAuthorized: false;
  readonly productionMutationAuthorized: false;
  readonly productionDeploymentAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly publicLaunchAuthorized: false;
  readonly decisionPreparationDigest: string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparationInput {
  readonly preparationId: string;
  readonly sourceEvidencePlanReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION;
  readonly sourceEvidencePlanPreparation:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation;
  readonly preparedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

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

const evidencePlan =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

const ownerPlanReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation(
    evidencePlan,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision(
    ownerPlanReview,
  );

  if (
    ownerPlanReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN" ||
    ownerPlanReview.evidencePlanAccepted !== true ||
    ownerPlanReview.evidencePlanReviewRecorded !== true ||
    ownerPlanReview.workstreamSequence !== 3 ||
    ownerPlanReview.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    ownerPlanReview.sourcePreparationId !== evidencePlan.preparationId ||
    ownerPlanReview.sourcePreparationDigest !== evidencePlan.preparationDigest ||
    ownerPlanReview.reviewedPlan.evidenceItemCount !== 8 ||
    ownerPlanReview.reviewedPlan.controlIds.length !== 8 ||
    ownerPlanReview.reviewedPlan.evidenceExecutionAuthorizedCount !== 0 ||
    ownerPlanReview.reviewedPlan.repositoryEvaluationAuthorizedCount !== 0 ||
    ownerPlanReview.reviewedPlan.repositoryReadAuthorizedCount !== 0 ||
    ownerPlanReview.reviewedPlan.repositoryWriteAuthorizedCount !== 0 ||
    ownerPlanReview.authorityBoundary.evidencePlanAccepted !== true ||
    ownerPlanReview.authorityBoundary
      .evidenceExecutionDecisionPreparationAuthorized !== true ||
    ownerPlanReview.authorityBoundary
      .evidenceExecutionDecisionPreparationPerformed !== false ||
    ownerPlanReview.authorityBoundary.evidenceExecutionAuthorized !== false ||
    ownerPlanReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    ownerPlanReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    ownerPlanReview.authorityBoundary.repositoryReadAuthorized !== false ||
    ownerPlanReview.authorityBoundary.repositoryWriteAuthorized !== false ||
    ownerPlanReview.authorityBoundary.filesystemMutationAuthorized !== false ||
    ownerPlanReview.authorityBoundary.gitMutationAuthorized !== false ||
    ownerPlanReview.authorityBoundary.commandExecutionAuthorized !== false ||
    ownerPlanReview.authorityBoundary.packageExecutionAuthorized !== false ||
    ownerPlanReview.authorityBoundary.networkAccessAuthorized !== false ||
    ownerPlanReview.authorityBoundary.productionDeploymentAuthorized !== false ||
    ownerPlanReview.authorityBoundary.publicLaunchAuthorized !== false ||
    ownerPlanReview.authorityBoundary.founderLiberationAchieved !== false ||
    ownerPlanReview.authorityBoundary.ownerFinalAuthorityPreserved !== true ||
    ownerPlanReview.nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox execution-decision preparation prerequisites are invalid.",
    );
  }

  if (
    evidencePlan.evidenceItemCount !== 8 ||
    evidencePlan.evidenceItems.length !== 8 ||
    evidencePlan.planOnly !== true ||
    evidencePlan.summary.evidenceExecutionAuthorizedCount !== 0 ||
    evidencePlan.summary.repositoryEvaluationAuthorizedCount !== 0 ||
    evidencePlan.summary.repositoryReadAuthorizedCount !== 0 ||
    evidencePlan.summary.repositoryWriteAuthorizedCount !== 0 ||
    evidencePlan.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    evidencePlan.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    evidencePlan.authorityBoundary.repositoryReadAuthorized !== false ||
    evidencePlan.authorityBoundary.repositoryWriteAuthorized !== false
  ) {
    throw new Error(
      "Canonical repository read-only sandbox evidence plan is invalid.",
    );
  }
}

function createDecisionPreparations(): readonly EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparationItem[] {
  return evidencePlan.evidenceItems.map((source, index) => {
    const itemCore = {
      sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      preparationState:
        "ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_PREPARED" as const,
      sourceEvidenceItemDigest: source.evidenceItemDigest,
      controlId: source.controlId,
      objective: source.objective,
      expectedEvidence: source.expectedEvidence,
      availableDecisions:
        ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS,
      recommendedDecision:
        "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION" as const,
      recommendationReason:
        `Prepare an owner decision for bounded ${source.controlId} synthetic safety-evidence execution only, with deterministic evidence, path containment, tenant and owner binding, secret exclusion, immutable audit, monitoring, emergency pause, immediate owner review, and no actual repository access authority.`,
      executionMode: "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" as const,
      evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY" as const,
      maximumEvidenceExecutionCount: 1 as const,
      concurrentExecutionLimit: 0 as const,
      deterministicEvidenceRequired: true as const,
      independentValidationRequired: true as const,
      ownerExecutionDecisionRequired: true as const,
      ownerExecutionDecisionRecorded: false as const,
      ownerReviewAfterExecutionRequired: true as const,
      monitoringRequired: true as const,
      emergencyPauseRequired: true as const,
      rollbackEvidenceRequired: true as const,
      tenantBindingRequired: true as const,
      ownerBindingRequired: true as const,
      pathContainmentRequired: true as const,
      secretExclusionRequired: true as const,
      immutableAuditRequired: true as const,
      evidenceExecutionAuthorized: false as const,
      evidenceExecutionPerformed: false as const,
      repositoryEvaluationAuthorized: false as const,
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
      publicLaunchAuthorized: false as const,
    };

    return deepFreeze({
      ...itemCore,
      decisionPreparationDigest: sha256(itemCore),
    });
  });
}

function buildPreparation(preparationId: string, preparedAt: string) {
  const decisionPreparations = deepFreeze(createDecisionPreparations());

  const summary = deepFreeze({
    evidenceDecisionPreparationCount: 8 as const,
    ownerExecutionDecisionRequiredCount: 8 as const,
    ownerExecutionDecisionRecordedCount: 0 as const,
    maximumEvidenceExecutionCount: 1 as const,
    aggregateConcurrentExecutionLimit: 0 as const,
    evidenceExecutionAuthorizedCount: 0 as const,
    evidenceExecutionPerformedCount: 0 as const,
    repositoryEvaluationAuthorizedCount: 0 as const,
    repositoryReadAuthorizedCount: 0 as const,
    repositoryWriteAuthorizedCount: 0 as const,
    filesystemMutationAuthorizedCount: 0 as const,
    gitMutationAuthorizedCount: 0 as const,
    commandExecutionAuthorizedCount: 0 as const,
    packageExecutionAuthorizedCount: 0 as const,
    networkAccessAuthorizedCount: 0 as const,
    monitoringRequiredCount: 8 as const,
    emergencyPauseRequiredCount: 8 as const,
    rollbackEvidenceRequiredCount: 8 as const,
    tenantBindingRequiredCount: 8 as const,
    ownerBindingRequiredCount: 8 as const,
    pathContainmentRequiredCount: 8 as const,
    secretExclusionRequiredCount: 8 as const,
    immutableAuditRequiredCount: 8 as const,
    productionDeploymentAuthorizedCount: 0 as const,
    paymentExecutionAuthorizedCount: 0 as const,
    publicLaunchAuthorizedCount: 0 as const,
  });

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION,
    preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" as const,
    sourceEvidencePlanReviewDecisionId: ownerPlanReview.decisionId,
    sourceEvidencePlanReviewDecisionDigest: ownerPlanReview.decisionDigest,
    sourceEvidencePlanPreparationId: evidencePlan.preparationId,
    sourceEvidencePlanPreparationDigest: evidencePlan.preparationDigest,
    sourcePriorWorkstreamClosureDecisionId:
      evidencePlan.sourcePriorWorkstreamClosureDecisionId,
    sourcePriorWorkstreamClosureDecisionDigest:
      evidencePlan.sourcePriorWorkstreamClosureDecisionDigest,
    tenantId: ownerPlanReview.tenantId,
    ownerId: ownerPlanReview.ownerId,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceClass:
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" as const,
    decisionPreparationOnly: true as const,
    evidenceDecisionPreparationCount: 8 as const,
    evidenceDecisionPreparations: decisionPreparations,
    summary,
    ownerExecutionDecisionReviewRequired: true as const,
    ownerExecutionDecisionReviewRecorded: false as const,
    authorityBoundary: {
      decisionPreparationOnly: true as const,
      canonicalOwnerPlanReviewBound: true as const,
      canonicalEvidencePlanBound: true as const,
      sourcePlanIntegrityVerified: true as const,
      exactEightEvidenceDecisionPreparationsRequired: true as const,
      workstreamThreeEvidenceExecutionDecisionPreparationAuthorized:
        true as const,
      workstreamThreeEvidenceExecutionDecisionPreparationPerformed:
        true as const,
      workstreamThreeEvidenceExecutionAuthorized: false as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      aggregateConcurrentExecutionLimit: 0 as const,
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
      levelThreeEvaluationAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      productionReadinessAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineExecution: false as const,
      monitoringRequired: true as const,
      emergencyPauseRequired: true as const,
      rollbackEvidenceRequired: true as const,
      ownerReviewRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_REVIEW" as const,
    preparedAt,
  };

  return deepFreeze({
    ...preparationCore,
    preparationDigest: sha256(preparationCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation =
  ReturnType<typeof buildPreparation>;

function validateDecisionPreparationItem(
  item:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparationItem,
  index: number,
): void {
  const source = evidencePlan.evidenceItems[index];

  if (!source) {
    throw new Error(
      "Repository read-only sandbox source evidence item is missing.",
    );
  }

  const {
    decisionPreparationDigest,
    ...itemCore
  } = item;

  if (
    !SHA256_PATTERN.test(decisionPreparationDigest) ||
    sha256(itemCore) !== decisionPreparationDigest ||
    item.sequence !== index + 1 ||
    item.preparationState !==
      "ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_PREPARED" ||
    item.sourceEvidenceItemDigest !== source.evidenceItemDigest ||
    item.controlId !== source.controlId ||
    item.objective !== source.objective ||
    item.expectedEvidence !== source.expectedEvidence ||
    item.availableDecisions !==
      ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS ||
    item.recommendedDecision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION" ||
    item.recommendationReason.length < 100 ||
    item.executionMode !== "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    item.evidenceToolMode !== "READ_ONLY_EVIDENCE_ONLY" ||
    item.maximumEvidenceExecutionCount !== 1 ||
    item.concurrentExecutionLimit !== 0 ||
    item.deterministicEvidenceRequired !== true ||
    item.independentValidationRequired !== true ||
    item.ownerExecutionDecisionRequired !== true ||
    item.ownerExecutionDecisionRecorded !== false ||
    item.ownerReviewAfterExecutionRequired !== true ||
    item.monitoringRequired !== true ||
    item.emergencyPauseRequired !== true ||
    item.rollbackEvidenceRequired !== true ||
    item.tenantBindingRequired !== true ||
    item.ownerBindingRequired !== true ||
    item.pathContainmentRequired !== true ||
    item.secretExclusionRequired !== true ||
    item.immutableAuditRequired !== true ||
    item.evidenceExecutionAuthorized !== false ||
    item.evidenceExecutionPerformed !== false ||
    item.repositoryEvaluationAuthorized !== false ||
    item.repositoryReadAuthorized !== false ||
    item.repositoryWriteAuthorized !== false ||
    item.filesystemMutationAuthorized !== false ||
    item.gitMutationAuthorized !== false ||
    item.commandExecutionAuthorized !== false ||
    item.packageExecutionAuthorized !== false ||
    item.networkAccessAuthorized !== false ||
    item.branchCreationAuthorized !== false ||
    item.pullRequestPreparationAuthorized !== false ||
    item.mergeAuthorized !== false ||
    item.secretsAccessAuthorized !== false ||
    item.realCustomerDataAccessAuthorized !== false ||
    item.realCustomerContactAuthorized !== false ||
    item.externalDeliveryAuthorized !== false ||
    item.liveProviderExecutionAuthorized !== false ||
    item.productionDatabaseAuthorized !== false ||
    item.productionMutationAuthorized !== false ||
    item.productionDeploymentAuthorized !== false ||
    item.paymentExecutionAuthorized !== false ||
    item.publicLaunchAuthorized !== false ||
    !Object.isFrozen(item)
  ) {
    throw new Error(
      `Repository read-only sandbox execution-decision preparation item ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox execution-decision preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Repository read-only sandbox execution-decision preparation time",
    record.preparedAt,
  );

  const {
    preparationDigest,
    ...preparationCore
  } = record;

  if (
    !SHA256_PATTERN.test(preparationDigest) ||
    sha256(preparationCore) !== preparationDigest
  ) {
    throw new Error(
      "Repository read-only sandbox execution-decision preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" ||
    record.sourceEvidencePlanReviewDecisionId !== ownerPlanReview.decisionId ||
    record.sourceEvidencePlanReviewDecisionDigest !==
      ownerPlanReview.decisionDigest ||
    record.sourceEvidencePlanPreparationId !== evidencePlan.preparationId ||
    record.sourceEvidencePlanPreparationDigest !==
      evidencePlan.preparationDigest ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      evidencePlan.sourcePriorWorkstreamClosureDecisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      evidencePlan.sourcePriorWorkstreamClosureDecisionDigest ||
    record.tenantId !== ownerPlanReview.tenantId ||
    record.ownerId !== ownerPlanReview.ownerId ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceClass !==
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" ||
    record.decisionPreparationOnly !== true ||
    record.evidenceDecisionPreparationCount !== 8 ||
    record.evidenceDecisionPreparations.length !== 8 ||
    record.ownerExecutionDecisionReviewRequired !== true ||
    record.ownerExecutionDecisionReviewRecorded !== false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_REVIEW" ||
    Date.parse(record.preparedAt) < Date.parse(ownerPlanReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox execution-decision preparation identity is invalid.",
    );
  }

  record.evidenceDecisionPreparations.forEach(
    validateDecisionPreparationItem,
  );

  if (
    new Set(
      record.evidenceDecisionPreparations.map(
        (item) => item.controlId,
      ),
    ).size !== 8
  ) {
    throw new Error(
      "Repository read-only sandbox execution-decision controls must remain unique.",
    );
  }

  const summary = record.summary;

  if (
    summary.evidenceDecisionPreparationCount !== 8 ||
    summary.ownerExecutionDecisionRequiredCount !== 8 ||
    summary.ownerExecutionDecisionRecordedCount !== 0 ||
    summary.maximumEvidenceExecutionCount !== 1 ||
    summary.aggregateConcurrentExecutionLimit !== 0 ||
    summary.evidenceExecutionAuthorizedCount !== 0 ||
    summary.evidenceExecutionPerformedCount !== 0 ||
    summary.repositoryEvaluationAuthorizedCount !== 0 ||
    summary.repositoryReadAuthorizedCount !== 0 ||
    summary.repositoryWriteAuthorizedCount !== 0 ||
    summary.filesystemMutationAuthorizedCount !== 0 ||
    summary.gitMutationAuthorizedCount !== 0 ||
    summary.commandExecutionAuthorizedCount !== 0 ||
    summary.packageExecutionAuthorizedCount !== 0 ||
    summary.networkAccessAuthorizedCount !== 0 ||
    summary.monitoringRequiredCount !== 8 ||
    summary.emergencyPauseRequiredCount !== 8 ||
    summary.rollbackEvidenceRequiredCount !== 8 ||
    summary.tenantBindingRequiredCount !== 8 ||
    summary.ownerBindingRequiredCount !== 8 ||
    summary.pathContainmentRequiredCount !== 8 ||
    summary.secretExclusionRequiredCount !== 8 ||
    summary.immutableAuditRequiredCount !== 8 ||
    summary.productionDeploymentAuthorizedCount !== 0 ||
    summary.paymentExecutionAuthorizedCount !== 0 ||
    summary.publicLaunchAuthorizedCount !== 0
  ) {
    throw new Error(
      "Repository read-only sandbox execution-decision preparation summary is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.decisionPreparationOnly,
    boundary.canonicalOwnerPlanReviewBound,
    boundary.canonicalEvidencePlanBound,
    boundary.sourcePlanIntegrityVerified,
    boundary.exactEightEvidenceDecisionPreparationsRequired,
    boundary.workstreamThreeEvidenceExecutionDecisionPreparationAuthorized,
    boundary.workstreamThreeEvidenceExecutionDecisionPreparationPerformed,
    boundary.oneAtATimeEvidenceExecutionRequired,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerReviewRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.workstreamThreeEvidenceExecutionAuthorized,
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

  if (
    boundary.aggregateConcurrentExecutionLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidenceDecisionPreparations) ||
    !Object.isFrozen(record.summary) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox execution-decision preparation authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparationInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation {
  if (
    input.sourceEvidencePlanReviewDecision !== ownerPlanReview ||
    input.sourceEvidencePlanPreparation !== evidencePlan
  ) {
    throw new Error(
      "Only the canonical approved repository read-only sandbox evidence plan can prepare execution decisions.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox execution-decision preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Repository read-only sandbox execution-decision preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(ownerPlanReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox execution-decision preparation cannot precede owner plan review.",
    );
  }

  const record = buildPreparation(
    input.preparationId,
    input.preparedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-execution-decision-preparation-001",
    sourceEvidencePlanReviewDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION,
    sourceEvidencePlanPreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
    preparedAt: "2026-08-02T18:50:00.000Z",
  });