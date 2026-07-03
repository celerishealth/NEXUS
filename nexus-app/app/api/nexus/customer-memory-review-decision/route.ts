import { NextResponse } from "next/server";
import {
  customerMemoryReviewDecisionPolicy,
  previewCustomerMemoryReviewDecisionPolicy,
} from "../../../../lib/nexus/customerMemoryReviewDecisionPolicy";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Review Decision Policy",
    version: "v1",
    generatedAt: new Date().toISOString(),
    policy: customerMemoryReviewDecisionPolicy,
    samplePreview: previewCustomerMemoryReviewDecisionPolicy("pending-review"),
  });
}
