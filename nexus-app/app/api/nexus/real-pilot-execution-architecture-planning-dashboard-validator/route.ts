import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningDashboardValidator } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningDashboardValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getRealPilotExecutionArchitecturePlanningDashboardValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
