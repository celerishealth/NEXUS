import { NextResponse } from "next/server";
import {
  customerMemoryFinalWriteEligibilityGate,
  previewCustomerMemoryFinalWriteEligibility,
} from "../../../../lib/nexus/customerMemoryFinalWriteEligibilityGate";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = {
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    candidateMemory:
      "Customer prefers delivery follow up and is waiting for replacement order update.",
    queueItemId: "memory-review-preview-001",
    sourceAuditEventId: "audit-preview-001",
    reviewer: "system-preview",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Final Write Eligibility Gate",
    version: "v1",
    generatedAt: new Date().toISOString(),
    gate: customerMemoryFinalWriteEligibilityGate,
    samplePreview: previewCustomerMemoryFinalWriteEligibility(sample),
  });
}
