import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION,
  type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceControlId,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-execution-decision-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_OPTIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionOption =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_OPTIONS)[number];

export interface EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparationItem {
  readonly sequence:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8;
  readonly preparationState:
    "ENGINEERING_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED";
  readonly controlId:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceControlId;
  readonly sourceEvidenceItemDigest: string;
  readonly sourceEvidencePlanPreparationDigest:
    string;
  readonly sourceEvidencePlanReviewDecisionDigest:
    string;
  readonly decisionOptions:
    readonly EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionOption[];
  readonly executionMode:
    "SYNTHETIC_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ONLY";
  readonly evidenceToolMode:
    "READ_ONLY_EVIDENCE_ONLY";
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
  readonly routineWorkCoverageRequired: true;
  readonly qualityThresholdRequired: true;
  readonly recoveryEvidenceRequired: true;
  readonly escalationEvidenceRequired: true;
  readonly founderInterventionMeasurementRequired:
    true;
  readonly ownerAcceptanceRequired: true;
  readonly founderLiberationSeparationRequired:
    true;
  readonly evidenceExecutionAuthorized: false;
  readonly evidenceExecutionPerformed: false;
  readonly taskExecutionAuthorized: false;
  readonly repositoryEvaluationAuthorized: false;
  readonly repositoryReadAuthorized: false;
  readonly repositoryWriteAuthorized: false;
  readonly filesystemReadAuthorized: false;
  readonly filesystemMutationAuthorized: false;
  readonly gitMutationAuthorized: false;
  readonly commandExecutionAuthorized: false;
  readonly packageExecutionAuthorized: false;
  readonly networkAccessAuthorized: false;
  readonly branchCreationAuthorized: false;
  readonly pullRequestPreparationAuthorized: false;
  readonly mergeAuthorized: false;
  readonly secretsAccessAuthorized: false;
  readonly sensitiveContentAccessAuthorized: false;
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

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparationInput {
  readonly preparationId: string;
  readonly sourcePlanReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION;
  readonly preparedAt: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

const evidencePlan =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

const ownerPlanReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION;

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

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation(
    evidencePlan,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision(
    ownerPlanReview,
  );

  const boundary =
    ownerPlanReview.authorityBoundary;

  if (
    ownerPlanReview.workstreamSequence !== 4 ||
    ownerPlanReview.workstreamId !==
      "founder-routine-execution-reduction-evidence" ||
    ownerPlanReview.evidenceClass !==
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    ownerPlanReview.evidencePlanAccepted !==
      true ||
    ownerPlanReview.evidencePlanReviewRecorded !==
      true ||
    ownerPlanReview.reviewedEvidencePlan
      .evidenceItemCount !== 8 ||
    ownerPlanReview.reviewedEvidencePlan
      .evidenceControlIds.length !== 8 ||
    boundary.evidencePlanAccepted !== true ||
    boundary
      .evidenceExecutionDecisionPreparationAuthorized !==
      true ||
    boundary
      .evidenceExecutionDecisionPreparationPerformed !==
      false ||
    boundary
      .onlyEvidenceExecutionDecisionPreparationAuthorizedNext !==
      true ||
    boundary
      .workstreamFourEvidenceExecutionAuthorized !==
      false ||
    boundary
      .founderRoutineExecutionReductionEvidenceAuthorized !==
      false ||
    boundary
      .founderRoutineExecutionReductionExecutionAuthorized !==
      false ||
    boundary
      .founderRoutineExecutionReductionClaimAuthorized !==
      false ||
    boundary
      .founderRoutineExecutionReductionClaimed !==
      false ||
    boundary
      .founderLiberationAssessmentAuthorized !==
      false ||
    boundary
      .founderLiberationAcceptanceAuthorized !==
      false ||
    boundary.taskExecutionAuthorized !== false ||
    boundary
      .actualRepositoryEvaluationAuthorized !==
      false ||
    boundary
      .actualRepositoryEvaluationPerformed !==
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
    boundary
      .founderReleasedFromRoutineExecution !==
      false ||
    ownerPlanReview.nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Canonical Founder Routine Execution Reduction execution-decision preparation prerequisites are invalid.",
    );
  }
}

function createDecisionPreparations(): readonly EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparationItem[] {
  return evidencePlan.evidenceItems.map(
    (source, index) => {
      const reviewedControlId =
        ownerPlanReview.reviewedEvidencePlan
          .evidenceControlIds[index];

      if (
        !reviewedControlId ||
        reviewedControlId !== source.controlId
      ) {
        throw new Error(
          `Founder Routine Execution Reduction reviewed control ${index + 1} is invalid.`,
        );
      }

      const itemCore = {
        sequence:
          (index + 1) as
            | 1
            | 2
            | 3
            | 4
            | 5
            | 6
            | 7
            | 8,
        preparationState:
          "ENGINEERING_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" as const,
        controlId: source.controlId,
        sourceEvidenceItemDigest:
          source.evidenceItemDigest,
        sourceEvidencePlanPreparationDigest:
          evidencePlan.preparationDigest,
        sourceEvidencePlanReviewDecisionDigest:
          ownerPlanReview.decisionDigest,
        decisionOptions:
          ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_OPTIONS,
        executionMode:
          "SYNTHETIC_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ONLY" as const,
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY" as const,
        maximumEvidenceExecutionCount:
          1 as const,
        concurrentExecutionLimit: 0 as const,
        deterministicEvidenceRequired:
          true as const,
        independentValidationRequired:
          true as const,
        ownerExecutionDecisionRequired:
          true as const,
        ownerExecutionDecisionRecorded:
          false as const,
        ownerReviewAfterExecutionRequired:
          true as const,
        monitoringRequired: true as const,
        emergencyPauseRequired: true as const,
        rollbackEvidenceRequired: true as const,
        tenantBindingRequired: true as const,
        ownerBindingRequired: true as const,
        routineWorkCoverageRequired:
          true as const,
        qualityThresholdRequired: true as const,
        recoveryEvidenceRequired: true as const,
        escalationEvidenceRequired: true as const,
        founderInterventionMeasurementRequired:
          true as const,
        ownerAcceptanceRequired: true as const,
        founderLiberationSeparationRequired:
          true as const,
        evidenceExecutionAuthorized:
          false as const,
        evidenceExecutionPerformed:
          false as const,
        taskExecutionAuthorized: false as const,
        repositoryEvaluationAuthorized:
          false as const,
        repositoryReadAuthorized:
          false as const,
        repositoryWriteAuthorized:
          false as const,
        filesystemReadAuthorized:
          false as const,
        filesystemMutationAuthorized:
          false as const,
        gitMutationAuthorized: false as const,
        commandExecutionAuthorized:
          false as const,
        packageExecutionAuthorized:
          false as const,
        networkAccessAuthorized:
          false as const,
        branchCreationAuthorized:
          false as const,
        pullRequestPreparationAuthorized:
          false as const,
        mergeAuthorized: false as const,
        secretsAccessAuthorized: false as const,
        sensitiveContentAccessAuthorized:
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
        publicLaunchAuthorized: false as const,
      };

      return deepFreeze({
        ...itemCore,
        decisionPreparationDigest:
          sha256(itemCore),
      });
    },
  );
}

function buildPreparation(
  preparationId: string,
  preparedAt: string,
) {
  const decisionPreparations =
    deepFreeze(createDecisionPreparations());

  const summary = deepFreeze({
    evidenceDecisionPreparationCount:
      8 as const,
    ownerExecutionDecisionRequiredCount:
      8 as const,
    ownerExecutionDecisionRecordedCount:
      0 as const,
    maximumEvidenceExecutionCount:
      1 as const,
    aggregateConcurrentExecutionLimit:
      0 as const,
    evidenceExecutionAuthorizedCount:
      0 as const,
    evidenceExecutionPerformedCount:
      0 as const,
    taskExecutionAuthorizedCount:
      0 as const,
    repositoryEvaluationAuthorizedCount:
      0 as const,
    repositoryReadAuthorizedCount:
      0 as const,
    repositoryWriteAuthorizedCount:
      0 as const,
    filesystemReadAuthorizedCount:
      0 as const,
    filesystemMutationAuthorizedCount:
      0 as const,
    gitMutationAuthorizedCount:
      0 as const,
    commandExecutionAuthorizedCount:
      0 as const,
    packageExecutionAuthorizedCount:
      0 as const,
    networkAccessAuthorizedCount:
      0 as const,
    productionDeploymentAuthorizedCount:
      0 as const,
    paymentExecutionAuthorizedCount:
      0 as const,
    publicLaunchAuthorizedCount:
      0 as const,
    monitoringRequiredCount: 8 as const,
    emergencyPauseRequiredCount:
      8 as const,
    rollbackEvidenceRequiredCount:
      8 as const,
    tenantBindingRequiredCount:
      8 as const,
    ownerBindingRequiredCount:
      8 as const,
    routineWorkCoverageRequiredCount:
      8 as const,
    qualityThresholdRequiredCount:
      8 as const,
    recoveryEvidenceRequiredCount:
      8 as const,
    escalationEvidenceRequiredCount:
      8 as const,
    founderInterventionMeasurementRequiredCount:
      8 as const,
    ownerAcceptanceRequiredCount:
      8 as const,
    founderLiberationSeparationRequiredCount:
      8 as const,
    uniqueDecisionPreparationDigestCount:
      new Set(
        decisionPreparations.map(
          (item) =>
            item.decisionPreparationDigest,
        ),
      ).size,
  });

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION,
    preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" as const,
    sourceEvidencePlanReviewDecisionId:
      ownerPlanReview.decisionId,
    sourceEvidencePlanReviewDecisionDigest:
      ownerPlanReview.decisionDigest,
    sourceEvidencePlanPreparationId:
      evidencePlan.preparationId,
    sourceEvidencePlanPreparationDigest:
      evidencePlan.preparationDigest,
    sourcePriorWorkstreamClosureDecisionId:
      evidencePlan
        .sourcePriorWorkstreamClosureDecisionId,
    sourcePriorWorkstreamClosureDecisionDigest:
      evidencePlan
        .sourcePriorWorkstreamClosureDecisionDigest,
    tenantId: ownerPlanReview.tenantId,
    ownerId: ownerPlanReview.ownerId,
    workstreamSequence: 4 as const,
    workstreamId:
      "founder-routine-execution-reduction-evidence" as const,
    evidenceClass:
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" as const,
    decisionPreparationOnly: true as const,
    evidenceDecisionPreparationCount:
      8 as const,
    evidenceDecisionPreparations:
      decisionPreparations,
    summary,
    ownerExecutionDecisionReviewRequired:
      true as const,
    ownerExecutionDecisionReviewRecorded:
      false as const,
    authorityBoundary: {
      decisionPreparationOnly: true as const,
      canonicalOwnerPlanReviewBound:
        true as const,
      canonicalEvidencePlanBound:
        true as const,
      sourcePlanIntegrityVerified:
        true as const,
      exactEightEvidenceDecisionPreparationsRequired:
        true as const,
      workstreamFourEvidenceExecutionDecisionPreparationAuthorized:
        true as const,
      workstreamFourEvidenceExecutionDecisionPreparationPerformed:
        true as const,
      workstreamFourEvidenceExecutionAuthorized:
        false as const,
      oneAtATimeEvidenceExecutionRequired:
        true as const,
      aggregateConcurrentExecutionLimit:
        0 as const,
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
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      filesystemReadAuthorized:
        false as const,
      filesystemMutationAuthorized:
        false as const,
      gitMutationAuthorized:
        false as const,
      commandExecutionAuthorized:
        false as const,
      packageExecutionAuthorized:
        false as const,
      networkAccessAuthorized:
        false as const,
      branchCreationAuthorized:
        false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized:
        false as const,
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
      levelThreeEvaluationAuthorized:
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
      monitoringRequired: true as const,
      emergencyPauseRequired:
        true as const,
      rollbackEvidenceRequired:
        true as const,
      ownerReviewRequired: true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_REVIEW" as const,
    preparedAt,
  };

  return deepFreeze({
    ...preparationCore,
    preparationDigest:
      sha256(preparationCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation =
  ReturnType<typeof buildPreparation>;

function validateDecisionPreparation(
  item:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparationItem,
  index: number,
): void {
  const source =
    evidencePlan.evidenceItems[index];

  if (!source) {
    throw new Error(
      "Founder Routine Execution Reduction source evidence item is missing.",
    );
  }

  const {
    decisionPreparationDigest,
    ...itemCore
  } = item;

  const requiredTrue = [
    item.deterministicEvidenceRequired,
    item.independentValidationRequired,
    item.ownerExecutionDecisionRequired,
    item.ownerReviewAfterExecutionRequired,
    item.monitoringRequired,
    item.emergencyPauseRequired,
    item.rollbackEvidenceRequired,
    item.tenantBindingRequired,
    item.ownerBindingRequired,
    item.routineWorkCoverageRequired,
    item.qualityThresholdRequired,
    item.recoveryEvidenceRequired,
    item.escalationEvidenceRequired,
    item.founderInterventionMeasurementRequired,
    item.ownerAcceptanceRequired,
    item.founderLiberationSeparationRequired,
  ];

  const requiredFalse = [
    item.ownerExecutionDecisionRecorded,
    item.evidenceExecutionAuthorized,
    item.evidenceExecutionPerformed,
    item.taskExecutionAuthorized,
    item.repositoryEvaluationAuthorized,
    item.repositoryReadAuthorized,
    item.repositoryWriteAuthorized,
    item.filesystemReadAuthorized,
    item.filesystemMutationAuthorized,
    item.gitMutationAuthorized,
    item.commandExecutionAuthorized,
    item.packageExecutionAuthorized,
    item.networkAccessAuthorized,
    item.branchCreationAuthorized,
    item.pullRequestPreparationAuthorized,
    item.mergeAuthorized,
    item.secretsAccessAuthorized,
    item.sensitiveContentAccessAuthorized,
    item.realCustomerDataAccessAuthorized,
    item.realCustomerContactAuthorized,
    item.externalDeliveryAuthorized,
    item.liveProviderExecutionAuthorized,
    item.productionDatabaseAuthorized,
    item.productionMutationAuthorized,
    item.productionDeploymentAuthorized,
    item.paymentExecutionAuthorized,
    item.publicLaunchAuthorized,
  ];

  if (
    !SHA256_PATTERN.test(
      decisionPreparationDigest,
    ) ||
    sha256(itemCore) !==
      decisionPreparationDigest ||
    item.sequence !== index + 1 ||
    item.preparationState !==
      "ENGINEERING_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" ||
    item.controlId !== source.controlId ||
    item.sourceEvidenceItemDigest !==
      source.evidenceItemDigest ||
    item.sourceEvidencePlanPreparationDigest !==
      evidencePlan.preparationDigest ||
    item.sourceEvidencePlanReviewDecisionDigest !==
      ownerPlanReview.decisionDigest ||
    item.decisionOptions !==
      ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_OPTIONS ||
    item.executionMode !==
      "SYNTHETIC_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ONLY" ||
    item.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    item.maximumEvidenceExecutionCount !== 1 ||
    item.concurrentExecutionLimit !== 0 ||
    requiredTrue.some(
      (value) => value !== true,
    ) ||
    requiredFalse.some(
      (value) => value !== false,
    ) ||
    !Object.isFrozen(item)
  ) {
    throw new Error(
      `Founder Routine Execution Reduction execution-decision preparation ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Founder Routine Execution Reduction execution-decision preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Founder Routine Execution Reduction execution-decision preparation time",
    record.preparedAt,
  );

  const {
    preparationDigest,
    ...preparationCore
  } = record;

  if (
    !SHA256_PATTERN.test(preparationDigest) ||
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Founder Routine Execution Reduction execution-decision preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" ||
    record.sourceEvidencePlanReviewDecisionId !==
      ownerPlanReview.decisionId ||
    record.sourceEvidencePlanReviewDecisionDigest !==
      ownerPlanReview.decisionDigest ||
    record.sourceEvidencePlanPreparationId !==
      evidencePlan.preparationId ||
    record.sourceEvidencePlanPreparationDigest !==
      evidencePlan.preparationDigest ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      evidencePlan
        .sourcePriorWorkstreamClosureDecisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      evidencePlan
        .sourcePriorWorkstreamClosureDecisionDigest ||
    record.tenantId !== ownerPlanReview.tenantId ||
    record.ownerId !== ownerPlanReview.ownerId ||
    record.workstreamSequence !== 4 ||
    record.workstreamId !==
      "founder-routine-execution-reduction-evidence" ||
    record.evidenceClass !==
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    record.decisionPreparationOnly !== true ||
    record.evidenceDecisionPreparationCount !==
      8 ||
    record.evidenceDecisionPreparations.length !==
      8 ||
    record.ownerExecutionDecisionReviewRequired !==
      true ||
    record.ownerExecutionDecisionReviewRecorded !==
      false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(ownerPlanReview.decidedAt)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction execution-decision preparation identity is invalid.",
    );
  }

  record.evidenceDecisionPreparations.forEach(
    validateDecisionPreparation,
  );

  const summary = record.summary;

  if (
    summary.evidenceDecisionPreparationCount !==
      8 ||
    summary.ownerExecutionDecisionRequiredCount !==
      8 ||
    summary.ownerExecutionDecisionRecordedCount !==
      0 ||
    summary.maximumEvidenceExecutionCount !== 1 ||
    summary.aggregateConcurrentExecutionLimit !==
      0 ||
    summary.evidenceExecutionAuthorizedCount !==
      0 ||
    summary.evidenceExecutionPerformedCount !==
      0 ||
    summary.taskExecutionAuthorizedCount !== 0 ||
    summary.repositoryEvaluationAuthorizedCount !==
      0 ||
    summary.repositoryReadAuthorizedCount !== 0 ||
    summary.repositoryWriteAuthorizedCount !==
      0 ||
    summary.filesystemReadAuthorizedCount !== 0 ||
    summary.filesystemMutationAuthorizedCount !==
      0 ||
    summary.gitMutationAuthorizedCount !== 0 ||
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
    summary.monitoringRequiredCount !== 8 ||
    summary.emergencyPauseRequiredCount !== 8 ||
    summary.rollbackEvidenceRequiredCount !== 8 ||
    summary.tenantBindingRequiredCount !== 8 ||
    summary.ownerBindingRequiredCount !== 8 ||
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
    summary.uniqueDecisionPreparationDigestCount !==
      8
  ) {
    throw new Error(
      "Founder Routine Execution Reduction execution-decision preparation summary is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.decisionPreparationOnly,
    boundary.canonicalOwnerPlanReviewBound,
    boundary.canonicalEvidencePlanBound,
    boundary.sourcePlanIntegrityVerified,
    boundary.exactEightEvidenceDecisionPreparationsRequired,
    boundary.workstreamFourEvidenceExecutionDecisionPreparationAuthorized,
    boundary.workstreamFourEvidenceExecutionDecisionPreparationPerformed,
    boundary.oneAtATimeEvidenceExecutionRequired,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerReviewRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
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

  if (
    boundary.aggregateConcurrentExecutionLimit !==
      0 ||
    requiredTrue.some(
      (value) => value !== true,
    ) ||
    requiredFalse.some(
      (value) => value !== false,
    ) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.evidenceDecisionPreparations,
    ) ||
    !Object.isFrozen(record.summary) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Founder Routine Execution Reduction execution-decision preparation authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparationInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation {
  if (
    input.sourcePlanReview !== ownerPlanReview
  ) {
    throw new Error(
      "Only the canonical accepted Founder Routine Execution Reduction evidence-plan review can prepare execution decisions.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Founder Routine Execution Reduction execution-decision preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Founder Routine Execution Reduction execution-decision preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(ownerPlanReview.decidedAt)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction execution-decision preparation cannot precede owner plan review.",
    );
  }

  const record = buildPreparation(
    input.preparationId,
    input.preparedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-execution-decision-preparation-001",
    sourcePlanReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION,
    preparedAt: "2026-08-02T22:30:00.000Z",
  });