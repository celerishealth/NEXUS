import { auditEventContract } from "./auditEventContract";

export const auditEventValidator = {
  identity: "NEXUS Backend Audit Event Validator",
  version: "Audit Event Validator v1",
  mode: "read-only-audit-validation",
  sourceContract: auditEventContract.version,
  validationRules: [
    {
      rule: "Required Field Check",
      purpose: "Every future audit event must include all contract fields.",
      lock: "No incomplete audit event.",
    },
    {
      rule: "Tenant Boundary Check",
      purpose: "Every future event must remain linked to one business account.",
      lock: "No cross-tenant confusion.",
    },
    {
      rule: "Owner Decision Check",
      purpose: "Risky events must carry owner decision proof before execution.",
      lock: "No owner bypass.",
    },
    {
      rule: "Guardrail Trace Check",
      purpose: "Guardrail result must remain visible for review.",
      lock: "No silent safety failure.",
    },
  ],
  forbiddenActions: [
    "This validator must not create audit records.",
    "This validator must not update audit records.",
    "This validator must not write customer data.",
    "This validator must not approve a request.",
    "This validator must not reject a request.",
    "This validator must not send a customer message.",
    "This validator must not change payment state.",
    "This validator must not execute risky business action.",
  ],
} as const;

export function validateAuditEventPreview(event: Record<string, unknown>) {
  const requiredFields = auditEventContract.requiredFields.map((item) => item.field);
  const missingFields = requiredFields.filter((field) => !(field in event));

  return {
    safe: true,
    action: "validation-preview-only",
    valid: missingFields.length === 0,
    requiredFieldCount: requiredFields.length,
    missingFields,
    decision:
      missingFields.length === 0
        ? "audit-event-shape-valid"
        : "audit-event-shape-incomplete",
    message:
      missingFields.length === 0
        ? "Audit event preview contains all required fields. No data was written."
        : "Audit event preview is missing required fields. No data was written.",
  };
}
