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
    path.join(os.tmpdir(), "nexus-day688-"),
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

function ownerContext(
  tenantId = "tenant-a",
  actorId = "owner-a",
) {
  return {
    tenantId,
    actorId,
    role: "owner",
    requestId: `${actorId}-request-688`,
  };
}

function workerContext(
  tenantId = "tenant-a",
  actorId = "worker-a",
) {
  return {
    tenantId,
    actorId,
    role: "worker",
    requestId: `${actorId}-request-688`,
  };
}

async function createQueuedAction(
  gateway,
  {
    tenantId = "tenant-a",
    ownerId = "owner-a",
    actionId,
    outboxId,
    enqueueNow,
    maxDeliveryAttempts = 3,
  },
) {
  await gateway.execute(
    ownerContext(tenantId, ownerId),
    {
      type: "create_action",
      actionId,
      idempotencyKey: `idempotency-${actionId}`,
      effectType: "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest: `sha256:payload-${actionId}`,
      auditId: `create-${actionId}`,
      now: "2026-07-10T21:00:00.000Z",
    },
  );

  await gateway.execute(
    ownerContext(tenantId, ownerId),
    {
      type: "authorize_action",
      actionId,
      ownerAuthorizationId: `approval-${actionId}`,
      auditId: `authorize-${actionId}`,
      now: "2026-07-10T21:01:00.000Z",
    },
  );

  await gateway.execute(
    ownerContext(tenantId, ownerId),
    {
      type: "enqueue_action",
      actionId,
      outboxId,
      dispatchToken: `dispatch-${actionId}`,
      maxDeliveryAttempts,
      auditId: `enqueue-${actionId}`,
      now: enqueueNow,
    },
  );
}

