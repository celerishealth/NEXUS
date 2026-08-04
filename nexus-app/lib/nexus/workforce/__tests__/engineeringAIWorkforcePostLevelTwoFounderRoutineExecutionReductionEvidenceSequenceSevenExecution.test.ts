import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-seven-test-001",
    sourceOwnerReview: review,
    executedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction evidence sequence seven", () => {
  it("creates deterministic repeated-cycle stability evidence", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      evidenceSequence: 7,
      controlId: "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY",
      evidenceExecutionPerformed: true,
      nextStep:
        "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW",
    });
  });

  it("passes all six synthetic cycles without unauthorized progression", () => {
    const evidence =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION
        .evidence;

    expect(evidence).toMatchObject({
      evaluatedCycleCount: 6,
      routineCoveragePassedCycleCount: 6,
      qualityThresholdPassedCycleCount: 6,
      defectContainmentPassedCycleCount: 6,
      recoveryConsistencyPassedCycleCount: 6,
      escalationConsistencyPassedCycleCount: 6,
      auditContinuityPassedCycleCount: 6,
      regressionGatePassedCycleCount: 6,
      unauthorizedProgressionAllowedCount: 0,
      sustainedStabilityVerified: true,
    });

    expect(
      evidence.repeatedCycles.every(
        (cycle) =>
          cycle.routineCoverageVerified &&
          cycle.qualityThresholdPassed &&
          cycle.defectContained &&
          cycle.recoveryConsistent &&
          cycle.escalationConsistent &&
          cycle.auditContinuityVerified &&
          cycle.tenantBoundaryPreserved &&
          cycle.ownerControlPreserved &&
          cycle.regressionGatePassed &&
          !cycle.unauthorizedProgressionAllowed,
      ),
    ).toBe(true);
  });

  it("does not claim actual operation or Founder Liberation", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

    expect(record.evidence.actualRoutineTaskExecuted).toBe(false);
    expect(record.evidence.actualSustainedOperationPerformed).toBe(false);
    expect(record.evidence.actualCustomerOrProductionDataUsed).toBe(false);
    expect(record.evidence.founderRoutineExecutionReductionClaimed).toBe(false);
    expect(record.evidence.founderLiberationClaimed).toBe(false);
    expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
  });

  it("executes seven evidence items and blocks sequence eight", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

    expect(
      record.evidence.sequenceLedger.filter(
        (entry) => entry.evidenceExecutionPerformed,
      ),
    ).toHaveLength(7);
    expect(record.authorityBoundary.sequenceEightEvidenceExecutionAuthorized).toBe(
      false,
    );
  });

  it("rejects copied review, premature execution, and tampering", () => {
    const review =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;
    const copiedReview = { ...review } as typeof review;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
        { ...canonicalInput(), sourceOwnerReview: copiedReview },
      ),
    ).toThrow("Only the canonical approved sequence-six owner review");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
        {
          ...canonicalInput(),
          executedAt: new Date(Date.parse(review.decidedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-six owner review");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution(
        tampered,
      ),
    ).toThrow();
  });
});