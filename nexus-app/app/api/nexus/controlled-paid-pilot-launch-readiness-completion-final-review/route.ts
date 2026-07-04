import { NextResponse } from "next/server";
import { getControlledPaidPilotLaunchReadinessCompletionFinalReview } from "@/lib/nexus/controlledPaidPilotLaunchReadinessCompletionFinalReview";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getControlledPaidPilotLaunchReadinessCompletionFinalReview());
}
