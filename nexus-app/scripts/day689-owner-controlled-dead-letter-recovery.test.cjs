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
    path.join(os.tmpdir(), "nexus-day689-"),
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
    requestId: `${actorId}-request-689`,
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
    requestId: `${actorId}-request-689`,
  };
}

async function createDeadLetter(
  gateway,
  {
    tenantId = "tenant-a",
    ownerId = "owner-a",
    workerId = "worker-a",
    actionId = "action-689",
    outboxId = "outbox-689",
    failureCode = "PROVIDER_TIMEOUT",
  } = {},
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
      now: "2026-07-10T22:00:00.000Z",
    },
  );

  await gateway.execute(
    ownerContext(tenantId, ownerId),
    {
      type: "authorize_action",
      actionId,
      ownerAuthorizationId: `approval-${actionId}`,
      auditId: `authorize-${actionId}`,
      now: "2026-07-10T22:01:00.000Z",
    },
  );

  await gateway.execute(
    ownerContext(tenantId, ownerId),
    {
      type: "enqueue_action",
      actionId,
      outboxId,
      dispatchToken: `dispatch-${actionId}`,
      maxDeliveryAttempts: 3,
      auditId: `enqueue-${actionId}`,
      now: "2026-07-10T22:02:00.000Z",
    },
  );

  await gateway.execute(
    workerContext(tenantId, workerId),
    {
      type: "claim_outbox",
      outboxId,
      workerId,
      claimToken: `claim-${actionId}`,
      leaseDurationMs: 120_000,
      auditId: `claim-${actionId}`,
      now: "2026-07-10T22:03:00.000Z",
    },
  );

  await gateway.execute(
    workerContext(tenantId, workerId),
    {
      type: "record_delivery_failure",
      actionId,
      outboxId,
      workerId,
      leaseFence: 1,
      outcomeToken: `failure-${actionId}`,
      failureCode,
      retryable: false,
      retryDelayMs: 0,
      auditId: `failure-${actionId}`,
      now: "2026-07-10T22:04:00.000Z",
    },
  );
}

function recoveryCommand(overrides = {}) {
  return {
    type: "requeue_dead_letter",
    actionId: "action-689",
    outboxId: "outbox-689",
    newOwnerAuthorizationId: "recovery-approval-689",
    recoveryToken: "recovery-token-689",
    replacementDispatchToken:
      "replacement-dispatch-689",
    expectedFailureCode: "PROVIDER_TIMEOUT",
    recoveryReasonCode: "OWNER_CONFIRMED_RETRY",
    retryDelayMs: 60_000,
    maxRecoveryCount: 3,
    auditId: "recovery-audit-689",
    now: "2026-07-10T22:05:00.000Z",
    ...overrides,
  };
}

