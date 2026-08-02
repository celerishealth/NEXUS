import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,
} from "../engineeringAIWorkforceAdvikSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision";

function canonicalInput() {
  return {
    decisionId:
      "engineering-advik-second-task-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION" as const,

    reason:
      "Owner reviewed Advik's deterministic bounded systems-evaluation evidence and authorized only preparation of separate sequence-closure evidence.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Advik second synthetic task owner review",
  () => {
    it(
      "approves final candidate evidence and authorizes closure preparation only",
      () => {
        const record =
          createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED",

          decision:
            "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION",

          advikSecondTaskApproved:
            true,

          allEightCandidateSecondTaskExecutionsCompleted:
            true,

          finalCandidateOwnerReviewRecorded:
            true,

          sequenceClosureEvidencePreparationAuthorized:
            true,

          sequenceClosureEvidencePrepared:
            false,

          secondTaskSequenceClosed:
            false,

          nextStep:
            "PREPARE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE",
        });
      },
    );

    it(
      "binds canonical Advik execution identity and digest",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          record.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionId,
        );

        expect(
          record.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION
            .executionDigest,
        );

        expect(
          record.reviewedEmployee,
        ).toMatchObject({
          employeeId:
            "candidate-advik-v1",

          employeeCode:
            "nx-engineering-008",

          publicName:
            "Advik",

          candidateSequence:
            8,

          taskSequence:
            2,

          scenarioId:
            "SYSTEMS_EVALUATION_RED_TEAM_PLAN",
        });
      },
    );

    it(
      "reviews complete deterministic systems-evaluation evidence",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          deterministicEvidenceCreated:
            true,

          evidenceSubstitutionCheckCount:
            5,

          authorityBypassCheckCount:
            5,

          isolationCheckCount:
            5,

          recoveryCheckCount:
            4,

          ownerControlCheckCount:
            5,

          stopConditionCount:
            6,

          knownLimitationCount:
            4,

          adversarialExecutionPerformed:
            false,

          authorityBypassPerformed:
            false,

          evidenceSubstitutionPerformed:
            false,

          ownerReviewCompleted:
            true,

          independentValidationRequired:
            true,

          independentValidationCompleted:
            false,
        });

        expect(
          evidence.systemsEvaluationEvidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "keeps sequence closure Level 3 and consequential authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          allEightCandidateSecondTaskExecutionsCompleted:
            true,

          allEightCandidateOwnerReviewsCompleted:
            true,

          noCandidateExecutionRemaining:
            true,

          noLaterCandidateExecutionAuthorized:
            true,

          sequenceClosureEvidencePreparationAuthorized:
            true,

          sequenceClosureEvidencePrepared:
            false,

          secondTaskSequenceClosed:
            false,

          sequenceClosureOwnerAcceptanceRecorded:
            false,

          levelThreeEvaluationAuthorized:
            false,

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
      "supports rejection without closure preparation authority",
      () => {
        const record =
          createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-advik-second-task-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ADVIK_SECOND_TASK_ONLY",

            reason:
              "Owner rejected sequence continuation after reviewing Advik's bounded synthetic systems-evaluation evidence and retained the workstream at the final candidate task.",
          });

        expect(record).toMatchObject({
          advikSecondTaskApproved:
            false,

          allEightCandidateSecondTaskExecutionsCompleted:
            false,

          sequenceClosureEvidencePreparationAuthorized:
            false,

          sequenceClosureEvidencePrepared:
            false,

          secondTaskSequenceClosed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ADVIK_SECOND_TASK_ONLY",
        });
      },
    );

    it(
      "rejects tampered execution and review before execution",
      () => {
        const tamperedExecution = {
          ...ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION,

          executionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              sourceExecution:
                tamperedExecution,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION
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
          createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
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

            secondTaskSequenceClosed:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
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
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.nextStep,
        ).toBe(
          "PREPARE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE",
        );

        expect(
          record.authorityBoundary
            .secondTaskSequenceClosed,
        ).toBe(false);

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