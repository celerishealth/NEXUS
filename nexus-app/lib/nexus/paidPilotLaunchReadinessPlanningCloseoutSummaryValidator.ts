import { getPaidPilotLaunchReadinessPlanningCloseoutSummary } from "./paidPilotLaunchReadinessPlanningCloseoutSummary";

export type PaidPilotLaunchReadinessPlanningCloseoutSummaryValidatorCheckStatus =
  | "PASSED"
  | "FAILED";

export type PaidPilotLaunchReadinessPlanningCloseoutSummaryValidatorCheck = {
  id: string;
  title: string;
  status: PaidPilotLaunchReadinessPlanningCloseoutSummaryValidatorCheckStatus;
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningCloseoutSummaryValidationReport = {
  id: string;
  day: 179;
  name: string;
  phase: string;
  mode: string;
  sourceCloseoutSummaryId: string;
  passed: boolean;
  checks: PaidPilotLaunchReadinessPlanningCloseoutSummaryValidatorCheck[];
  blockedExecutionActionsVerified: string[];
  preservedLawsVerified: string[];
  safetyBoundary: string;
};

const requiredArtifactDays = [
  "Day 171",
  "Day 172",
  "Day 173",
  "Day 174",
  "Day 175",
  "Day 176"
];

const requiredCloseoutSectionIds = [
  "phase-artifact-chain-closeout",
  "checkpoint-closeout",
  "execution-boundary-closeout",
  "nexus-laws-closeout",
  "paid-pilot-discipline-closeout"
];

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

function includesEvery(source: string[], required: string[]) {
  return required.every((item) => source.includes(item));
}

export function getPaidPilotLaunchReadinessPlanningCloseoutSummaryValidationReport(): PaidPilotLaunchReadinessPlanningCloseoutSummaryValidationReport {
  const closeoutSummary = getPaidPilotLaunchReadinessPlanningCloseoutSummary();

  const closeoutSectionIds = closeoutSummary.closeoutSections.map((section) => section.id);
  const executionBoundarySection = closeoutSummary.closeoutSections.find(
    (section) => section.id === "execution-boundary-closeout"
  );
  const nexusLawsSection = closeoutSummary.closeoutSections.find(
    (section) => section.id === "nexus-laws-closeout"
  );
  const disciplineSection = closeoutSummary.closeoutSections.find(
    (section) => section.id === "paid-pilot-discipline-closeout"
  );

  const hasReadOnlyMode =
    closeoutSummary.mode === "read-only-paid-pilot-launch-readiness-planning-closeout-summary-preview-only";
  const hasReadyStatus = closeoutSummary.status === "CLOSEOUT_SUMMARY_READY";
  const hasReadySourceCheckpoint = closeoutSummary.sourcePhaseCheckpointStatus === "PHASE_CHECKPOINT_READY";
  const hasArtifactChain = requiredArtifactDays.every((day) =>
    closeoutSummary.completedArtifactChain.some((item) => item.includes(day))
  );
  const hasCloseoutSections = includesEvery(closeoutSectionIds, requiredCloseoutSectionIds);
  const hasBlockedActions = includesEvery(closeoutSummary.blockedExecutionActions, requiredBlockedActions);
  const hasExecutionBoundarySection = includesEvery(executionBoundarySection?.items ?? [], requiredBlockedActions);
  const hasPreservedLaws = includesEvery(closeoutSummary.preservedLaws, requiredPreservedLaws);
  const hasNexusLawsSection = includesEvery(nexusLawsSection?.items ?? [], requiredPreservedLaws);
  const hasDisciplineSection =
    disciplineSection?.items.includes("Planning artifacts are ready for closeout validation.") === true &&
    disciplineSection.items.includes("Pilot launch execution architecture has not been activated.") &&
    disciplineSection.items.includes("Owner Approval remains mandatory before risky execution.") &&
    disciplineSection.items.includes("Subscription Lock remains planning-only.") &&
    disciplineSection.items.includes("Read-only pilot discipline remains active.");
  const hasCloseoutDecision = closeoutSummary.phaseCloseoutDecision.includes(
    "can proceed to closeout validation"
  );
  const hasSafetyBoundary =
    closeoutSummary.safetyBoundary.includes("read-only") &&
    closeoutSummary.safetyBoundary.includes("does not approve") &&
    closeoutSummary.safetyBoundary.includes("call AI models") &&
    closeoutSummary.safetyBoundary.includes("connect to live business software");

  const checks: PaidPilotLaunchReadinessPlanningCloseoutSummaryValidatorCheck[] = [
    {
      id: "read-only-mode-check",
      title: "Closeout summary must remain read-only preview-only.",
      status: hasReadOnlyMode ? "PASSED" : "FAILED",
      evidence: [closeoutSummary.mode]
    },
    {
      id: "closeout-summary-status-check",
      title: "Closeout summary must be ready before validation passes.",
      status: hasReadyStatus ? "PASSED" : "FAILED",
      evidence: [closeoutSummary.status]
    },
    {
      id: "source-phase-checkpoint-status-check",
      title: "Source phase checkpoint must be ready.",
      status: hasReadySourceCheckpoint ? "PASSED" : "FAILED",
      evidence: [closeoutSummary.sourcePhaseCheckpointStatus]
    },
    {
      id: "artifact-chain-check",
      title: "Closeout summary must include Day 171 through Day 176 artifact chain.",
      status: hasArtifactChain ? "PASSED" : "FAILED",
      evidence: closeoutSummary.completedArtifactChain
    },
    {
      id: "closeout-sections-check",
      title: "Closeout summary must include all required closeout sections.",
      status: hasCloseoutSections ? "PASSED" : "FAILED",
      evidence: closeoutSectionIds
    },
    {
      id: "blocked-execution-actions-check",
      title: "Closeout summary must preserve all blocked execution actions.",
      status: hasBlockedActions && hasExecutionBoundarySection ? "PASSED" : "FAILED",
      evidence: closeoutSummary.blockedExecutionActions
    },
    {
      id: "preserved-laws-check",
      title: "Closeout summary must preserve locked NEXUS laws.",
      status: hasPreservedLaws && hasNexusLawsSection ? "PASSED" : "FAILED",
      evidence: closeoutSummary.preservedLaws
    },
    {
      id: "paid-pilot-discipline-check",
      title: "Closeout summary must preserve paid pilot launch readiness discipline.",
      status: hasDisciplineSection ? "PASSED" : "FAILED",
      evidence: disciplineSection?.items ?? []
    },
    {
      id: "closeout-decision-check",
      title: "Closeout summary must allow only closeout validation as the next step.",
      status: hasCloseoutDecision ? "PASSED" : "FAILED",
      evidence: [closeoutSummary.phaseCloseoutDecision]
    },
    {
      id: "safety-boundary-check",
      title: "Closeout summary safety boundary must block execution behavior.",
      status: hasSafetyBoundary ? "PASSED" : "FAILED",
      evidence: [closeoutSummary.safetyBoundary]
    }
  ];

  return {
    id: "paid-pilot-launch-readiness-planning-closeout-summary-validator-v1",
    day: 179,
    name: "NEXUS Paid Pilot Launch Readiness Planning Closeout Summary Validator v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-closeout-summary-validator-preview-only",
    sourceCloseoutSummaryId: closeoutSummary.id,
    passed: checks.every((check) => check.status === "PASSED"),
    checks,
    blockedExecutionActionsVerified: requiredBlockedActions,
    preservedLawsVerified: requiredPreservedLaws,
    safetyBoundary:
      "This validator is read-only and validates only the static Day 178 closeout summary. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
