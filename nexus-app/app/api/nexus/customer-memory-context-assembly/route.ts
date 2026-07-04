import { NextResponse } from "next/server";
import {
  customerMemoryContextAssemblyContract,
  previewCustomerMemoryContextAssembly,
} from "../../../../lib/nexus/customerMemoryContextAssemblyContract";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date().toISOString();

  const sample = {
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    retrievalPurpose: "support-continuity",
    requestAuditEventId: "audit-preview-001",
    requestedAt: now,
    safeMemoryContext:
      "Customer prefers delivery follow up and is waiting for replacement order update.",
    matchedMemoryRecordIds: ["memory-record-preview-001"],
    scopeProof: "tenant-and-customer-scope-safe-preview",
    retentionProof: "retention-valid-preview",
    auditProof: "audit-linked-preview",
    assembledAt: now,
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Context Assembly Contract",
    version: "v1",
    generatedAt: now,
    contract: customerMemoryContextAssemblyContract,
    samplePreview: previewCustomerMemoryContextAssembly(sample),
  });
}
