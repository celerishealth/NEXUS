import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceVivaanSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision";

function canonicalInput() {
  return {
    decisionId:
      "engineering-vivaan-second-task-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Vivaan's bounded deterministic regression-risk evidence and approved only Anaya's second synthetic security-boundary task next.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Vivaan second synthetic task owner review",
  () => {
    it(
      "approves Vivaan evidence and authorizes only Anaya sequence four",
      () => {
        const record =
          createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_VIVAAN_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",

          decision:
            "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION",

          vivaanSecondTaskApproved:
            true,

          anayaSecondTaskExecutionAuthorized:
            true,

          anayaSecondTaskExecutionPerformed:
            false,

          nextStep:
            "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FOUR",
        });

        expect(
          record.nextCandidate,
        ).toMatchObject({
          sequence:
            4,

          employeeId:
            "candidate-anaya-v1",

          employeeCode:
            "nx-engineering-004",

          publicName:
            "Anaya",

          officialRole:
            "AI Security Engineering Director",

          taskSequence:
            2,

          scenarioId:
            "SECURITY_BOUNDARY_REVIEW_PLAN",
        });
      },
    );

    it(
      "binds canonical Vivaan execution and Anaya continuation digests",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          record.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionId,
        );

        expect(
          record.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionDigest,
        );

        expect(
          record.nextCandidate
            .sourceCandidatePlanDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          record.nextCandidate
            .sourceCandidateDecisionPreparationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
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
      "reviews deterministic risk coverage without executing tests or code changes",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          deterministicEvidenceCreated:
            true,

          coverageAreaCount:
            5,

          stopConditionCount:
            6,

          evidenceRequirementCount:
            6,

          recoveryCheckCount:
            4,

          testExecutionPerformed:
            false,

          codeChangePerformed:
            false,

          repositoryAccessPerformed:
            false,

          ownerReviewCompleted:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,
        });

        expect(
          evidence.regressionEvidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps all consequential authority blocked and four candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          onlyAnayaCurrentlyExecutable:
            true,

          remainingFourAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          aggregateConcurrentExecutionLimit:
            1,

          stopAfterEveryTaskForOwnerReview:
            true,

          testsExecuted:
            false,

          codeChanged:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          secretsAccessAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          levelThreeAuthorityGranted:
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
      "supports rejection without authorizing Anaya",
      () => {
        const record =
          createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-vivaan-second-task-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_VIVAAN_SECOND_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Vivaan's bounded synthetic regression-risk evidence and retained the workstream at Vivaan's completed second task.",
          });

        expect(record).toMatchObject({
          vivaanSecondTaskApproved:
            false,

          anayaSecondTaskExecutionAuthorized:
            false,

          anayaSecondTaskExecutionPerformed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_VIVAAN_SECOND_TASK_ONLY",
        });

        expect(
          record.authorityBoundary
            .onlyAnayaCurrentlyExecutable,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .remainingFourAuthorizedCandidatesWaiting,
        ).toBe(false);
      },
    );

    it(
      "rejects tampered execution and review before execution",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION
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
          createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
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

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid canonical review while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FOUR",
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