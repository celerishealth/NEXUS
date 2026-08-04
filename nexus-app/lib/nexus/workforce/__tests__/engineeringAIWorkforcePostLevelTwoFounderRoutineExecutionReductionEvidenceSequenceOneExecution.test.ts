import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-one-test-001",
    sourceDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
    executedAt: new Date(
      Date.parse(
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION
          .decidedAt,
      ) + 1,
    ).toISOString(),
  };
}

describe(
  "Engineering founder routine execution reduction evidence sequence one",
  () => {
    it("creates the synthetic routine-work coverage baseline", () => {
      const record =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
          canonicalInput(),
        );

      expect(record).toMatchObject({
        workstreamSequence: 4,
        workstreamId: "founder-routine-execution-reduction-evidence",
        evidenceSequence: 1,
        controlId: "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE",
        evidenceExecutionPerformed: true,
        nextStep:
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION_REVIEW",
      });

      expect(record.evidence).toMatchObject({
        routineCategoryCount: 8,
        repeatableRoutineCategoryCount: 4,
        syntheticallyCoveredRepeatableCategoryCount: 4,
        syntheticRepeatableCoveragePercent: 100,
        actualRoutineTaskExecuted: false,
        founderTimeReductionMeasured: false,
        founderRoutineExecutionReductionClaimed: false,
      });
    });

    it("executes one evidence item and blocks the remaining seven", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION;

      expect(record.evidence.executedEvidenceItemCount).toBe(1);
      expect(record.evidence.blockedEvidenceItemCount).toBe(7);
      expect(record.evidence.sequenceLedger[0]?.executionState).toBe(
        "EXECUTED_AWAITING_OWNER_REVIEW",
      );
      expect(
        record.evidence.sequenceLedger
          .slice(1)
          .every(
            (entry) =>
              entry.executionState ===
                "BLOCKED_PENDING_PRIOR_OWNER_REVIEW" &&
              entry.evidenceExecutionPerformed === false &&
              entry.nextSequenceExecutionAuthorized === false,
          ),
      ).toBe(true);
    });

    it("preserves all blocked authority and Founder Liberation Level 2", () => {
      const boundary =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE_EXECUTION
          .authorityBoundary;

      expect(boundary).toMatchObject({
        nextEvidenceExecutionAuthorized: false,
        taskExecutionAuthorized: false,
        founderRoutineExecutionReductionExecutionAuthorized: false,
        founderRoutineExecutionReductionClaimed: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        filesystemMutationAuthorized: false,
        commandExecutionAuthorized: false,
        networkAccessAuthorized: false,
        productionDeploymentAuthorized: false,
        paymentExecutionAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAssessmentAuthorized: false,
        founderLiberationAchieved: false,
        founderReleasedFromRoutineExecution: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("rejects copied decisions and premature execution", () => {
      const copiedDecision = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
          {
            ...canonicalInput(),
            sourceDecision: copiedDecision,
          },
        ),
      ).toThrow("Only the canonical owner-approved");

      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
          {
            ...canonicalInput(),
            executedAt: new Date(
              Date.parse(
                ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION
                  .decidedAt,
              ) - 1,
            ).toISOString(),
          },
        ),
      ).toThrow("cannot precede the owner decision");
    });

    it("is deterministic, immutable, and detects tampering", () => {
      const first =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
          canonicalInput(),
        );
      const second =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
          canonicalInput(),
        );

      expect(first.executionDigest).toBe(second.executionDigest);
      expect(Object.isFrozen(first)).toBe(true);
      expect(Object.isFrozen(first.evidence.coverageMatrix)).toBe(true);

      const tampered = {
        ...first,
        authorityBoundary: {
          ...first.authorityBoundary,
          nextEvidenceExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution;

      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceOneExecution(
          tampered,
        ),
      ).toThrow();
    });
  },
);