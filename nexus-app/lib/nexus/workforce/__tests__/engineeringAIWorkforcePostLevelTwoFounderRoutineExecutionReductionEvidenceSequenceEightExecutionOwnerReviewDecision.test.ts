import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecution";
import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-eight-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION" as const,
    reason:
      "Owner reviewed the synthetic final evidence summary and confirmed all eight required controls contain bounded synthetic evidence, accepted the final sequence for formal workstream closure preparation, and explicitly confirmed this does not prove actual routine execution, actual founder-time reduction, Level 3 authority, production authority, customer authority, or Founder Liberation.",
    decidedAt: new Date(Date.parse(execution.executedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction sequence-eight owner review", () => {
  it("accepts sequence eight and authorizes only formal closure preparation", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      evidenceSequence: 8,
      executionAccepted: true,
      evidenceAccepted: true,
      sequenceEightClosed: true,
      allEightSyntheticEvidenceItemsAccepted: true,
      nextStep:
        "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_FORMAL_CLOSURE",
    });
  });

  it("records all eight synthetic controls without liberation claims", () => {
    const reviewed =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        canonicalInput(),
      ).reviewedEvidence;

    expect(reviewed).toMatchObject({
      requiredControlCount: 8,
      syntheticEvidencePresentCount: 8,
      allRequiredSyntheticEvidencePresent: true,
      separateFounderLiberationAssessmentRequired: true,
      founderLiberationMayNotBeInferred: true,
      actualRoutineTaskExecuted: false,
      actualFounderTimeReductionMeasured: false,
      actualFounderTimeReductionVerified: false,
      actualProductionOperationPerformed: false,
      founderLiberationAssessmentPerformed: false,
      founderLiberationAchieved: false,
    });
  });

  it("keeps consequential authority blocked", () => {
    const boundary =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        canonicalInput(),
      ).authorityBoundary;

    expect(boundary).toMatchObject({
      formalWorkstreamClosurePreparationAuthorized: true,
      workstreamClosureCompleted: false,
      nextEvidenceExecutionAuthorized: false,
      actualRoutineTaskExecutionAuthorized: false,
      actualFounderTimeMeasurementAuthorized: false,
      actualFounderTimeReductionClaimAuthorized: false,
      formalFounderLiberationAssessmentAuthorized: false,
      repositoryReadAuthorized: false,
      repositoryWriteAuthorized: false,
      productionDeploymentAuthorized: false,
      paymentExecutionAuthorized: false,
      customerContactAuthorized: false,
      publicLaunchAuthorized: false,
      levelThreeAuthorityGranted: false,
      founderLiberationAssessmentAuthorized: false,
      founderLiberationAchieved: false,
      founderReleasedFromRoutineExecution: false,
      ownerFinalAuthorityPreserved: true,
    });
  });

  it("retains sequence eight safely when rejected", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decision:
            "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION",
        },
      );

    expect(record.executionAccepted).toBe(false);
    expect(record.sequenceEightClosed).toBe(false);
    expect(
      record.authorityBoundary.formalWorkstreamClosurePreparationAuthorized,
    ).toBe(false);
  });

  it("rejects copied execution, wrong owner, premature review, and tampering", () => {
    const execution =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;
    const copiedExecution = { ...execution } as typeof execution;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        { ...canonicalInput(), sourceExecution: copiedExecution },
      ),
    ).toThrow("Only the canonical sequence-eight execution");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        { ...canonicalInput(), ownerId: "unauthorized-owner" },
      ),
    ).toThrow("Owner identity is invalid");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decidedAt: new Date(Date.parse(execution.executedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-eight execution");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        tampered,
      ),
    ).toThrow();
  });
});