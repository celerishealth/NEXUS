export const guardrailRegistry = {
  identity: "NEXUS Backend Guardrail Registry",
  version: "Guardrail Registry v1",
  mode: "read-only-guardrail-registry",
  guardrails: [
    {
      name: "Risky Action Blocklist",
      purpose: "Block unsafe business movement before execution.",
      protects: "Zero Damage",
    },
    {
      name: "Owner Approval Requirement",
      purpose: "Require owner approval before risky movement.",
      protects: "Owner Control",
    },
    {
      name: "Payment State Lock",
      purpose: "Prevent payment, refund, or billing changes from unsafe routes.",
      protects: "Revenue Discipline",
    },
    {
      name: "Message Send Lock",
      purpose: "Prevent customer messages from being sent by unsafe route calls.",
      protects: "Customer Trust",
    },
    {
      name: "Data Write Lock",
      purpose: "Prevent customer/business data writes from read-only routes.",
      protects: "Data Integrity",
    },
    {
      name: "Memory Scope Lock",
      purpose: "Prevent unrelated memory from leaking into replies.",
      protects: "Customer Memory Safety",
    },
    {
      name: "Provider Failure Lock",
      purpose: "Keep fallback recovery ready when AI or external provider fails.",
      protects: "Zero Stop",
    },
    {
      name: "Audit Trace Requirement",
      purpose: "Require traceable evidence for important AI decisions.",
      protects: "Audit Proof",
    },
  ],
  forbiddenKeywords: [
    "approve",
    "reject",
    "send",
    "payment",
    "charge",
    "refund",
    "delete",
    "write customer",
    "execute",
    "webhook",
    "dispatch",
  ],
} as const;

export function evaluateGuardrailIntent(intent: string) {
  const normalizedIntent = intent.toLowerCase();

  const matchedKeywords = guardrailRegistry.forbiddenKeywords.filter((keyword) =>
    normalizedIntent.includes(keyword)
  );

  if (matchedKeywords.length > 0) {
    return {
      safe: false,
      decision: "block-risky-execution",
      matchedKeywords,
      reason: "Intent contains risky execution language and must remain behind owner approval and safety review.",
    };
  }

  return {
    safe: true,
    decision: "allow-read-only-review",
    matchedKeywords,
    reason: "Intent is read-only and does not request risky business execution.",
  };
}
