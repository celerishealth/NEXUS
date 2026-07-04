import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningFinalPhaseCheckpoint } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningFinalPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getRealPilotExecutionArchitecturePlanningFinalPhaseCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
