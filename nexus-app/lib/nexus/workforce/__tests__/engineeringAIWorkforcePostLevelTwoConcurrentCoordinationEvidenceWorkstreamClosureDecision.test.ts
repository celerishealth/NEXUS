import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosurePreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureApprovalRecord";

import {
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION;

  return {
    decisionId: canonical.decisionId,
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
    ownerId: canonical.ownerId,
    decision:
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE" as const,
    reason: canonical.reason,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering concurrent-coordination evidence workstream closure",
  () => {
    it("formally closes workstream two", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION;

      expect(record).toMatchObject({
        workstreamSequence: 2,
        workstreamId:
          "controlled-concurrent-coordination-evidence",
        closurePreparationAccepted: true,
        formalClosureDecisionRecorded: true,
        workstreamClosureAuthorized: true,
        workstreamClosurePerformed: true,
        workstreamClosed: true,
        nextStep:
          "PREPARE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_PLAN",
      });
    });

    it("accepts complete closure evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION
          .reviewedClosureEvidence,
      ).toMatchObject({
        requiredEvidenceSequenceCount: 8,
        completedEvidenceSequenceCount: 8,
        acceptedOwnerReviewCount: 8,
        remainingEvidenceSequenceCount: 0,
        rejectedEvidenceSequenceCount: 0,
        missingOwnerReviewCount: 0,
        failedIndependentValidationAreaCount: 0,
        missingIndependentValidationAreaCount: 0,
        auditGapCount: 0,
        digestBindingFailureCount: 0,
        sequenceOrderingFailureCount: 0,
        authorityBoundaryFailureCount: 0,
        unauthorizedProgressionCount: 0,
        allEightEvidenceSequencesAccountedFor: true,
        allRequiredOwnerReviewsAccountedFor: true,
        evidenceIntegrityVerified: true,
        auditContinuityVerified: true,
        consequentialAuthorityBoundariesVerified: true,
        failClosedTamperDetectionVerified: true,
        independentValidationStatus: "PASS",
        monitoringStatus: "PASS",
      });
    });

    it("authorizes only workstream-three plan preparation", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION
          .authorityBoundary,
      ).toMatchObject({
        workstreamTwoClosureAuthorized: true,
        workstreamTwoClosurePerformed: true,
        workstreamTwoClosed: true,
        workstreamThreePlanPreparationAuthorized: true,
        workstreamThreePlanPreparationPerformed: false,
        workstreamThreeEvidenceExecutionAuthorized: false,
        repositoryReadOnlySandboxEvaluationAuthorized: false,
        repositoryReadOnlySandboxExecutionAuthorized: false,
        concurrentEngineeringWorkAuthorized: false,
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

    it("retains workstream two safely when closure is rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision({
          ...canonicalInput(),
          decisionId:
            "engineering-concurrent-coordination-workstream-closure-rejection-test-001",
          decision:
            "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_OPEN",
        });

      expect(rejected.workstreamClosed).toBe(false);
      expect(
        rejected.authorityBoundary.workstreamThreePlanPreparationAuthorized,
      ).toBe(false);
    });

    it("rejects copied preparation and detects tampering", () => {
      const copiedPreparation = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision({
          ...canonicalInput(),
          sourcePreparation: copiedPreparation,
        }),
      ).toThrow("Only the canonical");

      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_WORKSTREAM_CLOSURE_DECISION;

      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          repositoryReadAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceWorkstreamClosureDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);