import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAMS,
  createEngineeringAIWorkforcePostLevelTwoScopeDefinition,
  validateEngineeringAIWorkforcePostLevelTwoScopeDefinition,
  type EngineeringAIWorkforcePostLevelTwoScopeDefinition,
} from "../engineeringAIWorkforcePostLevelTwoScopeDefinition";

describe(
  "Engineering AI Workforce post-Level-2 scope definition",
  () => {
    it(
      "binds only to the accepted canonical Level-2 owner-review decision",
      () => {
        const scope =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;
        const source =
          ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION;

        expect(scope.sourceDecisionId).toBe(
          source.decisionId,
        );
        expect(scope.sourceDecisionDigest).toBe(
          source.decisionDigest,
        );
        expect(scope.tenantId).toBe(
          source.tenantId,
        );
        expect(scope.ownerId).toBe(
          source.ownerId,
        );
        expect(
          scope.sourceLevelTwoEvidenceAccepted,
        ).toBe(true);
        expect(
          scope.sourceAdditionalAuthorityGranted,
        ).toBe(false);
      },
    );

    it(
      "defines exactly four bounded post-Level-2 evidence workstreams",
      () => {
        const scope =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

        expect(scope.scopeDefinitionOnly).toBe(
          true,
        );
        expect(scope.workstreamCount).toBe(4);
        expect(scope.workstreams).toEqual(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAMS,
        );
        expect(
          scope.workstreams.map(
            (workstream) =>
              workstream.sequence,
          ),
        ).toEqual([1, 2, 3, 4]);
      },
    );

    it(
      "requires a separate owner scope decision before any additional work",
      () => {
        const scope =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

        expect(
          scope.ownerScopeDecisionRequired,
        ).toBe(true);
        expect(
          scope.ownerScopeDecisionRecorded,
        ).toBe(false);
        expect(scope.nextStep).toBe(
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SCOPE_DECISION",
        );
      },
    );

    it(
      "preserves every execution repository production customer payment and launch block",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION
            .authorityBoundary,
        ).toMatchObject({
          definitionOnly: true,
          levelThreeAuthorityGranted: false,
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
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION
            .authorityBoundary;

        expect(
          boundary.founderLiberationAchieved,
        ).toBe(false);
        expect(
          boundary.founderReleasedFromRoutineExecution,
        ).toBe(false);
        expect(
          boundary.ownerFinalAuthorityPreserved,
        ).toBe(true);
        expect(
          boundary.monitoringRequired,
        ).toBe(true);
        expect(
          boundary.emergencyPauseRequired,
        ).toBe(true);
        expect(
          boundary.rollbackEvidenceRequired,
        ).toBe(true);
      },
    );

    it(
      "creates deterministic immutable digest-bound scope evidence",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

        const recreated =
          createEngineeringAIWorkforcePostLevelTwoScopeDefinition({
            scopeId:
              source.scopeId,
            preparedAt:
              source.preparedAt,
          });

        expect(recreated).toEqual(source);
        expect(source.scopeDigest).toMatch(
          /^[0-9a-f]{64}$/,
        );
        expect(Object.isFrozen(source)).toBe(
          true,
        );
        expect(
          Object.isFrozen(
            source.workstreams,
          ),
        ).toBe(true);
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoScopeDefinition(
            source,
          ),
        ).not.toThrow();
      },
    );

    it(
      "fails closed when additional authority is injected",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

        const tampered = {
          ...source,
          authorityBoundary: {
            ...source.authorityBoundary,
            levelThreeAuthorityGranted:
              true,
          },
        } as unknown as EngineeringAIWorkforcePostLevelTwoScopeDefinition;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoScopeDefinition(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);