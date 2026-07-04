import { NextResponse } from "next/server";
import { getPaidPilotLaunchReadinessPlanningFinalPhaseCheckpoint } from "../../../../lib/nexus/paidPilotLaunchReadinessPlanningFinalPhaseCheckpoint";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkpoint = getPaidPilotLaunchReadinessPlanningFinalPhaseCheckpoint();

  return NextResponse.json(
    {
      ok: checkpoint.status === "FINAL_PHASE_CHECKPOINT_READY",
      route: "paid-pilot-launch-readiness-planning-final-phase-checkpoint-preview-only",
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
