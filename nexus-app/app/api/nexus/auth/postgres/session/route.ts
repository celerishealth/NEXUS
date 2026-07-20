import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  issuePostgresAuthenticatedOwnerSession,
  resolvePostgresAuthenticatedOwnerSession,
} from "@/lib/nexus/postgresAuthenticatedOwnerAuthApi";
import {
  createPostgresAuthenticatedOwnerAuthRuntime,
} from "@/lib/nexus/postgresAuthenticatedOwnerAccessRuntime";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function disabledResponse(
  error: string,
) {
  return NextResponse.json(
    {
      error,
      publicSignupAuthorized:
        false,
      publicLaunchAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      externalDeliveryAuthorized:
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

function readHeaders(
  request: NextRequest,
) {
  return {
    authorization:
      request.headers.get(
        "authorization",
      ) ?? undefined,
    tenantId:
      request.headers.get(
        "x-nexus-tenant-id",
      ) ?? undefined,
    requestId:
      request.headers.get(
        "x-request-id",
      ) ?? undefined,
  };
}

function readSessionTtlSeconds():
  number {
  const raw =
    process.env
      .NEXUS_AUTH_SESSION_DURATION_MS ??
    "28800000";

  const durationMs =
    Number(raw);

  if (
    !Number.isSafeInteger(
      durationMs,
    ) ||
    durationMs < 300_000 ||
    durationMs > 86_400_000
  ) {
    return 0;
  }

  return durationMs / 1000;
}

function respond(
  result: Readonly<{
    status: number;
    body: Readonly<
      Record<string, unknown>
    >;
  }>,
) {
  return NextResponse.json(
    result.body,
    {
      status:
        result.status,
      headers: {
        "cache-control":
          "no-store",
        pragma:
          "no-cache",
      },
    },
  );
}

function assertEnabled() {
  if (
    process.env
      .NEXUS_POSTGRES_AUTH_ENABLED !==
    "true"
  ) {
    return disabledResponse(
      "PostgreSQL authenticated owner access is disabled by default.",
    );
  }

  const storageMode =
    process.env
      .NEXUS_POSTGRES_AUTH_STORAGE_MODE
      ?.trim() ?? "";

  if (storageMode !== "postgres") {
    return disabledResponse(
      "PostgreSQL authenticated owner access requires postgres storage mode.",
    );
  }

  return null;
}

export async function POST(
  request: NextRequest,
) {
  const disabled =
    assertEnabled();

  if (disabled !== null) {
    return disabled;
  }

  let body: unknown =
    null;

  try {
    body =
      await request.json();
  } catch {
    body =
      null;
  }

  const result =
    await issuePostgresAuthenticatedOwnerSession(
      {
        body,
        headers:
          readHeaders(
            request,
          ),
        ttlSeconds:
          readSessionTtlSeconds(),
      },
      createPostgresAuthenticatedOwnerAuthRuntime(),
    );

  return respond(
    result,
  );
}

export async function GET(
  request: NextRequest,
) {
  const disabled =
    assertEnabled();

  if (disabled !== null) {
    return disabled;
  }

  const result =
    await resolvePostgresAuthenticatedOwnerSession(
      {
        headers:
          readHeaders(
            request,
          ),
      },
      createPostgresAuthenticatedOwnerAuthRuntime(),
    );

  return respond(
    result,
  );
}
