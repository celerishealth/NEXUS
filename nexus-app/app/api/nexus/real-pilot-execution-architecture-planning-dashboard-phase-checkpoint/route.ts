import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningDashboardPhaseCheckpoint } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningDashboardPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getRealPilotExecutionArchitecturePlanningDashboardPhaseCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
