import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_SYSTEMS_EVALUATION_PLAN,
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,
  executeEngineeringAIWorkforceAdvikSecondSyntheticTask,
  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution,
  type EngineeringAIWorkforceAdvikSecondSyntheticTaskExecution,
} from "../engineeringAIWorkforceAdvikSecondSyntheticTaskExecution";

function canonicalInput() {
  return {
    executionId:
      "engineering-advik-second-synthetic-task-execution-test-001",

    zaraOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Advik second synthetic task execution",
  () => {
    it(
      "executes only final candidate Advik sequence eight",
      () => {
        const record =
          executeEngineeringAIWorkforceAdvikSecondSyntheticTask(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          executionState:
            "ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTED",

          employeeId:
            "candidate-advik-v1",

          employeeCode:
            "nx-engineering-008",

          publicName:
            "Advik",

          officialRole:
            "AI Systems Evaluation & Red-Team Specialist",

          candidateSequence:
            8,

          taskSequence:
            2,

          scenarioId:
            "SYSTEMS_EVALUATION_RED_TEAM_PLAN",

          nextStep:
            "AWAIT_OWNER_ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_REVIEW",
        });

        expect(
          record.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);
      },
    );

    it(
      "creates deterministic systems-evaluation evidence",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_SYSTEMS_EVALUATION_PLAN;

        expect(plan).toMatchObject({
          evidenceClass:
            "DETERMINISTIC_SYSTEMS_EVALUATION_RED_TEAM_PLAN",

          reviewOutcome:
            "BOUNDED_SYSTEMS_EVALUATION_RECOMMENDED",

          evaluationMode:
            "PLAN_ONLY_NO_ADVERSARIAL_EXECUTION",

          adversarialExecutionPerformed:
            false,

          authorityBypassPerformed:
            false,

          evidenceSubstitutionPerformed:
            false,
        });

        expect(
          plan.evidenceSubstitutionChecks,
        ).toHaveLength(5);

        expect(
          plan.authorityBypassChecks,
        ).toHaveLength(5);

        expect(
          plan.isolationChecks,
        ).toHaveLength(5);

        expect(
          plan.recoveryChecks,
        ).toHaveLength(4);

        expect(
          plan.ownerControlChecks,
        ).toHaveLength(5);

        expect(
          plan.stopConditions,
        ).toHaveLength(6);
      },
    );

    it(
      "performs no adversarial repository customer or production activity",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          adversarialExecutionPerformed:
            false,

          adversarialExecutionAuthorized:
            false,

          authorityBypassPerformed:
            false,

          authorityBypassAuthorized:
            false,

          evidenceSubstitutionPerformed:
            false,

          evidenceSubstitutionAuthorized:
            false,

          repositoryReadPerformed:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWritePerformed:
            false,

          repositoryWriteAuthorized:
            false,

          secretsAccessPerformed:
            false,

          realCustomerDataUsed:
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
      "completes candidate execution sequence but stops for owner review",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          finalCandidateSecondTaskExecuted:
            true,

          sequenceExecutionCompletePendingOwnerReview:
            true,

          noCandidateExecutionRemaining:
            true,

          nextCandidateExecutionAuthorized:
            false,

          noLaterCandidateExecutionAuthorized:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          ownerReviewRequired:
            true,

          ownerReviewRequiredImmediately:
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
          ...ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            executeEngineeringAIWorkforceAdvikSecondSyntheticTask({
              ...canonicalInput(),

              zaraOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            executeEngineeringAIWorkforceAdvikSecondSyntheticTask({
              ...canonicalInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Zara owner review",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceAdvikSecondSyntheticTask(
            canonicalInput(),
          );

        const second =
          executeEngineeringAIWorkforceAdvikSecondSyntheticTask(
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
            first.systemsEvaluationPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.systemsEvaluationPlan
              .evidenceSubstitutionChecks,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.systemsEvaluationPlan
              .authorityBypassChecks,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.systemsEvaluationPlan
              .isolationChecks,
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

            authorityBypassAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceAdvikSecondSyntheticTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution(
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
            executeEngineeringAIWorkforceAdvikSecondSyntheticTask({
              ...canonicalInput(),

              executionId:
                "secret-advik-second-task-execution",
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
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_REVIEW",
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