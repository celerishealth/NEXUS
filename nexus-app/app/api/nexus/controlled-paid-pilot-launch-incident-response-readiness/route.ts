import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchIncidentResponseReadinessContract } from "@/lib/nexus/controlledPaidPilotLaunchIncidentResponseReadinessContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchIncidentResponseReadinessContract());
}
