import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
} from "../engineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-atharv-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Atharv's bounded synthetic recovery evidence review and approved only Mahir's next sequential synthetic chaos-engineering task.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Atharv first synthetic pilot task owner review",
  () => {
    it(
      "approves Atharv result and authorizes only Mahir first synthetic task",
      () => {
        const review =
          createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        expect(review.decisionState).toBe(
          "OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED",
        );

        expect(review.atharvFirstTaskApproved).toBe(
          true,
        );

        expect(
          review.mahirFirstTaskExecutionAuthorized,
        ).toBe(true);

        expect(
          review.mahirFirstTaskExecutionPerformed,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_SIX",
        );
      },
    );

    it(
      "binds exact Atharv execution and Mahir canonical identity",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(review.sourceExecutionId).toBe(
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionId,
        );

        expect(review.sourceExecutionDigest).toBe(
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionDigest,
        );

        expect(review.reviewedEmployee).toMatchObject({
          employeeId:
            "candidate-atharv-v1",

          employeeCode:
            "nx-engineering-005",

          publicName:
            "Atharv",

          officialRole:
            "AI Reliability Engineering Specialist",

          runtimeId:
            "runtime-engineering-nx-engineering-005-candidate-v1",

          taskSequence:
            1,

          executionSequence:
            5,

          scenarioId:
            "RECOVERY_EVIDENCE_REVIEW",
        });

        expect(review.nextCandidate).toEqual({
          employeeId:
            "candidate-mahir-v1",

          employeeCode:
            "nx-engineering-006",

          publicName:
            "Mahir",

          officialRole:
            "AI Chaos Engineering Specialist",

          runtimeId:
            "runtime-engineering-nx-engineering-006-candidate-v1",

          taskSequence:
            1,

          executionSequence:
            6,

          scenarioId:
            "SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN",
        });
      },
    );

    it(
      "records exact reviewed evidence without inventing production readiness",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
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
            "BOUNDED_RECOVERY_EVIDENCE_REVIEW_RECOMMENDED",

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
      "keeps remaining candidates and every consequential authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ownerReviewDecisionRecorded:
            true,

          atharvFirstTaskReviewed:
            true,

          mahirFirstTaskExecutionAuthorized:
            true,

          mahirFirstTaskExecutionPerformed:
            false,

          onlyMahirCurrentlyExecutable:
            true,

          remainingTwoAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          atharvSecondSyntheticPilotTaskExecutionAuthorized:
            false,

          atharvThirdSyntheticPilotTaskExecutionAuthorized:
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
      "supports rejection without authorizing Mahir",
      () => {
        const review =
          createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvalInput(),

            decisionId:
              "engineering-atharv-owner-review-rejection-test-001",

            decision:
              "REJECT_AND_RETAIN_ATHARV_FIRST_TASK_ONLY",

            reason:
              "Owner rejected the reviewed synthetic result and retained the Engineering pilot at Atharv's completed first task only.",
          });

        expect(review.atharvFirstTaskApproved).toBe(
          false,
        );

        expect(
          review.mahirFirstTaskExecutionAuthorized,
        ).toBe(false);

        expect(
          review.authorityBoundary
            .onlyMahirCurrentlyExecutable,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ATHARV_REVIEW_REJECTION",
        );
      },
    );

    it(
      "blocks cross-owner review and review before execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-different-001",
            }),
        ).toThrow(
          "canonical owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "rejects tampered Atharv execution evidence",
      () => {
        const tamperedSource = {
          ...ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

          executionBoundary: {
            ...ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
              .executionBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as typeof ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision({
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
          createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
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
            validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
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
          EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow(
          "authority boundary is invalid",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decisionId:
                "secret-atharv-review-decision",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision({
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
          ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
              review,
            ),
        ).not.toThrow();

        expect(review.ownerId).toBe(
          "owner-prashant-001",
        );

        expect(review.decision).toBe(
          "APPROVE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
        );
      },
    );
  },
);
