import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
    ownerId:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
        .ownerId,
    decision:
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering concurrent-coordination sequence-four execution owner review",
  () => {
    it("accepts sequence four and authorizes only sequence five", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        decisionState:
          "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW_RECORDED",
        evidenceSequence: 4,
        controlId:
          "EMERGENCY_PAUSE_PROTOCOL",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceFourOwnerReviewRecorded: true,
        sequenceFourClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE",
      });

      expect(
        record.authorityBoundary.sequenceFiveEvidenceExecutionAuthorized,
      ).toBe(true);
    });

    it("binds canonical execution and evidence digests", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record.sourceExecutionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .executionDigest,
      );

      expect(record.reviewedExecution.evidenceDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .evidence.evidenceDigest,
      );
    });

    it("records emergency-pause evidence as verified", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evaluatedPauseCaseCount: 4,
        requiredPauseCaseCount: 4,
        activatedPauseCaseCount: 4,
        blockedUnauthorizedResumeCaseCount: 1,
        operationsAllowedAfterPauseCount: 0,
        unauthorizedResumeAllowedCount: 0,
        ownerPauseCommandVerified: true,
        monitoringTriggeredPauseVerified: true,
        conflictTriggeredPauseVerified: true,
        unauthorizedResumeBlocked: true,
        pausedStatePreserved: true,
        resumeRequiresSeparateOwnerApproval: true,
        ownerFinalAuthorityPreserved: true,
        failClosedOnPauseFailure: true,
        pauseSignalIntegrityVerified: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("keeps resume and consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceFourExecutionAccepted: true,
        sequenceFourEvidenceAccepted: true,
        sequenceFourClosed: true,
        sequenceFiveEvidenceExecutionAuthorized: true,
        sequenceFiveEvidenceExecutionPerformed: false,
        onlySequenceFiveAuthorizedNext: true,
        emergencyPauseEvidenceAccepted: true,
        resumeAuthorizationGranted: false,
        concurrentEngineeringWorkAuthorized: false,
        aggregateConcurrentEngineeringWorkLimit: 0,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        productionDeploymentAuthorized: false,
        paymentExecutionAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("retains sequence four safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "engineering-concurrent-coordination-sequence-four-owner-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.evidenceAccepted).toBe(false);
      expect(rejected.sequenceFourClosed).toBe(false);
      expect(
        rejected.authorityBoundary.sequenceFiveEvidenceExecutionAuthorized,
      ).toBe(false);
      expect(rejected.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects copied execution non-owner and premature review", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision({
          ...canonicalInput(),
          ownerId: "owner-other-001",
        }),
      ).toThrow("Only the execution-bound NEXUS owner");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decidedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
                .executedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede execution");
    }, 300_000);

    it("is deterministic immutable and detects tampering", () => {
      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

      expect(replay).toEqual(canonical);
      expect(canonical.decisionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.reviewedExecution)).toBe(true);
      expect(Object.isFrozen(canonical.authorityBoundary)).toBe(true);

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          resumeAuthorizationGranted: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    }, 300_000);

    it("keeps Founder Liberation at Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewDecision(
          record,
        ),
      ).not.toThrow();

      expect(record.authorityBoundary.levelThreeAuthorityGranted).toBe(false);
      expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
      expect(
        record.authorityBoundary.founderReleasedFromRoutineExecution,
      ).toBe(false);
    }, 300_000);
  },
);