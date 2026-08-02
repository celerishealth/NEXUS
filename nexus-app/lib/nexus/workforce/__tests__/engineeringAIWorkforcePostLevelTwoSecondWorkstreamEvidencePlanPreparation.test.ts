import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_PROFILES,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
  type EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
} from "../engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation";

function canonicalInput() {
  return {
    preparationId:
      "engineering-second-workstream-evidence-plan-test-001",

    sourceWorkstreamPreparationReviewDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION,

    sourcePriorWorkstreamClosureDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION,

    preparedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce post-Level-Two second-workstream evidence-plan preparation",
  () => {
    it(
      "prepares exactly eight deterministic concurrent-coordination safety controls",
      () => {
        const record =
          createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          preparationState:
            "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARED",

          workstreamSequence:
            2,

          workstreamId:
            "controlled-concurrent-coordination-evidence",

          evidenceClass:
            "CONCURRENT_COORDINATION_SAFETY_EVIDENCE",

          planOnly:
            true,

          evidenceItemCount:
            8,

          ownerEvidencePlanReviewRequired:
            true,

          ownerEvidencePlanReviewRecorded:
            false,

          nextStep:
            "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
        });

        expect(
          record.evidenceItems,
        ).toHaveLength(8);
      },
    );

    it(
      "binds the canonical workstream preparation review and prior closure",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          record.sourceWorkstreamPreparationReviewDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION
            .decisionId,
        );

        expect(
          record.sourceWorkstreamPreparationReviewDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          record.sourcePriorWorkstreamClosureDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION
            .decisionId,
        );

        expect(
          record.sourcePriorWorkstreamClosureDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION
            .decisionDigest,
        );
      },
    );

    it(
      "covers all eight required coordination safety profiles exactly once",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          record.evidenceItems.map(
            (item) =>
              item.controlId,
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_PROFILES.map(
            (profile) =>
              profile.controlId,
          ),
        );

        expect(
          new Set(
            record.evidenceItems.map(
              (item) =>
                item.controlId,
            ),
          ).size,
        ).toBe(8);
      },
    );

    it(
      "keeps every evidence item plan-only fail-closed and owner-reviewed",
      () => {
        for (
          const item of
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .evidenceItems
        ) {
          expect(item).toMatchObject({
            dataClassification:
              "SYNTHETIC_SANITIZED_ONLY",

            outputMode:
              "PLAN_ONLY",

            evidenceToolMode:
              "READ_ONLY_EVIDENCE_ONLY",

            deterministicEvidenceRequired:
              true,

            independentValidationRequired:
              true,

            ownerReviewRequired:
              true,

            monitoringRequired:
              true,

            emergencyPauseRequired:
              true,

            rollbackEvidenceRequired:
              true,

            taskExecutionAuthorized:
              false,

            concurrentExecutionAuthorized:
              false,

            repositoryReadAuthorized:
              false,

            repositoryWriteAuthorized:
              false,

            productionDeploymentAuthorized:
              false,

            publicLaunchAuthorized:
              false,
          });

          expect(
            item.evidenceItemDigest,
          ).toMatch(
            /^[0-9a-f]{64}$/,
          );
        }
      },
    );

    it(
      "records complete plan evidence without authorizing concurrent execution",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(record.summary).toMatchObject({
          evidenceItemCount:
            8,

          syntheticSanitizedEvidenceItemCount:
            8,

          deterministicEvidenceRequiredCount:
            8,

          independentValidationRequiredCount:
            8,

          ownerReviewRequiredCount:
            8,

          monitoringRequiredCount:
            8,

          emergencyPauseRequiredCount:
            8,

          rollbackEvidenceRequiredCount:
            8,

          taskExecutionAuthorizedCount:
            0,

          concurrentExecutionAuthorizedCount:
            0,

          repositoryReadAuthorizedCount:
            0,

          repositoryWriteAuthorizedCount:
            0,
        });

        expect(record.authorityBoundary).toMatchObject({
          concurrentCoordinationSafetyPlanningAuthorized:
            true,

          concurrentCoordinationSafetyEvidencePrepared:
            true,

          concurrentExecutionAuthorized:
            false,

          taskExecutionAuthorized:
            false,

          levelThreeAuthorityGranted:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          founderLiberationAchieved:
            false,

          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "rejects tampered source evidence and preparation before prior closure",
      () => {
        const tamperedClosure = {
          ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION;

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation({
              ...canonicalInput(),

              sourcePriorWorkstreamClosureDecision:
                tamperedClosure,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation({
              ...canonicalInput(),

              preparedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede prior-workstream closure",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
            canonicalInput(),
          );

        expect(second).toEqual(first);

        expect(
          first.preparationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceItems,
          ),
        ).toBe(true);

        expect(
          first.evidenceItems.every(
            (item) =>
              Object.isFrozen(item),
          ),
        ).toBe(true);

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            concurrentExecutionAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid plan while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
              record,
            ),
        ).not.toThrow();

        expect(
          record.authorityBoundary
            .concurrentExecutionAuthorized,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .levelThreeAuthorityGranted,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .founderLiberationAchieved,
        ).toBe(false);
      },
      120_000,
    );
  },
);