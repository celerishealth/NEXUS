import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningFinalPhaseSummary } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningFinalPhaseSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const finalPhaseSummary = getRealPilotExecutionArchitecturePlanningFinalPhaseSummary();

  return NextResponse.json(finalPhaseSummary, {
    status: finalPhaseSummary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
