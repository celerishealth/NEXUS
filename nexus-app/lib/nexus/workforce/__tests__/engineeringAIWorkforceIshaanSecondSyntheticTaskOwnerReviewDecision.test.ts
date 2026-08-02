import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceIshaanSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision";

function approvedInput() {
  return {
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,

    decisionId:
      "engineering-ishaan-second-task-owner-review-test-001",

    ownerId:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION
        .ownerId,

    decision:
      "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Ishaan's bounded deterministic architecture trade-off evidence and approved only Leela's second synthetic task as the next sequential execution.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Ishaan second synthetic task owner review",
  () => {
    it(
      "records approval and authorizes only Leela second-task execution",
      () => {
        const record =
          createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
            approvedInput(),
          );

        expect(record.decisionState).toBe(
          "OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",
        );

        expect(
          record.ishaanSecondTaskApproved,
        ).toBe(true);

        expect(
          record.leelaSecondTaskExecutionAuthorized,
        ).toBe(true);

        expect(
          record.leelaSecondTaskExecutionPerformed,
        ).toBe(false);

        expect(
          record.nextCandidate,
        ).toMatchObject({
          publicName:
            "Leela",

          taskSequence:
            2,

          scenarioId:
            "ENGINEERING_DELIVERY_COORDINATION_PLAN",
        });

        expect(record.nextStep).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_TWO",
        );
      },
      60_000,
    );

    it(
      "records rejection without authorizing Leela",
      () => {
        const record =
          createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision({
            ...approvedInput(),

            decisionId:
              "engineering-ishaan-second-task-owner-review-rejected",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Ishaan's bounded second synthetic task evidence and retained the sequence at Ishaan only.",
          });

        expect(
          record.ishaanSecondTaskApproved,
        ).toBe(false);

        expect(
          record.leelaSecondTaskExecutionAuthorized,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .onlyLeelaCurrentlyExecutable,
        ).toBe(false);

        expect(record.nextStep).toBe(
          "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY",
        );
      },
      60_000,
    );

    it(
      "binds the canonical execution decision preparation candidate and runtime",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        const source =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

        const leela =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .candidateDecisions
            .find(
              (candidate) =>
                candidate.publicName ===
                  "Leela",
            );

        expect(leela).toBeDefined();

        expect(
          record.sourceExecutionId,
        ).toBe(source.executionId);

        expect(
          record.sourceExecutionDigest,
        ).toBe(source.executionDigest);

        expect(
          record.ownerSecondTaskExecutionDecisionDigest,
        ).toBe(
          source.ownerSecondTaskExecutionDecisionDigest,
        );

        expect(
          record.sourceDecisionPreparationDigest,
        ).toBe(
          source.sourceDecisionPreparationDigest,
        );

        expect(
          record.sourceCandidateDecisionPreparationDigest,
        ).toBe(
          source.sourceCandidateDecisionPreparationDigest,
        );

        expect(
          record.sourceCandidatePlanDigest,
        ).toBe(
          source.sourceCandidatePlanDigest,
        );

        expect(
          record.sourceCandidateDecisionDigest,
        ).toBe(
          source.candidateDecisionDigest,
        );

        expect(
          record.nextCandidate.runtimeId,
        ).toBe(leela?.runtimeId);
      },
    );

    it(
      "reviews the exact bounded deterministic architecture evidence",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          workstreamId:
            "routine-engineering-second-task-evidence",

          evidenceClass:
            "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          executionMode:
            "SANDBOX_ONLY",

          evidenceToolMode:
            "READ_ONLY",

          outputMode:
            "DRAFT_ONLY",

          reviewedTaskSequence:
            2,

          reviewedScenarioId:
            "MODULAR_ARCHITECTURE_EVOLUTION_PLAN",

          architectureEvidenceClass:
            "DETERMINISTIC_ARCHITECTURE_TRADE_OFF_PLAN",

          architectureReviewOutcome:
            "BOUNDED_INCREMENTAL_EVOLUTION_RECOMMENDED",

          deterministicEvidenceProduced:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
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
      },
    );

    it(
      "keeps only Leela sequentially executable and preserves every authority block",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ishaanSecondTaskReviewed:
            true,

          ownerReviewDecisionRecorded:
            true,

          leelaSecondTaskExecutionAuthorized:
            true,

          leelaSecondTaskExecutionPerformed:
            false,

          onlyLeelaCurrentlyExecutable:
            true,

          remainingSixAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          aggregateConcurrentExecutionLimit:
            1,

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

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
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
      "blocks cross-owner review and review before execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision({
              ...approvedInput(),

              ownerId:
                "different-owner",
            }),
        ).toThrow(
          "execution-bound owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision({
              ...approvedInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION
                      .executedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede task execution",
        );
      },
      60_000,
    );

    it(
      "rejects tampered execution evidence",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision({
              ...approvedInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();
      },
      90_000,
    );

    it(
      "is deterministic deeply frozen digest-bound and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
            approvedInput(),
          );

        const second =
          createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
            approvedInput(),
          );

        expect(second).toEqual(first);

        expect(first.decisionDigest).toMatch(
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
            validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            repositoryReadAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow();
      },
      90_000,
    );

    it(
      "rejects credential-bearing review identity and reason",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision({
              ...approvedInput(),

              decisionId:
                "secret-ishaan-second-task-review",
            }),
        ).toThrow(
          "canonical safe identifier",
        );

        expect(
          () =>
            createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision({
              ...approvedInput(),

              reason:
                "Owner approved continuation using access_token abc123 inside the review evidence.",
            }),
        ).toThrow(
          "prohibited protected-material content",
        );
      },
      60_000,
    );

    it(
      "exports a valid canonical owner-approved record",
      () => {
        expect(
          () =>
            validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
              ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
            ),
        ).not.toThrow();

        expect(
          ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decision,
        ).toBe(
          "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION",
        );
      },
    );
  },
);