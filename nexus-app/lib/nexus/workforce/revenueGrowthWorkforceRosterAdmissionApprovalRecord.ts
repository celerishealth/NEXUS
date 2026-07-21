import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "./revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
} from "./revenueGrowthWorkforceRosterExpansionPreparation";

import {
  createRevenueGrowthWorkforceRosterAdmissionDecision,
} from "./revenueGrowthWorkforceRosterAdmissionDecision";

export const REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_RECORD_VERSION =
  "nexus-revenue-growth-workforce-roster-admission-approval-record-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_APPROVAL_DECISION =
  createRevenueGrowthWorkforceRosterAdmissionDecision({
    preparation:
      REVENUE_GROWTH_WORKFORCE_ROSTER_EXPANSION_PREPARATION,
    decisionId:
      "revenue-growth-workforce-roster-admission-owner-approval-001",
    ownerId:
      REVENUE_GROWTH_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION",
    reason:
      "Owner approved append-only admission of the nine prepared revenue-growth specialists as unqualified and activation-blocked planned roster candidates only.",
    decidedAt:
      "2026-07-21T01:31:17.797Z",
  });
