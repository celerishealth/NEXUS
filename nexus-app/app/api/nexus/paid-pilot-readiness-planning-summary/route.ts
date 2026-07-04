import { NextResponse } from "next/server";
import { getPaidPilotReadinessPlanningSummary } from "../../../../lib/nexus/paidPilotReadinessPlanningSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getPaidPilotReadinessPlanningSummary();

  return NextResponse.json(summary, {
    status: summary.status === "CLEARED" ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
