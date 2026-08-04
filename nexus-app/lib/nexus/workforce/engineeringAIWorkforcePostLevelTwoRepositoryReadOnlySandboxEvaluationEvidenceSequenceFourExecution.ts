import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-four-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;
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

const sequenceThreeOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    decision,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionOwnerReviewDecision(
    sequenceThreeOwnerReview,
  );

  const fourthCandidate = decision.candidateDecisions[3];

  if (
    !fourthCandidate ||
    decision.workstreamSequence !== 3 ||
    decision.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    fourthCandidate.sequence !== 4 ||
    fourthCandidate.controlId !==
      "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION" ||
    fourthCandidate.evidenceExecutionAuthorized !== true ||
    fourthCandidate.evidenceExecutionPerformed !== false ||
    sequenceThreeOwnerReview.decision !==
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_THREE_EXECUTION" ||
    sequenceThreeOwnerReview.executionAccepted !== true ||
    sequenceThreeOwnerReview.evidenceAccepted !== true ||
    sequenceThreeOwnerReview.sequenceThreeClosed !== true ||
    sequenceThreeOwnerReview.authorityBoundary
      .sequenceFourSyntheticEvidenceExecutionAuthorized !== true ||
    sequenceThreeOwnerReview.authorityBoundary
      .sequenceFourSyntheticEvidenceExecutionPerformed !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .onlySequenceFourAuthorizedNext !== true ||
    sequenceThreeOwnerReview.authorityBoundary
      .actualRepositoryEvaluationAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .actualRepositoryEvaluationPerformed !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .actualRepositoryReadPerformed !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .repositoryReadAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .filesystemMutationAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .gitMutationAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .commandExecutionAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .networkAccessAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .publicLaunchAuthorized !== false ||
    sequenceThreeOwnerReview.authorityBoundary
      .founderLiberationAchieved !== false ||
    sequenceThreeOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox sequence-four prerequisites are invalid.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const fourthCandidate = decision.candidateDecisions[3];

  if (!fourthCandidate) {
    throw new Error(
      "Repository read-only sandbox sequence-four candidate is missing.",
    );
  }

  const contentExclusionCases = deepFreeze([
    deepFreeze({
      caseId: "benign-typescript-source",
      syntheticPath: "lib/nexus/example.ts",
      syntheticContentClass: "BENIGN_SOURCE_CODE",
      expectedDecision: "ALLOW_SYNTHETIC_NON_SENSITIVE_CONTENT" as const,
      exclusionClass: null,
      redactionRequired: false,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "benign-test-source",
      syntheticPath: "lib/nexus/__tests__/example.test.ts",
      syntheticContentClass: "BENIGN_TEST_CODE",
      expectedDecision: "ALLOW_SYNTHETIC_NON_SENSITIVE_CONTENT" as const,
      exclusionClass: null,
      redactionRequired: false,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "environment-file",
      syntheticPath: ".env.production",
      syntheticContentClass: "ENVIRONMENT_CONFIGURATION",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "ENVIRONMENT_FILE",
      redactionRequired: true,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "private-key-file",
      syntheticPath: "config/signing-private-key.pem",
      syntheticContentClass: "PRIVATE_KEY_MATERIAL",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "PRIVATE_KEY_FILE",
      redactionRequired: true,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "credential-file",
      syntheticPath: "config/service-credentials.json",
      syntheticContentClass: "SERVICE_CREDENTIAL_CONFIGURATION",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "CREDENTIAL_FILE",
      redactionRequired: true,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "token-marker",
      syntheticPath: "lib/nexus/provider.ts",
      syntheticContentClass: "ACCESS_TOKEN_MARKER",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "TOKEN_CONTENT_MARKER",
      redactionRequired: true,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "password-marker",
      syntheticPath: "lib/nexus/config.ts",
      syntheticContentClass: "PASSWORD_ASSIGNMENT_MARKER",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "PASSWORD_CONTENT_MARKER",
      redactionRequired: true,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "private-key-header-marker",
      syntheticPath: "lib/nexus/signing.ts",
      syntheticContentClass: "PRIVATE_KEY_HEADER_MARKER",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "PRIVATE_KEY_CONTENT_MARKER",
      redactionRequired: true,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "customer-sensitive-record",
      syntheticPath: "fixtures/customer-record.json",
      syntheticContentClass: "REAL_CUSTOMER_SENSITIVE_DATA",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "CUSTOMER_SENSITIVE_CONTENT",
      redactionRequired: true,
      contentMaterialized: false as const,
      actualRepositoryAccessAttempted: false as const,
      failClosed: true as const,
    }),
    deepFreeze({
      caseId: "session-credential-record",
      syntheticPath: "fixtures/session-record.json",
      syntheticContentClass: "SESSION_CREDENTIAL_DATA",
      expectedDecision: "BLOCK_SYNTHETIC_SENSITIVE_CONTENT" as const,
      exclusionClass: "SESSION_CREDENTIAL_CONTENT",
      redactionRequired: true,
      contentMaterialized: false as const,
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
          index < 3
            ? "OWNER_REVIEW_ACCEPTED"
            : index === 3
              ? "EXECUTED_AWAITING_OWNER_REVIEW"
              : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
        ) as
          | "OWNER_REVIEW_ACCEPTED"
          | "EXECUTED_AWAITING_OWNER_REVIEW"
          | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionAuthorized:
          candidate.evidenceExecutionAuthorized,
        evidenceExecutionPerformed: index <= 3,
        currentlyExecutable: false as const,
        ownerReviewRequiredBeforeNextSequence: true as const,
        actualRepositoryEvaluationAuthorized: false as const,
        actualRepositoryReadAuthorized: false as const,
        repositoryWriteAuthorized: false as const,
        filesystemMutationAuthorized: false as const,
        commandExecutionAuthorized: false as const,
        networkAccessAuthorized: false as const,
        secretsAccessAuthorized: false as const,
      }),
    ),
  );

  const evidenceCore = {
    evidenceType:
      "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION_EXECUTION_EVIDENCE" as const,
    evaluationMode:
      "SYNTHETIC_CONTENT_CLASSIFICATION_MODEL_ONLY" as const,
    activeEvidenceSequence: 4 as const,
    activeControlId:
      "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION" as const,
    evaluatedContentCaseCount: 10 as const,
    benignContentAllowedCaseCount: 2 as const,
    sensitiveContentBlockedCaseCount: 8 as const,
    sensitiveFilenameBlockedCaseCount: 3 as const,
    sensitiveContentMarkerBlockedCaseCount: 3 as const,
    customerSensitiveContentBlockedCaseCount: 1 as const,
    sessionCredentialContentBlockedCaseCount: 1 as const,
    unauthorizedSensitiveContentAllowedCount: 0 as const,
    secretFilenameExclusionRequired: true as const,
    secretContentMarkerExclusionRequired: true as const,
    customerSensitiveContentExclusionRequired: true as const,
    sessionCredentialExclusionRequired: true as const,
    redactionBeforeEvidenceRequired: true as const,
    sensitiveValueMaterializationAllowed: false as const,
    rawSensitiveValueLoggingAllowed: false as const,
    sensitiveEvidenceExportAllowed: false as const,
    failClosedOnClassificationUncertainty: true as const,
    failClosedOnSensitiveMarker: true as const,
    deterministicClassificationVerified: true as const,
    exclusionEnforcementVerified: true as const,
    redactionBoundaryVerified: true as const,
    actualSecretInspectionPerformed: false as const,
    actualSensitiveContentInspectionPerformed: false as const,
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
    contentExclusionCases,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FOUR_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId:
      sequenceThreeOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest:
      sequenceThreeOwnerReview.decisionDigest,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest:
      fourthCandidate.candidateDecisionDigest,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceSequence: 4 as const,
    controlId:
      "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION" as const,
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
      canonicalSequenceThreeOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceFourOnly: true as const,
      exactlyFourEvidenceItemsExecutedInWorkstream: true as const,
      remainingFourEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceFiveSyntheticEvidenceExecutionAuthorized:
        false as const,
      syntheticSafetyEvidenceExecutionAuthorized: true as const,
      syntheticSafetyEvidenceExecutionPerformedCount: 4 as const,
      secretsExclusionEvidenceExecuted: true as const,
      secretsExclusionBoundaryVerified: true as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution,
): void {
  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-four execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-four execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-four execution integrity is invalid.",
    );
  }

  const fourthCandidate = decision.candidateDecisions[3];

  if (
    !fourthCandidate ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FOUR_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceOwnerReviewDecisionId !==
      sequenceThreeOwnerReview.decisionId ||
    record.sourceOwnerReviewDecisionDigest !==
      sequenceThreeOwnerReview.decisionDigest ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !==
      fourthCandidate.candidateDecisionDigest ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceSequence !== 4 ||
    record.controlId !==
      "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION" ||
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(sequenceThreeOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-four execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION_EXECUTION_EVIDENCE" ||
    record.evidence.evaluationMode !==
      "SYNTHETIC_CONTENT_CLASSIFICATION_MODEL_ONLY" ||
    record.evidence.activeEvidenceSequence !== 4 ||
    record.evidence.activeControlId !==
      "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION" ||
    record.evidence.evaluatedContentCaseCount !== 10 ||
    record.evidence.benignContentAllowedCaseCount !== 2 ||
    record.evidence.sensitiveContentBlockedCaseCount !== 8 ||
    record.evidence.sensitiveFilenameBlockedCaseCount !== 3 ||
    record.evidence.sensitiveContentMarkerBlockedCaseCount !== 3 ||
    record.evidence.customerSensitiveContentBlockedCaseCount !== 1 ||
    record.evidence.sessionCredentialContentBlockedCaseCount !== 1 ||
    record.evidence.unauthorizedSensitiveContentAllowedCount !== 0 ||
    record.evidence.secretFilenameExclusionRequired !== true ||
    record.evidence.secretContentMarkerExclusionRequired !== true ||
    record.evidence.customerSensitiveContentExclusionRequired !== true ||
    record.evidence.sessionCredentialExclusionRequired !== true ||
    record.evidence.redactionBeforeEvidenceRequired !== true ||
    record.evidence.sensitiveValueMaterializationAllowed !== false ||
    record.evidence.rawSensitiveValueLoggingAllowed !== false ||
    record.evidence.sensitiveEvidenceExportAllowed !== false ||
    record.evidence.failClosedOnClassificationUncertainty !== true ||
    record.evidence.failClosedOnSensitiveMarker !== true ||
    record.evidence.deterministicClassificationVerified !== true ||
    record.evidence.exclusionEnforcementVerified !== true ||
    record.evidence.redactionBoundaryVerified !== true ||
    record.evidence.actualSecretInspectionPerformed !== false ||
    record.evidence.actualSensitiveContentInspectionPerformed !== false ||
    record.evidence.actualFilesystemInspectionPerformed !== false ||
    record.evidence.actualRepositoryAccessAttempted !== false ||
    record.evidence.actualRepositoryContentRead !== false ||
    record.evidence.commandExecutionAttempted !== false ||
    record.evidence.networkAccessAttempted !== false ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.contentExclusionCases.length !== 10 ||
    record.evidence.sequenceLedger.length !== 8
  ) {
    throw new Error(
      "Repository secrets-exclusion synthetic evidence is invalid.",
    );
  }

  record.evidence.contentExclusionCases.forEach((contentCase, index) => {
    const allowed = index < 2;

    if (
      contentCase.expectedDecision !==
        (allowed
          ? "ALLOW_SYNTHETIC_NON_SENSITIVE_CONTENT"
          : "BLOCK_SYNTHETIC_SENSITIVE_CONTENT") ||
      contentCase.contentMaterialized !== false ||
      contentCase.actualRepositoryAccessAttempted !== false ||
      contentCase.failClosed !== true ||
      !Object.isFrozen(contentCase)
    ) {
      throw new Error(
        `Repository content-exclusion synthetic case ${index + 1} is invalid.`,
      );
    }

    if (
      allowed &&
      (contentCase.exclusionClass !== null ||
        contentCase.redactionRequired !== false)
    ) {
      throw new Error(
        `Benign synthetic content case ${index + 1} is invalid.`,
      );
    }

    if (
      !allowed &&
      (contentCase.exclusionClass === null ||
        contentCase.redactionRequired !== true)
    ) {
      throw new Error(
        `Sensitive synthetic content case ${index + 1} is invalid.`,
      );
    }
  });

  record.evidence.sequenceLedger.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    const expectedState =
      index < 3
        ? "OWNER_REVIEW_ACCEPTED"
        : index === 3
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW";

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.evidenceState !== expectedState ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== (index <= 3) ||
      entry.currentlyExecutable !== false ||
      entry.ownerReviewRequiredBeforeNextSequence !== true ||
      entry.actualRepositoryEvaluationAuthorized !== false ||
      entry.actualRepositoryReadAuthorized !== false ||
      entry.repositoryWriteAuthorized !== false ||
      entry.filesystemMutationAuthorized !== false ||
      entry.commandExecutionAuthorized !== false ||
      entry.networkAccessAuthorized !== false ||
      entry.secretsAccessAuthorized !== false ||
      !Object.isFrozen(entry)
    ) {
      throw new Error(
        `Repository read-only sandbox sequence ledger entry ${index + 1} is invalid.`,
      );
    }
  });

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalSequenceThreeOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceFourOnly,
    boundary.exactlyFourEvidenceItemsExecutedInWorkstream,
    boundary.remainingFourEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.syntheticSafetyEvidenceExecutionAuthorized,
    boundary.secretsExclusionEvidenceExecuted,
    boundary.secretsExclusionBoundaryVerified,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.sequenceFiveSyntheticEvidenceExecutionAuthorized,
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
    boundary.syntheticSafetyEvidenceExecutionPerformedCount !== 4 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.contentExclusionCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-four authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution {
  if (input.sourceOwnerReview !== sequenceThreeOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-three owner review can execute repository read-only sandbox sequence four.",
    );
  }

  validateCanonicalPrerequisites();

  requireIdentifier(
    "Repository read-only sandbox sequence-four execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Repository read-only sandbox sequence-four execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceThreeOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox sequence-four execution cannot precede sequence-three owner review.",
    );
  }

  const record = buildExecution(
    input.executionId,
    input.executedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-sequence-four-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-02T20:10:00.000Z",
  });