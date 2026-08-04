import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-five-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;
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

const sequenceFourOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionOwnerReviewDecision(
    sequenceFourOwnerReview,
  );

  const fifthCandidate = decision.candidateDecisions[4];

  if (
    !fifthCandidate ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    fifthCandidate.sequence !== 5 ||
    fifthCandidate.controlId !==
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" ||
    fifthCandidate.evidenceExecutionAuthorized !== true ||
    fifthCandidate.evidenceExecutionPerformed !== false ||
    sequenceFourOwnerReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FOUR_EXECUTION" ||
    sequenceFourOwnerReview.executionAccepted !== true ||
    sequenceFourOwnerReview.evidenceAccepted !== true ||
    sequenceFourOwnerReview.sequenceFourClosed !== true ||
    sequenceFourOwnerReview.authorityBoundary
      .sequenceFiveSyntheticEvidenceExecutionAuthorized !== true ||
    sequenceFourOwnerReview.authorityBoundary
      .sequenceFiveSyntheticEvidenceExecutionPerformed !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .onlySequenceFiveAuthorizedNext !== true ||
    sequenceFourOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .actualRepositoryReadPerformed !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .gitMutationAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .packageExecutionAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceFourOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-five prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const fifthCandidate = decision.candidateDecisions[4];

  if (!fifthCandidate) {
    throw new Error(
      "Repository read-only sandbox sequence-five candidate is missing.",
    );
  }

  const enforcementCases = deepFreeze([
    deepFreeze({
      caseId: "bounded-text-read-model",
      operationClass: "SYNTHETIC_BOUNDED_TEXT_READ",
      toolClass: "READ_ONLY_FILE_READER",
      requestedEffect: "READ_ONLY",
      expectedDecision: "ALLOW_SYNTHETIC_READ_ONLY_OPERATION" as const,
      rejectionClass: null,
      modeledByteLimit: 262144,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "bounded-metadata-read-model",
      operationClass: "SYNTHETIC_BOUNDED_METADATA_READ",
      toolClass: "READ_ONLY_METADATA_READER",
      requestedEffect: "READ_ONLY",
      expectedDecision: "ALLOW_SYNTHETIC_READ_ONLY_OPERATION" as const,
      rejectionClass: null,
      modeledByteLimit: 4096,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "file-write-attempt",
      operationClass: "SYNTHETIC_FILE_WRITE",
      toolClass: "FILESYSTEM_WRITE_TOOL",
      requestedEffect: "MUTATE_FILE",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "FILESYSTEM_WRITE_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "file-create-attempt",
      operationClass: "SYNTHETIC_FILE_CREATE",
      toolClass: "FILESYSTEM_CREATE_TOOL",
      requestedEffect: "CREATE_FILE",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "FILESYSTEM_CREATE_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "file-delete-attempt",
      operationClass: "SYNTHETIC_FILE_DELETE",
      toolClass: "FILESYSTEM_DELETE_TOOL",
      requestedEffect: "DELETE_FILE",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "FILESYSTEM_DELETE_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "file-rename-attempt",
      operationClass: "SYNTHETIC_FILE_RENAME",
      toolClass: "FILESYSTEM_RENAME_TOOL",
      requestedEffect: "RENAME_FILE",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "FILESYSTEM_RENAME_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "permission-change-attempt",
      operationClass: "SYNTHETIC_PERMISSION_CHANGE",
      toolClass: "FILESYSTEM_PERMISSION_TOOL",
      requestedEffect: "CHANGE_PERMISSIONS",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "FILESYSTEM_PERMISSION_CHANGE_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "shell-command-attempt",
      operationClass: "SYNTHETIC_SHELL_COMMAND",
      toolClass: "COMMAND_EXECUTION_TOOL",
      requestedEffect: "EXECUTE_COMMAND",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "COMMAND_EXECUTION_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "package-execution-attempt",
      operationClass: "SYNTHETIC_PACKAGE_EXECUTION",
      toolClass: "PACKAGE_EXECUTION_TOOL",
      requestedEffect: "EXECUTE_PACKAGE",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "PACKAGE_EXECUTION_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "network-tool-attempt",
      operationClass: "SYNTHETIC_NETWORK_REQUEST",
      toolClass: "NETWORK_ACCESS_TOOL",
      requestedEffect: "ACCESS_NETWORK",
      expectedDecision: "BLOCK_SYNTHETIC_OPERATION" as const,
      rejectionClass: "NETWORK_ACCESS_BLOCKED",
      modeledByteLimit: 0,
      filesystemOperationPerformed: false as const,
      toolExecutionPerformed: false as const,
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
          index < 4
            ? "OWNER_REVIEW_ACCEPTED"
            : index === 4
              ? "EXECUTED_AWAITING_OWNER_REVIEW"
              : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
        ) as
          | "OWNER_REVIEW_ACCEPTED"
          | "EXECUTED_AWAITING_OWNER_REVIEW"
          | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: index <= 4,
        currentlyExecutable: false as const,
        ownerReviewRequiredBeforeNextSequence: true as const,
        actualRepositoryEvaluationAuthorized: false as const,
        actualRepositoryReadAuthorized: false as const,
        repositoryWriteAuthorized: false as const,
        filesystemMutationAuthorized: false as const,
        commandExecutionAuthorized: false as const,
        packageExecutionAuthorized: false as const,
        networkAccessAuthorized: false as const,
      }),
    ),
  );

  const evidenceCore = {
    evidenceType:
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_READ_ONLY_TOOL_POLICY_MODEL_ONLY" as const,
    activeEvidenceSequence: 5 as const,
    activeControlId:
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" as const,
    evaluatedEnforcementCaseCount: 10 as const,
    readOnlyAllowedCaseCount: 2 as const,
    blockedOperationCaseCount: 8 as const,
    blockedFilesystemMutationCaseCount: 5 as const,
    blockedCommandExecutionCaseCount: 1 as const,
    blockedPackageExecutionCaseCount: 1 as const,
    blockedNetworkAccessCaseCount: 1 as const,
    unauthorizedOperationAllowedCount: 0 as const,
    readOnlyFilesystemRequired: true as const,
    readOnlyToolModeRequired: true as const,
    boundedReadLimitRequired: true as const,
    filesystemWriteAllowed: false as const,
    filesystemCreateAllowed: false as const,
    filesystemDeleteAllowed: false as const,
    filesystemRenameAllowed: false as const,
    filesystemPermissionChangeAllowed: false as const,
    commandExecutionAllowed: false as const,
    packageExecutionAllowed: false as const,
    networkAccessAllowed: false as const,
    failClosedOnUnknownTool: true as const,
    failClosedOnMutationRequest: true as const,
    deterministicToolPolicyVerified: true as const,
    readOnlyEnforcementVerified: true as const,
    mutationBlockingVerified: true as const,
    commandBlockingVerified: true as const,
    packageBlockingVerified: true as const,
    networkBlockingVerified: true as const,
    actualFilesystemReadPerformed: false as const,
    actualFilesystemMutationPerformed: false as const,
    actualToolExecutionPerformed: false as const,
    actualCommandExecutionPerformed: false as const,
    actualPackageExecutionPerformed: false as const,
    actualNetworkAccessPerformed: false as const,
    actualRepositoryAccessAttempted: false as const,
    actualRepositoryContentRead: false as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    emergencyPauseAvailable: true as const,
    emergencyPauseTriggered: false as const,
    rollbackMarkerRecorded: true as const,
    rollbackRequired: false as const,
    enforcementCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceFourOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceFourOwnerReview.decisionDigest,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      fifthCandidate.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 5 as const,
    controlId:
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" as const,
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
      canonicalSequenceFourOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceFiveOnly: true as const,
      exactlyFiveEvidenceItemsExecutedInWorkstream: true as const,
      remainingThreeEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceSixSyntheticEvidenceExecutionAuthorized:
        false as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 5 as const,
      readOnlyEnforcementEvidenceExecuted: true as const,
      readOnlyEnforcementBoundaryVerified: true as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-five execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-five execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five execution integrity is invalid.",
    );
  }

  const fifthCandidate = decision.candidateDecisions[4];

  if (
    !fifthCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceFourOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceFourOwnerReview.decisionDigest ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      fifthCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 5 ||
    record.controlId !==
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceFourOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_READ_ONLY_TOOL_POLICY_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 5 ||
    record.evidence.activeControlId !==
      "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT" ||
    record.evidence.evaluatedEnforcementCaseCount !== 10 ||
    record.evidence.readOnlyAllowedCaseCount !== 2 ||
    record.evidence.blockedOperationCaseCount !== 8 ||
    record.evidence.blockedFilesystemMutationCaseCount !== 5 ||
    record.evidence.blockedCommandExecutionCaseCount !== 1 ||
    record.evidence.blockedPackageExecutionCaseCount !== 1 ||
    record.evidence.blockedNetworkAccessCaseCount !== 1 ||
    record.evidence.unauthorizedOperationAllowedCount !== 0 ||
    record.evidence.readOnlyFilesystemRequired !== true ||
    record.evidence.readOnlyToolModeRequired !== true ||
    record.evidence.boundedReadLimitRequired !== true ||
    record.evidence.filesystemWriteAllowed !== false ||
    record.evidence.filesystemCreateAllowed !== false ||
    record.evidence.filesystemDeleteAllowed !== false ||
    record.evidence.filesystemRenameAllowed !== false ||
    record.evidence.filesystemPermissionChangeAllowed !== false ||
    record.evidence.commandExecutionAllowed !== false ||
    record.evidence.packageExecutionAllowed !== false ||
    record.evidence.networkAccessAllowed !== false ||
    record.evidence.failClosedOnUnknownTool !== true ||
    record.evidence.failClosedOnMutationRequest !== true ||
    record.evidence.deterministicToolPolicyVerified !== true ||
    record.evidence.readOnlyEnforcementVerified !== true ||
    record.evidence.mutationBlockingVerified !== true ||
    record.evidence.commandBlockingVerified !== true ||
    record.evidence.packageBlockingVerified !== true ||
    record.evidence.networkBlockingVerified !== true ||
    record.evidence.actualFilesystemReadPerformed !== false ||
    record.evidence.actualFilesystemMutationPerformed !== false ||
    record.evidence.actualToolExecutionPerformed !== false ||
    record.evidence.actualCommandExecutionPerformed !== false ||
    record.evidence.actualPackageExecutionPerformed !== false ||
    record.evidence.actualNetworkAccessPerformed !== false ||
    record.evidence.actualRepositoryAccessAttempted !== false ||
    record.evidence.actualRepositoryContentRead !== false ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.enforcementCases.length !== 10 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository read-only filesystem and tool synthetic evidence is invalid.",
    );
  }

  record.evidence.enforcementCases.forEach((enforcementCase, index) => {
    const allowed = index < 2;

    if (
      enforcementCase.expectedDecision !==
        (allowed
          ? "ALLOW_SYNTHETIC_READ_ONLY_OPERATION"
          : "BLOCK_SYNTHETIC_OPERATION") ||
      enforcementCase.filesystemOperationPerformed !== false ||
      enforcementCase.toolExecutionPerformed !== false ||
      enforcementCase.actualRepositoryAccessAttempted !== false ||
      enforcementCase.failClosed !== true ||
      !Object.isFrozen(enforcementCase)
    ) {
      throw new Error(
        `Repository tool-enforcement synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      allowed &&
      (enforcementCase.rejectionClass !== null ||
        enforcementCase.requestedEffect !== "READ_ONLY" ||
        enforcementCase.modeledByteLimit <= 0)
    ) {
      throw new Error(
        `Allowed synthetic read-only case ${index + 1} is invalid.`,
      );
    }

    if (
      !allowed &&
      (enforcementCase.rejectionClass === null ||
        enforcementCase.modeledByteLimit !== 0)
    ) {
      throw new Error(
        `Blocked synthetic tool case ${index + 1} is invalid.`,
      );
    }
  });

  record.evidence.sequenceLedger.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    const expectedState =
      index < 4
        ? "OWNER_REVIEW_ACCEPTED"
        : index === 4
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW";

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.evidenceState !== expectedState ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== (index <= 4) ||
      entry.currentlyExecutable !== false ||
      entry.ownerReviewRequiredBeforeNextSequence !== true ||
      entry.actualRepositoryEvaluationAuthorized !== false ||
      entry.actualRepositoryReadAuthorized !== false ||
      entry.repositoryWriteAuthorized !== false ||
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
    boundary.canonicalSequenceFourOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceFiveOnly,
    boundary.exactlyFiveEvidenceItemsExecutedInWorkstream,
    boundary.remainingThreeEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.syntheticSafetyEvidenceExecutionAuthorized,
    boundary.readOnlyEnforcementEvidenceExecuted,
    boundary.readOnlyEnforcementBoundaryVerified,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceSixSyntheticEvidenceExecutionAuthorized,
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
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 5 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.enforcementCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution {
  if (input.sourceOwnerReview !== sequenceFourOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-four owner review can execute repository read-only sandbox sequence five.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-five execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-five execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceFourOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-five execution cannot precede sequence-four owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-five-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T20:30:00.000Z",
  });