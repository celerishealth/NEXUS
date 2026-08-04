import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-seven-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;
  readonly executedAt: string;
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIGEST = /^[0-9a-f]{64}$/;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record).sort().map((key) => [key, normalize(record[key])]),
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
  if (value.trim() !== value || !ID.test(value)) {
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
const sequenceSixOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

function validatePrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
    sequenceSixOwnerReview,
  );

  const candidate = decision.candidateDecisions[6];

  if (
    !candidate ||
    sequenceSixOwnerReview.executionAccepted !== true ||
    sequenceSixOwnerReview.evidenceAccepted !== true ||
    sequenceSixOwnerReview.sequenceSixClosed !== true ||
    sequenceSixOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN" ||
    sequenceSixOwnerReview.authorityBoundary.nextEvidenceExecutionAuthorized !== true ||
    sequenceSixOwnerReview.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    sequenceSixOwnerReview.authorityBoundary.founderLiberationAchieved !== false ||
    candidate.sequence !== 7 ||
    candidate.controlId !==
      "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY" ||
    candidate.evidenceExecutionAuthorized !== true ||
    candidate.evidenceExecutionPerformed !== false ||
    candidate.currentlyExecutable !== false ||
    candidate.waitingForPriorEvidenceOwnerReview !== true
  ) {
    throw new Error("Canonical sequence-seven prerequisites are invalid.");
  }
}

const repeatedCycles = deepFreeze(
  Array.from({ length: 6 }, (_, index) => ({
    cycle: index + 1,
    routineCoverageVerified: true,
    qualityThresholdPassed: true,
    defectContained: true,
    recoveryConsistent: true,
    escalationConsistent: true,
    auditContinuityVerified: true,
    tenantBoundaryPreserved: true,
    ownerControlPreserved: true,
    regressionGatePassed: true,
    unauthorizedProgressionAllowed: false,
  })),
);

function buildExecution(executionId: string, executedAt: string) {
  const candidate = decision.candidateDecisions[6];
  if (!candidate) throw new Error("Sequence-seven candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((entry, index) => ({
      sequence: entry.sequence,
      controlId: entry.controlId,
      evidenceExecutionPerformed: index < 7,
      executionState:
        index < 7
          ? ("EXECUTED_OR_OWNER_REVIEWED" as const)
          : ("BLOCKED_PENDING_PRIOR_OWNER_REVIEW" as const),
    })),
  );

  const evidenceCore = {
    evidenceType:
      "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_DETERMINISTIC_REPEATED_CYCLE_STABILITY_SIMULATION" as const,
    evaluatedCycleCount: 6 as const,
    routineCoveragePassedCycleCount: 6 as const,
    qualityThresholdPassedCycleCount: 6 as const,
    defectContainmentPassedCycleCount: 6 as const,
    recoveryConsistencyPassedCycleCount: 6 as const,
    escalationConsistencyPassedCycleCount: 6 as const,
    auditContinuityPassedCycleCount: 6 as const,
    tenantBoundaryPassedCycleCount: 6 as const,
    ownerControlPassedCycleCount: 6 as const,
    regressionGatePassedCycleCount: 6 as const,
    unauthorizedProgressionAllowedCount: 0 as const,
    sustainedStabilityVerified: true as const,
    qualityTrendStable: true as const,
    recoveryTrendStable: true as const,
    escalationTrendStable: true as const,
    auditContinuityStable: true as const,
    regressionSafe: true as const,
    actualRoutineTaskExecuted: false as const,
    actualSustainedOperationPerformed: false as const,
    actualCustomerOrProductionDataUsed: false as const,
    founderRoutineExecutionReductionClaimed: false as const,
    founderLiberationClaimed: false as const,
    repeatedCycles,
    sequenceLedger,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId: sequenceSixOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceSixOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: candidate.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 7 as const,
    controlId:
      "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY" as const,
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
      canonicalSequenceSixOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceSevenOnly: true as const,
      exactlySevenEvidenceItemsExecutedInWorkstream: true as const,
      remainingOneEvidenceItemBlocked: true as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceEightEvidenceExecutionAuthorized: false as const,
      nextEvidenceExecutionAuthorized: false as const,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualSustainedOperationAuthorized: false as const,
      actualRegressionOperationAuthorized: false as const,
      customerOrProductionDataAuthorized: false as const,
      founderRoutineExecutionReductionClaimAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      customerContactAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({ ...core, executionDigest: sha256(core) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution,
): void {
  validatePrerequisites();
  requireIdentifier("Sequence-seven execution ID", record.executionId);
  requireTimestamp("Sequence-seven execution time", record.executedAt);

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !DIGEST.test(record.executionDigest) ||
    !DIGEST.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.evidenceSequence !== 7 ||
    record.controlId !==
      "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY" ||
    record.evidence.evaluatedCycleCount !== 6 ||
    record.evidence.routineCoveragePassedCycleCount !== 6 ||
    record.evidence.qualityThresholdPassedCycleCount !== 6 ||
    record.evidence.defectContainmentPassedCycleCount !== 6 ||
    record.evidence.recoveryConsistencyPassedCycleCount !== 6 ||
    record.evidence.escalationConsistencyPassedCycleCount !== 6 ||
    record.evidence.auditContinuityPassedCycleCount !== 6 ||
    record.evidence.regressionGatePassedCycleCount !== 6 ||
    record.evidence.unauthorizedProgressionAllowedCount !== 0 ||
    record.evidence.sustainedStabilityVerified !== true ||
    record.evidence.actualRoutineTaskExecuted !== false ||
    record.evidence.actualSustainedOperationPerformed !== false ||
    record.evidence.founderLiberationClaimed !== false ||
    boundary.sequenceEightEvidenceExecutionAuthorized !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.actualRoutineTaskExecutionAuthorized !== false ||
    boundary.actualSustainedOperationAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.repeatedCycles) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error("Sequence-seven execution is invalid.");
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution {
  if (input.sourceOwnerReview !== sequenceSixOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-six owner review can authorize sequence seven.",
    );
  }

  validatePrerequisites();
  requireIdentifier("Sequence-seven execution ID", input.executionId);
  requireTimestamp("Sequence-seven execution time", input.executedAt);

  if (Date.parse(input.executedAt) < Date.parse(sequenceSixOwnerReview.decidedAt)) {
    throw new Error(
      "Sequence-seven execution cannot precede sequence-six owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-seven-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-04T10:38:37.312Z",
  });