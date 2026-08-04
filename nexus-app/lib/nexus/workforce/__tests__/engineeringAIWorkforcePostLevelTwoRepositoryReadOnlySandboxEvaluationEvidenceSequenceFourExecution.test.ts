import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence sequence-four execution",
  () => {
    it("executes only synthetic secrets-exclusion evidence", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_FOUR_EXECUTED_AWAITING_OWNER_REVIEW",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 4,
        controlId:
          "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION",
        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW",
      });
    });

    it("produces deterministic sensitive-content exclusion evidence", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        evidenceType:
          "SECRETS_AND_SENSITIVE_CONTENT_EXCLUSION_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_CONTENT_CLASSIFICATION_MODEL_ONLY",
        evaluatedContentCaseCount: 10,
        benignContentAllowedCaseCount: 2,
        sensitiveContentBlockedCaseCount: 8,
        sensitiveFilenameBlockedCaseCount: 3,
        sensitiveContentMarkerBlockedCaseCount: 3,
        customerSensitiveContentBlockedCaseCount: 1,
        sessionCredentialContentBlockedCaseCount: 1,
        unauthorizedSensitiveContentAllowedCount: 0,
        redactionBeforeEvidenceRequired: true,
        sensitiveValueMaterializationAllowed: false,
        rawSensitiveValueLoggingAllowed: false,
        sensitiveEvidenceExportAllowed: false,
        failClosedOnClassificationUncertainty: true,
        failClosedOnSensitiveMarker: true,
        deterministicClassificationVerified: true,
        exclusionEnforcementVerified: true,
        redactionBoundaryVerified: true,
        actualSecretInspectionPerformed: false,
        actualSensitiveContentInspectionPerformed: false,
        actualFilesystemInspectionPerformed: false,
        actualRepositoryAccessAttempted: false,
        actualRepositoryContentRead: false,
        nextEvidenceBlockedUntilOwnerReview: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });

      expect(evidence.contentExclusionCases).toHaveLength(10);
      expect(
        evidence.contentExclusionCases.filter(
          (item) =>
            item.expectedDecision ===
            "ALLOW_SYNTHETIC_NON_SENSITIVE_CONTENT",
        ),
      ).toHaveLength(2);
      expect(
        evidence.contentExclusionCases.filter(
          (item) =>
            item.expectedDecision ===
            "BLOCK_SYNTHETIC_SENSITIVE_CONTENT",
        ),
      ).toHaveLength(8);
      expect(evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("keeps sequences five through eight blocked", () => {
      const ledger =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .evidence.sequenceLedger;

      for (const entry of ledger.slice(0, 3)) {
        expect(entry.evidenceState).toBe(
          "OWNER_REVIEW_ACCEPTED",
        );
      }

      expect(ledger[3]).toMatchObject({
        sequence: 4,
        evidenceState:
          "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionPerformed: true,
        currentlyExecutable: false,
      });

      for (const entry of ledger.slice(4)) {
        expect(entry).toMatchObject({
          evidenceState:
            "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
          evidenceExecutionPerformed: false,
          currentlyExecutable: false,
          ownerReviewRequiredBeforeNextSequence: true,
        });
      }
    });

    it("does not inspect or authorize secrets or repository access", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceFourOnly: true,
        exactlyFourEvidenceItemsExecutedInWorkstream: true,
        remainingFourEvidenceItemsBlocked: true,
        sequenceFiveSyntheticEvidenceExecutionAuthorized: false,
        secretsExclusionEvidenceExecuted: true,
        secretsExclusionBoundaryVerified: true,
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
        secretsAccessAuthorized: false,
        sensitiveContentAccessAuthorized: false,
        sensitiveContentMaterializationAuthorized: false,
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
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence)).toBe(true);

      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          secretsAccessAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFourExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);