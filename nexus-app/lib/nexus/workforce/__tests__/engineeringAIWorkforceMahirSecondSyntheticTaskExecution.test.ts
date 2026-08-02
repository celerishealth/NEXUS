import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_CHAOS_CONTAINMENT_PLAN,
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,
  executeEngineeringAIWorkforceMahirSecondSyntheticTask,
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceMahirSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceMahirSecondSyntheticTaskExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-mahir-second-synthetic-task-execution-test-001",

    atharvOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Mahir second synthetic task execution",
  () => {
    it(
      "executes only Mahir second-task sequence six",
      () => {
        const record =
          executeEngineeringAIWorkforceMahirSecondSyntheticTask(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          executionState:
            "ENGINEERING_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTED",

          employeeId:
            "candidate-mahir-v1",

          employeeCode:
            "nx-engineering-006",

          publicName:
            "Mahir",

          officialRole:
            "AI Chaos Engineering Specialist",

          taskSequence:
            2,

          scenarioId:
            "CHAOS_FAILURE_CONTAINMENT_PLAN",

          nextStep:
            "AWAIT_OWNER_ENGINEERING_MAHIR_SECOND_SYNTHETIC_TASK_REVIEW",
        });

        expect(
          record.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);
      },
    );

    it(
      "creates deterministic simulated-failure containment evidence",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_CHAOS_CONTAINMENT_PLAN;

        expect(plan).toMatchObject({
          evidenceClass:
            "DETERMINISTIC_CHAOS_FAILURE_CONTAINMENT_PLAN",

          reviewOutcome:
            "BOUNDED_SIMULATED_FAILURE_CONTAINMENT_RECOMMENDED",

          planningMode:
            "PLAN_ONLY_NO_REAL_FAILURE_INJECTION",

          realFailureInjected:
            false,

          liveEnvironmentAffected:
            false,

          productionExecutionPerformed:
            false,
        });

        expect(
          plan.simulatedFailureScenarios,
        ).toHaveLength(5);

        expect(
          plan.blastRadiusControls,
        ).toHaveLength(5);

        expect(
          plan.emergencyPauseGates,
        ).toHaveLength(5);

        expect(
          plan.rollbackCheckpoints,
        ).toHaveLength(4);

        expect(
          plan.ownerReviewGates,
        ).toHaveLength(5);

        expect(
          plan.stopConditions,
        ).toHaveLength(6);
      },
    );

    it(
      "injects no real failure and performs no live activity",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          realFailureInjected:
            false,

          realFailureInjectionAuthorized:
            false,

          liveEnvironmentAffected:
            false,

          liveProviderExecutionPerformed:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAccessPerformed:
            false,

          productionMutationPerformed:
            false,

          productionDeploymentPrepared:
            false,

          productionDeploymentExecuted:
            false,

          repositoryReadPerformed:
            false,

          repositoryWritePerformed:
            false,

          externalDeliveryExecuted:
            false,

          paymentExecutionPerformed:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "stops for owner review and keeps two candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
            true,

          nextCandidateExecutionAuthorized:
            false,

          remainingTwoAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          thirdSyntheticTaskExecutionAuthorized:
            false,

          simulatedFailurePlanCreated:
            true,

          blastRadiusControlsCreated:
            true,

          emergencyPauseGatesCreated:
            true,

          rollbackCheckpointsCreated:
            true,

          ownerReviewGatesCreated:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,

          levelThreeAuthorityGranted:
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
      "rejects tampered owner review and execution before approval time",
      () => {
        const tamperedReview = {
          ...ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            executeEngineeringAIWorkforceMahirSecondSyntheticTask({
              ...canonicalInput(),

              atharvOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            executeEngineeringAIWorkforceMahirSecondSyntheticTask({
              ...canonicalInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Atharv owner review",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceMahirSecondSyntheticTask(
            canonicalInput(),
          );

        const second =
          executeEngineeringAIWorkforceMahirSecondSyntheticTask(
            canonicalInput(),
          );

        expect(second).toEqual(first);

        expect(
          first.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.chaosContainmentPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.chaosContainmentPlan
              .simulatedFailureScenarios,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.chaosContainmentPlan
              .blastRadiusControls,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.chaosContainmentPlan
              .emergencyPauseGates,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        const tampered = {
          ...first,

          executionBoundary: {
            ...first.executionBoundary,

            realFailureInjectionAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceMahirSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "rejects credential-bearing execution identity",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceMahirSecondSyntheticTask({
              ...canonicalInput(),

              executionId:
                "secret-mahir-second-task-execution",
            }),
        ).toThrow(
          "canonical safe identifier",
        );
      },
    );

    it(
      "exports one valid execution while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            validateEngineeringAIWorkforceMahirSecondSyntheticTaskExecution(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_MAHIR_SECOND_SYNTHETIC_TASK_REVIEW",
        );

        expect(
          record.executionBoundary
            .founderLiberationAchieved,
        ).toBe(false);

        expect(
          record.executionBoundary
            .levelThreeAuthorityGranted,
        ).toBe(false);
      },
      120_000,
    );
  },
);