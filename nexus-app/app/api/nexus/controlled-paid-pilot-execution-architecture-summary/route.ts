import { NextResponse } from "next/server";
import { getNexusControlledPaidPilotExecutionArchitectureSummary } from "@/lib/nexus/nexusControlledPaidPilotExecutionArchitectureSummary";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusControlledPaidPilotExecutionArchitectureSummary());
}
