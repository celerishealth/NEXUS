import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

  return {
    preparationId: canonical.preparationId,
    sourcePlanReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION,
    preparedAt: canonical.preparedAt,
  };
}

describe(
  "Engineering Founder Routine Execution Reduction evidence execution-decision preparation",
  () => {
    it("prepares exactly eight bounded owner decisions", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      expect(record).toMatchObject({
        preparationState:
          "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED",
        workstreamSequence: 4,
        workstreamId:
          "founder-routine-execution-reduction-evidence",
        evidenceClass:
          "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE",
        decisionPreparationOnly: true,
        evidenceDecisionPreparationCount: 8,
        ownerExecutionDecisionReviewRequired: true,
        ownerExecutionDecisionReviewRecorded:
          false,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_REVIEW",
      });

      expect(
        record.evidenceDecisionPreparations,
      ).toHaveLength(8);
    });

    it("binds the canonical accepted plan review and all controls", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      expect(
        record.sourceEvidencePlanReviewDecisionId,
      ).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION
          .decisionId,
      );

      expect(
        record.evidenceDecisionPreparations.map(
          (item) => item.controlId,
        ),
      ).toEqual([
        "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE",
        "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY",
        "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD",
        "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS",
        "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY",
        "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT",
        "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY",
        "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE",
      ]);

      expect(
        new Set(
          record.evidenceDecisionPreparations.map(
            (item) =>
              item.decisionPreparationDigest,
          ),
        ).size,
      ).toBe(8);
    });

    it("records zero execution and consequential authority", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      expect(record.summary).toMatchObject({
        evidenceDecisionPreparationCount: 8,
        ownerExecutionDecisionRequiredCount: 8,
        ownerExecutionDecisionRecordedCount: 0,
        maximumEvidenceExecutionCount: 1,
        aggregateConcurrentExecutionLimit: 0,
        evidenceExecutionAuthorizedCount: 0,
        evidenceExecutionPerformedCount: 0,
        taskExecutionAuthorizedCount: 0,
        repositoryEvaluationAuthorizedCount: 0,
        repositoryReadAuthorizedCount: 0,
        repositoryWriteAuthorizedCount: 0,
        filesystemReadAuthorizedCount: 0,
        filesystemMutationAuthorizedCount: 0,
        commandExecutionAuthorizedCount: 0,
        packageExecutionAuthorizedCount: 0,
        networkAccessAuthorizedCount: 0,
        productionDeploymentAuthorizedCount: 0,
        paymentExecutionAuthorizedCount: 0,
        publicLaunchAuthorizedCount: 0,
        uniqueDecisionPreparationDigestCount: 8,
      });

      expect(
        record.authorityBoundary,
      ).toMatchObject({
        decisionPreparationOnly: true,
        workstreamFourEvidenceExecutionDecisionPreparationAuthorized:
          true,
        workstreamFourEvidenceExecutionDecisionPreparationPerformed:
          true,
        workstreamFourEvidenceExecutionAuthorized:
          false,
        oneAtATimeEvidenceExecutionRequired:
          true,
        aggregateConcurrentExecutionLimit: 0,
        founderRoutineExecutionReductionEvidenceAuthorized:
          false,
        founderRoutineExecutionReductionExecutionAuthorized:
          false,
        founderRoutineExecutionReductionClaimAuthorized:
          false,
        founderRoutineExecutionReductionClaimed:
          false,
        founderLiberationAssessmentAuthorized:
          false,
        founderLiberationAcceptanceAuthorized:
          false,
        taskExecutionAuthorized: false,
        actualRepositoryEvaluationAuthorized:
          false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        filesystemReadAuthorized: false,
        filesystemMutationAuthorized: false,
        commandExecutionAuthorized: false,
        packageExecutionAuthorized: false,
        networkAccessAuthorized: false,
        productionDeploymentAuthorized: false,
        paymentExecutionAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution:
          false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("replays deterministically", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.preparationDigest).toMatch(
        /^[0-9a-f]{64}$/,
      );
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(
        Object.isFrozen(
          canonical.evidenceDecisionPreparations,
        ),
      ).toBe(true);
    });

    it("rejects copied plan review and detects tampering", () => {
      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation({
          ...canonicalInput(),
          sourcePlanReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          workstreamFourEvidenceExecutionAuthorized:
            true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation(
          tampered,
        ),
      ).toThrow();
    });
  },
);