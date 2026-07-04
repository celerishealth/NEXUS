import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchArchitecturePlanningContract } from "../../../../lib/nexus/controlledPaidPilotLaunchArchitecturePlanningContract";

export const dynamic = "force-dynamic";

export async function GET() {
  const contract = getControlledPaidPilotLaunchArchitecturePlanningContract();

  return NextResponse.json(
    {
      ok: true,
      route: "controlled-paid-pilot-launch-architecture-planning-preview-only",
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
