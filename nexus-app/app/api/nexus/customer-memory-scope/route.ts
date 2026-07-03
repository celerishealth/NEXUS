import { NextResponse } from "next/server";
import {
  customerMemoryScopeValidator,
  validateCustomerMemoryScopePreview,
} from "../../../../lib/nexus/customerMemoryScopeValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = {
    tenantId: "tenant-preview-001",
    customerId: "customer-preview-001",
    memoryTenantId: "tenant-preview-001",
    memoryCustomerId: "customer-preview-001",
    context: "Customer prefers delivery follow-up and is waiting for replacement.",
  };

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Scope Validator",
    version: "v1",
    generatedAt: new Date().toISOString(),
    validator: customerMemoryScopeValidator,
    sampleValidation: validateCustomerMemoryScopePreview(sample),
  });
}
