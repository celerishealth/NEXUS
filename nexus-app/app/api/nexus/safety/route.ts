import { NextResponse } from "next/server";
import { safetyContract } from "../../../../lib/nexus/safetyContract";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "NEXUS Safety Contract",
    version: "v1",
    generatedAt: new Date().toISOString(),
    contract: safetyContract,
  });
}
