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
    (diagnostic) =>
      diagnostic.category === ts.DiagnosticCategory.Error,
  );

  assert.equal(
    errors.length,
    0,
    errors
      .map((diagnostic) =>
        ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n",
        ),
      )
      .join("\n"),
  );

  const loadedModule = new Module(filename, module);
  loadedModule.filename = filename;
  loadedModule.paths = Module._nodeModulePaths(
    path.dirname(filename),
  );
  loadedModule._compile(output.outputText, filename);

  return loadedModule.exports;
}

const {
  decideControlledActionFinalization,
  finalizeControlledAction,
} = loadTypeScriptModule(
  "lib/nexus/durableControlledActionFinalization.ts",
);

function createRecord(overrides = {}) {
  return {
    actionId: "action-680",
    tenantId: "tenant-a",
    idempotencyKey: "tenant-a:action-680",
    ownerAuthorizationId: "owner-approval-680",
    status: "executing",
    version: 7,
    attemptCount: 1,
    leaseOwner: "worker-a",
    leaseFence: 4,
    leaseExpiresAt: "2026-07-10T13:05:00.000Z",
    updatedAt: "2026-07-10T12:59:00.000Z",
    terminalAt: null,
    terminalCommitToken: null,
    outcomeDigest: null,
    terminalReasonCode: null,
    ...overrides,
  };
}

function createRequest(overrides = {}) {
  return {
    actionId: "action-680",
    tenantId: "tenant-a",
    expectedVersion: 7,
    leaseOwner: "worker-a",
    leaseFence: 4,
    now: "2026-07-10T13:00:00.000Z",
    finalStatus: "succeeded",
    terminalCommitToken: "terminal-commit-680",
    auditId: "audit-680",
    outcomeDigest: "sha256:outcome-680",
    terminalReasonCode: null,
    ...overrides,
  };
}

function createStore(
  initialRecord,
  forcedCommitResult = null,
) {
  let record = initialRecord
    ? structuredClone(initialRecord)
    : null;

  const auditEvents = new Map();

  return {
    async read(actionId) {
      if (!record || record.actionId !== actionId) {
        return null;
      }

      return structuredClone(record);
    },

    async commitFinalization(input) {
      if (forcedCommitResult) {
        return forcedCommitResult;
      }

      if (
        !record ||
        record.actionId !== input.actionId ||
        record.version !== input.expectedVersion
      ) {
        return "version_conflict";
      }

      if (
        record.leaseOwner !== input.expectedLeaseOwner ||
        record.leaseFence !== input.expectedLeaseFence
      ) {
        return "lease_conflict";
      }

      if (auditEvents.has(input.auditEvent.auditId)) {
        return "audit_conflict";
      }

      record = structuredClone(input.nextRecord);
      auditEvents.set(
        input.auditEvent.auditId,
        structuredClone(input.auditEvent),
      );

      return "committed";
    },

    getAuditEvents() {
      return Array.from(auditEvents.values()).map((event) =>
        structuredClone(event),
      );
    },
  };
}

test("atomically commits successful terminal state and audit evidence", async () => {
  const store = createStore(createRecord());

  const result = await finalizeControlledAction(
    store,
    createRequest(),
  );

  assert.equal(result.committed, true);
  assert.equal(result.decision.reason, "FINALIZATION_COMMITTED");
  assert.equal(result.record.status, "succeeded");
  assert.equal(result.record.version, 8);
  assert.equal(result.record.leaseOwner, null);
  assert.equal(result.record.leaseExpiresAt, null);
  assert.equal(
    result.record.terminalCommitToken,
    "terminal-commit-680",
  );

  const auditEvents = store.getAuditEvents();

  assert.equal(auditEvents.length, 1);
  assert.equal(
    auditEvents[0].eventType,
    "CONTROLLED_ACTION_FINALIZED",
  );
  assert.equal(auditEvents[0].previousVersion, 7);
  assert.equal(auditEvents[0].committedVersion, 8);
  assert.equal(auditEvents[0].leaseFence, 4);
});

