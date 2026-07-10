import {
  resolve,
} from "node:path";
import {
  NextRequest,
  NextResponse,
} from "next/server";
import {
  revokeAuthenticatedTenantSession,
} from "@/lib/nexus/authenticatedTenantSessionRevocation";
import {
  SQLiteAuthenticatedTenantSessionStore,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readMaximumClockSkewMs():
  number {
  const raw =
    process.env
      .NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS ??
    "300000";

  const parsed =
    Number(raw);

  if (
    !Number.isSafeInteger(
      parsed,
    ) ||
    parsed < 0 ||
    parsed > 300_000
  ) {
    throw new Error(
      "NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS must be between 0 and 300000.",
    );
  }

  return parsed;
}

function readBearerToken(
  request: NextRequest,
): string {
  const authorization =
    request.headers.get(
      "authorization",
    ) ?? "";

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    throw new Error(
      "Bearer authenticated session token is required.",
    );
  }

  const token =
    authorization
      .slice(7)
      .trim();

  if (!token) {
    throw new Error(
      "Bearer authenticated session token is required.",
    );
  }

  return token;
}

function authenticationErrorStatus(
  message: string,
): number {
  if (
    message.includes(
      "Bearer authenticated session token",
    ) ||
    message.includes(
      "Authenticated session token",
    ) ||
    message.includes(
      "Authenticated session signing key",
    ) ||
    message.includes(
      "Authenticated session was not found",
    ) ||
    message.includes(
      "Authenticated session has been revoked",
    ) ||
    message.includes(
      "Authenticated session has expired",
    )
  ) {
    return 401;
  }

  if (
    message.includes(
      "System-owner authenticated sessions",
    ) ||
    message.includes(
      "Non-system authenticated sessions",
    )
  ) {
    return 403;
  }

  return 400;
}

export async function POST(
  request: NextRequest,
) {
  if (
    process.env
      .NEXUS_AUTH_SESSION_REVOCATION_ENABLED !==
    "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Authenticated session revocation is disabled by default.",
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 503,
        headers: {
          "cache-control":
            "no-store",
          pragma:
            "no-cache",
        },
      },
    );
  }

  const storageMode =
    process.env
      .NEXUS_CONTROLLED_ACTION_STORAGE
      ?.trim() ?? "file";

  if (
    storageMode !== "sqlite"
  ) {
    return NextResponse.json(
      {
        error:
          "Authenticated session revocation requires SQLite storage mode.",
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 503,
        headers: {
          "cache-control":
            "no-store",
          pragma:
            "no-cache",
        },
      },
    );
  }

  const sessionKeyId =
    process.env
      .NEXUS_AUTH_SESSION_KEY_ID
      ?.trim() ?? "primary";

  const sessionSigningSecret =
    process.env
      .NEXUS_AUTH_SESSION_SIGNING_SECRET
      ?.trim() ?? "";

  if (!sessionSigningSecret) {
    return NextResponse.json(
      {
        error:
          "Authenticated session signing secret is not configured.",
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 503,
        headers: {
          "cache-control":
            "no-store",
          pragma:
            "no-cache",
        },
      },
    );
  }

  const databasePath =
    resolve(
      process.cwd(),
      process.env
        .NEXUS_CONTROLLED_ACTION_SQLITE_PATH ??
        ".nexus-runtime/controlled-action-state.sqlite",
    );

  let sessionStore:
    | SQLiteAuthenticatedTenantSessionStore
    | null = null;

  try {
    const token =
      readBearerToken(
        request,
      );

    const now =
      new Date().toISOString();

    sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        databasePath,
      );

    const result =
      await revokeAuthenticatedTenantSession(
        sessionStore,
        {
          token,
          signingSecrets: {
            [sessionKeyId]:
              sessionSigningSecret,
          },
          now,
          maxClockSkewMs:
            readMaximumClockSkewMs(),
          reason:
            "SELF_LOGOUT",
        },
      );

    return NextResponse.json(
      {
        revoked:
          result.revoked,
        revokedAt:
          result.revokedAt,
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 200,
        headers: {
          "cache-control":
            "no-store",
          pragma:
            "no-cache",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown authenticated session revocation failure.";

    return NextResponse.json(
      {
        error:
          authenticationErrorStatus(
            message,
          ) === 401
            ? "Authentication failed."
            : message,
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status:
          authenticationErrorStatus(
            message,
          ),
        headers: {
          "cache-control":
            "no-store",
          pragma:
            "no-cache",
        },
      },
    );
  } finally {
    sessionStore?.close();
  }
}
