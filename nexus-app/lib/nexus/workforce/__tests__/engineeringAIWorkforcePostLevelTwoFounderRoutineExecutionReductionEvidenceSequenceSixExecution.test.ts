import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-six-test-001",
    sourceOwnerReview: review,
    executedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction evidence sequence six", () => {
  it("creates deterministic before-and-after measurement evidence", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      workstreamSequence: 4,
      evidenceSequence: 6,
      controlId: "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT",
      evidenceExecutionPerformed: true,
      nextStep:
        "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW",
    });
  });

  it("records bounded workload and modeled reduction metrics", () => {
    const evidence =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION
        .evidence;

    expect(evidence).toMatchObject({
      boundedWorkloadUnitCount: 20,
      baselineFounderTouchpointCount: 20,
      modeledFounderTouchpointCount: 8,
      baselineInterventionMinutes: 240,
      modeledInterventionMinutes: 90,
      baselineCorrectionMinutes: 120,
      modeledCorrectionMinutes: 45,
      modeledTouchpointReductionPercent: 60,
      modeledInterventionReductionPercent: 62.5,
      modeledCorrectionReductionPercent: 62.5,
      retainedOwnerDecisionLoadPreserved: true,
      escalationLoadNotHidden: true,
    });
  });

  it("does not treat modeled reduction as actual liberation evidence", () => {
    const evidence =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION
        .evidence;

    expect(evidence.actualFounderMinutesMeasured).toBe(false);
    expect(evidence.actualFounderTimeReduced).toBe(false);
    expect(evidence.actualRoutineTaskExecuted).toBe(false);
    expect(evidence.founderRoutineExecutionReductionClaimed).toBe(false);
    expect(evidence.founderLiberationClaimed).toBe(false);
    expect(evidence.reducedActivityNotLiberationProof).toBe(true);
  });

  it("executes six evidence items and blocks the final two", () => {
    const ledger =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION
        .evidence.sequenceLedger;

    expect(ledger.filter((entry) => entry.evidenceExecutionPerformed)).toHaveLength(6);
    expect(ledger.filter((entry) => !entry.evidenceExecutionPerformed)).toHaveLength(2);
  });

  it("rejects copied review, premature execution, and tampering", () => {
    const review =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;
    const copiedReview = { ...review } as typeof review;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
        { ...canonicalInput(), sourceOwnerReview: copiedReview },
      ),
    ).toThrow("Only the canonical approved sequence-five owner review");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
        {
          ...canonicalInput(),
          executedAt: new Date(Date.parse(review.decidedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-five owner review");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution(
        tampered,
      ),
    ).toThrow();
  });
});