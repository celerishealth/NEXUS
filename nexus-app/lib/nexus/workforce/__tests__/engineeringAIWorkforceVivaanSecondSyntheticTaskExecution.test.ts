import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_REGRESSION_PLAN,
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  executeEngineeringAIWorkforceVivaanSecondSyntheticTask,
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceVivaanSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceVivaanSecondSyntheticTaskExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-vivaan-second-synthetic-task-execution-test-001",

    leelaOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Vivaan second synthetic task execution",
  () => {
    it(
      "executes only Vivaan second-task sequence three",
      () => {
        const record =
          executeEngineeringAIWorkforceVivaanSecondSyntheticTask(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          executionState:
            "ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTED",

          employeeId:
            "candidate-vivaan-v1",

          employeeCode:
            "nx-engineering-003",

          publicName:
            "Vivaan",

          taskSequence:
            2,

          scenarioId:
            "REGRESSION_RISK_CONTAINMENT_PLAN",

          nextStep:
            "AWAIT_OWNER_ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_REVIEW",
        });
      },
    );

    it(
      "creates deterministic risk-based coverage and recovery evidence",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_REGRESSION_PLAN;

        expect(plan).toMatchObject({
          evidenceClass:
            "DETERMINISTIC_REGRESSION_RISK_CONTAINMENT_PLAN",

          planningMode:
            "PLAN_ONLY_NO_TEST_EXECUTION",

          testExecutionPerformed:
            false,

          codeChangePerformed:
            false,

          repositoryAccessPerformed:
            false,
        });

        expect(
          plan.coverageMatrix,
        ).toHaveLength(5);

        expect(
          plan.stopConditions,
        ).toHaveLength(6);

        expect(
          plan.evidenceRequirements,
        ).toHaveLength(6);

        expect(
          plan.recoveryChecks,
        ).toHaveLength(4);
      },
    );

    it(
      "performs no tests code changes repository access or production activity",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          testsExecuted:
            false,

          codeChanged:
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

          productionDatabaseAccessPerformed:
            false,

          productionMutationPerformed:
            false,

          productionDeploymentExecuted:
            false,

          paymentExecutionPerformed:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "stops for owner review and keeps five candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
            true,

          nextCandidateExecutionAuthorized:
            false,

          remainingFiveAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          thirdSyntheticTaskExecutionAuthorized:
            false,

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
      "rejects tampered owner review and premature execution",
      () => {
        const tamperedReview = {
          ...ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            executeEngineeringAIWorkforceVivaanSecondSyntheticTask({
              ...canonicalInput(),

              leelaOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            executeEngineeringAIWorkforceVivaanSecondSyntheticTask({
              ...canonicalInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Leela owner review",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceVivaanSecondSyntheticTask(
            canonicalInput(),
          );

        const second =
          executeEngineeringAIWorkforceVivaanSecondSyntheticTask(
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
            first.regressionRiskPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.regressionRiskPlan
              .coverageMatrix,
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

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceVivaanSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution(
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
            executeEngineeringAIWorkforceVivaanSecondSyntheticTask({
              ...canonicalInput(),

              executionId:
                "secret-vivaan-second-task-execution",
            }),
        ).toThrow(
          "canonical safe identifier",
        );
      },
    );

    it(
      "exports one valid canonical execution while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            validateEngineeringAIWorkforceVivaanSecondSyntheticTaskExecution(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_REVIEW",
        );

        expect(
          record.executionBoundary
            .founderLiberationAchieved,
        ).toBe(false);
      },
      120_000,
    );
  },
);