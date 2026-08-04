import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision";

describe("Founder routine execution reduction sequence-six canonical owner approval", () => {
  it("records approval and authorizes only synthetic sequence seven", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

    expect(record.executionAccepted).toBe(true);
    expect(record.evidenceAccepted).toBe(true);
    expect(record.sequenceSixClosed).toBe(true);
    expect(record.nextStep).toBe(
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SEVEN",
    );

    expect(record.reviewedEvidence).toMatchObject({
      boundedWorkloadUnitCount: 20,
      modeledTouchpointReductionPercent: 60,
      modeledInterventionReductionPercent: 62.5,
      modeledCorrectionReductionPercent: 62.5,
      retainedOwnerDecisionLoadPreserved: true,
      reducedActivityNotLiberationProof: true,
      actualFounderMinutesMeasured: false,
      actualFounderTimeReduced: false,
      actualRoutineTaskExecuted: false,
      founderLiberationClaimed: false,
    });

    expect(record.authorityBoundary).toMatchObject({
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

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceSixExecutionOwnerReviewDecision(
        record,
      ),
    ).not.toThrow();
  });
});