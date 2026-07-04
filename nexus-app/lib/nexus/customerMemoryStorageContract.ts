export type CustomerMemoryStorageStatus =
  | "draft-review-only"
  | "eligible-after-owner-safe-flow"
  | "blocked-sensitive"
  | "blocked-scope-mismatch"
  | "blocked-expired"
  | "blocked-not-useful";

export const customerMemoryStorageContract = {
  identity: "NEXUS Backend Customer Memory Storage Contract",
  version: "Customer Memory Storage Contract v1",
  mode: "read-only-storage-contract-preview",
  requiredFields: [
    {
      field: "memoryRecordId",
      purpose: "Unique id for future customer memory record.",
      lock: "No invisible memory record.",
    },
    {
      field: "tenantId",
      purpose: "Business account boundary for future memory storage.",
      lock: "No cross-business storage.",
    },
    {
      field: "customerId",
      purpose: "Customer boundary for future memory storage.",
      lock: "No cross-customer storage.",
    },
    {
      field: "sanitizedMemory",
      purpose: "Only sanitized business memory can be stored in future.",
      lock: "No raw sensitive memory.",
    },
    {
      field: "memoryCategory",
      purpose: "Memory must map to business, support, order, or trust context.",
      lock: "No random memory.",
    },
    {
      field: "retentionUntil",
      purpose: "Every memory record must have expiry discipline.",
      lock: "No forever memory.",
    },
    {
      field: "sourceAuditEventId",
      purpose: "Memory must link back to original audit event.",
      lock: "No missing origin proof.",
    },
    {
      field: "reviewQueueItemId",
      purpose: "Memory must link back to review queue candidate.",
      lock: "No silent memory creation.",
    },
    {
      field: "reviewDecision",
      purpose: "Memory must carry owner-safe review decision state.",
      lock: "No unreviewed memory.",
    },
    {
      field: "auditLinkStatus",
      purpose: "Audit link validation must remain visible.",
      lock: "No audit bypass.",
    },
    {
      field: "writeEligibilityStatus",
      purpose: "Final write eligibility status must be visible.",
      lock: "No unsafe write.",
    },
    {
      field: "createdAt",
      purpose: "Creation timestamp supports audit and recovery.",
      lock: "No missing timeline.",
    },
    {
      field: "updatedAt",
      purpose: "Update timestamp supports review and retention.",
      lock: "No stale hidden update.",
    },
  ],
  allowedStatuses: [
    "draft-review-only",
    "eligible-after-owner-safe-flow",
    "blocked-sensitive",
    "blocked-scope-mismatch",
    "blocked-expired",
    "blocked-not-useful",
  ] as CustomerMemoryStorageStatus[],
  forbiddenActions: [
    "This contract must not create memory records.",
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

type CustomerMemoryStoragePreviewInput = {
  memoryRecordId?: string;
  tenantId?: string;
  customerId?: string;
  sanitizedMemory?: string;
  memoryCategory?: string;
  retentionUntil?: string;
  sourceAuditEventId?: string;
  reviewQueueItemId?: string;
  reviewDecision?: string;
  auditLinkStatus?: string;
  writeEligibilityStatus?: CustomerMemoryStorageStatus | string;
  createdAt?: string;
  updatedAt?: string;
};

export function previewCustomerMemoryStorageRecord(
  input: CustomerMemoryStoragePreviewInput
) {
  const requiredFields = customerMemoryStorageContract.requiredFields.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof CustomerMemoryStoragePreviewInput]
  );

  const statusAllowed = customerMemoryStorageContract.allowedStatuses.includes(
    input.writeEligibilityStatus as CustomerMemoryStorageStatus
  );

  const rawSensitiveSignals = [
    "password",
    "otp",
    "cvv",
    "upi pin",
    "card number",
    "bank password",
    "secret",
  ].filter((signal) =>
    (input.sanitizedMemory || "").toLowerCase().includes(signal)
  );

  const validStorageShape =
    missingFields.length === 0 &&
    statusAllowed &&
    rawSensitiveSignals.length === 0;

  return {
    safe: true,
    action: "customer-memory-storage-contract-preview-only",
    validStorageShape,
    missingFields,
    statusAllowed,
    rawSensitiveSignals,
    writeAllowedNow: false,
    decision: validStorageShape
      ? "future-storage-shape-valid"
      : "future-storage-shape-blocked",
    message:
      "Customer memory storage contract preview completed. No memory record, customer memory, or customer data was written.",
  };
}
