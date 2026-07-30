import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_DRAFT,
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO,
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_ADVIK_SYNTHETIC_RED_TEAM_EVALUATION_FIXTURE,
  executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask,
  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution,
} from "../engineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution";

function executionInput() {
  return {
    executionId:
      "engineering-advik-first-synthetic-pilot-execution-test-001",

    zaraOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Advik first synthetic pilot task execution",
  () => {
    it(
      "executes exactly Advik first bounded synthetic task and stops for mandatory owner review",
      () => {
        const execution =
          executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask(
            executionInput(),
          );

        expect(execution.executionState).toBe(
          "ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED",
        );

        expect(execution.publicName).toBe(
          "Advik",
        );

        expect(execution.executionSequence).toBe(
          8,
        );

        expect(execution.taskSequence).toBe(
          1,
        );

        expect(execution.scenarioId).toBe(
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_SCENARIO,
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
          "AWAIT_OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW",
        );
      },
      120_000,
    );

    it(
      "creates the exact authority escalation threat review draft",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          execution.syntheticRedTeamEvaluationFixture,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ADVIK_SYNTHETIC_RED_TEAM_EVALUATION_FIXTURE,
        );

        expect(
          execution.canonicalEvidenceSubstitutionTestPlanDraft,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ADVIK_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_DRAFT,
        );

        expect(
          execution.canonicalEvidenceSubstitutionTestPlanDraft,
        ).toMatchObject({
          draftStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          analysisOutcome:
            "BOUNDED_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_RECOMMENDED",

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
          execution.canonicalEvidenceSubstitutionTestPlanDraft
            .analysisStages,
        ).toHaveLength(4);

        expect(
          execution.canonicalEvidenceSubstitutionTestPlanDraft
            .evidenceGates,
        ).toHaveLength(5);

        expect(
          execution.canonicalEvidenceSubstitutionTestPlanDraft
            .identifiedBlockers,
        ).toHaveLength(3);
      },
    );

    it(
      "binds the canonical Zara review owner decision candidate preparation and shadow evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        const review =
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        const advik =
          decision.candidateDecisions.find(
            (candidate) =>
              candidate.publicName === "Advik",
          );

        expect(advik).toBeDefined();

        expect(
          execution.sourceZaraOwnerReviewDecisionId,
        ).toBe(review.decisionId);

        expect(
          execution.sourceZaraOwnerReviewDecisionDigest,
        ).toBe(review.decisionDigest);

        expect(
          execution.sourceZaraExecutionId,
        ).toBe(review.sourceExecutionId);

        expect(
          execution.sourceZaraExecutionDigest,
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
        ).toBe(advik?.candidateDecisionDigest);

        expect(execution.tenantId).toBe(
          review.tenantId,
        );

        expect(execution.ownerId).toBe(
          review.ownerId,
        );

        expect(execution.employeeId).toBe(
          advik?.employeeId,
        );

        expect(execution.runtimeId).toBe(
          advik?.runtimeId,
        );
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only evidence and draft-only output",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

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
          execution.syntheticRedTeamEvaluationFixture
            .syntheticOnly,
        ).toBe(true);

        expect(
          execution.syntheticRedTeamEvaluationFixture
            .realCustomerDataUsed,
        ).toBe(false);

        expect(
          execution.syntheticRedTeamEvaluationFixture
            .repositoryEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticRedTeamEvaluationFixture
            .productionEvidenceUsed,
        ).toBe(false);
      },
    );

    it(
      "keeps the final candidate execution stopped until Advik owner review",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          exactAdvikFirstTaskExecuted:
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
            false,

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
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "requires the canonical Zara owner-review decision and rejects execution before approval",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask({
              ...executionInput(),

              zaraOwnerReviewDecision: {
                ...ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
            }),
        ).toThrow(
          "canonical Zara owner-review decision",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask({
              ...executionInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Zara owner review approval",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask(
            executionInput(),
          );

        const second =
          executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask(
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
            first.syntheticRedTeamEvaluationFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.canonicalEvidenceSubstitutionTestPlanDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.canonicalEvidenceSubstitutionTestPlanDraft
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
            validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution(
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
          EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution(
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
            executeEngineeringAIWorkforceAdvikFirstSyntheticPilotTask({
              ...executionInput(),

              executionId:
                "secret-advik-first-pilot-execution",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      120_000,
    );
  },
);
