import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningPhaseSummary } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningPhaseSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const phaseSummary = getPaidPilotLaunchReadinessPlanningPhaseSummary();

  return NextResponse.json(
    {
      ok: phaseSummary.status === "PHASE_SUMMARY_READY",
      route: "paid-pilot-launch-readiness-planning-phase-summary-preview-only",
      day: phaseSummary.day,
      mode: phaseSummary.mode,
      phaseSummary,
      safetyBoundary: phaseSummary.safetyBoundary,
      generatedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
