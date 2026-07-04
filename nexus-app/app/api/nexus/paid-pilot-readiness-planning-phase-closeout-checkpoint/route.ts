import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningPhaseCloseoutCheckpoint } from "../../../../lib/nexus/paidPilotReadinessPlanningPhaseCloseoutCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotReadinessPlanningPhaseCloseoutCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
