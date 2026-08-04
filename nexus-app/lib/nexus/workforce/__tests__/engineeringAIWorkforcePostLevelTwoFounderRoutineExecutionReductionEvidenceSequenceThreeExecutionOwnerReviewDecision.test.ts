import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecution";

import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-three-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION" as const,
    reason:
      "Owner reviewed the deterministic synthetic quality-threshold evidence, confirmed three passing results, three rejected results, correction and regression controls, zero acceptance of below-threshold or safety-failing work, confirmed no actual routine task or owner acceptance was executed, and authorized only bounded synthetic evidence sequence four.",
    decidedAt: new Date(Date.parse(execution.executedAt) + 1).toISOString(),
  };
}

describe(
  "Founder routine execution reduction sequence-three owner review",
  () => {
    it("accepts sequence three and authorizes only sequence four", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        evidenceSequence: 3,
        controlId: "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceThreeClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR",
      });
    });

    it("records all quality threshold evidence", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record.reviewedEvidence).toMatchObject({
        evaluatedTaskResultCount: 6,
        passingResultCount: 3,
        rejectedResultCount: 3,
        correctionRequiredResultCount: 3,
        regressionDetectedResultCount: 1,
        ownerAcceptanceEligibleResultCount: 3,
        belowThresholdResultAcceptedCount: 0,
        safetyFailureAcceptedCount: 0,
        zeroBelowThresholdAcceptanceVerified: true,
        deterministicThresholdEvaluationVerified: true,
        actualRoutineTaskExecuted: false,
        actualOwnerAcceptancePerformed: false,
        founderRoutineExecutionReductionClaimed: false,
      });
    });

    it("keeps all consequential authority blocked", () => {
      const boundary =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          canonicalInput(),
        ).authorityBoundary;

      expect(boundary).toMatchObject({
        sequenceFourSyntheticEvidenceAuthorized: true,
        nextEvidenceExecutionAuthorized: true,
        actualRoutineTaskExecutionAuthorized: false,
        belowThresholdAcceptanceAuthorized: false,
        ownerAcceptanceExecutionAuthorized: false,
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

    it("retains sequence three safely when rejected", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decision:
              "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION",
          },
        );

      expect(record.executionAccepted).toBe(false);
      expect(record.evidenceAccepted).toBe(false);
      expect(record.sequenceThreeClosed).toBe(false);
      expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(
        false,
      );
      expect(record.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects copied execution, wrong owner, premature review, and tampering", () => {
      const execution =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION;
      const copiedExecution = { ...execution } as typeof execution;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            sourceExecution: copiedExecution,
          },
        ),
      ).toThrow("Only the canonical sequence-three execution");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            ownerId: "unauthorized-owner",
          },
        ),
      ).toThrow("Owner identity is invalid");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decidedAt: new Date(
              Date.parse(execution.executedAt) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede sequence-three execution");

      const valid =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          canonicalInput(),
        );
      const tampered = {
        ...valid,
        authorityBoundary: {
          ...valid.authorityBoundary,
          belowThresholdAcceptanceAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);