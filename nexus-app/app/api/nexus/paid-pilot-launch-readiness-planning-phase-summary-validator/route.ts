import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningPhaseSummaryValidationReport } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningPhaseSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = getPaidPilotLaunchReadinessPlanningPhaseSummaryValidationReport();

  return NextResponse.json(
    {
      ok: report.passed,
      route: "paid-pilot-launch-readiness-planning-phase-summary-validator-preview-only",
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
