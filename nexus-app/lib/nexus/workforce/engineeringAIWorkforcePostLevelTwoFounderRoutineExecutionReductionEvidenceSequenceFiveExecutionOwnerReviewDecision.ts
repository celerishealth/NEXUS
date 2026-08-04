import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-five-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceFiveOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceFiveOwnerReviewDecisionType;
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
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
    execution,
  );

  if (
    execution.evidenceSequence !== 5 ||
    execution.controlId !== "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY" ||
    execution.evidence.evaluatedEscalationCaseCount !== 7 ||
    execution.evidence.pausedCaseCount !== 7 ||
    execution.evidence.ownerControlReturnedCaseCount !== 7 ||
    execution.evidence.unauthorizedProgressionAllowedCount !== 0 ||
    execution.evidence.actualRoutineTaskExecuted !== false ||
    execution.authorityBoundary.nextEvidenceExecutionAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false
  ) {
    throw new Error("Canonical sequence-five execution is invalid.");
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision: EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceFiveOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION";

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW_RECORDED" as const,
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
    evidenceSequence: 5 as const,
    controlId: "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY" as const,
    decision,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceFiveOwnerReviewRecorded: true as const,
    sequenceFiveClosed: approved,
    reason,
    reviewedEvidence: {
      evaluatedEscalationCaseCount:
        execution.evidence.evaluatedEscalationCaseCount,
      triggerDetectedCaseCount: execution.evidence.triggerDetectedCaseCount,
      pausedCaseCount: execution.evidence.pausedCaseCount,
      ownerControlReturnedCaseCount:
        execution.evidence.ownerControlReturnedCaseCount,
      unauthorizedProgressionAllowedCount:
        execution.evidence.unauthorizedProgressionAllowedCount,
      completeAuditEvidenceCaseCount:
        execution.evidence.completeAuditEvidenceCaseCount,
      deterministicEscalationVerified:
        execution.evidence.deterministicEscalationVerified,
      actualRoutineTaskExecuted:
        execution.evidence.actualRoutineTaskExecuted,
      actualOwnerResponsePerformed:
        execution.evidence.actualOwnerResponsePerformed,
      actualExternalActionPerformed:
        execution.evidence.actualExternalActionPerformed,
      founderRoutineExecutionReductionClaimed:
        execution.evidence.founderRoutineExecutionReductionClaimed,
    },
    authorityBoundary: {
      canonicalExecutionBound: true as const,
      sourceExecutionIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      ownerReviewRecorded: true as const,
      approvalBypassAllowed: false as const,
      sequenceFiveExecutionAccepted: approved,
      sequenceFiveEvidenceAccepted: approved,
      sequenceSixSyntheticEvidenceAuthorized: approved,
      nextEvidenceExecutionAuthorized: approved,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualOwnerResponseExecutionAuthorized: false as const,
      unauthorizedProgressionAuthorized: false as const,
      exceptionBypassAuthorized: false as const,
      scopeEscapeAuthorized: false as const,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({ ...core, decisionDigest: sha256(core) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();
  requireIdentifier("Sequence-five owner-review decision ID", record.decisionId);
  requireTimestamp("Sequence-five owner-review time", record.decidedAt);
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
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION";

  if (
    !DIGEST.test(record.decisionDigest) ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceFiveClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt) ||
    record.authorityBoundary.nextEvidenceExecutionAuthorized !== approved ||
    record.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    record.authorityBoundary.unauthorizedProgressionAuthorized !== false ||
    record.authorityBoundary.repositoryReadAuthorized !== false ||
    record.authorityBoundary.productionDeploymentAuthorized !== false ||
    record.authorityBoundary.customerContactAuthorized !== false ||
    record.authorityBoundary.publicLaunchAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-five owner-review decision is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical sequence-five execution can receive owner review.",
    );
  }

  validateCanonicalExecution();
  requireIdentifier("Sequence-five owner-review decision ID", input.decisionId);
  requireTimestamp("Sequence-five owner-review time", input.decidedAt);
  requireReason(input.reason);

  if (input.ownerId !== execution.ownerId) {
    throw new Error("Owner identity is invalid.");
  }

  if (
    !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Sequence-five owner-review decision is invalid.");
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error("Owner review cannot precede sequence-five execution.");
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    input.reason,
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
    record,
  );
  return record;
}