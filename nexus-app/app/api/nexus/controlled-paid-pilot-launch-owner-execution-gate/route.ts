import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchOwnerExecutionGateContract } from "@/lib/nexus/controlledPaidPilotLaunchOwnerExecutionGateContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchOwnerExecutionGateContract());
}
