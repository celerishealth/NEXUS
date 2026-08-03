import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-workstream-closure-preparation-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparationInput {
  readonly preparationId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;
  readonly preparedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

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

const sequenceEightOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision(
    sequenceEightOwnerReview,
  );

  if (
    sequenceEightOwnerReview.decision !==
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION" ||
    sequenceEightOwnerReview.executionAccepted !== true ||
    sequenceEightOwnerReview.evidenceAccepted !== true ||
    sequenceEightOwnerReview.sequenceEightClosed !== true ||
    sequenceEightOwnerReview.allEightEvidenceSequencesAccepted !== true ||
    sequenceEightOwnerReview.reviewedEvidence
      .allEightEvidenceSequencesAccountedFor !== true ||
    sequenceEightOwnerReview.reviewedEvidence
      .allRequiredOwnerReviewsAccountedFor !== true ||
    sequenceEightOwnerReview.reviewedEvidence.evidenceIntegrityVerified !==
      true ||
    sequenceEightOwnerReview.reviewedEvidence.auditContinuityVerified !==
      true ||
    sequenceEightOwnerReview.reviewedEvidence
      .consequentialAuthorityBoundariesVerified !== true ||
    sequenceEightOwnerReview.reviewedEvidence.failedEvidenceAreaCount !== 0 ||
    sequenceEightOwnerReview.reviewedEvidence.missingEvidenceAreaCount !== 0 ||
    sequenceEightOwnerReview.reviewedEvidence.auditGapCount !== 0 ||
    sequenceEightOwnerReview.reviewedEvidence
      .authorityBoundaryFailureCount !== 0 ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamClosurePreparationAuthorized !== true ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamClosureAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .workstreamClosurePerformed !== false ||
    sequenceEightOwnerReview.authorityBoundary.nextWorkstreamAuthorized !==
      false ||
    sequenceEightOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary.repositoryReadAuthorized !==
      false ||
    sequenceEightOwnerReview.authorityBoundary.repositoryWriteAuthorized !==
      false ||
    sequenceEightOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceEightOwnerReview.authorityBoundary.publicLaunchAuthorized !==
      false ||
    sequenceEightOwnerReview.authorityBoundary.founderLiberationAchieved !==
      false ||
    sequenceEightOwnerReview.nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE"
  ) {
    throw new Error(
      "Canonical concurrent-coordination workstream-closure preparation prerequisites are invalid.",
    );
  }
}

