import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_DRAFT,
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO,
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_MAHIR_SYNTHETIC_CHAOS_FIXTURE,
  executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask,
  validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution,
} from "../engineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution";

function executionInput() {
  return {
    executionId:
      "engineering-mahir-first-synthetic-pilot-execution-test-001",

    atharvOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Mahir first synthetic pilot task execution",
  () => {
    it(
      "executes exactly Mahir first bounded synthetic task and stops for mandatory owner review",
      () => {
        const execution =
          executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask(
            executionInput(),
          );

        expect(execution.executionState).toBe(
          "ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED",
        );

        expect(execution.publicName).toBe(
          "Mahir",
        );

        expect(execution.executionSequence).toBe(
          6,
        );

        expect(execution.taskSequence).toBe(
          1,
        );

        expect(execution.scenarioId).toBe(
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO,
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
          "AWAIT_OWNER_ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_REVIEW",
        );
      },
      120_000,
    );

    it(
      "creates the exact authority escalation threat review draft",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          execution.syntheticChaosFixture,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_MAHIR_SYNTHETIC_CHAOS_FIXTURE,
        );

        expect(
          execution.singleFailureClassExperimentPlanDraft,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_MAHIR_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_DRAFT,
        );

        expect(
          execution.singleFailureClassExperimentPlanDraft,
        ).toMatchObject({
          draftStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          analysisOutcome:
            "BOUNDED_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_RECOMMENDED",

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
          execution.singleFailureClassExperimentPlanDraft
            .analysisStages,
        ).toHaveLength(4);

        expect(
          execution.singleFailureClassExperimentPlanDraft
            .evidenceGates,
        ).toHaveLength(5);

        expect(
          execution.singleFailureClassExperimentPlanDraft
            .identifiedBlockers,
        ).toHaveLength(3);
      },
    );

    it(
      "binds the canonical Atharv review owner decision candidate preparation and shadow evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        const review =
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        const mahir =
          decision.candidateDecisions.find(
            (candidate) =>
              candidate.publicName === "Mahir",
          );

        expect(mahir).toBeDefined();

        expect(
          execution.sourceAtharvOwnerReviewDecisionId,
        ).toBe(review.decisionId);

        expect(
          execution.sourceAtharvOwnerReviewDecisionDigest,
        ).toBe(review.decisionDigest);

        expect(
          execution.sourceAtharvExecutionId,
        ).toBe(review.sourceExecutionId);

        expect(
          execution.sourceAtharvExecutionDigest,
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
        ).toBe(mahir?.candidateDecisionDigest);

        expect(execution.tenantId).toBe(
          review.tenantId,
        );

        expect(execution.ownerId).toBe(
          review.ownerId,
        );

        expect(execution.employeeId).toBe(
          mahir?.employeeId,
        );

        expect(execution.runtimeId).toBe(
          mahir?.runtimeId,
        );
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only evidence and draft-only output",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

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
          execution.syntheticChaosFixture
            .syntheticOnly,
        ).toBe(true);

        expect(
          execution.syntheticChaosFixture
            .realCustomerDataUsed,
        ).toBe(false);

        expect(
          execution.syntheticChaosFixture
            .repositoryEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticChaosFixture
            .productionEvidenceUsed,
        ).toBe(false);
      },
    );

    it(
      "keeps the remaining two candidates waiting until Mahir owner review",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          exactMahirFirstTaskExecuted:
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

          remainingTwoAuthorizedCandidatesWaiting:
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
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "requires the canonical Atharv owner-review decision and rejects execution before approval",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask({
              ...executionInput(),

              atharvOwnerReviewDecision: {
                ...ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
            }),
        ).toThrow(
          "canonical Atharv owner-review decision",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask({
              ...executionInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Atharv owner review approval",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask(
            executionInput(),
          );

        const second =
          executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask(
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
            first.syntheticChaosFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.singleFailureClassExperimentPlanDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.singleFailureClassExperimentPlanDraft
              .analysisStages,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution(
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
          EngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution(
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
            executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask({
              ...executionInput(),

              executionId:
                "secret-mahir-first-pilot-execution",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      120_000,
    );
  },
);
