import { describe, expect, it } from "vitest";
import {
  createConstitutionalEvidenceReplayIdentity,
  createConstitutionalEvidenceReplayNonceScope,
  guardConstitutionalEvidenceReplay,
  type ConstitutionalEvidenceReplayGuardResult,
  type ConstitutionalEvidenceReplayStore,
} from "../aiWorkforceConstitutionalEvidenceReplayGuard";

const baseIdentity = () => ({
  tenantId: "tenant-1",
  evidenceIssuerId: "issuer-1",
  evidenceIssuerKeyId: "key-1",
  actionId: "action-1",
  nonce: "nonce-1",
});

function expectAllExecutionAuthorityFalse(
  result: ConstitutionalEvidenceReplayGuardResult,
) {
  expect(result.constitutionalExecutionAuthorityGranted).toBe(false);
  expect(result.providerExecutionAuthorized).toBe(false);
  expect(result.paymentExecutionAuthorized).toBe(false);
  expect(result.legalFilingAuthorized).toBe(false);
  expect(result.externalDeliveryAuthorized).toBe(false);
  expect(result.publicLaunchAuthorized).toBe(false);
}

describe("AI Workforce Constitutional Evidence Replay Guard — Phase 0 fail-closed contract", () => {
  it("normalizes replay identity without granting authority", () => {
    const identity = createConstitutionalEvidenceReplayIdentity({
      tenantId: " tenant-1 ",
      evidenceIssuerId: " issuer-1 ",
      evidenceIssuerKeyId: " key-1 ",
      actionId: " action-1 ",
      nonce: " nonce-1 ",
    });

    expect(identity).toEqual(baseIdentity());
    expect(Object.isFrozen(identity)).toBe(true);
  });

  it("normalizes nonce uniqueness scope without actionId", () => {
    const first = createConstitutionalEvidenceReplayNonceScope({
      tenantId: " tenant-1 ",
      evidenceIssuerId: " issuer-1 ",
      evidenceIssuerKeyId: " key-1 ",
      actionId: " action-1 ",
      nonce: " nonce-1 ",
    });

    const second = createConstitutionalEvidenceReplayNonceScope({
      tenantId: "tenant-1",
      evidenceIssuerId: "issuer-1",
      evidenceIssuerKeyId: "key-1",
      actionId: "different-action",
      nonce: "nonce-1",
    });

    expect(first).toEqual({
      tenantId: "tenant-1",
      evidenceIssuerId: "issuer-1",
      evidenceIssuerKeyId: "key-1",
      nonce: "nonce-1",
    });
    expect(second).toEqual(first);
    expect("actionId" in first).toBe(false);
    expect(Object.isFrozen(first)).toBe(true);
  });
  it("rejects invalid replay identity", async () => {
    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        return "RESERVED";
      },
    };

    const result = await guardConstitutionalEvidenceReplay(
      {
        ...baseIdentity(),
        nonce: " ",
      },
      store,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_IDENTITY_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects unavailable replay store", async () => {
    const result = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      null,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("fails closed when replay store throws", async () => {
    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        throw new Error("store unavailable");
      },
    };

    const result = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an already-used replay identity", async () => {
    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        return "ALREADY_USED";
      },
    };

    const result = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_DETECTED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("fails closed when replay store returns unavailable", async () => {
    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        return "UNAVAILABLE";
      },
    };

    const result = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("allows the same nonce in a different tenant scope without granting authority", async () => {
    const usedScopes = new Set<string>();

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(scope) {
        const key = JSON.stringify(scope);
        if (usedScopes.has(key)) {
          return "ALREADY_USED";
        }
        usedScopes.add(key);
        return "RESERVED";
      },
    };

    const first = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    const second = await guardConstitutionalEvidenceReplay(
      {
        ...baseIdentity(),
        tenantId: "tenant-2",
      },
      store,
    );

    expect(first.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(first.replayAccepted).toBe(true);
    expect(first.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(first);

    expect(second.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(second.replayAccepted).toBe(true);
    expect(second.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(second);
    expect(usedScopes.size).toBe(2);
  });
  it("allows the same nonce in a different issuer scope without granting authority", async () => {
    const usedScopes = new Set<string>();

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(scope) {
        const key = JSON.stringify(scope);
        if (usedScopes.has(key)) {
          return "ALREADY_USED";
        }
        usedScopes.add(key);
        return "RESERVED";
      },
    };

    const first = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    const second = await guardConstitutionalEvidenceReplay(
      {
        ...baseIdentity(),
        evidenceIssuerId: "issuer-2",
      },
      store,
    );

    expect(first.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(first.replayAccepted).toBe(true);
    expect(first.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(first);

    expect(second.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(second.replayAccepted).toBe(true);
    expect(second.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(second);
    expect(usedScopes.size).toBe(2);
  });
  it("allows the same nonce under a different issuer key without granting authority", async () => {
    const usedScopes = new Set<string>();

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(scope) {
        const key = JSON.stringify(scope);
        if (usedScopes.has(key)) {
          return "ALREADY_USED";
        }
        usedScopes.add(key);
        return "RESERVED";
      },
    };

    const first = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    const second = await guardConstitutionalEvidenceReplay(
      {
        ...baseIdentity(),
        evidenceIssuerKeyId: "key-2",
      },
      store,
    );

    expect(first.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(first.replayAccepted).toBe(true);
    expect(first.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(first);

    expect(second.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(second.replayAccepted).toBe(true);
    expect(second.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(second);
    expect(usedScopes.size).toBe(2);
  });
  it("blocks replay bypass attempts that differ only by surrounding whitespace", async () => {
    const usedScopes = new Set<string>();

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(scope) {
        const key = JSON.stringify(scope);
        if (usedScopes.has(key)) {
          return "ALREADY_USED";
        }
        usedScopes.add(key);
        return "RESERVED";
      },
    };

    const first = await guardConstitutionalEvidenceReplay(
      {
        tenantId: " tenant-1 ",
        evidenceIssuerId: " issuer-1 ",
        evidenceIssuerKeyId: " key-1 ",
        actionId: " action-1 ",
        nonce: " nonce-1 ",
      },
      store,
    );

    const second = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    expect(first.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(first.replayAccepted).toBe(true);
    expect(first.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(first);

    expect(second.replayState).toBe("REJECTED");
    expect(second.replayAccepted).toBe(false);
    expect(second.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_DETECTED",
    ]);
    expectAllExecutionAuthorityFalse(second);
    expect(usedScopes.size).toBe(1);
  });
  it("blocks nonce reuse across different actionId values in the same nonce scope", async () => {
    const usedScopes = new Set<string>();

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(scope) {
        const key = JSON.stringify(scope);
        if (usedScopes.has(key)) {
          return "ALREADY_USED";
        }
        usedScopes.add(key);
        return "RESERVED";
      },
    };

    const first = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    const second = await guardConstitutionalEvidenceReplay(
      {
        ...baseIdentity(),
        actionId: "action-2",
      },
      store,
    );

    expect(first.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(first.replayAccepted).toBe(true);
    expect(first.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(first);

    expect(second.replayState).toBe("REJECTED");
    expect(second.replayAccepted).toBe(false);
    expect(second.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_DETECTED",
    ]);
    expectAllExecutionAuthorityFalse(second);
    expect(usedScopes.size).toBe(1);
  });
  it("fails closed on an unknown replay-store runtime result", async () => {
    let replayStoreCallCount = 0;

    const store = {
      async reserveReplayNonceScope() {
        replayStoreCallCount += 1;
        return "CORRUPT_RUNTIME_RESULT";
      },
    } as unknown as ConstitutionalEvidenceReplayStore;

    const result = await guardConstitutionalEvidenceReplay(
      baseIdentity(),
      store,
    );

    expect(result.replayState).toBe("REJECTED");
    expect(result.replayAccepted).toBe(false);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE",
    ]);
    expect(replayStoreCallCount).toBe(1);
    expectAllExecutionAuthorityFalse(result);
  });
  it("still refuses authority after a fresh replay reservation", async () => {
    let reservedIdentity: ReturnType<
      typeof createConstitutionalEvidenceReplayNonceScope
    > | null = null;

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(identity) {
        reservedIdentity = identity;
        return "RESERVED";
      },
    };

    const result = await guardConstitutionalEvidenceReplay(
      {
        tenantId: " tenant-1 ",
        evidenceIssuerId: " issuer-1 ",
        evidenceIssuerKeyId: " key-1 ",
        actionId: " action-1 ",
        nonce: " nonce-1 ",
      },
      store,
    );

    expect(reservedIdentity).toEqual({
      tenantId: "tenant-1",
      evidenceIssuerId: "issuer-1",
      evidenceIssuerKeyId: "key-1",
      nonce: "nonce-1",
    });
    expect(result.replayState).toBe("REPLAY_RESERVED_NO_AUTHORITY");
    expect(result.replayAccepted).toBe(true);
    expect(result.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(result);
  });
});