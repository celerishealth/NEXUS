import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceMahirSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision";

function canonicalInput() {
  return {
    decisionId:
      "engineering-mahir-second-task-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Mahir's deterministic bounded chaos-containment evidence and approved only Zara's second synthetic data-pipeline quality task next.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Mahir second synthetic task owner review",
  () => {
    it(
      "approves Mahir evidence and authorizes only Zara sequence seven",
      () => {
        const record =
          createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_MAHIR_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",

          decision:
            "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION",

          mahirSecondTaskApproved:
            true,

          zaraSecondTaskExecutionAuthorized:
            true,

          zaraSecondTaskExecutionPerformed:
            false,

          nextStep:
            "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SEVEN",
        });

        expect(
          record.nextCandidate,
        ).toMatchObject({
          sequence:
            7,

          employeeId:
            "candidate-zara-v1",

          employeeCode:
            "nx-engineering-007",

          publicName:
            "Zara",

          officialRole:
            "AI Data Engineering & Analytics Specialist",

          taskSequence:
            2,

          scenarioId:
            "DATA_PIPELINE_QUALITY_PLAN",
        });
      },
    );

    it(
      "binds canonical Mahir execution and Zara continuation digests",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          record.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionId,
        );

        expect(
          record.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION
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
      "reviews complete chaos evidence without real failure injection",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          deterministicEvidenceCreated:
            true,

          simulatedFailureScenarioCount:
            5,

          blastRadiusControlCount:
            5,

          emergencyPauseGateCount:
            5,

          rollbackCheckpointCount:
            4,

          ownerReviewGateCount:
            5,

          stopConditionCount:
            6,

          realFailureInjected:
            false,

          liveEnvironmentAffected:
            false,

          productionExecutionPerformed:
            false,

          ownerReviewCompleted:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,
        });

        expect(
          evidence.chaosEvidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps consequential authority blocked and one candidate waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          onlyZaraCurrentlyExecutable:
            true,

          remainingOneAuthorizedCandidateWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          aggregateConcurrentExecutionLimit:
            1,

          realFailureInjectionAuthorized:
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
      "supports rejection without authorizing Zara",
      () => {
        const record =
          createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-mahir-second-task-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_MAHIR_SECOND_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Mahir's bounded synthetic chaos evidence and retained the workstream at Mahir's completed second task.",
          });

        expect(record).toMatchObject({
          mahirSecondTaskApproved:
            false,

          zaraSecondTaskExecutionAuthorized:
            false,

          zaraSecondTaskExecutionPerformed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_MAHIR_SECOND_TASK_ONLY",
        });

        expect(
          record.authorityBoundary
            .onlyZaraCurrentlyExecutable,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .remainingOneAuthorizedCandidateWaiting,
        ).toBe(false);
      },
    );

    it(
      "rejects tampered execution and review before execution",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION
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
          createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
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

            productionMutationAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
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
          ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SEVEN",
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