import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD,
  createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord,
  type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord,
} from "../engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD;

  return {
    closureRecordId: canonical.closureRecordId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
    preparedAt: canonical.preparedAt,
  };
}

describe(
  "Engineering repository read-only sandbox workstream closure record",
  () => {
    it("prepares closure record only after all eight accepted sequences", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD;

      expect(record).toMatchObject({
        workstreamSequence: 3,
        workstreamId:
          "repository-read-only-sandbox-evaluation",
        workstreamClosureRecordPreparationAuthorized: true,
        workstreamClosureRecordPreparationPerformed: true,
        formalClosureDecisionRequired: true,
        formalClosureDecisionRecorded: false,
        workstreamClosureAuthorized: false,
        workstreamClosurePerformed: false,
        workstreamClosed: false,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION_REVIEW",
      });
    });

    it("records all eight evidence sequences and owner reviews", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD
          .closureEvidence,
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

      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD
          .closureEvidence.ownerReviewLedger,
      ).toHaveLength(8);
    });

    it("does not formally close or authorize workstream four", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD
          .authorityBoundary,
      ).toMatchObject({
        closureRecordPreparationOnly: true,
        closureDecisionReviewRequired: true,
        closureDecisionBypassAuthorized: false,
        formalClosureDecisionRecorded: false,
        workstreamClosureAuthorized: false,
        workstreamClosurePerformed: false,
        workstreamClosed: false,
        workstreamCompletionClaimAuthorized: false,
        workstreamCompletionClaimed: false,
        workstreamFourPlanPreparationAuthorized: false,
        workstreamFourPlanPreparationPerformed: false,
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
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("replays deterministically", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.closureRecordDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(
        canonical.closureEvidence.closureEvidenceDigest,
      ).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.closureEvidence)).toBe(true);
    });

    it("rejects copied review and detects tampering", () => {
      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_RECORD;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          workstreamClosurePerformed: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureRecord(
          tampered,
        ),
      ).toThrow();
    });
  },
);