import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceClosureRecord:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering repository read-only sandbox evaluation workstream closure",
  () => {
    it("formally closes workstream three", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        closureRecordAccepted: true,
        formalClosureDecisionRecorded: true,
        workstreamClosureAuthorized: true,
        workstreamClosurePerformed: true,
        workstreamClosed: true,
        nextWorkstreamSequence: 4,
        nextWorkstreamId:
          "founder-routine-execution-reduction-evidence",
        nextWorkstreamEvidenceClass:
          "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE",
        nextStep:
          "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN",
      });
    });

    it("accepts complete closure evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION
          .reviewedClosureEvidence,
      ).toMatchObject({
        requiredEvidenceSequenceCount: 8,
        completedEvidenceSequenceCount: 8,
        acceptedOwnerReviewCount: 8,
        remainingEvidenceSequenceCount: 0,
        rejectedEvidenceSequenceCount: 0,
        missingOwnerReviewCount: 0,
        failedIndependentValidationAreaCount: 0,
        missingIndependentValidationAreaCount: 0,
        auditGapCount: 0,
        digestBindingFailureCount: 0,
        sequenceOrderingFailureCount: 0,
        authorityBoundaryFailureCount: 0,
        unauthorizedProgressionCount: 0,
        missedEmergencyPauseCount: 0,
        missedOwnerEscalationCount: 0,
        allEightEvidenceSequencesAccountedFor: true,
        allRequiredOwnerReviewsAccountedFor: true,
        evidenceIntegrityVerified: true,
        auditContinuityVerified: true,
        tenantIsolationBoundaryVerified: true,
        ownerBindingVerified: true,
        consequentialAuthorityBoundariesVerified: true,
        failClosedTamperDetectionVerified: true,
        emergencyPauseEvidenceVerified: true,
        rollbackEvidenceVerified: true,
        monitoringAndHealthGateEvidenceVerified: true,
        escalationAndOwnerReviewEvidenceVerified: true,
        deterministicReplayVerified: true,
        actualRepositoryEvaluationPerformed: false,
        actualRepositoryReadPerformed: false,
        actualFilesystemReadPerformed: false,
        actualCommandExecutionPerformed: false,
        actualPackageExecutionPerformed: false,
        actualNetworkAccessPerformed: false,
        actualProductionActionPerformed: false,
        actualExternalActionPerformed: false,
        independentValidationStatus: "PASS",
        monitoringStatus: "PASS",
      });
    });

    it("authorizes only workstream-four plan preparation", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION
          .authorityBoundary,
      ).toMatchObject({
        workstreamThreeClosureAuthorized: true,
        workstreamThreeClosurePerformed: true,
        workstreamThreeClosed: true,
        workstreamThreeCompletionEvidenceAccepted: true,
        workstreamThreeCompletionClaimAuthorized: true,
        workstreamThreeCompletionClaimed: true,
        workstreamFourPlanPreparationAuthorized: true,
        workstreamFourPlanPreparationPerformed: false,
        onlyWorkstreamFourPlanPreparationAuthorizedNext: true,
        workstreamFourEvidenceExecutionAuthorized: false,
        nextWorkstreamExecutionAuthorized: false,
        nextWorkstreamAutonomousStartAuthorized: false,
        actualRepositoryEvaluationAuthorized: false,
        actualRepositoryEvaluationPerformed: false,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
        actualRepositoryReadPerformed: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        filesystemReadAuthorized: false,
        filesystemMutationAuthorized: false,
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

    it("retains workstream three safely when closure is rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision({
          ...canonicalInput(),
          decisionId:
            "repository-read-only-sandbox-workstream-closure-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_OPEN",
        });

      expect(rejected.workstreamClosed).toBe(false);
      expect(
        rejected.authorityBoundary
          .workstreamFourPlanPreparationAuthorized,
      ).toBe(false);
      expect(
        rejected.authorityBoundary
          .workstreamThreeCompletionClaimed,
      ).toBe(false);
    });

    it("rejects copied closure record and detects tampering", () => {
      const copiedClosureRecord = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision({
          ...canonicalInput(),
          sourceClosureRecord: copiedClosureRecord,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          workstreamFourEvidenceExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);