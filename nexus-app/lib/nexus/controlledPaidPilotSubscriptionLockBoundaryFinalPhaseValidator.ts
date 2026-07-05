import { getControlledPaidPilotSubscriptionLockBoundaryFinalPhaseSummary } from "./controlledPaidPilotSubscriptionLockBoundaryFinalPhaseSummary";

type FinalPhaseValidatorStatus = "pass" | "fail";

type FinalPhaseValidatorCheck = {
  id: string;
  label: string;
  status: FinalPhaseValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryFinalPhaseValidator = {
  finalPhaseValidatorId: "controlled-paid-pilot-subscription-lock-boundary-final-phase-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Phase Validator v1";
  mode: "read-only-preview-final-phase-validator";
  day: 251;
  overallStatus: FinalPhaseValidatorStatus;
  validatedFinalPhaseSummaryId: "controlled-paid-pilot-subscription-lock-boundary-final-phase-summary-v1";
  checks: FinalPhaseValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): FinalPhaseValidatorCheck {
  return {
    id,
    label,
    status: "pass",
    evidence,
  };
}

function fail(
  id: string,
  label: string,
  evidence: string
): FinalPhaseValidatorCheck {
  return {
    id,
    label,
    status: "fail",
    evidence,
  };
}

function includesAll(source: string[], required: string[]) {
  return required.every((item) => source.includes(item));
}

export function validateControlledPaidPilotSubscriptionLockBoundaryFinalPhaseSummary(): ControlledPaidPilotSubscriptionLockBoundaryFinalPhaseValidator {
  const summary =
    getControlledPaidPilotSubscriptionLockBoundaryFinalPhaseSummary();

  const requiredForbiddenActions = [
    "No launch authorization.",
    "No subscription activation.",
    "No subscription mutation.",
    "No payment execution.",
    "No invoice creation.",
    "No entitlement writes.",
    "No customer data writes.",
    "No real DB customer memory read/write.",
    "No audit persistence.",
    "No approve/reject execution.",
    "No owner override execution.",
    "No recovery execution.",
    "No rollback execution.",
    "No message sending.",
    "No third-party mutation.",
    "No AI model calls.",
  ];

  const checks: FinalPhaseValidatorCheck[] = [
    summary.mode === "read-only-preview-final-phase-summary"
      ? pass(
          "summary-mode",
          "Final phase summary remains read-only preview only",
          "Mode is read-only-preview-final-phase-summary."
        )
      : fail(
          "summary-mode",
          "Final phase summary remains read-only preview only",
          `Unexpected mode: ${summary.mode}`
        ),

    summary.status === "final-phase-summary-ready"
      ? pass(
          "summary-status",
          "Final phase summary is ready for planning only",
          "Status is final-phase-summary-ready."
        )
      : fail(
          "summary-status",
          "Final phase summary is ready for planning only",
          `Unexpected status: ${summary.status}`
        ),

    summary.upstreamArtifacts.closeoutCompletionCloseoutStatus ===
      "closeout-completion-closeout-ready"
      ? pass(
          "upstream-closeout-completion-closeout",
          "Closeout completion closeout status is valid",
          "Upstream closeout completion closeout status is closeout-completion-closeout-ready."
        )
      : fail(
          "upstream-closeout-completion-closeout",
          "Closeout completion closeout status is valid",
          `Unexpected upstream status: ${summary.upstreamArtifacts.closeoutCompletionCloseoutStatus}`
        ),

    summary.finalPhaseChainSummary.some(
      (item) =>
        item.id === "day224-through-day250-summarized" &&
        item.status === "summarized"
    ) &&
    summary.finalPhaseChainSummary.some(
      (item) =>
        item.id === "closeout-completion-closeout-confirmed" &&
        item.status === "confirmed"
    ) &&
    summary.finalPhaseChainSummary.some(
      (item) =>
        item.id === "final-phase-planning-complete" &&
        item.status === "complete"
    ) &&
    summary.finalPhaseChainSummary.some(
      (item) =>
        item.id === "live-execution-not-enabled" &&
        item.status === "blocked"
    )
      ? pass(
          "final-phase-chain-summary",
          "Day 224 through Day 250 chain is summarized for planning only",
          "Final phase chain confirms planning-only completion and no live execution."
        )
      : fail(
          "final-phase-chain-summary",
          "Day 224 through Day 250 chain is summarized for planning only",
          "Final phase chain summary is incomplete."
        ),

    summary.launchStatusSummary.some(
      (item) => item.id === "launch-not-authorized" && item.status === "blocked"
    ) &&
    summary.launchStatusSummary.some(
      (item) =>
        item.id === "future-execution-architecture-required" &&
        item.status === "required"
    ) &&
    summary.launchStatusSummary.some(
      (item) =>
        item.id === "owner-launch-review-required" &&
        item.status === "required"
    ) &&
    summary.launchStatusSummary.some(
      (item) =>
        item.id === "launch-readiness-notice-required" &&
        item.status === "required"
    )
      ? pass(
          "launch-status-summary",
          "Launch remains blocked until execution architecture and owner launch review",
          "Launch is not authorized; execution architecture, owner review, and launch readiness notice are required."
        )
      : fail(
          "launch-status-summary",
          "Launch remains blocked until execution architecture and owner launch review",
          "One or more launch status safeguards are missing."
        ),

    summary.lockedVisionSummary.some(
      (item) =>
        item.id === "owner-controlled-operating-layer" &&
        item.status === "confirmed"
    ) &&
    summary.lockedVisionSummary.some(
      (item) =>
        item.id === "not-chatbot-crm-erp-zapier-clone" &&
        item.status === "confirmed"
    ) &&
    summary.lockedVisionSummary.some(
      (item) =>
        item.id === "controlled-paid-pilot-discipline" &&
        item.status === "confirmed"
    )
      ? pass(
          "locked-nexus-vision",
          "Locked NEXUS vision is preserved",
          "Owner-controlled operating layer, non-clone identity, and controlled paid pilot discipline are confirmed."
        )
      : fail(
          "locked-nexus-vision",
          "Locked NEXUS vision is preserved",
          "One or more locked NEXUS vision confirmations are missing."
        ),

    summary.subscriptionLockSummary.some(
      (item) => item.id === "unknown-state-locked" && item.status === "locked"
    ) &&
    summary.subscriptionLockSummary.some(
      (item) =>
        item.id === "missing-entitlement-locked" && item.status === "locked"
    ) &&
    summary.subscriptionLockSummary.some(
      (item) =>
        item.id === "unapproved-boundary-locked" && item.status === "locked"
    ) &&
    summary.subscriptionLockSummary.some(
      (item) =>
        item.id === "billing-ambiguity-locked" && item.status === "locked"
    )
      ? pass(
          "subscription-lock-summary",
          "Subscription lock remains locked-by-default",
          "Unknown state, missing entitlement, unapproved boundary, and billing ambiguity remain locked."
        )
      : fail(
          "subscription-lock-summary",
          "Subscription lock remains locked-by-default",
          "One or more subscription lock summaries are missing."
        ),

    summary.monetizationSafetySummary.some(
      (item) =>
        item.id === "payment-execution-blocked" && item.status === "blocked"
    ) &&
    summary.monetizationSafetySummary.some(
      (item) =>
        item.id === "invoice-generation-blocked" && item.status === "blocked"
    ) &&
    summary.monetizationSafetySummary.some(
      (item) =>
        item.id === "subscription-mutation-blocked" && item.status === "blocked"
    ) &&
    summary.monetizationSafetySummary.some(
      (item) =>
        item.id === "entitlement-write-blocked" && item.status === "blocked"
    )
      ? pass(
          "monetization-safety-summary",
          "Monetization execution remains blocked",
          "Payment, invoice, subscription mutation, and entitlement writes remain blocked."
        )
      : fail(
          "monetization-safety-summary",
          "Monetization execution remains blocked",
          "One or more monetization safety blocks are missing."
        ),

    summary.ownerControlSummary.some(
      (item) => item.id === "owner-approval-required" && item.status === "required"
    ) &&
    summary.ownerControlSummary.some(
      (item) =>
        item.id === "manual-owner-override-planning-only" &&
        item.status === "confirmed"
    ) &&
    summary.ownerControlSummary.some(
      (item) =>
        item.id === "approve-reject-execution-blocked" &&
        item.status === "blocked"
    )
      ? pass(
          "owner-control-summary",
          "Owner approval is required and owner decision execution is blocked",
          "Owner approval is required, owner override remains planning-only, and approve/reject execution is blocked."
        )
      : fail(
          "owner-control-summary",
          "Owner approval is required and owner decision execution is blocked",
          "One or more owner-control summaries are missing."
        ),

    summary.safetyLayerSummary.some(
      (item) => item.id === "zero-damage-preserved" && item.status === "confirmed"
    ) &&
    summary.safetyLayerSummary.some(
      (item) => item.id === "zero-stop-preserved" && item.status === "confirmed"
    ) &&
    summary.safetyLayerSummary.some(
      (item) => item.id === "safe-stop-required" && item.status === "required"
    ) &&
    summary.safetyLayerSummary.some(
      (item) =>
        item.id === "manual-escalation-required" && item.status === "required"
    )
      ? pass(
          "safety-layer-summary",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "Safety layer summary requirements are valid."
        )
      : fail(
          "safety-layer-summary",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "One or more safety layer summaries are missing."
        ),

    summary.auditFallbackRollbackSummary.some(
      (item) => item.id === "audit-readiness-only" && item.status === "confirmed"
    ) &&
    summary.auditFallbackRollbackSummary.some(
      (item) => item.id === "fallback-to-locked" && item.status === "confirmed"
    ) &&
    summary.auditFallbackRollbackSummary.some(
      (item) =>
        item.id === "rollback-readiness-planning-only" &&
        item.status === "confirmed"
    ) &&
    summary.auditFallbackRollbackSummary.some(
      (item) =>
        item.id === "recovery-execution-blocked" && item.status === "blocked"
    )
      ? pass(
          "audit-fallback-rollback-summary",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "Audit is readiness-only, fallback is locked, rollback is planning-only, and recovery execution is blocked."
        )
      : fail(
          "audit-fallback-rollback-summary",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "One or more audit/fallback/rollback summaries are missing."
        ),

    includesAll(summary.finalPhaseForbiddenExecution, requiredForbiddenActions)
      ? pass(
          "forbidden-execution-summary",
          "All forbidden execution classes remain blocked",
          "Final phase summary includes every required forbidden execution class, including no launch authorization."
        )
      : fail(
          "forbidden-execution-summary",
          "All forbidden execution classes remain blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(summary.finalPhaseBoundary.summarizedFor, [
      "Read-only final phase summary.",
      "Controlled paid pilot subscription lock planning.",
      "Owner review preparation.",
      "Subscription lock boundary documentation.",
      "Future execution architecture prerequisite mapping.",
      "Safety and monetization discipline documentation.",
    ]) &&
    includesAll(summary.finalPhaseBoundary.notSummarizedFor, [
      "Public launch authorization.",
      "Live paid pilot activation.",
      "Live subscription unlock.",
      "Payment processing.",
      "Invoice generation.",
      "Entitlement mutation.",
      "Customer-impacting execution.",
      "Real customer memory read/write.",
      "Audit persistence.",
      "Third-party mutation.",
      "AI-generated customer response execution.",
    ])
      ? pass(
          "final-phase-boundary",
          "Final phase boundary is planning-only and explicitly not launch",
          "Final phase summary is only for read-only planning and explicitly excludes public launch and live execution."
        )
      : fail(
          "final-phase-boundary",
          "Final phase boundary is planning-only and explicitly not launch",
          "Final phase boundary is incomplete."
        ),
  ];

  const overallStatus: FinalPhaseValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    finalPhaseValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-final-phase-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Phase Validator v1",
    mode: "read-only-preview-final-phase-validator",
    day: 251,
    overallStatus,
    validatedFinalPhaseSummaryId: summary.finalPhaseSummaryId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary final phase summary validated as planning-only, launch-blocked, locked-by-default, owner-controlled, monetization-safe, audit-ready for review only, fallback-aware, rollback-aware, and non-executing."
        : "Controlled paid pilot subscription lock boundary final phase validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 252: NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Phase Checkpoint v1"
        : "Stop and manually review final phase validator failure before continuing.",
  };
}
