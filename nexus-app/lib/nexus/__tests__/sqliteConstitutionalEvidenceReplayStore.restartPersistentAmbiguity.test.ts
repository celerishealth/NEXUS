import {
  mkdtempSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  SQLiteConstitutionalEvidenceReplayStore,
} from "../sqliteConstitutionalEvidenceReplayStore";

interface SQLiteDatabase {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...parameters: unknown[]): {
      changes: number | bigint;
      lastInsertRowid: number | bigint;
    };
  };
  close(): void;
}

interface SQLiteModule {
  DatabaseSync: new (path: string) => SQLiteDatabase;
}

function loadSQLiteModule(): SQLiteModule {
  const runtimeRequire =
    eval("require") as NodeRequire;

  return runtimeRequire(
    "node:" + "sqlite",
  ) as SQLiteModule;
}

const { DatabaseSync } = loadSQLiteModule();

describe("SQLite constitutional evidence replay store — restart-persistent ambiguity", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots.splice(0)) {
      rmSync(root, {
        recursive: true,
        force: true,
      });
    }
  });

  it("never treats a durable in_progress nonce as fresh after process restart", async () => {
    const root = mkdtempSync(
      join(tmpdir(), "nexus-constitutional-replay-ambiguity-"),
    );
    tempRoots.push(root);

    const databasePath = join(
      root,
      "constitutional-replay.sqlite",
    );

    const database =
      new DatabaseSync(databasePath);

    database.exec(`
      CREATE TABLE nexus_constitutional_replay_reservations (
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

    database
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
        "tenant-ambiguous",
        "issuer-ambiguous",
        "issuer-key-ambiguous",
        "nonce-ambiguous",
        "interrupted-attempt",
        "2026-08-23T00:00:00.000Z",
      );

    database.close();

    const scope = {
      tenantId: "tenant-ambiguous",
      evidenceIssuerId: "issuer-ambiguous",
      evidenceIssuerKeyId: "issuer-key-ambiguous",
      nonce: "nonce-ambiguous",
    };

    const firstRestart =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );

    expect(
      await firstRestart.reserveReplayNonceScope(scope),
    ).toBe("ALREADY_USED");

    firstRestart.close();

    const secondRestart =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );

    expect(
      await secondRestart.reserveReplayNonceScope(scope),
    ).toBe("ALREADY_USED");

    secondRestart.close();
  });
});