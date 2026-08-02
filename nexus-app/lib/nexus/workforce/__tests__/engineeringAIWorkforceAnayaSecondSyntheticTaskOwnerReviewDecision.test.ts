import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceAnayaSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision";

function canonicalInput() {
  return {
    decisionId:
      "engineering-anaya-second-task-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Anaya's deterministic bounded security evidence and approved only Atharv's second synthetic reliability and recovery task next.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Anaya second synthetic task owner review",
  () => {
    it(
      "approves Anaya evidence and authorizes only Atharv sequence five",
      () => {
        const record =
          createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",

          decision:
            "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION",

          anayaSecondTaskApproved:
            true,

          atharvSecondTaskExecutionAuthorized:
            true,

          atharvSecondTaskExecutionPerformed:
            false,

          nextStep:
            "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FIVE",
        });

        expect(
          record.nextCandidate,
        ).toMatchObject({
          sequence:
            5,

          employeeId:
            "candidate-atharv-v1",

          employeeCode:
            "nx-engineering-005",

          publicName:
            "Atharv",

          officialRole:
            "AI Reliability Engineering Specialist",

          taskSequence:
            2,

          scenarioId:
            "RELIABILITY_RECOVERY_VALIDATION_PLAN",
        });
      },
    );

    it(
      "binds canonical Anaya execution and Atharv continuation digests",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          record.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionId,
        );

        expect(
          record.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION
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
      "reviews complete security evidence without protected access",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          deterministicEvidenceCreated:
            true,

          threatModelCount:
            5,

          controlReviewCount:
            5,

          failClosedRuleCount:
            6,

          ownerEscalationRuleCount:
            5,

          recoveryCheckCount:
            4,

          protectedMaterialUsed:
            false,

          secretsAccessPerformed:
            false,

          repositoryAccessPerformed:
            false,

          productionAccessPerformed:
            false,

          ownerReviewCompleted:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,
        });

        expect(
          evidence.securityEvidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps consequential authority blocked and three candidates waiting",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          onlyAtharvCurrentlyExecutable:
            true,

          remainingThreeAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          aggregateConcurrentExecutionLimit:
            1,

          protectedMaterialUsed:
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
      "supports rejection without authorizing Atharv",
      () => {
        const record =
          createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-anaya-second-task-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ANAYA_SECOND_TASK_ONLY",

            reason:
              "Owner rejected continuation after reviewing Anaya's bounded synthetic security evidence and retained the workstream at Anaya's completed second task.",
          });

        expect(record).toMatchObject({
          anayaSecondTaskApproved:
            false,

          atharvSecondTaskExecutionAuthorized:
            false,

          atharvSecondTaskExecutionPerformed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ANAYA_SECOND_TASK_ONLY",
        });

        expect(
          record.authorityBoundary
            .onlyAtharvCurrentlyExecutable,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .remainingThreeAuthorizedCandidatesWaiting,
        ).toBe(false);
      },
    );

    it(
      "rejects tampered execution and review before execution",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION
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
          createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
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

            productionDeploymentAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
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
          ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FIVE",
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