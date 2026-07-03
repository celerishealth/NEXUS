import { NextResponse } from "next/server";
import {
  customerMemoryContract,
  previewCustomerMemorySafety,
} from "../../../../lib/nexus/customerMemoryContract";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = "Customer is waiting for replacement follow up and asked about delivery.";

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Contract",
    version: "v1",
    generatedAt: new Date().toISOString(),
    contract: customerMemoryContract,
    samplePreview: previewCustomerMemorySafety(sample),
  });
}
