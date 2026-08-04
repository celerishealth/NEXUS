import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceSevenExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evidence sequence-eight execution",
  () => {
    it("executes only synthetic pause and owner-escalation evidence", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_SEQUENCE_EIGHT_EXECUTED_AWAITING_OWNER_REVIEW",
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        evidenceSequence: 8,
        controlId:
          "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW",
        executionMode:
          "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW",
      });
    });

    it("produces deterministic fail-closed pause evidence", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        evidenceType:
          "EMERGENCY_PAUSE_ESCALATION_AND_OWNER_REVIEW_EXECUTION_EVIDENCE",
        evaluationMode:
          "SYNTHETIC_PAUSE_ESCALATION_POLICY_MODEL_ONLY",
        evaluatedPauseCaseCount: 6,
        healthyBaselineCaseCount: 1,
        blockedTriggerCaseCount: 5,
        resourceThresholdBreachBlockedCount: 1,
        suspiciousContentBlockedCount: 1,
        contextMismatchBlockedCount: 1,
        auditFailureBlockedCount: 1,
        unauthorizedAuthorityRequestBlockedCount: 1,
        missedEmergencyPauseCount: 0,
        missedOwnerEscalationCount: 0,
        unauthorizedProgressionCount: 0,
        emergencyPauseRequiredOnTrigger: true,
        failClosedEscalationRequired: true,
        independentValidationRequired: true,
        finalOwnerReviewRequired: true,
        rollbackEvidenceRequired: true,
        immutableAuditEvidenceRequired: true,
        resourceThresholdEscalationVerified: true,
        suspiciousContentEscalationVerified: true,
        contextMismatchEscalationVerified: true,
        auditFailureEscalationVerified: true,
        unauthorizedAuthorityEscalationVerified: true,
        ownerControlReturnVerified: true,
        deterministicPauseDecisionVerified: true,
        failClosedProgressionBlockingVerified: true,
        independentValidationGateVerified: true,
        finalOwnerReviewGateVerified: true,
        actualRepositoryReadPerformed: false,
        actualFilesystemReadPerformed: false,
        actualCommandExecutionPerformed: false,
        actualPackageExecutionPerformed: false,
        actualNetworkAccessPerformed: false,
        actualProductionActionPerformed: false,
        actualExternalActionPerformed: false,
        allEightEvidenceSequencesExecuted: true,
        allPriorOwnerReviewsAccountedFor: true,
        workstreamClosureBlockedUntilOwnerReview: true,
        workstreamClosurePerformed: false,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });

      expect(evidence.pauseAndEscalationCases).toHaveLength(6);
      expect(
        evidence.pauseAndEscalationCases.filter(
          (item) =>
            item.expectedDecision ===
            "ALLOW_SYNTHETIC_CONTINUATION",
        ),
      ).toHaveLength(1);
      expect(
        evidence.pauseAndEscalationCases.filter(
          (item) =>
            item.expectedDecision ===
            "BLOCK_AND_ESCALATE_TO_OWNER",
        ),
      ).toHaveLength(5);
      expect(evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("accounts for all eight sequences without closing workstream", () => {
      const ledger =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION
          .evidence.sequenceLedger;

      expect(ledger).toHaveLength(8);

      for (const entry of ledger.slice(0, 7)) {
        expect(entry.evidenceState).toBe(
          "OWNER_REVIEW_ACCEPTED",
        );
      }

      expect(ledger[7]).toMatchObject({
        sequence: 8,
        evidenceState:
          "EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceExecutionPerformed: true,
        currentlyExecutable: false,
        ownerReviewRequiredBeforeWorkstreamClosure: true,
      });
    });

    it("keeps closure and consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceEightOnly: true,
        exactlyEightEvidenceItemsExecutedInWorkstream: true,
        remainingEvidenceItemCount: 0,
        emergencyPauseEscalationEvidenceExecuted: true,
        emergencyPauseBoundaryVerified: true,
        workstreamClosureAuthorized: false,
        workstreamClosurePerformed: false,
        workstreamCompletionClaimAuthorized: false,
        workstreamCompletionClaimed: false,
        nextWorkstreamExecutionAuthorized: false,
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
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence)).toBe(true);

      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          unauthorizedProgressionCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);