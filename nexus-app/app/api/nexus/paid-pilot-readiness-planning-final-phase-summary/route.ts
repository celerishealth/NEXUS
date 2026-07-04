import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningFinalPhaseSummary } from "../../../../lib/nexus/paidPilotReadinessPlanningFinalPhaseSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const finalPhaseSummary = getPaidPilotReadinessPlanningFinalPhaseSummary();

  return NextResponse.json(finalPhaseSummary, {
    status: finalPhaseSummary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
