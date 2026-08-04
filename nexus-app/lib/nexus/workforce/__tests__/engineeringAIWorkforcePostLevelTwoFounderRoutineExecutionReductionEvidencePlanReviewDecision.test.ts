import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering Founder Routine Execution Reduction evidence-plan review",
  () => {
    it("accepts the plan and authorizes only execution-decision preparation", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 4,
        workstreamId:
          "founder-routine-execution-reduction-evidence",
        evidenceClass:
          "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE",
        evidencePlanAccepted: true,
        evidencePlanReviewRecorded: true,
        nextStep:
          "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION",
      });

      expect(
        record.authorityBoundary,
      ).toMatchObject({
        evidencePlanAccepted: true,
        evidenceExecutionDecisionPreparationAuthorized:
          true,
        evidenceExecutionDecisionPreparationPerformed:
          false,
        onlyEvidenceExecutionDecisionPreparationAuthorizedNext:
          true,
      });
    });

    it("accepts all eight bounded evidence controls", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION
          .reviewedEvidencePlan,
      ).toMatchObject({
        planOnly: true,
        evidenceItemCount: 8,
        deterministicEvidenceRequiredCount: 8,
        independentValidationRequiredCount: 8,
        ownerReviewRequiredCount: 8,
        monitoringRequiredCount: 8,
        emergencyPauseRequiredCount: 8,
        rollbackEvidenceRequiredCount: 8,
        routineWorkCoverageRequiredCount: 8,
        qualityThresholdRequiredCount: 8,
        recoveryEvidenceRequiredCount: 8,
        escalationEvidenceRequiredCount: 8,
        founderInterventionMeasurementRequiredCount:
          8,
        ownerAcceptanceRequiredCount: 8,
        founderLiberationSeparationRequiredCount:
          8,
        evidenceExecutionAuthorizedCount: 0,
        taskExecutionAuthorizedCount: 0,
        repositoryReadAuthorizedCount: 0,
        repositoryWriteAuthorizedCount: 0,
        commandExecutionAuthorizedCount: 0,
        networkAccessAuthorizedCount: 0,
        productionDeploymentAuthorizedCount: 0,
        paymentExecutionAuthorizedCount: 0,
        publicLaunchAuthorizedCount: 0,
      });

      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION
          .reviewedEvidencePlan.evidenceControlIds,
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
    });

    it("grants no evidence execution or Founder Liberation authority", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        workstreamFourEvidenceExecutionAuthorized:
          false,
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
        actualRepositoryEvaluationAuthorized: false,
        actualRepositoryEvaluationPerformed: false,
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
        founderReleasedFromRoutineExecution: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("retains the plan safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision({
          ...canonicalInput(),
          decisionId:
            "founder-routine-execution-reduction-evidence-plan-review-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN",
        });

      expect(
        rejected.evidencePlanAccepted,
      ).toBe(false);

      expect(
        rejected.authorityBoundary
          .evidenceExecutionDecisionPreparationAuthorized,
      ).toBe(false);

      expect(
        rejected.authorityBoundary
          .onlyEvidenceExecutionDecisionPreparationAuthorizedNext,
      ).toBe(false);
    });

    it("rejects copied preparation and detects tampering", () => {
      const copiedPreparation = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision({
          ...canonicalInput(),
          sourcePreparation:
            copiedPreparation,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          workstreamFourEvidenceExecutionAuthorized:
            true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);