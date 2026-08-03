import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

  return {
    executionId: canonical.executionId,
    sourceCheckpoint:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT,
    executedAt: canonical.executedAt,
  };
}

describe(
  "Engineering concurrent-coordination evidence sequence-six execution",
  () => {
    it("executes only monitoring and health-gates evidence", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION,
      ).toMatchObject({
        evidenceSequence: 6,
        controlId: "MONITORING_AND_HEALTH_GATES",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: true,
        evidenceCreated: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION_REVIEW",
      });
    });

    it("detects every synthetic breach and blocks unsafe progression", () => {
      const evidence =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION
          .evidence;

      expect(evidence).toMatchObject({
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
        deterministicEvaluationVerified: true,
        failClosedMonitoringVerified: true,
        monitoringStatus: "PASS",
        independentValidationStatus: "PASS",
      });
    });

    it("keeps sequence seven and consequential authority blocked", () => {
      expect(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION
          .authorityBoundary,
      ).toMatchObject({
        sequenceSevenEvidenceExecutionAuthorized: false,
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
      });
    });

    it("replays quickly and detects tampering", () => {
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX_EXECUTION;

      const replay =
        createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution(
          canonicalInput(),
        );

      expect(replay).toEqual(canonical);
      expect(canonical.executionDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(canonical.evidence.evidenceDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(Object.isFrozen(canonical)).toBe(true);

      const tampered = {
        ...canonical,
        evidence: {
          ...canonical.evidence,
          undetectedBreachCount: 1,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceSequenceSixExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);