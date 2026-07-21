import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
} from "../revenueGrowthWorkforceRosterExpansionPreparation";

import {
  createRevenueGrowthWorkforceRosterAdmissionDecision,
  validateRevenueGrowthWorkforceRosterAdmissionDecision,
} from "../revenueGrowthWorkforceRosterAdmissionDecision";

const DECIDED_AT =
  new Date(
    Date.parse(
      REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION
        .preparedAt,
    ) + 1000,
  ).toISOString();

function createApproval() {
  return createRevenueGrowthWorkforceRosterAdmissionDecision({
    preparation:
      REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
    decisionId:
      "revenue-growth-workforce-roster-admission-decision-001",
    ownerId:
      REVENUE_GROWTH_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION",
    reason:
      "Approve append-only admission of the nine prepared revenue-growth candidates as activation-blocked planned roster candidates only.",
    decidedAt:
      DECIDED_AT,
  });
}

describe(
  "Revenue Growth Workforce roster-admission decision",
  () => {
    it(
      "supports bounded owner approval of roster admission",
      () => {
        const decision =
          createApproval();

        expect(
          decision.rosterAdmissionApproved,
        ).toBe(true);

        expect(
          decision.candidateRosterAdmissionEligibility,
        ).toHaveLength(9);

        expect(
          decision.candidateRosterAdmissionEligibility.every(
            (candidate) =>
              candidate.rosterAdmissionAuthorized ===
              true,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION",
        );
      },
    );

    it(
      "supports rejection without roster mutation authority",
      () => {
        const decision =
          createRevenueGrowthWorkforceRosterAdmissionDecision({
            preparation:
              REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
            decisionId:
              "revenue-growth-workforce-roster-admission-rejection-001",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION",
            reason:
              "Reject roster admission and retain the prepared candidates without changing the current master roster.",
            decidedAt:
              DECIDED_AT,
          });

        expect(
          decision.rosterAdmissionApproved,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .rosterMutationAuthorized,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .rosterAdmissionAuthorized,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_REVENUE_GROWTH_ROSTER_EXPANSION_PREPARATION_ONLY",
        );
      },
    );

    it(
      "fails closed for an unverified owner identity",
      () => {
        expect(() =>
          createRevenueGrowthWorkforceRosterAdmissionDecision({
            preparation:
              REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
            decisionId:
              "revenue-growth-workforce-roster-admission-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION",
            reason:
              "Attempt roster admission using an identity that is not the verified NEXUS owner identity.",
            decidedAt:
              DECIDED_AT,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "rejects a decision that predates preparation",
      () => {
        const invalidTime =
          new Date(
            Date.parse(
              REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION
                .preparedAt,
            ) - 1,
          ).toISOString();

        expect(() =>
          createRevenueGrowthWorkforceRosterAdmissionDecision({
            preparation:
              REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
            decisionId:
              "revenue-growth-workforce-roster-admission-early-001",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION",
            reason:
              "Attempt a roster-admission approval before the roster-expansion preparation evidence existed.",
            decidedAt:
              invalidTime,
          }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "keeps factory qualification activation and external authority blocked",
      () => {
        const decision =
          createApproval();

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          rosterMutationAuthorized:
            true,
          rosterAdmissionAuthorized:
            true,
          postAdmissionRosterValidationRequired:
            true,
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

        expect(
          decision.candidateRosterAdmissionEligibility.every(
            (candidate) =>
              candidate.factoryAdmissionAuthorized ===
                false &&
              candidate.templatePreparationAuthorized ===
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
      },
    );

    it(
      "creates deterministic immutable digest-bound decision evidence",
      () => {
        const first =
          createApproval();

        const second =
          createApproval();

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
            first.candidateRosterAdmissionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceRosterAdmissionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
