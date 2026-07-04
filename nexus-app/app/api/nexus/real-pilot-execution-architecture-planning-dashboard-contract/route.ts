import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningDashboardContractV1 } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningDashboardContract";

export const dynamic = "force-static";

export async function GET() {
  const dashboardContract = getRealPilotExecutionArchitecturePlanningDashboardContractV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-execution-architecture-planning-dashboard-contract-v1",
    day: 135,
    sourceDays: [131, 132, 133, 134],
    planningDashboardContractOnly: true,
    previewOnly: true,
    planningOnly: true,
    readonly: true,
    executable: false,
    realPilotAllowedNow: false,
    executionArchitectureApprovedNow: false,
    realPilotBlocked: true,
    executionBlocked: true,
    adapterExecutionBlocked: true,
    subscriptionMutationBlocked: true,
    aiModelCallsBlocked: true,
    customerDataWriteBlocked: true,
    auditPersistenceBlocked: true,
    recoveryExecutionBlocked: true,
    dashboardContract,
  });
}
