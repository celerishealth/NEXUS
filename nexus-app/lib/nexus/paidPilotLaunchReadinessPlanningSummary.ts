import { getPaidPilotLaunchReadinessPlanningContract } from "./paidPilotLaunchReadinessPlanningContract";
import { getPaidPilotLaunchReadinessPlanningValidationReport } from "./paidPilotLaunchReadinessPlanningValidator";

export type PaidPilotLaunchReadinessPlanningSummaryStatus =
  | "SUMMARY_READY"
  | "SUMMARY_BLOCKED";

export type PaidPilotLaunchReadinessPlanningSummarySection = {
  id: string;
  title: string;
  points: string[];
};

export type PaidPilotLaunchReadinessPlanningSummary = {
  id: string;
  day: 173;
  name: string;
  phase: string;
  mode: string;
  status: PaidPilotLaunchReadinessPlanningSummaryStatus;
  sourceContractId: string;
  sourceValidatorId: string;
  validatorPassed: boolean;
  launchReadinessSummary: PaidPilotLaunchReadinessPlanningSummarySection[];
  preservedLaws: string[];
  blockedExecutionActions: string[];
  nextPlanningStep: string;
  safetyBoundary: string;
};

export function getPaidPilotLaunchReadinessPlanningSummary(): PaidPilotLaunchReadinessPlanningSummary {
  const contract = getPaidPilotLaunchReadinessPlanningContract();
  const validationReport = getPaidPilotLaunchReadinessPlanningValidationReport();

  return {
    id: "paid-pilot-launch-readiness-planning-summary-v1",
    day: 173,
    name: "NEXUS Paid Pilot Launch Readiness Planning Summary v1",
    phase: "safe-paid-pilot-launch-readiness-planning",
    mode: "read-only-paid-pilot-launch-readiness-planning-summary-preview-only",
    status: validationReport.passed ? "SUMMARY_READY" : "SUMMARY_BLOCKED",
    sourceContractId: contract.id,
    sourceValidatorId: validationReport.id,
    validatorPassed: validationReport.passed,
    launchReadinessSummary: [
      {
        id: "launch-scope-summary",
        title: "Paid pilot launch readiness scope",
        points: contract.launchReadinessScope
      },
      {
        id: "owner-control-summary",
        title: "Owner-controlled pilot launch discipline",
        points: contract.requiredOwnerControls
      },
      {
        id: "gate-summary",
        title: "Launch readiness planning gates",
        points: contract.gates.map((gate) => `${gate.title} Status: ${gate.status}.`)
      },
      {
        id: "validator-summary",
        title: "Day 172 validator result",
        points: validationReport.checks.map((check) => `${check.title} Result: ${check.status}.`)
      }
    ],
    preservedLaws: [
      "Owner Approval",
      "Safety Layer",
      "Zero Damage",
      "Zero Stop",
      "Audit Logs discipline",
      "Customer Memory boundary discipline",
      "Fallback/Recovery planning",
      "Subscription Lock",
      "Shadow Mode",
      "Read-only pilot discipline",
      "Trust-first architecture"
    ],
    blockedExecutionActions: contract.blockedExecutionActions,
    nextPlanningStep:
      "Prepare a paid pilot launch readiness planning checkpoint before any controlled pilot launch execution architecture is considered.",
    safetyBoundary:
      "This summary is read-only and summarizes only static planning and validation outputs. It does not approve, reject, execute payments, create invoices, activate subscriptions, write entitlements, send messages, write customer data, read or write real database memory, persist audit events, execute recovery, call AI models, or connect to live business software."
  };
}
