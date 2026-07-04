import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningDashboardCheckpoint } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningDashboardCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getRealPilotExecutionArchitecturePlanningDashboardCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