function buildPreparation(preparationId: string, preparedAt: string) {
  const sequenceEvidenceSummary = deepFreeze([
    {
      sequence: 1,
      controlId: "SEQUENTIAL_OWNERSHIP_LEDGER",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
    {
      sequence: 2,
      controlId: "CONFLICT_DETECTION_AND_RESOLUTION",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
    {
      sequence: 3,
      controlId: "TENANT_ISOLATION_COORDINATION",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
    {
      sequence: 4,
      controlId: "EMERGENCY_PAUSE_PROTOCOL",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
    {
      sequence: 5,
      controlId: "ROLLBACK_COORDINATION_PROTOCOL",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
    {
      sequence: 6,
      controlId: "MONITORING_AND_HEALTH_GATES",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
    {
      sequence: 7,
      controlId: "ESCALATION_AND_OWNER_REVIEW",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
    {
      sequence: 8,
      controlId: "INDEPENDENT_VALIDATION_AND_AUDIT",
      evidenceExecuted: true,
      ownerReviewAccepted: true,
      closureEligible: true,
    },
  ] as const);

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
    detectedTamperProbeCount: 1 as const,
    rejectedTamperProbeCount: 1 as const,
    allEightEvidenceSequencesAccountedFor: true as const,
    allRequiredOwnerReviewsAccountedFor: true as const,
    evidenceIntegrityVerified: true as const,
    auditContinuityVerified: true as const,
    tenantIsolationBoundaryVerified: true as const,
    consequentialAuthorityBoundariesVerified: true as const,
    failClosedTamperDetectionVerified: true as const,
    emergencyPauseEvidenceVerified: true as const,
    rollbackEvidenceVerified: true as const,
    monitoringAndHealthGateEvidenceVerified: true as const,
    escalationAndOwnerReviewEvidenceVerified: true as const,
    independentValidationStatus: "PASS" as const,
    monitoringStatus: "PASS" as const,
    sequenceEvidenceSummary,
  };

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION_VERSION,
    preparationId,
    preparationState:
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARED_AWAITING_OWNER_DECISION" as const,
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
    sourceCheckpointDigest: sequenceEightOwnerReview.sourceCheckpointDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    workstreamClosurePreparationAuthorized: true as const,
    workstreamClosurePreparationPerformed: true as const,
    formalClosureDecisionRequired: true as const,
    formalClosureDecisionRecorded: false as const,
    workstreamClosureAuthorized: false as const,
    workstreamClosurePerformed: false as const,
    closureEvidence: deepFreeze({
      ...closureEvidenceCore,
      closureEvidenceDigest: sha256(closureEvidenceCore),
    }),
    authorityBoundary: {
      canonicalSequenceEightOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      closurePreparationOnly: true as const,
      closureDecisionReviewRequired: true as const,
      closureDecisionBypassAuthorized: false as const,
      formalClosureDecisionRecorded: false as const,
      workstreamClosureAuthorized: false as const,
      workstreamClosurePerformed: false as const,
      nextWorkstreamAuthorized: false as const,
      repositoryReadOnlySandboxEvaluationAuthorized: false as const,
      founderRoutineExecutionReductionEvidenceAuthorized: false as const,
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
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_REVIEW" as const,
    preparedAt,
  };

  return deepFreeze({
    ...preparationCore,
    preparationDigest: sha256(preparationCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation =
  ReturnType<typeof buildPreparation>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination workstream-closure preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Concurrent-coordination workstream-closure preparation time",
    record.preparedAt,
  );

  const { preparationDigest, ...preparationCore } = record;

  if (
    !SHA256_PATTERN.test(preparationDigest) ||
    sha256(preparationCore) !== preparationDigest
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION_VERSION ||
    record.preparationState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARED_AWAITING_OWNER_DECISION" ||
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
    record.sourceCheckpointDigest !==
      sequenceEightOwnerReview.sourceCheckpointDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.workstreamClosurePreparationAuthorized !== true ||
    record.workstreamClosurePreparationPerformed !== true ||
    record.formalClosureDecisionRequired !== true ||
    record.formalClosureDecisionRecorded !== false ||
    record.workstreamClosureAuthorized !== false ||
    record.workstreamClosurePerformed !== false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(sequenceEightOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure preparation identity is invalid.",
    );
  }

  const {
    closureEvidenceDigest,
    ...closureEvidenceCore
  } = record.closureEvidence;

  if (
    !SHA256_PATTERN.test(closureEvidenceDigest) ||
    sha256(closureEvidenceCore) !== closureEvidenceDigest ||
    record.closureEvidence.requiredEvidenceSequenceCount !== 8 ||
    record.closureEvidence.completedEvidenceSequenceCount !== 8 ||
    record.closureEvidence.acceptedOwnerReviewCount !== 8 ||
    record.closureEvidence.remainingEvidenceSequenceCount !== 0 ||
    record.closureEvidence.rejectedEvidenceSequenceCount !== 0 ||
    record.closureEvidence.missingOwnerReviewCount !== 0 ||
    record.closureEvidence.failedIndependentValidationAreaCount !== 0 ||
    record.closureEvidence.missingIndependentValidationAreaCount !== 0 ||
    record.closureEvidence.auditGapCount !== 0 ||
    record.closureEvidence.digestBindingFailureCount !== 0 ||
    record.closureEvidence.sequenceOrderingFailureCount !== 0 ||
    record.closureEvidence.authorityBoundaryFailureCount !== 0 ||
    record.closureEvidence.unauthorizedProgressionCount !== 0 ||
    record.closureEvidence.detectedTamperProbeCount !== 1 ||
    record.closureEvidence.rejectedTamperProbeCount !== 1 ||
    record.closureEvidence.allEightEvidenceSequencesAccountedFor !== true ||
    record.closureEvidence.allRequiredOwnerReviewsAccountedFor !== true ||
    record.closureEvidence.evidenceIntegrityVerified !== true ||
    record.closureEvidence.auditContinuityVerified !== true ||
    record.closureEvidence.tenantIsolationBoundaryVerified !== true ||
    record.closureEvidence.consequentialAuthorityBoundariesVerified !== true ||
    record.closureEvidence.failClosedTamperDetectionVerified !== true ||
    record.closureEvidence.emergencyPauseEvidenceVerified !== true ||
    record.closureEvidence.rollbackEvidenceVerified !== true ||
    record.closureEvidence.monitoringAndHealthGateEvidenceVerified !== true ||
    record.closureEvidence.escalationAndOwnerReviewEvidenceVerified !== true ||
    record.closureEvidence.independentValidationStatus !== "PASS" ||
    record.closureEvidence.monitoringStatus !== "PASS" ||
    record.closureEvidence.sequenceEvidenceSummary.length !== 8
  ) {
    throw new Error(
      "Concurrent-coordination workstream closure evidence is invalid.",
    );
  }

  const expectedControls = [
    "SEQUENTIAL_OWNERSHIP_LEDGER",
    "CONFLICT_DETECTION_AND_RESOLUTION",
    "TENANT_ISOLATION_COORDINATION",
    "EMERGENCY_PAUSE_PROTOCOL",
    "ROLLBACK_COORDINATION_PROTOCOL",
    "MONITORING_AND_HEALTH_GATES",
    "ESCALATION_AND_OWNER_REVIEW",
    "INDEPENDENT_VALIDATION_AND_AUDIT",
  ] as const;

  record.closureEvidence.sequenceEvidenceSummary.forEach(
    (summary, index) => {
      if (
        summary.sequence !== index + 1 ||
        summary.controlId !== expectedControls[index] ||
        summary.evidenceExecuted !== true ||
        summary.ownerReviewAccepted !== true ||
        summary.closureEligible !== true ||
        !Object.isFrozen(summary)
      ) {
        throw new Error(
          `Concurrent-coordination closure sequence summary ${index + 1} is invalid.`,
        );
      }
    },
  );

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalSequenceEightOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.closurePreparationOnly,
    boundary.closureDecisionReviewRequired,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.closureDecisionBypassAuthorized,
    boundary.formalClosureDecisionRecorded,
    boundary.workstreamClosureAuthorized,
    boundary.workstreamClosurePerformed,
    boundary.nextWorkstreamAuthorized,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.founderRoutineExecutionReductionEvidenceAuthorized,
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

  if (
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.closureEvidence) ||
    !Object.isFrozen(record.closureEvidence.sequenceEvidenceSummary) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure preparation authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparationInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation {
  if (input.sourceOwnerReview !== sequenceEightOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-eight owner review can prepare workstream closure.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination workstream-closure preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Concurrent-coordination workstream-closure preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(sequenceEightOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination workstream-closure preparation cannot precede sequence-eight owner review.",
    );
  }

  const record = buildPreparation(
    input.preparationId,
    input.preparedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-workstream-closure-preparation-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
    preparedAt: "2026-08-02T18:10:00.000Z",
  });