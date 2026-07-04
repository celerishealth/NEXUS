import { getPaidPilotLaunchReadinessPlanningPhaseSummary } from "./paidPilotLaunchReadinessPlanningPhaseSummary";
import { getPaidPilotLaunchReadinessPlanningPhaseSummaryValidationReport } from "./paidPilotLaunchReadinessPlanningPhaseSummaryValidator";

export type PaidPilotLaunchReadinessPlanningPhaseCheckpointStatus =
  | "PHASE_CHECKPOINT_READY"
  | "PHASE_CHECKPOINT_BLOCKED";

export type PaidPilotLaunchReadinessPlanningPhaseCheckpointItem = {
  id: string;
  title: string;
  status: "VERIFIED" | "LOCKED" | "BLOCKED";
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningPhaseCheckpoint = {
  id: string;
  day: 177;
  name: string;
  phase: string;
  mode: string;
  status: PaidPilotLaunchReadinessPlanningPhaseCheckpointStatus;
  sourcePhaseSummaryId: string;
  sourceValidatorId: string;
  validatorPassed: boolean;
  checkpointItems: PaidPilotLaunchReadinessPlanningPhaseCheckpointItem[];
  completedArtifactChain: string[];
  blockedExecutionActions: string[];
  preservedLaws: string[];
  nextAllowedStep: string;
  nextBlockedStep: string;
  safetyBoundary: string;
};

export function getPaidPilotLaunchReadinessPlanningPhaseCheckpoint(): PaidPilotLaunchReadinessPlanningPhaseCheckpoint {
  const phaseSummary = getPaidPilotLaunchReadinessPlanningPhaseSummary();
  const validationReport = getPaidPilotLaunchReadinessPlanningPhaseSummaryValidationReport();
  const ready = phaseSummary.status === "PHASE_SUMMARY_READY" && validationReport.passed;

  return {
    id: "paid-pilot-launch-readiness-planning-phase-checkpoint-v1",
    day: 177,
    name: "NEXUS Paid Pilot Launch Readiness Planning Phase Checkpoint v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-phase-checkpoint-preview-only",
    status: ready ? "PHASE_CHECKPOINT_READY" : "PHASE_CHECKPOINT_BLOCKED",
    sourcePhaseSummaryId: phaseSummary.id,
    sourceValidatorId: validationReport.id,
    validatorPassed: validationReport.passed,
    checkpointItems: [
      {
        id: "day-171-through-day-174-chain-checkpoint",
        title: "Day 171 through Day 174 paid pilot launch readiness planning chain is summarized.",
        status: phaseSummary.checkpointStatus === "CHECKPOINT_READY" ? "VERIFIED" : "BLOCKED",
        evidence: [
          "Day 171: Paid Pilot Launch Readiness Planning Contract v1.",
          "Day 172: Paid Pilot Launch Readiness Planning Validator v1.",
          "Day 173: Paid Pilot Launch Readiness Planning Summary v1.",
          "Day 174: Paid Pilot Launch Readiness Planning Checkpoint v1."
        ]
      },
      {
        id: "day-175-phase-summary-checkpoint",
        title: "Day 175 paid pilot launch readiness planning phase summary is ready.",
        status: phaseSummary.status === "PHASE_SUMMARY_READY" ? "VERIFIED" : "BLOCKED",
        evidence: [
          phaseSummary.id,
          `Phase summary status: ${phaseSummary.status}.`
        ]
      },
      {
        id: "day-176-validator-checkpoint",
        title: "Day 176 paid pilot launch readiness planning phase summary validator passed.",
        status: validationReport.passed ? "VERIFIED" : "BLOCKED",
        evidence: [
          validationReport.id,
          `Validator passed: ${validationReport.passed}.`
        ]
      },
      {
        id: "execution-lock-checkpoint",
        title: "Live paid pilot execution remains locked.",
        status: "LOCKED",
        evidence: phaseSummary.blockedExecutionActions
      },
      {
        id: "nexus-laws-checkpoint",
        title: "Locked NEXUS laws remain preserved across the paid pilot launch readiness planning phase.",
        status: "VERIFIED",
        evidence: phaseSummary.preservedLaws
      }
    ],
    completedArtifactChain: [
      "Day 171: Paid Pilot Launch Readiness Planning Contract v1.",
      "Day 172: Paid Pilot Launch Readiness Planning Validator v1.",
      "Day 173: Paid Pilot Launch Readiness Planning Summary v1.",
      "Day 174: Paid Pilot Launch Readiness Planning Checkpoint v1.",
      "Day 175: Paid Pilot Launch Readiness Planning Phase Summary v1.",
      "Day 176: Paid Pilot Launch Readiness Planning Phase Summary Validator v1."
    ],
    blockedExecutionActions: phaseSummary.blockedExecutionActions,
    preservedLaws: phaseSummary.preservedLaws,
    nextAllowedStep:
      "Continue with a safe planning-only closeout summary or another read-only paid pilot launch readiness planning artifact.",
    nextBlockedStep:
      "Do not activate subscriptions, write entitlements, execute payments, create invoices, send messages, write customer data, call AI models, persist audits, execute recovery, or connect to live business software.",
    safetyBoundary:
      "This phase checkpoint is read-only and verifies only static paid pilot launch readiness planning artifacts. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
