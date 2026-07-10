import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  createReadStream,
} from "node:fs";
import {
  copyFile,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import {
  basename,
  dirname,
  resolve,
} from "node:path";
import {
  SQLiteControlledActionStateRepository,
} from "./sqliteControlledActionStateRepository";
import {
  SQLiteSignedGatewayRequestStore,
} from "./sqliteSignedGatewayRequestStore";

interface SQLiteStatement {
  get(
    ...parameters: unknown[]
  ): Record<string, unknown> | undefined;
}

interface SQLiteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SQLiteStatement;
  close(): void;
}

interface SQLiteModule {
  DatabaseSync: new (
    path: string,
  ) => SQLiteDatabase;
}

export interface SQLiteBackupManifest {
  manifestVersion: 1;
  backupId: string;
  reason: string;
  createdAt: string;
  sourceDatabaseName: string;
  backupDatabaseName: string;
  databaseSha256: string;
  databaseBytes: number;
  actionSchemaVersion: number;
  actionRevision: number;
  projectionRevision: number;
  gatewayOutcomeCount: number;
  gatewayReplayCount: number;
  journalMode: string;
  integrityCheck: string;
}

export interface CreateSQLiteBackupRequest {
  sourceDatabasePath: string;
  backupDatabasePath: string;
  manifestPath: string;
  backupId: string;
  reason: string;
  createdAt: string;
  allowOverwrite?: boolean;
}

export interface VerifySQLiteBackupRequest {
  backupDatabasePath: string;
  manifestPath: string;
}

export interface RestoreSQLiteBackupRequest
  extends VerifySQLiteBackupRequest {
  targetDatabasePath: string;
  allowOverwrite?: boolean;
}

