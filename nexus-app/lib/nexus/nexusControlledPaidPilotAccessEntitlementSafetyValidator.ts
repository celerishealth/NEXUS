import { nexusControlledPaidPilotRegistryCards } from "@/lib/nexus/nexusControlledPaidPilotRegistryCards";
import { getNexusControlledPaidPilotAccessEntitlementSafetyContract } from "@/lib/nexus/nexusControlledPaidPilotAccessEntitlementSafetyContract";

export type NexusControlledPaidPilotAccessEntitlementSafetyValidator = {
  routeMode: "read-only-controlled-paid-pilot-access-entitlement-safety-validator-preview-only";
  day: 223;
  title: "NEXUS Controlled Paid Pilot Access and Entitlement Safety Validator v1";
  phase: "Controlled Paid Pilot Access / Entitlement Safety Validation";
  purpose: string;
  validationSummary: {
    contractDay: number;
    registryHasContract: boolean;
    registryHasValidator: boolean;
    accessPolicySafe: boolean;
    lockedVisionPresent: boolean;
    entitlementPrinciplesComplete: boolean;
    futurePrerequisitesComplete: boolean;
    blockedTransitionsComplete: boolean;
    strictGuaranteesComplete: boolean;
    validationStatus: "passed" | "needs-review";
  };
  validatorChecks: {
    id: string;
    label: string;
    status: "passed" | "needs-review";
    evidence: string;
  }[];
  preservedVision: string[];
  strictNonExecutionGuarantees: string[];
  nextRecommendedStep: string;
};

function hasExactText(values: readonly string[], target: string) {
  return values.map((value) => String(value).toLowerCase()).indexOf(target.toLowerCase()) !== -1;
}

