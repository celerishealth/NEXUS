import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningDashboardCheckpoint } from "../../../../lib/nexus/paidPilotReadinessPlanningDashboardCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotReadinessPlanningDashboardCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
