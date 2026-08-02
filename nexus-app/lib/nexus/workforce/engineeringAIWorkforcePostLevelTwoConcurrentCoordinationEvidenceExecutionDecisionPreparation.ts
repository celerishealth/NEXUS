import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
  type EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-execution-decision-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS =
  [
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionOption =
  (
    typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS
  )[number];

export interface EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionPreparationItem {
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
    "ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARED";

  readonly sourceEvidenceItemDigest:
    string;

  readonly controlId:
    string;

  readonly objective:
    string;

  readonly expectedEvidence:
    string;

  readonly availableDecisions:
    typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS;

  readonly recommendedDecision:
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION";

  readonly recommendationReason:
    string;

  readonly executionMode:
    "SYNTHETIC_SANDBOX_EVIDENCE_ONLY";

  readonly evidenceToolMode:
    "READ_ONLY_EVIDENCE_ONLY";

  readonly maximumEvidenceExecutionCount:
    1;

  readonly concurrentExecutionLimit:
    0;

  readonly deterministicEvidenceRequired:
    true;

  readonly independentValidationRequired:
    true;

  readonly ownerExecutionDecisionRequired:
    true;

  readonly ownerExecutionDecisionRecorded:
    false;

  readonly ownerReviewAfterExecutionRequired:
    true;

  readonly monitoringRequired:
    true;

  readonly emergencyPauseRequired:
    true;

  readonly rollbackEvidenceRequired:
    true;

  readonly evidenceExecutionAuthorized:
    false;

  readonly evidenceExecutionPerformed:
    false;

  readonly concurrentEngineeringWorkAuthorized:
    false;

  readonly repositoryReadAuthorized:
    false;

  readonly repositoryWriteAuthorized:
    false;

  readonly branchCreationAuthorized:
    false;

  readonly pullRequestPreparationAuthorized:
    false;

  readonly mergeAuthorized:
    false;

  readonly secretsAccessAuthorized:
    false;

  readonly realCustomerDataAccessAuthorized:
    false;

  readonly realCustomerContactAuthorized:
    false;

  readonly externalDeliveryAuthorized:
    false;

  readonly liveProviderExecutionAuthorized:
    false;

  readonly productionDatabaseAuthorized:
    false;

  readonly productionMutationAuthorized:
    false;

  readonly productionDeploymentAuthorized:
    false;

  readonly paymentExecutionAuthorized:
    false;

  readonly publicLaunchAuthorized:
    false;

  readonly decisionPreparationDigest:
    string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparationInput {
  readonly preparationId:
    string;

  readonly sourceEvidencePlanReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

  readonly sourceEvidencePlanPreparation:
    EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation;

  readonly preparedAt:
    string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

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

const evidencePlan =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

const ownerPlanReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

function validateCanonicalSources(): void {
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
    evidencePlan,
  );

  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
    ownerPlanReview,
  );

  if (
    ownerPlanReview.decision !==
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_ONLY" ||
    ownerPlanReview.evidencePlanAccepted !==
      true ||
    ownerPlanReview.concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized !==
      true ||
    ownerPlanReview.concurrentCoordinationEvidenceExecutionAuthorized !==
      false ||
    ownerPlanReview.consequentialAuthorityGranted !==
      false ||
    ownerPlanReview.sourcePreparationId !==
      evidencePlan.preparationId ||
    ownerPlanReview.sourcePreparationDigest !==
      evidencePlan.preparationDigest ||
    ownerPlanReview.nextStep !==
      "AWAIT_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION" ||
    ownerPlanReview.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    ownerPlanReview.authorityBoundary
      .taskExecutionAuthorized !==
      false ||
    ownerPlanReview.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    ownerPlanReview.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    ownerPlanReview.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    ownerPlanReview.authorityBoundary
      .productionDeploymentAuthorized !==
      false ||
    ownerPlanReview.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    ownerPlanReview.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    ownerPlanReview.authorityBoundary
      .ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Canonical concurrent-coordination evidence-plan owner review is invalid.",
    );
  }

  if (
    evidencePlan.workstreamSequence !==
      2 ||
    evidencePlan.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    evidencePlan.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    evidencePlan.planOnly !==
      true ||
    evidencePlan.evidenceItemCount !==
      8 ||
    evidencePlan.evidenceItems.length !==
      8 ||
    evidencePlan.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    evidencePlan.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    evidencePlan.authorityBoundary
      .repositoryWriteAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical concurrent-coordination evidence plan is invalid.",
    );
  }
}

