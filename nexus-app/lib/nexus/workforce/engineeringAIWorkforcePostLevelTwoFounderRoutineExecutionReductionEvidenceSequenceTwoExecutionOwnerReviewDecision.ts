import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-two-execution-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceTwoOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceExecution:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceTwoOwnerReviewDecisionType;
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

function requireReason(value: string): string {
  if (value.trim() !== value || value.length < 120) {
    throw new Error("Owner-review reason is invalid.");
  }
  return value;
}

const execution =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

function validateCanonicalExecution(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
    execution,
  );

  if (
    execution.executionState !==
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW" ||
    execution.workstreamSequence !== 4 ||
    execution.evidenceSequence !== 2 ||
    execution.controlId !== "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY" ||
    execution.evidence.authorityCaseCount !== 8 ||
    execution.evidence.autonomouslyExecutableAuthorityCount !== 0 ||
    execution.evidence.explicitOwnerReviewRequiredCount !== 8 ||
    execution.evidence.failClosedAuthorityCount !== 8 ||
    execution.evidence.unauthorizedDelegationCount !== 0 ||
    execution.evidence.actualAuthorityTransferred !== false ||
    execution.authorityBoundary.nextEvidenceExecutionAuthorized !== false ||
    execution.authorityBoundary.repositoryReadAuthorized !== false ||
    execution.authorityBoundary.productionDeploymentAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false
  ) {
    throw new Error(
      "Canonical founder routine execution reduction sequence-two execution is invalid.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision: EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceSequenceTwoOwnerReviewDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION";

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW_RECORDED" as const,
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
    evidenceSequence: 2 as const,
    controlId: "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY" as const,
    decision,
    executionAccepted: approved,
    evidenceAccepted: approved,
    sequenceTwoOwnerReviewRecorded: true as const,
    sequenceTwoClosed: approved,
    reason,
    reviewedEvidence: {
      authorityCaseCount: execution.evidence.authorityCaseCount,
      autonomouslyExecutableAuthorityCount:
        execution.evidence.autonomouslyExecutableAuthorityCount,
      explicitOwnerReviewRequiredCount:
        execution.evidence.explicitOwnerReviewRequiredCount,
      failClosedAuthorityCount: execution.evidence.failClosedAuthorityCount,
      unauthorizedDelegationCount:
        execution.evidence.unauthorizedDelegationCount,
      actualAuthorityTransferred:
        execution.evidence.actualAuthorityTransferred,
      actualCredentialAccessPerformed:
        execution.evidence.actualCredentialAccessPerformed,
      actualFinancialCommitmentPerformed:
        execution.evidence.actualFinancialCommitmentPerformed,
      actualLegalCommitmentPerformed:
        execution.evidence.actualLegalCommitmentPerformed,
      actualProductionActionPerformed:
        execution.evidence.actualProductionActionPerformed,
      actualCustomerContactPerformed:
        execution.evidence.actualCustomerContactPerformed,
      actualPublicLaunchPerformed:
        execution.evidence.actualPublicLaunchPerformed,
      actualEmergencyControlTransferred:
        execution.evidence.actualEmergencyControlTransferred,
      ownerFinalAuthorityPreserved:
        execution.evidence.ownerFinalAuthorityPreserved,
      deterministicBoundaryVerified:
        execution.evidence.deterministicBoundaryVerified,
    },
    authorityBoundary: {
      canonicalExecutionBound: true as const,
      sourceExecutionIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      ownerReviewRecorded: true as const,
      approvalBypassAllowed: false as const,
      sequenceTwoExecutionAccepted: approved,
      sequenceTwoEvidenceAccepted: approved,
      sequenceThreeSyntheticEvidenceAuthorized: approved,
      nextEvidenceExecutionAuthorized: approved,
      actualRoutineTaskExecutionAuthorized: false as const,
      founderRoutineExecutionReductionExecutionAuthorized: false as const,
      founderRoutineExecutionReductionClaimAuthorized: false as const,
      founderRoutineExecutionReductionClaimed: false as const,
      ownerCredentialAccessAuthorized: false as const,
      financialCommitmentAuthorized: false as const,
      legalCommitmentAuthorized: false as const,
      customerContactAuthorized: false as const,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_AWAITING_OWNER_REVIEW"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_AWAITING_OWNER_REVIEW",
    decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest: sha256(core),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision,
): void {
  validateCanonicalExecution();
  requireIdentifier("Sequence-two owner-review decision ID", record.decisionId);
  requireTimestamp("Sequence-two owner-review time", record.decidedAt);
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
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION";

  if (
    !DIGEST.test(record.decisionDigest) ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    record.ownerId !== execution.ownerId ||
    record.sourceExecutionDigest !== execution.executionDigest ||
    record.executionAccepted !== approved ||
    record.evidenceAccepted !== approved ||
    record.sequenceTwoOwnerReviewRecorded !== true ||
    record.sequenceTwoClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(execution.executedAt) ||
    record.authorityBoundary.nextEvidenceExecutionAuthorized !== approved ||
    record.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    record.authorityBoundary.ownerCredentialAccessAuthorized !== false ||
    record.authorityBoundary.financialCommitmentAuthorized !== false ||
    record.authorityBoundary.legalCommitmentAuthorized !== false ||
    record.authorityBoundary.customerContactAuthorized !== false ||
    record.authorityBoundary.repositoryReadAuthorized !== false ||
    record.authorityBoundary.productionDeploymentAuthorized !== false ||
    record.authorityBoundary.publicLaunchAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-two owner-review decision is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision {
  if (input.sourceExecution !== execution) {
    throw new Error(
      "Only the canonical sequence-two execution can receive owner review.",
    );
  }

  validateCanonicalExecution();
  requireIdentifier("Sequence-two owner-review decision ID", input.decisionId);
  requireTimestamp("Sequence-two owner-review time", input.decidedAt);
  requireReason(input.reason);

  if (input.ownerId !== execution.ownerId) {
    throw new Error("Owner identity is invalid.");
  }

  if (
    !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Sequence-two owner-review decision is invalid.");
  }

  if (Date.parse(input.decidedAt) < Date.parse(execution.executedAt)) {
    throw new Error("Owner review cannot precede sequence-two execution.");
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    input.reason,
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
    record,
  );
  return record;
}