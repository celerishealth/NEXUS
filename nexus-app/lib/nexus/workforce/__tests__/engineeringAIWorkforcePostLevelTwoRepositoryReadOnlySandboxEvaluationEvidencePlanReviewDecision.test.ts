import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evaluation evidence-plan review",
  () => {
    it("accepts the plan and authorizes only execution-decision preparation", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidencePlanAccepted: true,
        evidencePlanReviewRecorded: true,
        nextStep:
          "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION",
      });

      expect(record.authorityBoundary).toMatchObject({
        evidencePlanAccepted: true,
        evidenceExecutionDecisionPreparationAuthorized: true,
        evidenceExecutionDecisionPreparationPerformed: false,
        evidenceExecutionAuthorized: false,
      });
    });

    it("accepts all eight complete plan-only controls", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION
          .reviewedPlan,
      ).toMatchObject({
        planOnly: true,
        evidenceItemCount: 8,
        syntheticSanitizedEvidenceItemCount: 8,
        deterministicEvidenceRequiredCount: 8,
        independentValidationRequiredCount: 8,
        ownerReviewRequiredCount: 8,
        monitoringRequiredCount: 8,
        emergencyPauseRequiredCount: 8,
        rollbackEvidenceRequiredCount: 8,
        tenantBindingRequiredCount: 8,
        ownerBindingRequiredCount: 8,
        pathContainmentRequiredCount: 8,
        secretExclusionRequiredCount: 8,
        immutableAuditRequiredCount: 8,
        planPreparationAuthorizedCount: 8,
        evidenceExecutionAuthorizedCount: 0,
        repositoryEvaluationAuthorizedCount: 0,
        repositoryReadAuthorizedCount: 0,
        repositoryWriteAuthorizedCount: 0,
      });
    });

    it("keeps repository and consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
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
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("retains the plan safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision({
          ...canonicalInput(),
          decisionId:
            "repository-read-only-sandbox-evidence-plan-review-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN",
        });

      expect(rejected.evidencePlanAccepted).toBe(false);
      expect(
        rejected.authorityBoundary
          .evidenceExecutionDecisionPreparationAuthorized,
      ).toBe(false);
    });

    it("rejects copied preparation and detects tampering", () => {
      const copiedPreparation = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_PREPARATION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision({
          ...canonicalInput(),
          sourcePreparation: copiedPreparation,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidencePlanReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);