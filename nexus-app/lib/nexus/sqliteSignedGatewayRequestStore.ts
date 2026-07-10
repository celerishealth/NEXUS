import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type {
  BeginSignedGatewayOutcomeResult,
  GatewayJournalJsonValue,
  SignedGatewayOutcomeJournalEntry,
  SignedGatewayOutcomeStatus,
} from "./durableSignedGatewayOutcomeJournal";
import type {
  SignedControlledActionGatewayEnvelope,
} from "./signedControlledActionGatewayEnvelope";

interface SQLiteRunResult {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}

interface SQLiteStatement {
  get(
    ...parameters: unknown[]
  ): Record<string, unknown> | undefined;

  all(
    ...parameters: unknown[]
  ): Record<string, unknown>[];

  run(
    ...parameters: unknown[]
  ): SQLiteRunResult;
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

export interface SQLiteSignedGatewayStoreSnapshot {
  outcomes: SignedGatewayOutcomeJournalEntry[];
  replayEntries: Array<{
    keyId: string;
    nonce: string;
    reservedAt: string;
    expiresAt: string;
  }>;
}

export interface SQLiteSignedGatewayStoreMetadata {
  outcomeCount: number;
  replayCount: number;
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

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isJsonValue(
  value: unknown,
): value is GatewayJournalJsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (isRecord(value)) {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

function normalizeJsonValue(
  value: unknown,
): GatewayJournalJsonValue {
  const serialized = JSON.stringify(value);

  if (serialized === undefined) {
    throw new Error(
      "Gateway outcome response is not JSON serializable.",
    );
  }

  const parsed: unknown = JSON.parse(serialized);

  if (!isJsonValue(parsed)) {
    throw new Error(
      "Gateway outcome response is not valid JSON.",
    );
  }

  return parsed;
}

function stableStringify(
  value: GatewayJournalJsonValue,
): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map(stableStringify)
      .join(",")}]`;
  }

  const keys = Object.keys(value).sort();

  return `{${keys
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stableStringify(
          value[key],
        )}`,
    )
    .join(",")}}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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

function readInteger(
  row: Record<string, unknown> | undefined,
  fieldName: string,
): number {
  const value = row?.[fieldName];

  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value)
  ) {
    throw new Error(
      `SQLite field ${fieldName} is missing or invalid.`,
    );
  }

  return value;
}

function readNullableString(
  row: Record<string, unknown>,
  fieldName: string,
): string | null {
  const value = row[fieldName];

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(
      `SQLite field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function readNullableInteger(
  row: Record<string, unknown>,
  fieldName: string,
): number | null {
  const value = row[fieldName];

  if (value === null) {
    return null;
  }

  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value)
  ) {
    throw new Error(
      `SQLite field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function parseOutcomeRow(
  row: Record<string, unknown>,
): SignedGatewayOutcomeJournalEntry {
  const statusValue = readString(
    row,
    "status",
  );

  if (
    statusValue !== "in_progress" &&
    statusValue !== "completed" &&
    statusValue !== "failed"
  ) {
    throw new Error(
      "SQLite gateway outcome status is invalid.",
    );
  }

  const responseJson = readNullableString(
    row,
    "response_json",
  );

  let responseBody:
    | GatewayJournalJsonValue
    | null = null;

  if (responseJson !== null) {
    const parsed: unknown =
      JSON.parse(responseJson);

    if (!isJsonValue(parsed)) {
      throw new Error(
        "SQLite gateway outcome response is invalid.",
      );
    }

    responseBody = parsed;
  }

  return {
    keyId: readString(row, "key_id"),
    nonce: readString(row, "nonce"),
    signature: readString(
      row,
      "signature",
    ),
    requestId: readString(
      row,
      "request_id",
    ),
    tenantId: readString(
      row,
      "tenant_id",
    ),
    actorId: readString(
      row,
      "actor_id",
    ),
    commandType: readString(
      row,
      "command_type",
    ),
    status: statusValue,
    startedAt: readString(
      row,
      "started_at",
    ),
    expiresAt: readString(
      row,
      "expires_at",
    ),
    completedAt: readNullableString(
      row,
      "completed_at",
    ),
    httpStatus: readNullableInteger(
      row,
      "http_status",
    ),
    responseBody,
  };
}

function outcomeMatchesEnvelope(
  entry: SignedGatewayOutcomeJournalEntry,
  envelope: SignedControlledActionGatewayEnvelope,
): boolean {
  return (
    entry.keyId === envelope.keyId &&
    entry.nonce === envelope.nonce &&
    entry.signature === envelope.signature &&
    entry.requestId ===
      envelope.context.requestId &&
    entry.tenantId ===
      envelope.context.tenantId &&
    entry.actorId ===
      envelope.context.actorId &&
    entry.commandType ===
      envelope.command.type
  );
}

export class SQLiteSignedGatewayRequestStore {
  private readonly database: SQLiteDatabase;
  private closed = false;

  constructor(databasePath: string) {
    const normalizedPath = requireNonEmpty(
      databasePath,
      "SQLite signed-gateway database path",
    );

    mkdirSync(dirname(normalizedPath), {
      recursive: true,
    });

    const { DatabaseSync } =
      loadSQLiteModule();

    this.database =
      new DatabaseSync(normalizedPath);

    this.database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = FULL;
      PRAGMA foreign_keys = ON;
      PRAGMA busy_timeout = 5000;

      CREATE TABLE IF NOT EXISTS nexus_schema_migrations (
        version INTEGER PRIMARY KEY,
        migration_name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS nexus_signed_gateway_outcomes (
        key_id TEXT NOT NULL,
        nonce TEXT NOT NULL,
        signature TEXT NOT NULL,
        request_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        command_type TEXT NOT NULL,
        status TEXT NOT NULL
          CHECK (
            status IN (
              'in_progress',
              'completed',
              'failed'
            )
          ),
        started_at TEXT NOT NULL,
        started_at_ms INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        expires_at_ms INTEGER NOT NULL,
        completed_at TEXT,
        http_status INTEGER,
        response_json TEXT,
        PRIMARY KEY (key_id, nonce),
        CHECK (
          expires_at_ms > started_at_ms
        ),
        CHECK (
          (
            status = 'in_progress'
            AND completed_at IS NULL
            AND http_status IS NULL
            AND response_json IS NULL
          )
          OR
          (
            status IN ('completed', 'failed')
            AND completed_at IS NOT NULL
            AND http_status BETWEEN 100 AND 599
            AND response_json IS NOT NULL
          )
        )
      );

      CREATE INDEX IF NOT EXISTS
        nexus_signed_gateway_outcomes_expiry_idx
      ON nexus_signed_gateway_outcomes (
        expires_at_ms
      );

      CREATE TABLE IF NOT EXISTS nexus_signed_gateway_replay (
        key_id TEXT NOT NULL,
        nonce TEXT NOT NULL,
        reserved_at TEXT NOT NULL,
        reserved_at_ms INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        expires_at_ms INTEGER NOT NULL,
        PRIMARY KEY (key_id, nonce),
        CHECK (
          expires_at_ms > reserved_at_ms
        )
      );

      CREATE INDEX IF NOT EXISTS
        nexus_signed_gateway_replay_expiry_idx
      ON nexus_signed_gateway_replay (
        expires_at_ms
      );
    `);

    this.database
      .prepare(`
        INSERT OR IGNORE INTO nexus_schema_migrations (
          version,
          migration_name,
          applied_at
        )
        VALUES (?, ?, ?)
      `)
      .run(
        2,
        "signed_gateway_replay_and_outcomes_v1",
        new Date().toISOString(),
      );
  }

