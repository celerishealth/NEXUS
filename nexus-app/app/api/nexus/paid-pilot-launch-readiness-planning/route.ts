import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningContract } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningContract";

export const dynamic = "force-dynamic";

export async function GET() {
  const contract = getPaidPilotLaunchReadinessPlanningContract();

  return NextResponse.json(
    {
      ok: true,
      route: "paid-pilot-launch-readiness-planning-preview-only",
      day: contract.day,
      mode: contract.mode,
      contract,
      safetyBoundary: contract.safetyBoundary,
      blockedExecutionActions: contract.blockedExecutionActions,
      generatedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
