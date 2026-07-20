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
  validateRevenueGrowthWorkforceExpansionDecision,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION,
  REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_RECORD_VERSION,
} from "../revenueGrowthWorkforceExpansionApprovalRecord";

describe(
  "Revenue Growth Workforce expansion approval record",
  () => {
    it(
      "records the explicit verified-owner approval",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION;

        expect(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-revenue-growth-workforce-expansion-approval-record-v1",
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
        );

        expect(
          decision.ownerId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.expansionPlanApproved,
        ).toBe(true);

        expect(
          decision.rosterExpansionPreparationEligible,
        ).toBe(true);
      },
    );

    it(
      "binds the approval to the exact immutable source plan",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION;

        expect(
          decision.sourcePlanningId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
            .planningId,
        );

        expect(
          decision.sourcePlanningDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
            .planningDigest,
        );

        expect(
          decision.sourceRosterDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
            .sourceRosterDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
              .preparedAt,
          ),
        );
      },
    );

    it(
      "makes exactly nine candidates eligible for preparation only",
      () => {
        const candidates =
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION
            .candidateExpansionEligibility;

        expect(candidates).toHaveLength(9);

        expect(
          candidates.every(
            (candidate) =>
              candidate.rosterExpansionPreparationEligible ===
                true &&
              candidate.rosterAdmissionAuthorized ===
                false &&
              candidate.factoryAdmissionAuthorized ===
                false &&
              candidate.templatePreparationAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.ownerQualificationApprovalRecorded ===
                false &&
              candidate.activationCandidatePreparationAuthorized ===
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
      "retains all consequential and external authority blocks",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          ownerDecisionRecorded:
            true,
          ownerIdentityBound:
            true,
          sourcePlanningBound:
            true,
          approvalBypassAllowed:
            false,
          rosterExpansionPreparationEligible:
            true,
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
          contentDraftingAuthorityGranted:
            false,
          videoGenerationExecutionAuthorized:
            false,
          liveSocialPostingAuthorized:
            false,
          paidAdvertisingSpendAuthorized:
            false,
          customerMessagingAuthorized:
            false,
          customerDataAccessAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          productionExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          autonomousExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "records immutable digest-verified evidence",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION;

        expect(
          decision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(
            decision,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.candidateExpansionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceExpansionDecision(
            decision,
          ),
        ).not.toThrow();
      },
    );

    it(
      "advances only to controlled roster-expansion preparation",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION
            .nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_EXPANSION",
        );
      },
    );
  },
);
