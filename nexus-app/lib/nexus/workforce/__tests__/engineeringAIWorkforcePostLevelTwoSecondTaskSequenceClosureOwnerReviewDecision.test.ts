import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision";

function canonicalInput() {
  return {
    decisionId:
      "engineering-second-task-sequence-closure-owner-review-test-001",

    sourceClosureEvidence:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE" as const,

    reason:
      "Owner reviewed all eight deterministic execution and owner-review records and approved closure of only the bounded second-task sequence.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION
            .preparedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce post-Level-Two second-task sequence-closure owner review",
  () => {
    it(
      "approves and closes exactly the bounded second-task sequence",
      () => {
        const record =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_REVIEW_RECORDED",

          decision:
            "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE",

          closureEvidenceApproved:
            true,

          sequenceClosureOwnerReviewCompleted:
            true,

          sequenceClosureOwnerAcceptanceRecorded:
            true,

          secondTaskSequenceClosed:
            true,

          nextStep:
            "AWAIT_OWNER_NEXT_ENGINEERING_POST_LEVEL_TWO_OBJECTIVE",
        });
      },
    );

    it(
      "binds the canonical closure evidence and Advik review",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION;

        expect(
          record.sourceClosureEvidenceId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION
            .evidenceId,
        );

        expect(
          record.sourceClosureEvidenceDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION
            .evidenceDigest,
        );

        expect(
          record.sourceAdvikOwnerReviewDecisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "reviews eight completed executions and eight completed owner reviews",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          candidateCount:
            8,

          executedCandidateCount:
            8,

          ownerReviewedCandidateCount:
            8,

          taskSequence:
            2,

          allEightCandidateSecondTaskExecutionsCompleted:
            true,

          allEightCandidateOwnerReviewsCompleted:
            true,

          exactCandidateOrderVerified:
            true,

          duplicateCandidateIdentityDetected:
            false,

          missingCandidateEvidenceDetected:
            false,

          unresolvedCandidateExecutionRemaining:
            false,

          closureEvidencePrepared:
            true,

          ownerReviewCompleted:
            true,
        });

        expect(
          evidence.candidateEvidenceAggregateDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );

    it(
      "closes the sequence while keeping Level 3 and consequential authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          sequenceClosureEvidencePrepared:
            true,

          sequenceClosureOwnerReviewCompleted:
            true,

          sequenceClosureOwnerAcceptanceRecorded:
            true,

          secondTaskSequenceClosed:
            true,

          noCandidateExecutionRemaining:
            true,

          nextCandidateExecutionAuthorized:
            false,

          noLaterCandidateExecutionAuthorized:
            true,

          thirdSyntheticTaskExecutionAuthorized:
            false,

          levelThreeEvaluationAuthorized:
            false,

          levelThreeAuthorityGranted:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          secretsAccessAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          productionMutationAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          paymentExecutionAuthorized:
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
      "supports rejection without closing the sequence",
      () => {
        const record =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision({
            ...canonicalInput(),

            decisionId:
              "engineering-second-task-sequence-closure-owner-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PENDING",

            reason:
              "Owner rejected formal closure after reviewing the prepared evidence and retained the second-task sequence in closure-pending state.",
          });

        expect(record).toMatchObject({
          closureEvidenceApproved:
            false,

          sequenceClosureOwnerReviewCompleted:
            true,

          sequenceClosureOwnerAcceptanceRecorded:
            false,

          secondTaskSequenceClosed:
            false,

          nextStep:
            "RETAIN_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_PENDING",
        });
      },
    );

    it(
      "rejects tampered evidence and review before preparation",
      () => {
        const tamperedEvidence = {
          ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION,

          evidenceDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION;

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision({
              ...canonicalInput(),

              sourceClosureEvidence:
                tamperedEvidence,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision({
              ...canonicalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION
                      .preparedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede evidence preparation",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
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

            levelThreeAuthorityGranted:
              true,
          },
        } as unknown as
          EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid closure while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.secondTaskSequenceClosed,
        ).toBe(true);

        expect(
          record.authorityBoundary
            .levelThreeAuthorityGranted,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .founderLiberationAchieved,
        ).toBe(false);
      },
      120_000,
    );
  },
);