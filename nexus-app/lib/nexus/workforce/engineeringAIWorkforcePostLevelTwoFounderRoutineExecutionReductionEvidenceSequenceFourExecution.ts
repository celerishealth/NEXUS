import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-four-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;
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
const sequenceThreeOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
    sequenceThreeOwnerReview,
  );

  const fourth = decision.candidateDecisions[3];

  if (
    !fourth ||
    sequenceThreeOwnerReview.executionAccepted !== true ||
    sequenceThreeOwnerReview.evidenceAccepted !== true ||
    sequenceThreeOwnerReview.sequenceThreeClosed !== true ||
    sequenceThreeOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR" ||
    sequenceThreeOwnerReview.authorityBoundary.nextEvidenceExecutionAuthorized !==
      true ||
    sequenceThreeOwnerReview.authorityBoundary.actualRoutineTaskExecutionAuthorized !==
      false ||
    sequenceThreeOwnerReview.authorityBoundary.founderLiberationAchieved !== false ||
    fourth.sequence !== 4 ||
    fourth.controlId !== "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS" ||
    fourth.evidenceExecutionAuthorized !== true ||
    fourth.evidenceExecutionPerformed !== false ||
    fourth.currentlyExecutable !== false ||
    fourth.waitingForPriorEvidenceOwnerReview !== true
  ) {
    throw new Error(
      "Canonical founder routine execution reduction sequence-four prerequisites are invalid.",
    );
  }
}

const recoveryScenarios = deepFreeze([
  {
    scenarioId: "ROUTINE_TASK_PROVIDER_FAILURE",
    failureDetected: true,
    failClosedPauseApplied: true,
    boundedRollbackApplied: false,
    idempotentRetryVerified: false,
    duplicateRejected: false,
    safeResumeVerified: false,
    ownerControlledRestorationRequired: true,
    auditEvidenceComplete: true,
  },
  {
    scenarioId: "PARTIAL_ROUTINE_WRITE_FAILURE",
    failureDetected: true,
    failClosedPauseApplied: true,
    boundedRollbackApplied: true,
    idempotentRetryVerified: false,
    duplicateRejected: false,
    safeResumeVerified: false,
    ownerControlledRestorationRequired: true,
    auditEvidenceComplete: true,
  },
  {
    scenarioId: "TRANSIENT_RETRY_AFTER_FAILURE",
    failureDetected: true,
    failClosedPauseApplied: true,
    boundedRollbackApplied: false,
    idempotentRetryVerified: true,
    duplicateRejected: false,
    safeResumeVerified: false,
    ownerControlledRestorationRequired: true,
    auditEvidenceComplete: true,
  },
  {
    scenarioId: "DUPLICATE_ROUTINE_EXECUTION_REQUEST",
    failureDetected: true,
    failClosedPauseApplied: true,
    boundedRollbackApplied: false,
    idempotentRetryVerified: true,
    duplicateRejected: true,
    safeResumeVerified: false,
    ownerControlledRestorationRequired: true,
    auditEvidenceComplete: true,
  },
  {
    scenarioId: "OWNER_REVIEWED_SAFE_RESUME",
    failureDetected: true,
    failClosedPauseApplied: true,
    boundedRollbackApplied: true,
    idempotentRetryVerified: true,
    duplicateRejected: true,
    safeResumeVerified: true,
    ownerControlledRestorationRequired: true,
    auditEvidenceComplete: true,
  },
  {
    scenarioId: "OWNER_CONTROLLED_RESTORATION",
    failureDetected: true,
    failClosedPauseApplied: true,
    boundedRollbackApplied: true,
    idempotentRetryVerified: true,
    duplicateRejected: true,
    safeResumeVerified: true,
    ownerControlledRestorationRequired: true,
    auditEvidenceComplete: true,
  },
] as const);

