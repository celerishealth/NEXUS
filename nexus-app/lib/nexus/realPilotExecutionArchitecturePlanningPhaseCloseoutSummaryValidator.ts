import { getRealPilotExecutionArchitecturePlanningPhaseCloseoutSummary } from "./realPilotExecutionArchitecturePlanningPhaseCloseoutSummary";

export type RealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidatorCheck = {
  id: string;
  title: string;
  result: "PASS" | "FAIL";
  evidence: string;
  safetyBoundary: string;
};

export type RealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidator = {
  id: string;
  day: 146;
  name: string;
  phase: string;
  mode: "read-only-closeout-summary-validator-preview-only";
  validates: string;
  status: "PASS" | "FAIL";
  validationSummary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    phaseCheckpointCleared: boolean;
    executionStillBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    safeForCloseoutCheckpoint: boolean;
    result: "PASS" | "FAIL";
  };
  checks: RealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidatorCheck[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getRealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidator(): RealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidator {
  const closeoutSummary = getRealPilotExecutionArchitecturePlanningPhaseCloseoutSummary();

  const checks: RealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidatorCheck[] = [
    {
      id: "closeout-summary-cleared",
      title: "Closeout summary is cleared",
      result: closeoutSummary.status === "CLEARED" ? "PASS" : "FAIL",
      evidence:
        "The Day 145 closeout summary must be cleared before the phase can move to closeout checkpointing.",
      safetyBoundary:
        "If closeout summary is not cleared, phase closeout checkpointing must remain blocked.",
    },
    {
      id: "phase-checkpoint-cleared",
      title: "Phase checkpoint is cleared",
      result: closeoutSummary.closeoutSummary.phaseCheckpointCleared
        ? "PASS"
        : "FAIL",
      evidence:
        "The Day 144 phase checkpoint must be cleared before closeout validation can pass.",
      safetyBoundary:
        "A blocked phase checkpoint cannot be converted into closeout readiness.",
    },
    {
      id: "execution-still-blocked",
      title: "Execution remains blocked",
      result: closeoutSummary.closeoutSummary.executionStillBlocked
        ? "PASS"
        : "FAIL",
      evidence:
        "The closeout summary must preserve the full execution lock across the real pilot execution architecture planning phase.",
      safetyBoundary:
        "No risky execution, approve/reject execution, payment execution, message sending, recovery execution, third-party mutation, customer data write, real DB memory read/write, or audit persistence is enabled.",
    },
    {
      id: "owner-control-preserved",
      title: "Owner control is preserved",
      result: closeoutSummary.closeoutSummary.ownerControlPreserved
        ? "PASS"
        : "FAIL",
      evidence:
        "Owner Approval must remain mandatory before any future execution architecture can be enabled.",
      safetyBoundary:
        "No autonomous approval, rejection, or business action execution is allowed.",
    },
    {
      id: "locked-vision-preserved",
      title: "Locked NEXUS vision is preserved",
      result: closeoutSummary.closeoutSummary.lockedVisionPreserved
        ? "PASS"
        : "FAIL",
      evidence:
        "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
      safetyBoundary:
        "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
    },
    {
      id: "closeout-validation-readiness",
      title: "Closeout validation readiness is preserved",
      result: closeoutSummary.closeoutSummary.safeForCloseoutValidation
        ? "PASS"
        : "FAIL",
      evidence:
        "The closeout summary is marked safe for closeout validation without enabling real execution.",
      safetyBoundary:
        "Validation readiness is not execution readiness.",
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
    id: "nexus-real-pilot-execution-architecture-planning-phase-closeout-summary-validator-v1",
    day: 146,
    name: "NEXUS Real Pilot Execution Architecture Planning Phase Closeout Summary Validator v1",
    phase: "Real Pilot Execution Architecture Planning",
    mode: "read-only-closeout-summary-validator-preview-only",
    validates:
      "Day 145 Real Pilot Execution Architecture Planning Phase Closeout Summary v1",
    status: result,
    validationSummary: {
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      phaseCheckpointCleared:
        closeoutSummary.closeoutSummary.phaseCheckpointCleared,
      executionStillBlocked:
        closeoutSummary.closeoutSummary.executionStillBlocked,
      ownerControlPreserved:
        closeoutSummary.closeoutSummary.ownerControlPreserved,
      lockedVisionPreserved:
        closeoutSummary.closeoutSummary.lockedVisionPreserved,
      safeForCloseoutCheckpoint:
        closeoutSummary.closeoutSummary.safeForCloseoutValidation,
      result,
    },
    checks,
    prohibitedActions: closeoutSummary.prohibitedActions,
    requiredContinuity: closeoutSummary.requiredContinuity,
    nextRecommendedStep:
      "Day 147: add real pilot execution architecture planning phase closeout checkpoint v1.",
  };
}
