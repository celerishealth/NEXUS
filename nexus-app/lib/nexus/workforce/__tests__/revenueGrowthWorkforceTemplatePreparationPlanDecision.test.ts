import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../revenueGrowthWorkforceTemplatePreparationPlan";

import {
  createRevenueGrowthWorkforceTemplatePreparationPlanDecision,
  validateRevenueGrowthWorkforceTemplatePreparationPlanDecision,
} from "../revenueGrowthWorkforceTemplatePreparationPlanDecision";

const decidedAt =
  "2026-07-21T04:30:00.000Z";

function createDecision(
  decision:
    | "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN"
    | "REJECT_AND_RETAIN_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY",
) {
  return createRevenueGrowthWorkforceTemplatePreparationPlanDecision({
    templatePreparationPlan:
      REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
    decisionId:
      "revenue-growth-template-preparation-plan-decision-test-001",
    ownerId:
      REVENUE_GROWTH_WORKFORCE_OWNER_ID,
    decision,
    reason:
      "Owner reviewed the exact source-bound planning evidence and recorded a bounded decision.",
    decidedAt,
  });
}

describe(
  "Revenue Growth Workforce template-preparation plan decision",
  () => {
    it(
      "approves registry-expansion preparation for exactly nine candidates",
      () => {
        const decision =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        expect(
          decision.templatePreparationPlanApproved,
        ).toBe(true);

        expect(
          decision.registryExpansionPreparationEligible,
        ).toBe(true);

        expect(
          decision.candidateRegistryExpansionEligibility,
        ).toHaveLength(9);

        expect(
          decision.candidateRegistryExpansionEligibility.every(
            (candidate) =>
              candidate.registryExpansionPreparationEligible ===
                true,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION",
        );
      },
    );

    it(
      "rejects without creating any downstream authority",
      () => {
        const decision =
          createDecision(
            "REJECT_AND_RETAIN_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY",
          );

        expect(
          decision.templatePreparationPlanApproved,
        ).toBe(false);

        expect(
          decision.registryExpansionPreparationEligible,
        ).toBe(false);

        expect(
          decision.candidateRegistryExpansionEligibility.every(
            (candidate) =>
              candidate.registryExpansionPreparationEligible ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY",
        );
      },
    );

    it(
      "binds the decision to the exact template-preparation plan",
      () => {
        const decision =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        expect(
          decision.sourcePlanningId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningId,
        );

        expect(
          decision.sourcePlanningDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningDigest,
        );

        expect(
          decision.reviewedPlan.proposedLaunchSequences,
        ).toEqual([
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
        ]);
      },
    );

    it(
      "fails closed for an invalid owner identity",
      () => {
        expect(() =>
          createRevenueGrowthWorkforceTemplatePreparationPlanDecision({
            templatePreparationPlan:
              REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
            decisionId:
              "revenue-growth-template-preparation-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as unknown as
                typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
            reason:
              "An invalid owner must never authorize registry-expansion preparation.",
            decidedAt,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "keeps registry mutation templates qualification activation and external authority blocked",
      () => {
        const decision =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          skillRegistryExpansionPreparationAuthorized:
            true,
          toolRegistryExpansionPreparationAuthorized:
            true,
          skillRegistryMutationAuthorized:
            false,
          toolRegistryMutationAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          templateCreationAuthorized:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerQualificationApproved:
            false,
          ownerActivationApproved:
            false,
          runtimeAuthorized:
            false,
          liveSocialPostingAuthorized:
            false,
          paidAdvertisingSpendAuthorized:
            false,
          customerMessagingAuthorized:
            false,
          productionExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable digest-verified decision evidence",
      () => {
        const first =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        const second =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
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
            first.candidateRegistryExpansionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceTemplatePreparationPlanDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
