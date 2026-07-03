import { NextResponse } from "next/server";
import {
  customerMemorySanitizer,
  sanitizeCustomerMemoryPreview,
} from "../../../../lib/nexus/customerMemorySanitizer";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample =
    "Customer email test@example.com phone 9876543210 says replacement delivery is pending. OTP 123456.";

  return NextResponse.json({
    ok: true,
    service: "NEXUS Customer Memory Sanitizer",
    version: "v1",
    generatedAt: new Date().toISOString(),
    sanitizer: customerMemorySanitizer,
    samplePreview: sanitizeCustomerMemoryPreview(sample),
  });
}
