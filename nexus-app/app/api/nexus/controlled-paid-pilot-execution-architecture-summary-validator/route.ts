import { NextResponse } from "next/server";
import { getNexusControlledPaidPilotExecutionArchitectureSummaryValidator } from "@/lib/nexus/nexusControlledPaidPilotExecutionArchitectureSummaryValidator";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusControlledPaidPilotExecutionArchitectureSummaryValidator());
}
