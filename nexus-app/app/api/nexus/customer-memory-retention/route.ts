import { NextResponse } from "next/server";
import {
  customerMemoryRetentionPolicy,
  previewCustomerMemoryRetention,
} from "../../../../lib/nexus/customerMemoryRetentionPolicy";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Retention Policy",
    version: "v1",
    generatedAt: new Date().toISOString(),
    policy: customerMemoryRetentionPolicy,
    samplePreview: previewCustomerMemoryRetention("support-context"),
  });
}
