import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-four-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceFourOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceFourOwnerReviewDecisionType;
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
    normalized.length > 1200 ||
    SENSITIVE_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-four owner-review reason is invalid or contains sensitive material.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.evidenceSequence !== 4 ||
    execution.controlId !== "EMERGENCY_PAUSE_PROTOCOL" ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evaluatedPauseCaseCount !== 4 ||
    execution.evidence.requiredPauseCaseCount !== 4 ||
    execution.evidence.activatedPauseCaseCount !== 4 ||
    execution.evidence.blockedUnauthorizedResumeCaseCount !== 1 ||
    execution.evidence.operationsAllowedAfterPauseCount !== 0 ||
    execution.evidence.unauthorizedResumeAllowedCount !== 0 ||
    execution.evidence.ownerPauseCommandVerified !== true ||
    execution.evidence.monitoringTriggeredPauseVerified !== true ||
    execution.evidence.conflictTriggeredPauseVerified !== true ||
    execution.evidence.unauthorizedResumeBlocked !== true ||
    execution.evidence.pausedStatePreserved !== true ||
    execution.evidence.resumeRequiresSeparateOwnerApproval !== true ||
    execution.evidence.ownerFinalAuthorityPreserved !== true ||
    execution.evidence.failClosedOnPauseFailure !== true ||
    execution.evidence.pauseSignalIntegrityVerified !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary.ownerReviewRequiredImmediatelyAfterExecution !==
      true ||
    execution.authorityBoundary.sequenceFiveEvidenceExecutionAuthorized !==
      false ||
    execution.authorityBoundary.resumeAuthorizationGranted !== false ||
    execution.authorityBoundary.concurrentEngineeringWorkAuthorized !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.repositoryWriteAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical concurrent-coordination sequence-four execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceFourOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW_RECORDED" as const,
    tenantId: execution.tenantId,
    ownerId,
    sourceExecutionId: execution.executionId,
    sourceExecutionDigest: execution.executionDigest,
    sourceExecutionDecisionId:
      execution.sourceExecutionDecisionId,
    sourceExecutionDecisionDigest:
      execution.sourceExecutionDecisionDigest,
    sourceCandidateDecisionDigest:
      execution.sourceCandidateDecisionDigest,
    sourceSequenceThreeOwnerReviewDecisionId:
      execution.sourceOwnerReviewDecisionId,
    sourceSequenceThreeOwnerReviewDecisionDigest:
      execution.sourceOwnerReviewDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 4 as const,
    controlId:
      "EMERGENCY_PAUSE_PROTOCOL" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceFourOwnerReviewRecorded: true as const,
    sequenceFourClosed: approved,
    reviewedExecution: {
      executionState: execution.executionState,
      executionMode: execution.executionMode,
      evidenceToolMode: execution.evidenceToolMode,
      syntheticSanitizedEvidenceOnly:
        execution.syntheticSanitizedEvidenceOnly,
      evidenceExecutionAuthorized:
        execution.evidenceExecutionAuthorized,
      evidenceExecutionPerformed:
        execution.evidenceExecutionPerformed,
      evidenceCreated: execution.evidenceCreated,
      evidenceType: execution.evidence.evidenceType,
      evaluatedPauseCaseCount:
        execution.evidence.evaluatedPauseCaseCount,
      requiredPauseCaseCount:
        execution.evidence.requiredPauseCaseCount,
      activatedPauseCaseCount:
        execution.evidence.activatedPauseCaseCount,
      blockedUnauthorizedResumeCaseCount:
        execution.evidence.blockedUnauthorizedResumeCaseCount,
      operationsAllowedAfterPauseCount:
        execution.evidence.operationsAllowedAfterPauseCount,
      unauthorizedResumeAllowedCount:
        execution.evidence.unauthorizedResumeAllowedCount,
      ownerPauseCommandVerified:
        execution.evidence.ownerPauseCommandVerified,
      monitoringTriggeredPauseVerified:
        execution.evidence.monitoringTriggeredPauseVerified,
      conflictTriggeredPauseVerified:
        execution.evidence.conflictTriggeredPauseVerified,
      unauthorizedResumeBlocked:
        execution.evidence.unauthorizedResumeBlocked,
      pausedStatePreserved:
        execution.evidence.pausedStatePreserved,
      resumeRequiresSeparateOwnerApproval:
        execution.evidence.resumeRequiresSeparateOwnerApproval,
      ownerFinalAuthorityPreserved:
        execution.evidence.ownerFinalAuthorityPreserved,
      failClosedOnPauseFailure:
        execution.evidence.failClosedOnPauseFailure,
      pauseSignalIntegrityVerified:
        execution.evidence.pauseSignalIntegrityVerified,
      monitoringStatus:
        execution.evidence.monitoringStatus,
      independentValidationStatus:
        execution.evidence.independentValidationStatus,
      rollbackMarkerRecorded:
        execution.evidence.rollbackMarkerRecorded,
      evidenceDigest:
        execution.evidence.evidenceDigest,
    },
    authorityBoundary: {
      canonicalExecutionBound: true as const,
      sourceExecutionIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      ownerReviewRecorded: true as const,
      approvalBypassAllowed: false as const,
      sequenceFourExecutionAccepted: approved,
      sequenceFourEvidenceAccepted: approved,
      sequenceFourClosed: approved,
      sequenceFiveEvidenceExecutionAuthorized: approved,
      sequenceFiveEvidenceExecutionPerformed: false as const,
      onlySequenceFiveAuthorizedNext: approved,
      emergencyPauseEvidenceAccepted: approved,
      resumeAuthorizationGranted: false as const,
      concurrentEngineeringWorkAuthorized: false as const,
      aggregateConcurrentEngineeringWorkLimit: 0 as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
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
      levelThreeEvaluationAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      productionReadinessAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineExecution: false as const,
      monitoringRequired: true as const,
      emergencyPauseAvailable: true as const,
      rollbackEvidenceRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: (
      approved
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-four owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-four owner-review decision time",
    record.decidedAt,
  );

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-four owner-review decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW_RECORDED" ||
    record.tenantId !== execution.tenantId ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionId !== execution.executionId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.sourceExecutionDecisionId !==
      execution.sourceExecutionDecisionId ||
    record.sourceExecutionDecisionDigest !==
      execution.sourceExecutionDecisionDigest ||
    record.sourceCandidateDecisionDigest !==
      execution.sourceCandidateDecisionDigest ||
    record.sourceSequenceThreeOwnerReviewDecisionId !==
      execution.sourceOwnerReviewDecisionId ||
    record.sourceSequenceThreeOwnerReviewDecisionDigest !==
      execution.sourceOwnerReviewDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 4 ||
    record.controlId !== "EMERGENCY_PAUSE_PROTOCOL" ||
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceFourOwnerReviewRecorded !== true ||
    record.sequenceFourClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-four owner-review decision identity is invalid.",
    );
  }

  requireReason(record.reason);

  const reviewed = record.reviewedExecution;

  if (
    reviewed.executionState !== execution.executionState ||
    reviewed.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    reviewed.evidenceToolMode !== "READ_ONLY_EVIDENCE_ONLY" ||
    reviewed.syntheticSanitizedEvidenceOnly !== true ||
    reviewed.evidenceExecutionAuthorized !== true ||
    reviewed.evidenceExecutionPerformed !== true ||
    reviewed.evidenceCreated !== true ||
    reviewed.evidenceType !==
      "EMERGENCY_PAUSE_PROTOCOL_EXECUTION_EVIDENCE" ||
    reviewed.evaluatedPauseCaseCount !== 4 ||
    reviewed.requiredPauseCaseCount !== 4 ||
    reviewed.activatedPauseCaseCount !== 4 ||
    reviewed.blockedUnauthorizedResumeCaseCount !== 1 ||
    reviewed.operationsAllowedAfterPauseCount !== 0 ||
    reviewed.unauthorizedResumeAllowedCount !== 0 ||
    reviewed.ownerPauseCommandVerified !== true ||
    reviewed.monitoringTriggeredPauseVerified !== true ||
    reviewed.conflictTriggeredPauseVerified !== true ||
    reviewed.unauthorizedResumeBlocked !== true ||
    reviewed.pausedStatePreserved !== true ||
    reviewed.resumeRequiresSeparateOwnerApproval !== true ||
    reviewed.ownerFinalAuthorityPreserved !== true ||
    reviewed.failClosedOnPauseFailure !== true ||
    reviewed.pauseSignalIntegrityVerified !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.rollbackMarkerRecorded !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-four reviewed execution evidence is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.ownerReviewRecorded,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.sequenceFiveEvidenceExecutionPerformed,
    boundary.resumeAuthorizationGranted,
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

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceFourExecutionAccepted !== approved ||
    boundary.sequenceFourEvidenceAccepted !== approved ||
    boundary.sequenceFourClosed !== approved ||
    boundary.sequenceFiveEvidenceExecutionAuthorized !== approved ||
    boundary.onlySequenceFiveAuthorizedNext !== approved ||
    boundary.emergencyPauseEvidenceAccepted !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-four owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical concurrent-coordination sequence-four execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-four owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-four owner-review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence-four evidence.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Concurrent-coordination sequence-four owner-review decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error(
      "Concurrent-coordination sequence-four owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision(
    record,
  );

  return record;
}