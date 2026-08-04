import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";
import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-workstream-closure-preparation-v1" as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparationInput {
  readonly preparationId: string;
  readonly sourceOwnerReview:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;
  readonly preparedAt: string;
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

const ownerReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

function validatePrerequisites(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
    ownerReview,
  );

  if (
    ownerReview.executionAccepted !== true ||
    ownerReview.evidenceAccepted !== true ||
    ownerReview.sequenceEightClosed !== true ||
    ownerReview.allEightSyntheticEvidenceItemsAccepted !== true ||
    ownerReview.reviewedEvidence.requiredControlCount !== 8 ||
    ownerReview.reviewedEvidence.syntheticEvidencePresentCount !== 8 ||
    ownerReview.reviewedEvidence.allRequiredSyntheticEvidencePresent !== true ||
    ownerReview.reviewedEvidence.actualRoutineTaskExecuted !== false ||
    ownerReview.reviewedEvidence.actualFounderTimeReductionMeasured !== false ||
    ownerReview.reviewedEvidence.actualFounderTimeReductionVerified !== false ||
    ownerReview.reviewedEvidence.founderLiberationAchieved !== false ||
    ownerReview.authorityBoundary
      .formalWorkstreamClosurePreparationAuthorized !== true ||
    ownerReview.authorityBoundary.workstreamClosureCompleted !== false ||
    ownerReview.authorityBoundary.founderLiberationAchieved !== false ||
    ownerReview.nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_FORMAL_CLOSURE"
  ) {
    throw new Error("Canonical workstream-closure prerequisites are invalid.");
  }
}

const sequenceEvidenceSummary = deepFreeze([
  { sequence: 1, controlId: "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE", evidenceExecuted: true, ownerReviewAccepted: true },
  { sequence: 2, controlId: "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY", evidenceExecuted: true, ownerReviewAccepted: true },
  { sequence: 3, controlId: "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD", evidenceExecuted: true, ownerReviewAccepted: true },
  { sequence: 4, controlId: "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS", evidenceExecuted: true, ownerReviewAccepted: true },
  { sequence: 5, controlId: "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY", evidenceExecuted: true, ownerReviewAccepted: true },
  { sequence: 6, controlId: "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT", evidenceExecuted: true, ownerReviewAccepted: true },
  { sequence: 7, controlId: "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY", evidenceExecuted: true, ownerReviewAccepted: true },
  { sequence: 8, controlId: "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE", evidenceExecuted: true, ownerReviewAccepted: true },
] as const);

