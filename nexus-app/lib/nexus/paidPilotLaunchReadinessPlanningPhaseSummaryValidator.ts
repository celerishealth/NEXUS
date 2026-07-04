import { getPaidPilotLaunchReadinessPlanningPhaseSummary } from "./paidPilotLaunchReadinessPlanningPhaseSummary";

export type PaidPilotLaunchReadinessPlanningPhaseSummaryValidatorCheckStatus =
  | "PASSED"
  | "FAILED";

export type PaidPilotLaunchReadinessPlanningPhaseSummaryValidatorCheck = {
  id: string;
  title: string;
  status: PaidPilotLaunchReadinessPlanningPhaseSummaryValidatorCheckStatus;
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningPhaseSummaryValidationReport = {
  id: string;
  day: 176;
  name: string;
  phase: string;
  mode: string;
  sourcePhaseSummaryId: string;
  passed: boolean;
  checks: PaidPilotLaunchReadinessPlanningPhaseSummaryValidatorCheck[];
  blockedExecutionActionsVerified: string[];
  preservedLawsVerified: string[];
  safetyBoundary: string;
};

const requiredBlockedActions = [
  "approve owner decisions",
  "reject owner decisions",
  "execute payments",
  "create invoices",
  "activate subscriptions",
  "write entitlements",
  "send messages",
  "write customer data",
  "read or write real database memory",
  "persist audit events",
  "execute recovery",
  "call AI models",
  "connect to live business software"
];

const requiredPreservedLaws = [
  "Owner Approval",
  "Safety Layer",
  "Zero Damage",
  "Zero Stop",
  "Audit Logs discipline",
  "Customer Memory boundary discipline",
  "Fallback/Recovery planning",
  "Subscription Lock",
  "Shadow Mode",
  "Read-only pilot discipline",
  "Trust-first architecture"
];

const requiredArtifactDays = [
  "Day 171",
  "Day 172",
  "Day 173",
  "Day 174"
];

function includesEvery(source: string[], required: string[]) {
  return required.every((item) => source.includes(item));
}

export function getPaidPilotLaunchReadinessPlanningPhaseSummaryValidationReport(): PaidPilotLaunchReadinessPlanningPhaseSummaryValidationReport {
  const phaseSummary = getPaidPilotLaunchReadinessPlanningPhaseSummary();
  const artifactChainSection = phaseSummary.phaseSummarySections.find(
    (section) => section.id === "artifact-chain-summary"
  );
  const executionBoundarySection = phaseSummary.phaseSummarySections.find(
    (section) => section.id === "execution-boundary-summary"
  );
  const ownerControlSection = phaseSummary.phaseSummarySections.find(
    (section) => section.id === "owner-control-summary"
  );

  const hasReadOnlyMode =
    phaseSummary.mode === "read-only-paid-pilot-launch-readiness-planning-phase-summary-preview-only";
  const hasReadyStatus = phaseSummary.status === "PHASE_SUMMARY_READY";
  const hasCheckpointReady = phaseSummary.checkpointStatus === "CHECKPOINT_READY";
  const hasArtifactChain = requiredArtifactDays.every((day) =>
    artifactChainSection?.items.some((item) => item.includes(day))
  );
  const hasBlockedActions = includesEvery(phaseSummary.blockedExecutionActions, requiredBlockedActions);
  const hasExecutionBoundarySection = includesEvery(executionBoundarySection?.items ?? [], requiredBlockedActions);
  const hasPreservedLaws = includesEvery(phaseSummary.preservedLaws, requiredPreservedLaws);
  const hasOwnerControlSection =
    ownerControlSection?.items.includes("Paid pilot launch planning remains read-only.") === true &&
    ownerControlSection.items.includes("Owner Approval remains mandatory before risky execution.") &&
    ownerControlSection.items.includes("Subscription Lock remains planning-only.") &&
    ownerControlSection.items.includes("No customer-facing execution is allowed from this phase.");
  const hasSafetyBoundary =
    phaseSummary.safetyBoundary.includes("read-only") &&
    phaseSummary.safetyBoundary.includes("does not approve") &&
    phaseSummary.safetyBoundary.includes("call AI models");

  const checks: PaidPilotLaunchReadinessPlanningPhaseSummaryValidatorCheck[] = [
    {
      id: "read-only-mode-check",
      title: "Phase summary must remain read-only preview-only.",
      status: hasReadOnlyMode ? "PASSED" : "FAILED",
      evidence: [phaseSummary.mode]
    },
    {
      id: "phase-summary-status-check",
      title: "Phase summary must be ready before phase validation passes.",
      status: hasReadyStatus ? "PASSED" : "FAILED",
      evidence: [phaseSummary.status]
    },
    {
      id: "checkpoint-status-check",
      title: "Source checkpoint must be ready.",
      status: hasCheckpointReady ? "PASSED" : "FAILED",
      evidence: [phaseSummary.checkpointStatus]
    },
    {
      id: "artifact-chain-check",
      title: "Phase summary must include Day 171 through Day 174 artifact chain.",
      status: hasArtifactChain ? "PASSED" : "FAILED",
      evidence: artifactChainSection?.items ?? []
    },
    {
      id: "blocked-actions-check",
      title: "Phase summary must preserve all blocked execution actions.",
      status: hasBlockedActions && hasExecutionBoundarySection ? "PASSED" : "FAILED",
      evidence: phaseSummary.blockedExecutionActions
    },
    {
      id: "preserved-laws-check",
      title: "Phase summary must preserve locked NEXUS laws.",
      status: hasPreservedLaws ? "PASSED" : "FAILED",
      evidence: phaseSummary.preservedLaws
    },
    {
      id: "owner-control-check",
      title: "Phase summary must preserve owner-controlled launch readiness discipline.",
      status: hasOwnerControlSection ? "PASSED" : "FAILED",
      evidence: ownerControlSection?.items ?? []
    },
    {
      id: "safety-boundary-check",
      title: "Phase summary safety boundary must block execution behavior.",
      status: hasSafetyBoundary ? "PASSED" : "FAILED",
      evidence: [phaseSummary.safetyBoundary]
    }
  ];

  return {
    id: "paid-pilot-launch-readiness-planning-phase-summary-validator-v1",
    day: 176,
    name: "NEXUS Paid Pilot Launch Readiness Planning Phase Summary Validator v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-phase-summary-validator-preview-only",
    sourcePhaseSummaryId: phaseSummary.id,
    passed: checks.every((check) => check.status === "PASSED"),
    checks,
    blockedExecutionActionsVerified: requiredBlockedActions,
    preservedLawsVerified: requiredPreservedLaws,
    safetyBoundary:
      "This validator is read-only and validates only the static Day 175 phase summary. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
