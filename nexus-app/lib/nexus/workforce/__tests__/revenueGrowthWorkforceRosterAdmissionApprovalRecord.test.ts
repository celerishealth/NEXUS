import {
  describe,
  expect,
  it,
} from "vitest";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
} from "../revenueGrowthWorkforceRosterExpansionPreparation";

import {
  validateRevenueGrowthWorkforceRosterAdmissionDecision,
} from "../revenueGrowthWorkforceRosterAdmissionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION,
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_RECORD_VERSION,
} from "../revenueGrowthWorkforceRosterAdmissionApprovalRecord";

describe(
  "Revenue Growth Workforce roster-admission approval record",
  () => {
    it(
      "records the explicit verified-owner roster-admission approval",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION;

        expect(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-revenue-growth-workforce-roster-admission-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION",
        );

        expect(
          decision.rosterAdmissionApproved,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact preparation and source roster",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION;

        expect(
          decision.sourcePreparationId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION
            .preparationId,
        );

        expect(
          decision.sourcePreparationDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION
            .preparationDigest,
        );

        expect(
          decision.sourceRosterDigest,
        ).toBe(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .rosterDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION
              .preparedAt,
          ),
        );
      },
    );

    it(
      "authorizes admission for exactly nine planned candidates",
      () => {
        const candidates =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION
            .candidateRosterAdmissionEligibility;

        expect(candidates).toHaveLength(9);

        expect(
          candidates.every(
            (candidate) =>
              candidate.targetRosterStatus ===
                "PLANNED_CANDIDATE" &&
              candidate.rosterEntryPrepared ===
                true &&
              candidate.rosterAdmissionAuthorized ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not itself mutate the current master roster",
      () => {
        for (
          const candidate of
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION
            .candidateRosterAdmissionEligibility
        ) {
          expect(
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
              .entries.some(
                (entry) =>
                  entry.employeeId ===
                  candidate.employeeId,
              ),
          ).toBe(false);
        }
      },
    );

    it(
      "retains factory qualification activation and external blocks",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION;

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
          ownerQualificationApprovalRecorded:
            false,
          activationCandidatePreparationAuthorized:
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
      "records immutable digest-verified decision evidence",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION;

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
            decision.candidateRosterAdmissionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceRosterAdmissionDecision(
            decision,
          ),
        ).not.toThrow();

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_ROSTER_ADMISSION",
        );
      },
    );
  },
);
