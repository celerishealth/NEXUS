import {
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import {
  resolve,
} from "node:path";
import {
  NextRequest,
  NextResponse,
} from "next/server";
import {
  SQLiteAuthenticatedPrincipalStore,
} from "@/lib/nexus/sqliteAuthenticatedPrincipalStore";
import {
  signAuthenticatedTenantSessionToken,
  SQLiteAuthenticatedTenantSessionStore,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";
import {
  SQLiteTenantOwnerBootstrapStore,
} from "@/lib/nexus/sqliteTenantOwnerBootstrap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TenantOnboardingBody {
  tenantSlug: string;
  tenantDisplayName: string;
  ownerEmail: string;
  ownerPassword: string;
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

function parseBody(
  value: unknown,
): TenantOnboardingBody {
  if (!isRecord(value)) {
    throw new Error(
      "Tenant onboarding request body must be an object.",
    );
  }

  return {
    tenantSlug:
      readBodyString(
        value,
        "tenantSlug",
      ),
    tenantDisplayName:
      readBodyString(
        value,
        "tenantDisplayName",
      ),
    ownerEmail:
      readBodyString(
        value,
        "ownerEmail",
      ),
    ownerPassword:
      readBodyString(
        value,
        "ownerPassword",
      ),
  };
}

function secureSecretEquals(
  supplied: string,
  configured: string,
): boolean {
  const suppliedBuffer =
    Buffer.from(
      supplied,
      "utf8",
    );

  const configuredBuffer =
    Buffer.from(
      configured,
      "utf8",
    );

  return (
    suppliedBuffer.length ===
      configuredBuffer.length &&
    timingSafeEqual(
      suppliedBuffer,
      configuredBuffer,
    )
  );
}

function assertOnboardingAuthorization(
  request: NextRequest,
  configuredSecret: string,
): void {
  const suppliedSecret =
    request.headers
      .get(
        "x-nexus-onboarding-secret",
      )
      ?.trim() ?? "";

  if (
    !suppliedSecret ||
    !secureSecretEquals(
      suppliedSecret,
      configuredSecret,
    )
  ) {
    throw new Error(
      "Tenant onboarding authorization failed.",
    );
  }
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

function errorStatus(
  message: string,
): number {
  if (
    message.includes(
      "authorization failed",
    )
  ) {
    return 401;
  }

  if (
    message.includes(
      "already exists",
    )
  ) {
    return 409;
  }

  return 400;
}

export async function POST(
  request: NextRequest,
) {
  if (
    process.env
      .NEXUS_TENANT_ONBOARDING_ENABLED !==
    "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Tenant onboarding is disabled by default.",
        publicSignupAuthorized:
          false,
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
          "Tenant onboarding requires SQLite storage mode.",
        publicSignupAuthorized:
          false,
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

  const onboardingSecret =
    process.env
      .NEXUS_TENANT_ONBOARDING_SECRET
      ?.trim() ?? "";

  const sessionKeyId =
    process.env
      .NEXUS_AUTH_SESSION_KEY_ID
      ?.trim() ?? "primary";

  const sessionSigningSecret =
    process.env
      .NEXUS_AUTH_SESSION_SIGNING_SECRET
      ?.trim() ?? "";

  if (
    !onboardingSecret ||
    !sessionSigningSecret
  ) {
    return NextResponse.json(
      {
        error:
          "Tenant onboarding security configuration is incomplete.",
        publicSignupAuthorized:
          false,
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

  let bootstrapStore:
    | SQLiteTenantOwnerBootstrapStore
    | null = null;

  try {
    assertOnboardingAuthorization(
      request,
      onboardingSecret,
    );

    const body =
      parseBody(
        await request.json(),
      );

    const createdAt =
      new Date();

    const expiresAt =
      new Date(
        createdAt.getTime() +
          readSessionDurationMs(),
      );

    const tenantId =
      `tenant_${randomUUID()}`;

    const actorId =
      `owner_${randomUUID()}`;

    const principalId =
      `principal_${randomUUID()}`;

    const sessionClaims = {
      version: 1 as const,
      keyId:
        sessionKeyId,
      sessionId:
        randomUUID(),
      tenantId,
      actorId,
      role:
        "owner",
      issuedAt:
        createdAt.toISOString(),
      expiresAt:
        expiresAt.toISOString(),
    };

    const principalSchema =
      new SQLiteAuthenticatedPrincipalStore(
        databasePath,
      );

    principalSchema.close();

    const sessionSchema =
      new SQLiteAuthenticatedTenantSessionStore(
        databasePath,
      );

    sessionSchema.close();

    bootstrapStore =
      new SQLiteTenantOwnerBootstrapStore(
        databasePath,
      );

    const result =
      await bootstrapStore
        .bootstrapTenantOwner({
          tenantId,
          tenantSlug:
            body.tenantSlug,
          tenantDisplayName:
            body.tenantDisplayName,
          principalId,
          actorId,
          ownerEmail:
            body.ownerEmail,
          ownerPassword:
            body.ownerPassword,
          sessionClaims,
          createdAt:
            createdAt.toISOString(),
        });

    const accessToken =
      signAuthenticatedTenantSessionToken(
        sessionClaims,
        sessionSigningSecret,
      );

    return NextResponse.json(
      {
        created:
          true,
        tenant:
          result.tenant,
        owner: {
          actorId:
            result.owner.actorId,
          role:
            result.owner.role,
          email:
            result.owner.emailNormalized,
        },
        session: {
          tokenType:
            "Bearer",
          accessToken,
          sessionId:
            result.session.sessionId,
          issuedAt:
            result.session.issuedAt,
          expiresAt:
            result.session.expiresAt,
        },
        publicSignupAuthorized:
          false,
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 201,
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
        : "Unknown tenant onboarding failure.";

    const status =
      errorStatus(
        message,
      );

    return NextResponse.json(
      {
        error:
          status === 401
            ? "Tenant onboarding authorization failed."
            : message,
        publicSignupAuthorized:
          false,
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
    bootstrapStore?.close();
  }
}
