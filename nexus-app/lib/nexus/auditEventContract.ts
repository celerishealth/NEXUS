export const auditEventContract = {
  identity: "NEXUS Backend Audit Event Contract",
  version: "Audit Event Contract v1",
  mode: "read-only-audit-contract",
  requiredFields: [
    {
      field: "eventId",
      purpose: "Unique trace id for every future audit event.",
      lock: "No invisible decision.",
    },
    {
      field: "tenantId",
      purpose: "Business account boundary for future multi-tenant safety.",
      lock: "No cross-business audit mixing.",
    },
    {
      field: "customerRequest",
      purpose: "Original customer input must stay traceable.",
      lock: "No missing source message.",
    },
    {
      field: "aiDraft",
      purpose: "AI suggestion must remain visible before owner decision.",
      lock: "No hidden AI output.",
    },
    {
      field: "riskLevel",
      purpose: "Risk classification must be stored with the event.",
      lock: "No unclassified risky movement.",
    },
    {
      field: "ownerDecision",
      purpose: "Owner decision must be linked before risky execution.",
      lock: "No owner bypass.",
    },
    {
      field: "guardrailResult",
      purpose: "Safety guardrail result must remain reviewable.",
      lock: "No silent safety failure.",
    },
    {
      field: "createdAt",
      purpose: "Timestamp for future investigation and recovery.",
      lock: "No missing timeline.",
    },
  ],
  forbiddenActions: [
    "This route must not create an audit record.",
    "This route must not update customer data.",
    "This route must not approve a request.",
    "This route must not reject a request.",
    "This route must not send a customer message.",
    "This route must not change payment state.",
    "This route must not execute risky business action.",
  ],
} as const;

export function previewAuditEventContract() {
  return {
    safe: true,
    action: "contract-preview-only",
    requiredFieldCount: auditEventContract.requiredFields.length,
    message:
      "Audit Event Contract v1 is read-only. It defines future audit structure without writing data.",
  };
}
