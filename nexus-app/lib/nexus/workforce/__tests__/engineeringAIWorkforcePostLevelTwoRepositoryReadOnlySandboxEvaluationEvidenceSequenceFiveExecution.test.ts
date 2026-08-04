import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence sequence-five execution",
  () => {
    it("executes only synthetic read-only enforcement evidence", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 5,
        controlId:
          "READ_ONLY_FILESYSTEM_AND_TOOL_ENFORCEMENT",
        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW",
      });
    });

    it("produces deterministic filesystem and tool enforcement evidence", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
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
        nextEvidenceBlockedUntilOwnerReview: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });

      expect(evidence.enforcementCases).toHaveLength(10);
      expect(
        evidence.enforcementCases.filter(
          (item) =>
            item.expectedDecision ===
            "ALLOW_SYNTHETIC_READ_ONLY_OPERATION",
        ),
      ).toHaveLength(2);
      expect(
        evidence.enforcementCases.filter(
          (item) =>
            item.expectedDecision ===
            "BLOCK_SYNTHETIC_OPERATION",
        ),
      ).toHaveLength(8);
      expect(evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("keeps sequences six through eight blocked", () => {
      const ledger =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
          .evidence.sequenceLedger;

      for (const entry of ledger.slice(0, 4)) {
        expect(entry.evidenceState).toBe(
          "OWNER_REVIEW_ACCEPTED",
        );
      }

      expect(ledger[4]).toMatchObject({
        sequence: 5,
        evidenceState:
          "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionPerformed: true,
        currentlyExecutable: false,
      });

      for (const entry of ledger.slice(5)) {
        expect(entry).toMatchObject({
          evidenceState:
            "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
          evidenceExecutionPerformed: false,
          currentlyExecutable: false,
          ownerReviewRequiredBeforeNextSequence: true,
        });
      }
    });

    it("does not perform or authorize filesystem or tool operations", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceFiveOnly: true,
        exactlyFiveEvidenceItemsExecutedInWorkstream: true,
        remainingThreeEvidenceItemsBlocked: true,
        sequenceSixSyntheticEvidenceExecutionAuthorized: false,
        readOnlyEnforcementEvidenceExecuted: true,
        readOnlyEnforcementBoundaryVerified: true,
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

    it("replays deterministically and rejects copied or tampered review", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence)).toBe(true);

      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          commandExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);