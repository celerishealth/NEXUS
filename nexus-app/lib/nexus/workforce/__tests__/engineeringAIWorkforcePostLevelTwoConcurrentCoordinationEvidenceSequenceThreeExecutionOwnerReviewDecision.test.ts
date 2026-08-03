import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
    ownerId:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
        .ownerId,
    decision:
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering concurrent-coordination sequence-three execution owner review",
  () => {
    it("accepts sequence three and authorizes only sequence four", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record).toMatchObject({
        decisionState:
          "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW_RECORDED",
        evidenceSequence: 3,
        controlId:
          "TENANT_ISOLATION_COORDINATION",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceThreeOwnerReviewRecorded: true,
        sequenceThreeClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_FOUR",
      });

      expect(
        record.authorityBoundary.sequenceFourEvidenceExecutionAuthorized,
      ).toBe(true);
    });

    it("binds canonical execution and evidence digests", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(record.sourceExecutionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .executionDigest,
      );

      expect(record.reviewedExecution.evidenceDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .evidence.evidenceDigest,
      );
    });

    it("records tenant-isolation evidence as verified", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION
          .reviewedExecution,
      ).toMatchObject({
        evaluatedTenantCaseCount: 4,
        sameTenantAllowedCaseCount: 1,
        blockedCrossTenantCaseCount: 2,
        blockedMissingBindingCaseCount: 1,
        unauthorizedCrossTenantAccessAllowedCount: 0,
        unauthorizedTenantMutationAllowedCount: 0,
        tenantIdentityBindingRequired: true,
        sameTenantCoordinationVerified: true,
        crossTenantReadBlocked: true,
        crossTenantWriteBlocked: true,
        missingTenantBindingBlocked: true,
        tenantDataLeakDetected: false,
        failClosedOnTenantMismatch: true,
        ownerEscalationPreserved: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("keeps consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION
          .authorityBoundary,
      ).toMatchObject({
        sequenceThreeExecutionAccepted: true,
        sequenceThreeEvidenceAccepted: true,
        sequenceThreeClosed: true,
        sequenceFourEvidenceExecutionAuthorized: true,
        sequenceFourEvidenceExecutionPerformed: false,
        onlySequenceFourAuthorizedNext: true,
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

    it("retains sequence three safely when rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decisionId:
            "engineering-concurrent-coordination-sequence-three-owner-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION",
        });

      expect(rejected.executionAccepted).toBe(false);
      expect(rejected.evidenceAccepted).toBe(false);
      expect(rejected.sequenceThreeClosed).toBe(false);
      expect(
        rejected.authorityBoundary.sequenceFourEvidenceExecutionAuthorized,
      ).toBe(false);
      expect(rejected.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_AWAITING_OWNER_REVIEW",
      );
    });

    it("rejects copied execution non-owner and premature review", () => {
      const copiedExecution = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision({
          ...canonicalInput(),
          sourceExecution: copiedExecution,
        }),
      ).toThrow("Only the canonical");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision({
          ...canonicalInput(),
          ownerId: "owner-other-001",
        }),
      ).toThrow("Only the execution-bound NEXUS owner");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision({
          ...canonicalInput(),
          decidedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
                .executedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede execution");
    }, 300_000);

    it("is deterministic immutable and detects tampering", () => {
      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision(
          canonicalInput(),
        );

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(replay).toEqual(canonical);
      expect(canonical.decisionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.reviewedExecution)).toBe(true);
      expect(Object.isFrozen(canonical.authorityBoundary)).toBe(true);

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision(
          tampered,
        ),
      ).toThrow();
    }, 300_000);

    it("keeps Founder Liberation at Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecutionOwnerReviewDecision(
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