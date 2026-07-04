import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidationReport } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningFinalPhaseSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = getPaidPilotLaunchReadinessPlanningFinalPhaseSummaryValidationReport();

  return NextResponse.json(
    {
      ok: report.passed,
      route: "paid-pilot-launch-readiness-planning-final-phase-summary-validator-preview-only",
      day: report.day,
      mode: report.mode,
      report,
      safetyBoundary: report.safetyBoundary,
      generatedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
