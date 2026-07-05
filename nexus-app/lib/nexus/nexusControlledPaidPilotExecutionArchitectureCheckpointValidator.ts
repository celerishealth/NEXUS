import { nexusControlledPaidPilotRegistryCards } from "@/lib/nexus/nexusControlledPaidPilotRegistryCards";
import { getNexusControlledPaidPilotExecutionArchitectureCheckpoint } from "@/lib/nexus/nexusControlledPaidPilotExecutionArchitectureCheckpoint";

export type NexusControlledPaidPilotExecutionArchitectureCheckpointValidator = {
  routeMode: "read-only-controlled-paid-pilot-execution-architecture-checkpoint-validator-preview-only";
  day: 221;
  title: "NEXUS Controlled Paid Pilot Execution Architecture Checkpoint Validator v1";
  phase: "Controlled Paid Pilot Execution Architecture Checkpoint Validation";
  purpose: string;
  validationSummary: {
    checkpointDay: number;
    registryHasCheckpoint: boolean;
    registryHasValidator: boolean;
    lockedVisionPresent: boolean;
    milestoneCoverageComplete: boolean;
    checkpointChecksPassed: boolean;
    hardBlocksComplete: boolean;
    mountainLocksComplete: boolean;
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

export function getNexusControlledPaidPilotExecutionArchitectureCheckpointValidator(): NexusControlledPaidPilotExecutionArchitectureCheckpointValidator {
  const checkpoint = getNexusControlledPaidPilotExecutionArchitectureCheckpoint();
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

  const registryHasCheckpoint = registryDays.indexOf(220) !== -1;
  const registryHasValidator = registryDays.indexOf(221) !== -1;

  const lockedVisionPresent = requiredVisionBoundaries.every((boundary) =>
    hasExactText(checkpoint.lockedVision.not, boundary)
  );

  const milestoneCoverageComplete = checkpoint.checkpointMilestones.length >= 7;
  const checkpointChecksPassed = checkpoint.checkpointChecks.every((check) => check.status === "passed");

  const hardBlocksComplete = requiredHardBlocks.every((block) =>
    hasExactText(checkpoint.hardBlockedSurfaces, block)
  );

  const mountainLocksComplete = checkpoint.mountainStrengthLocks.length >= 7;

  const strictGuaranteesComplete = requiredGuarantees.every((guarantee) =>
    hasExactText(checkpoint.strictNonExecutionGuarantees, guarantee)
  );

  const validationStatus =
    checkpoint.day === 220 &&
    checkpoint.checkpointResult.status === "controlled-paid-pilot-execution-architecture-checkpoint-locked" &&
    registryHasCheckpoint &&
    registryHasValidator &&
    lockedVisionPresent &&
    milestoneCoverageComplete &&
    checkpointChecksPassed &&
    hardBlocksComplete &&
    mountainLocksComplete &&
    strictGuaranteesComplete
      ? "passed"
      : "needs-review";

  return {
    routeMode: "read-only-controlled-paid-pilot-execution-architecture-checkpoint-validator-preview-only",
    day: 221,
    title: "NEXUS Controlled Paid Pilot Execution Architecture Checkpoint Validator v1",
    phase: "Controlled Paid Pilot Execution Architecture Checkpoint Validation",
    purpose:
      "Validate that the Day 220 controlled paid pilot execution architecture checkpoint preserves locked NEXUS vision, owner authority, safety boundaries, Zero Damage, Zero Stop, dashboard integrity, mountain-strength locks, and blocked execution surfaces without enabling real execution.",
    validationSummary: {
      checkpointDay: checkpoint.day,
      registryHasCheckpoint,
      registryHasValidator,
      lockedVisionPresent,
      milestoneCoverageComplete,
      checkpointChecksPassed,
      hardBlocksComplete,
      mountainLocksComplete,
      strictGuaranteesComplete,
      validationStatus,
    },
    validatorChecks: [
      {
        id: "checkpoint-day",
        label: "Checkpoint day is correct",
        status: checkpoint.day === 220 ? "passed" : "needs-review",
        evidence:
          "Validator expects Day 220 controlled paid pilot execution architecture checkpoint as the validated source.",
      },
      {
        id: "registry-continuity",
        label: "Registry continuity is preserved",
        status: registryHasCheckpoint && registryHasValidator ? "passed" : "needs-review",
        evidence:
          "Dashboard registry includes both Day 220 checkpoint and Day 221 checkpoint validator entries.",
      },
      {
        id: "locked-vision",
        label: "Locked NEXUS vision is preserved",
        status: lockedVisionPresent ? "passed" : "needs-review",
        evidence:
          "Checkpoint preserves not-chatbot, not-CRM-clone, not-ERP-clone, not-Make/Zapier-clone, and not-uncontrolled-automation-runner boundaries.",
      },
      {
        id: "milestone-coverage",
        label: "Milestone coverage is complete",
        status: milestoneCoverageComplete ? "passed" : "needs-review",
        evidence:
          "Checkpoint covers Day 201 through Day 219 architecture, cleanup, integrity, summary, and validator milestones.",
      },
      {
        id: "checkpoint-checks",
        label: "Checkpoint checks passed",
        status: checkpointChecksPassed ? "passed" : "needs-review",
        evidence:
          "Checkpoint checks confirm vision, owner control, safety layer, Zero Damage, Zero Stop, dashboard integrity, and blocked execution.",
      },
      {
        id: "hard-blocks",
        label: "Hard-blocked surfaces are complete",
        status: hardBlocksComplete ? "passed" : "needs-review",
        evidence:
          "Checkpoint keeps approval, payment, invoice, subscription, entitlement, message, customer data, memory, audit persistence, recovery, third-party mutation, and AI model calls blocked.",
      },
      {
        id: "mountain-strength-locks",
        label: "Mountain-strength locks are complete",
        status: mountainLocksComplete ? "passed" : "needs-review",
        evidence:
          "Checkpoint locks blocked-by-default, preview-is-not-permission, owner-final-authority, audit-before-execution, rollback-before-mutation, safe-stop-on-uncertainty, and clean-structure-before-scale.",
      },
      {
        id: "strict-guarantees",
        label: "Strict non-execution guarantees are complete",
        status: strictGuaranteesComplete ? "passed" : "needs-review",
        evidence:
          "Checkpoint contains all strict non-execution guarantees required for controlled paid pilot planning.",
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
      "Day 222: NEXUS Controlled Paid Pilot Access and Entitlement Safety Contract v1",
  };
}
