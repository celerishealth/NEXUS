import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution";

import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-four-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION" as const,
    reason:
      "Owner reviewed the deterministic synthetic failure-and-recovery evidence, confirmed fail-closed pause, bounded rollback, idempotent retry, duplicate rejection, safe resume, owner-controlled restoration, and complete audit evidence, confirmed no actual recovery action or routine task executed, and authorized only bounded synthetic evidence sequence five.",
    decidedAt: new Date(Date.parse(execution.executedAt) + 1).toISOString(),
  };
}

describe(
  "Founder routine execution reduction sequence-four owner review",
  () => {
    it("accepts sequence four and authorizes only sequence five", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        evidenceSequence: 4,
        controlId: "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceFourClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE",
      });
    });

    it("records complete recovery evidence", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record.reviewedEvidence).toMatchObject({
        evaluatedScenarioCount: 6,
        failureDetectedScenarioCount: 6,
        failClosedPauseScenarioCount: 6,
        boundedRollbackScenarioCount: 3,
        idempotentRetryScenarioCount: 4,
        duplicateRejectionScenarioCount: 3,
        safeResumeScenarioCount: 2,
        ownerControlledRestorationScenarioCount: 6,
        completeAuditEvidenceScenarioCount: 6,
        unauthorizedResumeAllowedCount: 0,
        duplicateExecutionAllowedCount: 0,
        uncontrolledRestorationAllowedCount: 0,
        deterministicRecoveryVerified: true,
        completeRecoveryEvidenceVerified: true,
        actualRoutineTaskExecuted: false,
        actualRollbackPerformed: false,
        actualRetryPerformed: false,
        actualResumePerformed: false,
        actualRestorationPerformed: false,
      });
    });

    it("keeps every consequential authority blocked", () => {
      const boundary =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          canonicalInput(),
        ).authorityBoundary;

      expect(boundary).toMatchObject({
        sequenceFiveSyntheticEvidenceAuthorized: true,
        nextEvidenceExecutionAuthorized: true,
        actualRoutineTaskExecutionAuthorized: false,
        actualRollbackExecutionAuthorized: false,
        actualRetryExecutionAuthorized: false,
        actualResumeExecutionAuthorized: false,
        actualRestorationExecutionAuthorized: false,
        unauthorizedResumeAuthorized: false,
        duplicateExecutionAuthorized: false,
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

    it("retains sequence four safely when rejected", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decision:
              "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION",
          },
        );

      expect(record.executionAccepted).toBe(false);
      expect(record.evidenceAccepted).toBe(false);
      expect(record.sequenceFourClosed).toBe(false);
      expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(
        false,
      );
      expect(record.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects copied execution, wrong owner, premature review, and tampering", () => {
      const execution =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;
      const copiedExecution = { ...execution } as typeof execution;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            sourceExecution: copiedExecution,
          },
        ),
      ).toThrow("Only the canonical sequence-four execution");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            ownerId: "unauthorized-owner",
          },
        ),
      ).toThrow("Owner identity is invalid");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decidedAt: new Date(
              Date.parse(execution.executedAt) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede sequence-four execution");

      const valid =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          canonicalInput(),
        );
      const tampered = {
        ...valid,
        authorityBoundary: {
          ...valid.authorityBoundary,
          actualResumeExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);