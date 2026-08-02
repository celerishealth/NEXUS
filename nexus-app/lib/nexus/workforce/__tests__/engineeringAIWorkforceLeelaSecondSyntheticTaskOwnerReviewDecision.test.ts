import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceLeelaSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision";

function canonicalInput() {
  return {
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,

    decisionId:
      "engineering-leela-second-task-owner-review-test-001",

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Leela's bounded deterministic coordination evidence and approved only Vivaan's second synthetic regression-risk containment task next.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Leela second synthetic task owner review",
  () => {
    it(
      "records owner approval and authorizes only Vivaan second-task sequence three",
      () => {
        const record =
          createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",

          decision:
            "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION",

          leelaSecondTaskApproved:
            true,

          vivaanSecondTaskExecutionAuthorized:
            true,

          vivaanSecondTaskExecutionPerformed:
            false,

          nextStep:
            "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_THREE",
        });

        expect(
          record.nextCandidate,
        ).toMatchObject({
          sequence:
            3,

          employeeId:
            "candidate-vivaan-v1",

          employeeCode:
            "nx-engineering-003",

          publicName:
            "Vivaan",

          officialRole:
            "AI Quality Assurance Director",

          taskSequence:
            2,

          scenarioId:
            "REGRESSION_RISK_CONTAINMENT_PLAN",
        });
      },
    );

    it(
      "binds the canonical Leela execution and Vivaan decision evidence",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          record.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionId,
        );

        expect(
          record.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionDigest,
        );

        expect(
          record.reviewedEmployee
            .candidateDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
            .candidateDecisionDigest,
        );

        expect(
          record.nextCandidate
            .candidateDecisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "reviews deterministic coordination evidence without implementation or delivery",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          evidenceClass:
            "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE",

          deterministicEvidenceCreated:
            true,

          coordinationStageCount:
            5,

          conflictPreventionControlCount:
            6,

          pauseControlCount:
            5,

          escalationControlCount:
            5,

          ownerReviewControlCount:
            5,

          implementationExecuted:
            false,

          repositoryChangeExecuted:
            false,

          productionDeploymentExecuted:
            false,

          customerDeliveryExecuted:
            false,

          ownerReviewCompleted:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,
        });

        expect(
          evidence.coordinationEvidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps every consequential authority blocked and five candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          onlyVivaanCurrentlyExecutable:
            true,

          remainingFiveAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          aggregateConcurrentExecutionLimit:
            1,

          stopAfterEveryTaskForOwnerReview:
            true,

          thirdSyntheticTaskExecutionAuthorized:
            false,

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

          financialCommitmentAuthorized:
            false,

          legalCommitmentAuthorized:
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
      "supports rejection without authorizing Vivaan",
      () => {
        const rejected =
          createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-leela-second-task-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_LEELA_SECOND_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Leela's bounded synthetic coordination evidence and retained the workstream at Leela's completed second task.",
          });

        expect(rejected).toMatchObject({
          leelaSecondTaskApproved:
            false,

          vivaanSecondTaskExecutionAuthorized:
            false,

          vivaanSecondTaskExecutionPerformed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_LEELA_SECOND_TASK_ONLY",
        });

        expect(
          rejected.authorityBoundary
            .onlyVivaanCurrentlyExecutable,
        ).toBe(false);

        expect(
          rejected.authorityBoundary
            .remainingFiveAuthorizedCandidatesWaiting,
        ).toBe(false);
      },
    );

    it(
      "rejects noncanonical execution and review before execution",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION
                      .executedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede execution",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
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
            first.reviewedEmployee,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.nextCandidate,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid canonical decision while Founder Liberation remains Level 2 in progress",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_THREE",
        );

        expect(
          record.authorityBoundary
            .founderLiberationAchieved,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .levelThreeAuthorityGranted,
        ).toBe(false);
      },
      120_000,
    );
  },
);