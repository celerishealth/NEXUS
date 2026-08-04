import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering repository read-only sandbox sequence-two owner review",
  () => {
    it("accepts and closes sequence two", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 2,
        controlId:
          "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceTwoOwnerReviewRecorded: true,
        sequenceTwoClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE",
      });
    });

    it("accepts the exact deterministic path evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evidenceType:
          "PATH_CONTAINMENT_AND_TRAVERSAL_REJECTION_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_PATH_NORMALIZATION_MODEL_ONLY",
        evaluatedPathCaseCount: 10,
        containedPathAllowedCount: 2,
        rejectedPathCount: 8,
        unresolvedPathAllowedCount: 0,
        normalizedContainmentRequired: true,
        repositoryRootEscapeAllowed: false,
        failClosedOnEveryRejectedPath: true,
        deterministicNormalizationVerified: true,
        pathContainmentVerified: true,
        traversalRejectionVerified: true,
        actualPathResolutionPerformed: false,
        actualFilesystemInspectionPerformed: false,
        actualRepositoryAccessAttempted: false,
        actualRepositoryContentRead: false,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("authorizes only synthetic sequence three", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceTwoExecutionAccepted: true,
        sequenceTwoEvidenceAccepted: true,
        sequenceTwoClosed: true,
        sequenceThreeSyntheticEvidenceExecutionAuthorized: true,
        sequenceThreeSyntheticEvidenceExecutionPerformed: false,
        onlySequenceThreeAuthorizedNext: true,
        actualRepositoryEvaluationAuthorized: false,
        actualRepositoryEvaluationPerformed: false,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
        actualRepositoryReadPerformed: false,
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

    it("retains sequence two safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "repository-read-only-sandbox-sequence-two-owner-review-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_TWO_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.sequenceTwoClosed).toBe(false);
      expect(
        rejected.authorityBoundary
          .sequenceThreeSyntheticEvidenceExecutionAuthorized,
      ).toBe(false);
    });

    it("rejects copied execution and detects tampering", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);