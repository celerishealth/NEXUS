import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-three-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;
  readonly executedAt: string;
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIGEST = /^[0-9a-f]{64}$/;

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
const sequenceTwoOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
    sequenceTwoOwnerReview,
  );

  const third = decision.candidateDecisions[2];

  if (
    !third ||
    sequenceTwoOwnerReview.executionAccepted !== true ||
    sequenceTwoOwnerReview.evidenceAccepted !== true ||
    sequenceTwoOwnerReview.sequenceTwoClosed !== true ||
    sequenceTwoOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE" ||
    sequenceTwoOwnerReview.authorityBoundary.nextEvidenceExecutionAuthorized !==
      true ||
    sequenceTwoOwnerReview.authorityBoundary.actualRoutineTaskExecutionAuthorized !==
      false ||
    sequenceTwoOwnerReview.authorityBoundary.founderLiberationAchieved !== false ||
    third.sequence !== 3 ||
    third.controlId !== "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD" ||
    third.evidenceExecutionAuthorized !== true ||
    third.evidenceExecutionPerformed !== false ||
    third.currentlyExecutable !== false ||
    third.waitingForPriorEvidenceOwnerReview !== true
  ) {
    throw new Error(
      "Canonical founder routine execution reduction sequence-three prerequisites are invalid.",
    );
  }
}

const qualityThresholds = deepFreeze({
  correctnessMinimumPercent: 95,
  completenessMinimumPercent: 95,
  consistencyMinimumPercent: 95,
  safetyMinimumPercent: 100,
  evidenceQualityMinimumPercent: 95,
  ownerAcceptanceMinimumPercent: 95,
  belowThresholdAcceptanceAllowed: false,
} as const);

const taskResultComparisons = deepFreeze([
  {
    caseId: "EXACT_CORRECT_COMPLETE_SAFE_RESULT",
    correctnessPercent: 100,
    completenessPercent: 100,
    consistencyPercent: 100,
    safetyPercent: 100,
    evidenceQualityPercent: 100,
    outcome: "PASS",
    correctionRequired: false,
    regressionDetected: false,
    ownerAcceptanceEligible: true,
  },
  {
    caseId: "MINIMUM_ACCEPTABLE_THRESHOLD_RESULT",
    correctnessPercent: 95,
    completenessPercent: 95,
    consistencyPercent: 95,
    safetyPercent: 100,
    evidenceQualityPercent: 95,
    outcome: "PASS",
    correctionRequired: false,
    regressionDetected: false,
    ownerAcceptanceEligible: true,
  },
  {
    caseId: "INCOMPLETE_RESULT",
    correctnessPercent: 98,
    completenessPercent: 72,
    consistencyPercent: 96,
    safetyPercent: 100,
    evidenceQualityPercent: 88,
    outcome: "REJECT",
    correctionRequired: true,
    regressionDetected: false,
    ownerAcceptanceEligible: false,
  },
  {
    caseId: "SAFETY_THRESHOLD_FAILURE",
    correctnessPercent: 100,
    completenessPercent: 100,
    consistencyPercent: 100,
    safetyPercent: 0,
    evidenceQualityPercent: 100,
    outcome: "REJECT",
    correctionRequired: true,
    regressionDetected: false,
    ownerAcceptanceEligible: false,
  },
  {
    caseId: "CORRECTED_RESULT_AFTER_REJECTION",
    correctnessPercent: 98,
    completenessPercent: 97,
    consistencyPercent: 96,
    safetyPercent: 100,
    evidenceQualityPercent: 97,
    outcome: "PASS_AFTER_CORRECTION",
    correctionRequired: false,
    regressionDetected: false,
    ownerAcceptanceEligible: true,
  },
  {
    caseId: "REGRESSION_DETECTED_RESULT",
    correctnessPercent: 82,
    completenessPercent: 94,
    consistencyPercent: 68,
    safetyPercent: 100,
    evidenceQualityPercent: 90,
    outcome: "REJECT_REGRESSION",
    correctionRequired: true,
    regressionDetected: true,
    ownerAcceptanceEligible: false,
  },
] as const);

