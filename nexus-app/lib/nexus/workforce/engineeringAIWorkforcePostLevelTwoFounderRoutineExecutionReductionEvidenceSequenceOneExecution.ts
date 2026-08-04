import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-one-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionInput {
  readonly executionId: string;
  readonly sourceDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;
  readonly executedAt: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
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
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;

function validateCanonicalDecision(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );

  const first = decision.candidateDecisions[0];

  if (
    !first ||
    decision.evidenceExecutionDecisionCount !== 8 ||
    decision.candidateDecisions.length !== 8 ||
    decision.summary.approvedEvidenceExecutionCount !== 8 ||
    decision.summary.evidenceExecutionPerformedCount !== 0 ||
    decision.summary.currentlyExecutableCount !== 1 ||
    decision.summary.waitingForPriorEvidenceOwnerReviewCount !== 7 ||
    decision.summary.maximumEvidenceExecutionCount !== 1 ||
    decision.summary.aggregateConcurrentExecutionLimit !== 0 ||
    decision.authorityBoundary.oneAtATimeEvidenceExecutionRequired !== true ||
    decision.authorityBoundary.currentlyExecutableEvidenceCount !== 1 ||
    decision.authorityBoundary.syntheticRoutineExecutionReductionEvidenceAuthorized !==
      true ||
    decision.authorityBoundary.founderRoutineExecutionReductionExecutionAuthorized !==
      false ||
    decision.authorityBoundary.repositoryReadAuthorized !== false ||
    decision.authorityBoundary.repositoryWriteAuthorized !== false ||
    decision.authorityBoundary.productionDeploymentAuthorized !== false ||
    decision.authorityBoundary.founderLiberationAchieved !== false ||
    decision.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE" ||
    first.sequence !== 1 ||
    first.controlId !== "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE" ||
    first.evidenceExecutionAuthorized !== true ||
    first.evidenceExecutionPerformed !== false ||
    first.currentlyExecutable !== true ||
    first.waitingForPriorEvidenceOwnerReview !== false
  ) {
    throw new Error(
      "Canonical sequence-one founder routine execution reduction decision is invalid.",
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
      "Later founder routine execution reduction evidence sequences must remain blocked.",
    );
  }
}

