import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceThreeExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-four-test-001",
    sourceOwnerReview: review,
    executedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe(
  "Founder routine execution reduction evidence sequence four",
  () => {
    it("creates deterministic failure and recovery evidence", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        evidenceSequence: 4,
        controlId: "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS",
        evidenceExecutionPerformed: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW",
      });

      expect(record.evidence).toMatchObject({
        evaluatedScenarioCount: 6,
        failureDetectedScenarioCount: 6,
        failClosedPauseScenarioCount: 6,
        boundedRollbackScenarioCount: 3,
        idempotentRetryScenarioCount: 4,
        duplicateRejectionScenarioCount: 3,
        safeResumeScenarioCount: 2,
        ownerControlledRestorationScenarioCount: 6,
        completeAuditEvidenceScenarioCount: 6,
      });
    });

    it("proves fail-closed recovery and duplicate prevention", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .evidence;

      expect(evidence.unauthorizedResumeAllowedCount).toBe(0);
      expect(evidence.duplicateExecutionAllowedCount).toBe(0);
      expect(evidence.uncontrolledRestorationAllowedCount).toBe(0);
      expect(evidence.deterministicRecoveryVerified).toBe(true);
      expect(evidence.completeRecoveryEvidenceVerified).toBe(true);
      expect(
        evidence.recoveryScenarios.every(
          (scenario) =>
            scenario.failureDetected &&
            scenario.failClosedPauseApplied &&
            scenario.ownerControlledRestorationRequired &&
            scenario.auditEvidenceComplete,
        ),
      ).toBe(true);
    });

    it("executes four evidence items and blocks the remaining four", () => {
      const ledger =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .evidence.sequenceLedger;

      expect(
        ledger.filter((entry) => entry.evidenceExecutionPerformed),
      ).toHaveLength(4);
      expect(
        ledger.filter((entry) => !entry.evidenceExecutionPerformed),
      ).toHaveLength(4);
      expect(ledger[3]?.controlId).toBe(
        "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS",
      );
    });

    it("blocks sequence five and all actual authority", () => {
      const boundary =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .authorityBoundary;

      expect(boundary).toMatchObject({
        sequenceFiveEvidenceExecutionAuthorized: false,
        nextEvidenceExecutionAuthorized: false,
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

    it("rejects copied review, premature execution, and tampering", () => {
      const review =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;
      const copiedReview = { ...review } as typeof review;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
          {
            ...canonicalInput(),
            sourceOwnerReview: copiedReview,
          },
        ),
      ).toThrow("Only the canonical approved sequence-three owner review");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
          {
            ...canonicalInput(),
            executedAt: new Date(
              Date.parse(review.decidedAt) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede sequence-three owner review");

      const valid =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
          canonicalInput(),
        );
      const tampered = {
        ...valid,
        authorityBoundary: {
          ...valid.authorityBoundary,
          actualResumeExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);