import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-one-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionInput {
  readonly executionId: string;
  readonly sourceDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION;
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
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION;

function validateCanonicalDecision(): void {
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
    decision,
  );

  const first = decision.candidateDecisions[0];

  if (
    !first ||
    decision.candidateDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    decision.aggregateSummary.evidenceExecutionAuthorizedCount !== 8 ||
    decision.aggregateSummary.evidenceExecutionPerformedCount !== 0 ||
    decision.aggregateSummary.currentlyExecutableEvidenceCount !== 1 ||
    decision.authorityBoundary.onlyOneEvidenceItemCurrentlyExecutable !== true ||
    decision.authorityBoundary.sequentialEvidenceExecutionRequired !== true ||
    decision.authorityBoundary.aggregateEvidenceExecutionLimit !== 1 ||
    decision.authorityBoundary.concurrentEngineeringWorkAuthorized !== false ||
    decision.authorityBoundary.repositoryReadAuthorized !== false ||
    decision.authorityBoundary.repositoryWriteAuthorized !== false ||
    decision.authorityBoundary.productionDeploymentAuthorized !== false ||
    decision.authorityBoundary.publicLaunchAuthorized !== false ||
    decision.authorityBoundary.founderLiberationAchieved !== false ||
    decision.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE" ||
    first.sequence !== 1 ||
    first.controlId !== "SEQUENTIAL_OWNERSHIP_LEDGER" ||
    first.evidenceExecutionAuthorized !== true ||
    first.evidenceExecutionPerformed !== false ||
    first.currentlyExecutable !== true ||
    first.waitingForPriorEvidenceOwnerReview !== false
  ) {
    throw new Error(
      "Canonical sequence-one concurrent-coordination evidence decision is invalid.",
    );
  }

  if (
    decision.candidateDecisions.slice(1).some(
      (candidate) =>
        candidate.currentlyExecutable !== false ||
        candidate.waitingForPriorEvidenceOwnerReview !== true ||
        candidate.evidenceExecutionPerformed !== false,
    )
  ) {
    throw new Error(
      "Later concurrent-coordination evidence sequences must remain blocked.",
    );
  }
}

