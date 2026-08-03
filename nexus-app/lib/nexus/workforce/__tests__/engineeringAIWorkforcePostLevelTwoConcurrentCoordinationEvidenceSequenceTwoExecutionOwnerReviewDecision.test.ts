import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-concurrent-coordination-sequence-two-owner-review-test-001",
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
    ownerId:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
        .ownerId,
    decision:
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION" as const,
    reason:
      "Owner approved the verified conflict-detection and resolution evidence and authorized only bounded synthetic sequence three while all consequential authority remains blocked.",
    decidedAt: new Date(
      Date.parse(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .executedAt,
      ) + 1,
    ).toISOString(),
  };
}

describe(
  "Engineering concurrent-coordination sequence-two execution owner review",
  () => {
    it("accepts sequence two and authorizes only sequence three", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision(
          approvalInput(),
        );

      expect(record).toMatchObject({
        decisionState:
          "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_REVIEW_RECORDED",
        evidenceSequence: 2,
        controlId:
          "CONFLICT_DETECTION_AND_RESOLUTION",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceTwoOwnerReviewRecorded: true,
        sequenceTwoClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE",
      });

      expect(
        record.authorityBoundary.sequenceThreeEvidenceExecutionAuthorized,
      ).toBe(true);
    });

    it("binds canonical execution and evidence digests", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record.sourceExecutionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .executionDigest,
      );

      expect(record.reviewedExecution.evidenceDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
          .evidence.evidenceDigest,
      );
    });

    it("records all conflict-control evidence as verified", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evaluatedConflictCaseCount: 4,
        detectedConflictCount: 4,
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
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("keeps all consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceTwoExecutionAccepted: true,
        sequenceTwoEvidenceAccepted: true,
        sequenceTwoClosed: true,
        sequenceThreeEvidenceExecutionAuthorized: true,
        sequenceThreeEvidenceExecutionPerformed: false,
        onlySequenceThreeAuthorizedNext: true,
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

    it("retains sequence two safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision({
          ...approvalInput(),
          decisionId:
            "engineering-concurrent-coordination-sequence-two-owner-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.evidenceAccepted).toBe(false);
      expect(rejected.sequenceTwoClosed).toBe(false);

      expect(
        rejected.authorityBoundary.sequenceThreeEvidenceExecutionAuthorized,
      ).toBe(false);

      expect(rejected.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects copied execution non-owner and premature review", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision({
          ...approvalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision({
          ...approvalInput(),
          ownerId: "owner-other-001",
        }),
      ).toThrow("Only the execution-bound NEXUS owner");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision({
          ...approvalInput(),
          decidedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION
                .executedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede execution");
    }, 180_000);

    it("is deterministic immutable and detects tampering", () => {
      const input = approvalInput();

      const first =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision(
          input,
        );

      const second =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision(
          input,
        );

      expect(second).toEqual(first);
      expect(first.decisionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(first)).toBe(true);
      expect(Object.isFrozen(first.reviewedExecution)).toBe(true);
      expect(Object.isFrozen(first.authorityBoundary)).toBe(true);

      const tampered = {
        ...first,
        authorityBoundary: {
          ...first.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    }, 300_000);

    it("exports valid review while Founder Liberation remains Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewDecision(
          record,
        ),
      ).not.toThrow();

      expect(record.authorityBoundary.levelThreeAuthorityGranted).toBe(false);
      expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
      expect(
        record.authorityBoundary.founderReleasedFromRoutineExecution,
      ).toBe(false);
    }, 180_000);
  },
);