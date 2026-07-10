import {
  SQLiteControlledActionStateRepository,
} from "./sqliteControlledActionStateRepository";
import {
  SQLiteOperationalBackupManager,
  type SQLiteBackupManifest,
} from "./sqliteOperationalBackupManager";
import {
  SQLiteSignedGatewayRequestStore,
} from "./sqliteSignedGatewayRequestStore";

export type ControlledActionReadinessStatus =
  | "ready"
  | "blocked";

export interface ControlledActionReadinessCheck {
  name: string;
  required: boolean;
  passed: boolean;
  detail: string;
}

export interface ControlledActionOperationalReadinessConfig {
  storageMode: string;
  databasePath: string;
  requireVerifiedBackup: boolean;
  backupDatabasePath?: string;
  backupManifestPath?: string;
  maxBackupAgeMs: number;
}

export interface ControlledActionReadinessRequest {
  now: string;
}

export interface ControlledActionOperationalReadinessResult {
  ready: boolean;
  status: ControlledActionReadinessStatus;
  executionGate:
    | "OPEN_FOR_PERSISTENCE_ONLY_COMMANDS"
    | "CLOSED";
  checkedAt: string;
  storageMode: string;
  databaseRevision: number | null;
  projectionRevision: number | null;
  gatewayOutcomeCount: number | null;
  gatewayReplayCount: number | null;
  killSwitchEngaged: boolean | null;
  verifiedBackupId: string | null;
  checks: ControlledActionReadinessCheck[];
  liveProviderExecutionAuthorized: false;
}

function requireNonEmpty(
  value: string,
  fieldName: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function parseTimestamp(
  value: string,
  fieldName: string,
): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(
      `${fieldName} must be a valid timestamp.`,
    );
  }

  return timestamp;
}

function asRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  return value as Record<string, unknown>;
}

function safeFailureDetail(
  error: unknown,
  fallback: string,
): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const normalized =
    error.message.trim();

  return normalized || fallback;
}

function addCheck(
  checks: ControlledActionReadinessCheck[],
  name: string,
  required: boolean,
  passed: boolean,
  detail: string,
): void {
  checks.push({
    name,
    required,
    passed,
    detail,
  });
}

export class ControlledActionOperationalReadinessService {
  private readonly config:
    ControlledActionOperationalReadinessConfig;

  constructor(
    config: ControlledActionOperationalReadinessConfig,
  ) {
    if (
      !Number.isSafeInteger(
        config.maxBackupAgeMs,
      ) ||
      config.maxBackupAgeMs < 60_000 ||
      config.maxBackupAgeMs >
        31 * 24 * 60 * 60 * 1000
    ) {
      throw new Error(
        "Readiness maxBackupAgeMs must be between 60000 and 2678400000.",
      );
    }

    this.config = {
      ...config,
      storageMode:
        requireNonEmpty(
          config.storageMode,
          "Readiness storage mode",
        ),
      databasePath:
        requireNonEmpty(
          config.databasePath,
          "Readiness database path",
        ),
    };
  }

