import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution";
import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-one-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION" as const,
    reason:
      "Owner reviewed the deterministic synthetic routine-work coverage baseline, confirmed four modeled repeatable categories are synthetically covered, one exception category escalates, uncovered and reserved work remain blocked, no actual routine task executed, no founder reduction claim was made, and only synthetic sequence two may proceed.",
    decidedAt: new Date(
      Date.parse(execution.executedAt) + 1,
    ).toISOString(),
  };
}

describe(
  "Founder routine execution reduction sequence-one owner review",
  () => {
    it("records bounded approval for synthetic sequence two", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        evidenceSequence: 1,
        controlId: "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE",
        approved: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO",
      });

      expect(record.reviewedEvidence).toMatchObject({
        routineCategoryCount: 8,
        repeatableRoutineCategoryCount: 4,
        syntheticallyCoveredRepeatableCategoryCount: 4,
        syntheticRepeatableCoveragePercent: 100,
        actualRoutineTaskExecuted: false,
        founderTimeReductionMeasured: false,
        founderRoutineExecutionReductionClaimed: false,
      });
    });

    it("preserves all consequential authority blocks", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(record.authorityBoundary).toMatchObject({
        sequenceTwoSyntheticEvidenceAuthorized: true,
        nextEvidenceExecutionAuthorized: true,
        actualRoutineTaskExecutionAuthorized: false,
        founderRoutineExecutionReductionClaimAuthorized: false,
        founderRoutineExecutionReductionClaimed: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        filesystemMutationAuthorized: false,
        commandExecutionAuthorized: false,
        networkAccessAuthorized: false,
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

    it("supports fail-closed rejection without sequence-two authority", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decision:
              "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION",
          },
        );

      expect(record.approved).toBe(false);
      expect(
        record.authorityBoundary.nextEvidenceExecutionAuthorized,
      ).toBe(false);
      expect(record.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects copied execution, wrong owner, and premature review", () => {
      const execution =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION;
      const copiedExecution = {
        ...execution,
      } as typeof execution;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            sourceExecution: copiedExecution,
          },
        ),
      ).toThrow("Only the canonical sequence-one execution");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            ownerId: "unauthorized-owner",
          },
        ),
      ).toThrow("Owner identity is invalid");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          {
            ...canonicalInput(),
            decidedAt: new Date(
              Date.parse(execution.executedAt) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede sequence-one execution");
    });

    it("is deterministic, immutable, and detects tampering", () => {
      const first =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          canonicalInput(),
        );
      const second =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      expect(first.decisionDigest).toBe(second.decisionDigest);
      expect(Object.isFrozen(first)).toBe(true);
      expect(Object.isFrozen(first.reviewedEvidence)).toBe(true);
      expect(Object.isFrozen(first.authorityBoundary)).toBe(true);

      const tampered = {
        ...first,
        authorityBoundary: {
          ...first.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });

    it("records the explicit canonical owner approval", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record.approved).toBe(true);
      expect(record.nextStep).toBe(
        "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_TWO",
      );
      expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(
        true,
      );
      expect(record.authorityBoundary.actualRoutineTaskExecutionAuthorized).toBe(
        false,
      );
      expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecutionOwnerReviewDecision(
          record,
        ),
      ).not.toThrow();
    });  },
);