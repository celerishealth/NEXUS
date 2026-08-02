import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparation";

import {
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewApprovalRecord";

describe(
  "Engineering AI Workforce post-Level-2 workstream preparation review approval record",
  () => {
    it(
      "records owner acceptance of preparation evidence only",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-post-level-two-workstream-preparation-review-approval-record-v1",
        );
        expect(record.decision).toBe(
          "APPROVE_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_EVIDENCE_ONLY",
        );
        expect(
          record.preparationEvidenceAccepted,
        ).toBe(true);
        expect(
          record.firstWorkstreamEvidencePlanPreparationAuthorized,
        ).toBe(true);
        expect(
          record.consequentialAuthorityGranted,
        ).toBe(false);
      },
    );

    it(
      "binds the approval to the canonical workstream preparation",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION;
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

        expect(
          record.sourcePreparationId,
        ).toBe(source.preparationId);
        expect(
          record.sourcePreparationDigest,
        ).toBe(source.preparationDigest);
        expect(
          record.sourceApprovalDecisionDigest,
        ).toBe(
          source.sourceApprovalDecisionDigest,
        );
        expect(
          record.sourceScopeDigest,
        ).toBe(source.sourceScopeDigest);
        expect(record.ownerId).toBe(
          source.ownerId,
        );
      },
    );

    it(
      "preserves all execution repository production and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION
            .authorityBoundary,
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
          founderLiberationAchieved: false,
          founderReleasedFromRoutineExecution:
            false,
          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "advances only to first-workstream evidence-plan preparation",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION;

        expect(record.nextStep).toBe(
          "AWAIT_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION",
        );
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
            record,
          ),
        ).not.toThrow();
        expect(
          Object.isFrozen(record),
        ).toBe(true);
        expect(record.decisionDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );
      },
    );
  },
);