import { NextResponse } from "next/server";
import { getNexusControlledPaidPilotAccessEntitlementSafetyContract } from "@/lib/nexus/nexusControlledPaidPilotAccessEntitlementSafetyContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusControlledPaidPilotAccessEntitlementSafetyContract());
}
