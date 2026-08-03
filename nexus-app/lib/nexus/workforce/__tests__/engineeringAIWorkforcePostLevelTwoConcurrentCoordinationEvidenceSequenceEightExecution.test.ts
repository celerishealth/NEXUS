import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSevenExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering concurrent-coordination evidence sequence-eight execution",
  () => {
    it("executes independent-validation and audit evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
      ).toMatchObject({
        evidenceSequence: 8,
        controlId: "INDEPENDENT_VALIDATION_AND_AUDIT",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_REVIEW",
      });
    });

    it("verifies complete evidence and audit continuity", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        evaluatedEvidenceAreaCount: 6,
        passedEvidenceAreaCount: 6,
        failedEvidenceAreaCount: 0,
        missingEvidenceAreaCount: 0,
        auditGapCount: 0,
        digestBindingFailureCount: 0,
        sequenceOrderingFailureCount: 0,
        missingOwnerReviewCount: 0,
        authorityBoundaryFailureCount: 0,
        syntheticTamperProbeCount: 1,
        detectedTamperProbeCount: 1,
        rejectedTamperProbeCount: 1,
        unauthorizedProgressionCount: 0,
        allEightEvidenceSequencesAccountedFor: true,
        allRequiredOwnerReviewsAccountedFor: true,
        evidenceIntegrityVerified: true,
        auditContinuityVerified: true,
        failClosedTamperDetectionVerified: true,
        independentValidationStatus: "PASS",
      });
    });

    it("blocks closure and consequential authority pending owner review", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        exactlyEightEvidenceItemsExecutedInWorkstream: true,
        remainingEvidenceItemCount: 0,
        workstreamClosureAuthorized: false,
        workstreamClosurePerformed: false,
        nextWorkstreamAuthorized: false,
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

    it("replays quickly and detects tampering", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(canonical.evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          auditGapCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);