import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchExecutionEligibilityDecisionContract } from "@/lib/nexus/controlledPaidPilotLaunchExecutionEligibilityDecisionContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchExecutionEligibilityDecisionContract());
}
