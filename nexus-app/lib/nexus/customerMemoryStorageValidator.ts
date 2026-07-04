import {
  customerMemoryStorageContract,
  type CustomerMemoryStorageStatus,
} from "./customerMemoryStorageContract";

export const customerMemoryStorageValidator = {
  identity: "NEXUS Backend Customer Memory Storage Validator",
  version: "Customer Memory Storage Validator v1",
  mode: "read-only-storage-validation-preview",
  sourceContract: customerMemoryStorageContract.version,
  validationRules: [
    {
      rule: "Required Field Validation",
      purpose: "Future memory record must include every storage contract field.",
      lock: "No incomplete memory record.",
    },
    {
      rule: "Tenant Boundary Validation",
      purpose: "Future memory record must stay inside one business account.",
      lock: "No cross-business storage.",
    },
    {
      rule: "Customer Boundary Validation",
      purpose: "Future memory record must stay inside one customer scope.",
      lock: "No cross-customer storage.",
    },
    {
      rule: "Sanitized Memory Validation",
      purpose: "Future memory record must not contain raw sensitive signals.",
      lock: "No raw sensitive memory.",
    },
    {
      rule: "Retention Validation",
      purpose: "Future memory record must carry visible expiry discipline.",
      lock: "No forever memory.",
    },
    {
      rule: "Audit Proof Validation",
      purpose: "Future memory record must link to source audit event and review queue item.",
      lock: "No silent memory creation.",
    },
    {
      rule: "Write Eligibility Validation",
      purpose: "Future memory record must carry an allowed write eligibility status.",
      lock: "No unsafe write.",
    },
  ],
  forbiddenActions: [
    "This validator must not create memory records.",
    "This validator must not write customer memory.",
    "This validator must not update customer memory.",
    "This validator must not delete customer memory.",
    "This validator must not write customer data.",
    "This validator must not approve a request.",
    "This validator must not reject a request.",
    "This validator must not send a customer message.",
    "This validator must not change payment state.",
    "This validator must not execute risky business action.",
  ],
} as const;

type CustomerMemoryStorageValidationInput = {
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

export function validateCustomerMemoryStorageRecordPreview(
  input: CustomerMemoryStorageValidationInput
) {
  const requiredFields = customerMemoryStorageContract.requiredFields.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof CustomerMemoryStorageValidationInput]
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

  const retentionVisible =
    typeof input.retentionUntil === "string" &&
    input.retentionUntil.trim().length > 0;

  const sourceAuditVisible =
    typeof input.sourceAuditEventId === "string" &&
    input.sourceAuditEventId.trim().length > 0;

  const reviewQueueVisible =
    typeof input.reviewQueueItemId === "string" &&
    input.reviewQueueItemId.trim().length > 0;

  const timelineVisible =
    typeof input.createdAt === "string" &&
    input.createdAt.trim().length > 0 &&
    typeof input.updatedAt === "string" &&
    input.updatedAt.trim().length > 0;

  const validStorageRecord =
    missingFields.length === 0 &&
    statusAllowed &&
    rawSensitiveSignals.length === 0 &&
    retentionVisible &&
    sourceAuditVisible &&
    reviewQueueVisible &&
    timelineVisible;

  return {
    safe: true,
    action: "customer-memory-storage-validation-preview-only",
    validStorageRecord,
    missingFields,
    statusAllowed,
    rawSensitiveSignals,
    retentionVisible,
    sourceAuditVisible,
    reviewQueueVisible,
    timelineVisible,
    writeAllowedNow: false,
    decision: validStorageRecord
      ? "future-storage-record-valid"
      : "future-storage-record-blocked",
    message:
      "Customer memory storage validation preview completed. No memory record, customer memory, or customer data was written.",
  };
}
