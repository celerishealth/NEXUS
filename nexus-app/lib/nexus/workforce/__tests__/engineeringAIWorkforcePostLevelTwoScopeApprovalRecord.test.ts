import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
} from "../engineeringAIWorkforcePostLevelTwoScopeDefinition";

import {
  validateEngineeringAIWorkforcePostLevelTwoScopeDecision,
} from "../engineeringAIWorkforcePostLevelTwoScopeDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforcePostLevelTwoScopeApprovalRecord";

describe(
  "Engineering AI Workforce post-Level-2 scope approval record",
  () => {
    it(
      "records owner approval for bounded workstream preparation only",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-post-level-two-scope-approval-record-v1",
        );
        expect(record.decision).toBe(
          "APPROVE_ENGINEERING_POST_LEVEL_TWO_SCOPE_PREPARATION_ONLY",
        );
        expect(record.scopeApproved).toBe(
          true,
        );
        expect(
          record.boundedPreparationAuthorized,
        ).toBe(true);
        expect(
          record.consequentialAuthorityGranted,
        ).toBe(false);
      },
    );

    it(
      "binds the approval to the canonical scope and owner",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION;
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

        expect(record.sourceScopeId).toBe(
          source.scopeId,
        );
        expect(record.sourceScopeDigest).toBe(
          source.scopeDigest,
        );
        expect(record.ownerId).toBe(
          source.ownerId,
        );
        expect(
          record.reviewedScope.workstreamIds,
        ).toEqual(
          source.workstreams.map(
            (workstream) =>
              workstream.workstreamId,
          ),
        );
      },
    );

    it(
      "preserves all consequential and external authority blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
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
      "advances only to bounded workstream preparation",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION;

        expect(record.nextStep).toBe(
          "AWAIT_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION",
        );
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoScopeDecision(
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