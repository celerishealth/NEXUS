import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_SCHEMA_AND_LINEAGE_VALIDATION_DRAFT,
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO,
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_ZARA_SYNTHETIC_DATA_PIPELINE_FIXTURE,
  executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask,
  validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution,
} from "../engineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution";

function executionInput() {
  return {
    executionId:
      "engineering-zara-first-synthetic-pilot-execution-test-001",

    mahirOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Zara first synthetic pilot task execution",
  () => {
    it(
      "executes exactly Zara first bounded synthetic task and stops for mandatory owner review",
      () => {
        const execution =
          executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask(
            executionInput(),
          );

        expect(execution.executionState).toBe(
          "ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED",
        );

        expect(execution.publicName).toBe(
          "Zara",
        );

        expect(execution.executionSequence).toBe(
          7,
        );

        expect(execution.taskSequence).toBe(
          1,
        );

        expect(execution.scenarioId).toBe(
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_SCENARIO,
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
          "AWAIT_OWNER_ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW",
        );
      },
      120_000,
    );

    it(
      "creates the exact authority escalation threat review draft",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          execution.syntheticDataPipelineFixture,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ZARA_SYNTHETIC_DATA_PIPELINE_FIXTURE,
        );

        expect(
          execution.schemaAndLineageValidationDraft,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ZARA_SCHEMA_AND_LINEAGE_VALIDATION_DRAFT,
        );

        expect(
          execution.schemaAndLineageValidationDraft,
        ).toMatchObject({
          draftStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          analysisOutcome:
            "BOUNDED_SCHEMA_AND_LINEAGE_VALIDATION_RECOMMENDED",

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
          execution.schemaAndLineageValidationDraft
            .analysisStages,
        ).toHaveLength(4);

        expect(
          execution.schemaAndLineageValidationDraft
            .evidenceGates,
        ).toHaveLength(5);

        expect(
          execution.schemaAndLineageValidationDraft
            .identifiedBlockers,
        ).toHaveLength(3);
      },
    );

    it(
      "binds the canonical Mahir review owner decision candidate preparation and shadow evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        const review =
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        const zara =
          decision.candidateDecisions.find(
            (candidate) =>
              candidate.publicName === "Zara",
          );

        expect(zara).toBeDefined();

        expect(
          execution.sourceMahirOwnerReviewDecisionId,
        ).toBe(review.decisionId);

        expect(
          execution.sourceMahirOwnerReviewDecisionDigest,
        ).toBe(review.decisionDigest);

        expect(
          execution.sourceMahirExecutionId,
        ).toBe(review.sourceExecutionId);

        expect(
          execution.sourceMahirExecutionDigest,
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
        ).toBe(zara?.candidateDecisionDigest);

        expect(execution.tenantId).toBe(
          review.tenantId,
        );

        expect(execution.ownerId).toBe(
          review.ownerId,
        );

        expect(execution.employeeId).toBe(
          zara?.employeeId,
        );

        expect(execution.runtimeId).toBe(
          zara?.runtimeId,
        );
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only evidence and draft-only output",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

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
          execution.syntheticDataPipelineFixture
            .syntheticOnly,
        ).toBe(true);

        expect(
          execution.syntheticDataPipelineFixture
            .realCustomerDataUsed,
        ).toBe(false);

        expect(
          execution.syntheticDataPipelineFixture
            .repositoryEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticDataPipelineFixture
            .productionEvidenceUsed,
        ).toBe(false);
      },
    );

    it(
      "keeps the remaining one candidate waiting until Zara owner review",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          exactZaraFirstTaskExecuted:
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

          remainingOneAuthorizedCandidateWaiting:
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
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "requires the canonical Mahir owner-review decision and rejects execution before approval",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask({
              ...executionInput(),

              mahirOwnerReviewDecision: {
                ...ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
            }),
        ).toThrow(
          "canonical Mahir owner-review decision",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask({
              ...executionInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Mahir owner review approval",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask(
            executionInput(),
          );

        const second =
          executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask(
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
            first.syntheticDataPipelineFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.schemaAndLineageValidationDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.schemaAndLineageValidationDraft
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
            validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution(
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
          EngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution(
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
            executeEngineeringAIWorkforceZaraFirstSyntheticPilotTask({
              ...executionInput(),

              executionId:
                "secret-zara-first-pilot-execution",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      120_000,
    );
  },
);
