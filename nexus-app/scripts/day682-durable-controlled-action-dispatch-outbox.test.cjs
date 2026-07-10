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
  decideControlledActionDispatch,
  enqueueControlledActionDispatch,
} = loadTypeScriptModule(
  "lib/nexus/durableControlledActionDispatchOutbox.ts",
);

function createAction(overrides = {}) {
  return {
    actionId: "action-682",
    tenantId: "tenant-a",
    idempotencyKey: "tenant-a:action-682",
    ownerAuthorizationId: "approval-682",
    status: "authorized",
    version: 12,
    updatedAt: "2026-07-10T14:59:00.000Z",
    dispatchToken: null,
    dispatchOutboxId: null,
    dispatchEffectType: null,
    dispatchPayloadDigest: null,
    dispatchRequestedAt: null,
    ...overrides,
  };
}

function createRequest(overrides = {}) {
  return {
    actionId: "action-682",
    tenantId: "tenant-a",
    expectedVersion: 12,
    dispatchToken: "dispatch-token-682",
    outboxId: "outbox-682",
    auditId: "audit-682",
    effectType: "CUSTOMER_MESSAGE_DELIVERY",
    payloadDigest: "sha256:payload-682",
    now: "2026-07-10T15:00:00.000Z",
    killSwitchEngaged: false,
    ...overrides,
  };
}

function createStore(initialAction, forcedResult = null) {
  let action = initialAction
    ? structuredClone(initialAction)
    : null;

  const outboxRecords = new Map();
  const auditEvents = new Map();

  return {
    async readAction(actionId) {
      if (!action || action.actionId !== actionId) {
        return null;
      }

      return structuredClone(action);
    },

    async commitDispatchIntent(input) {
      if (forcedResult) {
        return forcedResult;
      }

      if (
        !action ||
        action.actionId !== input.actionId ||
        action.version !== input.expectedVersion
      ) {
        return "version_conflict";
      }

      if (action.status !== "authorized") {
        return "action_conflict";
      }

      if (outboxRecords.has(input.outboxRecord.outboxId)) {
        return "outbox_conflict";
      }

      if (auditEvents.has(input.auditEvent.auditId)) {
        return "audit_conflict";
      }

      action = structuredClone(input.nextAction);

      outboxRecords.set(
        input.outboxRecord.outboxId,
        structuredClone(input.outboxRecord),
      );

      auditEvents.set(
        input.auditEvent.auditId,
        structuredClone(input.auditEvent),
      );

      return "committed";
    },

    getOutboxRecords() {
      return Array.from(outboxRecords.values()).map((record) =>
        structuredClone(record),
      );
    },

    getAuditEvents() {
      return Array.from(auditEvents.values()).map((event) =>
        structuredClone(event),
      );
    },
  };
}

test("atomically commits dispatch-pending action, outbox record and audit event", async () => {
  const store = createStore(createAction());

  const result = await enqueueControlledActionDispatch(
    store,
    createRequest(),
  );

  assert.equal(result.committed, true);
  assert.equal(result.decision.reason, "DISPATCH_COMMITTED");
  assert.equal(result.action.status, "dispatch_pending");
  assert.equal(result.action.version, 13);
  assert.equal(
    result.action.dispatchToken,
    "dispatch-token-682",
  );
  assert.equal(result.outboxRecord.status, "pending");
  assert.equal(result.outboxRecord.version, 0);
  assert.equal(result.outboxRecord.deliveryAttemptCount, 0);
  assert.equal(result.outboxRecord.leaseOwner, null);
  assert.equal(result.outboxRecord.leaseFence, 0);

  const outboxRecords = store.getOutboxRecords();
  const auditEvents = store.getAuditEvents();

  assert.equal(outboxRecords.length, 1);
  assert.equal(auditEvents.length, 1);
  assert.equal(
    auditEvents[0].eventType,
    "CONTROLLED_ACTION_DISPATCH_ENQUEUED",
  );
  assert.equal(auditEvents[0].previousVersion, 12);
  assert.equal(auditEvents[0].committedVersion, 13);
});

