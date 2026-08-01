import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
} from "../engineeringAIWorkforcePostLevelTwoScopeDefinition";

import {
  createEngineeringAIWorkforcePostLevelTwoScopeDecision,
  validateEngineeringAIWorkforcePostLevelTwoScopeDecision,
  type EngineeringAIWorkforcePostLevelTwoScopeDecision,
} from "../engineeringAIWorkforcePostLevelTwoScopeDecision";

const approvedDecision =
  createEngineeringAIWorkforcePostLevelTwoScopeDecision({
    decisionId:
      "engineering-post-level-two-scope-decision-approval-test-001",
    sourceScope:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
    ownerId:
      "owner-prashant-001",
    decision:
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SCOPE_PREPARATION_ONLY",
    reason:
      "The owner approved only bounded preparation of the four defined post-Level-2 evidence workstreams while preserving every execution and external authority restriction.",
    decidedAt:
      "2026-08-01T16:50:00.000Z",
  });

describe(
  "Engineering AI Workforce post-Level-2 scope decision",
  () => {
    it(
      "supports owner approval of bounded preparation only",
      () => {
        expect(
          approvedDecision.scopeApproved,
        ).toBe(true);
        expect(
          approvedDecision.boundedPreparationAuthorized,
        ).toBe(true);
        expect(
          approvedDecision.consequentialAuthorityGranted,
        ).toBe(false);
        expect(
          approvedDecision.nextStep,
        ).toBe(
          "AWAIT_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION",
        );
      },
    );

    it(
      "binds the decision to the canonical scope and owner",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

        expect(
          approvedDecision.sourceScopeId,
        ).toBe(source.scopeId);
        expect(
          approvedDecision.sourceScopeDigest,
        ).toBe(source.scopeDigest);
        expect(
          approvedDecision.ownerId,
        ).toBe(source.ownerId);
        expect(
          approvedDecision.reviewedScope
            .workstreamIds,
        ).toEqual(
          source.workstreams.map(
            (workstream) =>
              workstream.workstreamId,
          ),
        );
      },
    );

    it(
      "keeps execution repository production customer payment and launch authority blocked",
      () => {
        expect(
          approvedDecision.authorityBoundary,
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
      "supports rejection without preparation authority",
      () => {
        const rejected =
          createEngineeringAIWorkforcePostLevelTwoScopeDecision({
            decisionId:
              "engineering-post-level-two-scope-decision-rejection-test-001",
            sourceScope:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
            ownerId:
              "owner-prashant-001",
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_SCOPE_REVIEW",
            reason:
              "The owner rejected the proposed scope in this deterministic test and retained all Engineering work at the existing bounded Level-2 review state.",
            decidedAt:
              "2026-08-01T16:51:00.000Z",
          });

        expect(rejected.scopeApproved).toBe(
          false,
        );
        expect(
          rejected.boundedPreparationAuthorized,
        ).toBe(false);
        expect(rejected.nextStep).toBe(
          "RETAIN_ENGINEERING_POST_LEVEL_TWO_SCOPE_REVIEW",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound decisions",
      () => {
        const recreated =
          createEngineeringAIWorkforcePostLevelTwoScopeDecision({
            decisionId:
              approvedDecision.decisionId,
            sourceScope:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
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
          validateEngineeringAIWorkforcePostLevelTwoScopeDecision(
            approvedDecision,
          ),
        ).not.toThrow();
      },
    );

    it(
      "fails closed when Level-3 authority is injected",
      () => {
        const tampered = {
          ...approvedDecision,
          authorityBoundary: {
            ...approvedDecision.authorityBoundary,
            levelThreeAuthorityGranted:
              true,
          },
        } as unknown as EngineeringAIWorkforcePostLevelTwoScopeDecision;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoScopeDecision(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);