import { customerMemoryReviewAuditLinkContract } from "./customerMemoryReviewAuditLinkContract";
import { type CustomerMemoryReviewDecision } from "./customerMemoryReviewDecisionPolicy";

const allowedReviewDecisions: CustomerMemoryReviewDecision[] = [
  "pending-review",
  "eligible-for-future-write",
  "blocked-sensitive",
  "blocked-not-useful",
  "blocked-scope-mismatch",
  "expired-before-review",
];

export const customerMemoryReviewAuditLinkValidator = {
  identity: "NEXUS Backend Customer Memory Review Audit Link Validator",
  version: "Customer Memory Review Audit Link Validator v1",
  mode: "read-only-audit-link-validation",
  sourceContract: customerMemoryReviewAuditLinkContract.version,
  validationRules: [
    {
      rule: "Audit Link Required Fields",
      purpose: "Future audit link must include every locked contract field.",
      lock: "No incomplete audit link.",
    },
    {
      rule: "Source Audit Proof Check",
      purpose: "Memory review decision must link back to original audit event.",
      lock: "No missing origin proof.",
    },
    {
      rule: "Queue Candidate Check",
      purpose: "Decision must link to a memory review queue candidate.",
      lock: "No orphan decision.",
    },
    {
      rule: "Tenant Customer Boundary Check",
      purpose: "Audit link must stay inside one tenant and one customer boundary.",
      lock: "No cross-scope audit link.",
    },
    {
      rule: "Decision Validator Result Check",
      purpose: "Decision validator result must be visible before future write eligibility.",
      lock: "No validation bypass.",
    },
  ],
  allowedReviewDecisions,
  forbiddenActions: [
    "This validator must not create audit links.",
    "This validator must not create queue items.",
    "This validator must not write customer memory.",
    "This validator must not update customer memory.",
    "This validator must not delete customer memory.",
    "This validator must not write customer data.",
    "This validator must not approve a request.",
    "This validator must not reject a request.",
    "This validator must not send a customer message.",
    "This validator must not change payment state.",
    "This validator must not execute risky business action.",
  ],
} as const;

type CustomerMemoryReviewAuditLinkValidationInput = {
  sourceAuditEventId?: string;
  queueItemId?: string;
  tenantId?: string;
  customerId?: string;
  reviewDecision?: CustomerMemoryReviewDecision | string;
  decisionValidatorResult?: string;
  reviewer?: string;
  linkedAt?: string;
};

export function validateCustomerMemoryReviewAuditLinkPreview(
  input: CustomerMemoryReviewAuditLinkValidationInput
) {
  const requiredFields = customerMemoryReviewAuditLinkContract.requiredLinks.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof CustomerMemoryReviewAuditLinkValidationInput]
  );

  const decisionAllowed = allowedReviewDecisions.includes(
    input.reviewDecision as CustomerMemoryReviewDecision
  );

  const decisionValidatorVisible =
    typeof input.decisionValidatorResult === "string" &&
    input.decisionValidatorResult.trim().length > 0;

  const reviewerVisible =
    typeof input.reviewer === "string" && input.reviewer.trim().length > 0;

  const timelineVisible =
    typeof input.linkedAt === "string" && input.linkedAt.trim().length > 0;

  const validLink =
    missingFields.length === 0 &&
    decisionAllowed &&
    decisionValidatorVisible &&
    reviewerVisible &&
    timelineVisible;

  return {
    safe: true,
    action: "memory-review-audit-link-validation-preview-only",
    validLink,
    missingFields,
    decisionAllowed,
    decisionValidatorVisible,
    reviewerVisible,
    timelineVisible,
    writeAllowedNow: false,
    decision: validLink
      ? "future-audit-link-valid"
      : "future-audit-link-blocked",
    message:
      "Customer memory review audit link validation preview completed. No audit link, queue item, memory, or customer data was written.",
  };
}
