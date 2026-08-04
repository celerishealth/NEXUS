import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-six-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixOwnerReviewDecisionType;
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
    normalized.length < 80 ||
    normalized.length > 1400 ||
    SENSITIVE_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six owner-review reason is invalid.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence !== 3 ||
    execution.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    execution.evidenceSequence !== 6 ||
    execution.controlId !==
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" ||
    execution.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    execution.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    execution.syntheticSanitizedEvidenceOnly !== true ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evidenceType !==
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS_EXECUTION_EVIDENCE" ||
    execution.evidence.evaluationMode !==
      "SYNTHETIC_RESOURCE_LIMIT_POLICY_MODEL_ONLY" ||
    execution.evidence.evaluatedResourceCaseCount !== 10 ||
    execution.evidence.boundedRequestAllowedCaseCount !== 2 ||
    execution.evidence.blockedResourceRequestCaseCount !== 8 ||
    execution.evidence.unauthorizedOversizedRequestAllowedCount !== 0 ||
    execution.evidence.unboundedResourceQueryAllowed !== false ||
    execution.evidence.recursiveUnboundedQueryAllowed !== false ||
    execution.evidence.repeatedAbusiveQueryAllowed !== false ||
    execution.evidence.oversizedOutputAllowed !== false ||
    execution.evidence.unlimitedEvidenceRetentionAllowed !== false ||
    execution.evidence.failClosedOnAnyLimitBreach !== true ||
    execution.evidence.failClosedOnUnknownResourceRequest !== true ||
    execution.evidence.deterministicResourceLimitEvaluationVerified !== true ||
    execution.evidence.resourceQueryLimitEnforcementVerified !== true ||
    execution.evidence.outputLimitEnforcementVerified !== true ||
    execution.evidence.evidenceRetentionLimitEnforcementVerified !== true ||
    execution.evidence.ownerEscalationOnLimitBreachVerified !== true ||
    execution.evidence.actualResourceQueryPerformed !== false ||
    execution.evidence.actualFilesystemReadPerformed !== false ||
    execution.evidence.actualRepositoryAccessAttempted !== false ||
    execution.evidence.actualRepositoryContentRead !== false ||
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
      .sequenceSevenSyntheticEvidenceExecutionAuthorized !== false ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-six execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW_RECORDED" as const,
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
    evidenceSequence: 6 as const,
    controlId:
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceSixOwnerReviewRecorded: true as const,
    sequenceSixClosed: approved,
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
      evaluatedResourceCaseCount:
        execution.evidence.evaluatedResourceCaseCount,
      boundedRequestAllowedCaseCount:
        execution.evidence.boundedRequestAllowedCaseCount,
      blockedResourceRequestCaseCount:
        execution.evidence.blockedResourceRequestCaseCount,
      fileCountLimitBreachBlockedCount:
        execution.evidence.fileCountLimitBreachBlockedCount,
      byteCountLimitBreachBlockedCount:
        execution.evidence.byteCountLimitBreachBlockedCount,
      lineCountLimitBreachBlockedCount:
        execution.evidence.lineCountLimitBreachBlockedCount,
      queryCountLimitBreachBlockedCount:
        execution.evidence.queryCountLimitBreachBlockedCount,
      recursionDepthLimitBreachBlockedCount:
        execution.evidence.recursionDepthLimitBreachBlockedCount,
      executionDurationLimitBreachBlockedCount:
        execution.evidence.executionDurationLimitBreachBlockedCount,
      outputSizeLimitBreachBlockedCount:
        execution.evidence.outputSizeLimitBreachBlockedCount,
      evidenceRetentionLimitBreachBlockedCount:
        execution.evidence.evidenceRetentionLimitBreachBlockedCount,
      unauthorizedOversizedRequestAllowedCount:
        execution.evidence.unauthorizedOversizedRequestAllowedCount,
      maximumFileCount:
        execution.evidence.maximumFileCount,
      maximumByteCount:
        execution.evidence.maximumByteCount,
      maximumLineCount:
        execution.evidence.maximumLineCount,
      maximumQueryCount:
        execution.evidence.maximumQueryCount,
      maximumRecursionDepth:
        execution.evidence.maximumRecursionDepth,
      maximumExecutionDurationMs:
        execution.evidence.maximumExecutionDurationMs,
      maximumOutputByteCount:
        execution.evidence.maximumOutputByteCount,
      maximumEvidenceRetentionItemCount:
        execution.evidence.maximumEvidenceRetentionItemCount,
      fileCountLimitRequired:
        execution.evidence.fileCountLimitRequired,
      byteCountLimitRequired:
        execution.evidence.byteCountLimitRequired,
      lineRangeLimitRequired:
        execution.evidence.lineRangeLimitRequired,
      queryCountLimitRequired:
        execution.evidence.queryCountLimitRequired,
      recursionDepthLimitRequired:
        execution.evidence.recursionDepthLimitRequired,
      executionDurationLimitRequired:
        execution.evidence.executionDurationLimitRequired,
      outputSizeLimitRequired:
        execution.evidence.outputSizeLimitRequired,
      evidenceRetentionLimitRequired:
        execution.evidence.evidenceRetentionLimitRequired,
      unboundedResourceQueryAllowed:
        execution.evidence.unboundedResourceQueryAllowed,
      recursiveUnboundedQueryAllowed:
        execution.evidence.recursiveUnboundedQueryAllowed,
      repeatedAbusiveQueryAllowed:
        execution.evidence.repeatedAbusiveQueryAllowed,
      oversizedOutputAllowed:
        execution.evidence.oversizedOutputAllowed,
      unlimitedEvidenceRetentionAllowed:
        execution.evidence.unlimitedEvidenceRetentionAllowed,
      failClosedOnAnyLimitBreach:
        execution.evidence.failClosedOnAnyLimitBreach,
      failClosedOnUnknownResourceRequest:
        execution.evidence.failClosedOnUnknownResourceRequest,
      deterministicResourceLimitEvaluationVerified:
        execution.evidence.deterministicResourceLimitEvaluationVerified,
      resourceQueryLimitEnforcementVerified:
        execution.evidence.resourceQueryLimitEnforcementVerified,
      outputLimitEnforcementVerified:
        execution.evidence.outputLimitEnforcementVerified,
      evidenceRetentionLimitEnforcementVerified:
        execution.evidence.evidenceRetentionLimitEnforcementVerified,
      ownerEscalationOnLimitBreachVerified:
        execution.evidence.ownerEscalationOnLimitBreachVerified,
      actualResourceQueryPerformed:
        execution.evidence.actualResourceQueryPerformed,
      actualFilesystemReadPerformed:
        execution.evidence.actualFilesystemReadPerformed,
      actualRepositoryAccessAttempted:
        execution.evidence.actualRepositoryAccessAttempted,
      actualRepositoryContentRead:
        execution.evidence.actualRepositoryContentRead,
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
      emergencyPauseTriggeredForBreachCases:
        execution.evidence.emergencyPauseTriggeredForBreachCases,
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
      sequenceSixExecutionAccepted: approved,
      sequenceSixEvidenceAccepted: approved,
      sequenceSixClosed: approved,
      sequenceSevenSyntheticEvidenceExecutionAuthorized:
        approved,
      sequenceSevenSyntheticEvidenceExecutionPerformed:
        false as const,
      onlySequenceSevenAuthorizedNext: approved,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-six owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-six owner-review time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six owner-review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW_RECORDED" ||
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
    record.evidenceSequence !== 6 ||
    record.controlId !==
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" ||
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceSixOwnerReviewRecorded !== true ||
    record.sequenceSixClosed !== approved ||
    Date.parse(record.decidedAt) <
      Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six owner-review identity is invalid.",
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
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS_EXECUTION_EVIDENCE" ||
    reviewed.evaluationMode !==
      "SYNTHETIC_RESOURCE_LIMIT_POLICY_MODEL_ONLY" ||
    reviewed.evaluatedResourceCaseCount !== 10 ||
    reviewed.boundedRequestAllowedCaseCount !== 2 ||
    reviewed.blockedResourceRequestCaseCount !== 8 ||
    reviewed.fileCountLimitBreachBlockedCount !== 1 ||
    reviewed.byteCountLimitBreachBlockedCount !== 1 ||
    reviewed.lineCountLimitBreachBlockedCount !== 1 ||
    reviewed.queryCountLimitBreachBlockedCount !== 1 ||
    reviewed.recursionDepthLimitBreachBlockedCount !== 1 ||
    reviewed.executionDurationLimitBreachBlockedCount !== 1 ||
    reviewed.outputSizeLimitBreachBlockedCount !== 1 ||
    reviewed.evidenceRetentionLimitBreachBlockedCount !== 1 ||
    reviewed.unauthorizedOversizedRequestAllowedCount !== 0 ||
    reviewed.maximumFileCount !== 25 ||
    reviewed.maximumByteCount !== 1_048_576 ||
    reviewed.maximumLineCount !== 5_000 ||
    reviewed.maximumQueryCount !== 20 ||
    reviewed.maximumRecursionDepth !== 4 ||
    reviewed.maximumExecutionDurationMs !== 30_000 ||
    reviewed.maximumOutputByteCount !== 262_144 ||
    reviewed.maximumEvidenceRetentionItemCount !== 100 ||
    reviewed.fileCountLimitRequired !== true ||
    reviewed.byteCountLimitRequired !== true ||
    reviewed.lineRangeLimitRequired !== true ||
    reviewed.queryCountLimitRequired !== true ||
    reviewed.recursionDepthLimitRequired !== true ||
    reviewed.executionDurationLimitRequired !== true ||
    reviewed.outputSizeLimitRequired !== true ||
    reviewed.evidenceRetentionLimitRequired !== true ||
    reviewed.unboundedResourceQueryAllowed !== false ||
    reviewed.recursiveUnboundedQueryAllowed !== false ||
    reviewed.repeatedAbusiveQueryAllowed !== false ||
    reviewed.oversizedOutputAllowed !== false ||
    reviewed.unlimitedEvidenceRetentionAllowed !== false ||
    reviewed.failClosedOnAnyLimitBreach !== true ||
    reviewed.failClosedOnUnknownResourceRequest !== true ||
    reviewed.deterministicResourceLimitEvaluationVerified !== true ||
    reviewed.resourceQueryLimitEnforcementVerified !== true ||
    reviewed.outputLimitEnforcementVerified !== true ||
    reviewed.evidenceRetentionLimitEnforcementVerified !== true ||
    reviewed.ownerEscalationOnLimitBreachVerified !== true ||
    reviewed.actualResourceQueryPerformed !== false ||
    reviewed.actualFilesystemReadPerformed !== false ||
    reviewed.actualRepositoryAccessAttempted !== false ||
    reviewed.actualRepositoryContentRead !== false ||
    reviewed.actualOutputProduced !== false ||
    reviewed.actualCommandExecutionPerformed !== false ||
    reviewed.actualPackageExecutionPerformed !== false ||
    reviewed.actualNetworkAccessPerformed !== false ||
    reviewed.nextEvidenceBlockedUntilOwnerReview !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.emergencyPauseTriggeredForBreachCases !== true ||
    reviewed.rollbackMarkerRecorded !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six reviewed evidence is invalid.",
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
    boundary.sequenceSevenSyntheticEvidenceExecutionPerformed,
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
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceSixExecutionAccepted !== approved ||
    boundary.sequenceSixEvidenceAccepted !== approved ||
    boundary.sequenceSixClosed !== approved ||
    boundary.sequenceSevenSyntheticEvidenceExecutionAuthorized !==
      approved ||
    boundary.onlySequenceSevenAuthorizedNext !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical repository read-only sandbox sequence-six execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-six owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-six owner-review time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence six.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision(
    record,
  );

  return record;
}