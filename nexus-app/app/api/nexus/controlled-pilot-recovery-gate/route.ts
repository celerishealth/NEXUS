import { NextResponse } from "next/server";

import { evaluateControlledPilotRecovery } from "../../../../lib/nexus/controlledPilotRecoveryGate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    capability: "controlled-pilot-recovery-gate-v1",
    mode: "decision-only",
    automaticResumeAuthorized: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
    message:
      "This endpoint evaluates recovery readiness only. It does not resume pilot operation or execute external providers.",
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const decision = evaluateControlledPilotRecovery(payload);

  const responseStatus =
    decision.code === "INVALID_INPUT_FAIL_CLOSED" ? 400 : 200;

  return NextResponse.json(
    {
      ok: responseStatus === 200,
      capability: "controlled-pilot-recovery-gate-v1",
      decision,
    },
    {
      status: responseStatus,
    },
  );
}
