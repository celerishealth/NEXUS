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

describe("SQLite constitutional evidence replay store — isolated Phase 0 durability", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots.splice(0)) {
      rmSync(root, {
        recursive: true,
        force: true,
      });
    }
  });

  it("persists exact nonce scope across close and reopen without granting a fresh reservation", async () => {
    const root = mkdtempSync(
      join(tmpdir(), "nexus-constitutional-replay-isolated-"),
    );
    tempRoots.push(root);

    const databasePath = join(
      root,
      "constitutional-replay.sqlite",
    );

    const scope = {
      tenantId: "tenant-1",
      evidenceIssuerId: "issuer-1",
      evidenceIssuerKeyId: "issuer-key-1",
      nonce: "nonce-1",
    };

    const firstStore =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );

    expect(
      await firstStore.reserveReplayNonceScope(scope),
    ).toBe("RESERVED");

    expect(
      await firstStore.reserveReplayNonceScope(scope),
    ).toBe("ALREADY_USED");

    firstStore.close();

    const restartedStore =
      new SQLiteConstitutionalEvidenceReplayStore(
        databasePath,
      );

    expect(
      await restartedStore.reserveReplayNonceScope(scope),
    ).toBe("ALREADY_USED");

    expect(
      await restartedStore.reserveReplayNonceScope({
        ...scope,
        tenantId: "tenant-2",
      }),
    ).toBe("RESERVED");

    restartedStore.close();
  });
});