import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-eight-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;
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
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION;

const sequenceSevenOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision(
    sequenceSevenOwnerReview,
  );

  const eighthCandidate = decision.candidateDecisions[7];

  if (
    !eighthCandidate ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    eighthCandidate.sequence !== 8 ||
    eighthCandidate.controlId !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" ||
    eighthCandidate.evidenceExecutionAuthorized !== true ||
    eighthCandidate.evidenceExecutionPerformed !== false ||
    sequenceSevenOwnerReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION" ||
    sequenceSevenOwnerReview.executionAccepted !== true ||
    sequenceSevenOwnerReview.evidenceAccepted !== true ||
    sequenceSevenOwnerReview.sequenceSevenClosed !== true ||
    sequenceSevenOwnerReview.authorityBoundary
      .sequenceEightSyntheticEvidenceExecutionAuthorized !== true ||
    sequenceSevenOwnerReview.authorityBoundary
      .sequenceEightSyntheticEvidenceExecutionPerformed !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .onlySequenceEightAuthorizedNext !== true ||
    sequenceSevenOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .actualRepositoryReadPerformed !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .filesystemReadAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .gitMutationAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .packageExecutionAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceSevenOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceSevenOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-eight prerequisites are invalid.",
    );
  }
}

function createPauseCase(input: {
  readonly caseId: string;
  readonly triggerClass:
    | "HEALTHY_SYNTHETIC_BASELINE"
    | "RESOURCE_THRESHOLD_BREACH"
    | "SUSPICIOUS_CONTENT_SIGNAL"
    | "TENANT_OWNER_CONTEXT_MISMATCH"
    | "IMMUTABLE_AUDIT_FAILURE"
    | "UNAUTHORIZED_AUTHORITY_REQUEST";
  readonly triggerDetected: boolean;
  readonly expectedDecision:
    | "ALLOW_SYNTHETIC_CONTINUATION"
    | "BLOCK_AND_ESCALATE_TO_OWNER";
}) {
  const allowed =
    input.expectedDecision ===
    "ALLOW_SYNTHETIC_CONTINUATION";

  return deepFreeze({
    ...input,
    emergencyPauseActivated: !allowed,
    progressionAllowed: allowed,
    ownerEscalationRequired: !allowed,
    ownerControlReturned: !allowed,
    independentValidationRequired: true as const,
    finalOwnerReviewRequired: true as const,
    rollbackMarkerRecorded: true as const,
    auditEvidenceRequired: true as const,
    auditEvidenceRecorded: true as const,
    actualRepositoryReadPerformed: false as const,
    actualFilesystemReadPerformed: false as const,
    actualCommandExecutionPerformed: false as const,
    actualPackageExecutionPerformed: false as const,
    actualNetworkAccessPerformed: false as const,
    actualProductionActionPerformed: false as const,
    actualExternalActionPerformed: false as const,
    failClosed: true as const,
  });
}

