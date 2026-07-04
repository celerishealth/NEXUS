import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningPhaseCheckpoint } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getRealPilotExecutionArchitecturePlanningPhaseCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
