import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningPhaseCloseoutCheckpoint } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningPhaseCloseoutCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getRealPilotExecutionArchitecturePlanningPhaseCloseoutCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
