import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceZaraSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision";

function canonicalInput() {
  return {
    decisionId:
      "engineering-zara-second-task-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Zara's deterministic bounded data-quality evidence and approved only Advik's final second synthetic systems-evaluation task next.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Zara second synthetic task owner review",
  () => {
    it(
      "approves Zara evidence and authorizes only final candidate Advik",
      () => {
        const record =
          createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",

          decision:
            "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION",

          zaraSecondTaskApproved:
            true,

          advikSecondTaskExecutionAuthorized:
            true,

          advikSecondTaskExecutionPerformed:
            false,

          nextStep:
            "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_EIGHT",
        });

        expect(
          record.nextCandidate,
        ).toMatchObject({
          sequence:
            8,

          employeeId:
            "candidate-advik-v1",

          employeeCode:
            "nx-engineering-008",

          publicName:
            "Advik",

          officialRole:
            "AI Systems Evaluation & Red-Team Specialist",

          taskSequence:
            2,

          scenarioId:
            "SYSTEMS_EVALUATION_RED_TEAM_PLAN",
        });
      },
    );

    it(
      "binds canonical Zara execution and Advik continuation digests",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          record.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionId,
        );

        expect(
          record.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION
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
      "reviews complete data-quality evidence without customer or database activity",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          deterministicEvidenceCreated:
            true,

          schemaCheckCount:
            5,

          tenantBoundaryCheckCount:
            5,

          lineageCheckpointCount:
            5,

          reconciliationCheckCount:
            4,

          recoveryCheckCount:
            4,

          stopConditionCount:
            6,

          realCustomerDataUsed:
            false,

          databaseAccessPerformed:
            false,

          databaseMutationPerformed:
            false,

          ownerReviewCompleted:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,
        });

        expect(
          evidence.dataQualityEvidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps consequential authority blocked and marks Advik final",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          onlyAdvikCurrentlyExecutable:
            true,

          advikIsFinalCandidate:
            true,

          noLaterCandidateExecutionAuthorized:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          aggregateConcurrentExecutionLimit:
            1,

          adversarialExecutionAuthorized:
            false,

          authorityBypassAuthorized:
            false,

          evidenceSubstitutionAuthorized:
            false,

          secretsAccessAuthorized:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          realCustomerDataAccessAuthorized:
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
      "supports rejection without authorizing Advik",
      () => {
        const record =
          createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-zara-second-task-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ZARA_SECOND_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Zara's bounded synthetic data-quality evidence and retained the sequence at Zara's completed second task.",
          });

        expect(record).toMatchObject({
          zaraSecondTaskApproved:
            false,

          advikSecondTaskExecutionAuthorized:
            false,

          advikSecondTaskExecutionPerformed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ZARA_SECOND_TASK_ONLY",
        });

        expect(
          record.authorityBoundary
            .onlyAdvikCurrentlyExecutable,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .advikIsFinalCandidate,
        ).toBe(true);
      },
    );

    it(
      "rejects tampered execution and review before execution",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION
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
          createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
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

            authorityBypassAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid review while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_EIGHT",
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