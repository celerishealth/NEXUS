import {
  getControlledPaidPilotLaunchArchitecturePlanningContract,
  type ControlledPaidPilotLaunchArchitecturePlanningContract
} from "./controlledPaidPilotLaunchArchitecturePlanningContract";

export type ControlledPaidPilotLaunchArchitecturePlanningValidatorCheckStatus =
  | "PASSED"
  | "FAILED";

export type ControlledPaidPilotLaunchArchitecturePlanningValidatorCheck = {
  id: string;
  title: string;
  status: ControlledPaidPilotLaunchArchitecturePlanningValidatorCheckStatus;
  evidence: string[];
};

export type ControlledPaidPilotLaunchArchitecturePlanningValidationReport = {
  id: string;
  day: 185;
  name: string;
  phase: string;
  mode: string;
  sourceContractId: string;
  passed: boolean;
  checks: ControlledPaidPilotLaunchArchitecturePlanningValidatorCheck[];
  blockedExecutionActionsVerified: string[];
  requiredOwnerControlsVerified: string[];
  requiredSafetyLayersVerified: string[];
  requiredArchitectureBoundariesVerified: string[];
  safetyBoundary: string;
};

const requiredBlockedActions = [
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
  "connect to live business software",
  "trigger external automations",
  "change customer-facing state"
];

const requiredOwnerControls = [
  "owner-visible controlled launch checklist",
  "owner-visible subscription lock gate",
  "owner-visible entitlement planning gate",
  "owner-visible customer impact boundary",
  "owner-visible rollback and fallback plan",
  "owner approval before every risky execution path"
];

const requiredSafetyLayers = [
  "Safety Layer",
  "Owner Approval",
  "Shadow Mode",
  "Zero Damage",
  "Zero Stop",
  "Audit Logs discipline",
  "Customer Memory boundary discipline",
  "Fallback/Recovery planning",
  "Subscription Lock"
];

const requiredArchitectureBoundaries = [
  "planning-only contract",
  "read-only preview route",
  "no live system connection",
  "no AI model execution",
  "no persistence",
  "no customer-facing side effects",
  "no financial side effects",
  "no subscription or entitlement side effects"
];

function includesEvery(source: string[], required: string[]) {
  return required.every((item) => source.includes(item));
}

function validateContract(
  contract: ControlledPaidPilotLaunchArchitecturePlanningContract
): ControlledPaidPilotLaunchArchitecturePlanningValidatorCheck[] {
  const hasReadOnlyMode =
    contract.mode === "read-only-controlled-paid-pilot-launch-architecture-planning-preview-only";
  const hasRequiredBlockedActions = includesEvery(contract.blockedExecutionActions, requiredBlockedActions);
  const hasRequiredOwnerControls = includesEvery(contract.requiredOwnerControls, requiredOwnerControls);
  const hasRequiredSafetyLayers = includesEvery(contract.requiredSafetyLayers, requiredSafetyLayers);
  const hasRequiredArchitectureBoundaries = includesEvery(
    contract.requiredArchitectureBoundaries,
    requiredArchitectureBoundaries
  );
  const gatesArePlanningSafe = contract.gates.every((gate) =>
    gate.status === "READY_FOR_ARCHITECTURE_PLANNING" || gate.status === "LOCKED"
  );
  const hasNoBlockedGate = contract.gates.every((gate) => gate.status !== "BLOCKED");
  const hasArchitecturePlanningScope =
    contract.architecturePlanningScope.includes("define controlled paid pilot launch architecture boundaries") &&
    contract.architecturePlanningScope.includes("define owner approval checkpoints before any risky action") &&
    contract.architecturePlanningScope.includes("define subscription lock planning without activation") &&
    contract.architecturePlanningScope.includes("define entitlement planning without writes") &&
    contract.architecturePlanningScope.includes("define audit planning without persistence") &&
    contract.architecturePlanningScope.includes("define customer memory planning without real memory reads or writes") &&
    contract.architecturePlanningScope.includes("define fallback and rollback planning without recovery execution") &&
    contract.architecturePlanningScope.includes("define shadow-mode pilot architecture before live execution");
  const hasSafetyBoundary =
    contract.safetyBoundary.includes("safe read-only") &&
    contract.safetyBoundary.includes("must not execute") &&
    contract.safetyBoundary.includes("AI model") &&
    contract.safetyBoundary.includes("live business software");

  return [
    {
      id: "read-only-mode-check",
      title: "Contract must remain read-only preview-only.",
      status: hasReadOnlyMode ? "PASSED" : "FAILED",
      evidence: [contract.mode]
    },
    {
      id: "blocked-execution-actions-check",
      title: "Contract must explicitly block all risky execution actions.",
      status: hasRequiredBlockedActions ? "PASSED" : "FAILED",
      evidence: contract.blockedExecutionActions
    },
    {
      id: "owner-controls-check",
      title: "Contract must preserve owner-visible controlled launch controls.",
      status: hasRequiredOwnerControls ? "PASSED" : "FAILED",
      evidence: contract.requiredOwnerControls
    },
    {
      id: "safety-layers-check",
      title: "Contract must preserve required NEXUS safety layers.",
      status: hasRequiredSafetyLayers ? "PASSED" : "FAILED",
      evidence: contract.requiredSafetyLayers
    },
    {
      id: "architecture-boundaries-check",
      title: "Contract must preserve architecture boundaries before live execution.",
      status: hasRequiredArchitectureBoundaries ? "PASSED" : "FAILED",
      evidence: contract.requiredArchitectureBoundaries
    },
    {
      id: "planning-gates-check",
      title: "Architecture planning gates must be safe and non-executing.",
      status: gatesArePlanningSafe && hasNoBlockedGate ? "PASSED" : "FAILED",
      evidence: contract.gates.map((gate) => `${gate.id}:${gate.status}`)
    },
    {
      id: "architecture-scope-check",
      title: "Contract must include controlled paid pilot launch architecture planning scope.",
      status: hasArchitecturePlanningScope ? "PASSED" : "FAILED",
      evidence: contract.architecturePlanningScope
    },
    {
      id: "safety-boundary-check",
      title: "Safety boundary must prevent execution behavior.",
      status: hasSafetyBoundary ? "PASSED" : "FAILED",
      evidence: [contract.safetyBoundary]
    }
  ];
}

export function getControlledPaidPilotLaunchArchitecturePlanningValidationReport(): ControlledPaidPilotLaunchArchitecturePlanningValidationReport {
  const contract = getControlledPaidPilotLaunchArchitecturePlanningContract();
  const checks = validateContract(contract);
  const passed = checks.every((check) => check.status === "PASSED");

  return {
    id: "controlled-paid-pilot-launch-architecture-planning-validator-v1",
    day: 185,
    name: "NEXUS Controlled Paid Pilot Launch Architecture Planning Validator v1",
    phase: "safe-controlled-paid-pilot-launch-architecture-planning",
    mode: "read-only-controlled-paid-pilot-launch-architecture-planning-validator-preview-only",
    sourceContractId: contract.id,
    passed,
    checks,
    blockedExecutionActionsVerified: requiredBlockedActions,
    requiredOwnerControlsVerified: requiredOwnerControls,
    requiredSafetyLayersVerified: requiredSafetyLayers,
    requiredArchitectureBoundariesVerified: requiredArchitectureBoundaries,
    safetyBoundary:
      "This validator is read-only and validates only the static Day 184 controlled paid pilot launch architecture planning contract. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, trigger external automations, change customer-facing state, or connect to live business software."
  };
}
