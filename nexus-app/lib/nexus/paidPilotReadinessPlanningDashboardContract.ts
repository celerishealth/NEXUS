import { getPaidPilotReadinessPlanningCheckpoint } from "./paidPilotReadinessPlanningCheckpoint";

export type PaidPilotReadinessPlanningDashboardContractPanel = {
  id: string;
  title: string;
  status: "DEFINED" | "LOCKED" | "BLOCKED";
  dashboardPurpose: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningDashboardContract = {
  id: string;
  day: 155;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-dashboard-contract-preview-only";
  dependsOn: string;
  status: "DEFINED" | "BLOCKED";
  dashboardContractSummary: {
    planningCheckpointCleared: boolean;
    dashboardPlanningStarted: boolean;
    subscriptionLockPreviewOnly: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    result: "PAID_PILOT_DASHBOARD_CONTRACT_DEFINED" | "BLOCKED";
  };
  panels: PaidPilotReadinessPlanningDashboardContractPanel[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningDashboardContract(): PaidPilotReadinessPlanningDashboardContract {
  const checkpoint = getPaidPilotReadinessPlanningCheckpoint();

  const planningCheckpointCleared =
    checkpoint.status === "CLEARED" &&
    checkpoint.checkpointSummary.safeForNextPlanningStep;

  const defined = planningCheckpointCleared;

  return {
    id: "nexus-paid-pilot-readiness-planning-dashboard-contract-v1",
    day: 155,
    name: "NEXUS Paid Pilot Readiness Planning Dashboard Contract v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-dashboard-contract-preview-only",
    dependsOn: "Day 154 Paid Pilot Readiness Planning Checkpoint v1",
    status: defined ? "DEFINED" : "BLOCKED",
    dashboardContractSummary: {
      planningCheckpointCleared,
      dashboardPlanningStarted: defined,
      subscriptionLockPreviewOnly:
        checkpoint.checkpointSummary.subscriptionLockPlanningOnly,
      paymentExecutionBlocked:
        checkpoint.checkpointSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        checkpoint.checkpointSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        checkpoint.checkpointSummary.customerDataWritesBlocked,
      ownerControlPreserved:
        checkpoint.checkpointSummary.ownerControlPreserved,
      lockedVisionPreserved:
        checkpoint.checkpointSummary.lockedVisionPreserved,
      result: defined ? "PAID_PILOT_DASHBOARD_CONTRACT_DEFINED" : "BLOCKED",
    },
    panels: [
      {
        id: "paid-pilot-readiness-overview-panel",
        title: "Paid pilot readiness overview panel",
        status: defined ? "DEFINED" : "BLOCKED",
        dashboardPurpose:
          "Shows whether paid pilot readiness planning is cleared for the next planning layer.",
        safetyBoundary:
          "This panel is preview-only and cannot activate plans, provision accounts, or execute pilot actions.",
      },
      {
        id: "subscription-lock-preview-panel",
        title: "Subscription Lock preview panel",
        status: "LOCKED",
        dashboardPurpose:
          "Displays future Subscription Lock planning status and access-control readiness signals.",
        safetyBoundary:
          "No subscription verification, subscription activation, entitlement write, account lock mutation, payment provider call, or billing action is enabled.",
      },
      {
        id: "paid-pilot-safety-boundary-panel",
        title: "Paid pilot safety boundary panel",
        status: "LOCKED",
        dashboardPurpose:
          "Displays blocked actions for payments, invoices, messages, customer data writes, memory, audit persistence, recovery, and third-party mutation.",
        safetyBoundary:
          "The dashboard cannot send messages, charge customers, write customer data, persist audits, run recovery, mutate integrations, or call AI models.",
      },
      {
        id: "owner-control-panel",
        title: "Owner control panel",
        status: "LOCKED",
        dashboardPurpose:
          "Displays Owner Approval as the mandatory future gate before any pilot execution architecture can be enabled.",
        safetyBoundary:
          "No approve/reject execution or autonomous business action execution is enabled.",
      },
      {
        id: "locked-identity-panel",
        title: "Locked NEXUS identity panel",
        status: checkpoint.checkpointSummary.lockedVisionPreserved
          ? "DEFINED"
          : "BLOCKED",
        dashboardPurpose:
          "Displays NEXUS as an owner-controlled AI Business Operating Layer above existing business software.",
        safetyBoundary:
          "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
      },
      {
        id: "ai-model-isolation-panel",
        title: "AI model isolation panel",
        status: "LOCKED",
        dashboardPurpose:
          "Displays that the paid pilot readiness dashboard contract is deterministic and local.",
        safetyBoundary:
          "No AI model calls from this safety route.",
      },
    ],
    prohibitedActions: checkpoint.prohibitedActions,
    requiredContinuity: checkpoint.requiredContinuity,
    nextRecommendedStep:
      "Day 156: add paid pilot readiness planning dashboard validator v1.",
  };
}
