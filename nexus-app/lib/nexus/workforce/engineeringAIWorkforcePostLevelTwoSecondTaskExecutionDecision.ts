import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
  ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation,
  type EngineeringAIWorkforceSecondTaskExecutionDecisionOption,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-second-task-execution-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_SECOND_TASK_OWNER_APPROVAL_REASONS =
  [
    "Owner approved Ishaan's bounded second synthetic architecture-evolution evidence task with immediate owner review afterward and zero repository or production authority.",
    "Owner approved Leela's bounded second synthetic engineering-delivery coordination evidence task with strict sequential execution and immediate owner review afterward.",
    "Owner approved Vivaan's bounded second synthetic regression-risk containment evidence task without code changes, repository access, or production authority.",
    "Owner approved Anaya's bounded second synthetic security-boundary evidence task without protected material, repository, customer, provider, or production access.",
    "Owner approved Atharv's bounded second synthetic reliability and recovery evidence task without live-provider activity, deployment, or production authority.",
    "Owner approved Mahir's bounded second synthetic failure-containment evidence task without injecting any real failure or affecting any live environment.",
    "Owner approved Zara's bounded second synthetic data-pipeline quality evidence task without customer data, database access, mutation, or external delivery.",
    "Owner approved Advik's bounded second synthetic systems-evaluation evidence task without adversarial execution, authority bypass, repository access, or production authority.",
  ] as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;
  readonly ownerId: string;
  readonly decisions:
    readonly EngineeringAIWorkforceSecondTaskExecutionDecisionOption[];
  readonly reasons: readonly string[];
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceCandidateSecondTaskExecutionDecision {
  readonly sequence:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8;
  readonly decisionState:
    "OWNER_ENGINEERING_CANDIDATE_SECOND_SYNTHETIC_TASK_EXECUTION_DECISION_RECORDED";
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly runtimeId: string;
  readonly sourceCandidateDecisionPreparationDigest:
    string;
  readonly taskSequence: 2;
  readonly scenarioId: string;
  readonly decision:
    EngineeringAIWorkforceSecondTaskExecutionDecisionOption;
  readonly secondTaskExecutionAuthorized:
    boolean;
  readonly secondTaskExecutionPerformed:
    false;
  readonly currentlyExecutable: boolean;
  readonly waitingForPriorCandidateOwnerReview:
    boolean;
  readonly retainedAtPreparationOnly:
    boolean;
  readonly reason: string;
  readonly reviewedPreparation: Readonly<{
    workstreamId:
      "routine-engineering-second-task-evidence";
    evidenceClass:
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE";
    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";
    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";
    executionMode: "SANDBOX_ONLY";
    evidenceToolMode: "READ_ONLY";
    draftToolMode: "DRAFT_ONLY";
    taskSequence: 2;
    concurrentTaskLimit: 1;
    failureThreshold: 1;
    ownerReviewFrequency:
      "AFTER_EVERY_SYNTHETIC_TASK";
    externalDeliveryMode: "DISABLED";
    productionMutationMode: "DISABLED";
    taskExecutionPerformed: false;
    evidenceCreated: false;
  }>;
  readonly authorityBoundary: Readonly<{
    canonicalDecisionPreparationBound:
      true;
    preparationIntegrityVerified: true;
    ownerIdentityBound: true;
    tenantIdentityBound: true;
    candidateIdentityBound: true;
    runtimeIdentityBound: true;
    approvalBypassAllowed: false;
    secondSyntheticTaskExecutionAuthorized:
      boolean;
    secondSyntheticTaskExecutionPerformed:
      false;
    thirdSyntheticTaskExecutionAuthorized:
      false;
    concurrentCandidateExecutionAuthorized:
      false;
    waitingForPriorCandidateOwnerReview:
      boolean;
    ownerReviewRequiredImmediatelyAfterExecution:
      true;
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
    levelThreeAuthorityGranted: false;
    productionReadinessAuthorized:
      false;
    publicLaunchAuthorized: false;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution:
      false;
    monitoringRequired: true;
    emergencyPauseAvailable: true;
    rollbackEvidenceRequired: true;
  }>;
  readonly candidateDecisionDigest: string;
}

