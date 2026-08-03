import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_PROFILES,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

  return {
    preparationId: canonical.preparationId,
    sourcePriorWorkstreamClosureDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION,
    preparedAt: canonical.preparedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evaluation evidence-plan preparation",
  () => {
    it("prepares exactly eight deterministic plan-only controls", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

      expect(record).toMatchObject({
        preparationState:
          "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARED",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceClass:
          "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE",
        planOnly: true,
        evidenceItemCount: 8,
        ownerEvidencePlanReviewRequired: true,
        ownerEvidencePlanReviewRecorded: false,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW",
      });

      expect(record.evidenceItems).toHaveLength(8);
    });

    it("covers all required controls exactly once", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

      expect(
        record.evidenceItems.map((item) => item.controlId),
      ).toEqual(
        ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE_PROFILES.map(
          (profile) => profile.controlId,
        ),
      );

      expect(
        new Set(record.evidenceItems.map((item) => item.controlId)).size,
      ).toBe(8);
    });

    it("keeps every evidence item plan-only and fail closed", () => {
      for (
        const item of
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION
          .evidenceItems
      ) {
        expect(item).toMatchObject({
          dataClassification: "SYNTHETIC_SANITIZED_ONLY",
          outputMode: "PLAN_ONLY",
          evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY",
          deterministicEvidenceRequired: true,
          independentValidationRequired: true,
          ownerReviewRequired: true,
          monitoringRequired: true,
          emergencyPauseRequired: true,
          rollbackEvidenceRequired: true,
          pathContainmentRequired: true,
          secretExclusionRequired: true,
          immutableAuditRequired: true,
          planPreparationAuthorized: true,
          evidenceExecutionAuthorized: false,
          repositoryEvaluationAuthorized: false,
          repositoryReadAuthorized: false,
          repositoryWriteAuthorized: false,
          filesystemMutationAuthorized: false,
          gitMutationAuthorized: false,
          commandExecutionAuthorized: false,
          packageExecutionAuthorized: false,
          networkAccessAuthorized: false,
          productionDeploymentAuthorized: false,
          paymentExecutionAuthorized: false,
          publicLaunchAuthorized: false,
        });

        expect(item.evidenceItemDigest).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it("records zero execution and repository authority", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

      expect(record.summary).toMatchObject({
        evidenceItemCount: 8,
        planPreparationAuthorizedCount: 8,
        evidenceExecutionAuthorizedCount: 0,
        repositoryEvaluationAuthorizedCount: 0,
        repositoryReadAuthorizedCount: 0,
        repositoryWriteAuthorizedCount: 0,
        filesystemMutationAuthorizedCount: 0,
        gitMutationAuthorizedCount: 0,
        commandExecutionAuthorizedCount: 0,
        packageExecutionAuthorizedCount: 0,
        networkAccessAuthorizedCount: 0,
        productionDeploymentAuthorizedCount: 0,
        paymentExecutionAuthorizedCount: 0,
        publicLaunchAuthorizedCount: 0,
      });

      expect(record.authorityBoundary).toMatchObject({
        evidencePlanningOnly: true,
        priorWorkstreamClosed: true,
        workstreamThreePlanPreparationAuthorized: true,
        workstreamThreePlanPreparationPerformed: true,
        workstreamThreeEvidenceExecutionAuthorized: false,
        repositoryReadOnlySandboxEvaluationPlanningAuthorized: true,
        repositoryReadOnlySandboxEvaluationPlanPrepared: true,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        concurrentEngineeringWorkAuthorized: false,
        aggregateConcurrentEngineeringWorkLimit: 0,
        levelThreeAuthorityGranted: false,
        publicLaunchAuthorized: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("replays deterministically and rejects copied or tampered authority", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.preparationDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidenceItems)).toBe(true);

      const copiedClosure = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation({
          ...canonicalInput(),
          sourcePriorWorkstreamClosureDecision: copiedClosure,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation(
          tampered,
        ),
      ).toThrow();
    });
  },
);