import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision";

describe("Founder routine execution reduction canonical workstream closure approval", () => {
  it("formally closes only the synthetic evidence workstream", () => {
    const record =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION;

    expect(record.closurePreparationAccepted).toBe(true);
    expect(record.formalClosureDecisionRecorded).toBe(true);
    expect(record.workstreamClosureAuthorized).toBe(true);
    expect(record.workstreamClosurePerformed).toBe(true);
    expect(record.workstreamClosed).toBe(true);

    expect(record.nextStep).toBe(
      "RETAIN_FOUNDER_LIBERATION_LEVEL_TWO_PENDING_ACTUAL_OPERATIONAL_EVIDENCE_AND_SEPARATE_FORMAL_ASSESSMENT",
    );

    expect(record.reviewedClosureEvidence).toMatchObject({
      requiredEvidenceSequenceCount: 8,
      completedEvidenceSequenceCount: 8,
      acceptedOwnerReviewCount: 8,
      failedEvidenceAreaCount: 0,
      missingEvidenceAreaCount: 0,
      auditGapCount: 0,
      authorityBoundaryFailureCount: 0,
      actualRoutineTaskExecuted: false,
      actualFounderTimeReductionMeasured: false,
      actualFounderTimeReductionVerified: false,
      founderLiberationAchieved: false,
      founderLiberationRemainsLevelTwo: true,
    });

    expect(record.authorityBoundary).toMatchObject({
      workstreamFourClosureAuthorized: true,
      workstreamFourClosurePerformed: true,
      workstreamFourClosed: true,
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
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        record,
      ),
    ).not.toThrow();
  });
});