function createDecisionPreparations():
  readonly EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionPreparationItem[] {
  return evidencePlan.evidenceItems.map(
    (
      source,
      index,
    ) => {
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
          "ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARED" as const,

        sourceEvidenceItemDigest:
          source.evidenceItemDigest,

        controlId:
          source.controlId,

        objective:
          source.objective,

        expectedEvidence:
          source.expectedEvidence,

        availableDecisions:
          ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS,

        recommendedDecision:
          "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION" as const,

        recommendationReason:
          `Prepare an owner decision for the bounded ${source.controlId} synthetic safety-evidence execution only, with deterministic evidence, sequential handling, monitoring, emergency pause, rollback, and no concurrent Engineering work authority.`,

        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" as const,

        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY" as const,

        maximumEvidenceExecutionCount:
          1 as const,

        concurrentExecutionLimit:
          0 as const,

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

        monitoringRequired:
          true as const,

        emergencyPauseRequired:
          true as const,

        rollbackEvidenceRequired:
          true as const,

        evidenceExecutionAuthorized:
          false as const,

        evidenceExecutionPerformed:
          false as const,

        concurrentEngineeringWorkAuthorized:
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

        publicLaunchAuthorized:
          false as const,
      };

      return deepFreeze({
        ...itemCore,

        decisionPreparationDigest:
          sha256(itemCore),
      });
    },
  ) as readonly EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionPreparationItem[];
}

