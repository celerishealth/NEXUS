const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

require.extensions[".ts"] = function compileTypeScript(
  module,
  filename,
) {
  const source = fs.readFileSync(filename, "utf8");

  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
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

  module._compile(output.outputText, filename);
};

const {
  PersistentControlledActionVerticalSlice,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/persistentControlledActionVerticalSlice.ts",
  ),
);

async function createTestEnvironment() {
  const directory = await fsp.mkdtemp(
    path.join(os.tmpdir(), "nexus-day684-"),
  );

  const statePath = path.join(
    directory,
    "controlled-action-state.json",
  );

  return {
    directory,
    statePath,
    engine: new PersistentControlledActionVerticalSlice(
      statePath,
    ),
  };
}

async function createAuthorizedAndQueuedAction(
  engine,
  overrides = {},
) {
  const actionId = overrides.actionId || "action-684";
  const tenantId = overrides.tenantId || "tenant-a";
  const outboxId = overrides.outboxId || "outbox-684";

  await engine.createAction({
    actionId,
    tenantId,
    idempotencyKey:
      overrides.idempotencyKey || "idempotency-684",
    effectType: "CUSTOMER_MESSAGE_DELIVERY",
    payloadDigest: "sha256:payload-684",
    auditId: `${actionId}-created`,
    now: "2026-07-10T17:00:00.000Z",
  });

  await engine.authorizeAction({
    actionId,
    tenantId,
    ownerAuthorizationId: "owner-approval-684",
    auditId: `${actionId}-authorized`,
    now: "2026-07-10T17:01:00.000Z",
  });

  await engine.enqueueAction({
    actionId,
    tenantId,
    outboxId,
    dispatchToken: `dispatch-${actionId}`,
    maxDeliveryAttempts: 3,
    auditId: `${actionId}-enqueued`,
    now: "2026-07-10T17:02:00.000Z",
  });

  return {
    actionId,
    tenantId,
    outboxId,
  };
}

