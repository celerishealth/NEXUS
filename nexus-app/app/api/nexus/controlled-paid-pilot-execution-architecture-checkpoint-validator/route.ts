import { NextResponse } from "next/server";
import { getNexusControlledPaidPilotExecutionArchitectureCheckpointValidator } from "@/lib/nexus/nexusControlledPaidPilotExecutionArchitectureCheckpointValidator";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusControlledPaidPilotExecutionArchitectureCheckpointValidator());
}