function buildPreparation(
  preparationId: string,
  preparedAt: string,
) {
  const decisionPreparations =
    createDecisionPreparations();

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION,

    preparationId,

    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" as const,

    sourceEvidencePlanReviewDecisionId:
      ownerPlanReview.decisionId,

    sourceEvidencePlanReviewDecisionDigest:
      ownerPlanReview.decisionDigest,

    sourceEvidencePlanPreparationId:
      evidencePlan.preparationId,

    sourceEvidencePlanPreparationDigest:
      evidencePlan.preparationDigest,

    tenantId:
      ownerPlanReview.tenantId,

    ownerId:
      ownerPlanReview.ownerId,

    workstreamSequence:
      2 as const,

    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,

    evidenceClass:
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" as const,

    decisionPreparationOnly:
      true as const,

    evidenceDecisionPreparationCount:
      8 as const,

    evidenceDecisionPreparations:
      decisionPreparations,

    summary: {
      evidenceDecisionPreparationCount:
        8 as const,

      ownerExecutionDecisionRequiredCount:
        8 as const,

      ownerExecutionDecisionRecordedCount:
        0 as const,

      evidenceExecutionAuthorizedCount:
        0 as const,

      evidenceExecutionPerformedCount:
        0 as const,

      concurrentEngineeringWorkAuthorizedCount:
        0 as const,

      monitoringRequiredCount:
        8 as const,

      emergencyPauseRequiredCount:
        8 as const,

      rollbackEvidenceRequiredCount:
        8 as const,

      repositoryReadAuthorizedCount:
        0 as const,

      repositoryWriteAuthorizedCount:
        0 as const,

      productionDeploymentAuthorizedCount:
        0 as const,

      publicLaunchAuthorizedCount:
        0 as const,
    },

    ownerExecutionDecisionReviewRequired:
      true as const,

    ownerExecutionDecisionReviewRecorded:
      false as const,

    authorityBoundary: {
      decisionPreparationOnly:
        true as const,

      canonicalOwnerPlanReviewBound:
        true as const,

      canonicalEvidencePlanBound:
        true as const,

      exactEightEvidenceDecisionPreparationsRequired:
        true as const,

      concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized:
        true as const,

      concurrentCoordinationEvidenceExecutionAuthorized:
        false as const,

      concurrentCoordinationEvidenceExecutionPerformed:
        false as const,

      oneAtATimeEvidenceExecutionRequired:
        true as const,

      aggregateConcurrentExecutionLimit:
        0 as const,

      concurrentEngineeringWorkAuthorized:
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

      ownerReviewRequiredBeforeExecution:
        true as const,

      ownerReviewRequiredAfterEveryExecution:
        true as const,

      ownerFinalAuthorityPreserved:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_REVIEW" as const,

    preparedAt,
  };

  return deepFreeze({
    ...preparationCore,

    preparationDigest:
      sha256(preparationCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation =
  ReturnType<
    typeof buildPreparation
  >;

function validateDecisionPreparationItem(
  item:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionPreparationItem,
  index: number,
): void {
  const source =
    evidencePlan.evidenceItems[index];

  if (!source) {
    throw new Error(
      "Concurrent-coordination source evidence item is missing.",
    );
  }

  const {
    decisionPreparationDigest,
    ...itemCore
  } = item;

  if (
    !SHA256_PATTERN.test(
      decisionPreparationDigest,
    ) ||
    sha256(itemCore) !==
      decisionPreparationDigest ||
    item.sequence !== index + 1 ||
    item.preparationState !==
      "ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARED" ||
    item.sourceEvidenceItemDigest !==
      source.evidenceItemDigest ||
    item.controlId !==
      source.controlId ||
    item.objective !==
      source.objective ||
    item.expectedEvidence !==
      source.expectedEvidence ||
    item.availableDecisions !==
      ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS ||
    item.recommendedDecision !==
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION" ||
    item.recommendationReason.length <
      80 ||
    item.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    item.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    item.maximumEvidenceExecutionCount !==
      1 ||
    item.concurrentExecutionLimit !==
      0 ||
    item.deterministicEvidenceRequired !==
      true ||
    item.independentValidationRequired !==
      true ||
    item.ownerExecutionDecisionRequired !==
      true ||
    item.ownerExecutionDecisionRecorded !==
      false ||
    item.ownerReviewAfterExecutionRequired !==
      true ||
    item.monitoringRequired !==
      true ||
    item.emergencyPauseRequired !==
      true ||
    item.rollbackEvidenceRequired !==
      true ||
    item.evidenceExecutionAuthorized !==
      false ||
    item.evidenceExecutionPerformed !==
      false ||
    item.concurrentEngineeringWorkAuthorized !==
      false ||
    item.repositoryReadAuthorized !==
      false ||
    item.repositoryWriteAuthorized !==
      false ||
    item.branchCreationAuthorized !==
      false ||
    item.pullRequestPreparationAuthorized !==
      false ||
    item.mergeAuthorized !==
      false ||
    item.secretsAccessAuthorized !==
      false ||
    item.realCustomerDataAccessAuthorized !==
      false ||
    item.realCustomerContactAuthorized !==
      false ||
    item.externalDeliveryAuthorized !==
      false ||
    item.liveProviderExecutionAuthorized !==
      false ||
    item.productionDatabaseAuthorized !==
      false ||
    item.productionMutationAuthorized !==
      false ||
    item.productionDeploymentAuthorized !==
      false ||
    item.paymentExecutionAuthorized !==
      false ||
    item.publicLaunchAuthorized !==
      false ||
    !Object.isFrozen(item)
  ) {
    throw new Error(
      `Concurrent-coordination execution-decision preparation ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Concurrent-coordination evidence execution-decision preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Concurrent-coordination evidence execution-decision preparation time",
    record.preparedAt,
  );

  const {
    preparationDigest,
    ...preparationCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      preparationDigest,
    ) ||
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" ||
    record.sourceEvidencePlanReviewDecisionId !==
      ownerPlanReview.decisionId ||
    record.sourceEvidencePlanReviewDecisionDigest !==
      ownerPlanReview.decisionDigest ||
    record.sourceEvidencePlanPreparationId !==
      evidencePlan.preparationId ||
    record.sourceEvidencePlanPreparationDigest !==
      evidencePlan.preparationDigest ||
    record.tenantId !==
      ownerPlanReview.tenantId ||
    record.ownerId !==
      ownerPlanReview.ownerId ||
    record.workstreamSequence !==
      2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    record.decisionPreparationOnly !==
      true ||
    record.evidenceDecisionPreparationCount !==
      8 ||
    record.evidenceDecisionPreparations.length !==
      8 ||
    record.ownerExecutionDecisionReviewRequired !==
      true ||
    record.ownerExecutionDecisionReviewRecorded !==
      false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(
        ownerPlanReview.decidedAt,
      )
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision preparation identity is invalid.",
    );
  }

  record.evidenceDecisionPreparations.forEach(
    validateDecisionPreparationItem,
  );

  if (
    new Set(
      record.evidenceDecisionPreparations.map(
        (item) =>
          item.controlId,
      ),
    ).size !== 8
  ) {
    throw new Error(
      "Concurrent-coordination execution-decision preparation controls must remain unique.",
    );
  }

  const summary =
    record.summary;

  if (
    summary.evidenceDecisionPreparationCount !==
      8 ||
    summary.ownerExecutionDecisionRequiredCount !==
      8 ||
    summary.ownerExecutionDecisionRecordedCount !==
      0 ||
    summary.evidenceExecutionAuthorizedCount !==
      0 ||
    summary.evidenceExecutionPerformedCount !==
      0 ||
    summary.concurrentEngineeringWorkAuthorizedCount !==
      0 ||
    summary.monitoringRequiredCount !==
      8 ||
    summary.emergencyPauseRequiredCount !==
      8 ||
    summary.rollbackEvidenceRequiredCount !==
      8 ||
    summary.repositoryReadAuthorizedCount !==
      0 ||
    summary.repositoryWriteAuthorizedCount !==
      0 ||
    summary.productionDeploymentAuthorizedCount !==
      0 ||
    summary.publicLaunchAuthorizedCount !==
      0
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision preparation summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.decisionPreparationOnly,
    boundary.canonicalOwnerPlanReviewBound,
    boundary.canonicalEvidencePlanBound,
    boundary.exactEightEvidenceDecisionPreparationsRequired,
    boundary.concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized,
    boundary.oneAtATimeEvidenceExecutionRequired,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerReviewRequiredBeforeExecution,
    boundary.ownerReviewRequiredAfterEveryExecution,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.concurrentCoordinationEvidenceExecutionAuthorized,
    boundary.concurrentCoordinationEvidenceExecutionPerformed,
    boundary.concurrentEngineeringWorkAuthorized,
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

  if (
    boundary.aggregateConcurrentExecutionLimit !==
      0 ||
    requiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    requiredFalse.some(
      (value) =>
        value !== false,
    ) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.evidenceDecisionPreparations,
    ) ||
    !Object.isFrozen(
      record.summary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision preparation authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparationInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation {
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
    input.sourceEvidencePlanReviewDecision,
  );

  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
    input.sourceEvidencePlanPreparation,
  );

  if (
    input.sourceEvidencePlanReviewDecision.decisionId !==
      ownerPlanReview.decisionId ||
    input.sourceEvidencePlanReviewDecision.decisionDigest !==
      ownerPlanReview.decisionDigest
  ) {
    throw new Error(
      "Only the canonical owner-approved second-workstream evidence plan can authorize decision preparation.",
    );
  }

  if (
    input.sourceEvidencePlanPreparation.preparationId !==
      evidencePlan.preparationId ||
    input.sourceEvidencePlanPreparation.preparationDigest !==
      evidencePlan.preparationDigest
  ) {
    throw new Error(
      "Only the canonical concurrent-coordination evidence plan can be prepared for owner execution decisions.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Concurrent-coordination evidence execution-decision preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Concurrent-coordination evidence execution-decision preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
      Date.parse(
        ownerPlanReview.decidedAt,
      )
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision preparation cannot precede owner evidence-plan approval.",
    );
  }

  const record =
    buildPreparation(
      input.preparationId,
      input.preparedAt,
    );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-execution-decision-preparation-001",

    sourceEvidencePlanReviewDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,

    sourceEvidencePlanPreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,

    preparedAt:
      "2026-08-02T15:10:00.000Z",
  });