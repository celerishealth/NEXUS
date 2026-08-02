import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_FIXTURE,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_TRADE_OFF_PLAN,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO,
  executeEngineeringAIWorkforceIshaanSecondSyntheticTask,
  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceIshaanSecondSyntheticTaskExecution";

function executionInput() {
  return {
    executionId:
      "engineering-ishaan-second-synthetic-task-execution-test-001",

    ownerSecondTaskExecutionDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Ishaan second synthetic task execution",
  () => {
    it(
      "executes exactly Ishaan bounded second synthetic task and stops for owner review",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(execution.executionState).toBe(
          "ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTED",
        );

        expect(execution.publicName).toBe(
          "Ishaan",
        );

        expect(execution.taskSequence).toBe(
          2,
        );

        expect(execution.scenarioId).toBe(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO,
        );

        expect(
          execution.executionBoundary
            .secondSyntheticTaskExecutionPerformed,
        ).toBe(true);

        expect(
          execution.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);

        expect(execution.nextStep).toBe(
          "AWAIT_OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW",
        );
      },
      60_000,
    );

    it(
      "produces the exact deterministic architecture trade-off evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(execution.objective).toBe(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE,
        );

        expect(
          execution.expectedEvidence,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,
        );

        expect(
          execution.syntheticArchitectureFixture,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_FIXTURE,
        );

        expect(
          execution.architectureTradeOffPlan,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_ARCHITECTURE_TRADE_OFF_PLAN,
        );

        expect(
          execution.architectureTradeOffPlan
            .options,
        ).toHaveLength(2);

        expect(
          execution.architectureTradeOffPlan
            .decisionCriteria,
        ).toHaveLength(5);

        expect(
          execution.architectureTradeOffPlan,
        ).toMatchObject({
          planStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          evidenceClass:
            "DETERMINISTIC_ARCHITECTURE_TRADE_OFF_PLAN",

          reviewOutcome:
            "BOUNDED_INCREMENTAL_EVOLUTION_RECOMMENDED",

          deterministicEvidenceProduced:
            true,

          independentValidationCompleted:
            false,

          independentValidationRequired:
            true,

          ownerDecisionMade:
            false,

          ownerReviewPending:
            true,

          implementationExecuted:
            false,

          repositoryChangeExecuted:
            false,

          productionDeploymentExecuted:
            false,

          customerDeliveryExecuted:
            false,
        });
      },
    );

    it(
      "binds the owner decision preparation plan candidate tenant owner employee and runtime",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

        const decision =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

        const candidate =
          decision.candidateDecisions[0];

        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

        const candidatePreparation =
          preparation
            .candidateDecisionPreparations[0];

        expect(candidate).toBeDefined();

        expect(
          candidatePreparation,
        ).toBeDefined();

        expect(
          execution.ownerSecondTaskExecutionDecisionId,
        ).toBe(decision.decisionId);

        expect(
          execution.ownerSecondTaskExecutionDecisionDigest,
        ).toBe(decision.decisionDigest);

        expect(
          execution.sourceDecisionPreparationId,
        ).toBe(
          decision.sourcePreparationId,
        );

        expect(
          execution.sourceDecisionPreparationDigest,
        ).toBe(
          decision.sourcePreparationDigest,
        );

        expect(
          execution.sourceCandidateDecisionPreparationDigest,
        ).toBe(
          candidate
            ?.sourceCandidateDecisionPreparationDigest,
        );

        expect(
          execution.sourceCandidatePlanDigest,
        ).toBe(
          candidatePreparation
            ?.sourceCandidatePlanDigest,
        );

        expect(
          execution.candidateDecisionDigest,
        ).toBe(
          candidate?.candidateDecisionDigest,
        );

        expect(execution.employeeId).toBe(
          candidate?.employeeId,
        );

        expect(execution.runtimeId).toBe(
          candidate?.runtimeId,
        );
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only draft-only execution",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .taskContract,
        ).toEqual({
          workstreamId:
            "routine-engineering-second-task-evidence",

          evidenceClass:
            "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          evidenceToolMode:
            "READ_ONLY",

          outputMode:
            "DRAFT_ONLY",

          maximumTaskCount:
            1,

          executedTaskCount:
            1,

          remainingTaskCapacity:
            0,

          concurrentTaskLimit:
            1,

          failureThreshold:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_SYNTHETIC_TASK",
        });
      },
    );

    it(
      "keeps seven candidates waiting and preserves every sensitive authority block",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          exactIshaanSecondTaskExecuted:
            true,

          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
            true,

          nextCandidateExecutionAuthorized:
            false,

          remainingSevenAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          thirdSyntheticTaskExecutionAuthorized:
            false,

          repositoryReadPerformed:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWritePerformed:
            false,

          repositoryWriteAuthorized:
            false,

          productionDatabaseAccessPerformed:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationPerformed:
            false,

          productionMutationAuthorized:
            false,

          productionDeploymentExecuted:
            false,

          productionDeploymentAuthorized:
            false,

          realCustomerDataUsed:
            false,

          realCustomerContactPerformed:
            false,

          externalDeliveryExecuted:
            false,

          liveProviderExecutionAuthorized:
            false,

          paymentExecutionPerformed:
            false,

          paymentExecutionAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          levelThreeAuthorityGranted:
            false,

          publicLaunchAuthorized:
            false,

          founderLiberationAchieved:
            false,

          founderReleasedFromRoutineExecution:
            false,

          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "requires the canonical owner decision and rejects execution before approval",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceIshaanSecondSyntheticTask({
              ...executionInput(),

              ownerSecondTaskExecutionDecision: {
                ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
            }),
        ).toThrow(
          "canonical owner second-task execution decision",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceIshaanSecondSyntheticTask({
              ...executionInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede owner approval",
        );
      },
      60_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceIshaanSecondSyntheticTask(
            executionInput(),
          );

        const second =
          executeEngineeringAIWorkforceIshaanSecondSyntheticTask(
            executionInput(),
          );

        expect(second).toEqual(first);

        expect(first.executionDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(Object.isFrozen(first)).toBe(
          true,
        );

        expect(
          Object.isFrozen(
            first.taskContract,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticArchitectureFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.architectureTradeOffPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.architectureTradeOffPlan
              .options,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          executionBoundary: {
            ...first.executionBoundary,

            repositoryReadAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution(
              tampered,
            ),
        ).toThrow(
          "execution boundary is invalid",
        );
      },
      90_000,
    );

    it(
      "rejects credential-bearing execution identity",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceIshaanSecondSyntheticTask({
              ...executionInput(),

              executionId:
                "secret-ishaan-second-task-execution",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      60_000,
    );
  },
);