test("accepts an exact dispatch replay without creating duplicate durable records", async () => {
  const store = createStore(createAction());
  const request = createRequest();

  const first = await enqueueControlledActionDispatch(
    store,
    request,
  );

  const replay = await enqueueControlledActionDispatch(
    store,
    request,
  );

  assert.equal(first.committed, true);
  assert.equal(replay.committed, false);
  assert.equal(
    replay.decision.reason,
    "DISPATCH_REPLAY_ACCEPTED",
  );
  assert.equal(store.getOutboxRecords().length, 1);
  assert.equal(store.getAuditEvents().length, 1);
});

test("blocks dispatch while the operational kill switch is engaged", () => {
  const decision = decideControlledActionDispatch(
    createAction(),
    createRequest({ killSwitchEngaged: true }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "KILL_SWITCH_ENGAGED",
  });
});

test("fails closed on tenant mismatch", () => {
  const decision = decideControlledActionDispatch(
    createAction(),
    createRequest({ tenantId: "tenant-b" }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "TENANT_MISMATCH",
  });
});

test("requires durable owner authorization before creating an execution intent", () => {
  const decision = decideControlledActionDispatch(
    createAction({ ownerAuthorizationId: null }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "OWNER_AUTHORIZATION_REQUIRED",
  });
});

test("requires a durable idempotency key before creating an outbox record", () => {
  const decision = decideControlledActionDispatch(
    createAction({ idempotencyKey: null }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "IDEMPOTENCY_KEY_REQUIRED",
  });
});

test("only authorized actions can enter dispatch-pending state", () => {
  const decision = decideControlledActionDispatch(
    createAction({ status: "pending" }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "ACTION_NOT_AUTHORIZED",
  });
});

test("blocks stale expected versions", () => {
  const decision = decideControlledActionDispatch(
    createAction({ version: 13 }),
    createRequest({ expectedVersion: 12 }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "VERSION_MISMATCH",
  });
});

test("blocks a conflicting dispatch for an action already queued", () => {
  const decision = decideControlledActionDispatch(
    createAction({
      status: "dispatch_pending",
      version: 13,
      dispatchToken: "existing-token",
      dispatchOutboxId: "existing-outbox",
      dispatchEffectType: "CUSTOMER_MESSAGE_DELIVERY",
      dispatchPayloadDigest: "sha256:existing-payload",
      dispatchRequestedAt: "2026-07-10T15:00:00.000Z",
    }),
    createRequest({
      expectedVersion: 13,
      dispatchToken: "different-token",
      outboxId: "different-outbox",
    }),
  );

  assert.deepEqual(decision, {
    disposition: "block",
    reason: "DISPATCH_CONFLICT",
  });
});

test("terminal actions never create a new dispatch intent", () => {
  const decision = decideControlledActionDispatch(
    createAction({ status: "succeeded" }),
    createRequest(),
  );

  assert.deepEqual(decision, {
    disposition: "complete",
    reason: "TERMINAL_STATE",
  });
});

test("atomic outbox conflict leaves action state unchanged", async () => {
  const store = createStore(
    createAction(),
    "outbox_conflict",
  );

  const result = await enqueueControlledActionDispatch(
    store,
    createRequest(),
  );

  assert.equal(result.committed, false);
  assert.equal(
    result.decision.reason,
    "ATOMIC_OUTBOX_CONFLICT",
  );
  assert.equal(result.action.status, "authorized");
  assert.equal(result.action.version, 12);
  assert.equal(store.getOutboxRecords().length, 0);
  assert.equal(store.getAuditEvents().length, 0);
});

test("atomic version conflict does not partially create audit or outbox evidence", async () => {
  const store = createStore(
    createAction(),
    "version_conflict",
  );

  const result = await enqueueControlledActionDispatch(
    store,
    createRequest(),
  );

  assert.equal(result.committed, false);
  assert.equal(
    result.decision.reason,
    "ATOMIC_VERSION_CONFLICT",
  );
  assert.equal(store.getOutboxRecords().length, 0);
  assert.equal(store.getAuditEvents().length, 0);
});

test("rejects an empty payload digest before any durable mutation", async () => {
  const store = createStore(createAction());

  await assert.rejects(
    () =>
      enqueueControlledActionDispatch(
        store,
        createRequest({ payloadDigest: " " }),
      ),
    /Dispatch payloadDigest is required/,
  );

  assert.equal(store.getOutboxRecords().length, 0);
  assert.equal(store.getAuditEvents().length, 0);
});
