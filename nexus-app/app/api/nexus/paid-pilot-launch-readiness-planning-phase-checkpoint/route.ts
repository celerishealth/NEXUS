import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningPhaseCheckpoint } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotLaunchReadinessPlanningPhaseCheckpoint();

  return NextResponse.json(
    {
      ok: checkpoint.status === "PHASE_CHECKPOINT_READY",
      route: "paid-pilot-launch-readiness-planning-phase-checkpoint-preview-only",
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
