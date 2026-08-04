import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-eight-test-001",
    sourceOwnerReview: review,
    executedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction evidence sequence eight", () => {
  it("creates the synthetic final evidence-summary gate", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      evidenceSequence: 8,
      controlId: "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE",
      evidenceExecutionPerformed: true,
      nextStep:
        "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW",
    });
  });

  it("records all eight required synthetic evidence controls", () => {
    const evidence =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION
        .evidence;

    expect(evidence.requiredControlCount).toBe(8);
    expect(evidence.syntheticEvidencePresentCount).toBe(8);
    expect(evidence.allRequiredSyntheticEvidencePresent).toBe(true);
    expect(evidence.evidenceSummary).toHaveLength(8);
    expect(
      evidence.evidenceSummary.every((entry) => entry.syntheticEvidencePresent),
    ).toBe(true);
  });

  it("keeps owner acceptance and formal closure pending", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

    expect(record.evidence.ownerAcceptancePending).toBe(true);
    expect(record.evidence.formalWorkstreamClosurePending).toBe(true);
    expect(record.authorityBoundary.workstreamClosureAuthorized).toBe(false);
    expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(false);
  });

  it("does not claim actual reduction, authority, or Founder Liberation", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

    expect(record.evidence.actualRoutineTaskExecuted).toBe(false);
    expect(record.evidence.actualFounderTimeReductionMeasured).toBe(false);
    expect(record.evidence.actualFounderTimeReductionVerified).toBe(false);
    expect(record.evidence.actualProductionOperationPerformed).toBe(false);
    expect(record.evidence.founderLiberationAssessmentPerformed).toBe(false);
    expect(record.evidence.founderLiberationAchieved).toBe(false);
    expect(record.authorityBoundary.levelThreeAuthorityGranted).toBe(false);
    expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
  });

  it("rejects copied review, premature execution, and tampering", () => {
    const review =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;
    const copiedReview = { ...review } as typeof review;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
        { ...canonicalInput(), sourceOwnerReview: copiedReview },
      ),
    ).toThrow("Only the canonical approved sequence-seven owner review");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
        {
          ...canonicalInput(),
          executedAt: new Date(Date.parse(review.decidedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-seven owner review");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution(
        tampered,
      ),
    ).toThrow();
  });
});