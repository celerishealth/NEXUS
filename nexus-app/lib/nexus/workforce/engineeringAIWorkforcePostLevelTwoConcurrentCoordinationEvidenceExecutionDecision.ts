import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
  type EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionOption,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-execution-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_OWNER_APPROVAL_REASONS =
  [
    "Owner approved the bounded sequential-ownership-ledger synthetic evidence execution with deterministic ordering, immediate owner review afterward, and no concurrent Engineering work authority.",
    "Owner approved the bounded conflict-detection-and-resolution synthetic evidence execution with fail-closed conflict handling, immediate owner review afterward, and no repository authority.",
    "Owner approved the bounded tenant-isolation-coordination synthetic evidence execution with sanitized evidence only, immediate owner review afterward, and no customer or production access.",
    "Owner approved the bounded emergency-pause-protocol synthetic evidence execution with fail-closed pause proof, immediate owner review afterward, and no live operational authority.",
    "Owner approved the bounded rollback-coordination-protocol synthetic evidence execution with deterministic recovery evidence, immediate owner review afterward, and no production mutation.",
    "Owner approved the bounded monitoring-and-health-gates synthetic evidence execution with synthetic signals only, immediate owner review afterward, and no provider or deployment authority.",
    "Owner approved the bounded escalation-and-owner-review synthetic evidence execution with unresolved-state blocking, immediate owner review afterward, and final owner authority preserved.",
    "Owner approved the bounded independent-validation-and-audit synthetic evidence execution with immutable evidence checks, immediate owner review afterward, and no autonomous authority.",
  ] as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionInput {
  readonly decisionId:
    string;

  readonly sourcePreparation:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

  readonly ownerId:
    string;

  readonly decisions:
    readonly EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionOption[];

  readonly reasons:
    readonly string[];

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionCandidateDecision {
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
    "OWNER_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_RECORDED";

  readonly controlId:
    string;

  readonly sourceDecisionPreparationDigest:
    string;

  readonly decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionOption;

  readonly evidenceExecutionAuthorized:
    boolean;

  readonly evidenceExecutionPerformed:
    false;

  readonly currentlyExecutable:
    boolean;

  readonly waitingForPriorEvidenceOwnerReview:
    boolean;

  readonly retainedAtPreparationOnly:
    boolean;

  readonly reason:
    string;

  readonly reviewedPreparation: Readonly<{
    workstreamId:
      "controlled-concurrent-coordination-evidence";

    evidenceClass:
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE";

    controlId:
      string;

    executionMode:
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY";

    evidenceToolMode:
      "READ_ONLY_EVIDENCE_ONLY";

    maximumEvidenceExecutionCount:
      1;

    concurrentExecutionLimit:
      0;

    deterministicEvidenceRequired:
      true;

    independentValidationRequired:
      true;

    ownerReviewAfterExecutionRequired:
      true;

    monitoringRequired:
      true;

    emergencyPauseRequired:
      true;

    rollbackEvidenceRequired:
      true;

    evidenceExecutionPerformed:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalDecisionPreparationBound:
      true;

    preparationIntegrityVerified:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    controlIdentityBound:
      true;

    approvalBypassAllowed:
      false;

    concurrentCoordinationEvidenceExecutionAuthorized:
      boolean;

    concurrentCoordinationEvidenceExecutionPerformed:
      false;

    currentlyExecutable:
      boolean;

    waitingForPriorEvidenceOwnerReview:
      boolean;

    ownerReviewRequiredImmediatelyAfterExecution:
      true;

    monitoringRequired:
      true;

    emergencyPauseAvailable:
      true;

    rollbackEvidenceRequired:
      true;

    concurrentEngineeringWorkAuthorized:
      false;

    aggregateConcurrentEngineeringWorkLimit:
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

    productionDeploymentAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    levelThreeEvaluationAuthorized:
      false;

    levelThreeAuthorityGranted:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    founderLiberationAchieved:
      false;

    founderReleasedFromRoutineExecution:
      false;
  }>;

  readonly candidateDecisionDigest:
    string;
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
): string {
  const normalized =
    value.trim();

  if (
    normalized !== value ||
    normalized.length < 40 ||
    normalized.length > 1200 ||
    SENSITIVE_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision reason is invalid or contains sensitive material.",
    );
  }

  return normalized;
}

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

