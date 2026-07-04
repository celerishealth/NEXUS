import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchRiskScoringActionClassContract } from "@/lib/nexus/controlledPaidPilotLaunchRiskScoringActionClassContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchRiskScoringActionClassContract());
}
