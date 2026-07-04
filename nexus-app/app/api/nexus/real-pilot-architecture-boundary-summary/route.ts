import { NextResponse } from "next/server";
import { getRealPilotArchitectureBoundarySummaryV1 } from "../../../../lib/nexus/realPilotArchitectureBoundarySummary";

export const dynamic = "force-static";

export async function GET() {
  const summary = getRealPilotArchitectureBoundarySummaryV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-architecture-boundary-summary-v1",
    day: 123,
    summarizesDays: [121, 122],
    summaryOnly: true,
    planningOnly: true,
    readonly: true,
    executable: false,
    realPilotBlocked: true,
    executionBlocked: true,
    aiModelCallsBlocked: true,
    customerDataWriteBlocked: true,
    auditPersistenceBlocked: true,
    recoveryExecutionBlocked: true,
    summary,
  });
}
