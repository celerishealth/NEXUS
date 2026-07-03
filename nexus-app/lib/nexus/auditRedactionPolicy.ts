export const auditRedactionPolicy = {
  identity: "NEXUS Backend Audit Redaction Policy",
  version: "Audit Redaction Policy v1",
  mode: "read-only-redaction-preview",
  redactionRules: [
    {
      name: "Phone Number Redaction",
      purpose: "Future audit views should not expose full phone numbers unnecessarily.",
      pattern: "phone-like-value",
      replacement: "[REDACTED_PHONE]",
    },
    {
      name: "Email Redaction",
      purpose: "Future audit views should not expose full email addresses unnecessarily.",
      pattern: "email-like-value",
      replacement: "[REDACTED_EMAIL]",
    },
    {
      name: "Payment Detail Redaction",
      purpose: "Future audit views must protect payment references and money-sensitive values.",
      pattern: "payment-sensitive-value",
      replacement: "[REDACTED_PAYMENT]",
    },
    {
      name: "Address Redaction",
      purpose: "Future audit views should avoid exposing full delivery address details.",
      pattern: "address-sensitive-value",
      replacement: "[REDACTED_ADDRESS]",
    },
    {
      name: "Tenant Boundary Preservation",
      purpose: "Redaction must never mix audit context across businesses.",
      pattern: "tenant-boundary",
      replacement: "KEEP_TENANT_SCOPE",
    },
    {
      name: "Owner Review Visibility",
      purpose: "Redaction must protect sensitive data without hiding risk, decision, or proof.",
      pattern: "owner-review-safe",
      replacement: "KEEP_DECISION_PROOF",
    },
  ],
  forbiddenActions: [
    "This policy must not create audit records.",
    "This policy must not update audit records.",
    "This policy must not write customer data.",
    "This policy must not approve a request.",
    "This policy must not reject a request.",
    "This policy must not send a customer message.",
    "This policy must not change payment state.",
    "This policy must not execute risky business action.",
  ],
} as const;

export function previewAuditRedaction(input: string) {
  const redacted = input
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .replace(/\b(?:\+?91[-\s]?)?[6-9]\d{9}\b/g, "[REDACTED_PHONE]")
    .replace(/\b(?:card|upi|account|txn|transaction|payment|refund)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi, "[REDACTED_PAYMENT]");

  return {
    safe: true,
    action: "redaction-preview-only",
    changed: redacted !== input,
    originalLength: input.length,
    redactedLength: redacted.length,
    redacted,
    message: "Audit redaction preview completed. No data was written.",
  };
}
