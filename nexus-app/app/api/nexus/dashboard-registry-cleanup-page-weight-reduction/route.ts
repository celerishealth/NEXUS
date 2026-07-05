import { NextResponse } from "next/server";
import { getNexusDashboardRegistryCleanupPageWeightReduction } from "@/lib/nexus/nexusDashboardRegistryCleanupPageWeightReduction";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusDashboardRegistryCleanupPageWeightReduction());
}