test("atomically selects and claims the earliest due tenant outbox record", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway, {
      actionId: "action-later-688",
      outboxId: "outbox-later-688",
      enqueueNow: "2026-07-10T21:03:00.000Z",
    });

    await createQueuedAction(environment.gateway, {
      actionId: "action-earlier-688",
      outboxId: "outbox-earlier-688",
      enqueueNow: "2026-07-10T21:02:00.000Z",
    });

    const result = await environment.gateway.execute(
      workerContext(),
      {
        type: "claim_next_outbox",
        workerId: "worker-a",
        claimToken: "claim-next-688",
        leaseDurationMs: 120_000,
        auditId: "claim-next-audit-688",
        now: "2026-07-10T21:04:00.000Z",
      },
    );

    assert.equal(
      result.result.outboxId,
      "outbox-earlier-688",
    );

    assert.equal(result.result.status, "delivering");
    assert.equal(result.result.deliveryAttemptCount, 1);
    assert.equal(result.result.leaseFence, 1);
    assert.equal(result.result.leaseOwner, "worker-a");

    assert.equal(
      result.executionBoundary,
      "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.actions["action-earlier-688"].status,
      "executing",
    );

    assert.equal(
      snapshot.outbox["outbox-later-688"].status,
      "pending",
    );

    assert.equal(
      snapshot.audit.at(-1).details.selectionMode,
      "NEXT_DUE_TENANT_OUTBOX",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("exact claim-next replay returns the same durable lease without another attempt", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway, {
      actionId: "action-replay-688",
      outboxId: "outbox-replay-688",
      enqueueNow: "2026-07-10T21:02:00.000Z",
    });

    const command = {
      type: "claim_next_outbox",
      workerId: "worker-a",
      claimToken: "claim-next-replay-688",
      leaseDurationMs: 120_000,
      auditId: "claim-next-replay-audit-688",
      now: "2026-07-10T21:03:00.000Z",
    };

    const first = await environment.gateway.execute(
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
      replay.result.outboxId,
      first.result.outboxId,
    );

    assert.equal(
      replay.result.deliveryAttemptCount,
      1,
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

test("worker polling remains tenant-isolated", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway, {
      tenantId: "tenant-a",
      ownerId: "owner-a",
      actionId: "tenant-a-action-688",
      outboxId: "tenant-a-outbox-688",
      enqueueNow: "2026-07-10T21:02:00.000Z",
    });

    await createQueuedAction(environment.gateway, {
      tenantId: "tenant-b",
      ownerId: "owner-b",
      actionId: "tenant-b-action-688",
      outboxId: "tenant-b-outbox-688",
      enqueueNow: "2026-07-10T21:01:30.000Z",
    });

    const tenantAClaim =
      await environment.gateway.execute(
        workerContext("tenant-a", "worker-a"),
        {
          type: "claim_next_outbox",
          workerId: "worker-a",
          claimToken: "tenant-a-next-claim-688",
          leaseDurationMs: 60_000,
          auditId: "tenant-a-next-audit-688",
          now: "2026-07-10T21:03:00.000Z",
        },
      );

    assert.equal(
      tenantAClaim.result.outboxId,
      "tenant-a-outbox-688",
    );

    assert.equal(
      tenantAClaim.result.tenantId,
      "tenant-a",
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.outbox["tenant-b-outbox-688"].status,
      "pending",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("active leases are skipped while another due record can be claimed", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway, {
      actionId: "active-action-688",
      outboxId: "active-outbox-688",
      enqueueNow: "2026-07-10T21:02:00.000Z",
    });

    await createQueuedAction(environment.gateway, {
      actionId: "pending-action-688",
      outboxId: "pending-outbox-688",
      enqueueNow: "2026-07-10T21:02:30.000Z",
    });

    await environment.gateway.execute(
      workerContext(),
      {
        type: "claim_outbox",
        outboxId: "active-outbox-688",
        workerId: "worker-a",
        claimToken: "active-claim-688",
        leaseDurationMs: 300_000,
        auditId: "active-claim-audit-688",
        now: "2026-07-10T21:03:00.000Z",
      },
    );

    const nextClaim =
      await environment.gateway.execute(
        workerContext("tenant-a", "worker-b"),
        {
          type: "claim_next_outbox",
          workerId: "worker-b",
          claimToken: "next-available-claim-688",
          leaseDurationMs: 60_000,
          auditId: "next-available-audit-688",
          now: "2026-07-10T21:04:00.000Z",
        },
      );

    assert.equal(
      nextClaim.result.outboxId,
      "pending-outbox-688",
    );

    assert.equal(
      nextClaim.result.leaseOwner,
      "worker-b",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("expired delivery leases are automatically reclaimed with a higher fence", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway, {
      actionId: "expired-action-688",
      outboxId: "expired-outbox-688",
      enqueueNow: "2026-07-10T21:02:00.000Z",
    });

    await environment.gateway.execute(
      workerContext(),
      {
        type: "claim_outbox",
        outboxId: "expired-outbox-688",
        workerId: "worker-a",
        claimToken: "first-expired-claim-688",
        leaseDurationMs: 60_000,
        auditId: "first-expired-audit-688",
        now: "2026-07-10T21:03:00.000Z",
      },
    );

    const reclaimed =
      await environment.gateway.execute(
        workerContext("tenant-a", "worker-b"),
        {
          type: "claim_next_outbox",
          workerId: "worker-b",
          claimToken: "reclaimed-next-688",
          leaseDurationMs: 120_000,
          auditId: "reclaimed-next-audit-688",
          now: "2026-07-10T21:05:00.000Z",
        },
      );

    assert.equal(
      reclaimed.result.outboxId,
      "expired-outbox-688",
    );

    assert.equal(reclaimed.result.leaseFence, 2);
    assert.equal(
      reclaimed.result.deliveryAttemptCount,
      2,
    );

    assert.equal(
      reclaimed.result.leaseOwner,
      "worker-b",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("polling returns null without mutating state when no work is due", async () => {
  const environment = await createEnvironment();

  try {
    const before =
      await environment.engine.readSnapshot();

    const result = await environment.gateway.execute(
      workerContext(),
      {
        type: "claim_next_outbox",
        workerId: "worker-a",
        claimToken: "empty-poll-688",
        leaseDurationMs: 60_000,
        auditId: "empty-poll-audit-688",
        now: "2026-07-10T21:03:00.000Z",
      },
    );

    const after =
      await environment.engine.readSnapshot();

    assert.equal(result.result, null);
    assert.equal(after.revision, before.revision);
    assert.equal(after.audit.length, before.audit.length);
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("gateway actor must match the worker declared by polling command", async () => {
  const environment = await createEnvironment();

  try {
    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "claim_next_outbox",
            workerId: "forged-worker",
            claimToken: "forged-poll-688",
            leaseDurationMs: 60_000,
            auditId: "forged-poll-audit-688",
            now: "2026-07-10T21:03:00.000Z",
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

test("operational kill switch blocks worker polling", async () => {
  const environment = await createEnvironment();

  try {
    await environment.gateway.execute(
      {
        tenantId: "__system__",
        actorId: "system-owner",
        role: "system_owner",
        requestId: "kill-switch-request-688",
      },
      {
        type: "set_operational_kill_switch",
        engaged: true,
        reason: "OWNER_EMERGENCY_STOP",
        auditId: "kill-switch-audit-688",
        now: "2026-07-10T21:03:00.000Z",
      },
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "claim_next_outbox",
            workerId: "worker-a",
            claimToken: "blocked-poll-688",
            leaseDurationMs: 60_000,
            auditId: "blocked-poll-audit-688",
            now: "2026-07-10T21:04:00.000Z",
          },
        ),
      /kill switch is engaged/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("worker polling remains persistence-only with no provider execution path", () => {
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
    /claimNextDueOutbox/,
  );

  assert.match(
    gatewaySource,
    /claim_next_outbox/,
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
