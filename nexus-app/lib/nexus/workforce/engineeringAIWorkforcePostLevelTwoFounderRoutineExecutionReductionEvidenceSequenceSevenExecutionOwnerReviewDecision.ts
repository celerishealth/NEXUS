import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-seven-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceSevenOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceSevenOwnerReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
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

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision: EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceSevenOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION";

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW_RECORDED" as const,
    tenantId: execution.tenantId,
    ownerId,
    sourceExecutionId: execution.executionId,
    sourceExecutionDigest: execution.executionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 7 as const,
    controlId:
      "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY" as const,
    decision,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceSevenOwnerReviewRecorded: true as const,
    sequenceSevenClosed: approved,
    reason,
    reviewedEvidence: {
      evaluatedCycleCount: execution.evidence.evaluatedCycleCount,
      routineCoveragePassedCycleCount:
        execution.evidence.routineCoveragePassedCycleCount,
      qualityThresholdPassedCycleCount:
        execution.evidence.qualityThresholdPassedCycleCount,
      defectContainmentPassedCycleCount:
        execution.evidence.defectContainmentPassedCycleCount,
      recoveryConsistencyPassedCycleCount:
        execution.evidence.recoveryConsistencyPassedCycleCount,
      escalationConsistencyPassedCycleCount:
        execution.evidence.escalationConsistencyPassedCycleCount,
      auditContinuityPassedCycleCount:
        execution.evidence.auditContinuityPassedCycleCount,
      regressionGatePassedCycleCount:
        execution.evidence.regressionGatePassedCycleCount,
      unauthorizedProgressionAllowedCount:
        execution.evidence.unauthorizedProgressionAllowedCount,
      sustainedStabilityVerified:
        execution.evidence.sustainedStabilityVerified,
      actualRoutineTaskExecuted:
        execution.evidence.actualRoutineTaskExecuted,
      actualSustainedOperationPerformed:
        execution.evidence.actualSustainedOperationPerformed,
      founderLiberationClaimed:
        execution.evidence.founderLiberationClaimed,
    },
    authorityBoundary: {
      canonicalExecutionBound: true as const,
      sourceExecutionIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      ownerReviewRecorded: true as const,
      approvalBypassAllowed: false as const,
      sequenceSevenExecutionAccepted: approved,
      sequenceSevenEvidenceAccepted: approved,
      sequenceEightSyntheticEvidenceAuthorized: approved,
      nextEvidenceExecutionAuthorized: approved,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualSustainedOperationAuthorized: false as const,
      actualRegressionOperationAuthorized: false as const,
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
    nextStep: (
      approved
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({ ...core, decisionDigest: sha256(core) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision,
): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
    execution,
  );
  requireIdentifier("Sequence-seven owner-review decision ID", record.decisionId);
  requireTimestamp("Sequence-seven owner-review time", record.decidedAt);

  const expected = buildDecision(
    record.decisionId,
    record.ownerId,
    record.decision,
    record.reason,
    record.decidedAt,
  );
  const approved =
    record.decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION";

  if (
    !DIGEST.test(record.decisionDigest) ||
    record.reason.trim() !== record.reason ||
    record.reason.length < 120 ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceSevenClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt) ||
    record.authorityBoundary.nextEvidenceExecutionAuthorized !== approved ||
    record.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    record.authorityBoundary.actualSustainedOperationAuthorized !== false ||
    record.authorityBoundary.repositoryReadAuthorized !== false ||
    record.authorityBoundary.productionDeploymentAuthorized !== false ||
    record.authorityBoundary.publicLaunchAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error("Sequence-seven owner-review decision is invalid.");
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical sequence-seven execution can receive owner review.",
    );
  }

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
    execution,
  );
  requireIdentifier("Sequence-seven owner-review decision ID", input.decisionId);
  requireTimestamp("Sequence-seven owner-review time", input.decidedAt);

  if (input.ownerId !== execution.ownerId) {
    throw new Error("Owner identity is invalid.");
  }
  if (input.reason.trim() !== input.reason || input.reason.length < 120) {
    throw new Error("Owner-review reason is invalid.");
  }
  if (
    !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Sequence-seven owner-review decision is invalid.");
  }
  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error("Owner review cannot precede sequence-seven execution.");
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    input.reason,
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
    record,
  );
  return record;
}