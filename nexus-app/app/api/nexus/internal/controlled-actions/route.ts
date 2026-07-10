import { resolve } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  ControlledActionCommandGateway,
} from "@/lib/nexus/controlledActionCommandGateway";
import {
  ControlledActionCommandReadinessGate,
} from "@/lib/nexus/controlledActionCommandReadinessGate";
import {
  DurableSignedGatewayOutcomeJournal,
  type GatewayJournalJsonValue,
} from "@/lib/nexus/durableSignedGatewayOutcomeJournal";
import {
  PersistentControlledActionVerticalSlice,
} from "@/lib/nexus/persistentControlledActionVerticalSlice";
import {
  SQLiteControlledActionStateRepository,
} from "@/lib/nexus/sqliteControlledActionStateRepository";
import {
  SQLiteSignedGatewayRequestStore,
} from "@/lib/nexus/sqliteSignedGatewayRequestStore";
import {
  assertAuthenticatedSessionMatchesGatewayContext,
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} from "@/lib/nexus/sqliteAuthenticatedTenantSessionStore";
import {
  calculateGatewayReplayExpiry,
  PersistentControlledActionGatewayReplayGuard,
  verifySignedControlledActionGatewayEnvelope,
} from "@/lib/nexus/signedControlledActionGatewayEnvelope";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const actionStatePath = resolve(
  process.cwd(),
  process.env.NEXUS_CONTROLLED_ACTION_STATE_PATH ??
    ".nexus-runtime/controlled-action-state.json",
);

const controlledActionStorageMode =
  process.env.NEXUS_CONTROLLED_ACTION_STORAGE?.trim() ??
  "file";

const sqliteDatabasePath = resolve(
  process.cwd(),
  process.env.NEXUS_CONTROLLED_ACTION_SQLITE_PATH ??
    ".nexus-runtime/controlled-action-state.sqlite",
);

function createControlledActionEngine() {
  if (controlledActionStorageMode === "sqlite") {
    return new PersistentControlledActionVerticalSlice(
      new SQLiteControlledActionStateRepository(
        sqliteDatabasePath,
      ),
    );
  }

  if (controlledActionStorageMode === "file") {
    return new PersistentControlledActionVerticalSlice(
      actionStatePath,
    );
  }

  throw new Error(
    "NEXUS_CONTROLLED_ACTION_STORAGE must be file or sqlite.",
  );
}

const replayStatePath = resolve(
  process.cwd(),
  process.env.NEXUS_GATEWAY_REPLAY_STATE_PATH ??
    ".nexus-runtime/controlled-action-gateway-replay.json",
);

const outcomeJournalPath = resolve(
  process.cwd(),
  process.env.NEXUS_GATEWAY_OUTCOME_JOURNAL_PATH ??
    ".nexus-runtime/controlled-action-gateway-outcomes.json",
);

const gateway = new ControlledActionCommandGateway(
  createControlledActionEngine(),
);

const sqliteSignedGatewayStore =
  controlledActionStorageMode === "sqlite"
    ? new SQLiteSignedGatewayRequestStore(
        sqliteDatabasePath,
      )
    : null;

const replayGuard =
  sqliteSignedGatewayStore ??
  new PersistentControlledActionGatewayReplayGuard(
    replayStatePath,
  );

const outcomeJournal =
  sqliteSignedGatewayStore ??
  new DurableSignedGatewayOutcomeJournal(
    outcomeJournalPath,
  );

function readBooleanEnvironment(
  value: string | undefined,
  defaultValue: boolean,
  fieldName: string,
): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(
    `${fieldName} must be true or false.`,
  );
}

function readBackupAgeMs(): number {
  const rawValue =
    process.env
      .NEXUS_CONTROLLED_ACTION_MAX_BACKUP_AGE_MS ??
    "604800000";

  const parsedValue =
    Number(rawValue);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 60_000 ||
    parsedValue >
      31 * 24 * 60 * 60 * 1000
  ) {
    throw new Error(
      "NEXUS_CONTROLLED_ACTION_MAX_BACKUP_AGE_MS must be between 60000 and 2678400000.",
    );
  }

  return parsedValue;
}

