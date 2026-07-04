import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningDashboardPhaseCheckpoint } from "../../../../lib/nexus/paidPilotReadinessPlanningDashboardPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotReadinessPlanningDashboardPhaseCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
