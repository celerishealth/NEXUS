import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningFinalPhaseSummaryValidator } from "../../../../lib/nexus/paidPilotReadinessPlanningFinalPhaseSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getPaidPilotReadinessPlanningFinalPhaseSummaryValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