function createCommandReadinessGate():
  ControlledActionCommandReadinessGate {
  const backupDatabasePath =
    process.env
      .NEXUS_CONTROLLED_ACTION_BACKUP_SQLITE_PATH
      ? resolve(
          process.cwd(),
          process.env
            .NEXUS_CONTROLLED_ACTION_BACKUP_SQLITE_PATH,
        )
      : undefined;

  const backupManifestPath =
    process.env
      .NEXUS_CONTROLLED_ACTION_BACKUP_MANIFEST_PATH
      ? resolve(
          process.cwd(),
          process.env
            .NEXUS_CONTROLLED_ACTION_BACKUP_MANIFEST_PATH,
        )
      : undefined;

  return new ControlledActionCommandReadinessGate({
    storageMode:
      controlledActionStorageMode,
    databasePath:
      sqliteDatabasePath,
    requireVerifiedBackup:
      readBooleanEnvironment(
        process.env
          .NEXUS_CONTROLLED_ACTION_REQUIRE_VERIFIED_BACKUP,
        true,
        "NEXUS_CONTROLLED_ACTION_REQUIRE_VERIFIED_BACKUP",
      ),
    backupDatabasePath,
    backupManifestPath,
    maxBackupAgeMs:
      readBackupAgeMs(),
  });
}

function readClockSkewMs(): number {
  const rawValue =
    process.env.NEXUS_GATEWAY_MAX_CLOCK_SKEW_MS ??
    "300000";

  const parsedValue = Number(rawValue);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 1 ||
    parsedValue > 900_000
  ) {
    throw new Error(
      "NEXUS_GATEWAY_MAX_CLOCK_SKEW_MS must be between 1 and 900000.",
    );
  }

  return parsedValue;
}

function errorStatus(message: string): number {
  if (
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
      "Authenticated session tenant does not match",
    ) ||
    message.includes(
      "Authenticated session actor does not match",
    ) ||
    message.includes(
      "Authenticated session role does not match",
    ) ||
    message.includes(
      "system tenant context",
    )
  ) {
    return 403;
  }

  if (
    message.includes(
      "operational readiness gate is closed",
    ) ||
    message.includes(
      "unsafe provider-execution boundary",
    )
  ) {
    return 503;
  }

  if (
    message.includes("signature") ||
    message.includes("key is unknown") ||
    message.includes("envelope is stale") ||
    message.includes("issued too far")
  ) {
    return 401;
  }

  if (
    message.includes("replay") ||
    message.includes("nonce conflicts") ||
    message.includes("in progress")
  ) {
    return 409;
  }

  if (
    message.includes("not permitted") ||
    message.includes("tenant mismatch") ||
    message.includes("authenticated actor") ||
    message.includes("system tenant context")
  ) {
    return 403;
  }

  return 400;
}

function errorBody(
  message: string,
): GatewayJournalJsonValue {
  return {
    error: message,
    liveProviderExecutionAuthorized: false,
  };
}

