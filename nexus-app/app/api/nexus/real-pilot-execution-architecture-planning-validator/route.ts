import { NextResponse } from "next/server";
import { getRealPilotExecutionArchitecturePlanningValidatorV1 } from "../../../../lib/nexus/realPilotExecutionArchitecturePlanningValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator = getRealPilotExecutionArchitecturePlanningValidatorV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-execution-architecture-planning-validator-v1",
    day: 132,
    validatesDay: 131,
    planningValidatorOnly: true,
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
    validator,
  });
}
