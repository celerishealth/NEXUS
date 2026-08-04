import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-workstream-closure-record-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecordInput {
  readonly closureRecordId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;
  readonly preparedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

const CONTROL_IDS = [
  "REPOSITORY_READ_SCOPE_ALLOWLIST",
  "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION",
  "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING",
  "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION",
  "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT",
  "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS",
  "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION",
  "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW",
] as const;

const ownerReviews = [
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
] as const;

const sequenceEightOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

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

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewDecision(
    sequenceEightOwnerReview,
  );

  if (
    ownerReviews.length !== 8 ||
    sequenceEightOwnerReview.workstreamSequence !== 3 ||
    sequenceEightOwnerReview.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    sequenceEightOwnerReview.evidenceSequence !== 8 ||
    sequenceEightOwnerReview.executionAccepted !== true ||
    sequenceEightOwnerReview.evidenceAccepted !== true ||
    sequenceEightOwnerReview.sequenceEightClosed !== true ||
    sequenceEightOwnerReview.allEightEvidenceSequencesExecuted !== true ||
    sequenceEightOwnerReview.allEightEvidenceSequencesOwnerReviewed !== true ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamClosureRecordPreparationAuthorized !== true ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamClosureRecordPreparationPerformed !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .onlyWorkstreamClosureRecordPreparationAuthorizedNext !== true ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamClosureAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamClosurePerformed !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamCompletionClaimAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamCompletionClaimed !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .nextWorkstreamExecutionAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .filesystemReadAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .packageExecutionAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceEightOwnerReview.nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox closure-record prerequisites are invalid.",
    );
  }

  ownerReviews.forEach((review, index) => {
    if (
      review.workstreamSequence !== 3 ||
      review.workstreamId !==
        "repository-read-only-sandbox-evaluation" ||
      review.evidenceSequence !== index + 1 ||
      review.controlId !== CONTROL_IDS[index] ||
      review.executionAccepted !== true ||
      review.evidenceAccepted !== true ||
      !SHA256_PATTERN.test(review.decisionDigest) ||
      !Object.isFrozen(review)
    ) {
      throw new Error(
        `Repository read-only sandbox owner review ${index + 1} is invalid.`,
      );
    }
  });
}

