import {
  customerMemoryReviewQueueContract,
  type CustomerMemoryReviewStatus,
} from "./customerMemoryReviewQueueContract";

export const customerMemoryReviewQueueValidator = {
  identity: "NEXUS Backend Customer Memory Review Queue Validator",
  version: "Customer Memory Review Queue Validator v1",
  mode: "read-only-review-queue-validation",
  sourceContract: customerMemoryReviewQueueContract.version,
  validationRules: [
    {
      rule: "Required Field Validation",
      purpose: "Future review queue item must include all contract fields.",
      lock: "No incomplete queue item.",
    },
    {
      rule: "Sanitized Candidate Validation",
      purpose: "Queue item must not carry raw sensitive candidate memory.",
      lock: "No raw secret queue.",
    },
    {
      rule: "Scope Proof Validation",
      purpose: "Tenant and customer scope proof must remain visible.",
      lock: "No scope bypass.",
    },
    {
      rule: "Sanitization Proof Validation",
      purpose: "Sensitive signal handling proof must remain visible.",
      lock: "No hidden sensitive data.",
    },
    {
      rule: "Owner Review Status Validation",
      purpose: "Queue item must carry a valid review status.",
      lock: "No silent memory write.",
    },
  ],
  allowedStatuses: [
    "pending-review",
    "approved-for-future-write",
    "rejected-sensitive",
    "rejected-not-useful",
    "expired-before-review",
  ] satisfies CustomerMemoryReviewStatus[],
  forbiddenActions: [
    "This validator must not create queue items.",
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

type MemoryReviewQueueValidationInput = {
  queueItemId?: string;
  tenantId?: string;
  customerId?: string;
  sanitizedCandidateMemory?: string;
  memoryCategory?: string;
  retentionWindow?: string;
  sourceEventId?: string;
  scopeResult?: string;
  sanitizationResult?: string;
  ownerReviewStatus?: CustomerMemoryReviewStatus | string;
  createdAt?: string;
};

export function validateCustomerMemoryReviewQueuePreview(
  input: MemoryReviewQueueValidationInput
) {
  const requiredFields = customerMemoryReviewQueueContract.requiredFields.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof MemoryReviewQueueValidationInput]
  );

  const statusValid = customerMemoryReviewQueueValidator.allowedStatuses.includes(
    input.ownerReviewStatus as CustomerMemoryReviewStatus
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
    (input.sanitizedCandidateMemory || "").toLowerCase().includes(signal)
  );

  const validShape =
    missingFields.length === 0 &&
    statusValid &&
    rawSensitiveSignals.length === 0;

  return {
    safe: true,
    action: "review-queue-validation-preview-only",
    validShape,
    missingFields,
    statusValid,
    rawSensitiveSignals,
    writeAllowedNow: false,
    decision: validShape
      ? "future-review-queue-item-valid"
      : "future-review-queue-item-blocked",
    message:
      "Customer memory review queue validation preview completed. No queue item, memory, or customer data was written.",
  };
}
