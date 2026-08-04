import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-six-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;
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
  if (value.trim() !== value || !ID.test(value)) throw new Error(`${label} is invalid.`);
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
const sequenceFiveOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
    sequenceFiveOwnerReview,
  );

  const sixth = decision.candidateDecisions[5];

  if (
    !sixth ||
    sequenceFiveOwnerReview.executionAccepted !== true ||
    sequenceFiveOwnerReview.evidenceAccepted !== true ||
    sequenceFiveOwnerReview.sequenceFiveClosed !== true ||
    sequenceFiveOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX" ||
    sequenceFiveOwnerReview.authorityBoundary.nextEvidenceExecutionAuthorized !== true ||
    sequenceFiveOwnerReview.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    sequenceFiveOwnerReview.authorityBoundary.founderLiberationAchieved !== false ||
    sixth.sequence !== 6 ||
    sixth.controlId !== "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT" ||
    sixth.evidenceExecutionAuthorized !== true ||
    sixth.evidenceExecutionPerformed !== false ||
    sixth.currentlyExecutable !== false ||
    sixth.waitingForPriorEvidenceOwnerReview !== true
  ) {
    throw new Error(
      "Canonical founder routine execution reduction sequence-six prerequisites are invalid.",
    );
  }
}

const measurementPlan = deepFreeze({
  boundedWorkloadUnitCount: 20,
  baselineFounderTouchpointCount: 20,
  modeledFounderTouchpointCount: 8,
  baselineInterventionMinutes: 240,
  modeledInterventionMinutes: 90,
  baselineReviewMinutes: 180,
  modeledReviewMinutes: 120,
  baselineCorrectionMinutes: 120,
  modeledCorrectionMinutes: 45,
  baselineRoutineExecutionMinutes: 600,
  modeledRoutineExecutionMinutes: 300,
  baselineEscalationCount: 4,
  modeledEscalationCount: 4,
  baselineRetainedDecisionCount: 8,
  modeledRetainedDecisionCount: 8,
  modeledTouchpointReductionPercent: 60,
  modeledInterventionReductionPercent: 62.5,
  modeledCorrectionReductionPercent: 62.5,
  actualFounderMinutesMeasured: false,
  actualFounderTimeReduced: false,
  founderLiberationInferredFromReducedActivity: false,
} as const);

function buildExecution(executionId: string, executedAt: string) {
  const sixth = decision.candidateDecisions[5];
  if (!sixth) throw new Error("Sequence-six decision candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) => ({
      sequence: candidate.sequence,
      controlId: candidate.controlId,
      executionState:
        index < 6
          ? ("EXECUTED_OR_OWNER_REVIEWED" as const)
          : ("BLOCKED_PENDING_PRIOR_OWNER_REVIEW" as const),
      evidenceExecutionPerformed: index < 6,
      nextSequenceExecutionAuthorized: false as const,
    })),
  );

  const evidenceCore = {
    evidenceType:
      "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_DETERMINISTIC_BEFORE_AND_AFTER_MEASUREMENT_PLAN" as const,
    boundedWorkloadUnitCount: 20 as const,
    baselineFounderTouchpointCount: 20 as const,
    modeledFounderTouchpointCount: 8 as const,
    baselineInterventionMinutes: 240 as const,
    modeledInterventionMinutes: 90 as const,
    baselineReviewMinutes: 180 as const,
    modeledReviewMinutes: 120 as const,
    baselineCorrectionMinutes: 120 as const,
    modeledCorrectionMinutes: 45 as const,
    baselineRoutineExecutionMinutes: 600 as const,
    modeledRoutineExecutionMinutes: 300 as const,
    baselineEscalationCount: 4 as const,
    modeledEscalationCount: 4 as const,
    baselineRetainedDecisionCount: 8 as const,
    modeledRetainedDecisionCount: 8 as const,
    modeledTouchpointReductionPercent: 60 as const,
    modeledInterventionReductionPercent: 62.5 as const,
    modeledCorrectionReductionPercent: 62.5 as const,
    retainedOwnerDecisionLoadPreserved: true as const,
    escalationLoadNotHidden: true as const,
    reducedActivityNotLiberationProof: true as const,
    actualFounderMinutesMeasured: false as const,
    actualFounderTimeReduced: false as const,
    actualRoutineTaskExecuted: false as const,
    founderRoutineExecutionReductionClaimed: false as const,
    founderLiberationClaimed: false as const,
    deterministicMeasurementPlanVerified: true as const,
    measurementPlan,
    sequenceLedger,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId: sequenceFiveOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceFiveOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: sixth.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 6 as const,
    controlId: "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT" as const,
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
      canonicalSequenceFiveOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceSixOnly: true as const,
      exactlySixEvidenceItemsExecutedInWorkstream: true as const,
      remainingTwoEvidenceItemsBlocked: true as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceSevenEvidenceExecutionAuthorized: false as const,
      nextEvidenceExecutionAuthorized: false as const,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualFounderTimeMeasurementAuthorized: false as const,
      actualFounderTimeReductionClaimAuthorized: false as const,
      reducedActivityLiberationInferenceAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest: sha256(core),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution,
): void {
  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-six execution ID", record.executionId);
  requireTimestamp("Sequence-six execution time", record.executedAt);

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !DIGEST.test(record.executionDigest) ||
    !DIGEST.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.workstreamSequence !== 4 ||
    record.evidenceSequence !== 6 ||
    record.controlId !== "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT" ||
    record.evidence.boundedWorkloadUnitCount !== 20 ||
    record.evidence.modeledTouchpointReductionPercent !== 60 ||
    record.evidence.modeledInterventionReductionPercent !== 62.5 ||
    record.evidence.modeledCorrectionReductionPercent !== 62.5 ||
    record.evidence.retainedOwnerDecisionLoadPreserved !== true ||
    record.evidence.escalationLoadNotHidden !== true ||
    record.evidence.reducedActivityNotLiberationProof !== true ||
    record.evidence.actualFounderMinutesMeasured !== false ||
    record.evidence.actualFounderTimeReduced !== false ||
    record.evidence.actualRoutineTaskExecuted !== false ||
    record.evidence.founderRoutineExecutionReductionClaimed !== false ||
    record.evidence.founderLiberationClaimed !== false ||
    boundary.sequenceSevenEvidenceExecutionAuthorized !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.actualRoutineTaskExecutionAuthorized !== false ||
    boundary.actualFounderTimeMeasurementAuthorized !== false ||
    boundary.actualFounderTimeReductionClaimAuthorized !== false ||
    boundary.reducedActivityLiberationInferenceAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.measurementPlan) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-six execution is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution {
  if (input.sourceOwnerReview !== sequenceFiveOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-five owner review can authorize sequence six.",
    );
  }

  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-six execution ID", input.executionId);
  requireTimestamp("Sequence-six execution time", input.executedAt);

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceFiveOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Sequence-six execution cannot precede sequence-five owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-six-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-04T10:17:50.812Z",
  });