function buildClosureRecord(
  closureRecordId: string,
  preparedAt: string,
) {
  const ownerReviewLedger = deepFreeze(
    ownerReviews.map((review, index) =>
      deepFreeze({
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        controlId: CONTROL_IDS[index],
        ownerReviewDecisionId: review.decisionId,
        ownerReviewDecisionDigest: review.decisionDigest,
        executionAccepted: review.executionAccepted,
        evidenceAccepted: review.evidenceAccepted,
        ownerReviewAccepted: true as const,
        sequenceClosed: true as const,
        actualRepositoryReadPerformed: false as const,
        consequentialAuthorityGranted: false as const,
      }),
    ),
  );

  const closureEvidenceCore = {
    requiredEvidenceSequenceCount: 8 as const,
    completedEvidenceSequenceCount: 8 as const,
    acceptedOwnerReviewCount: 8 as const,
    remainingEvidenceSequenceCount: 0 as const,
    rejectedEvidenceSequenceCount: 0 as const,
    missingOwnerReviewCount: 0 as const,
    failedIndependentValidationAreaCount: 0 as const,
    missingIndependentValidationAreaCount: 0 as const,
    auditGapCount: 0 as const,
    digestBindingFailureCount: 0 as const,
    sequenceOrderingFailureCount: 0 as const,
    authorityBoundaryFailureCount: 0 as const,
    unauthorizedProgressionCount: 0 as const,
    missedEmergencyPauseCount: 0 as const,
    missedOwnerEscalationCount: 0 as const,
    allEightEvidenceSequencesAccountedFor: true as const,
    allRequiredOwnerReviewsAccountedFor: true as const,
    evidenceIntegrityVerified: true as const,
    auditContinuityVerified: true as const,
    tenantIsolationBoundaryVerified: true as const,
    ownerBindingVerified: true as const,
    consequentialAuthorityBoundariesVerified: true as const,
    failClosedTamperDetectionVerified: true as const,
    emergencyPauseEvidenceVerified: true as const,
    rollbackEvidenceVerified: true as const,
    monitoringAndHealthGateEvidenceVerified: true as const,
    escalationAndOwnerReviewEvidenceVerified: true as const,
    deterministicReplayVerified: true as const,
    actualRepositoryEvaluationPerformed: false as const,
    actualRepositoryReadPerformed: false as const,
    actualFilesystemReadPerformed: false as const,
    actualCommandExecutionPerformed: false as const,
    actualPackageExecutionPerformed: false as const,
    actualNetworkAccessPerformed: false as const,
    actualProductionActionPerformed: false as const,
    actualExternalActionPerformed: false as const,
    independentValidationStatus: "PASS" as const,
    monitoringStatus: "PASS" as const,
    ownerReviewLedger,
  };

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD_VERSION,
    closureRecordId,
    closureRecordState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD_PREPARED_AWAITING_OWNER_DECISION" as const,
    tenantId: sequenceEightOwnerReview.tenantId,
    ownerId: sequenceEightOwnerReview.ownerId,
    sourceSequenceEightOwnerReviewDecisionId:
      sequenceEightOwnerReview.decisionId,
    sourceSequenceEightOwnerReviewDecisionDigest:
      sequenceEightOwnerReview.decisionDigest,
    sourceSequenceEightExecutionId:
      sequenceEightOwnerReview.sourceExecutionId,
    sourceSequenceEightExecutionDigest:
      sequenceEightOwnerReview.sourceExecutionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceClass:
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" as const,
    workstreamClosureRecordPreparationAuthorized: true as const,
    workstreamClosureRecordPreparationPerformed: true as const,
    formalClosureDecisionRequired: true as const,
    formalClosureDecisionRecorded: false as const,
    workstreamClosureAuthorized: false as const,
    workstreamClosurePerformed: false as const,
    workstreamClosed: false as const,
    closureEvidence: deepFreeze({
      ...closureEvidenceCore,
      closureEvidenceDigest: sha256(closureEvidenceCore),
    }),
    authorityBoundary: {
      canonicalSequenceEightOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      closureRecordPreparationOnly: true as const,
      closureDecisionReviewRequired: true as const,
      closureDecisionBypassAuthorized: false as const,
      formalClosureDecisionRecorded: false as const,
      workstreamClosureAuthorized: false as const,
      workstreamClosurePerformed: false as const,
      workstreamClosed: false as const,
      workstreamCompletionClaimAuthorized: false as const,
      workstreamCompletionClaimed: false as const,
      workstreamFourPlanPreparationAuthorized: false as const,
      workstreamFourPlanPreparationPerformed: false as const,
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
      monitoringPassed: true as const,
      emergencyPauseAvailable: true as const,
      rollbackEvidenceRequired: true as const,
      rollbackEvidenceRecorded: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_REVIEW" as const,
    preparedAt,
  };

  return deepFreeze({
    ...recordCore,
    closureRecordDigest: sha256(recordCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord =
  ReturnType<typeof buildClosureRecord>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox workstream closure-record ID",
    record.closureRecordId,
  );

  requireTimestamp(
    "Repository read-only sandbox workstream closure-record preparation time",
    record.preparedAt,
  );

  const { closureRecordDigest, ...recordCore } = record;

  if (
    !SHA256_PATTERN.test(closureRecordDigest) ||
    sha256(recordCore) !== closureRecordDigest
  ) {
    throw new Error(
      "Repository read-only sandbox workstream closure-record integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD_VERSION ||
    record.closureRecordState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD_PREPARED_AWAITING_OWNER_DECISION" ||
    record.tenantId !== sequenceEightOwnerReview.tenantId ||
    record.ownerId !== sequenceEightOwnerReview.ownerId ||
    record.sourceSequenceEightOwnerReviewDecisionId !==
      sequenceEightOwnerReview.decisionId ||
    record.sourceSequenceEightOwnerReviewDecisionDigest !==
      sequenceEightOwnerReview.decisionDigest ||
    record.sourceSequenceEightExecutionId !==
      sequenceEightOwnerReview.sourceExecutionId ||
    record.sourceSequenceEightExecutionDigest !==
      sequenceEightOwnerReview.sourceExecutionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceClass !==
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" ||
    record.workstreamClosureRecordPreparationAuthorized !== true ||
    record.workstreamClosureRecordPreparationPerformed !== true ||
    record.formalClosureDecisionRequired !== true ||
    record.formalClosureDecisionRecorded !== false ||
    record.workstreamClosureAuthorized !== false ||
    record.workstreamClosurePerformed !== false ||
    record.workstreamClosed !== false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(sequenceEightOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox workstream closure-record identity is invalid.",
    );
  }

  const {
    closureEvidenceDigest,
    ...closureEvidenceCore
  } = record.closureEvidence;

  const evidence = record.closureEvidence;

  if (
    !SHA256_PATTERN.test(closureEvidenceDigest) ||
    sha256(closureEvidenceCore) !== closureEvidenceDigest ||
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
    evidence.ownerReviewLedger.length !== 8
  ) {
    throw new Error(
      "Repository read-only sandbox workstream closure evidence is invalid.",
    );
  }

  evidence.ownerReviewLedger.forEach((entry, index) => {
    const review = ownerReviews[index];

    if (
      !review ||
      entry.sequence !== index + 1 ||
      entry.controlId !== CONTROL_IDS[index] ||
      entry.ownerReviewDecisionId !== review.decisionId ||
      entry.ownerReviewDecisionDigest !== review.decisionDigest ||
      entry.executionAccepted !== true ||
      entry.evidenceAccepted !== true ||
      entry.ownerReviewAccepted !== true ||
      entry.sequenceClosed !== true ||
      entry.actualRepositoryReadPerformed !== false ||
      entry.consequentialAuthorityGranted !== false ||
      !Object.isFrozen(entry)
    ) {
      throw new Error(
        `Repository read-only sandbox closure owner-review ledger entry ${index + 1} is invalid.`,
      );
    }
  });

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalSequenceEightOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.closureRecordPreparationOnly,
    boundary.closureDecisionReviewRequired,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.closureDecisionBypassAuthorized,
    boundary.formalClosureDecisionRecorded,
    boundary.workstreamClosureAuthorized,
    boundary.workstreamClosurePerformed,
    boundary.workstreamClosed,
    boundary.workstreamCompletionClaimAuthorized,
    boundary.workstreamCompletionClaimed,
    boundary.workstreamFourPlanPreparationAuthorized,
    boundary.workstreamFourPlanPreparationPerformed,
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

  if (
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.closureEvidence) ||
    !Object.isFrozen(record.closureEvidence.ownerReviewLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox workstream closure-record authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecordInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord {
  if (input.sourceOwnerReview !== sequenceEightOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-eight owner review can prepare the repository read-only sandbox workstream closure record.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox workstream closure-record ID",
    input.closureRecordId,
  );

  requireTimestamp(
    "Repository read-only sandbox workstream closure-record preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(sequenceEightOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox closure-record preparation cannot precede sequence-eight owner review.",
    );
  }

  const record = buildClosureRecord(
    input.closureRecordId,
    input.preparedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord({
    closureRecordId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-workstream-closure-record-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
    preparedAt: "2026-08-02T21:50:00.000Z",
  });