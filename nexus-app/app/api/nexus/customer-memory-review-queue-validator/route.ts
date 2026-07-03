import { NextResponse } from "next/server";
import {
  customerMemoryReviewQueueValidator,
  validateCustomerMemoryReviewQueuePreview,
} from "../../../../lib/nexus/customerMemoryReviewQueueValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = {
    queueItemId: "memory-review-preview-001",
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    sanitizedCandidateMemory:
      "Customer prefers delivery follow up and is waiting for replacement order update.",
    memoryCategory: "support-context",
    retentionWindow: "90 days",
    sourceEventId: "audit-preview-001",
    scopeResult: "memory-scope-safe-preview",
    sanitizationResult: "memory-preview-clean",
    ownerReviewStatus: "pending-review",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Review Queue Validator",
    version: "v1",
    generatedAt: new Date().toISOString(),
    validator: customerMemoryReviewQueueValidator,
    sampleValidation: validateCustomerMemoryReviewQueuePreview(sample),
  });
}
