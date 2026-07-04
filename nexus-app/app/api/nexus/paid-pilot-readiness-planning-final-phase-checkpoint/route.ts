import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningFinalPhaseCheckpoint } from "../../../../lib/nexus/paidPilotReadinessPlanningFinalPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotReadinessPlanningFinalPhaseCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
