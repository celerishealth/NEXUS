const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const Module = require("node:module");
const ts = require("typescript");

function loadTypeScriptModule(relativePath) {
  const filename = path.resolve(process.cwd(), relativePath);
  const source = fs.readFileSync(filename, "utf8");

  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
    },
    fileName: filename,
    reportDiagnostics: true,
  });

  const errors = (output.diagnostics || []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  assert.equal(
    errors.length,
    0,
    errors
      .map((diagnostic) =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      )
      .join("\n"),
  );

  const loadedModule = new Module(filename, module);
  loadedModule.filename = filename;
  loadedModule.paths = Module._nodeModulePaths(path.dirname(filename));
  loadedModule._compile(output.outputText, filename);

  return loadedModule.exports;
}

const {
  claimControlledActionRecovery,
  decideControlledActionRecovery,
} = loadTypeScriptModule(
  "lib/nexus/durableControlledActionRecovery.ts",
);

const now = "2026-07-10T12:00:00.000Z";

function createRecord(overrides = {}) {
  return {
    actionId: "action-679",
    tenantId: "tenant-a",
    idempotencyKey: "tenant-a:action-679",
    ownerAuthorizationId: "approval-679",
    status: "authorized",
    version: 4,
    attemptCount: 0,
    maxAttempts: 3,
    retryable: true,
    updatedAt: "2026-07-10T11:50:00.000Z",
    leaseOwner: null,
    leaseExpiresAt: null,
    nextAttemptAt: null,
    lastError: null,
    lastRecoveryToken: null,
    lastRecoveredAt: null,
    ...overrides,
  };
}

function createContext(overrides = {}) {
  return {
    tenantId: "tenant-a",
    now,
    leaseOwner: "recovery-worker-1",
    leaseDurationMs: 60_000,
    recoveryToken: "recovery-token-679",
    killSwitchEngaged: false,
    ...overrides,
  };
}

function createStore(initialRecord, forceCompareAndSetFailure = false) {
  let record = initialRecord ? structuredClone(initialRecord) : null;

  return {
    async read(actionId) {
      if (!record || record.actionId !== actionId) {
        return null;
      }

      return structuredClone(record);
    },

    async compareAndSet(actionId, expectedVersion, nextRecord) {
      if (forceCompareAndSetFailure) {
        return false;
      }

      if (
        !record ||
        record.actionId !== actionId ||
        record.version !== expectedVersion
      ) {
        return false;
      }

      record = structuredClone(nextRecord);
      return true;
    },
  };
}

test("claims an authorized controlled action using compare-and-set", async () => {
  const store = createStore(createRecord());

  const result = await claimControlledActionRecovery(
    store,
    "action-679",
    createContext(),
  );

  assert.equal(result.claimed, true);
  assert.equal(result.decision.reason, "RECOVERY_CLAIM_ALLOWED");
  assert.equal(result.record.status, "executing");
  assert.equal(result.record.version, 5);
  assert.equal(result.record.attemptCount, 1);
  assert.equal(result.record.leaseOwner, "recovery-worker-1");
  assert.equal(result.record.lastRecoveryToken, "recovery-token-679");
  assert.equal(
    result.record.leaseExpiresAt,
    "2026-07-10T12:01:00.000Z",
  );
});

test("does not execute the same recovery token twice", async () => {
  const store = createStore(createRecord());

  const first = await claimControlledActionRecovery(
    store,
    "action-679",
    createContext(),
  );

  const replay = await claimControlledActionRecovery(
    store,
    "action-679",
    createContext(),
  );

  assert.equal(first.claimed, true);
  assert.equal(replay.claimed, false);
  assert.equal(replay.decision.reason, "DUPLICATE_RECOVERY_TOKEN");
  assert.equal(replay.record.attemptCount, 1);
});

test("waits while another execution lease remains active", () => {
  const decision = decideControlledActionRecovery(
    createRecord({
      status: "executing",
      attemptCount: 1,
      leaseOwner: "worker-existing",
      leaseExpiresAt: "2026-07-10T12:05:00.000Z",
    }),
    createContext(),
  );

  assert.deepEqual(decision, {
    disposition: "wait",
    reason: "ACTIVE_EXECUTION_LEASE",
  });
});

test("reclaims an expired execution lease after restart", async () => {
  const store = createStore(
    createRecord({
      status: "executing",
      attemptCount: 1,
      leaseOwner: "worker-crashed",
      leaseExpiresAt: "2026-07-10T11:59:00.000Z",
    }),
  );

  const result = await claimControlledActionRecovery(
    store,
    "action-679",
    createContext(),
  );

  assert.equal(result.claimed, true);
  assert.equal(result.record.attemptCount, 2);
  assert.equal(result.record.leaseOwner, "recovery-worker-1");
});

test("fails closed when the operational kill switch is engaged", () => {
  const decision = decideControlledActionRecovery(
    createRecord(),
    createContext({ killSwitchEngaged: true }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "KILL_SWITCH_ENGAGED",
  });
});

test("fails closed on tenant mismatch", () => {
  const decision = decideControlledActionRecovery(
    createRecord(),
    createContext({ tenantId: "tenant-b" }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "TENANT_MISMATCH",
  });
});

test("fails closed without owner authorization", () => {
  const decision = decideControlledActionRecovery(
    createRecord({ ownerAuthorizationId: null }),
    createContext(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "OWNER_AUTHORIZATION_REQUIRED",
  });
});

test("blocks recovery after maximum attempts are exhausted", () => {
  const decision = decideControlledActionRecovery(
    createRecord({
      status: "failed",
      attemptCount: 3,
      maxAttempts: 3,
    }),
    createContext(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "ATTEMPTS_EXHAUSTED",
  });
});

test("does not retry before durable retry time", () => {
  const decision = decideControlledActionRecovery(
    createRecord({
      status: "failed",
      attemptCount: 1,
      nextAttemptAt: "2026-07-10T12:10:00.000Z",
    }),
    createContext(),
  );

  assert.deepEqual(decision, {
    disposition: "wait",
    reason: "RETRY_NOT_DUE",
  });
});

test("losing a compare-and-set race does not claim execution", async () => {
  const store = createStore(createRecord(), true);

  const result = await claimControlledActionRecovery(
    store,
    "action-679",
    createContext(),
  );

  assert.equal(result.claimed, false);
  assert.equal(result.decision.reason, "CONCURRENT_RECOVERY_CLAIM");
});

test("terminal actions are never recovered or re-executed", () => {
  const decision = decideControlledActionRecovery(
    createRecord({
      status: "succeeded",
      attemptCount: 1,
    }),
    createContext(),
  );

  assert.deepEqual(decision, {
    disposition: "complete",
    reason: "TERMINAL_STATE",
  });
});
