import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_COORDINATION_PLAN,
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,
  executeEngineeringAIWorkforceLeelaSecondSyntheticTask,
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceLeelaSecondSyntheticTaskExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-leela-second-synthetic-task-execution-test-001",

    ishaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Leela second synthetic task execution",
  () => {
    it(
      "executes exactly Leela sequence two after canonical Ishaan owner review",
      () => {
        const record =
          executeEngineeringAIWorkforceLeelaSecondSyntheticTask(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          executionState:
            "ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_EXECUTED",

          employeeId:
            "candidate-leela-v1",

          employeeCode:
            "nx-engineering-002",

          publicName:
            "Leela",

          officialRole:
            "AI Software Engineering Director",

          taskSequence:
            2,

          scenarioId:
            "ENGINEERING_DELIVERY_COORDINATION_PLAN",

          nextStep:
            "AWAIT_OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW",
        });

        expect(
          record.executionBoundary
            .exactLeelaSecondTaskExecuted,
        ).toBe(true);

        expect(
          record.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);
      },
      90_000,
    );

    it(
      "binds the canonical plan preparation decision runtime and owner review digests",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION;

        const leelaDecision =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .candidateDecisions
            .find(
              (candidate) =>
                candidate.publicName ===
                  "Leela",
            );

        expect(leelaDecision).toBeDefined();

        expect(
          record.runtimeId,
        ).toBe(
          leelaDecision?.runtimeId,
        );

        expect(
          record.sourceCandidateDecisionPreparationDigest,
        ).toBe(
          leelaDecision
            ?.sourceCandidateDecisionPreparationDigest,
        );

        expect(
          record.candidateDecisionDigest,
        ).toBe(
          leelaDecision
            ?.candidateDecisionDigest,
        );

        expect(
          record.sourceIshaanOwnerReviewDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decisionDigest,
        );
      },
    );

    it(
      "creates deterministic sequential conflict-safe pause escalation and owner-review evidence",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_COORDINATION_PLAN;

        expect(plan).toMatchObject({
          evidenceClass:
            "DETERMINISTIC_ENGINEERING_DELIVERY_COORDINATION_PLAN",

          reviewOutcome:
            "BOUNDED_SEQUENTIAL_COORDINATION_RECOMMENDED",

          coordinationMode:
            "STRICTLY_SEQUENTIAL_OWNER_CONTROLLED",

          concurrentExecutionAllowed:
            false,

          implementationExecuted:
            false,

          repositoryChangeExecuted:
            false,

          productionDeploymentExecuted:
            false,

          customerDeliveryExecuted:
            false,
        });

        expect(
          plan.recommendedSequence.map(
            (stage) =>
              stage.sequence,
          ),
        ).toEqual([
          1,
          2,
          3,
          4,
          5,
        ]);

        expect(
          plan.conflictPreventionControls.length,
        ).toBeGreaterThanOrEqual(5);

        expect(
          plan.pauseControls.length,
        ).toBeGreaterThanOrEqual(5);

        expect(
          plan.escalationControls.length,
        ).toBeGreaterThanOrEqual(5);

        expect(
          plan.ownerReviewControls.length,
        ).toBeGreaterThanOrEqual(5);
      },
    );

    it(
      "keeps next candidate blocked remaining six waiting and all consequential authority denied",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
            true,

          nextCandidateExecutionAuthorized:
            false,

          remainingSixAuthorizedCandidatesWaiting:
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

          branchCreationAuthorized:
            false,

          pullRequestPreparationAuthorized:
            false,

          mergeAuthorized:
            false,

          secretsAccessAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          levelThreeAuthorityGranted:
            false,

          productionReadinessAuthorized:
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
      "rejects execution before owner review and cross-review authorization",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceLeelaSecondSyntheticTask({
              ...canonicalInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Ishaan owner review",
        );

        const tamperedReview = {
          ...ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            executeEngineeringAIWorkforceLeelaSecondSyntheticTask({
              ...canonicalInput(),

              ishaanOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();
      },
      90_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceLeelaSecondSyntheticTask(
            canonicalInput(),
          );

        const second =
          executeEngineeringAIWorkforceLeelaSecondSyntheticTask(
            canonicalInput(),
          );

        expect(second).toEqual(first);

        expect(first.executionDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.taskContract,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticDeliveryFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticDeliveryFixture
              .syntheticWorkItems,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.deliveryCoordinationPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.deliveryCoordinationPlan
              .recommendedSequence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          executionBoundary: {
            ...first.executionBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
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
            executeEngineeringAIWorkforceLeelaSecondSyntheticTask({
              ...canonicalInput(),

              executionId:
                "secret-leela-second-task-execution",
            }),
        ).toThrow(
          "canonical safe identifier",
        );
      },
      60_000,
    );

    it(
      "exports one valid canonical execution and stops for owner review",
      () => {
        expect(
          () =>
            validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
              ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,
            ),
        ).not.toThrow();

        expect(
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
            .nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW",
        );

        expect(
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary
            .nextCandidateExecutionAuthorized,
        ).toBe(false);
      },
      90_000,
    );
  },
);