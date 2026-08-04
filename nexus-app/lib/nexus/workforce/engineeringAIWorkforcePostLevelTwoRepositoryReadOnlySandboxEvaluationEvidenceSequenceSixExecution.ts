import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-six-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;
  readonly executedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

const MAXIMUM_FILE_COUNT = 25 as const;
const MAXIMUM_BYTE_COUNT = 1_048_576 as const;
const MAXIMUM_LINE_COUNT = 5_000 as const;
const MAXIMUM_QUERY_COUNT = 20 as const;
const MAXIMUM_RECURSION_DEPTH = 4 as const;
const MAXIMUM_EXECUTION_DURATION_MS = 30_000 as const;
const MAXIMUM_OUTPUT_BYTE_COUNT = 262_144 as const;
const MAXIMUM_EVIDENCE_RETENTION_ITEM_COUNT = 100 as const;

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

const sequenceFiveOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision(
    sequenceFiveOwnerReview,
  );

  const sixthCandidate = decision.candidateDecisions[5];

  if (
    !sixthCandidate ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    sixthCandidate.sequence !== 6 ||
    sixthCandidate.controlId !==
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" ||
    sixthCandidate.evidenceExecutionAuthorized !== true ||
    sixthCandidate.evidenceExecutionPerformed !== false ||
    sequenceFiveOwnerReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION" ||
    sequenceFiveOwnerReview.executionAccepted !== true ||
    sequenceFiveOwnerReview.evidenceAccepted !== true ||
    sequenceFiveOwnerReview.sequenceFiveClosed !== true ||
    sequenceFiveOwnerReview.authorityBoundary
      .sequenceSixSyntheticEvidenceExecutionAuthorized !== true ||
    sequenceFiveOwnerReview.authorityBoundary
      .sequenceSixSyntheticEvidenceExecutionPerformed !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .onlySequenceSixAuthorizedNext !== true ||
    sequenceFiveOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .actualRepositoryReadPerformed !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .filesystemReadAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .gitMutationAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .packageExecutionAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceFiveOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-six prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const sixthCandidate = decision.candidateDecisions[5];

  if (!sixthCandidate) {
    throw new Error(
      "Repository read-only sandbox sequence-six candidate is missing.",
    );
  }

  const resourceLimitCases = deepFreeze([
    deepFreeze({
      caseId: "bounded-single-file-query",
      requestedFileCount: 1,
      requestedByteCount: 65_536,
      requestedLineCount: 500,
      requestedQueryCount: 1,
      requestedRecursionDepth: 0,
      requestedExecutionDurationMs: 2_000,
      requestedOutputByteCount: 16_384,
      requestedEvidenceRetentionItemCount: 1,
      expectedDecision: "ALLOW_SYNTHETIC_BOUNDED_REQUEST" as const,
      limitBreachClass: null,
      ownerEscalationRequired: false,
      emergencyPauseActivated: false,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "bounded-multi-file-query",
      requestedFileCount: 10,
      requestedByteCount: 524_288,
      requestedLineCount: 2_500,
      requestedQueryCount: 8,
      requestedRecursionDepth: 2,
      requestedExecutionDurationMs: 15_000,
      requestedOutputByteCount: 131_072,
      requestedEvidenceRetentionItemCount: 40,
      expectedDecision: "ALLOW_SYNTHETIC_BOUNDED_REQUEST" as const,
      limitBreachClass: null,
      ownerEscalationRequired: false,
      emergencyPauseActivated: false,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "file-count-limit-breach",
      requestedFileCount: 26,
      requestedByteCount: 262_144,
      requestedLineCount: 1_000,
      requestedQueryCount: 2,
      requestedRecursionDepth: 1,
      requestedExecutionDurationMs: 5_000,
      requestedOutputByteCount: 32_768,
      requestedEvidenceRetentionItemCount: 10,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "FILE_COUNT_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "byte-count-limit-breach",
      requestedFileCount: 5,
      requestedByteCount: 1_048_577,
      requestedLineCount: 1_000,
      requestedQueryCount: 2,
      requestedRecursionDepth: 1,
      requestedExecutionDurationMs: 5_000,
      requestedOutputByteCount: 32_768,
      requestedEvidenceRetentionItemCount: 10,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "BYTE_COUNT_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "line-count-limit-breach",
      requestedFileCount: 5,
      requestedByteCount: 262_144,
      requestedLineCount: 5_001,
      requestedQueryCount: 2,
      requestedRecursionDepth: 1,
      requestedExecutionDurationMs: 5_000,
      requestedOutputByteCount: 32_768,
      requestedEvidenceRetentionItemCount: 10,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "LINE_COUNT_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "query-count-limit-breach",
      requestedFileCount: 5,
      requestedByteCount: 262_144,
      requestedLineCount: 1_000,
      requestedQueryCount: 21,
      requestedRecursionDepth: 1,
      requestedExecutionDurationMs: 5_000,
      requestedOutputByteCount: 32_768,
      requestedEvidenceRetentionItemCount: 10,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "QUERY_COUNT_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "recursion-depth-limit-breach",
      requestedFileCount: 5,
      requestedByteCount: 262_144,
      requestedLineCount: 1_000,
      requestedQueryCount: 2,
      requestedRecursionDepth: 5,
      requestedExecutionDurationMs: 5_000,
      requestedOutputByteCount: 32_768,
      requestedEvidenceRetentionItemCount: 10,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "RECURSION_DEPTH_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "execution-duration-limit-breach",
      requestedFileCount: 5,
      requestedByteCount: 262_144,
      requestedLineCount: 1_000,
      requestedQueryCount: 2,
      requestedRecursionDepth: 1,
      requestedExecutionDurationMs: 30_001,
      requestedOutputByteCount: 32_768,
      requestedEvidenceRetentionItemCount: 10,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "EXECUTION_DURATION_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "output-size-limit-breach",
      requestedFileCount: 5,
      requestedByteCount: 262_144,
      requestedLineCount: 1_000,
      requestedQueryCount: 2,
      requestedRecursionDepth: 1,
      requestedExecutionDurationMs: 5_000,
      requestedOutputByteCount: 262_145,
      requestedEvidenceRetentionItemCount: 10,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "OUTPUT_SIZE_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "evidence-retention-limit-breach",
      requestedFileCount: 5,
      requestedByteCount: 262_144,
      requestedLineCount: 1_000,
      requestedQueryCount: 2,
      requestedRecursionDepth: 1,
      requestedExecutionDurationMs: 5_000,
      requestedOutputByteCount: 32_768,
      requestedEvidenceRetentionItemCount: 101,
      expectedDecision: "BLOCK_SYNTHETIC_RESOURCE_REQUEST" as const,
      limitBreachClass: "EVIDENCE_RETENTION_LIMIT_EXCEEDED",
      ownerEscalationRequired: true,
      emergencyPauseActivated: true,
      actualResourceQueryPerformed: false as const,
      actualOutputProduced: false as const,
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
          index < 5
            ? "OWNER_REVIEW_ACCEPTED"
            : index === 5
              ? "EXECUTED_AWAITING_OWNER_REVIEW"
              : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
        ) as
          | "OWNER_REVIEW_ACCEPTED"
          | "EXECUTED_AWAITING_OWNER_REVIEW"
          | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: index <= 5,
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
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_RESOURCE_LIMIT_POLICY_MODEL_ONLY" as const,
    activeEvidenceSequence: 6 as const,
    activeControlId:
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" as const,
    evaluatedResourceCaseCount: 10 as const,
    boundedRequestAllowedCaseCount: 2 as const,
    blockedResourceRequestCaseCount: 8 as const,
    fileCountLimitBreachBlockedCount: 1 as const,
    byteCountLimitBreachBlockedCount: 1 as const,
    lineCountLimitBreachBlockedCount: 1 as const,
    queryCountLimitBreachBlockedCount: 1 as const,
    recursionDepthLimitBreachBlockedCount: 1 as const,
    executionDurationLimitBreachBlockedCount: 1 as const,
    outputSizeLimitBreachBlockedCount: 1 as const,
    evidenceRetentionLimitBreachBlockedCount: 1 as const,
    unauthorizedOversizedRequestAllowedCount: 0 as const,
    maximumFileCount: MAXIMUM_FILE_COUNT,
    maximumByteCount: MAXIMUM_BYTE_COUNT,
    maximumLineCount: MAXIMUM_LINE_COUNT,
    maximumQueryCount: MAXIMUM_QUERY_COUNT,
    maximumRecursionDepth: MAXIMUM_RECURSION_DEPTH,
    maximumExecutionDurationMs: MAXIMUM_EXECUTION_DURATION_MS,
    maximumOutputByteCount: MAXIMUM_OUTPUT_BYTE_COUNT,
    maximumEvidenceRetentionItemCount:
      MAXIMUM_EVIDENCE_RETENTION_ITEM_COUNT,
    fileCountLimitRequired: true as const,
    byteCountLimitRequired: true as const,
    lineRangeLimitRequired: true as const,
    queryCountLimitRequired: true as const,
    recursionDepthLimitRequired: true as const,
    executionDurationLimitRequired: true as const,
    outputSizeLimitRequired: true as const,
    evidenceRetentionLimitRequired: true as const,
    unboundedResourceQueryAllowed: false as const,
    recursiveUnboundedQueryAllowed: false as const,
    repeatedAbusiveQueryAllowed: false as const,
    oversizedOutputAllowed: false as const,
    unlimitedEvidenceRetentionAllowed: false as const,
    failClosedOnAnyLimitBreach: true as const,
    failClosedOnUnknownResourceRequest: true as const,
    deterministicResourceLimitEvaluationVerified: true as const,
    resourceQueryLimitEnforcementVerified: true as const,
    outputLimitEnforcementVerified: true as const,
    evidenceRetentionLimitEnforcementVerified: true as const,
    ownerEscalationOnLimitBreachVerified: true as const,
    actualResourceQueryPerformed: false as const,
    actualFilesystemReadPerformed: false as const,
    actualRepositoryAccessAttempted: false as const,
    actualRepositoryContentRead: false as const,
    actualOutputProduced: false as const,
    actualCommandExecutionPerformed: false as const,
    actualPackageExecutionPerformed: false as const,
    actualNetworkAccessPerformed: false as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    emergencyPauseTriggeredForBreachCases: true as const,
    rollbackMarkerRecorded: true as const,
    rollbackRequired: false as const,
    resourceLimitCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceFiveOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceFiveOwnerReview.decisionDigest,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      sixthCandidate.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 6 as const,
    controlId:
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" as const,
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
      canonicalSequenceFiveOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceSixOnly: true as const,
      exactlySixEvidenceItemsExecutedInWorkstream: true as const,
      remainingTwoEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceSevenSyntheticEvidenceExecutionAuthorized:
        false as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 6 as const,
      boundedResourceEvidenceExecuted: true as const,
      boundedResourceBoundaryVerified: true as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-six execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-six execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six execution integrity is invalid.",
    );
  }

  const sixthCandidate = decision.candidateDecisions[5];

  if (
    !sixthCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceFiveOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceFiveOwnerReview.decisionDigest ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      sixthCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 6 ||
    record.controlId !==
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceFiveOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_RESOURCE_LIMIT_POLICY_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 6 ||
    record.evidence.activeControlId !==
      "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS" ||
    record.evidence.evaluatedResourceCaseCount !== 10 ||
    record.evidence.boundedRequestAllowedCaseCount !== 2 ||
    record.evidence.blockedResourceRequestCaseCount !== 8 ||
    record.evidence.fileCountLimitBreachBlockedCount !== 1 ||
    record.evidence.byteCountLimitBreachBlockedCount !== 1 ||
    record.evidence.lineCountLimitBreachBlockedCount !== 1 ||
    record.evidence.queryCountLimitBreachBlockedCount !== 1 ||
    record.evidence.recursionDepthLimitBreachBlockedCount !== 1 ||
    record.evidence.executionDurationLimitBreachBlockedCount !== 1 ||
    record.evidence.outputSizeLimitBreachBlockedCount !== 1 ||
    record.evidence.evidenceRetentionLimitBreachBlockedCount !== 1 ||
    record.evidence.unauthorizedOversizedRequestAllowedCount !== 0 ||
    record.evidence.maximumFileCount !== MAXIMUM_FILE_COUNT ||
    record.evidence.maximumByteCount !== MAXIMUM_BYTE_COUNT ||
    record.evidence.maximumLineCount !== MAXIMUM_LINE_COUNT ||
    record.evidence.maximumQueryCount !== MAXIMUM_QUERY_COUNT ||
    record.evidence.maximumRecursionDepth !== MAXIMUM_RECURSION_DEPTH ||
    record.evidence.maximumExecutionDurationMs !==
      MAXIMUM_EXECUTION_DURATION_MS ||
    record.evidence.maximumOutputByteCount !== MAXIMUM_OUTPUT_BYTE_COUNT ||
    record.evidence.maximumEvidenceRetentionItemCount !==
      MAXIMUM_EVIDENCE_RETENTION_ITEM_COUNT ||
    record.evidence.fileCountLimitRequired !== true ||
    record.evidence.byteCountLimitRequired !== true ||
    record.evidence.lineRangeLimitRequired !== true ||
    record.evidence.queryCountLimitRequired !== true ||
    record.evidence.recursionDepthLimitRequired !== true ||
    record.evidence.executionDurationLimitRequired !== true ||
    record.evidence.outputSizeLimitRequired !== true ||
    record.evidence.evidenceRetentionLimitRequired !== true ||
    record.evidence.unboundedResourceQueryAllowed !== false ||
    record.evidence.recursiveUnboundedQueryAllowed !== false ||
    record.evidence.repeatedAbusiveQueryAllowed !== false ||
    record.evidence.oversizedOutputAllowed !== false ||
    record.evidence.unlimitedEvidenceRetentionAllowed !== false ||
    record.evidence.failClosedOnAnyLimitBreach !== true ||
    record.evidence.failClosedOnUnknownResourceRequest !== true ||
    record.evidence.deterministicResourceLimitEvaluationVerified !== true ||
    record.evidence.resourceQueryLimitEnforcementVerified !== true ||
    record.evidence.outputLimitEnforcementVerified !== true ||
    record.evidence.evidenceRetentionLimitEnforcementVerified !== true ||
    record.evidence.ownerEscalationOnLimitBreachVerified !== true ||
    record.evidence.actualResourceQueryPerformed !== false ||
    record.evidence.actualFilesystemReadPerformed !== false ||
    record.evidence.actualRepositoryAccessAttempted !== false ||
    record.evidence.actualRepositoryContentRead !== false ||
    record.evidence.actualOutputProduced !== false ||
    record.evidence.actualCommandExecutionPerformed !== false ||
    record.evidence.actualPackageExecutionPerformed !== false ||
    record.evidence.actualNetworkAccessPerformed !== false ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.resourceLimitCases.length !== 10 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository bounded-resource synthetic evidence is invalid.",
    );
  }

  record.evidence.resourceLimitCases.forEach((resourceCase, index) => {
    const allowed = index < 2;

    if (
      resourceCase.expectedDecision !==
        (allowed
          ? "ALLOW_SYNTHETIC_BOUNDED_REQUEST"
          : "BLOCK_SYNTHETIC_RESOURCE_REQUEST") ||
      resourceCase.actualResourceQueryPerformed !== false ||
      resourceCase.actualOutputProduced !== false ||
      resourceCase.actualRepositoryAccessAttempted !== false ||
      resourceCase.failClosed !== true ||
      !Object.isFrozen(resourceCase)
    ) {
      throw new Error(
        `Repository resource-limit synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      allowed &&
      (
        resourceCase.limitBreachClass !== null ||
        resourceCase.ownerEscalationRequired !== false ||
        resourceCase.emergencyPauseActivated !== false ||
        resourceCase.requestedFileCount > MAXIMUM_FILE_COUNT ||
        resourceCase.requestedByteCount > MAXIMUM_BYTE_COUNT ||
        resourceCase.requestedLineCount > MAXIMUM_LINE_COUNT ||
        resourceCase.requestedQueryCount > MAXIMUM_QUERY_COUNT ||
        resourceCase.requestedRecursionDepth > MAXIMUM_RECURSION_DEPTH ||
        resourceCase.requestedExecutionDurationMs >
          MAXIMUM_EXECUTION_DURATION_MS ||
        resourceCase.requestedOutputByteCount >
          MAXIMUM_OUTPUT_BYTE_COUNT ||
        resourceCase.requestedEvidenceRetentionItemCount >
          MAXIMUM_EVIDENCE_RETENTION_ITEM_COUNT
      )
    ) {
      throw new Error(
        `Allowed bounded-resource synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      !allowed &&
      (
        resourceCase.limitBreachClass === null ||
        resourceCase.ownerEscalationRequired !== true ||
        resourceCase.emergencyPauseActivated !== true
      )
    ) {
      throw new Error(
        `Blocked bounded-resource synthetic case ${index + 1} is invalid.`,
      );
    }
  });

  record.evidence.sequenceLedger.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    const expectedState =
      index < 5
        ? "OWNER_REVIEW_ACCEPTED"
        : index === 5
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW";

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.evidenceState !== expectedState ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== (index <= 5) ||
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
    boundary.canonicalSequenceFiveOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceSixOnly,
    boundary.exactlySixEvidenceItemsExecutedInWorkstream,
    boundary.remainingTwoEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.syntheticSafetyEvidenceExecutionAuthorized,
    boundary.boundedResourceEvidenceExecuted,
    boundary.boundedResourceBoundaryVerified,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceSevenSyntheticEvidenceExecutionAuthorized,
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
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 6 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.resourceLimitCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution {
  if (input.sourceOwnerReview !== sequenceFiveOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-five owner review can execute repository read-only sandbox sequence six.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-six execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-six execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceFiveOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-six execution cannot precede sequence-five owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-six-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T20:50:00.000Z",
  });