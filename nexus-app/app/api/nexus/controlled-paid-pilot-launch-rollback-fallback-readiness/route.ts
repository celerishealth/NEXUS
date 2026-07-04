import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchRollbackFallbackReadinessContract } from "@/lib/nexus/controlledPaidPilotLaunchRollbackFallbackReadinessContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchRollbackFallbackReadinessContract());
}
