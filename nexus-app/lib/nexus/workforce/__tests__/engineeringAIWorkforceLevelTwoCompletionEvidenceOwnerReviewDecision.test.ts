import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,
} from "../engineeringAIWorkforceLevelTwoCompletionCriteriaEvidence";

import {
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION,
  createEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision,
  validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision,
} from "../engineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision";

describe(
  "Engineering AI Workforce Level-2 completion-evidence owner review decision",
  () => {
    it(
      "accepts only the canonical Level-2 evidence and grants no additional authority",
      () => {
        const review =
          ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION;

        expect(review.decision).toBe(
          "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY",
        );
        expect(review.levelTwoEvidenceAccepted).toBe(true);
        expect(review.additionalAuthorityGranted).toBe(false);
        expect(review.reviewedEvidence).toEqual(
          ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE.summary,
        );
        expect(review.authorityBoundary).toMatchObject({
          ownerCompletionReviewAccepted: true,
          additionalAuthorityGranted: false,
          levelThreeAuthorityGranted: false,
          pilotCompleted: false,
          furtherCandidateExecutionAuthorized: false,
          secondTaskExecutionAuthorized: false,
          thirdTaskExecutionAuthorized: false,
          concurrentExecutionAuthorized: false,
          repositoryReadAuthorized: false,
          repositoryWriteAuthorized: false,
          realCustomerContactAuthorized: false,
          externalDeliveryAuthorized: false,
          liveProviderExecutionAuthorized: false,
          productionMutationAuthorized: false,
          productionDeploymentAuthorized: false,
          paymentExecutionAuthorized: false,
          financialCommitmentAuthorized: false,
          legalCommitmentAuthorized: false,
          autonomousDecisionAuthorized: false,
          productionReadinessAuthorized: false,
          publicLaunchAuthorized: false,
          founderLiberationAchieved: false,
          founderReleasedFromRoutineExecution: false,
        });
        expect(review.nextStep).toBe(
          "AWAIT_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINITION",
        );
        expect(
          () =>
            validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
              review,
            ),
        ).not.toThrow();
      },
    );

    it(
      "supports rejection while preserving every authority block",
      () => {
        const rejection =
          createEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision({
            decisionId:
              "engineering-level-two-owner-review-rejection-test-001",
            sourceEvidence:
              ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,
            ownerId:
              "owner-prashant-001",
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW",
            reason:
              "The owner rejected this test review and retained all Engineering work at the existing bounded Level-2 evidence-review state without authorizing any additional action.",
            decidedAt:
              "2026-07-31T16:12:00.000Z",
          });

        expect(rejection.levelTwoEvidenceAccepted).toBe(false);
        expect(
          rejection.authorityBoundary.ownerCompletionReviewAccepted,
        ).toBe(false);
        expect(rejection.additionalAuthorityGranted).toBe(false);
        expect(
          rejection.authorityBoundary.levelThreeAuthorityGranted,
        ).toBe(false);
        expect(
          rejection.authorityBoundary.founderLiberationAchieved,
        ).toBe(false);
        expect(rejection.nextStep).toBe(
          "RETAIN_ENGINEERING_LEVEL_TWO_EVIDENCE_REVIEW_REJECTION",
        );
      },
    );

    it(
      "is deterministic, integrity-bound, and deeply frozen",
      () => {
        const input = {
          decisionId:
            "engineering-level-two-owner-review-determinism-test-001",
          sourceEvidence:
            ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,
          ownerId:
            "owner-prashant-001",
          decision:
            "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY" as const,
          reason:
            "The owner accepted the canonical Engineering Level-2 completion evidence in this deterministic test while preserving every existing authority restriction.",
          decidedAt:
            "2026-07-31T16:13:00.000Z",
        };

        const first =
          createEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
            input,
          );
        const second =
          createEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
            input,
          );

        expect(first.decisionDigest).toBe(second.decisionDigest);
        expect(first.decisionDigest).toMatch(/^[0-9a-f]{64}$/);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.reviewedEvidence)).toBe(true);
        expect(Object.isFrozen(first.authorityBoundary)).toBe(true);
      },
    );

    it(
      "rejects digest tampering and a non-canonical owner",
      () => {
        const canonical =
          ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision({
              ...canonical,
              decisionDigest:
                "0".repeat(64),
            }),
        ).toThrow(
          "Engineering Level-2 owner-review decision integrity is invalid.",
        );

        expect(
          () =>
            createEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision({
              decisionId:
                "engineering-level-two-wrong-owner-test-001",
              sourceEvidence:
                ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,
              ownerId:
                "owner-not-prashant-001",
              decision:
                "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY",
              reason:
                "This negative test confirms that a non-canonical owner cannot approve the Engineering Level-2 completion-evidence review decision.",
              decidedAt:
                "2026-07-31T16:14:00.000Z",
            }),
        ).toThrow(
          "Engineering Level-2 owner review is bound to the canonical owner.",
        );
      },
    );
  },
);
