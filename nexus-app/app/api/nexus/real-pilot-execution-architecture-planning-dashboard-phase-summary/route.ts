import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningDashboardPhaseSummary } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningDashboardPhaseSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const phaseSummary = getRealPilotExecutionArchitecturePlanningDashboardPhaseSummary();

  return NextResponse.json(phaseSummary, {
    status: phaseSummary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
