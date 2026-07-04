import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningFinalPhaseSummaryValidator } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningFinalPhaseSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getRealPilotExecutionArchitecturePlanningFinalPhaseSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
