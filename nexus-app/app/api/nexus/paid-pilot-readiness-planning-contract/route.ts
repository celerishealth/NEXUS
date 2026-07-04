import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningContract } from "../../../../lib/nexus/paidPilotReadinessPlanningContract";

export const dynamic = "force-dynamic";

export async function GET() {
  const contract = getPaidPilotReadinessPlanningContract();

  return NextResponse.json(contract, {
    status: contract.status === "DEFINED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
