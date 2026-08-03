import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

  return {
    preparationId: canonical.preparationId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
    preparedAt: canonical.preparedAt,
  };
}

describe(
  "Engineering concurrent-coordination workstream-closure preparation",
  () => {
    it("prepares closure only after all eight accepted sequences", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

      expect(record).toMatchObject({
        workstreamSequence: 2,
        workstreamId:
          "controlled-concurrent-coordination-evidence",
        workstreamClosurePreparationAuthorized: true,
        workstreamClosurePreparationPerformed: true,
        formalClosureDecisionRequired: true,
        formalClosureDecisionRecorded: false,
        workstreamClosureAuthorized: false,
        workstreamClosurePerformed: false,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION_REVIEW",
      });
    });

    it("records all eight evidence sequences and owner reviews", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION
          .closureEvidence,
      ).toMatchObject({
        requiredEvidenceSequenceCount: 8,
        completedEvidenceSequenceCount: 8,
        acceptedOwnerReviewCount: 8,
        remainingEvidenceSequenceCount: 0,
        rejectedEvidenceSequenceCount: 0,
        missingOwnerReviewCount: 0,
        auditGapCount: 0,
        authorityBoundaryFailureCount: 0,
        unauthorizedProgressionCount: 0,
        allEightEvidenceSequencesAccountedFor: true,
        allRequiredOwnerReviewsAccountedFor: true,
        evidenceIntegrityVerified: true,
        auditContinuityVerified: true,
        consequentialAuthorityBoundariesVerified: true,
        failClosedTamperDetectionVerified: true,
        independentValidationStatus: "PASS",
        monitoringStatus: "PASS",
      });
    });

    it("does not formally close or authorize the next workstream", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION
          .authorityBoundary,
      ).toMatchObject({
        closurePreparationOnly: true,
        closureDecisionReviewRequired: true,
        closureDecisionBypassAuthorized: false,
        formalClosureDecisionRecorded: false,
        workstreamClosureAuthorized: false,
        workstreamClosurePerformed: false,
        nextWorkstreamAuthorized: false,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        concurrentEngineeringWorkAuthorized: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        productionDeploymentAuthorized: false,
        paymentExecutionAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
      });
    });

    it("replays deterministically and detects tampering", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.preparationDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(canonical.closureEvidence.closureEvidenceDigest).toMatch(
        /^[0-9a-f]{64}$/,
      );
      expect(Object.isFrozen(canonical)).toBe(true);

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          workstreamClosurePerformed: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation(
          tampered,
        ),
      ).toThrow();
    });
  },
);