export async function POST(request: NextRequest) {
  if (
    process.env
      .NEXUS_CONTROLLED_ACTION_GATEWAY_ENABLED !==
    "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Controlled-action command gateway is disabled by default.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  const keyId =
    process.env.NEXUS_INTERNAL_GATEWAY_KEY_ID?.trim() ??
    "primary";

  const signingSecret =
    process.env
      .NEXUS_INTERNAL_GATEWAY_SIGNING_SECRET?.trim() ??
    "";

  const sessionKeyId =
    process.env
      .NEXUS_AUTH_SESSION_KEY_ID?.trim() ??
    "primary";

  const sessionSigningSecret =
    process.env
      .NEXUS_AUTH_SESSION_SIGNING_SECRET?.trim() ??
    "";

  if (!signingSecret) {
    return NextResponse.json(
      {
        error:
          "Internal gateway signing secret is not configured.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  if (!sessionSigningSecret) {
    return NextResponse.json(
      {
        error:
          "Authenticated session signing secret is not configured.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  if (
    controlledActionStorageMode !==
    "sqlite"
  ) {
    return NextResponse.json(
      {
        error:
          "Authenticated command gateway requires SQLite storage mode.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  try {
    const maxClockSkewMs = readClockSkewMs();
    const now = new Date().toISOString();
    const rawEnvelope: unknown =
      await request.json();

    const envelope =
      verifySignedControlledActionGatewayEnvelope(
        rawEnvelope,
        {
          [keyId]: signingSecret,
        },
        {
          now,
          maxClockSkewMs,
        },
      );

    const authorization =
      request.headers.get(
        "authorization",
      ) ?? "";

    const sessionToken =
      authorization.startsWith(
        "Bearer ",
      )
        ? authorization
            .slice(7)
            .trim()
        : "";

    const sessionClaims =
      verifyAuthenticatedTenantSessionToken(
        sessionToken,
        {
          [sessionKeyId]:
            sessionSigningSecret,
        },
        {
          now,
          maxClockSkewMs,
        },
      );

    const sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        sqliteDatabasePath,
      );

    try {
      await sessionStore.assertActiveSession(
        sessionClaims,
        now,
      );
    } finally {
      sessionStore.close();
    }

    assertAuthenticatedSessionMatchesGatewayContext(
      sessionClaims,
      envelope.context,
    );

    const enforceReadiness =
      readBooleanEnvironment(
        process.env
          .NEXUS_CONTROLLED_ACTION_ENFORCE_READINESS,
        true,
        "NEXUS_CONTROLLED_ACTION_ENFORCE_READINESS",
      );

    if (enforceReadiness) {
      const readinessGate =
        createCommandReadinessGate();

      await readinessGate.assertOpen({
        now,
      });
    }

    const replayExpiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        maxClockSkewMs,
      );

    const journalResult = await outcomeJournal.begin(
      envelope,
      now,
      replayExpiresAt,
    );

    if (journalResult.disposition === "replay") {
      return NextResponse.json(
        journalResult.entry.responseBody,
        {
          status:
            journalResult.entry.httpStatus ?? 500,
          headers: {
            "cache-control": "no-store",
            "x-nexus-replayed-response": "true",
          },
        },
      );
    }

    if (
      journalResult.disposition === "in_progress"
    ) {
      return NextResponse.json(
        {
          error:
            "Signed gateway request is already in progress.",
          liveProviderExecutionAuthorized: false,
        },
        {
          status: 409,
          headers: {
            "cache-control": "no-store",
          },
        },
      );
    }

    const reserved = await replayGuard.reserve(
      envelope.keyId,
      envelope.nonce,
      now,
      replayExpiresAt,
    );

    if (!reserved) {
      const body = errorBody(
        "Signed gateway request replay detected.",
      );

      await outcomeJournal.finish(
        envelope.keyId,
        envelope.nonce,
        envelope.signature,
        "failed",
        new Date().toISOString(),
        409,
        body,
      );

      return NextResponse.json(body, {
        status: 409,
        headers: {
          "cache-control": "no-store",
        },
      });
    }

    try {
      const response = await gateway.execute(
        envelope.context,
        envelope.command,
      );

      await outcomeJournal.finish(
        envelope.keyId,
        envelope.nonce,
        envelope.signature,
        "completed",
        new Date().toISOString(),
        200,
        response,
      );

      return NextResponse.json(response, {
        status: 200,
        headers: {
          "cache-control": "no-store",
        },
      });
    } catch (commandError) {
      const message =
        commandError instanceof Error
          ? commandError.message
          : "Unknown controlled-action command failure.";

      const status = errorStatus(message);
      const body = errorBody(message);

      await outcomeJournal.finish(
        envelope.keyId,
        envelope.nonce,
        envelope.signature,
        "failed",
        new Date().toISOString(),
        status,
        body,
      );

      return NextResponse.json(body, {
        status,
        headers: {
          "cache-control": "no-store",
        },
      });
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown signed gateway failure.";

    return NextResponse.json(
      {
        error: message,
        liveProviderExecutionAuthorized: false,
      },
      {
        status: errorStatus(message),
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }
}




