import { customerMemoryContract } from "./customerMemoryContract";

export const customerMemoryScopeValidator = {
  identity: "NEXUS Backend Customer Memory Scope Validator",
  version: "Customer Memory Scope Validator v1",
  mode: "read-only-memory-scope-validation",
  sourceContract: customerMemoryContract.version,
  scopeRules: [
    {
      rule: "Tenant Scope Check",
      purpose: "Customer memory must belong to one business account only.",
      lock: "No cross-business memory leak.",
    },
    {
      rule: "Customer Scope Check",
      purpose: "One customer's context must not leak into another customer's reply.",
      lock: "No cross-customer memory leak.",
    },
    {
      rule: "Allowed Context Check",
      purpose: "Memory must stay limited to business preference, support, order, or trust context.",
      lock: "No unrelated personal memory.",
    },
    {
      rule: "Blocked Signal Check",
      purpose: "Secrets, payment credentials, OTPs, passwords, and unsafe profile data must be blocked.",
      lock: "No unsafe memory storage.",
    },
  ],
  forbiddenActions: [
    "This validator must not write customer memory.",
    "This validator must not update customer memory.",
    "This validator must not write customer data.",
    "This validator must not approve a request.",
    "This validator must not reject a request.",
    "This validator must not send a customer message.",
    "This validator must not change payment state.",
    "This validator must not execute risky business action.",
  ],
} as const;

type MemoryScopePreviewInput = {
  tenantId: string;
  customerId: string;
  memoryTenantId: string;
  memoryCustomerId: string;
  context: string;
};

export function validateCustomerMemoryScopePreview(input: MemoryScopePreviewInput) {
  const normalizedContext = input.context.toLowerCase();

  const blockedSignals = [
    "password",
    "otp",
    "cvv",
    "upi pin",
    "card number",
    "bank password",
    "secret",
    "other customer",
    "another business",
  ].filter((signal) => normalizedContext.includes(signal));

  const tenantMatch = input.tenantId === input.memoryTenantId;
  const customerMatch = input.customerId === input.memoryCustomerId;
  const scopeSafe = tenantMatch && customerMatch && blockedSignals.length === 0;

  return {
    safe: scopeSafe,
    action: "memory-scope-validation-preview-only",
    tenantMatch,
    customerMatch,
    blockedSignals,
    decision: scopeSafe ? "memory-scope-safe-preview" : "block-memory-scope",
    message: scopeSafe
      ? "Memory scope preview is safe. No memory was written."
      : "Memory scope preview is unsafe or mismatched. No memory was written.",
  };
}
