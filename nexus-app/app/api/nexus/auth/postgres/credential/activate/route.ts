import {
  createHash,
  timingSafeEqual,
} from "node:crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  activatePostgresAuthenticatedOwnerCredential,
} from "@/lib/nexus/postgresAuthenticatedOwnerAuthApi";
import {
  createPostgresAuthenticatedOwnerAuthRuntime,
} from "@/lib/nexus/postgresAuthenticatedOwnerAccessRuntime";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function blockedResponse(
  error: string,
  status: number,
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
      status,
      headers: {
        "cache-control":
          "no-store",
        pragma:
          "no-cache",
      },
    },
  );
}

function secureSecretEquals(
  supplied: string,
  configured: string,
): boolean {
  const suppliedDigest =
    createHash(
      "sha256",
    )
      .update(
        supplied,
        "utf8",
      )
      .digest();

  const configuredDigest =
    createHash(
      "sha256",
    )
      .update(
        configured,
        "utf8",
      )
      .digest();

  return timingSafeEqual(
    suppliedDigest,
    configuredDigest,
  );
}

function readHeaders(
  request: NextRequest,
) {
  return {
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
      .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_ENABLED !==
    "true"
  ) {
    return blockedResponse(
      "PostgreSQL owner credential activation is disabled by default.",
      503,
    );
  }

  const storageMode =
    process.env
      .NEXUS_POSTGRES_AUTH_STORAGE_MODE
      ?.trim() ?? "";

  if (storageMode !== "postgres") {
    return blockedResponse(
      "PostgreSQL owner credential activation requires postgres storage mode.",
      503,
    );
  }

  const configuredSecret =
    process.env
      .NEXUS_POSTGRES_OWNER_CREDENTIAL_ACTIVATION_SECRET
      ?.trim() ?? "";

  if (!configuredSecret) {
    return blockedResponse(
      "PostgreSQL owner credential activation is not configured.",
      503,
    );
  }

  const suppliedSecret =
    request.headers
      .get(
        "x-nexus-owner-activation-secret",
      )
      ?.trim() ?? "";

  if (
    !suppliedSecret ||
    !secureSecretEquals(
      suppliedSecret,
      configuredSecret,
    )
  ) {
    return blockedResponse(
      "Owner credential activation authorization failed.",
      401,
    );
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
    await activatePostgresAuthenticatedOwnerCredential(
      {
        body,
        headers:
          readHeaders(
            request,
          ),
        ownerApprovalGranted:
          true,
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
