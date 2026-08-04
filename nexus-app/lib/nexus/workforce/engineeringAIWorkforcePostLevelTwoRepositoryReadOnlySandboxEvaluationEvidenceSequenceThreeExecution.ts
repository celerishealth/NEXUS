import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-three-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;
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

const sequenceTwoOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision(
    sequenceTwoOwnerReview,
  );

  const thirdCandidate = decision.candidateDecisions[2];

  if (
    !thirdCandidate ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    thirdCandidate.sequence !== 3 ||
    thirdCandidate.controlId !==
      "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING" ||
    thirdCandidate.evidenceExecutionAuthorized !== true ||
    thirdCandidate.evidenceExecutionPerformed !== false ||
    sequenceTwoOwnerReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION" ||
    sequenceTwoOwnerReview.executionAccepted !== true ||
    sequenceTwoOwnerReview.evidenceAccepted !== true ||
    sequenceTwoOwnerReview.sequenceTwoClosed !== true ||
    sequenceTwoOwnerReview.authorityBoundary
      .sequenceThreeSyntheticEvidenceExecutionAuthorized !== true ||
    sequenceTwoOwnerReview.authorityBoundary
      .sequenceThreeSyntheticEvidenceExecutionPerformed !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .onlySequenceThreeAuthorizedNext !== true ||
    sequenceTwoOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .actualRepositoryReadPerformed !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .gitMutationAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceTwoOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceTwoOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-three prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const thirdCandidate = decision.candidateDecisions[2];

  if (!thirdCandidate) {
    throw new Error(
      "Repository read-only sandbox sequence-three candidate is missing.",
    );
  }

  const contextBindingCases = deepFreeze([
    deepFreeze({
      caseId: "fully-bound-context",
      tenantContext: decision.tenantId,
      ownerContext: decision.ownerId,
      sessionContext: "session-synthetic-current-001",
      sessionState: "CURRENT",
      expectedDecision: "ALLOW_BOUND_SYNTHETIC_CONTEXT" as const,
      rejectionClass: null,
      tenantBindingVerified: true,
      ownerBindingVerified: true,
      sessionBindingVerified: true,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "missing-tenant-context",
      tenantContext: null,
      ownerContext: decision.ownerId,
      sessionContext: "session-synthetic-current-001",
      sessionState: "CURRENT",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "MISSING_TENANT_CONTEXT",
      tenantBindingVerified: false,
      ownerBindingVerified: true,
      sessionBindingVerified: true,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "mismatched-tenant-context",
      tenantContext: "tenant-synthetic-other-001",
      ownerContext: decision.ownerId,
      sessionContext: "session-synthetic-current-001",
      sessionState: "CURRENT",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "TENANT_CONTEXT_MISMATCH",
      tenantBindingVerified: false,
      ownerBindingVerified: true,
      sessionBindingVerified: true,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "missing-owner-context",
      tenantContext: decision.tenantId,
      ownerContext: null,
      sessionContext: "session-synthetic-current-001",
      sessionState: "CURRENT",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "MISSING_OWNER_CONTEXT",
      tenantBindingVerified: true,
      ownerBindingVerified: false,
      sessionBindingVerified: true,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "mismatched-owner-context",
      tenantContext: decision.tenantId,
      ownerContext: "owner-synthetic-other-001",
      sessionContext: "session-synthetic-current-001",
      sessionState: "CURRENT",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "OWNER_CONTEXT_MISMATCH",
      tenantBindingVerified: true,
      ownerBindingVerified: false,
      sessionBindingVerified: true,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "missing-session-context",
      tenantContext: decision.tenantId,
      ownerContext: decision.ownerId,
      sessionContext: null,
      sessionState: "MISSING",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "MISSING_SESSION_CONTEXT",
      tenantBindingVerified: true,
      ownerBindingVerified: true,
      sessionBindingVerified: false,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "stale-session-context",
      tenantContext: decision.tenantId,
      ownerContext: decision.ownerId,
      sessionContext: "session-synthetic-stale-001",
      sessionState: "STALE",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "STALE_SESSION_CONTEXT",
      tenantBindingVerified: true,
      ownerBindingVerified: true,
      sessionBindingVerified: false,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "revoked-session-context",
      tenantContext: decision.tenantId,
      ownerContext: decision.ownerId,
      sessionContext: "session-synthetic-revoked-001",
      sessionState: "REVOKED",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "REVOKED_SESSION_CONTEXT",
      tenantBindingVerified: true,
      ownerBindingVerified: true,
      sessionBindingVerified: false,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "cross-tenant-session-context",
      tenantContext: decision.tenantId,
      ownerContext: decision.ownerId,
      sessionContext: "session-synthetic-other-tenant-001",
      sessionState: "CROSS_TENANT",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "SESSION_TENANT_BINDING_MISMATCH",
      tenantBindingVerified: true,
      ownerBindingVerified: true,
      sessionBindingVerified: false,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "cross-owner-session-context",
      tenantContext: decision.tenantId,
      ownerContext: decision.ownerId,
      sessionContext: "session-synthetic-other-owner-001",
      sessionState: "CROSS_OWNER",
      expectedDecision: "DENY_SYNTHETIC_CONTEXT" as const,
      rejectionClass: "SESSION_OWNER_BINDING_MISMATCH",
      tenantBindingVerified: true,
      ownerBindingVerified: true,
      sessionBindingVerified: false,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
  ]);

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) =>
      deepFreeze({
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        controlId: candidate.controlId,
        evidenceState: (
          index < 2
            ? "OWNER_REVIEW_ACCEPTED"
            : index === 2
              ? "EXECUTED_AWAITING_OWNER_REVIEW"
              : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
        ) as
          | "OWNER_REVIEW_ACCEPTED"
          | "EXECUTED_AWAITING_OWNER_REVIEW"
          | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: index <= 2,
        currentlyExecutable: false as const,
        ownerReviewRequiredBeforeNextSequence: true as const,
        actualRepositoryEvaluationAuthorized: false as const,
        actualRepositoryReadAuthorized: false as const,
        repositoryWriteAuthorized: false as const,
        filesystemMutationAuthorized: false as const,
        commandExecutionAuthorized: false as const,
        networkAccessAuthorized: false as const,
      }),
    ),
  );

  const evidenceCore = {
    evidenceType:
      "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_CONTEXT_BINDING_MODEL_ONLY" as const,
    activeEvidenceSequence: 3 as const,
    activeControlId:
      "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING" as const,
    evaluatedContextCaseCount: 10 as const,
    fullyBoundAllowedCaseCount: 1 as const,
    rejectedContextCaseCount: 9 as const,
    missingTenantRejectedCount: 1 as const,
    tenantMismatchRejectedCount: 1 as const,
    missingOwnerRejectedCount: 1 as const,
    ownerMismatchRejectedCount: 1 as const,
    missingSessionRejectedCount: 1 as const,
    staleSessionRejectedCount: 1 as const,
    revokedSessionRejectedCount: 1 as const,
    sessionTenantMismatchRejectedCount: 1 as const,
    sessionOwnerMismatchRejectedCount: 1 as const,
    unauthorizedContextAllowedCount: 0 as const,
    tenantIdentityBindingRequired: true as const,
    ownerIdentityBindingRequired: true as const,
    activeSessionBindingRequired: true as const,
    copiedContextAccepted: false as const,
    staleSessionAccepted: false as const,
    revokedSessionAccepted: false as const,
    crossTenantSessionAccepted: false as const,
    crossOwnerSessionAccepted: false as const,
    failClosedOnMissingContext: true as const,
    failClosedOnContextMismatch: true as const,
    deterministicContextEvaluationVerified: true as const,
    tenantBindingVerified: true as const,
    ownerBindingVerified: true as const,
    sessionBindingVerified: true as const,
    actualSessionValidationPerformed: false as const,
    actualFilesystemInspectionPerformed: false as const,
    actualRepositoryAccessAttempted: false as const,
    actualRepositoryContentRead: false as const,
    commandExecutionAttempted: false as const,
    networkAccessAttempted: false as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    emergencyPauseTriggered: false as const,
    rollbackMarkerRecorded: true as const,
    rollbackRequired: false as const,
    contextBindingCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_THREE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceTwoOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceTwoOwnerReview.decisionDigest,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      thirdCandidate.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 3 as const,
    controlId:
      "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING" as const,
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
      canonicalSequenceTwoOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceThreeOnly: true as const,
      exactlyThreeEvidenceItemsExecutedInWorkstream: true as const,
      remainingFiveEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceFourSyntheticEvidenceExecutionAuthorized:
        false as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 3 as const,
      actualRepositoryEvaluationAuthorized: false as const,
      actualRepositoryEvaluationPerformed: false as const,
      repositoryReadOnlySandboxEvaluationAuthorized:
        false as const,
      repositoryReadOnlySandboxExecutionAuthorized:
        false as const,
      actualRepositoryReadPerformed: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-three execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-three execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-three execution integrity is invalid.",
    );
  }

  const thirdCandidate = decision.candidateDecisions[2];

  if (
    !thirdCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_THREE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceTwoOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceTwoOwnerReview.decisionDigest ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      thirdCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 3 ||
    record.controlId !==
      "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceTwoOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-three execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_CONTEXT_BINDING_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 3 ||
    record.evidence.activeControlId !==
      "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING" ||
    record.evidence.evaluatedContextCaseCount !== 10 ||
    record.evidence.fullyBoundAllowedCaseCount !== 1 ||
    record.evidence.rejectedContextCaseCount !== 9 ||
    record.evidence.missingTenantRejectedCount !== 1 ||
    record.evidence.tenantMismatchRejectedCount !== 1 ||
    record.evidence.missingOwnerRejectedCount !== 1 ||
    record.evidence.ownerMismatchRejectedCount !== 1 ||
    record.evidence.missingSessionRejectedCount !== 1 ||
    record.evidence.staleSessionRejectedCount !== 1 ||
    record.evidence.revokedSessionRejectedCount !== 1 ||
    record.evidence.sessionTenantMismatchRejectedCount !== 1 ||
    record.evidence.sessionOwnerMismatchRejectedCount !== 1 ||
    record.evidence.unauthorizedContextAllowedCount !== 0 ||
    record.evidence.tenantIdentityBindingRequired !== true ||
    record.evidence.ownerIdentityBindingRequired !== true ||
    record.evidence.activeSessionBindingRequired !== true ||
    record.evidence.copiedContextAccepted !== false ||
    record.evidence.staleSessionAccepted !== false ||
    record.evidence.revokedSessionAccepted !== false ||
    record.evidence.crossTenantSessionAccepted !== false ||
    record.evidence.crossOwnerSessionAccepted !== false ||
    record.evidence.failClosedOnMissingContext !== true ||
    record.evidence.failClosedOnContextMismatch !== true ||
    record.evidence.deterministicContextEvaluationVerified !== true ||
    record.evidence.tenantBindingVerified !== true ||
    record.evidence.ownerBindingVerified !== true ||
    record.evidence.sessionBindingVerified !== true ||
    record.evidence.actualSessionValidationPerformed !== false ||
    record.evidence.actualFilesystemInspectionPerformed !== false ||
    record.evidence.actualRepositoryAccessAttempted !== false ||
    record.evidence.actualRepositoryContentRead !== false ||
    record.evidence.commandExecutionAttempted !== false ||
    record.evidence.networkAccessAttempted !== false ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.contextBindingCases.length !== 10 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository context-binding synthetic evidence is invalid.",
    );
  }

  record.evidence.contextBindingCases.forEach((bindingCase, index) => {
    const allowed = index === 0;

    if (
      bindingCase.expectedDecision !==
        (allowed
          ? "ALLOW_BOUND_SYNTHETIC_CONTEXT"
          : "DENY_SYNTHETIC_CONTEXT") ||
      bindingCase.actualRepositoryAccessAttempted !== false ||
      bindingCase.failClosed !== true ||
      !Object.isFrozen(bindingCase)
    ) {
      throw new Error(
        `Repository context-binding synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      allowed &&
      (
        bindingCase.rejectionClass !== null ||
        bindingCase.tenantBindingVerified !== true ||
        bindingCase.ownerBindingVerified !== true ||
        bindingCase.sessionBindingVerified !== true
      )
    ) {
      throw new Error(
        "Fully bound synthetic context case is invalid.",
      );
    }

    if (!allowed && bindingCase.rejectionClass === null) {
      throw new Error(
        `Rejected synthetic context case ${index + 1} is invalid.`,
      );
    }
  });

  record.evidence.sequenceLedger.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    const expectedState =
      index < 2
        ? "OWNER_REVIEW_ACCEPTED"
        : index === 2
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW";

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.evidenceState !== expectedState ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== (index <= 2) ||
      entry.currentlyExecutable !== false ||
      entry.ownerReviewRequiredBeforeNextSequence !== true ||
      entry.actualRepositoryEvaluationAuthorized !== false ||
      entry.actualRepositoryReadAuthorized !== false ||
      entry.repositoryWriteAuthorized !== false ||
      entry.filesystemMutationAuthorized !== false ||
      entry.commandExecutionAuthorized !== false ||
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
    boundary.canonicalSequenceTwoOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceThreeOnly,
    boundary.exactlyThreeEvidenceItemsExecutedInWorkstream,
    boundary.remainingFiveEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.syntheticSafetyEvidenceExecutionAuthorized,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceFourSyntheticEvidenceExecutionAuthorized,
    boundary.actualRepositoryEvaluationAuthorized,
    boundary.actualRepositoryEvaluationPerformed,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.actualRepositoryReadPerformed,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
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
    boundary.concurrentEngineeringWorkAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 3 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.contextBindingCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-three authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution {
  if (input.sourceOwnerReview !== sequenceTwoOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-two owner review can execute repository read-only sandbox sequence three.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-three execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-three execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceTwoOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-three execution cannot precede sequence-two owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-three-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T19:50:00.000Z",
  });