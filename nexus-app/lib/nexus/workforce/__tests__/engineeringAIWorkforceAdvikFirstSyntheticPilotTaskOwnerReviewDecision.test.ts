import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
} from "../engineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-advik-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ADVIK_FIRST_TASK_AND_COMPLETE_ENGINEERING_FIRST_TASK_SEQUENCE" as const,

    reason:
      "Owner reviewed Advik's bounded synthetic red-team evaluation and approved completion of only the Engineering first-task sequence while every further authority remains blocked.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Advik first synthetic pilot task owner review",
  () => {
    it(
      "approves Advik result and authorizes only Advik first synthetic task",
      () => {
        const review =
          createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        expect(review.decisionState).toBe(
          "OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED",
        );

        expect(review.advikFirstTaskApproved).toBe(
          true,
        );

        expect(
          review.engineeringFirstTaskSequenceCompleted,
        ).toBe(true);

        expect(
          review.furtherCandidateExecutionAuthorized,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "AWAIT_ENGINEERING_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_AUDIT",
        );
      },
    );

    it(
      "binds exact Advik execution and Advik canonical identity",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(review.sourceExecutionId).toBe(
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionId,
        );

        expect(review.sourceExecutionDigest).toBe(
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionDigest,
        );

        expect(review.reviewedEmployee).toMatchObject({
          employeeId:
            "candidate-advik-v1",

          employeeCode:
            "nx-engineering-008",

          publicName:
            "Advik",

          officialRole:
            "AI Systems Evaluation & Red-Team Specialist",

          runtimeId:
            "runtime-engineering-nx-engineering-008-candidate-v1",

          taskSequence:
            1,

          executionSequence:
            8,

          scenarioId:
            "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN",
        });

        expect(review.canonicalCandidateDecision).toEqual({
          employeeId:
            "candidate-advik-v1",

          employeeCode:
            "nx-engineering-008",

          publicName:
            "Advik",

          officialRole:
            "AI Systems Evaluation & Red-Team Specialist",

          runtimeId:
            "runtime-engineering-nx-engineering-008-candidate-v1",

          taskSequence:
            1,

          executionSequence:
            8,

          scenarioId:
            "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN",
        });
      },
    );

    it(
      "records exact reviewed evidence without inventing production readiness",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .reviewedEvidence;

        expect(evidence).toMatchObject({
          pilotClass:
            "LIMITED_INTERNAL_SYNTHETIC_PILOT",

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY",

          evidenceToolMode:
            "READ_ONLY",

          draftToolMode:
            "DRAFT_ONLY",

          analysisOutcome:
            "BOUNDED_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_RECOMMENDED",

          riskLevel:
            "MEDIUM",

          analysisStageCount:
            4,

          evidenceGateCount:
            5,

          executedTaskCount:
            1,

          remainingTaskCapacity:
            2,

          pilotDraftCreated:
            true,

          pilotCompleted:
            false,
        });
      },
    );

    it(
      "keeps Advik sequential and every consequential authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ownerReviewDecisionRecorded:
            true,

          advikFirstTaskReviewed:
            true,

          engineeringFirstTaskSequenceCompleted:
            true,

          furtherCandidateExecutionAuthorized:
            false,

          finalExecutionSequenceReached:
            true,

          firstTaskExecutionCapacityExhausted:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          advikSecondSyntheticPilotTaskExecutionAuthorized:
            false,

          advikThirdSyntheticPilotTaskExecutionAuthorized:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          mergeAuthorized:
            false,

          productionDeploymentAuthorized:
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

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "supports rejection without authorizing Advik",
      () => {
        const review =
          createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvalInput(),

            decisionId:
              "engineering-advik-owner-review-rejection-test-001",

            decision:
              "REJECT_AND_RETAIN_ADVIK_FIRST_TASK_REVIEW_ONLY",

            reason:
              "Owner rejected the reviewed synthetic result and retained the Engineering pilot at Advik's completed first task only.",
          });

        expect(review.advikFirstTaskApproved).toBe(
          false,
        );

        expect(
          review.engineeringFirstTaskSequenceCompleted,
        ).toBe(false);

        expect(
          review.authorityBoundary
            .finalExecutionSequenceReached,
        ).toBe(true);

        expect(
          review.authorityBoundary
            .firstTaskExecutionCapacityExhausted,
        ).toBe(true);

        expect(review.nextStep).toBe(
          "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ADVIK_FIRST_TASK_REVIEW_REJECTION",
        );
      },
    );

    it(
      "blocks cross-owner review and review before execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-different-001",
            }),
        ).toThrow(
          "canonical owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
                      .executedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede task execution",
        );
      },
    );

    it(
      "rejects tampered Advik execution evidence",
      () => {
        const tamperedSource = {
          ...ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

          executionBoundary: {
            ...ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
              .executionBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as typeof ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              sourceExecution:
                tamperedSource,
            }),
        ).toThrow();
      },
      120_000,
    );

    it(
      "is deterministic deeply frozen digest-bound and secret-safe",
      () => {
        const first =
          createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        expect(second).toEqual(first);

        expect(first.decisionDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(Object.isFrozen(first)).toBe(
          true,
        );

        expect(
          Object.isFrozen(first.reviewedEmployee),
        ).toBe(true);

        expect(
          Object.isFrozen(first.canonicalCandidateDecision),
        ).toBe(true);

        expect(
          Object.isFrozen(first.reviewedEvidence),
        ).toBe(true);

        expect(
          Object.isFrozen(first.authorityBoundary),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
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
          EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow(
          "authority boundary is invalid",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decisionId:
                "secret-advik-review-decision",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              reason:
                "Owner approved this result using private-key=unsafe-value and authorizes the next synthetic step.",
            }),
        ).toThrow(
          "credential-bearing",
        );
      },
      120_000,
    );

    it(
      "exports a valid canonical owner-approved record",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
              review,
            ),
        ).not.toThrow();

        expect(review.ownerId).toBe(
          "owner-prashant-001",
        );

        expect(review.decision).toBe(
          "APPROVE_ADVIK_FIRST_TASK_AND_COMPLETE_ENGINEERING_FIRST_TASK_SEQUENCE",
        );
      },
    );
  },
);
