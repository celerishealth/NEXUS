import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningDashboardContract } from "../../../../lib/nexus/paidPilotReadinessPlanningDashboardContract";

export const dynamic = "force-dynamic";

export async function GET() {
  const contract = getPaidPilotReadinessPlanningDashboardContract();

  return NextResponse.json(contract, {
    status: contract.status === "DEFINED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
