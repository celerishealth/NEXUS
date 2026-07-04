import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningPhaseCloseoutSummary } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningPhaseCloseoutSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const closeoutSummary = getRealPilotExecutionArchitecturePlanningPhaseCloseoutSummary();

  return NextResponse.json(closeoutSummary, {
    status: closeoutSummary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
