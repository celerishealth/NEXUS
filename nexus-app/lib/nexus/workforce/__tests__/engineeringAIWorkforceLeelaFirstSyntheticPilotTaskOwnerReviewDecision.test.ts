import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
} from "../engineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-leela-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Leela's bounded synthetic evidence-gated delivery plan and approved only Vivaan's next sequential synthetic quality task.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Leela first synthetic pilot task owner review",
  () => {
    it(
      "approves Leela result and authorizes only Vivaan first synthetic task",
      () => {
        const review =
          createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        expect(review.decisionState).toBe(
          "OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED",
        );

        expect(review.leelaFirstTaskApproved).toBe(
          true,
        );

        expect(
          review.vivaanFirstTaskExecutionAuthorized,
        ).toBe(true);

        expect(
          review.vivaanFirstTaskExecutionPerformed,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_THREE",
        );
      },
    );

    it(
      "binds exact Leela execution and Vivaan canonical identity",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(review.sourceExecutionId).toBe(
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionId,
        );

        expect(review.sourceExecutionDigest).toBe(
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionDigest,
        );

        expect(review.reviewedEmployee).toMatchObject({
          publicName:
            "Leela",

          executionSequence:
            2,

          scenarioId:
            "EVIDENCE_GATED_DELIVERY_PLAN",
        });

        expect(review.nextCandidate).toEqual({
          employeeId:
            "candidate-vivaan-v1",

          employeeCode:
            "nx-engineering-003",

          publicName:
            "Vivaan",

          officialRole:
            "AI Quality Assurance Director",

          runtimeId:
            "runtime-engineering-nx-engineering-003-candidate-v1",

          taskSequence:
            1,

          executionSequence:
            3,

          scenarioId:
            "TARGETED_QUALITY_GAP_ANALYSIS",
        });
      },
    );

    it(
      "records exact reviewed evidence without inventing production readiness",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
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

          draftOutcome:
            "BOUNDED_EVIDENCE_GATED_DELIVERY_PLAN_RECOMMENDED",

          riskLevel:
            "MEDIUM",

          deliveryStageCount:
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
      "keeps remaining candidates and every consequential authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ownerReviewDecisionRecorded:
            true,

          leelaFirstTaskReviewed:
            true,

          vivaanFirstTaskExecutionAuthorized:
            true,

          vivaanFirstTaskExecutionPerformed:
            false,

          onlyVivaanCurrentlyExecutable:
            true,

          remainingFiveAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          leelaSecondSyntheticPilotTaskExecutionAuthorized:
            false,

          leelaThirdSyntheticPilotTaskExecutionAuthorized:
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
      "supports rejection without authorizing Vivaan",
      () => {
        const review =
          createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvalInput(),

            decisionId:
              "engineering-leela-owner-review-rejection-test-001",

            decision:
              "REJECT_AND_RETAIN_LEELA_FIRST_TASK_ONLY",

            reason:
              "Owner rejected the reviewed synthetic result and retained the Engineering pilot at Leela's completed first task only.",
          });

        expect(review.leelaFirstTaskApproved).toBe(
          false,
        );

        expect(
          review.vivaanFirstTaskExecutionAuthorized,
        ).toBe(false);

        expect(
          review.authorityBoundary
            .onlyVivaanCurrentlyExecutable,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_LEELA_REVIEW_REJECTION",
        );
      },
    );

    it(
      "blocks cross-owner review and review before execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-different-001",
            }),
        ).toThrow(
          "canonical owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "rejects tampered Leela execution evidence",
      () => {
        const tamperedSource = {
          ...ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

          executionBoundary: {
            ...ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
              .executionBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as typeof ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision({
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
          createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
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
          Object.isFrozen(first.nextCandidate),
        ).toBe(true);

        expect(
          Object.isFrozen(first.reviewedEvidence),
        ).toBe(true);

        expect(
          Object.isFrozen(first.authorityBoundary),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
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
          EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow(
          "authority boundary is invalid",
        );

        expect(
          () =>
            createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decisionId:
                "secret-leela-review-decision",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );

        expect(
          () =>
            createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision({
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
          ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
              review,
            ),
        ).not.toThrow();

        expect(review.ownerId).toBe(
          "owner-prashant-001",
        );

        expect(review.decision).toBe(
          "APPROVE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
        );
      },
    );
  },
);
