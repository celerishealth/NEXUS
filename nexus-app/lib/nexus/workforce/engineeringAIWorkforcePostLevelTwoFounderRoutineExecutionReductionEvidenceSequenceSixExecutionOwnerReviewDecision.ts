import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-six-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceSixOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceSixOwnerReviewDecisionType;
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

function requireReason(value: string): void {
  if (value.trim() !== value || value.length < 120) {
    throw new Error("Owner-review reason is invalid.");
  }
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
    execution,
  );

  if (
    execution.evidenceSequence !== 6 ||
    execution.controlId !== "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT" ||
    execution.evidence.boundedWorkloadUnitCount !== 20 ||
    execution.evidence.modeledTouchpointReductionPercent !== 60 ||
    execution.evidence.modeledInterventionReductionPercent !== 62.5 ||
    execution.evidence.modeledCorrectionReductionPercent !== 62.5 ||
    execution.evidence.actualFounderMinutesMeasured !== false ||
    execution.evidence.actualFounderTimeReduced !== false ||
    execution.evidence.founderLiberationClaimed !== false ||
    execution.authorityBoundary.nextEvidenceExecutionAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false
  ) {
    throw new Error("Canonical sequence-six execution is invalid.");
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision: EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceSixOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION";

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW_RECORDED" as const,
    tenantId: execution.tenantId,
    ownerId,
    sourceExecutionId: execution.executionId,
    sourceExecutionDigest: execution.executionDigest,
    sourceOwnerReviewDecisionId: execution.sourceOwnerReviewDecisionId,
    sourceOwnerReviewDecisionDigest: execution.sourceOwnerReviewDecisionDigest,
    sourceExecutionDecisionId: execution.sourceExecutionDecisionId,
    sourceExecutionDecisionDigest: execution.sourceExecutionDecisionDigest,
    sourceCandidateDecisionDigest: execution.sourceCandidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 6 as const,
    controlId: "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT" as const,
    decision,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceSixOwnerReviewRecorded: true as const,
    sequenceSixClosed: approved,
    reason,
    reviewedEvidence: {
      boundedWorkloadUnitCount: execution.evidence.boundedWorkloadUnitCount,
      baselineFounderTouchpointCount:
        execution.evidence.baselineFounderTouchpointCount,
      modeledFounderTouchpointCount:
        execution.evidence.modeledFounderTouchpointCount,
      baselineInterventionMinutes:
        execution.evidence.baselineInterventionMinutes,
      modeledInterventionMinutes:
        execution.evidence.modeledInterventionMinutes,
      baselineCorrectionMinutes:
        execution.evidence.baselineCorrectionMinutes,
      modeledCorrectionMinutes:
        execution.evidence.modeledCorrectionMinutes,
      modeledTouchpointReductionPercent:
        execution.evidence.modeledTouchpointReductionPercent,
      modeledInterventionReductionPercent:
        execution.evidence.modeledInterventionReductionPercent,
      modeledCorrectionReductionPercent:
        execution.evidence.modeledCorrectionReductionPercent,
      retainedOwnerDecisionLoadPreserved:
        execution.evidence.retainedOwnerDecisionLoadPreserved,
      escalationLoadNotHidden:
        execution.evidence.escalationLoadNotHidden,
      reducedActivityNotLiberationProof:
        execution.evidence.reducedActivityNotLiberationProof,
      actualFounderMinutesMeasured:
        execution.evidence.actualFounderMinutesMeasured,
      actualFounderTimeReduced:
        execution.evidence.actualFounderTimeReduced,
      actualRoutineTaskExecuted:
        execution.evidence.actualRoutineTaskExecuted,
      founderLiberationClaimed:
        execution.evidence.founderLiberationClaimed,
    },
    authorityBoundary: {
      canonicalExecutionBound: true as const,
      sourceExecutionIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      ownerReviewRecorded: true as const,
      approvalBypassAllowed: false as const,
      sequenceSixExecutionAccepted: approved,
      sequenceSixEvidenceAccepted: approved,
      sequenceSevenSyntheticEvidenceAuthorized: approved,
      nextEvidenceExecutionAuthorized: approved,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualFounderTimeMeasurementAuthorized: false as const,
      actualFounderTimeReductionClaimAuthorized: false as const,
      reducedActivityLiberationInferenceAuthorized: false as const,
      founderRoutineExecutionReductionExecutionAuthorized: false as const,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({ ...core, decisionDigest: sha256(core) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();
  requireIdentifier("Sequence-six owner-review decision ID", record.decisionId);
  requireTimestamp("Sequence-six owner-review time", record.decidedAt);
  requireReason(record.reason);

  const expected = buildDecision(
    record.decisionId,
    record.ownerId,
    record.decision,
    record.reason,
    record.decidedAt,
  );
  const approved =
    record.decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION";

  if (
    !DIGEST.test(record.decisionDigest) ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceSixClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt) ||
    record.authorityBoundary.nextEvidenceExecutionAuthorized !== approved ||
    record.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    record.authorityBoundary.actualFounderTimeMeasurementAuthorized !== false ||
    record.authorityBoundary.actualFounderTimeReductionClaimAuthorized !== false ||
    record.authorityBoundary.reducedActivityLiberationInferenceAuthorized !== false ||
    record.authorityBoundary.repositoryReadAuthorized !== false ||
    record.authorityBoundary.productionDeploymentAuthorized !== false ||
    record.authorityBoundary.publicLaunchAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-six owner-review decision is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical sequence-six execution can receive owner review.",
    );
  }

  validateCanonicalExecution();
  requireIdentifier("Sequence-six owner-review decision ID", input.decisionId);
  requireTimestamp("Sequence-six owner-review time", input.decidedAt);
  requireReason(input.reason);

  if (input.ownerId !== execution.ownerId) {
    throw new Error("Owner identity is invalid.");
  }

  if (
    !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Sequence-six owner-review decision is invalid.");
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error("Owner review cannot precede sequence-six execution.");
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    input.reason,
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
    record,
  );
  return record;
}