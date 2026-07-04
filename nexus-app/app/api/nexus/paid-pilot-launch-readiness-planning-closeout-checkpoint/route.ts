import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningCloseoutCheckpoint } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningCloseoutCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotLaunchReadinessPlanningCloseoutCheckpoint();

  return NextResponse.json(
    {
      ok: checkpoint.status === "CLOSEOUT_CHECKPOINT_READY",
      route: "paid-pilot-launch-readiness-planning-closeout-checkpoint-preview-only",
      day: checkpoint.day,
      mode: checkpoint.mode,
      checkpoint,
      safetyBoundary: checkpoint.safetyBoundary,
      generatedAt: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
