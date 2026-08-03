import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-three-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceThreeOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceThreeOwnerReviewDecisionType;
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
      "Concurrent-coordination sequence-three owner-review reason is invalid or contains sensitive material.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.evidenceSequence !== 3 ||
    execution.controlId !== "TENANT_ISOLATION_COORDINATION" ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.evaluatedTenantCaseCount !== 4 ||
    execution.evidence.sameTenantAllowedCaseCount !== 1 ||
    execution.evidence.blockedCrossTenantCaseCount !== 2 ||
    execution.evidence.blockedMissingBindingCaseCount !== 1 ||
    execution.evidence.unauthorizedCrossTenantAccessAllowedCount !== 0 ||
    execution.evidence.unauthorizedTenantMutationAllowedCount !== 0 ||
    execution.evidence.tenantIdentityBindingRequired !== true ||
    execution.evidence.sameTenantCoordinationVerified !== true ||
    execution.evidence.crossTenantReadBlocked !== true ||
    execution.evidence.crossTenantWriteBlocked !== true ||
    execution.evidence.missingTenantBindingBlocked !== true ||
    execution.evidence.tenantDataLeakDetected !== false ||
    execution.evidence.failClosedOnTenantMismatch !== true ||
    execution.evidence.ownerEscalationPreserved !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary.ownerReviewRequiredImmediatelyAfterExecution !==
      true ||
    execution.authorityBoundary.sequenceFourEvidenceExecutionAuthorized !==
      false ||
    execution.authorityBoundary.concurrentEngineeringWorkAuthorized !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.repositoryWriteAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical concurrent-coordination sequence-three execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceThreeOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW_RECORDED" as const,
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
    sourceSequenceTwoOwnerReviewDecisionId:
      execution.sourceOwnerReviewDecisionId,
    sourceSequenceTwoOwnerReviewDecisionDigest:
      execution.sourceOwnerReviewDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 3 as const,
    controlId:
      "TENANT_ISOLATION_COORDINATION" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceThreeOwnerReviewRecorded: true as const,
    sequenceThreeClosed: approved,
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
      evaluatedTenantCaseCount:
        execution.evidence.evaluatedTenantCaseCount,
      sameTenantAllowedCaseCount:
        execution.evidence.sameTenantAllowedCaseCount,
      blockedCrossTenantCaseCount:
        execution.evidence.blockedCrossTenantCaseCount,
      blockedMissingBindingCaseCount:
        execution.evidence.blockedMissingBindingCaseCount,
      unauthorizedCrossTenantAccessAllowedCount:
        execution.evidence.unauthorizedCrossTenantAccessAllowedCount,
      unauthorizedTenantMutationAllowedCount:
        execution.evidence.unauthorizedTenantMutationAllowedCount,
      tenantIdentityBindingRequired:
        execution.evidence.tenantIdentityBindingRequired,
      sameTenantCoordinationVerified:
        execution.evidence.sameTenantCoordinationVerified,
      crossTenantReadBlocked:
        execution.evidence.crossTenantReadBlocked,
      crossTenantWriteBlocked:
        execution.evidence.crossTenantWriteBlocked,
      missingTenantBindingBlocked:
        execution.evidence.missingTenantBindingBlocked,
      tenantDataLeakDetected:
        execution.evidence.tenantDataLeakDetected,
      failClosedOnTenantMismatch:
        execution.evidence.failClosedOnTenantMismatch,
      ownerEscalationPreserved:
        execution.evidence.ownerEscalationPreserved,
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
      sequenceThreeExecutionAccepted: approved,
      sequenceThreeEvidenceAccepted: approved,
      sequenceThreeClosed: approved,
      sequenceFourEvidenceExecutionAuthorized: approved,
      sequenceFourEvidenceExecutionPerformed: false as const,
      onlySequenceFourAuthorizedNext: approved,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-three owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-three owner-review decision time",
    record.decidedAt,
  );

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-three owner-review decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW_RECORDED" ||
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
    record.sourceSequenceTwoOwnerReviewDecisionId !==
      execution.sourceOwnerReviewDecisionId ||
    record.sourceSequenceTwoOwnerReviewDecisionDigest !==
      execution.sourceOwnerReviewDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 3 ||
    record.controlId !==
      "TENANT_ISOLATION_COORDINATION" ||
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceThreeOwnerReviewRecorded !== true ||
    record.sequenceThreeClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-three owner-review decision identity is invalid.",
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
      "TENANT_ISOLATION_COORDINATION_EXECUTION_EVIDENCE" ||
    reviewed.evaluatedTenantCaseCount !== 4 ||
    reviewed.sameTenantAllowedCaseCount !== 1 ||
    reviewed.blockedCrossTenantCaseCount !== 2 ||
    reviewed.blockedMissingBindingCaseCount !== 1 ||
    reviewed.unauthorizedCrossTenantAccessAllowedCount !== 0 ||
    reviewed.unauthorizedTenantMutationAllowedCount !== 0 ||
    reviewed.tenantIdentityBindingRequired !== true ||
    reviewed.sameTenantCoordinationVerified !== true ||
    reviewed.crossTenantReadBlocked !== true ||
    reviewed.crossTenantWriteBlocked !== true ||
    reviewed.missingTenantBindingBlocked !== true ||
    reviewed.tenantDataLeakDetected !== false ||
    reviewed.failClosedOnTenantMismatch !== true ||
    reviewed.ownerEscalationPreserved !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.rollbackMarkerRecorded !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-three reviewed execution evidence is invalid.",
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
    boundary.sequenceFourEvidenceExecutionPerformed,
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
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceThreeExecutionAccepted !== approved ||
    boundary.sequenceThreeEvidenceAccepted !== approved ||
    boundary.sequenceThreeClosed !== approved ||
    boundary.sequenceFourEvidenceExecutionAuthorized !== approved ||
    boundary.onlySequenceFourAuthorizedNext !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-three owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical concurrent-coordination sequence-three execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-three owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-three owner-review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence-three evidence.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Concurrent-coordination sequence-three owner-review decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error(
      "Concurrent-coordination sequence-three owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision(
    record,
  );

  return record;
}