  async begin(
    envelope: SignedControlledActionGatewayEnvelope,
    startedAt: string,
    expiresAt: string,
  ): Promise<BeginSignedGatewayOutcomeResult> {
    this.ensureOpen();

    const normalizedStartedAt =
      requireNonEmpty(
        startedAt,
        "Gateway outcome startedAt",
      );

    const normalizedExpiresAt =
      requireNonEmpty(
        expiresAt,
        "Gateway outcome expiresAt",
      );

    const startedAtTimestamp =
      parseTimestamp(
        normalizedStartedAt,
        "Gateway outcome startedAt",
      );

    const expiresAtTimestamp =
      parseTimestamp(
        normalizedExpiresAt,
        "Gateway outcome expiresAt",
      );

    if (
      expiresAtTimestamp <=
      startedAtTimestamp
    ) {
      throw new Error(
        "Gateway outcome expiry must be after start time.",
      );
    }

    this.database.exec("BEGIN IMMEDIATE");

    try {
      this.database
        .prepare(`
          DELETE FROM nexus_signed_gateway_outcomes
          WHERE expires_at_ms <= ?
        `)
        .run(startedAtTimestamp);

      const existingRow = this.database
        .prepare(`
          SELECT *
          FROM nexus_signed_gateway_outcomes
          WHERE key_id = ? AND nonce = ?
        `)
        .get(
          envelope.keyId,
          envelope.nonce,
        );

      if (existingRow) {
        const existing =
          parseOutcomeRow(existingRow);

        if (
          !outcomeMatchesEnvelope(
            existing,
            envelope,
          )
        ) {
          throw new Error(
            "Signed gateway nonce conflicts with another durable request.",
          );
        }

        this.database.exec("COMMIT");

        return {
          disposition:
            existing.status ===
            "in_progress"
              ? "in_progress"
              : "replay",
          entry: clone(existing),
        };
      }

      this.database
        .prepare(`
          INSERT INTO nexus_signed_gateway_outcomes (
            key_id,
            nonce,
            signature,
            request_id,
            tenant_id,
            actor_id,
            command_type,
            status,
            started_at,
            started_at_ms,
            expires_at,
            expires_at_ms,
            completed_at,
            http_status,
            response_json
          )
          VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            'in_progress',
            ?, ?, ?, ?,
            NULL, NULL, NULL
          )
        `)
        .run(
          envelope.keyId,
          envelope.nonce,
          envelope.signature,
          envelope.context.requestId,
          envelope.context.tenantId,
          envelope.context.actorId,
          envelope.command.type,
          normalizedStartedAt,
          startedAtTimestamp,
          normalizedExpiresAt,
          expiresAtTimestamp,
        );

      const insertedRow = this.database
        .prepare(`
          SELECT *
          FROM nexus_signed_gateway_outcomes
          WHERE key_id = ? AND nonce = ?
        `)
        .get(
          envelope.keyId,
          envelope.nonce,
        );

      if (!insertedRow) {
        throw new Error(
          "SQLite gateway outcome insert failed.",
        );
      }

      this.database.exec("COMMIT");

      return {
        disposition: "started",
        entry: parseOutcomeRow(
          insertedRow,
        ),
      };
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async finish(
    keyId: string,
    nonce: string,
    signature: string,
    status: Exclude<
      SignedGatewayOutcomeStatus,
      "in_progress"
    >,
    completedAt: string,
    httpStatus: number,
    responseBody: unknown,
  ): Promise<SignedGatewayOutcomeJournalEntry> {
    this.ensureOpen();

    const normalizedKeyId =
      requireNonEmpty(
        keyId,
        "Gateway outcome keyId",
      );

    const normalizedNonce =
      requireNonEmpty(
        nonce,
        "Gateway outcome nonce",
      );

    const normalizedSignature =
      requireNonEmpty(
        signature,
        "Gateway outcome signature",
      );

    parseTimestamp(
      completedAt,
      "Gateway outcome completedAt",
    );

    if (
      !Number.isSafeInteger(httpStatus) ||
      httpStatus < 100 ||
      httpStatus > 599
    ) {
      throw new Error(
        "Gateway outcome HTTP status is invalid.",
      );
    }

    const normalizedBody =
      normalizeJsonValue(responseBody);

    const responseJson =
      JSON.stringify(normalizedBody);

    this.database.exec("BEGIN IMMEDIATE");

    try {
      const existingRow = this.database
        .prepare(`
          SELECT *
          FROM nexus_signed_gateway_outcomes
          WHERE key_id = ? AND nonce = ?
        `)
        .get(
          normalizedKeyId,
          normalizedNonce,
        );

      if (!existingRow) {
        throw new Error(
          "Gateway outcome journal entry was not found.",
        );
      }

      const existing =
        parseOutcomeRow(existingRow);

      if (
        existing.signature !==
        normalizedSignature
      ) {
        throw new Error(
          "Gateway outcome signature does not match the durable request.",
        );
      }

      if (
        existing.status !==
        "in_progress"
      ) {
        const sameOutcome =
          existing.status === status &&
          existing.httpStatus ===
            httpStatus &&
          existing.responseBody !== null &&
          stableStringify(
            existing.responseBody,
          ) ===
            stableStringify(
              normalizedBody,
            );

        if (!sameOutcome) {
          throw new Error(
            "Gateway outcome conflicts with an existing terminal result.",
          );
        }

        this.database.exec("COMMIT");
        return clone(existing);
      }

      const updateResult =
        this.database
          .prepare(`
            UPDATE nexus_signed_gateway_outcomes
            SET
              status = ?,
              completed_at = ?,
              http_status = ?,
              response_json = ?
            WHERE
              key_id = ?
              AND nonce = ?
              AND status = 'in_progress'
          `)
          .run(
            status,
            completedAt,
            httpStatus,
            responseJson,
            normalizedKeyId,
            normalizedNonce,
          );

      if (
        Number(updateResult.changes) !== 1
      ) {
        throw new Error(
          "SQLite gateway outcome finalization conflict.",
        );
      }

      const finishedRow = this.database
        .prepare(`
          SELECT *
          FROM nexus_signed_gateway_outcomes
          WHERE key_id = ? AND nonce = ?
        `)
        .get(
          normalizedKeyId,
          normalizedNonce,
        );

      if (!finishedRow) {
        throw new Error(
          "SQLite gateway outcome final result is missing.",
        );
      }

      this.database.exec("COMMIT");

      return parseOutcomeRow(
        finishedRow,
      );
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async reserve(
    keyId: string,
    nonce: string,
    reservedAt: string,
    expiresAt: string,
  ): Promise<boolean> {
    this.ensureOpen();

    const normalizedKeyId =
      requireNonEmpty(
        keyId,
        "Gateway replay keyId",
      );

    const normalizedNonce =
      requireNonEmpty(
        nonce,
        "Gateway replay nonce",
      );

    const normalizedReservedAt =
      requireNonEmpty(
        reservedAt,
        "Gateway replay reservedAt",
      );

    const normalizedExpiresAt =
      requireNonEmpty(
        expiresAt,
        "Gateway replay expiresAt",
      );

    const reservedAtTimestamp =
      parseTimestamp(
        normalizedReservedAt,
        "Gateway replay reservedAt",
      );

    const expiresAtTimestamp =
      parseTimestamp(
        normalizedExpiresAt,
        "Gateway replay expiresAt",
      );

    if (
      expiresAtTimestamp <=
      reservedAtTimestamp
    ) {
      throw new Error(
        "Gateway replay expiry must be after reservation time.",
      );
    }

    this.database.exec("BEGIN IMMEDIATE");

    try {
      this.database
        .prepare(`
          DELETE FROM nexus_signed_gateway_replay
          WHERE expires_at_ms <= ?
        `)
        .run(reservedAtTimestamp);

      const existing = this.database
        .prepare(`
          SELECT key_id
          FROM nexus_signed_gateway_replay
          WHERE key_id = ? AND nonce = ?
        `)
        .get(
          normalizedKeyId,
          normalizedNonce,
        );

      if (existing) {
        this.database.exec("COMMIT");
        return false;
      }

      this.database
        .prepare(`
          INSERT INTO nexus_signed_gateway_replay (
            key_id,
            nonce,
            reserved_at,
            reserved_at_ms,
            expires_at,
            expires_at_ms
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run(
          normalizedKeyId,
          normalizedNonce,
          normalizedReservedAt,
          reservedAtTimestamp,
          normalizedExpiresAt,
          expiresAtTimestamp,
        );

      this.database.exec("COMMIT");
      return true;
    } catch (error) {
      this.rollbackQuietly();
      throw error;
    }
  }

  async readSnapshot(): Promise<SQLiteSignedGatewayStoreSnapshot> {
    this.ensureOpen();

    const outcomeRows =
      this.database
        .prepare(`
          SELECT *
          FROM nexus_signed_gateway_outcomes
          ORDER BY started_at_ms, key_id, nonce
        `)
        .all();

    const replayRows =
      this.database
        .prepare(`
          SELECT
            key_id,
            nonce,
            reserved_at,
            expires_at
          FROM nexus_signed_gateway_replay
          ORDER BY reserved_at_ms, key_id, nonce
        `)
        .all();

    return {
      outcomes:
        outcomeRows.map(
          parseOutcomeRow,
        ),
      replayEntries:
        replayRows.map((row) => ({
          keyId: readString(
            row,
            "key_id",
          ),
          nonce: readString(
            row,
            "nonce",
          ),
          reservedAt: readString(
            row,
            "reserved_at",
          ),
          expiresAt: readString(
            row,
            "expires_at",
          ),
        })),
    };
  }

  readMetadata(): SQLiteSignedGatewayStoreMetadata {
    this.ensureOpen();

    const outcomeRow =
      this.database
        .prepare(`
          SELECT COUNT(*) AS count
          FROM nexus_signed_gateway_outcomes
        `)
        .get();

    const replayRow =
      this.database
        .prepare(`
          SELECT COUNT(*) AS count
          FROM nexus_signed_gateway_replay
        `)
        .get();

    const journalRow =
      this.database
        .prepare(
          "PRAGMA journal_mode",
        )
        .get();

    const integrityRow =
      this.database
        .prepare(
          "PRAGMA integrity_check",
        )
        .get();

    return {
      outcomeCount: readInteger(
        outcomeRow,
        "count",
      ),
      replayCount: readInteger(
        replayRow,
        "count",
      ),
      journalMode: readString(
        journalRow,
        "journal_mode",
      ),
      integrityCheck: readString(
        integrityRow,
        "integrity_check",
      ),
    };
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.database.close();
    this.closed = true;
  }

  private rollbackQuietly(): void {
    try {
      this.database.exec("ROLLBACK");
    } catch {
      // Original transactional failure remains authoritative.
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "SQLite signed-gateway request store is closed.",
      );
    }
  }
}
