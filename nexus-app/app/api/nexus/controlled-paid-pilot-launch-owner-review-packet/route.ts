import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchOwnerReviewPacketContract } from "@/lib/nexus/controlledPaidPilotLaunchOwnerReviewPacketContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchOwnerReviewPacketContract());
}
