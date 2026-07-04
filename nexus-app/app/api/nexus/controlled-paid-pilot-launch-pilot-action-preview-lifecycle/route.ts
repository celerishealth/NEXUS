import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchPilotActionPreviewLifecycleContract } from "@/lib/nexus/controlledPaidPilotLaunchPilotActionPreviewLifecycleContract";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchPilotActionPreviewLifecycleContract());
}
