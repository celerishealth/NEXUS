import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchArchitecturePlanningValidationReport } from "../../../../lib/nexus/controlledPaidPilotLaunchArchitecturePlanningValidator";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = getControlledPaidPilotLaunchArchitecturePlanningValidationReport();

  return NextResponse.json(
    {
      ok: report.passed,
      route: "controlled-paid-pilot-launch-architecture-planning-validator-preview-only",
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
