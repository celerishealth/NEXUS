import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningFinalPhaseSummary } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningFinalPhaseSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  const finalPhaseSummary = getPaidPilotLaunchReadinessPlanningFinalPhaseSummary();

  return NextResponse.json(
    {
      ok: finalPhaseSummary.status === "FINAL_PHASE_SUMMARY_READY",
      route: "paid-pilot-launch-readiness-planning-final-phase-summary-preview-only",
      day: finalPhaseSummary.day,
      mode: finalPhaseSummary.mode,
      finalPhaseSummary,
      safetyBoundary: finalPhaseSummary.safetyBoundary,
      generatedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
