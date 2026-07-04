export type ControlledPaidPilotLaunchActionClassAllowlistBlocklistContract = {
  routeMode: "read-only-action-class-allowlist-blocklist-preview-only";
  day: 205;
  title: "NEXUS Controlled Paid Pilot Launch Action-Class Allowlist and Blocklist Contract v1";
  phase: "Controlled Paid Pilot Launch Execution Architecture Planning";
  purpose: string;
  lockedVision: {
    identity: string;
    not: string[];
  };
  allowlistPolicy: {
    defaultActionState: "blocked";
    previewOnlyAllowedNow: true;
    mutationAllowedNow: false;
    ownerGateRequiredForFutureExecution: true;
  };
  previewOnlyAllowlist: {
    actionClass: string;
    allowedNow: true;
    mode: "preview-only";
    mutationCapability: false;
    reason: string;
  }[];
  futureEligibleWithContracts: {
    actionClass: string;
    allowedNow: false;
    futureEligibleOnlyAfter: string[];
    ownerGateRequired: true;
    reason: string;
  }[];
  hardBlocklist: {
    actionClass: string;
    blockedNow: true;
    futureStatus: "requires-separate-contract" | "blocked-until-explicit-owner-architecture";
    reason: string;
  }[];
  promotionRules: {
    id: string;
    rule: string;
    status: "locked";
  }[];
  strictNonExecutionGuarantees: string[];
  allowedPreviewActions: string[];
  nextRecommendedStep: string;
};

