import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-seven-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;
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

const sequenceSixOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision(
    sequenceSixOwnerReview,
  );

  const seventhCandidate = decision.candidateDecisions[6];

  if (
    !seventhCandidate ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    seventhCandidate.sequence !== 7 ||
    seventhCandidate.controlId !==
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" ||
    seventhCandidate.evidenceExecutionAuthorized !== true ||
    seventhCandidate.evidenceExecutionPerformed !== false ||
    sequenceSixOwnerReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION" ||
    sequenceSixOwnerReview.executionAccepted !== true ||
    sequenceSixOwnerReview.evidenceAccepted !== true ||
    sequenceSixOwnerReview.sequenceSixClosed !== true ||
    sequenceSixOwnerReview.authorityBoundary
      .sequenceSevenSyntheticEvidenceExecutionAuthorized !== true ||
    sequenceSixOwnerReview.authorityBoundary
      .sequenceSevenSyntheticEvidenceExecutionPerformed !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .onlySequenceSevenAuthorizedNext !== true ||
    sequenceSixOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .actualRepositoryReadPerformed !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .filesystemReadAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .gitMutationAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .packageExecutionAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceSixOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-seven prerequisites are invalid.",
    );
  }
}

function createAuditCase(input: {
  readonly caseId: string;
  readonly auditScenario: string;
  readonly requestIdentityDigestValid: boolean;
  readonly approvedScopeDigestValid: boolean;
  readonly fileDigestValid: boolean;
  readonly resultDigestValid: boolean;
  readonly denialReasonRequired: boolean;
  readonly denialReasonIntegrityValid: boolean;
  readonly orderingProofValid: boolean;
  readonly tamperDetected: boolean;
  readonly replayDetected: boolean;
  readonly expectedDecision:
    | "ACCEPT_SYNTHETIC_IMMUTABLE_AUDIT_EVENT"
    | "BLOCK_SYNTHETIC_AUDIT_EVENT";
}) {
  const accepted =
    input.expectedDecision ===
    "ACCEPT_SYNTHETIC_IMMUTABLE_AUDIT_EVENT";

  return deepFreeze({
    ...input,
    syntheticRequestDigest: sha256({
      caseId: input.caseId,
      artifactClass: "SYNTHETIC_REQUEST",
    }),
    syntheticApprovedScopeDigest: sha256({
      caseId: input.caseId,
      artifactClass: "SYNTHETIC_APPROVED_SCOPE",
    }),
    syntheticFileDigest: sha256({
      caseId: input.caseId,
      artifactClass: "SYNTHETIC_FILE_EVIDENCE",
    }),
    syntheticResultDigest: sha256({
      caseId: input.caseId,
      artifactClass: "SYNTHETIC_RESULT",
    }),
    syntheticAuditEventDigest: sha256({
      caseId: input.caseId,
      artifactClass: "SYNTHETIC_AUDIT_EVENT",
      expectedDecision: input.expectedDecision,
    }),
    auditEventAccepted: accepted,
    ownerEscalationRequired: !accepted,
    emergencyPauseActivated: !accepted,
    actualRepositoryReadPerformed: false as const,
    actualFilesystemReadPerformed: false as const,
    actualAuditEventWritePerformed: false as const,
    actualAuditLedgerMutationPerformed: false as const,
    actualOutputProduced: false as const,
    failClosed: true as const,
  });
}

