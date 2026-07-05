import { getControlledPaidPilotSubscriptionLockBoundaryFinalCompletionCloseout } from "./controlledPaidPilotSubscriptionLockBoundaryFinalCompletionCloseout";

type CloseoutValidatorStatus = "pass" | "fail";

type CloseoutValidatorCheck = {
  id: string;
  label: string;
  status: CloseoutValidatorStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryCloseoutValidator = {
  closeoutValidatorId: "controlled-paid-pilot-subscription-lock-boundary-closeout-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Validator v1";
  mode: "read-only-preview-closeout-validator";
  day: 238;
  overallStatus: CloseoutValidatorStatus;
  validatedCloseoutId: "controlled-paid-pilot-subscription-lock-boundary-final-completion-closeout-v1";
  checks: CloseoutValidatorCheck[];
  forbiddenExecutionValidation: string[];
  safetyConclusion: string;
  nextRecommendedStep: string;
};

function pass(
  id: string,
  label: string,
  evidence: string
): CloseoutValidatorCheck {
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
): CloseoutValidatorCheck {
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

export function validateControlledPaidPilotSubscriptionLockBoundaryFinalCompletionCloseout(): ControlledPaidPilotSubscriptionLockBoundaryCloseoutValidator {
  const closeout =
    getControlledPaidPilotSubscriptionLockBoundaryFinalCompletionCloseout();

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

  const checks: CloseoutValidatorCheck[] = [
    closeout.mode === "read-only-preview-final-completion-closeout"
      ? pass(
          "closeout-mode",
          "Final completion closeout remains read-only preview only",
          "Mode is read-only-preview-final-completion-closeout."
        )
      : fail(
          "closeout-mode",
          "Final completion closeout remains read-only preview only",
          `Unexpected mode: ${closeout.mode}`
        ),

    closeout.status === "final-completion-closeout-ready"
      ? pass(
          "closeout-status",
          "Final completion closeout is ready for planning only",
          "Status is final-completion-closeout-ready."
        )
      : fail(
          "closeout-status",
          "Final completion closeout is ready for planning only",
          `Unexpected status: ${closeout.status}`
        ),

    closeout.upstreamArtifacts.completionFinalCheckpointStatus ===
    "completion-final-checkpoint-ready"
      ? pass(
          "upstream-final-checkpoint",
          "Completion final checkpoint status is valid",
          "Upstream completion final checkpoint status is completion-final-checkpoint-ready."
        )
      : fail(
          "upstream-final-checkpoint",
          "Completion final checkpoint status is valid",
          `Unexpected upstream status: ${closeout.upstreamArtifacts.completionFinalCheckpointStatus}`
        ),

    closeout.closedArtifactChain.some(
      (item) =>
        item.id === "day224-through-day237-closed" &&
        item.status === "closed"
    ) &&
    closeout.closedArtifactChain.some(
      (item) =>
        item.id === "planning-package-complete" &&
        item.status === "complete"
    ) &&
    closeout.closedArtifactChain.some(
      (item) =>
        item.id === "live-execution-not-enabled" &&
        item.status === "blocked"
    )
      ? pass(
          "closed-artifact-chain",
          "Day 224 through Day 237 chain is closed for planning without live execution",
          "Closeout confirms chain closed, planning package complete, and live execution not enabled."
        )
      : fail(
          "closed-artifact-chain",
          "Day 224 through Day 237 chain is closed for planning without live execution",
          "Closed artifact chain is incomplete."
        ),

    closeout.lockedNexusVisionCloseout.some(
      (item) =>
        item.id === "owner-controlled-ai-business-operating-layer" &&
        item.status === "confirmed"
    ) &&
    closeout.lockedNexusVisionCloseout.some(
      (item) =>
        item.id === "not-chatbot-crm-erp-zapier-clone" &&
        item.status === "confirmed"
    ) &&
    closeout.lockedNexusVisionCloseout.some(
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

    closeout.subscriptionLockCloseout.some(
      (item) => item.id === "unknown-state-locked" && item.status === "locked"
    ) &&
    closeout.subscriptionLockCloseout.some(
      (item) =>
        item.id === "missing-entitlement-locked" && item.status === "locked"
    ) &&
    closeout.subscriptionLockCloseout.some(
      (item) =>
        item.id === "unapproved-boundary-locked" && item.status === "locked"
    ) &&
    closeout.subscriptionLockCloseout.some(
      (item) =>
        item.id === "billing-ambiguity-locked" && item.status === "locked"
    )
      ? pass(
          "subscription-lock-closeout",
          "Subscription lock closeout remains locked-by-default",
          "Unknown state, missing entitlement, unapproved boundary, and billing ambiguity remain locked."
        )
      : fail(
          "subscription-lock-closeout",
          "Subscription lock closeout remains locked-by-default",
          "One or more subscription lock closeout confirmations are missing."
        ),

    closeout.monetizationSafetyCloseout.some(
      (item) =>
        item.id === "payment-execution-blocked" && item.status === "blocked"
    ) &&
    closeout.monetizationSafetyCloseout.some(
      (item) =>
        item.id === "invoice-generation-blocked" && item.status === "blocked"
    ) &&
    closeout.monetizationSafetyCloseout.some(
      (item) =>
        item.id === "subscription-mutation-blocked" && item.status === "blocked"
    ) &&
    closeout.monetizationSafetyCloseout.some(
      (item) =>
        item.id === "entitlement-write-blocked" && item.status === "blocked"
    )
      ? pass(
          "monetization-safety-closeout",
          "Monetization execution remains blocked",
          "Payment, invoice, subscription mutation, and entitlement writes remain blocked."
        )
      : fail(
          "monetization-safety-closeout",
          "Monetization execution remains blocked",
          "One or more monetization closeout blocks are missing."
        ),

    closeout.ownerControlCloseout.some(
      (item) => item.id === "owner-approval-required" && item.status === "required"
    ) &&
    closeout.ownerControlCloseout.some(
      (item) =>
        item.id === "manual-owner-override-planning-only" &&
        item.status === "confirmed"
    ) &&
    closeout.ownerControlCloseout.some(
      (item) =>
        item.id === "approve-reject-execution-blocked" &&
        item.status === "blocked"
    )
      ? pass(
          "owner-control-closeout",
          "Owner approval is required and owner decision execution is blocked",
          "Owner approval is required, owner override remains planning-only, and approve/reject execution is blocked."
        )
      : fail(
          "owner-control-closeout",
          "Owner approval is required and owner decision execution is blocked",
          "One or more owner control closeout checks are missing."
        ),

    closeout.safetyLayerCloseout.some(
      (item) => item.id === "zero-damage-preserved" && item.status === "confirmed"
    ) &&
    closeout.safetyLayerCloseout.some(
      (item) => item.id === "zero-stop-preserved" && item.status === "confirmed"
    ) &&
    closeout.safetyLayerCloseout.some(
      (item) => item.id === "safe-stop-required" && item.status === "required"
    ) &&
    closeout.safetyLayerCloseout.some(
      (item) =>
        item.id === "manual-escalation-required" && item.status === "required"
    )
      ? pass(
          "safety-layer-closeout",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "Safety layer closeout requirements are valid."
        )
      : fail(
          "safety-layer-closeout",
          "Zero Damage, Zero Stop, Safe Stop, and Manual Escalation are preserved",
          "One or more safety layer closeout checks are missing."
        ),

    closeout.auditFallbackRollbackCloseout.some(
      (item) => item.id === "audit-readiness-only" && item.status === "confirmed"
    ) &&
    closeout.auditFallbackRollbackCloseout.some(
      (item) => item.id === "fallback-to-locked" && item.status === "confirmed"
    ) &&
    closeout.auditFallbackRollbackCloseout.some(
      (item) =>
        item.id === "rollback-readiness-planning-only" &&
        item.status === "confirmed"
    ) &&
    closeout.auditFallbackRollbackCloseout.some(
      (item) =>
        item.id === "recovery-execution-blocked" && item.status === "blocked"
    )
      ? pass(
          "audit-fallback-rollback-closeout",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "Audit is readiness-only, fallback is locked, rollback is planning-only, and recovery execution is blocked."
        )
      : fail(
          "audit-fallback-rollback-closeout",
          "Audit readiness, fallback, rollback readiness, and recovery non-execution are valid",
          "One or more audit/fallback/rollback closeout checks are missing."
        ),

    includesAll(closeout.forbiddenExecutionCloseout, requiredForbiddenActions)
      ? pass(
          "forbidden-execution-closeout",
          "All forbidden execution classes remain blocked",
          "Closeout includes every required forbidden execution class."
        )
      : fail(
          "forbidden-execution-closeout",
          "All forbidden execution classes remain blocked",
          "One or more forbidden execution classes are missing."
        ),

    includesAll(closeout.closeoutBoundary.closedFor, [
      "Read-only final completion closeout.",
      "Controlled paid pilot subscription lock planning.",
      "Owner review preparation.",
      "Subscription lock boundary documentation.",
      "Future execution architecture prerequisite mapping.",
      "Safety and monetization discipline documentation.",
    ]) &&
    includesAll(closeout.closeoutBoundary.notClosedFor, [
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
          "closeout-boundary",
          "Closeout boundary is planning-only and not live execution",
          "Closeout scope is read-only planning and explicitly excludes live execution."
        )
      : fail(
          "closeout-boundary",
          "Closeout boundary is planning-only and not live execution",
          "Closeout boundary is incomplete."
        ),
  ];

  const overallStatus: CloseoutValidatorStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    closeoutValidatorId:
      "controlled-paid-pilot-subscription-lock-boundary-closeout-validator-v1",
    title:
      "NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Validator v1",
    mode: "read-only-preview-closeout-validator",
    day: 238,
    overallStatus,
    validatedCloseoutId: closeout.closeoutId,
    checks,
    forbiddenExecutionValidation: requiredForbiddenActions,
    safetyConclusion:
      overallStatus === "pass"
        ? "Controlled paid pilot subscription lock boundary final completion closeout validated as planning-only, locked-by-default, owner-controlled, monetization-safe, audit-ready for review only, fallback-aware, rollback-aware, and non-executing."
        : "Controlled paid pilot subscription lock boundary closeout validation failed. Manual owner review required before continuation.",
    nextRecommendedStep:
      overallStatus === "pass"
        ? "Day 239: NEXUS Controlled Paid Pilot Subscription Lock Boundary Closeout Checkpoint v1"
        : "Stop and manually review closeout validator failure before continuing.",
  };
}
