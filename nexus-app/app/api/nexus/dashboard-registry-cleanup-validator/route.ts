import { NextResponse } from "next/server";
import { getNexusDashboardRegistryCleanupValidator } from "@/lib/nexus/nexusDashboardRegistryCleanupValidator";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusDashboardRegistryCleanupValidator());
}