interface DatabaseInspection {
  actionSchemaVersion: number;
  actionRevision: number;
  projectionRevision: number;
  gatewayOutcomeCount: number;
  gatewayReplayCount: number;
  journalMode: string;
  integrityCheck: string;
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

function requireTimestamp(
  value: string,
  fieldName: string,
): string {
  const normalized =
    requireNonEmpty(value, fieldName);

  if (
    !Number.isFinite(
      Date.parse(normalized),
    )
  ) {
    throw new Error(
      `${fieldName} must be a valid timestamp.`,
    );
  }

  return normalized;
}

function loadSQLiteModule(): SQLiteModule {
  try {
    const runtimeRequire =
      eval("require") as NodeRequire;

    return runtimeRequire(
      "node:" + "sqlite",
    ) as SQLiteModule;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown SQLite runtime failure.";

    throw new Error(
      `Node SQLite runtime is unavailable: ${message}`,
    );
  }
}

function readString(
  row: Record<string, unknown> | undefined,
  fieldName: string,
): string {
  const value = row?.[fieldName];

  if (typeof value !== "string") {
    throw new Error(
      `SQLite field ${fieldName} is missing or invalid.`,
    );
  }

  return value;
}

function normalizePath(
  value: string,
  fieldName: string,
): string {
  return resolve(
    requireNonEmpty(value, fieldName),
  );
}

function comparablePath(
  value: string,
): string {
  const normalized = resolve(value);

  return process.platform === "win32"
    ? normalized.toLowerCase()
    : normalized;
}

function assertDifferentPaths(
  left: string,
  right: string,
  message: string,
): void {
  if (
    comparablePath(left) ===
    comparablePath(right)
  ) {
    throw new Error(message);
  }
}

async function pathExists(
  value: string,
): Promise<boolean> {
  try {
    await stat(value);
    return true;
  } catch (error) {
    if (
      (
        error as NodeJS.ErrnoException
      ).code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
}

function quoteSQLiteString(
  value: string,
): string {
  return `'${value.replaceAll("'", "''")}'`;
}

async function sha256File(
  filePath: string,
): Promise<string> {
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  await new Promise<void>(
    (resolvePromise, rejectPromise) => {
      stream.on("data", (chunk) => {
        hash.update(chunk);
      });

      stream.on("error", rejectPromise);
      stream.on("end", resolvePromise);
    },
  );

  return hash.digest("hex");
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

function parseManifest(
  raw: string,
): SQLiteBackupManifest {
  const parsed: unknown =
    JSON.parse(raw);

  if (!isRecord(parsed)) {
    throw new Error(
      "SQLite backup manifest must be an object.",
    );
  }

  if (parsed.manifestVersion !== 1) {
    throw new Error(
      "Unsupported SQLite backup manifest version.",
    );
  }

  const stringFields = [
    "backupId",
    "reason",
    "createdAt",
    "sourceDatabaseName",
    "backupDatabaseName",
    "databaseSha256",
    "journalMode",
    "integrityCheck",
  ] as const;

  for (const fieldName of stringFields) {
    if (
      typeof parsed[fieldName] !==
        "string" ||
      parsed[fieldName].trim().length === 0
    ) {
      throw new Error(
        `SQLite backup manifest field ${fieldName} is invalid.`,
      );
    }
  }

  const integerFields = [
    "databaseBytes",
    "actionSchemaVersion",
    "actionRevision",
    "projectionRevision",
    "gatewayOutcomeCount",
    "gatewayReplayCount",
  ] as const;

  for (const fieldName of integerFields) {
    const value = parsed[fieldName];

    if (
      typeof value !== "number" ||
      !Number.isSafeInteger(value) ||
      value < 0
    ) {
      throw new Error(
        `SQLite backup manifest field ${fieldName} is invalid.`,
      );
    }
  }

  if (
    !/^[a-f0-9]{64}$/i.test(
      parsed.databaseSha256 as string,
    )
  ) {
    throw new Error(
      "SQLite backup manifest SHA-256 is invalid.",
    );
  }

  requireTimestamp(
    parsed.createdAt as string,
    "SQLite backup manifest createdAt",
  );

  return parsed as unknown as SQLiteBackupManifest;
}

function compareInspectionToManifest(
  inspection: DatabaseInspection,
  manifest: SQLiteBackupManifest,
): void {
  if (
    inspection.actionSchemaVersion !==
    manifest.actionSchemaVersion
  ) {
    throw new Error(
      "SQLite backup action schema version does not match its manifest.",
    );
  }

  if (
    inspection.actionRevision !==
    manifest.actionRevision
  ) {
    throw new Error(
      "SQLite backup action revision does not match its manifest.",
    );
  }

  if (
    inspection.projectionRevision !==
    manifest.projectionRevision
  ) {
    throw new Error(
      "SQLite backup projection revision does not match its manifest.",
    );
  }

  if (
    inspection.gatewayOutcomeCount !==
    manifest.gatewayOutcomeCount
  ) {
    throw new Error(
      "SQLite backup gateway outcome count does not match its manifest.",
    );
  }

  if (
    inspection.gatewayReplayCount !==
    manifest.gatewayReplayCount
  ) {
    throw new Error(
      "SQLite backup gateway replay count does not match its manifest.",
    );
  }

  if (
    inspection.integrityCheck
      .toLowerCase() !== "ok"
  ) {
    throw new Error(
      "SQLite backup integrity check failed.",
    );
  }
}

async function inspectDatabase(
  databasePath: string,
): Promise<DatabaseInspection> {
  const actionRepository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  let actionSchemaVersion: number;
  let actionRevision: number;
  let projectionRevision: number;
  let actionJournalMode: string;
  let actionIntegrityCheck: string;

  try {
    const verification =
      actionRepository
        .verifyProjectionIntegrity();

    if (!verification.valid) {
      throw new Error(
        `SQLite projection integrity verification failed: ${verification.issues.join(" ")}`,
      );
    }

    const metadata =
      actionRepository.readMetadata();

    actionSchemaVersion =
      metadata.schemaVersion;

    actionRevision =
      metadata.revision;

    projectionRevision =
      verification.projectionRevision ??
      -1;

    actionJournalMode =
      metadata.journalMode;

    actionIntegrityCheck =
      metadata.integrityCheck;
  } finally {
    actionRepository.close();
  }

  const gatewayStore =
    new SQLiteSignedGatewayRequestStore(
      databasePath,
    );

  try {
    const metadata =
      gatewayStore.readMetadata();

    if (
      metadata.integrityCheck
        .toLowerCase() !== "ok"
    ) {
      throw new Error(
        "SQLite signed-gateway integrity check failed.",
      );
    }

    return {
      actionSchemaVersion,
      actionRevision,
      projectionRevision,
      gatewayOutcomeCount:
        metadata.outcomeCount,
      gatewayReplayCount:
        metadata.replayCount,
      journalMode:
        actionJournalMode,
      integrityCheck:
        actionIntegrityCheck,
    };
  } finally {
    gatewayStore.close();
  }
}

async function moveExistingDatabaseAside(
  targetPath: string,
  rollbackPath: string,
): Promise<string[]> {
  const movedPaths: string[] = [];

  for (const suffix of [
    "",
    "-wal",
    "-shm",
  ]) {
    const source = `${targetPath}${suffix}`;

    if (!(await pathExists(source))) {
      continue;
    }

    const destination =
      `${rollbackPath}${suffix}`;

    await rename(source, destination);
    movedPaths.push(suffix);
  }

  return movedPaths;
}

async function restoreMovedDatabase(
  targetPath: string,
  rollbackPath: string,
  movedSuffixes: string[],
): Promise<void> {
  for (const suffix of movedSuffixes) {
    const rollback =
      `${rollbackPath}${suffix}`;

    if (await pathExists(rollback)) {
      await rename(
        rollback,
        `${targetPath}${suffix}`,
      );
    }
  }
}

async function deleteDatabaseFamily(
  databasePath: string,
): Promise<void> {
  await Promise.all(
    ["", "-wal", "-shm"].map(
      (suffix) =>
        rm(`${databasePath}${suffix}`, {
          force: true,
        }),
    ),
  );
}

export class SQLiteOperationalBackupManager {
  async createBackup(
    request: CreateSQLiteBackupRequest,
  ): Promise<SQLiteBackupManifest> {
    const sourceDatabasePath =
      normalizePath(
        request.sourceDatabasePath,
        "SQLite source database path",
      );

    const backupDatabasePath =
      normalizePath(
        request.backupDatabasePath,
        "SQLite backup database path",
      );

    const manifestPath =
      normalizePath(
        request.manifestPath,
        "SQLite backup manifest path",
      );

    const backupId =
      requireNonEmpty(
        request.backupId,
        "SQLite backup ID",
      );

    const reason =
      requireNonEmpty(
        request.reason,
        "SQLite backup reason",
      );

    const createdAt =
      requireTimestamp(
        request.createdAt,
        "SQLite backup createdAt",
      );

    assertDifferentPaths(
      sourceDatabasePath,
      backupDatabasePath,
      "SQLite backup path must differ from the source database path.",
    );

    assertDifferentPaths(
      sourceDatabasePath,
      manifestPath,
      "SQLite manifest path must differ from the source database path.",
    );

    assertDifferentPaths(
      backupDatabasePath,
      manifestPath,
      "SQLite backup database and manifest paths must differ.",
    );

    if (
      !(await pathExists(
        sourceDatabasePath,
      ))
    ) {
      throw new Error(
        "SQLite source database does not exist.",
      );
    }

    if (
      !request.allowOverwrite &&
      (
        (await pathExists(
          backupDatabasePath,
        )) ||
        (await pathExists(
          manifestPath,
        ))
      )
    ) {
      throw new Error(
        "SQLite backup or manifest already exists.",
      );
    }

    const sourceInspection =
      await inspectDatabase(
        sourceDatabasePath,
      );

    if (
      sourceInspection.integrityCheck
        .toLowerCase() !== "ok"
    ) {
      throw new Error(
        "SQLite source integrity check failed.",
      );
    }

    const temporaryBackupPath =
      `${backupDatabasePath}.creating-${randomUUID()}`;

    const temporaryManifestPath =
      `${manifestPath}.creating-${randomUUID()}`;

    await mkdir(
      dirname(backupDatabasePath),
      {
        recursive: true,
      },
    );

    await mkdir(
      dirname(manifestPath),
      {
        recursive: true,
      },
    );

    const { DatabaseSync } =
      loadSQLiteModule();

    const sourceDatabase =
      new DatabaseSync(
        sourceDatabasePath,
      );

    try {
      const integrityRow =
        sourceDatabase
          .prepare(
            "PRAGMA integrity_check",
          )
          .get();

      if (
        readString(
          integrityRow,
          "integrity_check",
        ).toLowerCase() !== "ok"
      ) {
        throw new Error(
          "SQLite source database failed integrity verification before backup.",
        );
      }

      sourceDatabase.exec(
        "PRAGMA wal_checkpoint(TRUNCATE);",
      );

      sourceDatabase.exec(
        `VACUUM INTO ${quoteSQLiteString(
          temporaryBackupPath,
        )};`,
      );
    } finally {
      sourceDatabase.close();
    }

    try {
      const backupInspection =
        await inspectDatabase(
          temporaryBackupPath,
        );

      if (
        backupInspection.actionRevision !==
          sourceInspection.actionRevision ||
        backupInspection.projectionRevision !==
          sourceInspection.projectionRevision ||
        backupInspection.gatewayOutcomeCount !==
          sourceInspection.gatewayOutcomeCount ||
        backupInspection.gatewayReplayCount !==
          sourceInspection.gatewayReplayCount
      ) {
        throw new Error(
          "SQLite backup content does not match the verified source state.",
        );
      }

      const databaseStat =
        await stat(
          temporaryBackupPath,
        );

      const databaseSha256 =
        await sha256File(
          temporaryBackupPath,
        );

      const manifest: SQLiteBackupManifest = {
        manifestVersion: 1,
        backupId,
        reason,
        createdAt,
        sourceDatabaseName:
          basename(sourceDatabasePath),
        backupDatabaseName:
          basename(backupDatabasePath),
        databaseSha256,
        databaseBytes:
          databaseStat.size,
        actionSchemaVersion:
          backupInspection.actionSchemaVersion,
        actionRevision:
          backupInspection.actionRevision,
        projectionRevision:
          backupInspection.projectionRevision,
        gatewayOutcomeCount:
          backupInspection.gatewayOutcomeCount,
        gatewayReplayCount:
          backupInspection.gatewayReplayCount,
        journalMode:
          backupInspection.journalMode,
        integrityCheck:
          backupInspection.integrityCheck,
      };

      await writeFile(
        temporaryManifestPath,
        `${JSON.stringify(
          manifest,
          null,
          2,
        )}\n`,
        {
          encoding: "utf8",
          flag: "wx",
        },
      );

      if (request.allowOverwrite) {
        await deleteDatabaseFamily(
          backupDatabasePath,
        );

        await rm(manifestPath, {
          force: true,
        });
      }

      await rename(
        temporaryBackupPath,
        backupDatabasePath,
      );

      try {
        await rename(
          temporaryManifestPath,
          manifestPath,
        );
      } catch (error) {
        await deleteDatabaseFamily(
          backupDatabasePath,
        );

        throw error;
      }

      return manifest;
    } catch (error) {
      await deleteDatabaseFamily(
        temporaryBackupPath,
      );

      await rm(
        temporaryManifestPath,
        {
          force: true,
        },
      );

      throw error;
    }
  }

  async verifyBackup(
    request: VerifySQLiteBackupRequest,
  ): Promise<SQLiteBackupManifest> {
    const backupDatabasePath =
      normalizePath(
        request.backupDatabasePath,
        "SQLite backup database path",
      );

    const manifestPath =
      normalizePath(
        request.manifestPath,
        "SQLite backup manifest path",
      );

    if (
      !(await pathExists(
        backupDatabasePath,
      ))
    ) {
      throw new Error(
        "SQLite backup database does not exist.",
      );
    }

    if (
      !(await pathExists(
        manifestPath,
      ))
    ) {
      throw new Error(
        "SQLite backup manifest does not exist.",
      );
    }

    const manifest =
      parseManifest(
        await readFile(
          manifestPath,
          "utf8",
        ),
      );

    if (
      manifest.backupDatabaseName !==
      basename(backupDatabasePath)
    ) {
      throw new Error(
        "SQLite backup filename does not match its manifest.",
      );
    }

    const databaseStat =
      await stat(
        backupDatabasePath,
      );

    if (
      databaseStat.size !==
      manifest.databaseBytes
    ) {
      throw new Error(
        "SQLite backup byte size does not match its manifest.",
      );
    }

    const actualSha256 =
      await sha256File(
        backupDatabasePath,
      );

    if (
      actualSha256.toLowerCase() !==
      manifest.databaseSha256.toLowerCase()
    ) {
      throw new Error(
        "SQLite backup SHA-256 verification failed.",
      );
    }

    const inspection =
      await inspectDatabase(
        backupDatabasePath,
      );

    compareInspectionToManifest(
      inspection,
      manifest,
    );

    return manifest;
  }

  async restoreBackup(
    request: RestoreSQLiteBackupRequest,
  ): Promise<SQLiteBackupManifest> {
    const backupDatabasePath =
      normalizePath(
        request.backupDatabasePath,
        "SQLite backup database path",
      );

    const manifestPath =
      normalizePath(
        request.manifestPath,
        "SQLite backup manifest path",
      );

    const targetDatabasePath =
      normalizePath(
        request.targetDatabasePath,
        "SQLite restore target path",
      );

    assertDifferentPaths(
      backupDatabasePath,
      targetDatabasePath,
      "SQLite restore target must differ from the backup database path.",
    );

    assertDifferentPaths(
      manifestPath,
      targetDatabasePath,
      "SQLite restore target must differ from the backup manifest path.",
    );

    const manifest =
      await this.verifyBackup({
        backupDatabasePath,
        manifestPath,
      });

    if (
      !request.allowOverwrite &&
      (
        (await pathExists(
          targetDatabasePath,
        )) ||
        (await pathExists(
          `${targetDatabasePath}-wal`,
        )) ||
        (await pathExists(
          `${targetDatabasePath}-shm`,
        ))
      )
    ) {
      throw new Error(
        "SQLite restore target already exists.",
      );
    }

    await mkdir(
      dirname(targetDatabasePath),
      {
        recursive: true,
      },
    );

    const temporaryTargetPath =
      `${targetDatabasePath}.restoring-${randomUUID()}`;

    const rollbackPath =
      `${targetDatabasePath}.rollback-${randomUUID()}`;

    await copyFile(
      backupDatabasePath,
      temporaryTargetPath,
    );

    let movedSuffixes: string[] = [];

    try {
      const temporaryInspection =
        await inspectDatabase(
          temporaryTargetPath,
        );

      compareInspectionToManifest(
        temporaryInspection,
        manifest,
      );

      if (request.allowOverwrite) {
        movedSuffixes =
          await moveExistingDatabaseAside(
            targetDatabasePath,
            rollbackPath,
          );
      }

      await rename(
        temporaryTargetPath,
        targetDatabasePath,
      );

      const restoredInspection =
        await inspectDatabase(
          targetDatabasePath,
        );

      compareInspectionToManifest(
        restoredInspection,
        manifest,
      );

      await deleteDatabaseFamily(
        rollbackPath,
      );

      return manifest;
    } catch (error) {
      await deleteDatabaseFamily(
        temporaryTargetPath,
      );

      if (
        movedSuffixes.length > 0 &&
        !(await pathExists(
          targetDatabasePath,
        ))
      ) {
        await restoreMovedDatabase(
          targetDatabasePath,
          rollbackPath,
          movedSuffixes,
        );
      }

      throw error;
    }
  }
}
