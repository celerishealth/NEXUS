import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchAuditReadinessContract } from "@/lib/nexus/controlledPaidPilotLaunchAuditReadinessContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchAuditReadinessContract());
}
