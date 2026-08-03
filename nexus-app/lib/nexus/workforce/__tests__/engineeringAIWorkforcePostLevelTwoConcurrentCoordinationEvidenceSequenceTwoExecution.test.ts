import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-concurrent-coordination-sequence-two-execution-test-001",
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: new Date(
      Date.parse(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION
          .decidedAt,
      ) + 1,
    ).toISOString(),
  };
}

describe(
  "Engineering concurrent-coordination evidence sequence-two execution",
  () => {
    it("executes only conflict-detection and resolution evidence", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceSequence: 2,
        controlId:
          "CONFLICT_DETECTION_AND_RESOLUTION",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW",
      });
    });

    it("binds the approved sequence-one owner review", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

      expect(record.sourceOwnerReviewDecisionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION
          .decisionDigest,
      );

      expect(record.sourceOwnerReviewDecisionId).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION
          .decisionId,
      );
    });

    it("detects all four synthetic conflict classes", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .evidence;

      expect(evidence.evaluatedConflictCaseCount).toBe(4);
      expect(evidence.detectedConflictCount).toBe(4);

      expect(
        evidence.conflictCases.map(
          (conflictCase) =>
            conflictCase.conflictClass,
        ),
      ).toEqual([
        "DUPLICATE_RESOURCE_OWNERSHIP",
        "EQUAL_PRIORITY_OWNER_COLLISION",
        "STALE_OWNERSHIP_CLAIM",
        "CROSS_TENANT_OWNERSHIP_COLLISION",
      ]);
    });

    it("resolves deterministically or escalates fail closed", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
        deterministicallyResolvedConflictCount: 2,
        ownerEscalationRequiredCount: 2,
        unresolvedConflictAllowedCount: 0,
        silentConflictOverrideAllowed: false,
        failClosedOnEveryConflict: true,
        deterministicResolutionVerified: true,
        duplicateOwnershipPrevented: true,
        staleOwnershipRejected: true,
        crossTenantConflictBlocked: true,
        ownerEscalationPreserved: true,
      });

      expect(
        evidence.conflictCases.every(
          (conflictCase) =>
            conflictCase.failClosed,
        ),
      ).toBe(true);
    });

    it("blocks sequence three and all consequential authority", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        exactlyTwoEvidenceItemsExecutedInWorkstream: true,
        remainingSixEvidenceItemsBlocked: true,
        sequenceThreeEvidenceExecutionAuthorized: false,
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

    it("rejects noncanonical review and premature execution", () => {
      const copiedReview = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution({
          ...canonicalInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical approved");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution({
          ...canonicalInput(),
          executedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION
                .decidedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede sequence-one owner review");
    }, 240_000);

    it("is deterministic deeply immutable and detects tampering", () => {
      const input =
        canonicalInput();

      const first =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
          input,
        );

      const second =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
          input,
        );

      expect(second).toEqual(first);
      expect(first.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(first.evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(first)).toBe(true);
      expect(Object.isFrozen(first.evidence.conflictCases)).toBe(true);

      const tampered = {
        ...first,
        evidence: {
          ...first.evidence,
          unresolvedConflictAllowedCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
          tampered,
        ),
      ).toThrow();
    }, 240_000);

    it("exports valid evidence while Founder Liberation remains Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution(
          record,
        ),
      ).not.toThrow();

      expect(record.authorityBoundary.levelThreeAuthorityGranted).toBe(false);
      expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
      expect(
        record.authorityBoundary.founderReleasedFromRoutineExecution,
      ).toBe(false);
    }, 240_000);
  },
);