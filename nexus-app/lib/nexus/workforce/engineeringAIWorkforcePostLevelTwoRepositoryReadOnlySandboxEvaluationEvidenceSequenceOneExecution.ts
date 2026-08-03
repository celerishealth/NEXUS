import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-one-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecutionInput {
  readonly executionId: string;
  readonly sourceDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION;
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

function validateCanonicalDecision(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  const first = decision.candidateDecisions[0];

  if (
    !first ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    decision.summary.approvedEvidenceExecutionCount !== 8 ||
    decision.summary.rejectedEvidenceExecutionCount !== 0 ||
    decision.summary.currentlyExecutableCount !== 1 ||
    decision.summary.waitingForPriorEvidenceOwnerReviewCount !== 7 ||
    decision.summary.evidenceExecutionPerformedCount !== 0 ||
    decision.summary.aggregateConcurrentExecutionLimit !== 0 ||
    decision.authorityBoundary
      .syntheticSafetyEvidenceExecutionAuthorized !== true ||
    decision.authorityBoundary
      .syntheticSafetyEvidenceExecutionPerformed !== false ||
    decision.authorityBoundary
      .oneAtATimeEvidenceExecutionRequired !== true ||
    decision.authorityBoundary.currentlyExecutableEvidenceCount !== 1 ||
    decision.authorityBoundary.aggregateConcurrentExecutionLimit !== 0 ||
    decision.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    decision.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    decision.authorityBoundary.repositoryReadAuthorized !== false ||
    decision.authorityBoundary.repositoryWriteAuthorized !== false ||
    decision.authorityBoundary.filesystemMutationAuthorized !== false ||
    decision.authorityBoundary.gitMutationAuthorized !== false ||
    decision.authorityBoundary.commandExecutionAuthorized !== false ||
    decision.authorityBoundary.networkAccessAuthorized !== false ||
    decision.authorityBoundary.productionDeploymentAuthorized !== false ||
    decision.authorityBoundary.publicLaunchAuthorized !== false ||
    decision.authorityBoundary.founderLiberationAchieved !== false ||
    decision.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE" ||
    first.sequence !== 1 ||
    first.controlId !== "REPOSITORY_READ_SCOPE_ALLOWLIST" ||
    first.evidenceExecutionAuthorized !== true ||
    first.evidenceExecutionPerformed !== false ||
    first.currentlyExecutable !== true ||
    first.waitingForPriorEvidenceOwnerReview !== false
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-one decision is invalid.",
    );
  }

  if (
    decision.candidateDecisions.slice(1).some(
      (candidate) =>
        candidate.evidenceExecutionAuthorized !== true ||
        candidate.evidenceExecutionPerformed !== false ||
        candidate.currentlyExecutable !== false ||
        candidate.waitingForPriorEvidenceOwnerReview !== true,
    )
  ) {
    throw new Error(
      "Later repository read-only sandbox evidence sequences must remain blocked.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const first = decision.candidateDecisions[0];

  if (!first) {
    throw new Error(
      "Repository read-only sandbox sequence-one candidate is missing.",
    );
  }

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) =>
      deepFreeze({
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        controlId: candidate.controlId,
        evidenceState: (
          index === 0
            ? "EXECUTED_AWAITING_OWNER_REVIEW"
            : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
        ) as
          | "EXECUTED_AWAITING_OWNER_REVIEW"
          | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: index === 0,
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

  const syntheticAllowlistCases = deepFreeze([
    deepFreeze({
      caseId: "contained-typescript-source",
      requestedPath: "lib/nexus/example.ts",
      expectedDecision: "ALLOW_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Synthetic contained TypeScript source path matches the modeled root, directory, and extension allowlist.",
    }),
    deepFreeze({
      caseId: "contained-test-source",
      requestedPath: "lib/nexus/__tests__/example.test.ts",
      expectedDecision: "ALLOW_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Synthetic contained test source path matches the modeled bounded test-directory and extension allowlist.",
    }),
    deepFreeze({
      caseId: "parent-traversal",
      requestedPath: "../outside.ts",
      expectedDecision: "DENY_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Parent traversal escapes the modeled repository root and must fail closed.",
    }),
    deepFreeze({
      caseId: "nested-traversal",
      requestedPath: "lib/nexus/../../outside.ts",
      expectedDecision: "DENY_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Normalized nested traversal escapes the modeled repository root and must fail closed.",
    }),
    deepFreeze({
      caseId: "absolute-drive-path",
      requestedPath: "C:\\outside\\secret.ts",
      expectedDecision: "DENY_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Absolute drive path is outside the modeled contained repository scope.",
    }),
    deepFreeze({
      caseId: "network-share-path",
      requestedPath: "\\\\server\\share\\file.ts",
      expectedDecision: "DENY_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Network-share path is outside the modeled local repository boundary.",
    }),
    deepFreeze({
      caseId: "sensitive-environment-file",
      requestedPath: ".env.production",
      expectedDecision: "DENY_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Environment configuration is excluded from all future repository-read evaluation scope.",
    }),
    deepFreeze({
      caseId: "non-allowlisted-binary",
      requestedPath: "public/archive.zip",
      expectedDecision: "DENY_SYNTHETIC_SCOPE_MODEL" as const,
      actualRepositoryAccessAttempted: false as const,
      decisionReason:
        "Binary archive extension is not included in the modeled bounded source-evidence allowlist.",
    }),
  ]);

  const evidenceCore = {
    evidenceType:
      "REPOSITORY_READ_SCOPE_ALLOWLIST_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_ALLOWLIST_MODEL_ONLY" as const,
    activeEvidenceSequence: 1 as const,
    activeControlId:
      "REPOSITORY_READ_SCOPE_ALLOWLIST" as const,
    modeledRepositoryRootCount: 1 as const,
    modeledAllowedDirectoryCount: 3 as const,
    modeledAllowedExtensionCount: 8 as const,
    syntheticCaseCount: 8 as const,
    syntheticAllowedCaseCount: 2 as const,
    syntheticDeniedCaseCount: 6 as const,
    maximumFutureFileCount: 8 as const,
    maximumFutureBytesPerFile: 262144 as const,
    maximumFutureTotalBytes: 1048576 as const,
    boundedLineRangeRequired: true as const,
    normalizedContainedPathRequired: true as const,
    explicitFileExtensionRequired: true as const,
    ownerApprovedScopeRequired: true as const,
    tenantBoundRequestRequired: true as const,
    secretAndSensitiveContentExclusionRequired: true as const,
    actualRepositoryAccessAttempted: false as const,
    actualRepositoryContentRead: false as const,
    actualFilesystemInspectionPerformed: false as const,
    pathTraversalAttempted: false as const,
    commandExecutionAttempted: false as const,
    networkAccessAttempted: false as const,
    deterministicEvaluationVerified: true as const,
    failClosedDenialVerified: true as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    emergencyPauseAvailable: true as const,
    emergencyPauseTriggered: false as const,
    rollbackMarkerRecorded: true as const,
    rollbackRequired: false as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    syntheticAllowlistCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      first.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 1 as const,
    controlId:
      "REPOSITORY_READ_SCOPE_ALLOWLIST" as const,
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
      canonicalOwnerDecisionBound: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceOneOnly: true as const,
      exactlyOneEvidenceItemExecuted: true as const,
      remainingSevenEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      nextEvidenceExecutionAuthorized: false as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 1 as const,
      repositoryReadOnlySandboxEvaluationAuthorized: false as const,
      repositoryReadOnlySandboxExecutionAuthorized: false as const,
      actualRepositoryEvaluationPerformed: false as const,
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
      rollbackEvidenceRecorded: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution,
): void {
  validateCanonicalDecision();

  requireIdentifier(
    "Repository read-only sandbox sequence-one execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-one execution time",
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
      "Repository read-only sandbox sequence-one execution integrity is invalid.",
    );
  }

  const first = decision.candidateDecisions[0];

  if (
    !first ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      first.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 1 ||
    record.controlId !==
      "REPOSITORY_READ_SCOPE_ALLOWLIST" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) < Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-one execution identity is invalid.",
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
      "REPOSITORY_READ_SCOPE_ALLOWLIST_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_ALLOWLIST_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 1 ||
    record.evidence.activeControlId !==
      "REPOSITORY_READ_SCOPE_ALLOWLIST" ||
    record.evidence.modeledRepositoryRootCount !== 1 ||
    record.evidence.modeledAllowedDirectoryCount !== 3 ||
    record.evidence.modeledAllowedExtensionCount !== 8 ||
    record.evidence.syntheticCaseCount !== 8 ||
    record.evidence.syntheticAllowedCaseCount !== 2 ||
    record.evidence.syntheticDeniedCaseCount !== 6 ||
    record.evidence.maximumFutureFileCount !== 8 ||
    record.evidence.maximumFutureBytesPerFile !== 262144 ||
    record.evidence.maximumFutureTotalBytes !== 1048576 ||
    record.evidence.boundedLineRangeRequired !== true ||
    record.evidence.normalizedContainedPathRequired !== true ||
    record.evidence.explicitFileExtensionRequired !== true ||
    record.evidence.ownerApprovedScopeRequired !== true ||
    record.evidence.tenantBoundRequestRequired !== true ||
    record.evidence
      .secretAndSensitiveContentExclusionRequired !== true ||
    record.evidence.actualRepositoryAccessAttempted !== false ||
    record.evidence.actualRepositoryContentRead !== false ||
    record.evidence.actualFilesystemInspectionPerformed !== false ||
    record.evidence.pathTraversalAttempted !== false ||
    record.evidence.commandExecutionAttempted !== false ||
    record.evidence.networkAccessAttempted !== false ||
    record.evidence.deterministicEvaluationVerified !== true ||
    record.evidence.failClosedDenialVerified !== true ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.syntheticAllowlistCases.length !== 8 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository read-scope allowlist synthetic evidence is invalid.",
    );
  }

  record.evidence.syntheticAllowlistCases.forEach(
    (testCase, index) => {
      const expectedDecision =
        index < 2
          ? "ALLOW_SYNTHETIC_SCOPE_MODEL"
          : "DENY_SYNTHETIC_SCOPE_MODEL";

      if (
        testCase.expectedDecision !== expectedDecision ||
        testCase.actualRepositoryAccessAttempted !== false ||
        testCase.decisionReason.length < 50 ||
        !Object.isFrozen(testCase)
      ) {
        throw new Error(
          `Repository read-scope allowlist synthetic case ${index + 1} is invalid.`,
        );
      }
    },
  );

  record.evidence.sequenceLedger.forEach(
    (entry, index) => {
      const candidate = decision.candidateDecisions[index];

      if (
        !candidate ||
        entry.sequence !== index + 1 ||
        entry.controlId !== candidate.controlId ||
        entry.evidenceState !==
          (index === 0
            ? "EXECUTED_AWAITING_OWNER_REVIEW"
            : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW") ||
        entry.evidenceExecutionAuthorized !== true ||
        entry.evidenceExecutionPerformed !== (index === 0) ||
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
    },
  );

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalOwnerDecisionBound,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceOneOnly,
    boundary.exactlyOneEvidenceItemExecuted,
    boundary.remainingSevenEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.syntheticSafetyEvidenceExecutionAuthorized,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.nextEvidenceExecutionAuthorized,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.actualRepositoryEvaluationPerformed,
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
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 1 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.syntheticAllowlistCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-one authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution {
  if (input.sourceDecision !== decision) {
    throw new Error(
      "Only the canonical repository read-only sandbox execution decision can execute sequence one.",
    );
  }

  validateCanonicalDecision();

  requireIdentifier(
    "Repository read-only sandbox sequence-one execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-one execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-one execution cannot precede owner decisions.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-one-execution-001",
    sourceDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
    executedAt: "2026-08-02T19:10:00.000Z",
  });