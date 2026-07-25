import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_EVIDENCE_GATED_DELIVERY_PLAN_DRAFT,
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO,
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_LEELA_SYNTHETIC_DELIVERY_FIXTURE,
  executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask,
  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution,
} from "../engineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution";

function executionInput() {
  return {
    executionId:
      "engineering-leela-first-synthetic-pilot-execution-test-001",

    ishaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Leela first synthetic pilot task execution",
  () => {
    it(
      "executes exactly Leela first bounded synthetic task and stops for mandatory owner review",
      () => {
        const execution =
          executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask(
            executionInput(),
          );

        expect(execution.executionState).toBe(
          "ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED",
        );

        expect(execution.publicName).toBe(
          "Leela",
        );

        expect(execution.executionSequence).toBe(
          2,
        );

        expect(execution.taskSequence).toBe(
          1,
        );

        expect(execution.scenarioId).toBe(
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO,
        );

        expect(
          execution.executionBoundary
            .taskExecutorInvocationCount,
        ).toBe(1);

        expect(
          execution.executionBoundary
            .syntheticPilotTaskExecutionPerformed,
        ).toBe(true);

        expect(execution.nextStep).toBe(
          "AWAIT_OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW",
        );
      },
      120_000,
    );

    it(
      "creates the exact evidence-gated engineering delivery plan draft",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          execution.syntheticDeliveryFixture,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_LEELA_SYNTHETIC_DELIVERY_FIXTURE,
        );

        expect(
          execution.evidenceGatedDeliveryPlanDraft,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_LEELA_EVIDENCE_GATED_DELIVERY_PLAN_DRAFT,
        );

        expect(
          execution.evidenceGatedDeliveryPlanDraft,
        ).toMatchObject({
          draftStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          planOutcome:
            "BOUNDED_EVIDENCE_GATED_DELIVERY_PLAN_RECOMMENDED",

          riskLevel:
            "MEDIUM",

          assumptionsMade:
            false,

          unsupportedClaimsIncluded:
            false,

          ownerDecisionMade:
            false,

          implementationPrepared:
            false,

          repositoryChangeExecuted:
            false,

          productionDeploymentExecuted:
            false,

          customerDeliveryExecuted:
            false,
        });

        expect(
          execution.evidenceGatedDeliveryPlanDraft
            .deliveryStages,
        ).toHaveLength(4);

        expect(
          execution.evidenceGatedDeliveryPlanDraft
            .evidenceGates,
        ).toHaveLength(5);

        expect(
          execution.evidenceGatedDeliveryPlanDraft
            .identifiedBlockers,
        ).toHaveLength(3);
      },
    );

    it(
      "binds the canonical Ishaan review owner decision candidate preparation and shadow evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        const review =
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        const leela =
          decision.candidateDecisions.find(
            (candidate) =>
              candidate.publicName === "Leela",
          );

        expect(leela).toBeDefined();

        expect(
          execution.sourceIshaanOwnerReviewDecisionId,
        ).toBe(review.decisionId);

        expect(
          execution.sourceIshaanOwnerReviewDecisionDigest,
        ).toBe(review.decisionDigest);

        expect(
          execution.sourceIshaanExecutionId,
        ).toBe(review.sourceExecutionId);

        expect(
          execution.sourceIshaanExecutionDigest,
        ).toBe(review.sourceExecutionDigest);

        expect(
          execution.ownerFirstTaskExecutionDecisionId,
        ).toBe(decision.decisionId);

        expect(
          execution.ownerFirstTaskExecutionDecisionDigest,
        ).toBe(decision.decisionDigest);

        expect(
          execution.sourcePreparationDigest,
        ).toBe(decision.sourcePreparationDigest);

        expect(
          execution.candidateDecisionDigest,
        ).toBe(leela?.candidateDecisionDigest);

        expect(execution.tenantId).toBe(
          review.tenantId,
        );

        expect(execution.ownerId).toBe(
          review.ownerId,
        );

        expect(execution.employeeId).toBe(
          leela?.employeeId,
        );

        expect(execution.runtimeId).toBe(
          leela?.runtimeId,
        );
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only evidence and draft-only output",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(execution.pilotTask).toEqual({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          actorClass:
            "OWNER_SUPERVISED_INTERNAL_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          evidenceToolMode:
            "READ_ONLY",

          draftToolMode:
            "DRAFT_ONLY",

          maximumTaskCount:
            3,

          executedTaskCount:
            1,

          remainingTaskCapacity:
            2,

          concurrentTaskLimit:
            1,

          failureThreshold:
            1,

          ownerReviewFrequency:
            "AFTER_EVERY_PILOT_TASK",
        });

        expect(
          execution.syntheticDeliveryFixture
            .syntheticOnly,
        ).toBe(true);

        expect(
          execution.syntheticDeliveryFixture
            .realCustomerDataUsed,
        ).toBe(false);

        expect(
          execution.syntheticDeliveryFixture
            .repositoryEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticDeliveryFixture
            .productionEvidenceUsed,
        ).toBe(false);
      },
    );

    it(
      "keeps the remaining six candidates waiting until Leela owner review",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          exactLeelaFirstTaskExecuted:
            true,

          pilotCompleted:
            false,

          ownerDecisionMade:
            false,

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

          secondSyntheticPilotTaskExecutionAuthorized:
            false,

          thirdSyntheticPilotTaskExecutionAuthorized:
            false,

          monitoringRequired:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "keeps every repository production customer payment provider and launch authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
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

          productionDeploymentAuthorized:
            false,

          secretsAccessAuthorized:
            false,

          realCustomerDataUsed:
            false,

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactPerformed:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryExecuted:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationPerformed:
            false,

          productionMutationAuthorized:
            false,

          paymentExecutionPerformed:
            false,

          paymentExecutionAuthorized:
            false,

          financialCommitmentAuthorized:
            false,

          legalCommitmentAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          productionReadinessAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "requires the canonical Ishaan owner-review decision and rejects execution before approval",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask({
              ...executionInput(),

              ishaanOwnerReviewDecision: {
                ...ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
            }),
        ).toThrow(
          "canonical Ishaan owner-review decision",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask({
              ...executionInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Ishaan owner review approval",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask(
            executionInput(),
          );

        const second =
          executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask(
            executionInput(),
          );

        expect(second).toEqual(first);

        expect(first.executionDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(first.pilotTask),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.syntheticDeliveryFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceGatedDeliveryPlanDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceGatedDeliveryPlanDraft
              .deliveryStages,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution(
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
          EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution(
              tampered,
            ),
        ).toThrow(
          "execution boundary is invalid",
        );
      },
      120_000,
    );

    it(
      "rejects credential-bearing execution identity",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask({
              ...executionInput(),

              executionId:
                "secret-leela-first-pilot-execution",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      120_000,
    );
  },
);
