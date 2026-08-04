import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-two-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;
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

const sequenceOneOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecutionOwnerReviewDecision(
    sequenceOneOwnerReview,
  );

  const secondCandidate = decision.candidateDecisions[1];

  if (
    !secondCandidate ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    secondCandidate.sequence !== 2 ||
    secondCandidate.controlId !==
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" ||
    secondCandidate.evidenceExecutionAuthorized !== true ||
    secondCandidate.evidenceExecutionPerformed !== false ||
    sequenceOneOwnerReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_ONE_EXECUTION" ||
    sequenceOneOwnerReview.executionAccepted !== true ||
    sequenceOneOwnerReview.evidenceAccepted !== true ||
    sequenceOneOwnerReview.sequenceOneClosed !== true ||
    sequenceOneOwnerReview.authorityBoundary
      .sequenceTwoSyntheticEvidenceExecutionAuthorized !== true ||
    sequenceOneOwnerReview.authorityBoundary
      .sequenceTwoSyntheticEvidenceExecutionPerformed !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .onlySequenceTwoAuthorizedNext !== true ||
    sequenceOneOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .gitMutationAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceOneOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceOneOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-two prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const secondCandidate = decision.candidateDecisions[1];

  if (!secondCandidate) {
    throw new Error(
      "Repository read-only sandbox sequence-two candidate is missing.",
    );
  }

  const pathCases = deepFreeze([
    deepFreeze({
      caseId: "contained-source-path",
      requestedPath: "lib/nexus/workforce/example.ts",
      modeledNormalizedPath: "lib/nexus/workforce/example.ts",
      expectedDecision: "ALLOW_CONTAINED_SYNTHETIC_PATH" as const,
      rejectionClass: null,
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "contained-normalized-path",
      requestedPath: "lib/nexus/workforce/../workforce/example.test.ts",
      modeledNormalizedPath:
        "lib/nexus/workforce/example.test.ts",
      expectedDecision: "ALLOW_CONTAINED_SYNTHETIC_PATH" as const,
      rejectionClass: null,
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "direct-parent-traversal",
      requestedPath: "../outside.ts",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "PARENT_TRAVERSAL",
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "nested-parent-traversal",
      requestedPath: "lib/nexus/../../outside.ts",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "NESTED_PARENT_TRAVERSAL",
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "absolute-drive-path",
      requestedPath: "C:\\outside\\file.ts",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "ABSOLUTE_DRIVE_PATH",
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "network-share-path",
      requestedPath: "\\\\server\\share\\file.ts",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "NETWORK_SHARE_PATH",
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "drive-relative-path",
      requestedPath: "C:outside.ts",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "DRIVE_RELATIVE_PATH",
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "encoded-parent-traversal",
      requestedPath: "%2e%2e/outside.ts",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "ENCODED_PARENT_TRAVERSAL",
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "mixed-separator-traversal",
      requestedPath: "lib\\nexus\\..\\..\\outside.ts",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "MIXED_SEPARATOR_TRAVERSAL",
      actualPathResolutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "empty-path",
      requestedPath: "",
      modeledNormalizedPath: null,
      expectedDecision: "DENY_SYNTHETIC_PATH" as const,
      rejectionClass: "EMPTY_PATH",
      actualPathResolutionPerformed: false as const,
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
          index === 0
            ? "OWNER_REVIEW_ACCEPTED"
            : index === 1
              ? "EXECUTED_AWAITING_OWNER_REVIEW"
              : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
        ) as
          | "OWNER_REVIEW_ACCEPTED"
          | "EXECUTED_AWAITING_OWNER_REVIEW"
          | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: index <= 1,
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
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_PATH_NORMALIZATION_MODEL_ONLY" as const,
    activeEvidenceSequence: 2 as const,
    activeControlId:
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" as const,
    evaluatedPathCaseCount: 10 as const,
    containedPathAllowedCount: 2 as const,
    rejectedPathCount: 8 as const,
    parentTraversalRejectedCount: 2 as const,
    absoluteDrivePathRejectedCount: 1 as const,
    networkSharePathRejectedCount: 1 as const,
    driveRelativePathRejectedCount: 1 as const,
    encodedTraversalRejectedCount: 1 as const,
    mixedSeparatorTraversalRejectedCount: 1 as const,
    emptyPathRejectedCount: 1 as const,
    unresolvedPathAllowedCount: 0 as const,
    normalizedContainmentRequired: true as const,
    repositoryRootEscapeAllowed: false as const,
    absolutePathAllowed: false as const,
    networkSharePathAllowed: false as const,
    driveRelativePathAllowed: false as const,
    encodedTraversalAllowed: false as const,
    mixedSeparatorTraversalAllowed: false as const,
    ambiguousPathAllowed: false as const,
    failClosedOnEveryRejectedPath: true as const,
    deterministicNormalizationVerified: true as const,
    pathContainmentVerified: true as const,
    traversalRejectionVerified: true as const,
    actualPathResolutionPerformed: false as const,
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
    pathCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceOneOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceOneOwnerReview.decisionDigest,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      secondCandidate.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 2 as const,
    controlId:
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" as const,
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
      canonicalSequenceOneOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceTwoOnly: true as const,
      exactlyTwoEvidenceItemsExecutedInWorkstream: true as const,
      remainingSixEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceThreeSyntheticEvidenceExecutionAuthorized:
        false as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 2 as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-two execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-two execution time",
    record.executedAt,
  );

  const {
    executionDigest,
    ...executionCore
  } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two execution integrity is invalid.",
    );
  }

  const secondCandidate = decision.candidateDecisions[1];

  if (
    !secondCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceOneOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceOneOwnerReview.decisionDigest ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      secondCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 2 ||
    record.controlId !==
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceOneOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two execution identity is invalid.",
    );
  }

  const {
    evidenceDigest,
    ...evidenceCore
  } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_PATH_NORMALIZATION_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 2 ||
    record.evidence.activeControlId !==
      "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION" ||
    record.evidence.evaluatedPathCaseCount !== 10 ||
    record.evidence.containedPathAllowedCount !== 2 ||
    record.evidence.rejectedPathCount !== 8 ||
    record.evidence.parentTraversalRejectedCount !== 2 ||
    record.evidence.absoluteDrivePathRejectedCount !== 1 ||
    record.evidence.networkSharePathRejectedCount !== 1 ||
    record.evidence.driveRelativePathRejectedCount !== 1 ||
    record.evidence.encodedTraversalRejectedCount !== 1 ||
    record.evidence.mixedSeparatorTraversalRejectedCount !== 1 ||
    record.evidence.emptyPathRejectedCount !== 1 ||
    record.evidence.unresolvedPathAllowedCount !== 0 ||
    record.evidence.normalizedContainmentRequired !== true ||
    record.evidence.repositoryRootEscapeAllowed !== false ||
    record.evidence.absolutePathAllowed !== false ||
    record.evidence.networkSharePathAllowed !== false ||
    record.evidence.driveRelativePathAllowed !== false ||
    record.evidence.encodedTraversalAllowed !== false ||
    record.evidence.mixedSeparatorTraversalAllowed !== false ||
    record.evidence.ambiguousPathAllowed !== false ||
    record.evidence.failClosedOnEveryRejectedPath !== true ||
    record.evidence.deterministicNormalizationVerified !== true ||
    record.evidence.pathContainmentVerified !== true ||
    record.evidence.traversalRejectionVerified !== true ||
    record.evidence.actualPathResolutionPerformed !== false ||
    record.evidence.actualFilesystemInspectionPerformed !== false ||
    record.evidence.actualRepositoryAccessAttempted !== false ||
    record.evidence.actualRepositoryContentRead !== false ||
    record.evidence.commandExecutionAttempted !== false ||
    record.evidence.networkAccessAttempted !== false ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.pathCases.length !== 10 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository path-containment synthetic evidence is invalid.",
    );
  }

  record.evidence.pathCases.forEach((pathCase, index) => {
    const expectedDecision =
      index < 2
        ? "ALLOW_CONTAINED_SYNTHETIC_PATH"
        : "DENY_SYNTHETIC_PATH";

    if (
      pathCase.expectedDecision !== expectedDecision ||
      pathCase.actualPathResolutionPerformed !== false ||
      pathCase.actualRepositoryAccessAttempted !== false ||
      pathCase.failClosed !== true ||
      !Object.isFrozen(pathCase)
    ) {
      throw new Error(
        `Repository path-containment synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      index < 2 &&
      (
        pathCase.modeledNormalizedPath === null ||
        pathCase.rejectionClass !== null
      )
    ) {
      throw new Error(
        `Contained synthetic path case ${index + 1} is invalid.`,
      );
    }

    if (
      index >= 2 &&
      (
        pathCase.modeledNormalizedPath !== null ||
        pathCase.rejectionClass === null
      )
    ) {
      throw new Error(
        `Rejected synthetic path case ${index + 1} is invalid.`,
      );
    }
  });

  record.evidence.sequenceLedger.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    const expectedState =
      index === 0
        ? "OWNER_REVIEW_ACCEPTED"
        : index === 1
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW";

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.evidenceState !== expectedState ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== (index <= 1) ||
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
    boundary.canonicalSequenceOneOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceTwoOnly,
    boundary.exactlyTwoEvidenceItemsExecutedInWorkstream,
    boundary.remainingSixEvidenceItemsBlocked,
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
    boundary.sequenceThreeSyntheticEvidenceExecutionAuthorized,
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
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 2 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.pathCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution {
  if (input.sourceOwnerReview !== sequenceOneOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-one owner review can execute repository read-only sandbox sequence two.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-two execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-two execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceOneOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-two execution cannot precede sequence-one owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-two-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T19:30:00.000Z",
  });