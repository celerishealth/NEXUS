import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningPhaseCheckpoint } from "../../../../lib/nexus/paidPilotReadinessPlanningPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotReadinessPlanningPhaseCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
