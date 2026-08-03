import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution";

function canonicalReplayInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering concurrent-coordination evidence sequence-five execution",
  () => {
    it("executes only rollback-coordination evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
      ).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceSequence: 5,
        controlId:
          "ROLLBACK_COORDINATION_PROTOCOL",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW",
      });
    });

    it("binds the approved sequence-four owner review", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
          .sourceOwnerReviewDecisionDigest,
      ).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION
          .decisionDigest,
      );
    });

    it("executes three valid rollbacks and blocks one invalid target", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        evaluatedRollbackCaseCount: 4,
        validRollbackCaseCount: 3,
        completedRollbackCaseCount: 3,
        invalidRollbackTargetBlockedCount: 1,
        partialStateRetainedCount: 0,
        unauthorizedForwardExecutionAllowedCount: 0,
        rollbackCheckpointBindingRequired: true,
        deterministicRollbackVerified: true,
        validRollbackTargetsVerified: true,
        invalidRollbackTargetBlocked: true,
        partialStateRemovalVerified: true,
        forwardExecutionBlockedAfterFailure: true,
        tenantBoundaryRollbackVerified: true,
        ownershipConflictRollbackVerified: true,
        ownerEscalationPreserved: true,
        failClosedOnRollbackFailure: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("blocks sequence six and all consequential authority", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        exactlyFiveEvidenceItemsExecutedInWorkstream: true,
        remainingThreeEvidenceItemsBlocked: true,
        sequenceSixEvidenceExecutionAuthorized: false,
        rollbackEvidenceExecuted: true,
        rollbackProtocolVerified: true,
        forwardExecutionAfterFailureAuthorized: false,
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
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution({
          ...canonicalReplayInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical approved");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution({
          ...canonicalReplayInput(),
          executedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION
                .decidedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede sequence-four owner review");
    }, 300_000);

    it("replays deterministically and detects tampering", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution(
          canonicalReplayInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(canonical.evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence.rollbackCases)).toBe(true);

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          partialStateRetainedCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution(
          tampered,
        ),
      ).toThrow();
    }, 300_000);

    it("keeps Founder Liberation at Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceFiveExecution(
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