import {
  getPaidPilotLaunchReadinessPlanningContract,
  type PaidPilotLaunchReadinessPlanningContract
} from "./paidPilotLaunchReadinessPlanningContract";

export type PaidPilotLaunchReadinessPlanningValidatorCheckStatus =
  | "PASSED"
  | "FAILED";

export type PaidPilotLaunchReadinessPlanningValidatorCheck = {
  id: string;
  title: string;
  status: PaidPilotLaunchReadinessPlanningValidatorCheckStatus;
  evidence: string[];
};

export type PaidPilotLaunchReadinessPlanningValidationReport = {
  id: string;
  day: 172;
  name: string;
  phase: string;
  mode: string;
  sourceContractId: string;
  passed: boolean;
  checks: PaidPilotLaunchReadinessPlanningValidatorCheck[];
  blockedExecutionActionsVerified: string[];
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
  "connect to live business software"
];

const requiredOwnerControls = [
  "owner-visible launch readiness checklist",
  "owner approval before risky execution",
  "owner-visible blocked action boundary",
  "owner-visible pilot scope",
  "owner-visible rollback and fallback planning"
];

function includesEvery(source: string[], required: string[]) {
  return required.every((item) => source.includes(item));
}

function validateContract(
  contract: PaidPilotLaunchReadinessPlanningContract
): PaidPilotLaunchReadinessPlanningValidatorCheck[] {
  const hasReadOnlyMode = contract.mode === "read-only-paid-pilot-launch-readiness-planning-preview-only";
  const hasRequiredBlockedActions = includesEvery(contract.blockedExecutionActions, requiredBlockedActions);
  const hasRequiredOwnerControls = includesEvery(contract.requiredOwnerControls, requiredOwnerControls);
  const gatesArePlanningSafe = contract.gates.every((gate) =>
    gate.status === "READY_FOR_PLANNING" || gate.status === "LOCKED"
  );
  const hasNoBlockedGate = contract.gates.every((gate) => gate.status !== "BLOCKED");
  const hasSafetyBoundary =
    contract.safetyBoundary.includes("safe read-only") &&
    contract.safetyBoundary.includes("must not execute");

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
      title: "Contract must preserve owner-visible launch controls.",
      status: hasRequiredOwnerControls ? "PASSED" : "FAILED",
      evidence: contract.requiredOwnerControls
    },
    {
      id: "planning-gates-check",
      title: "Planning gates must be safe for read-only launch readiness planning.",
      status: gatesArePlanningSafe && hasNoBlockedGate ? "PASSED" : "FAILED",
      evidence: contract.gates.map((gate) => `${gate.id}:${gate.status}`)
    },
    {
      id: "safety-boundary-check",
      title: "Safety boundary must prevent execution behavior.",
      status: hasSafetyBoundary ? "PASSED" : "FAILED",
      evidence: [contract.safetyBoundary]
    }
  ];
}

export function getPaidPilotLaunchReadinessPlanningValidationReport(): PaidPilotLaunchReadinessPlanningValidationReport {
  const contract = getPaidPilotLaunchReadinessPlanningContract();
  const checks = validateContract(contract);
  const passed = checks.every((check) => check.status === "PASSED");

  return {
    id: "paid-pilot-launch-readiness-planning-validator-v1",
    day: 172,
    name: "NEXUS Paid Pilot Launch Readiness Planning Validator v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-validator-preview-only",
    sourceContractId: contract.id,
    passed,
    checks,
    blockedExecutionActionsVerified: requiredBlockedActions,
    safetyBoundary:
      "This validator is read-only and validates only the static Day 171 planning contract. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