export function getControlledPaidPilotLaunchActionClassAllowlistBlocklistContract(): ControlledPaidPilotLaunchActionClassAllowlistBlocklistContract {
  return {
    routeMode: "read-only-action-class-allowlist-blocklist-preview-only",
    day: 205,
    title: "NEXUS Controlled Paid Pilot Launch Action-Class Allowlist and Blocklist Contract v1",
    phase: "Controlled Paid Pilot Launch Execution Architecture Planning",
    purpose:
      "Define which controlled paid pilot action classes are allowed only as read-only previews, which may become future eligible only after owner-approved contracts, and which remain hard-blocked.",
    lockedVision: {
      identity:
        "NEXUS is an owner-controlled AI Business Operating Layer above existing business software, operating as a trust-first control layer.",
      not: [
        "not a chatbot",
        "not a CRM clone",
        "not an ERP clone",
        "not a Make/Zapier clone",
        "not an uncontrolled automation runner",
      ],
    },
    allowlistPolicy: {
      defaultActionState: "blocked",
      previewOnlyAllowedNow: true,
      mutationAllowedNow: false,
      ownerGateRequiredForFutureExecution: true,
    },
    previewOnlyAllowlist: [
      {
        actionClass: "read-only readiness review",
        allowedNow: true,
        mode: "preview-only",
        mutationCapability: false,
        reason:
          "Can inspect planning state without reading real customer data or mutating business systems.",
      },
      {
        actionClass: "execution boundary preview",
        allowedNow: true,
        mode: "preview-only",
        mutationCapability: false,
        reason:
          "Can document future execution boundaries while keeping all real-world actions blocked.",
      },
      {
        actionClass: "owner gate preview",
        allowedNow: true,
        mode: "preview-only",
        mutationCapability: false,
        reason:
          "Can define owner-only decision requirements without approving or rejecting any real action.",
      },
      {
        actionClass: "risk scoring preview",
        allowedNow: true,
        mode: "preview-only",
        mutationCapability: false,
        reason:
          "Can classify action classes deterministically without executing, sending, writing, billing, or persisting.",
      },
      {
        actionClass: "action-class allowlist/blocklist preview",
        allowedNow: true,
        mode: "preview-only",
        mutationCapability: false,
        reason:
          "Can document allowed preview classes and blocked mutation classes without changing system state.",
      },
    ],
    futureEligibleWithContracts: [
      {
        actionClass: "customer response draft generation",
        allowedNow: false,
        futureEligibleOnlyAfter: [
          "owner execution gate contract",
          "customer communication safety contract",
          "audit persistence contract",
          "template safety contract",
          "message sending remains separately blocked until approved",
        ],
        ownerGateRequired: true,
        reason:
          "Draft creation may influence customer communication, so it requires owner review and communication safety before future use.",
      },
      {
        actionClass: "owner task recommendation",
        allowedNow: false,
        futureEligibleOnlyAfter: [
          "owner execution gate contract",
          "risk scoring contract",
          "audit preview contract",
          "manual override contract",
        ],
        ownerGateRequired: true,
        reason:
          "Recommendations can influence operational decisions and must remain separate from real execution.",
      },
      {
        actionClass: "subscription status preview",
        allowedNow: false,
        futureEligibleOnlyAfter: [
          "subscription lock contract",
          "entitlement read contract",
          "billing source verification contract",
          "audit persistence contract",
        ],
        ownerGateRequired: true,
        reason:
          "Subscription state can affect access and monetization, so only safe preview may be planned before any write path exists.",
      },
      {
        actionClass: "audit event preview",
        allowedNow: false,
        futureEligibleOnlyAfter: [
          "audit persistence contract",
          "schema contract",
          "retention contract",
          "owner visibility contract",
        ],
        ownerGateRequired: true,
        reason:
          "Audit design can be previewed later, but persistence remains blocked until explicit audit architecture is complete.",
      },
      {
        actionClass: "fallback recommendation preview",
        allowedNow: false,
        futureEligibleOnlyAfter: [
          "fallback contract",
          "rollback contract",
          "incident response contract",
          "owner notification contract",
        ],
        ownerGateRequired: true,
        reason:
          "Fallback planning can support Zero Stop, but recovery execution remains separately blocked.",
      },
    ],
    hardBlocklist: [
      {
        actionClass: "approve/reject execution",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Approve/reject mutation requires owner execution gate implementation, audit persistence, rollback readiness, and explicit action-class allowlist approval.",
      },
      {
        actionClass: "payment execution",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Payment execution requires billing architecture, reconciliation, refund/failure handling, compliance, audit, and owner confirmation.",
      },
      {
        actionClass: "invoice creation",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Invoice creation requires legal, tax, numbering, customer identity, audit, correction, and rollback discipline.",
      },
      {
        actionClass: "subscription activation",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Subscription activation requires subscription lock, entitlement validation, billing proof, audit, and rollback contracts.",
      },
      {
        actionClass: "entitlement write",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Entitlement writes change access rights and require strict owner approval, billing validation, audit, and rollback architecture.",
      },
      {
        actionClass: "message sending",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Customer messaging requires consent, template safety, rate limits, owner approval, audit, and communication fallback controls.",
      },
      {
        actionClass: "customer data write",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Customer data mutation requires schema, consent, retention, redaction, access control, audit, and rollback design.",
      },
      {
        actionClass: "real customer memory read/write",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Customer Memory must remain protected until explicit real memory access, redaction, retention, and owner-control architecture is approved.",
      },
      {
        actionClass: "audit persistence",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "This route documents audit expectations only and does not persist audit events.",
      },
      {
        actionClass: "recovery execution",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "Recovery execution requires incident classification, rollback verification, owner notification, and safe restore contracts.",
      },
      {
        actionClass: "third-party mutation",
        blockedNow: true,
        futureStatus: "requires-separate-contract",
        reason:
          "External mutation requires least-privilege adapters, dry-run mode, timeouts, retries, rollback, audit, and owner gates.",
      },
      {
        actionClass: "AI model call",
        blockedNow: true,
        futureStatus: "blocked-until-explicit-owner-architecture",
        reason:
          "This safety route is deterministic and does not call AI models or external services.",
      },
    ],
    promotionRules: [
      {
        id: "blocked-by-default",
        rule:
          "Every action class starts blocked unless explicitly placed in a preview-only allowlist or a future owner-approved execution allowlist.",
        status: "locked",
      },
      {
        id: "preview-does-not-promote",
        rule:
          "Preview-only status never automatically promotes to execution capability.",
        status: "locked",
      },
      {
        id: "separate-contract-required",
        rule:
          "Money, invoices, subscriptions, entitlements, messages, customer data, memory, audit persistence, recovery, third-party mutation, and AI calls require separate contracts before any future execution path.",
        status: "locked",
      },
      {
        id: "owner-gate-required",
        rule:
          "Future execution requires explicit owner gate, final confirmation, audit readiness, rollback readiness, and action-class eligibility.",
        status: "locked",
      },
      {
        id: "fail-closed-on-uncertainty",
        rule:
          "If risk, owner intent, entitlement, audit readiness, rollback readiness, adapter safety, or customer impact is uncertain, the action remains blocked.",
        status: "locked",
      },
    ],
    strictNonExecutionGuarantees: [
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
    ],
    allowedPreviewActions: [
      "inspect action-class allowlist and blocklist contract",
      "review preview-only allowlist",
      "review future eligible action classes",
      "review hard-blocked action classes",
      "prepare future pilot action preview lifecycle planning",
      "continue read-only controlled paid pilot execution architecture planning",
    ],
    nextRecommendedStep:
      "Day 206: Controlled Paid Pilot Launch Pilot Action Preview Lifecycle Contract v1",
  };
}
