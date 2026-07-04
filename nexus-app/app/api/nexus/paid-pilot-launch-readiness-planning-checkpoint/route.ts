import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningCheckpoint } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotLaunchReadinessPlanningCheckpoint();

  return NextResponse.json(
    {
      ok: checkpoint.status === "CHECKPOINT_READY",
      route: "paid-pilot-launch-readiness-planning-checkpoint-preview-only",
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
