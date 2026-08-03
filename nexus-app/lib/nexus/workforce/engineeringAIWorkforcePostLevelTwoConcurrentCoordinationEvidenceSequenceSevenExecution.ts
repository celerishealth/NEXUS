import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-seven-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;
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

const sequenceSixOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision(
    sequenceSixOwnerReview,
  );

  if (
    sequenceSixOwnerReview.decision !==
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION" ||
    sequenceSixOwnerReview.executionAccepted !== true ||
    sequenceSixOwnerReview.evidenceAccepted !== true ||
    sequenceSixOwnerReview.sequenceSixClosed !== true ||
    sequenceSixOwnerReview.authorityBoundary
      .sequenceSevenEvidenceExecutionAuthorized !== true ||
    sequenceSixOwnerReview.authorityBoundary
      .sequenceSevenEvidenceExecutionPerformed !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .onlySequenceSevenAuthorizedNext !== true ||
    sequenceSixOwnerReview.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary.repositoryReadAuthorized !==
      false ||
    sequenceSixOwnerReview.authorityBoundary.repositoryWriteAuthorized !==
      false ||
    sequenceSixOwnerReview.authorityBoundary.productionDeploymentAuthorized !==
      false ||
    sequenceSixOwnerReview.authorityBoundary.publicLaunchAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary.founderLiberationAchieved !==
      false ||
    sequenceSixOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN"
  ) {
    throw new Error(
      "Canonical sequence-seven escalation and owner-review prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const escalationCases = deepFreeze([
    {
      caseId: "escalation-case-001",
      escalationClass: "UNRESOLVED_COORDINATION_CONFLICT",
      triggeringSignalDetected: true,
      escalationRequired: true,
      ownerReviewRequired: true,
      ownerReviewBypassAllowed: false,
      autonomousResolutionAllowed: false,
      operationProgressionAllowed: false,
      auditEvidenceRecorded: true,
      escalationRoute: "NEXUS_OWNER_REVIEW_QUEUE",
      finalState: "ESCALATED_AWAITING_OWNER_REVIEW",
      failClosed: true,
    },
    {
      caseId: "escalation-case-002",
      escalationClass: "MONITORING_THRESHOLD_BREACH",
      triggeringSignalDetected: true,
      escalationRequired: true,
      ownerReviewRequired: true,
      ownerReviewBypassAllowed: false,
      autonomousResolutionAllowed: false,
      operationProgressionAllowed: false,
      auditEvidenceRecorded: true,
      escalationRoute: "NEXUS_OWNER_REVIEW_QUEUE",
      finalState: "ESCALATED_AWAITING_OWNER_REVIEW",
      failClosed: true,
    },
    {
      caseId: "escalation-case-003",
      escalationClass: "TENANT_ISOLATION_RISK_SIGNAL",
      triggeringSignalDetected: true,
      escalationRequired: true,
      ownerReviewRequired: true,
      ownerReviewBypassAllowed: false,
      autonomousResolutionAllowed: false,
      operationProgressionAllowed: false,
      auditEvidenceRecorded: true,
      escalationRoute: "NEXUS_OWNER_REVIEW_QUEUE",
      finalState: "ESCALATED_AWAITING_OWNER_REVIEW",
      failClosed: true,
    },
    {
      caseId: "escalation-case-004",
      escalationClass: "INVALID_ROLLBACK_TARGET",
      triggeringSignalDetected: true,
      escalationRequired: true,
      ownerReviewRequired: true,
      ownerReviewBypassAllowed: false,
      autonomousResolutionAllowed: false,
      operationProgressionAllowed: false,
      auditEvidenceRecorded: true,
      escalationRoute: "NEXUS_OWNER_REVIEW_QUEUE",
      finalState: "ESCALATED_AWAITING_OWNER_REVIEW",
      failClosed: true,
    },
    {
      caseId: "escalation-case-005",
      escalationClass: "UNAUTHORIZED_AUTHORITY_REQUEST",
      triggeringSignalDetected: true,
      escalationRequired: true,
      ownerReviewRequired: true,
      ownerReviewBypassAllowed: false,
      autonomousResolutionAllowed: false,
      operationProgressionAllowed: false,
      auditEvidenceRecorded: true,
      escalationRoute: "NEXUS_OWNER_REVIEW_QUEUE",
      finalState: "ESCALATED_AWAITING_OWNER_REVIEW",
      failClosed: true,
    },
  ] as const);

  const evidenceCore = {
    evidenceType:
      "ESCALATION_AND_OWNER_REVIEW_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_DETERMINISTIC_ESCALATION_SIMULATION" as const,
    evaluatedEscalationCaseCount: 5 as const,
    detectedTriggerCount: 5 as const,
    requiredEscalationCount: 5 as const,
    ownerReviewRequiredCount: 5 as const,
    successfullyRoutedEscalationCount: 5 as const,
    ownerReviewBypassCount: 0 as const,
    autonomousResolutionCount: 0 as const,
    unauthorizedProgressionCount: 0 as const,
    missingAuditEvidenceCount: 0 as const,
    conflictEscalationVerified: true as const,
    monitoringBreachEscalationVerified: true as const,
    tenantRiskEscalationVerified: true as const,
    rollbackFailureEscalationVerified: true as const,
    unauthorizedAuthorityEscalationVerified: true as const,
    ownerReviewQueueRoutingVerified: true as const,
    deterministicEscalationVerified: true as const,
    ownerAuthorityPreserved: true as const,
    failClosedEscalationVerified: true as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    escalationCases,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: sequenceSixOwnerReview.tenantId,
    ownerId: sequenceSixOwnerReview.ownerId,
    sourceOwnerReviewDecisionId: sequenceSixOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceSixOwnerReview.decisionDigest,
    sourceSequenceSixExecutionId: sequenceSixOwnerReview.sourceExecutionId,
    sourceSequenceSixExecutionDigest:
      sequenceSixOwnerReview.sourceExecutionDigest,
    sourceCheckpointDigest: sequenceSixOwnerReview.sourceCheckpointDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 7 as const,
    controlId: "ESCALATION_AND_OWNER_REVIEW" as const,
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
      canonicalSequenceSixOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceSevenOnly: true as const,
      exactlySevenEvidenceItemsExecutedInWorkstream: true as const,
      remainingOneEvidenceItemBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceEightEvidenceExecutionAuthorized: false as const,
      escalationAndOwnerReviewEvidenceExecuted: true as const,
      ownerReviewBypassAuthorized: false as const,
      autonomousEscalationResolutionAuthorized: false as const,
      operationProgressionBeforeOwnerDecisionAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination sequence-seven execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-seven execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-seven execution integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== sequenceSixOwnerReview.tenantId ||
    record.ownerId !== sequenceSixOwnerReview.ownerId ||
    record.sourceOwnerReviewDecisionId !== sequenceSixOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceSixOwnerReview.decisionDigest ||
    record.sourceSequenceSixExecutionId !==
      sequenceSixOwnerReview.sourceExecutionId ||
    record.sourceSequenceSixExecutionDigest !==
      sequenceSixOwnerReview.sourceExecutionDigest ||
    record.sourceCheckpointDigest !==
      sequenceSixOwnerReview.sourceCheckpointDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 7 ||
    record.controlId !== "ESCALATION_AND_OWNER_REVIEW" ||
    record.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    record.executionMode !== "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    record.evidenceToolMode !== "READ_ONLY_EVIDENCE_ONLY" ||
    record.syntheticSanitizedEvidenceOnly !== true ||
    record.evidenceExecutionAuthorized !== true ||
    record.evidenceExecutionPerformed !== true ||
    record.evidenceCreated !== true ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceSixOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-seven execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "ESCALATION_AND_OWNER_REVIEW_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_DETERMINISTIC_ESCALATION_SIMULATION" ||
    record.evidence.evaluatedEscalationCaseCount !== 5 ||
    record.evidence.detectedTriggerCount !== 5 ||
    record.evidence.requiredEscalationCount !== 5 ||
    record.evidence.ownerReviewRequiredCount !== 5 ||
    record.evidence.successfullyRoutedEscalationCount !== 5 ||
    record.evidence.ownerReviewBypassCount !== 0 ||
    record.evidence.autonomousResolutionCount !== 0 ||
    record.evidence.unauthorizedProgressionCount !== 0 ||
    record.evidence.missingAuditEvidenceCount !== 0 ||
    record.evidence.conflictEscalationVerified !== true ||
    record.evidence.monitoringBreachEscalationVerified !== true ||
    record.evidence.tenantRiskEscalationVerified !== true ||
    record.evidence.rollbackFailureEscalationVerified !== true ||
    record.evidence.unauthorizedAuthorityEscalationVerified !== true ||
    record.evidence.ownerReviewQueueRoutingVerified !== true ||
    record.evidence.deterministicEscalationVerified !== true ||
    record.evidence.ownerAuthorityPreserved !== true ||
    record.evidence.failClosedEscalationVerified !== true ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.emergencyPauseAvailable !== true ||
    record.evidence.escalationCases.length !== 5
  ) {
    throw new Error(
      "Escalation and owner-review evidence is invalid.",
    );
  }

  record.evidence.escalationCases.forEach((escalationCase, index) => {
    if (
      escalationCase.triggeringSignalDetected !== true ||
      escalationCase.escalationRequired !== true ||
      escalationCase.ownerReviewRequired !== true ||
      escalationCase.ownerReviewBypassAllowed !== false ||
      escalationCase.autonomousResolutionAllowed !== false ||
      escalationCase.operationProgressionAllowed !== false ||
      escalationCase.auditEvidenceRecorded !== true ||
      escalationCase.escalationRoute !== "NEXUS_OWNER_REVIEW_QUEUE" ||
      escalationCase.finalState !==
        "ESCALATED_AWAITING_OWNER_REVIEW" ||
      escalationCase.failClosed !== true ||
      !Object.isFrozen(escalationCase)
    ) {
      throw new Error(
        `Escalation and owner-review evidence case ${index + 1} is invalid.`,
      );
    }
  });

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalSequenceSixOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sequenceSevenOnly,
    boundary.exactlySevenEvidenceItemsExecutedInWorkstream,
    boundary.remainingOneEvidenceItemBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.escalationAndOwnerReviewEvidenceExecuted,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceEightEvidenceExecutionAuthorized,
    boundary.ownerReviewBypassAuthorized,
    boundary.autonomousEscalationResolutionAuthorized,
    boundary.operationProgressionBeforeOwnerDecisionAuthorized,
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
    !Object.isFrozen(record.evidence.escalationCases) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-seven authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecutionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecution {
  if (input.sourceOwnerReview !== sequenceSixOwnerReview) {
    throw new Error(
      "Only the canonical sequence-six owner review can authorize sequence seven.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Concurrent-coordination sequence-seven execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-seven execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceSixOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-seven execution cannot precede sequence-six owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-seven-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T17:30:00.000Z",
  });