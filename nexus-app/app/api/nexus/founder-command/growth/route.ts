import { NextResponse } from "next/server";

import { authenticateFounderCommandRequest } from "@/lib/nexus/founderCommandServerAuthentication";

import { createFounderGrowthSnapshotFromTotals } from "@/lib/nexus/founderGrowthSnapshot";
import { SupabaseControlledCustomerInquiryGrowthTotalsReader } from "@/lib/nexus/supabaseControlledCustomerInquiryGrowthTotalsReader";

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
      .NEXUS_FOUNDER_GROWTH_SNAPSHOT_ENABLED
      ?.trim()
      .toLowerCase() !== "true"
  ) {
    return json(
      {
        error:
          "Founder growth snapshot is disabled by default.",
      },
      503,
    );
  }

  const authentication =
    await authenticateFounderCommandRequest(request);

  if (!authentication.ok) {
    const error =
      authentication.reason === "authentication-not-configured"
        ? "Founder growth authentication is not configured."
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
          "Founder growth snapshot is not configured.",
      },
      503,
    );
  }

  try {
    const readResult =
      await new SupabaseControlledCustomerInquiryGrowthTotalsReader(
        credentials,
      ).readTenantGrowthTotals(
        authentication.tenantId,
      );

    if (readResult.status !== "found") {
      return json(
        {
          error:
            "Founder growth snapshot could not be safely verified.",
        },
        503,
      );
    }

    const snapshot =
      createFounderGrowthSnapshotFromTotals({
        tenantId: authentication.tenantId,
        generatedAt: new Date().toISOString(),
        totals: readResult.totals,
      });

    return json(
      {
        schemaVersion:
          "nexus-founder-growth-snapshot-v1",
        tenantId: authentication.tenantId,
        ownerActorId: authentication.actorId,
        snapshot,
      },
      200,
    );
  } catch {
    return json(
      {
        error:
          "Founder growth snapshot could not be safely verified.",
      },
      503,
    );
  }
}
