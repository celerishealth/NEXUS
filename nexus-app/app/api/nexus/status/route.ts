import { NextResponse } from "next/server";
import { backendFoundationMap } from "../../../../lib/nexus/backendFoundation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "NEXUS Backend Foundation",
    version: "v1",
    generatedAt: new Date().toISOString(),
    foundation: backendFoundationMap,
  });
}