export function getNexusControlledPaidPilotAccessEntitlementSafetyValidator(): NexusControlledPaidPilotAccessEntitlementSafetyValidator {
  const contract = getNexusControlledPaidPilotAccessEntitlementSafetyContract();
  const registryDays: number[] = nexusControlledPaidPilotRegistryCards.map((card) => Number(card.day));

  const requiredVisionBoundaries = [
    "not a chatbot",
    "not a CRM clone",
    "not an ERP clone",
    "not a Make/Zapier clone",
    "not an uncontrolled automation runner",
  ];

  const requiredBlockedTransitions = [
    "subscription activation",
    "entitlement write",
    "payment execution",
    "invoice creation",
    "approve/reject execution",
    "message sending",
    "customer data write",
    "real memory read/write",
    "audit persistence",
    "recovery execution",
    "third-party mutation",
    "AI model call",
  ];

  const requiredGuarantees = [
    "does not approve or reject owner decisions",
    "does not execute payments",
    "does not create invoices",
    "does not activate subscriptions",
    "does not write entitlements",
    "does not send messages",
    "does not write customer data",
    "does not read or write real DB memory",
    "does not persist audit events",
    "does not execute recovery",
    "does not mutate third-party systems",
    "does not call AI models",
  ];

  const registryHasContract = registryDays.indexOf(222) !== -1;
  const registryHasValidator = registryDays.indexOf(223) !== -1;

  const accessPolicySafe =
    contract.accessPolicy.accessActivationAllowedNow === false &&
    contract.accessPolicy.entitlementWriteAllowedNow === false &&
    contract.accessPolicy.subscriptionActivationAllowedNow === false &&
    contract.accessPolicy.paymentExecutionAllowedNow === false &&
    contract.accessPolicy.invoiceCreationAllowedNow === false &&
    contract.accessPolicy.previewAllowedNow === true &&
    contract.accessPolicy.ownerGateRequiredForFutureAccessChanges === true &&
    contract.accessPolicy.failClosedWithoutEntitlementProof === true;

  const lockedVisionPresent = requiredVisionBoundaries.every((boundary) =>
    hasExactText(contract.lockedVision.not, boundary)
  );

  const entitlementPrinciplesComplete = contract.entitlementSafetyPrinciples.length >= 6;
  const futurePrerequisitesComplete = contract.futureAccessPrerequisites.length >= 8;

  const transitionTargets = contract.blockedAccessTransitions.map((transition) =>
    String(transition.to)
  );

  const blockedTransitionsComplete = requiredBlockedTransitions.every((transition) =>
    hasExactText(transitionTargets, transition)
  );

  const strictGuaranteesComplete = requiredGuarantees.every((guarantee) =>
    hasExactText(contract.strictNonExecutionGuarantees, guarantee)
  );

  const validationStatus =
    contract.day === 222 &&
    registryHasContract &&
    registryHasValidator &&
    accessPolicySafe &&
    lockedVisionPresent &&
    entitlementPrinciplesComplete &&
    futurePrerequisitesComplete &&
    blockedTransitionsComplete &&
    strictGuaranteesComplete
      ? "passed"
      : "needs-review";

  return {
    routeMode: "read-only-controlled-paid-pilot-access-entitlement-safety-validator-preview-only",
    day: 223,
    title: "NEXUS Controlled Paid Pilot Access and Entitlement Safety Validator v1",
    phase: "Controlled Paid Pilot Access / Entitlement Safety Validation",
    purpose:
      "Validate that the Day 222 controlled paid pilot access and entitlement safety contract preserves locked NEXUS vision, owner gate, least-privilege access, entitlement proof, billing proof, audit linkage, rollback linkage, fail-closed behavior, and blocked execution surfaces.",
    validationSummary: {
      contractDay: contract.day,
      registryHasContract,
      registryHasValidator,
      accessPolicySafe,
      lockedVisionPresent,
      entitlementPrinciplesComplete,
      futurePrerequisitesComplete,
      blockedTransitionsComplete,
      strictGuaranteesComplete,
      validationStatus,
    },
    validatorChecks: [
      {
        id: "contract-day",
        label: "Contract day is correct",
        status: contract.day === 222 ? "passed" : "needs-review",
        evidence:
          "Validator expects Day 222 controlled paid pilot access and entitlement safety contract as the validated source.",
      },
      {
        id: "registry-continuity",
        label: "Registry continuity is preserved",
        status: registryHasContract && registryHasValidator ? "passed" : "needs-review",
        evidence:
          "Dashboard registry includes both Day 222 access/entitlement safety and Day 223 validator entries.",
      },
      {
        id: "access-policy-safe",
        label: "Access policy remains safe",
        status: accessPolicySafe ? "passed" : "needs-review",
        evidence:
          "Access activation, entitlement writes, subscription activation, payment execution, and invoice creation remain blocked while preview remains allowed.",
      },
      {
        id: "locked-vision",
        label: "Locked NEXUS vision is preserved",
        status: lockedVisionPresent ? "passed" : "needs-review",
        evidence:
          "Contract preserves not-chatbot, not-CRM-clone, not-ERP-clone, not-Make/Zapier-clone, and not-uncontrolled-automation-runner boundaries.",
      },
      {
        id: "entitlement-principles",
        label: "Entitlement safety principles are complete",
        status: entitlementPrinciplesComplete ? "passed" : "needs-review",
        evidence:
          "Contract locks access blocked by default, payment-is-not-access-yet, owner gate, least privilege, no hidden entitlement write, and fail-closed behavior.",
      },
      {
        id: "future-prerequisites",
        label: "Future access prerequisites are complete",
        status: futurePrerequisitesComplete ? "passed" : "needs-review",
        evidence:
          "Contract defines subscription lock, entitlement schema, billing proof, owner approval, audit readiness, rollback, pilot identity, and feature scope prerequisites.",
      },
      {
        id: "blocked-transitions",
        label: "Blocked access transitions are complete",
        status: blockedTransitionsComplete ? "passed" : "needs-review",
        evidence:
          "Subscription activation, entitlement write, payment, invoice, approval mutation, message sending, customer data, memory, audit persistence, recovery, third-party mutation, and AI calls remain blocked.",
      },
      {
        id: "strict-guarantees",
        label: "Strict non-execution guarantees are complete",
        status: strictGuaranteesComplete ? "passed" : "needs-review",
        evidence:
          "Contract contains all required strict non-execution guarantees for controlled paid pilot access planning.",
      },
      {
        id: "no-execution-change",
        label: "Validator does not change execution behavior",
        status: "passed",
        evidence:
          "This validator is deterministic and read-only. It does not approve, reject, execute, persist, mutate, send, recover, call third parties, or call AI models.",
      },
    ],
    preservedVision: [
      "AI Business Operating Layer above existing business software",
      "not a chatbot",
      "not a CRM clone",
      "not an ERP clone",
      "not a Make/Zapier clone",
      "Owner Approval preserved",
      "Safety Layer preserved",
      "Zero Damage preserved",
      "Zero Stop preserved",
      "Access blocked by default",
      "Entitlement writes blocked",
      "Subscription activation blocked",
      "Payment execution blocked",
      "Invoice creation blocked",
      "Audit readiness required before future access changes",
      "Rollback readiness required before future access changes",
      "Least-privilege paid pilot access preserved",
      "Controlled paid pilot access planning remains read-only",
    ],
    strictNonExecutionGuarantees: requiredGuarantees,
    nextRecommendedStep:
      "Day 224: NEXUS Controlled Paid Pilot Subscription Lock Boundary Contract v1",
  };
}
