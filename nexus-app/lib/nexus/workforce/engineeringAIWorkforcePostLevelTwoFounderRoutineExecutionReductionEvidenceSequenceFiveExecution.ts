import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-five-execution-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionInput {
  readonly executionId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;
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
const sequenceFourOwnerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

function validateCanonicalPrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    decision,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
    sequenceFourOwnerReview,
  );

  const fifth = decision.candidateDecisions[4];

  if (
    !fifth ||
    sequenceFourOwnerReview.executionAccepted !== true ||
    sequenceFourOwnerReview.evidenceAccepted !== true ||
    sequenceFourOwnerReview.sequenceFourClosed !== true ||
    sequenceFourOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE" ||
    sequenceFourOwnerReview.authorityBoundary.nextEvidenceExecutionAuthorized !== true ||
    sequenceFourOwnerReview.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    sequenceFourOwnerReview.authorityBoundary.founderLiberationAchieved !== false ||
    fifth.sequence !== 5 ||
    fifth.controlId !== "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY" ||
    fifth.evidenceExecutionAuthorized !== true ||
    fifth.evidenceExecutionPerformed !== false ||
    fifth.currentlyExecutable !== false ||
    fifth.waitingForPriorEvidenceOwnerReview !== true
  ) {
    throw new Error(
      "Canonical founder routine execution reduction sequence-five prerequisites are invalid.",
    );
  }
}

const escalationCases = deepFreeze([
  {
    caseId: "AMBIGUOUS_ROUTINE_INSTRUCTION",
    triggerDetected: true,
    workPaused: true,
    ownerControlReturned: true,
    unauthorizedProgressionAllowed: false,
    auditable: true,
  },
  {
    caseId: "CONFLICTING_OWNER_INSTRUCTIONS",
    triggerDetected: true,
    workPaused: true,
    ownerControlReturned: true,
    unauthorizedProgressionAllowed: false,
    auditable: true,
  },
  {
    caseId: "ROUTINE_QUALITY_DEFECT",
    triggerDetected: true,
    workPaused: true,
    ownerControlReturned: true,
    unauthorizedProgressionAllowed: false,
    auditable: true,
  },
  {
    caseId: "SECURITY_OR_TENANT_ISOLATION_SIGNAL",
    triggerDetected: true,
    workPaused: true,
    ownerControlReturned: true,
    unauthorizedProgressionAllowed: false,
    auditable: true,
  },
  {
    caseId: "REPEATED_ROUTINE_FAILURE",
    triggerDetected: true,
    workPaused: true,
    ownerControlReturned: true,
    unauthorizedProgressionAllowed: false,
    auditable: true,
  },
  {
    caseId: "ROUTINE_SCOPE_ESCAPE",
    triggerDetected: true,
    workPaused: true,
    ownerControlReturned: true,
    unauthorizedProgressionAllowed: false,
    auditable: true,
  },
  {
    caseId: "UNAUTHORIZED_AUTHORITY_REQUEST",
    triggerDetected: true,
    workPaused: true,
    ownerControlReturned: true,
    unauthorizedProgressionAllowed: false,
    auditable: true,
  },
] as const);

