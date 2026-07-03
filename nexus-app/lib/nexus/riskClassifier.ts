export const riskClassifier = {
  identity: "NEXUS Backend Risk Classifier",
  version: "Risk Classifier v1",
  mode: "read-only-risk-classification",
  signals: [
    {
      name: "Pricing Risk",
      riskLevel: "high",
      keywords: ["price", "rate", "discount", "margin", "quote", "wrong price"],
      protects: "Revenue and trust",
    },
    {
      name: "Payment Risk",
      riskLevel: "high",
      keywords: ["payment", "paid", "refund", "charge", "invoice", "billing"],
      protects: "Money movement",
    },
    {
      name: "Stock Risk",
      riskLevel: "medium",
      keywords: ["stock", "available", "shortage", "out of stock", "inventory"],
      protects: "Supply accuracy",
    },
    {
      name: "Delivery Risk",
      riskLevel: "medium",
      keywords: ["delivery", "dispatch", "delay", "shipping", "urgent"],
      protects: "Customer promise",
    },
    {
      name: "Return Damage Risk",
      riskLevel: "high",
      keywords: ["return", "damage", "replacement", "broken", "complaint"],
      protects: "Loss prevention",
    },
    {
      name: "Customer Trust Risk",
      riskLevel: "high",
      keywords: ["angry", "fraud", "cheat", "legal", "police", "bad service"],
      protects: "Brand trust",
    },
  ],
  safeOutputRule: "Classifier only reports risk. It never approves, rejects, pays, sends, writes, or executes.",
} as const;

export function classifyBusinessRisk(input: string) {
  const normalizedInput = input.toLowerCase();

  const matchedSignals = riskClassifier.signals.filter((signal) =>
    signal.keywords.some((keyword) => normalizedInput.includes(keyword))
  );

  const level = matchedSignals.some((signal) => signal.riskLevel === "high")
    ? "high"
    : matchedSignals.some((signal) => signal.riskLevel === "medium")
      ? "medium"
      : "low";

  return {
    safe: true,
    action: "classification-only",
    riskLevel: level,
    matchedSignals,
    ownerApprovalRequired: level === "high",
    message:
      level === "high"
        ? "High-risk business context detected. Owner approval required before action."
        : level === "medium"
          ? "Medium-risk context detected. Review before action."
          : "No major risk signal detected. Continue read-only review.",
  };
}