function buildPreparation(preparationId: string, preparedAt: string) {
  const closureEvidenceCore = {
    requiredEvidenceSequenceCount: 8 as const,
    completedEvidenceSequenceCount: 8 as const,
    acceptedOwnerReviewCount: 8 as const,
    remainingEvidenceSequenceCount: 0 as const,
    rejectedEvidenceSequenceCount: 0 as const,
    missingOwnerReviewCount: 0 as const,
    failedEvidenceAreaCount: 0 as const,
    missingEvidenceAreaCount: 0 as const,
    auditGapCount: 0 as const,
    authorityBoundaryFailureCount: 0 as const,
    allEightEvidenceSequencesAccountedFor: true as const,
    allRequiredOwnerReviewsAccountedFor: true as const,
    syntheticEvidenceIntegrityVerified: true as const,
    auditContinuityVerified: true as const,
    tenantIsolationBoundaryVerified: true as const,
    ownerFinalAuthorityVerified: true as const,
    consequentialAuthorityBoundariesVerified: true as const,
    actualRoutineTaskExecuted: false as const,
    actualFounderTimeReductionMeasured: false as const,
    actualFounderTimeReductionVerified: false as const,
    actualProductionOperationPerformed: false as const,
    actualCustomerWorkPerformed: false as const,
    levelThreeAuthorityGranted: false as const,
    founderLiberationAssessmentPerformed: false as const,
    founderLiberationAchieved: false as const,
    founderReleasedFromRoutineExecution: false as const,
    founderLiberationRemainsLevelTwo: true as const,
    sequenceEvidenceSummary,
  };

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION_VERSION,
    preparationId,
    preparationState:
      "ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARED_AWAITING_OWNER_DECISION" as const,
    tenantId: ownerReview.tenantId,
    ownerId: ownerReview.ownerId,
    sourceSequenceEightOwnerReviewDecisionId: ownerReview.decisionId,
    sourceSequenceEightOwnerReviewDecisionDigest: ownerReview.decisionDigest,
    sourceSequenceEightExecutionId: ownerReview.sourceExecutionId,
    sourceSequenceEightExecutionDigest: ownerReview.sourceExecutionDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    workstreamClosurePreparationAuthorized: true as const,
    workstreamClosurePreparationPerformed: true as const,
    formalClosureDecisionRequired: true as const,
    formalClosureDecisionRecorded: false as const,
    workstreamClosureAuthorized: false as const,
    workstreamClosurePerformed: false as const,
    closureEvidence: deepFreeze({
      ...closureEvidenceCore,
      closureEvidenceDigest: sha256(closureEvidenceCore),
    }),
    authorityBoundary: {
      canonicalSequenceEightOwnerReviewBound: true as const,
      sourceOwnerReviewIntegrityVerified: true as const,
      closurePreparationOnly: true as const,
      closureDecisionReviewRequired: true as const,
      closureDecisionBypassAuthorized: false as const,
      formalClosureDecisionRecorded: false as const,
      workstreamClosureAuthorized: false as const,
      workstreamClosurePerformed: false as const,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualFounderTimeMeasurementAuthorized: false as const,
      actualFounderTimeReductionClaimAuthorized: false as const,
      formalFounderLiberationAssessmentAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
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
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_REVIEW" as const,
    preparedAt,
  };

  return deepFreeze({ ...core, preparationDigest: sha256(core) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation =
  ReturnType<typeof buildPreparation>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation,
): void {
  validatePrerequisites();
  requireIdentifier("Workstream-closure preparation ID", record.preparationId);
  requireTimestamp("Workstream-closure preparation time", record.preparedAt);

  const expected = buildPreparation(record.preparationId, record.preparedAt);

  if (
    !DIGEST.test(record.preparationDigest) ||
    !DIGEST.test(record.closureEvidence.closureEvidenceDigest) ||
    record.preparationDigest !== expected.preparationDigest ||
    sha256(record) !== sha256(expected) ||
    record.workstreamSequence !== 4 ||
    record.closureEvidence.requiredEvidenceSequenceCount !== 8 ||
    record.closureEvidence.completedEvidenceSequenceCount !== 8 ||
    record.closureEvidence.acceptedOwnerReviewCount !== 8 ||
    record.closureEvidence.remainingEvidenceSequenceCount !== 0 ||
    record.closureEvidence.failedEvidenceAreaCount !== 0 ||
    record.closureEvidence.missingEvidenceAreaCount !== 0 ||
    record.closureEvidence.auditGapCount !== 0 ||
    record.closureEvidence.authorityBoundaryFailureCount !== 0 ||
    record.closureEvidence.founderLiberationAchieved !== false ||
    record.workstreamClosureAuthorized !== false ||
    record.workstreamClosurePerformed !== false ||
    record.authorityBoundary.formalFounderLiberationAssessmentAuthorized !== false ||
    record.authorityBoundary.repositoryReadAuthorized !== false ||
    record.authorityBoundary.productionDeploymentAuthorized !== false ||
    record.authorityBoundary.publicLaunchAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.closureEvidence) ||
    !Object.isFrozen(record.closureEvidence.sequenceEvidenceSummary) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error("Workstream-closure preparation is invalid.");
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparationInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation {
  if (input.sourceOwnerReview !== ownerReview) {
    throw new Error(
      "Only the canonical approved sequence-eight owner review can prepare workstream closure.",
    );
  }

  validatePrerequisites();
  requireIdentifier("Workstream-closure preparation ID", input.preparationId);
  requireTimestamp("Workstream-closure preparation time", input.preparedAt);

  if (Date.parse(input.preparedAt) < Date.parse(ownerReview.decidedAt)) {
    throw new Error(
      "Workstream-closure preparation cannot precede sequence-eight owner review.",
    );
  }

  const record = buildPreparation(input.preparationId, input.preparedAt);
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
    record,
  );
  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-workstream-closure-preparation-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
    preparedAt: "2026-08-04T11:50:21.584Z",
  });