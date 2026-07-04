import { getPaidPilotReadinessPlanningDashboardCheckpoint } from "./paidPilotReadinessPlanningDashboardCheckpoint";

export type PaidPilotReadinessPlanningDashboardPhaseSummaryMilestone = {
  day: number;
  title: string;
  completed: boolean;
  safetyResult: "PRESERVED" | "NEEDS_REVIEW";
  summary: string;
};

export type PaidPilotReadinessPlanningDashboardPhaseSummary = {
  id: string;
  day: 159;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-dashboard-phase-summary-preview-only";
  summarizes: string[];
  status: "CLEARED" | "BLOCKED";
  phaseSummary: {
    totalMilestones: number;
    completedMilestones: number;
    dashboardCheckpointCleared: boolean;
    subscriptionLockPreserved: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForPhaseValidation: boolean;
    result: "PAID_PILOT_DASHBOARD_PHASE_SUMMARY_CLEARED" | "BLOCKED";
  };
  milestones: PaidPilotReadinessPlanningDashboardPhaseSummaryMilestone[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningDashboardPhaseSummary(): PaidPilotReadinessPlanningDashboardPhaseSummary {
  const checkpoint = getPaidPilotReadinessPlanningDashboardCheckpoint();

  const cleared =
    checkpoint.status === "CLEARED" &&
    checkpoint.checkpointSummary.safeForNextPlanningStep &&
    checkpoint.checkpointSummary.subscriptionLockPreserved &&
    checkpoint.checkpointSummary.paymentExecutionBlocked &&
    checkpoint.checkpointSummary.messageSendingBlocked &&
    checkpoint.checkpointSummary.customerDataWritesBlocked &&
    checkpoint.checkpointSummary.ownerControlPreserved &&
    checkpoint.checkpointSummary.lockedVisionPreserved;

  const milestones: PaidPilotReadinessPlanningDashboardPhaseSummaryMilestone[] = [
    {
      day: 151,
      title: "Paid Pilot Readiness Planning Contract v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Started paid pilot readiness planning after the real pilot execution architecture planning final checkpoint.",
    },
    {
      day: 152,
      title: "Paid Pilot Readiness Planning Validator v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Validated paid pilot planning boundaries for Subscription Lock, payment block, message block, customer data block, owner control, and locked NEXUS identity.",
    },
    {
      day: 153,
      title: "Paid Pilot Readiness Planning Summary v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Summarized paid pilot readiness planning contract and validator readiness.",
    },
    {
      day: 154,
      title: "Paid Pilot Readiness Planning Checkpoint v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Checkpointed the paid pilot readiness planning sequence while keeping all real execution blocked.",
    },
    {
      day: 155,
      title: "Paid Pilot Readiness Planning Dashboard Contract v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Defined paid pilot readiness planning dashboard boundaries as a preview-only owner review surface.",
    },
    {
      day: 156,
      title: "Paid Pilot Readiness Planning Dashboard Validator v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Validated paid pilot dashboard contract, planning panels, Subscription Lock discipline, payment block, message block, customer data block, owner control, and locked NEXUS identity.",
    },
    {
      day: 157,
      title: "Paid Pilot Readiness Planning Dashboard Summary v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Summarized the paid pilot readiness planning dashboard contract and validator.",
    },
    {
      day: 158,
      title: "Paid Pilot Readiness Planning Dashboard Checkpoint v1",
      completed: checkpoint.status === "CLEARED",
      safetyResult: checkpoint.status === "CLEARED" ? "PRESERVED" : "NEEDS_REVIEW",
      summary:
        "Checkpointed the paid pilot readiness planning dashboard sequence while keeping all real execution blocked.",
    },
  ];

  const completedMilestones = milestones.filter((milestone) => milestone.completed).length;

  return {
    id: "nexus-paid-pilot-readiness-planning-dashboard-phase-summary-v1",
    day: 159,
    name: "NEXUS Paid Pilot Readiness Planning Dashboard Phase Summary v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-dashboard-phase-summary-preview-only",
    summarizes: [
      "Day 151 Paid Pilot Readiness Planning Contract v1",
      "Day 152 Paid Pilot Readiness Planning Validator v1",
      "Day 153 Paid Pilot Readiness Planning Summary v1",
      "Day 154 Paid Pilot Readiness Planning Checkpoint v1",
      "Day 155 Paid Pilot Readiness Planning Dashboard Contract v1",
      "Day 156 Paid Pilot Readiness Planning Dashboard Validator v1",
      "Day 157 Paid Pilot Readiness Planning Dashboard Summary v1",
      "Day 158 Paid Pilot Readiness Planning Dashboard Checkpoint v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    phaseSummary: {
      totalMilestones: milestones.length,
      completedMilestones,
      dashboardCheckpointCleared: checkpoint.status === "CLEARED",
      subscriptionLockPreserved:
        checkpoint.checkpointSummary.subscriptionLockPreserved,
      paymentExecutionBlocked:
        checkpoint.checkpointSummary.paymentExecutionBlocked,
      messageSendingBlocked:
        checkpoint.checkpointSummary.messageSendingBlocked,
      customerDataWritesBlocked:
        checkpoint.checkpointSummary.customerDataWritesBlocked,
      ownerControlPreserved: checkpoint.checkpointSummary.ownerControlPreserved,
      lockedVisionPreserved: checkpoint.checkpointSummary.lockedVisionPreserved,
      safeForPhaseValidation: cleared,
      result: cleared ? "PAID_PILOT_DASHBOARD_PHASE_SUMMARY_CLEARED" : "BLOCKED",
    },
    milestones,
    prohibitedActions: checkpoint.prohibitedActions,
    requiredContinuity: checkpoint.requiredContinuity,
    nextRecommendedStep:
      "Day 160: add paid pilot readiness planning dashboard phase summary validator v1.",
  };
}
