import { NextResponse } from "next/server";

import { authenticateFounderCommandRequest } from "@/lib/nexus/founderCommandServerAuthentication";
import { createFounderCommercialEvidenceSummary } from "@/lib/nexus/founderCommercialEvidenceSummary";
import { SupabaseFounderCommercialEvidenceReader } from "@/lib/nexus/supabaseFounderCommercialEvidenceReader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      liveProviderExecutionAuthorized: false,
      providerMutationAuthorized: false,
      resumeAuthorized: false,
      customerContactAuthorized: false,
      quotationDeliveryAuthorized: false,
      orderExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
    {
      status,
      headers: NO_STORE_HEADERS,
    },
  );
}

function readServerCredentials():
  | {
      supabaseUrl: string;
      serviceRoleKey: string;
    }
  | null {
  const supabaseUrl =
    (
      process.env.SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      ""
    ).trim();
  const serviceRoleKey =
    (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return { supabaseUrl, serviceRoleKey };
}

export async function GET(
  request: Request,
) {
  if (
    process.env
      .NEXUS_FOUNDER_COMMERCIAL_EVIDENCE_SUMMARY_ENABLED
      ?.trim()
      .toLowerCase() !== "true"
  ) {
    return json(
      {
        error:
          "Founder commercial evidence summary is disabled by default.",
      },
      503,
    );
  }

  const authentication =
    await authenticateFounderCommandRequest(request);

  if (!authentication.ok) {
    const error =
      authentication.reason === "authentication-not-configured"
        ? "Founder commercial evidence authentication is not configured."
        : authentication.reason === "owner-authority-required"
          ? "Owner authority is required."
          : "Authentication failed.";

    return json({ error }, authentication.status);
  }

  const credentials = readServerCredentials();

  if (!credentials) {
    return json(
      {
        error:
          "Founder commercial evidence summary is not configured.",
      },
      503,
    );
  }

  try {
    const readResult =
      await new SupabaseFounderCommercialEvidenceReader(
        credentials,
      ).readTenantOwnerEvidence(
        authentication.tenantId,
        authentication.actorId,
      );

    if (readResult.status !== "found") {
      return json(
        {
          error:
            "Founder commercial evidence summary could not be safely verified.",
        },
        503,
      );
    }

    const summary =
      createFounderCommercialEvidenceSummary({
        tenantId: authentication.tenantId,
        ownerActorId: authentication.actorId,
        generatedAt: new Date().toISOString(),
        records: readResult.records,
      });

    return json(
      {
        schemaVersion:
          "nexus-founder-commercial-evidence-summary-v1",
        tenantId: authentication.tenantId,
        ownerActorId: authentication.actorId,
        summary,
      },
      200,
    );
  } catch {
    return json(
      {
        error:
          "Founder commercial evidence summary could not be safely verified.",
      },
      503,
    );
  }
}
