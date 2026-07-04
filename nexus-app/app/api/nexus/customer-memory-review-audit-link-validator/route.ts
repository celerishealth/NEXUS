import { NextResponse } from "next/server";
import {
  customerMemoryReviewAuditLinkValidator,
  validateCustomerMemoryReviewAuditLinkPreview,
} from "../../../../lib/nexus/customerMemoryReviewAuditLinkValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = {
    sourceAuditEventId: "audit-preview-001",
    queueItemId: "memory-review-preview-001",
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    reviewDecision: "pending-review",
    decisionValidatorResult: "future-review-decision-valid",
    reviewer: "system-preview",
    linkedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Review Audit Link Validator",
    version: "v1",
    generatedAt: new Date().toISOString(),
    validator: customerMemoryReviewAuditLinkValidator,
    sampleValidation: validateCustomerMemoryReviewAuditLinkPreview(sample),
  });
}
