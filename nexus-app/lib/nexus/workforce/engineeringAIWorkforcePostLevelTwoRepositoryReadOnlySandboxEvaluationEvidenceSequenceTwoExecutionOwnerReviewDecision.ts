import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-two-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION",
    "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoOwnerReviewDecisionType;
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
      "Repository read-only sandbox sequence-two owner-review reason is invalid.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence !== 3 ||
    execution.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    execution.evidenceSequence !== 2 ||
    execution.controlId !==
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" ||
    execution.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    execution.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    execution.syntheticSanitizedEvidenceOnly !== true ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evidenceType !==
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION_EXECUTION_EVIDENCE" ||
    execution.evidence.evaluationMode !==
      "SYNTHETIC_PATH_NORMALIZATION_MODEL_ONLY" ||
    execution.evidence.evaluatedPathCaseCount !== 10 ||
    execution.evidence.containedPathAllowedCount !== 2 ||
    execution.evidence.rejectedPathCount !== 8 ||
    execution.evidence.unresolvedPathAllowedCount !== 0 ||
    execution.evidence.repositoryRootEscapeAllowed !== false ||
    execution.evidence.failClosedOnEveryRejectedPath !== true ||
    execution.evidence.deterministicNormalizationVerified !== true ||
    execution.evidence.pathContainmentVerified !== true ||
    execution.evidence.traversalRejectionVerified !== true ||
    execution.evidence.actualPathResolutionPerformed !== false ||
    execution.evidence.actualFilesystemInspectionPerformed !== false ||
    execution.evidence.actualRepositoryAccessAttempted !== false ||
    execution.evidence.actualRepositoryContentRead !== false ||
    execution.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary
      .ownerReviewRequiredImmediatelyAfterExecution !== true ||
    execution.authorityBoundary
      .sequenceThreeSyntheticEvidenceExecutionAuthorized !== false ||
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
    execution.authorityBoundary.filesystemMutationAuthorized !== false ||
    execution.authorityBoundary.gitMutationAuthorized !== false ||
    execution.authorityBoundary.commandExecutionAuthorized !== false ||
    execution.authorityBoundary.networkAccessAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-two execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW_RECORDED" as const,
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
    evidenceSequence: 2 as const,
    controlId:
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceTwoOwnerReviewRecorded: true as const,
    sequenceTwoClosed: approved,
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
      evaluatedPathCaseCount:
        execution.evidence.evaluatedPathCaseCount,
      containedPathAllowedCount:
        execution.evidence.containedPathAllowedCount,
      rejectedPathCount:
        execution.evidence.rejectedPathCount,
      parentTraversalRejectedCount:
        execution.evidence.parentTraversalRejectedCount,
      absoluteDrivePathRejectedCount:
        execution.evidence.absoluteDrivePathRejectedCount,
      networkSharePathRejectedCount:
        execution.evidence.networkSharePathRejectedCount,
      driveRelativePathRejectedCount:
        execution.evidence.driveRelativePathRejectedCount,
      encodedTraversalRejectedCount:
        execution.evidence.encodedTraversalRejectedCount,
      mixedSeparatorTraversalRejectedCount:
        execution.evidence.mixedSeparatorTraversalRejectedCount,
      emptyPathRejectedCount:
        execution.evidence.emptyPathRejectedCount,
      unresolvedPathAllowedCount:
        execution.evidence.unresolvedPathAllowedCount,
      normalizedContainmentRequired:
        execution.evidence.normalizedContainmentRequired,
      repositoryRootEscapeAllowed:
        execution.evidence.repositoryRootEscapeAllowed,
      failClosedOnEveryRejectedPath:
        execution.evidence.failClosedOnEveryRejectedPath,
      deterministicNormalizationVerified:
        execution.evidence.deterministicNormalizationVerified,
      pathContainmentVerified:
        execution.evidence.pathContainmentVerified,
      traversalRejectionVerified:
        execution.evidence.traversalRejectionVerified,
      actualPathResolutionPerformed:
        execution.evidence.actualPathResolutionPerformed,
      actualFilesystemInspectionPerformed:
        execution.evidence.actualFilesystemInspectionPerformed,
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
      sequenceTwoExecutionAccepted: approved,
      sequenceTwoEvidenceAccepted: approved,
      sequenceTwoClosed: approved,
      sequenceThreeSyntheticEvidenceExecutionAuthorized:
        approved,
      sequenceThreeSyntheticEvidenceExecutionPerformed:
        false as const,
      onlySequenceThreeAuthorizedNext: approved,
      actualRepositoryEvaluationAuthorized: false as const,
      actualRepositoryEvaluationPerformed: false as const,
      repositoryReadOnlySandboxEvaluationAuthorized:
        false as const,
      repositoryReadOnlySandboxExecutionAuthorized:
        false as const,
      actualRepositoryReadPerformed: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-two owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-two owner-review time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two owner-review integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW_RECORDED" ||
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
    record.evidenceSequence !== 2 ||
    record.controlId !==
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" ||
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceTwoOwnerReviewRecorded !== true ||
    record.sequenceTwoClosed !== approved ||
    Date.parse(record.decidedAt) <
      Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two owner-review identity is invalid.",
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
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION_EXECUTION_EVIDENCE" ||
    reviewed.evaluationMode !==
      "SYNTHETIC_PATH_NORMALIZATION_MODEL_ONLY" ||
    reviewed.evaluatedPathCaseCount !== 10 ||
    reviewed.containedPathAllowedCount !== 2 ||
    reviewed.rejectedPathCount !== 8 ||
    reviewed.parentTraversalRejectedCount !== 2 ||
    reviewed.absoluteDrivePathRejectedCount !== 1 ||
    reviewed.networkSharePathRejectedCount !== 1 ||
    reviewed.driveRelativePathRejectedCount !== 1 ||
    reviewed.encodedTraversalRejectedCount !== 1 ||
    reviewed.mixedSeparatorTraversalRejectedCount !== 1 ||
    reviewed.emptyPathRejectedCount !== 1 ||
    reviewed.unresolvedPathAllowedCount !== 0 ||
    reviewed.normalizedContainmentRequired !== true ||
    reviewed.repositoryRootEscapeAllowed !== false ||
    reviewed.failClosedOnEveryRejectedPath !== true ||
    reviewed.deterministicNormalizationVerified !== true ||
    reviewed.pathContainmentVerified !== true ||
    reviewed.traversalRejectionVerified !== true ||
    reviewed.actualPathResolutionPerformed !== false ||
    reviewed.actualFilesystemInspectionPerformed !== false ||
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
      "Repository read-only sandbox sequence-two reviewed evidence is invalid.",
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
    boundary.sequenceThreeSyntheticEvidenceExecutionPerformed,
    boundary.actualRepositoryEvaluationAuthorized,
    boundary.actualRepositoryEvaluationPerformed,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.actualRepositoryReadPerformed,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
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
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceTwoExecutionAccepted !== approved ||
    boundary.sequenceTwoEvidenceAccepted !== approved ||
    boundary.sequenceTwoClosed !== approved ||
    boundary.sequenceThreeSyntheticEvidenceExecutionAuthorized !==
      approved ||
    boundary.onlySequenceThreeAuthorizedNext !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical repository read-only sandbox sequence-two execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Repository read-only sandbox sequence-two owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-two owner-review time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence two.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision(
    record,
  );

  return record;
}