import {
  describe,
  expect,
  it,
} from "vitest";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

import {
  EXISTING_REVENUE_WORKFORCE_ROLES,
  PROPOSED_REVENUE_GROWTH_SPECIALISTS,
  REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
  createRevenueGrowthWorkforceExpansionPlan,
  validateRevenueGrowthWorkforceExpansionPlan,
} from "../revenueGrowthWorkforceExpansionPlan";

describe(
  "Revenue Growth Workforce expansion plan",
  () => {
    it(
      "preserves all eight existing sales and marketing roles",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
            .existingRevenueEmployeeCount,
        ).toBe(8);

        expect(
          EXISTING_REVENUE_WORKFORCE_ROLES,
        ).toHaveLength(8);

        expect(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
            .sourceRosterDigest,
        ).toBe(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .rosterDigest,
        );
      },
    );

    it(
      "proposes nine dedicated revenue-growth super-specialists",
      () => {
        const plan =
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN;

        expect(
          plan.proposedCandidateCount,
        ).toBe(9);

        expect(
          plan.proposedCandidates.map(
            (candidate) =>
              candidate.officialRole,
          ),
        ).toEqual(
          PROPOSED_REVENUE_GROWTH_SPECIALISTS.map(
            (candidate) =>
              candidate.officialRole,
          ),
        );

        expect(
          plan.capabilitiesCovered,
        ).toContain(
          "VIDEO_PRODUCTION_DIRECTION",
        );

        expect(
          plan.capabilitiesCovered,
        ).toContain(
          "SOCIAL_MEDIA_DISTRIBUTION_AND_COMMUNITY",
        );

        expect(
          plan.capabilitiesCovered,
        ).toContain(
          "SEO_AND_ORGANIC_GROWTH",
        );

        expect(
          plan.capabilitiesCovered,
        ).toContain(
          "PERFORMANCE_MARKETING_AND_PAID_MEDIA",
        );
      },
    );

    it(
      "prevents identity collisions with the existing roster",
      () => {
        const existingIds =
          new Set(
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
              .entries.map(
                (entry) =>
                  entry.employeeId,
              ),
          );

        const existingCodes =
          new Set(
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
              .entries.map(
                (entry) =>
                  entry.employeeCode,
              ),
          );

        for (
          const candidate of
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
            .proposedCandidates
        ) {
          expect(
            existingIds.has(
              candidate.employeeId,
            ),
          ).toBe(false);

          expect(
            existingCodes.has(
              candidate.employeeCode,
            ),
          ).toBe(false);
        }
      },
    );

    it(
      "keeps every proposed specialist unqualified and authority-blocked",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN
            .proposedCandidates.every(
              (candidate) =>
                candidate.qualificationRequired ===
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
                candidate.liveSocialPostingAuthorized ===
                  false &&
                candidate.paidAdvertisingSpendAuthorized ===
                  false &&
                candidate.customerMessagingAuthorized ===
                  false &&
                candidate.controlledWorkAuthorized ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "requires owner expansion approval without mutating the roster",
      () => {
        const plan =
          REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN;

        expect(
          plan.ownerExpansionDecisionRequired,
        ).toBe(true);

        expect(
          plan.ownerExpansionDecisionRecorded,
        ).toBe(false);

        expect(
          plan.authorityBoundary
            .sourceRosterPreserved,
        ).toBe(true);

        expect(
          plan.authorityBoundary
            .rosterMutationAuthorized,
        ).toBe(false);

        expect(
          plan.nextStep,
        ).toBe(
          "AWAIT_OWNER_REVENUE_GROWTH_ROSTER_EXPANSION_DECISION",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound evidence",
      () => {
        const input = {
          planningId:
            "revenue-growth-workforce-expansion-plan-v1",
          sourceRoster:
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
          preparedAt:
            "2026-07-20T17:30:00.000Z",
        } as const;

        const first =
          createRevenueGrowthWorkforceExpansionPlan(
            input,
          );

        const second =
          createRevenueGrowthWorkforceExpansionPlan(
            input,
          );

        expect(first).toEqual(second);

        expect(
          first.planningDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          first.planningDigest,
        ).toBe(
          second.planningDigest,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.proposedCandidates,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceExpansionPlan(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
