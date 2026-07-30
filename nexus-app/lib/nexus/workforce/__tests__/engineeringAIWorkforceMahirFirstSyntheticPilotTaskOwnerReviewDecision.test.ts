import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
} from "../engineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-mahir-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Mahir's bounded synthetic single failure class experiment plan and approved only Zara's next sequential synthetic data-engineering task.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Mahir first synthetic pilot task owner review",
  () => {
    it(
      "approves Mahir result and authorizes only Zara first synthetic task",
      () => {
        const review =
          createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        expect(review.decisionState).toBe(
          "OWNER_ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED",
        );

        expect(review.mahirFirstTaskApproved).toBe(
          true,
        );

        expect(
          review.zaraFirstTaskExecutionAuthorized,
        ).toBe(true);

        expect(
          review.zaraFirstTaskExecutionPerformed,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_SEVEN",
        );
      },
    );

    it(
      "binds exact Mahir execution and Zara canonical identity",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(review.sourceExecutionId).toBe(
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionId,
        );

        expect(review.sourceExecutionDigest).toBe(
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionDigest,
        );

        expect(review.reviewedEmployee).toMatchObject({
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

        expect(review.nextCandidate).toEqual({
          employeeId:
            "candidate-zara-v1",

          employeeCode:
            "nx-engineering-007",

          publicName:
            "Zara",

          officialRole:
            "AI Data Engineering & Analytics Specialist",

          runtimeId:
            "runtime-engineering-nx-engineering-007-candidate-v1",

          taskSequence:
            1,

          executionSequence:
            7,

          scenarioId:
            "SCHEMA_AND_LINEAGE_VALIDATION",
        });
      },
    );

    it(
      "records exact reviewed evidence without inventing production readiness",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
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
            "BOUNDED_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_RECOMMENDED",

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
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ownerReviewDecisionRecorded:
            true,

          mahirFirstTaskReviewed:
            true,

          zaraFirstTaskExecutionAuthorized:
            true,

          zaraFirstTaskExecutionPerformed:
            false,

          onlyZaraCurrentlyExecutable:
            true,

          remainingOneAuthorizedCandidateWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          mahirSecondSyntheticPilotTaskExecutionAuthorized:
            false,

          mahirThirdSyntheticPilotTaskExecutionAuthorized:
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
      "supports rejection without authorizing Zara",
      () => {
        const review =
          createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvalInput(),

            decisionId:
              "engineering-mahir-owner-review-rejection-test-001",

            decision:
              "REJECT_AND_RETAIN_MAHIR_FIRST_TASK_ONLY",

            reason:
              "Owner rejected the reviewed synthetic result and retained the Engineering pilot at Mahir's completed first task only.",
          });

        expect(review.mahirFirstTaskApproved).toBe(
          false,
        );

        expect(
          review.zaraFirstTaskExecutionAuthorized,
        ).toBe(false);

        expect(
          review.authorityBoundary
            .onlyZaraCurrentlyExecutable,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_MAHIR_REVIEW_REJECTION",
        );
      },
    );

    it(
      "blocks cross-owner review and review before execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-different-001",
            }),
        ).toThrow(
          "canonical owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "rejects tampered Mahir execution evidence",
      () => {
        const tamperedSource = {
          ...ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

          executionBoundary: {
            ...ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
              .executionBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as typeof ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision({
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
          createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
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
            validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
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
          EngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow(
          "authority boundary is invalid",
        );

        expect(
          () =>
            createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decisionId:
                "secret-mahir-review-decision",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );

        expect(
          () =>
            createEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision({
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
          ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskOwnerReviewDecision(
              review,
            ),
        ).not.toThrow();

        expect(review.ownerId).toBe(
          "owner-prashant-001",
        );

        expect(review.decision).toBe(
          "APPROVE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
        );
      },
    );
  },
);
