import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-five-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveOwnerReviewDecisionType;
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
      "Repository read-only sandbox sequence-five owner-review reason is invalid.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence !== 3 ||
    execution.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    execution.evidenceSequence !== 5 ||
    execution.controlId !==
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" ||
    execution.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    execution.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    execution.syntheticSanitizedEvidenceOnly !== true ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evidenceType !==
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT_EXECUTION_EVIDENCE" ||
    execution.evidence.evaluationMode !==
      "SYNTHETIC_READ_ONLY_TOOL_POLICY_MODEL_ONLY" ||
    execution.evidence.evaluatedEnforcementCaseCount !== 10 ||
    execution.evidence.readOnlyAllowedCaseCount !== 2 ||
    execution.evidence.blockedOperationCaseCount !== 8 ||
    execution.evidence.blockedFilesystemMutationCaseCount !== 5 ||
    execution.evidence.blockedCommandExecutionCaseCount !== 1 ||
    execution.evidence.blockedPackageExecutionCaseCount !== 1 ||
    execution.evidence.blockedNetworkAccessCaseCount !== 1 ||
    execution.evidence.unauthorizedOperationAllowedCount !== 0 ||
    execution.evidence.readOnlyFilesystemRequired !== true ||
    execution.evidence.readOnlyToolModeRequired !== true ||
    execution.evidence.boundedReadLimitRequired !== true ||
    execution.evidence.filesystemWriteAllowed !== false ||
    execution.evidence.filesystemCreateAllowed !== false ||
    execution.evidence.filesystemDeleteAllowed !== false ||
    execution.evidence.filesystemRenameAllowed !== false ||
    execution.evidence.filesystemPermissionChangeAllowed !== false ||
    execution.evidence.commandExecutionAllowed !== false ||
    execution.evidence.packageExecutionAllowed !== false ||
    execution.evidence.networkAccessAllowed !== false ||
    execution.evidence.failClosedOnUnknownTool !== true ||
    execution.evidence.failClosedOnMutationRequest !== true ||
    execution.evidence.deterministicToolPolicyVerified !== true ||
    execution.evidence.readOnlyEnforcementVerified !== true ||
    execution.evidence.mutationBlockingVerified !== true ||
    execution.evidence.commandBlockingVerified !== true ||
    execution.evidence.packageBlockingVerified !== true ||
    execution.evidence.networkBlockingVerified !== true ||
    execution.evidence.actualFilesystemReadPerformed !== false ||
    execution.evidence.actualFilesystemMutationPerformed !== false ||
    execution.evidence.actualToolExecutionPerformed !== false ||
    execution.evidence.actualCommandExecutionPerformed !== false ||
    execution.evidence.actualPackageExecutionPerformed !== false ||
    execution.evidence.actualNetworkAccessPerformed !== false ||
    execution.evidence.actualRepositoryAccessAttempted !== false ||
    execution.evidence.actualRepositoryContentRead !== false ||
    execution.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary
      .ownerReviewRequiredImmediatelyAfterExecution !== true ||
    execution.authorityBoundary
      .sequenceSixSyntheticEvidenceExecutionAuthorized !== false ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-five execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW_RECORDED" as const,
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
    evidenceSequence: 5 as const,
    controlId:
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceFiveOwnerReviewRecorded: true as const,
    sequenceFiveClosed: approved,
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
      evaluatedEnforcementCaseCount:
        execution.evidence.evaluatedEnforcementCaseCount,
      readOnlyAllowedCaseCount:
        execution.evidence.readOnlyAllowedCaseCount,
      blockedOperationCaseCount:
        execution.evidence.blockedOperationCaseCount,
      blockedFilesystemMutationCaseCount:
        execution.evidence.blockedFilesystemMutationCaseCount,
      blockedCommandExecutionCaseCount:
        execution.evidence.blockedCommandExecutionCaseCount,
      blockedPackageExecutionCaseCount:
        execution.evidence.blockedPackageExecutionCaseCount,
      blockedNetworkAccessCaseCount:
        execution.evidence.blockedNetworkAccessCaseCount,
      unauthorizedOperationAllowedCount:
        execution.evidence.unauthorizedOperationAllowedCount,
      readOnlyFilesystemRequired:
        execution.evidence.readOnlyFilesystemRequired,
      readOnlyToolModeRequired:
        execution.evidence.readOnlyToolModeRequired,
      boundedReadLimitRequired:
        execution.evidence.boundedReadLimitRequired,
      filesystemWriteAllowed:
        execution.evidence.filesystemWriteAllowed,
      filesystemCreateAllowed:
        execution.evidence.filesystemCreateAllowed,
      filesystemDeleteAllowed:
        execution.evidence.filesystemDeleteAllowed,
      filesystemRenameAllowed:
        execution.evidence.filesystemRenameAllowed,
      filesystemPermissionChangeAllowed:
        execution.evidence.filesystemPermissionChangeAllowed,
      commandExecutionAllowed:
        execution.evidence.commandExecutionAllowed,
      packageExecutionAllowed:
        execution.evidence.packageExecutionAllowed,
      networkAccessAllowed:
        execution.evidence.networkAccessAllowed,
      failClosedOnUnknownTool:
        execution.evidence.failClosedOnUnknownTool,
      failClosedOnMutationRequest:
        execution.evidence.failClosedOnMutationRequest,
      deterministicToolPolicyVerified:
        execution.evidence.deterministicToolPolicyVerified,
      readOnlyEnforcementVerified:
        execution.evidence.readOnlyEnforcementVerified,
      mutationBlockingVerified:
        execution.evidence.mutationBlockingVerified,
      commandBlockingVerified:
        execution.evidence.commandBlockingVerified,
      packageBlockingVerified:
        execution.evidence.packageBlockingVerified,
      networkBlockingVerified:
        execution.evidence.networkBlockingVerified,
      actualFilesystemReadPerformed:
        execution.evidence.actualFilesystemReadPerformed,
      actualFilesystemMutationPerformed:
        execution.evidence.actualFilesystemMutationPerformed,
      actualToolExecutionPerformed:
        execution.evidence.actualToolExecutionPerformed,
      actualCommandExecutionPerformed:
        execution.evidence.actualCommandExecutionPerformed,
      actualPackageExecutionPerformed:
        execution.evidence.actualPackageExecutionPerformed,
      actualNetworkAccessPerformed:
        execution.evidence.actualNetworkAccessPerformed,
      actualRepositoryAccessAttempted:
        execution.evidence.actualRepositoryAccessAttempted,
      actualRepositoryContentRead:
        execution.evidence.actualRepositoryContentRead,
      nextEvidenceBlockedUntilOwnerReview:
        execution.evidence.nextEvidenceBlockedUntilOwnerReview,
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
      sequenceFiveExecutionAccepted: approved,
      sequenceFiveEvidenceAccepted: approved,
      sequenceFiveClosed: approved,
      sequenceSixSyntheticEvidenceExecutionAuthorized:
        approved,
      sequenceSixSyntheticEvidenceExecutionPerformed:
        false as const,
      onlySequenceSixAuthorizedNext: approved,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-five owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-five owner-review time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five owner-review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW_RECORDED" ||
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
    record.evidenceSequence !== 5 ||
    record.controlId !==
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" ||
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceFiveOwnerReviewRecorded !== true ||
    record.sequenceFiveClosed !== approved ||
    Date.parse(record.decidedAt) <
      Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five owner-review identity is invalid.",
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
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT_EXECUTION_EVIDENCE" ||
    reviewed.evaluationMode !==
      "SYNTHETIC_READ_ONLY_TOOL_POLICY_MODEL_ONLY" ||
    reviewed.evaluatedEnforcementCaseCount !== 10 ||
    reviewed.readOnlyAllowedCaseCount !== 2 ||
    reviewed.blockedOperationCaseCount !== 8 ||
    reviewed.blockedFilesystemMutationCaseCount !== 5 ||
    reviewed.blockedCommandExecutionCaseCount !== 1 ||
    reviewed.blockedPackageExecutionCaseCount !== 1 ||
    reviewed.blockedNetworkAccessCaseCount !== 1 ||
    reviewed.unauthorizedOperationAllowedCount !== 0 ||
    reviewed.readOnlyFilesystemRequired !== true ||
    reviewed.readOnlyToolModeRequired !== true ||
    reviewed.boundedReadLimitRequired !== true ||
    reviewed.filesystemWriteAllowed !== false ||
    reviewed.filesystemCreateAllowed !== false ||
    reviewed.filesystemDeleteAllowed !== false ||
    reviewed.filesystemRenameAllowed !== false ||
    reviewed.filesystemPermissionChangeAllowed !== false ||
    reviewed.commandExecutionAllowed !== false ||
    reviewed.packageExecutionAllowed !== false ||
    reviewed.networkAccessAllowed !== false ||
    reviewed.failClosedOnUnknownTool !== true ||
    reviewed.failClosedOnMutationRequest !== true ||
    reviewed.deterministicToolPolicyVerified !== true ||
    reviewed.readOnlyEnforcementVerified !== true ||
    reviewed.mutationBlockingVerified !== true ||
    reviewed.commandBlockingVerified !== true ||
    reviewed.packageBlockingVerified !== true ||
    reviewed.networkBlockingVerified !== true ||
    reviewed.actualFilesystemReadPerformed !== false ||
    reviewed.actualFilesystemMutationPerformed !== false ||
    reviewed.actualToolExecutionPerformed !== false ||
    reviewed.actualCommandExecutionPerformed !== false ||
    reviewed.actualPackageExecutionPerformed !== false ||
    reviewed.actualNetworkAccessPerformed !== false ||
    reviewed.actualRepositoryAccessAttempted !== false ||
    reviewed.actualRepositoryContentRead !== false ||
    reviewed.nextEvidenceBlockedUntilOwnerReview !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.rollbackMarkerRecorded !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five reviewed evidence is invalid.",
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
    boundary.sequenceSixSyntheticEvidenceExecutionPerformed,
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
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceFiveExecutionAccepted !== approved ||
    boundary.sequenceFiveEvidenceAccepted !== approved ||
    boundary.sequenceFiveClosed !== approved ||
    boundary.sequenceSixSyntheticEvidenceExecutionAuthorized !==
      approved ||
    boundary.onlySequenceSixAuthorizedNext !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical repository read-only sandbox sequence-five execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-five owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-five owner-review time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence five.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision(
    record,
  );

  return record;
}