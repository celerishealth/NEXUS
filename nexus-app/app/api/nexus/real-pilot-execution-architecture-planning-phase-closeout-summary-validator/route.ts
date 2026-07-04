import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidator } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getRealPilotExecutionArchitecturePlanningPhaseCloseoutSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
