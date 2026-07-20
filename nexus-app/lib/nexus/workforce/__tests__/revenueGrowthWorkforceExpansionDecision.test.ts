import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
} from "../revenueGrowthWorkforceExpansionPlan";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
  createRevenueGrowthWorkforceExpansionDecision,
  validateRevenueGrowthWorkforceExpansionDecision,
} from "../revenueGrowthWorkforceExpansionDecision";

const APPROVAL_REASON =
  "Approve controlled preparation of the nine planned revenue-growth roster candidates without granting qualification, activation, posting, spending, messaging, production, or public-launch authority.";

describe(
  "Revenue Growth Workforce expansion decision",
  () => {
    it(
      "records owner approval as preparation eligibility only",
      () => {
        const decision =
          createRevenueGrowthWorkforceExpansionDecision({
            expansionPlan:
              REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
            decisionId:
              "revenue-growth-expansion-decision-001",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              "2026-07-20T18:00:00.000Z",
          });

        expect(
          decision.expansionPlanApproved,
        ).toBe(true);

        expect(
          decision.rosterExpansionPreparationEligible,
        ).toBe(true);

        expect(
          decision.candidateExpansionEligibility.every(
            (candidate) =>
              candidate.rosterExpansionPreparationEligible ===
                true &&
              candidate.rosterAdmissionAuthorized ===
                false &&
              candidate.factoryAdmissionAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.ownerActivationAuthorized ===
                false &&
              candidate.runtimeActivationAuthorized ===
                false &&
              candidate.controlledWorkAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION",
        );
      },
    );

    it(
      "records rejection without preparation eligibility",
      () => {
        const decision =
          createRevenueGrowthWorkforceExpansionDecision({
            expansionPlan:
              REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
            decisionId:
              "revenue-growth-expansion-decision-002",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING",
            reason:
              "Retain the expansion plan without permitting roster preparation at this time.",
            decidedAt:
              "2026-07-20T18:01:00.000Z",
          });

        expect(
          decision.expansionPlanApproved,
        ).toBe(false);

        expect(
          decision.rosterExpansionPreparationEligible,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLANNING_ONLY",
        );
      },
    );

    it(
      "blocks any owner identity other than the verified NEXUS owner",
      () => {
        expect(() =>
          createRevenueGrowthWorkforceExpansionDecision({
            expansionPlan:
              REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
            decisionId:
              "revenue-growth-expansion-decision-003",
            ownerId:
              "owner-attacker-001" as typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              "2026-07-20T18:02:00.000Z",
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "blocks decisions dated before the source expansion plan",
      () => {
        expect(() =>
          createRevenueGrowthWorkforceExpansionDecision({
            expansionPlan:
              REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
            decisionId:
              "revenue-growth-expansion-decision-004",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              "2026-07-20T17:00:00.000Z",
          }),
        ).toThrow(
          "cannot precede expansion planning",
        );
      },
    );

    it(
      "keeps every consequential and external authority blocked",
      () => {
        const decision =
          createRevenueGrowthWorkforceExpansionDecision({
            expansionPlan:
              REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
            decisionId:
              "revenue-growth-expansion-decision-005",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              "2026-07-20T18:03:00.000Z",
          });

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          rosterMutationAuthorized:
            false,
          factoryAdmissionAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerActivationAuthorized:
            false,
          runtimeActivationAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          videoGenerationExecutionAuthorized:
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
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable digest-bound owner-decision evidence",
      () => {
        const input = {
          expansionPlan:
            REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
          decisionId:
            "revenue-growth-expansion-decision-006",
          ownerId:
            REVENUE_GROWTH_WORKFORCE_OWNER_ID,
          decision:
            "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
          reason:
            APPROVAL_REASON,
          decidedAt:
            "2026-07-20T18:04:00.000Z",
        } as const;

        const first =
          createRevenueGrowthWorkforceExpansionDecision(
            input,
          );

        const second =
          createRevenueGrowthWorkforceExpansionDecision(
            input,
          );

        expect(first).toEqual(second);

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          first.decisionDigest,
        ).toBe(
          second.decisionDigest,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateExpansionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceExpansionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
