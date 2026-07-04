export type CustomerMemoryRetrievalPurpose =
  | "reply-context"
  | "support-continuity"
  | "order-continuity"
  | "trust-recovery"
  | "owner-review";

export const customerMemoryRetrievalContract = {
  identity: "NEXUS Backend Customer Memory Retrieval Contract",
  version: "Customer Memory Retrieval Contract v1",
  mode: "read-only-retrieval-contract-preview",
  requiredRequestFields: [
    {
      field: "tenantId",
      purpose: "Memory retrieval must stay inside one business account.",
      lock: "No cross-business memory read.",
    },
    {
      field: "customerId",
      purpose: "Memory retrieval must stay inside one customer boundary.",
      lock: "No cross-customer memory read.",
    },
    {
      field: "retrievalPurpose",
      purpose: "Memory retrieval must have a clear business-safe purpose.",
      lock: "No random memory read.",
    },
    {
      field: "requestAuditEventId",
      purpose: "Retrieval request must link to audit trail.",
      lock: "No invisible memory access.",
    },
    {
      field: "requestedAt",
      purpose: "Retrieval request must carry timeline proof.",
      lock: "No missing timestamp.",
    },
  ],
  allowedPurposes: [
    "reply-context",
    "support-continuity",
    "order-continuity",
    "trust-recovery",
    "owner-review",
  ] as CustomerMemoryRetrievalPurpose[],
  outputShape: [
    {
      field: "safeMemoryContext",
      purpose: "Only sanitized, scoped, retention-valid memory can appear in future context.",
      lock: "No raw sensitive output.",
    },
    {
      field: "matchedMemoryRecordIds",
      purpose: "Every future context item must be traceable to memory records.",
      lock: "No untraceable context.",
    },
    {
      field: "scopeProof",
      purpose: "Tenant and customer scope proof must remain visible.",
      lock: "No scope bypass.",
    },
    {
      field: "retentionProof",
      purpose: "Expired memory must not appear in future context.",
      lock: "No expired memory use.",
    },
    {
      field: "auditProof",
      purpose: "Retrieval must be traceable for owner review and recovery.",
      lock: "No hidden access.",
    },
  ],
  forbiddenActions: [
    "This contract must not read real customer memory from a database.",
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

type CustomerMemoryRetrievalContractPreviewInput = {
  tenantId?: string;
  customerId?: string;
  retrievalPurpose?: CustomerMemoryRetrievalPurpose | string;
  requestAuditEventId?: string;
  requestedAt?: string;
};

export function previewCustomerMemoryRetrievalContract(
  input: CustomerMemoryRetrievalContractPreviewInput
) {
  const requiredFields = customerMemoryRetrievalContract.requiredRequestFields.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof CustomerMemoryRetrievalContractPreviewInput]
  );

  const purposeAllowed = customerMemoryRetrievalContract.allowedPurposes.includes(
    input.retrievalPurpose as CustomerMemoryRetrievalPurpose
  );

  const validRequestShape = missingFields.length === 0 && purposeAllowed;

  return {
    safe: true,
    action: "customer-memory-retrieval-contract-preview-only",
    validRequestShape,
    missingFields,
    purposeAllowed,
    realMemoryReadAllowedNow: false,
    writeAllowedNow: false,
    decision: validRequestShape
      ? "future-retrieval-request-shape-valid"
      : "future-retrieval-request-shape-blocked",
    message:
      "Customer memory retrieval contract preview completed. No real memory record, customer memory, or customer data was read or written.",
  };
}
