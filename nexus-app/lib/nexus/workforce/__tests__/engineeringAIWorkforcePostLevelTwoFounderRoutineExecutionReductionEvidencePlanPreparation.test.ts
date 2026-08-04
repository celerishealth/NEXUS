import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PROFILES,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

  return {
    preparationId: canonical.preparationId,
    sourcePriorWorkstreamClosure:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION,
    preparedAt: canonical.preparedAt,
  };
}

describe(
  "Engineering Founder Routine Execution Reduction evidence-plan preparation",
  () => {
    it("prepares exactly eight bounded evidence items", () => {
      const plan =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

      expect(plan).toMatchObject({
        workstreamSequence: 4,
        workstreamId:
          "founder-routine-execution-reduction-evidence",
        objective:
          "Define measurable evidence for reducing founder routine engineering execution while preserving final owner authority.",
        completionEvidenceRequired:
          "Verified routine-work coverage, quality, recovery, escalation, and owner-acceptance evidence.",
        evidenceClass:
          "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE",
        planOnly: true,
        evidenceItemCount: 8,
        ownerEvidencePlanReviewRequired: true,
        ownerEvidencePlanReviewRecorded: false,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW",
      });

      expect(plan.evidenceItems).toHaveLength(8);
      expect(
        ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PROFILES,
      ).toHaveLength(8);
    });

    it("covers coverage, quality, recovery, escalation, measurement, stability, and owner acceptance", () => {
      const plan =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

      expect(
        plan.evidenceItems.map(
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

      expect(plan.summary).toMatchObject({
        evidenceItemCount: 8,
        syntheticSanitizedEvidenceItemCount: 8,
        planOnlyEvidenceItemCount: 8,
        routineWorkCoverageRequiredCount: 8,
        qualityThresholdRequiredCount: 8,
        recoveryEvidenceRequiredCount: 8,
        escalationEvidenceRequiredCount: 8,
        founderInterventionMeasurementRequiredCount: 8,
        ownerAcceptanceRequiredCount: 8,
        founderLiberationSeparationRequiredCount: 8,
        evidenceExecutionAuthorizedCount: 0,
        taskExecutionAuthorizedCount: 0,
        repositoryReadAuthorizedCount: 0,
        repositoryWriteAuthorizedCount: 0,
      });
    });

    it("authorizes planning only and grants no execution or liberation authority", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION
          .authorityBoundary,
      ).toMatchObject({
        evidencePlanningOnly: true,
        priorWorkstreamClosed: true,
        exactEightEvidenceItemsRequired: true,
        workstreamFourPlanPreparationAuthorized: true,
        workstreamFourPlanPreparationPerformed: true,
        workstreamFourEvidenceExecutionAuthorized: false,
        founderRoutineExecutionReductionPlanningAuthorized: true,
        founderRoutineExecutionReductionPlanPrepared: true,
        founderRoutineExecutionReductionEvidenceAuthorized: false,
        founderRoutineExecutionReductionExecutionAuthorized: false,
        founderRoutineExecutionReductionClaimAuthorized: false,
        founderRoutineExecutionReductionClaimed: false,
        founderLiberationAssessmentAuthorized: false,
        founderLiberationAcceptanceAuthorized: false,
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

    it("replays deterministically", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.preparationDigest).toMatch(
        /^[0-9a-f]{64}$/,
      );
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(
        Object.isFrozen(canonical.evidenceItems),
      ).toBe(true);
      expect(
        canonical.evidenceItems.every(
          (item) =>
            Object.isFrozen(item) &&
            /^[0-9a-f]{64}$/.test(
              item.evidenceItemDigest,
            ),
        ),
      ).toBe(true);
    });

    it("rejects copied closure decision and detects tampering", () => {
      const copiedClosureDecision = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation({
          ...canonicalInput(),
          sourcePriorWorkstreamClosure:
            copiedClosureDecision,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          workstreamFourEvidenceExecutionAuthorized:
            true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation(
          tampered,
        ),
      ).toThrow();
    });
  },
);