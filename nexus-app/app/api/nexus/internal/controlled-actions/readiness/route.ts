import {
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
  ControlledActionOperationalReadinessService,
} from "@/lib/nexus/controlledActionOperationalReadiness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secureSecretEquals(
  actual: string,
  expected: string,
): boolean {
  const actualBuffer =
    Buffer.from(actual, "utf8");

  const expectedBuffer =
    Buffer.from(expected, "utf8");

  return (
    actualBuffer.length ===
      expectedBuffer.length &&
    timingSafeEqual(
      actualBuffer,
      expectedBuffer,
    )
  );
}

function readBooleanEnvironment(
  value: string | undefined,
  defaultValue: boolean,
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
    "Boolean readiness environment value must be true or false.",
  );
}

function readBackupAgeMs(): number {
  const raw =
    process.env
      .NEXUS_CONTROLLED_ACTION_MAX_BACKUP_AGE_MS ??
    "604800000";

  const parsed =
    Number(raw);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 60_000 ||
    parsed >
      31 * 24 * 60 * 60 * 1000
  ) {
    throw new Error(
      "NEXUS_CONTROLLED_ACTION_MAX_BACKUP_AGE_MS is invalid.",
    );
  }

  return parsed;
}

export async function GET(
  request: NextRequest,
) {
  if (
    process.env
      .NEXUS_CONTROLLED_ACTION_READINESS_ENABLED !==
    "true"
  ) {
    return NextResponse.json(
      {
        ready: false,
        status: "blocked",
        error:
          "Controlled-action readiness probe is disabled by default.",
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }

  const configuredSecret =
    process.env
      .NEXUS_CONTROLLED_ACTION_READINESS_SECRET
      ?.trim() ?? "";

  const authorization =
    request.headers
      .get("authorization") ??
    "";

  const suppliedSecret =
    authorization.startsWith(
      "Bearer ",
    )
      ? authorization
          .slice(7)
          .trim()
      : "";

  if (
    !configuredSecret ||
    !suppliedSecret ||
    !secureSecretEquals(
      suppliedSecret,
      configuredSecret,
    )
  ) {
    return NextResponse.json(
      {
        ready: false,
        status: "blocked",
        error:
          "Readiness probe authentication failed.",
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 401,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }

  try {
    const storageMode =
      process.env
        .NEXUS_CONTROLLED_ACTION_STORAGE
        ?.trim() ?? "file";

    const databasePath =
      resolve(
        process.cwd(),
        process.env
          .NEXUS_CONTROLLED_ACTION_SQLITE_PATH ??
          ".nexus-runtime/controlled-action-state.sqlite",
      );

    const requireVerifiedBackup =
      readBooleanEnvironment(
        process.env
          .NEXUS_CONTROLLED_ACTION_REQUIRE_VERIFIED_BACKUP,
        true,
      );

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

    const service =
      new ControlledActionOperationalReadinessService({
        storageMode,
        databasePath,
        requireVerifiedBackup,
        backupDatabasePath,
        backupManifestPath,
        maxBackupAgeMs:
          readBackupAgeMs(),
      });

    const result =
      await service.evaluate({
        now:
          new Date().toISOString(),
      });

    return NextResponse.json(
      result,
      {
        status:
          result.ready
            ? 200
            : 503,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown readiness verification failure.";

    return NextResponse.json(
      {
        ready: false,
        status: "blocked",
        error: message,
        liveProviderExecutionAuthorized:
          false,
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }
}
