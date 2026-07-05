import { NextResponse } from "next/server";
import { getNexusArchitectureIntegrityCheckpointValidator } from "@/lib/nexus/nexusArchitectureIntegrityCheckpointValidator";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusArchitectureIntegrityCheckpointValidator());
}
