import { NextResponse } from "next/server";
import { getRealPilotArchitectureBoundaryDashboardContractV1 } from "../../../../lib/nexus/realPilotArchitectureBoundaryDashboardContract";

export const dynamic = "force-static";

export async function GET() {
  const dashboardContract = getRealPilotArchitectureBoundaryDashboardContractV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-architecture-boundary-dashboard-contract-v1",
    day: 125,
    sourceDays: [121, 122, 123, 124],
    dashboardContractOnly: true,
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
    dashboardContract,
  });
}
