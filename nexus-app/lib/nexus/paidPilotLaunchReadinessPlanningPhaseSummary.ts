import { getPaidPilotLaunchReadinessPlanningCheckpoint } from "./paidPilotLaunchReadinessPlanningCheckpoint";

export type PaidPilotLaunchReadinessPlanningPhaseSummaryStatus =
  | "PHASE_SUMMARY_READY"
  | "PHASE_SUMMARY_BLOCKED";

export type PaidPilotLaunchReadinessPlanningPhaseSummarySection = {
  id: string;
  title: string;
  items: string[];
};

export type PaidPilotLaunchReadinessPlanningPhaseSummary = {
  id: string;
  day: 175;
  name: string;
  phase: string;
  mode: string;
  status: PaidPilotLaunchReadinessPlanningPhaseSummaryStatus;
  sourceCheckpointId: string;
  checkpointStatus: string;
  phaseSummarySections: PaidPilotLaunchReadinessPlanningPhaseSummarySection[];
  blockedExecutionActions: string[];
  preservedLaws: string[];
  nextAllowedStep: string;
  nextBlockedStep: string;
  safetyBoundary: string;
};

export function getPaidPilotLaunchReadinessPlanningPhaseSummary(): PaidPilotLaunchReadinessPlanningPhaseSummary {
  const checkpoint = getPaidPilotLaunchReadinessPlanningCheckpoint();
  const ready = checkpoint.status === "CHECKPOINT_READY";

  return {
    id: "paid-pilot-launch-readiness-planning-phase-summary-v1",
    day: 175,
    name: "NEXUS Paid Pilot Launch Readiness Planning Phase Summary v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-phase-summary-preview-only",
    status: ready ? "PHASE_SUMMARY_READY" : "PHASE_SUMMARY_BLOCKED",
    sourceCheckpointId: checkpoint.id,
    checkpointStatus: checkpoint.status,
    phaseSummarySections: [
      {
        id: "artifact-chain-summary",
        title: "Paid pilot launch readiness planning artifact chain",
        items: [
          "Day 171: Paid Pilot Launch Readiness Planning Contract v1.",
          "Day 172: Paid Pilot Launch Readiness Planning Validator v1.",
          "Day 173: Paid Pilot Launch Readiness Planning Summary v1.",
          "Day 174: Paid Pilot Launch Readiness Planning Checkpoint v1."
        ]
      },
      {
        id: "checkpoint-summary",
        title: "Checkpoint result",
        items: checkpoint.checkpointItems.map((item) => `${item.title} Status: ${item.status}.`)
      },
      {
        id: "execution-boundary-summary",
        title: "Execution boundary remains locked",
        items: checkpoint.blockedExecutionActions
      },
      {
        id: "owner-control-summary",
        title: "Owner-controlled launch readiness discipline",
        items: [
          "Paid pilot launch planning remains read-only.",
          "Owner Approval remains mandatory before risky execution.",
          "Subscription Lock remains planning-only.",
          "No customer-facing execution is allowed from this phase."
        ]
      }
    ],
    blockedExecutionActions: checkpoint.blockedExecutionActions,
    preservedLaws: checkpoint.preservedLaws,
    nextAllowedStep:
      "Continue with a validator for this phase summary or another safe planning-only artifact.",
    nextBlockedStep:
      "Do not activate subscriptions, write entitlements, execute payments, create invoices, send messages, write customer data, call AI models, or connect to live business software.",
    safetyBoundary:
      "This phase summary is read-only and summarizes only static paid pilot launch readiness planning artifacts. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
