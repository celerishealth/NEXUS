import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-eight-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTION",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightOwnerReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|credential|bearer|private[_ -]?key)\b/i;

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
    normalized.length < 80 ||
    normalized.length > 1400 ||
    SENSITIVE_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight owner-review reason is invalid.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence !== 3 ||
    execution.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    execution.evidenceSequence !== 8 ||
    execution.controlId !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" ||
    execution.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    execution.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    execution.syntheticSanitizedEvidenceOnly !== true ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evidenceType !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW_EXECUTION_EVIDENCE" ||
    execution.evidence.evaluationMode !==
      "SYNTHETIC_PAUSE_ESCALATION_POLICY_MODEL_ONLY" ||
    execution.evidence.evaluatedPauseCaseCount !== 6 ||
    execution.evidence.healthyBaselineCaseCount !== 1 ||
    execution.evidence.blockedTriggerCaseCount !== 5 ||
    execution.evidence.missedEmergencyPauseCount !== 0 ||
    execution.evidence.missedOwnerEscalationCount !== 0 ||
    execution.evidence.unauthorizedProgressionCount !== 0 ||
    execution.evidence.emergencyPauseRequiredOnTrigger !== true ||
    execution.evidence.failClosedEscalationRequired !== true ||
    execution.evidence.independentValidationRequired !== true ||
    execution.evidence.finalOwnerReviewRequired !== true ||
    execution.evidence.rollbackEvidenceRequired !== true ||
    execution.evidence.immutableAuditEvidenceRequired !== true ||
    execution.evidence.resourceThresholdEscalationVerified !== true ||
    execution.evidence.suspiciousContentEscalationVerified !== true ||
    execution.evidence.contextMismatchEscalationVerified !== true ||
    execution.evidence.auditFailureEscalationVerified !== true ||
    execution.evidence.unauthorizedAuthorityEscalationVerified !== true ||
    execution.evidence.ownerControlReturnVerified !== true ||
    execution.evidence.deterministicPauseDecisionVerified !== true ||
    execution.evidence.failClosedProgressionBlockingVerified !== true ||
    execution.evidence.independentValidationGateVerified !== true ||
    execution.evidence.finalOwnerReviewGateVerified !== true ||
    execution.evidence.actualRepositoryReadPerformed !== false ||
    execution.evidence.actualFilesystemReadPerformed !== false ||
    execution.evidence.actualCommandExecutionPerformed !== false ||
    execution.evidence.actualPackageExecutionPerformed !== false ||
    execution.evidence.actualNetworkAccessPerformed !== false ||
    execution.evidence.actualProductionActionPerformed !== false ||
    execution.evidence.actualExternalActionPerformed !== false ||
    execution.evidence.allEightEvidenceSequencesExecuted !== true ||
    execution.evidence.allPriorOwnerReviewsAccountedFor !== true ||
    execution.evidence.workstreamClosureBlockedUntilOwnerReview !== true ||
    execution.evidence.workstreamClosurePerformed !== false ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary
      .ownerReviewRequiredImmediatelyAfterExecution !== true ||
    execution.authorityBoundary.workstreamClosureAuthorized !== false ||
    execution.authorityBoundary.workstreamClosurePerformed !== false ||
    execution.authorityBoundary
      .workstreamCompletionClaimAuthorized !== false ||
    execution.authorityBoundary.workstreamCompletionClaimed !== false ||
    execution.authorityBoundary.nextWorkstreamExecutionAuthorized !== false ||
    execution.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    execution.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.repositoryWriteAuthorized !== false ||
    execution.authorityBoundary.filesystemReadAuthorized !== false ||
    execution.authorityBoundary.filesystemMutationAuthorized !== false ||
    execution.authorityBoundary.commandExecutionAuthorized !== false ||
    execution.authorityBoundary.packageExecutionAuthorized !== false ||
    execution.authorityBoundary.networkAccessAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-eight execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW_RECORDED" as const,
    tenantId: execution.tenantId,
    ownerId,
    sourceExecutionId: execution.executionId,
    sourceExecutionDigest: execution.executionDigest,
    sourceOwnerReviewDecisionId:
      execution.sourceOwnerReviewDecisionId,
    sourceOwnerReviewDecisionDigest:
      execution.sourceOwnerReviewDecisionDigest,
    sourceDecisionId: execution.sourceDecisionId,
    sourceDecisionDigest: execution.sourceDecisionDigest,
    sourceCandidateDecisionDigest:
      execution.sourceCandidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 8 as const,
    controlId:
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceEightOwnerReviewRecorded: true as const,
    sequenceEightClosed: approved,
    allEightEvidenceSequencesExecuted: true as const,
    allEightEvidenceSequencesOwnerReviewed: approved,
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
      evaluationMode: execution.evidence.evaluationMode,
      evaluatedPauseCaseCount:
        execution.evidence.evaluatedPauseCaseCount,
      healthyBaselineCaseCount:
        execution.evidence.healthyBaselineCaseCount,
      blockedTriggerCaseCount:
        execution.evidence.blockedTriggerCaseCount,
      resourceThresholdBreachBlockedCount:
        execution.evidence.resourceThresholdBreachBlockedCount,
      suspiciousContentBlockedCount:
        execution.evidence.suspiciousContentBlockedCount,
      contextMismatchBlockedCount:
        execution.evidence.contextMismatchBlockedCount,
      auditFailureBlockedCount:
        execution.evidence.auditFailureBlockedCount,
      unauthorizedAuthorityRequestBlockedCount:
        execution.evidence.unauthorizedAuthorityRequestBlockedCount,
      missedEmergencyPauseCount:
        execution.evidence.missedEmergencyPauseCount,
      missedOwnerEscalationCount:
        execution.evidence.missedOwnerEscalationCount,
      unauthorizedProgressionCount:
        execution.evidence.unauthorizedProgressionCount,
      emergencyPauseRequiredOnTrigger:
        execution.evidence.emergencyPauseRequiredOnTrigger,
      failClosedEscalationRequired:
        execution.evidence.failClosedEscalationRequired,
      independentValidationRequired:
        execution.evidence.independentValidationRequired,
      finalOwnerReviewRequired:
        execution.evidence.finalOwnerReviewRequired,
      rollbackEvidenceRequired:
        execution.evidence.rollbackEvidenceRequired,
      immutableAuditEvidenceRequired:
        execution.evidence.immutableAuditEvidenceRequired,
      resourceThresholdEscalationVerified:
        execution.evidence.resourceThresholdEscalationVerified,
      suspiciousContentEscalationVerified:
        execution.evidence.suspiciousContentEscalationVerified,
      contextMismatchEscalationVerified:
        execution.evidence.contextMismatchEscalationVerified,
      auditFailureEscalationVerified:
        execution.evidence.auditFailureEscalationVerified,
      unauthorizedAuthorityEscalationVerified:
        execution.evidence.unauthorizedAuthorityEscalationVerified,
      ownerControlReturnVerified:
        execution.evidence.ownerControlReturnVerified,
      deterministicPauseDecisionVerified:
        execution.evidence.deterministicPauseDecisionVerified,
      failClosedProgressionBlockingVerified:
        execution.evidence.failClosedProgressionBlockingVerified,
      independentValidationGateVerified:
        execution.evidence.independentValidationGateVerified,
      finalOwnerReviewGateVerified:
        execution.evidence.finalOwnerReviewGateVerified,
      actualRepositoryReadPerformed:
        execution.evidence.actualRepositoryReadPerformed,
      actualFilesystemReadPerformed:
        execution.evidence.actualFilesystemReadPerformed,
      actualCommandExecutionPerformed:
        execution.evidence.actualCommandExecutionPerformed,
      actualPackageExecutionPerformed:
        execution.evidence.actualPackageExecutionPerformed,
      actualNetworkAccessPerformed:
        execution.evidence.actualNetworkAccessPerformed,
      actualProductionActionPerformed:
        execution.evidence.actualProductionActionPerformed,
      actualExternalActionPerformed:
        execution.evidence.actualExternalActionPerformed,
      allEightEvidenceSequencesExecuted:
        execution.evidence.allEightEvidenceSequencesExecuted,
      allPriorOwnerReviewsAccountedFor:
        execution.evidence.allPriorOwnerReviewsAccountedFor,
      workstreamClosureBlockedUntilOwnerReview:
        execution.evidence.workstreamClosureBlockedUntilOwnerReview,
      workstreamClosurePerformed:
        execution.evidence.workstreamClosurePerformed,
      monitoringStatus:
        execution.evidence.monitoringStatus,
      independentValidationStatus:
        execution.evidence.independentValidationStatus,
      emergencyPauseAvailable:
        execution.evidence.emergencyPauseAvailable,
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
      sequenceEightExecutionAccepted: approved,
      sequenceEightEvidenceAccepted: approved,
      sequenceEightClosed: approved,
      allEightEvidenceSequencesExecuted: true as const,
      allEightEvidenceSequencesOwnerReviewed: approved,
      workstreamClosureRecordPreparationAuthorized:
        approved,
      workstreamClosureRecordPreparationPerformed:
        false as const,
      onlyWorkstreamClosureRecordPreparationAuthorizedNext:
        approved,
      workstreamClosureAuthorized: false as const,
      workstreamClosurePerformed: false as const,
      workstreamCompletionClaimAuthorized: false as const,
      workstreamCompletionClaimed: false as const,
      nextWorkstreamExecutionAuthorized: false as const,
      actualRepositoryEvaluationAuthorized: false as const,
      actualRepositoryEvaluationPerformed: false as const,
      repositoryReadOnlySandboxEvaluationAuthorized:
        false as const,
      repositoryReadOnlySandboxExecutionAuthorized:
        false as const,
      actualRepositoryReadPerformed: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemReadAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      branchCreationAuthorized: false as const,
      pullRequestPreparationAuthorized: false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized: false as const,
      sensitiveContentAccessAuthorized: false as const,
      sensitiveContentMaterializationAuthorized: false as const,
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
      aggregateConcurrentEngineeringWorkLimit: 0 as const,
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
        ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_AWAITING_OWNER_REVIEW"
    ) as
      | "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-eight owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-eight owner-review time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight owner-review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW_RECORDED" ||
    record.tenantId !== execution.tenantId ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionId !== execution.executionId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.sourceOwnerReviewDecisionId !==
      execution.sourceOwnerReviewDecisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      execution.sourceOwnerReviewDecisionDigest ||
    record.sourceDecisionId !== execution.sourceDecisionId ||
    record.sourceDecisionDigest !== execution.sourceDecisionDigest ||
    record.sourceCandidateDecisionDigest !==
      execution.sourceCandidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 8 ||
    record.controlId !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" ||
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceEightOwnerReviewRecorded !== true ||
    record.sequenceEightClosed !== approved ||
    record.allEightEvidenceSequencesExecuted !== true ||
    record.allEightEvidenceSequencesOwnerReviewed !== approved ||
    Date.parse(record.decidedAt) <
      Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight owner-review identity is invalid.",
    );
  }

  const reviewed = record.reviewedExecution;

  if (
    reviewed.executionState !== execution.executionState ||
    reviewed.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    reviewed.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    reviewed.syntheticSanitizedEvidenceOnly !== true ||
    reviewed.evidenceExecutionAuthorized !== true ||
    reviewed.evidenceExecutionPerformed !== true ||
    reviewed.evidenceCreated !== true ||
    reviewed.evidenceType !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW_EXECUTION_EVIDENCE" ||
    reviewed.evaluationMode !==
      "SYNTHETIC_PAUSE_ESCALATION_POLICY_MODEL_ONLY" ||
    reviewed.evaluatedPauseCaseCount !== 6 ||
    reviewed.healthyBaselineCaseCount !== 1 ||
    reviewed.blockedTriggerCaseCount !== 5 ||
    reviewed.resourceThresholdBreachBlockedCount !== 1 ||
    reviewed.suspiciousContentBlockedCount !== 1 ||
    reviewed.contextMismatchBlockedCount !== 1 ||
    reviewed.auditFailureBlockedCount !== 1 ||
    reviewed.unauthorizedAuthorityRequestBlockedCount !== 1 ||
    reviewed.missedEmergencyPauseCount !== 0 ||
    reviewed.missedOwnerEscalationCount !== 0 ||
    reviewed.unauthorizedProgressionCount !== 0 ||
    reviewed.emergencyPauseRequiredOnTrigger !== true ||
    reviewed.failClosedEscalationRequired !== true ||
    reviewed.independentValidationRequired !== true ||
    reviewed.finalOwnerReviewRequired !== true ||
    reviewed.rollbackEvidenceRequired !== true ||
    reviewed.immutableAuditEvidenceRequired !== true ||
    reviewed.resourceThresholdEscalationVerified !== true ||
    reviewed.suspiciousContentEscalationVerified !== true ||
    reviewed.contextMismatchEscalationVerified !== true ||
    reviewed.auditFailureEscalationVerified !== true ||
    reviewed.unauthorizedAuthorityEscalationVerified !== true ||
    reviewed.ownerControlReturnVerified !== true ||
    reviewed.deterministicPauseDecisionVerified !== true ||
    reviewed.failClosedProgressionBlockingVerified !== true ||
    reviewed.independentValidationGateVerified !== true ||
    reviewed.finalOwnerReviewGateVerified !== true ||
    reviewed.actualRepositoryReadPerformed !== false ||
    reviewed.actualFilesystemReadPerformed !== false ||
    reviewed.actualCommandExecutionPerformed !== false ||
    reviewed.actualPackageExecutionPerformed !== false ||
    reviewed.actualNetworkAccessPerformed !== false ||
    reviewed.actualProductionActionPerformed !== false ||
    reviewed.actualExternalActionPerformed !== false ||
    reviewed.allEightEvidenceSequencesExecuted !== true ||
    reviewed.allPriorOwnerReviewsAccountedFor !== true ||
    reviewed.workstreamClosureBlockedUntilOwnerReview !== true ||
    reviewed.workstreamClosurePerformed !== false ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.rollbackMarkerRecorded !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight reviewed evidence is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalExecutionBound,
    boundary.sourceExecutionIntegrityVerified,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.ownerReviewRecorded,
    boundary.allEightEvidenceSequencesExecuted,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.workstreamClosureRecordPreparationPerformed,
    boundary.workstreamClosureAuthorized,
    boundary.workstreamClosurePerformed,
    boundary.workstreamCompletionClaimAuthorized,
    boundary.workstreamCompletionClaimed,
    boundary.nextWorkstreamExecutionAuthorized,
    boundary.actualRepositoryEvaluationAuthorized,
    boundary.actualRepositoryEvaluationPerformed,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.actualRepositoryReadPerformed,
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
      ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceEightExecutionAccepted !== approved ||
    boundary.sequenceEightEvidenceAccepted !== approved ||
    boundary.sequenceEightClosed !== approved ||
    boundary.allEightEvidenceSequencesOwnerReviewed !== approved ||
    boundary.workstreamClosureRecordPreparationAuthorized !== approved ||
    boundary.onlyWorkstreamClosureRecordPreparationAuthorizedNext !==
      approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical repository read-only sandbox sequence-eight execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-eight owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-eight owner-review time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence eight.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision(
    record,
  );

  return record;
}