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
  ControlledActionCommandGateway,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/controlledActionCommandGateway.ts",
  ),
);

const {
  PersistentControlledActionVerticalSlice,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/persistentControlledActionVerticalSlice.ts",
  ),
);

async function createEnvironment() {
  const directory = await fsp.mkdtemp(
    path.join(os.tmpdir(), "nexus-day687-"),
  );

  const statePath = path.join(directory, "state.json");
  const engine =
    new PersistentControlledActionVerticalSlice(statePath);

  return {
    directory,
    statePath,
    engine,
    gateway: new ControlledActionCommandGateway(engine),
  };
}

function ownerContext() {
  return {
    tenantId: "tenant-a",
    actorId: "owner-a",
    role: "owner",
    requestId: "owner-request-687",
  };
}

function workerContext(actorId = "worker-a") {
  return {
    tenantId: "tenant-a",
    actorId,
    role: "worker",
    requestId: `${actorId}-request-687`,
  };
}

async function createClaimedAction(
  gateway,
  {
    actionId = "action-687",
    outboxId = "outbox-687",
    workerId = "worker-a",
    claimNow = "2026-07-10T20:03:00.000Z",
  } = {},
) {
  await gateway.execute(ownerContext(), {
    type: "create_action",
    actionId,
    idempotencyKey: `idempotency-${actionId}`,
    effectType: "CUSTOMER_MESSAGE_DELIVERY",
    payloadDigest: `sha256:payload-${actionId}`,
    auditId: `create-${actionId}`,
    now: "2026-07-10T20:00:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "authorize_action",
    actionId,
    ownerAuthorizationId: `approval-${actionId}`,
    auditId: `authorize-${actionId}`,
    now: "2026-07-10T20:01:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "enqueue_action",
    actionId,
    outboxId,
    dispatchToken: `dispatch-${actionId}`,
    maxDeliveryAttempts: 3,
    auditId: `enqueue-${actionId}`,
    now: "2026-07-10T20:02:00.000Z",
  });

  return gateway.execute(workerContext(workerId), {
    type: "claim_outbox",
    outboxId,
    workerId,
    claimToken: `claim-${actionId}`,
    leaseDurationMs: 120_000,
    auditId: `claim-${actionId}`,
    now: claimNow,
  });
}

