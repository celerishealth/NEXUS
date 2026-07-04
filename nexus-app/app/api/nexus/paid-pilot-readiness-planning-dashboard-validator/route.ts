import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningDashboardValidator } from "../../../../lib/nexus/paidPilotReadinessPlanningDashboardValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getPaidPilotReadinessPlanningDashboardValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
