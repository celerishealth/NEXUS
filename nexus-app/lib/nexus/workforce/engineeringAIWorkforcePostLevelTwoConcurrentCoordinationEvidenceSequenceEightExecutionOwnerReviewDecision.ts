import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-eight-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceEightOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceEightOwnerReviewDecisionType;
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
      "Concurrent-coordination sequence-eight owner-review reason is invalid.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution(
    execution,
  );

  if (
    execution.evidenceSequence !== 8 ||
    execution.controlId !== "INDEPENDENT_VALIDATION_AND_AUDIT" ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evaluatedEvidenceAreaCount !== 6 ||
    execution.evidence.passedEvidenceAreaCount !== 6 ||
    execution.evidence.failedEvidenceAreaCount !== 0 ||
    execution.evidence.missingEvidenceAreaCount !== 0 ||
    execution.evidence.auditGapCount !== 0 ||
    execution.evidence.digestBindingFailureCount !== 0 ||
    execution.evidence.sequenceOrderingFailureCount !== 0 ||
    execution.evidence.missingOwnerReviewCount !== 0 ||
    execution.evidence.authorityBoundaryFailureCount !== 0 ||
    execution.evidence.detectedTamperProbeCount !== 1 ||
    execution.evidence.rejectedTamperProbeCount !== 1 ||
    execution.evidence.unauthorizedProgressionCount !== 0 ||
    execution.evidence.allEightEvidenceSequencesAccountedFor !== true ||
    execution.evidence.allRequiredOwnerReviewsAccountedFor !== true ||
    execution.evidence.evidenceIntegrityVerified !== true ||
    execution.evidence.auditContinuityVerified !== true ||
    execution.evidence.consequentialAuthorityBoundariesVerified !== true ||
    execution.evidence.failClosedTamperDetectionVerified !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary.workstreamClosureAuthorized !== false ||
    execution.authorityBoundary.workstreamClosurePerformed !== false ||
    execution.authorityBoundary.nextWorkstreamAuthorized !== false ||
    execution.authorityBoundary.concurrentEngineeringWorkAuthorized !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.repositoryWriteAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical sequence-eight independent-validation evidence is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceEightOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW_RECORDED" as const,
    tenantId: execution.tenantId,
    ownerId,
    sourceExecutionId: execution.executionId,
    sourceExecutionDigest: execution.executionDigest,
    sourceSequenceSevenOwnerReviewDecisionId:
      execution.sourceOwnerReviewDecisionId,
    sourceSequenceSevenOwnerReviewDecisionDigest:
      execution.sourceOwnerReviewDecisionDigest,
    sourceSequenceSevenExecutionId:
      execution.sourceSequenceSevenExecutionId,
    sourceSequenceSevenExecutionDigest:
      execution.sourceSequenceSevenExecutionDigest,
    sourceCheckpointDigest: execution.sourceCheckpointDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 8 as const,
    controlId: "INDEPENDENT_VALIDATION_AND_AUDIT" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceEightOwnerReviewRecorded: true as const,
    sequenceEightClosed: approved,
    allEightEvidenceSequencesAccepted: approved,
    reviewedEvidence: {
      evidenceType: execution.evidence.evidenceType,
      evaluatedEvidenceAreaCount:
        execution.evidence.evaluatedEvidenceAreaCount,
      passedEvidenceAreaCount:
        execution.evidence.passedEvidenceAreaCount,
      failedEvidenceAreaCount:
        execution.evidence.failedEvidenceAreaCount,
      missingEvidenceAreaCount:
        execution.evidence.missingEvidenceAreaCount,
      auditGapCount: execution.evidence.auditGapCount,
      digestBindingFailureCount:
        execution.evidence.digestBindingFailureCount,
      sequenceOrderingFailureCount:
        execution.evidence.sequenceOrderingFailureCount,
      missingOwnerReviewCount:
        execution.evidence.missingOwnerReviewCount,
      authorityBoundaryFailureCount:
        execution.evidence.authorityBoundaryFailureCount,
      syntheticTamperProbeCount:
        execution.evidence.syntheticTamperProbeCount,
      detectedTamperProbeCount:
        execution.evidence.detectedTamperProbeCount,
      rejectedTamperProbeCount:
        execution.evidence.rejectedTamperProbeCount,
      unauthorizedProgressionCount:
        execution.evidence.unauthorizedProgressionCount,
      allEightEvidenceSequencesAccountedFor:
        execution.evidence.allEightEvidenceSequencesAccountedFor,
      allRequiredOwnerReviewsAccountedFor:
        execution.evidence.allRequiredOwnerReviewsAccountedFor,
      evidenceIntegrityVerified:
        execution.evidence.evidenceIntegrityVerified,
      auditContinuityVerified:
        execution.evidence.auditContinuityVerified,
      tenantIsolationBoundaryVerified:
        execution.evidence.tenantIsolationBoundaryVerified,
      consequentialAuthorityBoundariesVerified:
        execution.evidence.consequentialAuthorityBoundariesVerified,
      deterministicIndependentValidationVerified:
        execution.evidence.deterministicIndependentValidationVerified,
      failClosedTamperDetectionVerified:
        execution.evidence.failClosedTamperDetectionVerified,
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
      sequenceEightExecutionAccepted: approved,
      sequenceEightEvidenceAccepted: approved,
      sequenceEightClosed: approved,
      allEightEvidenceSequencesAccepted: approved,
      workstreamClosurePreparationAuthorized: approved,
      workstreamClosureAuthorized: false as const,
      workstreamClosurePerformed: false as const,
      nextWorkstreamAuthorized: false as const,
      repositoryReadOnlySandboxEvaluationAuthorized: false as const,
      ownerReviewBypassAuthorized: false as const,
      auditBypassAuthorized: false as const,
      tamperedEvidenceProgressionAuthorized: false as const,
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
        ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_AWAITING_OWNER_REVIEW"
    ) as
      | "PREPARE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-eight owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-eight owner-review decision time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-eight owner-review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW_RECORDED" ||
    record.tenantId !== execution.tenantId ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionId !== execution.executionId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.sourceSequenceSevenOwnerReviewDecisionId !==
      execution.sourceOwnerReviewDecisionId ||
    record.sourceSequenceSevenOwnerReviewDecisionDigest !==
      execution.sourceOwnerReviewDecisionDigest ||
    record.sourceSequenceSevenExecutionId !==
      execution.sourceSequenceSevenExecutionId ||
    record.sourceSequenceSevenExecutionDigest !==
      execution.sourceSequenceSevenExecutionDigest ||
    record.sourceCheckpointDigest !== execution.sourceCheckpointDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 8 ||
    record.controlId !== "INDEPENDENT_VALIDATION_AND_AUDIT" ||
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceEightOwnerReviewRecorded !== true ||
    record.sequenceEightClosed !== approved ||
    record.allEightEvidenceSequencesAccepted !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-eight owner-review identity is invalid.",
    );
  }

  const reviewed = record.reviewedEvidence;

  if (
    reviewed.evidenceType !==
      "INDEPENDENT_VALIDATION_AND_AUDIT_EXECUTION_EVIDENCE" ||
    reviewed.evaluatedEvidenceAreaCount !== 6 ||
    reviewed.passedEvidenceAreaCount !== 6 ||
    reviewed.failedEvidenceAreaCount !== 0 ||
    reviewed.missingEvidenceAreaCount !== 0 ||
    reviewed.auditGapCount !== 0 ||
    reviewed.digestBindingFailureCount !== 0 ||
    reviewed.sequenceOrderingFailureCount !== 0 ||
    reviewed.missingOwnerReviewCount !== 0 ||
    reviewed.authorityBoundaryFailureCount !== 0 ||
    reviewed.syntheticTamperProbeCount !== 1 ||
    reviewed.detectedTamperProbeCount !== 1 ||
    reviewed.rejectedTamperProbeCount !== 1 ||
    reviewed.unauthorizedProgressionCount !== 0 ||
    reviewed.allEightEvidenceSequencesAccountedFor !== true ||
    reviewed.allRequiredOwnerReviewsAccountedFor !== true ||
    reviewed.evidenceIntegrityVerified !== true ||
    reviewed.auditContinuityVerified !== true ||
    reviewed.tenantIsolationBoundaryVerified !== true ||
    reviewed.consequentialAuthorityBoundariesVerified !== true ||
    reviewed.deterministicIndependentValidationVerified !== true ||
    reviewed.failClosedTamperDetectionVerified !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-eight reviewed evidence is invalid.",
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
    boundary.workstreamClosureAuthorized,
    boundary.workstreamClosurePerformed,
    boundary.nextWorkstreamAuthorized,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.ownerReviewBypassAuthorized,
    boundary.auditBypassAuthorized,
    boundary.tamperedEvidenceProgressionAuthorized,
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
      ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceEightExecutionAccepted !== approved ||
    boundary.sequenceEightEvidenceAccepted !== approved ||
    boundary.sequenceEightClosed !== approved ||
    boundary.allEightEvidenceSequencesAccepted !== approved ||
    boundary.workstreamClosurePreparationAuthorized !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-eight owner-review boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical sequence-eight execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-eight owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-eight owner-review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence-eight evidence.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Concurrent-coordination sequence-eight owner-review decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error(
      "Concurrent-coordination sequence-eight owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision(
    record,
  );

  return record;
}