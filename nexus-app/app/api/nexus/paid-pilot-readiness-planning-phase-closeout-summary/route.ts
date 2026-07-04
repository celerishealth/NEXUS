import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningPhaseCloseoutSummary } from "../../../../lib/nexus/paidPilotReadinessPlanningPhaseCloseoutSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const closeoutSummary = getPaidPilotReadinessPlanningPhaseCloseoutSummary();

  return NextResponse.json(closeoutSummary, {
    status: closeoutSummary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