  async evaluate(
    request: ControlledActionReadinessRequest,
  ): Promise<ControlledActionOperationalReadinessResult> {
    const now = requireNonEmpty(
      request.now,
      "Readiness check time",
    );

    const nowTimestamp =
      parseTimestamp(
        now,
        "Readiness check time",
      );

    const checks:
      ControlledActionReadinessCheck[] = [];

    let databaseRevision:
      | number
      | null = null;

    let projectionRevision:
      | number
      | null = null;

    let gatewayOutcomeCount:
      | number
      | null = null;

    let gatewayReplayCount:
      | number
      | null = null;

    let killSwitchEngaged:
      | boolean
      | null = null;

    let verifiedBackupId:
      | string
      | null = null;

    const sqliteMode =
      this.config.storageMode === "sqlite";

    addCheck(
      checks,
      "sqlite_storage_mode",
      true,
      sqliteMode,
      sqliteMode
        ? "SQLite operational storage mode is active."
        : "Operational readiness requires SQLite storage mode.",
    );

    if (sqliteMode) {
      let repository:
        | SQLiteControlledActionStateRepository
        | null = null;

      try {
        repository =
          new SQLiteControlledActionStateRepository(
            this.config.databasePath,
          );

        const metadata =
          repository.readMetadata();

        const projectionIntegrity =
          repository
            .verifyProjectionIntegrity();

        const projection =
          repository
            .readProjectionSnapshot();

        databaseRevision =
          metadata.revision;

        projectionRevision =
          projectionIntegrity
            .projectionRevision;

        const databaseIntegrityPassed =
          metadata.integrityCheck
            .toLowerCase() === "ok";

        addCheck(
          checks,
          "sqlite_database_integrity",
          true,
          databaseIntegrityPassed,
          databaseIntegrityPassed
            ? "SQLite integrity check passed."
            : "SQLite integrity check failed.",
        );

        addCheck(
          checks,
          "normalized_projection_integrity",
          true,
          projectionIntegrity.valid,
          projectionIntegrity.valid
            ? "Normalized projections match authoritative state."
            : projectionIntegrity.issues.join(" "),
        );

        const killSwitch =
          asRecord(
            projection.killSwitch,
          );

        killSwitchEngaged =
          typeof killSwitch?.engaged ===
          "boolean"
            ? killSwitch.engaged
            : null;

        const killSwitchReadable =
          killSwitchEngaged !== null;

        addCheck(
          checks,
          "kill_switch_state_readable",
          true,
          killSwitchReadable,
          killSwitchReadable
            ? "Operational kill-switch state is readable."
            : "Operational kill-switch state is missing or invalid.",
        );

        addCheck(
          checks,
          "kill_switch_disengaged",
          true,
          killSwitchEngaged === false,
          killSwitchEngaged === false
            ? "Operational kill switch is disengaged."
            : killSwitchEngaged === true
              ? "Operational kill switch is engaged."
              : "Operational kill-switch state cannot be trusted.",
        );
      } catch (error) {
        addCheck(
          checks,
          "sqlite_database_integrity",
          true,
          false,
          safeFailureDetail(
            error,
            "SQLite operational database verification failed.",
          ),
        );

        addCheck(
          checks,
          "normalized_projection_integrity",
          true,
          false,
          "Normalized projection integrity could not be established.",
        );

        addCheck(
          checks,
          "kill_switch_state_readable",
          true,
          false,
          "Operational kill-switch state could not be read.",
        );

        addCheck(
          checks,
          "kill_switch_disengaged",
          true,
          false,
          "Execution remains blocked because kill-switch state is unknown.",
        );
      } finally {
        repository?.close();
      }

      let gatewayStore:
        | SQLiteSignedGatewayRequestStore
        | null = null;

      try {
        gatewayStore =
          new SQLiteSignedGatewayRequestStore(
            this.config.databasePath,
          );

        const gatewayMetadata =
          gatewayStore.readMetadata();

        gatewayOutcomeCount =
          gatewayMetadata.outcomeCount;

        gatewayReplayCount =
          gatewayMetadata.replayCount;

        const gatewayIntegrityPassed =
          gatewayMetadata.integrityCheck
            .toLowerCase() === "ok";

        addCheck(
          checks,
          "signed_gateway_persistence_integrity",
          true,
          gatewayIntegrityPassed,
          gatewayIntegrityPassed
            ? "Signed gateway replay and outcome storage is healthy."
            : "Signed gateway SQLite integrity check failed.",
        );
      } catch (error) {
        addCheck(
          checks,
          "signed_gateway_persistence_integrity",
          true,
          false,
          safeFailureDetail(
            error,
            "Signed gateway persistence verification failed.",
          ),
        );
      } finally {
        gatewayStore?.close();
      }
    }

    await this.evaluateBackupReadiness(
      checks,
      nowTimestamp,
      databaseRevision,
      (manifest) => {
        verifiedBackupId =
          manifest.backupId;
      },
    );

    const ready =
      checks
        .filter(
          (check) => check.required,
        )
        .every(
          (check) => check.passed,
        );

    return {
      ready,
      status:
        ready
          ? "ready"
          : "blocked",
      executionGate:
        ready
          ? "OPEN_FOR_PERSISTENCE_ONLY_COMMANDS"
          : "CLOSED",
      checkedAt: now,
      storageMode:
        this.config.storageMode,
      databaseRevision,
      projectionRevision,
      gatewayOutcomeCount,
      gatewayReplayCount,
      killSwitchEngaged,
      verifiedBackupId,
      checks,
      liveProviderExecutionAuthorized:
        false,
    };
  }

  private async evaluateBackupReadiness(
    checks: ControlledActionReadinessCheck[],
    nowTimestamp: number,
    databaseRevision: number | null,
    onVerified: (
      manifest: SQLiteBackupManifest,
    ) => void,
  ): Promise<void> {
    const required =
      this.config.requireVerifiedBackup;

    const backupDatabasePath =
      this.config.backupDatabasePath
        ?.trim() ?? "";

    const backupManifestPath =
      this.config.backupManifestPath
        ?.trim() ?? "";

    if (
      !backupDatabasePath ||
      !backupManifestPath
    ) {
      addCheck(
        checks,
        "verified_backup_available",
        required,
        !required,
        required
          ? "Verified backup paths are required but not configured."
          : "Verified backup is optional and not configured.",
      );

      return;
    }

    try {
      const manager =
        new SQLiteOperationalBackupManager();

      const manifest =
        await manager.verifyBackup({
          backupDatabasePath,
          manifestPath:
            backupManifestPath,
        });

      const backupTimestamp =
        parseTimestamp(
          manifest.createdAt,
          "Verified backup createdAt",
        );

      const backupAgeMs =
        nowTimestamp -
        backupTimestamp;

      const notTooFarInFuture =
        backupAgeMs >= -300_000;

      const fresh =
        notTooFarInFuture &&
        backupAgeMs <=
          this.config.maxBackupAgeMs;

      const revisionCompatible =
        databaseRevision === null ||
        manifest.actionRevision <=
          databaseRevision;

      const passed =
        fresh &&
        revisionCompatible;

      addCheck(
        checks,
        "verified_backup_available",
        required,
        passed,
        !notTooFarInFuture
          ? "Verified backup timestamp is too far in the future."
          : !fresh
            ? "Verified backup is older than the permitted recovery window."
            : !revisionCompatible
              ? "Verified backup revision is ahead of the active database."
              : "Cryptographically verified backup is available within the recovery window.",
      );

      if (passed) {
        onVerified(manifest);
      }
    } catch (error) {
      addCheck(
        checks,
        "verified_backup_available",
        required,
        false,
        safeFailureDetail(
          error,
          "Verified backup validation failed.",
        ),
      );
    }
  }
}
