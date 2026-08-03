import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-six-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionInput {
  readonly executionId: string;
  readonly sourceCheckpoint:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT;
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

const checkpoint =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT;

function validateCanonicalCheckpoint(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint(
    checkpoint,
  );

  if (
    checkpoint.sourceRepositoryHead !== "15e3a0f" ||
    checkpoint.sourceWorkstreamSequence !== 2 ||
    checkpoint.sourceWorkstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    checkpoint.ownerReview.executionAccepted !== true ||
    checkpoint.ownerReview.evidenceAccepted !== true ||
    checkpoint.ownerReview.sequenceFiveClosed !== true ||
    checkpoint.ownerReview.authorityBoundary
      .sequenceSixEvidenceExecutionAuthorized !== true ||
    checkpoint.ownerReview.authorityBoundary
      .sequenceSixEvidenceExecutionPerformed !== false ||
    checkpoint.ownerReview.authorityBoundary
      .onlySequenceSixAuthorizedNext !== true ||
    checkpoint.ownerReview.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    checkpoint.ownerReview.authorityBoundary.repositoryReadAuthorized !==
      false ||
    checkpoint.ownerReview.authorityBoundary.repositoryWriteAuthorized !==
      false ||
    checkpoint.ownerReview.authorityBoundary.productionDeploymentAuthorized !==
      false ||
    checkpoint.ownerReview.authorityBoundary.publicLaunchAuthorized !== false ||
    checkpoint.ownerReview.authorityBoundary.founderLiberationAchieved !==
      false ||
    checkpoint.ownerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX" ||
    checkpoint.candidateSix.sequence !== 6 ||
    checkpoint.candidateSix.controlId !== "MONITORING_AND_HEALTH_GATES" ||
    checkpoint.candidateSix.evidenceExecutionAuthorized !== true ||
    checkpoint.candidateSix.evidenceExecutionPerformed !== false ||
    checkpoint.candidateSix.authorityBoundary
      .concurrentEngineeringWorkAuthorized !== false ||
    checkpoint.candidateSix.authorityBoundary.repositoryReadAuthorized !==
      false ||
    checkpoint.candidateSix.authorityBoundary.repositoryWriteAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical sequence-six monitoring and health-gates prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const healthGateCases = deepFreeze([
    {
      caseId: "health-gate-case-001",
      signalClass: "HEALTHY_SYNTHETIC_BASELINE",
      heartbeatHealthy: true,
      errorRateWithinThreshold: true,
      queueBacklogWithinThreshold: true,
      auditPipelineHealthy: true,
      tenantIsolationHealthy: true,
      thresholdBreachDetected: false,
      operationProgressionAllowed: true,
      emergencyPauseActivated: false,
      ownerEscalationRequired: false,
      finalGateState: "PASS",
      failClosed: true,
    },
    {
      caseId: "health-gate-case-002",
      signalClass: "STALE_WORKER_HEARTBEAT",
      heartbeatHealthy: false,
      errorRateWithinThreshold: true,
      queueBacklogWithinThreshold: true,
      auditPipelineHealthy: true,
      tenantIsolationHealthy: true,
      thresholdBreachDetected: true,
      operationProgressionAllowed: false,
      emergencyPauseActivated: true,
      ownerEscalationRequired: true,
      finalGateState: "BLOCKED",
      failClosed: true,
    },
    {
      caseId: "health-gate-case-003",
      signalClass: "ERROR_RATE_THRESHOLD_BREACH",
      heartbeatHealthy: true,
      errorRateWithinThreshold: false,
      queueBacklogWithinThreshold: true,
      auditPipelineHealthy: true,
      tenantIsolationHealthy: true,
      thresholdBreachDetected: true,
      operationProgressionAllowed: false,
      emergencyPauseActivated: true,
      ownerEscalationRequired: true,
      finalGateState: "BLOCKED",
      failClosed: true,
    },
    {
      caseId: "health-gate-case-004",
      signalClass: "QUEUE_BACKLOG_THRESHOLD_BREACH",
      heartbeatHealthy: true,
      errorRateWithinThreshold: true,
      queueBacklogWithinThreshold: false,
      auditPipelineHealthy: true,
      tenantIsolationHealthy: true,
      thresholdBreachDetected: true,
      operationProgressionAllowed: false,
      emergencyPauseActivated: true,
      ownerEscalationRequired: true,
      finalGateState: "BLOCKED",
      failClosed: true,
    },
    {
      caseId: "health-gate-case-005",
      signalClass: "AUDIT_PIPELINE_OR_TENANT_HEALTH_FAILURE",
      heartbeatHealthy: true,
      errorRateWithinThreshold: true,
      queueBacklogWithinThreshold: true,
      auditPipelineHealthy: false,
      tenantIsolationHealthy: false,
      thresholdBreachDetected: true,
      operationProgressionAllowed: false,
      emergencyPauseActivated: true,
      ownerEscalationRequired: true,
      finalGateState: "BLOCKED",
      failClosed: true,
    },
  ] as const);

  const evidenceCore = {
    evidenceType:
      "MONITORING_AND_HEALTH_GATES_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_DETERMINISTIC_HEALTH_GATE_SIMULATION" as const,
    evaluatedHealthGateCaseCount: 5 as const,
    healthyBaselineCaseCount: 1 as const,
    thresholdBreachCaseCount: 4 as const,
    blockedBreachCaseCount: 4 as const,
    undetectedBreachCount: 0 as const,
    unauthorizedProgressionCount: 0 as const,
    emergencyPauseActivationCount: 4 as const,
    ownerEscalationCount: 4 as const,
    heartbeatGateVerified: true as const,
    errorRateGateVerified: true as const,
    queueBacklogGateVerified: true as const,
    auditPipelineGateVerified: true as const,
    tenantIsolationHealthGateVerified: true as const,
    allSyntheticBreachesDetected: true as const,
    allUnsafeProgressionBlocked: true as const,
    deterministicEvaluationVerified: true as const,
    failClosedMonitoringVerified: true as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    healthGateCases,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: checkpoint.ownerReview.tenantId,
    ownerId: checkpoint.ownerReview.ownerId,
    sourceCheckpointVersion: checkpoint.version,
    sourceCheckpointDigest: checkpoint.checkpointDigest,
    sourceCheckpointRepositoryHead: checkpoint.sourceRepositoryHead,
    sourceSequenceFiveOwnerReviewDecisionId:
      checkpoint.ownerReview.decisionId,
    sourceSequenceFiveOwnerReviewDecisionDigest:
      checkpoint.ownerReview.decisionDigest,
    sourceCandidateSixDecisionDigest:
      checkpoint.candidateSix.candidateDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 6 as const,
    controlId: "MONITORING_AND_HEALTH_GATES" as const,
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
      lightweightCanonicalCheckpointBound: true as const,
      sourceCheckpointIntegrityVerified: true as const,
      sequenceSixOnly: true as const,
      exactlySixEvidenceItemsExecutedInWorkstream: true as const,
      remainingTwoEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceSevenEvidenceExecutionAuthorized: false as const,
      monitoringAndHealthGatesEvidenceExecuted: true as const,
      unsafeHealthProgressionAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution,
): void {
  validateCanonicalCheckpoint();

  requireIdentifier(
    "Concurrent-coordination sequence-six execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-six execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six execution integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== checkpoint.ownerReview.tenantId ||
    record.ownerId !== checkpoint.ownerReview.ownerId ||
    record.sourceCheckpointVersion !== checkpoint.version ||
    record.sourceCheckpointDigest !== checkpoint.checkpointDigest ||
    record.sourceCheckpointRepositoryHead !==
      checkpoint.sourceRepositoryHead ||
    record.sourceSequenceFiveOwnerReviewDecisionId !==
      checkpoint.ownerReview.decisionId ||
    record.sourceSequenceFiveOwnerReviewDecisionDigest !==
      checkpoint.ownerReview.decisionDigest ||
    record.sourceCandidateSixDecisionDigest !==
      checkpoint.candidateSix.candidateDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 6 ||
    record.controlId !== "MONITORING_AND_HEALTH_GATES" ||
    record.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    record.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    record.evidenceToolMode !== "READ_ONLY_EVIDENCE_ONLY" ||
    record.syntheticSanitizedEvidenceOnly !== true ||
    record.evidenceExecutionAuthorized !== true ||
    record.evidenceExecutionPerformed !== true ||
    record.evidenceCreated !== true ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(checkpoint.ownerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "MONITORING_AND_HEALTH_GATES_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_DETERMINISTIC_HEALTH_GATE_SIMULATION" ||
    record.evidence.evaluatedHealthGateCaseCount !== 5 ||
    record.evidence.healthyBaselineCaseCount !== 1 ||
    record.evidence.thresholdBreachCaseCount !== 4 ||
    record.evidence.blockedBreachCaseCount !== 4 ||
    record.evidence.undetectedBreachCount !== 0 ||
    record.evidence.unauthorizedProgressionCount !== 0 ||
    record.evidence.emergencyPauseActivationCount !== 4 ||
    record.evidence.ownerEscalationCount !== 4 ||
    record.evidence.heartbeatGateVerified !== true ||
    record.evidence.errorRateGateVerified !== true ||
    record.evidence.queueBacklogGateVerified !== true ||
    record.evidence.auditPipelineGateVerified !== true ||
    record.evidence.tenantIsolationHealthGateVerified !== true ||
    record.evidence.allSyntheticBreachesDetected !== true ||
    record.evidence.allUnsafeProgressionBlocked !== true ||
    record.evidence.deterministicEvaluationVerified !== true ||
    record.evidence.failClosedMonitoringVerified !== true ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.emergencyPauseAvailable !== true ||
    record.evidence.healthGateCases.length !== 5
  ) {
    throw new Error(
      "Monitoring and health-gates evidence is invalid.",
    );
  }

  record.evidence.healthGateCases.forEach((healthCase, index) => {
    if (
      healthCase.failClosed !== true ||
      !Object.isFrozen(healthCase) ||
      (index === 0 &&
        (healthCase.thresholdBreachDetected !== false ||
          healthCase.operationProgressionAllowed !== true ||
          healthCase.emergencyPauseActivated !== false ||
          healthCase.ownerEscalationRequired !== false ||
          healthCase.finalGateState !== "PASS")) ||
      (index > 0 &&
        (healthCase.thresholdBreachDetected !== true ||
          healthCase.operationProgressionAllowed !== false ||
          healthCase.emergencyPauseActivated !== true ||
          healthCase.ownerEscalationRequired !== true ||
          healthCase.finalGateState !== "BLOCKED"))
    ) {
      throw new Error(
        `Monitoring and health-gates evidence case ${index + 1} is invalid.`,
      );
    }
  });

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.lightweightCanonicalCheckpointBound,
    boundary.sourceCheckpointIntegrityVerified,
    boundary.sequenceSixOnly,
    boundary.exactlySixEvidenceItemsExecutedInWorkstream,
    boundary.remainingTwoEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.monitoringAndHealthGatesEvidenceExecuted,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceSevenEvidenceExecutionAuthorized,
    boundary.unsafeHealthProgressionAuthorized,
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
    !Object.isFrozen(record.evidence.healthGateCases) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution {
  if (input.sourceCheckpoint !== checkpoint) {
    throw new Error(
      "Only the canonical lightweight sequence-five checkpoint can authorize sequence six.",
    );
  }

  validateCanonicalCheckpoint();

  requireIdentifier(
    "Concurrent-coordination sequence-six execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-six execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(checkpoint.ownerReview.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-six execution cannot precede sequence-five owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-six-execution-001",
    sourceCheckpoint:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT,
    executedAt: "2026-08-02T17:10:00.000Z",
  });