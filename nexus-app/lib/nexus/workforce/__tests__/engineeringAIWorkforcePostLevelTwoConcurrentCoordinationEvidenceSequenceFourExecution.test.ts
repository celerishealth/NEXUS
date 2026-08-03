import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution";

function canonicalReplayInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering concurrent-coordination evidence sequence-four execution",
  () => {
    it("executes only emergency-pause protocol evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION,
      ).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceSequence: 4,
        controlId:
          "EMERGENCY_PAUSE_PROTOCOL",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_REVIEW",
      });
    });

    it("binds the approved sequence-three owner review", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

      expect(record.sourceOwnerReviewDecisionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION
          .decisionDigest,
      );
    });

    it("evaluates four emergency-pause cases", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .evidence;

      expect(evidence.evaluatedPauseCaseCount).toBe(4);

      expect(
        evidence.pauseCases.map(
          (pauseCase) =>
            pauseCase.pauseClass,
        ),
      ).toEqual([
        "OWNER_EMERGENCY_PAUSE_COMMAND",
        "MONITORING_THRESHOLD_BREACH",
        "UNRESOLVED_COORDINATION_CONFLICT",
        "UNAUTHORIZED_RESUME_ATTEMPT",
      ]);
    });

    it("pauses fail closed and blocks unauthorized resume", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .evidence,
      ).toMatchObject({
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

    it("blocks sequence five and all consequential authority", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        exactlyFourEvidenceItemsExecutedInWorkstream: true,
        remainingFourEvidenceItemsBlocked: true,
        sequenceFiveEvidenceExecutionAuthorized: false,
        emergencyPauseEvidenceExecuted: true,
        emergencyPauseProtocolVerified: true,
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

    it("rejects copied review and premature execution", () => {
      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution({
          ...canonicalReplayInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical approved");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution({
          ...canonicalReplayInput(),
          executedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION
                .decidedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede sequence-three owner review");
    }, 300_000);

    it("is deterministic immutable and detects tampering", () => {
      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution(
          canonicalReplayInput(),
        );

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(canonical.evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence.pauseCases)).toBe(true);

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          unauthorizedResumeAllowedCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution(
          tampered,
        ),
      ).toThrow();
    }, 300_000);

    it("keeps Founder Liberation at Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecution(
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