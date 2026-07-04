import { getRealPilotExecutionArchitecturePlanningDashboardSummary } from "./realPilotExecutionArchitecturePlanningDashboardSummary";

export type RealPilotExecutionArchitecturePlanningDashboardCheckpointGate = {
  id: string;
  title: string;
  status: "LOCKED" | "CLEARED";
  checkpointEvidence: string;
  safetyBoundary: string;
};

export type RealPilotExecutionArchitecturePlanningDashboardCheckpoint = {
  id: string;
  day: 138;
  name: string;
  phase: string;
  mode: "read-only-checkpoint-preview-only";
  checkpointFor: string[];
  status: "CLEARED" | "BLOCKED";
  checkpointSummary: {
    dashboardContractCompleted: boolean;
    dashboardValidatorPassed: boolean;
    dashboardSummaryReady: boolean;
    executionStillBlocked: boolean;
    lockedVisionPreserved: boolean;
    result: "CLEARED_FOR_NEXT_PLANNING_STEP" | "BLOCKED";
  };
  gates: RealPilotExecutionArchitecturePlanningDashboardCheckpointGate[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getRealPilotExecutionArchitecturePlanningDashboardCheckpoint(): RealPilotExecutionArchitecturePlanningDashboardCheckpoint {
  const dashboardSummary = getRealPilotExecutionArchitecturePlanningDashboardSummary();
  const cleared =
    dashboardSummary.summary.result === "READY_FOR_NEXT_PLANNING_STEP" &&
    dashboardSummary.summary.executionBlocked &&
    dashboardSummary.summary.pilotDisciplinePreserved;

  return {
    id: "nexus-real-pilot-execution-architecture-planning-dashboard-checkpoint-v1",
    day: 138,
    name: "NEXUS Real Pilot Execution Architecture Planning Dashboard Checkpoint v1",
    phase: "Real Pilot Execution Architecture Planning",
    mode: "read-only-checkpoint-preview-only",
    checkpointFor: [
      "Day 135 Real Pilot Execution Architecture Planning Dashboard Contract v1",
      "Day 136 Real Pilot Execution Architecture Planning Dashboard Validator v1",
      "Day 137 Real Pilot Execution Architecture Planning Dashboard Summary v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    checkpointSummary: {
      dashboardContractCompleted: true,
      dashboardValidatorPassed: dashboardSummary.validatorStatus === "PASS",
      dashboardSummaryReady:
        dashboardSummary.summary.result === "READY_FOR_NEXT_PLANNING_STEP",
      executionStillBlocked: dashboardSummary.summary.executionBlocked,
      lockedVisionPreserved: dashboardSummary.summary.pilotDisciplinePreserved,
      result: cleared ? "CLEARED_FOR_NEXT_PLANNING_STEP" : "BLOCKED",
    },
    gates: [
      {
        id: "planning-dashboard-gate",
        title: "Planning dashboard gate",
        status: "CLEARED",
        checkpointEvidence:
          "The dashboard contract, validator, and summary exist as safe preview-only planning layers.",
        safetyBoundary:
          "The dashboard planning layer cannot execute real pilot actions or mutate customer/business systems.",
      },
      {
        id: "owner-approval-gate",
        title: "Owner approval gate",
        status: "LOCKED",
        checkpointEvidence:
          "Owner Approval remains a mandatory control before any future execution architecture is allowed.",
        safetyBoundary:
          "No approve/reject execution is enabled in this checkpoint.",
      },
      {
        id: "real-data-gate",
        title: "Real data gate",
        status: "LOCKED",
        checkpointEvidence:
          "The checkpoint uses deterministic static planning data only.",
        safetyBoundary:
          "No real DB memory read/write, customer data write, or audit persistence is enabled.",
      },
      {
        id: "external-action-gate",
        title: "External action gate",
        status: "LOCKED",
        checkpointEvidence:
          "The checkpoint confirms external actions remain blocked during planning.",
        safetyBoundary:
          "No payment execution, message sending, recovery execution, or third-party mutation is enabled.",
      },
      {
        id: "ai-model-gate",
        title: "AI model gate",
        status: "LOCKED",
        checkpointEvidence:
          "The checkpoint does not call AI models and does not generate operational decisions.",
        safetyBoundary:
          "No AI model calls from this safety route.",
      },
    ],
    prohibitedActions: dashboardSummary.prohibitedActions,
    requiredContinuity: dashboardSummary.requiredContinuity,
    nextRecommendedStep:
      "Day 139: add real pilot execution architecture planning dashboard phase summary v1.",
  };
}
