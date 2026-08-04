import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering repository read-only sandbox sequence-five owner review",
  () => {
    it("accepts and closes sequence five", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 5,
        controlId:
          "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceFiveOwnerReviewRecorded: true,
        sequenceFiveClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX",
      });
    });

    it("accepts the deterministic enforcement evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evidenceType:
          "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_READ_ONLY_TOOL_POLICY_MODEL_ONLY",
        evaluatedEnforcementCaseCount: 10,
        readOnlyAllowedCaseCount: 2,
        blockedOperationCaseCount: 8,
        blockedFilesystemMutationCaseCount: 5,
        blockedCommandExecutionCaseCount: 1,
        blockedPackageExecutionCaseCount: 1,
        blockedNetworkAccessCaseCount: 1,
        unauthorizedOperationAllowedCount: 0,
        readOnlyFilesystemRequired: true,
        readOnlyToolModeRequired: true,
        boundedReadLimitRequired: true,
        filesystemWriteAllowed: false,
        filesystemCreateAllowed: false,
        filesystemDeleteAllowed: false,
        filesystemRenameAllowed: false,
        filesystemPermissionChangeAllowed: false,
        commandExecutionAllowed: false,
        packageExecutionAllowed: false,
        networkAccessAllowed: false,
        failClosedOnUnknownTool: true,
        failClosedOnMutationRequest: true,
        deterministicToolPolicyVerified: true,
        readOnlyEnforcementVerified: true,
        mutationBlockingVerified: true,
        commandBlockingVerified: true,
        packageBlockingVerified: true,
        networkBlockingVerified: true,
        actualFilesystemReadPerformed: false,
        actualFilesystemMutationPerformed: false,
        actualToolExecutionPerformed: false,
        actualCommandExecutionPerformed: false,
        actualPackageExecutionPerformed: false,
        actualNetworkAccessPerformed: false,
        actualRepositoryAccessAttempted: false,
        actualRepositoryContentRead: false,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("authorizes only synthetic sequence six", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceFiveExecutionAccepted: true,
        sequenceFiveEvidenceAccepted: true,
        sequenceFiveClosed: true,
        sequenceSixSyntheticEvidenceExecutionAuthorized: true,
        sequenceSixSyntheticEvidenceExecutionPerformed: false,
        onlySequenceSixAuthorizedNext: true,
        actualRepositoryEvaluationAuthorized: false,
        actualRepositoryEvaluationPerformed: false,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
        actualRepositoryReadPerformed: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        filesystemReadAuthorized: false,
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

    it("retains sequence five safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "repository-read-only-sandbox-sequence-five-owner-review-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.sequenceFiveClosed).toBe(false);
      expect(
        rejected.authorityBoundary
          .sequenceSixSyntheticEvidenceExecutionAuthorized,
      ).toBe(false);
    });

    it("rejects copied execution and detects tampering", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          commandExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);