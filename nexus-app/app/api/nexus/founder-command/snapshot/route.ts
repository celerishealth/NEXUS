import {
  randomUUID,
} from "node:crypto";
import {
  NextResponse,
} from "next/server";

import {
  ControlledActionCommandGateway,
  type ControlledActionGatewayResponse,
  type TenantControlledActionSnapshot,
} from "@/lib/nexus/controlledActionCommandGateway";
import {
  resolveControlledActionSQLiteRuntimePath,
} from "@/lib/nexus/controlledActionSQLiteRuntimePath";
import {
  PersistentControlledActionVerticalSlice,
} from "@/lib/nexus/persistentControlledActionVerticalSlice";
import {
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";
import {
  SQLiteControlledActionStateRepository,
} from "@/lib/nexus/sqliteControlledActionStateRepository";

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

  const token =
    match[1]?.trim() ?? "";

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

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function assertSafeSnapshotResponse(
  response: ControlledActionGatewayResponse,
  tenantId: string,
  actorId: string,
): asserts response is ControlledActionGatewayResponse<TenantControlledActionSnapshot> {
  if (
    response.tenantId !== tenantId ||
    response.actorId !== actorId ||
    response.commandType !==
      "read_tenant_snapshot" ||
    response.executionBoundary !==
      "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION" ||
    response.liveProviderExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Founder command snapshot response boundary is invalid.",
    );
  }

  const snapshot = response.result;

  if (
    !isRecord(snapshot) ||
    !Number.isInteger(snapshot.revision) ||
    !isRecord(snapshot.killSwitch) ||
    !isRecord(snapshot.actions) ||
    !isRecord(snapshot.outbox) ||
    !Array.isArray(snapshot.audit)
  ) {
    throw new Error(
      "Founder command snapshot response is invalid.",
    );
  }
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
      .NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID
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
            "Founder command authentication is not configured.",
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
        resolveControlledActionSQLiteRuntimePath(
          process.env
            .NEXUS_CONTROLLED_ACTION_SQLITE_PATH,
        ),
      );

    await sessionStore
      .assertActiveSession(
        claims,
        now,
      );

    if (
      claims.role !== "owner" ||
      claims.actorId !==
        allowedOwnerActorId
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
  if (
    process.env
      .NEXUS_FOUNDER_COMMAND_SNAPSHOT_ENABLED
      ?.trim()
      .toLowerCase() !== "true"
  ) {
    return json(
      {
        error:
          "Founder command snapshot is disabled by default.",
      },
      503,
    );
  }

  if (
    process.env
      .NEXUS_CONTROLLED_ACTION_STORAGE
      ?.trim()
      .toLowerCase() !== "sqlite"
  ) {
    return json(
      {
        error:
          "Founder command snapshot requires SQLite storage mode.",
      },
      503,
    );
  }

  const authentication =
    await authenticateFounder(request);

  if (!authentication.ok) {
    return authentication.response;
  }

  const repository =
    new SQLiteControlledActionStateRepository(
      resolveControlledActionSQLiteRuntimePath(
        process.env
          .NEXUS_CONTROLLED_ACTION_SQLITE_PATH,
      ),
    );

  try {
    const gateway =
      new ControlledActionCommandGateway(
        new PersistentControlledActionVerticalSlice(
          repository,
        ),
      );

    const response =
      await gateway.execute(
        {
          tenantId:
            authentication.tenantId,
          actorId:
            authentication.actorId,
          role: "owner",
          requestId:
            randomUUID(),
        },
        {
          type:
            "read_tenant_snapshot",
        },
      );

    assertSafeSnapshotResponse(
      response,
      authentication.tenantId,
      authentication.actorId,
    );

    return json(
      {
        schemaVersion:
          "nexus-founder-command-snapshot-v1",
        tenantId:
          authentication.tenantId,
        ownerActorId:
          authentication.actorId,
        requestId:
          response.requestId,
        executionBoundary:
          response.executionBoundary,
        snapshot:
          response.result,
      },
      200,
    );
  } catch {
    return json(
      {
        error:
          "Founder command snapshot could not be safely verified.",
      },
      503,
    );
  } finally {
    repository.close();
  }
}
