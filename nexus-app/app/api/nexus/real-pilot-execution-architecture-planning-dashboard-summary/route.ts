import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningDashboardSummary } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningDashboardSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getRealPilotExecutionArchitecturePlanningDashboardSummary();

  return NextResponse.json(summary, {
    status: summary.summary.result === "READY_FOR_NEXT_PLANNING_STEP" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
