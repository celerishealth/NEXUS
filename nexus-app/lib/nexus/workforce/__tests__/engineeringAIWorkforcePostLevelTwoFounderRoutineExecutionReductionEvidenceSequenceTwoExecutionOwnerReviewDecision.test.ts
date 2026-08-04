import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecution";

import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-two-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION" as const,
    reason:
      "Owner reviewed the deterministic synthetic authority-boundary matrix, confirmed all eight founder-reserved authority classes remain blocked from autonomous execution and require explicit owner review, confirmed no credential, financial, legal, production, customer, public-launch, or emergency authority transferred, and authorized only bounded synthetic evidence sequence three.",
    decidedAt: new Date(Date.parse(execution.executedAt) + 1).toISOString(),
  };
}

describe(
  "Founder routine execution reduction sequence-two owner review",
  () => {
    it("accepts sequence two and authorizes only sequence three", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        evidenceSequence: 2,
        controlId: "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceTwoClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE",
      });
    });

    it("records the complete reviewed authority evidence", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record.reviewedEvidence).toMatchObject({
        authorityCaseCount: 8,
        autonomouslyExecutableAuthorityCount: 0,
        explicitOwnerReviewRequiredCount: 8,
        failClosedAuthorityCount: 8,
        unauthorizedDelegationCount: 0,
        actualAuthorityTransferred: false,
        actualCredentialAccessPerformed: false,
        actualFinancialCommitmentPerformed: false,
        actualLegalCommitmentPerformed: false,
        actualProductionActionPerformed: false,
        actualCustomerContactPerformed: false,
        actualPublicLaunchPerformed: false,
        actualEmergencyControlTransferred: false,
        ownerFinalAuthorityPreserved: true,
        deterministicBoundaryVerified: true,
      });
    });

    it("keeps every consequential authority blocked", () => {
      const boundary =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          canonicalInput(),
        ).authorityBoundary;

      expect(boundary).toMatchObject({
        sequenceThreeSyntheticEvidenceAuthorized: true,
        nextEvidenceExecutionAuthorized: true,
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

    it("retains sequence two safely when rejected", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decision:
              "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION",
          },
        );

      expect(record.executionAccepted).toBe(false);
      expect(record.evidenceAccepted).toBe(false);
      expect(record.sequenceTwoClosed).toBe(false);
      expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(
        false,
      );
      expect(record.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects copied execution, wrong owner, premature review, and tampering", () => {
      const execution =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION;
      const copiedExecution = { ...execution } as typeof execution;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            sourceExecution: copiedExecution,
          },
        ),
      ).toThrow("Only the canonical sequence-two execution");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            ownerId: "unauthorized-owner",
          },
        ),
      ).toThrow("Owner identity is invalid");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decidedAt: new Date(
              Date.parse(execution.executedAt) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede sequence-two execution");

      const valid =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          canonicalInput(),
        );
      const tampered = {
        ...valid,
        authorityBoundary: {
          ...valid.authorityBoundary,
          productionDeploymentAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);