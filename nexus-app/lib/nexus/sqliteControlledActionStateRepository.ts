import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import type {
  ControlledActionStateRepository,
  PersistentControlledActionState,
  TransactionResult,
} from "./persistentControlledActionVerticalSlice";
import {
  createInitialState,
  validateState,
} from "./persistentControlledActionVerticalSlice";

interface SQLiteRunResult {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}

interface SQLiteStatement {
  get(...parameters: unknown[]): Record<string, unknown> | undefined;
  all(...parameters: unknown[]): Record<string, unknown>[];
  run(...parameters: unknown[]): SQLiteRunResult;
}

interface SQLiteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SQLiteStatement;
  close(): void;
}

interface SQLiteModule {
  DatabaseSync: new (path: string) => SQLiteDatabase;
}

export interface SQLiteControlledActionRepositoryMetadata {
  schemaVersion: number;
  revision: number;
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

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function loadSQLiteModule(): SQLiteModule {
  try {
    const runtimeRequire = eval("require") as NodeRequire;

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

function parseState(
  stateJson: string,
): PersistentControlledActionState {
  const parsed = JSON.parse(
    stateJson,
  ) as PersistentControlledActionState;

  validateState(parsed);
  return parsed;
}

export class SQLiteControlledActionStateRepository
  implements ControlledActionStateRepository
{
  private readonly database: SQLiteDatabase;
  private closed = false;

  constructor(private readonly databasePath: string) {
    const normalizedPath = requireNonEmpty(
      databasePath,
      "SQLite controlled-action database path",
    );

    mkdirSync(dirname(normalizedPath), {
      recursive: true,
    });

    const { DatabaseSync } = loadSQLiteModule();

    this.database = new DatabaseSync(normalizedPath);

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

      CREATE TABLE IF NOT EXISTS nexus_controlled_action_state (
        singleton_id INTEGER PRIMARY KEY
          CHECK (singleton_id = 1),
        schema_version INTEGER NOT NULL
          CHECK (schema_version = 1),
        revision INTEGER NOT NULL
          CHECK (revision >= 0),
        state_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    const migrationInsert = this.database.prepare(`
      INSERT OR IGNORE INTO nexus_schema_migrations (
        version,
        migration_name,
        applied_at
      )
      VALUES (?, ?, ?)
    `);

    migrationInsert.run(
      1,
      "controlled_action_state_singleton_v1",
      new Date().toISOString(),
    );

    const existingState = this.database
      .prepare(`
        SELECT
          schema_version,
          revision,
          state_json
        FROM nexus_controlled_action_state
        WHERE singleton_id = 1
      `)
      .get();

    if (!existingState) {
      const initialState = createInitialState();

      validateState(initialState);

      this.database
        .prepare(`
          INSERT INTO nexus_controlled_action_state (
            singleton_id,
            schema_version,
            revision,
            state_json,
            updated_at
          )
          VALUES (1, 1, ?, ?, ?)
        `)
        .run(
          initialState.revision,
          JSON.stringify(initialState),
          new Date().toISOString(),
        );
    } else {
      const schemaVersion = readInteger(
        existingState,
        "schema_version",
      );

      if (schemaVersion !== 1) {
        throw new Error(
          "Unsupported SQLite controlled-action schema version.",
        );
      }

      const state = parseState(
        readString(existingState, "state_json"),
      );

      const storedRevision = readInteger(
        existingState,
        "revision",
      );

      if (state.revision !== storedRevision) {
        throw new Error(
          "SQLite controlled-action revision mismatch.",
        );
      }
    }
  }

  async readSnapshot(): Promise<PersistentControlledActionState> {
    this.ensureOpen();

    const row = this.database
      .prepare(`
        SELECT revision, state_json
        FROM nexus_controlled_action_state
        WHERE singleton_id = 1
      `)
      .get();

    if (!row) {
      throw new Error(
        "SQLite controlled-action state row is missing.",
      );
    }

    const state = parseState(
      readString(row, "state_json"),
    );

    const storedRevision = readInteger(
      row,
      "revision",
    );

    if (state.revision !== storedRevision) {
      throw new Error(
        "SQLite controlled-action revision mismatch.",
      );
    }

    return clone(state);
  }

  async transact<T>(
    mutator: (
      state: PersistentControlledActionState,
    ) => TransactionResult<T>,
  ): Promise<T> {
    this.ensureOpen();

    this.database.exec("BEGIN IMMEDIATE");

    try {
      const row = this.database
        .prepare(`
          SELECT revision, state_json
          FROM nexus_controlled_action_state
          WHERE singleton_id = 1
        `)
        .get();

      if (!row) {
        throw new Error(
          "SQLite controlled-action state row is missing.",
        );
      }

      const expectedRevision = readInteger(
        row,
        "revision",
      );

      const currentState = parseState(
        readString(row, "state_json"),
      );

      if (currentState.revision !== expectedRevision) {
        throw new Error(
          "SQLite controlled-action revision mismatch.",
        );
      }

      const workingState = clone(currentState);
      const result = mutator(workingState);

      if (!result.changed) {
        this.database.exec("COMMIT");
        return clone(result.value);
      }

      workingState.revision = expectedRevision + 1;
      validateState(workingState);

      const updateResult = this.database
        .prepare(`
          UPDATE nexus_controlled_action_state
          SET
            revision = ?,
            state_json = ?,
            updated_at = ?
          WHERE
            singleton_id = 1
            AND revision = ?
        `)
        .run(
          workingState.revision,
          JSON.stringify(workingState),
          new Date().toISOString(),
          expectedRevision,
        );

      if (Number(updateResult.changes) !== 1) {
        throw new Error(
          "SQLite controlled-action optimistic revision conflict.",
        );
      }

      this.database.exec("COMMIT");

      return clone(result.value);
    } catch (error) {
      try {
        this.database.exec("ROLLBACK");
      } catch {
        // The original transactional error remains authoritative.
      }

      throw error;
    }
  }

  readMetadata(): SQLiteControlledActionRepositoryMetadata {
    this.ensureOpen();

    const stateRow = this.database
      .prepare(`
        SELECT schema_version, revision
        FROM nexus_controlled_action_state
        WHERE singleton_id = 1
      `)
      .get();

    const journalRow = this.database
      .prepare("PRAGMA journal_mode")
      .get();

    const integrityRow = this.database
      .prepare("PRAGMA integrity_check")
      .get();

    return {
      schemaVersion: readInteger(
        stateRow,
        "schema_version",
      ),
      revision: readInteger(
        stateRow,
        "revision",
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

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "SQLite controlled-action repository is closed.",
      );
    }
  }
}
