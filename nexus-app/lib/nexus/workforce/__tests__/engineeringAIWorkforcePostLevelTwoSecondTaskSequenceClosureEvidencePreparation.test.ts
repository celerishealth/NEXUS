import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceAdvikSecondSyntheticTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation,
  type EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation";

function canonicalInput() {
  return {
    evidenceId:
      "engineering-second-task-sequence-closure-evidence-test-001",

    advikOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    preparedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce post-Level-Two second-task sequence-closure evidence preparation",
  () => {
    it(
      "prepares closure evidence for exactly eight executions and reviews",
      () => {
        const record =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          evidenceState:
            "ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARED",

          candidateCount:
            8,

          executedCandidateCount:
            8,

          ownerReviewedCandidateCount:
            8,

          taskSequence:
            2,

          nextStep:
            "AWAIT_OWNER_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_REVIEW",
        });

        expect(
          record.candidateEvidence,
        ).toHaveLength(8);

        expect(
          record.candidateEvidence.map(
            (entry) =>
              entry.sequence,
          ),
        ).toEqual([
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
        ]);
      },
    );

    it(
      "binds unique execution and owner-review identities and digests",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION
            .candidateEvidence;

        expect(
          new Set(
            evidence.map(
              (entry) =>
                entry.employeeId,
            ),
          ).size,
        ).toBe(8);

        expect(
          new Set(
            evidence.map(
              (entry) =>
                entry.executionId,
            ),
          ).size,
        ).toBe(8);

        expect(
          new Set(
            evidence.map(
              (entry) =>
                entry.ownerReviewDecisionId,
            ),
          ).size,
        ).toBe(8);

        for (const entry of evidence) {
          expect(
            entry.executionDigest,
          ).toMatch(
            /^[0-9a-f]{64}$/,
          );

          expect(
            entry.ownerReviewDecisionDigest,
          ).toMatch(
            /^[0-9a-f]{64}$/,
          );
        }
      },
    );

    it(
      "verifies every owner review follows its execution",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION
            .candidateEvidence;

        for (const entry of evidence) {
          expect(
            Date.parse(
              entry.ownerReviewedAt,
            ),
          ).toBeGreaterThanOrEqual(
            Date.parse(
              entry.executedAt,
            ),
          );

          expect(
            entry.executionCompleted,
          ).toBe(true);

          expect(
            entry.ownerReviewCompleted,
          ).toBe(true);
        }
      },
    );

    it(
      "records complete sequence evidence but does not close the sequence",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION;

        expect(
          record.sequenceSummary,
        ).toMatchObject({
          allEightCandidateSecondTaskExecutionsCompleted:
            true,

          allEightCandidateOwnerReviewsCompleted:
            true,

          closureEvidencePrepared:
            true,

          closureOwnerReviewRequired:
            true,

          closureOwnerReviewCompleted:
            false,

          closureOwnerAcceptanceRecorded:
            false,

          secondTaskSequenceClosed:
            false,
        });

        expect(
          record.authorityBoundary,
        ).toMatchObject({
          sequenceClosureEvidencePreparationAuthorized:
            true,

          sequenceClosureEvidencePrepared:
            true,

          sequenceClosureOwnerReviewRequired:
            true,

          sequenceClosureOwnerReviewCompleted:
            false,

          sequenceClosureOwnerAcceptanceRecorded:
            false,

          secondTaskSequenceClosed:
            false,

          noCandidateExecutionRemaining:
            true,

          noLaterCandidateExecutionAuthorized:
            true,

          nextCandidateExecutionAuthorized:
            false,

          thirdSyntheticTaskExecutionAuthorized:
            false,
        });
      },
    );

    it(
      "keeps Level 3 production launch and Founder Liberation blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION
            .authorityBoundary;

        expect(boundary).toMatchObject({
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
      "rejects tampered authorization and preparation before owner review",
      () => {
        const tamperedReview = {
          ...ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation({
              ...canonicalInput(),

              advikOwnerReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation({
              ...canonicalInput(),

              preparedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede Advik owner review",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
            canonicalInput(),
          );

        expect(second).toEqual(first);

        expect(
          first.evidenceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateEvidence,
          ),
        ).toBe(true);

        expect(
          first.candidateEvidence.every(
            (entry) =>
              Object.isFrozen(entry),
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.sequenceSummary,
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
          EngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid preparation while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_EVIDENCE_PREPARATION;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureEvidencePreparation(
              record,
            ),
        ).not.toThrow();

        expect(
          record.sequenceSummary
            .secondTaskSequenceClosed,
        ).toBe(false);

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