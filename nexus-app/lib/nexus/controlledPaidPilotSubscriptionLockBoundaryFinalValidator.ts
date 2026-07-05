import { getControlledPaidPilotSubscriptionLockBoundaryFinalReview } from "./controlledPaidPilotSubscriptionLockBoundaryFinalReview";

type FinalValidatorStatus = "pass" | "fail";

type FinalValidatorCheck = {
  id: string;
  label: string;
  status: FinalValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryFinalValidator = {
  finalValidatorId: "controlled-paid-pilot-subscription-lock-boundary-final-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Validator v1";
  mode: "read-only-preview-final-validator";
  day: 229;
  overallStatus: FinalValidatorStatus;
  validatedFinalReviewId: "controlled-paid-pilot-subscription-lock-boundary-final-review-v1";
  checks: FinalValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): FinalValidatorCheck {
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
): FinalValidatorCheck {
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

export function validateControlledPaidPilotSubscriptionLockBoundaryFinalReview(): ControlledPaidPilotSubscriptionLockBoundaryFinalValidator {
  const finalReview = getControlledPaidPilotSubscriptionLockBoundaryFinalReview();

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

  const checks: FinalValidatorCheck[] = [
    finalReview.mode === "read-only-preview-final-review"
      ? pass(
          "final-review-mode",
          "Final review remains read-only preview only",
          "Mode is read-only-preview-final-review."
        )
      : fail(
          "final-review-mode",
          "Final review remains read-only preview only",
          `Unexpected mode: ${finalReview.mode}`
        ),

    finalReview.status === "final-review-ready"
      ? pass(
          "final-review-status",
          "Final review status is ready for planning only",
          "Final review status is final-review-ready."
        )
      : fail(
          "final-review-status",
          "Final review status is ready for planning only",
          `Unexpected final review status: ${finalReview.status}`
        ),

    finalReview.reviewedArtifacts.validatorStatus === "pass" &&
    finalReview.reviewedArtifacts.summaryStatus === "ready-for-planning" &&
    finalReview.reviewedArtifacts.checkpointStatus === "checkpoint-ready"
      ? pass(
          "upstream-artifacts",
          "Contract, validator, summary, and checkpoint chain is valid",
          "Upstream validator, summary, and checkpoint statuses are valid."
        )
      : fail(
          "upstream-artifacts",
          "Contract, validator, summary, and checkpoint chain is valid",
          "One or more upstream artifact statuses are not valid."
        ),

    finalReview.identityFinalReview.some(
      (item) =>
        item.id === "owner-controlled-business-operating-layer" &&
        item.result === "confirmed"
    ) &&
    finalReview.identityFinalReview.some(
      (item) =>
        item.id === "not-chatbot-crm-erp-automation-runner" &&
        item.result === "confirmed"
    )
      ? pass(
          "locked-identity",
          "Locked NEXUS identity is preserved",
          "Final review confirms owner-controlled operating layer and not chatbot/CRM/ERP/automation runner."
        )
      : fail(
          "locked-identity",
          "Locked NEXUS identity is preserved",
          "Locked identity confirmation is missing."
        ),

    finalReview.subscriptionLockFinalReview.some(
      (item) => item.id === "locked-by-default" && item.result === "locked"
    ) &&
    finalReview.subscriptionLockFinalReview.some(
      (item) =>
        item.id === "missing-entitlement-locked" && item.result === "locked"
    ) &&
    finalReview.subscriptionLockFinalReview.some(
      (item) => item.id === "billing-ambiguity-locked" && item.result === "locked"
    )
      ? pass(
          "subscription-lock",
          "Subscription lock remains locked-by-default",
          "Unknown state, missing entitlement scope, and billing ambiguity remain locked."
        )
      : fail(
          "subscription-lock",
          "Subscription lock remains locked-by-default",
          "One or more subscription lock confirmations are missing."
        ),

    finalReview.monetizationDisciplineFinalReview.some(
      (item) => item.id === "no-payment-execution" && item.result === "blocked"
    ) &&
    finalReview.monetizationDisciplineFinalReview.some(
      (item) => item.id === "no-invoice-creation" && item.result === "blocked"
    ) &&
    finalReview.monetizationDisciplineFinalReview.some(
      (item) =>
        item.id === "no-subscription-activation" && item.result === "blocked"
    ) &&
    finalReview.monetizationDisciplineFinalReview.some(
      (item) => item.id === "no-entitlement-write" && item.result === "blocked"
    )
      ? pass(
          "monetization-discipline",
          "Monetization execution remains blocked",
          "Payment, invoice, subscription activation, and entitlement write are blocked."
        )
      : fail(
          "monetization-discipline",
          "Monetization execution remains blocked",
          "One or more monetization execution blocks are missing."
        ),

    finalReview.safetyLayerFinalReview.some(
      (item) => item.id === "zero-damage" && item.result === "confirmed"
    ) &&
    finalReview.safetyLayerFinalReview.some(
      (item) => item.id === "zero-stop" && item.result === "confirmed"
    ) &&
    finalReview.safetyLayerFinalReview.some(
      (item) => item.id === "safe-stop" && item.result === "required"
    ) &&
    finalReview.safetyLayerFinalReview.some(
      (item) => item.id === "manual-escalation" && item.result === "required"
    )
      ? pass(
          "safety-layer",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "Safety layer requirements are confirmed and required."
        )
      : fail(
          "safety-layer",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "One or more safety layer requirements are missing."
        ),

    finalReview.ownerControlFinalReview.some(
      (item) =>
        item.id === "owner-approval-before-unlock" && item.result === "required"
    ) &&
    finalReview.ownerControlFinalReview.some(
      (item) =>
        item.id === "manual-owner-override-planning-only" &&
        item.result === "confirmed"
    ) &&
    finalReview.ownerControlFinalReview.some(
      (item) => item.id === "no-approve-reject-execution" && item.result === "blocked"
    )
      ? pass(
          "owner-control",
          "Owner approval is required and owner override execution is blocked",
          "Owner approval is required, override remains planning-only, and approve/reject execution is blocked."
        )
      : fail(
          "owner-control",
          "Owner approval is required and owner override execution is blocked",
          "One or more owner-control validations are missing."
        ),

    finalReview.auditFallbackRecoveryFinalReview.some(
      (item) => item.id === "audit-readiness-only" && item.result === "confirmed"
    ) &&
    finalReview.auditFallbackRecoveryFinalReview.some(
      (item) => item.id === "fallback-to-locked" && item.result === "confirmed"
    ) &&
    finalReview.auditFallbackRecoveryFinalReview.some(
      (item) =>
        item.id === "rollback-readiness-planning" && item.result === "confirmed"
    ) &&
    finalReview.auditFallbackRecoveryFinalReview.some(
      (item) => item.id === "no-recovery-execution" && item.result === "blocked"
    )
      ? pass(
          "audit-fallback-recovery",
          "Audit readiness, fallback, rollback planning, and recovery non-execution are valid",
          "Audit is readiness-only, fallback is locked, rollback is planning-only, and recovery execution is blocked."
        )
      : fail(
          "audit-fallback-recovery",
          "Audit readiness, fallback, rollback planning, and recovery non-execution are valid",
          "One or more audit/fallback/recovery validations are missing."
        ),

    includesAll(finalReview.forbiddenExecutionFinalReview, requiredForbiddenActions)
      ? pass(
          "forbidden-execution",
          "All forbidden execution classes are explicitly blocked",
          "Final review includes all required forbidden execution classes."
        )
      : fail(
          "forbidden-execution",
          "All forbidden execution classes are explicitly blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(finalReview.approvedFor, [
      "Read-only planning review.",
      "Subscription lock boundary documentation.",
      "Controlled paid pilot safety alignment.",
      "Future architecture prerequisite mapping.",
      "Owner review preparation.",
    ]) &&
    includesAll(finalReview.notApprovedFor, [
      "Live paid pilot activation.",
      "Live subscription unlock.",
      "Payment processing.",
      "Invoice generation.",
      "Entitlement mutation.",
      "Customer-impacting execution.",
      "Audit persistence.",
      "Third-party mutation.",
      "AI-generated customer response execution.",
    ])
      ? pass(
          "approved-scope",
          "Approved and not-approved scopes are correct",
          "Final review is approved only for planning and explicitly not approved for live execution."
        )
      : fail(
          "approved-scope",
          "Approved and not-approved scopes are correct",
          "Approved/not-approved scope is incomplete."
        ),
  ];

  const overallStatus: FinalValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    finalValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-final-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Validator v1",
    mode: "read-only-preview-final-validator",
    day: 229,
    overallStatus,
    validatedFinalReviewId: finalReview.finalReviewId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary final review validated as read-only, locked-by-default, owner-controlled, monetization-safe, and non-executing."
        : "Controlled paid pilot subscription lock boundary final review validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 230: NEXUS Controlled Paid Pilot Subscription Lock Boundary Final Checkpoint v1"
        : "Stop and manually review final validator failure before continuing.",
  };
}
