import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-two-test-001",
    sourceOwnerReview: review,
    executedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe(
  "Founder routine execution reduction evidence sequence two",
  () => {
    it("creates the owner-reserved authority boundary matrix", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        evidenceSequence: 2,
        controlId: "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY",
        evidenceExecutionPerformed: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW",
      });

      expect(record.evidence).toMatchObject({
        authorityCaseCount: 8,
        autonomouslyExecutableAuthorityCount: 0,
        explicitOwnerReviewRequiredCount: 8,
        failClosedAuthorityCount: 8,
        unauthorizedDelegationCount: 0,
        actualAuthorityTransferred: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("blocks every modeled founder-reserved authority", () => {
      const matrix =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .evidence.authorityMatrix;

      expect(matrix).toHaveLength(8);
      expect(
        matrix.every(
          (entry) =>
            entry.autonomousAIExecutionAllowed === false &&
            entry.explicitOwnerReviewRequired === true &&
            entry.failClosed === true,
        ),
      ).toBe(true);
    });

    it("executes two evidence items and blocks the remaining six", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

      expect(
        record.evidence.sequenceLedger
          .slice(0, 2)
          .every((entry) => entry.evidenceExecutionPerformed === true),
      ).toBe(true);
      expect(
        record.evidence.sequenceLedger
          .slice(2)
          .every(
            (entry) =>
              entry.executionState ===
                "BLOCKED_PENDING_PRIOR_OWNER_REVIEW" &&
              entry.evidenceExecutionPerformed === false,
          ),
      ).toBe(true);
    });

    it("preserves consequential authority blocks and Level 2", () => {
      const boundary =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .authorityBoundary;

      expect(boundary).toMatchObject({
        sequenceThreeEvidenceExecutionAuthorized: false,
        nextEvidenceExecutionAuthorized: false,
        actualRoutineTaskExecutionAuthorized: false,
        ownerCredentialAccessAuthorized: false,
        financialCommitmentAuthorized: false,
        legalCommitmentAuthorized: false,
        customerContactAuthorized: false,
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
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;
      const copiedReview = { ...review } as typeof review;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
          {
            ...canonicalInput(),
            sourceOwnerReview: copiedReview,
          },
        ),
      ).toThrow("Only the canonical approved sequence-one owner review");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
          {
            ...canonicalInput(),
            executedAt: new Date(
              Date.parse(review.decidedAt) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede sequence-one owner review");

      const valid =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
          canonicalInput(),
        );
      const tampered = {
        ...valid,
        authorityBoundary: {
          ...valid.authorityBoundary,
          productionDeploymentAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);