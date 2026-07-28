import { NextResponse } from "next/server";

import { createFounderGrowthSnapshotFromTotals } from "@/lib/nexus/founderGrowthSnapshot";
import { resolveControlledActionSQLiteRuntimePath } from "@/lib/nexus/controlledActionSQLiteRuntimePath";
import {
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";
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

function readBearerToken(
  request: Request,
): string | null {
  const authorization =
    request.headers.get("authorization")?.trim() ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(authorization);

  if (!match) {
    return null;
  }

  const token = match[1]?.trim() ?? "";

  return token.length > 0 ? token : null;
}

function readMaximumClockSkewMs(): number {
  const raw =
    process.env.NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS?.trim();

  if (!raw) {
    return 60_000;
  }

  const parsed = Number(raw);

  if (
    !Number.isInteger(parsed) ||
    parsed < 0 ||
    parsed > 300_000
  ) {
    return 60_000;
  }

  return parsed;
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

async function authenticateFounder(
  request: Request,
): Promise<
  | {
      ok: true;
      tenantId: string;
      actorId: string;
    }
  | {
      ok: false;
      response: NextResponse;
    }
> {
  const token = readBearerToken(request);

  if (!token) {
    return {
      ok: false,
      response: json({ error: "Authentication failed." }, 401),
    };
  }

  const keyId =
    process.env.NEXUS_AUTH_SESSION_KEY_ID?.trim() ?? "primary";
  const signingSecret =
    process.env.NEXUS_AUTH_SESSION_SIGNING_SECRET?.trim() ?? "";
  const allowedOwnerActorId =
    process.env.NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID?.trim() ?? "";

  if (!signingSecret || !allowedOwnerActorId) {
    return {
      ok: false,
      response: json(
        {
          error:
            "Founder growth authentication is not configured.",
        },
        503,
      ),
    };
  }

  const now = new Date().toISOString();
  let sessionStore: SQLiteAuthenticatedTenantSessionStore | null = null;

  try {
    const claims = verifyAuthenticatedTenantSessionToken(
      token,
      { [keyId]: signingSecret },
      {
        now,
        maxClockSkewMs: readMaximumClockSkewMs(),
      },
    );

    sessionStore = new SQLiteAuthenticatedTenantSessionStore(
      resolveControlledActionSQLiteRuntimePath(
        process.env.NEXUS_CONTROLLED_ACTION_SQLITE_PATH,
      ),
    );

    await sessionStore.assertActiveSession(claims, now);

    if (
      claims.role !== "owner" ||
      claims.actorId !== allowedOwnerActorId
    ) {
      return {
        ok: false,
        response: json(
          { error: "Owner authority is required." },
          403,
        ),
      };
    }

    return {
      ok: true,
      tenantId: claims.tenantId,
      actorId: claims.actorId,
    };
  } catch {
    return {
      ok: false,
      response: json({ error: "Authentication failed." }, 401),
    };
  } finally {
    sessionStore?.close();
  }
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
    await authenticateFounder(request);

  if (!authentication.ok) {
    return authentication.response;
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
