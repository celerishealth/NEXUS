import {
  randomUUID,
} from "node:crypto";
import {
  resolve,
} from "node:path";
import {
  NextRequest,
  NextResponse,
} from "next/server";
import {
  AuthenticatedPrincipalAuthenticationError,
  AuthenticatedPrincipalLockedError,
  SQLiteAuthenticatedPrincipalStore,
} from "@/lib/nexus/sqliteAuthenticatedPrincipalStore";
import {
  signAuthenticatedTenantSessionToken,
  SQLiteAuthenticatedTenantSessionStore,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LoginRequestBody {
  tenantId: string;
  email: string;
  password: string;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readBodyString(
  body: Record<string, unknown>,
  fieldName: string,
): string {
  const value =
    body[fieldName];

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      `${fieldName} is required.`,
    );
  }

  return value;
}

function parseLoginBody(
  value: unknown,
): LoginRequestBody {
  if (!isRecord(value)) {
    throw new Error(
      "Login request body must be an object.",
    );
  }

  return {
    tenantId:
      readBodyString(
        value,
        "tenantId",
      ),
    email:
      readBodyString(
        value,
        "email",
      ),
    password:
      readBodyString(
        value,
        "password",
      ),
  };
}

function readSessionDurationMs():
  number {
  const raw =
    process.env
      .NEXUS_AUTH_SESSION_DURATION_MS ??
    "28800000";

  const parsed =
    Number(raw);

  if (
    !Number.isSafeInteger(
      parsed,
    ) ||
    parsed < 300_000 ||
    parsed >
      24 * 60 * 60 * 1000
  ) {
    throw new Error(
      "NEXUS_AUTH_SESSION_DURATION_MS must be between 300000 and 86400000.",
    );
  }

  return parsed;
}

export async function POST(
  request: NextRequest,
) {
  if (
    process.env
      .NEXUS_AUTH_SESSION_ISSUANCE_ENABLED !==
    "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Authenticated session issuance is disabled by default.",
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 503,
        headers: {
          "cache-control":
            "no-store",
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
          "Authenticated session issuance requires SQLite storage mode.",
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 503,
        headers: {
          "cache-control":
            "no-store",
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

  let principalStore:
    | SQLiteAuthenticatedPrincipalStore
    | null = null;

  let sessionStore:
    | SQLiteAuthenticatedTenantSessionStore
    | null = null;

  try {
    const body =
      parseLoginBody(
        await request.json(),
      );

    const issuedAt =
      new Date();

    const expiresAt =
      new Date(
        issuedAt.getTime() +
          readSessionDurationMs(),
      );

    principalStore =
      new SQLiteAuthenticatedPrincipalStore(
        databasePath,
      );

    const principal =
      await principalStore.authenticate({
        tenantId:
          body.tenantId,
        email:
          body.email,
        password:
          body.password,
        authenticatedAt:
          issuedAt.toISOString(),
      });

    const claims = {
      version: 1 as const,
      keyId:
        sessionKeyId,
      sessionId:
        randomUUID(),
      tenantId:
        principal.tenantId,
      actorId:
        principal.actorId,
      role:
        principal.role,
      issuedAt:
        issuedAt.toISOString(),
      expiresAt:
        expiresAt.toISOString(),
    };

    sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        databasePath,
      );

    await sessionStore.createSession({
      ...claims,
      createdAt:
        issuedAt.toISOString(),
    });

    const accessToken =
      signAuthenticatedTenantSessionToken(
        claims,
        sessionSigningSecret,
      );

    return NextResponse.json(
      {
        tokenType:
          "Bearer",
        accessToken,
        session: {
          sessionId:
            claims.sessionId,
          tenantId:
            claims.tenantId,
          actorId:
            claims.actorId,
          role:
            claims.role,
          issuedAt:
            claims.issuedAt,
          expiresAt:
            claims.expiresAt,
        },
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
        : "Unknown authentication failure.";

    const status =
      error instanceof
        AuthenticatedPrincipalLockedError
        ? 429
        : error instanceof
            AuthenticatedPrincipalAuthenticationError
          ? 401
          : 400;

    return NextResponse.json(
      {
        error:
          status === 401
            ? "Authentication failed."
            : message,
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status,
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
    principalStore?.close();
  }
}
