import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-five-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;
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

const sequenceFourOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision(
    sequenceFourOwnerReview,
  );

  const fifthCandidate = decision.candidateDecisions[4];

  if (
    !fifthCandidate ||
    sequenceFourOwnerReview.decision !==
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION" ||
    sequenceFourOwnerReview.executionAccepted !== true ||
    sequenceFourOwnerReview.evidenceAccepted !== true ||
    sequenceFourOwnerReview.sequenceFourClosed !== true ||
    sequenceFourOwnerReview.authorityBoundary
      .sequenceFiveEvidenceExecutionAuthorized !== true ||
    sequenceFourOwnerReview.authorityBoundary
      .sequenceFiveEvidenceExecutionPerformed !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .onlySequenceFiveAuthorizedNext !== true ||
    sequenceFourOwnerReview.authorityBoundary
      .resumeAuthorizationGranted !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceFourOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE" ||
    fifthCandidate.sequence !== 5 ||
    fifthCandidate.controlId !==
      "ROLLBACK_COORDINATION_PROTOCOL" ||
    fifthCandidate.evidenceExecutionAuthorized !== true ||
    fifthCandidate.evidenceExecutionPerformed !== false ||
    fifthCandidate.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    fifthCandidate.authorityBoundary
      .repositoryReadAuthorized !== false ||
    fifthCandidate.authorityBoundary
      .repositoryWriteAuthorized !== false
  ) {
    throw new Error(
      "Canonical sequence-five rollback execution prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const fifthCandidate = decision.candidateDecisions[4];

  if (!fifthCandidate) {
    throw new Error("Sequence-five decision candidate is missing.");
  }

  const rollbackCases = deepFreeze([
    {
      caseId: "rollback-case-001",
      rollbackClass: "PARTIAL_COORDINATION_FAILURE",
      syntheticCheckpointId: "checkpoint-sequence-five-alpha",
      failureDetected: true,
      rollbackRequired: true,
      rollbackExecuted: true,
      rollbackTargetVerified: true,
      partialStateRetained: false,
      forwardExecutionAllowed: false,
      ownerEscalationRequired: true,
      finalState: "ROLLED_BACK_SAFE",
      failClosed: true,
    },
    {
      caseId: "rollback-case-002",
      rollbackClass: "OWNERSHIP_CONFLICT_AFTER_PREPARATION",
      syntheticCheckpointId: "checkpoint-sequence-five-beta",
      failureDetected: true,
      rollbackRequired: true,
      rollbackExecuted: true,
      rollbackTargetVerified: true,
      partialStateRetained: false,
      forwardExecutionAllowed: false,
      ownerEscalationRequired: true,
      finalState: "ROLLED_BACK_SAFE",
      failClosed: true,
    },
    {
      caseId: "rollback-case-003",
      rollbackClass: "TENANT_BOUNDARY_VIOLATION_SIGNAL",
      syntheticCheckpointId: "checkpoint-sequence-five-gamma",
      failureDetected: true,
      rollbackRequired: true,
      rollbackExecuted: true,
      rollbackTargetVerified: true,
      partialStateRetained: false,
      forwardExecutionAllowed: false,
      ownerEscalationRequired: true,
      finalState: "ROLLED_BACK_SAFE",
      failClosed: true,
    },
    {
      caseId: "rollback-case-004",
      rollbackClass: "INVALID_ROLLBACK_TARGET_ATTEMPT",
      syntheticCheckpointId: "checkpoint-sequence-five-invalid",
      failureDetected: true,
      rollbackRequired: true,
      rollbackExecuted: false,
      rollbackTargetVerified: false,
      partialStateRetained: false,
      forwardExecutionAllowed: false,
      ownerEscalationRequired: true,
      finalState: "BLOCKED_AWAITING_VALID_ROLLBACK_TARGET",
      failClosed: true,
    },
  ] as const);

  const evidenceCore = {
    evidenceType:
      "ROLLBACK_COORDINATION_PROTOCOL_EXECUTION_EVIDENCE" as const,
    rollbackEvaluationMode:
      "SYNTHETIC_DETERMINISTIC_ROLLBACK_SIMULATION" as const,
    evaluatedRollbackCaseCount: 4 as const,
    validRollbackCaseCount: 3 as const,
    completedRollbackCaseCount: 3 as const,
    invalidRollbackTargetBlockedCount: 1 as const,
    partialStateRetainedCount: 0 as const,
    unauthorizedForwardExecutionAllowedCount: 0 as const,
    rollbackCheckpointBindingRequired: true as const,
    deterministicRollbackVerified: true as const,
    validRollbackTargetsVerified: true as const,
    invalidRollbackTargetBlocked: true as const,
    partialStateRemovalVerified: true as const,
    forwardExecutionBlockedAfterFailure: true as const,
    tenantBoundaryRollbackVerified: true as const,
    ownershipConflictRollbackVerified: true as const,
    ownerEscalationPreserved: true as const,
    failClosedOnRollbackFailure: true as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    rollbackCases,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceFourOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceFourOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      fifthCandidate.candidateDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 5 as const,
    controlId:
      "ROLLBACK_COORDINATION_PROTOCOL" as const,
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
      canonicalSequenceFourOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceFiveOnly: true as const,
      exactlyFiveEvidenceItemsExecutedInWorkstream: true as const,
      remainingThreeEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceSixEvidenceExecutionAuthorized: false as const,
      rollbackEvidenceExecuted: true as const,
      rollbackProtocolVerified: true as const,
      forwardExecutionAfterFailureAuthorized: false as const,
      resumeAuthorizationGranted: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination sequence-five execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-five execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-five execution integrity is invalid.",
    );
  }

  const fifthCandidate = decision.candidateDecisions[4];

  if (
    !fifthCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceFourOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceFourOwnerReview.decisionDigest ||
    record.sourceExecutionDecisionId !== decision.decisionId ||
    record.sourceExecutionDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      fifthCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 5 ||
    record.controlId !==
      "ROLLBACK_COORDINATION_PROTOCOL" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceFourOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-five execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "ROLLBACK_COORDINATION_PROTOCOL_EXECUTION_EVIDENCE" ||
    record.evidence.rollbackEvaluationMode !==
      "SYNTHETIC_DETERMINISTIC_ROLLBACK_SIMULATION" ||
    record.evidence.evaluatedRollbackCaseCount !== 4 ||
    record.evidence.validRollbackCaseCount !== 3 ||
    record.evidence.completedRollbackCaseCount !== 3 ||
    record.evidence.invalidRollbackTargetBlockedCount !== 1 ||
    record.evidence.partialStateRetainedCount !== 0 ||
    record.evidence.unauthorizedForwardExecutionAllowedCount !== 0 ||
    record.evidence.rollbackCheckpointBindingRequired !== true ||
    record.evidence.deterministicRollbackVerified !== true ||
    record.evidence.validRollbackTargetsVerified !== true ||
    record.evidence.invalidRollbackTargetBlocked !== true ||
    record.evidence.partialStateRemovalVerified !== true ||
    record.evidence.forwardExecutionBlockedAfterFailure !== true ||
    record.evidence.tenantBoundaryRollbackVerified !== true ||
    record.evidence.ownershipConflictRollbackVerified !== true ||
    record.evidence.ownerEscalationPreserved !== true ||
    record.evidence.failClosedOnRollbackFailure !== true ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.emergencyPauseAvailable !== true ||
    record.evidence.rollbackCases.length !== 4
  ) {
    throw new Error(
      "Rollback-coordination protocol evidence is invalid.",
    );
  }

  const expectedClasses = [
    "PARTIAL_COORDINATION_FAILURE",
    "OWNERSHIP_CONFLICT_AFTER_PREPARATION",
    "TENANT_BOUNDARY_VIOLATION_SIGNAL",
    "INVALID_ROLLBACK_TARGET_ATTEMPT",
  ] as const;

  record.evidence.rollbackCases.forEach((rollbackCase, index) => {
    if (
      rollbackCase.rollbackClass !== expectedClasses[index] ||
      rollbackCase.failureDetected !== true ||
      rollbackCase.rollbackRequired !== true ||
      rollbackCase.partialStateRetained !== false ||
      rollbackCase.forwardExecutionAllowed !== false ||
      rollbackCase.ownerEscalationRequired !== true ||
      rollbackCase.failClosed !== true ||
      !Object.isFrozen(rollbackCase)
    ) {
      throw new Error(
        `Rollback-coordination evidence case ${index + 1} is invalid.`,
      );
    }
  });

  if (
    record.evidence.rollbackCases[0]?.rollbackExecuted !== true ||
    record.evidence.rollbackCases[0]?.rollbackTargetVerified !== true ||
    record.evidence.rollbackCases[0]?.finalState !== "ROLLED_BACK_SAFE" ||
    record.evidence.rollbackCases[1]?.rollbackExecuted !== true ||
    record.evidence.rollbackCases[1]?.rollbackTargetVerified !== true ||
    record.evidence.rollbackCases[2]?.rollbackExecuted !== true ||
    record.evidence.rollbackCases[2]?.rollbackTargetVerified !== true ||
    record.evidence.rollbackCases[3]?.rollbackExecuted !== false ||
    record.evidence.rollbackCases[3]?.rollbackTargetVerified !== false ||
    record.evidence.rollbackCases[3]?.finalState !==
      "BLOCKED_AWAITING_VALID_ROLLBACK_TARGET"
  ) {
    throw new Error(
      "Rollback-coordination protocol outcomes are invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalSequenceFourOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sequenceFiveOnly,
    boundary.exactlyFiveEvidenceItemsExecutedInWorkstream,
    boundary.remainingThreeEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.rollbackEvidenceExecuted,
    boundary.rollbackProtocolVerified,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceSixEvidenceExecutionAuthorized,
    boundary.forwardExecutionAfterFailureAuthorized,
    boundary.resumeAuthorizationGranted,
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
    !Object.isFrozen(record.evidence.rollbackCases) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-five authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecutionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution {
  if (input.sourceOwnerReview !== sequenceFourOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-four owner review can authorize sequence five.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination sequence-five execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-five execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceFourOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-five execution cannot precede sequence-four owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-five-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T16:50:00.000Z",
  });