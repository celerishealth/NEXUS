import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
} from "../engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
  ENGINEERING_AI_WORKFORCE_OWNER_REVIEW_REASONS,
  createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision,
  validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision,
  type EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision,
} from "../engineeringAIWorkforceOwnerControlledShadowOperationReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-owner-shadow-review-test-001",

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    controlledShadowOperationExecution:
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,

    decisions:
      Array.from(
        {
          length:
            8,
        },
        () =>
          "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" as const,
      ),

    reasons:
      ENGINEERING_AI_WORKFORCE_OWNER_REVIEW_REASONS,

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce owner controlled-shadow operation review decision",
  () => {
    it(
      "records explicit approval for all eight Engineering specialists",
      () => {
        const decision =
          createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
            approvalInput(),
          );

        expect(
          decision.decisionState,
        ).toBe(
          "OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS_RECORDED",
        );

        expect(
          decision.candidateReviews,
        ).toHaveLength(8);

        expect(
          decision.candidateReviews.every(
            (review) =>
              review.decision ===
                "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" &&
              review.shadowOperationApproved ===
                true &&
              review.limitedInternalPilotPreparationEligible ===
                true,
          ),
        ).toBe(true);
      },
      30_000,
    );

    it(
      "preserves exact candidate identity and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
            .candidateReviews
            .map(
              (review) =>
                review.publicName,
            ),
        ).toEqual([
          "Ishaan",
          "Leela",
          "Vivaan",
          "Anaya",
          "Atharv",
          "Mahir",
          "Zara",
          "Advik",
        ]);

        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
            .candidateReviews
            .map(
              (review) =>
                review.developmentSequence,
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
      "binds every review to exact controlled-shadow execution evidence",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION;

        expect(
          decision.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .executionId,
        );

        expect(
          decision.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .executionDigest,
        );

        expect(
          decision.candidateReviews.every(
            (
              review,
              index,
            ) =>
              review.sourceCandidateExecutionDigest ===
                ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
                  .candidateExecutions[index]
                  ?.candidateExecutionDigest,
          ),
        ).toBe(true);
      },
    );

    it(
      "records exact safe reviewed evidence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
            .candidateReviews
            .every(
              (review) =>
                review.reviewedEvidence
                  .dataClassification ===
                  "SYNTHETIC_SANITIZED_ONLY" &&
                review.reviewedEvidence
                  .evidenceToolMode ===
                  "READ_ONLY" &&
                review.reviewedEvidence
                  .draftToolMode ===
                  "DRAFT_ONLY" &&
                review.reviewedEvidence
                  .executionMode ===
                  "SANDBOX_ONLY" &&
                review.reviewedEvidence
                  .verifiedFactCount ===
                  3 &&
                review.reviewedEvidence
                  .findingCount ===
                  3 &&
                review.reviewedEvidence
                  .recommendationCount ===
                  3 &&
                review.reviewedEvidence
                  .uncertaintyCount ===
                  3 &&
                review.reviewedEvidence
                  .unsupportedFactsInvented ===
                  false &&
                review.reviewedEvidence
                  .unsupportedClaimsIncluded ===
                  false &&
                review.reviewedEvidence
                  .urgencyExaggerated ===
                  false &&
                review.reviewedEvidence
                  .guaranteeMade ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "authorizes limited internal pilot preparation only",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION;

        expect(
          decision.aggregateSummary,
        ).toMatchObject({
          reviewedCandidateCount:
            8,

          approvedCandidateCount:
            8,

          rejectedCandidateCount:
            0,

          limitedInternalPilotPreparationEligibleCount:
            8,

          limitedInternalPilotExecutionAuthorizedCount:
            0,
        });

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          limitedInternalPilotPreparationAuthorized:
            true,

          limitedInternalPilotPreparationAuthorizedCount:
            8,

          limitedInternalPilotExecutionAuthorized:
            false,
        });

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_ENGINEERING_LIMITED_INTERNAL_PILOTS",
        );
      },
    );

    it(
      "keeps repository production customer payment and launch authority blocked",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
            .authorityBoundary,
        ).toMatchObject({
          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          branchCreationAuthorized:
            false,

          pullRequestPreparationAuthorized:
            false,

          mergeAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          secretsAccessAuthorized:
            false,

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          financialCommitmentAuthorized:
            false,

          legalCommitmentAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          productionReadinessAuthorized:
            false,

          publicLaunchAuthorized:
            false,

          emergencyPauseAvailable:
            true,
        });
      },
    );

    it(
      "blocks cross-owner review decisions",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-cross-tenant-engineering-review" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "Only the Engineering controlled-shadow-bound owner",
        );
      },
    );

    it(
      "blocks decisions before controlled-shadow execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
                      .executedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede execution",
        );
      },
    );

    it(
      "requires the canonical Engineering controlled-shadow execution",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision({
              ...approvalInput(),

              controlledShadowOperationExecution: {
                ...ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
              } as typeof ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
            }),
        ).toThrow(
          "canonical Engineering controlled-shadow execution",
        );
      },
    );

    it(
      "supports rejection while retaining controlled-shadow boundaries",
      () => {
        const decisions =
          approvalInput().decisions.map(
            (
              decision,
              index,
            ) =>
              index === 0
                ? "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION" as const
                : decision,
          );

        const reasons =
          ENGINEERING_AI_WORKFORCE_OWNER_REVIEW_REASONS.map(
            (
              reason,
              index,
            ) =>
              index === 0
                ? "Owner rejected Ishaan pilot preparation and retained the specialist within the controlled shadow boundary."
                : reason,
          );

        const decision =
          createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision({
            ...approvalInput(),
            decisions,
            reasons,
          });

        expect(
          decision.aggregateSummary
            .approvedCandidateCount,
        ).toBe(7);

        expect(
          decision.aggregateSummary
            .rejectedCandidateCount,
        ).toBe(1);

        expect(
          decision.authorityBoundary
            .limitedInternalPilotPreparationAuthorized,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_CONTROLLED_SHADOW_ONLY",
        );
      },
      30_000,
    );

    it(
      "is deterministic immutable digest-bound and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
            approvalInput(),
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
            first.candidateReviews,
          ),
        ).toBe(true);

        expect(
          first.candidateReviews.every(
            (review) =>
              Object.isFrozen(review) &&
              Object.isFrozen(
                review.reviewedEvidence,
              ) &&
              Object.isFrozen(
                review.authorityBoundary,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          aggregateSummary: {
            ...first.aggregateSummary,

            approvedCandidateCount:
              7,
          },
        } as
          EngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision(
              tampered,
            ),
        ).toThrow(
          "aggregate summary is invalid",
        );
      },
      40_000,
    );

    it(
      "rejects secret-bearing review reasons",
      () => {
        const reasons: string[] = [
          ...ENGINEERING_AI_WORKFORCE_OWNER_REVIEW_REASONS,
        ];

        reasons[0] =
          "Owner approved with access_token abcdef123456 for pilot preparation.";

        expect(
          () =>
            createEngineeringAIWorkforceOwnerControlledShadowOperationReviewDecision({
              ...approvalInput(),
              reasons,
            }),
        ).toThrow(
          "prohibited secret-bearing content",
        );
      },
    );
  },
);
