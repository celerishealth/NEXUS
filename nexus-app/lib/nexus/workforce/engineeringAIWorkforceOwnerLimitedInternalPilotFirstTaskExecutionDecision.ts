import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
  validateEngineeringAIWorkforceLimitedInternalPilotPreparation,
} from "./engineeringAIWorkforceLimitedInternalPilotPreparation";

export const ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-owner-limited-internal-pilot-first-task-execution-decision-v1" as const;

export type EngineeringAIWorkforceFirstTaskExecutionDecisionType =
  | "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION"
  | "REJECT_AND_RETAIN_PILOT_PREPARATION_ONLY";

export const ENGINEERING_AI_WORKFORCE_FIRST_TASK_EXECUTION_REASONS = [
  "Owner approved Ishaan's first bounded synthetic architecture pilot task while requiring owner review immediately afterward.",
  "Owner approved Leela's first bounded synthetic engineering-delivery pilot task while requiring owner review immediately afterward.",
  "Owner approved Vivaan's first bounded synthetic quality pilot task while requiring owner review immediately afterward.",
  "Owner approved Anaya's first bounded synthetic security pilot task while requiring owner review immediately afterward.",
  "Owner approved Atharv's first bounded synthetic reliability pilot task while requiring owner review immediately afterward.",
  "Owner approved Mahir's first bounded synthetic chaos-engineering pilot task while requiring owner review immediately afterward.",
  "Owner approved Zara's first bounded synthetic data-engineering pilot task while requiring owner review immediately afterward.",
  "Owner approved Advik's first bounded synthetic red-team pilot task while requiring owner review immediately afterward.",
] as const;

export interface CreateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecisionInput {
  readonly decisionId:
    string;

  readonly limitedInternalPilotPreparation:
    typeof ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION;

  readonly ownerId:
    string;

  readonly decisions:
    readonly EngineeringAIWorkforceFirstTaskExecutionDecisionType[];

  readonly reasons:
    readonly string[];

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceCandidateFirstTaskExecutionDecision {
  readonly developmentSequence:
    number;

  readonly executionSequence:
    number;

  readonly decisionState:
    "OWNER_ENGINEERING_CANDIDATE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_DECISION_RECORDED";

  readonly employeeId:
    string;

  readonly employeeCode:
    string;

  readonly publicName:
    string;

  readonly officialRole:
    string;

  readonly runtimeId:
    string;

  readonly sourceCandidatePreparationDigest:
    string;

  readonly taskSequence:
    1;

  readonly scenarioId:
    string;

  readonly decision:
    EngineeringAIWorkforceFirstTaskExecutionDecisionType;

  readonly firstTaskExecutionAuthorized:
    boolean;

  readonly firstTaskExecutionPerformed:
    false;

  readonly currentlyExecutable:
    boolean;

  readonly waitingForPriorCandidateOwnerReview:
    boolean;

  readonly retainedAtPreparationOnly:
    boolean;

  readonly reason:
    string;

  readonly reviewedPreparation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    evidenceToolMode:
      "READ_ONLY";

    draftToolMode:
      "DRAFT_ONLY";

    taskSequence:
      1;

    maximumTaskCount:
      3;

    remainingTaskCapacityBeforeExecution:
      3;

    projectedRemainingTaskCapacityAfterExecution:
      2;

    concurrentTaskLimit:
      1;

    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_PILOT_TASK";

    externalDeliveryMode:
      "DISABLED";

    productionMutationMode:
      "DISABLED";

    taskExecutionPerformed:
      false;

    pilotDraftCreated:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalPilotPreparationBound:
      true;

    preparationIntegrityVerified:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    candidateIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    approvalBypassAllowed:
      false;

    firstSyntheticPilotTaskExecutionAuthorized:
      boolean;

    firstSyntheticPilotTaskExecutionPerformed:
      false;

    secondSyntheticPilotTaskExecutionAuthorized:
      false;

    thirdSyntheticPilotTaskExecutionAuthorized:
      false;

    concurrentCandidateExecutionAuthorized:
      false;

    waitingForPriorCandidateOwnerReview:
      boolean;

    ownerReviewRequiredImmediatelyAfterExecution:
      true;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    monitoringRequired:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly candidateDecisionDigest:
    string;
}

export interface EngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISIONS_RECORDED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly sourcePreparationId:
    string;

