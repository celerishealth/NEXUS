import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import {
  CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_SCHEMA_VERSION,
  verifyConstitutionalTrustContextLifecycleAuditRecord,
  type ConstitutionalTrustContextLifecycleAuditRecord,
  type ConstitutionalTrustContextLifecycleEvent,
} from "./aiWorkforceConstitutionalTrustContextLifecycleAudit";

export const SQLITE_CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_STORE_VERSION =
  "NEXUS_SQLITE_CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_STORE_V1" as const;

export type ConstitutionalTrustLifecycleAuditAppendResult =
  | "APPENDED"
  | "ALREADY_PRESENT"
  | "UNAVAILABLE";

export interface ConstitutionalTrustLifecycleAuditPersistenceVerification {
  valid: boolean;
  recordCount: number;
  failureCodes: readonly string[];
  productionTrustEstablished: false;
  trustedTimeEstablished: false;
  runtimeIntegrationAuthorized: false;
  constitutionalExecutionAuthorityGranted: false;
}

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

const lifecycleEvents =
  new Set<ConstitutionalTrustContextLifecycleEvent>([
    "ACTIVATED",
    "ROTATED",
    "DISABLED",
    "REVOKED",
    "RETIRED",
    "LOAD_FAILED",
    "CORRUPTION_DETECTED",
    "STALE_STATE_DETECTED",
    "AMBIGUOUS_STATE_DETECTED",
  ]);

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