test("accepts an exact terminal replay without writing a second audit event", async () => {
  const store = createStore(createRecord());
  const request = createRequest();

  const first = await finalizeControlledAction(store, request);
  const replay = await finalizeControlledAction(store, request);

  assert.equal(first.committed, true);
  assert.equal(replay.committed, false);
  assert.equal(
    replay.decision.reason,
    "TERMINAL_REPLAY_ACCEPTED",
  );
  assert.equal(store.getAuditEvents().length, 1);
});

test("blocks a stale worker with an obsolete lease fence", () => {
  const decision = decideControlledActionFinalization(
    createRecord({ leaseFence: 5 }),
    createRequest({ leaseFence: 4 }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "LEASE_FENCE_MISMATCH",
  });
});

test("blocks a worker that does not own the active lease", () => {
  const decision = decideControlledActionFinalization(
    createRecord(),
    createRequest({ leaseOwner: "worker-b" }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "LEASE_OWNER_MISMATCH",
  });
});

test("blocks finalization after the execution lease expires", () => {
  const decision = decideControlledActionFinalization(
    createRecord({
      leaseExpiresAt: "2026-07-10T12:59:59.000Z",
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "LEASE_EXPIRED",
  });
});

test("fails closed on tenant mismatch", () => {
  const decision = decideControlledActionFinalization(
    createRecord(),
    createRequest({ tenantId: "tenant-b" }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "TENANT_MISMATCH",
  });
});

test("requires durable owner authorization", () => {
  const decision = decideControlledActionFinalization(
    createRecord({ ownerAuthorizationId: null }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "OWNER_AUTHORIZATION_REQUIRED",
  });
});

test("requires an idempotency key before terminal commit", () => {
  const decision = decideControlledActionFinalization(
    createRecord({ idempotencyKey: null }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "IDEMPOTENCY_KEY_REQUIRED",
  });
});

test("requires an outcome digest for successful completion", () => {
  const decision = decideControlledActionFinalization(
    createRecord(),
    createRequest({ outcomeDigest: null }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "SUCCESS_OUTCOME_DIGEST_REQUIRED",
  });
});

test("commits a failed outcome only with a durable reason code", async () => {
  const store = createStore(createRecord());

  const result = await finalizeControlledAction(
    store,
    createRequest({
      finalStatus: "failed",
      outcomeDigest: null,
      terminalReasonCode: "PROVIDER_TIMEOUT",
    }),
  );

  assert.equal(result.committed, true);
  assert.equal(result.record.status, "failed");
  assert.equal(
    result.record.terminalReasonCode,
    "PROVIDER_TIMEOUT",
  );
  assert.equal(store.getAuditEvents().length, 1);
});

test("requires a durable cancellation reason", () => {
  const decision = decideControlledActionFinalization(
    createRecord(),
    createRequest({
      finalStatus: "cancelled",
      outcomeDigest: null,
      terminalReasonCode: null,
    }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "CANCELLATION_REASON_REQUIRED",
  });
});

test("does not update state when the atomic version check loses a race", async () => {
  const store = createStore(
    createRecord(),
    "version_conflict",
  );

  const result = await finalizeControlledAction(
    store,
    createRequest(),
  );

  assert.equal(result.committed, false);
  assert.equal(
    result.decision.reason,
    "ATOMIC_VERSION_CONFLICT",
  );
  assert.equal(result.record.status, "executing");
  assert.equal(store.getAuditEvents().length, 0);
});

test("rejects a conflicting terminal commit token", () => {
  const decision = decideControlledActionFinalization(
    createRecord({
      status: "succeeded",
      version: 8,
      leaseOwner: null,
      leaseExpiresAt: null,
      terminalAt: "2026-07-10T13:00:00.000Z",
      terminalCommitToken: "different-terminal-token",
      outcomeDigest: "sha256:outcome-680",
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "TERMINAL_COMMIT_CONFLICT",
  });
});