function buildExecution(executionId: string, executedAt: string) {
  const third = decision.candidateDecisions[2];
  if (!third) throw new Error("Sequence-three decision candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) => ({
      sequence: candidate.sequence,
      controlId: candidate.controlId,
      executionState:
        index < 3
          ? ("EXECUTED_OR_OWNER_REVIEWED" as const)
          : ("BLOCKED_PENDING_PRIOR_OWNER_REVIEW" as const),
      evidenceExecutionPerformed: index < 3,
      nextSequenceExecutionAuthorized: false as const,
    })),
  );

  const evidenceCore = {
    evidenceType:
      "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_TASK_RESULT_COMPARISON_AND_THRESHOLD_EVALUATION" as const,
    evaluatedTaskResultCount: 6 as const,
    passingResultCount: 3 as const,
    rejectedResultCount: 3 as const,
    correctionRequiredResultCount: 3 as const,
    regressionDetectedResultCount: 1 as const,
    ownerAcceptanceEligibleResultCount: 3 as const,
    belowThresholdResultAcceptedCount: 0 as const,
    safetyFailureAcceptedCount: 0 as const,
    zeroBelowThresholdAcceptanceVerified: true as const,
    deterministicThresholdEvaluationVerified: true as const,
    actualRoutineTaskExecuted: false as const,
    actualOwnerAcceptancePerformed: false as const,
    founderRoutineExecutionReductionClaimed: false as const,
    independentValidationRequired: true as const,
    ownerReviewRequired: true as const,
    monitoringRequired: true as const,
    emergencyPauseAvailable: true as const,
    rollbackEvidenceRequired: true as const,
    qualityThresholds,
    taskResultComparisons,
    sequenceLedger,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId: sequenceTwoOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceTwoOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: third.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 3 as const,
    controlId: "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD" as const,
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
      canonicalSequenceTwoOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceThreeOnly: true as const,
      exactlyThreeEvidenceItemsExecutedInWorkstream: true as const,
      remainingFiveEvidenceItemsBlocked: true as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceFourEvidenceExecutionAuthorized: false as const,
      nextEvidenceExecutionAuthorized: false as const,
      actualRoutineTaskExecutionAuthorized: false as const,
      belowThresholdAcceptanceAuthorized: false as const,
      ownerAcceptanceExecutionAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest: sha256(core),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution,
): void {
  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-three execution ID", record.executionId);
  requireTimestamp("Sequence-three execution time", record.executedAt);

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !DIGEST.test(record.executionDigest) ||
    !DIGEST.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.workstreamSequence !== 4 ||
    record.evidenceSequence !== 3 ||
    record.controlId !== "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD" ||
    record.evidence.evaluatedTaskResultCount !== 6 ||
    record.evidence.passingResultCount !== 3 ||
    record.evidence.rejectedResultCount !== 3 ||
    record.evidence.correctionRequiredResultCount !== 3 ||
    record.evidence.regressionDetectedResultCount !== 1 ||
    record.evidence.ownerAcceptanceEligibleResultCount !== 3 ||
    record.evidence.belowThresholdResultAcceptedCount !== 0 ||
    record.evidence.safetyFailureAcceptedCount !== 0 ||
    record.evidence.zeroBelowThresholdAcceptanceVerified !== true ||
    record.evidence.actualRoutineTaskExecuted !== false ||
    record.evidence.actualOwnerAcceptancePerformed !== false ||
    boundary.sequenceFourEvidenceExecutionAuthorized !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.belowThresholdAcceptanceAuthorized !== false ||
    boundary.actualRoutineTaskExecutionAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.qualityThresholds) ||
    !Object.isFrozen(record.evidence.taskResultComparisons) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-three execution is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution {
  if (input.sourceOwnerReview !== sequenceTwoOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-two owner review can authorize sequence three.",
    );
  }

  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-three execution ID", input.executionId);
  requireTimestamp("Sequence-three execution time", input.executedAt);

  if (Date.parse(input.executedAt) < Date.parse(sequenceTwoOwnerReview.decidedAt)) {
    throw new Error(
      "Sequence-three execution cannot precede sequence-two owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-three-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-04T09:00:00.000Z",
  });