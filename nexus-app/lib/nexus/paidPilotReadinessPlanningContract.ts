import { getRealPilotExecutionArchitecturePlanningFinalPhaseCheckpoint } from "./realPilotExecutionArchitecturePlanningFinalPhaseCheckpoint";

export type PaidPilotReadinessPlanningContractBoundary = {
  id: string;
  title: string;
  status: "LOCKED" | "DEFINED" | "BLOCKED";
  contract: string;
  safetyBoundary: string;
};

export type PaidPilotReadinessPlanningContract = {
  id: string;
  day: 151;
  name: string;
  phase: string;
  mode: "read-only-paid-pilot-planning-contract-preview-only";
  dependsOn: string;
  status: "DEFINED" | "BLOCKED";
  contractSummary: {
    previousArchitecturePhaseCleared: boolean;
    paidPilotPlanningStarted: boolean;
    subscriptionLockPlanningOnly: boolean;
    paymentExecutionBlocked: boolean;
    messageSendingBlocked: boolean;
    customerDataWritesBlocked: boolean;
    ownerControlPreserved: boolean;
    lockedVisionPreserved: boolean;
    result: "PAID_PILOT_PLANNING_CONTRACT_DEFINED" | "BLOCKED";
  };
  boundaries: PaidPilotReadinessPlanningContractBoundary[];
  prohibitedActions: string[];
  requiredContinuity: string[];
  nextRecommendedStep: string;
};

export function getPaidPilotReadinessPlanningContract(): PaidPilotReadinessPlanningContract {
  const previousCheckpoint = getRealPilotExecutionArchitecturePlanningFinalPhaseCheckpoint();

  const previousArchitecturePhaseCleared =
    previousCheckpoint.status === "CLEARED" &&
    previousCheckpoint.finalCheckpointSummary.safeForArchitecturePhaseClose;

  const defined = previousArchitecturePhaseCleared;

  return {
    id: "nexus-paid-pilot-readiness-planning-contract-v1",
    day: 151,
    name: "NEXUS Paid Pilot Readiness Planning Contract v1",
    phase: "Paid Pilot Readiness Planning",
    mode: "read-only-paid-pilot-planning-contract-preview-only",
    dependsOn:
      "Day 150 Real Pilot Execution Architecture Planning Final Phase Checkpoint v1",
    status: defined ? "DEFINED" : "BLOCKED",
    contractSummary: {
      previousArchitecturePhaseCleared,
      paidPilotPlanningStarted: defined,
      subscriptionLockPlanningOnly: true,
      paymentExecutionBlocked: true,
      messageSendingBlocked: true,
      customerDataWritesBlocked: true,
      ownerControlPreserved:
        previousCheckpoint.finalCheckpointSummary.ownerControlPreserved,
      lockedVisionPreserved:
        previousCheckpoint.finalCheckpointSummary.lockedVisionPreserved,
      result: defined ? "PAID_PILOT_PLANNING_CONTRACT_DEFINED" : "BLOCKED",
    },
    boundaries: [
      {
        id: "paid-pilot-scope-boundary",
        title: "Paid pilot scope boundary",
        status: defined ? "DEFINED" : "BLOCKED",
        contract:
          "Paid pilot readiness planning can define pilot eligibility, access tiers, subscription locks, owner onboarding, and safety expectations.",
        safetyBoundary:
          "This contract cannot activate paid access, collect payment, create invoices, charge customers, or provision real accounts.",
      },
      {
        id: "subscription-lock-boundary",
        title: "Subscription Lock planning boundary",
        status: "LOCKED",
        contract:
          "Subscription Lock is planned as a future access-control layer that can block unavailable features until a valid paid plan exists.",
        safetyBoundary:
          "No real subscription verification, payment provider call, entitlement write, or account lock mutation is enabled.",
      },
      {
        id: "owner-approval-boundary",
        title: "Owner Approval boundary",
        status: "LOCKED",
        contract:
          "Owner Approval remains mandatory before any future pilot execution, customer action, or operational mutation can occur.",
        safetyBoundary:
          "No approve/reject execution is enabled by this planning contract.",
      },
      {
        id: "read-only-pilot-boundary",
        title: "Read-only pilot discipline boundary",
        status: "LOCKED",
        contract:
          "Paid pilot readiness planning stays preview-only until future execution gates are explicitly designed, validated, and checkpointed.",
        safetyBoundary:
          "No customer data write, real DB memory read/write, audit persistence, recovery execution, message sending, or third-party mutation is enabled.",
      },
      {
        id: "trust-first-identity-boundary",
        title: "Trust-first NEXUS identity boundary",
        status: "LOCKED",
        contract:
          "NEXUS remains an owner-controlled AI Business Operating Layer above existing business software.",
        safetyBoundary:
          "NEXUS must not become a chatbot, CRM clone, ERP clone, or Make/Zapier clone.",
      },
      {
        id: "ai-model-isolation-boundary",
        title: "AI model isolation boundary",
        status: "LOCKED",
        contract:
          "Paid pilot readiness planning uses deterministic local planning data only.",
        safetyBoundary:
          "No AI model calls from this safety route.",
      },
    ],
    prohibitedActions: [
      "No risky execution",
      "No approve/reject execution",
      "No payment execution",
      "No invoice creation",
      "No subscription activation",
      "No entitlement writes",
      "No message sending",
      "No customer data write",
      "No real DB memory read/write",
      "No audit persistence",
      "No recovery execution",
      "No third-party mutation",
      "No AI model calls",
    ],
    requiredContinuity: previousCheckpoint.requiredContinuity,
    nextRecommendedStep:
      "Day 152: add paid pilot readiness planning validator v1.",
  };
}
