import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningDashboardPhaseSummaryValidator } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningDashboardPhaseSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getRealPilotExecutionArchitecturePlanningDashboardPhaseSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
