import { NextResponse } from "next/server";
import {
  auditRedactionPolicy,
  previewAuditRedaction,
} from "../../../../lib/nexus/auditRedactionPolicy";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = "Customer email test@example.com phone 9876543210 asks for refund payment TXN-7788.";

  return NextResponse.json({
    ok: true,
    service: "NEXUS Audit Redaction Policy",
    version: "v1",
    generatedAt: new Date().toISOString(),
    policy: auditRedactionPolicy,
    sampleRedaction: previewAuditRedaction(sample),
  });
}