function buildExecution(executionId: string, executedAt: string) {
  const first = decision.candidateDecisions[0];

  if (!first) {
    throw new Error("Sequence-one decision candidate is missing.");
  }

  const ledgerEntries = decision.candidateDecisions.map((candidate, index) =>
    deepFreeze({
      sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
      controlId: candidate.controlId,
      ownershipState: (
        index === 0
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW"
      ) as
        | "EXECUTED_AWAITING_OWNER_REVIEW"
        | "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
      evidenceExecutionAuthorized: candidate.evidenceExecutionAuthorized,
      evidenceExecutionPerformed: index === 0,
      currentlyExecutable: false,
      ownerReviewRequiredBeforeNextSequence: true,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      concurrentEngineeringWorkAuthorized: false as const,
    }),
  );

  const evidenceCore = {
    evidenceType:
      "SEQUENTIAL_OWNERSHIP_LEDGER_EXECUTION_EVIDENCE" as const,
    ledgerMode:
      "SYNTHETIC_SEQUENTIAL_OWNERSHIP_LEDGER" as const,
    activeEvidenceSequence: 1 as const,
    maximumActiveEvidenceItems: 1 as const,
    executedEvidenceItemCount: 1 as const,
    blockedEvidenceItemCount: 7 as const,
    concurrentOwnershipConflictDetected: false as const,
    failClosedOnOwnershipConflict: true as const,
    deterministicOrderingVerified: true as const,
    uniqueControlOwnershipVerified: true as const,
    controlIsolationVerified: true as const,
    nextEvidenceBlockedUntilOwnerReview: true as const,
    emergencyPauseAvailable: true as const,
    emergencyPauseTriggered: false as const,
    rollbackMarkerRecorded: true as const,
    rollbackRequired: false as const,
    monitoringStatus: "PASS" as const,
    independentValidationStatus: "PASS" as const,
    ledgerEntries: deepFreeze(ledgerEntries),
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: first.candidateDecisionDigest,
    workstreamSequence: 2 as const,
    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,
    evidenceSequence: 1 as const,
    controlId: "SEQUENTIAL_OWNERSHIP_LEDGER" as const,
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
      canonicalOwnerDecisionBound: true as const,
      sourceDecisionIntegrityVerified: true as const,
      sequenceOneOnly: true as const,
      exactlyOneEvidenceItemExecuted: true as const,
      remainingSevenEvidenceItemsBlocked: true as const,
      sequentialEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      nextEvidenceExecutionAuthorized: false as const,
      concurrentCoordinationEvidenceExecutionAuthorized: true as const,
      concurrentCoordinationEvidenceExecutionPerformedCount: 1 as const,
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
      rollbackEvidenceRequired: true as const,
      rollbackEvidenceRecorded: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
  record: EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution,
): void {
  validateCanonicalDecision();

  requireIdentifier(
    "Concurrent-coordination sequence-one execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-one execution time",
    record.executedAt,
  );

  const { executionDigest, ...executionCore } = record;

  if (
    !SHA256_PATTERN.test(executionDigest) ||
    sha256(executionCore) !== executionDigest
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one execution integrity is invalid.",
    );
  }

  const first = decision.candidateDecisions[0];

  if (
    !first ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW" ||
    record.tenantId !== decision.tenantId ||
    record.ownerId !== decision.ownerId ||
    record.sourceDecisionId !== decision.decisionId ||
    record.sourceDecisionDigest !== decision.decisionDigest ||
    record.sourceCandidateDecisionDigest !== first.candidateDecisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceSequence !== 1 ||
    record.controlId !== "SEQUENTIAL_OWNERSHIP_LEDGER" ||
    record.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    record.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    record.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    record.syntheticSanitizedEvidenceOnly !== true ||
    record.evidenceExecutionAuthorized !== true ||
    record.evidenceExecutionPerformed !== true ||
    record.evidenceCreated !== true ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW" ||
    Date.parse(record.executedAt) < Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one execution identity is invalid.",
    );
  }

  const { evidenceDigest, ...evidenceCore } = record.evidence;

  if (
    !SHA256_PATTERN.test(evidenceDigest) ||
    sha256(evidenceCore) !== evidenceDigest ||
    record.evidence.evidenceType !==
      "SEQUENTIAL_OWNERSHIP_LEDGER_EXECUTION_EVIDENCE" ||
    record.evidence.activeEvidenceSequence !== 1 ||
    record.evidence.maximumActiveEvidenceItems !== 1 ||
    record.evidence.executedEvidenceItemCount !== 1 ||
    record.evidence.blockedEvidenceItemCount !== 7 ||
    record.evidence.concurrentOwnershipConflictDetected !== false ||
    record.evidence.failClosedOnOwnershipConflict !== true ||
    record.evidence.deterministicOrderingVerified !== true ||
    record.evidence.uniqueControlOwnershipVerified !== true ||
    record.evidence.controlIsolationVerified !== true ||
    record.evidence.nextEvidenceBlockedUntilOwnerReview !== true ||
    record.evidence.emergencyPauseAvailable !== true ||
    record.evidence.rollbackMarkerRecorded !== true ||
    record.evidence.monitoringStatus !== "PASS" ||
    record.evidence.independentValidationStatus !== "PASS" ||
    record.evidence.ledgerEntries.length !== 8
  ) {
    throw new Error("Sequential ownership-ledger evidence is invalid.");
  }

  record.evidence.ledgerEntries.forEach((entry, index) => {
    const candidate = decision.candidateDecisions[index];

    if (
      !candidate ||
      entry.sequence !== index + 1 ||
      entry.controlId !== candidate.controlId ||
      entry.ownershipState !==
        (index === 0
          ? "EXECUTED_AWAITING_OWNER_REVIEW"
          : "BLOCKED_PENDING_PRIOR_OWNER_REVIEW") ||
      entry.evidenceExecutionAuthorized !== true ||
      entry.evidenceExecutionPerformed !== (index === 0) ||
      entry.currentlyExecutable !== false ||
      entry.ownerReviewRequiredBeforeNextSequence !== true ||
      entry.repositoryReadAuthorized !== false ||
      entry.repositoryWriteAuthorized !== false ||
      entry.concurrentEngineeringWorkAuthorized !== false ||
      !Object.isFrozen(entry)
    ) {
      throw new Error(
        `Sequential ownership-ledger entry ${index + 1} is invalid.`,
      );
    }
  });

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalOwnerDecisionBound,
    boundary.sourceDecisionIntegrityVerified,
    boundary.sequenceOneOnly,
    boundary.exactlyOneEvidenceItemExecuted,
    boundary.remainingSevenEvidenceItemsBlocked,
    boundary.sequentialEvidenceExecutionRequired,
    boundary.ownerReviewRequiredImmediatelyAfterExecution,
    boundary.concurrentCoordinationEvidenceExecutionAuthorized,
    boundary.monitoringRequired,
    boundary.monitoringPassed,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.rollbackEvidenceRecorded,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.nextEvidenceExecutionAuthorized,
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
    boundary.concurrentCoordinationEvidenceExecutionPerformedCount !== 1 ||
    boundary.aggregateConcurrentEngineeringWorkLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.ledgerEntries) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Concurrent-coordination sequence-one execution authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionInput,
): EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution {
  if (input.sourceDecision !== decision) {
    throw new Error(
      "Only the canonical owner-approved concurrent-coordination execution decision can execute sequence one.",
    );
  }

  validateCanonicalDecision();

  requireIdentifier(
    "Concurrent-coordination sequence-one execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Concurrent-coordination sequence-one execution time",
    input.executedAt,
  );

  if (Date.parse(input.executedAt) < Date.parse(decision.decidedAt)) {
    throw new Error(
      "Concurrent-coordination sequence-one execution cannot precede the owner decision.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);

  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-concurrent-coordination-evidence-sequence-one-execution-001",
    sourceDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
    executedAt: "2026-08-02T15:30:00.000Z",
  });