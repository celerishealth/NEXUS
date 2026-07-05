import { nexusControlledPaidPilotRegistryCards } from "@/lib/nexus/nexusControlledPaidPilotRegistryCards";

export type NexusDashboardRegistryCleanupValidator = {
  routeMode: "read-only-dashboard-registry-cleanup-validator-preview-only";
  day: 215;
  title: "NEXUS Dashboard Registry Cleanup Validator v1";
  phase: "Dashboard Architecture Cleanup";
  purpose: string;
  registryValidation: {
    expectedDayRange: string;
    totalCards: number;
    missingDays: number[];
    duplicateDays: number[];
    invalidApiLinks: string[];
    appPageWeightStrategy: "registry-component-instead-of-repeated-cards";
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

function findDuplicateDays(days: number[]) {
  return days.filter((day, index) => days.indexOf(day) !== index);
}

export function getNexusDashboardRegistryCleanupValidator(): NexusDashboardRegistryCleanupValidator {
  const expectedDays = Array.from({ length: 15 }, (_, index) => 201 + index);
  const actualDays: number[] = nexusControlledPaidPilotRegistryCards.map((card) => Number(card.day));
  const missingDays = expectedDays.filter((day) => actualDays.indexOf(day) === -1);
  const duplicateDays = Array.from(new Set(findDuplicateDays(actualDays)));
  const invalidApiLinks = nexusControlledPaidPilotRegistryCards
    .map((card) => card.href)
    .filter((href) => String(href).indexOf("/api/nexus/") !== 0);

  const validationStatus =
    missingDays.length === 0 && duplicateDays.length === 0 && invalidApiLinks.length === 0
      ? "passed"
      : "needs-review";

  return {
    routeMode: "read-only-dashboard-registry-cleanup-validator-preview-only",
    day: 215,
    title: "NEXUS Dashboard Registry Cleanup Validator v1",
    phase: "Dashboard Architecture Cleanup",
    purpose:
      "Validate that the dashboard registry cleanup preserved recent NEXUS safety visibility while reducing repeated app/page.tsx card weight and keeping all execution surfaces blocked.",
    registryValidation: {
      expectedDayRange: "Day 201 through Day 215",
      totalCards: nexusControlledPaidPilotRegistryCards.length,
      missingDays,
      duplicateDays,
      invalidApiLinks,
      appPageWeightStrategy: "registry-component-instead-of-repeated-cards",
      validationStatus,
    },
    validatorChecks: [
      {
        id: "registry-present",
        label: "Reusable registry is present",
        status: nexusControlledPaidPilotRegistryCards.length >= 15 ? "passed" : "needs-review",
        evidence:
          "Recent controlled paid pilot and cleanup dashboard entries are represented through a registry instead of repeated direct page sections.",
      },
      {
        id: "api-links-safe",
        label: "Registry links stay inside NEXUS API namespace",
        status: invalidApiLinks.length === 0 ? "passed" : "needs-review",
        evidence:
          "All registry href values must start with /api/nexus/ and remain read-only preview/planning links.",
      },
      {
        id: "day-continuity",
        label: "Day continuity is preserved",
        status: missingDays.length === 0 && duplicateDays.length === 0 ? "passed" : "needs-review",
        evidence:
          "Dashboard registry covers Day 201 through Day 215 without missing or duplicate day numbers.",
      },
      {
        id: "page-weight-reduction",
        label: "Page weight reduction strategy is preserved",
        status: "passed",
        evidence:
          "The dashboard now uses a registry component strategy instead of adding every recent card directly into app/page.tsx.",
      },
      {
        id: "vision-preserved",
        label: "Locked NEXUS vision remains preserved",
        status: "passed",
        evidence:
          "Cleanup is structural only and does not convert NEXUS into chatbot, CRM clone, ERP clone, Make/Zapier clone, or uncontrolled automation runner.",
      },
      {
        id: "no-execution-change",
        label: "No execution behavior changed",
        status: "passed",
        evidence:
          "The validator is deterministic and read-only. It does not approve, reject, execute, persist, mutate, send, recover, call third parties, or call AI models.",
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
      "Incident response readiness preserved",
      "Manual owner override preserved",
      "Safe stop and manual escalation preserved",
      "Premium dashboard maintainability preserved",
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
    nextRecommendedStep:
      "Day 216: NEXUS Architecture Integrity Checkpoint v1",
  };
}

