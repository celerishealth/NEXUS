import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_DATA_QUALITY_PLAN,
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,
  executeEngineeringAIWorkforceZaraSecondSyntheticTask,
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceZaraSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceZaraSecondSyntheticTaskExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-zara-second-synthetic-task-execution-test-001",

    mahirOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Zara second synthetic task execution",
  () => {
    it(
      "executes only Zara second-task sequence seven",
      () => {
        const record =
          executeEngineeringAIWorkforceZaraSecondSyntheticTask(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          executionState:
            "ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_EXECUTED",

          employeeId:
            "candidate-zara-v1",

          employeeCode:
            "nx-engineering-007",

          publicName:
            "Zara",

          officialRole:
            "AI Data Engineering & Analytics Specialist",

          taskSequence:
            2,

          scenarioId:
            "DATA_PIPELINE_QUALITY_PLAN",

          nextStep:
            "AWAIT_OWNER_ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_REVIEW",
        });

        expect(
          record.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);
      },
    );

    it(
      "creates deterministic schema tenant lineage reconciliation and recovery evidence",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_DATA_QUALITY_PLAN;

        expect(plan).toMatchObject({
          evidenceClass:
            "DETERMINISTIC_DATA_PIPELINE_QUALITY_PLAN",

          reviewOutcome:
            "BOUNDED_DATA_QUALITY_VALIDATION_RECOMMENDED",

          planningMode:
            "PLAN_ONLY_NO_DATABASE_ACCESS_OR_MUTATION",

          realCustomerDataUsed:
            false,

          databaseAccessPerformed:
            false,

          databaseMutationPerformed:
            false,
        });

        expect(
          plan.schemaChecks,
        ).toHaveLength(5);

        expect(
          plan.tenantBoundaryChecks,
        ).toHaveLength(5);

        expect(
          plan.lineageCheckpoints,
        ).toHaveLength(5);

        expect(
          plan.reconciliationChecks,
        ).toHaveLength(4);

        expect(
          plan.recoveryChecks,
        ).toHaveLength(4);

        expect(
          plan.stopConditions,
        ).toHaveLength(6);
      },
    );

    it(
      "uses no customer data and performs no database or repository activity",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          realCustomerDataUsed:
            false,

          realCustomerDataAccessAuthorized:
            false,

          databaseAccessPerformed:
            false,

          productionDatabaseAuthorized:
            false,

          databaseMutationPerformed:
            false,

          productionMutationAuthorized:
            false,

          repositoryReadPerformed:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWritePerformed:
            false,

          repositoryWriteAuthorized:
            false,

          liveProviderExecutionPerformed:
            false,

          productionDeploymentExecuted:
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
      "stops for owner review and keeps Advik waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
            true,

          nextCandidateExecutionAuthorized:
            false,

          remainingOneAuthorizedCandidateWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          thirdSyntheticTaskExecutionAuthorized:
            false,

          schemaChecksCreated:
            true,

          tenantBoundaryChecksCreated:
            true,

          lineageCheckpointsCreated:
            true,

          reconciliationChecksCreated:
            true,

          recoveryChecksCreated:
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
          ...ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            executeEngineeringAIWorkforceZaraSecondSyntheticTask({
              ...canonicalInput(),

              mahirOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            executeEngineeringAIWorkforceZaraSecondSyntheticTask({
              ...canonicalInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Mahir owner review",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceZaraSecondSyntheticTask(
            canonicalInput(),
          );

        const second =
          executeEngineeringAIWorkforceZaraSecondSyntheticTask(
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
            first.dataQualityPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.dataQualityPlan
              .schemaChecks,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.dataQualityPlan
              .tenantBoundaryChecks,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.dataQualityPlan
              .lineageCheckpoints,
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

            productionMutationAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceZaraSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution(
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
            executeEngineeringAIWorkforceZaraSecondSyntheticTask({
              ...canonicalInput(),

              executionId:
                "secret-zara-second-task-execution",
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
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_REVIEW",
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