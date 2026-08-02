import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_RECOVERY_VALIDATION_PLAN,
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,
  executeEngineeringAIWorkforceAtharvSecondSyntheticTask,
  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceAtharvSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceAtharvSecondSyntheticTaskExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-atharv-second-synthetic-task-execution-test-001",

    anayaOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Atharv second synthetic task execution",
  () => {
    it(
      "executes only Atharv second-task sequence five",
      () => {
        const record =
          executeEngineeringAIWorkforceAtharvSecondSyntheticTask(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          executionState:
            "ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTED",

          employeeId:
            "candidate-atharv-v1",

          employeeCode:
            "nx-engineering-005",

          publicName:
            "Atharv",

          officialRole:
            "AI Reliability Engineering Specialist",

          taskSequence:
            2,

          scenarioId:
            "RELIABILITY_RECOVERY_VALIDATION_PLAN",

          nextStep:
            "AWAIT_OWNER_ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_REVIEW",
        });

        expect(
          record.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);
      },
    );

    it(
      "creates deterministic monitoring degradation rollback and audit evidence",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_RECOVERY_VALIDATION_PLAN;

        expect(plan).toMatchObject({
          evidenceClass:
            "DETERMINISTIC_RELIABILITY_RECOVERY_VALIDATION_PLAN",

          reviewOutcome:
            "BOUNDED_RECOVERY_VALIDATION_RECOMMENDED",

          planningMode:
            "PLAN_ONLY_NO_LIVE_EXECUTION",

          liveProviderExecutionPerformed:
            false,

          productionExecutionPerformed:
            false,

          deploymentPerformed:
            false,
        });

        expect(
          plan.monitoringCheckpoints,
        ).toHaveLength(4);

        expect(
          plan.gracefulDegradationPlan,
        ).toHaveLength(4);

        expect(
          plan.rollbackPlan,
        ).toHaveLength(4);

        expect(
          plan.auditCheckpoints,
        ).toHaveLength(6);

        expect(
          plan.stopConditions,
        ).toHaveLength(6);

        expect(
          plan.recoveryChecks,
        ).toHaveLength(5);
      },
    );

    it(
      "performs no provider production deployment or repository activity",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          liveProviderExecutionPerformed:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAccessPerformed:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationPerformed:
            false,

          productionMutationAuthorized:
            false,

          productionDeploymentPrepared:
            false,

          productionDeploymentExecuted:
            false,

          productionDeploymentAuthorized:
            false,

          repositoryReadPerformed:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWritePerformed:
            false,

          repositoryWriteAuthorized:
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
      "stops for owner review and keeps three candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
            true,

          nextCandidateExecutionAuthorized:
            false,

          remainingThreeAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          thirdSyntheticTaskExecutionAuthorized:
            false,

          monitoringPlanCreated:
            true,

          gracefulDegradationPlanCreated:
            true,

          rollbackPlanCreated:
            true,

          auditCheckpointsCreated:
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
          ...ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            executeEngineeringAIWorkforceAtharvSecondSyntheticTask({
              ...canonicalInput(),

              anayaOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            executeEngineeringAIWorkforceAtharvSecondSyntheticTask({
              ...canonicalInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Anaya owner review",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceAtharvSecondSyntheticTask(
            canonicalInput(),
          );

        const second =
          executeEngineeringAIWorkforceAtharvSecondSyntheticTask(
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
            first.recoveryValidationPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.recoveryValidationPlan
              .monitoringCheckpoints,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.recoveryValidationPlan
              .gracefulDegradationPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.recoveryValidationPlan
              .rollbackPlan,
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

            productionDeploymentAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceAtharvSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution(
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
            executeEngineeringAIWorkforceAtharvSecondSyntheticTask({
              ...canonicalInput(),

              executionId:
                "secret-atharv-second-task-execution",
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
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_REVIEW",
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