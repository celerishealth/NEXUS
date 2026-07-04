import { getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummary } from "./realPilotExecutionArchitecturePlanningPhaseCheckpointSummary";

export type RealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidatorCheck = {
  id: string;
  title: string;
  result: "PASS" | "FAIL";
  evidence: string;
  safetyBoundary: string;
};

export type RealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator = {
  id: string;
  day: 143;
  name: string;
  phase: string;
  mode: "read-only-phase-checkpoint-summary-validator-preview-only";
  validates: string;
  status: "PASS" | "FAIL";
  validationSummary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    executionStillBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForNextPlanningStep: boolean;
    result: "PASS" | "FAIL";
  };
  checks: RealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidatorCheck[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator(): RealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator {
  const phaseCheckpointSummary = getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummary();

  const checks: RealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidatorCheck[] = [
    {
      id: "phase-checkpoint-summary-cleared",
      title: "Phase checkpoint summary is cleared",
      result: phaseCheckpointSummary.status === "CLEARED" ? "PASS" : "FAIL",
      evidence:
        "The Day 142 phase checkpoint summary must be cleared before the planning sequence can advance.",
      safetyBoundary:
        "If the checkpoint summary is not cleared, the next planning step must remain blocked.",
    },
    {
      id: "execution-architecture-planning-ready",
      title: "Execution architecture planning checkpoint is ready",
      result:
        phaseCheckpointSummary.phaseCheckpointSummary
          .executionArchitecturePlanningCheckpointReady
          ? "PASS"
          : "FAIL",
      evidence:
        "The validator confirms the execution architecture planning checkpoint summary exists as a safe read-only planning artifact.",
      safetyBoundary:
        "Planning readiness does not enable real execution.",
    },
    {
      id: "dashboard-phase-checkpoint-cleared",
      title: "Dashboard phase checkpoint is cleared",
      result:
        phaseCheckpointSummary.phaseCheckpointSummary.dashboardPhaseCheckpointCleared
          ? "PASS"
          : "FAIL",
      evidence:
        "The Day 141 dashboard phase checkpoint must be cleared before this summary can pass validation.",
      safetyBoundary:
        "Dashboard planning cannot become an operational execution surface.",
    },
    {
      id: "execution-still-blocked",
      title: "Execution remains blocked",
      result:
        phaseCheckpointSummary.phaseCheckpointSummary.executionStillBlocked
          ? "PASS"
          : "FAIL",
      evidence:
        "All real execution must remain blocked throughout the planning checkpoint summary.",
      safetyBoundary:
        "No risky execution, approve/reject execution, payment execution, message sending, recovery execution, third-party mutation, customer data write, or audit persistence is enabled.",
    },
    {
      id: "owner-control-preserved",
      title: "Owner control is preserved",
      result:
        phaseCheckpointSummary.phaseCheckpointSummary.ownerControlPreserved
          ? "PASS"
          : "FAIL",
      evidence:
        "Owner Approval remains mandatory before any future execution architecture can be enabled.",
      safetyBoundary:
        "No autonomous approval execution is allowed.",
    },
    {
      id: "locked-vision-preserved",
      title: "Locked NEXUS vision is preserved",
      result:
        phaseCheckpointSummary.phaseCheckpointSummary.lockedVisionPreserved
          ? "PASS"
          : "FAIL",
      evidence:
        "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
      safetyBoundary:
        "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
    },
    {
      id: "ai-model-isolation",
      title: "AI model isolation is preserved",
      result: "PASS",
      evidence:
        "The validator uses deterministic local planning data only and does not call any AI model.",
      safetyBoundary:
        "No AI model calls from this safety route.",
    },
  ];

  const passedChecks = checks.filter((check) => check.result === "PASS").length;
  const failedChecks = checks.length - passedChecks;
  const result: "PASS" | "FAIL" = failedChecks === 0 ? "PASS" : "FAIL";

  return {
    id: "nexus-real-pilot-execution-architecture-planning-phase-checkpoint-summary-validator-v1",
    day: 143,
    name: "NEXUS Real Pilot Execution Architecture Planning Phase Checkpoint Summary Validator v1",
    phase: "Real Pilot Execution Architecture Planning",
    mode: "read-only-phase-checkpoint-summary-validator-preview-only",
    validates:
      "Day 142 Real Pilot Execution Architecture Planning Phase Checkpoint Summary v1",
    status: result,
    validationSummary: {
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      executionStillBlocked:
        phaseCheckpointSummary.phaseCheckpointSummary.executionStillBlocked,
      ownerControlPreserved:
        phaseCheckpointSummary.phaseCheckpointSummary.ownerControlPreserved,
      lockedVisionPreserved:
        phaseCheckpointSummary.phaseCheckpointSummary.lockedVisionPreserved,
      safeForNextPlanningStep:
        phaseCheckpointSummary.phaseCheckpointSummary.safeForNextPlanningStep,
      result,
    },
    checks,
    prohibitedActions: phaseCheckpointSummary.prohibitedActions,
    requiredContinuity: phaseCheckpointSummary.requiredContinuity,
    nextRecommendedStep:
      "Day 144: add real pilot execution architecture planning phase checkpoint v1.",
  };
}
