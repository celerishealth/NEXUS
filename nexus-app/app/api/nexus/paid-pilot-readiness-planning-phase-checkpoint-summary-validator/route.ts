import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningPhaseCheckpointSummaryValidator } from "../../../../lib/nexus/paidPilotReadinessPlanningPhaseCheckpointSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getPaidPilotReadinessPlanningPhaseCheckpointSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
