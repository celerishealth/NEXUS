import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningValidator } from "../../../../lib/nexus/paidPilotReadinessPlanningValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const validator = getPaidPilotReadinessPlanningValidator();

  return NextResponse.json(validator, {
    status: validator.status === "PASS" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
