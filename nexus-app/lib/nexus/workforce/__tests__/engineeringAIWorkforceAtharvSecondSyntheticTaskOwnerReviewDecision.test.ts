import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceAtharvSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision";

function canonicalInput() {
  return {
    decisionId:
      "engineering-atharv-second-task-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Atharv's deterministic bounded recovery evidence and approved only Mahir's second synthetic chaos and failure-containment task next.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Atharv second synthetic task owner review",
  () => {
    it(
      "approves Atharv evidence and authorizes only Mahir sequence six",
      () => {
        const record =
          createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",

          decision:
            "APPROVE_MAHIR_SECOND_SYNTHETIC_TASK_EXECUTION",

          atharvSecondTaskApproved:
            true,

          mahirSecondTaskExecutionAuthorized:
            true,

          mahirSecondTaskExecutionPerformed:
            false,

          nextStep:
            "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SIX",
        });

        expect(
          record.nextCandidate,
        ).toMatchObject({
          sequence:
            6,

          employeeId:
            "candidate-mahir-v1",

          employeeCode:
            "nx-engineering-006",

          publicName:
            "Mahir",

          officialRole:
            "AI Chaos Engineering Specialist",

          taskSequence:
            2,

          scenarioId:
            "CHAOS_FAILURE_CONTAINMENT_PLAN",
        });
      },
    );

    it(
      "binds canonical Atharv execution and Mahir continuation digests",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          record.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionId,
        );

        expect(
          record.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION
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
      "reviews complete recovery evidence without live execution",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          deterministicEvidenceCreated:
            true,

          monitoringCheckpointCount:
            4,

          gracefulDegradationCount:
            4,

          rollbackPlanCount:
            4,

          auditCheckpointCount:
            6,

          stopConditionCount:
            6,

          recoveryCheckCount:
            5,

          liveProviderExecutionPerformed:
            false,

          productionExecutionPerformed:
            false,

          deploymentPerformed:
            false,

          ownerReviewCompleted:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,
        });

        expect(
          evidence.recoveryEvidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps consequential authority blocked and two candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          onlyMahirCurrentlyExecutable:
            true,

          remainingTwoAuthorizedCandidatesWaiting:
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
      "supports rejection without authorizing Mahir",
      () => {
        const record =
          createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-atharv-second-task-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ATHARV_SECOND_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Atharv's bounded synthetic recovery evidence and retained the workstream at Atharv's completed second task.",
          });

        expect(record).toMatchObject({
          atharvSecondTaskApproved:
            false,

          mahirSecondTaskExecutionAuthorized:
            false,

          mahirSecondTaskExecutionPerformed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ATHARV_SECOND_TASK_ONLY",
        });

        expect(
          record.authorityBoundary
            .onlyMahirCurrentlyExecutable,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .remainingTwoAuthorizedCandidatesWaiting,
        ).toBe(false);
      },
    );

    it(
      "rejects tampered execution and review before execution",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION
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
          createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
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

            realFailureInjectionAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
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
          ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceAtharvSecondSyntheticTaskOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SIX",
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