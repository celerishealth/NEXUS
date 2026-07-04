import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningSummary } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getPaidPilotLaunchReadinessPlanningSummary();

  return NextResponse.json(
    {
      ok: summary.status === "SUMMARY_READY",
      route: "paid-pilot-launch-readiness-planning-summary-preview-only",
      day: summary.day,
      mode: summary.mode,
      summary,
      safetyBoundary: summary.safetyBoundary,
      generatedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
