import { NextResponse } from "next/server";

import { evaluateControlledPilotRecovery } from "@/lib/nexus/controlledPilotRecoveryGate";
import { authenticateFounderCommandRequest } from "@/lib/nexus/founderCommandServerAuthentication";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "cache-control": "no-store",
  pragma: "no-cache",
};

function json(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(
    {
      ...body,
      automaticResumeAuthorized: false,
      pilotOperationPermitted: false,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
    {
      status,
      headers: NO_STORE_HEADERS,
    },
  );
}

function isEnabled(): boolean {
  return (
    process.env
      .NEXUS_CONTROLLED_PILOT_RECOVERY_GATE_ENABLED
      ?.trim()
      .toLowerCase() === "true"
  );
}

function authenticationError(
  authentication: {
    ok: false;
    status: number;
    reason: string;
  },
) {
  const code =
    authentication.reason ===
    "owner-authority-required"
      ? "OWNER_AUTHORITY_REQUIRED"
      : authentication.reason ===
          "authentication-not-configured"
        ? "AUTHENTICATION_NOT_CONFIGURED"
        : "AUTHENTICATION_FAILED";

  const error =
    authentication.reason ===
    "owner-authority-required"
      ? "Founder-owner authority is required."
      : authentication.reason ===
          "authentication-not-configured"
        ? "Founder command authentication is not configured."
        : "Authentication failed.";

  return json(
    {
      ok: false,
      code,
      error,
    },
    authentication.status,
  );
}

export async function GET(request: Request) {
  if (!isEnabled()) {
    return json(
      {
        ok: false,
        code:
          "CONTROLLED_PILOT_RECOVERY_GATE_DISABLED",
        error:
          "Controlled pilot recovery evaluation is disabled by default.",
      },
      503,
    );
  }

  const authentication =
    await authenticateFounderCommandRequest(request);

  if (!authentication.ok) {
    return authenticationError(authentication);
  }

  return json(
    {
      ok: true,
      capability:
        "controlled-pilot-recovery-gate-v1",
      mode: "authenticated-decision-only",
      tenantId: authentication.tenantId,
      ownerId: authentication.actorId,
      message:
        "This endpoint evaluates recovery readiness only. It does not resume pilot operation or execute external providers.",
    },
    200,
  );
}

export async function POST(request: Request) {
  if (!isEnabled()) {
    return json(
      {
        ok: false,
        code:
          "CONTROLLED_PILOT_RECOVERY_GATE_DISABLED",
        error:
          "Controlled pilot recovery evaluation is disabled by default.",
      },
      503,
    );
  }

  const authentication =
    await authenticateFounderCommandRequest(request);

  if (!authentication.ok) {
    return authenticationError(authentication);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const decision =
    evaluateControlledPilotRecovery(payload);

  const responseStatus =
    decision.code ===
    "INVALID_INPUT_FAIL_CLOSED"
      ? 400
      : 200;

  return json(
    {
      ok: responseStatus === 200,
      capability:
        "controlled-pilot-recovery-gate-v1",
      mode: "authenticated-decision-only",
      tenantId: authentication.tenantId,
      ownerId: authentication.actorId,
      decision,
    },
    responseStatus,
  );
}