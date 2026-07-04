import { NextResponse } from "next/server";
import { getRealPilotArchitectureBoundaryPhaseSummaryV1 } from "../../../../lib/nexus/realPilotArchitectureBoundaryPhaseSummary";

export const dynamic = "force-static";

export async function GET() {
  const phaseSummary = getRealPilotArchitectureBoundaryPhaseSummaryV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-architecture-boundary-phase-summary-v1",
    day: 129,
    summarizesDays: [121, 122, 123, 124, 125, 126, 127, 128],
    phaseSummaryOnly: true,
    previewOnly: true,
    planningOnly: true,
    readonly: true,
    executable: false,
    realPilotBlocked: true,
    executionArchitectureNotApproved: true,
    executionBlocked: true,
    aiModelCallsBlocked: true,
    customerDataWriteBlocked: true,
    auditPersistenceBlocked: true,
    recoveryExecutionBlocked: true,
    phaseSummary,
  });
}
