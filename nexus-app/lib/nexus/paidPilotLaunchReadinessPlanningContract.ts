export type PaidPilotLaunchReadinessPlanningStatus =
  | "READY_FOR_PLANNING"
  | "LOCKED"
  | "BLOCKED";

export type PaidPilotLaunchReadinessPlanningGate = {
  id: string;
  title: string;
  status: PaidPilotLaunchReadinessPlanningStatus;
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningContract = {
  id: string;
  day: 171;
  name: string;
  phase: string;
  mode: string;
  objective: string;
  launchReadinessScope: string[];
  gates: PaidPilotLaunchReadinessPlanningGate[];
  blockedExecutionActions: string[];
  requiredOwnerControls: string[];
  safetyBoundary: string;
};

export const paidPilotLaunchReadinessPlanningContract: PaidPilotLaunchReadinessPlanningContract = {
  id: "paid-pilot-launch-readiness-planning-contract-v1",
  day: 171,
  name: "NEXUS Paid Pilot Launch Readiness Planning Contract v1",
  phase: "safe-paid-pilot-launch-readiness-planning",
  mode: "read-only-paid-pilot-launch-readiness-planning-preview-only",
  objective:
    "Begin paid pilot launch readiness planning without activating subscriptions, executing customer operations, sending messages, writing customer data, or touching real business systems.",
  launchReadinessScope: [
    "define paid pilot launch readiness gates",
    "define owner-controlled launch boundaries",
    "define read-only pilot review discipline",
    "define blocked execution actions before live architecture exists",
    "define safety-first transition from planning to controlled pilot readiness"
  ],
  gates: [
    {
      id: "owner-control-gate",
      title: "Owner approval remains mandatory before any risky customer-facing or business-impacting action.",
      status: "READY_FOR_PLANNING",
      evidence: [
        "Owner Approval remains a preserved NEXUS law.",
        "This contract does not approve, reject, execute, or automate owner decisions."
      ]
    },
    {
      id: "read-only-pilot-gate",
      title: "Paid pilot launch planning remains read-only until explicit live execution architecture is designed.",
      status: "READY_FOR_PLANNING",
      evidence: [
        "Route is preview-only.",
        "No customer data write, no entitlement write, no invoice creation, no payment execution, and no message sending."
      ]
    },
    {
      id: "safety-layer-gate",
      title: "Safety Layer, Zero Damage, Zero Stop, audit discipline, and fallback planning remain non-negotiable.",
      status: "READY_FOR_PLANNING",
      evidence: [
        "Contract preserves NEXUS as a control layer above existing systems.",
        "No recovery execution or audit persistence is performed by this contract."
      ]
    },
    {
      id: "subscription-lock-gate",
      title: "Subscription Lock remains planning-only and cannot activate paid access from this route.",
      status: "LOCKED",
      evidence: [
        "No subscription activation is included.",
        "No entitlement writes are included."
      ]
    }
  ],
  blockedExecutionActions: [
    "approve owner decisions",
    "reject owner decisions",
    "execute payments",
    "create invoices",
    "activate subscriptions",
    "write entitlements",
    "send messages",
    "write customer data",
    "read or write real database memory",
    "persist audit events",
    "execute recovery",
    "call AI models",
    "connect to live business software"
  ],
  requiredOwnerControls: [
    "owner-visible launch readiness checklist",
    "owner approval before risky execution",
    "owner-visible blocked action boundary",
    "owner-visible pilot scope",
    "owner-visible rollback and fallback planning"
  ],
  safetyBoundary:
    "This module is a safe read-only paid pilot launch readiness planning contract. It only returns static planning information and must not execute customer-facing, financial, subscription, entitlement, memory, audit, recovery, or AI model behavior."
};

export function getPaidPilotLaunchReadinessPlanningContract(): PaidPilotLaunchReadinessPlanningContract {
  return paidPilotLaunchReadinessPlanningContract;
}
