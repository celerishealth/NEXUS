export const customerMemorySanitizer = {
  identity: "NEXUS Backend Customer Memory Sanitizer",
  version: "Customer Memory Sanitizer v1",
  mode: "read-only-memory-sanitization-preview",
  sanitizerRules: [
    {
      rule: "Email Redaction",
      purpose: "Future memory previews should not expose full email addresses unnecessarily.",
      replacement: "[REDACTED_EMAIL]",
    },
    {
      rule: "Phone Redaction",
      purpose: "Future memory previews should not expose full phone numbers unnecessarily.",
      replacement: "[REDACTED_PHONE]",
    },
    {
      rule: "OTP Block",
      purpose: "OTP values must never be stored as useful customer memory.",
      replacement: "[BLOCKED_OTP]",
    },
    {
      rule: "Password Block",
      purpose: "Passwords and secrets must never be stored as memory.",
      replacement: "[BLOCKED_SECRET]",
    },
    {
      rule: "Payment Secret Block",
      purpose: "UPI PIN, card data, CVV, account secrets, and payment credentials are blocked.",
      replacement: "[BLOCKED_PAYMENT_SECRET]",
    },
    {
      rule: "Business Context Preserve",
      purpose: "Useful business context should remain visible after sensitive data is removed.",
      replacement: "KEEP_SAFE_BUSINESS_CONTEXT",
    },
  ],
  forbiddenActions: [
    "This sanitizer must not write customer memory.",
    "This sanitizer must not update customer memory.",
    "This sanitizer must not write customer data.",
    "This sanitizer must not approve a request.",
    "This sanitizer must not reject a request.",
    "This sanitizer must not send a customer message.",
    "This sanitizer must not change payment state.",
    "This sanitizer must not execute risky business action.",
  ],
} as const;

export function sanitizeCustomerMemoryPreview(input: string) {
  const detectedSignals: string[] = [];

  let sanitized = input;

  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(sanitized)) {
    detectedSignals.push("email");
    sanitized = sanitized.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]");
  }

  if (/\b(?:\+?91[-\s]?)?[6-9]\d{9}\b/.test(sanitized)) {
    detectedSignals.push("phone");
    sanitized = sanitized.replace(/\b(?:\+?91[-\s]?)?[6-9]\d{9}\b/g, "[REDACTED_PHONE]");
  }

  if (/\b(?:otp|one time password)\s*[:#-]?\s*\d{4,8}\b/i.test(sanitized)) {
    detectedSignals.push("otp");
    sanitized = sanitized.replace(/\b(?:otp|one time password)\s*[:#-]?\s*\d{4,8}\b/gi, "[BLOCKED_OTP]");
  }

  if (/\b(?:password|passcode|secret)\s*[:#-]?\s*[A-Z0-9@#$%^&*._-]{4,}\b/i.test(sanitized)) {
    detectedSignals.push("secret");
    sanitized = sanitized.replace(/\b(?:password|passcode|secret)\s*[:#-]?\s*[A-Z0-9@#$%^&*._-]{4,}\b/gi, "[BLOCKED_SECRET]");
  }

  if (/\b(?:upi pin|cvv|card number|bank password)\s*[:#-]?\s*[A-Z0-9-]{3,}\b/i.test(sanitized)) {
    detectedSignals.push("payment-secret");
    sanitized = sanitized.replace(/\b(?:upi pin|cvv|card number|bank password)\s*[:#-]?\s*[A-Z0-9-]{3,}\b/gi, "[BLOCKED_PAYMENT_SECRET]");
  }

  return {
    safe: true,
    action: "memory-sanitization-preview-only",
    changed: sanitized !== input,
    detectedSignals,
    sanitized,
    decision: detectedSignals.length > 0 ? "sanitize-before-memory-review" : "memory-preview-clean",
    message: "Customer memory sanitization preview completed. No memory was written.",
  };
}
