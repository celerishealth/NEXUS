import {
  resolve,
} from "node:path";
import {
  NextRequest,
  NextResponse,
} from "next/server";
import {
  AuthenticatedCredentialRotationError,
  rotateAuthenticatedPrincipalCredentialAndRevokeSessions,
} from "@/lib/nexus/authenticatedPrincipalCredentialRotation";
import {
  assertAuthenticatedSessionMatchesGatewayContext,
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PasswordChangeBody {
  currentPassword: string;
  newPassword: string;
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
    value.length === 0
  ) {
    throw new Error(
      `${fieldName} is required.`,
    );
  }

  return value;
}

function parseBody(
  value: unknown,
): PasswordChangeBody {
  if (!isRecord(value)) {
    throw new Error(
      "Password-change request body must be an object.",
    );
  }

  return {
    currentPassword:
      readBodyString(
        value,
        "currentPassword",
      ),
    newPassword:
      readBodyString(
        value,
        "newPassword",
      ),
  };
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
    throw new AuthenticatedCredentialRotationError();
  }

  const token =
    authorization
      .slice(7)
      .trim();

  if (!token) {
    throw new AuthenticatedCredentialRotationError();
  }

  return token;
}

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

export async function POST(
  request: NextRequest,
) {
  if (
    process.env
      .NEXUS_AUTH_PASSWORD_CHANGE_ENABLED !==
    "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Authenticated password change is disabled by default.",
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
          "Authenticated password change requires SQLite storage mode.",
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
    const body =
      parseBody(
        await request.json(),
      );

    const token =
      readBearerToken(
        request,
      );

    const changedAt =
      new Date().toISOString();

    const claims =
      verifyAuthenticatedTenantSessionToken(
        token,
        {
          [sessionKeyId]:
            sessionSigningSecret,
        },
        {
          now:
            changedAt,
          maxClockSkewMs:
            readMaximumClockSkewMs(),
        },
      );

    assertAuthenticatedSessionMatchesGatewayContext(
      claims,
      {
        tenantId:
          claims.tenantId,
        actorId:
          claims.actorId,
        role:
          claims.role,
      },
    );

    sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        databasePath,
      );

    await sessionStore.assertActiveSession(
      claims,
      changedAt,
    );

    sessionStore.close();
    sessionStore = null;

    const result =
      await rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
        databasePath,
        claims,
        currentPassword:
          body.currentPassword,
        newPassword:
          body.newPassword,
        changedAt,
      });

    return NextResponse.json(
      {
        passwordChanged:
          result.passwordChanged,
        sessionsRevoked:
          result.sessionsRevoked,
        credentialVersion:
          result.credentialVersion,
        reauthenticationRequired:
          result.reauthenticationRequired,
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
    const isAuthenticationFailure =
      error instanceof
        AuthenticatedCredentialRotationError ||
      (
        error instanceof Error &&
        (
          error.message.includes(
            "Authenticated session",
          ) ||
          error.message.includes(
            "Credential rotation failed",
          )
        )
      );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown credential-rotation failure.";

    return NextResponse.json(
      {
        error:
          isAuthenticationFailure
            ? "Authentication failed."
            : message,
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status:
          isAuthenticationFailure
            ? 401
            : 400,
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
