import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revokePostgresAuthenticatedOwnerSession,
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

export async function POST(
  request: NextRequest,
) {
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
      .NEXUS_CONTROLLED_ACTION_STORAGE
      ?.trim() ?? "file";

  if (storageMode !== "postgres") {
    return disabledResponse(
      "PostgreSQL authenticated owner access requires postgres storage mode.",
    );
  }

  const result =
    await revokePostgresAuthenticatedOwnerSession(
      {
        headers:
          readHeaders(
            request,
          ),
      },
      createPostgresAuthenticatedOwnerAuthRuntime(),
    );

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
