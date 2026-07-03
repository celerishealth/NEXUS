import { NextResponse } from "next/server";
import {
  customerMemoryWriteGate,
  previewCustomerMemoryWriteGate,
} from "../../../../lib/nexus/customerMemoryWriteGate";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = {
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    memoryTenantId: "tenant-preview-001",
    memoryCustomerId: "customer-preview-001",
    candidateMemory:
      "Customer prefers delivery follow up and is waiting for replacement order update.",
    retentionCategory: "support-context" as const,
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Write Gate",
    version: "v1",
    generatedAt: new Date().toISOString(),
    gate: customerMemoryWriteGate,
    samplePreview: previewCustomerMemoryWriteGate(sample),
  });
}
