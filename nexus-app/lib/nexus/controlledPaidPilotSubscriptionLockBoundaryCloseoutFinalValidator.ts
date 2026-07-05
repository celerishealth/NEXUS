import { getControlledPaidPilotSubscriptionLockBoundaryCloseoutFinalReview } from "./controlledPaidPilotSubscriptionLockBoundaryCloseoutFinalReview";

type CloseoutFinalValidatorStatus = "pass" | "fail";

type CloseoutFinalValidatorCheck = {
  id: string;
  label: string;
  status: CloseoutFinalValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryCloseoutFinalValidator = {
  closeoutFinalValidatorId: "controlled-paid-pilot-subscription-lock-boundary-closeout-final-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Final Validator v1";
  mode: "read-only-preview-closeout-final-validator";
  day: 241;
  overallStatus: CloseoutFinalValidatorStatus;
  validatedCloseoutFinalReviewId: "controlled-paid-pilot-subscription-lock-boundary-closeout-final-review-v1";
  checks: CloseoutFinalValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): CloseoutFinalValidatorCheck {
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
): CloseoutFinalValidatorCheck {
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

export function validateControlledPaidPilotSubscriptionLockBoundaryCloseoutFinalReview(): ControlledPaidPilotSubscriptionLockBoundaryCloseoutFinalValidator {
  const finalReview =
    getControlledPaidPilotSubscriptionLockBoundaryCloseoutFinalReview();

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

  const checks: CloseoutFinalValidatorCheck[] = [
    finalReview.mode === "read-only-preview-closeout-final-review"
      ? pass(
          "closeout-final-review-mode",
          "Closeout final review remains read-only preview only",
          "Mode is read-only-preview-closeout-final-review."
        )
      : fail(
          "closeout-final-review-mode",
          "Closeout final review remains read-only preview only",
          `Unexpected mode: ${finalReview.mode}`
        ),

    finalReview.status === "closeout-final-review-ready"
      ? pass(
          "closeout-final-review-status",
          "Closeout final review is ready for planning only",
          "Status is closeout-final-review-ready."
        )
      : fail(
          "closeout-final-review-status",
          "Closeout final review is ready for planning only",
          `Unexpected status: ${finalReview.status}`
        ),

    finalReview.reviewedArtifacts.closeoutStatus ===
      "final-completion-closeout-ready" &&
    finalReview.reviewedArtifacts.closeoutValidatorStatus === "pass" &&
    finalReview.reviewedArtifacts.closeoutCheckpointStatus ===
      "closeout-checkpoint-ready"
      ? pass(
          "reviewed-closeout-chain",
          "Closeout, validator, and checkpoint chain is valid",
          "Reviewed closeout artifact statuses are valid."
        )
      : fail(
          "reviewed-closeout-chain",
          "Closeout, validator, and checkpoint chain is valid",
          "One or more reviewed closeout artifact statuses are invalid."
        ),

    finalReview.finalCloseoutChainReview.some(
      (item) =>
        item.id === "day224-through-day240-reviewed" &&
        item.result === "reviewed"
    ) &&
    finalReview.finalCloseoutChainReview.some(
      (item) =>
        item.id === "closeout-validator-and-checkpoint-valid" &&
        item.result === "confirmed"
    ) &&
    finalReview.finalCloseoutChainReview.some(
      (item) =>
        item.id === "planning-only-closeout-complete" &&
        item.result === "complete"
    ) &&
    finalReview.finalCloseoutChainReview.some(
      (item) =>
        item.id === "live-execution-not-approved" &&
        item.result === "blocked"
    )
      ? pass(
          "final-closeout-chain",
          "Day 224 through Day 240 chain is reviewed and live execution is blocked",
          "Final closeout chain confirms planning-only completion and no live execution approval."
        )
      : fail(
          "final-closeout-chain",
          "Day 224 through Day 240 chain is reviewed and live execution is blocked",
          "Final closeout chain review is incomplete."
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
          "One or more subscription lock final review confirmations are missing."
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
          "One or more monetization safety final review blocks are missing."
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
          "Closeout final review includes every required forbidden execution class."
        )
      : fail(
          "forbidden-execution-final-review",
          "All forbidden execution classes remain blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(finalReview.finalBoundaryDecision.approvedOnlyFor, [
      "Read-only closeout final review.",
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
          "Approved scope is read-only planning and explicitly excludes live paid pilot execution."
        )
      : fail(
          "final-boundary-decision",
          "Final boundary decision is planning-only and not live execution",
          "Final boundary decision is incomplete."
        ),
  ];

  const overallStatus: CloseoutFinalValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    closeoutFinalValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-closeout-final-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Final Validator v1",
    mode: "read-only-preview-closeout-final-validator",
    day: 241,
    overallStatus,
    validatedCloseoutFinalReviewId: finalReview.closeoutFinalReviewId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary closeout final review validated as planning-only, locked-by-default, owner-controlled, monetization-safe, audit-ready for review only, fallback-aware, rollback-aware, and non-executing."
        : "Controlled paid pilot subscription lock boundary closeout final validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 242: NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Final Checkpoint v1"
        : "Stop and manually review closeout final validator failure before continuing.",
  };
}
