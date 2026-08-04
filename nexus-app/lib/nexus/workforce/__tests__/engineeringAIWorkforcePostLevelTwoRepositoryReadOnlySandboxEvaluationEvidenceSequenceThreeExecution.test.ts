import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence sequence-three execution",
  () => {
    it("executes only synthetic context-binding evidence", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_THREE_EXECUTED_AWAITING_OWNER_REVIEW",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 3,
        controlId:
          "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING",
        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW",
      });
    });

    it("produces deterministic tenant-owner-session binding evidence", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        evidenceType:
          "TENANT_OWNER_AND_SESSION_CONTEXT_BINDING_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_CONTEXT_BINDING_MODEL_ONLY",
        evaluatedContextCaseCount: 10,
        fullyBoundAllowedCaseCount: 1,
        rejectedContextCaseCount: 9,
        unauthorizedContextAllowedCount: 0,
        tenantIdentityBindingRequired: true,
        ownerIdentityBindingRequired: true,
        activeSessionBindingRequired: true,
        copiedContextAccepted: false,
        staleSessionAccepted: false,
        revokedSessionAccepted: false,
        crossTenantSessionAccepted: false,
        crossOwnerSessionAccepted: false,
        failClosedOnMissingContext: true,
        failClosedOnContextMismatch: true,
        deterministicContextEvaluationVerified: true,
        actualSessionValidationPerformed: false,
        actualFilesystemInspectionPerformed: false,
        actualRepositoryAccessAttempted: false,
        actualRepositoryContentRead: false,
        nextEvidenceBlockedUntilOwnerReview: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });

      expect(evidence.contextBindingCases).toHaveLength(10);
      expect(
        evidence.contextBindingCases.filter(
          (item) =>
            item.expectedDecision ===
            "ALLOW_BOUND_SYNTHETIC_CONTEXT",
        ),
      ).toHaveLength(1);
      expect(
        evidence.contextBindingCases.filter(
          (item) =>
            item.expectedDecision ===
            "DENY_SYNTHETIC_CONTEXT",
        ),
      ).toHaveLength(9);
      expect(evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("keeps sequences four through eight blocked", () => {
      const ledger =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .evidence.sequenceLedger;

      expect(ledger[0]?.evidenceState).toBe(
        "OWNER_REVIEW_ACCEPTED",
      );
      expect(ledger[1]?.evidenceState).toBe(
        "OWNER_REVIEW_ACCEPTED",
      );
      expect(ledger[2]).toMatchObject({
        sequence: 3,
        evidenceState:
          "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionPerformed: true,
        currentlyExecutable: false,
      });

      for (const entry of ledger.slice(3)) {
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
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceThreeOnly: true,
        exactlyThreeEvidenceItemsExecutedInWorkstream: true,
        remainingFiveEvidenceItemsBlocked: true,
        sequenceFourSyntheticEvidenceExecutionAuthorized: false,
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

    it("replays deterministically and rejects copied or tampered review", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence)).toBe(true);

      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceThreeExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);