test("atomically renews action and outbox lease through the command gateway", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    const result = await environment.gateway.execute(
      workerContext(),
      {
        type: "heartbeat_delivery_lease",
        actionId: "action-687",
        outboxId: "outbox-687",
        workerId: "worker-a",
        leaseFence: 1,
        heartbeatToken: "heartbeat-687",
        extensionMs: 180_000,
        auditId: "heartbeat-audit-687",
        now: "2026-07-10T20:04:00.000Z",
      },
    );

    assert.equal(result.result.disposition, "renewed");

    assert.equal(
      result.result.action.leaseExpiresAt,
      "2026-07-10T20:07:00.000Z",
    );

    assert.equal(
      result.result.outbox.leaseExpiresAt,
      "2026-07-10T20:07:00.000Z",
    );

    assert.equal(
      result.result.outbox.lastHeartbeatToken,
      "heartbeat-687",
    );

    assert.equal(result.result.action.version, 4);
    assert.equal(result.result.outbox.version, 2);

    assert.equal(
      result.executionBoundary,
      "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    const restarted =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    const snapshot = await restarted.readSnapshot();

    assert.equal(
      snapshot.actions["action-687"].leaseExpiresAt,
      "2026-07-10T20:07:00.000Z",
    );

    assert.equal(
      snapshot.outbox["outbox-687"].leaseExpiresAt,
      "2026-07-10T20:07:00.000Z",
    );

    assert.equal(
      snapshot.audit.at(-1).eventType,
      "DISPATCH_OUTBOX_LEASE_RENEWED",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("accepts exact heartbeat replay without duplicate revision or audit evidence", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    const command = {
      type: "heartbeat_delivery_lease",
      actionId: "action-687",
      outboxId: "outbox-687",
      workerId: "worker-a",
      leaseFence: 1,
      heartbeatToken: "heartbeat-replay-687",
      extensionMs: 180_000,
      auditId: "heartbeat-replay-audit-687",
      now: "2026-07-10T20:04:00.000Z",
    };

    await environment.gateway.execute(
      workerContext(),
      command,
    );

    const beforeReplay =
      await environment.engine.readSnapshot();

    const replay = await environment.gateway.execute(
      workerContext(),
      command,
    );

    const afterReplay =
      await environment.engine.readSnapshot();

    assert.equal(
      replay.result.disposition,
      "replay_accepted",
    );

    assert.equal(
      afterReplay.revision,
      beforeReplay.revision,
    );

    assert.equal(
      afterReplay.audit.length,
      beforeReplay.audit.length,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("does not shorten an already longer active lease", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    await environment.gateway.execute(
      workerContext(),
      {
        type: "heartbeat_delivery_lease",
        actionId: "action-687",
        outboxId: "outbox-687",
        workerId: "worker-a",
        leaseFence: 1,
        heartbeatToken: "heartbeat-long-687",
        extensionMs: 240_000,
        auditId: "heartbeat-long-audit-687",
        now: "2026-07-10T20:04:00.000Z",
      },
    );

    const beforeNoop =
      await environment.engine.readSnapshot();

    const result = await environment.gateway.execute(
      workerContext(),
      {
        type: "heartbeat_delivery_lease",
        actionId: "action-687",
        outboxId: "outbox-687",
        workerId: "worker-a",
        leaseFence: 1,
        heartbeatToken: "heartbeat-short-687",
        extensionMs: 60_000,
        auditId: "heartbeat-short-audit-687",
        now: "2026-07-10T20:04:30.000Z",
      },
    );

    const afterNoop =
      await environment.engine.readSnapshot();

    assert.equal(
      result.result.disposition,
      "extension_not_required",
    );

    assert.equal(
      afterNoop.revision,
      beforeNoop.revision,
    );

    assert.equal(
      afterNoop.audit.length,
      beforeNoop.audit.length,
    );

    assert.equal(
      afterNoop.actions["action-687"].leaseExpiresAt,
      "2026-07-10T20:08:00.000Z",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("stale workers and obsolete fences cannot renew the lease", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext("worker-b"),
          {
            type: "heartbeat_delivery_lease",
            actionId: "action-687",
            outboxId: "outbox-687",
            workerId: "worker-b",
            leaseFence: 1,
            heartbeatToken: "stale-worker-heartbeat-687",
            extensionMs: 120_000,
            auditId: "stale-worker-heartbeat-audit-687",
            now: "2026-07-10T20:04:00.000Z",
          },
        ),
      /does not own the active lease/,
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "heartbeat_delivery_lease",
            actionId: "action-687",
            outboxId: "outbox-687",
            workerId: "worker-a",
            leaseFence: 99,
            heartbeatToken: "stale-fence-heartbeat-687",
            extensionMs: 120_000,
            auditId: "stale-fence-heartbeat-audit-687",
            now: "2026-07-10T20:04:00.000Z",
          },
        ),
      /fence mismatch/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("expired delivery leases cannot be revived by heartbeat", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway, {
      actionId: "action-expired-687",
      outboxId: "outbox-expired-687",
      claimNow: "2026-07-10T20:03:00.000Z",
    });

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "heartbeat_delivery_lease",
            actionId: "action-expired-687",
            outboxId: "outbox-expired-687",
            workerId: "worker-a",
            leaseFence: 1,
            heartbeatToken: "expired-heartbeat-687",
            extensionMs: 120_000,
            auditId: "expired-heartbeat-audit-687",
            now: "2026-07-10T20:05:00.000Z",
          },
        ),
      /expired lease/,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.outbox["outbox-expired-687"]
        .lastHeartbeatToken,
      null,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("gateway actor must match the worker declared by heartbeat command", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "heartbeat_delivery_lease",
            actionId: "action-687",
            outboxId: "outbox-687",
            workerId: "forged-worker",
            leaseFence: 1,
            heartbeatToken: "forged-heartbeat-687",
            extensionMs: 120_000,
            auditId: "forged-heartbeat-audit-687",
            now: "2026-07-10T20:04:00.000Z",
          },
        ),
      /does not match the authenticated actor/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("kill switch revokes the active lifecycle and prevents heartbeat renewal", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    await environment.gateway.execute(
      {
        tenantId: "__system__",
        actorId: "system-owner",
        role: "system_owner",
        requestId: "kill-switch-request-687",
      },
      {
        type: "set_operational_kill_switch",
        engaged: true,
        reason: "OWNER_EMERGENCY_STOP",
        auditId: "kill-switch-audit-687",
        now: "2026-07-10T20:04:00.000Z",
      },
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "heartbeat_delivery_lease",
            actionId: "action-687",
            outboxId: "outbox-687",
            workerId: "worker-a",
            leaseFence: 1,
            heartbeatToken: "blocked-heartbeat-687",
            extensionMs: 120_000,
            auditId: "blocked-heartbeat-audit-687",
            now: "2026-07-10T20:04:30.000Z",
          },
        ),
      /kill switch is engaged/,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.actions["action-687"].status,
      "blocked",
    );

    assert.equal(
      snapshot.outbox["outbox-687"].status,
      "cancelled",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("heartbeat integration remains persistence-only with no provider execution path", () => {
  const verticalSource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "lib/nexus/persistentControlledActionVerticalSlice.ts",
    ),
    "utf8",
  );

  const gatewaySource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "lib/nexus/controlledActionCommandGateway.ts",
    ),
    "utf8",
  );

  assert.match(
    verticalSource,
    /DISPATCH_OUTBOX_LEASE_RENEWED/,
  );

  assert.match(
    gatewaySource,
    /heartbeat_delivery_lease/,
  );

  assert.match(
    gatewaySource,
    /PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION/,
  );

  assert.doesNotMatch(
    `${verticalSource}\n${gatewaySource}`,
    /\bfetch\s*\(/,
  );
});
