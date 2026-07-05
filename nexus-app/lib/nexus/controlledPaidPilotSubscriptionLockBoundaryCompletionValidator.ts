import { getControlledPaidPilotSubscriptionLockBoundaryCompletionSummary } from "./controlledPaidPilotSubscriptionLockBoundaryCompletionSummary";

type CompletionValidatorStatus = "pass" | "fail";

type CompletionValidatorCheck = {
  id: string;
  label: string;
  status: CompletionValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryCompletionValidator = {
  completionValidatorId: "controlled-paid-pilot-subscription-lock-boundary-completion-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Completion Validator v1";
  mode: "read-only-preview-completion-validator";
  day: 232;
  overallStatus: CompletionValidatorStatus;
  validatedCompletionSummaryId: "controlled-paid-pilot-subscription-lock-boundary-completion-summary-v1";
  checks: CompletionValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): CompletionValidatorCheck {
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
): CompletionValidatorCheck {
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

export function validateControlledPaidPilotSubscriptionLockBoundaryCompletionSummary(): ControlledPaidPilotSubscriptionLockBoundaryCompletionValidator {
  const completionSummary =
    getControlledPaidPilotSubscriptionLockBoundaryCompletionSummary();

  const requiredForbiddenActions = [
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

  const checks: CompletionValidatorCheck[] = [
    completionSummary.mode === "read-only-preview-completion-summary"
      ? pass(
          "completion-summary-mode",
          "Completion summary remains read-only preview only",
          "Mode is read-only-preview-completion-summary."
        )
      : fail(
          "completion-summary-mode",
          "Completion summary remains read-only preview only",
          `Unexpected mode: ${completionSummary.mode}`
        ),

    completionSummary.status ===
    "subscription-lock-boundary-complete-for-planning"
      ? pass(
          "completion-summary-status",
          "Completion summary is complete for planning only",
          "Status is subscription-lock-boundary-complete-for-planning."
        )
      : fail(
          "completion-summary-status",
          "Completion summary is complete for planning only",
          `Unexpected completion status: ${completionSummary.status}`
        ),

    completionSummary.upstreamStatus.finalReviewStatus ===
      "final-review-ready" &&
    completionSummary.upstreamStatus.finalValidatorStatus === "pass" &&
    completionSummary.upstreamStatus.finalCheckpointStatus ===
      "final-checkpoint-ready"
      ? pass(
          "upstream-final-chain",
          "Final review, final validator, and final checkpoint chain is valid",
          "All upstream final-chain statuses are valid."
        )
      : fail(
          "upstream-final-chain",
          "Final review, final validator, and final checkpoint chain is valid",
          "One or more upstream final-chain statuses are invalid."
        ),

    completionSummary.completedScope.some(
      (item) =>
        item.id === "artifact-chain-complete" && item.status === "complete"
    ) &&
    completionSummary.completedScope.some(
      (item) =>
        item.id === "planning-package-complete" && item.status === "complete"
    ) &&
    completionSummary.completedScope.some(
      (item) => item.id === "execution-not-enabled" && item.status === "blocked"
    )
      ? pass(
          "completed-scope",
          "Artifact chain is complete but execution remains disabled",
          "Completion scope confirms planning package complete and execution not enabled."
        )
      : fail(
          "completed-scope",
          "Artifact chain is complete but execution remains disabled",
          "Completion scope is incomplete."
        ),

    completionSummary.preservedNexusVision.some(
      (item) =>
        item.id === "owner-controlled-operating-layer" &&
        item.status === "confirmed"
    ) &&
    completionSummary.preservedNexusVision.some(
      (item) =>
        item.id === "not-generic-software-clone" &&
        item.status === "confirmed"
    ) &&
    completionSummary.preservedNexusVision.some(
      (item) =>
        item.id === "controlled-paid-pilot-discipline" &&
        item.status === "confirmed"
    )
      ? pass(
          "preserved-nexus-vision",
          "Locked NEXUS vision is preserved",
          "Owner-controlled operating layer, non-clone identity, and controlled paid pilot discipline are confirmed."
        )
      : fail(
          "preserved-nexus-vision",
          "Locked NEXUS vision is preserved",
          "One or more locked vision confirmations are missing."
        ),

    completionSummary.subscriptionLockCompletion.some(
      (item) => item.id === "unknown-state-locked" && item.status === "locked"
    ) &&
    completionSummary.subscriptionLockCompletion.some(
      (item) =>
        item.id === "missing-entitlement-locked" && item.status === "locked"
    ) &&
    completionSummary.subscriptionLockCompletion.some(
      (item) =>
        item.id === "unapproved-boundary-locked" && item.status === "locked"
    ) &&
    completionSummary.subscriptionLockCompletion.some(
      (item) => item.id === "billing-ambiguity-locked" && item.status === "locked"
    )
      ? pass(
          "subscription-lock-completion",
          "Subscription lock completion remains locked-by-default",
          "Unknown state, missing entitlement, unapproved boundary, and billing ambiguity are locked."
        )
      : fail(
          "subscription-lock-completion",
          "Subscription lock completion remains locked-by-default",
          "One or more subscription lock completion checks are missing."
        ),

    completionSummary.monetizationSafetyCompletion.some(
      (item) => item.id === "payment-blocked" && item.status === "blocked"
    ) &&
    completionSummary.monetizationSafetyCompletion.some(
      (item) => item.id === "invoice-blocked" && item.status === "blocked"
    ) &&
    completionSummary.monetizationSafetyCompletion.some(
      (item) =>
        item.id === "subscription-mutation-blocked" && item.status === "blocked"
    ) &&
    completionSummary.monetizationSafetyCompletion.some(
      (item) =>
        item.id === "entitlement-write-blocked" && item.status === "blocked"
    )
      ? pass(
          "monetization-safety-completion",
          "Monetization execution remains blocked",
          "Payment, invoice, subscription mutation, and entitlement writes are blocked."
        )
      : fail(
          "monetization-safety-completion",
          "Monetization execution remains blocked",
          "One or more monetization blocks are missing."
        ),

    completionSummary.ownerControlCompletion.some(
      (item) =>
        item.id === "owner-approval-required" && item.status === "required"
    ) &&
    completionSummary.ownerControlCompletion.some(
      (item) => item.id === "safe-stop-required" && item.status === "required"
    ) &&
    completionSummary.ownerControlCompletion.some(
      (item) =>
        item.id === "manual-escalation-required" && item.status === "required"
    ) &&
    completionSummary.ownerControlCompletion.some(
      (item) =>
        item.id === "owner-override-not-executed" &&
        item.status === "confirmed"
    )
      ? pass(
          "owner-control-completion",
          "Owner approval, Safe Stop, Manual Escalation, and non-executed owner override are valid",
          "Owner-control completion requirements are present."
        )
      : fail(
          "owner-control-completion",
          "Owner approval, Safe Stop, Manual Escalation, and non-executed owner override are valid",
          "One or more owner-control completion requirements are missing."
        ),

    completionSummary.auditFallbackRollbackCompletion.some(
      (item) => item.id === "audit-readiness-only" && item.status === "confirmed"
    ) &&
    completionSummary.auditFallbackRollbackCompletion.some(
      (item) => item.id === "fallback-to-locked" && item.status === "confirmed"
    ) &&
    completionSummary.auditFallbackRollbackCompletion.some(
      (item) =>
        item.id === "rollback-readiness-only" && item.status === "confirmed"
    ) &&
    completionSummary.auditFallbackRollbackCompletion.some(
      (item) =>
        item.id === "recovery-execution-blocked" && item.status === "blocked"
    )
      ? pass(
          "audit-fallback-rollback-completion",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "Audit is readiness-only, fallback is locked, rollback is planning-only, and recovery execution is blocked."
        )
      : fail(
          "audit-fallback-rollback-completion",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "One or more audit/fallback/rollback completion checks are missing."
        ),

    includesAll(completionSummary.stillForbidden, requiredForbiddenActions)
      ? pass(
          "still-forbidden",
          "All forbidden execution classes remain blocked",
          "Completion summary includes every required forbidden execution class."
        )
      : fail(
          "still-forbidden",
          "All forbidden execution classes remain blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(completionSummary.completionBoundary.completedFor, [
      "Read-only controlled paid pilot subscription lock planning.",
      "Owner review preparation.",
      "Subscription lock boundary documentation.",
      "Monetization safety alignment.",
      "Future execution architecture prerequisite mapping.",
    ]) &&
    includesAll(completionSummary.completionBoundary.notCompletedFor, [
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
          "completion-boundary",
          "Completion boundary is planning-only and not live execution",
          "Completion is only for planning and explicitly excludes live paid pilot execution."
        )
      : fail(
          "completion-boundary",
          "Completion boundary is planning-only and not live execution",
          "Completion boundary is incomplete."
        ),
  ];

  const overallStatus: CompletionValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    completionValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-completion-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Completion Validator v1",
    mode: "read-only-preview-completion-validator",
    day: 232,
    overallStatus,
    validatedCompletionSummaryId: completionSummary.completionSummaryId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary completion summary validated as planning-complete, locked-by-default, owner-controlled, monetization-safe, audit-ready for review only, fallback-aware, rollback-aware, and non-executing."
        : "Controlled paid pilot subscription lock boundary completion validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 233: NEXUS Controlled Paid Pilot Subscription Lock Boundary Completion Checkpoint v1"
        : "Stop and manually review completion validator failure before continuing.",
  };
}
