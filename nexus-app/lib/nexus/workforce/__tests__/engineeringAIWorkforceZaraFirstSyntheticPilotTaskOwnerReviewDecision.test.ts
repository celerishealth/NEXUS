import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
} from "../engineeringAIWorkforceZaraFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-zara-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Zara's bounded synthetic schema and lineage validation and approved only Advik's next sequential synthetic red-team task.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Zara first synthetic pilot task owner review",
  () => {
    it(
      "approves Zara result and authorizes only Advik first synthetic task",
      () => {
        const review =
          createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        expect(review.decisionState).toBe(
          "OWNER_ENGINEERING_ZARA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED",
        );

        expect(review.zaraFirstTaskApproved).toBe(
          true,
        );

        expect(
          review.advikFirstTaskExecutionAuthorized,
        ).toBe(true);

        expect(
          review.advikFirstTaskExecutionPerformed,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_EIGHT",
        );
      },
    );

    it(
      "binds exact Zara execution and Advik canonical identity",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(review.sourceExecutionId).toBe(
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionId,
        );

        expect(review.sourceExecutionDigest).toBe(
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionDigest,
        );

        expect(review.reviewedEmployee).toMatchObject({
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

        expect(review.nextCandidate).toEqual({
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
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
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
            "BOUNDED_SCHEMA_AND_LINEAGE_VALIDATION_RECOMMENDED",

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
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ownerReviewDecisionRecorded:
            true,

          zaraFirstTaskReviewed:
            true,

          advikFirstTaskExecutionAuthorized:
            true,

          advikFirstTaskExecutionPerformed:
            false,

          onlyAdvikCurrentlyExecutable:
            true,

          remainingOneAuthorizedCandidateWaiting:
            false,

          concurrentCandidateExecutionAuthorized:
            false,

          zaraSecondSyntheticPilotTaskExecutionAuthorized:
            false,

          zaraThirdSyntheticPilotTaskExecutionAuthorized:
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
          createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvalInput(),

            decisionId:
              "engineering-zara-owner-review-rejection-test-001",

            decision:
              "REJECT_AND_RETAIN_ZARA_FIRST_TASK_ONLY",

            reason:
              "Owner rejected the reviewed synthetic result and retained the Engineering pilot at Zara's completed first task only.",
          });

        expect(review.zaraFirstTaskApproved).toBe(
          false,
        );

        expect(
          review.advikFirstTaskExecutionAuthorized,
        ).toBe(false);

        expect(
          review.authorityBoundary
            .onlyAdvikCurrentlyExecutable,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ZARA_REVIEW_REJECTION",
        );
      },
    );

    it(
      "blocks cross-owner review and review before execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-different-001",
            }),
        ).toThrow(
          "canonical owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "rejects tampered Zara execution evidence",
      () => {
        const tamperedSource = {
          ...ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

          executionBoundary: {
            ...ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
              .executionBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as typeof ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision({
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
          createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
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
            validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
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
          EngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow(
          "authority boundary is invalid",
        );

        expect(
          () =>
            createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decisionId:
                "secret-zara-review-decision",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );

        expect(
          () =>
            createEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision({
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
          ENGINEERING_AI_WORKFORCE_ZARA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceZaraFirstSyntheticPilotTaskOwnerReviewDecision(
              review,
            ),
        ).not.toThrow();

        expect(review.ownerId).toBe(
          "owner-prashant-001",
        );

        expect(review.decision).toBe(
          "APPROVE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
        );
      },
    );
  },
);
