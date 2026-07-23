import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
} from "../engineeringAIWorkforceLimitedInternalPilotPreparation";

import {
  ENGINEERING_AI_WORKFORCE_FIRST_TASK_EXECUTION_REASONS,
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
  type EngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "../engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-first-task-execution-decision-test-001",

    limitedInternalPilotPreparation:
      ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,

    ownerId:
      ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION.ownerId,

    decisions:
      Array.from(
        {
          length:
            8,
        },
        () =>
          "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" as const,
      ),

    reasons:
      ENGINEERING_AI_WORKFORCE_FIRST_TASK_EXECUTION_REASONS,

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
            .preparedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce owner first synthetic pilot task execution decision",
  () => {
    it(
      "records approval for the first synthetic pilot task of all eight specialists without executing anything",
      () => {
        const record =
          createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
            approvalInput(),
          );

        expect(
          record.decisionState,
        ).toBe(
          "OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISIONS_RECORDED",
        );

        expect(
          record.candidateDecisions,
        ).toHaveLength(8);

        expect(
          record.candidateDecisions.every(
            (decision) =>
              decision.firstTaskExecutionAuthorized ===
                true &&
              decision.firstTaskExecutionPerformed ===
                false,
          ),
        ).toBe(true);
      },
      30_000,
    );

    it(
      "preserves exact specialist identity sequence and first role-specific scenario",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        expect(
          record.candidateDecisions.map(
            (decision) =>
              decision.publicName,
          ),
        ).toEqual([
          "Ishaan",
          "Leela",
          "Vivaan",
          "Anaya",
          "Atharv",
          "Mahir",
          "Zara",
          "Advik",
        ]);

        expect(
          record.candidateDecisions.every(
            (
              decision,
              index,
            ) =>
              decision.executionSequence ===
                index + 1 &&
              decision.taskSequence ===
                1 &&
              decision.scenarioId ===
                ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
                  .candidatePreparations[index]
                  ?.pilotPlan.scenarios[0],
          ),
        ).toBe(true);
      },
    );

    it(
      "authorizes all eight first tasks but allows only Ishaan to execute first",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

        expect(
          record.aggregateSummary,
        ).toMatchObject({
          approvedFirstTaskCount:
            8,

          rejectedFirstTaskCount:
            0,

          firstTaskExecutionAuthorizedCount:
            8,

          firstTaskExecutionPerformedCount:
            0,

          currentlyExecutableCandidateCount:
            1,

          pendingAuthorizedCandidateCount:
            7,

          secondTaskExecutionAuthorizedCount:
            0,

          thirdTaskExecutionAuthorizedCount:
            0,

          maximumAuthorizedTaskCount:
            8,

          aggregateConcurrentExecutionLimit:
            1,
        });

        expect(
          record.candidateDecisions[0]
            ?.currentlyExecutable,
        ).toBe(true);

        expect(
          record.candidateDecisions
            .slice(1)
            .every(
              (decision) =>
                decision.currentlyExecutable ===
                  false &&
                decision.waitingForPriorCandidateOwnerReview ===
                  true,
            ),
        ).toBe(true);

        expect(
          record.nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_ONE",
        );
      },
    );

    it(
      "keeps task two task three and every real-world authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          firstSyntheticPilotTaskExecutionAuthorized:
            true,

          firstSyntheticPilotTaskExecutionAuthorizedCount:
            8,

          firstSyntheticPilotTaskExecutionPerformedCount:
            0,

          onlyOneCandidateCurrentlyExecutable:
            true,

          sequentialExecutionRequired:
            true,

          aggregateConcurrentExecutionLimit:
            1,

          stopAfterEveryTaskForOwnerReview:
            true,

          stopOnFirstFailure:
            true,

          secondSyntheticPilotTaskExecutionAuthorized:
            false,

          thirdSyntheticPilotTaskExecutionAuthorized:
            false,

          remainingTaskExecutionAuthorizedCount:
            0,

          repositoryReadAuthorized:
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

          monitoringRequired:
            true,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "requires the canonical limited-internal-pilot preparation",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
              ...approvalInput(),

              limitedInternalPilotPreparation: {
                ...ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
              } as typeof ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
            }),
        ).toThrow(
          "canonical Engineering limited-internal-pilot preparation",
        );
      },
    );

    it(
      "blocks a different owner and a decision before preparation",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
              ...approvalInput(),

              ownerId:
                "owner-different-engineering-pilot",
            }),
        ).toThrow(
          "pilot-preparation-bound owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
                      .preparedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede pilot preparation",
        );
      },
      30_000,
    );

    it(
      "supports rejection while retaining the rejected specialist at preparation only",
      () => {
        const decisions =
          approvalInput().decisions.map(
            (
              decision,
              index,
            ) =>
              index === 0
                ? "REJECT_AND_RETAIN_PILOT_PREPARATION_ONLY" as const
                : decision,
          );

        const reasons: string[] = [
          ...ENGINEERING_AI_WORKFORCE_FIRST_TASK_EXECUTION_REASONS,
        ];

        reasons[0] =
          "Owner rejected Ishaan first-task execution and retained the specialist at limited pilot preparation only.";

        const record =
          createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
            ...approvalInput(),
            decisions,
            reasons,
          });

        expect(
          record.aggregateSummary
            .approvedFirstTaskCount,
        ).toBe(7);

        expect(
          record.aggregateSummary
            .rejectedFirstTaskCount,
        ).toBe(1);

        expect(
          record.candidateDecisions[0]
            ?.retainedAtPreparationOnly,
        ).toBe(true);

        expect(
          record.candidateDecisions[1]
            ?.currentlyExecutable,
        ).toBe(true);
      },
      30_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
            approvalInput(),
          );

        expect(second).toEqual(first);

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateDecisions,
          ),
        ).toBe(true);

        expect(
          first.candidateDecisions.every(
            (decision) =>
              Object.isFrozen(decision) &&
              Object.isFrozen(
                decision.reviewedPreparation,
              ) &&
              Object.isFrozen(
                decision.authorityBoundary,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            productionDeploymentAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
              tampered,
            ),
        ).toThrow(
          "aggregate authority boundary is invalid",
        );
      },
      40_000,
    );

    it(
      "rejects invalid decisions secret-bearing reasons and credential-bearing identity",
      () => {
        const decisions = [
          ...approvalInput().decisions,
        ];

        decisions[0] =
          "INVALID_EXECUTION_DECISION" as typeof decisions[number];

        expect(
          () =>
            createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
              ...approvalInput(),
              decisions,
            }),
        ).toThrow(
          "candidate first-task execution decision is invalid",
        );

        const reasons: string[] = [
          ...ENGINEERING_AI_WORKFORCE_FIRST_TASK_EXECUTION_REASONS,
        ];

        reasons[0] =
          "Owner approved using secret access_token abc123 for the pilot execution.";

        expect(
          () =>
            createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
              ...approvalInput(),
              reasons,
            }),
        ).toThrow(
          "secret-bearing content",
        );

        expect(
          () =>
            createEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision({
              ...approvalInput(),

              decisionId:
                "token-engineering-first-task-decision-001",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );
      },
      30_000,
    );
  },
);