export interface EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISIONS_RECORDED";
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest:
    string;
  readonly candidateDecisionCount: 8;
  readonly candidateDecisions:
    readonly EngineeringAIWorkforceCandidateSecondTaskExecutionDecision[];
  readonly aggregateSummary: Readonly<{
    preparedCandidateCount: 8;
    reviewedCandidateCount: 8;
    approvedSecondTaskCount: number;
    rejectedSecondTaskCount: number;
    secondTaskExecutionAuthorizedCount:
      number;
    secondTaskExecutionPerformedCount:
      0;
    currentlyExecutableCandidateCount:
      0 | 1;
    pendingAuthorizedCandidateCount:
      number;
    thirdTaskExecutionAuthorizedCount:
      0;
    maximumAuthorizedTaskCount:
      number;
    aggregateConcurrentExecutionLimit:
      1;
    ownerReviewRequiredAfterEveryExecutionCount:
      number;
    uniqueCandidateDecisionDigests:
      8;
  }>;
  readonly authorityBoundary: Readonly<{
    canonicalPreparationBound: true;
    canonicalPreparationIntegrityVerified:
      true;
    exactEightCandidateDecisionsRequired:
      true;
    ownerIdentityBound: true;
    tenantIdentityBound: true;
    ownerExecutionDecisionsRecorded:
      true;
    approvalBypassAllowed: false;
    secondSyntheticTaskExecutionAuthorized:
      boolean;
    secondSyntheticTaskExecutionAuthorizedCount:
      number;
    secondSyntheticTaskExecutionPerformedCount:
      0;
    onlyOneCandidateCurrentlyExecutable:
      boolean;
    sequentialExecutionRequired: true;
    aggregateConcurrentExecutionLimit:
      1;
    stopAfterEveryTaskForOwnerReview:
      true;
    stopOnFirstFailure: true;
    thirdSyntheticTaskExecutionAuthorized:
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
    levelThreeAuthorityGranted: false;
    productionReadinessAuthorized:
      false;
    publicLaunchAuthorized: false;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution:
      false;
    monitoringRequired: true;
    emergencyPauseAvailable: true;
    rollbackEvidenceRequired: true;
    ownerFinalAuthorityPreserved: true;
  }>;
  readonly nextStep:
    | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_ONE"
    | "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION";
  readonly decidedAt: string;
  readonly decisionDigest: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const FORBIDDEN_REASON_PATTERN =
  /(?:password|secret|token|api[\s_-]?key|private[\s_-]?key|credential)/i;

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
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireReason(
  reason: string,
): string {
  const normalized =
    reason.trim().replace(/\s+/g, " ");

  if (
    normalized.length < 40 ||
    normalized.length > 500 ||
    FORBIDDEN_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering second-task execution-decision reason is invalid or contains sensitive material.",
    );
  }

  return normalized;
}

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

