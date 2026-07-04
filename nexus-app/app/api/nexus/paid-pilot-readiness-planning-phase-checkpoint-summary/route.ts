import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningPhaseCheckpointSummary } from "../../../../lib/nexus/paidPilotReadinessPlanningPhaseCheckpointSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getPaidPilotReadinessPlanningPhaseCheckpointSummary();

  return NextResponse.json(summary, {
    status: summary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
