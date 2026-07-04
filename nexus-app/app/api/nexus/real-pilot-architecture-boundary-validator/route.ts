import { NextResponse } from "next/server";
import { getRealPilotArchitectureBoundaryValidatorV1 } from "../../../../lib/nexus/realPilotArchitectureBoundaryValidator";

export const dynamic = "force-static";

export async function GET() {
  const validator = getRealPilotArchitectureBoundaryValidatorV1();

  return NextResponse.json({
    ok: true,
    route: "nexus-real-pilot-architecture-boundary-validator-v1",
    day: 122,
    validatesDay: 121,
    validatorOnly: true,
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
