import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

import {
  createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision";

const approvedDecision =
  createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision({
    decisionId:
      "engineering-post-level-two-first-workstream-evidence-plan-review-approval-test-001",
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
    ownerId:
      "owner-prashant-001",
    decision:
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_ONLY",
    reason:
      "The owner accepted only the deterministic plan-only evidence for eight bounded synthetic second-task candidates and authorized preparation of a separate owner execution-decision contract without authorizing any task execution.",
    decidedAt:
      "2026-08-01T17:55:00.000Z",
  });

describe(
  "Engineering AI Workforce post-Level-2 first-workstream evidence-plan review decision",
  () => {
    it(
      "accepts only the bounded evidence plan",
      () => {
        expect(
          approvedDecision.evidencePlanAccepted,
        ).toBe(true);
        expect(
          approvedDecision.secondTaskExecutionDecisionPreparationAuthorized,
        ).toBe(true);
        expect(
          approvedDecision.secondTaskExecutionAuthorized,
        ).toBe(false);
        expect(
          approvedDecision.consequentialAuthorityGranted,
        ).toBe(false);
      },
    );

    it(
      "binds the review to the canonical evidence-plan preparation",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          approvedDecision.sourcePreparationId,
        ).toBe(source.preparationId);
        expect(
          approvedDecision.sourcePreparationDigest,
        ).toBe(source.preparationDigest);
        expect(
          approvedDecision.sourceWorkstreamPreparationReviewDecisionDigest,
        ).toBe(
          source.sourceWorkstreamPreparationReviewDecisionDigest,
        );
        expect(
          approvedDecision.sourceLevelTwoOwnerReviewDecisionDigest,
        ).toBe(
          source.sourceLevelTwoOwnerReviewDecisionDigest,
        );
        expect(
          approvedDecision.sourceRuntimeIssuanceDigest,
        ).toBe(
          source.sourceRuntimeIssuanceDigest,
        );
      },
    );

    it(
      "reviews exactly eight plan-only candidates with zero execution",
      () => {
        expect(
          approvedDecision.reviewedPlan,
        ).toMatchObject({
          workstreamSequence: 1,
          workstreamId:
            "routine-engineering-second-task-evidence",
          evidenceClass:
            "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE",
          planOnly: true,
          candidatePlanCount: 8,
          firstTaskReviewedAndApprovedCount:
            8,
          activatedRuntimeCount: 8,
          secondTaskEvidencePlanPreparedCount:
            8,
          ownerExecutionDecisionRequiredCount:
            8,
          ownerExecutionDecisionRecordedCount:
            0,
          secondTaskExecutionAuthorizedCount:
            0,
          secondTaskExecutedCount: 0,
          concurrentExecutionAuthorizedCount:
            0,
          repositoryReadAuthorizedCount: 0,
          repositoryWriteAuthorizedCount: 0,
          syntheticSanitizedPlanCount: 8,
          deterministicEvidenceRequiredCount:
            8,
          independentValidationRequiredCount:
            8,
        });
      },
    );

    it(
      "preserves every execution repository production and external block",
      () => {
        expect(
          approvedDecision.authorityBoundary,
        ).toMatchObject({
          secondTaskExecutionAuthorized:
            false,
          consequentialAuthorityGranted:
            false,
          levelThreeAuthorityGranted:
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
      "advances only to execution-decision preparation",
      () => {
        expect(
          approvedDecision.nextStep,
        ).toBe(
          "AWAIT_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION",
        );
      },
    );

    it(
      "supports rejection without further preparation authority",
      () => {
        const rejected =
          createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision({
            decisionId:
              "engineering-post-level-two-first-workstream-evidence-plan-review-rejection-test-001",
            sourcePreparation:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
            ownerId:
              "owner-prashant-001",
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
            reason:
              "The owner rejected the first-workstream evidence plan in this deterministic test and retained the review state without authorizing execution-decision preparation or any further authority.",
            decidedAt:
              "2026-08-01T17:56:00.000Z",
          });

        expect(
          rejected.evidencePlanAccepted,
        ).toBe(false);
        expect(
          rejected.secondTaskExecutionDecisionPreparationAuthorized,
        ).toBe(false);
        expect(
          rejected.secondTaskExecutionAuthorized,
        ).toBe(false);
        expect(rejected.nextStep).toBe(
          "RETAIN_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound review evidence",
      () => {
        const recreated =
          createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision({
            decisionId:
              approvedDecision.decisionId,
            sourcePreparation:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
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
          validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision(
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
        } as unknown as EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);