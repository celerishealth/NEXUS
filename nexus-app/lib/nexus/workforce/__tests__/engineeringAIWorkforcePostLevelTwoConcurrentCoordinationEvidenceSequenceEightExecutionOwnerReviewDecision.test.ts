import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering concurrent-coordination sequence-eight owner review",
  () => {
    it("accepts sequence eight and authorizes only closure preparation", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        evidenceSequence: 8,
        controlId: "INDEPENDENT_VALIDATION_AND_AUDIT",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceEightOwnerReviewRecorded: true,
        sequenceEightClosed: true,
        allEightEvidenceSequencesAccepted: true,
        nextStep:
          "PREPARE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE",
      });

      expect(record.authorityBoundary).toMatchObject({
        workstreamClosurePreparationAuthorized: true,
        workstreamClosureAuthorized: false,
        workstreamClosurePerformed: false,
        nextWorkstreamAuthorized: false,
      });
    });

    it("accepts complete independent-validation evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedEvidence,
      ).toMatchObject({
        evaluatedEvidenceAreaCount: 6,
        passedEvidenceAreaCount: 6,
        failedEvidenceAreaCount: 0,
        missingEvidenceAreaCount: 0,
        auditGapCount: 0,
        digestBindingFailureCount: 0,
        sequenceOrderingFailureCount: 0,
        missingOwnerReviewCount: 0,
        authorityBoundaryFailureCount: 0,
        detectedTamperProbeCount: 1,
        rejectedTamperProbeCount: 1,
        unauthorizedProgressionCount: 0,
        allEightEvidenceSequencesAccountedFor: true,
        allRequiredOwnerReviewsAccountedFor: true,
        evidenceIntegrityVerified: true,
        auditContinuityVerified: true,
        consequentialAuthorityBoundariesVerified: true,
        failClosedTamperDetectionVerified: true,
        independentValidationStatus: "PASS",
      });
    });

    it("keeps every consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        concurrentEngineeringWorkAuthorized: false,
        aggregateConcurrentEngineeringWorkLimit: 0,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        productionDeploymentAuthorized: false,
        paymentExecutionAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("retains sequence eight safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "engineering-concurrent-coordination-sequence-eight-owner-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION",
        });

      expect(rejected.sequenceEightClosed).toBe(false);
      expect(
        rejected.authorityBoundary.workstreamClosurePreparationAuthorized,
      ).toBe(false);
    });

    it("rejects copied execution and detects tampering", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_EIGHT_EXECUTION_OWNER_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          nextWorkstreamAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceEightExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);