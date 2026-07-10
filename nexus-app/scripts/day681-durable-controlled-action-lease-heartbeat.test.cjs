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
  decideControlledActionLeaseHeartbeat,
  heartbeatControlledActionLease,
} = loadTypeScriptModule(
  "lib/nexus/durableControlledActionLeaseHeartbeat.ts",
);

function createRecord(overrides = {}) {
  return {
    actionId: "action-681",
    tenantId: "tenant-a",
    idempotencyKey: "tenant-a:action-681",
    ownerAuthorizationId: "approval-681",
    status: "executing",
    version: 10,
    attemptCount: 1,
    leaseOwner: "worker-a",
    leaseFence: 6,
    leaseExpiresAt: "2026-07-10T14:01:00.000Z",
    updatedAt: "2026-07-10T13:59:00.000Z",
    lastHeartbeatToken: null,
    lastHeartbeatAt: null,
    lastHeartbeatLeaseOwner: null,
    lastHeartbeatLeaseFence: null,
    leaseRevokedAt: null,
    leaseRevocationReason: null,
    ...overrides,
  };
}

function createRequest(overrides = {}) {
  return {
    actionId: "action-681",
    tenantId: "tenant-a",
    expectedVersion: 10,
    leaseOwner: "worker-a",
    leaseFence: 6,
    now: "2026-07-10T14:00:30.000Z",
    extensionMs: 120_000,
    heartbeatToken: "heartbeat-681",
    auditId: "audit-681",
    killSwitchEngaged: false,
    ...overrides,
  };
}

function createStore(initialRecord, forcedResult = null) {
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

    async commitLeaseMutation(input) {
      if (forcedResult) {
        return forcedResult;
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

test("atomically renews the active fenced lease and writes audit evidence", async () => {
  const store = createStore(createRecord());

  const result = await heartbeatControlledActionLease(
    store,
    createRequest(),
  );

  assert.equal(result.committed, true);
  assert.equal(
    result.decision.reason,
    "LEASE_RENEWAL_COMMITTED",
  );
  assert.equal(result.record.version, 11);
  assert.equal(result.record.status, "executing");
  assert.equal(result.record.leaseOwner, "worker-a");
  assert.equal(result.record.leaseFence, 6);
  assert.equal(
    result.record.leaseExpiresAt,
    "2026-07-10T14:02:30.000Z",
  );
  assert.equal(
    result.record.lastHeartbeatToken,
    "heartbeat-681",
  );

  const events = store.getAuditEvents();

  assert.equal(events.length, 1);
  assert.equal(
    events[0].eventType,
    "CONTROLLED_ACTION_LEASE_RENEWED",
  );
  assert.equal(events[0].previousVersion, 10);
  assert.equal(events[0].committedVersion, 11);
});

test("accepts an exact heartbeat replay without a second audit event", async () => {
  const store = createStore(createRecord());
  const request = createRequest();

  const first = await heartbeatControlledActionLease(
    store,
    request,
  );

  const replay = await heartbeatControlledActionLease(
    store,
    request,
  );

  assert.equal(first.committed, true);
  assert.equal(replay.committed, false);
  assert.equal(
    replay.decision.reason,
    "HEARTBEAT_REPLAY_ACCEPTED",
  );
  assert.equal(store.getAuditEvents().length, 1);
});

test("kill switch atomically revokes the active lease and blocks the action", async () => {
  const store = createStore(createRecord());

  const result = await heartbeatControlledActionLease(
    store,
    createRequest({
      killSwitchEngaged: true,
    }),
  );

  assert.equal(result.committed, true);
  assert.equal(
    result.decision.reason,
    "LEASE_REVOCATION_COMMITTED",
  );
  assert.equal(result.record.status, "blocked");
  assert.equal(result.record.version, 11);
  assert.equal(result.record.leaseOwner, null);
  assert.equal(result.record.leaseExpiresAt, null);
  assert.equal(
    result.record.leaseRevocationReason,
    "KILL_SWITCH_ENGAGED",
  );

  const events = store.getAuditEvents();

  assert.equal(events.length, 1);
  assert.equal(
    events[0].eventType,
    "CONTROLLED_ACTION_LEASE_REVOKED",
  );
  assert.equal(
    events[0].revocationReason,
    "KILL_SWITCH_ENGAGED",
  );
});

test("blocks a stale worker using an obsolete lease fence", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord({ leaseFence: 7 }),
    createRequest({ leaseFence: 6 }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "LEASE_FENCE_MISMATCH",
  });
});

test("blocks a worker that does not own the active lease", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord(),
    createRequest({ leaseOwner: "worker-b" }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "LEASE_OWNER_MISMATCH",
  });
});

test("blocks heartbeat after lease expiry", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord({
      leaseExpiresAt: "2026-07-10T14:00:00.000Z",
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "LEASE_EXPIRED",
  });
});

test("fails closed on tenant mismatch", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord(),
    createRequest({ tenantId: "tenant-b" }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "TENANT_MISMATCH",
  });
});

test("requires durable owner authorization", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord({ ownerAuthorizationId: null }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "OWNER_AUTHORIZATION_REQUIRED",
  });
});

test("requires a durable idempotency key", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord({ idempotencyKey: null }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "IDEMPOTENCY_KEY_REQUIRED",
  });
});

test("does not shorten an already longer active lease", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord({
      leaseExpiresAt: "2026-07-10T14:10:00.000Z",
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "wait",
    reason: "LEASE_EXTENSION_NOT_REQUIRED",
  });
});

test("atomic version conflict leaves the durable state unchanged", async () => {
  const store = createStore(
    createRecord(),
    "version_conflict",
  );

  const result = await heartbeatControlledActionLease(
    store,
    createRequest(),
  );

  assert.equal(result.committed, false);
  assert.equal(
    result.decision.reason,
    "ATOMIC_VERSION_CONFLICT",
  );
  assert.equal(result.record.version, 10);
  assert.equal(
    result.record.leaseExpiresAt,
    "2026-07-10T14:01:00.000Z",
  );
  assert.equal(store.getAuditEvents().length, 0);
});

test("terminal controlled actions cannot receive a new lease heartbeat", () => {
  const decision = decideControlledActionLeaseHeartbeat(
    createRecord({
      status: "succeeded",
      leaseOwner: null,
      leaseExpiresAt: null,
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "complete",
    reason: "TERMINAL_STATE",
  });
});
