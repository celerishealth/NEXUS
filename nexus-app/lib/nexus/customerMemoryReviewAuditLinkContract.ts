import { type CustomerMemoryReviewDecision } from "./customerMemoryReviewDecisionPolicy";

export const customerMemoryReviewAuditLinkContract = {
  identity: "NEXUS Backend Customer Memory Review Audit Link Contract",
  version: "Customer Memory Review Audit Link Contract v1",
  mode: "read-only-audit-link-contract",
  requiredLinks: [
    {
      field: "sourceAuditEventId",
      purpose: "Connect memory review decision back to original audit event.",
      lock: "No missing origin proof.",
    },
    {
      field: "queueItemId",
      purpose: "Connect decision to the future memory review queue candidate.",
      lock: "No orphan memory decision.",
    },
    {
      field: "tenantId",
      purpose: "Keep audit link inside the correct business account.",
      lock: "No cross-business link.",
    },
    {
      field: "customerId",
      purpose: "Keep audit link inside the correct customer boundary.",
      lock: "No cross-customer link.",
    },
    {
      field: "reviewDecision",
      purpose: "Decision must be a locked customer memory review decision.",
      lock: "No unknown decision.",
    },
    {
      field: "decisionValidatorResult",
      purpose: "Decision validator result must be visible before future write eligibility.",
      lock: "No validation bypass.",
    },
    {
      field: "reviewer",
      purpose: "Future review decision must carry reviewer trace.",
      lock: "No invisible reviewer.",
    },
    {
      field: "linkedAt",
      purpose: "Timestamp supports timeline, investigation, and recovery.",
      lock: "No missing timeline.",
    },
  ],
  forbiddenActions: [
    "This contract must not create audit links.",
    "This contract must not create queue items.",
    "This contract must not write customer memory.",
    "This contract must not update customer memory.",
    "This contract must not delete customer memory.",
    "This contract must not write customer data.",
    "This contract must not approve a request.",
    "This contract must not reject a request.",
    "This contract must not send a customer message.",
    "This contract must not change payment state.",
    "This contract must not execute risky business action.",
  ],
} as const;

type CustomerMemoryReviewAuditLinkPreviewInput = {
  sourceAuditEventId?: string;
  queueItemId?: string;
  tenantId?: string;
  customerId?: string;
  reviewDecision?: CustomerMemoryReviewDecision | string;
  decisionValidatorResult?: string;
  reviewer?: string;
  linkedAt?: string;
};

const allowedReviewDecisions: CustomerMemoryReviewDecision[] = [
  "pending-review",
  "eligible-for-future-write",
  "blocked-sensitive",
  "blocked-not-useful",
  "blocked-scope-mismatch",
  "expired-before-review",
];

export function previewCustomerMemoryReviewAuditLink(
  input: CustomerMemoryReviewAuditLinkPreviewInput
) {
  const requiredFields = customerMemoryReviewAuditLinkContract.requiredLinks.map(
    (item) => item.field
  );

  const missingFields = requiredFields.filter(
    (field) => !input[field as keyof CustomerMemoryReviewAuditLinkPreviewInput]
  );

  const decisionAllowed = allowedReviewDecisions.includes(
    input.reviewDecision as CustomerMemoryReviewDecision
  );

  const validLinkShape = missingFields.length === 0 && decisionAllowed;

  return {
    safe: true,
    action: "memory-review-audit-link-preview-only",
    validLinkShape,
    missingFields,
    decisionAllowed,
    writeAllowedNow: false,
    decision: validLinkShape
      ? "future-audit-link-shape-valid"
      : "future-audit-link-shape-blocked",
    message:
      "Customer memory review audit link preview completed. No audit link, queue item, memory, or customer data was written.",
  };
}
