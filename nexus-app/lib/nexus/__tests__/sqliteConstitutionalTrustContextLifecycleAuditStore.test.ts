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
  createConstitutionalTrustContextLifecycleAuditRecord,
} from "../aiWorkforceConstitutionalTrustContextLifecycleAudit";
import {
  SQLiteConstitutionalTrustContextLifecycleAuditStore,
} from "../sqliteConstitutionalTrustContextLifecycleAuditStore";

interface SQLiteStatement {
  run(
    ...parameters: unknown[]
  ): {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  };
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

function loadSQLiteModule(): SQLiteModule {
  const runtimeRequire =
    eval("require") as NodeRequire;

  return runtimeRequire(
    "node:" + "sqlite",
  ) as SQLiteModule;
}

const { DatabaseSync } =
  loadSQLiteModule();

describe("SQLite constitutional trust-context lifecycle audit store", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (
      const root of tempRoots.splice(0)
    ) {
      rmSync(
        root,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });

  it("persists and verifies an audit chain across restart without granting trust", async () => {
    const root =
      mkdtempSync(
        join(
          tmpdir(),
          "nexus-trust-lifecycle-audit-restart-",
        ),
      );
    tempRoots.push(root);

    const databasePath =
      join(
        root,
        "trust-lifecycle.sqlite",
      );

    const first =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId: "lifecycle-restart",
        eventId: "event-1",
        sequence: 1,
        event: "ACTIVATED",
        trustContextDigest:
          "a".repeat(64),
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason:
          "Initial lifecycle observation.",
      });

    const firstStore =
      new SQLiteConstitutionalTrustContextLifecycleAuditStore(
        databasePath,
      );

    expect(
      await firstStore.append(first),
    ).toBe("APPENDED");

    firstStore.close();

    const restarted =
      new SQLiteConstitutionalTrustContextLifecycleAuditStore(
        databasePath,
      );

    expect(
      await restarted.append(first),
    ).toBe("ALREADY_PRESENT");

    const second =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId:
          "lifecycle-restart",
        eventId: "event-2",
        sequence: 2,
        event: "ROTATED",
        trustContextDigest:
          "b".repeat(64),
        previousRecordDigest:
          first.recordDigest,
        observedAt:
          "2026-08-23T01:00:00.000Z",
        reason:
          "Rotation lifecycle observation.",
      });

    expect(
      await restarted.append(second),
    ).toBe("APPENDED");

    expect(
      await restarted.verifyLifecycleChain(
        "lifecycle-restart",
      ),
    ).toEqual({
      valid: true,
      recordCount: 2,
      failureCodes: [],
      productionTrustEstablished: false,
      trustedTimeEstablished: false,
      runtimeIntegrationAuthorized: false,
      constitutionalExecutionAuthorityGranted:
        false,
    });

    restarted.close();

    const secondRestart =
      new SQLiteConstitutionalTrustContextLifecycleAuditStore(
        databasePath,
      );

    const verification =
      await secondRestart.verifyLifecycleChain(
        "lifecycle-restart",
      );

    expect(verification.valid).toBe(true);
    expect(verification.recordCount).toBe(2);
    expect(
      verification.productionTrustEstablished,
    ).toBe(false);
    expect(
      verification.trustedTimeEstablished,
    ).toBe(false);
    expect(
      verification.runtimeIntegrationAuthorized,
    ).toBe(false);

    secondRestart.close();
  });

  it("enforces append-only persistence against direct UPDATE and DELETE", async () => {
    const root =
      mkdtempSync(
        join(
          tmpdir(),
          "nexus-trust-lifecycle-audit-immutable-",
        ),
      );
    tempRoots.push(root);

    const databasePath =
      join(
        root,
        "trust-lifecycle.sqlite",
      );

    const record =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId:
          "lifecycle-immutable",
        eventId: "event-1",
        sequence: 1,
        event: "ACTIVATED",
        trustContextDigest:
          "c".repeat(64),
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason:
          "Append-only lifecycle observation.",
      });

    const store =
      new SQLiteConstitutionalTrustContextLifecycleAuditStore(
        databasePath,
      );

    expect(
      await store.append(record),
    ).toBe("APPENDED");

    store.close();

    const raw =
      new DatabaseSync(databasePath);

    expect(() =>
      raw
        .prepare(`
          UPDATE nexus_constitutional_trust_lifecycle_audit
          SET reason = ?
          WHERE lifecycle_id = ?
        `)
        .run(
          "forbidden mutation",
          "lifecycle-immutable",
        ),
    ).toThrow();

    expect(() =>
      raw
        .prepare(`
          DELETE FROM nexus_constitutional_trust_lifecycle_audit
          WHERE lifecycle_id = ?
        `)
        .run(
          "lifecycle-immutable",
        ),
    ).toThrow();

    raw.close();
  });

  it("detects raw persisted-record tampering after restart", async () => {
    const root =
      mkdtempSync(
        join(
          tmpdir(),
          "nexus-trust-lifecycle-audit-tamper-",
        ),
      );
    tempRoots.push(root);

    const databasePath =
      join(
        root,
        "trust-lifecycle.sqlite",
      );

    const record =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId:
          "lifecycle-tamper",
        eventId: "event-1",
        sequence: 1,
        event: "ACTIVATED",
        trustContextDigest:
          "d".repeat(64),
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason:
          "Original lifecycle observation.",
      });

    const store =
      new SQLiteConstitutionalTrustContextLifecycleAuditStore(
        databasePath,
      );

    expect(
      await store.append(record),
    ).toBe("APPENDED");

    store.close();

    const raw =
      new DatabaseSync(databasePath);

    raw.exec(`
      DROP TRIGGER IF EXISTS nexus_constitutional_trust_lifecycle_no_update;
    `);

    raw
      .prepare(`
        UPDATE nexus_constitutional_trust_lifecycle_audit
        SET reason = ?
        WHERE lifecycle_id = ?
      `)
      .run(
        "tampered lifecycle observation",
        "lifecycle-tamper",
      );

    raw.close();

    const restarted =
      new SQLiteConstitutionalTrustContextLifecycleAuditStore(
        databasePath,
      );

    const verification =
      await restarted.verifyLifecycleChain(
        "lifecycle-tamper",
      );

    expect(verification.valid).toBe(false);
    expect(
      verification.failureCodes,
    ).toContain(
      "TRUST_LIFECYCLE_AUDIT_DIGEST_MISMATCH",
    );

    restarted.close();
  });
});