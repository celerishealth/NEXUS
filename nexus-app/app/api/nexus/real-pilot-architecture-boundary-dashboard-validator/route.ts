import { NextResponse } from "next/server";
import { getRealPilotArchitectureBoundaryDashboardValidatorV1 } from "../../../../lib/nexus/realPilotArchitectureBoundaryDashboardValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator = getRealPilotArchitectureBoundaryDashboardValidatorV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-architecture-boundary-dashboard-validator-v1",
    day: 126,
    validatesDay: 125,
    dashboardValidatorOnly: true,
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
    validator,
  });
}
