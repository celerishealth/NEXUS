import {
  describe,
  expect,
  it,
} from "vitest";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

import {
  REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION,
} from "../revenueGrowthWorkforceExpansionApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
  createRevenueGrowthWorkforceRosterExpansionPreparation,
  validateRevenueGrowthWorkforceRosterExpansionPreparation,
} from "../revenueGrowthWorkforceRosterExpansionPreparation";

describe(
  "Revenue Growth Workforce roster-expansion preparation",
  () => {
    it(
      "prepares exactly nine append-only planned roster candidates",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION;

        expect(
          preparation.candidateCount,
        ).toBe(9);

        expect(
          preparation.preparedCandidates,
        ).toHaveLength(9);

        expect(
          preparation.preparedCandidates.every(
            (candidate) =>
              candidate.rosterEntryPrepared ===
                true &&
              candidate.targetRosterStatus ===
                "PLANNED_CANDIDATE" &&
              candidate.priorityTier ===
                "REVENUE_READINESS_PRIORITY",
          ),
        ).toBe(true);
      },
    );

    it(
      "binds preparation to the exact owner approval and source roster",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION;

        expect(
          preparation.sourceDecisionId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION
            .decisionId,
        );

        expect(
          preparation.sourceDecisionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          preparation.sourceRosterDigest,
        ).toBe(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .rosterDigest,
        );
      },
    );

    it(
      "preserves the immutable master roster without admitting candidates",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION;

        expect(
          preparation.sourceRosterPreserved,
        ).toBe(true);

        expect(
          preparation.authorityBoundary
            .rosterMutationAuthorized,
        ).toBe(false);

        expect(
          preparation.authorityBoundary
            .rosterAdmissionAuthorized,
        ).toBe(false);

        for (
          const candidate of
          preparation.preparedCandidates
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
      "keeps qualification activation and external authority blocked",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION;

        expect(
          preparation.preparedCandidates.every(
            (candidate) =>
              candidate.qualificationRequired ===
                true &&
              candidate.activationAuthorized ===
                false &&
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

        expect(
          preparation.authorityBoundary,
        ).toMatchObject({
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
      "requires a separate owner roster-admission decision",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION;

        expect(
          preparation.ownerRosterAdmissionDecisionRequired,
        ).toBe(true);

        expect(
          preparation.ownerRosterAdmissionDecisionRecorded,
        ).toBe(false);

        expect(
          preparation.nextStep,
        ).toBe(
          "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_ADMISSION_DECISION",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound preparation evidence",
      () => {
        const source =
          REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION;

        const input = {
          preparationId:
            source.preparationId,
          approvalDecision:
            REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION,
          sourceRoster:
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
          preparedAt:
            source.preparedAt,
        } as const;

        const first =
          createRevenueGrowthWorkforceRosterExpansionPreparation(
            input,
          );

        const second =
          createRevenueGrowthWorkforceRosterExpansionPreparation(
            input,
          );

        expect(first).toEqual(second);

        expect(
          first.preparationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          first.preparationDigest,
        ).toBe(
          second.preparationDigest,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.preparedCandidates,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceRosterExpansionPreparation(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
