import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparation";

import {
  createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision";

const approvedDecision =
  createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision({
    decisionId:
      "engineering-post-level-two-workstream-preparation-review-approval-test-001",
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
    ownerId:
      "owner-prashant-001",
    decision:
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_EVIDENCE_ONLY",
    reason:
      "The owner accepted only the deterministic bounded preparation evidence for the four post-Level-2 workstreams and authorized preparation of the first workstream evidence plan without granting any execution authority.",
    decidedAt:
      "2026-08-01T17:30:00.000Z",
  });

describe(
  "Engineering AI Workforce post-Level-2 workstream preparation review decision",
  () => {
    it(
      "accepts bounded preparation evidence only",
      () => {
        expect(
          approvedDecision.preparationEvidenceAccepted,
        ).toBe(true);
        expect(
          approvedDecision.firstWorkstreamEvidencePlanPreparationAuthorized,
        ).toBe(true);
        expect(
          approvedDecision.consequentialAuthorityGranted,
        ).toBe(false);
        expect(
          approvedDecision.nextStep,
        ).toBe(
          "AWAIT_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION",
        );
      },
    );

    it(
      "binds the owner review to the canonical preparation",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

        expect(
          approvedDecision.sourcePreparationId,
        ).toBe(source.preparationId);
        expect(
          approvedDecision.sourcePreparationDigest,
        ).toBe(source.preparationDigest);
        expect(
          approvedDecision.sourceApprovalDecisionDigest,
        ).toBe(
          source.sourceApprovalDecisionDigest,
        );
        expect(
          approvedDecision.sourceScopeDigest,
        ).toBe(source.sourceScopeDigest);
        expect(
          approvedDecision.ownerId,
        ).toBe(source.ownerId);
      },
    );

    it(
      "verifies the exact zero-authority preparation summary",
      () => {
        expect(
          approvedDecision.reviewedPreparation,
        ).toEqual({
          preparationOnly: true,
          preparedWorkstreamCount: 4,
          totalMaximumPlannedEvidenceItemCount:
            32,
          syntheticSanitizedOnlyCount: 4,
          ownerReviewRequiredCount: 4,
          independentValidationRequiredCount:
            4,
          taskExecutionAuthorizedCount: 0,
          concurrentExecutionAuthorizedCount:
            0,
          repositoryReadAuthorizedCount: 0,
          repositoryWriteAuthorizedCount: 0,
          sourceNextStep:
            "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW",
        });
      },
    );

    it(
      "keeps execution repository production customer payment and launch blocked",
      () => {
        expect(
          approvedDecision.authorityBoundary,
        ).toMatchObject({
          workstreamExecutionAuthorized:
            false,
          consequentialAuthorityGranted:
            false,
          levelThreeAuthorityGranted:
            false,
          secondTaskExecutionAuthorized:
            false,
          thirdTaskExecutionAuthorized:
            false,
          concurrentExecutionAuthorized:
            false,
          repositoryReadAuthorized: false,
          repositoryWriteAuthorized: false,
          branchCreationAuthorized: false,
          pullRequestPreparationAuthorized:
            false,
          mergeAuthorized: false,
          secretsAccessAuthorized: false,
          realCustomerDataAccessAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized: false,
          liveProviderExecutionAuthorized:
            false,
          productionDatabaseAuthorized:
            false,
          productionMutationAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          paymentExecutionAuthorized: false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized: false,
          autonomousDecisionAuthorized:
            false,
          productionReadinessAuthorized:
            false,
          publicLaunchAuthorized: false,
        });
      },
    );

    it(
      "keeps Founder Liberation at Level 2 in progress",
      () => {
        const boundary =
          approvedDecision.authorityBoundary;

        expect(
          boundary.founderLiberationAchieved,
        ).toBe(false);
        expect(
          boundary.founderReleasedFromRoutineExecution,
        ).toBe(false);
        expect(
          boundary.ownerFinalAuthorityPreserved,
        ).toBe(true);
      },
    );

    it(
      "supports rejection without further preparation authority",
      () => {
        const rejected =
          createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision({
            decisionId:
              "engineering-post-level-two-workstream-preparation-review-rejection-test-001",
            sourcePreparation:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
            ownerId:
              "owner-prashant-001",
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW",
            reason:
              "The owner rejected the preparation evidence in this deterministic test and retained the existing post-Level-2 workstream preparation review state without granting further authority.",
            decidedAt:
              "2026-08-01T17:31:00.000Z",
          });

        expect(
          rejected.preparationEvidenceAccepted,
        ).toBe(false);
        expect(
          rejected.firstWorkstreamEvidencePlanPreparationAuthorized,
        ).toBe(false);
        expect(rejected.nextStep).toBe(
          "RETAIN_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound review evidence",
      () => {
        const recreated =
          createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision({
            decisionId:
              approvedDecision.decisionId,
            sourcePreparation:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
            ownerId:
              approvedDecision.ownerId,
            decision:
              approvedDecision.decision,
            reason:
              approvedDecision.reason,
            decidedAt:
              approvedDecision.decidedAt,
          });

        expect(recreated).toEqual(
          approvedDecision,
        );
        expect(
          approvedDecision.decisionDigest,
        ).toMatch(/^[0-9a-f]{64}$/);
        expect(
          Object.isFrozen(
            approvedDecision,
          ),
        ).toBe(true);
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
            approvedDecision,
          ),
        ).not.toThrow();
      },
    );

    it(
      "fails closed when second-task execution authority is injected",
      () => {
        const tampered = {
          ...approvedDecision,
          authorityBoundary: {
            ...approvedDecision.authorityBoundary,
            secondTaskExecutionAuthorized:
              true,
          },
        } as unknown as EngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);