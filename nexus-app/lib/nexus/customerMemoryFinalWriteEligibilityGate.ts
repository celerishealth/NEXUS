import { previewCustomerMemoryWriteGate } from "./customerMemoryWriteGate";
import { validateCustomerMemoryReviewQueuePreview } from "./customerMemoryReviewQueueValidator";
import { validateCustomerMemoryReviewDecisionPreview } from "./customerMemoryReviewDecisionValidator";
import { validateCustomerMemoryReviewAuditLinkPreview } from "./customerMemoryReviewAuditLinkValidator";

export const customerMemoryFinalWriteEligibilityGate = {
  identity: "NEXUS Backend Customer Memory Final Write Eligibility Gate",
  version: "Customer Memory Final Write Eligibility Gate v1",
  mode: "read-only-final-write-eligibility-preview",
  requiredProofs: [
    {
      proof: "Memory Write Gate Proof",
      purpose: "Candidate memory must pass scope, sanitization, retention, and usefulness preview.",
      lock: "No unsafe candidate.",
    },
    {
      proof: "Review Queue Validation Proof",
      purpose: "Future review queue item shape must be valid.",
      lock: "No broken review queue.",
    },
    {
      proof: "Review Decision Validation Proof",
      purpose: "Future decision must be valid and policy-aligned.",
      lock: "No invalid decision.",
    },
    {
      proof: "Audit Link Validation Proof",
      purpose: "Future decision must link back to source audit event and queue candidate.",
      lock: "No missing audit proof.",
    },
    {
      proof: "Write Execution Lock",
      purpose: "Even if eligible, this route never writes memory.",
      lock: "No write now.",
    },
  ],
  forbiddenActions: [
    "This gate must not create audit links.",
    "This gate must not create queue items.",
    "This gate must not write customer memory.",
    "This gate must not update customer memory.",
    "This gate must not delete customer memory.",
    "This gate must not write customer data.",
    "This gate must not approve a request.",
    "This gate must not reject a request.",
    "This gate must not send a customer message.",
    "This gate must not change payment state.",
    "This gate must not execute risky business action.",
  ],
} as const;

type FinalWriteEligibilityPreviewInput = {
  tenantId: string;
  customerId: string;
  candidateMemory: string;
  queueItemId: string;
  sourceAuditEventId: string;
  reviewer: string;
  createdAt: string;
};

export function previewCustomerMemoryFinalWriteEligibility(
  input: FinalWriteEligibilityPreviewInput
) {
  const memoryWriteGatePreview = previewCustomerMemoryWriteGate({
    tenantId: input.tenantId,
    customerId: input.customerId,
    memoryTenantId: input.tenantId,
    memoryCustomerId: input.customerId,
    candidateMemory: input.candidateMemory,
    retentionCategory: "support-context",
  });

  const reviewQueueValidation = validateCustomerMemoryReviewQueuePreview({
    queueItemId: input.queueItemId,
    tenantId: input.tenantId,
    customerId: input.customerId,
    sanitizedCandidateMemory: input.candidateMemory,
    memoryCategory: "support-context",
    retentionWindow: "90 days",
    sourceEventId: input.sourceAuditEventId,
    scopeResult: "memory-scope-safe-preview",
    sanitizationResult: "memory-preview-clean",
    ownerReviewStatus: "pending-review",
    createdAt: input.createdAt,
  });

  const reviewDecisionValidation = validateCustomerMemoryReviewDecisionPreview({
    queueItemId: input.queueItemId,
    tenantId: input.tenantId,
    customerId: input.customerId,
    decision: "pending-review",
    reason: "Final write eligibility requires owner-safe review before any future memory write.",
    reviewer: input.reviewer,
    createdAt: input.createdAt,
    scopeSafe: true,
    sanitized: true,
    retentionAllowed: true,
    useful: true,
  });

  const auditLinkValidation = validateCustomerMemoryReviewAuditLinkPreview({
    sourceAuditEventId: input.sourceAuditEventId,
    queueItemId: input.queueItemId,
    tenantId: input.tenantId,
    customerId: input.customerId,
    reviewDecision: "pending-review",
    decisionValidatorResult: "future-review-decision-valid",
    reviewer: input.reviewer,
    linkedAt: input.createdAt,
  });

  const allProofsValid =
    memoryWriteGatePreview.futureWriteEligible === true &&
    reviewQueueValidation.validShape === true &&
    reviewDecisionValidation.validDecisionShape === true &&
    auditLinkValidation.validLink === true;

  return {
    safe: true,
    action: "final-write-eligibility-preview-only",
    finalWriteEligible: allProofsValid,
    writeAllowedNow: false,
    memoryWriteGatePreview,
    reviewQueueValidation,
    reviewDecisionValidation,
    auditLinkValidation,
    decision: allProofsValid
      ? "future-memory-write-eligible-after-owner-safe-flow"
      : "future-memory-write-blocked",
    message:
      "Customer memory final write eligibility preview completed. No audit link, queue item, memory, or customer data was written.",
  };
}
