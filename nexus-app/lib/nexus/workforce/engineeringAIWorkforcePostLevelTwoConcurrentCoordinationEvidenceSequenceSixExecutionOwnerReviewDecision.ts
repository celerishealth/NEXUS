import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-six-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceSixOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceSixOwnerReviewDecisionType;
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
      "Concurrent-coordination sequence-six owner-review reason is invalid.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution(
    execution,
  );

  if (
    execution.evidenceSequence !== 6 ||
    execution.controlId !== "MONITORING_AND_HEALTH_GATES" ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evaluatedHealthGateCaseCount !== 5 ||
    execution.evidence.healthyBaselineCaseCount !== 1 ||
    execution.evidence.thresholdBreachCaseCount !== 4 ||
    execution.evidence.blockedBreachCaseCount !== 4 ||
    execution.evidence.undetectedBreachCount !== 0 ||
    execution.evidence.unauthorizedProgressionCount !== 0 ||
    execution.evidence.emergencyPauseActivationCount !== 4 ||
    execution.evidence.ownerEscalationCount !== 4 ||
    execution.evidence.allSyntheticBreachesDetected !== true ||
    execution.evidence.allUnsafeProgressionBlocked !== true ||
    execution.evidence.failClosedMonitoringVerified !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary.sequenceSevenEvidenceExecutionAuthorized !==
      false ||
    execution.authorityBoundary.concurrentEngineeringWorkAuthorized !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.repositoryWriteAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical sequence-six monitoring evidence is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceSixOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW_RECORDED" as const,
    tenantId: execution.tenantId,
    ownerId,
    sourceExecutionId: execution.executionId,
    sourceExecutionDigest: execution.executionDigest,
    sourceCheckpointDigest: execution.sourceCheckpointDigest,
    sourceSequenceFiveOwnerReviewDecisionId:
      execution.sourceSequenceFiveOwnerReviewDecisionId,
    sourceSequenceFiveOwnerReviewDecisionDigest:
      execution.sourceSequenceFiveOwnerReviewDecisionDigest,
    sourceCandidateSixDecisionDigest:
      execution.sourceCandidateSixDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 6 as const,
    controlId: "MONITORING_AND_HEALTH_GATES" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceSixOwnerReviewRecorded: true as const,
    sequenceSixClosed: approved,
    reviewedEvidence: {
      evidenceType: execution.evidence.evidenceType,
      evaluatedHealthGateCaseCount:
        execution.evidence.evaluatedHealthGateCaseCount,
      healthyBaselineCaseCount:
        execution.evidence.healthyBaselineCaseCount,
      thresholdBreachCaseCount:
        execution.evidence.thresholdBreachCaseCount,
      blockedBreachCaseCount:
        execution.evidence.blockedBreachCaseCount,
      undetectedBreachCount:
        execution.evidence.undetectedBreachCount,
      unauthorizedProgressionCount:
        execution.evidence.unauthorizedProgressionCount,
      emergencyPauseActivationCount:
        execution.evidence.emergencyPauseActivationCount,
      ownerEscalationCount:
        execution.evidence.ownerEscalationCount,
      heartbeatGateVerified:
        execution.evidence.heartbeatGateVerified,
      errorRateGateVerified:
        execution.evidence.errorRateGateVerified,
      queueBacklogGateVerified:
        execution.evidence.queueBacklogGateVerified,
      auditPipelineGateVerified:
        execution.evidence.auditPipelineGateVerified,
      tenantIsolationHealthGateVerified:
        execution.evidence.tenantIsolationHealthGateVerified,
      allSyntheticBreachesDetected:
        execution.evidence.allSyntheticBreachesDetected,
      allUnsafeProgressionBlocked:
        execution.evidence.allUnsafeProgressionBlocked,
      deterministicEvaluationVerified:
        execution.evidence.deterministicEvaluationVerified,
      failClosedMonitoringVerified:
        execution.evidence.failClosedMonitoringVerified,
      monitoringStatus: execution.evidence.monitoringStatus,
      independentValidationStatus:
        execution.evidence.independentValidationStatus,
      emergencyPauseAvailable:
        execution.evidence.emergencyPauseAvailable,
      evidenceDigest: execution.evidence.evidenceDigest,
    },
    authorityBoundary: {
      canonicalExecutionBound: true as const,
      sourceExecutionIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      ownerReviewRecorded: true as const,
      approvalBypassAllowed: false as const,
      sequenceSixExecutionAccepted: approved,
      sequenceSixEvidenceAccepted: approved,
      sequenceSixClosed: approved,
      sequenceSevenEvidenceExecutionAuthorized: approved,
      sequenceSevenEvidenceExecutionPerformed: false as const,
      onlySequenceSevenAuthorizedNext: approved,
      monitoringAndHealthGatesEvidenceAccepted: approved,
      unsafeHealthProgressionAuthorized: false as const,
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
      monitoringPassed: true as const,
      emergencyPauseAvailable: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: (
      approved
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-six owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-six owner-review decision time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six owner-review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW_RECORDED" ||
    record.tenantId !== execution.tenantId ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionId !== execution.executionId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.sourceCheckpointDigest !== execution.sourceCheckpointDigest ||
    record.sourceSequenceFiveOwnerReviewDecisionId !==
      execution.sourceSequenceFiveOwnerReviewDecisionId ||
    record.sourceSequenceFiveOwnerReviewDecisionDigest !==
      execution.sourceSequenceFiveOwnerReviewDecisionDigest ||
    record.sourceCandidateSixDecisionDigest !==
      execution.sourceCandidateSixDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 6 ||
    record.controlId !== "MONITORING_AND_HEALTH_GATES" ||
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceSixOwnerReviewRecorded !== true ||
    record.sequenceSixClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six owner-review identity is invalid.",
    );
  }

  const reviewed = record.reviewedEvidence;

  if (
    reviewed.evidenceType !==
      "MONITORING_AND_HEALTH_GATES_EXECUTION_EVIDENCE" ||
    reviewed.evaluatedHealthGateCaseCount !== 5 ||
    reviewed.healthyBaselineCaseCount !== 1 ||
    reviewed.thresholdBreachCaseCount !== 4 ||
    reviewed.blockedBreachCaseCount !== 4 ||
    reviewed.undetectedBreachCount !== 0 ||
    reviewed.unauthorizedProgressionCount !== 0 ||
    reviewed.emergencyPauseActivationCount !== 4 ||
    reviewed.ownerEscalationCount !== 4 ||
    reviewed.heartbeatGateVerified !== true ||
    reviewed.errorRateGateVerified !== true ||
    reviewed.queueBacklogGateVerified !== true ||
    reviewed.auditPipelineGateVerified !== true ||
    reviewed.tenantIsolationHealthGateVerified !== true ||
    reviewed.allSyntheticBreachesDetected !== true ||
    reviewed.allUnsafeProgressionBlocked !== true ||
    reviewed.deterministicEvaluationVerified !== true ||
    reviewed.failClosedMonitoringVerified !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six reviewed evidence is invalid.",
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
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.sequenceSevenEvidenceExecutionPerformed,
    boundary.unsafeHealthProgressionAuthorized,
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
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceSixExecutionAccepted !== approved ||
    boundary.sequenceSixEvidenceAccepted !== approved ||
    boundary.sequenceSixClosed !== approved ||
    boundary.sequenceSevenEvidenceExecutionAuthorized !== approved ||
    boundary.onlySequenceSevenAuthorizedNext !== approved ||
    boundary.monitoringAndHealthGatesEvidenceAccepted !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six owner-review boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical sequence-six execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-six owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-six owner-review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence-six evidence.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six owner-review decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error(
      "Concurrent-coordination sequence-six owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision(
    record,
  );

  return record;
}