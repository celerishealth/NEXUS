import { NextResponse } from "next/server";
import { getNexusControlledPaidPilotSubscriptionLockBoundaryContract } from "@/lib/nexus/nexusControlledPaidPilotSubscriptionLockBoundaryContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusControlledPaidPilotSubscriptionLockBoundaryContract());
}
