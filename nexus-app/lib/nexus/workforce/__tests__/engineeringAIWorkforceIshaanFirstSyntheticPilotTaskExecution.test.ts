import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_ARCHITECTURE_REVIEW_DRAFT,
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_SCENARIO,
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SYNTHETIC_ARCHITECTURE_FIXTURE,
  executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask,
  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution,
} from "../engineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution";

function executionInput() {
  return {
    executionId:
      "engineering-ishaan-first-synthetic-pilot-execution-test-001",

    ownerFirstTaskExecutionDecision:
      ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Ishaan first synthetic pilot task execution",
  () => {
    it(
      "executes exactly Ishaan first bounded synthetic task and stops for mandatory owner review",
      () => {
        const execution =
          executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask(
            executionInput(),
          );

        expect(execution.executionState).toBe(
          "ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED",
        );

        expect(execution.publicName).toBe(
          "Ishaan",
        );

        expect(execution.taskSequence).toBe(
          1,
        );

        expect(execution.scenarioId).toBe(
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_SCENARIO,
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
          "AWAIT_OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW",
        );
      },
      30_000,
    );

    it(
      "creates the exact bounded modular architecture review draft",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          execution.syntheticArchitectureFixture,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SYNTHETIC_ARCHITECTURE_FIXTURE,
        );

        expect(
          execution.architectureReviewDraft,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ISHAAN_ARCHITECTURE_REVIEW_DRAFT,
        );

        expect(
          execution.architectureReviewDraft,
        ).toMatchObject({
          draftStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          reviewOutcome:
            "BOUNDED_MODULAR_ARCHITECTURE_RECOMMENDED",

          recommendedArchitecture:
            "MODULAR_MONOLITH_WITH_EXPLICIT_POLICY_AND_AUDIT_BOUNDARIES",

          assumptionsMade:
            false,

          unsupportedClaimsIncluded:
            false,

          ownerDecisionMade:
            false,

          implementationPrepared:
            false,

          repositoryChangePrepared:
            false,

          repositoryChangeExecuted:
            false,

          productionDeploymentPrepared:
            false,

          productionDeploymentExecuted:
            false,

          customerDeliveryPrepared:
            false,

          customerDeliveryExecuted:
            false,
        });

        expect(
          execution.architectureReviewDraft
            .moduleDecisions,
        ).toHaveLength(6);

        expect(
          execution.architectureReviewDraft
            .identifiedRisks,
        ).toHaveLength(4);
      },
    );

    it(
      "binds the canonical owner decision candidate tenant owner employee and runtime",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        const ishaan =
          decision.candidateDecisions[0];

        expect(ishaan).toBeDefined();

        expect(
          execution.ownerFirstTaskExecutionDecisionId,
        ).toBe(decision.decisionId);

        expect(
          execution.ownerFirstTaskExecutionDecisionDigest,
        ).toBe(decision.decisionDigest);

        expect(
          execution.sourcePreparationId,
        ).toBe(decision.sourcePreparationId);

        expect(
          execution.sourcePreparationDigest,
        ).toBe(decision.sourcePreparationDigest);

        expect(
          execution.candidateDecisionDigest,
        ).toBe(
          ishaan?.candidateDecisionDigest,
        );

        expect(execution.tenantId).toBe(
          decision.tenantId,
        );

        expect(execution.ownerId).toBe(
          decision.ownerId,
        );

        expect(execution.employeeId).toBe(
          ishaan?.employeeId,
        );

        expect(execution.runtimeId).toBe(
          ishaan?.runtimeId,
        );
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only evidence and draft-only output",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

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
          execution.syntheticArchitectureFixture
            .syntheticOnly,
        ).toBe(true);

        expect(
          execution.syntheticArchitectureFixture
            .realCustomerDataUsed,
        ).toBe(false);

        expect(
          execution.syntheticArchitectureFixture
            .repositoryEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticArchitectureFixture
            .productionEvidenceUsed,
        ).toBe(false);
      },
    );

    it(
      "keeps the remaining seven candidates waiting until Ishaan owner review",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          exactIshaanFirstTaskExecuted:
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

          remainingSevenAuthorizedCandidatesWaiting:
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
          ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "requires the canonical owner decision and rejects execution before approval",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask({
              ...executionInput(),

              ownerFirstTaskExecutionDecision: {
                ...ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
            }),
        ).toThrow(
          "canonical owner first-task execution decision",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask({
              ...executionInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede owner approval",
        );
      },
      30_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask(
            executionInput(),
          );

        const second =
          executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask(
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
            first.syntheticArchitectureFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.architectureReviewDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.executionBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution(
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
          EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution(
              tampered,
            ),
        ).toThrow(
          "execution boundary is invalid",
        );
      },
      40_000,
    );

    it(
      "rejects credential-bearing execution identity",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask({
              ...executionInput(),

              executionId:
                "secret-ishaan-first-pilot-execution",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      30_000,
    );
  },
);
