import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-one-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceOneOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceOneOwnerReviewDecisionType;
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
      "Concurrent-coordination sequence-one owner-review reason is invalid or contains sensitive material.",
    );
  }

  return normalized;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.evidenceSequence !== 1 ||
    execution.controlId !== "SEQUENTIAL_OWNERSHIP_LEDGER" ||
    execution.evidenceExecutionAuthorized !== true ||
    execution.evidenceExecutionPerformed !== true ||
    execution.evidenceCreated !== true ||
    execution.evidence.executedEvidenceItemCount !== 1 ||
    execution.evidence.blockedEvidenceItemCount !== 7 ||
    execution.evidence.deterministicOrderingVerified !== true ||
    execution.evidence.uniqueControlOwnershipVerified !== true ||
    execution.evidence.controlIsolationVerified !== true ||
    execution.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    execution.evidence.monitoringStatus !== "PASS" ||
    execution.evidence.independentValidationStatus !== "PASS" ||
    execution.authorityBoundary.ownerReviewRequiredImmediatelyAfterExecution !==
      true ||
    execution.authorityBoundary.nextEvidenceExecutionAuthorized !== false ||
    execution.authorityBoundary.concurrentEngineeringWorkAuthorized !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.repositoryWriteAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.publicLaunchAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Canonical concurrent-coordination sequence-one execution is not eligible for owner review.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforceConcurrentCoordinationEvidenceSequenceOneOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW_RECORDED" as const,
    tenantId: execution.tenantId,
    ownerId,
    sourceExecutionId: execution.executionId,
    sourceExecutionDigest: execution.executionDigest,
    sourceDecisionId: execution.sourceDecisionId,
    sourceDecisionDigest: execution.sourceDecisionDigest,
    sourceCandidateDecisionDigest:
      execution.sourceCandidateDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 1 as const,
    controlId: "SEQUENTIAL_OWNERSHIP_LEDGER" as const,
    decision,
    reason,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceOneOwnerReviewRecorded: true as const,
    sequenceOneClosed: approved,
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
      executedEvidenceItemCount:
        execution.evidence.executedEvidenceItemCount,
      blockedEvidenceItemCount:
        execution.evidence.blockedEvidenceItemCount,
      concurrentOwnershipConflictDetected:
        execution.evidence.concurrentOwnershipConflictDetected,
      failClosedOnOwnershipConflict:
        execution.evidence.failClosedOnOwnershipConflict,
      deterministicOrderingVerified:
        execution.evidence.deterministicOrderingVerified,
      uniqueControlOwnershipVerified:
        execution.evidence.uniqueControlOwnershipVerified,
      controlIsolationVerified:
        execution.evidence.controlIsolationVerified,
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
      sequenceOneExecutionAccepted: approved,
      sequenceOneEvidenceAccepted: approved,
      sequenceOneClosed: approved,
      sequenceTwoEvidenceExecutionAuthorized: approved,
      sequenceTwoEvidenceExecutionPerformed: false as const,
      onlySequenceTwoAuthorizedNext: approved,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-one owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-one owner-review decision time",
    record.decidedAt,
  );

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one owner-review decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW_RECORDED" ||
    record.tenantId !== execution.tenantId ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionId !== execution.executionId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.sourceDecisionId !== execution.sourceDecisionId ||
    record.sourceDecisionDigest !== execution.sourceDecisionDigest ||
    record.sourceCandidateDecisionDigest !==
      execution.sourceCandidateDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 1 ||
    record.controlId !== "SEQUENTIAL_OWNERSHIP_LEDGER" ||
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceOneOwnerReviewRecorded !== true ||
    record.sequenceOneClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one owner-review decision identity is invalid.",
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
      "SEQUENTIAL_OWNERSHIP_LEDGER_EXECUTION_EVIDENCE" ||
    reviewed.executedEvidenceItemCount !== 1 ||
    reviewed.blockedEvidenceItemCount !== 7 ||
    reviewed.concurrentOwnershipConflictDetected !== false ||
    reviewed.failClosedOnOwnershipConflict !== true ||
    reviewed.deterministicOrderingVerified !== true ||
    reviewed.uniqueControlOwnershipVerified !== true ||
    reviewed.controlIsolationVerified !== true ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.emergencyPauseAvailable !== true ||
    reviewed.rollbackMarkerRecorded !== true ||
    reviewed.evidenceDigest !== execution.evidence.evidenceDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one reviewed execution evidence is invalid.",
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
    boundary.sequenceTwoEvidenceExecutionPerformed,
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
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_AWAITING_OWNER_REVIEW";

  if (
    boundary.sequenceOneExecutionAccepted !== approved ||
    boundary.sequenceOneEvidenceAccepted !== approved ||
    boundary.sequenceOneClosed !== approved ||
    boundary.sequenceTwoEvidenceExecutionAuthorized !== approved ||
    boundary.onlySequenceTwoAuthorizedNext !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedExecution) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one owner-review authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical concurrent-coordination sequence-one execution can receive owner review.",
    );
  }

  validateCanonicalExecution();

  requireIdentifier(
    "Concurrent-coordination sequence-one owner-review decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-one owner-review decision time",
    input.decidedAt,
  );

  if (input.ownerId !== execution.ownerId) {
    throw new Error(
      "Only the execution-bound NEXUS owner can review sequence-one evidence.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one owner-review decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error(
      "Concurrent-coordination sequence-one owner review cannot precede execution.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
    record,
  );

  return record;
}