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
  createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-second-workstream-evidence-plan-review-test-001",

    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_ONLY" as const,

    reason:
      "The canonical owner accepts only the deterministic concurrent-coordination safety evidence plan and permits preparation of a separate bounded execution-decision contract without granting execution authority.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .preparedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce post-Level-Two second-workstream evidence-plan owner review",
  () => {
    it(
      "accepts only the plan and authorizes only separate decision preparation",
      () => {
        const record =
          createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
            approvalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_DECISION_RECORDED",

          decision:
            "APPROVE_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_ONLY",

          evidencePlanAccepted:
            true,

          concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized:
            true,

          concurrentCoordinationEvidenceExecutionAuthorized:
            false,

          consequentialAuthorityGranted:
            false,

          nextStep:
            "AWAIT_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION",
        });
      },
    );

    it(
      "reviews the exact eight-control canonical safety plan",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

        expect(record.reviewedPlan).toEqual({
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

          sourceNextStep:
            "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
        });
      },
    );

    it(
      "preserves every consequential authority block",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized:
            true,

          concurrentCoordinationEvidenceExecutionAuthorized:
            false,

          concurrentExecutionAuthorized:
            false,

          taskExecutionAuthorized:
            false,

          thirdTaskExecutionAuthorized:
            false,

          levelThreeEvaluationAuthorized:
            false,

          levelThreeAuthorityGranted:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          publicLaunchAuthorized:
            false,

          founderLiberationAchieved:
            false,

          monitoringRequired:
            true,

          emergencyPauseRequired:
            true,

          rollbackEvidenceRequired:
            true,

          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "supports fail-closed rejection without downstream preparation authority",
      () => {
        const rejected =
          createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision({
            ...approvalInput(),

            decisionId:
              "engineering-second-workstream-evidence-plan-review-rejection-001",

            decision:
              "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW",

            reason:
              "The owner rejects the current evidence plan and retains the bounded review state until revised deterministic coordination safety evidence is available.",
          });

        expect(rejected).toMatchObject({
          evidencePlanAccepted:
            false,

          concurrentCoordinationEvidenceExecutionDecisionPreparationAuthorized:
            false,

          concurrentCoordinationEvidenceExecutionAuthorized:
            false,

          nextStep:
            "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW",
        });
      },
    );

    it(
      "rejects a non-owner decision",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision({
              ...approvalInput(),

              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "Only the canonical NEXUS owner",
        );
      },
    );

    it(
      "rejects tampered preparation and review before preparation time",
      () => {
        const tamperedPreparation = {
          ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,

          preparationDigest:
            "0".repeat(64),
        } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision({
              ...approvalInput(),

              sourcePreparation:
                tamperedPreparation,
            }),
        ).toThrow();

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
                      .preparedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede preparation",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and detects tampering",
      () => {
        const first =
          createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
            approvalInput(),
          );

        expect(second).toEqual(first);

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.reviewedPlan,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
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
          EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid owner approval while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanReviewDecision(
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