  readonly sourcePreparationDigest:
    string;

  readonly candidateDecisionCount:
    8;

  readonly candidateDecisions:
    readonly EngineeringAIWorkforceCandidateFirstTaskExecutionDecision[];

  readonly aggregateSummary: Readonly<{
    preparedPilotCount:
      8;

    reviewedCandidateCount:
      8;

    approvedFirstTaskCount:
      number;

    rejectedFirstTaskCount:
      number;

    firstTaskExecutionAuthorizedCount:
      number;

    firstTaskExecutionPerformedCount:
      0;

    currentlyExecutableCandidateCount:
      number;

    pendingAuthorizedCandidateCount:
      number;

    secondTaskExecutionAuthorizedCount:
      0;

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
    canonicalPreparationBound:
      true;

    canonicalPreparationIntegrityVerified:
      true;

    exactEightCandidateDecisionsRequired:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    ownerExecutionDecisionsRecorded:
      true;

    approvalBypassAllowed:
      false;

    firstSyntheticPilotTaskExecutionAuthorized:
      boolean;

    firstSyntheticPilotTaskExecutionAuthorizedCount:
      number;

    firstSyntheticPilotTaskExecutionPerformedCount:
      0;

    onlyOneCandidateCurrentlyExecutable:
      boolean;

    sequentialExecutionRequired:
      true;

    aggregateConcurrentExecutionLimit:
      1;

    stopAfterEveryTaskForOwnerReview:
      true;

    stopOnFirstFailure:
      true;

    secondSyntheticPilotTaskExecutionAuthorized:
      false;

    thirdSyntheticPilotTaskExecutionAuthorized:
      false;

    remainingTaskExecutionAuthorizedCount:
      0;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    monitoringRequired:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_ONE"
    | "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_PREPARATIONS_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /(bearer\s+[a-z0-9._-]+|api[_-]?key|password|secret|access[_-]?token|refresh[_-]?token|session[_-]?id|authorization)/i;

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
      "Unsupported deterministic Engineering first-task execution-decision value.",
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
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid or credential-bearing.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireReason(
  reason: string,
): string {
  const normalized =
    reason.trim().replace(/\s+/g, " ");

  if (
    normalized.length < 24 ||
    normalized.length > 360 ||
    FORBIDDEN_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering first-task execution-decision reason is invalid or contains secret-bearing content.",
    );
  }

  return normalized;
}

function validatePreparationSource(): void {
  validateEngineeringAIWorkforceLimitedInternalPilotPreparation(
    ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
  );

  const preparation =
    ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION;

  if (
    preparation.preparationState !==
      "ENGINEERING_LIMITED_INTERNAL_PILOTS_PREPARED" ||
    preparation.candidatePreparations.length !==
      8 ||
    preparation.aggregateSummary
      .preparedPilotCount !==
        8 ||
    preparation.aggregateSummary
      .pilotExecutionEligibleCount !==
        0 ||
    preparation.aggregateSummary
      .pilotExecutionAuthorizedCount !==
        0 ||
    preparation.aggregateSummary
      .pilotTaskExecutedCount !==
        0 ||
    preparation.aggregateSummary
      .pilotDraftCreatedCount !==
        0 ||
    preparation.authorityBoundary
      .limitedInternalPilotExecutionAuthorized !==
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
      .realCustomerContactAuthorized !==
        false ||
    preparation.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    preparation.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS"
  ) {
    throw new Error(
      "Engineering first-task execution decisions require the canonical prepared pilot state.",
    );
  }
}

export function validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
  record:
    EngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
): void {
  validatePreparationSource();

  requireIdentifier(
    "Engineering first-task execution decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Engineering first-task execution decision time",
    record.decidedAt,
  );

  requireDigest(
    "Engineering first-task execution decision digest",
    record.decisionDigest,
  );

  const preparation =
    ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION;

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISIONS_RECORDED" ||
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
      8
  ) {
    throw new Error(
      "Engineering first-task execution-decision identity is invalid.",
    );
  }

  const approvedIndexes =
    record.candidateDecisions
      .map(
        (
          decision,
          index,
        ) =>
          decision.decision ===
            "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION"
            ? index
            : -1,
      )
      .filter(
        (index) =>
          index >= 0,
      );

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
      "Engineering candidate first-task decision digests must remain unique.",
    );
  }

  record.candidateDecisions.forEach(
    (
      decision,
      index,
    ) => {
      const source =
        preparation.candidatePreparations[index];

      if (!source) {
        throw new Error(
          "Engineering candidate pilot preparation source is missing.",
        );
      }

      requireDigest(
        "Engineering candidate first-task execution decision digest",
        decision.candidateDecisionDigest,
      );

      const approved =
        decision.decision ===
          "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

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
        sha256(decisionCore) !==
          candidateDecisionDigest ||
        decision.developmentSequence !==
          index + 1 ||
        decision.executionSequence !==
          index + 1 ||
        decision.decisionState !==
          "OWNER_ENGINEERING_CANDIDATE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_DECISION_RECORDED" ||
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
        decision.sourceCandidatePreparationDigest !==
          source.candidatePreparationDigest ||
        decision.taskSequence !==
          1 ||
        decision.scenarioId !==
          source.pilotPlan.scenarios[0] ||
        (
          decision.decision !==
            "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" &&
          decision.decision !==
            "REJECT_AND_RETAIN_PILOT_PREPARATION_ONLY"
        ) ||
        decision.firstTaskExecutionAuthorized !==
          approved ||
        decision.firstTaskExecutionPerformed !==
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
          "Engineering candidate first-task execution decision is invalid.",
        );
      }

      if (
        reviewed.pilotClass !==
          "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
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
        reviewed.taskSequence !==
          1 ||
        reviewed.maximumTaskCount !==
          3 ||
        reviewed.remainingTaskCapacityBeforeExecution !==
          3 ||
        reviewed.projectedRemainingTaskCapacityAfterExecution !==
          2 ||
        reviewed.concurrentTaskLimit !==
          1 ||
        reviewed.failureThreshold !==
          1 ||
        reviewed.ownerReviewFrequency !==
          "AFTER_EVERY_PILOT_TASK" ||
        reviewed.externalDeliveryMode !==
          "DISABLED" ||
        reviewed.productionMutationMode !==
          "DISABLED" ||
        reviewed.taskExecutionPerformed !==
          false ||
        reviewed.pilotDraftCreated !==
          false
      ) {
        throw new Error(
          "Engineering first-task reviewed preparation is invalid.",
        );
      }

      if (
        boundary.canonicalPilotPreparationBound !==
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
        boundary.firstSyntheticPilotTaskExecutionAuthorized !==
          approved ||
        boundary.firstSyntheticPilotTaskExecutionPerformed !==
          false ||
        boundary.secondSyntheticPilotTaskExecutionAuthorized !==
          false ||
        boundary.thirdSyntheticPilotTaskExecutionAuthorized !==
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
        boundary.mergeAuthorized !==
          false ||
        boundary.productionDeploymentAuthorized !==
          false ||
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
        boundary.monitoringRequired !==
          true ||
        boundary.emergencyPauseAvailable !==
          true
      ) {
        throw new Error(
          "Engineering candidate first-task execution authority boundary is invalid.",
        );
      }
    },
  );

  const approvedCount =
    approvedIndexes.length;

  const rejectedCount =
    8 - approvedCount;

  const currentlyExecutableCount =
    approvedCount > 0
      ? 1
      : 0;

  const pendingAuthorizedCount =
    approvedCount > 0
      ? approvedCount - 1
      : 0;

  const summary =
    record.aggregateSummary;

  if (
    summary.preparedPilotCount !==
      8 ||
    summary.reviewedCandidateCount !==
      8 ||
    summary.approvedFirstTaskCount !==
      approvedCount ||
    summary.rejectedFirstTaskCount !==
      rejectedCount ||
    summary.firstTaskExecutionAuthorizedCount !==
      approvedCount ||
    summary.firstTaskExecutionPerformedCount !==
      0 ||
    summary.currentlyExecutableCandidateCount !==
      currentlyExecutableCount ||
    summary.pendingAuthorizedCandidateCount !==
      pendingAuthorizedCount ||
    summary.secondTaskExecutionAuthorizedCount !==
      0 ||
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
      "Engineering first-task execution-decision aggregate summary is invalid.",
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
    boundary.firstSyntheticPilotTaskExecutionAuthorized !==
      (approvedCount > 0) ||
    boundary.firstSyntheticPilotTaskExecutionAuthorizedCount !==
      approvedCount ||
    boundary.firstSyntheticPilotTaskExecutionPerformedCount !==
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
    boundary.secondSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.thirdSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.remainingTaskExecutionAuthorizedCount !==
      0 ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
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
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    record.nextStep !==
      (
        approvedCount > 0
          ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_ONE"
          : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_PREPARATIONS_ONLY"
      )
  ) {
    throw new Error(
      "Engineering first-task execution-decision aggregate authority boundary is invalid.",
    );
  }

  if (
    Date.parse(record.decidedAt) <
    Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Engineering first-task execution decision cannot precede pilot preparation.",
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
      "Engineering first-task execution-decision integrity is invalid.",
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
      "Engineering first-task execution-decision record must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
  input:
    CreateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecisionInput,
): EngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision {
  if (
    input.limitedInternalPilotPreparation !==
      ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
  ) {
    throw new Error(
      "Only the canonical Engineering limited-internal-pilot preparation can receive first-task execution decisions.",
    );
  }

  validatePreparationSource();

  requireIdentifier(
    "Engineering first-task execution decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Engineering first-task execution decision time",
    input.decidedAt,
  );

  const preparation =
    input.limitedInternalPilotPreparation;

  if (
    input.ownerId !==
      preparation.ownerId
  ) {
    throw new Error(
      "Only the Engineering pilot-preparation-bound owner can issue first-task execution decisions.",
    );
  }

  if (
    input.decisions.length !==
      8 ||
    input.reasons.length !==
      8
  ) {
    throw new Error(
      "Exactly eight Engineering first-task execution decisions and reasons are required.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Engineering first-task execution decision cannot precede pilot preparation.",
    );
  }

  const approvedIndexes =
    input.decisions
      .map(
        (
          decision,
          index,
        ) =>
          decision ===
            "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION"
            ? index
            : -1,
      )
      .filter(
        (index) =>
          index >= 0,
      );

  const firstApprovedIndex =
    approvedIndexes.length > 0
      ? approvedIndexes[0]
      : -1;

  const candidateDecisions =
    preparation.candidatePreparations.map(
      (
        source,
        index,
      ) => {
        const selectedDecision =
          input.decisions[index];

        const inputReason =
          input.reasons[index];

        if (
          selectedDecision !==
            "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" &&
          selectedDecision !==
            "REJECT_AND_RETAIN_PILOT_PREPARATION_ONLY"
        ) {
          throw new Error(
            "Engineering candidate first-task execution decision is invalid.",
          );
        }

        if (!inputReason) {
          throw new Error(
            "Engineering candidate first-task execution-decision reason is required.",
          );
        }

        const reason =
          requireReason(inputReason);

        const approved =
          selectedDecision ===
            "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

        const currentlyExecutable =
          approved &&
          index === firstApprovedIndex;

        const waiting =
          approved &&
          index > firstApprovedIndex;

        const decisionCore = {
          developmentSequence:
            index + 1,

          executionSequence:
            index + 1,

          decisionState:
            "OWNER_ENGINEERING_CANDIDATE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_DECISION_RECORDED" as const,

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

          sourceCandidatePreparationDigest:
            source.candidatePreparationDigest,

          taskSequence:
            1 as const,

          scenarioId:
            source.pilotPlan.scenarios[0] ?? "",

          decision:
            selectedDecision,

          firstTaskExecutionAuthorized:
            approved,

          firstTaskExecutionPerformed:
            false as const,

          currentlyExecutable,

          waitingForPriorCandidateOwnerReview:
            waiting,

          retainedAtPreparationOnly:
            !approved,

          reason,

          reviewedPreparation: {
            pilotClass:
              "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

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

            taskSequence:
              1 as const,

            maximumTaskCount:
              3 as const,

            remainingTaskCapacityBeforeExecution:
              3 as const,

            projectedRemainingTaskCapacityAfterExecution:
              2 as const,

            concurrentTaskLimit:
              1 as const,

            failureThreshold:
              1 as const,

            ownerReviewFrequency:
              "AFTER_EVERY_PILOT_TASK" as const,

            externalDeliveryMode:
              "DISABLED" as const,

            productionMutationMode:
              "DISABLED" as const,

            taskExecutionPerformed:
              false as const,

            pilotDraftCreated:
              false as const,
          },

          authorityBoundary: {
            canonicalPilotPreparationBound:
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

            firstSyntheticPilotTaskExecutionAuthorized:
              approved,

            firstSyntheticPilotTaskExecutionPerformed:
              false as const,

            secondSyntheticPilotTaskExecutionAuthorized:
              false as const,

            thirdSyntheticPilotTaskExecutionAuthorized:
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

            productionDeploymentAuthorized:
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

            monitoringRequired:
              true as const,

            emergencyPauseAvailable:
              true as const,
          },
        };

        return deepFreeze({
          ...decisionCore,

          candidateDecisionDigest:
            sha256(decisionCore),
        });
      },
    );

  const approvedCount =
    approvedIndexes.length;

  const rejectedCount =
    8 - approvedCount;

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISIONS_RECORDED" as const,

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
      preparedPilotCount:
        8 as const,

      reviewedCandidateCount:
        8 as const,

      approvedFirstTaskCount:
        approvedCount,

      rejectedFirstTaskCount:
        rejectedCount,

      firstTaskExecutionAuthorizedCount:
        approvedCount,

      firstTaskExecutionPerformedCount:
        0 as const,

      currentlyExecutableCandidateCount:
        approvedCount > 0
          ? 1
          : 0,

      pendingAuthorizedCandidateCount:
        approvedCount > 0
          ? approvedCount - 1
          : 0,

      secondTaskExecutionAuthorizedCount:
        0 as const,

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

      firstSyntheticPilotTaskExecutionAuthorized:
        approvedCount > 0,

      firstSyntheticPilotTaskExecutionAuthorizedCount:
        approvedCount,

      firstSyntheticPilotTaskExecutionPerformedCount:
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

      secondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      thirdSyntheticPilotTaskExecutionAuthorized:
        false as const,

      remainingTaskExecutionAuthorizedCount:
        0 as const,

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

      productionDeploymentAuthorized:
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

      monitoringRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      (
        approvedCount > 0
          ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_ONE"
          : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_PREPARATIONS_ONLY"
      ) as
        | "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_ONE"
        | "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_PREPARATIONS_ONLY",

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      decisionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision;

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION =
  createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
    decisionId:
      "engineering-ai-workforce-owner-first-task-execution-decision-001",

    limitedInternalPilotPreparation:
      ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,

    ownerId:
      ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION.ownerId,

    decisions: [
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
      "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
    ],

    reasons:
      ENGINEERING_AI_WORKFORCE_FIRST_TASK_EXECUTION_REASONS,

    decidedAt:
      "2026-07-23T14:15:32.275Z",
  });
