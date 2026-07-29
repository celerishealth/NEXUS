import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
} from "../engineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision,
} from "../engineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-anaya-owner-review-test-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" as const,

    reason:
      "Owner reviewed Anaya's bounded synthetic authority escalation threat review and approved only Atharv's next sequential synthetic reliability task.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce Anaya first synthetic pilot task owner review",
  () => {
    it(
      "approves Anaya result and authorizes only Atharv first synthetic task",
      () => {
        const review =
          createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        expect(review.decisionState).toBe(
          "OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED",
        );

        expect(review.anayaFirstTaskApproved).toBe(
          true,
        );

        expect(
          review.atharvFirstTaskExecutionAuthorized,
        ).toBe(true);

        expect(
          review.atharvFirstTaskExecutionPerformed,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_FIVE",
        );
      },
    );

    it(
      "binds exact Anaya execution and Atharv canonical identity",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(review.sourceExecutionId).toBe(
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionId,
        );

        expect(review.sourceExecutionDigest).toBe(
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
            .executionDigest,
        );

        expect(review.reviewedEmployee).toMatchObject({
          employeeId:
            "candidate-anaya-v1",

          employeeCode:
            "nx-engineering-004",

          publicName:
            "Anaya",

          officialRole:
            "AI Security Engineering Director",

          runtimeId:
            "runtime-engineering-nx-engineering-004-candidate-v1",

          taskSequence:
            1,

          executionSequence:
            4,

          scenarioId:
            "AUTHORITY_ESCALATION_THREAT_REVIEW",
        });

        expect(review.nextCandidate).toEqual({
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
      },
    );

    it(
      "records exact reviewed evidence without inventing production readiness",
      () => {
        const evidence =
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
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
            "BOUNDED_AUTHORITY_ESCALATION_THREAT_REVIEW_RECOMMENDED",

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
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          ownerReviewDecisionRecorded:
            true,

          anayaFirstTaskReviewed:
            true,

          atharvFirstTaskExecutionAuthorized:
            true,

          atharvFirstTaskExecutionPerformed:
            false,

          onlyAtharvCurrentlyExecutable:
            true,

          remainingThreeAuthorizedCandidatesWaiting:
            true,

          concurrentCandidateExecutionAuthorized:
            false,

          anayaSecondSyntheticPilotTaskExecutionAuthorized:
            false,

          anayaThirdSyntheticPilotTaskExecutionAuthorized:
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
      "supports rejection without authorizing Atharv",
      () => {
        const review =
          createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision({
            ...approvalInput(),

            decisionId:
              "engineering-anaya-owner-review-rejection-test-001",

            decision:
              "REJECT_AND_RETAIN_ANAYA_FIRST_TASK_ONLY",

            reason:
              "Owner rejected the reviewed synthetic result and retained the Engineering pilot at Anaya's completed first task only.",
          });

        expect(review.anayaFirstTaskApproved).toBe(
          false,
        );

        expect(
          review.atharvFirstTaskExecutionAuthorized,
        ).toBe(false);

        expect(
          review.authorityBoundary
            .onlyAtharvCurrentlyExecutable,
        ).toBe(false);

        expect(review.nextStep).toBe(
          "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ANAYA_REVIEW_REJECTION",
        );
      },
    );

    it(
      "blocks cross-owner review and review before execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-different-001",
            }),
        ).toThrow(
          "canonical owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
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
      "rejects tampered Anaya execution evidence",
      () => {
        const tamperedSource = {
          ...ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

          executionBoundary: {
            ...ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION
              .executionBoundary,

            repositoryWriteAuthorized:
              true,
          },
        } as unknown as typeof ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

        expect(
          () =>
            createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision({
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
          createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
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
            validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
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
          EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
              tampered,
            ),
        ).toThrow(
          "authority boundary is invalid",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision({
              ...approvalInput(),

              decisionId:
                "secret-anaya-review-decision",
            }),
        ).toThrow(
          "invalid or credential-bearing",
        );

        expect(
          () =>
            createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision({
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
          ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
              review,
            ),
        ).not.toThrow();

        expect(review.ownerId).toBe(
          "owner-prashant-001",
        );

        expect(review.decision).toBe(
          "APPROVE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
        );
      },
    );
  },
);