function buildExecution(executionId: string, executedAt: string) {
  const eighthCandidate = decision.candidateDecisions[7];

  if (!eighthCandidate) {
    throw new Error(
      "Repository read-only sandbox sequence-eight candidate is missing.",
    );
  }

  const pauseAndEscalationCases = deepFreeze([
    createPauseCase({
      caseId: "healthy-synthetic-baseline",
      triggerClass: "HEALTHY_SYNTHETIC_BASELINE",
      triggerDetected: false,
      expectedDecision: "ALLOW_SYNTHETIC_CONTINUATION",
    }),
    createPauseCase({
      caseId: "resource-threshold-breach",
      triggerClass: "RESOURCE_THRESHOLD_BREACH",
      triggerDetected: true,
      expectedDecision: "BLOCK_AND_ESCALATE_TO_OWNER",
    }),
    createPauseCase({
      caseId: "suspicious-content-signal",
      triggerClass: "SUSPICIOUS_CONTENT_SIGNAL",
      triggerDetected: true,
      expectedDecision: "BLOCK_AND_ESCALATE_TO_OWNER",
    }),
    createPauseCase({
      caseId: "tenant-owner-context-mismatch",
      triggerClass: "TENANT_OWNER_CONTEXT_MISMATCH",
      triggerDetected: true,
      expectedDecision: "BLOCK_AND_ESCALATE_TO_OWNER",
    }),
    createPauseCase({
      caseId: "immutable-audit-failure",
      triggerClass: "IMMUTABLE_AUDIT_FAILURE",
      triggerDetected: true,
      expectedDecision: "BLOCK_AND_ESCALATE_TO_OWNER",
    }),
    createPauseCase({
      caseId: "unauthorized-authority-request",
      triggerClass: "UNAUTHORIZED_AUTHORITY_REQUEST",
      triggerDetected: true,
      expectedDecision: "BLOCK_AND_ESCALATE_TO_OWNER",
    }),
  ]);

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) =>
      deepFreeze({
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        controlId: candidate.controlId,
        evidenceState: (
          index < 7
            ? "OWNER_REVIEW_ACCEPTED"
            : "EXECUTED_AWAITING_OWNER_REVIEW"
        ) as
          | "OWNER_REVIEW_ACCEPTED"
          | "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: true as const,
        currentlyExecutable: false as const,
        ownerReviewRequiredBeforeWorkstreamClosure: true as const,
        actualRepositoryEvaluationAuthorized: false as const,
        actualRepositoryReadAuthorized: false as const,
        repositoryWriteAuthorized: false as const,
        filesystemReadAuthorized: false as const,
        filesystemMutationAuthorized: false as const,
        commandExecutionAuthorized: false as const,
        packageExecutionAuthorized: false as const,
        networkAccessAuthorized: false as const,
      }),
    ),
  );

  const evidenceCore = {
    evidenceType:
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_PAUSE_ESCALATION_POLICY_MODEL_ONLY" as const,
    activeEvidenceSequence: 8 as const,
    activeControlId:
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" as const,
    evaluatedPauseCaseCount: 6 as const,
    healthyBaselineCaseCount: 1 as const,
    blockedTriggerCaseCount: 5 as const,
    resourceThresholdBreachBlockedCount: 1 as const,
    suspiciousContentBlockedCount: 1 as const,
    contextMismatchBlockedCount: 1 as const,
    auditFailureBlockedCount: 1 as const,
    unauthorizedAuthorityRequestBlockedCount: 1 as const,
    missedEmergencyPauseCount: 0 as const,
    missedOwnerEscalationCount: 0 as const,
    unauthorizedProgressionCount: 0 as const,
    emergencyPauseRequiredOnTrigger: true as const,
    failClosedEscalationRequired: true as const,
    independentValidationRequired: true as const,
    finalOwnerReviewRequired: true as const,
    rollbackEvidenceRequired: true as const,
    immutableAuditEvidenceRequired: true as const,
    resourceThresholdEscalationVerified: true as const,
    suspiciousContentEscalationVerified: true as const,
    contextMismatchEscalationVerified: true as const,
    auditFailureEscalationVerified: true as const,
    unauthorizedAuthorityEscalationVerified: true as const,
    ownerControlReturnVerified: true as const,
    deterministicPauseDecisionVerified: true as const,
    failClosedProgressionBlockingVerified: true as const,
    independentValidationGateVerified: true as const,
    finalOwnerReviewGateVerified: true as const,
    actualRepositoryReadPerformed: false as const,
    actualFilesystemReadPerformed: false as const,
    actualCommandExecutionPerformed: false as const,
    actualPackageExecutionPerformed: false as const,
    actualNetworkAccessPerformed: false as const,
    actualProductionActionPerformed: false as const,
    actualExternalActionPerformed: false as const,
    allEightEvidenceSequencesExecuted: true as const,
    allPriorOwnerReviewsAccountedFor: true as const,
    workstreamClosureBlockedUntilOwnerReview: true as const,
    workstreamClosurePerformed: false as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    rollbackMarkerRecorded: true as const,
    rollbackRequired: false as const,
    pauseAndEscalationCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceSevenOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceSevenOwnerReview.decisionDigest,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      eighthCandidate.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 8 as const,
    controlId:
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" as const,
    evidenceClass:
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" as const,
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
      canonicalSequenceSevenOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceEightOnly: true as const,
      exactlyEightEvidenceItemsExecutedInWorkstream: true as const,
      remainingEvidenceItemCount: 0 as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 8 as const,
      emergencyPauseEscalationEvidenceExecuted: true as const,
      emergencyPauseBoundaryVerified: true as const,
      workstreamClosureAuthorized: false as const,
      workstreamClosurePerformed: false as const,
      workstreamCompletionClaimAuthorized: false as const,
      workstreamCompletionClaimed: false as const,
      nextWorkstreamExecutionAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-eight execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-eight execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight execution integrity is invalid.",
    );
  }

  const eighthCandidate = decision.candidateDecisions[7];

  if (
    !eighthCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceSevenOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceSevenOwnerReview.decisionDigest ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      eighthCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 8 ||
    record.controlId !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" ||
    record.evidenceClass !==
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" ||
    record.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    record.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    record.syntheticSanitizedEvidenceOnly !== true ||
    record.evidenceExecutionAuthorized !== true ||
    record.evidenceExecutionPerformed !== true ||
    record.evidenceCreated !== true ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceSevenOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_PAUSE_ESCALATION_POLICY_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 8 ||
    record.evidence.activeControlId !==
      "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW" ||
    record.evidence.evaluatedPauseCaseCount !== 6 ||
    record.evidence.healthyBaselineCaseCount !== 1 ||
    record.evidence.blockedTriggerCaseCount !== 5 ||
    record.evidence.resourceThresholdBreachBlockedCount !== 1 ||
    record.evidence.suspiciousContentBlockedCount !== 1 ||
    record.evidence.contextMismatchBlockedCount !== 1 ||
    record.evidence.auditFailureBlockedCount !== 1 ||
    record.evidence.unauthorizedAuthorityRequestBlockedCount !== 1 ||
    record.evidence.missedEmergencyPauseCount !== 0 ||
    record.evidence.missedOwnerEscalationCount !== 0 ||
    record.evidence.unauthorizedProgressionCount !== 0 ||
    record.evidence.emergencyPauseRequiredOnTrigger !== true ||
    record.evidence.failClosedEscalationRequired !== true ||
    record.evidence.independentValidationRequired !== true ||
    record.evidence.finalOwnerReviewRequired !== true ||
    record.evidence.rollbackEvidenceRequired !== true ||
    record.evidence.immutableAuditEvidenceRequired !== true ||
    record.evidence.resourceThresholdEscalationVerified !== true ||
    record.evidence.suspiciousContentEscalationVerified !== true ||
    record.evidence.contextMismatchEscalationVerified !== true ||
    record.evidence.auditFailureEscalationVerified !== true ||
    record.evidence.unauthorizedAuthorityEscalationVerified !== true ||
    record.evidence.ownerControlReturnVerified !== true ||
    record.evidence.deterministicPauseDecisionVerified !== true ||
    record.evidence.failClosedProgressionBlockingVerified !== true ||
    record.evidence.independentValidationGateVerified !== true ||
    record.evidence.finalOwnerReviewGateVerified !== true ||
    record.evidence.actualRepositoryReadPerformed !== false ||
    record.evidence.actualFilesystemReadPerformed !== false ||
    record.evidence.actualCommandExecutionPerformed !== false ||
    record.evidence.actualPackageExecutionPerformed !== false ||
    record.evidence.actualNetworkAccessPerformed !== false ||
    record.evidence.actualProductionActionPerformed !== false ||
    record.evidence.actualExternalActionPerformed !== false ||
    record.evidence.allEightEvidenceSequencesExecuted !== true ||
    record.evidence.allPriorOwnerReviewsAccountedFor !== true ||
    record.evidence.workstreamClosureBlockedUntilOwnerReview !== true ||
    record.evidence.workstreamClosurePerformed !== false ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.emergencyPauseAvailable !== true ||
    record.evidence.pauseAndEscalationCases.length !== 6 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository emergency-pause and owner-escalation synthetic evidence is invalid.",
    );
  }

  record.evidence.pauseAndEscalationCases.forEach(
    (pauseCase, index) => {
      const allowed = index === 0;

      if (
        pauseCase.expectedDecision !==
          (allowed
            ? "ALLOW_SYNTHETIC_CONTINUATION"
            : "BLOCK_AND_ESCALATE_TO_OWNER") ||
        pauseCase.triggerDetected !== !allowed ||
        pauseCase.emergencyPauseActivated !== !allowed ||
        pauseCase.progressionAllowed !== allowed ||
        pauseCase.ownerEscalationRequired !== !allowed ||
        pauseCase.ownerControlReturned !== !allowed ||
        pauseCase.independentValidationRequired !== true ||
        pauseCase.finalOwnerReviewRequired !== true ||
        pauseCase.rollbackMarkerRecorded !== true ||
        pauseCase.auditEvidenceRequired !== true ||
        pauseCase.auditEvidenceRecorded !== true ||
        pauseCase.actualRepositoryReadPerformed !== false ||
        pauseCase.actualFilesystemReadPerformed !== false ||
        pauseCase.actualCommandExecutionPerformed !== false ||
        pauseCase.actualPackageExecutionPerformed !== false ||
        pauseCase.actualNetworkAccessPerformed !== false ||
        pauseCase.actualProductionActionPerformed !== false ||
        pauseCase.actualExternalActionPerformed !== false ||
        pauseCase.failClosed !== true ||
        !Object.isFrozen(pauseCase)
      ) {
        throw new Error(
          `Repository pause-and-escalation synthetic case ${index + 1} is invalid.`,
        );
      }
    },
  );

  record.evidence.sequenceLedger.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    const expectedState =
      index < 7
        ? "OWNER_REVIEW_ACCEPTED"
        : "EXECUTED_AWAITING_OWNER_REVIEW";

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.evidenceState !== expectedState ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== true ||
      entry.currentlyExecutable !== false ||
      entry.ownerReviewRequiredBeforeWorkstreamClosure !== true ||
      entry.actualRepositoryEvaluationAuthorized !== false ||
      entry.actualRepositoryReadAuthorized !== false ||
      entry.repositoryWriteAuthorized !== false ||
      entry.filesystemReadAuthorized !== false ||
      entry.filesystemMutationAuthorized !== false ||
      entry.commandExecutionAuthorized !== false ||
      entry.packageExecutionAuthorized !== false ||
      entry.networkAccessAuthorized !== false ||
      !Object.isFrozen(entry)
    ) {
      throw new Error(
        `Repository read-only sandbox sequence ledger entry ${index + 1} is invalid.`,
      );
    }
  });

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalSequenceSevenOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceEightOnly,
    boundary.exactlyEightEvidenceItemsExecutedInWorkstream,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.syntheticSafetyEvidenceExecutionAuthorized,
    boundary.emergencyPauseEscalationEvidenceExecuted,
    boundary.emergencyPauseBoundaryVerified,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.workstreamClosureAuthorized,
    boundary.workstreamClosurePerformed,
    boundary.workstreamCompletionClaimAuthorized,
    boundary.workstreamCompletionClaimed,
    boundary.nextWorkstreamExecutionAuthorized,
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
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 8 ||
    boundary.remainingEvidenceItemCount !== 0 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.pauseAndEscalationCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution {
  if (input.sourceOwnerReview !== sequenceSevenOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-seven owner review can execute repository read-only sandbox sequence eight.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-eight execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-eight execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceSevenOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-eight execution cannot precede sequence-seven owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-eight-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T21:30:00.000Z",
  });