function buildExecution(executionId: string, executedAt: string) {
  const fifth = decision.candidateDecisions[4];
  if (!fifth) throw new Error("Sequence-five decision candidate is missing.");

  const sequenceLedger = deepFreeze(
    decision.candidateDecisions.map((candidate, index) => ({
      sequence: candidate.sequence,
      controlId: candidate.controlId,
      executionState:
        index < 5
          ? ("EXECUTED_OR_OWNER_REVIEWED" as const)
          : ("BLOCKED_PENDING_PRIOR_OWNER_REVIEW" as const),
      evidenceExecutionPerformed: index < 5,
      nextSequenceExecutionAuthorized: false as const,
    })),
  );

  const evidenceCore = {
    evidenceType:
      "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY_EVIDENCE" as const,
    evidenceMode:
      "SYNTHETIC_DETERMINISTIC_EXCEPTION_ESCALATION_SIMULATION" as const,
    evaluatedEscalationCaseCount: 7 as const,
    triggerDetectedCaseCount: 7 as const,
    pausedCaseCount: 7 as const,
    ownerControlReturnedCaseCount: 7 as const,
    unauthorizedProgressionAllowedCount: 0 as const,
    completeAuditEvidenceCaseCount: 7 as const,
    ambiguousInstructionEscalated: true as const,
    conflictingInstructionEscalated: true as const,
    qualityDefectEscalated: true as const,
    securitySignalEscalated: true as const,
    repeatedFailureEscalated: true as const,
    scopeEscapeEscalated: true as const,
    unauthorizedAuthorityRequestEscalated: true as const,
    deterministicEscalationVerified: true as const,
    actualRoutineTaskExecuted: false as const,
    actualOwnerResponsePerformed: false as const,
    actualExternalActionPerformed: false as const,
    founderRoutineExecutionReductionClaimed: false as const,
    escalationCases,
    sequenceLedger,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_VERSION,
    executionId,
    executionState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW" as const,
    tenantId: decision.tenantId,
    ownerId: decision.ownerId,
    sourceOwnerReviewDecisionId: sequenceFourOwnerReview.decisionId,
    sourceOwnerReviewDecisionDigest: sequenceFourOwnerReview.decisionDigest,
    sourceExecutionDecisionId: decision.decisionId,
    sourceExecutionDecisionDigest: decision.decisionDigest,
    sourceCandidateDecisionDigest: fifth.candidateDecisionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceSequence: 5 as const,
    controlId: "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY" as const,
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
      canonicalSequenceFourOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      sequenceFiveOnly: true as const,
      exactlyFiveEvidenceItemsExecutedInWorkstream: true as const,
      remainingThreeEvidenceItemsBlocked: true as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      ownerReviewRequiredImmediatelyAfterExecution: true as const,
      sequenceSixEvidenceExecutionAuthorized: false as const,
      nextEvidenceExecutionAuthorized: false as const,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualOwnerResponseExecutionAuthorized: false as const,
      unauthorizedProgressionAuthorized: false as const,
      exceptionBypassAuthorized: false as const,
      scopeEscapeAuthorized: false as const,
      unauthorizedAuthorityRequestAuthorized: false as const,
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
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest: sha256(core),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution =
  ReturnType<typeof buildExecution>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution,
): void {
  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-five execution ID", record.executionId);
  requireTimestamp("Sequence-five execution time", record.executedAt);

  const expected = buildExecution(record.executionId, record.executedAt);
  const boundary = record.authorityBoundary;

  if (
    !DIGEST.test(record.executionDigest) ||
    !DIGEST.test(record.evidence.evidenceDigest) ||
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.workstreamSequence !== 4 ||
    record.evidenceSequence !== 5 ||
    record.controlId !== "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY" ||
    record.evidence.evaluatedEscalationCaseCount !== 7 ||
    record.evidence.triggerDetectedCaseCount !== 7 ||
    record.evidence.pausedCaseCount !== 7 ||
    record.evidence.ownerControlReturnedCaseCount !== 7 ||
    record.evidence.unauthorizedProgressionAllowedCount !== 0 ||
    record.evidence.completeAuditEvidenceCaseCount !== 7 ||
    record.evidence.deterministicEscalationVerified !== true ||
    record.evidence.actualRoutineTaskExecuted !== false ||
    record.evidence.actualOwnerResponsePerformed !== false ||
    record.evidence.actualExternalActionPerformed !== false ||
    boundary.sequenceSixEvidenceExecutionAuthorized !== false ||
    boundary.nextEvidenceExecutionAuthorized !== false ||
    boundary.actualRoutineTaskExecutionAuthorized !== false ||
    boundary.unauthorizedProgressionAuthorized !== false ||
    boundary.exceptionBypassAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.customerContactAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidence) ||
    !Object.isFrozen(record.evidence.escalationCases) ||
    !Object.isFrozen(record.evidence.sequenceLedger) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error(
      "Founder routine execution reduction sequence-five execution is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution {
  if (input.sourceOwnerReview !== sequenceFourOwnerReview) {
    throw new Error(
      "Only the canonical approved sequence-four owner review can authorize sequence five.",
    );
  }

  validateCanonicalPrerequisites();
  requireIdentifier("Sequence-five execution ID", input.executionId);
  requireTimestamp("Sequence-five execution time", input.executedAt);

  if (
    Date.parse(input.executedAt) <
    Date.parse(sequenceFourOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Sequence-five execution cannot precede sequence-four owner review.",
    );
  }

  const record = buildExecution(input.executionId, input.executedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution({
    executionId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-sequence-five-execution-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: "2026-08-04T10:15:00.000Z",
  });