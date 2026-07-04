import { NextResponse } from "next/server";
import { getRealPilotArchitectureBoundaryDashboardSummaryV1 } from "../../../../lib/nexus/realPilotArchitectureBoundaryDashboardSummary";

export const dynamic = "force-static";

export async function GET() {
  const dashboardSummary = getRealPilotArchitectureBoundaryDashboardSummaryV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-architecture-boundary-dashboard-summary-v1",
    day: 127,
    summarizesDays: [125, 126],
    sourceFoundationDays: [121, 122, 123, 124],
    dashboardSummaryOnly: true,
    previewOnly: true,
    planningOnly: true,
    readonly: true,
    executable: false,
    realPilotBlocked: true,
    executionBlocked: true,
    aiModelCallsBlocked: true,
    customerDataWriteBlocked: true,
    auditPersistenceBlocked: true,
    recoveryExecutionBlocked: true,
    dashboardSummary,
  });
}
