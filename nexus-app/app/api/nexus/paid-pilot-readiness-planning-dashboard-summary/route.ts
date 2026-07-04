import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningDashboardSummary } from "../../../../lib/nexus/paidPilotReadinessPlanningDashboardSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getPaidPilotReadinessPlanningDashboardSummary();

  return NextResponse.json(summary, {
    status: summary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
