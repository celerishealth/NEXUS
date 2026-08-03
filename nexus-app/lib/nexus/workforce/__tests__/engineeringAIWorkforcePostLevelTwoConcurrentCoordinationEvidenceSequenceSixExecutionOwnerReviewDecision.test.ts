import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering concurrent-coordination sequence-six owner review",
  () => {
    it("accepts sequence six and authorizes only sequence seven", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        evidenceSequence: 6,
        controlId: "MONITORING_AND_HEALTH_GATES",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceSixOwnerReviewRecorded: true,
        sequenceSixClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SEVEN",
      });

      expect(record.authorityBoundary).toMatchObject({
        sequenceSevenEvidenceExecutionAuthorized: true,
        sequenceSevenEvidenceExecutionPerformed: false,
        onlySequenceSevenAuthorizedNext: true,
      });
    });

    it("accepts complete fail-closed monitoring evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedEvidence,
      ).toMatchObject({
        evaluatedHealthGateCaseCount: 5,
        healthyBaselineCaseCount: 1,
        thresholdBreachCaseCount: 4,
        blockedBreachCaseCount: 4,
        undetectedBreachCount: 0,
        unauthorizedProgressionCount: 0,
        emergencyPauseActivationCount: 4,
        ownerEscalationCount: 4,
        allSyntheticBreachesDetected: true,
        allUnsafeProgressionBlocked: true,
        failClosedMonitoringVerified: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("keeps all consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
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

    it("retains sequence six safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "engineering-concurrent-coordination-sequence-six-owner-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION",
        });

      expect(rejected.sequenceSixClosed).toBe(false);
      expect(
        rejected.authorityBoundary.sequenceSevenEvidenceExecutionAuthorized,
      ).toBe(false);
    });

    it("rejects copied execution and detects tampering", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_OWNER_REVIEW_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);