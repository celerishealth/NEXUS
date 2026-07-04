import { NextResponse } from "next/server";
import {
  customerMemoryRetrievalContract,
  previewCustomerMemoryRetrievalContract,
} from "../../../../lib/nexus/customerMemoryRetrievalContract";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = {
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    retrievalPurpose: "support-continuity",
    requestAuditEventId: "audit-preview-001",
    requestedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Retrieval Contract",
    version: "v1",
    generatedAt: new Date().toISOString(),
    contract: customerMemoryRetrievalContract,
    samplePreview: previewCustomerMemoryRetrievalContract(sample),
  });
}
