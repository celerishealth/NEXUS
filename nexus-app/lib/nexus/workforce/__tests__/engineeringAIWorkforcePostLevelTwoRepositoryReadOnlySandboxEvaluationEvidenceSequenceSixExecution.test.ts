import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceFiveExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence sequence-six execution",
  () => {
    it("executes only synthetic bounded-resource evidence", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTED_AWAITING_OWNER_REVIEW",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 6,
        controlId:
          "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS",
        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW",
      });
    });

    it("produces deterministic query and output limit evidence", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        evidenceType:
          "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_RESOURCE_LIMIT_POLICY_MODEL_ONLY",
        evaluatedResourceCaseCount: 10,
        boundedRequestAllowedCaseCount: 2,
        blockedResourceRequestCaseCount: 8,
        fileCountLimitBreachBlockedCount: 1,
        byteCountLimitBreachBlockedCount: 1,
        lineCountLimitBreachBlockedCount: 1,
        queryCountLimitBreachBlockedCount: 1,
        recursionDepthLimitBreachBlockedCount: 1,
        executionDurationLimitBreachBlockedCount: 1,
        outputSizeLimitBreachBlockedCount: 1,
        evidenceRetentionLimitBreachBlockedCount: 1,
        unauthorizedOversizedRequestAllowedCount: 0,
        maximumFileCount: 25,
        maximumByteCount: 1048576,
        maximumLineCount: 5000,
        maximumQueryCount: 20,
        maximumRecursionDepth: 4,
        maximumExecutionDurationMs: 30000,
        maximumOutputByteCount: 262144,
        maximumEvidenceRetentionItemCount: 100,
        unboundedResourceQueryAllowed: false,
        recursiveUnboundedQueryAllowed: false,
        repeatedAbusiveQueryAllowed: false,
        oversizedOutputAllowed: false,
        unlimitedEvidenceRetentionAllowed: false,
        failClosedOnAnyLimitBreach: true,
        deterministicResourceLimitEvaluationVerified: true,
        resourceQueryLimitEnforcementVerified: true,
        outputLimitEnforcementVerified: true,
        evidenceRetentionLimitEnforcementVerified: true,
        ownerEscalationOnLimitBreachVerified: true,
        actualResourceQueryPerformed: false,
        actualFilesystemReadPerformed: false,
        actualRepositoryAccessAttempted: false,
        actualRepositoryContentRead: false,
        actualOutputProduced: false,
        actualCommandExecutionPerformed: false,
        actualPackageExecutionPerformed: false,
        actualNetworkAccessPerformed: false,
        nextEvidenceBlockedUntilOwnerReview: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });

      expect(evidence.resourceLimitCases).toHaveLength(10);
      expect(
        evidence.resourceLimitCases.filter(
          (item) =>
            item.expectedDecision ===
            "ALLOW_SYNTHETIC_BOUNDED_REQUEST",
        ),
      ).toHaveLength(2);
      expect(
        evidence.resourceLimitCases.filter(
          (item) =>
            item.expectedDecision ===
            "BLOCK_SYNTHETIC_RESOURCE_REQUEST",
        ),
      ).toHaveLength(8);
      expect(evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("keeps sequences seven and eight blocked", () => {
      const ledger =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION
          .evidence.sequenceLedger;

      for (const entry of ledger.slice(0, 5)) {
        expect(entry.evidenceState).toBe(
          "OWNER_REVIEW_ACCEPTED",
        );
      }

      expect(ledger[5]).toMatchObject({
        sequence: 6,
        evidenceState:
          "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionPerformed: true,
        currentlyExecutable: false,
      });

      for (const entry of ledger.slice(6)) {
        expect(entry).toMatchObject({
          evidenceState:
            "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
          evidenceExecutionPerformed: false,
          currentlyExecutable: false,
          ownerReviewRequiredBeforeNextSequence: true,
        });
      }
    });

    it("does not perform or authorize repository resource queries", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceSixOnly: true,
        exactlySixEvidenceItemsExecutedInWorkstream: true,
        remainingTwoEvidenceItemsBlocked: true,
        sequenceSevenSyntheticEvidenceExecutionAuthorized: false,
        boundedResourceEvidenceExecuted: true,
        boundedResourceBoundaryVerified: true,
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
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence)).toBe(true);

      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          unauthorizedOversizedRequestAllowedCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);