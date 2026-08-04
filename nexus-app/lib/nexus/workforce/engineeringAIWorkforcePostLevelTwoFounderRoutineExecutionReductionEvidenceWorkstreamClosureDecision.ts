import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-workstream-closure-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISIONS =
  [
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE",
    "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_OPEN",
  ] as const;

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISIONS)[number];

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecisionType;
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

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

function buildDecision(
  decisionId: string,
  ownerId: string,
  decision: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecisionType,
  reason: string,
  decidedAt: string,
) {
  const approved =
    decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE";

  const core = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_RECORDED" as const,
    tenantId: preparation.tenantId,
    ownerId,
    sourcePreparationId: preparation.preparationId,
    sourcePreparationDigest: preparation.preparationDigest,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    decision,
    reason,
    closurePreparationAccepted: approved,
    formalClosureDecisionRecorded: true as const,
    workstreamClosureAuthorized: approved,
    workstreamClosurePerformed: approved,
    workstreamClosed: approved,
    reviewedClosureEvidence: {
      requiredEvidenceSequenceCount:
        preparation.closureEvidence.requiredEvidenceSequenceCount,
      completedEvidenceSequenceCount:
        preparation.closureEvidence.completedEvidenceSequenceCount,
      acceptedOwnerReviewCount:
        preparation.closureEvidence.acceptedOwnerReviewCount,
      failedEvidenceAreaCount:
        preparation.closureEvidence.failedEvidenceAreaCount,
      missingEvidenceAreaCount:
        preparation.closureEvidence.missingEvidenceAreaCount,
      auditGapCount: preparation.closureEvidence.auditGapCount,
      authorityBoundaryFailureCount:
        preparation.closureEvidence.authorityBoundaryFailureCount,
      actualRoutineTaskExecuted:
        preparation.closureEvidence.actualRoutineTaskExecuted,
      actualFounderTimeReductionMeasured:
        preparation.closureEvidence.actualFounderTimeReductionMeasured,
      actualFounderTimeReductionVerified:
        preparation.closureEvidence.actualFounderTimeReductionVerified,
      founderLiberationAchieved:
        preparation.closureEvidence.founderLiberationAchieved,
      founderLiberationRemainsLevelTwo:
        preparation.closureEvidence.founderLiberationRemainsLevelTwo,
    },
    authorityBoundary: {
      canonicalClosurePreparationBound: true as const,
      sourcePreparationIntegrityVerified: true as const,
      ownerIdentityBound: true as const,
      formalClosureDecisionRecorded: true as const,
      closureDecisionBypassAuthorized: false as const,
      workstreamFourClosureAuthorized: approved,
      workstreamFourClosurePerformed: approved,
      workstreamFourClosed: approved,
      actualRoutineTaskExecutionAuthorized: false as const,
      actualFounderTimeMeasurementAuthorized: false as const,
      actualFounderTimeReductionClaimAuthorized: false as const,
      formalFounderLiberationAssessmentAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
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
        ? "RETAIN_FOUNDER_LIBERATION_LEVEL_TWO_PENDING_ACTUAL_OPERATIONAL_EVIDENCE_AND_SEPARATE_FORMAL_ASSESSMENT"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_OPEN"
    ) as
      | "RETAIN_FOUNDER_LIBERATION_LEVEL_TWO_PENDING_ACTUAL_OPERATIONAL_EVIDENCE_AND_SEPARATE_FORMAL_ASSESSMENT"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_OPEN",
    decidedAt,
  };

  return deepFreeze({ ...core, decisionDigest: sha256(core) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision,
): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
    preparation,
  );

  const approved =
    record.decision ===
    "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE";
  const expected = buildDecision(
    record.decisionId,
    record.ownerId,
    record.decision,
    record.reason,
    record.decidedAt,
  );

  if (
    record.decisionId.trim() !== record.decisionId ||
    !ID.test(record.decisionId) ||
    record.reason.trim() !== record.reason ||
    record.reason.length < 120 ||
    Number.isNaN(Date.parse(record.decidedAt)) ||
    new Date(record.decidedAt).toISOString() !== record.decidedAt ||
    !DIGEST.test(record.decisionDigest) ||
    record.decisionDigest !== expected.decisionDigest ||
    sha256(record) !== sha256(expected) ||
    record.ownerId !== preparation.ownerId ||
    record.workstreamClosureAuthorized !== approved ||
    record.workstreamClosurePerformed !== approved ||
    record.workstreamClosed !== approved ||
    Date.parse(record.decidedAt) < Date.parse(preparation.preparedAt) ||
    record.authorityBoundary.workstreamFourClosed !== approved ||
    record.authorityBoundary.actualRoutineTaskExecutionAuthorized !== false ||
    record.authorityBoundary.formalFounderLiberationAssessmentAuthorized !== false ||
    record.authorityBoundary.repositoryReadAuthorized !== false ||
    record.authorityBoundary.productionDeploymentAuthorized !== false ||
    record.authorityBoundary.publicLaunchAuthorized !== false ||
    record.authorityBoundary.levelThreeAuthorityGranted !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedClosureEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error("Workstream-closure decision is invalid.");
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision {
  if (input.sourcePreparation !== preparation) {
    throw new Error(
      "Only the canonical workstream-closure preparation can receive the formal owner decision.",
    );
  }

  if (input.ownerId !== preparation.ownerId) {
    throw new Error("Only the preparation-bound NEXUS owner can close this workstream.");
  }
  if (
    !ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Workstream-closure decision is invalid.");
  }
  if (Date.parse(input.decidedAt) < Date.parse(preparation.preparedAt)) {
    throw new Error(
      "Workstream-closure decision cannot precede closure preparation.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decision,
    input.reason,
    input.decidedAt,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
    record,
  );
  return record;
}