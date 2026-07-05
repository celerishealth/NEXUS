import { NextResponse } from "next/server";
import { getNexusArchitectureIntegrityCheckpoint } from "@/lib/nexus/nexusArchitectureIntegrityCheckpoint";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusArchitectureIntegrityCheckpoint());
}
