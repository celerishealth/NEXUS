export const safetyContract = {
  identity: "NEXUS Backend Safety Contract",
  version: "Safety Contract v1",
  mode: "read-only-safety-contract",
  absoluteRules: [
    {
      rule: "Owner Approval Required",
      meaning: "Risky business movement cannot happen without owner approval.",
      block: "No hidden execution.",
    },
    {
      rule: "Zero Damage",
      meaning: "NEXUS must protect pricing, payment, stock, delivery, return, and trust.",
      block: "No unsafe automation.",
    },
    {
      rule: "Audit Proof",
      meaning: "Important AI decisions must remain traceable for future review.",
      block: "No silent decision path.",
    },
    {
      rule: "Scoped Customer Memory",
      meaning: "Only useful customer context can be used for safer replies.",
      block: "No unrelated memory exposure.",
    },
    {
      rule: "Fallback Recovery",
      meaning: "Business continuity must remain protected if AI or provider fails.",
      block: "No business stop.",
    },
    {
      rule: "Subscription Discipline",
      meaning: "SaaS access must respect plan and payment state before production execution.",
      block: "No revenue leak.",
    },
  ],
  forbiddenActions: [
    "This route must not approve a request.",
    "This route must not reject a request.",
    "This route must not send a customer message.",
    "This route must not change payment state.",
    "This route must not write customer data.",
    "This route must not execute risky business action.",
  ],
} as const;
