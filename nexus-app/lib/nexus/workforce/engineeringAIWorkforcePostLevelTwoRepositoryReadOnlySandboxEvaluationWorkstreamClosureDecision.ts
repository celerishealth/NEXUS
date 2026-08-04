import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-workstream-closure-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_OPEN",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecisionInput {
  readonly decisionId: string;
  readonly sourceClosureRecord:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|credential|bearer|private[_ -]?key)\b/i;

const closureRecord =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD;

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
    normalized.length > 1600 ||
    SENSITIVE_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Repository read-only sandbox workstream-closure reason is invalid.",
    );
  }

  return normalized;
}

function validateCanonicalClosureRecord(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord(
    closureRecord,
  );

  const evidence = closureRecord.closureEvidence;
  const boundary = closureRecord.authorityBoundary;

  if (
    closureRecord.closureRecordState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD_PREPARED_AWAITING_OWNER_DECISION" ||
    closureRecord.workstreamSequence !== 3 ||
    closureRecord.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    closureRecord.evidenceClass !==
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" ||
    closureRecord.workstreamClosureRecordPreparationAuthorized !== true ||
    closureRecord.workstreamClosureRecordPreparationPerformed !== true ||
    closureRecord.formalClosureDecisionRequired !== true ||
    closureRecord.formalClosureDecisionRecorded !== false ||
    closureRecord.workstreamClosureAuthorized !== false ||
    closureRecord.workstreamClosurePerformed !== false ||
    closureRecord.workstreamClosed !== false ||
    evidence.requiredEvidenceSequenceCount !== 8 ||
    evidence.completedEvidenceSequenceCount !== 8 ||
    evidence.acceptedOwnerReviewCount !== 8 ||
    evidence.remainingEvidenceSequenceCount !== 0 ||
    evidence.rejectedEvidenceSequenceCount !== 0 ||
    evidence.missingOwnerReviewCount !== 0 ||
    evidence.failedIndependentValidationAreaCount !== 0 ||
    evidence.missingIndependentValidationAreaCount !== 0 ||
    evidence.auditGapCount !== 0 ||
    evidence.digestBindingFailureCount !== 0 ||
    evidence.sequenceOrderingFailureCount !== 0 ||
    evidence.authorityBoundaryFailureCount !== 0 ||
    evidence.unauthorizedProgressionCount !== 0 ||
    evidence.missedEmergencyPauseCount !== 0 ||
    evidence.missedOwnerEscalationCount !== 0 ||
    evidence.allEightEvidenceSequencesAccountedFor !== true ||
    evidence.allRequiredOwnerReviewsAccountedFor !== true ||
    evidence.evidenceIntegrityVerified !== true ||
    evidence.auditContinuityVerified !== true ||
    evidence.tenantIsolationBoundaryVerified !== true ||
    evidence.ownerBindingVerified !== true ||
    evidence.consequentialAuthorityBoundariesVerified !== true ||
    evidence.failClosedTamperDetectionVerified !== true ||
    evidence.emergencyPauseEvidenceVerified !== true ||
    evidence.rollbackEvidenceVerified !== true ||
    evidence.monitoringAndHealthGateEvidenceVerified !== true ||
    evidence.escalationAndOwnerReviewEvidenceVerified !== true ||
    evidence.deterministicReplayVerified !== true ||
    evidence.actualRepositoryEvaluationPerformed !== false ||
    evidence.actualRepositoryReadPerformed !== false ||
    evidence.actualFilesystemReadPerformed !== false ||
    evidence.actualCommandExecutionPerformed !== false ||
    evidence.actualPackageExecutionPerformed !== false ||
    evidence.actualNetworkAccessPerformed !== false ||
    evidence.actualProductionActionPerformed !== false ||
    evidence.actualExternalActionPerformed !== false ||
    evidence.independentValidationStatus !== "PASS" ||
    evidence.monitoringStatus !== "PASS" ||
    evidence.ownerReviewLedger.length !== 8 ||
    boundary.closureRecordPreparationOnly !== true ||
    boundary.closureDecisionReviewRequired !== true ||
    boundary.closureDecisionBypassAuthorized !== false ||
    boundary.formalClosureDecisionRecorded !== false ||
    boundary.workstreamClosureAuthorized !== false ||
    boundary.workstreamClosurePerformed !== false ||
    boundary.workstreamClosed !== false ||
    boundary.workstreamCompletionClaimAuthorized !== false ||
    boundary.workstreamCompletionClaimed !== false ||
    boundary.workstreamFourPlanPreparationAuthorized !== false ||
    boundary.workstreamFourPlanPreparationPerformed !== false ||
    boundary.nextWorkstreamExecutionAuthorized !== false ||
    boundary.nextWorkstreamAutonomousStartAuthorized !== false ||
    boundary.actualRepositoryEvaluationAuthorized !== false ||
    boundary.actualRepositoryEvaluationPerformed !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.filesystemReadAuthorized !== false ||
    boundary.filesystemMutationAuthorized !== false ||
    boundary.commandExecutionAuthorized !== false ||
    boundary.packageExecutionAuthorized !== false ||
    boundary.networkAccessAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.founderLiberationAchieved !== false ||
    closureRecord.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox workstream closure record is not eligible for formal closure.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE";

  const reviewed = closureRecord.closureEvidence;

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_RECORDED" as const,
    tenantId: closureRecord.tenantId,
    ownerId,
    sourceClosureRecordId:
      closureRecord.closureRecordId,
    sourceClosureRecordDigest:
      closureRecord.closureRecordDigest,
    sourceSequenceEightOwnerReviewDecisionId:
      closureRecord.sourceSequenceEightOwnerReviewDecisionId,
    sourceSequenceEightOwnerReviewDecisionDigest:
      closureRecord.sourceSequenceEightOwnerReviewDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    decision,
    reason,
    closureRecordAccepted: approved,
    formalClosureDecisionRecorded: true as const,
    workstreamClosureAuthorized: approved,
    workstreamClosurePerformed: approved,
    workstreamClosed: approved,
    nextWorkstreamSequence: 4 as const,
    nextWorkstreamId:
      "founder-routine-execution-reduction-evidence" as const,
    nextWorkstreamEvidenceClass:
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" as const,
    reviewedClosureEvidence: {
      requiredEvidenceSequenceCount:
        reviewed.requiredEvidenceSequenceCount,
      completedEvidenceSequenceCount:
        reviewed.completedEvidenceSequenceCount,
      acceptedOwnerReviewCount:
        reviewed.acceptedOwnerReviewCount,
      remainingEvidenceSequenceCount:
        reviewed.remainingEvidenceSequenceCount,
      rejectedEvidenceSequenceCount:
        reviewed.rejectedEvidenceSequenceCount,
      missingOwnerReviewCount:
        reviewed.missingOwnerReviewCount,
      failedIndependentValidationAreaCount:
        reviewed.failedIndependentValidationAreaCount,
      missingIndependentValidationAreaCount:
        reviewed.missingIndependentValidationAreaCount,
      auditGapCount:
        reviewed.auditGapCount,
      digestBindingFailureCount:
        reviewed.digestBindingFailureCount,
      sequenceOrderingFailureCount:
        reviewed.sequenceOrderingFailureCount,
      authorityBoundaryFailureCount:
        reviewed.authorityBoundaryFailureCount,
      unauthorizedProgressionCount:
        reviewed.unauthorizedProgressionCount,
      missedEmergencyPauseCount:
        reviewed.missedEmergencyPauseCount,
      missedOwnerEscalationCount:
        reviewed.missedOwnerEscalationCount,
      allEightEvidenceSequencesAccountedFor:
        reviewed.allEightEvidenceSequencesAccountedFor,
      allRequiredOwnerReviewsAccountedFor:
        reviewed.allRequiredOwnerReviewsAccountedFor,
      evidenceIntegrityVerified:
        reviewed.evidenceIntegrityVerified,
      auditContinuityVerified:
        reviewed.auditContinuityVerified,
      tenantIsolationBoundaryVerified:
        reviewed.tenantIsolationBoundaryVerified,
      ownerBindingVerified:
        reviewed.ownerBindingVerified,
      consequentialAuthorityBoundariesVerified:
        reviewed.consequentialAuthorityBoundariesVerified,
      failClosedTamperDetectionVerified:
        reviewed.failClosedTamperDetectionVerified,
      emergencyPauseEvidenceVerified:
        reviewed.emergencyPauseEvidenceVerified,
      rollbackEvidenceVerified:
        reviewed.rollbackEvidenceVerified,
      monitoringAndHealthGateEvidenceVerified:
        reviewed.monitoringAndHealthGateEvidenceVerified,
      escalationAndOwnerReviewEvidenceVerified:
        reviewed.escalationAndOwnerReviewEvidenceVerified,
      deterministicReplayVerified:
        reviewed.deterministicReplayVerified,
      actualRepositoryEvaluationPerformed:
        reviewed.actualRepositoryEvaluationPerformed,
      actualRepositoryReadPerformed:
        reviewed.actualRepositoryReadPerformed,
      actualFilesystemReadPerformed:
        reviewed.actualFilesystemReadPerformed,
      actualCommandExecutionPerformed:
        reviewed.actualCommandExecutionPerformed,
      actualPackageExecutionPerformed:
        reviewed.actualPackageExecutionPerformed,
      actualNetworkAccessPerformed:
        reviewed.actualNetworkAccessPerformed,
      actualProductionActionPerformed:
        reviewed.actualProductionActionPerformed,
      actualExternalActionPerformed:
        reviewed.actualExternalActionPerformed,
      independentValidationStatus:
        reviewed.independentValidationStatus,
      monitoringStatus:
        reviewed.monitoringStatus,
      closureEvidenceDigest:
        reviewed.closureEvidenceDigest,
    },
    authorityBoundary: {
      canonicalClosureRecordBound: true as const,
      sourceClosureRecordIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      closureDecisionReviewRecorded: true as const,
      closureDecisionBypassAuthorized: false as const,
      workstreamThreeClosureAuthorized: approved,
      workstreamThreeClosurePerformed: approved,
      workstreamThreeClosed: approved,
      workstreamThreeCompletionEvidenceAccepted: approved,
      workstreamThreeCompletionClaimAuthorized: approved,
      workstreamThreeCompletionClaimed: approved,
      workstreamFourPlanPreparationAuthorized: approved,
      workstreamFourPlanPreparationPerformed: false as const,
      onlyWorkstreamFourPlanPreparationAuthorizedNext:
        approved,
      workstreamFourEvidenceExecutionAuthorized: false as const,
      nextWorkstreamExecutionAuthorized: false as const,
      nextWorkstreamAutonomousStartAuthorized: false as const,
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
        ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_OPEN"
    ) as
      | "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_OPEN",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision,
): void {
  validateCanonicalClosureRecord();

  requireIdentifier(
    "Repository read-only sandbox workstream-closure decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox workstream-closure decision time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox workstream-closure decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_RECORDED" ||
    record.tenantId !== closureRecord.tenantId ||
    record.ownerId !== closureRecord.ownerId ||
    record.sourceClosureRecordId !==
      closureRecord.closureRecordId ||
    record.sourceClosureRecordDigest !==
      closureRecord.closureRecordDigest ||
    record.sourceSequenceEightOwnerReviewDecisionId !==
      closureRecord.sourceSequenceEightOwnerReviewDecisionId ||
    record.sourceSequenceEightOwnerReviewDecisionDigest !==
      closureRecord.sourceSequenceEightOwnerReviewDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.nextWorkstreamSequence !== 4 ||
    record.nextWorkstreamId !==
      "founder-routine-execution-reduction-evidence" ||
    record.nextWorkstreamEvidenceClass !==
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISIONS.includes(
      record.decision,
    ) ||
    record.closureRecordAccepted !== approved ||
    record.formalClosureDecisionRecorded !== true ||
    record.workstreamClosureAuthorized !== approved ||
    record.workstreamClosurePerformed !== approved ||
    record.workstreamClosed !== approved ||
    Date.parse(record.decidedAt) <
      Date.parse(closureRecord.preparedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox workstream-closure decision identity is invalid.",
    );
  }

  const reviewed = record.reviewedClosureEvidence;
  const source = closureRecord.closureEvidence;

  if (
    reviewed.requiredEvidenceSequenceCount !== 8 ||
    reviewed.completedEvidenceSequenceCount !== 8 ||
    reviewed.acceptedOwnerReviewCount !== 8 ||
    reviewed.remainingEvidenceSequenceCount !== 0 ||
    reviewed.rejectedEvidenceSequenceCount !== 0 ||
    reviewed.missingOwnerReviewCount !== 0 ||
    reviewed.failedIndependentValidationAreaCount !== 0 ||
    reviewed.missingIndependentValidationAreaCount !== 0 ||
    reviewed.auditGapCount !== 0 ||
    reviewed.digestBindingFailureCount !== 0 ||
    reviewed.sequenceOrderingFailureCount !== 0 ||
    reviewed.authorityBoundaryFailureCount !== 0 ||
    reviewed.unauthorizedProgressionCount !== 0 ||
    reviewed.missedEmergencyPauseCount !== 0 ||
    reviewed.missedOwnerEscalationCount !== 0 ||
    reviewed.allEightEvidenceSequencesAccountedFor !== true ||
    reviewed.allRequiredOwnerReviewsAccountedFor !== true ||
    reviewed.evidenceIntegrityVerified !== true ||
    reviewed.auditContinuityVerified !== true ||
    reviewed.tenantIsolationBoundaryVerified !== true ||
    reviewed.ownerBindingVerified !== true ||
    reviewed.consequentialAuthorityBoundariesVerified !== true ||
    reviewed.failClosedTamperDetectionVerified !== true ||
    reviewed.emergencyPauseEvidenceVerified !== true ||
    reviewed.rollbackEvidenceVerified !== true ||
    reviewed.monitoringAndHealthGateEvidenceVerified !== true ||
    reviewed.escalationAndOwnerReviewEvidenceVerified !== true ||
    reviewed.deterministicReplayVerified !== true ||
    reviewed.actualRepositoryEvaluationPerformed !== false ||
    reviewed.actualRepositoryReadPerformed !== false ||
    reviewed.actualFilesystemReadPerformed !== false ||
    reviewed.actualCommandExecutionPerformed !== false ||
    reviewed.actualPackageExecutionPerformed !== false ||
    reviewed.actualNetworkAccessPerformed !== false ||
    reviewed.actualProductionActionPerformed !== false ||
    reviewed.actualExternalActionPerformed !== false ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.closureEvidenceDigest !==
      source.closureEvidenceDigest
  ) {
    throw new Error(
      "Repository read-only sandbox reviewed closure evidence is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalClosureRecordBound,
    boundary.sourceClosureRecordIntegrityVerified,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.closureDecisionReviewRecorded,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.closureDecisionBypassAuthorized,
    boundary.workstreamFourPlanPreparationPerformed,
    boundary.workstreamFourEvidenceExecutionAuthorized,
    boundary.nextWorkstreamExecutionAuthorized,
    boundary.nextWorkstreamAutonomousStartAuthorized,
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
      ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_OPEN";

  if (
    boundary.workstreamThreeClosureAuthorized !== approved ||
    boundary.workstreamThreeClosurePerformed !== approved ||
    boundary.workstreamThreeClosed !== approved ||
    boundary.workstreamThreeCompletionEvidenceAccepted !== approved ||
    boundary.workstreamThreeCompletionClaimAuthorized !== approved ||
    boundary.workstreamThreeCompletionClaimed !== approved ||
    boundary.workstreamFourPlanPreparationAuthorized !== approved ||
    boundary.onlyWorkstreamFourPlanPreparationAuthorizedNext !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedClosureEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox workstream-closure authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision {
  if (input.sourceClosureRecord !== closureRecord) {
    throw new Error(
      "Only the canonical repository read-only sandbox workstream closure record can receive a formal closure decision.",
    );
  }

  validateCanonicalClosureRecord();

  requireIdentifier(
    "Repository read-only sandbox workstream-closure decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox workstream-closure decision time",
    input.decidedAt,
  );

  if (input.ownerId !== closureRecord.ownerId) {
    throw new Error(
      "Only the closure-record-bound NEXUS owner can formally close workstream three.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Repository read-only sandbox workstream-closure decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(closureRecord.preparedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox formal closure decision cannot precede closure-record preparation.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision(
    record,
  );

  return record;
}