import { sanitizeCustomerMemoryPreview } from "./customerMemorySanitizer";
import { validateCustomerMemoryScopePreview } from "./customerMemoryScopeValidator";
import {
  previewCustomerMemoryRetention,
  type CustomerMemoryRetentionCategory,
} from "./customerMemoryRetentionPolicy";

export const customerMemoryWriteGate = {
  identity: "NEXUS Backend Customer Memory Write Gate",
  version: "Customer Memory Write Gate v1",
  mode: "read-only-write-gate-preview",
  gateChecks: [
    {
      check: "Scope Validation",
      purpose: "Memory must match tenant and customer boundary before any future write.",
      lock: "No cross-tenant or cross-customer write.",
    },
    {
      check: "Sanitization Check",
      purpose: "Sensitive signals must be removed or blocked before memory review.",
      lock: "No secret memory write.",
    },
    {
      check: "Retention Check",
      purpose: "Memory category must have an allowed retention rule.",
      lock: "No forever memory.",
    },
    {
      check: "Business Usefulness Check",
      purpose: "Memory must be useful for business continuity, support, order, or trust.",
      lock: "No random memory.",
    },
    {
      check: "Owner/Safety Boundary",
      purpose: "High-risk or sensitive memory must remain blocked until future owner-safe flow exists.",
      lock: "No unsafe profile storage.",
    },
  ],
  forbiddenActions: [
    "This gate must not write customer memory.",
    "This gate must not update customer memory.",
    "This gate must not delete customer memory.",
    "This gate must not write customer data.",
    "This gate must not approve a request.",
    "This gate must not reject a request.",
    "This gate must not send a customer message.",
    "This gate must not change payment state.",
    "This gate must not execute risky business action.",
  ],
} as const;

type MemoryWriteGatePreviewInput = {
  tenantId: string;
  customerId: string;
  memoryTenantId: string;
  memoryCustomerId: string;
  candidateMemory: string;
  retentionCategory: CustomerMemoryRetentionCategory;
};

export function previewCustomerMemoryWriteGate(input: MemoryWriteGatePreviewInput) {
  const scopePreview = validateCustomerMemoryScopePreview({
    tenantId: input.tenantId,
    customerId: input.customerId,
    memoryTenantId: input.memoryTenantId,
    memoryCustomerId: input.memoryCustomerId,
    context: input.candidateMemory,
  });

  const sanitizationPreview = sanitizeCustomerMemoryPreview(input.candidateMemory);
  const retentionPreview = previewCustomerMemoryRetention(input.retentionCategory);

  const usefulSignals = [
    "delivery",
    "order",
    "complaint",
    "replacement",
    "follow up",
    "quantity",
    "product",
    "angry",
    "waiting",
    "preference",
  ].filter((signal) => input.candidateMemory.toLowerCase().includes(signal));

  const allowedPreview =
    scopePreview.safe &&
    sanitizationPreview.detectedSignals.length === 0 &&
    retentionPreview.decision !== "do-not-retain" &&
    usefulSignals.length > 0;

  return {
    safe: true,
    action: "memory-write-gate-preview-only",
    writeAllowedNow: false,
    futureWriteEligible: allowedPreview,
    decision: allowedPreview
      ? "eligible-for-future-owner-safe-memory-write"
      : "block-future-memory-write",
    usefulSignals,
    scopePreview,
    sanitizationPreview,
    retentionPreview,
    message:
      "Customer memory write gate preview completed. No memory was written, updated, or deleted.",
  };
}
