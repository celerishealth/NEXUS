import { controlledPaidPilotSubscriptionLockBoundaryContract } from "./controlledPaidPilotSubscriptionLockBoundaryContract";

type ValidationStatus = "pass" | "fail";

type ValidationCheck = {
  id: string;
  label: string;
  status: ValidationStatus;
  evidence: string;
};

export type ControlledPaidPilotSubscriptionLockBoundaryValidation = {
  validatorId: "controlled-paid-pilot-subscription-lock-boundary-validator-v1";
  title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Validator v1";
  mode: "read-only-preview-validator";
  day: 225;
  overallStatus: ValidationStatus;
  checks: ValidationCheck[];
  blockedExecutionSummary: string[];
  manualEscalationSummary: string[];
  safetyConclusion: string;
};

function pass(id: string, label: string, evidence: string): ValidationCheck {
  return {
    id,
    label,
    status: "pass",
    evidence,
  };
}

function fail(id: string, label: string, evidence: string): ValidationCheck {
  return {
    id,
    label,
    status: "fail",
    evidence,
  };
}

export function validateControlledPaidPilotSubscriptionLockBoundary(): ControlledPaidPilotSubscriptionLockBoundaryValidation {
  const contract = controlledPaidPilotSubscriptionLockBoundaryContract;

  const checks: ValidationCheck[] = [
    contract.mode === "read-only-preview-contract"
      ? pass(
          "mode-read-only",
          "Contract remains read-only preview only",
          "Mode is read-only-preview-contract."
        )
      : fail(
          "mode-read-only",
          "Contract remains read-only preview only",
          `Unexpected mode: ${contract.mode}`
        ),

    contract.lockedVision.operatingLayer &&
    contract.lockedVision.ownerControlled &&
    contract.lockedVision.notChatbot &&
    contract.lockedVision.notCrmClone &&
    contract.lockedVision.notErpClone &&
    contract.lockedVision.notAutomationRunner
      ? pass(
          "locked-vision",
          "Locked NEXUS identity is preserved",
          "Operating layer identity is owner-controlled and explicitly not chatbot/CRM/ERP/automation-runner."
        )
      : fail(
          "locked-vision",
          "Locked NEXUS identity is preserved",
          "One or more locked-vision flags are missing."
        ),

    contract.subscriptionLockBoundary.defaultState ===
    "locked-until-owner-approved-and-entitlement-verified"
      ? pass(
          "default-locked",
          "Unknown or unapproved subscription state defaults locked",
          "Default state is locked until owner approval and entitlement verification."
        )
      : fail(
          "default-locked",
          "Unknown or unapproved subscription state defaults locked",
          `Unexpected default state: ${contract.subscriptionLockBoundary.defaultState}`
        ),

    contract.subscriptionLockBoundary.subscriptionActivation === "blocked" &&
    contract.subscriptionLockBoundary.subscriptionMutation === "blocked" &&
    contract.subscriptionLockBoundary.paymentExecution === "blocked" &&
    contract.subscriptionLockBoundary.invoiceCreation === "blocked" &&
    contract.subscriptionLockBoundary.entitlementWrite === "blocked" &&
    contract.subscriptionLockBoundary.customerDataWrite === "blocked" &&
    contract.subscriptionLockBoundary.thirdPartyMutation === "blocked" &&
    contract.subscriptionLockBoundary.auditPersistence === "blocked"
      ? pass(
          "mutation-blocks",
          "Subscription, payment, entitlement, customer-data, third-party, and audit mutations are blocked",
          "All mutation-sensitive boundary fields are blocked."
        )
      : fail(
          "mutation-blocks",
          "Subscription, payment, entitlement, customer-data, third-party, and audit mutations are blocked",
          "One or more mutation-sensitive boundary fields are not blocked."
        ),

    contract.requiredGatesBeforeAnyFuturePaidPilotAccess.includes(
      "Owner explicitly approves the pilot account boundary."
    ) &&
    contract.requiredGatesBeforeAnyFuturePaidPilotAccess.includes(
      "Subscription status is verified through a safe read-only entitlement check."
    ) &&
    contract.requiredGatesBeforeAnyFuturePaidPilotAccess.includes(
      "Safe Stop and Manual Escalation are available for lock uncertainty."
    )
      ? pass(
          "future-access-gates",
          "Future access requires owner approval, read-only entitlement verification, and safe stop",
          "Required future access gates are present."
        )
      : fail(
          "future-access-gates",
          "Future access requires owner approval, read-only entitlement verification, and safe stop",
          "One or more future access gates are missing."
        ),

    contract.forbiddenActions.includes("Do not activate subscriptions.") &&
    contract.forbiddenActions.includes("Do not execute payments.") &&
    contract.forbiddenActions.includes("Do not write or mutate entitlements.") &&
    contract.forbiddenActions.includes("Do not send customer messages.") &&
    contract.forbiddenActions.includes("Do not call AI models.")
      ? pass(
          "forbidden-actions",
          "Forbidden execution actions remain explicitly blocked",
          "Subscription activation, payment execution, entitlement mutation, message sending, and AI model calls are forbidden."
        )
      : fail(
          "forbidden-actions",
          "Forbidden execution actions remain explicitly blocked",
          "One or more forbidden execution actions are missing."
        ),

    contract.zeroDamageRules.includes("Unknown subscription state means locked.") &&
    contract.zeroDamageRules.includes("Missing entitlement scope means locked.") &&
    contract.zeroDamageRules.includes(
      "Preview route must not execute, persist, mutate, approve, reject, charge, invoice, or send."
    )
      ? pass(
          "zero-damage-rules",
          "Zero Damage subscription lock rules are present",
          "Unknown subscription state and missing entitlement scope remain locked."
        )
      : fail(
          "zero-damage-rules",
          "Zero Damage subscription lock rules are present",
          "One or more Zero Damage rules are missing."
        ),

    contract.ownerOverrideRules.includes(
      "This contract does not execute owner override."
    )
      ? pass(
          "owner-override-non-execution",
          "Owner override is not executed by this validator or contract",
          "Owner override remains a future approved architecture requirement only."
        )
      : fail(
          "owner-override-non-execution",
          "Owner override is not executed by this validator or contract",
          "Owner override non-execution rule is missing."
        ),
  ];

  const overallStatus: ValidationStatus = checks.every(
    (check) => check.status === "pass"
  )
    ? "pass"
    : "fail";

  return {
    validatorId: "controlled-paid-pilot-subscription-lock-boundary-validator-v1",
    title: "NEXUS Controlled Paid Pilot Subscription Lock Boundary Validator v1",
    mode: "read-only-preview-validator",
    day: 225,
    overallStatus,
    checks,
    blockedExecutionSummary: [
      "No subscription activation.",
      "No subscription mutation.",
      "No payment execution.",
      "No invoice creation.",
      "No entitlement writes.",
      "No customer data writes.",
      "No real DB customer memory read/write.",
      "No audit persistence.",
      "No approve/reject execution.",
      "No message sending.",
      "No third-party mutation.",
      "No AI model calls.",
    ],
    manualEscalationSummary: [
      "Escalate when subscription status is unknown.",
      "Escalate when entitlement scope is incomplete.",
      "Escalate when future access could unlock customer-impacting behavior.",
      "Escalate when payment, invoice, or subscription activation is requested.",
    ],
    safetyConclusion:
      overallStatus === "pass"
        ? "Subscription lock boundary validated as read-only, owner-controlled, locked-by-default, and safe for controlled paid pilot planning."
        : "Subscription lock boundary validation failed. Manual owner review required before any continuation.",
  };
}
