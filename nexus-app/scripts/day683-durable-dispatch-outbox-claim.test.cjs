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
  claimDurableDispatchOutbox,
  decideDurableDispatchOutboxClaim,
} = loadTypeScriptModule(
  "lib/nexus/durableDispatchOutboxClaim.ts",
);

function createRecord(overrides = {}) {
  return {
    outboxId: "outbox-683",
    tenantId: "tenant-a",
    actionId: "action-683",
    idempotencyKey: "tenant-a:action-683",
    dispatchToken: "dispatch-token-683",
    effectType: "CUSTOMER_MESSAGE_DELIVERY",
    payloadDigest: "sha256:payload-683",
    status: "pending",
    version: 3,
    deliveryAttemptCount: 0,
    maxDeliveryAttempts: 4,
    nextAttemptAt: "2026-07-10T15:59:00.000Z",
    leaseOwner: null,
    leaseFence: 0,
    leaseExpiresAt: null,
    lastClaimToken: null,
    lastClaimedAt: null,
    lastClaimLeaseOwner: null,
    lastClaimLeaseFence: null,
    updatedAt: "2026-07-10T15:59:00.000Z",
    ...overrides,
  };
}

function createRequest(overrides = {}) {
  return {
    outboxId: "outbox-683",
    tenantId: "tenant-a",
    expectedVersion: 3,
    workerId: "dispatch-worker-a",
    claimToken: "claim-token-683",
    auditId: "audit-683",
    now: "2026-07-10T16:00:00.000Z",
    leaseDurationMs: 120_000,
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
    async readOutbox(outboxId) {
      if (!record || record.outboxId !== outboxId) {
        return null;
      }

      return structuredClone(record);
    },

    async commitClaim(input) {
      if (forcedResult) {
        return forcedResult;
      }

      if (
        !record ||
        record.outboxId !== input.outboxId ||
        record.version !== input.expectedVersion
      ) {
        return "version_conflict";
      }

      if (record.status !== input.previousStatus) {
        return "state_conflict";
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

test("atomically claims a due dispatch record with a fenced lease", async () => {
  const store = createStore(createRecord());

  const result = await claimDurableDispatchOutbox(
    store,
    createRequest(),
  );

  assert.equal(result.committed, true);
  assert.equal(result.decision.reason, "CLAIM_COMMITTED");
  assert.equal(result.record.status, "delivering");
  assert.equal(result.record.version, 4);
  assert.equal(result.record.deliveryAttemptCount, 1);
  assert.equal(result.record.leaseOwner, "dispatch-worker-a");
  assert.equal(result.record.leaseFence, 1);
  assert.equal(
    result.record.leaseExpiresAt,
    "2026-07-10T16:02:00.000Z",
  );
  assert.equal(
    result.record.lastClaimToken,
    "claim-token-683",
  );

  const events = store.getAuditEvents();

  assert.equal(events.length, 1);
  assert.equal(
    events[0].eventType,
    "DISPATCH_OUTBOX_CLAIMED",
  );
  assert.equal(events[0].previousVersion, 3);
  assert.equal(events[0].committedVersion, 4);
  assert.equal(events[0].leaseFence, 1);
});

test("accepts an exact claim replay without incrementing attempts twice", async () => {
  const store = createStore(createRecord());
  const request = createRequest();

  const first = await claimDurableDispatchOutbox(
    store,
    request,
  );

  const replay = await claimDurableDispatchOutbox(
    store,
    request,
  );

  assert.equal(first.committed, true);
  assert.equal(replay.committed, false);
  assert.equal(
    replay.decision.reason,
    "CLAIM_REPLAY_ACCEPTED",
  );
  assert.equal(replay.record.deliveryAttemptCount, 1);
  assert.equal(store.getAuditEvents().length, 1);
});

test("waits while another worker holds an active delivery lease", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord({
      status: "delivering",
      deliveryAttemptCount: 1,
      leaseOwner: "existing-worker",
      leaseFence: 1,
      leaseExpiresAt: "2026-07-10T16:05:00.000Z",
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "wait",
    reason: "ACTIVE_DELIVERY_LEASE",
  });
});

test("reclaims an expired delivery lease with a higher fence", async () => {
  const store = createStore(
    createRecord({
      status: "delivering",
      version: 8,
      deliveryAttemptCount: 1,
      leaseOwner: "crashed-worker",
      leaseFence: 3,
      leaseExpiresAt: "2026-07-10T15:59:00.000Z",
    }),
  );

  const result = await claimDurableDispatchOutbox(
    store,
    createRequest({
      expectedVersion: 8,
    }),
  );

  assert.equal(result.committed, true);
  assert.equal(result.record.version, 9);
  assert.equal(result.record.deliveryAttemptCount, 2);
  assert.equal(result.record.leaseOwner, "dispatch-worker-a");
  assert.equal(result.record.leaseFence, 4);
});

test("blocks claims while the operational kill switch is engaged", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord(),
    createRequest({ killSwitchEngaged: true }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "KILL_SWITCH_ENGAGED",
  });
});

test("fails closed on tenant mismatch", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord(),
    createRequest({ tenantId: "tenant-b" }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "TENANT_MISMATCH",
  });
});

test("waits until a scheduled retry becomes due", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord({
      status: "retry_wait",
      deliveryAttemptCount: 1,
      nextAttemptAt: "2026-07-10T16:10:00.000Z",
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "wait",
    reason: "DELIVERY_NOT_DUE",
  });
});

test("blocks delivery after maximum attempts are exhausted", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord({
      status: "retry_wait",
      deliveryAttemptCount: 4,
      maxDeliveryAttempts: 4,
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "DELIVERY_ATTEMPTS_EXHAUSTED",
  });
});

test("requires the durable idempotency key", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord({ idempotencyKey: " " }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "IDEMPOTENCY_KEY_REQUIRED",
  });
});

test("requires the dispatch payload digest", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord({ payloadDigest: " " }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "PAYLOAD_DIGEST_REQUIRED",
  });
});

test("terminal outbox records are never claimed again", () => {
  const decision = decideDurableDispatchOutboxClaim(
    createRecord({
      status: "delivered",
      deliveryAttemptCount: 1,
    }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "complete",
    reason: "TERMINAL_OUTBOX_STATE",
  });
});

test("atomic version conflict leaves the outbox unclaimed", async () => {
  const store = createStore(
    createRecord(),
    "version_conflict",
  );

  const result = await claimDurableDispatchOutbox(
    store,
    createRequest(),
  );

  assert.equal(result.committed, false);
  assert.equal(
    result.decision.reason,
    "ATOMIC_VERSION_CONFLICT",
  );
  assert.equal(result.record.status, "pending");
  assert.equal(result.record.deliveryAttemptCount, 0);
  assert.equal(store.getAuditEvents().length, 0);
});

test("atomic lease conflict does not partially write claim evidence", async () => {
  const store = createStore(
    createRecord(),
    "lease_conflict",
  );

  const result = await claimDurableDispatchOutbox(
    store,
    createRequest(),
  );

  assert.equal(result.committed, false);
  assert.equal(
    result.decision.reason,
    "ATOMIC_LEASE_CONFLICT",
  );
  assert.equal(result.record.leaseOwner, null);
  assert.equal(result.record.leaseFence, 0);
  assert.equal(store.getAuditEvents().length, 0);
});
