import { NextResponse } from "next/server";

import {
  verifyControlledPilotOwnerResumeProof,
} from "../../../../lib/nexus/controlledPilotOwnerResumeAuthorization";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    capability:
      "controlled-pilot-owner-resume-signed-authorization-proof-v1",
    mode: "verification-only",
    proofIssuanceExposed: false,
    persistentConsumptionRequired: true,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload)
  ) {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_REQUEST_FAIL_CLOSED",
        pilotOperationPermitted: false,
        liveProviderExecutionAuthorized: false,
        publicLaunchAuthorized: false,
      },
      {
        status: 400,
      },
    );
  }

  const record = payload as Record<string, unknown>;
  const signingSecret =
    process.env.NEXUS_PILOT_RESUME_SIGNING_SECRET;

  if (!signingSecret || signingSecret.length < 32) {
    return NextResponse.json(
      {
        ok: false,
        code: "SIGNING_SECRET_UNAVAILABLE_FAIL_CLOSED",
        pilotOperationPermitted: false,
        liveProviderExecutionAuthorized: false,
        publicLaunchAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  const verification =
    verifyControlledPilotOwnerResumeProof({
      token:
        typeof record.token === "string"
          ? record.token
          : "",
      signingSecret,
      expectedTenantId:
        typeof record.tenantId === "string"
          ? record.tenantId
          : "",
      expectedSignalId:
        typeof record.signalId === "string"
          ? record.signalId
          : "",
      consumedTokenIds: [],
    });

  return NextResponse.json(
    {
      ok: verification.valid,
      capability:
        "controlled-pilot-owner-resume-signed-authorization-proof-v1",
      verification,
      consumptionLedgerConnected: false,
      persistentConsumptionRequired: true,
      automaticResumeAuthorized: false,
      pilotOperationPermitted: false,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
    {
      status: verification.valid ? 200 : 403,
    },
  );
}
