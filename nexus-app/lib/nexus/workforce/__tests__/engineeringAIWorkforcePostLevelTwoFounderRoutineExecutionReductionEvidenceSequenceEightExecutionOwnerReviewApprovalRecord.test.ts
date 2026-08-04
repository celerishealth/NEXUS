import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision";

describe("Founder routine execution reduction sequence-eight canonical owner approval", () => {
  it("accepts all eight synthetic controls and authorizes only formal closure preparation", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

    expect(record.executionAccepted).toBe(true);
    expect(record.evidenceAccepted).toBe(true);
    expect(record.sequenceEightClosed).toBe(true);
    expect(record.allEightSyntheticEvidenceItemsAccepted).toBe(true);
    expect(record.nextStep).toBe(
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_FORMAL_CLOSURE",
    );

    expect(record.reviewedEvidence).toMatchObject({
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

    expect(record.authorityBoundary).toMatchObject({
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

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceEightExecutionOwnerReviewDecision(
        record,
      ),
    ).not.toThrow();
  });
});