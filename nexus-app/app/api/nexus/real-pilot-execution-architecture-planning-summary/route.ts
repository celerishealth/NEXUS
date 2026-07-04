import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningSummaryV1 } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningSummary";

export const dynamic = "force-static";

export async function GET() {
  const planningSummary = getRealPilotExecutionArchitecturePlanningSummaryV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-execution-architecture-planning-summary-v1",
    day: 133,
    summarizesDays: [131, 132],
    planningSummaryOnly: true,
    previewOnly: true,
    planningOnly: true,
    readonly: true,
    executable: false,
    realPilotAllowedNow: false,
    executionArchitectureApprovedNow: false,
    realPilotBlocked: true,
    executionBlocked: true,
    aiModelCallsBlocked: true,
    customerDataWriteBlocked: true,
    auditPersistenceBlocked: true,
    recoveryExecutionBlocked: true,
    planningSummary,
  });
}
