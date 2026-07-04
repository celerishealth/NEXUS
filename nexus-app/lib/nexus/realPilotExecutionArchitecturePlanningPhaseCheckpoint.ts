import { getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator } from "./realPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator";

export type RealPilotExecutionArchitecturePlanningPhaseCheckpointGate = {
  id: string;
  title: string;
  status: "CLEARED" | "LOCKED" | "BLOCKED";
  checkpointEvidence: string;
  safetyBoundary: string;
};

export type RealPilotExecutionArchitecturePlanningPhaseCheckpoint = {
  id: string;
  day: 144;
  name: string;
  phase: string;
  mode: "read-only-phase-checkpoint-preview-only";
  checkpointFor: string[];
  status: "CLEARED" | "BLOCKED";
  checkpointSummary: {
    phaseCheckpointSummaryValidated: boolean;
    allChecksPassed: boolean;
    executionStillBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForNextPlanningStep: boolean;
    result: "CLEARED_FOR_PHASE_CLOSEOUT_PLANNING" | "BLOCKED";
  };
  gates: RealPilotExecutionArchitecturePlanningPhaseCheckpointGate[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getRealPilotExecutionArchitecturePlanningPhaseCheckpoint(): RealPilotExecutionArchitecturePlanningPhaseCheckpoint {
  const validator = getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator();

  const cleared =
    validator.status === "PASS" &&
    validator.validationSummary.failedChecks === 0 &&
    validator.validationSummary.executionStillBlocked &&
    validator.validationSummary.ownerControlPreserved &&
    validator.validationSummary.lockedVisionPreserved &&
    validator.validationSummary.safeForNextPlanningStep;

  return {
    id: "nexus-real-pilot-execution-architecture-planning-phase-checkpoint-v1",
    day: 144,
    name: "NEXUS Real Pilot Execution Architecture Planning Phase Checkpoint v1",
    phase: "Real Pilot Execution Architecture Planning",
    mode: "read-only-phase-checkpoint-preview-only",
    checkpointFor: [
      "Day 131 Real Pilot Execution Architecture Planning Contract v1",
      "Day 132 Real Pilot Execution Architecture Planning Validator v1",
      "Day 133 Real Pilot Execution Architecture Planning Summary v1",
      "Day 134 Real Pilot Execution Architecture Planning Checkpoint v1",
      "Day 135 Real Pilot Execution Architecture Planning Dashboard Contract v1",
      "Day 136 Real Pilot Execution Architecture Planning Dashboard Validator v1",
      "Day 137 Real Pilot Execution Architecture Planning Dashboard Summary v1",
      "Day 138 Real Pilot Execution Architecture Planning Dashboard Checkpoint v1",
      "Day 139 Real Pilot Execution Architecture Planning Dashboard Phase Summary v1",
      "Day 140 Real Pilot Execution Architecture Planning Dashboard Phase Summary Validator v1",
      "Day 141 Real Pilot Execution Architecture Planning Dashboard Phase Checkpoint v1",
      "Day 142 Real Pilot Execution Architecture Planning Phase Checkpoint Summary v1",
      "Day 143 Real Pilot Execution Architecture Planning Phase Checkpoint Summary Validator v1",
    ],
    status: cleared ? "CLEARED" : "BLOCKED",
    checkpointSummary: {
      phaseCheckpointSummaryValidated: validator.status === "PASS",
      allChecksPassed: validator.validationSummary.failedChecks === 0,
      executionStillBlocked: validator.validationSummary.executionStillBlocked,
      ownerControlPreserved: validator.validationSummary.ownerControlPreserved,
      lockedVisionPreserved: validator.validationSummary.lockedVisionPreserved,
      safeForNextPlanningStep:
        validator.validationSummary.safeForNextPlanningStep,
      result: cleared ? "CLEARED_FOR_PHASE_CLOSEOUT_PLANNING" : "BLOCKED",
    },
    gates: [
      {
        id: "phase-checkpoint-summary-validation-gate",
        title: "Phase checkpoint summary validation gate",
        status: validator.status === "PASS" ? "CLEARED" : "BLOCKED",
        checkpointEvidence:
          "The Day 143 validator must pass before the phase checkpoint can be cleared.",
        safetyBoundary:
          "Failed validation blocks phase checkpoint progression.",
      },
      {
        id: "execution-lock-gate",
        title: "Execution lock gate",
        status: validator.validationSummary.executionStillBlocked
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Real pilot execution remains blocked across the full planning phase.",
        safetyBoundary:
          "No risky execution, approve/reject execution, payment execution, message sending, recovery execution, third-party mutation, customer data write, real DB memory read/write, or audit persistence is enabled.",
      },
      {
        id: "owner-control-gate",
        title: "Owner control gate",
        status: validator.validationSummary.ownerControlPreserved
          ? "LOCKED"
          : "BLOCKED",
        checkpointEvidence:
          "Owner Approval remains mandatory before any future execution architecture can be enabled.",
        safetyBoundary:
          "No autonomous approval or rejection execution is allowed.",
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
      "Day 145: add real pilot execution architecture planning phase closeout summary v1.",
  };
}
