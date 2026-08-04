import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-seven-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenOwnerReviewDecisionType;
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
      "Repository read-only sandbox sequence-seven owner-review reason is invalid.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence !== 3 ||
    execution.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    execution.evidenceSequence !== 7 ||
    execution.controlId !==
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" ||
    execution.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    execution.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    execution.syntheticSanitizedEvidenceOnly !== true ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evidenceType !==
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION_EXECUTION_EVIDENCE" ||
    execution.evidence.evaluationMode !==
      "SYNTHETIC_IMMUTABLE_AUDIT_CHAIN_MODEL_ONLY" ||
    execution.evidence.evaluatedAuditCaseCount !== 10 ||
    execution.evidence.validAuditCaseCount !== 2 ||
    execution.evidence.blockedAuditCaseCount !== 8 ||
    execution.evidence.digestTamperBlockedCount !== 4 ||
    execution.evidence.missingDenialReasonBlockedCount !== 1 ||
    execution.evidence.orderingFailureBlockedCount !== 1 ||
    execution.evidence.replayDetectedCaseCount !== 2 ||
    execution.evidence.unauthorizedAuditAcceptanceCount !== 0 ||
    execution.evidence.immutableAuditRequired !== true ||
    execution.evidence.auditEventMutationAllowed !== false ||
    execution.evidence.auditEventDeletionAllowed !== false ||
    execution.evidence.auditEventReorderingAllowed !== false ||
    execution.evidence.auditEventReplayAllowed !== false ||
    execution.evidence.failClosedOnDigestMismatch !== true ||
    execution.evidence.failClosedOnOrderingFailure !== true ||
    execution.evidence.failClosedOnReplayDetection !== true ||
    execution.evidence.failClosedOnMissingDenialReason !== true ||
    execution.evidence.deterministicAuditChainVerified !== true ||
    execution.evidence.immutableAuditEnforcementVerified !== true ||
    execution.evidence.tamperDetectionVerified !== true ||
    execution.evidence.replayDetectionVerified !== true ||
    execution.evidence.orderingProofVerified !== true ||
    execution.evidence.denialReasonIntegrityVerified !== true ||
    execution.evidence.actualRepositoryReadPerformed !== false ||
    execution.evidence.actualFilesystemReadPerformed !== false ||
    execution.evidence.actualAuditEventWritePerformed !== false ||
    execution.evidence.actualAuditLedgerMutationPerformed !== false ||
    execution.evidence.actualOutputProduced !== false ||
    execution.evidence.actualCommandExecutionPerformed !== false ||
    execution.evidence.actualPackageExecutionPerformed !== false ||
    execution.evidence.actualNetworkAccessPerformed !== false ||
    execution.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary
      .ownerReviewRequiredImmediatelyAfterExecution !== true ||
    execution.authorityBoundary
      .sequenceEightSyntheticEvidenceExecutionAuthorized !== false ||
    execution.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    execution.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    execution.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    execution.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    execution.authorityBoundary.actualRepositoryReadPerformed !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.repositoryWriteAuthorized !== false ||
    execution.authorityBoundary.filesystemReadAuthorized !== false ||
    execution.authorityBoundary.filesystemMutationAuthorized !== false ||
    execution.authorityBoundary.gitMutationAuthorized !== false ||
    execution.authorityBoundary.commandExecutionAuthorized !== false ||
    execution.authorityBoundary.packageExecutionAuthorized !== false ||
    execution.authorityBoundary.networkAccessAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-seven execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW_RECORDED" as const,
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
    evidenceSequence: 7 as const,
    controlId:
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceSevenOwnerReviewRecorded: true as const,
    sequenceSevenClosed: approved,
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
      evaluatedAuditCaseCount:
        execution.evidence.evaluatedAuditCaseCount,
      validAuditCaseCount:
        execution.evidence.validAuditCaseCount,
      blockedAuditCaseCount:
        execution.evidence.blockedAuditCaseCount,
      digestTamperBlockedCount:
        execution.evidence.digestTamperBlockedCount,
      missingDenialReasonBlockedCount:
        execution.evidence.missingDenialReasonBlockedCount,
      orderingFailureBlockedCount:
        execution.evidence.orderingFailureBlockedCount,
      replayDetectedCaseCount:
        execution.evidence.replayDetectedCaseCount,
      unauthorizedAuditAcceptanceCount:
        execution.evidence.unauthorizedAuditAcceptanceCount,
      requestIdentityBindingRequired:
        execution.evidence.requestIdentityBindingRequired,
      approvedScopeBindingRequired:
        execution.evidence.approvedScopeBindingRequired,
      fileDigestBindingRequired:
        execution.evidence.fileDigestBindingRequired,
      resultDigestBindingRequired:
        execution.evidence.resultDigestBindingRequired,
      denialReasonRequiredForDeniedRequests:
        execution.evidence.denialReasonRequiredForDeniedRequests,
      orderingProofRequired:
        execution.evidence.orderingProofRequired,
      tamperProbeRequired:
        execution.evidence.tamperProbeRequired,
      replayDetectionRequired:
        execution.evidence.replayDetectionRequired,
      immutableAuditRequired:
        execution.evidence.immutableAuditRequired,
      auditEventMutationAllowed:
        execution.evidence.auditEventMutationAllowed,
      auditEventDeletionAllowed:
        execution.evidence.auditEventDeletionAllowed,
      auditEventReorderingAllowed:
        execution.evidence.auditEventReorderingAllowed,
      auditEventReplayAllowed:
        execution.evidence.auditEventReplayAllowed,
      failClosedOnDigestMismatch:
        execution.evidence.failClosedOnDigestMismatch,
      failClosedOnOrderingFailure:
        execution.evidence.failClosedOnOrderingFailure,
      failClosedOnReplayDetection:
        execution.evidence.failClosedOnReplayDetection,
      failClosedOnMissingDenialReason:
        execution.evidence.failClosedOnMissingDenialReason,
      deterministicAuditChainVerified:
        execution.evidence.deterministicAuditChainVerified,
      immutableAuditEnforcementVerified:
        execution.evidence.immutableAuditEnforcementVerified,
      tamperDetectionVerified:
        execution.evidence.tamperDetectionVerified,
      replayDetectionVerified:
        execution.evidence.replayDetectionVerified,
      orderingProofVerified:
        execution.evidence.orderingProofVerified,
      denialReasonIntegrityVerified:
        execution.evidence.denialReasonIntegrityVerified,
      requestIdentityBindingVerified:
        execution.evidence.requestIdentityBindingVerified,
      approvedScopeBindingVerified:
        execution.evidence.approvedScopeBindingVerified,
      fileDigestBindingVerified:
        execution.evidence.fileDigestBindingVerified,
      resultDigestBindingVerified:
        execution.evidence.resultDigestBindingVerified,
      actualRepositoryReadPerformed:
        execution.evidence.actualRepositoryReadPerformed,
      actualFilesystemReadPerformed:
        execution.evidence.actualFilesystemReadPerformed,
      actualAuditEventWritePerformed:
        execution.evidence.actualAuditEventWritePerformed,
      actualAuditLedgerMutationPerformed:
        execution.evidence.actualAuditLedgerMutationPerformed,
      actualOutputProduced:
        execution.evidence.actualOutputProduced,
      actualCommandExecutionPerformed:
        execution.evidence.actualCommandExecutionPerformed,
      actualPackageExecutionPerformed:
        execution.evidence.actualPackageExecutionPerformed,
      actualNetworkAccessPerformed:
        execution.evidence.actualNetworkAccessPerformed,
      nextEvidenceBlockedUntilOwnerReview:
        execution.evidence.nextEvidenceBlockedUntilOwnerReview,
      monitoringStatus:
        execution.evidence.monitoringStatus,
      independentValidationStatus:
        execution.evidence.independentValidationStatus,
      emergencyPauseAvailable:
        execution.evidence.emergencyPauseAvailable,
      emergencyPauseTriggeredForInvalidCases:
        execution.evidence.emergencyPauseTriggeredForInvalidCases,
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
      sequenceSevenExecutionAccepted: approved,
      sequenceSevenEvidenceAccepted: approved,
      sequenceSevenClosed: approved,
      sequenceEightSyntheticEvidenceExecutionAuthorized:
        approved,
      sequenceEightSyntheticEvidenceExecutionPerformed:
        false as const,
      onlySequenceEightAuthorizedNext: approved,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-seven owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-seven owner-review time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven owner-review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW_RECORDED" ||
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
    record.evidenceSequence !== 7 ||
    record.controlId !==
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" ||
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceSevenOwnerReviewRecorded !== true ||
    record.sequenceSevenClosed !== approved ||
    Date.parse(record.decidedAt) <
      Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven owner-review identity is invalid.",
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
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION_EXECUTION_EVIDENCE" ||
    reviewed.evaluationMode !==
      "SYNTHETIC_IMMUTABLE_AUDIT_CHAIN_MODEL_ONLY" ||
    reviewed.evaluatedAuditCaseCount !== 10 ||
    reviewed.validAuditCaseCount !== 2 ||
    reviewed.blockedAuditCaseCount !== 8 ||
    reviewed.digestTamperBlockedCount !== 4 ||
    reviewed.missingDenialReasonBlockedCount !== 1 ||
    reviewed.orderingFailureBlockedCount !== 1 ||
    reviewed.replayDetectedCaseCount !== 2 ||
    reviewed.unauthorizedAuditAcceptanceCount !== 0 ||
    reviewed.requestIdentityBindingRequired !== true ||
    reviewed.approvedScopeBindingRequired !== true ||
    reviewed.fileDigestBindingRequired !== true ||
    reviewed.resultDigestBindingRequired !== true ||
    reviewed.denialReasonRequiredForDeniedRequests !== true ||
    reviewed.orderingProofRequired !== true ||
    reviewed.tamperProbeRequired !== true ||
    reviewed.replayDetectionRequired !== true ||
    reviewed.immutableAuditRequired !== true ||
    reviewed.auditEventMutationAllowed !== false ||
    reviewed.auditEventDeletionAllowed !== false ||
    reviewed.auditEventReorderingAllowed !== false ||
    reviewed.auditEventReplayAllowed !== false ||
    reviewed.failClosedOnDigestMismatch !== true ||
    reviewed.failClosedOnOrderingFailure !== true ||
    reviewed.failClosedOnReplayDetection !== true ||
    reviewed.failClosedOnMissingDenialReason !== true ||
    reviewed.deterministicAuditChainVerified !== true ||
    reviewed.immutableAuditEnforcementVerified !== true ||
    reviewed.tamperDetectionVerified !== true ||
    reviewed.replayDetectionVerified !== true ||
    reviewed.orderingProofVerified !== true ||
    reviewed.denialReasonIntegrityVerified !== true ||
    reviewed.requestIdentityBindingVerified !== true ||
    reviewed.approvedScopeBindingVerified !== true ||
    reviewed.fileDigestBindingVerified !== true ||
    reviewed.resultDigestBindingVerified !== true ||
    reviewed.actualRepositoryReadPerformed !== false ||
    reviewed.actualFilesystemReadPerformed !== false ||
    reviewed.actualAuditEventWritePerformed !== false ||
    reviewed.actualAuditLedgerMutationPerformed !== false ||
    reviewed.actualOutputProduced !== false ||
    reviewed.actualCommandExecutionPerformed !== false ||
    reviewed.actualPackageExecutionPerformed !== false ||
    reviewed.actualNetworkAccessPerformed !== false ||
    reviewed.nextEvidenceBlockedUntilOwnerReview !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.emergencyPauseTriggeredForInvalidCases !== true ||
    reviewed.rollbackMarkerRecorded !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven reviewed evidence is invalid.",
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
    boundary.sequenceEightSyntheticEvidenceExecutionPerformed,
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
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceSevenExecutionAccepted !== approved ||
    boundary.sequenceSevenEvidenceAccepted !== approved ||
    boundary.sequenceSevenClosed !== approved ||
    boundary.sequenceEightSyntheticEvidenceExecutionAuthorized !==
      approved ||
    boundary.onlySequenceEightAuthorizedNext !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical repository read-only sandbox sequence-seven execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-seven owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-seven owner-review time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence seven.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision(
    record,
  );

  return record;
}