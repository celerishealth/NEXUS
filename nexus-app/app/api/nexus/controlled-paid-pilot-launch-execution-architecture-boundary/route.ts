import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchExecutionArchitectureBoundaryContract } from "@/lib/nexus/controlledPaidPilotLaunchExecutionArchitectureBoundaryContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchExecutionArchitectureBoundaryContract());
}
