import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningDashboardPhaseSummary } from "../../../../lib/nexus/paidPilotReadinessPlanningDashboardPhaseSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const phaseSummary = getPaidPilotReadinessPlanningDashboardPhaseSummary();

  return NextResponse.json(phaseSummary, {
    status: phaseSummary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
