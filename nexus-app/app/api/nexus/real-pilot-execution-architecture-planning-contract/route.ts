import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningContractV1 } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningContract";

export const dynamic = "force-static";

export async function GET() {
  const planningContract = getRealPilotExecutionArchitecturePlanningContractV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-execution-architecture-planning-contract-v1",
    day: 131,
    dependsOnDay: 130,
    planningContractOnly: true,
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
    planningContract,
  });
}
