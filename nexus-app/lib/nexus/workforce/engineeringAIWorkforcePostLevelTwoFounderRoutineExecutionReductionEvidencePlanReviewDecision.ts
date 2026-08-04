import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-plan-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidencePlanReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidencePlanReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|credential|bearer|private[_ -]?key)\b/i;

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

const EXPECTED_CONTROL_IDS = [
  "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE",
  "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY",
  "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD",
  "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS",
  "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY",
  "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT",
  "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY",
  "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE",
] as const;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
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
        .map((key) => [
          key,
          normalize(record[key]),
        ]),
    );
  }

  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(
      JSON.stringify(normalize(value)),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.values(
      value as Record<string, unknown>,
    ).forEach(deepFreeze);

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
    throw new Error(`${label} is invalid.`);
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
    new Date(value).toISOString() !== value
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireReason(value: string): string {
  const normalized = value.trim();

  if (
    normalized !== value ||
    normalized.length < 80 ||
    normalized.length > 1600 ||
    SENSITIVE_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan review reason is invalid.",
    );
  }

  return normalized;
}

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation(
    preparation,
  );

  const summary = preparation.summary;
  const boundary = preparation.authorityBoundary;

  if (
    preparation.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARED" ||
    preparation.workstreamSequence !== 4 ||
    preparation.workstreamId !==
      "founder-routine-execution-reduction-evidence" ||
    preparation.objective !==
      "Define measurable evidence for reducing founder routine engineering execution while preserving final owner authority." ||
    preparation.completionEvidenceRequired !==
      "Verified routine-work coverage, quality, recovery, escalation, and owner-acceptance evidence." ||
    preparation.evidenceClass !==
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    preparation.planOnly !== true ||
    preparation.evidenceItemCount !== 8 ||
    preparation.evidenceItems.length !== 8 ||
    preparation.ownerEvidencePlanReviewRequired !==
      true ||
    preparation.ownerEvidencePlanReviewRecorded !==
      false ||
    summary.evidenceItemCount !== 8 ||
    summary.syntheticSanitizedEvidenceItemCount !==
      8 ||
    summary.planOnlyEvidenceItemCount !== 8 ||
    summary.deterministicEvidenceRequiredCount !==
      8 ||
    summary.independentValidationRequiredCount !==
      8 ||
    summary.ownerReviewRequiredCount !== 8 ||
    summary.monitoringRequiredCount !== 8 ||
    summary.emergencyPauseRequiredCount !== 8 ||
    summary.rollbackEvidenceRequiredCount !== 8 ||
    summary.routineWorkCoverageRequiredCount !==
      8 ||
    summary.qualityThresholdRequiredCount !== 8 ||
    summary.recoveryEvidenceRequiredCount !== 8 ||
    summary.escalationEvidenceRequiredCount !==
      8 ||
    summary.founderInterventionMeasurementRequiredCount !==
      8 ||
    summary.ownerAcceptanceRequiredCount !== 8 ||
    summary.founderLiberationSeparationRequiredCount !==
      8 ||
    summary.evidenceExecutionAuthorizedCount !==
      0 ||
    summary.taskExecutionAuthorizedCount !== 0 ||
    summary.repositoryEvaluationAuthorizedCount !==
      0 ||
    summary.repositoryReadAuthorizedCount !== 0 ||
    summary.repositoryWriteAuthorizedCount !==
      0 ||
    summary.commandExecutionAuthorizedCount !==
      0 ||
    summary.packageExecutionAuthorizedCount !==
      0 ||
    summary.networkAccessAuthorizedCount !== 0 ||
    summary.productionDeploymentAuthorizedCount !==
      0 ||
    summary.paymentExecutionAuthorizedCount !==
      0 ||
    summary.publicLaunchAuthorizedCount !== 0 ||
    boundary.evidencePlanningOnly !== true ||
    boundary.priorWorkstreamClosed !== true ||
    boundary.exactEightEvidenceItemsRequired !==
      true ||
    boundary.workstreamFourPlanPreparationAuthorized !==
      true ||
    boundary.workstreamFourPlanPreparationPerformed !==
      true ||
    boundary.workstreamFourEvidenceExecutionAuthorized !==
      false ||
    boundary.founderRoutineExecutionReductionPlanningAuthorized !==
      true ||
    boundary.founderRoutineExecutionReductionPlanPrepared !==
      true ||
    boundary.founderRoutineExecutionReductionEvidenceAuthorized !==
      false ||
    boundary.founderRoutineExecutionReductionExecutionAuthorized !==
      false ||
    boundary.founderRoutineExecutionReductionClaimAuthorized !==
      false ||
    boundary.founderRoutineExecutionReductionClaimed !==
      false ||
    boundary.founderLiberationAssessmentAuthorized !==
      false ||
    boundary.founderLiberationAcceptanceAuthorized !==
      false ||
    boundary.taskExecutionAuthorized !== false ||
    boundary.actualRepositoryEvaluationAuthorized !==
      false ||
    boundary.actualRepositoryEvaluationPerformed !==
      false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.filesystemReadAuthorized !== false ||
    boundary.filesystemMutationAuthorized !==
      false ||
    boundary.commandExecutionAuthorized !== false ||
    boundary.packageExecutionAuthorized !== false ||
    boundary.networkAccessAuthorized !== false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    boundary.founderReleasedFromRoutineExecution !==
      false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW"
  ) {
    throw new Error(
      "Canonical Founder Routine Execution Reduction evidence plan is not eligible for owner review.",
    );
  }

  preparation.evidenceItems.forEach(
    (item, index) => {
      if (
        item.sequence !== index + 1 ||
        item.controlId !==
          EXPECTED_CONTROL_IDS[index] ||
        item.dataClassification !==
          "SYNTHETIC_SANITIZED_ONLY" ||
        item.outputMode !== "PLAN_ONLY" ||
        item.evidenceToolMode !==
          "READ_ONLY_EVIDENCE_ONLY" ||
        item.planPreparationAuthorized !==
          true ||
        item.evidenceExecutionAuthorized !==
          false ||
        item.taskExecutionAuthorized !== false ||
        item.repositoryEvaluationAuthorized !==
          false ||
        item.repositoryReadAuthorized !== false ||
        item.repositoryWriteAuthorized !==
          false ||
        item.commandExecutionAuthorized !==
          false ||
        item.packageExecutionAuthorized !==
          false ||
        item.networkAccessAuthorized !== false ||
        item.productionDeploymentAuthorized !==
          false ||
        item.paymentExecutionAuthorized !==
          false ||
        item.publicLaunchAuthorized !== false ||
        !SHA256_PATTERN.test(
          item.evidenceItemDigest,
        )
      ) {
        throw new Error(
          `Canonical Founder Routine Execution Reduction evidence item ${index + 1} is invalid.`,
        );
      }
    },
  );
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidencePlanReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN";

  const reviewedEvidencePlan = deepFreeze({
    preparationState:
      preparation.preparationState,
    planOnly: preparation.planOnly,
    evidenceItemCount:
      preparation.evidenceItemCount,
    evidenceControlIds: preparation.evidenceItems.map(
      (item) => item.controlId,
    ),
    objective: preparation.objective,
    completionEvidenceRequired:
      preparation.completionEvidenceRequired,
    evidenceClass:
      preparation.evidenceClass,
    deterministicEvidenceRequiredCount:
      preparation.summary
        .deterministicEvidenceRequiredCount,
    independentValidationRequiredCount:
      preparation.summary
        .independentValidationRequiredCount,
    ownerReviewRequiredCount:
      preparation.summary.ownerReviewRequiredCount,
    monitoringRequiredCount:
      preparation.summary.monitoringRequiredCount,
    emergencyPauseRequiredCount:
      preparation.summary
        .emergencyPauseRequiredCount,
    rollbackEvidenceRequiredCount:
      preparation.summary
        .rollbackEvidenceRequiredCount,
    routineWorkCoverageRequiredCount:
      preparation.summary
        .routineWorkCoverageRequiredCount,
    qualityThresholdRequiredCount:
      preparation.summary
        .qualityThresholdRequiredCount,
    recoveryEvidenceRequiredCount:
      preparation.summary
        .recoveryEvidenceRequiredCount,
    escalationEvidenceRequiredCount:
      preparation.summary
        .escalationEvidenceRequiredCount,
    founderInterventionMeasurementRequiredCount:
      preparation.summary
        .founderInterventionMeasurementRequiredCount,
    ownerAcceptanceRequiredCount:
      preparation.summary
        .ownerAcceptanceRequiredCount,
    founderLiberationSeparationRequiredCount:
      preparation.summary
        .founderLiberationSeparationRequiredCount,
    evidenceExecutionAuthorizedCount:
      preparation.summary
        .evidenceExecutionAuthorizedCount,
    taskExecutionAuthorizedCount:
      preparation.summary
        .taskExecutionAuthorizedCount,
    repositoryReadAuthorizedCount:
      preparation.summary
        .repositoryReadAuthorizedCount,
    repositoryWriteAuthorizedCount:
      preparation.summary
        .repositoryWriteAuthorizedCount,
    commandExecutionAuthorizedCount:
      preparation.summary
        .commandExecutionAuthorizedCount,
    networkAccessAuthorizedCount:
      preparation.summary
        .networkAccessAuthorizedCount,
    productionDeploymentAuthorizedCount:
      preparation.summary
        .productionDeploymentAuthorizedCount,
    paymentExecutionAuthorizedCount:
      preparation.summary
        .paymentExecutionAuthorizedCount,
    publicLaunchAuthorizedCount:
      preparation.summary
        .publicLaunchAuthorizedCount,
    preparationDigest:
      preparation.preparationDigest,
  });

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_RECORDED" as const,
    tenantId: preparation.tenantId,
    ownerId,
    sourcePreparationId:
      preparation.preparationId,
    sourcePreparationDigest:
      preparation.preparationDigest,
    sourcePriorWorkstreamClosureDecisionId:
      preparation.sourcePriorWorkstreamClosureDecisionId,
    sourcePriorWorkstreamClosureDecisionDigest:
      preparation.sourcePriorWorkstreamClosureDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId:
      "founder-routine-execution-reduction-evidence" as const,
    evidenceClass:
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" as const,
    decision,
    reason,
    evidencePlanAccepted: approved,
    evidencePlanReviewRecorded: true as const,
    reviewedEvidencePlan,
    authorityBoundary: {
      canonicalPreparationBound: true as const,
      sourcePreparationIntegrityVerified:
        true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      planReviewRecorded: true as const,
      approvalBypassAuthorized: false as const,
      evidencePlanAccepted: approved,
      evidenceExecutionDecisionPreparationAuthorized:
        approved,
      evidenceExecutionDecisionPreparationPerformed:
        false as const,
      onlyEvidenceExecutionDecisionPreparationAuthorizedNext:
        approved,
      workstreamFourEvidenceExecutionAuthorized:
        false as const,
      founderRoutineExecutionReductionEvidenceAuthorized:
        false as const,
      founderRoutineExecutionReductionExecutionAuthorized:
        false as const,
      founderRoutineExecutionReductionClaimAuthorized:
        false as const,
      founderRoutineExecutionReductionClaimed:
        false as const,
      founderLiberationAssessmentAuthorized:
        false as const,
      founderLiberationAcceptanceAuthorized:
        false as const,
      taskExecutionAuthorized: false as const,
      actualRepositoryEvaluationAuthorized:
        false as const,
      actualRepositoryEvaluationPerformed:
        false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemReadAuthorized: false as const,
      filesystemMutationAuthorized:
        false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized:
        false as const,
      packageExecutionAuthorized:
        false as const,
      networkAccessAuthorized: false as const,
      branchCreationAuthorized: false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized: false as const,
      sensitiveContentAccessAuthorized:
        false as const,
      sensitiveContentMaterializationAuthorized:
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
      concurrentEngineeringWorkAuthorized:
        false as const,
      aggregateConcurrentEngineeringWorkLimit:
        0 as const,
      levelThreeEvaluationAuthorized:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      productionReadinessAuthorized:
        false as const,
      publicLaunchAuthorized: false as const,
      founderLiberationAchieved:
        false as const,
      founderReleasedFromRoutineExecution:
        false as const,
      monitoringRequired: true as const,
      emergencyPauseRequired: true as const,
      rollbackEvidenceRequired: true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep: (
      approved
        ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_AWAITING_OWNER_REVIEW"
    ) as
      | "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision,
): void {
  validateCanonicalPreparation();

  requireIdentifier(
    "Founder Routine Execution Reduction evidence-plan review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Founder Routine Execution Reduction evidence-plan review decision time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_RECORDED" ||
    record.tenantId !== preparation.tenantId ||
    record.ownerId !== preparation.ownerId ||
    record.sourcePreparationId !==
      preparation.preparationId ||
    record.sourcePreparationDigest !==
      preparation.preparationDigest ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      preparation.sourcePriorWorkstreamClosureDecisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      preparation.sourcePriorWorkstreamClosureDecisionDigest ||
    record.workstreamSequence !== 4 ||
    record.workstreamId !==
      "founder-routine-execution-reduction-evidence" ||
    record.evidenceClass !==
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.evidencePlanAccepted !== approved ||
    record.evidencePlanReviewRecorded !== true ||
    Date.parse(record.decidedAt) <
      Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan review identity is invalid.",
    );
  }

  const reviewed = record.reviewedEvidencePlan;

  if (
    reviewed.preparationState !==
      preparation.preparationState ||
    reviewed.planOnly !== true ||
    reviewed.evidenceItemCount !== 8 ||
    reviewed.evidenceControlIds.length !== 8 ||
    reviewed.evidenceControlIds.some(
      (controlId, index) =>
        controlId !== EXPECTED_CONTROL_IDS[index],
    ) ||
    reviewed.objective !==
      preparation.objective ||
    reviewed.completionEvidenceRequired !==
      preparation.completionEvidenceRequired ||
    reviewed.evidenceClass !==
      preparation.evidenceClass ||
    reviewed.deterministicEvidenceRequiredCount !==
      8 ||
    reviewed.independentValidationRequiredCount !==
      8 ||
    reviewed.ownerReviewRequiredCount !== 8 ||
    reviewed.monitoringRequiredCount !== 8 ||
    reviewed.emergencyPauseRequiredCount !== 8 ||
    reviewed.rollbackEvidenceRequiredCount !== 8 ||
    reviewed.routineWorkCoverageRequiredCount !==
      8 ||
    reviewed.qualityThresholdRequiredCount !== 8 ||
    reviewed.recoveryEvidenceRequiredCount !== 8 ||
    reviewed.escalationEvidenceRequiredCount !==
      8 ||
    reviewed.founderInterventionMeasurementRequiredCount !==
      8 ||
    reviewed.ownerAcceptanceRequiredCount !== 8 ||
    reviewed.founderLiberationSeparationRequiredCount !==
      8 ||
    reviewed.evidenceExecutionAuthorizedCount !==
      0 ||
    reviewed.taskExecutionAuthorizedCount !== 0 ||
    reviewed.repositoryReadAuthorizedCount !== 0 ||
    reviewed.repositoryWriteAuthorizedCount !==
      0 ||
    reviewed.commandExecutionAuthorizedCount !==
      0 ||
    reviewed.networkAccessAuthorizedCount !== 0 ||
    reviewed.productionDeploymentAuthorizedCount !==
      0 ||
    reviewed.paymentExecutionAuthorizedCount !==
      0 ||
    reviewed.publicLaunchAuthorizedCount !== 0 ||
    reviewed.preparationDigest !==
      preparation.preparationDigest
  ) {
    throw new Error(
      "Founder Routine Execution Reduction reviewed evidence plan is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalPreparationBound,
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
    boundary.workstreamFourEvidenceExecutionAuthorized,
    boundary.founderRoutineExecutionReductionEvidenceAuthorized,
    boundary.founderRoutineExecutionReductionExecutionAuthorized,
    boundary.founderRoutineExecutionReductionClaimAuthorized,
    boundary.founderRoutineExecutionReductionClaimed,
    boundary.founderLiberationAssessmentAuthorized,
    boundary.founderLiberationAcceptanceAuthorized,
    boundary.taskExecutionAuthorized,
    boundary.actualRepositoryEvaluationAuthorized,
    boundary.actualRepositoryEvaluationPerformed,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemReadAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessAuthorized,
    boundary.sensitiveContentAccessAuthorized,
    boundary.sensitiveContentMaterializationAuthorized,
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
      ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_AWAITING_OWNER_REVIEW";

  if (
    boundary.evidencePlanAccepted !== approved ||
    boundary.evidenceExecutionDecisionPreparationAuthorized !==
      approved ||
    boundary.onlyEvidenceExecutionDecisionPreparationAuthorizedNext !==
      approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !==
      0 ||
    requiredTrue.some(
      (value) => value !== true,
    ) ||
    requiredFalse.some(
      (value) => value !== false,
    ) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedEvidencePlan,
    ) ||
    !Object.isFrozen(
      record.reviewedEvidencePlan
        .evidenceControlIds,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision {
  if (
    input.sourcePreparation !== preparation
  ) {
    throw new Error(
      "Only the canonical Founder Routine Execution Reduction evidence-plan preparation can receive owner review.",
    );
  }

  validateCanonicalPreparation();

  requireIdentifier(
    "Founder Routine Execution Reduction evidence-plan review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Founder Routine Execution Reduction evidence-plan review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== preparation.ownerId) {
    throw new Error(
      "Only the evidence-plan-bound NEXUS owner can review the Founder Routine Execution Reduction plan.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan review cannot precede preparation.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision(
    record,
  );

  return record;
}