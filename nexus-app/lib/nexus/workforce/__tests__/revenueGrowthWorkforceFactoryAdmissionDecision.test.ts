import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
} from "../revenueGrowthWorkforceRosterAdmissionExecution";

import {
  createRevenueGrowthWorkforceFactoryAdmissionDecision,
  validateRevenueGrowthWorkforceFactoryAdmissionDecision,
} from "../revenueGrowthWorkforceFactoryAdmissionDecision";

const DECIDED_AT =
  new Date(
    Date.parse(
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
        .executedAt,
    ) + 1000,
  ).toISOString();

function createApproval() {
  return createRevenueGrowthWorkforceFactoryAdmissionDecision({
    rosterAdmissionExecution:
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
    decisionId:
      "revenue-growth-workforce-factory-admission-decision-001",
    ownerId:
      REVENUE_GROWTH_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION",
    reason:
      "Approve admission of the nine roster-admitted revenue-growth candidates into the controlled AI employee factory at the planned-candidate lifecycle state only.",
    decidedAt:
      DECIDED_AT,
  });
}

describe(
  "Revenue Growth Workforce factory-admission decision",
  () => {
    it(
      "supports bounded owner approval of factory admission",
      () => {
        const decision =
          createApproval();

        expect(
          decision.factoryAdmissionApproved,
        ).toBe(true);

        expect(
          decision.candidateFactoryAdmissionEligibility,
        ).toHaveLength(9);

        expect(
          decision.candidateFactoryAdmissionEligibility.every(
            (candidate) =>
              candidate.factoryAdmissionAuthorized ===
                true &&
              candidate.targetFactoryLifecycleState ===
                "PLANNED_CANDIDATE",
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION",
        );
      },
    );

    it(
      "supports rejection without factory-record authority",
      () => {
        const decision =
          createRevenueGrowthWorkforceFactoryAdmissionDecision({
            rosterAdmissionExecution:
              REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
            decisionId:
              "revenue-growth-workforce-factory-admission-rejection-001",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_REVENUE_GROWTH_ROSTER_ADMISSION_ONLY",
            reason:
              "Reject factory admission and retain the nine candidates solely in the activation-blocked admitted roster.",
            decidedAt:
              DECIDED_AT,
          });

        expect(
          decision.factoryAdmissionApproved,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .factoryAdmissionAuthorized,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .factoryRecordCreationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "fails closed for an unverified owner",
      () => {
        expect(() =>
          createRevenueGrowthWorkforceFactoryAdmissionDecision({
            rosterAdmissionExecution:
              REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
            decisionId:
              "revenue-growth-workforce-factory-admission-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION",
            reason:
              "Attempt factory admission using an identity that is not the verified NEXUS owner identity.",
            decidedAt:
              DECIDED_AT,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "rejects a decision that predates roster admission",
      () => {
        const invalidTime =
          new Date(
            Date.parse(
              REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
                .executedAt,
            ) - 1,
          ).toISOString();

        expect(() =>
          createRevenueGrowthWorkforceFactoryAdmissionDecision({
            rosterAdmissionExecution:
              REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
            decisionId:
              "revenue-growth-workforce-factory-admission-early-001",
            ownerId:
              REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION",
            reason:
              "Attempt factory admission before the roster-admission execution evidence existed.",
            decidedAt:
              invalidTime,
          }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "keeps templates qualification activation and external authority blocked",
      () => {
        const decision =
          createApproval();

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          factoryAdmissionAuthorized:
            true,
          factoryRecordCreationAuthorized:
            true,
          initialLifecycleStateLocked:
            true,
          directTemplateBypassBlocked:
            true,
          directQualificationBypassBlocked:
            true,
          directActivationBypassBlocked:
            true,
          selfActivationBlocked:
            true,
          templatePreparationAuthorized:
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
      "creates deterministic immutable digest-bound evidence",
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
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateFactoryAdmissionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceFactoryAdmissionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
