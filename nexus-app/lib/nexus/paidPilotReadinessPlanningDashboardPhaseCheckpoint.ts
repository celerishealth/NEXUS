import { getPaidPilotReadinessPlanningDashboardPhaseSummaryValidator } from "./paidPilotReadinessPlanningDashboardPhaseSummaryValidator";

export type PaidPilotReadinessPlanningDashboardPhaseCheckpointGate = {
  id: string;
  title: string;
  status: "CLEARED" | "LOCKED" | "BLOCKED";
  checkpointEvidence: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningDashboardPhaseCheckpoint = {
  id: string;
  day: 161;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-dashboard-phase-checkpoint-preview-only";
  checkpointFor: string[];
  status: "CLEARED" | "BLOCKED";
  checkpointSummary: {
    phaseSummaryValidated: boolean;
    allChecksPassed: boolean;
    dashboardPhaseSummaryCleared: boolean;
    allMilestonesCompleted: boolean;
    dashboardCheckpointCleared: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForNextPlanningStep: boolean;
    result: "PAID_PILOT_DASHBOARD_PHASE_CHECKPOINT_CLEARED" | "BLOCKED";
  };
  gates: PaidPilotReadinessPlanningDashboardPhaseCheckpointGate[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningDashboardPhaseCheckpoint(): PaidPilotReadinessPlanningDashboardPhaseCheckpoint {
  const validator = getPaidPilotReadinessPlanningDashboardPhaseSummaryValidator();

  const cleared =
    validator.status === "PASS" &&
    validator.validationSummary.failedChecks === 0 &&
    validator.validationSummary.dashboardPhaseSummaryCleared &&
    validator.validationSummary.allMilestonesCompleted &&
    validator.validationSummary.dashboardCheckpointCleared &&
    validator.validationSummary.subscriptionLockPreserved &&
    validator.validationSummary.paymentExecutionBlocked &&
    validator.validationSummary.messageSendingBlocked &&
    validator.validationSummary.customerDataWritesBlocked &&
    validator.validationSummary.ownerControlPreserved &&
    validator.validationSummary.lockedVisionPreserved &&
    validator.validationSummary.safeForPhaseCheckpoint;

  return {
    id: "nexus-paid-pilot-readiness-planning-dashboard-phase-checkpoint-v1",
    day: 161,
    name: "NEXUS Paid Pilot Readiness Planning Dashboard Phase Checkpoint v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-dashboard-phase-checkpoint-preview-only",
    checkpointFor: [
      "Day 151 Paid Pilot Readiness Planning Contract v1",
      "Day 152 Paid Pilot Readiness Planning Validator v1",
      "Day 153 Paid Pilot Readiness Planning Summary v1",
      "Day 154 Paid Pilot Readiness Planning Checkpoint v1",
      "Day 155 Paid Pilot Readiness Planning Dashboard Contract v1",
      "Day 156 Paid Pilot Readiness Planning Dashboard Validator v1",
      "Day 157 Paid Pilot Readiness Planning Dashboard Summary v1",
      "Day 158 Paid Pilot Readiness Planning Dashboard Checkpoint v1",
      "Day 159 Paid Pilot Readiness Planning Dashboard Phase Summary v1",
      "Day 160 Paid Pilot Readiness Planning Dashboard Phase Summary Validator v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    checkpointSummary: {
      phaseSummaryValidated: validator.status === "PASS",
      allChecksPassed: validator.validationSummary.failedChecks === 0,
      dashboardPhaseSummaryCleared:
        validator.validationSummary.dashboardPhaseSummaryCleared,
      allMilestonesCompleted:
        validator.validationSummary.allMilestonesCompleted,
      dashboardCheckpointCleared:
        validator.validationSummary.dashboardCheckpointCleared,
      subscriptionLockPreserved:
        validator.validationSummary.subscriptionLockPreserved,
      paymentExecutionBlocked:
        validator.validationSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        validator.validationSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        validator.validationSummary.customerDataWritesBlocked,
      ownerControlPreserved:
        validator.validationSummary.ownerControlPreserved,
      lockedVisionPreserved:
        validator.validationSummary.lockedVisionPreserved,
      safeForNextPlanningStep: cleared,
      result: cleared ? "PAID_PILOT_DASHBOARD_PHASE_CHECKPOINT_CLEARED" : "BLOCKED",
    },
    gates: [
      {
        id: "phase-summary-validation-gate",
        title: "Dashboard phase summary validation gate",
        status: validator.status === "PASS" ? "CLEARED" : "BLOCKED",
        checkpointEvidence:
          "The Day 160 dashboard phase summary validator must pass before the dashboard phase checkpoint can be cleared.",
        safetyBoundary:
          "Failed dashboard phase validation blocks the next paid pilot planning step.",
      },
      {
        id: "milestone-completion-gate",
        title: "Milestone completion gate",
        status: validator.validationSummary.allMilestonesCompleted
          ? "CLEARED"
          : "BLOCKED",
        checkpointEvidence:
          "Day 151 through Day 158 must be represented as completed paid pilot readiness planning milestones.",
        safetyBoundary:
          "Incomplete milestones cannot be treated as paid pilot dashboard phase readiness.",
      },
      {
        id: "dashboard-checkpoint-gate",
        title: "Dashboard checkpoint gate",
        status: validator.validationSummary.dashboardCheckpointCleared
          ? "CLEARED"
          : "BLOCKED",
        checkpointEvidence:
          "The Day 158 paid pilot readiness planning dashboard checkpoint remains cleared.",
        safetyBoundary:
          "A blocked dashboard checkpoint cannot move into dashboard phase checkpoint readiness.",
      },
      {
        id: "subscription-lock-gate",
        title: "Subscription Lock gate",
        status: validator.validationSummary.subscriptionLockPreserved
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
        status: validator.validationSummary.paymentExecutionBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Payment execution remains blocked during dashboard phase checkpointing.",
        safetyBoundary:
          "No payment execution, invoice creation, charging, or payment provider call is enabled.",
      },
      {
        id: "message-sending-gate",
        title: "Message sending gate",
        status: validator.validationSummary.messageSendingBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer-facing message sending remains blocked during dashboard phase checkpointing.",
        safetyBoundary:
          "No WhatsApp, email, SMS, or external customer communication is enabled.",
      },
      {
        id: "customer-data-gate",
        title: "Customer data gate",
        status: validator.validationSummary.customerDataWritesBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Customer data writes remain blocked during dashboard phase checkpointing.",
        safetyBoundary:
          "No customer data write, real DB memory read/write, or audit persistence is enabled.",
      },
      {
        id: "owner-control-gate",
        title: "Owner control gate",
        status: validator.validationSummary.ownerControlPreserved
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
        status: validator.validationSummary.lockedVisionPreserved
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
    prohibitedActions: validator.prohibitedActions,
    requiredContinuity: validator.requiredContinuity,
    nextRecommendedStep:
      "Day 162: add paid pilot readiness planning phase checkpoint summary v1.",
  };
}
