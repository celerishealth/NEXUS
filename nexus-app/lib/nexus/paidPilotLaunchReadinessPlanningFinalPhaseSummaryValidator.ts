import { getPaidPilotLaunchReadinessPlanningFinalPhaseSummary } from "./paidPilotLaunchReadinessPlanningFinalPhaseSummary";

export type PaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidatorCheckStatus =
  | "PASSED"
  | "FAILED";

export type PaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidatorCheck = {
  id: string;
  title: string;
  status: PaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidatorCheckStatus;
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidationReport = {
  id: string;
  day: 182;
  name: string;
  phase: string;
  mode: string;
  sourceFinalPhaseSummaryId: string;
  passed: boolean;
  checks: PaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidatorCheck[];
  artifactChainVerified: string[];
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
  "Day 176",
  "Day 177",
  "Day 178",
  "Day 179",
  "Day 180"
];

const requiredFinalSectionIds = [
  "final-artifact-chain-summary",
  "closeout-checkpoint-summary",
  "execution-boundary-summary",
  "nexus-laws-summary",
  "launch-readiness-summary"
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

export function getPaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidationReport(): PaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidationReport {
  const finalPhaseSummary = getPaidPilotLaunchReadinessPlanningFinalPhaseSummary();

  const finalSectionIds = finalPhaseSummary.finalSummarySections.map((section) => section.id);
  const executionBoundarySection = finalPhaseSummary.finalSummarySections.find(
    (section) => section.id === "execution-boundary-summary"
  );
  const nexusLawsSection = finalPhaseSummary.finalSummarySections.find(
    (section) => section.id === "nexus-laws-summary"
  );
  const launchReadinessSection = finalPhaseSummary.finalSummarySections.find(
    (section) => section.id === "launch-readiness-summary"
  );

  const hasReadOnlyMode =
    finalPhaseSummary.mode === "read-only-paid-pilot-launch-readiness-planning-final-phase-summary-preview-only";
  const hasReadyStatus = finalPhaseSummary.status === "FINAL_PHASE_SUMMARY_READY";
  const hasReadyCloseoutCheckpoint =
    finalPhaseSummary.sourceCloseoutCheckpointStatus === "CLOSEOUT_CHECKPOINT_READY";
  const hasArtifactChain = requiredArtifactDays.every((day) =>
    finalPhaseSummary.finalArtifactChain.some((item) => item.includes(day))
  );
  const hasFinalSections = includesEvery(finalSectionIds, requiredFinalSectionIds);
  const hasBlockedActions = includesEvery(finalPhaseSummary.blockedExecutionActions, requiredBlockedActions);
  const hasExecutionBoundarySection = includesEvery(executionBoundarySection?.items ?? [], requiredBlockedActions);
  const hasPreservedLaws = includesEvery(finalPhaseSummary.preservedLaws, requiredPreservedLaws);
  const hasNexusLawsSection = includesEvery(nexusLawsSection?.items ?? [], requiredPreservedLaws);
  const hasLaunchReadinessSection =
    launchReadinessSection?.items.includes("Paid pilot launch readiness planning artifacts are organized for final validation.") === true &&
    launchReadinessSection.items.includes("Read-only planning discipline remains active.") &&
    launchReadinessSection.items.includes("No live paid pilot execution architecture has been activated.") &&
    launchReadinessSection.items.includes("Owner Approval remains mandatory before risky execution.") &&
    launchReadinessSection.items.includes("Subscription Lock remains planning-only until explicit safe activation architecture exists.");
  const hasFinalPhaseDecision = finalPhaseSummary.finalPhaseDecision.includes(
    "ready for final validation"
  );
  const hasNextAllowedStep = finalPhaseSummary.nextAllowedStep.includes(
    "final phase summary validator"
  );
  const hasSafetyBoundary =
    finalPhaseSummary.safetyBoundary.includes("read-only") &&
    finalPhaseSummary.safetyBoundary.includes("does not approve") &&
    finalPhaseSummary.safetyBoundary.includes("call AI models") &&
    finalPhaseSummary.safetyBoundary.includes("connect to live business software");

  const checks: PaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidatorCheck[] = [
    {
      id: "read-only-mode-check",
      title: "Final phase summary must remain read-only preview-only.",
      status: hasReadOnlyMode ? "PASSED" : "FAILED",
      evidence: [finalPhaseSummary.mode]
    },
    {
      id: "final-phase-summary-status-check",
      title: "Final phase summary must be ready before validation passes.",
      status: hasReadyStatus ? "PASSED" : "FAILED",
      evidence: [finalPhaseSummary.status]
    },
    {
      id: "source-closeout-checkpoint-status-check",
      title: "Source closeout checkpoint must be ready.",
      status: hasReadyCloseoutCheckpoint ? "PASSED" : "FAILED",
      evidence: [finalPhaseSummary.sourceCloseoutCheckpointStatus]
    },
    {
      id: "artifact-chain-check",
      title: "Final phase summary must include Day 171 through Day 180 artifact chain.",
      status: hasArtifactChain ? "PASSED" : "FAILED",
      evidence: finalPhaseSummary.finalArtifactChain
    },
    {
      id: "final-sections-check",
      title: "Final phase summary must include all required final summary sections.",
      status: hasFinalSections ? "PASSED" : "FAILED",
      evidence: finalSectionIds
    },
    {
      id: "blocked-execution-actions-check",
      title: "Final phase summary must preserve all blocked execution actions.",
      status: hasBlockedActions && hasExecutionBoundarySection ? "PASSED" : "FAILED",
      evidence: finalPhaseSummary.blockedExecutionActions
    },
    {
      id: "preserved-laws-check",
      title: "Final phase summary must preserve locked NEXUS laws.",
      status: hasPreservedLaws && hasNexusLawsSection ? "PASSED" : "FAILED",
      evidence: finalPhaseSummary.preservedLaws
    },
    {
      id: "launch-readiness-discipline-check",
      title: "Final phase summary must preserve paid pilot launch readiness discipline.",
      status: hasLaunchReadinessSection ? "PASSED" : "FAILED",
      evidence: launchReadinessSection?.items ?? []
    },
    {
      id: "final-phase-decision-check",
      title: "Final phase summary must allow final validation only as the next step.",
      status: hasFinalPhaseDecision && hasNextAllowedStep ? "PASSED" : "FAILED",
      evidence: [finalPhaseSummary.finalPhaseDecision, finalPhaseSummary.nextAllowedStep]
    },
    {
      id: "safety-boundary-check",
      title: "Final phase summary safety boundary must block execution behavior.",
      status: hasSafetyBoundary ? "PASSED" : "FAILED",
      evidence: [finalPhaseSummary.safetyBoundary]
    }
  ];

  return {
    id: "paid-pilot-launch-readiness-planning-final-phase-summary-validator-v1",
    day: 182,
    name: "NEXUS Paid Pilot Launch Readiness Planning Final Phase Summary Validator v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-final-phase-summary-validator-preview-only",
    sourceFinalPhaseSummaryId: finalPhaseSummary.id,
    passed: checks.every((check) => check.status === "PASSED"),
    checks,
    artifactChainVerified: requiredArtifactDays,
    blockedExecutionActionsVerified: requiredBlockedActions,
    preservedLawsVerified: requiredPreservedLaws,
    safetyBoundary:
      "This validator is read-only and validates only the static Day 181 final phase summary. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
