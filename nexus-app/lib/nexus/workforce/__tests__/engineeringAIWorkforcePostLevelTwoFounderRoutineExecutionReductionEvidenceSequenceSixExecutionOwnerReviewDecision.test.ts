import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecution";

import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-six-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION" as const,
    reason:
      "Owner reviewed the deterministic synthetic before-and-after measurement plan, confirmed bounded workload units, founder touchpoints, intervention, review, correction, routine execution, escalation load, and retained decision load are explicitly measured, confirmed modeled reductions are not actual time-reduction or liberation evidence, and authorized only bounded synthetic sequence seven.",
    decidedAt: new Date(Date.parse(execution.executedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction sequence-six owner review", () => {
  it("accepts sequence six and authorizes only sequence seven", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      workstreamSequence: 4,
      evidenceSequence: 6,
      controlId: "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT",
      executionAccepted: true,
      evidenceAccepted: true,
      sequenceSixClosed: true,
      nextStep:
        "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN",
    });
  });

  it("records bounded modeled measurement evidence", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        canonicalInput(),
      );

    expect(record.reviewedEvidence).toMatchObject({
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
      reducedActivityNotLiberationProof: true,
      actualFounderMinutesMeasured: false,
      actualFounderTimeReduced: false,
      actualRoutineTaskExecuted: false,
      founderLiberationClaimed: false,
    });
  });

  it("keeps every consequential authority blocked", () => {
    const boundary =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        canonicalInput(),
      ).authorityBoundary;

    expect(boundary).toMatchObject({
      sequenceSevenSyntheticEvidenceAuthorized: true,
      nextEvidenceExecutionAuthorized: true,
      actualRoutineTaskExecutionAuthorized: false,
      actualFounderTimeMeasurementAuthorized: false,
      actualFounderTimeReductionClaimAuthorized: false,
      reducedActivityLiberationInferenceAuthorized: false,
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

  it("retains sequence six safely when rejected", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decision:
            "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION",
        },
      );

    expect(record.executionAccepted).toBe(false);
    expect(record.evidenceAccepted).toBe(false);
    expect(record.sequenceSixClosed).toBe(false);
    expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(false);
  });

  it("rejects copied execution, wrong owner, premature review, and tampering", () => {
    const execution =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION;
    const copiedExecution = { ...execution } as typeof execution;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        { ...canonicalInput(), sourceExecution: copiedExecution },
      ),
    ).toThrow("Only the canonical sequence-six execution");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        { ...canonicalInput(), ownerId: "unauthorized-owner" },
      ),
    ).toThrow("Owner identity is invalid");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decidedAt: new Date(Date.parse(execution.executedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-six execution");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        tampered,
      ),
    ).toThrow();
  });
});