import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    preparationId:
      "engineering-founder-routine-execution-reduction-workstream-closure-test-001",
    sourceOwnerReview: review,
    preparedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction workstream closure preparation", () => {
  it("prepares formal closure for owner decision", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
        canonicalInput(),
      );

    expect(record.workstreamClosurePreparationPerformed).toBe(true);
    expect(record.formalClosureDecisionRequired).toBe(true);
    expect(record.workstreamClosurePerformed).toBe(false);
  });

  it("accounts for all eight accepted synthetic evidence sequences", () => {
    const evidence =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION
        .closureEvidence;

    expect(evidence.requiredEvidenceSequenceCount).toBe(8);
    expect(evidence.completedEvidenceSequenceCount).toBe(8);
    expect(evidence.acceptedOwnerReviewCount).toBe(8);
    expect(evidence.sequenceEvidenceSummary).toHaveLength(8);
  });

  it("records zero evidence, audit, and authority gaps", () => {
    const evidence =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION
        .closureEvidence;

    expect(evidence.failedEvidenceAreaCount).toBe(0);
    expect(evidence.missingEvidenceAreaCount).toBe(0);
    expect(evidence.auditGapCount).toBe(0);
    expect(evidence.authorityBoundaryFailureCount).toBe(0);
  });

  it("does not claim actual reduction or Founder Liberation", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

    expect(record.closureEvidence.actualRoutineTaskExecuted).toBe(false);
    expect(record.closureEvidence.actualFounderTimeReductionMeasured).toBe(false);
    expect(record.closureEvidence.actualFounderTimeReductionVerified).toBe(false);
    expect(record.closureEvidence.founderLiberationAchieved).toBe(false);
    expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
  });

  it("rejects copied owner review, premature preparation, and tampering", () => {
    const review =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;
    const copied = { ...review } as typeof review;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
        { ...canonicalInput(), sourceOwnerReview: copied },
      ),
    ).toThrow("Only the canonical approved sequence-eight owner review");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
        {
          ...canonicalInput(),
          preparedAt: new Date(Date.parse(review.decidedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-eight owner review");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation(
        tampered,
      ),
    ).toThrow();
  });
});