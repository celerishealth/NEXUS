import { NextResponse } from "next/server";
import {
  customerMemoryStorageValidator,
  validateCustomerMemoryStorageRecordPreview,
} from "../../../../lib/nexus/customerMemoryStorageValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date().toISOString();

  const sample = {
    memoryRecordId: "memory-record-preview-001",
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    sanitizedMemory:
      "Customer prefers delivery follow up and is waiting for replacement order update.",
    memoryCategory: "support-context",
    retentionUntil: "90 days from future write",
    sourceAuditEventId: "audit-preview-001",
    reviewQueueItemId: "memory-review-preview-001",
    reviewDecision: "pending-review",
    auditLinkStatus: "future-audit-link-valid",
    writeEligibilityStatus: "draft-review-only",
    createdAt: now,
    updatedAt: now,
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Storage Validator",
    version: "v1",
    generatedAt: now,
    validator: customerMemoryStorageValidator,
    sampleValidation: validateCustomerMemoryStorageRecordPreview(sample),
  });
}
