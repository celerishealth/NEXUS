import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummary } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningPhaseCheckpointSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummary();

  return NextResponse.json(summary, {
    status: summary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
