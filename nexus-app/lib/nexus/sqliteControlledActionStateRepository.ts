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

export interface SQLiteControlledActionProjectionSnapshot {
  revision: number;
  killSwitch: Record<string, unknown> | null;
  actions: Array<Record<string, unknown>>;
  outbox: Array<Record<string, unknown>>;
  audit: Array<Record<string, unknown>>;
}

export interface SQLiteProjectionIntegrityResult {
  valid: boolean;
  authoritativeRevision: number;
  projectionRevision: number | null;
  issues: string[];
}

export interface SQLiteProjectionRepositoryOptions {
  allowProjectionRecovery?: boolean;
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

function asRecord(
  value: unknown,
  fieldName: string,
): Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new Error(
      `${fieldName} must be a JSON object.`,
    );
  }

  return value as Record<string, unknown>;
}

function readRecordString(
  record: Record<string, unknown>,
  fieldName: string,
): string {
  const value = record[fieldName];

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      `Projection field ${fieldName} is missing or invalid.`,
    );
  }

  return value;
}

function readRecordNullableString(
  record: Record<string, unknown>,
  fieldName: string,
): string | null {
  const value = record[fieldName];

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(
      `Projection field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function readRecordInteger(
  record: Record<string, unknown>,
  fieldName: string,
): number {
  const value = record[fieldName];

  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value)
  ) {
    throw new Error(
      `Projection field ${fieldName} is missing or invalid.`,
    );
  }

  return value;
}

function readRecordBoolean(
  record: Record<string, unknown>,
  fieldName: string,
): boolean {
  const value = record[fieldName];

  if (typeof value !== "boolean") {
    throw new Error(
      `Projection field ${fieldName} is missing or invalid.`,
    );
  }

  return value;
}

function parseProjectionJson(
  row: Record<string, unknown>,
): Record<string, unknown> {
  return asRecord(
    JSON.parse(
      readString(row, "record_json"),
    ) as unknown,
    "SQLite projection record",
  );
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    const record =
      value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [
          key,
          canonicalize(record[key]),
        ]),
    );
  }

  return value;
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(
    canonicalize(value),
  );
}

function buildExpectedProjection(
  state: PersistentControlledActionState,
): SQLiteControlledActionProjectionSnapshot {
  const actions = Object.values(
    state.actions,
  )
    .map((value) =>
      asRecord(
        value,
        "Expected controlled-action projection",
      ),
    )
    .sort((left, right) => {
      const tenantComparison =
        readRecordString(
          left,
          "tenantId",
        ).localeCompare(
          readRecordString(
            right,
            "tenantId",
          ),
        );

      if (tenantComparison !== 0) {
        return tenantComparison;
      }

      return readRecordString(
        left,
        "actionId",
      ).localeCompare(
        readRecordString(
          right,
          "actionId",
        ),
      );
    });

  const outbox = Object.values(
    state.outbox,
  )
    .map((value) =>
      asRecord(
        value,
        "Expected dispatch-outbox projection",
      ),
    )
    .sort((left, right) => {
      const tenantComparison =
        readRecordString(
          left,
          "tenantId",
        ).localeCompare(
          readRecordString(
            right,
            "tenantId",
          ),
        );

      if (tenantComparison !== 0) {
        return tenantComparison;
      }

      return readRecordString(
        left,
        "outboxId",
      ).localeCompare(
        readRecordString(
          right,
          "outboxId",
        ),
      );
    });

  return {
    revision: state.revision,
    killSwitch: asRecord(
      state.killSwitch,
      "Expected kill-switch projection",
    ),
    actions,
    outbox,
    audit: state.audit.map((value) =>
      asRecord(
        value,
        "Expected audit projection",
      ),
    ),
  };
}

export class SQLiteControlledActionStateRepository
  implements ControlledActionStateRepository
{
  private readonly database: SQLiteDatabase;
  private closed = false;

  constructor(
    private readonly databasePath: string,
    private readonly options:
      SQLiteProjectionRepositoryOptions = {},
  ) {
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

      CREATE TABLE IF NOT EXISTS nexus_projection_metadata (
        singleton_id INTEGER PRIMARY KEY
          CHECK (singleton_id = 1),
        source_revision INTEGER NOT NULL
          CHECK (source_revision >= 0),
        projected_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS nexus_controlled_actions_projection (
        action_id TEXT PRIMARY KEY
          CHECK (length(action_id) > 0),
        tenant_id TEXT NOT NULL
          CHECK (length(tenant_id) > 0),
        idempotency_key TEXT NOT NULL
          CHECK (length(idempotency_key) > 0),
        status TEXT NOT NULL
          CHECK (length(status) > 0),
        version INTEGER NOT NULL
          CHECK (version >= 1),
        outbox_id TEXT,
        lease_owner TEXT,
        lease_expires_at TEXT,
        lease_fence INTEGER NOT NULL
          CHECK (lease_fence >= 0),
        recovery_count INTEGER NOT NULL
          CHECK (recovery_count >= 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        record_json TEXT NOT NULL,
        UNIQUE (tenant_id, idempotency_key),
        UNIQUE (tenant_id, action_id)
      );

      CREATE INDEX IF NOT EXISTS
        nexus_controlled_actions_tenant_status_idx
      ON nexus_controlled_actions_projection (
        tenant_id,
        status,
        updated_at
      );

      CREATE TABLE IF NOT EXISTS nexus_dispatch_outbox_projection (
        outbox_id TEXT PRIMARY KEY
          CHECK (length(outbox_id) > 0),
        action_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL
          CHECK (length(tenant_id) > 0),
        status TEXT NOT NULL
          CHECK (length(status) > 0),
        version INTEGER NOT NULL
          CHECK (version >= 1),
        delivery_attempt_count INTEGER NOT NULL
          CHECK (delivery_attempt_count >= 0),
        max_delivery_attempts INTEGER NOT NULL
          CHECK (max_delivery_attempts >= 1),
        next_attempt_at TEXT NOT NULL,
        lease_owner TEXT,
        lease_expires_at TEXT,
        lease_fence INTEGER NOT NULL
          CHECK (lease_fence >= 0),
        recovery_count INTEGER NOT NULL
          CHECK (recovery_count >= 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        record_json TEXT NOT NULL,
        FOREIGN KEY (action_id)
          REFERENCES nexus_controlled_actions_projection (
            action_id
          )
          ON DELETE CASCADE,
        UNIQUE (tenant_id, outbox_id)
      );

      CREATE INDEX IF NOT EXISTS
        nexus_dispatch_outbox_due_idx
      ON nexus_dispatch_outbox_projection (
        tenant_id,
        status,
        next_attempt_at,
        created_at,
        outbox_id
      );

      CREATE TABLE IF NOT EXISTS nexus_audit_projection (
        ordinal INTEGER PRIMARY KEY
          CHECK (ordinal >= 1),
        audit_id TEXT NOT NULL UNIQUE
          CHECK (length(audit_id) > 0),
        tenant_id TEXT NOT NULL
          CHECK (length(tenant_id) > 0),
        action_id TEXT,
        outbox_id TEXT,
        event_type TEXT NOT NULL
          CHECK (length(event_type) > 0),
        occurred_at TEXT NOT NULL,
        record_json TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS
        nexus_audit_tenant_time_idx
      ON nexus_audit_projection (
        tenant_id,
        occurred_at,
        ordinal
      );

      CREATE TABLE IF NOT EXISTS nexus_kill_switch_projection (
        singleton_id INTEGER PRIMARY KEY
          CHECK (singleton_id = 1),
        engaged INTEGER NOT NULL
          CHECK (engaged IN (0, 1)),
        record_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS nexus_projection_rebuild_log (
        rebuild_id INTEGER PRIMARY KEY AUTOINCREMENT,
        reason TEXT NOT NULL
          CHECK (length(reason) > 0),
        authoritative_revision INTEGER NOT NULL
          CHECK (authoritative_revision >= 0),
        rebuilt_at TEXT NOT NULL
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

    migrationInsert.run(
      3,
      "controlled_action_normalized_projections_v1",
      new Date().toISOString(),
    );

    migrationInsert.run(
      4,
      "controlled_action_projection_integrity_gate_v1",
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

    this.initializeOrVerifyProjectionState();
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

      this.syncProjections(workingState);

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

  readProjectionSnapshot(): SQLiteControlledActionProjectionSnapshot {
    this.ensureOpen();

    const metadataRow = this.database
      .prepare(`
        SELECT source_revision
        FROM nexus_projection_metadata
        WHERE singleton_id = 1
      `)
      .get();

    if (!metadataRow) {
      throw new Error(
        "SQLite normalized projection metadata is missing.",
      );
    }

    const killSwitchRow = this.database
      .prepare(`
        SELECT record_json
        FROM nexus_kill_switch_projection
        WHERE singleton_id = 1
      `)
      .get();

    const actionRows = this.database
      .prepare(`
        SELECT record_json
        FROM nexus_controlled_actions_projection
        ORDER BY tenant_id, action_id
      `)
      .all();

    const outboxRows = this.database
      .prepare(`
        SELECT record_json
        FROM nexus_dispatch_outbox_projection
        ORDER BY tenant_id, outbox_id
      `)
      .all();

    const auditRows = this.database
      .prepare(`
        SELECT record_json
        FROM nexus_audit_projection
        ORDER BY ordinal
      `)
      .all();

    return {
      revision: readInteger(
        metadataRow,
        "source_revision",
      ),
      killSwitch: killSwitchRow
        ? parseProjectionJson(killSwitchRow)
        : null,
      actions: actionRows.map(
        parseProjectionJson,
      ),
      outbox: outboxRows.map(
        parseProjectionJson,
      ),
      audit: auditRows.map(
        parseProjectionJson,
      ),
    };
  }

  verifyProjectionIntegrity(): SQLiteProjectionIntegrityResult {
    this.ensureOpen();

    const authoritative =
      this.readAuthoritativeState();

    const metadataRow = this.database
      .prepare(`
        SELECT source_revision
        FROM nexus_projection_metadata
        WHERE singleton_id = 1
      `)
      .get();

    if (!metadataRow) {
      return {
        valid: false,
        authoritativeRevision:
          authoritative.revision,
        projectionRevision: null,
        issues: [
          "Projection metadata is missing.",
        ],
      };
    }

    const projectionRevision =
      readInteger(
        metadataRow,
        "source_revision",
      );

    const issues: string[] = [];

    if (
      projectionRevision !==
      authoritative.revision
    ) {
      issues.push(
        `Projection revision ${projectionRevision} does not match authoritative revision ${authoritative.revision}.`,
      );
    }

    const projection =
      this.readProjectionSnapshot();

    const expected =
      buildExpectedProjection(
        authoritative,
      );

    if (
      canonicalJson(
        projection.killSwitch,
      ) !==
      canonicalJson(
        expected.killSwitch,
      )
    ) {
      issues.push(
        "Kill-switch projection does not match authoritative state.",
      );
    }

    if (
      canonicalJson(
        projection.actions,
      ) !==
      canonicalJson(
        expected.actions,
      )
    ) {
      issues.push(
        "Controlled-action projection does not match authoritative state.",
      );
    }

    if (
      canonicalJson(
        projection.outbox,
      ) !==
      canonicalJson(
        expected.outbox,
      )
    ) {
      issues.push(
        "Dispatch-outbox projection does not match authoritative state.",
      );
    }

    if (
      canonicalJson(
        projection.audit,
      ) !==
      canonicalJson(
        expected.audit,
      )
    ) {
      issues.push(
        "Audit projection does not match authoritative state.",
      );
    }

    this.verifyRelationalColumns(
      issues,
    );

    return {
      valid: issues.length === 0,
      authoritativeRevision:
        authoritative.revision,
      projectionRevision,
      issues,
    };
  }

  rebuildProjectionsFromAuthoritativeState(
    reason: string,
    rebuiltAt: string,
  ): SQLiteProjectionIntegrityResult {
    this.ensureOpen();

    if (
      !this.options
        .allowProjectionRecovery
    ) {
      throw new Error(
        "Projection rebuild is disabled. Reopen the repository with explicit recovery authorization.",
      );
    }

    const normalizedReason =
      requireNonEmpty(
        reason,
        "Projection rebuild reason",
      );

    if (
      !Number.isFinite(
        Date.parse(rebuiltAt),
      )
    ) {
      throw new Error(
        "Projection rebuiltAt must be a valid timestamp.",
      );
    }

    this.database.exec(
      "BEGIN IMMEDIATE",
    );

    try {
      const authoritative =
        this.readAuthoritativeState();

      this.syncProjections(
        authoritative,
      );

      this.database
        .prepare(`
          INSERT INTO nexus_projection_rebuild_log (
            reason,
            authoritative_revision,
            rebuilt_at
          )
          VALUES (?, ?, ?)
        `)
        .run(
          normalizedReason,
          authoritative.revision,
          rebuiltAt,
        );

      this.database.exec("COMMIT");
    } catch (error) {
      try {
        this.database.exec(
          "ROLLBACK",
        );
      } catch {
        // Original rebuild error remains authoritative.
      }

      throw error;
    }

    const verification =
      this.verifyProjectionIntegrity();

    if (!verification.valid) {
      throw new Error(
        `Projection rebuild verification failed: ${verification.issues.join(" ")}`,
      );
    }

    return verification;
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.database.close();
    this.closed = true;
  }

  private initializeOrVerifyProjectionState(): void {
    const metadataRow = this.database
      .prepare(`
        SELECT source_revision
        FROM nexus_projection_metadata
        WHERE singleton_id = 1
      `)
      .get();

    const actionCount = readInteger(
      this.database
        .prepare(`
          SELECT COUNT(*) AS count
          FROM nexus_controlled_actions_projection
        `)
        .get(),
      "count",
    );

    const outboxCount = readInteger(
      this.database
        .prepare(`
          SELECT COUNT(*) AS count
          FROM nexus_dispatch_outbox_projection
        `)
        .get(),
      "count",
    );

    const auditCount = readInteger(
      this.database
        .prepare(`
          SELECT COUNT(*) AS count
          FROM nexus_audit_projection
        `)
        .get(),
      "count",
    );

    const killSwitchCount =
      readInteger(
        this.database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_kill_switch_projection
          `)
          .get(),
        "count",
      );

    const projectionIsEmpty =
      actionCount === 0 &&
      outboxCount === 0 &&
      auditCount === 0 &&
      killSwitchCount === 0;

    if (
      !metadataRow &&
      projectionIsEmpty
    ) {
      this.database.exec(
        "BEGIN IMMEDIATE",
      );

      try {
        this.syncProjections(
          this.readAuthoritativeState(),
        );

        this.database.exec("COMMIT");
        return;
      } catch (error) {
        try {
          this.database.exec(
            "ROLLBACK",
          );
        } catch {
          // Original initialization error remains authoritative.
        }

        throw error;
      }
    }

    const verification =
      this.verifyProjectionIntegrity();

    if (
      !verification.valid &&
      !this.options
        .allowProjectionRecovery
    ) {
      throw new Error(
        `SQLite projection integrity verification failed: ${verification.issues.join(" ")}`,
      );
    }
  }

  private readAuthoritativeState(): PersistentControlledActionState {
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
      readString(
        row,
        "state_json",
      ),
    );

    const storedRevision =
      readInteger(
        row,
        "revision",
      );

    if (
      state.revision !==
      storedRevision
    ) {
      throw new Error(
        "SQLite controlled-action revision mismatch.",
      );
    }

    return state;
  }

  private verifyRelationalColumns(
    issues: string[],
  ): void {
    const actionRows = this.database
      .prepare(`
        SELECT *
        FROM nexus_controlled_actions_projection
        ORDER BY tenant_id, action_id
      `)
      .all();

    for (const row of actionRows) {
      const record =
        parseProjectionJson(row);

      if (
        readString(row, "action_id") !==
          readRecordString(
            record,
            "actionId",
          ) ||
        readString(row, "tenant_id") !==
          readRecordString(
            record,
            "tenantId",
          ) ||
        readString(row, "status") !==
          readRecordString(
            record,
            "status",
          ) ||
        readInteger(row, "version") !==
          readRecordInteger(
            record,
            "version",
          )
      ) {
        issues.push(
          `Controlled-action relational columns are inconsistent for ${readString(row, "action_id")}.`,
        );
      }
    }

    const outboxRows = this.database
      .prepare(`
        SELECT *
        FROM nexus_dispatch_outbox_projection
        ORDER BY tenant_id, outbox_id
      `)
      .all();

    for (const row of outboxRows) {
      const record =
        parseProjectionJson(row);

      if (
        readString(row, "outbox_id") !==
          readRecordString(
            record,
            "outboxId",
          ) ||
        readString(row, "action_id") !==
          readRecordString(
            record,
            "actionId",
          ) ||
        readString(row, "tenant_id") !==
          readRecordString(
            record,
            "tenantId",
          ) ||
        readString(row, "status") !==
          readRecordString(
            record,
            "status",
          ) ||
        readInteger(
          row,
          "delivery_attempt_count",
        ) !==
          readRecordInteger(
            record,
            "deliveryAttemptCount",
          )
      ) {
        issues.push(
          `Dispatch-outbox relational columns are inconsistent for ${readString(row, "outbox_id")}.`,
        );
      }
    }

    const auditRows = this.database
      .prepare(`
        SELECT *
        FROM nexus_audit_projection
        ORDER BY ordinal
      `)
      .all();

    auditRows.forEach(
      (row, index) => {
        const record =
          parseProjectionJson(row);

        if (
          readInteger(
            row,
            "ordinal",
          ) !==
            index + 1 ||
          readString(
            row,
            "audit_id",
          ) !==
            readRecordString(
              record,
              "auditId",
            ) ||
          readString(
            row,
            "event_type",
          ) !==
            readRecordString(
              record,
              "eventType",
            )
        ) {
          issues.push(
            `Audit relational columns are inconsistent at ordinal ${index + 1}.`,
          );
        }
      },
    );

    const killSwitchRow =
      this.database
        .prepare(`
          SELECT engaged, record_json
          FROM nexus_kill_switch_projection
          WHERE singleton_id = 1
        `)
        .get();

    if (!killSwitchRow) {
      issues.push(
        "Kill-switch relational row is missing.",
      );

      return;
    }

    const killSwitch =
      parseProjectionJson(
        killSwitchRow,
      );

    const relationalEngaged =
      readInteger(
        killSwitchRow,
        "engaged",
      ) === 1;

    if (
      relationalEngaged !==
      readRecordBoolean(
        killSwitch,
        "engaged",
      )
    ) {
      issues.push(
        "Kill-switch relational columns are inconsistent.",
      );
    }
  }

  private syncProjections(
    state: PersistentControlledActionState,
  ): void {
    validateState(state);

    this.database.exec(`
      DELETE FROM nexus_audit_projection;
      DELETE FROM nexus_dispatch_outbox_projection;
      DELETE FROM nexus_controlled_actions_projection;
      DELETE FROM nexus_kill_switch_projection;
    `);

    const actionInsert = this.database.prepare(`
      INSERT INTO nexus_controlled_actions_projection (
        action_id,
        tenant_id,
        idempotency_key,
        status,
        version,
        outbox_id,
        lease_owner,
        lease_expires_at,
        lease_fence,
        recovery_count,
        created_at,
        updated_at,
        record_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const actionValue of Object.values(
      state.actions,
    )) {
      const action = asRecord(
        actionValue,
        "Controlled-action projection",
      );

      actionInsert.run(
        readRecordString(action, "actionId"),
        readRecordString(action, "tenantId"),
        readRecordString(action, "idempotencyKey"),
        readRecordString(action, "status"),
        readRecordInteger(action, "version"),
        readRecordNullableString(
          action,
          "outboxId",
        ),
        readRecordNullableString(
          action,
          "leaseOwner",
        ),
        readRecordNullableString(
          action,
          "leaseExpiresAt",
        ),
        readRecordInteger(
          action,
          "leaseFence",
        ),
        readRecordInteger(
          action,
          "recoveryCount",
        ),
        readRecordString(action, "createdAt"),
        readRecordString(action, "updatedAt"),
        JSON.stringify(action),
      );
    }

    const outboxInsert = this.database.prepare(`
      INSERT INTO nexus_dispatch_outbox_projection (
        outbox_id,
        action_id,
        tenant_id,
        status,
        version,
        delivery_attempt_count,
        max_delivery_attempts,
        next_attempt_at,
        lease_owner,
        lease_expires_at,
        lease_fence,
        recovery_count,
        created_at,
        updated_at,
        record_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const outboxValue of Object.values(
      state.outbox,
    )) {
      const outboxRecord = asRecord(
        outboxValue,
        "Dispatch-outbox projection",
      );

      outboxInsert.run(
        readRecordString(
          outboxRecord,
          "outboxId",
        ),
        readRecordString(
          outboxRecord,
          "actionId",
        ),
        readRecordString(
          outboxRecord,
          "tenantId",
        ),
        readRecordString(
          outboxRecord,
          "status",
        ),
        readRecordInteger(
          outboxRecord,
          "version",
        ),
        readRecordInteger(
          outboxRecord,
          "deliveryAttemptCount",
        ),
        readRecordInteger(
          outboxRecord,
          "maxDeliveryAttempts",
        ),
        readRecordString(
          outboxRecord,
          "nextAttemptAt",
        ),
        readRecordNullableString(
          outboxRecord,
          "leaseOwner",
        ),
        readRecordNullableString(
          outboxRecord,
          "leaseExpiresAt",
        ),
        readRecordInteger(
          outboxRecord,
          "leaseFence",
        ),
        readRecordInteger(
          outboxRecord,
          "recoveryCount",
        ),
        readRecordString(
          outboxRecord,
          "createdAt",
        ),
        readRecordString(
          outboxRecord,
          "updatedAt",
        ),
        JSON.stringify(outboxRecord),
      );
    }

    const auditInsert = this.database.prepare(`
      INSERT INTO nexus_audit_projection (
        ordinal,
        audit_id,
        tenant_id,
        action_id,
        outbox_id,
        event_type,
        occurred_at,
        record_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    state.audit.forEach(
      (auditValue, index) => {
        const auditRecord = asRecord(
          auditValue,
          "Audit projection",
        );

        auditInsert.run(
          index + 1,
          readRecordString(
            auditRecord,
            "auditId",
          ),
          readRecordString(
            auditRecord,
            "tenantId",
          ),
          readRecordNullableString(
            auditRecord,
            "actionId",
          ),
          readRecordNullableString(
            auditRecord,
            "outboxId",
          ),
          readRecordString(
            auditRecord,
            "eventType",
          ),
          readRecordString(
            auditRecord,
            "occurredAt",
          ),
          JSON.stringify(auditRecord),
        );
      },
    );

    const killSwitch = asRecord(
      state.killSwitch,
      "Operational kill-switch projection",
    );

    this.database
      .prepare(`
        INSERT INTO nexus_kill_switch_projection (
          singleton_id,
          engaged,
          record_json
        )
        VALUES (1, ?, ?)
      `)
      .run(
        readRecordBoolean(
          killSwitch,
          "engaged",
        )
          ? 1
          : 0,
        JSON.stringify(killSwitch),
      );

    this.database
      .prepare(`
        INSERT INTO nexus_projection_metadata (
          singleton_id,
          source_revision,
          projected_at
        )
        VALUES (1, ?, ?)
        ON CONFLICT(singleton_id)
        DO UPDATE SET
          source_revision = excluded.source_revision,
          projected_at = excluded.projected_at
      `)
      .run(
        state.revision,
        new Date().toISOString(),
      );
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "SQLite controlled-action repository is closed.",
      );
    }
  }
}


