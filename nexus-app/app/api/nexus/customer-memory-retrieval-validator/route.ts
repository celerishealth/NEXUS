import { NextResponse } from "next/server";
import {
  customerMemoryRetrievalValidator,
  validateCustomerMemoryRetrievalRequestPreview,
} from "../../../../lib/nexus/customerMemoryRetrievalValidator";

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
    service: "NEXUS Customer Memory Retrieval Validator",
    version: "v1",
    generatedAt: new Date().toISOString(),
    validator: customerMemoryRetrievalValidator,
    sampleValidation: validateCustomerMemoryRetrievalRequestPreview(sample),
  });
}
