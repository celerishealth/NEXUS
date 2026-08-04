import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence sequence-seven execution",
  () => {
    it("executes only synthetic immutable-audit evidence", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_SEVEN_EXECUTED_AWAITING_OWNER_REVIEW",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 7,
        controlId:
          "IMMUTABLE_AUDIT_AND_TAMPER_DETECTION",
        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_REVIEW",
      });
    });

    it("produces deterministic audit and tamper evidence", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
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
        requestIdentityBindingRequired: true,
        approvedScopeBindingRequired: true,
        fileDigestBindingRequired: true,
        resultDigestBindingRequired: true,
        denialReasonRequiredForDeniedRequests: true,
        orderingProofRequired: true,
        tamperProbeRequired: true,
        replayDetectionRequired: true,
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
        requestIdentityBindingVerified: true,
        approvedScopeBindingVerified: true,
        fileDigestBindingVerified: true,
        resultDigestBindingVerified: true,
        actualRepositoryReadPerformed: false,
        actualFilesystemReadPerformed: false,
        actualAuditEventWritePerformed: false,
        actualAuditLedgerMutationPerformed: false,
        actualOutputProduced: false,
        actualCommandExecutionPerformed: false,
        actualPackageExecutionPerformed: false,
        actualNetworkAccessPerformed: false,
        nextEvidenceBlockedUntilOwnerReview: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });

      expect(evidence.auditCases).toHaveLength(10);
      expect(
        evidence.auditCases.filter(
          (item) =>
            item.expectedDecision ===
            "ACCEPT_SYNTHETIC_IMMUTABLE_AUDIT_EVENT",
        ),
      ).toHaveLength(2);
      expect(
        evidence.auditCases.filter(
          (item) =>
            item.expectedDecision ===
            "BLOCK_SYNTHETIC_AUDIT_EVENT",
        ),
      ).toHaveLength(8);
      expect(evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("keeps sequence eight blocked", () => {
      const ledger =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION
          .evidence.sequenceLedger;

      for (const entry of ledger.slice(0, 6)) {
        expect(entry.evidenceState).toBe(
          "OWNER_REVIEW_ACCEPTED",
        );
      }

      expect(ledger[6]).toMatchObject({
        sequence: 7,
        evidenceState:
          "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionPerformed: true,
        currentlyExecutable: false,
      });

      expect(ledger[7]).toMatchObject({
        sequence: 8,
        evidenceState:
          "BLOCKED_PENDING_PRIOR_OWNER_REVIEW",
        evidenceExecutionPerformed: false,
        currentlyExecutable: false,
        ownerReviewRequiredBeforeNextSequence: true,
      });
    });

    it("does not perform or authorize repository or audit mutations", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceSevenOnly: true,
        exactlySevenEvidenceItemsExecutedInWorkstream: true,
        remainingOneEvidenceItemBlocked: true,
        sequenceEightSyntheticEvidenceExecutionAuthorized: false,
        immutableAuditEvidenceExecuted: true,
        immutableAuditBoundaryVerified: true,
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
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence)).toBe(true);

      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          unauthorizedAuditAcceptanceCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);