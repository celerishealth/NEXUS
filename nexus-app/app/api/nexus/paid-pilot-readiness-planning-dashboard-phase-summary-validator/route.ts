import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningDashboardPhaseSummaryValidator } from "../../../../lib/nexus/paidPilotReadinessPlanningDashboardPhaseSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getPaidPilotReadinessPlanningDashboardPhaseSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
