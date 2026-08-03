import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-workstream-closure-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISIONS =
  [
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE",
    "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_OPEN",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecisionType;
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
      "Concurrent-coordination workstream-closure decision reason is invalid.",
    );
  }

  return normalized;
}

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation(
    preparation,
  );

  if (
    preparation.preparationState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARED_AWAITING_OWNER_DECISION" ||
    preparation.workstreamSequence !== 2 ||
    preparation.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    preparation.workstreamClosurePreparationAuthorized !== true ||
    preparation.workstreamClosurePreparationPerformed !== true ||
    preparation.formalClosureDecisionRequired !== true ||
    preparation.formalClosureDecisionRecorded !== false ||
    preparation.workstreamClosureAuthorized !== false ||
    preparation.workstreamClosurePerformed !== false ||
    preparation.closureEvidence.requiredEvidenceSequenceCount !== 8 ||
    preparation.closureEvidence.completedEvidenceSequenceCount !== 8 ||
    preparation.closureEvidence.acceptedOwnerReviewCount !== 8 ||
    preparation.closureEvidence.remainingEvidenceSequenceCount !== 0 ||
    preparation.closureEvidence.rejectedEvidenceSequenceCount !== 0 ||
    preparation.closureEvidence.missingOwnerReviewCount !== 0 ||
    preparation.closureEvidence.failedIndependentValidationAreaCount !== 0 ||
    preparation.closureEvidence.missingIndependentValidationAreaCount !== 0 ||
    preparation.closureEvidence.auditGapCount !== 0 ||
    preparation.closureEvidence.digestBindingFailureCount !== 0 ||
    preparation.closureEvidence.sequenceOrderingFailureCount !== 0 ||
    preparation.closureEvidence.authorityBoundaryFailureCount !== 0 ||
    preparation.closureEvidence.unauthorizedProgressionCount !== 0 ||
    preparation.closureEvidence.allEightEvidenceSequencesAccountedFor !== true ||
    preparation.closureEvidence.allRequiredOwnerReviewsAccountedFor !== true ||
    preparation.closureEvidence.evidenceIntegrityVerified !== true ||
    preparation.closureEvidence.auditContinuityVerified !== true ||
    preparation.closureEvidence.tenantIsolationBoundaryVerified !== true ||
    preparation.closureEvidence.consequentialAuthorityBoundariesVerified !==
      true ||
    preparation.closureEvidence.failClosedTamperDetectionVerified !== true ||
    preparation.closureEvidence.independentValidationStatus !== "PASS" ||
    preparation.closureEvidence.monitoringStatus !== "PASS" ||
    preparation.authorityBoundary.closureDecisionReviewRequired !== true ||
    preparation.authorityBoundary.closureDecisionBypassAuthorized !== false ||
    preparation.authorityBoundary.workstreamClosureAuthorized !== false ||
    preparation.authorityBoundary.workstreamClosurePerformed !== false ||
    preparation.authorityBoundary.nextWorkstreamAuthorized !== false ||
    preparation.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    preparation.authorityBoundary.concurrentEngineeringWorkAuthorized !==
      false ||
    preparation.authorityBoundary.repositoryReadAuthorized !== false ||
    preparation.authorityBoundary.repositoryWriteAuthorized !== false ||
    preparation.authorityBoundary.productionDeploymentAuthorized !== false ||
    preparation.authorityBoundary.publicLaunchAuthorized !== false ||
    preparation.authorityBoundary.founderLiberationAchieved !== false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_REVIEW"
  ) {
    throw new Error(
      "Canonical concurrent-coordination workstream-closure preparation is invalid.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_RECORDED" as const,
    tenantId: preparation.tenantId,
    ownerId,
    sourcePreparationId: preparation.preparationId,
    sourcePreparationDigest: preparation.preparationDigest,
    sourceSequenceEightOwnerReviewDecisionId:
      preparation.sourceSequenceEightOwnerReviewDecisionId,
    sourceSequenceEightOwnerReviewDecisionDigest:
      preparation.sourceSequenceEightOwnerReviewDecisionDigest,
    sourceSequenceEightExecutionId:
      preparation.sourceSequenceEightExecutionId,
    sourceSequenceEightExecutionDigest:
      preparation.sourceSequenceEightExecutionDigest,
    sourceCheckpointDigest: preparation.sourceCheckpointDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    decision,
    reason,
    closurePreparationAccepted: approved,
    formalClosureDecisionRecorded: true as const,
    workstreamClosureAuthorized: approved,
    workstreamClosurePerformed: approved,
    workstreamClosed: approved,
    reviewedClosureEvidence: {
      requiredEvidenceSequenceCount:
        preparation.closureEvidence.requiredEvidenceSequenceCount,
      completedEvidenceSequenceCount:
        preparation.closureEvidence.completedEvidenceSequenceCount,
      acceptedOwnerReviewCount:
        preparation.closureEvidence.acceptedOwnerReviewCount,
      remainingEvidenceSequenceCount:
        preparation.closureEvidence.remainingEvidenceSequenceCount,
      rejectedEvidenceSequenceCount:
        preparation.closureEvidence.rejectedEvidenceSequenceCount,
      missingOwnerReviewCount:
        preparation.closureEvidence.missingOwnerReviewCount,
      failedIndependentValidationAreaCount:
        preparation.closureEvidence.failedIndependentValidationAreaCount,
      missingIndependentValidationAreaCount:
        preparation.closureEvidence.missingIndependentValidationAreaCount,
      auditGapCount: preparation.closureEvidence.auditGapCount,
      digestBindingFailureCount:
        preparation.closureEvidence.digestBindingFailureCount,
      sequenceOrderingFailureCount:
        preparation.closureEvidence.sequenceOrderingFailureCount,
      authorityBoundaryFailureCount:
        preparation.closureEvidence.authorityBoundaryFailureCount,
      unauthorizedProgressionCount:
        preparation.closureEvidence.unauthorizedProgressionCount,
      detectedTamperProbeCount:
        preparation.closureEvidence.detectedTamperProbeCount,
      rejectedTamperProbeCount:
        preparation.closureEvidence.rejectedTamperProbeCount,
      allEightEvidenceSequencesAccountedFor:
        preparation.closureEvidence.allEightEvidenceSequencesAccountedFor,
      allRequiredOwnerReviewsAccountedFor:
        preparation.closureEvidence.allRequiredOwnerReviewsAccountedFor,
      evidenceIntegrityVerified:
        preparation.closureEvidence.evidenceIntegrityVerified,
      auditContinuityVerified:
        preparation.closureEvidence.auditContinuityVerified,
      tenantIsolationBoundaryVerified:
        preparation.closureEvidence.tenantIsolationBoundaryVerified,
      consequentialAuthorityBoundariesVerified:
        preparation.closureEvidence.consequentialAuthorityBoundariesVerified,
      failClosedTamperDetectionVerified:
        preparation.closureEvidence.failClosedTamperDetectionVerified,
      emergencyPauseEvidenceVerified:
        preparation.closureEvidence.emergencyPauseEvidenceVerified,
      rollbackEvidenceVerified:
        preparation.closureEvidence.rollbackEvidenceVerified,
      monitoringAndHealthGateEvidenceVerified:
        preparation.closureEvidence.monitoringAndHealthGateEvidenceVerified,
      escalationAndOwnerReviewEvidenceVerified:
        preparation.closureEvidence.escalationAndOwnerReviewEvidenceVerified,
      independentValidationStatus:
        preparation.closureEvidence.independentValidationStatus,
      monitoringStatus: preparation.closureEvidence.monitoringStatus,
      closureEvidenceDigest:
        preparation.closureEvidence.closureEvidenceDigest,
    },
    authorityBoundary: {
      canonicalClosurePreparationBound: true as const,
      sourcePreparationIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      formalClosureDecisionRecorded: true as const,
      closureDecisionBypassAuthorized: false as const,
      workstreamTwoClosureAuthorized: approved,
      workstreamTwoClosurePerformed: approved,
      workstreamTwoClosed: approved,
      workstreamThreePlanPreparationAuthorized: approved,
      workstreamThreePlanPreparationPerformed: false as const,
      workstreamThreeEvidenceExecutionAuthorized: false as const,
      repositoryReadOnlySandboxEvaluationAuthorized: false as const,
      repositoryReadOnlySandboxExecutionAuthorized: false as const,
      nextWorkstreamAutonomousStartAuthorized: false as const,
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
        ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_OPEN"
    ) as
      | "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_OPEN",
    decidedAt,
  };

  return deepFreeze({
    ...decisionCore,
    decisionDigest: sha256(decisionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision,
): void {
  validateCanonicalPreparation();

  requireIdentifier(
    "Concurrent-coordination workstream-closure decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination workstream-closure decision time",
    record.decidedAt,
  );

  requireReason(record.reason);

  const { decisionDigest, ...decisionCore } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(decisionCore) !== decisionDigest
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_RECORDED" ||
    record.tenantId !== preparation.tenantId ||
    record.ownerId !== preparation.ownerId ||
    record.sourcePreparationId !== preparation.preparationId ||
    record.sourcePreparationDigest !== preparation.preparationDigest ||
    record.sourceSequenceEightOwnerReviewDecisionId !==
      preparation.sourceSequenceEightOwnerReviewDecisionId ||
    record.sourceSequenceEightOwnerReviewDecisionDigest !==
      preparation.sourceSequenceEightOwnerReviewDecisionDigest ||
    record.sourceSequenceEightExecutionId !==
      preparation.sourceSequenceEightExecutionId ||
    record.sourceSequenceEightExecutionDigest !==
      preparation.sourceSequenceEightExecutionDigest ||
    record.sourceCheckpointDigest !== preparation.sourceCheckpointDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISIONS.includes(
      record.decision,
    ) ||
    record.closurePreparationAccepted !== approved ||
    record.formalClosureDecisionRecorded !== true ||
    record.workstreamClosureAuthorized !== approved ||
    record.workstreamClosurePerformed !== approved ||
    record.workstreamClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure decision identity is invalid.",
    );
  }

  const reviewed = record.reviewedClosureEvidence;

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
    reviewed.detectedTamperProbeCount !== 1 ||
    reviewed.rejectedTamperProbeCount !== 1 ||
    reviewed.allEightEvidenceSequencesAccountedFor !== true ||
    reviewed.allRequiredOwnerReviewsAccountedFor !== true ||
    reviewed.evidenceIntegrityVerified !== true ||
    reviewed.auditContinuityVerified !== true ||
    reviewed.tenantIsolationBoundaryVerified !== true ||
    reviewed.consequentialAuthorityBoundariesVerified !== true ||
    reviewed.failClosedTamperDetectionVerified !== true ||
    reviewed.emergencyPauseEvidenceVerified !== true ||
    reviewed.rollbackEvidenceVerified !== true ||
    reviewed.monitoringAndHealthGateEvidenceVerified !== true ||
    reviewed.escalationAndOwnerReviewEvidenceVerified !== true ||
    reviewed.independentValidationStatus !== "PASS" ||
    reviewed.monitoringStatus !== "PASS" ||
    reviewed.closureEvidenceDigest !==
      preparation.closureEvidence.closureEvidenceDigest
  ) {
    throw new Error(
      "Concurrent-coordination reviewed closure evidence is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalClosurePreparationBound,
    boundary.sourcePreparationIntegrityVerified,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.formalClosureDecisionRecorded,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.closureDecisionBypassAuthorized,
    boundary.workstreamThreePlanPreparationPerformed,
    boundary.workstreamThreeEvidenceExecutionAuthorized,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.nextWorkstreamAutonomousStartAuthorized,
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
      ? "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_OPEN";

  if (
    boundary.workstreamTwoClosureAuthorized !== approved ||
    boundary.workstreamTwoClosurePerformed !== approved ||
    boundary.workstreamTwoClosed !== approved ||
    boundary.workstreamThreePlanPreparationAuthorized !== approved ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedClosureEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecisionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision {
  if (input.sourcePreparation !== preparation) {
    throw new Error(
      "Only the canonical concurrent-coordination closure preparation can receive the formal owner decision.",
    );
  }

  validateCanonicalPreparation();

  requireIdentifier(
    "Concurrent-coordination workstream-closure decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Concurrent-coordination workstream-closure decision time",
    input.decidedAt,
  );

  if (input.ownerId !== preparation.ownerId) {
    throw new Error(
      "Only the preparation-bound NEXUS owner can close the concurrent-coordination workstream.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure decision is invalid.",
    );
  }

  if (Date.parse(input.decidedAt) < Date.parse(preparation.preparedAt)) {
    throw new Error(
      "Concurrent-coordination workstream-closure decision cannot precede closure preparation.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    requireReason(input.reason),
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision(
    record,
  );

  return record;
}