import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation";

function canonicalInput() {
  return {
    preparationId:
      "engineering-concurrent-coordination-execution-decision-preparation-test-001",

    sourceEvidencePlanReviewDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,

    sourceEvidencePlanPreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,

    preparedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering concurrent-coordination evidence execution-decision preparation",
  () => {
    it(
      "prepares exactly eight owner decisions without authorizing execution",
      () => {
        const record =
          createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
            canonicalInput(),
          );

        expect(record).toMatchObject({
          preparationState:
            "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION_RECORDED",

          workstreamSequence:
            2,

          workstreamId:
            "controlled-concurrent-coordination-evidence",

          evidenceClass:
            "CONCURRENT_COORDINATION_SAFETY_EVIDENCE",

          decisionPreparationOnly:
            true,

          evidenceDecisionPreparationCount:
            8,

          ownerExecutionDecisionReviewRequired:
            true,

          ownerExecutionDecisionReviewRecorded:
            false,

          nextStep:
            "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_REVIEW",
        });

        expect(
          record.evidenceDecisionPreparations,
        ).toHaveLength(8);
      },
    );

    it(
      "binds the canonical approved evidence plan",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

        expect(
          record.sourceEvidencePlanReviewDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          record.sourceEvidencePlanPreparationDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .preparationDigest,
        );
      },
    );

    it(
      "maps all eight safety controls exactly once",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

        expect(
          record.evidenceDecisionPreparations.map(
            (item) =>
              item.controlId,
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .evidenceItems.map(
              (item) =>
                item.controlId,
            ),
        );

        expect(
          new Set(
            record.evidenceDecisionPreparations.map(
              (item) =>
                item.controlId,
            ),
          ).size,
        ).toBe(8);
      },
    );

    it(
      "keeps every evidence execution decision pending and fail-closed",
      () => {
        for (
          const item of
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION
            .evidenceDecisionPreparations
        ) {
          expect(item).toMatchObject({
            executionMode:
              "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",

            evidenceToolMode:
              "READ_ONLY_EVIDENCE_ONLY",

            maximumEvidenceExecutionCount:
              1,

            concurrentExecutionLimit:
              0,

            ownerExecutionDecisionRequired:
              true,

            ownerExecutionDecisionRecorded:
              false,

            ownerReviewAfterExecutionRequired:
              true,

            evidenceExecutionAuthorized:
              false,

            evidenceExecutionPerformed:
              false,

            concurrentEngineeringWorkAuthorized:
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
            item.decisionPreparationDigest,
          ).toMatch(
            /^[0-9a-f]{64}$/,
          );
        }
      },
    );

    it(
      "records zero execution authority and zero concurrency",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

        expect(record.summary).toMatchObject({
          evidenceDecisionPreparationCount:
            8,

          ownerExecutionDecisionRequiredCount:
            8,

          ownerExecutionDecisionRecordedCount:
            0,

          evidenceExecutionAuthorizedCount:
            0,

          evidenceExecutionPerformedCount:
            0,

          concurrentEngineeringWorkAuthorizedCount:
            0,

          repositoryReadAuthorizedCount:
            0,

          repositoryWriteAuthorizedCount:
            0,
        });

        expect(record.authorityBoundary).toMatchObject({
          concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized:
            true,

          concurrentCoordinationEvidenceExecutionAuthorized:
            false,

          concurrentCoordinationEvidenceExecutionPerformed:
            false,

          oneAtATimeEvidenceExecutionRequired:
            true,

          aggregateConcurrentExecutionLimit:
            0,

          concurrentEngineeringWorkAuthorized:
            false,

          levelThreeAuthorityGranted:
            false,

          founderLiberationAchieved:
            false,

          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "rejects tampered sources and preparation before owner approval",
      () => {
        const tamperedReview = {
          ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,

          decisionDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation({
              ...canonicalInput(),

              sourceEvidencePlanReviewDecision:
                tamperedReview,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation({
              ...canonicalInput(),

              preparedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede owner evidence-plan approval",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and detects tampering",
      () => {
        const first =
          createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
            canonicalInput(),
          );

        const second =
          createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
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
            first.evidenceDecisionPreparations,
          ),
        ).toBe(true);

        expect(
          first.evidenceDecisionPreparations.every(
            (item) =>
              Object.isFrozen(item),
          ),
        ).toBe(true);

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            concurrentEngineeringWorkAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid preparation while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation(
              record,
            ),
        ).not.toThrow();

        expect(
          record.authorityBoundary
            .concurrentEngineeringWorkAuthorized,
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