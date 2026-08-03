import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence sequence-one execution",
  () => {
    it("executes only the synthetic read-scope allowlist evidence", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_ONE_EXECUTED_AWAITING_OWNER_REVIEW",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 1,
        controlId:
          "REPOSITORY_READ_SCOPE_ALLOWLIST",
        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW",
      });
    });

    it("produces deterministic allowlist and denial evidence", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        evidenceType:
          "REPOSITORY_READ_SCOPE_ALLOWLIST_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_ALLOWLIST_MODEL_ONLY",
        activeEvidenceSequence: 1,
        syntheticCaseCount: 8,
        syntheticAllowedCaseCount: 2,
        syntheticDeniedCaseCount: 6,
        actualRepositoryAccessAttempted: false,
        actualRepositoryContentRead: false,
        actualFilesystemInspectionPerformed: false,
        deterministicEvaluationVerified: true,
        failClosedDenialVerified: true,
        nextEvidenceBlockedUntilOwnerReview: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });

      expect(evidence.syntheticAllowlistCases).toHaveLength(8);
      expect(evidence.sequenceLedger).toHaveLength(8);
      expect(evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("keeps seven later sequences blocked pending owner review", () => {
      const [first, ...remaining] =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .evidence.sequenceLedger;

      expect(first).toMatchObject({
        sequence: 1,
        evidenceState:
          "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionPerformed: true,
        currentlyExecutable: false,
        ownerReviewRequiredBeforeNextSequence: true,
      });

      for (const entry of remaining) {
        expect(entry).toMatchObject({
          evidenceState:
            "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
          evidenceExecutionPerformed: false,
          currentlyExecutable: false,
          ownerReviewRequiredBeforeNextSequence: true,
        });
      }
    });

    it("does not perform or authorize actual repository access", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceOneOnly: true,
        exactlyOneEvidenceItemExecuted: true,
        remainingSevenEvidenceItemsBlocked: true,
        nextEvidenceExecutionAuthorized: false,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
        actualRepositoryEvaluationPerformed: false,
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

    it("replays deterministically and rejects copied or tampered decisions", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence)).toBe(true);

      const copiedDecision = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution({
          ...canonicalInput(),
          sourceDecision: copiedDecision,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceOneExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);