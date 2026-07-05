import { NextResponse } from "next/server";
import { getNexusControlledPaidPilotAccessEntitlementSafetyValidator } from "@/lib/nexus/nexusControlledPaidPilotAccessEntitlementSafetyValidator";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getNexusControlledPaidPilotAccessEntitlementSafetyValidator());
}