function buildExecution(executionId: string, executedAt: string) {
  const seventhCandidate = decision.candidateDecisions[6];

  if (!seventhCandidate) {
    throw new Error(
      "Repository read-only sandbox sequence-seven candidate is missing.",
    );
  }

  const auditCases = deepFreeze([
    createAuditCase({
      caseId: "approved-request-valid-audit-chain",
      auditScenario: "VALID_APPROVED_REQUEST_RESULT_CHAIN",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: false,
      replayDetected: false,
      expectedDecision:
        "ACCEPT_SYNTHETIC_IMMUTABLE_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "denied-request-valid-audit-chain",
      auditScenario: "VALID_DENIAL_REASON_CHAIN",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: true,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: false,
      replayDetected: false,
      expectedDecision:
        "ACCEPT_SYNTHETIC_IMMUTABLE_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "request-identity-digest-tamper",
      auditScenario: "REQUEST_IDENTITY_DIGEST_TAMPER",
      requestIdentityDigestValid: false,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: true,
      replayDetected: false,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "approved-scope-digest-tamper",
      auditScenario: "APPROVED_SCOPE_DIGEST_TAMPER",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: false,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: true,
      replayDetected: false,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "file-digest-tamper",
      auditScenario: "FILE_DIGEST_TAMPER",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: false,
      resultDigestValid: true,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: true,
      replayDetected: false,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "result-digest-tamper",
      auditScenario: "RESULT_DIGEST_TAMPER",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: false,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: true,
      replayDetected: false,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "missing-denial-reason",
      auditScenario: "MISSING_DENIAL_REASON",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: true,
      denialReasonIntegrityValid: false,
      orderingProofValid: true,
      tamperDetected: false,
      replayDetected: false,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "audit-ordering-proof-failure",
      auditScenario: "AUDIT_EVENT_ORDERING_FAILURE",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: false,
      tamperDetected: false,
      replayDetected: false,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "request-replay-detected",
      auditScenario: "DUPLICATE_REQUEST_REPLAY",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: false,
      replayDetected: true,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
    createAuditCase({
      caseId: "result-replay-detected",
      auditScenario: "DUPLICATE_RESULT_REPLAY",
      requestIdentityDigestValid: true,
      approvedScopeDigestValid: true,
      fileDigestValid: true,
      resultDigestValid: true,
      denialReasonRequired: false,
      denialReasonIntegrityValid: true,
      orderingProofValid: true,
      tamperDetected: false,
      replayDetected: true,
      expectedDecision: "BLOCK_SYNTHETIC_AUDIT_EVENT",
    }),
  ]);

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) =>
      deepFreeze({
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        controlId: candidate.controlId,
        evidenceState: (
          index < 6
            ? "OWNER_REVIEW_ACCEPTED"
            : index === 6
              ? "EXECUTED_AWAITING_OWNER_REVIEW"
              : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
        ) as
          | "OWNER_REVIEW_ACCEPTED"
          | "EXECUTED_AWAITING_OWNER_REVIEW"
          | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: index <= 6,
        currentlyExecutable: false as const,
        ownerReviewRequiredBeforeNextSequence: true as const,
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
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_IMMUTABLE_AUDIT_CHAIN_MODEL_ONLY" as const,
    activeEvidenceSequence: 7 as const,
    activeControlId:
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" as const,
    evaluatedAuditCaseCount: 10 as const,
    validAuditCaseCount: 2 as const,
    blockedAuditCaseCount: 8 as const,
    digestTamperBlockedCount: 4 as const,
    missingDenialReasonBlockedCount: 1 as const,
    orderingFailureBlockedCount: 1 as const,
    replayDetectedCaseCount: 2 as const,
    unauthorizedAuditAcceptanceCount: 0 as const,
    requestIdentityBindingRequired: true as const,
    approvedScopeBindingRequired: true as const,
    fileDigestBindingRequired: true as const,
    resultDigestBindingRequired: true as const,
    denialReasonRequiredForDeniedRequests: true as const,
    orderingProofRequired: true as const,
    tamperProbeRequired: true as const,
    replayDetectionRequired: true as const,
    immutableAuditRequired: true as const,
    auditEventMutationAllowed: false as const,
    auditEventDeletionAllowed: false as const,
    auditEventReorderingAllowed: false as const,
    auditEventReplayAllowed: false as const,
    failClosedOnDigestMismatch: true as const,
    failClosedOnOrderingFailure: true as const,
    failClosedOnReplayDetection: true as const,
    failClosedOnMissingDenialReason: true as const,
    deterministicAuditChainVerified: true as const,
    immutableAuditEnforcementVerified: true as const,
    tamperDetectionVerified: true as const,
    replayDetectionVerified: true as const,
    orderingProofVerified: true as const,
    denialReasonIntegrityVerified: true as const,
    requestIdentityBindingVerified: true as const,
    approvedScopeBindingVerified: true as const,
    fileDigestBindingVerified: true as const,
    resultDigestBindingVerified: true as const,
    actualRepositoryReadPerformed: false as const,
    actualFilesystemReadPerformed: false as const,
    actualAuditEventWritePerformed: false as const,
    actualAuditLedgerMutationPerformed: false as const,
    actualOutputProduced: false as const,
    actualCommandExecutionPerformed: false as const,
    actualPackageExecutionPerformed: false as const,
    actualNetworkAccessPerformed: false as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    emergencyPauseTriggeredForInvalidCases: true as const,
    rollbackMarkerRecorded: true as const,
    rollbackRequired: false as const,
    auditCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceSixOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceSixOwnerReview.decisionDigest,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      seventhCandidate.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 7 as const,
    controlId:
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" as const,
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
      canonicalSequenceSixOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceSevenOnly: true as const,
      exactlySevenEvidenceItemsExecutedInWorkstream: true as const,
      remainingOneEvidenceItemBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceEightSyntheticEvidenceExecutionAuthorized:
        false as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 7 as const,
      immutableAuditEvidenceExecuted: true as const,
      immutableAuditBoundaryVerified: true as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-seven execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-seven execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven execution integrity is invalid.",
    );
  }

  const seventhCandidate = decision.candidateDecisions[6];

  if (
    !seventhCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceSixOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceSixOwnerReview.decisionDigest ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      seventhCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 7 ||
    record.controlId !==
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceSixOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_IMMUTABLE_AUDIT_CHAIN_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 7 ||
    record.evidence.activeControlId !==
      "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION" ||
    record.evidence.evaluatedAuditCaseCount !== 10 ||
    record.evidence.validAuditCaseCount !== 2 ||
    record.evidence.blockedAuditCaseCount !== 8 ||
    record.evidence.digestTamperBlockedCount !== 4 ||
    record.evidence.missingDenialReasonBlockedCount !== 1 ||
    record.evidence.orderingFailureBlockedCount !== 1 ||
    record.evidence.replayDetectedCaseCount !== 2 ||
    record.evidence.unauthorizedAuditAcceptanceCount !== 0 ||
    record.evidence.requestIdentityBindingRequired !== true ||
    record.evidence.approvedScopeBindingRequired !== true ||
    record.evidence.fileDigestBindingRequired !== true ||
    record.evidence.resultDigestBindingRequired !== true ||
    record.evidence.denialReasonRequiredForDeniedRequests !== true ||
    record.evidence.orderingProofRequired !== true ||
    record.evidence.tamperProbeRequired !== true ||
    record.evidence.replayDetectionRequired !== true ||
    record.evidence.immutableAuditRequired !== true ||
    record.evidence.auditEventMutationAllowed !== false ||
    record.evidence.auditEventDeletionAllowed !== false ||
    record.evidence.auditEventReorderingAllowed !== false ||
    record.evidence.auditEventReplayAllowed !== false ||
    record.evidence.failClosedOnDigestMismatch !== true ||
    record.evidence.failClosedOnOrderingFailure !== true ||
    record.evidence.failClosedOnReplayDetection !== true ||
    record.evidence.failClosedOnMissingDenialReason !== true ||
    record.evidence.deterministicAuditChainVerified !== true ||
    record.evidence.immutableAuditEnforcementVerified !== true ||
    record.evidence.tamperDetectionVerified !== true ||
    record.evidence.replayDetectionVerified !== true ||
    record.evidence.orderingProofVerified !== true ||
    record.evidence.denialReasonIntegrityVerified !== true ||
    record.evidence.requestIdentityBindingVerified !== true ||
    record.evidence.approvedScopeBindingVerified !== true ||
    record.evidence.fileDigestBindingVerified !== true ||
    record.evidence.resultDigestBindingVerified !== true ||
    record.evidence.actualRepositoryReadPerformed !== false ||
    record.evidence.actualFilesystemReadPerformed !== false ||
    record.evidence.actualAuditEventWritePerformed !== false ||
    record.evidence.actualAuditLedgerMutationPerformed !== false ||
    record.evidence.actualOutputProduced !== false ||
    record.evidence.actualCommandExecutionPerformed !== false ||
    record.evidence.actualPackageExecutionPerformed !== false ||
    record.evidence.actualNetworkAccessPerformed !== false ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.auditCases.length !== 10 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository immutable-audit synthetic evidence is invalid.",
    );
  }

  record.evidence.auditCases.forEach((auditCase, index) => {
    const accepted = index < 2;

    if (
      auditCase.expectedDecision !==
        (accepted
          ? "ACCEPT_SYNTHETIC_IMMUTABLE_AUDIT_EVENT"
          : "BLOCK_SYNTHETIC_AUDIT_EVENT") ||
      auditCase.auditEventAccepted !== accepted ||
      auditCase.ownerEscalationRequired !== !accepted ||
      auditCase.emergencyPauseActivated !== !accepted ||
      auditCase.actualRepositoryReadPerformed !== false ||
      auditCase.actualFilesystemReadPerformed !== false ||
      auditCase.actualAuditEventWritePerformed !== false ||
      auditCase.actualAuditLedgerMutationPerformed !== false ||
      auditCase.actualOutputProduced !== false ||
      auditCase.failClosed !== true ||
      !SHA256_PATTERN.test(auditCase.syntheticRequestDigest) ||
      !SHA256_PATTERN.test(auditCase.syntheticApprovedScopeDigest) ||
      !SHA256_PATTERN.test(auditCase.syntheticFileDigest) ||
      !SHA256_PATTERN.test(auditCase.syntheticResultDigest) ||
      !SHA256_PATTERN.test(auditCase.syntheticAuditEventDigest) ||
      !Object.isFrozen(auditCase)
    ) {
      throw new Error(
        `Repository immutable-audit synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      accepted &&
      (
        auditCase.requestIdentityDigestValid !== true ||
        auditCase.approvedScopeDigestValid !== true ||
        auditCase.fileDigestValid !== true ||
        auditCase.resultDigestValid !== true ||
        auditCase.denialReasonIntegrityValid !== true ||
        auditCase.orderingProofValid !== true ||
        auditCase.tamperDetected !== false ||
        auditCase.replayDetected !== false
      )
    ) {
      throw new Error(
        `Accepted immutable-audit synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      !accepted &&
      auditCase.requestIdentityDigestValid === true &&
      auditCase.approvedScopeDigestValid === true &&
      auditCase.fileDigestValid === true &&
      auditCase.resultDigestValid === true &&
      auditCase.denialReasonIntegrityValid === true &&
      auditCase.orderingProofValid === true &&
      auditCase.tamperDetected === false &&
      auditCase.replayDetected === false
    ) {
      throw new Error(
        `Blocked immutable-audit synthetic case ${index + 1} lacks a fail-closed trigger.`,
      );
    }
  });

  record.evidence.sequenceLedger.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    const expectedState =
      index < 6
        ? "OWNER_REVIEW_ACCEPTED"
        : index === 6
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW";

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.evidenceState !== expectedState ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== (index <= 6) ||
      entry.currentlyExecutable !== false ||
      entry.ownerReviewRequiredBeforeNextSequence !== true ||
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
    boundary.canonicalSequenceSixOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceSevenOnly,
    boundary.exactlySevenEvidenceItemsExecutedInWorkstream,
    boundary.remainingOneEvidenceItemBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.syntheticSafetyEvidenceExecutionAuthorized,
    boundary.immutableAuditEvidenceExecuted,
    boundary.immutableAuditBoundaryVerified,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceEightSyntheticEvidenceExecutionAuthorized,
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
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 7 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.auditCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution {
  if (input.sourceOwnerReview !== sequenceSixOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-six owner review can execute repository read-only sandbox sequence seven.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-seven execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-seven execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceSixOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-seven execution cannot precede sequence-six owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-seven-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T21:10:00.000Z",
  });