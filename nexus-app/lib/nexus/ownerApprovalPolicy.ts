export type OwnerApprovalRiskLevel = "low" | "medium" | "high";

export const ownerApprovalPolicy = {
  identity: "NEXUS Backend Owner Approval Policy",
  version: "Owner Approval Policy v1",
  mode: "read-only-policy-evaluation",
  rules: [
    {
      riskLevel: "high",
      ownerApprovalRequired: true,
      reason: "High-risk business context can damage money, trust, delivery, stock, or legal safety.",
      allowedAction: "queue-for-owner-review",
    },
    {
      riskLevel: "medium",
      ownerApprovalRequired: true,
      reason: "Medium-risk business context should be reviewed before action.",
      allowedAction: "review-before-execution",
    },
    {
      riskLevel: "low",
      ownerApprovalRequired: false,
      reason: "Low-risk context may continue as read-only review until execution layer is built.",
      allowedAction: "read-only-review",
    },
  ],
  forbiddenActions: [
    "This policy must not approve a request.",
    "This policy must not reject a request.",
    "This policy must not send a customer message.",
    "This policy must not change payment state.",
    "This policy must not write customer data.",
    "This policy must not execute risky business action.",
  ],
} as const;

export function evaluateOwnerApprovalPolicy(riskLevel: OwnerApprovalRiskLevel) {
  const rule = ownerApprovalPolicy.rules.find((item) => item.riskLevel === riskLevel);

  if (!rule) {
    return {
      safe: false,
      decision: "unknown-risk-level-blocked",
      ownerApprovalRequired: true,
      reason: "Unknown risk level must be blocked and reviewed by owner.",
      allowedAction: "queue-for-owner-review",
    };
  }

  return {
    safe: true,
    decision: rule.ownerApprovalRequired ? "owner-approval-required" : "read-only-review-allowed",
    ownerApprovalRequired: rule.ownerApprovalRequired,
    reason: rule.reason,
    allowedAction: rule.allowedAction,
  };
}
