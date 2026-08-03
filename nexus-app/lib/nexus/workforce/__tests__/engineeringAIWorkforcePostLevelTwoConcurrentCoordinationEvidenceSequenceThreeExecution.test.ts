import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceTwoExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution";

function canonicalReplayInput() {
  const record =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

  return {
    executionId: record.executionId,
    sourceOwnerReview:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
    executedAt: record.executedAt,
  };
}

describe(
  "Engineering concurrent-coordination evidence sequence-three execution",
  () => {
    it("executes only tenant-isolation coordination evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION,
      ).toMatchObject({
        executionState:
          "ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTED_AWAITING_OWNER_REVIEW",
        evidenceSequence: 3,
        controlId:
          "TENANT_ISOLATION_COORDINATION",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION_REVIEW",
      });
    });

    it("binds the approved sequence-two owner review", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

      expect(record.sourceOwnerReviewDecisionDigest).toBe(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION
          .decisionDigest,
      );
    });

    it("evaluates same-tenant cross-tenant and missing-binding cases", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .evidence;

      expect(evidence.evaluatedTenantCaseCount).toBe(4);

      expect(
        evidence.tenantCases.map(
          (tenantCase) =>
            tenantCase.operationClass,
        ),
      ).toEqual([
        "SAME_TENANT_COORDINATION",
        "CROSS_TENANT_READ_ATTEMPT",
        "CROSS_TENANT_WRITE_ATTEMPT",
        "MISSING_TENANT_BINDING",
      ]);
    });

    it("blocks all unauthorized tenant access and mutation", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .evidence,
      ).toMatchObject({
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

    it("blocks sequence four and all consequential authority", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        exactlyThreeEvidenceItemsExecutedInWorkstream: true,
        remainingFiveEvidenceItemsBlocked: true,
        sequenceFourEvidenceExecutionAuthorized: false,
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
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution({
          ...canonicalReplayInput(),
          sourceOwnerReview: copiedReview,
        }),
      ).toThrow("Only the canonical approved");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution({
          ...canonicalReplayInput(),
          executedAt: new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_TWO_EXECUTION_OWNER_REVIEW_DECISION
                .decidedAt,
            ) - 1,
          ).toISOString(),
        }),
      ).toThrow("cannot precede sequence-two owner review");
    }, 300_000);

    it("is deterministic immutable and detects tampering", () => {
      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution(
          canonicalReplayInput(),
        );

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(canonical.evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);
      expect(Object.isFrozen(canonical.evidence.tenantCases)).toBe(true);

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          unauthorizedCrossTenantAccessAllowedCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution(
          tampered,
        ),
      ).toThrow();
    }, 300_000);

    it("exports valid evidence while Founder Liberation remains Level 2", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_THREE_EXECUTION;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceThreeExecution(
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