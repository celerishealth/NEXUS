import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-eight-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;
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
const sequenceSevenOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;

function validatePrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
    sequenceSevenOwnerReview,
  );

  const candidate = decision.candidateDecisions[7];

  if (
    !candidate ||
    sequenceSevenOwnerReview.executionAccepted !== true ||
    sequenceSevenOwnerReview.evidenceAccepted !== true ||
    sequenceSevenOwnerReview.sequenceSevenClosed !== true ||
    sequenceSevenOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT" ||
    sequenceSevenOwnerReview.authorityBoundary.nextEvidenceExecutionAuthorized !== true ||
    sequenceSevenOwnerReview.authorityBoundary.founderLiberationAchieved !== false ||
    candidate.sequence !== 8 ||
    candidate.controlId !==
      "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE" ||
    candidate.evidenceExecutionAuthorized !== true ||
    candidate.evidenceExecutionPerformed !== false ||
    candidate.currentlyExecutable !== false ||
    candidate.waitingForPriorEvidenceOwnerReview !== true
  ) {
    throw new Error("Canonical sequence-eight prerequisites are invalid.");
  }
}

const evidenceSummary = deepFreeze([
  { sequence: 1, controlId: "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE", syntheticEvidencePresent: true },
  { sequence: 2, controlId: "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY", syntheticEvidencePresent: true },
  { sequence: 3, controlId: "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD", syntheticEvidencePresent: true },
  { sequence: 4, controlId: "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS", syntheticEvidencePresent: true },
  { sequence: 5, controlId: "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY", syntheticEvidencePresent: true },
  { sequence: 6, controlId: "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT", syntheticEvidencePresent: true },
  { sequence: 7, controlId: "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY", syntheticEvidencePresent: true },
  { sequence: 8, controlId: "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE", syntheticEvidencePresent: true },
] as const);

function buildExecution(executionId: string, executedAt: string) {
  const candidate = decision.candidateDecisions[7];
  if (!candidate) throw new Error("Sequence-eight candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((entry) => ({
      sequence: entry.sequence,
      controlId: entry.controlId,
      evidenceExecutionPerformed: true as const,
      executionState: "EXECUTED_OR_OWNER_REVIEWED" as const,
    })),
  );

  const evidenceCore = {
    evidenceType:
      "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_DETERMINISTIC_FINAL_EVIDENCE_SUMMARY" as const,
    requiredControlCount: 8 as const,
    syntheticEvidencePresentCount: 8 as const,
    coverageEvidencePresent: true as const,
    reservedAuthorityEvidencePresent: true as const,
    qualityEvidencePresent: true as const,
    recoveryEvidencePresent: true as const,
    escalationEvidencePresent: true as const,
    measurementEvidencePresent: true as const,
    sustainedStabilityEvidencePresent: true as const,
    finalOwnerAcceptanceGatePresent: true as const,
    allRequiredSyntheticEvidencePresent: true as const,
    ownerAcceptancePending: true as const,
    formalWorkstreamClosurePending: true as const,
    separateFounderLiberationAssessmentRequired: true as const,
    founderLiberationMayNotBeInferred: true as const,
    actualRoutineTaskExecuted: false as const,
    actualFounderTimeReductionMeasured: false as const,
    actualFounderTimeReductionVerified: false as const,
    actualProductionOperationPerformed: false as const,
    actualCustomerWorkPerformed: false as const,
    levelThreeAuthorityGranted: false as const,
    founderLiberationAssessmentPerformed: false as const,
    founderLiberationAchieved: false as const,
    founderReleasedFromRoutineExecution: false as const,
    evidenceSummary,
    sequenceLedger,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId: sequenceSevenOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceSevenOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: candidate.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 8 as const,
    controlId:
      "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE" as const,
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
      canonicalSequenceSevenOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceEightOnly: true as const,
      exactlyEightEvidenceItemsExecutedInWorkstream: true as const,
      remainingEvidenceItemCount: 0 as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      workstreamClosureAuthorized: false as const,
      nextEvidenceExecutionAuthorized: false as const,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualFounderTimeMeasurementAuthorized: false as const,
      actualFounderTimeReductionClaimAuthorized: false as const,
      formalFounderLiberationAssessmentAuthorized: false as const,
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
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({ ...core, executionDigest: sha256(core) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution,
): void {
  validatePrerequisites();
  requireIdentifier("Sequence-eight execution ID", record.executionId);
  requireTimestamp("Sequence-eight execution time", record.executedAt);

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !DIGEST.test(record.executionDigest) ||
    !DIGEST.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.evidenceSequence !== 8 ||
    record.controlId !==
      "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE" ||
    record.evidence.requiredControlCount !== 8 ||
    record.evidence.syntheticEvidencePresentCount !== 8 ||
    record.evidence.allRequiredSyntheticEvidencePresent !== true ||
    record.evidence.ownerAcceptancePending !== true ||
    record.evidence.formalWorkstreamClosurePending !== true ||
    record.evidence.separateFounderLiberationAssessmentRequired !== true ||
    record.evidence.founderLiberationMayNotBeInferred !== true ||
    record.evidence.actualRoutineTaskExecuted !== false ||
    record.evidence.actualFounderTimeReductionMeasured !== false ||
    record.evidence.actualFounderTimeReductionVerified !== false ||
    record.evidence.actualProductionOperationPerformed !== false ||
    record.evidence.levelThreeAuthorityGranted !== false ||
    record.evidence.founderLiberationAssessmentPerformed !== false ||
    record.evidence.founderLiberationAchieved !== false ||
    boundary.workstreamClosureAuthorized !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.actualRoutineTaskExecutionAuthorized !== false ||
    boundary.formalFounderLiberationAssessmentAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.evidenceSummary) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error("Sequence-eight execution is invalid.");
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution {
  if (input.sourceOwnerReview !== sequenceSevenOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-seven owner review can authorize sequence eight.",
    );
  }

  validatePrerequisites();
  requireIdentifier("Sequence-eight execution ID", input.executionId);
  requireTimestamp("Sequence-eight execution time", input.executedAt);

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceSevenOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Sequence-eight execution cannot precede sequence-seven owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-eight-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-04T11:02:12.506Z",
  });