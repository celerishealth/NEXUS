import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-three-test-001",
    sourceOwnerReview: review,
    executedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe(
  "Founder routine execution reduction evidence sequence three",
  () => {
    it("creates deterministic task-quality threshold evidence", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        evidenceSequence: 3,
        controlId: "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD",
        evidenceExecutionPerformed: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW",
      });

      expect(record.evidence).toMatchObject({
        evaluatedTaskResultCount: 6,
        passingResultCount: 3,
        rejectedResultCount: 3,
        correctionRequiredResultCount: 3,
        regressionDetectedResultCount: 1,
        ownerAcceptanceEligibleResultCount: 3,
        belowThresholdResultAcceptedCount: 0,
        safetyFailureAcceptedCount: 0,
        zeroBelowThresholdAcceptanceVerified: true,
      });
    });

    it("enforces correctness completeness consistency safety and evidence thresholds", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .evidence;

      expect(evidence.qualityThresholds).toMatchObject({
        correctnessMinimumPercent: 95,
        completenessMinimumPercent: 95,
        consistencyMinimumPercent: 95,
        safetyMinimumPercent: 100,
        evidenceQualityMinimumPercent: 95,
        ownerAcceptanceMinimumPercent: 95,
        belowThresholdAcceptanceAllowed: false,
      });

      expect(
        evidence.taskResultComparisons.filter(
          (entry) => entry.ownerAcceptanceEligible,
        ),
      ).toHaveLength(3);
      expect(
        evidence.taskResultComparisons.filter(
          (entry) =>
            !entry.ownerAcceptanceEligible &&
            entry.outcome.startsWith("REJECT"),
        ),
      ).toHaveLength(3);
    });

    it("records correction regression and zero below-threshold acceptance", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .evidence;

      expect(
        evidence.taskResultComparisons.filter(
          (entry) => entry.correctionRequired,
        ),
      ).toHaveLength(3);
      expect(
        evidence.taskResultComparisons.filter(
          (entry) => entry.regressionDetected,
        ),
      ).toHaveLength(1);
      expect(evidence.belowThresholdResultAcceptedCount).toBe(0);
      expect(evidence.safetyFailureAcceptedCount).toBe(0);
    });

    it("blocks sequence four and all consequential authority", () => {
      const boundary =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .authorityBoundary;

      expect(boundary).toMatchObject({
        sequenceFourEvidenceExecutionAuthorized: false,
        nextEvidenceExecutionAuthorized: false,
        belowThresholdAcceptanceAuthorized: false,
        ownerAcceptanceExecutionAuthorized: false,
        actualRoutineTaskExecutionAuthorized: false,
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

    it("rejects copied review, premature execution, and tampering", () => {
      const review =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;
      const copiedReview = { ...review } as typeof review;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
          {
            ...canonicalInput(),
            sourceOwnerReview: copiedReview,
          },
        ),
      ).toThrow("Only the canonical approved sequence-two owner review");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
          {
            ...canonicalInput(),
            executedAt: new Date(
              Date.parse(review.decidedAt) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede sequence-two owner review");

      const valid =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
          canonicalInput(),
        );
      const tampered = {
        ...valid,
        authorityBoundary: {
          ...valid.authorityBoundary,
          belowThresholdAcceptanceAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);