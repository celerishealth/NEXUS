import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningCloseoutSummaryValidationReport } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningCloseoutSummaryValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = getPaidPilotLaunchReadinessPlanningCloseoutSummaryValidationReport();

  return NextResponse.json(
    {
      ok: report.passed,
      route: "paid-pilot-launch-readiness-planning-closeout-summary-validator-preview-only",
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
