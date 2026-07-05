import { getControlledPaidPilotSubscriptionLockBoundaryFinalPhaseCompletionSummary } from "./controlledPaidPilotSubscriptionLockBoundaryFinalPhaseCompletionSummary";

type FinalPhaseCompletionValidatorStatus = "pass" | "fail";

type FinalPhaseCompletionValidatorCheck = {
  id: string;
  label: string;
  status: FinalPhaseCompletionValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryFinalPhaseCompletionValidator = {
  finalPhaseCompletionValidatorId: "controlled-paid-pilot-subscription-lock-boundary-final-phase-completion-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Phase Completion Validator v1";
  mode: "read-only-preview-final-phase-completion-validator";
  day: 257;
  overallStatus: FinalPhaseCompletionValidatorStatus;
  validatedFinalPhaseCompletionSummaryId: "controlled-paid-pilot-subscription-lock-boundary-final-phase-completion-summary-v1";
  checks: FinalPhaseCompletionValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): FinalPhaseCompletionValidatorCheck {
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
): FinalPhaseCompletionValidatorCheck {
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

export function validateControlledPaidPilotSubscriptionLockBoundaryFinalPhaseCompletionSummary(): ControlledPaidPilotSubscriptionLockBoundaryFinalPhaseCompletionValidator {
  const summary =
    getControlledPaidPilotSubscriptionLockBoundaryFinalPhaseCompletionSummary();

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
    "No global trade order placement.",
    "No shipment booking.",
    "No customer commitment execution.",
    "No vendor/customer message sending.",
  ];

  const checks: FinalPhaseCompletionValidatorCheck[] = [
    summary.mode === "read-only-preview-final-phase-completion-summary"
      ? pass(
          "summary-mode",
          "Final phase completion summary remains read-only preview only",
          "Mode is read-only-preview-final-phase-completion-summary."
        )
      : fail(
          "summary-mode",
          "Final phase completion summary remains read-only preview only",
          `Unexpected mode: ${summary.mode}`
        ),

    summary.status === "final-phase-completion-summary-ready"
      ? pass(
          "summary-status",
          "Final phase completion summary is ready for planning only",
          "Status is final-phase-completion-summary-ready."
        )
      : fail(
          "summary-status",
          "Final phase completion summary is ready for planning only",
          `Unexpected status: ${summary.status}`
        ),

    summary.upstreamArtifacts.finalPhaseFinalCheckpointStatus ===
      "final-phase-final-checkpoint-ready"
      ? pass(
          "upstream-final-checkpoint",
          "Final phase final checkpoint status is valid",
          "Upstream final phase final checkpoint status is final-phase-final-checkpoint-ready."
        )
      : fail(
          "upstream-final-checkpoint",
          "Final phase final checkpoint status is valid",
          `Unexpected upstream status: ${summary.upstreamArtifacts.finalPhaseFinalCheckpointStatus}`
        ),

    summary.finalPhaseCompletionChainSummary.some(
      (item) =>
        item.id === "day224-through-day256-summarized" &&
        item.status === "summarized"
    ) &&
    summary.finalPhaseCompletionChainSummary.some(
      (item) =>
        item.id === "final-phase-final-checkpoint-confirmed" &&
        item.status === "confirmed"
    ) &&
    summary.finalPhaseCompletionChainSummary.some(
      (item) =>
        item.id === "planning-only-completion-confirmed" &&
        item.status === "complete"
    ) &&
    summary.finalPhaseCompletionChainSummary.some(
      (item) =>
        item.id === "live-execution-not-enabled" &&
        item.status === "blocked"
    )
      ? pass(
          "completion-chain-summary",
          "Day 224 through Day 256 completion chain is summarized for planning only",
          "Completion chain confirms planning-only completion and live execution not enabled."
        )
      : fail(
          "completion-chain-summary",
          "Day 224 through Day 256 completion chain is summarized for planning only",
          "Final phase completion chain summary is incomplete."
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
          "Launch remains blocked until future execution architecture and owner launch review",
          "Launch is not authorized; execution architecture, owner review, and launch readiness notice are required."
        )
      : fail(
          "launch-status-summary",
          "Launch remains blocked until future execution architecture and owner launch review",
          "One or more launch status summary checks are missing."
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

    summary.globalTradeOperatingLayerSummary.some(
      (item) =>
        item.id === "global-trade-layer-locked" &&
        item.status === "confirmed"
    ) &&
    summary.globalTradeOperatingLayerSummary.some(
      (item) =>
        item.id === "not-marketplace-clone" && item.status === "confirmed"
    ) &&
    summary.globalTradeOperatingLayerSummary.some(
      (item) =>
        item.id === "global-trade-planning-only" &&
        item.status === "confirmed"
    ) &&
    summary.globalTradeOperatingLayerSummary.some(
      (item) =>
        item.id === "global-trade-execution-blocked" &&
        item.status === "blocked"
    )
      ? pass(
          "global-trade-operating-layer",
          "NEXUS Global Trade Operating Layer is locked for future planning only",
          "Global trade layer is locked, not marketplace clone, planning-only, and execution-blocked."
        )
      : fail(
          "global-trade-operating-layer",
          "NEXUS Global Trade Operating Layer is locked for future planning only",
          "One or more global trade safeguards are missing."
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
          "One or more subscription lock summary checks are missing."
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
          "One or more monetization safety summary checks are missing."
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
          "One or more owner-control summary checks are missing."
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
          "One or more safety layer summary checks are missing."
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
          "One or more audit/fallback/rollback summary checks are missing."
        ),

    includesAll(summary.forbiddenExecutionSummary, requiredForbiddenActions)
      ? pass(
          "forbidden-execution-summary",
          "All forbidden execution classes remain blocked",
          "Final phase completion summary includes every required forbidden execution class, including global trade execution blocks."
        )
      : fail(
          "forbidden-execution-summary",
          "All forbidden execution classes remain blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(summary.completionBoundary.summarizedFor, [
      "Read-only final phase completion summary.",
      "Controlled paid pilot subscription lock planning.",
      "Owner review preparation.",
      "Subscription lock boundary documentation.",
      "Future execution architecture prerequisite mapping.",
      "Safety and monetization discipline documentation.",
      "Future NEXUS Global Trade Operating Layer planning lock.",
    ]) &&
    includesAll(summary.completionBoundary.notSummarizedFor, [
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
      "Global trade order placement.",
      "Shipment booking.",
      "Vendor/customer message sending.",
      "Customer commitment execution.",
    ])
      ? pass(
          "completion-boundary",
          "Completion boundary is planning-only and explicitly not launch",
          "Completion summary is only for read-only planning and explicitly excludes public launch, live execution, and global trade execution."
        )
      : fail(
          "completion-boundary",
          "Completion boundary is planning-only and explicitly not launch",
          "Completion boundary is incomplete."
        ),
  ];

  const overallStatus: FinalPhaseCompletionValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    finalPhaseCompletionValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-final-phase-completion-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Phase Completion Validator v1",
    mode: "read-only-preview-final-phase-completion-validator",
    day: 257,
    overallStatus,
    validatedFinalPhaseCompletionSummaryId:
      summary.finalPhaseCompletionSummaryId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary final phase completion summary validated as planning-only, launch-blocked, global-trade-execution-blocked, locked-by-default, owner-controlled, monetization-safe, audit-ready for review only, fallback-aware, rollback-aware, and non-executing."
        : "Controlled paid pilot subscription lock boundary final phase completion validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 258: NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Phase Completion Checkpoint v1"
        : "Stop and manually review final phase completion validator failure before continuing.",
  };
}
