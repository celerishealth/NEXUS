import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_AUTHORITY_ESCALATION_THREAT_REVIEW_DRAFT,
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO,
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_ANAYA_SYNTHETIC_SECURITY_FIXTURE,
  executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask,
  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution,
} from "../engineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution";

function executionInput() {
  return {
    executionId:
      "engineering-anaya-first-synthetic-pilot-execution-test-001",

    vivaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Anaya first synthetic pilot task execution",
  () => {
    it(
      "executes exactly Anaya first bounded synthetic task and stops for mandatory owner review",
      () => {
        const execution =
          executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask(
            executionInput(),
          );

        expect(execution.executionState).toBe(
          "ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED",
        );

        expect(execution.publicName).toBe(
          "Anaya",
        );

        expect(execution.executionSequence).toBe(
          4,
        );

        expect(execution.taskSequence).toBe(
          1,
        );

        expect(execution.scenarioId).toBe(
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO,
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
          "AWAIT_OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW",
        );
      },
      120_000,
    );

    it(
      "creates the exact authority escalation threat review draft",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          execution.syntheticSecurityFixture,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ANAYA_SYNTHETIC_SECURITY_FIXTURE,
        );

        expect(
          execution.authorityEscalationThreatReviewDraft,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ANAYA_AUTHORITY_ESCALATION_THREAT_REVIEW_DRAFT,
        );

        expect(
          execution.authorityEscalationThreatReviewDraft,
        ).toMatchObject({
          draftStatus:
            "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

          analysisOutcome:
            "BOUNDED_AUTHORITY_ESCALATION_THREAT_REVIEW_RECOMMENDED",

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
          execution.authorityEscalationThreatReviewDraft
            .analysisStages,
        ).toHaveLength(4);

        expect(
          execution.authorityEscalationThreatReviewDraft
            .evidenceGates,
        ).toHaveLength(5);

        expect(
          execution.authorityEscalationThreatReviewDraft
            .identifiedBlockers,
        ).toHaveLength(3);
      },
    );

    it(
      "binds the canonical Vivaan review owner decision candidate preparation and shadow evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        const review =
          ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        const anaya =
          decision.candidateDecisions.find(
            (candidate) =>
              candidate.publicName === "Anaya",
          );

        expect(anaya).toBeDefined();

        expect(
          execution.sourceVivaanOwnerReviewDecisionId,
        ).toBe(review.decisionId);

        expect(
          execution.sourceVivaanOwnerReviewDecisionDigest,
        ).toBe(review.decisionDigest);

        expect(
          execution.sourceVivaanExecutionId,
        ).toBe(review.sourceExecutionId);

        expect(
          execution.sourceVivaanExecutionDigest,
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
        ).toBe(anaya?.candidateDecisionDigest);

        expect(execution.tenantId).toBe(
          review.tenantId,
        );

        expect(execution.ownerId).toBe(
          review.ownerId,
        );

        expect(execution.employeeId).toBe(
          anaya?.employeeId,
        );

        expect(execution.runtimeId).toBe(
          anaya?.runtimeId,
        );
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only evidence and draft-only output",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

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
          execution.syntheticSecurityFixture
            .syntheticOnly,
        ).toBe(true);

        expect(
          execution.syntheticSecurityFixture
            .realCustomerDataUsed,
        ).toBe(false);

        expect(
          execution.syntheticSecurityFixture
            .repositoryEvidenceUsed,
        ).toBe(false);

        expect(
          execution.syntheticSecurityFixture
            .productionEvidenceUsed,
        ).toBe(false);
      },
    );

    it(
      "keeps the remaining four candidates waiting until Anaya owner review",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionBoundary;

        expect(boundary).toMatchObject({
          exactAnayaFirstTaskExecuted:
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

          remainingFourAuthorizedCandidatesWaiting:
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
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "requires the canonical Vivaan owner-review decision and rejects execution before approval",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask({
              ...executionInput(),

              vivaanOwnerReviewDecision: {
                ...ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
            }),
        ).toThrow(
          "canonical Vivaan owner-review decision",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask({
              ...executionInput(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Vivaan owner review approval",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask(
            executionInput(),
          );

        const second =
          executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask(
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
            first.syntheticSecurityFixture,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityEscalationThreatReviewDraft,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityEscalationThreatReviewDraft
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
            validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution(
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
          EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution(
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
            executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask({
              ...executionInput(),

              executionId:
                "secret-anaya-first-pilot-execution",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      120_000,
    );
  },
);
