import { NextResponse } from "next/server";
import {
  customerMemoryReviewDecisionValidator,
  validateCustomerMemoryReviewDecisionPreview,
} from "../../../../lib/nexus/customerMemoryReviewDecisionValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = {
    queueItemId: "memory-review-preview-001",
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    decision: "pending-review",
    reason: "Owner-safe memory review is required before future write eligibility.",
    reviewer: "system-preview",
    createdAt: new Date().toISOString(),
    scopeSafe: true,
    sanitized: true,
    retentionAllowed: true,
    useful: true,
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Review Decision Validator",
    version: "v1",
    generatedAt: new Date().toISOString(),
    validator: customerMemoryReviewDecisionValidator,
    sampleValidation: validateCustomerMemoryReviewDecisionPreview(sample),
  });
}
