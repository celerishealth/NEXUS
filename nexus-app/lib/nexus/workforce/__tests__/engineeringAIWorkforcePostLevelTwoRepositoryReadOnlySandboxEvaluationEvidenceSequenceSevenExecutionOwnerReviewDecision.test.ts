import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering repository read-only sandbox sequence-seven owner review",
  () => {
    it("accepts and closes sequence seven", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 7,
        controlId:
          "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceSevenOwnerReviewRecorded: true,
        sequenceSevenClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT",
      });
    });

    it("accepts deterministic audit and tamper evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evidenceType:
          "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_IMMUTABLE_AUDIT_CHAIN_MODEL_ONLY",
        evaluatedAuditCaseCount: 10,
        validAuditCaseCount: 2,
        blockedAuditCaseCount: 8,
        digestTamperBlockedCount: 4,
        missingDenialReasonBlockedCount: 1,
        orderingFailureBlockedCount: 1,
        replayDetectedCaseCount: 2,
        unauthorizedAuditAcceptanceCount: 0,
        immutableAuditRequired: true,
        auditEventMutationAllowed: false,
        auditEventDeletionAllowed: false,
        auditEventReorderingAllowed: false,
        auditEventReplayAllowed: false,
        failClosedOnDigestMismatch: true,
        failClosedOnOrderingFailure: true,
        failClosedOnReplayDetection: true,
        failClosedOnMissingDenialReason: true,
        deterministicAuditChainVerified: true,
        immutableAuditEnforcementVerified: true,
        tamperDetectionVerified: true,
        replayDetectionVerified: true,
        orderingProofVerified: true,
        denialReasonIntegrityVerified: true,
        actualRepositoryReadPerformed: false,
        actualFilesystemReadPerformed: false,
        actualAuditEventWritePerformed: false,
        actualAuditLedgerMutationPerformed: false,
        actualOutputProduced: false,
        actualCommandExecutionPerformed: false,
        actualPackageExecutionPerformed: false,
        actualNetworkAccessPerformed: false,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("authorizes only synthetic sequence eight", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceSevenExecutionAccepted: true,
        sequenceSevenEvidenceAccepted: true,
        sequenceSevenClosed: true,
        sequenceEightSyntheticEvidenceExecutionAuthorized: true,
        sequenceEightSyntheticEvidenceExecutionPerformed: false,
        onlySequenceEightAuthorizedNext: true,
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

    it("retains sequence seven safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "repository-read-only-sandbox-sequence-seven-owner-review-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.sequenceSevenClosed).toBe(false);
      expect(
        rejected.authorityBoundary
          .sequenceEightSyntheticEvidenceExecutionAuthorized,
      ).toBe(false);
    });

    it("rejects copied execution and detects tampering", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);