test("persists the complete owner-controlled action lifecycle across restarts", async () => {
  const environment = await createTestEnvironment();

  try {
    const identifiers =
      await createAuthorizedAndQueuedAction(
        environment.engine,
      );

    const restartedBeforeClaim =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    const claimed =
      await restartedBeforeClaim.claimOutbox({
        outboxId: identifiers.outboxId,
        tenantId: identifiers.tenantId,
        workerId: "worker-684",
        claimToken: "claim-684",
        leaseDurationMs: 120_000,
        auditId: "action-684-claimed",
        now: "2026-07-10T17:03:00.000Z",
      });

    assert.equal(claimed.status, "delivering");
    assert.equal(claimed.deliveryAttemptCount, 1);
    assert.equal(claimed.leaseFence, 1);
    assert.equal(claimed.leaseOwner, "worker-684");

    const restartedBeforeFinalization =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    const finalized =
      await restartedBeforeFinalization.finalizeAction({
        actionId: identifiers.actionId,
        tenantId: identifiers.tenantId,
        workerId: "worker-684",
        leaseFence: 1,
        terminalCommitToken: "terminal-684",
        finalStatus: "succeeded",
        resultDigest: "sha256:result-684",
        terminalReasonCode: null,
        auditId: "action-684-finalized",
        now: "2026-07-10T17:04:00.000Z",
      });

    assert.equal(finalized.status, "succeeded");
    assert.equal(finalized.resultDigest, "sha256:result-684");
    assert.equal(finalized.leaseOwner, null);

    const finalRestart =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    const snapshot = await finalRestart.readSnapshot();

    assert.equal(
      snapshot.actions[identifiers.actionId].status,
      "succeeded",
    );
    assert.equal(
      snapshot.outbox[identifiers.outboxId].status,
      "delivered",
    );
    assert.equal(snapshot.audit.length, 5);
    assert.equal(snapshot.revision, 5);

    for (let index = 1; index < snapshot.audit.length; index += 1) {
      assert.equal(
        snapshot.audit[index].previousHash,
        snapshot.audit[index - 1].hash,
      );
    }
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("accepts exact lifecycle replays without duplicate state or audit events", async () => {
  const environment = await createTestEnvironment();

  try {
    const request = {
      actionId: "action-replay-684",
      tenantId: "tenant-a",
      idempotencyKey: "idempotency-replay-684",
      effectType: "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest: "sha256:payload-replay-684",
      auditId: "replay-created",
      now: "2026-07-10T18:00:00.000Z",
    };

    await environment.engine.createAction(request);
    await environment.engine.createAction(request);

    const authorizationRequest = {
      actionId: request.actionId,
      tenantId: request.tenantId,
      ownerAuthorizationId: "owner-replay-684",
      auditId: "replay-authorized",
      now: "2026-07-10T18:01:00.000Z",
    };

    await environment.engine.authorizeAction(
      authorizationRequest,
    );
    await environment.engine.authorizeAction(
      authorizationRequest,
    );

    const enqueueRequest = {
      actionId: request.actionId,
      tenantId: request.tenantId,
      outboxId: "outbox-replay-684",
      dispatchToken: "dispatch-replay-684",
      maxDeliveryAttempts: 3,
      auditId: "replay-enqueued",
      now: "2026-07-10T18:02:00.000Z",
    };

    await environment.engine.enqueueAction(enqueueRequest);
    await environment.engine.enqueueAction(enqueueRequest);

    const claimRequest = {
      outboxId: enqueueRequest.outboxId,
      tenantId: request.tenantId,
      workerId: "worker-replay-684",
      claimToken: "claim-replay-684",
      leaseDurationMs: 120_000,
      auditId: "replay-claimed",
      now: "2026-07-10T18:03:00.000Z",
    };

    await environment.engine.claimOutbox(claimRequest);
    await environment.engine.claimOutbox(claimRequest);

    const finalizationRequest = {
      actionId: request.actionId,
      tenantId: request.tenantId,
      workerId: "worker-replay-684",
      leaseFence: 1,
      terminalCommitToken: "terminal-replay-684",
      finalStatus: "succeeded",
      resultDigest: "sha256:result-replay-684",
      terminalReasonCode: null,
      auditId: "replay-finalized",
      now: "2026-07-10T18:04:00.000Z",
    };

    await environment.engine.finalizeAction(
      finalizationRequest,
    );
    await environment.engine.finalizeAction(
      finalizationRequest,
    );

    const snapshot = await environment.engine.readSnapshot();

    assert.equal(snapshot.revision, 5);
    assert.equal(snapshot.audit.length, 5);
    assert.equal(
      snapshot.outbox[enqueueRequest.outboxId]
        .deliveryAttemptCount,
      1,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("enforces tenant isolation at authorization, claim and finalization boundaries", async () => {
  const environment = await createTestEnvironment();

  try {
    await environment.engine.createAction({
      actionId: "action-tenant-684",
      tenantId: "tenant-a",
      idempotencyKey: "idempotency-tenant-684",
      effectType: "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest: "sha256:tenant-payload-684",
      auditId: "tenant-created",
      now: "2026-07-10T19:00:00.000Z",
    });

    await assert.rejects(
      () =>
        environment.engine.authorizeAction({
          actionId: "action-tenant-684",
          tenantId: "tenant-b",
          ownerAuthorizationId: "owner-tenant-684",
          auditId: "tenant-invalid-authorization",
          now: "2026-07-10T19:01:00.000Z",
        }),
      /tenant mismatch/,
    );

    const identifiers =
      await createAuthorizedAndQueuedAction(
        environment.engine,
        {
          actionId: "action-tenant-claim-684",
          idempotencyKey: "idempotency-tenant-claim-684",
          outboxId: "outbox-tenant-claim-684",
        },
      );

    await assert.rejects(
      () =>
        environment.engine.claimOutbox({
          outboxId: identifiers.outboxId,
          tenantId: "tenant-b",
          workerId: "worker-tenant-684",
          claimToken: "claim-tenant-684",
          leaseDurationMs: 60_000,
          auditId: "tenant-invalid-claim",
          now: "2026-07-10T19:03:00.000Z",
        }),
      /tenant mismatch/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("prevents concurrent delivery while an active fenced lease exists", async () => {
  const environment = await createTestEnvironment();

  try {
    const identifiers =
      await createAuthorizedAndQueuedAction(
        environment.engine,
        {
          actionId: "action-lease-684",
          idempotencyKey: "idempotency-lease-684",
          outboxId: "outbox-lease-684",
        },
      );

    await environment.engine.claimOutbox({
      outboxId: identifiers.outboxId,
      tenantId: identifiers.tenantId,
      workerId: "worker-a",
      claimToken: "claim-worker-a",
      leaseDurationMs: 120_000,
      auditId: "lease-first-claim",
      now: "2026-07-10T20:00:00.000Z",
    });

    await assert.rejects(
      () =>
        environment.engine.claimOutbox({
          outboxId: identifiers.outboxId,
          tenantId: identifiers.tenantId,
          workerId: "worker-b",
          claimToken: "claim-worker-b",
          leaseDurationMs: 120_000,
          auditId: "lease-second-claim",
          now: "2026-07-10T20:01:00.000Z",
        }),
      /active worker lease/,
    );

    const reclaimed =
      await environment.engine.claimOutbox({
        outboxId: identifiers.outboxId,
        tenantId: identifiers.tenantId,
        workerId: "worker-b",
        claimToken: "claim-worker-b",
        leaseDurationMs: 120_000,
        auditId: "lease-reclaimed",
        now: "2026-07-10T20:03:00.000Z",
      });

    assert.equal(reclaimed.leaseOwner, "worker-b");
    assert.equal(reclaimed.leaseFence, 2);
    assert.equal(reclaimed.deliveryAttemptCount, 2);

    await assert.rejects(
      () =>
        environment.engine.finalizeAction({
          actionId: identifiers.actionId,
          tenantId: identifiers.tenantId,
          workerId: "worker-a",
          leaseFence: 1,
          terminalCommitToken: "stale-terminal",
          finalStatus: "succeeded",
          resultDigest: "sha256:stale-result",
          terminalReasonCode: null,
          auditId: "stale-finalization",
          now: "2026-07-10T20:03:30.000Z",
        }),
      /does not own the lease|lease fence mismatch/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("kill switch durably blocks active actions and cancels pending delivery", async () => {
  const environment = await createTestEnvironment();

  try {
    const identifiers =
      await createAuthorizedAndQueuedAction(
        environment.engine,
        {
          actionId: "action-kill-684",
          idempotencyKey: "idempotency-kill-684",
          outboxId: "outbox-kill-684",
        },
      );

    await environment.engine.setKillSwitch({
      engaged: true,
      reason: "OWNER_EMERGENCY_STOP",
      auditId: "kill-switch-engaged",
      now: "2026-07-10T21:00:00.000Z",
    });

    const restarted =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    const snapshot = await restarted.readSnapshot();

    assert.equal(snapshot.killSwitch.engaged, true);
    assert.equal(
      snapshot.actions[identifiers.actionId].status,
      "blocked",
    );
    assert.equal(
      snapshot.outbox[identifiers.outboxId].status,
      "cancelled",
    );

    await assert.rejects(
      () =>
        restarted.claimOutbox({
          outboxId: identifiers.outboxId,
          tenantId: identifiers.tenantId,
          workerId: "worker-kill-684",
          claimToken: "claim-kill-684",
          leaseDurationMs: 60_000,
          auditId: "kill-invalid-claim",
          now: "2026-07-10T21:01:00.000Z",
        }),
      /kill switch is engaged/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("recovers from the durable backup after an interrupted state replacement", async () => {
  const environment = await createTestEnvironment();

  try {
    await environment.engine.createAction({
      actionId: "action-backup-684",
      tenantId: "tenant-a",
      idempotencyKey: "idempotency-backup-684",
      effectType: "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest: "sha256:backup-payload-684",
      auditId: "backup-created",
      now: "2026-07-10T22:00:00.000Z",
    });

    await fsp.rename(
      environment.statePath,
      `${environment.statePath}.bak`,
    );

    const recovered =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    const snapshot = await recovered.readSnapshot();

    assert.equal(
      snapshot.actions["action-backup-684"].status,
      "pending",
    );
    assert.equal(snapshot.audit.length, 1);
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("detects audit-ledger tampering before returning persistent state", async () => {
  const environment = await createTestEnvironment();

  try {
    await environment.engine.createAction({
      actionId: "action-tamper-684",
      tenantId: "tenant-a",
      idempotencyKey: "idempotency-tamper-684",
      effectType: "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest: "sha256:tamper-payload-684",
      auditId: "tamper-created",
      now: "2026-07-10T23:00:00.000Z",
    });

    const state = JSON.parse(
      await fsp.readFile(environment.statePath, "utf8"),
    );

    state.audit[0].details.payloadDigest =
      "sha256:malicious-replacement";

    await fsp.writeFile(
      environment.statePath,
      `${JSON.stringify(state, null, 2)}\n`,
      "utf8",
    );

    const restarted =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    await assert.rejects(
      () => restarted.readSnapshot(),
      /audit hash mismatch/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});
