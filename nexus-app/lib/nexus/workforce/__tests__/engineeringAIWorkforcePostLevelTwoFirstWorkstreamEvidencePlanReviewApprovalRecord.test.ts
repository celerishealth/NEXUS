import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

import {
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewApprovalRecord";

describe(
  "Engineering AI Workforce post-Level-2 first-workstream evidence-plan review approval record",
  () => {
    it(
      "records the canonical owner approval for evidence-plan acceptance only",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-post-level-two-first-workstream-evidence-plan-review-approval-record-v1",
        );
        expect(record.ownerId).toBe(
          "owner-prashant-001",
        );
        expect(record.decision).toBe(
          "APPROVE_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_ONLY",
        );
        expect(
          record.evidencePlanAccepted,
        ).toBe(true);
        expect(
          record.secondTaskExecutionDecisionPreparationAuthorized,
        ).toBe(true);
        expect(
          record.secondTaskExecutionAuthorized,
        ).toBe(false);
        expect(
          record.consequentialAuthorityGranted,
        ).toBe(false);
      },
    );

    it(
      "binds the approval to the canonical first-workstream evidence plan",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          record.sourcePreparationId,
        ).toBe(source.preparationId);
        expect(
          record.sourcePreparationDigest,
        ).toBe(source.preparationDigest);
        expect(
          record.sourceWorkstreamPreparationReviewDecisionDigest,
        ).toBe(
          source.sourceWorkstreamPreparationReviewDecisionDigest,
        );
        expect(
          record.sourceLevelTwoOwnerReviewDecisionDigest,
        ).toBe(
          source.sourceLevelTwoOwnerReviewDecisionDigest,
        );
        expect(
          record.sourceRuntimeIssuanceDigest,
        ).toBe(
          source.sourceRuntimeIssuanceDigest,
        );
      },
    );

    it(
      "preserves all execution repository production external and Founder Liberation blocks",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

        expect(
          record.authorityBoundary,
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
          founderLiberationAchieved: false,
          founderReleasedFromRoutineExecution:
            false,
          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "validates immutable digest-bound approval evidence and advances only to decision preparation",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

        expect(record.nextStep).toBe(
          "AWAIT_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION",
        );
        expect(
          record.decisionDigest,
        ).toMatch(/^[0-9a-f]{64}$/);
        expect(Object.isFrozen(record)).toBe(
          true,
        );
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision(
            record,
          ),
        ).not.toThrow();
      },
    );
  },
);