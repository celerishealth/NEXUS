import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import {
  type ConstitutionalEvidenceReplayNonceScope,
  type ConstitutionalEvidenceReplayStore,
} from "./aiWorkforceConstitutionalEvidenceReplayGuard";

export const SQLITE_CONSTITUTIONAL_EVIDENCE_REPLAY_STORE_VERSION =
  "NEXUS_SQLITE_CONSTITUTIONAL_EVIDENCE_REPLAY_STORE_V1" as const;

interface SQLiteRunResult {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}

interface SQLiteStatement {
  get(...parameters: unknown[]): Record<string, unknown> | undefined;
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

function requireNonEmpty(value: string, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be non-empty.`);
  }

  return value.trim();
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

function scopeIdentity(
  scope: ConstitutionalEvidenceReplayNonceScope,
): string {
  return JSON.stringify([
    scope.tenantId,
    scope.evidenceIssuerId,
    scope.evidenceIssuerKeyId,
    scope.nonce,
  ]);
}

/**
 * Phase-0 isolated durable replay store.
 *
 * This class is a persistence implementation only. Constructing or using it
 * does not grant constitutional execution authority or authorize runtime
 * integration. Its database path must belong to a separately isolated
 * constitutional replay environment and must not point at an existing NEXUS
 * production/development database.
 */
export class SQLiteConstitutionalEvidenceReplayStore
  implements ConstitutionalEvidenceReplayStore
{
  private readonly database: SQLiteDatabase;
  private readonly ambiguousScopes = new Set<string>();
  private closed = false;

  constructor(databasePath: string) {
    const normalizedPath = requireNonEmpty(
      databasePath,
      "Constitutional replay SQLite database path",
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

      CREATE TABLE IF NOT EXISTS nexus_constitutional_replay_reservations (
        tenant_id TEXT NOT NULL,
        evidence_issuer_id TEXT NOT NULL,
        evidence_issuer_key_id TEXT NOT NULL,
        nonce TEXT NOT NULL,
        reservation_state TEXT NOT NULL CHECK (
          reservation_state IN ('in_progress', 'reserved')
        ),
        attempt_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        reserved_at TEXT,
        PRIMARY KEY (
          tenant_id,
          evidence_issuer_id,
          evidence_issuer_key_id,
          nonce
        )
      );
    `);
  }

  async reserveReplayNonceScope(
    input: ConstitutionalEvidenceReplayNonceScope,
  ): Promise<"RESERVED" | "ALREADY_USED" | "UNAVAILABLE"> {
    this.ensureOpen();

    const scope: ConstitutionalEvidenceReplayNonceScope =
      Object.freeze({
        tenantId: input.tenantId.trim(),
        evidenceIssuerId: input.evidenceIssuerId.trim(),
        evidenceIssuerKeyId: input.evidenceIssuerKeyId.trim(),
        nonce: input.nonce.trim(),
      });

    const identity = scopeIdentity(scope);

    if (this.ambiguousScopes.has(identity)) {
      return "UNAVAILABLE";
    }

    const attemptId = randomUUID();

    /*
     * Phase 1 durably consumes the nonce scope as in_progress.
     *
     * Once this commit succeeds, a crash or later finalization failure cannot
     * make the nonce fresh again. Any process that observes either
     * in_progress or reserved treats the scope as already consumed.
     */
    try {
      this.database.exec("BEGIN IMMEDIATE");

      const existing = this.database
        .prepare(`
          SELECT
            reservation_state,
            attempt_id
          FROM nexus_constitutional_replay_reservations
          WHERE tenant_id = ?
            AND evidence_issuer_id = ?
            AND evidence_issuer_key_id = ?
            AND nonce = ?
        `)
        .get(
          scope.tenantId,
          scope.evidenceIssuerId,
          scope.evidenceIssuerKeyId,
          scope.nonce,
        );

      if (existing) {
        const state = existing.reservation_state;

        if (
          state !== "in_progress" &&
          state !== "reserved"
        ) {
          throw new Error(
            "Constitutional replay reservation state is invalid.",
          );
        }

        this.database.exec("COMMIT");

        return "ALREADY_USED";
      }

      const intentResult = this.database
        .prepare(`
          INSERT INTO nexus_constitutional_replay_reservations (
            tenant_id,
            evidence_issuer_id,
            evidence_issuer_key_id,
            nonce,
            reservation_state,
            attempt_id,
            started_at,
            reserved_at
          )
          VALUES (?, ?, ?, ?, 'in_progress', ?, ?, NULL)
        `)
        .run(
          scope.tenantId,
          scope.evidenceIssuerId,
          scope.evidenceIssuerKeyId,
          scope.nonce,
          attemptId,
          new Date().toISOString(),
        );

      if (Number(intentResult.changes) !== 1) {
        throw new Error(
          "Constitutional replay durable intent was not uniquely acknowledged.",
        );
      }

      this.database.exec("COMMIT");
    } catch {
      this.rollbackQuietly();
      this.ambiguousScopes.add(identity);

      return "UNAVAILABLE";
    }

    /*
     * Phase 2 finalizes the already-consumed nonce.
     *
     * Failure here leaves the committed in_progress row intact, so a restart
     * still cannot interpret the scope as fresh.
     */
    try {
      this.database.exec("BEGIN IMMEDIATE");

      const current = this.database
        .prepare(`
          SELECT
            reservation_state,
            attempt_id
          FROM nexus_constitutional_replay_reservations
          WHERE tenant_id = ?
            AND evidence_issuer_id = ?
            AND evidence_issuer_key_id = ?
            AND nonce = ?
        `)
        .get(
          scope.tenantId,
          scope.evidenceIssuerId,
          scope.evidenceIssuerKeyId,
          scope.nonce,
        );

      if (!current) {
        throw new Error(
          "Constitutional replay durable intent disappeared before finalization.",
        );
      }

      const state = current.reservation_state;
      const storedAttemptId = current.attempt_id;

      if (
        state !== "in_progress" &&
        state !== "reserved"
      ) {
        throw new Error(
          "Constitutional replay reservation state is invalid during finalization.",
        );
      }

      if (
        state === "reserved" ||
        storedAttemptId !== attemptId
      ) {
        this.database.exec("COMMIT");

        return "ALREADY_USED";
      }

      const finalizeResult = this.database
        .prepare(`
          UPDATE nexus_constitutional_replay_reservations
          SET
            reservation_state = 'reserved',
            reserved_at = ?
          WHERE tenant_id = ?
            AND evidence_issuer_id = ?
            AND evidence_issuer_key_id = ?
            AND nonce = ?
            AND reservation_state = 'in_progress'
            AND attempt_id = ?
        `)
        .run(
          new Date().toISOString(),
          scope.tenantId,
          scope.evidenceIssuerId,
          scope.evidenceIssuerKeyId,
          scope.nonce,
          attemptId,
        );

      if (Number(finalizeResult.changes) !== 1) {
        throw new Error(
          "Constitutional replay reservation finalization was not uniquely acknowledged.",
        );
      }

      this.database.exec("COMMIT");

      return "RESERVED";
    } catch {
      this.rollbackQuietly();
      this.ambiguousScopes.add(identity);

      return "UNAVAILABLE";
    }
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
      // Original storage/transaction uncertainty remains authoritative.
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(
        "Constitutional replay SQLite store is closed.",
      );
    }
  }
}