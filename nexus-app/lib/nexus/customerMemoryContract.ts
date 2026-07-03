export const customerMemoryContract = {
  identity: "NEXUS Backend Customer Memory Contract",
  version: "Customer Memory Contract v1",
  mode: "read-only-memory-contract",
  allowedMemory: [
    {
      type: "Business Preference",
      example: "Preferred product category, delivery preference, buying pattern.",
      purpose: "Improve future business replies without exposing private data.",
    },
    {
      type: "Support Context",
      example: "Open issue, complaint status, replacement context, follow-up need.",
      purpose: "Avoid repeating questions and improve service continuity.",
    },
    {
      type: "Order Context",
      example: "Requested product type, quantity interest, delivery expectation.",
      purpose: "Help owner respond with accurate business context.",
    },
    {
      type: "Trust Context",
      example: "Customer is angry, confused, waiting, or needs careful handling.",
      purpose: "Protect brand trust and reduce damage.",
    },
  ],
  blockedMemory: [
    {
      type: "Unrelated Personal Data",
      reason: "Memory must not store unrelated private life details.",
      lock: "No creepy memory.",
    },
    {
      type: "Payment Secrets",
      reason: "Payment credentials, card data, UPI secrets, OTPs, and passwords are blocked.",
      lock: "No payment leak.",
    },
    {
      type: "Cross-Tenant Context",
      reason: "One business customer context must never leak to another business.",
      lock: "No tenant data mix.",
    },
    {
      type: "Sensitive Identity Data",
      reason: "Sensitive personal attributes must not be stored unless explicitly required and allowed by policy.",
      lock: "No unsafe profile storage.",
    },
  ],
  forbiddenActions: [
    "This contract must not write customer memory.",
    "This contract must not update customer memory.",
    "This contract must not write customer data.",
    "This contract must not approve a request.",
    "This contract must not reject a request.",
    "This contract must not send a customer message.",
    "This contract must not change payment state.",
    "This contract must not execute risky business action.",
  ],
} as const;

export function previewCustomerMemorySafety(input: string) {
  const normalizedInput = input.toLowerCase();

  const blockedSignals = [
    "password",
    "otp",
    "card number",
    "cvv",
    "upi pin",
    "bank password",
    "secret",
    "another business",
    "other customer",
  ].filter((signal) => normalizedInput.includes(signal));

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
  ].filter((signal) => normalizedInput.includes(signal));

  return {
    safe: blockedSignals.length === 0,
    action: "memory-safety-preview-only",
    decision: blockedSignals.length > 0 ? "block-memory-write" : "memory-context-review-only",
    usefulSignals,
    blockedSignals,
    message:
      blockedSignals.length > 0
        ? "Blocked memory signal found. Do not store this context."
        : "Context appears useful for business memory review. No memory was written.",
  };
}
