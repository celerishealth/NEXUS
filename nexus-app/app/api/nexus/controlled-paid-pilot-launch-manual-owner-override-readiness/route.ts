import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchManualOwnerOverrideReadinessContract } from "@/lib/nexus/controlledPaidPilotLaunchManualOwnerOverrideReadinessContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchManualOwnerOverrideReadinessContract());
}
