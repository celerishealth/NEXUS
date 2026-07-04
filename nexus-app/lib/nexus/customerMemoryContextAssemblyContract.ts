import {
  validateCustomerMemoryRetrievalRequestPreview,
} from "./customerMemoryRetrievalValidator";
import { type CustomerMemoryRetrievalPurpose } from "./customerMemoryRetrievalContract";

export type CustomerMemoryContextAssemblyStatus =
  | "context-ready-for-future-reply"
  | "blocked-retrieval-invalid"
  | "blocked-sensitive-context"
  | "blocked-missing-proof"
  | "blocked-empty-context";

export const customerMemoryContextAssemblyContract = {
  identity: "NEXUS Backend Customer Memory Context Assembly Contract",
  version: "Customer Memory Context Assembly Contract v1",
  mode: "read-only-context-assembly-preview",
  requiredInputs: [
    {
      field: "tenantId",
      purpose: "Context assembly must stay inside one business account.",
      lock: "No cross-business context.",
    },
    {
      field: "customerId",
      purpose: "Context assembly must stay inside one customer boundary.",
      lock: "No cross-customer context.",
    },
    {
      field: "retrievalPurpose",
      purpose: "Context must be assembled only for a safe business purpose.",
      lock: "No random context use.",
    },
    {
      field: "requestAuditEventId",
      purpose: "Context assembly must link to audit trail.",
      lock: "No invisible memory use.",
    },
    {
      field: "safeMemoryContext",
      purpose: "Only sanitized, scoped, useful memory can enter future reply context.",
      lock: "No raw sensitive context.",
    },
    {
      field: "matchedMemoryRecordIds",
      purpose: "Every context item must be traceable to future memory records.",
      lock: "No untraceable memory context.",
    },
    {
      field: "scopeProof",
      purpose: "Tenant and customer scope proof must remain visible.",
      lock: "No scope bypass.",
    },
    {
      field: "retentionProof",
      purpose: "Expired memory must not enter future reply context.",
      lock: "No expired memory context.",
    },
    {
      field: "auditProof",
      purpose: "Context assembly must remain traceable for owner review.",
      lock: "No hidden memory access.",
    },
    {
      field: "assembledAt",
      purpose: "Context assembly must carry timeline proof.",
      lock: "No missing timeline.",
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

type CustomerMemoryContextAssemblyPreviewInput = {
  tenantId?: string;
  customerId?: string;
  retrievalPurpose?: CustomerMemoryRetrievalPurpose | string;
  requestAuditEventId?: string;
  requestedAt?: string;
  safeMemoryContext?: string;
  matchedMemoryRecordIds?: string[];
  scopeProof?: string;
  retentionProof?: string;
  auditProof?: string;
  assembledAt?: string;
};

export function previewCustomerMemoryContextAssembly(
  input: CustomerMemoryContextAssemblyPreviewInput
) {
  const retrievalValidation = validateCustomerMemoryRetrievalRequestPreview({
    tenantId: input.tenantId,
    customerId: input.customerId,
    retrievalPurpose: input.retrievalPurpose,
    requestAuditEventId: input.requestAuditEventId,
    requestedAt: input.requestedAt,
  });

  const requiredFields = customerMemoryContextAssemblyContract.requiredInputs.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof CustomerMemoryContextAssemblyPreviewInput]
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
    (input.safeMemoryContext || "").toLowerCase().includes(signal)
  );

  const matchedRecordsVisible =
    Array.isArray(input.matchedMemoryRecordIds) &&
    input.matchedMemoryRecordIds.length > 0;

  const proofsVisible =
    typeof input.scopeProof === "string" &&
    input.scopeProof.trim().length > 0 &&
    typeof input.retentionProof === "string" &&
    input.retentionProof.trim().length > 0 &&
    typeof input.auditProof === "string" &&
    input.auditProof.trim().length > 0;

  const contextVisible =
    typeof input.safeMemoryContext === "string" &&
    input.safeMemoryContext.trim().length > 0;

  const validContextAssembly =
    retrievalValidation.validRetrievalRequest === true &&
    missingFields.length === 0 &&
    rawSensitiveSignals.length === 0 &&
    matchedRecordsVisible &&
    proofsVisible &&
    contextVisible;

  const status: CustomerMemoryContextAssemblyStatus = validContextAssembly
    ? "context-ready-for-future-reply"
    : retrievalValidation.validRetrievalRequest !== true
      ? "blocked-retrieval-invalid"
      : rawSensitiveSignals.length > 0
        ? "blocked-sensitive-context"
        : !proofsVisible
          ? "blocked-missing-proof"
          : "blocked-empty-context";

  return {
    safe: true,
    action: "customer-memory-context-assembly-preview-only",
    validContextAssembly,
    status,
    retrievalValidation,
    missingFields,
    rawSensitiveSignals,
    matchedRecordsVisible,
    proofsVisible,
    contextVisible,
    realMemoryReadAllowedNow: false,
    writeAllowedNow: false,
    message:
      "Customer memory context assembly preview completed. No real memory record, customer memory, customer data, or message was read or written.",
  };
}
