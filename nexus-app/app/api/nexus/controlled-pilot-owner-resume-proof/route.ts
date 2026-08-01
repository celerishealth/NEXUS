import { NextResponse } from "next/server";

import { authenticateFounderCommandRequest } from "@/lib/nexus/founderCommandServerAuthentication";
import {
  verifyControlledPilotOwnerResumeProof,
} from "@/lib/nexus/controlledPilotOwnerResumeAuthorization";

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
      .NEXUS_CONTROLLED_PILOT_OWNER_RESUME_PROOF_ENABLED
      ?.trim()
      .toLowerCase() === "true"
  );
}

export async function GET() {
  if (!isEnabled()) {
    return json(
      {
        ok: false,
        code: "OWNER_RESUME_PROOF_VERIFICATION_DISABLED",
        error:
          "Controlled pilot owner resume proof verification is disabled by default.",
      },
      503,
    );
  }

  return json(
    {
      ok: true,
      capability:
        "controlled-pilot-owner-resume-signed-authorization-proof-v1",
      mode: "verification-only",
      proofIssuanceExposed: false,
      persistentConsumptionRequired: true,
      consumptionLedgerConnected: false,
    },
    200,
  );
}

export async function POST(request: Request) {
  if (!isEnabled()) {
    return json(
      {
        ok: false,
        code: "OWNER_RESUME_PROOF_VERIFICATION_DISABLED",
        error:
          "Controlled pilot owner resume proof verification is disabled by default.",
      },
      503,
    );
  }

  const authentication =
    await authenticateFounderCommandRequest(request);

  if (!authentication.ok) {
    const error =
      authentication.reason ===
      "authentication-not-configured"
        ? "Founder command authentication is not configured."
        : authentication.reason ===
            "owner-authority-required"
          ? "Owner authority is required."
          : "Authentication failed.";

    return json(
      {
        ok: false,
        code:
          authentication.reason ===
          "owner-authority-required"
            ? "OWNER_AUTHORITY_REQUIRED"
            : authentication.reason ===
                "authentication-not-configured"
              ? "AUTHENTICATION_NOT_CONFIGURED"
              : "AUTHENTICATION_FAILED",
        error,
      },
      authentication.status,
    );
  }

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
    return json(
      {
        ok: false,
        code: "INVALID_REQUEST_FAIL_CLOSED",
      },
      400,
    );
  }

  const record =
    payload as Record<string, unknown>;
  const signingSecret =
    process.env.NEXUS_PILOT_RESUME_SIGNING_SECRET;

  if (
    !signingSecret ||
    signingSecret.length < 32
  ) {
    return json(
      {
        ok: false,
        code:
          "SIGNING_SECRET_UNAVAILABLE_FAIL_CLOSED",
      },
      503,
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
        authentication.tenantId,
      expectedSignalId:
        typeof record.signalId === "string"
          ? record.signalId
          : "",
    });

  if (!verification.valid) {
    return json(
      {
        ok: false,
        capability:
          "controlled-pilot-owner-resume-signed-authorization-proof-v1",
        verification,
        consumptionLedgerConnected: false,
        persistentConsumptionRequired: true,
      },
      403,
    );
  }

  if (
    verification.payload.ownerId !==
    authentication.actorId
  ) {
    return json(
      {
        ok: false,
        code: "OWNER_BINDING_MISMATCH",
        error:
          "The signed resume proof does not belong to the authenticated founder owner.",
        consumptionLedgerConnected: false,
        persistentConsumptionRequired: true,
      },
      403,
    );
  }

  return json(
    {
      ok: true,
      capability:
        "controlled-pilot-owner-resume-signed-authorization-proof-v1",
      verification,
      consumptionLedgerConnected: false,
      persistentConsumptionRequired: true,
    },
    200,
  );
}