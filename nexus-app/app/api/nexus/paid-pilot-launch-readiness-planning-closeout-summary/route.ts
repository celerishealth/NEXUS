import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningCloseoutSummary } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningCloseoutSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const closeoutSummary = getPaidPilotLaunchReadinessPlanningCloseoutSummary();

  return NextResponse.json(
    {
      ok: closeoutSummary.status === "CLOSEOUT_SUMMARY_READY",
      route: "paid-pilot-launch-readiness-planning-closeout-summary-preview-only",
      day: closeoutSummary.day,
      mode: closeoutSummary.mode,
      closeoutSummary,
      safetyBoundary: closeoutSummary.safetyBoundary,
      generatedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
