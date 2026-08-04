import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering repository read-only sandbox sequence-six owner review",
  () => {
    it("accepts and closes sequence six", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 6,
        controlId:
          "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceSixOwnerReviewRecorded: true,
        sequenceSixClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN",
      });
    });

    it("accepts the deterministic bounded-resource evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evidenceType:
          "BOUNDED_RESOURCE_QUERY_AND_OUTPUT_LIMITS_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_RESOURCE_LIMIT_POLICY_MODEL_ONLY",
        evaluatedResourceCaseCount: 10,
        boundedRequestAllowedCaseCount: 2,
        blockedResourceRequestCaseCount: 8,
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
        failClosedOnUnknownResourceRequest: true,
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
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("authorizes only synthetic sequence seven", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceSixExecutionAccepted: true,
        sequenceSixEvidenceAccepted: true,
        sequenceSixClosed: true,
        sequenceSevenSyntheticEvidenceExecutionAuthorized: true,
        sequenceSevenSyntheticEvidenceExecutionPerformed: false,
        onlySequenceSevenAuthorizedNext: true,
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

    it("retains sequence six safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "repository-read-only-sandbox-sequence-six-owner-review-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SIX_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.sequenceSixClosed).toBe(false);
      expect(
        rejected.authorityBoundary
          .sequenceSevenSyntheticEvidenceExecutionAuthorized,
      ).toBe(false);
    });

    it("rejects copied execution and detects tampering", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);