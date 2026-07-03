export type CustomerMemoryRetentionCategory =
  | "business-preference"
  | "support-context"
  | "order-context"
  | "trust-context"
  | "blocked-sensitive-context";

export const customerMemoryRetentionPolicy = {
  identity: "NEXUS Backend Customer Memory Retention Policy",
  version: "Customer Memory Retention Policy v1",
  mode: "read-only-retention-preview",
  retentionRules: [
    {
      category: "business-preference",
      retentionWindow: "180 days",
      reviewRule: "Review when customer behavior changes or owner updates business rules.",
      lock: "No stale preference forever.",
    },
    {
      category: "support-context",
      retentionWindow: "90 days",
      reviewRule: "Review after complaint, replacement, or follow-up is closed.",
      lock: "No old complaint confusion.",
    },
    {
      category: "order-context",
      retentionWindow: "120 days",
      reviewRule: "Review when order, delivery, or quantity context is no longer useful.",
      lock: "No outdated order context.",
    },
    {
      category: "trust-context",
      retentionWindow: "60 days",
      reviewRule: "Review after angry, confused, waiting, or careful-handling state is resolved.",
      lock: "No permanent negative label.",
    },
    {
      category: "blocked-sensitive-context",
      retentionWindow: "0 days",
      reviewRule: "Do not retain passwords, OTPs, UPI PIN, CVV, card data, or payment secrets.",
      lock: "No sensitive memory storage.",
    },
  ],
  forbiddenActions: [
    "This policy must not write customer memory.",
    "This policy must not update customer memory.",
    "This policy must not delete customer memory.",
    "This policy must not write customer data.",
    "This policy must not approve a request.",
    "This policy must not reject a request.",
    "This policy must not send a customer message.",
    "This policy must not change payment state.",
    "This policy must not execute risky business action.",
  ],
} as const;

export function previewCustomerMemoryRetention(category: CustomerMemoryRetentionCategory) {
  const rule = customerMemoryRetentionPolicy.retentionRules.find(
    (item) => item.category === category
  );

  if (!rule) {
    return {
      safe: false,
      action: "retention-preview-only",
      decision: "unknown-category-blocked",
      retentionWindow: "0 days",
      message: "Unknown memory category must not be retained. No memory was written.",
    };
  }

  return {
    safe: true,
    action: "retention-preview-only",
    decision:
      rule.category === "blocked-sensitive-context"
        ? "do-not-retain"
        : "retention-rule-preview",
    category: rule.category,
    retentionWindow: rule.retentionWindow,
    reviewRule: rule.reviewRule,
    lock: rule.lock,
    message: "Customer memory retention preview completed. No memory was written or deleted.",
  };
}
