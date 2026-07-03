import { NextResponse } from "next/server";
import {
  auditEventContract,
  previewAuditEventContract,
} from "../../../../lib/nexus/auditEventContract";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "NEXUS Audit Event Contract",
    version: "v1",
    generatedAt: new Date().toISOString(),
    contract: auditEventContract,
    preview: previewAuditEventContract(),
  });
}