function validatePreparationSource(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
    preparation,
  );

  if (
    preparation.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED" ||
    preparation.evidenceDecisionPreparationCount !==
      8 ||
    preparation.evidenceDecisionPreparations.length !==
      8 ||
    preparation.ownerExecutionDecisionReviewRequired !==
      true ||
    preparation.ownerExecutionDecisionReviewRecorded !==
      false ||
    preparation.summary
      .ownerExecutionDecisionRecordedCount !==
      0 ||
    preparation.summary
      .evidenceExecutionAuthorizedCount !==
      0 ||
    preparation.summary
      .evidenceExecutionPerformedCount !==
      0 ||
    preparation.summary
      .concurrentEngineeringWorkAuthorizedCount !==
      0 ||
    preparation.authorityBoundary
      .concurrentCoordinationEvidenceExecutionAuthorized !==
      false ||
    preparation.authorityBoundary
      .concurrentCoordinationEvidenceExecutionPerformed !==
      false ||
    preparation.authorityBoundary
      .aggregateConcurrentExecutionLimit !==
      0 ||
    preparation.authorityBoundary
      .concurrentEngineeringWorkAuthorized !==
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
      .publicLaunchAuthorized !==
      false ||
    preparation.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_REVIEW"
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution decisions require the canonical owner-review-pending preparation.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decisions:
    readonly EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionDecisionOption[],
  reasons:
    readonly string[],
  decidedAt: string,
) {
  const approvedIndexes =
    decisions
      .map(
        (
          decision,
          index,
        ) =>
          decision ===
          "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION"
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
    preparation
      .evidenceDecisionPreparations
      .map(
        (
          source,
          index,
        ) => {
          const selectedDecision =
            decisions[index];

          const inputReason =
            reasons[index];

          if (
            !selectedDecision ||
            !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS.includes(
              selectedDecision,
            )
          ) {
            throw new Error(
              "Concurrent-coordination evidence execution decision is invalid.",
            );
          }

          if (!inputReason) {
            throw new Error(
              "Concurrent-coordination evidence execution-decision reason is required.",
            );
          }

          const reason =
            requireReason(
              inputReason,
            );

          const approved =
            selectedDecision ===
              "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION";

          const currentlyExecutable =
            approved &&
            index ===
              firstApprovedIndex;

          const waiting =
            approved &&
            index >
              firstApprovedIndex;

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
              "OWNER_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_RECORDED" as const,

            controlId:
              source.controlId,

            sourceDecisionPreparationDigest:
              source.decisionPreparationDigest,

            decision:
              selectedDecision,

            evidenceExecutionAuthorized:
              approved,

            evidenceExecutionPerformed:
              false as const,

            currentlyExecutable,

            waitingForPriorEvidenceOwnerReview:
              waiting,

            retainedAtPreparationOnly:
              !approved,

            reason,

            reviewedPreparation: {
              workstreamId:
                "controlled-concurrent-coordination-evidence" as const,

              evidenceClass:
                "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" as const,

              controlId:
                source.controlId,

              executionMode:
                source.executionMode,

              evidenceToolMode:
                source.evidenceToolMode,

              maximumEvidenceExecutionCount:
                source.maximumEvidenceExecutionCount,

              concurrentExecutionLimit:
                source.concurrentExecutionLimit,

              deterministicEvidenceRequired:
                source.deterministicEvidenceRequired,

              independentValidationRequired:
                source.independentValidationRequired,

              ownerReviewAfterExecutionRequired:
                source.ownerReviewAfterExecutionRequired,

              monitoringRequired:
                source.monitoringRequired,

              emergencyPauseRequired:
                source.emergencyPauseRequired,

              rollbackEvidenceRequired:
                source.rollbackEvidenceRequired,

              evidenceExecutionPerformed:
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

              controlIdentityBound:
                true as const,

              approvalBypassAllowed:
                false as const,

              concurrentCoordinationEvidenceExecutionAuthorized:
                approved,

              concurrentCoordinationEvidenceExecutionPerformed:
                false as const,

              currentlyExecutable,

              waitingForPriorEvidenceOwnerReview:
                waiting,

              ownerReviewRequiredImmediatelyAfterExecution:
                true as const,

              monitoringRequired:
                true as const,

              emergencyPauseAvailable:
                true as const,

              rollbackEvidenceRequired:
                true as const,

              concurrentEngineeringWorkAuthorized:
                false as const,

              aggregateConcurrentEngineeringWorkLimit:
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
            },
          };

          return deepFreeze({
            ...decisionCore,

            candidateDecisionDigest:
              sha256(
                decisionCore,
              ),
          });
        },
      ) as readonly EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionCandidateDecision[];

  const approvedCount =
    approvedIndexes.length;

  const rejectedCount =
    8 - approvedCount;

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISIONS_RECORDED" as const,

    tenantId:
      preparation.tenantId,

    ownerId,

    sourcePreparationId:
      preparation.preparationId,

    sourcePreparationDigest:
      preparation.preparationDigest,

    candidateDecisionCount:
      8 as const,

    candidateDecisions,

    aggregateSummary: {
      preparedEvidenceControlCount:
        8 as const,

      reviewedEvidenceControlCount:
        8 as const,

      approvedEvidenceExecutionCount:
        approvedCount,

      rejectedEvidenceExecutionCount:
        rejectedCount,

      evidenceExecutionAuthorizedCount:
        approvedCount,

      evidenceExecutionPerformedCount:
        0 as const,

      currentlyExecutableEvidenceCount:
        (
          approvedCount > 0
            ? 1
            : 0
        ) as 0 | 1,

      pendingAuthorizedEvidenceCount:
        approvedCount > 0
          ? approvedCount - 1
          : 0,

      concurrentEngineeringWorkAuthorizedCount:
        0 as const,

      aggregateEvidenceExecutionLimit:
        1 as const,

      aggregateConcurrentEngineeringWorkLimit:
        0 as const,

      ownerReviewRequiredAfterEveryEvidenceCount:
        approvedCount,

      uniqueCandidateDecisionDigests:
        8 as const,
    },

    authorityBoundary: {
      canonicalPreparationBound:
        true as const,

      canonicalPreparationIntegrityVerified:
        true as const,

      exactEightEvidenceExecutionDecisionsRequired:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerExecutionDecisionsRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      concurrentCoordinationEvidenceExecutionAuthorized:
        approvedCount > 0,

      concurrentCoordinationEvidenceExecutionAuthorizedCount:
        approvedCount,

      concurrentCoordinationEvidenceExecutionPerformedCount:
        0 as const,

      onlyOneEvidenceItemCurrentlyExecutable:
        approvedCount > 0,

      sequentialEvidenceExecutionRequired:
        true as const,

      aggregateEvidenceExecutionLimit:
        1 as const,

      stopAfterEveryEvidenceForOwnerReview:
        true as const,

      stopOnFirstFailure:
        true as const,

      concurrentEngineeringWorkAuthorized:
        false as const,

      aggregateConcurrentEngineeringWorkLimit:
        0 as const,

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
          ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE"
          : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION"
      ) as
        | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE"
        | "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION",

    decidedAt,
  };

  return deepFreeze({
    ...recordCore,

    decisionDigest:
      sha256(
        recordCore,
      ),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision =
  ReturnType<
    typeof buildDecision
  >;

function validateCandidateDecision(
  candidate:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceExecutionCandidateDecision,
  index: number,
  firstApprovedIndex: number,
): void {
  const source =
    preparation
      .evidenceDecisionPreparations[index];

  if (!source) {
    throw new Error(
      "Concurrent-coordination evidence decision source is missing.",
    );
  }

  const {
    candidateDecisionDigest,
    ...candidateCore
  } = candidate;

  const approved =
    candidate.decision ===
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION";

  const expectedCurrentlyExecutable =
    approved &&
    index ===
      firstApprovedIndex;

  const expectedWaiting =
    approved &&
    index >
      firstApprovedIndex;

  const reviewed =
    candidate.reviewedPreparation;

  const boundary =
    candidate.authorityBoundary;

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.concurrentCoordinationEvidenceExecutionPerformed,
    boundary.concurrentEngineeringWorkAuthorized,
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
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    !SHA256_PATTERN.test(
      candidateDecisionDigest,
    ) ||
    sha256(candidateCore) !==
      candidateDecisionDigest ||
    candidate.sequence !==
      index + 1 ||
    candidate.decisionState !==
      "OWNER_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_RECORDED" ||
    candidate.controlId !==
      source.controlId ||
    candidate.sourceDecisionPreparationDigest !==
      source.decisionPreparationDigest ||
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_OPTIONS.includes(
      candidate.decision,
    ) ||
    candidate.evidenceExecutionAuthorized !==
      approved ||
    candidate.evidenceExecutionPerformed !==
      false ||
    candidate.currentlyExecutable !==
      expectedCurrentlyExecutable ||
    candidate.waitingForPriorEvidenceOwnerReview !==
      expectedWaiting ||
    candidate.retainedAtPreparationOnly !==
      !approved ||
    candidate.reason.length <
      40 ||
    reviewed.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    reviewed.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    reviewed.controlId !==
      source.controlId ||
    reviewed.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    reviewed.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    reviewed.maximumEvidenceExecutionCount !==
      1 ||
    reviewed.concurrentExecutionLimit !==
      0 ||
    reviewed.deterministicEvidenceRequired !==
      true ||
    reviewed.independentValidationRequired !==
      true ||
    reviewed.ownerReviewAfterExecutionRequired !==
      true ||
    reviewed.monitoringRequired !==
      true ||
    reviewed.emergencyPauseRequired !==
      true ||
    reviewed.rollbackEvidenceRequired !==
      true ||
    reviewed.evidenceExecutionPerformed !==
      false ||
    boundary.canonicalDecisionPreparationBound !==
      true ||
    boundary.preparationIntegrityVerified !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.controlIdentityBound !==
      true ||
    boundary.concurrentCoordinationEvidenceExecutionAuthorized !==
      approved ||
    boundary.currentlyExecutable !==
      expectedCurrentlyExecutable ||
    boundary.waitingForPriorEvidenceOwnerReview !==
      expectedWaiting ||
    boundary.ownerReviewRequiredImmediatelyAfterExecution !==
      true ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.aggregateConcurrentEngineeringWorkLimit !==
      0 ||
    requiredFalse.some(
      (value) =>
        value !== false,
    ) ||
    !Object.isFrozen(candidate) ||
    !Object.isFrozen(
      reviewed,
    ) ||
    !Object.isFrozen(
      boundary,
    )
  ) {
    throw new Error(
      `Concurrent-coordination evidence execution decision ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision,
): void {
  validatePreparationSource();

  requireIdentifier(
    "Concurrent-coordination evidence execution decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination evidence execution decision time",
    record.decidedAt,
  );

  const {
    decisionDigest,
    ...recordCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      decisionDigest,
    ) ||
    sha256(recordCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISIONS_RECORDED" ||
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
      Date.parse(
        preparation.preparedAt,
      )
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision identity is invalid.",
    );
  }

  const approvedIndexes =
    record.candidateDecisions
      .map(
        (
          candidate,
          index,
        ) =>
          candidate
            .evidenceExecutionAuthorized
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

  record.candidateDecisions.forEach(
    (
      candidate,
      index,
    ) =>
      validateCandidateDecision(
        candidate,
        index,
        firstApprovedIndex,
      ),
  );

  if (
    new Set(
      record.candidateDecisions.map(
        (candidate) =>
          candidate
            .candidateDecisionDigest,
      ),
    ).size !==
      8 ||
    new Set(
      record.candidateDecisions.map(
        (candidate) =>
          candidate.controlId,
      ),
    ).size !==
      8
  ) {
    throw new Error(
      "Concurrent-coordination candidate decision evidence must remain unique.",
    );
  }

  const approvedCount =
    approvedIndexes.length;

  const rejectedCount =
    8 - approvedCount;

  const summary =
    record.aggregateSummary;

  if (
    summary.preparedEvidenceControlCount !==
      8 ||
    summary.reviewedEvidenceControlCount !==
      8 ||
    summary.approvedEvidenceExecutionCount !==
      approvedCount ||
    summary.rejectedEvidenceExecutionCount !==
      rejectedCount ||
    summary.evidenceExecutionAuthorizedCount !==
      approvedCount ||
    summary.evidenceExecutionPerformedCount !==
      0 ||
    summary.currentlyExecutableEvidenceCount !==
      (
        approvedCount > 0
          ? 1
          : 0
      ) ||
    summary.pendingAuthorizedEvidenceCount !==
      (
        approvedCount > 0
          ? approvedCount - 1
          : 0
      ) ||
    summary.concurrentEngineeringWorkAuthorizedCount !==
      0 ||
    summary.aggregateEvidenceExecutionLimit !==
      1 ||
    summary.aggregateConcurrentEngineeringWorkLimit !==
      0 ||
    summary.ownerReviewRequiredAfterEveryEvidenceCount !==
      approvedCount ||
    summary.uniqueCandidateDecisionDigests !==
      8
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalPreparationBound,
    boundary.canonicalPreparationIntegrityVerified,
    boundary.exactEightEvidenceExecutionDecisionsRequired,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.ownerExecutionDecisionsRecorded,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.stopAfterEveryEvidenceForOwnerReview,
    boundary.stopOnFirstFailure,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
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

  const expectedNextStep =
    approvedCount > 0
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION";

  if (
    boundary.concurrentCoordinationEvidenceExecutionAuthorized !==
      (
        approvedCount > 0
      ) ||
    boundary.concurrentCoordinationEvidenceExecutionAuthorizedCount !==
      approvedCount ||
    boundary.concurrentCoordinationEvidenceExecutionPerformedCount !==
      0 ||
    boundary.onlyOneEvidenceItemCurrentlyExecutable !==
      (
        approvedCount > 0
      ) ||
    boundary.aggregateEvidenceExecutionLimit !==
      1 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !==
      0 ||
    requiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    requiredFalse.some(
      (value) =>
        value !== false,
    ) ||
    record.nextStep !==
      expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.candidateDecisions,
    ) ||
    !Object.isFrozen(
      record.aggregateSummary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution-decision authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision {
  if (
    input.sourcePreparation !==
      preparation
  ) {
    throw new Error(
      "Only the canonical concurrent-coordination decision preparation can receive owner execution decisions.",
    );
  }

  validatePreparationSource();

  requireIdentifier(
    "Concurrent-coordination evidence execution decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination evidence execution decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      preparation.ownerId
  ) {
    throw new Error(
      "Only the preparation-bound NEXUS owner can issue concurrent-coordination evidence execution decisions.",
    );
  }

  if (
    input.decisions.length !==
      8 ||
    input.reasons.length !==
      8
  ) {
    throw new Error(
      "Exactly eight concurrent-coordination evidence execution decisions and reasons are required.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(
        preparation.preparedAt,
      )
  ) {
    throw new Error(
      "Concurrent-coordination evidence execution decision cannot precede decision preparation.",
    );
  }

  const record =
    buildDecision(
      input.decisionId,
      input.ownerId,
      input.decisions,
      input.reasons,
      input.decidedAt,
    );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
    record,
  );

  return record;
}