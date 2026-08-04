import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecution";
import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-seven-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION" as const,
    reason:
      "Owner reviewed six deterministic synthetic stability cycles and confirmed routine coverage, quality thresholds, defect containment, recovery consistency, escalation consistency, audit continuity, tenant isolation, owner control, and regression gates remained stable without unauthorized progression; no actual sustained operation or routine task occurred, and only bounded synthetic sequence eight is authorized.",
    decidedAt: new Date(Date.parse(execution.executedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction sequence-seven owner review", () => {
  it("accepts sequence seven and authorizes only sequence eight", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      evidenceSequence: 7,
      executionAccepted: true,
      evidenceAccepted: true,
      sequenceSevenClosed: true,
      nextStep:
        "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT",
    });
  });

  it("records complete sustained-stability evidence", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        canonicalInput(),
      );

    expect(record.reviewedEvidence).toMatchObject({
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
      actualRoutineTaskExecuted: false,
      actualSustainedOperationPerformed: false,
      founderLiberationClaimed: false,
    });
  });

  it("keeps consequential authority blocked", () => {
    const boundary =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        canonicalInput(),
      ).authorityBoundary;

    expect(boundary).toMatchObject({
      sequenceEightSyntheticEvidenceAuthorized: true,
      nextEvidenceExecutionAuthorized: true,
      actualRoutineTaskExecutionAuthorized: false,
      actualSustainedOperationAuthorized: false,
      repositoryReadAuthorized: false,
      repositoryWriteAuthorized: false,
      productionDeploymentAuthorized: false,
      paymentExecutionAuthorized: false,
      publicLaunchAuthorized: false,
      levelThreeAuthorityGranted: false,
      founderLiberationAssessmentAuthorized: false,
      founderLiberationAchieved: false,
      founderReleasedFromRoutineExecution: false,
      ownerFinalAuthorityPreserved: true,
    });
  });

  it("retains sequence seven safely when rejected", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decision:
            "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION",
        },
      );

    expect(record.executionAccepted).toBe(false);
    expect(record.sequenceSevenClosed).toBe(false);
    expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(false);
  });

  it("rejects copied execution, wrong owner, premature review, and tampering", () => {
    const execution =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;
    const copiedExecution = { ...execution } as typeof execution;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        { ...canonicalInput(), sourceExecution: copiedExecution },
      ),
    ).toThrow("Only the canonical sequence-seven execution");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        { ...canonicalInput(), ownerId: "unauthorized-owner" },
      ),
    ).toThrow("Owner identity is invalid");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decidedAt: new Date(Date.parse(execution.executedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-seven execution");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSevenExecutionOwnerReviewDecision(
        tampered,
      ),
    ).toThrow();
  });
});