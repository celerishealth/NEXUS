import { getControlledPaidPilotSubscriptionLockBoundaryCompletionFinalReview } from "./controlledPaidPilotSubscriptionLockBoundaryCompletionFinalReview";

type CompletionFinalValidatorStatus = "pass" | "fail";

type CompletionFinalValidatorCheck = {
  id: string;
  label: string;
  status: CompletionFinalValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryCompletionFinalValidator = {
  completionFinalValidatorId: "controlled-paid-pilot-subscription-lock-boundary-completion-final-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Completion Final Validator v1";
  mode: "read-only-preview-completion-final-validator";
  day: 235;
  overallStatus: CompletionFinalValidatorStatus;
  validatedCompletionFinalReviewId: "controlled-paid-pilot-subscription-lock-boundary-completion-final-review-v1";
  checks: CompletionFinalValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): CompletionFinalValidatorCheck {
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
): CompletionFinalValidatorCheck {
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

export function validateControlledPaidPilotSubscriptionLockBoundaryCompletionFinalReview(): ControlledPaidPilotSubscriptionLockBoundaryCompletionFinalValidator {
  const finalReview =
    getControlledPaidPilotSubscriptionLockBoundaryCompletionFinalReview();

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

  const checks: CompletionFinalValidatorCheck[] = [
    finalReview.mode === "read-only-preview-completion-final-review"
      ? pass(
          "completion-final-review-mode",
          "Completion final review remains read-only preview only",
          "Mode is read-only-preview-completion-final-review."
        )
      : fail(
          "completion-final-review-mode",
          "Completion final review remains read-only preview only",
          `Unexpected mode: ${finalReview.mode}`
        ),

    finalReview.status === "completion-final-review-ready"
      ? pass(
          "completion-final-review-status",
          "Completion final review is ready for planning only",
          "Status is completion-final-review-ready."
        )
      : fail(
          "completion-final-review-status",
          "Completion final review is ready for planning only",
          `Unexpected status: ${finalReview.status}`
        ),

    finalReview.reviewedArtifacts.completionSummaryStatus ===
      "subscription-lock-boundary-complete-for-planning" &&
    finalReview.reviewedArtifacts.completionValidatorStatus === "pass" &&
    finalReview.reviewedArtifacts.completionCheckpointStatus ===
      "completion-checkpoint-ready"
      ? pass(
          "reviewed-artifact-chain",
          "Completion summary, validator, and checkpoint chain is valid",
          "All reviewed completion artifact statuses are valid."
        )
      : fail(
          "reviewed-artifact-chain",
          "Completion summary, validator, and checkpoint chain is valid",
          "One or more reviewed artifact statuses are invalid."
        ),

    finalReview.completionChainFinalReview.some(
      (item) => item.id === "day224-to-day234-chain" && item.result === "complete"
    ) &&
    finalReview.completionChainFinalReview.some(
      (item) =>
        item.id === "planning-completion-confirmed" &&
        item.result === "complete"
    ) &&
    finalReview.completionChainFinalReview.some(
      (item) =>
        item.id === "live-execution-not-approved" && item.result === "blocked"
    )
      ? pass(
          "completion-chain",
          "Day 224 through Day 234 chain is complete and live execution is blocked",
          "Completion chain is complete for planning and live execution is not approved."
        )
      : fail(
          "completion-chain",
          "Day 224 through Day 234 chain is complete and live execution is blocked",
          "Completion chain final review is incomplete."
        ),

    finalReview.nexusIdentityFinalReview.some(
      (item) =>
        item.id === "owner-controlled-operating-layer" &&
        item.result === "confirmed"
    ) &&
    finalReview.nexusIdentityFinalReview.some(
      (item) =>
        item.id === "not-chatbot-crm-erp-zapier-clone" &&
        item.result === "confirmed"
    ) &&
    finalReview.nexusIdentityFinalReview.some(
      (item) =>
        item.id === "controlled-paid-pilot-discipline" &&
        item.result === "confirmed"
    )
      ? pass(
          "nexus-identity",
          "Locked NEXUS identity is preserved",
          "Owner-controlled operating layer, non-clone identity, and controlled paid pilot discipline are confirmed."
        )
      : fail(
          "nexus-identity",
          "Locked NEXUS identity is preserved",
          "One or more NEXUS identity confirmations are missing."
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
        item.id === "unapproved-pilot-boundary-locked" &&
        item.result === "locked"
    ) &&
    finalReview.subscriptionLockFinalReview.some(
      (item) => item.id === "billing-ambiguity-locked" && item.result === "locked"
    )
      ? pass(
          "subscription-lock",
          "Subscription lock remains locked-by-default",
          "Unknown state, missing entitlement, unapproved boundary, and billing ambiguity remain locked."
        )
      : fail(
          "subscription-lock",
          "Subscription lock remains locked-by-default",
          "One or more subscription lock confirmations are missing."
        ),

    finalReview.monetizationFinalReview.some(
      (item) => item.id === "payment-execution-blocked" && item.result === "blocked"
    ) &&
    finalReview.monetizationFinalReview.some(
      (item) =>
        item.id === "invoice-generation-blocked" && item.result === "blocked"
    ) &&
    finalReview.monetizationFinalReview.some(
      (item) =>
        item.id === "subscription-mutation-blocked" &&
        item.result === "blocked"
    ) &&
    finalReview.monetizationFinalReview.some(
      (item) => item.id === "entitlement-write-blocked" && item.result === "blocked"
    )
      ? pass(
          "monetization-safety",
          "Monetization execution remains blocked",
          "Payment, invoice, subscription mutation, and entitlement writes are blocked."
        )
      : fail(
          "monetization-safety",
          "Monetization execution remains blocked",
          "One or more monetization safety blocks are missing."
        ),

    finalReview.ownerControlFinalReview.some(
      (item) => item.id === "owner-approval-required" && item.result === "required"
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
          "owner-control",
          "Owner approval is required and owner decision execution is blocked",
          "Owner approval is required, owner override remains planning-only, and approve/reject execution is blocked."
        )
      : fail(
          "owner-control",
          "Owner approval is required and owner decision execution is blocked",
          "One or more owner-control checks are missing."
        ),

    finalReview.safetyLayerFinalReview.some(
      (item) => item.id === "zero-damage-preserved" && item.result === "confirmed"
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
          "safety-layer",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "Safety layer final review requirements are valid."
        )
      : fail(
          "safety-layer",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "One or more safety layer checks are missing."
        ),

    finalReview.auditFallbackRollbackFinalReview.some(
      (item) => item.id === "audit-readiness-only" && item.result === "confirmed"
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
          "audit-fallback-rollback",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "Audit is readiness-only, fallback is locked, rollback is planning-only, and recovery execution is blocked."
        )
      : fail(
          "audit-fallback-rollback",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "One or more audit/fallback/rollback checks are missing."
        ),

    includesAll(finalReview.forbiddenExecutionFinalReview, requiredForbiddenActions)
      ? pass(
          "forbidden-execution",
          "All forbidden execution classes remain blocked",
          "Completion final review includes every required forbidden execution class."
        )
      : fail(
          "forbidden-execution",
          "All forbidden execution classes remain blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(finalReview.finalBoundaryDecision.approvedOnlyFor, [
      "Read-only completion final review.",
      "Controlled paid pilot subscription lock planning.",
      "Owner review preparation.",
      "Subscription lock boundary documentation.",
      "Future execution architecture prerequisite mapping.",
      "Safety and monetization discipline documentation.",
    ]) &&
    includesAll(finalReview.finalBoundaryDecision.explicitlyNotApprovedFor, [
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
          "Final boundary decision is planning-only and not live execution",
          "Approved scope is read-only planning and explicitly excludes live execution."
        )
      : fail(
          "final-boundary-decision",
          "Final boundary decision is planning-only and not live execution",
          "Final boundary decision is incomplete."
        ),
  ];

  const overallStatus: CompletionFinalValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    completionFinalValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-completion-final-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Completion Final Validator v1",
    mode: "read-only-preview-completion-final-validator",
    day: 235,
    overallStatus,
    validatedCompletionFinalReviewId: finalReview.completionFinalReviewId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary completion final review validated as planning-only, locked-by-default, owner-controlled, monetization-safe, audit-ready for review only, fallback-aware, rollback-aware, and non-executing."
        : "Controlled paid pilot subscription lock boundary completion final validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 236: NEXUS Controlled Paid Pilot Subscription Lock Boundary Completion Final Checkpoint v1"
        : "Stop and manually review completion final validator failure before continuing.",
  };
}
