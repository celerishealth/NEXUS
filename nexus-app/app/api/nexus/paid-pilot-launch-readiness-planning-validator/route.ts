import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningValidationReport } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = getPaidPilotLaunchReadinessPlanningValidationReport();

  return NextResponse.json(
    {
      ok: report.passed,
      route: "paid-pilot-launch-readiness-planning-validator-preview-only",
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
