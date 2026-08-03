import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint";

describe(
  "Engineering concurrent-coordination sequence-five approved checkpoint",
  () => {
    it("validates without importing the historical workforce chain", () => {
      const checkpoint =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationSequenceFiveApprovedCheckpoint(
          checkpoint,
        ),
      ).not.toThrow();

      expect(checkpoint.sourceRepositoryHead).toBe("15e3a0f");
      expect(checkpoint.checkpointDigest).toMatch(/^[0-9a-f]{64}$/);
    });

    it("authorizes only bounded evidence sequence six", () => {
      const checkpoint =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT;

      expect(checkpoint.ownerReview).toMatchObject({
        evidenceSequence: 5,
        controlId: "ROLLBACK_COORDINATION_PROTOCOL",
        executionAccepted: true,
        evidenceAccepted: true,
        sequenceFiveClosed: true,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_SIX",
      });

      expect(checkpoint.candidateSix).toMatchObject({
        sequence: 6,
        controlId: "MONITORING_AND_HEALTH_GATES",
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: false,
      });
    });

    it("keeps all consequential authority blocked", () => {
      const checkpoint =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_SEQUENCE_FIVE_APPROVED_CHECKPOINT;

      expect(checkpoint.ownerReview.authorityBoundary).toMatchObject({
        concurrentEngineeringWorkAuthorized: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        productionDeploymentAuthorized: false,
        paymentExecutionAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
      });

      expect(checkpoint.candidateSix.authorityBoundary).toMatchObject({
        concurrentEngineeringWorkAuthorized: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
      });
    });
  },
);