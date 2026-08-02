import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-concurrent-coordination-sequence-one-owner-review-test-001",
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
    ownerId:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
        .ownerId,
    decision:
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION" as const,
    reason:
      "Owner approved the verified sequential ownership-ledger evidence and authorized only bounded synthetic evidence sequence two while all consequential authority remains blocked.",
    decidedAt: new Date(
      Date.parse(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .executedAt,
      ) + 1,
    ).toISOString(),
  };
}

describe(
  "Engineering concurrent-coordination sequence-one execution owner review",
  () => {
    it("accepts and closes sequence one while authorizing only sequence two", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
          approvalInput(),
        );

      expect(record).toMatchObject({
        decisionState:
          "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW_RECORDED",
        evidenceSequence: 1,
        controlId: "SEQUENTIAL_OWNERSHIP_LEDGER",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceOneOwnerReviewRecorded: true,
        sequenceOneClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO",
      });

      expect(
        record.authorityBoundary.sequenceTwoEvidenceExecutionAuthorized,
      ).toBe(true);
    });

    it("binds the canonical sequence-one execution and evidence digests", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record.sourceExecutionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .executionDigest,
      );

      expect(record.reviewedExecution.evidenceDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .evidence.evidenceDigest,
      );
    });

    it("records verified evidence quality and fail-closed controls", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        executedEvidenceItemCount: 1,
        blockedEvidenceItemCount: 7,
        concurrentOwnershipConflictDetected: false,
        failClosedOnOwnershipConflict: true,
        deterministicOrderingVerified: true,
        uniqueControlOwnershipVerified: true,
        controlIsolationVerified: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
        emergencyPauseAvailable: true,
        rollbackMarkerRecorded: true,
      });
    });

    it("blocks concurrent work repository production and external authority", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceOneExecutionAccepted: true,
        sequenceOneEvidenceAccepted: true,
        sequenceOneClosed: true,
        sequenceTwoEvidenceExecutionAuthorized: true,
        sequenceTwoEvidenceExecutionPerformed: false,
        onlySequenceTwoAuthorizedNext: true,
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

    it("retains sequence one safely when the owner rejects it", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision({
          ...approvalInput(),
          decisionId:
            "engineering-concurrent-coordination-sequence-one-owner-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.evidenceAccepted).toBe(false);
      expect(rejected.sequenceOneClosed).toBe(false);

      expect(
        rejected.authorityBoundary.sequenceTwoEvidenceExecutionAuthorized,
      ).toBe(false);

      expect(rejected.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects noncanonical execution non-owner and premature review", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision({
          ...approvalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision({
          ...approvalInput(),
          ownerId: "owner-other-001",
        }),
      ).toThrow("Only the execution-bound NEXUS owner");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision({
          ...approvalInput(),
          decidedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION
                .executedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede execution");
    }, 120_000);

    it("is deterministic deeply immutable and detects tampering", () => {
      const first =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
          approvalInput(),
        );

      const second =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
          approvalInput(),
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
          concurrentEngineeringWorkAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    }, 120_000);

    it("exports a valid decision while Founder Liberation remains Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceOneExecutionOwnerReviewDecision(
          record,
        ),
      ).not.toThrow();

      expect(record.authorityBoundary.levelThreeAuthorityGranted).toBe(false);
      expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
      expect(
        record.authorityBoundary.founderReleasedFromRoutineExecution,
      ).toBe(false);
    }, 120_000);
  },
);