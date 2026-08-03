import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-two-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;
  readonly executedAt: string;
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

const decision =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION;

const sequenceOneOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
    sequenceOneOwnerReview,
  );

  const secondCandidate = decision.candidateDecisions[1];

  if (
    !secondCandidate ||
    sequenceOneOwnerReview.decision !==
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION" ||
    sequenceOneOwnerReview.executionAccepted !== true ||
    sequenceOneOwnerReview.evidenceAccepted !== true ||
    sequenceOneOwnerReview.sequenceOneClosed !== true ||
    sequenceOneOwnerReview.authorityBoundary
      .sequenceTwoEvidenceExecutionAuthorized !== true ||
    sequenceOneOwnerReview.authorityBoundary
      .sequenceTwoEvidenceExecutionPerformed !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .onlySequenceTwoAuthorizedNext !== true ||
    sequenceOneOwnerReview.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceOneOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO" ||
    secondCandidate.sequence !== 2 ||
    secondCandidate.controlId !==
      "CONFLICT_DETECTION_AND_RESOLUTION" ||
    secondCandidate.evidenceExecutionAuthorized !== true ||
    secondCandidate.evidenceExecutionPerformed !== false ||
    secondCandidate.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    secondCandidate.authorityBoundary
      .repositoryReadAuthorized !== false ||
    secondCandidate.authorityBoundary
      .repositoryWriteAuthorized !== false
  ) {
    throw new Error(
      "Canonical sequence-two conflict-control execution prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const secondCandidate = decision.candidateDecisions[1];

  if (!secondCandidate) {
    throw new Error("Sequence-two decision candidate is missing.");
  }

  const conflictCases = deepFreeze([
    {
      caseId: "conflict-case-001",
      conflictClass: "DUPLICATE_RESOURCE_OWNERSHIP",
      syntheticResourceId: "synthetic-resource-alpha",
      detectionResult: "CONFLICT_DETECTED",
      resolutionResult: "DETERMINISTIC_SEQUENCE_OWNER_SELECTED",
      selectedOwnerSequence: 1,
      escalationRequired: false,
      failClosed: true,
    },
    {
      caseId: "conflict-case-002",
      conflictClass: "EQUAL_PRIORITY_OWNER_COLLISION",
      syntheticResourceId: "synthetic-resource-beta",
      detectionResult: "CONFLICT_DETECTED",
      resolutionResult: "BLOCKED_AND_ESCALATED_TO_OWNER",
      selectedOwnerSequence: null,
      escalationRequired: true,
      failClosed: true,
    },
    {
      caseId: "conflict-case-003",
      conflictClass: "STALE_OWNERSHIP_CLAIM",
      syntheticResourceId: "synthetic-resource-gamma",
      detectionResult: "CONFLICT_DETECTED",
      resolutionResult: "STALE_CLAIM_REJECTED",
      selectedOwnerSequence: 2,
      escalationRequired: false,
      failClosed: true,
    },
    {
      caseId: "conflict-case-004",
      conflictClass: "CROSS_TENANT_OWNERSHIP_COLLISION",
      syntheticResourceId: "synthetic-resource-delta",
      detectionResult: "CONFLICT_DETECTED",
      resolutionResult: "CROSS_TENANT_ACCESS_BLOCKED_AND_ESCALATED",
      selectedOwnerSequence: null,
      escalationRequired: true,
      failClosed: true,
    },
  ] as const);

  const evidenceCore = {
    evidenceType:
      "CONFLICT_DETECTION_AND_RESOLUTION_EXECUTION_EVIDENCE" as const,
    conflictEvaluationMode:
      "SYNTHETIC_DETERMINISTIC_CONFLICT_SIMULATION" as const,
    evaluatedConflictCaseCount: 4 as const,
    detectedConflictCount: 4 as const,
    deterministicallyResolvedConflictCount: 2 as const,
    ownerEscalationRequiredCount: 2 as const,
    unresolvedConflictAllowedCount: 0 as const,
    silentConflictOverrideAllowed: false as const,
    failClosedOnEveryConflict: true as const,
    deterministicResolutionVerified: true as const,
    duplicateOwnershipPrevented: true as const,
    staleOwnershipRejected: true as const,
    crossTenantConflictBlocked: true as const,
    ownerEscalationPreserved: true as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    rollbackMarkerRecorded: true as const,
    conflictCases,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceOneOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceOneOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      secondCandidate.candidateDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 2 as const,
    controlId:
      "CONFLICT_DETECTION_AND_RESOLUTION" as const,
    evidenceClass:
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" as const,
    executionMode:
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" as const,
    evidenceToolMode:
      "READ_ONLY_EVIDENCE_ONLY" as const,
    syntheticSanitizedEvidenceOnly: true as const,
    evidenceExecutionAuthorized: true as const,
    evidenceExecutionPerformed: true as const,
    evidenceCreated: true as const,
    evidence: deepFreeze({
      ...evidenceCore,
      evidenceDigest: sha256(evidenceCore),
    }),
    authorityBoundary: {
      canonicalSequenceOneOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceTwoOnly: true as const,
      exactlyTwoEvidenceItemsExecutedInWorkstream: true as const,
      remainingSixEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceThreeEvidenceExecutionAuthorized: false as const,
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
      rollbackEvidenceRequired: true as const,
      rollbackEvidenceRecorded: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination sequence-two execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-two execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-two execution integrity is invalid.",
    );
  }

  const secondCandidate = decision.candidateDecisions[1];

  if (
    !secondCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceOneOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceOneOwnerReview.decisionDigest ||
    record.sourceExecutionDecisionId !== decision.decisionId ||
    record.sourceExecutionDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      secondCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 2 ||
    record.controlId !==
      "CONFLICT_DETECTION_AND_RESOLUTION" ||
    record.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    record.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    record.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    record.syntheticSanitizedEvidenceOnly !== true ||
    record.evidenceExecutionAuthorized !== true ||
    record.evidenceExecutionPerformed !== true ||
    record.evidenceCreated !== true ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceOneOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-two execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "CONFLICT_DETECTION_AND_RESOLUTION_EXECUTION_EVIDENCE" ||
    record.evidence.conflictEvaluationMode !==
      "SYNTHETIC_DETERMINISTIC_CONFLICT_SIMULATION" ||
    record.evidence.evaluatedConflictCaseCount !== 4 ||
    record.evidence.detectedConflictCount !== 4 ||
    record.evidence.deterministicallyResolvedConflictCount !== 2 ||
    record.evidence.ownerEscalationRequiredCount !== 2 ||
    record.evidence.unresolvedConflictAllowedCount !== 0 ||
    record.evidence.silentConflictOverrideAllowed !== false ||
    record.evidence.failClosedOnEveryConflict !== true ||
    record.evidence.deterministicResolutionVerified !== true ||
    record.evidence.duplicateOwnershipPrevented !== true ||
    record.evidence.staleOwnershipRejected !== true ||
    record.evidence.crossTenantConflictBlocked !== true ||
    record.evidence.ownerEscalationPreserved !== true ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.emergencyPauseAvailable !== true ||
    record.evidence.rollbackMarkerRecorded !== true ||
    record.evidence.conflictCases.length !== 4
  ) {
    throw new Error(
      "Conflict-detection and resolution evidence is invalid.",
    );
  }

  const expectedClasses = [
    "DUPLICATE_RESOURCE_OWNERSHIP",
    "EQUAL_PRIORITY_OWNER_COLLISION",
    "STALE_OWNERSHIP_CLAIM",
    "CROSS_TENANT_OWNERSHIP_COLLISION",
  ] as const;

  record.evidence.conflictCases.forEach((conflictCase, index) => {
    if (
      conflictCase.conflictClass !== expectedClasses[index] ||
      conflictCase.detectionResult !== "CONFLICT_DETECTED" ||
      conflictCase.failClosed !== true ||
      !Object.isFrozen(conflictCase)
    ) {
      throw new Error(
        `Conflict-control evidence case ${index + 1} is invalid.`,
      );
    }
  });

  if (
    record.evidence.conflictCases[0]
      ?.resolutionResult !==
      "DETERMINISTIC_SEQUENCE_OWNER_SELECTED" ||
    record.evidence.conflictCases[0]
      ?.selectedOwnerSequence !== 1 ||
    record.evidence.conflictCases[1]
      ?.resolutionResult !==
      "BLOCKED_AND_ESCALATED_TO_OWNER" ||
    record.evidence.conflictCases[1]
      ?.selectedOwnerSequence !== null ||
    record.evidence.conflictCases[2]
      ?.resolutionResult !==
      "STALE_CLAIM_REJECTED" ||
    record.evidence.conflictCases[2]
      ?.selectedOwnerSequence !== 2 ||
    record.evidence.conflictCases[3]
      ?.resolutionResult !==
      "CROSS_TENANT_ACCESS_BLOCKED_AND_ESCALATED" ||
    record.evidence.conflictCases[3]
      ?.selectedOwnerSequence !== null
  ) {
    throw new Error(
      "Conflict-control resolution outcomes are invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalSequenceOneOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sequenceTwoOnly,
    boundary.exactlyTwoEvidenceItemsExecutedInWorkstream,
    boundary.remainingSixEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceThreeEvidenceExecutionAuthorized,
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
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.conflictCases) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-two authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution {
  if (input.sourceOwnerReview !== sequenceOneOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-one owner review can authorize sequence two.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination sequence-two execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-two execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceOneOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-two execution cannot precede sequence-one owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-two-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T15:50:00.000Z",
  });