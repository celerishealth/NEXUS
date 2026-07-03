export type CustomerMemoryReviewStatus =
  | "pending-review"
  | "approved-for-future-write"
  | "rejected-sensitive"
  | "rejected-not-useful"
  | "expired-before-review";

export const customerMemoryReviewQueueContract = {
  identity: "NEXUS Backend Customer Memory Review Queue Contract",
  version: "Customer Memory Review Queue Contract v1",
  mode: "read-only-review-queue-contract",
  requiredFields: [
    {
      field: "queueItemId",
      purpose: "Unique id for the future memory review queue item.",
      lock: "No invisible memory candidate.",
    },
    {
      field: "tenantId",
      purpose: "Business boundary for future memory review.",
      lock: "No cross-business memory review.",
    },
    {
      field: "customerId",
      purpose: "Customer boundary for future memory review.",
      lock: "No cross-customer memory review.",
    },
    {
      field: "sanitizedCandidateMemory",
      purpose: "Only sanitized memory candidate can enter review.",
      lock: "No raw secret review.",
    },
    {
      field: "memoryCategory",
      purpose: "Memory must map to allowed business, support, order, or trust context.",
      lock: "No random memory.",
    },
    {
      field: "retentionWindow",
      purpose: "Memory candidate must carry retention discipline.",
      lock: "No forever memory.",
    },
    {
      field: "sourceEventId",
      purpose: "Memory candidate must link back to original audit event.",
      lock: "No missing origin proof.",
    },
    {
      field: "scopeResult",
      purpose: "Tenant and customer scope validation must be visible.",
      lock: "No scope bypass.",
    },
    {
      field: "sanitizationResult",
      purpose: "Sensitive signal handling must be visible.",
      lock: "No hidden sensitive data.",
    },
    {
      field: "ownerReviewStatus",
      purpose: "Future owner-safe memory write requires review status.",
      lock: "No silent memory write.",
    },
    {
      field: "createdAt",
      purpose: "Timestamp supports trace, expiry, and investigation.",
      lock: "No missing timeline.",
    },
  ],
  forbiddenActions: [
    "This contract must not create queue items.",
    "This contract must not write customer memory.",
    "This contract must not update customer memory.",
    "This contract must not delete customer memory.",
    "This contract must not write customer data.",
    "This contract must not approve a request.",
    "This contract must not reject a request.",
    "This contract must not send a customer message.",
    "This contract must not change payment state.",
    "This contract must not execute risky business action.",
  ],
} as const;

type MemoryReviewQueuePreviewInput = {
  queueItemId?: string;
  tenantId?: string;
  customerId?: string;
  sanitizedCandidateMemory?: string;
  memoryCategory?: string;
  retentionWindow?: string;
  sourceEventId?: string;
  scopeResult?: string;
  sanitizationResult?: string;
  ownerReviewStatus?: CustomerMemoryReviewStatus;
  createdAt?: string;
};

export function previewCustomerMemoryReviewQueueItem(input: MemoryReviewQueuePreviewInput) {
  const requiredFields = customerMemoryReviewQueueContract.requiredFields.map((item) => item.field);
  const missingFields = requiredFields.filter((field) => !input[field as keyof MemoryReviewQueuePreviewInput]);

  return {
    safe: true,
    action: "review-queue-contract-preview-only",
    validShape: missingFields.length === 0,
    missingFields,
    writeAllowedNow: false,
    decision:
      missingFields.length === 0
        ? "future-review-queue-shape-valid"
        : "future-review-queue-shape-incomplete",
    message:
      "Customer memory review queue contract preview completed. No queue item, memory, or customer data was written.",
  };
}
