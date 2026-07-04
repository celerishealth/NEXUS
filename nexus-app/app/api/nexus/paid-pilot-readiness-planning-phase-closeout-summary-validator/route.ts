import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningPhaseCloseoutSummaryValidator } from "../../../../lib/nexus/paidPilotReadinessPlanningPhaseCloseoutSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getPaidPilotReadinessPlanningPhaseCloseoutSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
