import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_SECURITY_REVIEW_PLAN,
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,
  executeEngineeringAIWorkforceAnayaSecondSyntheticTask,
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceAnayaSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceAnayaSecondSyntheticTaskExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-anaya-second-synthetic-task-execution-test-001",

    vivaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Anaya second synthetic task execution",
  () => {
    it(
      "executes only Anaya second-task sequence four",
      () => {
        const record =
          executeEngineeringAIWorkforceAnayaSecondSyntheticTask(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          executionState:
            "ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTED",

          employeeId:
            "candidate-anaya-v1",

          employeeCode:
            "nx-engineering-004",

          publicName:
            "Anaya",

          officialRole:
            "AI Security Engineering Director",

          taskSequence:
            2,

          scenarioId:
            "SECURITY_BOUNDARY_REVIEW_PLAN",

          nextStep:
            "AWAIT_OWNER_ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_REVIEW",
        });

        expect(
          record.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);
      },
    );

    it(
      "creates deterministic tenant-isolation fail-closed and escalation evidence",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_SECURITY_REVIEW_PLAN;

        expect(plan).toMatchObject({
          evidenceClass:
            "DETERMINISTIC_SECURITY_BOUNDARY_REVIEW_PLAN",

          reviewOutcome:
            "BOUNDED_FAIL_CLOSED_SECURITY_REVIEW_RECOMMENDED",

          planningMode:
            "PLAN_ONLY_NO_PROTECTED_ACCESS",

          secretsAccessPerformed:
            false,

          repositoryAccessPerformed:
            false,

          productionAccessPerformed:
            false,
        });

        expect(
          plan.threatModel,
        ).toHaveLength(5);

        expect(
          plan.controlReview,
        ).toHaveLength(5);

        expect(
          plan.failClosedRules,
        ).toHaveLength(6);

        expect(
          plan.ownerEscalationRules,
        ).toHaveLength(5);

        expect(
          plan.recoveryChecks,
        ).toHaveLength(4);
      },
    );

    it(
      "uses no secrets repository customer provider or production access",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          protectedMaterialUsed:
            false,

          secretsAccessPerformed:
            false,

          secretsAccessAuthorized:
            false,

          repositoryReadPerformed:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWritePerformed:
            false,

          repositoryWriteAuthorized:
            false,

          realCustomerDataUsed:
            false,

          realCustomerContactPerformed:
            false,

          externalDeliveryExecuted:
            false,

          liveProviderExecutionPerformed:
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
      "stops for owner review and keeps four candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
            true,

          nextCandidateExecutionAuthorized:
            false,

          remainingFourAuthorizedCandidatesWaiting:
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
      "rejects tampered owner review and execution before approval time",
      () => {
        const tamperedReview = {
          ...ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            executeEngineeringAIWorkforceAnayaSecondSyntheticTask({
              ...canonicalInput(),

              vivaanOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            executeEngineeringAIWorkforceAnayaSecondSyntheticTask({
              ...canonicalInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Vivaan owner review",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceAnayaSecondSyntheticTask(
            canonicalInput(),
          );

        const second =
          executeEngineeringAIWorkforceAnayaSecondSyntheticTask(
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
            first.securityReviewPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.securityReviewPlan
              .threatModel,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.securityReviewPlan
              .controlReview,
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

            secretsAccessAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceAnayaSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution(
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
            executeEngineeringAIWorkforceAnayaSecondSyntheticTask({
              ...canonicalInput(),

              executionId:
                "secret-anaya-second-task-execution",
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
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_REVIEW",
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