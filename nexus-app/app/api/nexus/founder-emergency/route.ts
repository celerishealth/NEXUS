import {
  randomUUID,
} from "node:crypto";
import {
  resolve,
} from "node:path";

import {
  NextResponse,
} from "next/server";

import {
  pauseFounderEmergencyOperations,
  readFounderEmergencyStatus,
} from "@/lib/nexus/founderEmergencyOperations";
import {
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";
import {
  SupabaseControlledPilotAtomicHealthPauseStore,
} from "@/lib/nexus/supabaseControlledPilotAtomicHealthPauseStore";
import {
  SupabaseControlledPilotOperationStateReader,
} from "@/lib/nexus/supabaseControlledPilotOperationStateReader";

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
      liveProviderExecutionAuthorized:
        false,
      resumeAuthorized: false,
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
    request.headers
      .get("authorization")
      ?.trim() ?? "";

  const match =
    /^Bearer\s+(.+)$/i.exec(
      authorization,
    );

  if (!match) {
    return null;
  }

  const token = match[1]?.trim() ?? "";

  return token.length > 0
    ? token
    : null;
}

function readMaximumClockSkewMs(): number {
  const raw =
    process.env
      .NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS
      ?.trim();

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
      process.env
        .NEXT_PUBLIC_SUPABASE_URL ??
      ""
    ).trim();

  const serviceRoleKey =
    (
      process.env
        .SUPABASE_SERVICE_ROLE_KEY ??
      ""
    ).trim();

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    return null;
  }

  return {
    supabaseUrl,
    serviceRoleKey,
  };
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
  if (
    process.env
      .NEXUS_FOUNDER_EMERGENCY_OPERATIONS_ENABLED
      ?.trim()
      .toLowerCase() !== "true"
  ) {
    return {
      ok: false,
      response: json(
        {
          error:
            "Founder emergency operations are disabled.",
        },
        503,
      ),
    };
  }

  if (
    process.env
      .NEXUS_CONTROLLED_ACTION_STORAGE
      ?.trim()
      .toLowerCase() !== "sqlite"
  ) {
    return {
      ok: false,
      response: json(
        {
          error:
            "Founder emergency authentication storage is unavailable.",
        },
        503,
      ),
    };
  }

  const token =
    readBearerToken(request);

  if (!token) {
    return {
      ok: false,
      response: json(
        {
          error:
            "Authentication failed.",
        },
        401,
      ),
    };
  }

  const keyId =
    process.env
      .NEXUS_AUTH_SESSION_KEY_ID
      ?.trim() ?? "primary";

  const signingSecret =
    process.env
      .NEXUS_AUTH_SESSION_SIGNING_SECRET
      ?.trim() ?? "";

  const allowedOwnerActorId =
    process.env
      .NEXUS_FOUNDER_EMERGENCY_OWNER_ACTOR_ID
      ?.trim() ?? "";

  if (
    !signingSecret ||
    !allowedOwnerActorId
  ) {
    return {
      ok: false,
      response: json(
        {
          error:
            "Founder emergency authentication is not configured.",
        },
        503,
      ),
    };
  }

  const now =
    new Date().toISOString();

  let sessionStore:
    | SQLiteAuthenticatedTenantSessionStore
    | null = null;

  try {
    const claims =
      verifyAuthenticatedTenantSessionToken(
        token,
        {
          [keyId]: signingSecret,
        },
        {
          now,
          maxClockSkewMs:
            readMaximumClockSkewMs(),
        },
      );

    sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        resolve(
          /* turbopackIgnore: true */ process.cwd(),
          process.env
            .NEXUS_CONTROLLED_ACTION_SQLITE_PATH ??
            ".nexus-runtime/controlled-action-state.sqlite",
        ),
      );

    await sessionStore
      .assertActiveSession(
        claims,
        now,
      );

    if (
      claims.actorId !==
        allowedOwnerActorId ||
      claims.role === "system-owner"
    ) {
      return {
        ok: false,
        response: json(
          {
            error:
              "Owner authority is required.",
          },
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
      response: json(
        {
          error:
            "Authentication failed.",
        },
        401,
      ),
    };
  } finally {
    sessionStore?.close();
  }
}

export async function GET(
  request: Request,
) {
  const authentication =
    await authenticateFounder(request);

  if (!authentication.ok) {
    return authentication.response;
  }

  const credentials =
    readServerCredentials();

  if (!credentials) {
    return json(
      {
        error:
          "Founder emergency state service is unavailable.",
      },
      503,
    );
  }

  const stateReader =
    new SupabaseControlledPilotOperationStateReader(
      credentials,
    );

  const result =
    await readFounderEmergencyStatus(
      authentication.tenantId,
      stateReader,
    );

  if (result.status !== "ready") {
    return json(
      {
        error:
          result.status ===
          "state-not-found"
            ? "Controlled pilot state was not found."
            : "Founder emergency state could not be verified.",
      },
      result.status ===
      "state-not-found"
        ? 404
        : 503,
    );
  }

  return json(
    {
      mode:
        "authenticated-founder-emergency-status-v1",
      tenantId:
        authentication.tenantId,
      ownerActorId:
        authentication.actorId,
      operationStatus:
        result.state.operationStatus,
      blockingSignalId:
        result.state.blockingSignalId,
      stateVersion:
        result.state.stateVersion,
      lastTransitionAt:
        result.state.lastTransitionAt,
      emergencyPauseAvailable:
        result.state.operationStatus ===
        "active",
    },
    200,
  );
}

export async function POST(
  request: Request,
) {
  const authentication =
    await authenticateFounder(request);

  if (!authentication.ok) {
    return authentication.response;
  }

  const credentials =
    readServerCredentials();

  if (!credentials) {
    return json(
      {
        error:
          "Founder emergency pause service is unavailable.",
      },
      503,
    );
  }

  const signalId =
    randomUUID();

  const stateReader =
    new SupabaseControlledPilotOperationStateReader(
      credentials,
    );

  const pauseStore =
    new SupabaseControlledPilotAtomicHealthPauseStore(
      credentials,
    );

  const result =
    await pauseFounderEmergencyOperations(
      {
        tenantId:
          authentication.tenantId,
        signalId,
        observedAt: Date.now(),
      },
      {
        stateReader,
        pauseStore,
      },
    );

  if (
    result.status === "paused" ||
    result.status ===
      "already-paused"
  ) {
    return json(
      {
        mode:
          "authenticated-founder-emergency-pause-v1",
        tenantId:
          authentication.tenantId,
        ownerActorId:
          authentication.actorId,
        pauseStatus: result.status,
        operationStatus:
          result.state.operationStatus,
        blockingSignalId:
          result.state.blockingSignalId,
        stateVersion:
          result.state.stateVersion,
        lastTransitionAt:
          result.state.lastTransitionAt,
      },
      200,
    );
  }

  const conflict =
    result.status ===
    "state-conflict";

  const notFound =
    result.status ===
    "state-not-found";

  return json(
    {
      error:
        conflict
          ? "Emergency pause was blocked by a concurrent state change."
          : notFound
            ? "Controlled pilot state was not found."
            : "Emergency pause could not be safely verified.",
      pauseStatus: result.status,
    },
    conflict
      ? 409
      : notFound
        ? 404
        : 503,
  );
}