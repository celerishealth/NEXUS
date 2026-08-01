import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoScopeApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
} from "../engineeringAIWorkforcePostLevelTwoScopeDefinition";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation,
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation,
  type EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparation";

describe(
  "Engineering AI Workforce post-Level-2 workstream preparation",
  () => {
    it(
      "binds preparation to the canonical owner approval and scope",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;
        const approval =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION;
        const scope =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

        expect(
          preparation.sourceApprovalDecisionId,
        ).toBe(approval.decisionId);
        expect(
          preparation.sourceApprovalDecisionDigest,
        ).toBe(approval.decisionDigest);
        expect(
          preparation.sourceScopeId,
        ).toBe(scope.scopeId);
        expect(
          preparation.sourceScopeDigest,
        ).toBe(scope.scopeDigest);
        expect(preparation.ownerId).toBe(
          approval.ownerId,
        );
      },
    );

    it(
      "prepares exactly four bounded evidence workstreams",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

        expect(
          preparation.workstreamCount,
        ).toBe(4);
        expect(
          preparation.preparedWorkstreams,
        ).toHaveLength(4);
        expect(
          preparation.preparedWorkstreams.map(
            (workstream) =>
              workstream.workstreamId,
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION
            .workstreams.map(
              (workstream) =>
                workstream.workstreamId,
            ),
        );
        expect(
          preparation.preparedWorkstreams.every(
            (workstream) =>
              workstream.preparationOnly ===
                true &&
              workstream
                .syntheticSanitizedEvidenceOnly ===
                true &&
              workstream
                .deterministicEvidenceRequired ===
                true &&
              workstream.ownerReviewRequired ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "records zero execution and repository authority",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

        expect(
          preparation.evidencePlanSummary,
        ).toMatchObject({
          preparedWorkstreamCount: 4,
          totalMaximumPlannedEvidenceItemCount:
            32,
          taskExecutionAuthorizedCount: 0,
          concurrentExecutionAuthorizedCount:
            0,
          repositoryReadAuthorizedCount: 0,
          repositoryWriteAuthorizedCount: 0,
        });

        expect(
          preparation.preparedWorkstreams.every(
            (workstream) =>
              workstream
                .taskExecutionAuthorized ===
                false &&
              workstream
                .concurrentExecutionAuthorized ===
                false &&
              workstream
                .repositoryReadAuthorized ===
                false &&
              workstream
                .repositoryWriteAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves production customer payment and launch blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
          preparationOnly: true,
          workstreamExecutionAuthorized:
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
          productionDatabaseAuthorized:
            false,
          productionMutationAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized: false,
          liveProviderExecutionAuthorized:
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
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION
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
      "requires owner review before any later step",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

        expect(
          preparation.ownerPreparationReviewRequired,
        ).toBe(true);
        expect(
          preparation.ownerPreparationReviewRecorded,
        ).toBe(false);
        expect(preparation.nextStep).toBe(
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound preparation evidence",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;
        const recreated =
          createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation({
            preparationId:
              source.preparationId,
            preparedAt:
              source.preparedAt,
          });

        expect(recreated).toEqual(source);
        expect(
          source.preparationDigest,
        ).toMatch(/^[0-9a-f]{64}$/);
        expect(Object.isFrozen(source)).toBe(
          true,
        );
        expect(
          Object.isFrozen(
            source.preparedWorkstreams,
          ),
        ).toBe(true);
        expect(
          source.preparedWorkstreams.every(
            (workstream) =>
              Object.isFrozen(workstream) &&
              /^[0-9a-f]{64}$/.test(
                workstream.workstreamDigest,
              ),
          ),
        ).toBe(true);
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
            source,
          ),
        ).not.toThrow();
      },
    );

    it(
      "fails closed when execution authority is injected",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;
        const tampered = {
          ...source,
          authorityBoundary: {
            ...source.authorityBoundary,
            secondTaskExecutionAuthorized:
              true,
          },
        } as unknown as EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);