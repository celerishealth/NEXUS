import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getRealPilotExecutionArchitecturePlanningPhaseCheckpointSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
