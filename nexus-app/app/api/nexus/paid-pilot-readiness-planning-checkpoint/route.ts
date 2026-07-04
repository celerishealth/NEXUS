import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningCheckpoint } from "../../../../lib/nexus/paidPilotReadinessPlanningCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotReadinessPlanningCheckpoint();

  return NextResponse.json(checkpoint, {
    status: checkpoint.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