function validatePreparationSource(): void {
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation(
    preparation,
  );

  if (
    preparation.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_RECORDED" ||
    preparation.candidateDecisionPreparationCount !==
      8 ||
    preparation.candidateDecisionPreparations.length !==
      8 ||
    preparation.ownerExecutionDecisionReviewRequired !==
      true ||
    preparation.ownerExecutionDecisionReviewRecorded !==
      false ||
    preparation.summary
      .ownerExecutionDecisionRecordedCount !==
      0 ||
    preparation.summary
      .secondTaskExecutionAuthorizedCount !==
      0 ||
    preparation.summary
      .secondTaskExecutedCount !==
      0 ||
    preparation.authorityBoundary
      .secondTaskExecutionAuthorized !==
      false ||
    preparation.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    preparation.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    preparation.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    preparation.authorityBoundary
      .productionDeploymentAuthorized !==
      false ||
    preparation.authorityBoundary
      .paymentExecutionAuthorized !==
      false ||
    preparation.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    preparation.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_REVIEW"
  ) {
    throw new Error(
      "Engineering second-task execution decisions require the canonical owner-review-pending preparation.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision,
): void {
  validatePreparationSource();

  requireIdentifier(
    "Engineering second-task execution decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Engineering second-task execution decision time",
    record.decidedAt,
  );

  if (
    !SHA256_PATTERN.test(
      record.decisionDigest,
    )
  ) {
    throw new Error(
      "Engineering second-task execution decision digest is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISIONS_RECORDED" ||
    record.tenantId !==
      preparation.tenantId ||
    record.ownerId !==
      preparation.ownerId ||
    record.sourcePreparationId !==
      preparation.preparationId ||
    record.sourcePreparationDigest !==
      preparation.preparationDigest ||
    record.candidateDecisionCount !==
      8 ||
    record.candidateDecisions.length !==
      8 ||
    Date.parse(record.decidedAt) <
      Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Engineering second-task execution-decision identity is invalid.",
    );
  }

  const approvedIndexes =
    record.candidateDecisions
      .map(
        (decision, index) =>
          decision.decision ===
          "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION"
            ? index
            : -1,
      )
      .filter((index) => index >= 0);

  const firstApprovedIndex =
    approvedIndexes.length > 0
      ? approvedIndexes[0]
      : -1;

  const decisionDigests =
    new Set(
      record.candidateDecisions.map(
        (decision) =>
          decision.candidateDecisionDigest,
      ),
    );

  if (decisionDigests.size !== 8) {
    throw new Error(
      "Engineering candidate second-task decision digests must remain unique.",
    );
  }

  record.candidateDecisions.forEach(
    (decision, index) => {
      const source =
        preparation
          .candidateDecisionPreparations[index];

      if (!source) {
        throw new Error(
          "Engineering candidate second-task preparation source is missing.",
        );
      }

      const approved =
        decision.decision ===
        "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION";

      const currentlyExecutable =
        approved &&
        index === firstApprovedIndex;

      const waiting =
        approved &&
        index > firstApprovedIndex;

      const reviewed =
        decision.reviewedPreparation;

      const boundary =
        decision.authorityBoundary;

      const {
        candidateDecisionDigest,
        ...decisionCore
      } = decision;

      if (
        !SHA256_PATTERN.test(
          candidateDecisionDigest,
        ) ||
        sha256(decisionCore) !==
          candidateDecisionDigest ||
        decision.sequence !== index + 1 ||
        decision.decisionState !==
          "OWNER_ENGINEERING_CANDIDATE_SECOND_SYNTHETIC_TASK_EXECUTION_DECISION_RECORDED" ||
        decision.employeeId !==
          source.employeeId ||
        decision.employeeCode !==
          source.employeeCode ||
        decision.publicName !==
          source.publicName ||
        decision.officialRole !==
          source.officialRole ||
        decision.runtimeId !==
          source.runtimeId ||
        decision.sourceCandidateDecisionPreparationDigest !==
          source.candidateDecisionPreparationDigest ||
        decision.taskSequence !== 2 ||
        decision.scenarioId !==
          source.scenarioId ||
        (
          decision.decision !==
            "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" &&
          decision.decision !==
            "REJECT_AND_RETAIN_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION"
        ) ||
        decision.secondTaskExecutionAuthorized !==
          approved ||
        decision.secondTaskExecutionPerformed !==
          false ||
        decision.currentlyExecutable !==
          currentlyExecutable ||
        decision.waitingForPriorCandidateOwnerReview !==
          waiting ||
        decision.retainedAtPreparationOnly !==
          !approved ||
        requireReason(decision.reason) !==
          decision.reason
      ) {
        throw new Error(
          "Engineering candidate second-task execution decision is invalid.",
        );
      }

      if (
        reviewed.workstreamId !==
          "routine-engineering-second-task-evidence" ||
        reviewed.evidenceClass !==
          "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" ||
        reviewed.dataClassification !==
          "SYNTHETIC_SANITIZED_ONLY" ||
        reviewed.actorClass !==
          "OWNER_SUPERVISED_INTERNAL_ONLY" ||
        reviewed.executionMode !==
          "SANDBOX_ONLY" ||
        reviewed.evidenceToolMode !==
          "READ_ONLY" ||
        reviewed.draftToolMode !==
          "DRAFT_ONLY" ||
        reviewed.taskSequence !== 2 ||
        reviewed.concurrentTaskLimit !==
          1 ||
        reviewed.failureThreshold !== 1 ||
        reviewed.ownerReviewFrequency !==
          "AFTER_EVERY_SYNTHETIC_TASK" ||
        reviewed.externalDeliveryMode !==
          "DISABLED" ||
        reviewed.productionMutationMode !==
          "DISABLED" ||
        reviewed.taskExecutionPerformed !==
          false ||
        reviewed.evidenceCreated !== false
      ) {
        throw new Error(
          "Engineering second-task reviewed preparation is invalid.",
        );
      }

      if (
        boundary.canonicalDecisionPreparationBound !==
          true ||
        boundary.preparationIntegrityVerified !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.candidateIdentityBound !==
          true ||
        boundary.runtimeIdentityBound !==
          true ||
        boundary.approvalBypassAllowed !==
          false ||
        boundary.secondSyntheticTaskExecutionAuthorized !==
          approved ||
        boundary.secondSyntheticTaskExecutionPerformed !==
          false ||
        boundary.thirdSyntheticTaskExecutionAuthorized !==
          false ||
        boundary.concurrentCandidateExecutionAuthorized !==
          false ||
        boundary.waitingForPriorCandidateOwnerReview !==
          waiting ||
        boundary.ownerReviewRequiredImmediatelyAfterExecution !==
          true ||
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
        boundary.levelThreeAuthorityGranted !==
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
        boundary.emergencyPauseAvailable !==
          true ||
        boundary.rollbackEvidenceRequired !==
          true
      ) {
        throw new Error(
          "Engineering candidate second-task execution authority boundary is invalid.",
        );
      }
    },
  );

  const approvedCount =
    approvedIndexes.length;

  const rejectedCount =
    8 - approvedCount;

  const summary =
    record.aggregateSummary;

  if (
    summary.preparedCandidateCount !==
      8 ||
    summary.reviewedCandidateCount !==
      8 ||
    summary.approvedSecondTaskCount !==
      approvedCount ||
    summary.rejectedSecondTaskCount !==
      rejectedCount ||
    summary.secondTaskExecutionAuthorizedCount !==
      approvedCount ||
    summary.secondTaskExecutionPerformedCount !==
      0 ||
    summary.currentlyExecutableCandidateCount !==
      (approvedCount > 0 ? 1 : 0) ||
    summary.pendingAuthorizedCandidateCount !==
      (
        approvedCount > 0
          ? approvedCount - 1
          : 0
      ) ||
    summary.thirdTaskExecutionAuthorizedCount !==
      0 ||
    summary.maximumAuthorizedTaskCount !==
      approvedCount ||
    summary.aggregateConcurrentExecutionLimit !==
      1 ||
    summary.ownerReviewRequiredAfterEveryExecutionCount !==
      approvedCount ||
    summary.uniqueCandidateDecisionDigests !==
      8
  ) {
    throw new Error(
      "Engineering second-task execution-decision aggregate summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalPreparationBound !==
      true ||
    boundary.canonicalPreparationIntegrityVerified !==
      true ||
    boundary.exactEightCandidateDecisionsRequired !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerExecutionDecisionsRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.secondSyntheticTaskExecutionAuthorized !==
      (approvedCount > 0) ||
    boundary.secondSyntheticTaskExecutionAuthorizedCount !==
      approvedCount ||
    boundary.secondSyntheticTaskExecutionPerformedCount !==
      0 ||
    boundary.onlyOneCandidateCurrentlyExecutable !==
      (approvedCount > 0) ||
    boundary.sequentialExecutionRequired !==
      true ||
    boundary.aggregateConcurrentExecutionLimit !==
      1 ||
    boundary.stopAfterEveryTaskForOwnerReview !==
      true ||
    boundary.stopOnFirstFailure !==
      true ||
    boundary.thirdSyntheticTaskExecutionAuthorized !==
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
    boundary.levelThreeAuthorityGranted !==
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
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true ||
    record.nextStep !==
      (
        approvedCount > 0
          ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_ONE"
          : "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION"
      )
  ) {
    throw new Error(
      "Engineering second-task execution-decision aggregate authority boundary is invalid.",
    );
  }

  const {
    decisionDigest,
    ...recordCore
  } = record;

  if (
    sha256(recordCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering second-task execution-decision integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.candidateDecisions,
    ) ||
    record.candidateDecisions.some(
      (decision) =>
        !Object.isFrozen(decision) ||
        !Object.isFrozen(
          decision.reviewedPreparation,
        ) ||
        !Object.isFrozen(
          decision.authorityBoundary,
        ),
    ) ||
    !Object.isFrozen(
      record.aggregateSummary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering second-task execution-decision record must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionInput,
): EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision {
  if (
    input.sourcePreparation !==
      preparation
  ) {
    throw new Error(
      "Only the canonical Engineering second-task decision preparation can receive owner execution decisions.",
    );
  }

  validatePreparationSource();

  requireIdentifier(
    "Engineering second-task execution decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Engineering second-task execution decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      preparation.ownerId
  ) {
    throw new Error(
      "Only the preparation-bound owner can issue Engineering second-task execution decisions.",
    );
  }

  if (
    input.decisions.length !== 8 ||
    input.reasons.length !== 8
  ) {
    throw new Error(
      "Exactly eight Engineering second-task execution decisions and reasons are required.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Engineering second-task execution decision cannot precede decision preparation.",
    );
  }

  const approvedIndexes =
    input.decisions
      .map(
        (decision, index) =>
          decision ===
          "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION"
            ? index
            : -1,
      )
      .filter((index) => index >= 0);

  const firstApprovedIndex =
    approvedIndexes.length > 0
      ? approvedIndexes[0]
      : -1;

  const candidateDecisions =
    preparation
      .candidateDecisionPreparations
      .map(
        (source, index) => {
          const selectedDecision =
            input.decisions[index];

          const inputReason =
            input.reasons[index];

          if (
            selectedDecision !==
              "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" &&
            selectedDecision !==
              "REJECT_AND_RETAIN_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION"
          ) {
            throw new Error(
              "Engineering candidate second-task execution decision is invalid.",
            );
          }

          if (!inputReason) {
            throw new Error(
              "Engineering candidate second-task execution-decision reason is required.",
            );
          }

          const reason =
            requireReason(inputReason);

          const approved =
            selectedDecision ===
            "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION";

          const currentlyExecutable =
            approved &&
            index === firstApprovedIndex;

          const waiting =
            approved &&
            index > firstApprovedIndex;

          const decisionCore = {
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
            decisionState:
              "OWNER_ENGINEERING_CANDIDATE_SECOND_SYNTHETIC_TASK_EXECUTION_DECISION_RECORDED" as const,
            employeeId:
              source.employeeId,
            employeeCode:
              source.employeeCode,
            publicName:
              source.publicName,
            officialRole:
              source.officialRole,
            runtimeId:
              source.runtimeId,
            sourceCandidateDecisionPreparationDigest:
              source.candidateDecisionPreparationDigest,
            taskSequence: 2 as const,
            scenarioId:
              source.scenarioId,
            decision:
              selectedDecision,
            secondTaskExecutionAuthorized:
              approved,
            secondTaskExecutionPerformed:
              false as const,
            currentlyExecutable,
            waitingForPriorCandidateOwnerReview:
              waiting,
            retainedAtPreparationOnly:
              !approved,
            reason,
            reviewedPreparation: {
              workstreamId:
                "routine-engineering-second-task-evidence" as const,
              evidenceClass:
                "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" as const,
              dataClassification:
                "SYNTHETIC_SANITIZED_ONLY" as const,
              actorClass:
                "OWNER_SUPERVISED_INTERNAL_ONLY" as const,
              executionMode:
                "SANDBOX_ONLY" as const,
              evidenceToolMode:
                "READ_ONLY" as const,
              draftToolMode:
                "DRAFT_ONLY" as const,
              taskSequence: 2 as const,
              concurrentTaskLimit:
                1 as const,
              failureThreshold: 1 as const,
              ownerReviewFrequency:
                "AFTER_EVERY_SYNTHETIC_TASK" as const,
              externalDeliveryMode:
                "DISABLED" as const,
              productionMutationMode:
                "DISABLED" as const,
              taskExecutionPerformed:
                false as const,
              evidenceCreated:
                false as const,
            },
            authorityBoundary: {
              canonicalDecisionPreparationBound:
                true as const,
              preparationIntegrityVerified:
                true as const,
              ownerIdentityBound:
                true as const,
              tenantIdentityBound:
                true as const,
              candidateIdentityBound:
                true as const,
              runtimeIdentityBound:
                true as const,
              approvalBypassAllowed:
                false as const,
              secondSyntheticTaskExecutionAuthorized:
                approved,
              secondSyntheticTaskExecutionPerformed:
                false as const,
              thirdSyntheticTaskExecutionAuthorized:
                false as const,
              concurrentCandidateExecutionAuthorized:
                false as const,
              waitingForPriorCandidateOwnerReview:
                waiting,
              ownerReviewRequiredImmediatelyAfterExecution:
                true as const,
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
            },
          };

          return deepFreeze({
            ...decisionCore,
            candidateDecisionDigest:
              sha256(decisionCore),
          });
        },
      ) as readonly EngineeringAIWorkforceCandidateSecondTaskExecutionDecision[];

  const approvedCount =
    approvedIndexes.length;

  const rejectedCount =
    8 - approvedCount;

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISIONS_RECORDED" as const,
    tenantId:
      preparation.tenantId,
    ownerId:
      input.ownerId,
    sourcePreparationId:
      preparation.preparationId,
    sourcePreparationDigest:
      preparation.preparationDigest,
    candidateDecisionCount:
      8 as const,
    candidateDecisions,
    aggregateSummary: {
      preparedCandidateCount:
        8 as const,
      reviewedCandidateCount:
        8 as const,
      approvedSecondTaskCount:
        approvedCount,
      rejectedSecondTaskCount:
        rejectedCount,
      secondTaskExecutionAuthorizedCount:
        approvedCount,
      secondTaskExecutionPerformedCount:
        0 as const,
      currentlyExecutableCandidateCount:
        (
          approvedCount > 0
            ? 1
            : 0
        ) as 0 | 1,
      pendingAuthorizedCandidateCount:
        approvedCount > 0
          ? approvedCount - 1
          : 0,
      thirdTaskExecutionAuthorizedCount:
        0 as const,
      maximumAuthorizedTaskCount:
        approvedCount,
      aggregateConcurrentExecutionLimit:
        1 as const,
      ownerReviewRequiredAfterEveryExecutionCount:
        approvedCount,
      uniqueCandidateDecisionDigests:
        8 as const,
    },
    authorityBoundary: {
      canonicalPreparationBound:
        true as const,
      canonicalPreparationIntegrityVerified:
        true as const,
      exactEightCandidateDecisionsRequired:
        true as const,
      ownerIdentityBound:
        true as const,
      tenantIdentityBound:
        true as const,
      ownerExecutionDecisionsRecorded:
        true as const,
      approvalBypassAllowed:
        false as const,
      secondSyntheticTaskExecutionAuthorized:
        approvedCount > 0,
      secondSyntheticTaskExecutionAuthorizedCount:
        approvedCount,
      secondSyntheticTaskExecutionPerformedCount:
        0 as const,
      onlyOneCandidateCurrentlyExecutable:
        approvedCount > 0,
      sequentialExecutionRequired:
        true as const,
      aggregateConcurrentExecutionLimit:
        1 as const,
      stopAfterEveryTaskForOwnerReview:
        true as const,
      stopOnFirstFailure:
        true as const,
      thirdSyntheticTaskExecutionAuthorized:
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
    nextStep:
      (
        approvedCount > 0
          ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_ONE"
          : "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION"
      ) as
        | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_ONE"
        | "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION",
    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,
      decisionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision;

  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION =
  createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision({
    decisionId:
      "engineering-ai-workforce-post-level-two-second-task-execution-decision-001",
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
    ownerId:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION.ownerId,
    decisions: [
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
    ],
    reasons:
      ENGINEERING_AI_WORKFORCE_SECOND_TASK_OWNER_APPROVAL_REASONS,
    decidedAt:
      "2026-08-02T03:32:00.000Z",
  });