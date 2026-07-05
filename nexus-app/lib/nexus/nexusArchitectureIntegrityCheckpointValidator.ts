import { nexusControlledPaidPilotRegistryCards } from "@/lib/nexus/nexusControlledPaidPilotRegistryCards";
import { getNexusArchitectureIntegrityCheckpoint } from "@/lib/nexus/nexusArchitectureIntegrityCheckpoint";

export type NexusArchitectureIntegrityCheckpointValidator = {
  routeMode: "read-only-architecture-integrity-checkpoint-validator-preview-only";
  day: 217;
  title: "NEXUS Architecture Integrity Checkpoint Validator v1";
  phase: "Architecture Integrity / Mountain-Strength Validation";
  purpose: string;
  validationSummary: {
    checkpointDay: number;
    registryHasCheckpoint: boolean;
    registryHasValidator: boolean;
    requiredVisionBlocksPresent: boolean;
    strictNonExecutionGuaranteesPresent: boolean;
    architectureBoundariesSafe: boolean;
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

function hasText(values: string[], target: string) {
  return values.map((value) => String(value).toLowerCase()).indexOf(target.toLowerCase()) !== -1;
}

export function getNexusArchitectureIntegrityCheckpointValidator(): NexusArchitectureIntegrityCheckpointValidator {
  const checkpoint = getNexusArchitectureIntegrityCheckpoint();
  const registryDays: number[] = nexusControlledPaidPilotRegistryCards.map((card) => Number(card.day));
  const registryHasCheckpoint = registryDays.indexOf(216) !== -1;
  const registryHasValidator = registryDays.indexOf(217) !== -1;

  const requiredVisionBlocks = [
    "not a chatbot",
    "not a CRM clone",
    "not an ERP clone",
    "not a Make/Zapier clone",
    "not an uncontrolled automation runner",
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

  const requiredVisionBlocksPresent = requiredVisionBlocks.every((block) =>
    hasText(checkpoint.lockedVision.not, block)
  );

  const strictNonExecutionGuaranteesPresent = requiredGuarantees.every((guarantee) =>
    hasText(checkpoint.strictNonExecutionGuarantees, guarantee)
  );

  const architectureBoundariesSafe = checkpoint.architectureBoundaries.every((boundary) =>
    boundary.currentStatus === "blocked" || boundary.currentStatus === "preview-only"
  );

  const validationStatus =
    checkpoint.day === 216 &&
    registryHasCheckpoint &&
    registryHasValidator &&
    requiredVisionBlocksPresent &&
    strictNonExecutionGuaranteesPresent &&
    architectureBoundariesSafe &&
    checkpoint.checkpointResult.status === "architecture-integrity-preserved"
      ? "passed"
      : "needs-review";

  return {
    routeMode: "read-only-architecture-integrity-checkpoint-validator-preview-only",
    day: 217,
    title: "NEXUS Architecture Integrity Checkpoint Validator v1",
    phase: "Architecture Integrity / Mountain-Strength Validation",
    purpose:
      "Validate that the Day 216 architecture integrity checkpoint preserves locked NEXUS vision, owner control, safety boundaries, dashboard registry discipline, and blocked execution surfaces without enabling real execution.",
    validationSummary: {
      checkpointDay: checkpoint.day,
      registryHasCheckpoint,
      registryHasValidator,
      requiredVisionBlocksPresent,
      strictNonExecutionGuaranteesPresent,
      architectureBoundariesSafe,
      validationStatus,
    },
    validatorChecks: [
      {
        id: "checkpoint-day",
        label: "Checkpoint day is correct",
        status: checkpoint.day === 216 ? "passed" : "needs-review",
        evidence:
          "Validator expects Day 216 architecture checkpoint as the validated source of truth.",
      },
      {
        id: "registry-continuity",
        label: "Registry continuity is preserved",
        status: registryHasCheckpoint && registryHasValidator ? "passed" : "needs-review",
        evidence:
          "Dashboard registry includes both the Day 216 checkpoint and the Day 217 validator entries.",
      },
      {
        id: "locked-vision",
        label: "Locked NEXUS vision is preserved",
        status: requiredVisionBlocksPresent ? "passed" : "needs-review",
        evidence:
          "Checkpoint must explicitly preserve not-chatbot, not-CRM-clone, not-ERP-clone, not-Make/Zapier-clone, and not-uncontrolled-automation-runner boundaries.",
      },
      {
        id: "non-execution-guarantees",
        label: "Strict non-execution guarantees are complete",
        status: strictNonExecutionGuaranteesPresent ? "passed" : "needs-review",
        evidence:
          "Checkpoint must block approval, payment, invoice, subscription, entitlement, message, customer data, memory, audit persistence, recovery, third-party mutation, and AI calls.",
      },
      {
        id: "architecture-boundaries",
        label: "Architecture boundaries remain safe",
        status: architectureBoundariesSafe ? "passed" : "needs-review",
        evidence:
          "All checkpoint architecture boundaries must remain either blocked or preview-only.",
      },
      {
        id: "mountain-strength",
        label: "Mountain-strength rules remain locked",
        status: checkpoint.mountainStrengthRules.length >= 7 ? "passed" : "needs-review",
        evidence:
          "Checkpoint locks blocked-by-default, preview-is-not-permission, owner-final-authority, audit-before-execution, rollback-before-mutation, safe-stop-on-uncertainty, and structural-cleanup-before-scale.",
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
    ],
    strictNonExecutionGuarantees: requiredGuarantees,
    nextRecommendedStep:
      "Day 218: NEXUS Controlled Paid Pilot Execution Architecture Summary v1",
  };
}
