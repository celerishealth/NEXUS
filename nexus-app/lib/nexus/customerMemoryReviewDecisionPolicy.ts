export type CustomerMemoryReviewDecision =
  | "pending-review"
  | "eligible-for-future-write"
  | "blocked-sensitive"
  | "blocked-not-useful"
  | "blocked-scope-mismatch"
  | "expired-before-review";

export const customerMemoryReviewDecisionPolicy = {
  identity: "NEXUS Backend Customer Memory Review Decision Policy",
  version: "Customer Memory Review Decision Policy v1",
  mode: "read-only-review-decision-policy",
  decisions: [
    {
      decision: "pending-review",
      meaning: "Memory candidate is waiting for owner-safe review.",
      futureAction: "hold-in-review",
      lock: "No silent memory write.",
    },
    {
      decision: "eligible-for-future-write",
      meaning: "Memory candidate passed safety checks and may later enter owner-safe write flow.",
      futureAction: "future-write-eligible-only",
      lock: "No write now.",
    },
    {
      decision: "blocked-sensitive",
      meaning: "Memory candidate contains sensitive or unsafe information.",
      futureAction: "block-memory-candidate",
      lock: "No sensitive memory.",
    },
    {
      decision: "blocked-not-useful",
      meaning: "Memory candidate is not useful for business continuity.",
      futureAction: "block-memory-candidate",
      lock: "No random memory.",
    },
    {
      decision: "blocked-scope-mismatch",
      meaning: "Memory candidate does not match tenant or customer scope.",
      futureAction: "block-memory-candidate",
      lock: "No cross-scope memory.",
    },
    {
      decision: "expired-before-review",
      meaning: "Memory candidate expired before owner-safe review.",
      futureAction: "block-memory-candidate",
      lock: "No stale memory.",
    },
  ],
  forbiddenActions: [
    "This policy must not create queue items.",
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

export function previewCustomerMemoryReviewDecisionPolicy(
  decision: CustomerMemoryReviewDecision
) {
  const rule = customerMemoryReviewDecisionPolicy.decisions.find(
    (item) => item.decision === decision
  );

  if (!rule) {
    return {
      safe: false,
      action: "review-decision-policy-preview-only",
      decision: "unknown-decision-blocked",
      futureAction: "block-memory-candidate",
      writeAllowedNow: false,
      message:
        "Unknown customer memory review decision is blocked. No queue item, memory, or customer data was written.",
    };
  }

  return {
    safe: true,
    action: "review-decision-policy-preview-only",
    decision: rule.decision,
    meaning: rule.meaning,
    futureAction: rule.futureAction,
    lock: rule.lock,
    writeAllowedNow: false,
    message:
      "Customer memory review decision policy preview completed. No queue item, memory, or customer data was written.",
  };
}
