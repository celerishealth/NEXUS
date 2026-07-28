import { authenticateFounderCommandRequest } from "@/lib/nexus/founderCommandServerAuthentication";

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
    await authenticateFounderCommandRequest(request);

  if (!authentication.ok) {
    const error =
      authentication.reason === "authentication-not-configured"
        ? "Founder command authentication is not configured."
        : authentication.reason === "owner-authority-required"
          ? "Owner authority is required."
          : "Authentication failed.";

    return json({ error }, authentication.status);
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
