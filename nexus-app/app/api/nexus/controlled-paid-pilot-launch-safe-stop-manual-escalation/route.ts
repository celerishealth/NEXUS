import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchSafeStopManualEscalationContract } from "@/lib/nexus/controlledPaidPilotLaunchSafeStopManualEscalationContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchSafeStopManualEscalationContract());
}
