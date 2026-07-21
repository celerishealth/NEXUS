import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "./revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
} from "./revenueGrowthWorkforceRosterAdmissionExecution";

import {
  createRevenueGrowthWorkforceFactoryAdmissionDecision,
} from "./revenueGrowthWorkforceFactoryAdmissionDecision";

export const REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_RECORD_VERSION =
  "nexus-revenue-growth-workforce-factory-admission-approval-record-v1" as const;

export const REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION =
  createRevenueGrowthWorkforceFactoryAdmissionDecision({
    rosterAdmissionExecution:
      REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
    decisionId:
      "revenue-growth-workforce-factory-admission-owner-approval-001",
    ownerId:
      REVENUE_GROWTH_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION",
    reason:
      "Owner approved admission of the nine roster-admitted revenue-growth candidates into the controlled AI employee factory at the planned-candidate lifecycle state only.",
    decidedAt:
      "2026-07-21T02:00:52.500Z",
  });
