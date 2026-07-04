import { getPaidPilotReadinessPlanningDashboardSummary } from "./paidPilotReadinessPlanningDashboardSummary";

export type PaidPilotReadinessPlanningDashboardCheckpointGate = {
  id: string;
  title: string;
  status: "CLEARED" | "LOCKED" | "BLOCKED";
  checkpointEvidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningDashboardCheckpoint = {
  id: string;
  day: 158;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-dashboard-checkpoint-preview-only";
  checkpointFor: string[];
  status: "CLEARED" | "BLOCKED";
  checkpointSummary: {
    dashboardContractDefined: boolean;
    dashboardValidatorPassed: boolean;
    dashboardSummaryCleared: boolean;
    panelsDefined: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForNextPlanningStep: boolean;
    result: "PAID_PILOT_DASHBOARD_CHECKPOINT_CLEARED" | "BLOCKED";
  };
  gates: PaidPilotReadinessPlanningDashboardCheckpointGate[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningDashboardCheckpoint(): PaidPilotReadinessPlanningDashboardCheckpoint {
  const summary = getPaidPilotReadinessPlanningDashboardSummary();

  const cleared =
    summary.status === "CLEARED" &&
    summary.dashboardSummary.safeForDashboardCheckpoint &&
    summary.dashboardSummary.dashboardContractDefined &&
    summary.dashboardSummary.dashboardValidatorPassed &&
    summary.dashboardSummary.panelsDefined &&
    summary.dashboardSummary.subscriptionLockPreserved &&
    summary.dashboardSummary.paymentExecutionBlocked &&
    summary.dashboardSummary.messageSendingBlocked &&
    summary.dashboardSummary.customerDataWritesBlocked &&
    summary.dashboardSummary.ownerControlPreserved &&
    summary.dashboardSummary.lockedVisionPreserved;

  return {
    id: "nexus-paid-pilot-readiness-planning-dashboard-checkpoint-v1",
    day: 158,
    name: "NEXUS Paid Pilot Readiness Planning Dashboard Checkpoint v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-dashboard-checkpoint-preview-only",
    checkpointFor: [
      "Day 155 Paid Pilot Readiness Planning Dashboard Contract v1",
      "Day 156 Paid Pilot Readiness Planning Dashboard Validator v1",
      "Day 157 Paid Pilot Readiness Planning Dashboard Summary v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    checkpointSummary: {
      dashboardContractDefined:
        summary.dashboardSummary.dashboardContractDefined,
      dashboardValidatorPassed:
        summary.dashboardSummary.dashboardValidatorPassed,
      dashboardSummaryCleared: summary.status === "CLEARED",
      panelsDefined: summary.dashboardSummary.panelsDefined,
      subscriptionLockPreserved:
        summary.dashboardSummary.subscriptionLockPreserved,
      paymentExecutionBlocked:
        summary.dashboardSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        summary.dashboardSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        summary.dashboardSummary.customerDataWritesBlocked,
      ownerControlPreserved: summary.dashboardSummary.ownerControlPreserved,
      lockedVisionPreserved: summary.dashboardSummary.lockedVisionPreserved,
      safeForNextPlanningStep: cleared,
      result: cleared ? "PAID_PILOT_DASHBOARD_CHECKPOINT_CLEARED" : "BLOCKED",
    },
    gates: [
      {
        id: "dashboard-summary-gate",
        title: "Dashboard summary gate",
        status: summary.status === "CLEARED" ? "CLEARED" : "BLOCKED",
        checkpointEvidence:
          "The Day 157 paid pilot readiness planning dashboard summary must be cleared before checkpointing can pass.",
        safetyBoundary:
          "A blocked dashboard summary cannot be converted into paid pilot dashboard readiness.",
      },
      {
        id: "dashboard-panel-gate",
        title: "Dashboard panel gate",
        status: summary.dashboardSummary.panelsDefined ? "CLEARED" : "BLOCKED",
        checkpointEvidence:
          "Paid pilot readiness planning dashboard panels must exist for owner review.",
        safetyBoundary:
          "Dashboard panels are preview-only and cannot execute pilot actions or mutate business systems.",
      },
      {
        id: "subscription-lock-gate",
        title: "Subscription Lock gate",
        status: summary.dashboardSummary.subscriptionLockPreserved
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Subscription Lock remains preserved as a future access-control planning layer only.",
        safetyBoundary:
          "No subscription activation, entitlement write, account lock mutation, or payment provider call is enabled.",
      },
      {
        id: "payment-execution-gate",
        title: "Payment execution gate",
        status: summary.dashboardSummary.paymentExecutionBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Payment execution remains blocked during dashboard checkpointing.",
        safetyBoundary:
          "No payment execution, invoice creation, charging, or payment provider call is enabled.",
      },
      {
        id: "message-sending-gate",
        title: "Message sending gate",
        status: summary.dashboardSummary.messageSendingBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer-facing message sending remains blocked during dashboard checkpointing.",
        safetyBoundary:
          "No WhatsApp, email, SMS, or external customer communication is enabled.",
      },
      {
        id: "customer-data-gate",
        title: "Customer data gate",
        status: summary.dashboardSummary.customerDataWritesBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer data writes remain blocked during dashboard checkpointing.",
        safetyBoundary:
          "No customer data write, real DB memory read/write, or audit persistence is enabled.",
      },
      {
        id: "owner-control-gate",
        title: "Owner control gate",
        status: summary.dashboardSummary.ownerControlPreserved
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Owner Approval remains mandatory before any future paid pilot execution architecture can be enabled.",
        safetyBoundary:
          "No autonomous approval, rejection, or business action execution is allowed.",
      },
      {
        id: "locked-vision-gate",
        title: "Locked NEXUS vision gate",
        status: summary.dashboardSummary.lockedVisionPreserved
          ? "CLEARED"
          : "BLOCKED",
        checkpointEvidence:
          "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
        safetyBoundary:
          "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
      },
      {
        id: "ai-model-isolation-gate",
        title: "AI model isolation gate",
        status: "LOCKED",
        checkpointEvidence:
          "This checkpoint uses deterministic local planning data only and does not call AI models.",
        safetyBoundary:
          "No AI model calls from this safety route.",
      },
    ],
    prohibitedActions: summary.prohibitedActions,
    requiredContinuity: summary.requiredContinuity,
    nextRecommendedStep:
      "Day 159: add paid pilot readiness planning dashboard phase summary v1.",
  };
}