const coverageMatrix = deepFreeze([
  {
    categoryId: "BOUNDED_IMPLEMENTATION_PREPARATION",
    classification: "REPEATABLE_ROUTINE_WORK",
    coverageState: "SYNTHETICALLY_COVERED",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
  {
    categoryId: "TARGETED_TEST_PREPARATION",
    classification: "REPEATABLE_ROUTINE_WORK",
    coverageState: "SYNTHETICALLY_COVERED",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
  {
    categoryId: "STATIC_VERIFICATION_PREPARATION",
    classification: "REPEATABLE_ROUTINE_WORK",
    coverageState: "SYNTHETICALLY_COVERED",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
  {
    categoryId: "BOUNDED_DIFF_EVIDENCE_PACKAGING",
    classification: "REPEATABLE_ROUTINE_WORK",
    coverageState: "SYNTHETICALLY_COVERED",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
  {
    categoryId: "FAILURE_RECOVERY_ESCALATION",
    classification: "EXCEPTION_HANDLING",
    coverageState: "OWNER_REVIEW_REQUIRED",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
  {
    categoryId: "NOVEL_OR_AMBIGUOUS_ENGINEERING_REQUEST",
    classification: "UNCOVERED_WORK",
    coverageState: "FAIL_CLOSED_ESCALATION",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
  {
    categoryId: "FOUNDER_RESERVED_DECISION_AND_APPROVAL",
    classification: "OWNER_RESERVED_AUTHORITY",
    coverageState: "BLOCKED_FROM_DELEGATION",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
  {
    categoryId: "PRODUCTION_EXTERNAL_FINANCIAL_OR_PUBLIC_ACTION",
    classification: "PROHIBITED_ACTION",
    coverageState: "BLOCKED",
    ownerReviewRequired: true,
    actualExecutionAuthorized: false,
  },
] as const);

function buildExecution(executionId: string, executedAt: string) {
  const first = decision.candidateDecisions[0];
  if (!first) throw new Error("Sequence-one decision candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) => ({
      sequence: candidate.sequence,
      controlId: candidate.controlId,
      executionState:
        index === 0
          ? ("EXECUTED_AWAITING_OWNER_REVIEW" as const)
          : ("BLOCKED_PENDING_PRIOR_OWNER_REVIEW" as const),
      evidenceExecutionPerformed: index === 0,
      nextSequenceExecutionAuthorized: false as const,
    })),
  );

  const evidenceCore = {
    evidenceType: "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_ROUTINE_WORK_INVENTORY_AND_COVERAGE_MATRIX" as const,
    activeEvidenceSequence: 1 as const,
    executedEvidenceItemCount: 1 as const,
    blockedEvidenceItemCount: 7 as const,
    routineCategoryCount: 8 as const,
    repeatableRoutineCategoryCount: 4 as const,
    syntheticallyCoveredRepeatableCategoryCount: 4 as const,
    exceptionHandlingCategoryCount: 1 as const,
    uncoveredCategoryCount: 1 as const,
    ownerReservedCategoryCount: 1 as const,
    prohibitedCategoryCount: 1 as const,
    syntheticRepeatableCoveragePercent: 100 as const,
    actualRoutineTaskExecuted: false as const,
    founderTimeReductionMeasured: false as const,
    founderRoutineExecutionReductionClaimed: false as const,
    deterministicCoverageVerified: true as const,
    independentValidationRequired: true as const,
    ownerReviewRequired: true as const,
    monitoringRequired: true as const,
    emergencyPauseAvailable: true as const,
    rollbackEvidenceRequired: true as const,
    coverageMatrix,
    sequenceLedger,
  };

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceDecisionId: decision.decisionId,
    sourceDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: first.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 1 as const,
    controlId: "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE" as const,
    evidenceClass: "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" as const,
    executionMode:
      "SYNTHETIC_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ONLY" as const,
    evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY" as const,
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
      oneAtATimeEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      nextEvidenceExecutionAuthorized: false as const,
      syntheticRoutineExecutionReductionEvidenceAuthorized: true as const,
      syntheticRoutineExecutionReductionEvidencePerformedCount: 1 as const,
      taskExecutionAuthorized: false as const,
      founderRoutineExecutionReductionExecutionAuthorized: false as const,
      founderRoutineExecutionReductionClaimAuthorized: false as const,
      founderRoutineExecutionReductionClaimed: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAssessmentAuthorized: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineExecution: false as const,
      monitoringRequired: true as const,
      emergencyPauseAvailable: true as const,
      rollbackEvidenceRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest: sha256(executionCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution,
): void {
  validateCanonicalDecision();
  requireIdentifier(
    "Founder Routine Execution Reduction sequence-one execution ID",
    record.executionId,
  );
  requireTimestamp(
    "Founder Routine Execution Reduction sequence-one execution time",
    record.executedAt,
  );

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !SHA256_PATTERN.test(record.executionDigest) ||
    !SHA256_PATTERN.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.workstreamSequence !== 4 ||
    record.controlId !== "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE" ||
    record.evidence.routineCategoryCount !== 8 ||
    record.evidence.repeatableRoutineCategoryCount !== 4 ||
    record.evidence.syntheticRepeatableCoveragePercent !== 100 ||
    record.evidence.actualRoutineTaskExecuted !== false ||
    record.evidence.founderTimeReductionMeasured !== false ||
    record.evidence.founderRoutineExecutionReductionClaimed !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.taskExecutionAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.coverageMatrix) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction sequence-one execution is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution {
  if (input.sourceDecision !== decision) {
    throw new Error(
      "Only the canonical owner-approved founder routine execution reduction decision can execute sequence one.",
    );
  }

  validateCanonicalDecision();
  requireIdentifier(
    "Founder Routine Execution Reduction sequence-one execution ID",
    input.executionId,
  );
  requireTimestamp(
    "Founder Routine Execution Reduction sequence-one execution time",
    input.executedAt,
  );

  if (Date.parse(input.executedAt) < Date.parse(decision.decidedAt)) {
    throw new Error(
      "Founder Routine Execution Reduction sequence-one execution cannot precede the owner decision.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-one-execution-001",
    sourceDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
    executedAt: "2026-08-04T06:31:00.000Z",
  });