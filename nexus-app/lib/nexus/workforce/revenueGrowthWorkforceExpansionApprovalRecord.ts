import {
  REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
} from "./revenueGrowthWorkforceExpansionPlan";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
  createRevenueGrowthWorkforceExpansionDecision,
} from "./revenueGrowthWorkforceExpansionDecision";

export const REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_RECORD_VERSION =
  "nexus-revenue-growth-workforce-expansion-approval-record-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_EXPANSION_APPROVAL_DECISION =
  createRevenueGrowthWorkforceExpansionDecision({
    expansionPlan:
      REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN,
    decisionId:
      "revenue-growth-workforce-expansion-owner-approval-001",
    ownerId:
      REVENUE_GROWTH_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_REVENUE_GROWTH_WORKFORCE_EXPANSION_PLAN",
    reason:
      "Owner approved controlled preparation of nine revenue-growth roster expansion candidates while retaining all qualification, activation, posting, spending, messaging, production, payment, and public-launch boundaries.",
    decidedAt:
      "2026-07-20T18:02:51.546Z",
  });