test("owner atomically requeues a durable dead letter without changing effect or payload", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    const before =
      await environment.engine.readSnapshot();

    const result = await environment.gateway.execute(
      ownerContext(),
      recoveryCommand(),
    );

    assert.equal(result.result.disposition, "requeued");
    assert.equal(
      result.result.action.status,
      "dispatch_pending",
    );
    assert.equal(
      result.result.outbox.status,
      "retry_wait",
    );
    assert.equal(result.result.action.recoveryCount, 1);
    assert.equal(result.result.outbox.recoveryCount, 1);
    assert.equal(
      result.result.action.ownerAuthorizationId,
      "recovery-approval-689",
    );
    assert.equal(
      result.result.action.dispatchToken,
      "replacement-dispatch-689",
    );
    assert.equal(
      result.result.outbox.dispatchToken,
      "replacement-dispatch-689",
    );
    assert.equal(
      result.result.outbox.deliveryAttemptCount,
      0,
    );
    assert.equal(
      result.result.outbox.nextAttemptAt,
      "2026-07-10T22:06:00.000Z",
    );

    assert.equal(
      result.result.action.effectType,
      before.actions["action-689"].effectType,
    );
    assert.equal(
      result.result.action.payloadDigest,
      before.actions["action-689"].payloadDigest,
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
      snapshot.audit.at(-1).eventType,
      "CONTROLLED_ACTION_DEAD_LETTER_REQUEUED",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("recovered dead letter becomes claimable only after its durable retry time", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    await environment.gateway.execute(
      ownerContext(),
      recoveryCommand(),
    );

    const early = await environment.gateway.execute(
      workerContext("tenant-a", "worker-b"),
      {
        type: "claim_next_outbox",
        workerId: "worker-b",
        claimToken: "early-recovery-claim-689",
        leaseDurationMs: 60_000,
        auditId: "early-recovery-audit-689",
        now: "2026-07-10T22:05:30.000Z",
      },
    );

    assert.equal(early.result, null);

    const claimed = await environment.gateway.execute(
      workerContext("tenant-a", "worker-b"),
      {
        type: "claim_next_outbox",
        workerId: "worker-b",
        claimToken: "due-recovery-claim-689",
        leaseDurationMs: 60_000,
        auditId: "due-recovery-audit-689",
        now: "2026-07-10T22:06:00.000Z",
      },
    );

    assert.equal(claimed.result.outboxId, "outbox-689");
    assert.equal(claimed.result.status, "delivering");
    assert.equal(claimed.result.deliveryAttemptCount, 1);
    assert.equal(claimed.result.leaseFence, 2);
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("exact owner recovery replay does not duplicate revision or audit evidence", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    const command = recoveryCommand();

    await environment.gateway.execute(
      ownerContext(),
      command,
    );

    const beforeReplay =
      await environment.engine.readSnapshot();

    const replay = await environment.gateway.execute(
      ownerContext(),
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

test("only an owner can requeue a dead letter", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          {
            tenantId: "tenant-a",
            actorId: "operator-a",
            role: "operator",
            requestId: "operator-recovery-689",
          },
          recoveryCommand(),
        ),
      /not permitted/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("dead-letter recovery remains tenant-isolated", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          ownerContext("tenant-b", "owner-b"),
          recoveryCommand(),
        ),
      /tenant mismatch/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("owner must acknowledge the exact durable failure code", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          ownerContext(),
          recoveryCommand({
            expectedFailureCode: "DIFFERENT_FAILURE",
          }),
        ),
      /failure code does not match durable state/,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.actions["action-689"].status,
      "failed",
    );
    assert.equal(
      snapshot.outbox["outbox-689"].status,
      "dead_letter",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("recovery count is bounded and cannot be bypassed by owner replay", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    await environment.gateway.execute(
      ownerContext(),
      recoveryCommand({
        maxRecoveryCount: 1,
      }),
    );

    await environment.gateway.execute(
      workerContext("tenant-a", "worker-b"),
      {
        type: "claim_next_outbox",
        workerId: "worker-b",
        claimToken: "second-claim-689",
        leaseDurationMs: 120_000,
        auditId: "second-claim-audit-689",
        now: "2026-07-10T22:06:00.000Z",
      },
    );

    await environment.gateway.execute(
      workerContext("tenant-a", "worker-b"),
      {
        type: "record_delivery_failure",
        actionId: "action-689",
        outboxId: "outbox-689",
        workerId: "worker-b",
        leaseFence: 2,
        outcomeToken: "second-failure-689",
        failureCode: "PROVIDER_TIMEOUT",
        retryable: false,
        retryDelayMs: 0,
        auditId: "second-failure-audit-689",
        now: "2026-07-10T22:07:00.000Z",
      },
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          ownerContext(),
          recoveryCommand({
            recoveryToken: "second-recovery-token-689",
            replacementDispatchToken:
              "second-replacement-dispatch-689",
            auditId: "second-recovery-audit-689",
            now: "2026-07-10T22:08:00.000Z",
            maxRecoveryCount: 1,
          }),
        ),
      /recovery limit has been exhausted/,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("operational kill switch blocks owner dead-letter recovery", async () => {
  const environment = await createEnvironment();

  try {
    await createDeadLetter(environment.gateway);

    await environment.gateway.execute(
      {
        tenantId: "__system__",
        actorId: "system-owner",
        role: "system_owner",
        requestId: "kill-switch-request-689",
      },
      {
        type: "set_operational_kill_switch",
        engaged: true,
        reason: "OWNER_EMERGENCY_STOP",
        auditId: "kill-switch-audit-689",
        now: "2026-07-10T22:05:00.000Z",
      },
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          ownerContext(),
          recoveryCommand({
            now: "2026-07-10T22:06:00.000Z",
          }),
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

test("dead-letter recovery remains persistence-only with immutable provider payload", () => {
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
    /requeueDeadLetter/,
  );
  assert.match(
    verticalSource,
    /CONTROLLED_ACTION_DEAD_LETTER_REQUEUED/,
  );
  assert.match(
    gatewaySource,
    /requeue_dead_letter/,
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
