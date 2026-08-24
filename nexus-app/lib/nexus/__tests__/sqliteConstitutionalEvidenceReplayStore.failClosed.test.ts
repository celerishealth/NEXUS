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

describe("SQLite constitutional evidence replay store — malformed persistence fail closed", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots.splice(0)) {
      rmSync(root, {
        recursive: true,
        force: true,
      });
    }
  });

  it("returns UNAVAILABLE instead of treating a malformed existing replay table as fresh", async () => {
    const root = mkdtempSync(
      join(tmpdir(), "nexus-constitutional-replay-malformed-"),
    );
    tempRoots.push(root);

    const databasePath = join(
      root,
      "constitutional-replay.sqlite",
    );

    const malformedDatabase =
      new DatabaseSync(databasePath);

    malformedDatabase.exec(`
      CREATE TABLE nexus_constitutional_replay_reservations (
        tenant_id TEXT NOT NULL,
        nonce TEXT NOT NULL
      );
    `);

    malformedDatabase.close();

    const store =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );

    try {
      expect(
        await store.reserveReplayNonceScope({
          tenantId: "tenant-malformed",
          evidenceIssuerId: "issuer-malformed",
          evidenceIssuerKeyId: "issuer-key-malformed",
          nonce: "nonce-malformed",
        }),
      ).toBe("UNAVAILABLE");
    } finally {
      store.close();
    }
  });
});