function requireNonEmpty(
  value: string,
  fieldName: string,
): string {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName} must be non-empty.`,
    );
  }

  return value.trim();
}

function readString(
  row: Record<string, unknown>,
  fieldName: string,
): string {
  const value = row[fieldName];

  if (typeof value !== "string") {
    throw new Error(
      `SQLite lifecycle-audit field ${fieldName} is invalid.`,
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
      `SQLite lifecycle-audit field ${fieldName} is invalid.`,
    );
  }

  return value;
}

function readInteger(
  row: Record<string, unknown>,
  fieldName: string,
): number {
  const value = row[fieldName];

  if (
    typeof value !== "number" &&
    typeof value !== "bigint"
  ) {
    throw new Error(
      `SQLite lifecycle-audit field ${fieldName} is invalid.`,
    );
  }

  const normalized = Number(value);

  if (!Number.isSafeInteger(normalized)) {
    throw new Error(
      `SQLite lifecycle-audit field ${fieldName} is not a safe integer.`,
    );
  }

  return normalized;
}

function requireFalseInteger(
  row: Record<string, unknown>,
  fieldName: string,
): false {
  if (readInteger(row, fieldName) !== 0) {
    throw new Error(
      `SQLite lifecycle-audit authority field ${fieldName} escalated.`,
    );
  }

  return false;
}

function rowToRecord(
  row: Record<string, unknown>,
): ConstitutionalTrustContextLifecycleAuditRecord {
  const event =
    readString(
      row,
      "event",
    ) as ConstitutionalTrustContextLifecycleEvent;

  if (!lifecycleEvents.has(event)) {
    throw new Error(
      "SQLite lifecycle-audit event is invalid.",
    );
  }

  return {
    schemaVersion:
      readString(
        row,
        "schema_version",
      ) as typeof CONSTITUTIONAL_TRUST_CONTEXT_LIFECYCLE_AUDIT_SCHEMA_VERSION,
    lifecycleId:
      readString(
        row,
        "lifecycle_id",
      ),
    eventId:
      readString(
        row,
        "event_id",
      ),
    sequence:
      readInteger(
        row,
        "sequence",
      ),
    event,
    trustContextDigest:
      readString(
        row,
        "trust_context_digest",
      ),
    previousRecordDigest:
      readNullableString(
        row,
        "previous_record_digest",
      ),
    observedAt:
      readString(
        row,
        "observed_at",
      ),
    reason:
      readString(
        row,
        "reason",
      ),
    trustedTimeEstablished:
      requireFalseInteger(
        row,
        "trusted_time_established",
      ),
    productionTrustEstablished:
      requireFalseInteger(
        row,
        "production_trust_established",
      ),
    runtimeIntegrationAuthorized:
      requireFalseInteger(
        row,
        "runtime_integration_authorized",
      ),
    constitutionalExecutionAuthorityGranted:
      requireFalseInteger(
        row,
        "constitutional_execution_authority_granted",
      ),
    recordDigest:
      readString(
        row,
        "record_digest",
      ),
  };
}

function recordsMatch(
  left: ConstitutionalTrustContextLifecycleAuditRecord,
  right: ConstitutionalTrustContextLifecycleAuditRecord,
): boolean {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.lifecycleId === right.lifecycleId &&
    left.eventId === right.eventId &&
    left.sequence === right.sequence &&
    left.event === right.event &&
    left.trustContextDigest ===
      right.trustContextDigest &&
    left.previousRecordDigest ===
      right.previousRecordDigest &&
    left.observedAt === right.observedAt &&
    left.reason === right.reason &&
    left.trustedTimeEstablished ===
      right.trustedTimeEstablished &&
    left.productionTrustEstablished ===
      right.productionTrustEstablished &&
    left.runtimeIntegrationAuthorized ===
      right.runtimeIntegrationAuthorized &&
    left.constitutionalExecutionAuthorityGranted ===
      right.constitutionalExecutionAuthorityGranted &&
    left.recordDigest === right.recordDigest
  );
}

export class SQLiteConstitutionalTrustContextLifecycleAuditStore {
  private readonly database: SQLiteDatabase;
  private closed = false;

  constructor(databasePath: string) {
    const normalizedPath =
      requireNonEmpty(
        databasePath,
        "Constitutional trust lifecycle audit SQLite database path",
      );

    mkdirSync(
      dirname(normalizedPath),
      {
        recursive: true,
      },
    );

    const { DatabaseSync } =
      loadSQLiteModule();

    this.database =
      new DatabaseSync(normalizedPath);

    this.database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = FULL;
      PRAGMA foreign_keys = ON;
      PRAGMA busy_timeout = 5000;

      CREATE TABLE IF NOT EXISTS nexus_constitutional_trust_lifecycle_audit (
        schema_version TEXT NOT NULL,
        lifecycle_id TEXT NOT NULL,
        event_id TEXT NOT NULL,
        sequence INTEGER NOT NULL,
        event TEXT NOT NULL,
        trust_context_digest TEXT NOT NULL,
        previous_record_digest TEXT,
        observed_at TEXT NOT NULL,
        reason TEXT NOT NULL,
        trusted_time_established INTEGER NOT NULL CHECK (
          trusted_time_established = 0
        ),
        production_trust_established INTEGER NOT NULL CHECK (
          production_trust_established = 0
        ),
        runtime_integration_authorized INTEGER NOT NULL CHECK (
          runtime_integration_authorized = 0
        ),
        constitutional_execution_authority_granted INTEGER NOT NULL CHECK (
          constitutional_execution_authority_granted = 0
        ),
        record_digest TEXT NOT NULL,
        PRIMARY KEY (
          lifecycle_id,
          sequence
        ),
        UNIQUE (
          lifecycle_id,
          event_id
        ),
        UNIQUE (
          record_digest
        )
      );

      CREATE TRIGGER IF NOT EXISTS nexus_constitutional_trust_lifecycle_no_update
      BEFORE UPDATE ON nexus_constitutional_trust_lifecycle_audit
      BEGIN
        SELECT RAISE(
          ABORT,
          'constitutional trust lifecycle audit is append-only'
        );
      END;

      CREATE TRIGGER IF NOT EXISTS nexus_constitutional_trust_lifecycle_no_delete
      BEFORE DELETE ON nexus_constitutional_trust_lifecycle_audit
      BEGIN
        SELECT RAISE(
          ABORT,
          'constitutional trust lifecycle audit is append-only'
        );
      END;
    `);
  }

  async append(
    record: ConstitutionalTrustContextLifecycleAuditRecord,
  ): Promise<ConstitutionalTrustLifecycleAuditAppendResult> {
    this.ensureOpen();

    try {
      this.database.exec(
        "BEGIN IMMEDIATE",
      );

      const chain =
        this.verifyLifecycleInternal(
          record.lifecycleId,
        );

      if (!chain.valid) {
        throw new Error(
          "Existing constitutional trust lifecycle audit chain is invalid.",
        );
      }

      const existing =
        this.database
          .prepare(`
            SELECT *
            FROM nexus_constitutional_trust_lifecycle_audit
            WHERE lifecycle_id = ?
              AND sequence = ?
          `)
          .get(
            record.lifecycleId,
            record.sequence,
          );

      if (existing) {
        const existingRecord =
          rowToRecord(existing);

        if (
          !recordsMatch(
            existingRecord,
            record,
          )
        ) {
          throw new Error(
            "Conflicting lifecycle audit record exists at the requested sequence.",
          );
        }

        this.database.exec(
          "COMMIT",
        );

        return "ALREADY_PRESENT";
      }

      const expectedSequence =
        chain.recordCount + 1;

      if (
        record.sequence !==
        expectedSequence
      ) {
        throw new Error(
          "Lifecycle audit sequence is not the next durable sequence.",
        );
      }

      const verification =
        verifyConstitutionalTrustContextLifecycleAuditRecord(
          record,
          chain.lastRecordDigest,
        );

      if (!verification.valid) {
        throw new Error(
          `Lifecycle audit record verification failed: ${verification.failureCodes.join(",")}`,
        );
      }

      const result =
        this.database
          .prepare(`
            INSERT INTO nexus_constitutional_trust_lifecycle_audit (
              schema_version,
              lifecycle_id,
              event_id,
              sequence,
              event,
              trust_context_digest,
              previous_record_digest,
              observed_at,
              reason,
              trusted_time_established,
              production_trust_established,
              runtime_integration_authorized,
              constitutional_execution_authority_granted,
              record_digest
            )
            VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?,
              0, 0, 0, 0, ?
            )
          `)
          .run(
            record.schemaVersion,
            record.lifecycleId,
            record.eventId,
            record.sequence,
            record.event,
            record.trustContextDigest,
            record.previousRecordDigest,
            record.observedAt,
            record.reason,
            record.recordDigest,
          );

      if (
        Number(result.changes) !== 1
      ) {
        throw new Error(
          "Lifecycle audit append was not uniquely acknowledged.",
        );
      }

      const afterAppend =
        this.verifyLifecycleInternal(
          record.lifecycleId,
        );

      if (
        !afterAppend.valid ||
        afterAppend.recordCount !==
          expectedSequence ||
        afterAppend.lastRecordDigest !==
          record.recordDigest
      ) {
        throw new Error(
          "Lifecycle audit read-after-write verification failed.",
        );
      }

      this.database.exec(
        "COMMIT",
      );

      return "APPENDED";
    } catch {
      this.rollbackQuietly();

      return "UNAVAILABLE";
    }
  }

  async verifyLifecycleChain(
    lifecycleId: string,
  ): Promise<ConstitutionalTrustLifecycleAuditPersistenceVerification> {
    this.ensureOpen();

    try {
      const result =
        this.verifyLifecycleInternal(
          requireNonEmpty(
            lifecycleId,
            "lifecycleId",
          ),
        );

      return Object.freeze({
        valid: result.valid,
        recordCount:
          result.recordCount,
        failureCodes:
          Object.freeze([
            ...result.failureCodes,
          ]),
        productionTrustEstablished: false,
        trustedTimeEstablished: false,
        runtimeIntegrationAuthorized: false,
        constitutionalExecutionAuthorityGranted:
          false,
      });
    } catch {
      return Object.freeze({
        valid: false,
        recordCount: 0,
        failureCodes: Object.freeze([
          "TRUST_LIFECYCLE_AUDIT_PERSISTENCE_UNAVAILABLE",
        ]),
        productionTrustEstablished: false,
        trustedTimeEstablished: false,
        runtimeIntegrationAuthorized: false,
        constitutionalExecutionAuthorityGranted:
          false,
      });
    }
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.database.close();
    this.closed = true;
  }

  private verifyLifecycleInternal(
    lifecycleId: string,
  ): {
    valid: boolean;
    recordCount: number;
    lastRecordDigest: string | null;
    failureCodes: string[];
  } {
    const rows =
      this.database
        .prepare(`
          SELECT *
          FROM nexus_constitutional_trust_lifecycle_audit
          WHERE lifecycle_id = ?
          ORDER BY sequence ASC
        `)
        .all(lifecycleId);

    const failureCodes: string[] = [];
    let previousDigest: string | null =
      null;
    let expectedSequence = 1;

    for (const row of rows) {
      try {
        const record =
          rowToRecord(row);

        if (
          record.sequence !==
          expectedSequence
        ) {
          failureCodes.push(
            "TRUST_LIFECYCLE_AUDIT_SEQUENCE_GAP",
          );
        }

        const verification =
          verifyConstitutionalTrustContextLifecycleAuditRecord(
            record,
            previousDigest,
          );

        failureCodes.push(
          ...verification.failureCodes,
        );

        previousDigest =
          record.recordDigest;
        expectedSequence += 1;
      } catch {
        failureCodes.push(
          "TRUST_LIFECYCLE_AUDIT_PERSISTENCE_STRUCTURAL_INVALID",
        );
      }
    }

    return {
      valid:
        failureCodes.length === 0,
      recordCount: rows.length,
      lastRecordDigest:
        previousDigest,
      failureCodes,
    };
  }

  private rollbackQuietly(): void {
    try {
      this.database.exec(
        "ROLLBACK",
      );
    } catch {
      // Original persistence uncertainty remains authoritative.
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "Constitutional trust lifecycle audit store is closed.",
      );
    }
  }
}