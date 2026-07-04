import {
  customerMemoryRetrievalContract,
  type CustomerMemoryRetrievalPurpose,
} from "./customerMemoryRetrievalContract";

export const customerMemoryRetrievalValidator = {
  identity: "NEXUS Backend Customer Memory Retrieval Validator",
  version: "Customer Memory Retrieval Validator v1",
  mode: "read-only-retrieval-validation-preview",
  sourceContract: customerMemoryRetrievalContract.version,
  validationRules: [
    {
      rule: "Required Request Field Validation",
      purpose: "Future retrieval request must include every locked request field.",
      lock: "No incomplete retrieval request.",
    },
    {
      rule: "Allowed Purpose Validation",
      purpose: "Retrieval must be for reply, support, order, trust recovery, or owner review only.",
      lock: "No random memory read.",
    },
    {
      rule: "Tenant Boundary Validation",
      purpose: "Retrieval must stay inside one business account.",
      lock: "No cross-business memory read.",
    },
    {
      rule: "Customer Boundary Validation",
      purpose: "Retrieval must stay inside one customer scope.",
      lock: "No cross-customer memory read.",
    },
    {
      rule: "Audit Event Link Validation",
      purpose: "Retrieval request must link to audit trail.",
      lock: "No invisible memory access.",
    },
    {
      rule: "Timeline Validation",
      purpose: "Retrieval request must carry timestamp proof.",
      lock: "No missing timeline.",
    },
  ],
  forbiddenActions: [
    "This validator must not read real customer memory from a database.",
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

type CustomerMemoryRetrievalValidationInput = {
  tenantId?: string;
  customerId?: string;
  retrievalPurpose?: CustomerMemoryRetrievalPurpose | string;
  requestAuditEventId?: string;
  requestedAt?: string;
};

export function validateCustomerMemoryRetrievalRequestPreview(
  input: CustomerMemoryRetrievalValidationInput
) {
  const requiredFields = customerMemoryRetrievalContract.requiredRequestFields.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof CustomerMemoryRetrievalValidationInput]
  );

  const purposeAllowed = customerMemoryRetrievalContract.allowedPurposes.includes(
    input.retrievalPurpose as CustomerMemoryRetrievalPurpose
  );

  const tenantVisible =
    typeof input.tenantId === "string" && input.tenantId.trim().length > 0;

  const customerVisible =
    typeof input.customerId === "string" && input.customerId.trim().length > 0;

  const auditEventVisible =
    typeof input.requestAuditEventId === "string" &&
    input.requestAuditEventId.trim().length > 0;

  const timelineVisible =
    typeof input.requestedAt === "string" &&
    input.requestedAt.trim().length > 0;

  const validRetrievalRequest =
    missingFields.length === 0 &&
    purposeAllowed &&
    tenantVisible &&
    customerVisible &&
    auditEventVisible &&
    timelineVisible;

  return {
    safe: true,
    action: "customer-memory-retrieval-validation-preview-only",
    validRetrievalRequest,
    missingFields,
    purposeAllowed,
    tenantVisible,
    customerVisible,
    auditEventVisible,
    timelineVisible,
    realMemoryReadAllowedNow: false,
    writeAllowedNow: false,
    decision: validRetrievalRequest
      ? "future-retrieval-request-valid"
      : "future-retrieval-request-blocked",
    message:
      "Customer memory retrieval validation preview completed. No real memory record, customer memory, or customer data was read or written.",
  };
}
