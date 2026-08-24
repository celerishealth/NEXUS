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

describe("SQLite constitutional evidence replay store — storage unavailable fail closed", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots.splice(0)) {
      rmSync(root, {
        recursive: true,
        force: true,
      });
    }
  });

  it("returns UNAVAILABLE rather than RESERVED while another writer holds the isolated replay database", async () => {
    const root = mkdtempSync(
      join(tmpdir(), "nexus-constitutional-replay-unavailable-"),
    );
    tempRoots.push(root);

    const databasePath = join(
      root,
      "constitutional-replay.sqlite",
    );

    const initializer =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );
    initializer.close();

    const blocker =
      new DatabaseSync(databasePath);

    blocker.exec("PRAGMA busy_timeout = 50;");
    blocker.exec("BEGIN IMMEDIATE;");

    const store =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );

    try {
      expect(
        await store.reserveReplayNonceScope({
          tenantId: "tenant-unavailable",
          evidenceIssuerId: "issuer-unavailable",
          evidenceIssuerKeyId: "issuer-key-unavailable",
          nonce: "nonce-unavailable",
        }),
      ).toBe("UNAVAILABLE");
    } finally {
      store.close();
      blocker.exec("ROLLBACK;");
      blocker.close();
    }
  }, 10_000);
});