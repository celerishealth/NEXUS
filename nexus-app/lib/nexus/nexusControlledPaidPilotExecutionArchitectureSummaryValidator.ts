import { nexusControlledPaidPilotRegistryCards } from "@/lib/nexus/nexusControlledPaidPilotRegistryCards";
import { getNexusControlledPaidPilotExecutionArchitectureSummary } from "@/lib/nexus/nexusControlledPaidPilotExecutionArchitectureSummary";

export type NexusControlledPaidPilotExecutionArchitectureSummaryValidator = {
  routeMode: "read-only-controlled-paid-pilot-execution-architecture-summary-validator-preview-only";
  day: 219;
  title: "NEXUS Controlled Paid Pilot Execution Architecture Summary Validator v1";
  phase: "Controlled Paid Pilot Execution Architecture Summary Validation";
  purpose: string;
  validationSummary: {
    summaryDay: number;
    registryHasSummary: boolean;
    registryHasValidator: boolean;
    visionBoundariesPresent: boolean;
    hardBlocksComplete: boolean;
    strictGuaranteesComplete: boolean;
    completedBlocksPresent: boolean;
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

export function getNexusControlledPaidPilotExecutionArchitectureSummaryValidator(): NexusControlledPaidPilotExecutionArchitectureSummaryValidator {
  const summary = getNexusControlledPaidPilotExecutionArchitectureSummary();
  const registryDays: number[] = nexusControlledPaidPilotRegistryCards.map((card) => Number(card.day));

  const requiredVisionBoundaries = [
    "not a chatbot",
    "not a CRM clone",
    "not an ERP clone",
    "not a Make/Zapier clone",
    "not an uncontrolled automation runner",
  ];

  const requiredHardBlocks = [
    "approve/reject execution",
    "payment execution",
    "invoice creation",
    "subscription activation",
    "entitlement writes",
    "message sending",
    "customer data writes",
    "real DB memory reads/writes",
    "audit persistence",
    "recovery execution",
    "third-party mutation",
    "AI model calls",
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

  const registryHasSummary = registryDays.indexOf(218) !== -1;
  const registryHasValidator = registryDays.indexOf(219) !== -1;

  const visionBoundariesPresent = requiredVisionBoundaries.every((boundary) =>
    hasExactText(summary.lockedVision.not, boundary)
  );

  const hardBlocksComplete = requiredHardBlocks.every((block) =>
    hasExactText(summary.currentHardBlocks, block)
  );

  const strictGuaranteesComplete = requiredGuarantees.every((guarantee) =>
    hasExactText(summary.strictNonExecutionGuarantees, guarantee)
  );

  const completedBlocksPresent = summary.completedArchitectureBlocks.length >= 15;

  const validationStatus =
    summary.day === 218 &&
    registryHasSummary &&
    registryHasValidator &&
    visionBoundariesPresent &&
    hardBlocksComplete &&
    strictGuaranteesComplete &&
    completedBlocksPresent &&
    summary.summaryResult.status === "controlled-paid-pilot-execution-architecture-summarized"
      ? "passed"
      : "needs-review";

  return {
    routeMode: "read-only-controlled-paid-pilot-execution-architecture-summary-validator-preview-only",
    day: 219,
    title: "NEXUS Controlled Paid Pilot Execution Architecture Summary Validator v1",
    phase: "Controlled Paid Pilot Execution Architecture Summary Validation",
    purpose:
      "Validate that the Day 218 controlled paid pilot execution architecture summary preserves the locked NEXUS vision, owner control, safety layer, Zero Damage, Zero Stop, audit readiness, rollback readiness, incident readiness, manual override, safe stop, dashboard integrity, and blocked execution surfaces.",
    validationSummary: {
      summaryDay: summary.day,
      registryHasSummary,
      registryHasValidator,
      visionBoundariesPresent,
      hardBlocksComplete,
      strictGuaranteesComplete,
      completedBlocksPresent,
      validationStatus,
    },
    validatorChecks: [
      {
        id: "summary-day",
        label: "Summary day is correct",
        status: summary.day === 218 ? "passed" : "needs-review",
        evidence:
          "Validator expects Day 218 controlled paid pilot execution architecture summary as the validated source.",
      },
      {
        id: "registry-continuity",
        label: "Registry continuity is preserved",
        status: registryHasSummary && registryHasValidator ? "passed" : "needs-review",
        evidence:
          "Dashboard registry includes both Day 218 summary and Day 219 summary validator entries.",
      },
      {
        id: "locked-vision",
        label: "Locked NEXUS vision is preserved",
        status: visionBoundariesPresent ? "passed" : "needs-review",
        evidence:
          "Summary preserves not-chatbot, not-CRM-clone, not-ERP-clone, not-Make/Zapier-clone, and not-uncontrolled-automation-runner boundaries.",
      },
      {
        id: "hard-blocks",
        label: "Current hard blocks are complete",
        status: hardBlocksComplete ? "passed" : "needs-review",
        evidence:
          "Summary keeps approval, payment, invoice, subscription, entitlement, message, customer data, memory, audit persistence, recovery, third-party mutation, and AI model calls blocked.",
      },
      {
        id: "strict-guarantees",
        label: "Strict non-execution guarantees are complete",
        status: strictGuaranteesComplete ? "passed" : "needs-review",
        evidence:
          "Summary contains all strict non-execution guarantees required for controlled paid pilot planning.",
      },
      {
        id: "architecture-blocks",
        label: "Completed architecture blocks are present",
        status: completedBlocksPresent ? "passed" : "needs-review",
        evidence:
          "Summary covers Day 201 through Day 217 architecture blocks including owner control, safety, audit, rollback, incident readiness, manual override, safe stop, dashboard cleanup, and integrity validation.",
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
      "Audit readiness preserved",
      "Rollback/fallback readiness preserved",
      "Incident readiness preserved",
      "Manual owner override preserved",
      "Safe stop and manual escalation preserved",
      "Dashboard registry discipline preserved",
      "Mountain-strength architecture discipline preserved",
      "Controlled paid pilot execution planning remains read-only",
    ],
    strictNonExecutionGuarantees: requiredGuarantees,
    nextRecommendedStep:
      "Day 220: NEXUS Controlled Paid Pilot Execution Architecture Checkpoint v1",
  };
}
