import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision";

describe(
  "Founder routine execution reduction sequence-two canonical owner approval",
  () => {
    it("records explicit approval and authorizes only synthetic sequence three", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record.executionAccepted).toBe(true);
      expect(record.evidenceAccepted).toBe(true);
      expect(record.sequenceTwoClosed).toBe(true);
      expect(record.nextStep).toBe(
        "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_THREE",
      );
      expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(
        true,
      );
      expect(record.authorityBoundary.actualRoutineTaskExecutionAuthorized).toBe(
        false,
      );
      expect(record.authorityBoundary.repositoryReadAuthorized).toBe(false);
      expect(record.authorityBoundary.productionDeploymentAuthorized).toBe(
        false,
      );
      expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceTwoExecutionOwnerReviewDecision(
          record,
        ),
      ).not.toThrow();
    });
  },
);