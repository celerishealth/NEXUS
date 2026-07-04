import { getRealPilotExecutionArchitecturePlanningDashboardCheckpoint } from "./realPilotExecutionArchitecturePlanningDashboardCheckpoint";

export type RealPilotExecutionArchitecturePlanningDashboardPhaseSummaryMilestone = {
  day: number;
  title: string;
  completed: boolean;
  safetyResult: "PRESERVED" | "NEEDS_REVIEW";
  summary: string;
};

export type RealPilotExecutionArchitecturePlanningDashboardPhaseSummary = {
  id: string;
  day: 139;
  name: string;
  phase: string;
  mode: "read-only-phase-summary-preview-only";
  status: "CLEARED" | "BLOCKED";
  covers: string[];
  phaseSummary: {
    totalMilestones: number;
    completedMilestones: number;
    executionStillBlocked: boolean;
    ownerControlPreserved: boolean;
    trustFirstDashboardReady: boolean;
    lockedVisionPreserved: boolean;
    result: "PHASE_DASHBOARD_SEQUENCE_CLEARED" | "BLOCKED";
  };
  milestones: RealPilotExecutionArchitecturePlanningDashboardPhaseSummaryMilestone[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getRealPilotExecutionArchitecturePlanningDashboardPhaseSummary(): RealPilotExecutionArchitecturePlanningDashboardPhaseSummary {
  const checkpoint = getRealPilotExecutionArchitecturePlanningDashboardCheckpoint();
  const checkpointCleared = checkpoint.status === "CLEARED";

  const milestones: RealPilotExecutionArchitecturePlanningDashboardPhaseSummaryMilestone[] = [
    {
      day: 135,
      title: "Dashboard Contract v1",
      completed: true,
      safetyResult: "PRESERVED",
      summary:
        "Defined the real pilot execution architecture planning dashboard as a safe planning-only surface.",
    },
    {
      day: 136,
      title: "Dashboard Validator v1",
      completed: true,
      safetyResult: checkpoint.checkpointSummary.dashboardValidatorPassed
        ? "PRESERVED"
        : "NEEDS_REVIEW",
      summary:
        "Validated dashboard contract boundaries for owner control, read-only discipline, Zero Damage, Zero Stop, and AI model isolation.",
    },
    {
      day: 137,
      title: "Dashboard Summary v1",
      completed: true,
      safetyResult: checkpoint.checkpointSummary.dashboardSummaryReady
        ? "PRESERVED"
        : "NEEDS_REVIEW",
      summary:
        "Summarized dashboard contract and validator readiness while confirming execution remains blocked.",
    },
    {
      day: 138,
      title: "Dashboard Checkpoint v1",
      completed: checkpointCleared,
      safetyResult: checkpointCleared ? "PRESERVED" : "NEEDS_REVIEW",
      summary:
        "Checkpointed the dashboard sequence and confirmed readiness for the next planning step without enabling execution.",
    },
  ];

  const completedMilestones = milestones.filter((milestone) => milestone.completed).length;

  return {
    id: "nexus-real-pilot-execution-architecture-planning-dashboard-phase-summary-v1",
    day: 139,
    name: "NEXUS Real Pilot Execution Architecture Planning Dashboard Phase Summary v1",
    phase: "Real Pilot Execution Architecture Planning",
    mode: "read-only-phase-summary-preview-only",
    status: checkpointCleared ? "CLEARED" : "BLOCKED",
    covers: [
      "Day 135 Real Pilot Execution Architecture Planning Dashboard Contract v1",
      "Day 136 Real Pilot Execution Architecture Planning Dashboard Validator v1",
      "Day 137 Real Pilot Execution Architecture Planning Dashboard Summary v1",
      "Day 138 Real Pilot Execution Architecture Planning Dashboard Checkpoint v1",
    ],
    phaseSummary: {
      totalMilestones: milestones.length,
      completedMilestones,
      executionStillBlocked: checkpoint.checkpointSummary.executionStillBlocked,
      ownerControlPreserved: true,
      trustFirstDashboardReady: checkpointCleared,
      lockedVisionPreserved: checkpoint.checkpointSummary.lockedVisionPreserved,
      result: checkpointCleared ? "PHASE_DASHBOARD_SEQUENCE_CLEARED" : "BLOCKED",
    },
    milestones,
    prohibitedActions: checkpoint.prohibitedActions,
    requiredContinuity: checkpoint.requiredContinuity,
    nextRecommendedStep:
      "Day 140: add real pilot execution architecture planning dashboard phase summary validator v1.",
  };
}
