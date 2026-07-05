import { getControlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionFinalReview } from "./controlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionFinalReview";

type CloseoutCompletionFinalValidatorStatus = "pass" | "fail";

type CloseoutCompletionFinalValidatorCheck = {
  id: string;
  label: string;
  status: CloseoutCompletionFinalValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionFinalValidator = {
  completionFinalValidatorId: "controlled-paid-pilot-subscription-lock-boundary-closeout-completion-final-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Completion Final Validator v1";
  mode: "read-only-preview-closeout-completion-final-validator";
  day: 247;
  overallStatus: CloseoutCompletionFinalValidatorStatus;
  validatedCompletionFinalReviewId: "controlled-paid-pilot-subscription-lock-boundary-closeout-completion-final-review-v1";
  checks: CloseoutCompletionFinalValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): CloseoutCompletionFinalValidatorCheck {
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
): CloseoutCompletionFinalValidatorCheck {
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

export function validateControlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionFinalReview(): ControlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionFinalValidator {
  const finalReview =
    getControlledPaidPilotSubscriptionLockBoundaryCloseoutCompletionFinalReview();

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

  const checks: CloseoutCompletionFinalValidatorCheck[] = [
    finalReview.mode === "read-only-preview-closeout-completion-final-review"
      ? pass(
          "final-review-mode",
          "Closeout completion final review remains read-only preview only",
          "Mode is read-only-preview-closeout-completion-final-review."
        )
      : fail(
          "final-review-mode",
          "Closeout completion final review remains read-only preview only",
          `Unexpected mode: ${finalReview.mode}`
        ),

    finalReview.status === "closeout-completion-final-review-ready"
      ? pass(
          "final-review-status",
          "Closeout completion final review is ready for planning only",
          "Status is closeout-completion-final-review-ready."
        )
      : fail(
          "final-review-status",
          "Closeout completion final review is ready for planning only",
          `Unexpected status: ${finalReview.status}`
        ),

    finalReview.reviewedArtifacts.closeoutCompletionSummaryStatus ===
      "closeout-completion-summary-ready" &&
    finalReview.reviewedArtifacts.closeoutCompletionValidatorStatus ===
      "pass" &&
    finalReview.reviewedArtifacts.closeoutCompletionCheckpointStatus ===
      "closeout-completion-checkpoint-ready"
      ? pass(
          "reviewed-completion-chain",
          "Closeout completion summary, validator, and checkpoint chain is valid",
          "Reviewed completion artifact statuses are valid."
        )
      : fail(
          "reviewed-completion-chain",
          "Closeout completion summary, validator, and checkpoint chain is valid",
          "One or more reviewed completion artifact statuses are invalid."
        ),

    finalReview.completedChainFinalReview.some(
      (item) =>
        item.id === "day224-through-day246-reviewed" &&
        item.result === "reviewed"
    ) &&
    finalReview.completedChainFinalReview.some(
      (item) =>
        item.id === "completion-summary-validator-checkpoint-valid" &&
        item.result === "confirmed"
    ) &&
    finalReview.completedChainFinalReview.some(
      (item) =>
        item.id === "planning-only-completion-confirmed" &&
        item.result === "complete"
    ) &&
    finalReview.completedChainFinalReview.some(
      (item) =>
        item.id === "live-execution-not-approved" &&
        item.result === "blocked"
    )
      ? pass(
          "completed-chain-final-review",
          "Day 224 through Day 246 chain is reviewed for planning only",
          "Final review confirms planning-only completion and live execution not approved."
        )
      : fail(
          "completed-chain-final-review",
          "Day 224 through Day 246 chain is reviewed for planning only",
          "Completed chain final review is incomplete."
        ),

    finalReview.launchStatusFinalReview.some(
      (item) => item.id === "launch-not-authorized" && item.result === "blocked"
    ) &&
    finalReview.launchStatusFinalReview.some(
      (item) =>
        item.id === "future-execution-architecture-required" &&
        item.result === "required"
    ) &&
    finalReview.launchStatusFinalReview.some(
      (item) =>
        item.id === "owner-launch-review-required" &&
        item.result === "required"
    )
      ? pass(
          "launch-status-final-review",
          "Launch remains blocked until future execution architecture and owner review",
          "Launch is not authorized, execution architecture is required, and owner launch review is required."
        )
      : fail(
          "launch-status-final-review",
          "Launch remains blocked until future execution architecture and owner review",
          "One or more launch status final review checks are missing."
        ),

    finalReview.lockedVisionFinalReview.some(
      (item) =>
        item.id === "owner-controlled-operating-layer" &&
        item.result === "confirmed"
    ) &&
    finalReview.lockedVisionFinalReview.some(
      (item) =>
        item.id === "not-chatbot-crm-erp-zapier-clone" &&
        item.result === "confirmed"
    ) &&
    finalReview.lockedVisionFinalReview.some(
      (item) =>
        item.id === "controlled-paid-pilot-discipline" &&
        item.result === "confirmed"
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

    finalReview.subscriptionLockFinalReview.some(
      (item) => item.id === "unknown-state-locked" && item.result === "locked"
    ) &&
    finalReview.subscriptionLockFinalReview.some(
      (item) =>
        item.id === "missing-entitlement-locked" && item.result === "locked"
    ) &&
    finalReview.subscriptionLockFinalReview.some(
      (item) =>
        item.id === "unapproved-boundary-locked" && item.result === "locked"
    ) &&
    finalReview.subscriptionLockFinalReview.some(
      (item) =>
        item.id === "billing-ambiguity-locked" && item.result === "locked"
    )
      ? pass(
          "subscription-lock-final-review",
          "Subscription lock remains locked-by-default",
          "Unknown state, missing entitlement, unapproved boundary, and billing ambiguity remain locked."
        )
      : fail(
          "subscription-lock-final-review",
          "Subscription lock remains locked-by-default",
          "One or more subscription lock final review checks are missing."
        ),

    finalReview.monetizationSafetyFinalReview.some(
      (item) =>
        item.id === "payment-execution-blocked" && item.result === "blocked"
    ) &&
    finalReview.monetizationSafetyFinalReview.some(
      (item) =>
        item.id === "invoice-generation-blocked" && item.result === "blocked"
    ) &&
    finalReview.monetizationSafetyFinalReview.some(
      (item) =>
        item.id === "subscription-mutation-blocked" &&
        item.result === "blocked"
    ) &&
    finalReview.monetizationSafetyFinalReview.some(
      (item) =>
        item.id === "entitlement-write-blocked" && item.result === "blocked"
    )
      ? pass(
          "monetization-safety-final-review",
          "Monetization execution remains blocked",
          "Payment, invoice, subscription mutation, and entitlement writes remain blocked."
        )
      : fail(
          "monetization-safety-final-review",
          "Monetization execution remains blocked",
          "One or more monetization safety final review checks are missing."
        ),

    finalReview.ownerControlFinalReview.some(
      (item) =>
        item.id === "owner-approval-required" && item.result === "required"
    ) &&
    finalReview.ownerControlFinalReview.some(
      (item) =>
        item.id === "manual-owner-override-planning-only" &&
        item.result === "confirmed"
    ) &&
    finalReview.ownerControlFinalReview.some(
      (item) =>
        item.id === "approve-reject-execution-blocked" &&
        item.result === "blocked"
    )
      ? pass(
          "owner-control-final-review",
          "Owner approval is required and owner decision execution is blocked",
          "Owner approval is required, owner override remains planning-only, and approve/reject execution is blocked."
        )
      : fail(
          "owner-control-final-review",
          "Owner approval is required and owner decision execution is blocked",
          "One or more owner-control final review checks are missing."
        ),

    finalReview.safetyLayerFinalReview.some(
      (item) =>
        item.id === "zero-damage-preserved" && item.result === "confirmed"
    ) &&
    finalReview.safetyLayerFinalReview.some(
      (item) => item.id === "zero-stop-preserved" && item.result === "confirmed"
    ) &&
    finalReview.safetyLayerFinalReview.some(
      (item) => item.id === "safe-stop-required" && item.result === "required"
    ) &&
    finalReview.safetyLayerFinalReview.some(
      (item) =>
        item.id === "manual-escalation-required" && item.result === "required"
    )
      ? pass(
          "safety-layer-final-review",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "Safety layer final review requirements are valid."
        )
      : fail(
          "safety-layer-final-review",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "One or more safety layer final review checks are missing."
        ),

    finalReview.auditFallbackRollbackFinalReview.some(
      (item) =>
        item.id === "audit-readiness-only" && item.result === "confirmed"
    ) &&
    finalReview.auditFallbackRollbackFinalReview.some(
      (item) => item.id === "fallback-to-locked" && item.result === "confirmed"
    ) &&
    finalReview.auditFallbackRollbackFinalReview.some(
      (item) =>
        item.id === "rollback-readiness-planning-only" &&
        item.result === "confirmed"
    ) &&
    finalReview.auditFallbackRollbackFinalReview.some(
      (item) =>
        item.id === "recovery-execution-blocked" && item.result === "blocked"
    )
      ? pass(
          "audit-fallback-rollback-final-review",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "Audit is readiness-only, fallback is locked, rollback is planning-only, and recovery execution is blocked."
        )
      : fail(
          "audit-fallback-rollback-final-review",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "One or more audit/fallback/rollback final review checks are missing."
        ),

    includesAll(finalReview.forbiddenExecutionFinalReview, requiredForbiddenActions)
      ? pass(
          "forbidden-execution-final-review",
          "All forbidden execution classes remain blocked",
          "Final review includes every required forbidden execution class, including no launch authorization."
        )
      : fail(
          "forbidden-execution-final-review",
          "All forbidden execution classes remain blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(finalReview.finalBoundaryDecision.approvedOnlyFor, [
      "Read-only closeout completion final review.",
      "Controlled paid pilot subscription lock planning.",
      "Owner review preparation.",
      "Subscription lock boundary documentation.",
      "Future execution architecture prerequisite mapping.",
      "Safety and monetization discipline documentation.",
    ]) &&
    includesAll(finalReview.finalBoundaryDecision.explicitlyNotApprovedFor, [
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
          "final-boundary-decision",
          "Final boundary decision is planning-only and explicitly not launch",
          "Approved scope is read-only planning and explicitly excludes public launch and live execution."
        )
      : fail(
          "final-boundary-decision",
          "Final boundary decision is planning-only and explicitly not launch",
          "Final boundary decision is incomplete."
        ),
  ];

  const overallStatus: CloseoutCompletionFinalValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    completionFinalValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-closeout-completion-final-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Completion Final Validator v1",
    mode: "read-only-preview-closeout-completion-final-validator",
    day: 247,
    overallStatus,
    validatedCompletionFinalReviewId: finalReview.completionFinalReviewId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary closeout completion final review validated as planning-only, launch-blocked, locked-by-default, owner-controlled, monetization-safe, audit-ready for review only, fallback-aware, rollback-aware, and non-executing."
        : "Controlled paid pilot subscription lock boundary closeout completion final validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 248: NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Completion Final Checkpoint v1"
        : "Stop and manually review closeout completion final validator failure before continuing.",
  };
}
