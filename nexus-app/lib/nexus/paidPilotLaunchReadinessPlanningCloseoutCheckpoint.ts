import { getPaidPilotLaunchReadinessPlanningCloseoutSummary } from "./paidPilotLaunchReadinessPlanningCloseoutSummary";
import { getPaidPilotLaunchReadinessPlanningCloseoutSummaryValidationReport } from "./paidPilotLaunchReadinessPlanningCloseoutSummaryValidator";

export type PaidPilotLaunchReadinessPlanningCloseoutCheckpointStatus =
  | "CLOSEOUT_CHECKPOINT_READY"
  | "CLOSEOUT_CHECKPOINT_BLOCKED";

export type PaidPilotLaunchReadinessPlanningCloseoutCheckpointItem = {
  id: string;
  title: string;
  status: "VERIFIED" | "LOCKED" | "BLOCKED";
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningCloseoutCheckpoint = {
  id: string;
  day: 180;
  name: string;
  phase: string;
  mode: string;
  status: PaidPilotLaunchReadinessPlanningCloseoutCheckpointStatus;
  sourceCloseoutSummaryId: string;
  sourceValidatorId: string;
  validatorPassed: boolean;
  checkpointItems: PaidPilotLaunchReadinessPlanningCloseoutCheckpointItem[];
  completedArtifactChain: string[];
  blockedExecutionActions: string[];
  preservedLaws: string[];
  closeoutDecision: string;
  nextAllowedStep: string;
  nextBlockedStep: string;
  safetyBoundary: string;
};

export function getPaidPilotLaunchReadinessPlanningCloseoutCheckpoint(): PaidPilotLaunchReadinessPlanningCloseoutCheckpoint {
  const closeoutSummary = getPaidPilotLaunchReadinessPlanningCloseoutSummary();
  const validationReport = getPaidPilotLaunchReadinessPlanningCloseoutSummaryValidationReport();
  const ready = closeoutSummary.status === "CLOSEOUT_SUMMARY_READY" && validationReport.passed;

  return {
    id: "paid-pilot-launch-readiness-planning-closeout-checkpoint-v1",
    day: 180,
    name: "NEXUS Paid Pilot Launch Readiness Planning Closeout Checkpoint v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-closeout-checkpoint-preview-only",
    status: ready ? "CLOSEOUT_CHECKPOINT_READY" : "CLOSEOUT_CHECKPOINT_BLOCKED",
    sourceCloseoutSummaryId: closeoutSummary.id,
    sourceValidatorId: validationReport.id,
    validatorPassed: validationReport.passed,
    checkpointItems: [
      {
        id: "day-171-through-day-176-chain-checkpoint",
        title: "Day 171 through Day 176 paid pilot launch readiness planning chain is closed.",
        status: closeoutSummary.completedArtifactChain.length >= 6 ? "VERIFIED" : "BLOCKED",
        evidence: closeoutSummary.completedArtifactChain
      },
      {
        id: "day-178-closeout-summary-checkpoint",
        title: "Day 178 closeout summary is ready.",
        status: closeoutSummary.status === "CLOSEOUT_SUMMARY_READY" ? "VERIFIED" : "BLOCKED",
        evidence: [
          closeoutSummary.id,
          `Closeout summary status: ${closeoutSummary.status}.`
        ]
      },
      {
        id: "day-179-closeout-validator-checkpoint",
        title: "Day 179 closeout summary validator passed.",
        status: validationReport.passed ? "VERIFIED" : "BLOCKED",
        evidence: [
          validationReport.id,
          `Validator passed: ${validationReport.passed}.`
        ]
      },
      {
        id: "execution-boundary-checkpoint",
        title: "Live paid pilot execution remains locked after closeout checkpoint.",
        status: "LOCKED",
        evidence: closeoutSummary.blockedExecutionActions
      },
      {
        id: "nexus-laws-checkpoint",
        title: "Locked NEXUS laws remain preserved at closeout checkpoint.",
        status: "VERIFIED",
        evidence: closeoutSummary.preservedLaws
      }
    ],
    completedArtifactChain: [
      ...closeoutSummary.completedArtifactChain,
      "Day 178: Paid Pilot Launch Readiness Planning Closeout Summary v1.",
      "Day 179: Paid Pilot Launch Readiness Planning Closeout Summary Validator v1."
    ],
    blockedExecutionActions: closeoutSummary.blockedExecutionActions,
    preservedLaws: closeoutSummary.preservedLaws,
    closeoutDecision:
      ready
        ? "Paid pilot launch readiness planning closeout checkpoint is ready for final phase summary planning."
        : "Paid pilot launch readiness planning closeout checkpoint is blocked until closeout summary validation passes.",
    nextAllowedStep:
      "Continue with a safe read-only final phase summary or planning-only artifact before any real paid pilot execution architecture.",
    nextBlockedStep:
      "Do not activate subscriptions, write entitlements, execute payments, create invoices, send messages, write customer data, call AI models, persist audits, execute recovery, or connect to live business software.",
    safetyBoundary:
      "This closeout checkpoint is read-only and verifies only static paid pilot launch readiness planning artifacts. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