function buildExecution(executionId: string, executedAt: string) {
  const fourth = decision.candidateDecisions[3];
  if (!fourth) throw new Error("Sequence-four decision candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) => ({
      sequence: candidate.sequence,
      controlId: candidate.controlId,
      executionState:
        index < 4
          ? ("EXECUTED_OR_OWNER_REVIEWED" as const)
          : ("BLOCKED_PENDING_PRIOR_OWNER_REVIEW" as const),
      evidenceExecutionPerformed: index < 4,
      nextSequenceExecutionAuthorized: false as const,
    })),
  );

  const evidenceCore = {
    evidenceType:
      "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_DETERMINISTIC_FAILURE_AND_RECOVERY_SIMULATION" as const,
    evaluatedScenarioCount: 6 as const,
    failureDetectedScenarioCount: 6 as const,
    failClosedPauseScenarioCount: 6 as const,
    boundedRollbackScenarioCount: 3 as const,
    idempotentRetryScenarioCount: 4 as const,
    duplicateRejectionScenarioCount: 3 as const,
    safeResumeScenarioCount: 2 as const,
    ownerControlledRestorationScenarioCount: 6 as const,
    completeAuditEvidenceScenarioCount: 6 as const,
    unauthorizedResumeAllowedCount: 0 as const,
    duplicateExecutionAllowedCount: 0 as const,
    uncontrolledRestorationAllowedCount: 0 as const,
    deterministicRecoveryVerified: true as const,
    completeRecoveryEvidenceVerified: true as const,
    actualRoutineTaskExecuted: false as const,
    actualRollbackPerformed: false as const,
    actualRetryPerformed: false as const,
    actualResumePerformed: false as const,
    actualRestorationPerformed: false as const,
    founderRoutineExecutionReductionClaimed: false as const,
    recoveryScenarios,
    sequenceLedger,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId: sequenceThreeOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceThreeOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: fourth.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 4 as const,
    controlId: "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS" as const,
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
      canonicalSequenceThreeOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceFourOnly: true as const,
      exactlyFourEvidenceItemsExecutedInWorkstream: true as const,
      remainingFourEvidenceItemsBlocked: true as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceFiveEvidenceExecutionAuthorized: false as const,
      nextEvidenceExecutionAuthorized: false as const,
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
      monitoringRequired: true as const,
      emergencyPauseAvailable: true as const,
      rollbackEvidenceRequired: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest: sha256(core),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution,
): void {
  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-four execution ID", record.executionId);
  requireTimestamp("Sequence-four execution time", record.executedAt);

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !DIGEST.test(record.executionDigest) ||
    !DIGEST.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.workstreamSequence !== 4 ||
    record.evidenceSequence !== 4 ||
    record.controlId !== "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS" ||
    record.evidence.evaluatedScenarioCount !== 6 ||
    record.evidence.failClosedPauseScenarioCount !== 6 ||
    record.evidence.boundedRollbackScenarioCount !== 3 ||
    record.evidence.idempotentRetryScenarioCount !== 4 ||
    record.evidence.duplicateRejectionScenarioCount !== 3 ||
    record.evidence.safeResumeScenarioCount !== 2 ||
    record.evidence.ownerControlledRestorationScenarioCount !== 6 ||
    record.evidence.completeAuditEvidenceScenarioCount !== 6 ||
    record.evidence.unauthorizedResumeAllowedCount !== 0 ||
    record.evidence.duplicateExecutionAllowedCount !== 0 ||
    record.evidence.uncontrolledRestorationAllowedCount !== 0 ||
    record.evidence.actualRoutineTaskExecuted !== false ||
    record.evidence.actualRollbackPerformed !== false ||
    record.evidence.actualRetryPerformed !== false ||
    record.evidence.actualResumePerformed !== false ||
    record.evidence.actualRestorationPerformed !== false ||
    boundary.sequenceFiveEvidenceExecutionAuthorized !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.actualRoutineTaskExecutionAuthorized !== false ||
    boundary.actualRollbackExecutionAuthorized !== false ||
    boundary.actualRetryExecutionAuthorized !== false ||
    boundary.actualResumeExecutionAuthorized !== false ||
    boundary.actualRestorationExecutionAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.recoveryScenarios) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-four execution is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution {
  if (input.sourceOwnerReview !== sequenceThreeOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-three owner review can authorize sequence four.",
    );
  }

  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-four execution ID", input.executionId);
  requireTimestamp("Sequence-four execution time", input.executedAt);

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceThreeOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Sequence-four execution cannot precede sequence-three owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-four-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-04T09:35:00.000Z",
  });