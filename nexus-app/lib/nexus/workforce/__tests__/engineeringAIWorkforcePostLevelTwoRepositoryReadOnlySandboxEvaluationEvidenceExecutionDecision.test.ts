import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_OWNER_APPROVAL_REASONS,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
    ownerId: canonical.ownerId,
    decisions: Array(8).fill(
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION",
    ) as readonly "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION"[],
    reasons:
      ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_OWNER_APPROVAL_REASONS,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence-execution decisions",
  () => {
    it("records all eight owner approvals", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        ownerExecutionDecisionsRecorded: true,
        evidenceExecutionDecisionCount: 8,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE",
      });

      expect(record.candidateDecisions).toHaveLength(8);
      expect(record.summary).toMatchObject({
        approvedEvidenceExecutionCount: 8,
        rejectedEvidenceExecutionCount: 0,
        currentlyExecutableCount: 1,
        waitingForPriorEvidenceOwnerReviewCount: 7,
        evidenceExecutionPerformedCount: 0,
        aggregateConcurrentExecutionLimit: 0,
      });
    });

    it("allows only sequence one to become currently executable", () => {
      const [first, ...remaining] =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION
          .candidateDecisions;

      expect(first).toMatchObject({
        sequence: 1,
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: false,
        currentlyExecutable: true,
        waitingForPriorEvidenceOwnerReview: false,
        retainedAtPreparationOnly: false,
      });

      for (const candidate of remaining) {
        expect(candidate).toMatchObject({
          evidenceExecutionAuthorized: true,
          evidenceExecutionPerformed: false,
          currentlyExecutable: false,
          waitingForPriorEvidenceOwnerReview: true,
          retainedAtPreparationOnly: false,
        });
      }
    });

    it("keeps actual repository and consequential authority blocked", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION;

      expect(record.authorityBoundary).toMatchObject({
        syntheticSafetyEvidenceExecutionAuthorized: true,
        syntheticSafetyEvidenceExecutionPerformed: false,
        oneAtATimeEvidenceExecutionRequired: true,
        currentlyExecutableEvidenceCount: 1,
        aggregateConcurrentExecutionLimit: 0,
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

    it("retains all execution when every candidate is rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision({
          ...canonicalInput(),
          decisionId:
            "repository-read-only-sandbox-evidence-execution-rejection-test-001",
          decisions: Array(8).fill(
            "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION",
          ) as readonly "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION"[],
        });

      expect(rejected.summary).toMatchObject({
        approvedEvidenceExecutionCount: 0,
        rejectedEvidenceExecutionCount: 8,
        currentlyExecutableCount: 0,
        waitingForPriorEvidenceOwnerReviewCount: 0,
      });

      expect(
        rejected.authorityBoundary
          .syntheticSafetyEvidenceExecutionAuthorized,
      ).toBe(false);
    });

    it("rejects copied preparation and detects tampering", () => {
      const copiedPreparation = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision({
          ...canonicalInput(),
          sourcePreparation: copiedPreparation,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);