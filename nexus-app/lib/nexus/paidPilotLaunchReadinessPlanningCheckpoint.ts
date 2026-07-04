import { getPaidPilotLaunchReadinessPlanningSummary } from "./paidPilotLaunchReadinessPlanningSummary";

export type PaidPilotLaunchReadinessPlanningCheckpointStatus =
  | "CHECKPOINT_READY"
  | "CHECKPOINT_BLOCKED";

export type PaidPilotLaunchReadinessPlanningCheckpointItem = {
  id: string;
  title: string;
  status: "LOCKED" | "VERIFIED" | "BLOCKED";
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningCheckpoint = {
  id: string;
  day: 174;
  name: string;
  phase: string;
  mode: string;
  status: PaidPilotLaunchReadinessPlanningCheckpointStatus;
  sourceSummaryId: string;
  sourceValidatorPassed: boolean;
  checkpointItems: PaidPilotLaunchReadinessPlanningCheckpointItem[];
  blockedExecutionActions: string[];
  preservedLaws: string[];
  nextAllowedStep: string;
  nextBlockedStep: string;
  safetyBoundary: string;
};

export function getPaidPilotLaunchReadinessPlanningCheckpoint(): PaidPilotLaunchReadinessPlanningCheckpoint {
  const summary = getPaidPilotLaunchReadinessPlanningSummary();
  const checkpointReady = summary.status === "SUMMARY_READY" && summary.validatorPassed;

  return {
    id: "paid-pilot-launch-readiness-planning-checkpoint-v1",
    day: 174,
    name: "NEXUS Paid Pilot Launch Readiness Planning Checkpoint v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-checkpoint-preview-only",
    status: checkpointReady ? "CHECKPOINT_READY" : "CHECKPOINT_BLOCKED",
    sourceSummaryId: summary.id,
    sourceValidatorPassed: summary.validatorPassed,
    checkpointItems: [
      {
        id: "day-171-contract-checkpoint",
        title: "Day 171 paid pilot launch readiness planning contract is present.",
        status: "VERIFIED",
        evidence: [
          summary.sourceContractId,
          "Contract remains read-only preview-only and planning-only."
        ]
      },
      {
        id: "day-172-validator-checkpoint",
        title: "Day 172 validator passed before checkpoint close.",
        status: summary.validatorPassed ? "VERIFIED" : "BLOCKED",
        evidence: [
          summary.sourceValidatorId,
          `Validator passed: ${summary.validatorPassed}.`
        ]
      },
      {
        id: "day-173-summary-checkpoint",
        title: "Day 173 paid pilot launch readiness planning summary is present.",
        status: summary.status === "SUMMARY_READY" ? "VERIFIED" : "BLOCKED",
        evidence: [
          summary.id,
          `Summary status: ${summary.status}.`
        ]
      },
      {
        id: "execution-boundary-checkpoint",
        title: "No live paid pilot execution is allowed from this planning phase.",
        status: "LOCKED",
        evidence: summary.blockedExecutionActions
      },
      {
        id: "nexus-laws-checkpoint",
        title: "Locked NEXUS laws remain preserved for paid pilot launch readiness.",
        status: "VERIFIED",
        evidence: summary.preservedLaws
      }
    ],
    blockedExecutionActions: summary.blockedExecutionActions,
    preservedLaws: summary.preservedLaws,
    nextAllowedStep:
      "Continue with a safe paid pilot launch readiness phase summary or controlled planning artifact only.",
    nextBlockedStep:
      "Do not activate subscriptions, write entitlements, execute payments, create invoices, send messages, write customer data, call AI models, or connect to live business software.",
    safetyBoundary:
      "This checkpoint is read-only and verifies only static paid pilot launch readiness planning artifacts. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
