import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-four-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceFourOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceFourOwnerReviewDecisionType;
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

function requireReason(value: string): string {
  if (value.trim() !== value || value.length < 120) {
    throw new Error("Owner-review reason is invalid.");
  }
  return value;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence !== 4 ||
    execution.evidenceSequence !== 4 ||
    execution.controlId !== "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS" ||
    execution.evidence.evaluatedScenarioCount !== 6 ||
    execution.evidence.failClosedPauseScenarioCount !== 6 ||
    execution.evidence.boundedRollbackScenarioCount !== 3 ||
    execution.evidence.idempotentRetryScenarioCount !== 4 ||
    execution.evidence.duplicateRejectionScenarioCount !== 3 ||
    execution.evidence.safeResumeScenarioCount !== 2 ||
    execution.evidence.ownerControlledRestorationScenarioCount !== 6 ||
    execution.evidence.completeAuditEvidenceScenarioCount !== 6 ||
    execution.evidence.unauthorizedResumeAllowedCount !== 0 ||
    execution.evidence.duplicateExecutionAllowedCount !== 0 ||
    execution.evidence.uncontrolledRestorationAllowedCount !== 0 ||
    execution.evidence.actualRoutineTaskExecuted !== false ||
    execution.authorityBoundary.nextEvidenceExecutionAuthorized !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false
  ) {
    throw new Error(
      "Canonical founder routine execution reduction sequence-four execution is invalid.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision: EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceFourOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION";

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW_RECORDED" as const,
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
    evidenceSequence: 4 as const,
    controlId: "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS" as const,
    decision,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceFourOwnerReviewRecorded: true as const,
    sequenceFourClosed: approved,
    reason,
    reviewedEvidence: {
      evaluatedScenarioCount: execution.evidence.evaluatedScenarioCount,
      failureDetectedScenarioCount:
        execution.evidence.failureDetectedScenarioCount,
      failClosedPauseScenarioCount:
        execution.evidence.failClosedPauseScenarioCount,
      boundedRollbackScenarioCount:
        execution.evidence.boundedRollbackScenarioCount,
      idempotentRetryScenarioCount:
        execution.evidence.idempotentRetryScenarioCount,
      duplicateRejectionScenarioCount:
        execution.evidence.duplicateRejectionScenarioCount,
      safeResumeScenarioCount: execution.evidence.safeResumeScenarioCount,
      ownerControlledRestorationScenarioCount:
        execution.evidence.ownerControlledRestorationScenarioCount,
      completeAuditEvidenceScenarioCount:
        execution.evidence.completeAuditEvidenceScenarioCount,
      unauthorizedResumeAllowedCount:
        execution.evidence.unauthorizedResumeAllowedCount,
      duplicateExecutionAllowedCount:
        execution.evidence.duplicateExecutionAllowedCount,
      uncontrolledRestorationAllowedCount:
        execution.evidence.uncontrolledRestorationAllowedCount,
      deterministicRecoveryVerified:
        execution.evidence.deterministicRecoveryVerified,
      completeRecoveryEvidenceVerified:
        execution.evidence.completeRecoveryEvidenceVerified,
      actualRoutineTaskExecuted:
        execution.evidence.actualRoutineTaskExecuted,
      actualRollbackPerformed: execution.evidence.actualRollbackPerformed,
      actualRetryPerformed: execution.evidence.actualRetryPerformed,
      actualResumePerformed: execution.evidence.actualResumePerformed,
      actualRestorationPerformed:
        execution.evidence.actualRestorationPerformed,
      founderRoutineExecutionReductionClaimed:
        execution.evidence.founderRoutineExecutionReductionClaimed,
    },
    authorityBoundary: {
      canonicalExecutionBound: true as const,
      sourceExecutionIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      ownerReviewRecorded: true as const,
      approvalBypassAllowed: false as const,
      sequenceFourExecutionAccepted: approved,
      sequenceFourEvidenceAccepted: approved,
      sequenceFiveSyntheticEvidenceAuthorized: approved,
      nextEvidenceExecutionAuthorized: approved,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualRollbackExecutionAuthorized: false as const,
      actualRetryExecutionAuthorized: false as const,
      actualResumeExecutionAuthorized: false as const,
      actualRestorationExecutionAuthorized: false as const,
      unauthorizedResumeAuthorized: false as const,
      duplicateExecutionAuthorized: false as const,
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
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: (
      approved
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest: sha256(core),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();
  requireIdentifier("Sequence-four owner-review decision ID", record.decisionId);
  requireTimestamp("Sequence-four owner-review time", record.decidedAt);
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
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION";

  if (
    !DIGEST.test(record.decisionDigest) ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceFourOwnerReviewRecorded !== true ||
    record.sequenceFourClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt) ||
    record.authorityBoundary.nextEvidenceExecutionAuthorized !== approved ||
    record.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    record.authorityBoundary.actualRollbackExecutionAuthorized !== false ||
    record.authorityBoundary.actualRetryExecutionAuthorized !== false ||
    record.authorityBoundary.actualResumeExecutionAuthorized !== false ||
    record.authorityBoundary.actualRestorationExecutionAuthorized !== false ||
    record.authorityBoundary.repositoryReadAuthorized !== false ||
    record.authorityBoundary.productionDeploymentAuthorized !== false ||
    record.authorityBoundary.publicLaunchAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-four owner-review decision is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical sequence-four execution can receive owner review.",
    );
  }

  validateCanonicalExecution();
  requireIdentifier("Sequence-four owner-review decision ID", input.decisionId);
  requireTimestamp("Sequence-four owner-review time", input.decidedAt);
  requireReason(input.reason);

  if (input.ownerId !== execution.ownerId) {
    throw new Error("Owner identity is invalid.");
  }

  if (
    !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Sequence-four owner-review decision is invalid.");
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error("Owner review cannot precede sequence-four execution.");
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    input.reason,
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
    record,
  );
  return record;
}