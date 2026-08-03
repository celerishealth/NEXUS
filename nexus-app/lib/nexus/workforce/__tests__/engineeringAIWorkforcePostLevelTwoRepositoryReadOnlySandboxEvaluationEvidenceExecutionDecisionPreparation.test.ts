import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

  return {
    preparationId: canonical.preparationId,
    sourceEvidencePlanReviewDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION,
    sourceEvidencePlanPreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
    preparedAt: canonical.preparedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence execution-decision preparation",
  () => {
    it("prepares exactly eight bounded owner decisions", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      expect(record).toMatchObject({
        preparationState:
          "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        decisionPreparationOnly: true,
        evidenceDecisionPreparationCount: 8,
        ownerExecutionDecisionReviewRequired: true,
        ownerExecutionDecisionReviewRecorded: false,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_REVIEW",
      });

      expect(record.evidenceDecisionPreparations).toHaveLength(8);
    });

    it("binds the canonical approved plan and controls", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      expect(record.sourceEvidencePlanReviewDecisionId).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION
          .decisionId,
      );

      expect(
        record.evidenceDecisionPreparations.map(
          (item) => item.controlId,
        ),
      ).toEqual(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION
          .evidenceItems.map((item) => item.controlId),
      );

      expect(
        new Set(
          record.evidenceDecisionPreparations.map(
            (item) => item.controlId,
          ),
        ).size,
      ).toBe(8);
    });

    it("keeps every prepared decision synthetic and fail closed", () => {
      for (
        const item of
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION
          .evidenceDecisionPreparations
      ) {
        expect(item).toMatchObject({
          availableDecisions:
            ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS,
          recommendedDecision:
            "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION",
          executionMode: "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
          evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY",
          maximumEvidenceExecutionCount: 1,
          concurrentExecutionLimit: 0,
          deterministicEvidenceRequired: true,
          independentValidationRequired: true,
          ownerExecutionDecisionRequired: true,
          ownerExecutionDecisionRecorded: false,
          ownerReviewAfterExecutionRequired: true,
          pathContainmentRequired: true,
          secretExclusionRequired: true,
          immutableAuditRequired: true,
          evidenceExecutionAuthorized: false,
          evidenceExecutionPerformed: false,
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

        expect(item.decisionPreparationDigest).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it("records zero execution and repository authority", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      expect(record.summary).toMatchObject({
        evidenceDecisionPreparationCount: 8,
        ownerExecutionDecisionRequiredCount: 8,
        ownerExecutionDecisionRecordedCount: 0,
        maximumEvidenceExecutionCount: 1,
        aggregateConcurrentExecutionLimit: 0,
        evidenceExecutionAuthorizedCount: 0,
        evidenceExecutionPerformedCount: 0,
        repositoryEvaluationAuthorizedCount: 0,
        repositoryReadAuthorizedCount: 0,
        repositoryWriteAuthorizedCount: 0,
        filesystemMutationAuthorizedCount: 0,
        gitMutationAuthorizedCount: 0,
        commandExecutionAuthorizedCount: 0,
        packageExecutionAuthorizedCount: 0,
        networkAccessAuthorizedCount: 0,
      });

      expect(record.authorityBoundary).toMatchObject({
        decisionPreparationOnly: true,
        workstreamThreeEvidenceExecutionDecisionPreparationAuthorized: true,
        workstreamThreeEvidenceExecutionDecisionPreparationPerformed: true,
        workstreamThreeEvidenceExecutionAuthorized: false,
        oneAtATimeEvidenceExecutionRequired: true,
        aggregateConcurrentExecutionLimit: 0,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        commandExecutionAuthorized: false,
        networkAccessAuthorized: false,
        concurrentEngineeringWorkAuthorized: false,
        levelThreeAuthorityGranted: false,
        publicLaunchAuthorized: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("replays deterministically and rejects copied or tampered sources", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.preparationDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(
        Object.isFrozen(canonical.evidenceDecisionPreparations),
      ).toBe(true);

      const copiedPlan = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation({
          ...canonicalInput(),
          sourceEvidencePlanPreparation: copiedPlan,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation(
          tampered,
        ),
      ).toThrow();
    });
  },
);