import { NextResponse } from "next/server";
import { getNexusControlledPaidPilotExecutionArchitectureCheckpoint } from "@/lib/nexus/nexusControlledPaidPilotExecutionArchitectureCheckpoint";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusControlledPaidPilotExecutionArchitectureCheckpoint());
}
