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
    path.join(os.tmpdir(), "nexus-day686-"),
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
    requestId: "owner-request-686",
  };
}

function workerContext(actorId = "worker-a") {
  return {
    tenantId: "tenant-a",
    actorId,
    role: "worker",
    requestId: `${actorId}-request-686`,
  };
}

async function createClaimedAction(
  gateway,
  {
    actionId = "action-686",
    outboxId = "outbox-686",
    maxDeliveryAttempts = 3,
    workerId = "worker-a",
    claimToken = "claim-686",
    claimAuditId = "claim-audit-686",
    claimNow = "2026-07-10T19:03:00.000Z",
  } = {},
) {
  await gateway.execute(ownerContext(), {
    type: "create_action",
    actionId,
    idempotencyKey: `idempotency-${actionId}`,
    effectType: "CUSTOMER_MESSAGE_DELIVERY",
    payloadDigest: `sha256:payload-${actionId}`,
    auditId: `create-${actionId}`,
    now: "2026-07-10T19:00:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "authorize_action",
    actionId,
    ownerAuthorizationId: `approval-${actionId}`,
    auditId: `authorize-${actionId}`,
    now: "2026-07-10T19:01:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "enqueue_action",
    actionId,
    outboxId,
    dispatchToken: `dispatch-${actionId}`,
    maxDeliveryAttempts,
    auditId: `enqueue-${actionId}`,
    now: "2026-07-10T19:02:00.000Z",
  });

  return gateway.execute(workerContext(workerId), {
    type: "claim_outbox",
    outboxId,
    workerId,
    claimToken,
    leaseDurationMs: 120_000,
    auditId: claimAuditId,
    now: claimNow,
  });
}

test("transient failure atomically schedules a durable retry", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    const failure = await environment.gateway.execute(
      workerContext(),
      {
        type: "record_delivery_failure",
        actionId: "action-686",
        outboxId: "outbox-686",
        workerId: "worker-a",
        leaseFence: 1,
        outcomeToken: "outcome-failure-686",
        failureCode: "PROVIDER_TIMEOUT",
        retryable: true,
        retryDelayMs: 60_000,
        auditId: "failure-audit-686",
        now: "2026-07-10T19:04:00.000Z",
      },
    );

    assert.equal(
      failure.result.disposition,
      "retry_scheduled",
    );

    assert.equal(
      failure.result.action.status,
      "dispatch_pending",
    );

    assert.equal(
      failure.result.outbox.status,
      "retry_wait",
    );

    assert.equal(
      failure.result.outbox.nextAttemptAt,
      "2026-07-10T19:05:00.000Z",
    );

    assert.equal(failure.result.action.leaseOwner, null);
    assert.equal(failure.result.outbox.leaseOwner, null);
    assert.equal(
      failure.liveProviderExecutionAuthorized,
      false,
    );

    const restarted =
      new PersistentControlledActionVerticalSlice(
        environment.statePath,
      );

    const snapshot = await restarted.readSnapshot();

    assert.equal(
      snapshot.actions["action-686"].status,
      "dispatch_pending",
    );

    assert.equal(
      snapshot.outbox["outbox-686"].status,
      "retry_wait",
    );

    assert.equal(
      snapshot.audit.at(-1).eventType,
      "DISPATCH_OUTBOX_RETRY_SCHEDULED",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("retry cannot be claimed before its durable due time", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    await environment.gateway.execute(
      workerContext(),
      {
        type: "record_delivery_failure",
        actionId: "action-686",
        outboxId: "outbox-686",
        workerId: "worker-a",
        leaseFence: 1,
        outcomeToken: "retry-wait-outcome-686",
        failureCode: "TEMPORARY_RATE_LIMIT",
        retryable: true,
        retryDelayMs: 120_000,
        auditId: "retry-wait-audit-686",
        now: "2026-07-10T19:04:00.000Z",
      },
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext("worker-b"),
          {
            type: "claim_outbox",
            outboxId: "outbox-686",
            workerId: "worker-b",
            claimToken: "early-retry-claim-686",
            leaseDurationMs: 60_000,
            auditId: "early-retry-audit-686",
            now: "2026-07-10T19:05:00.000Z",
          },
        ),
      /delivery is not due/,
    );

    const dueClaim = await environment.gateway.execute(
      workerContext("worker-b"),
      {
        type: "claim_outbox",
        outboxId: "outbox-686",
        workerId: "worker-b",
        claimToken: "due-retry-claim-686",
        leaseDurationMs: 60_000,
        auditId: "due-retry-audit-686",
        now: "2026-07-10T19:06:00.000Z",
      },
    );

    assert.equal(dueClaim.result.status, "delivering");
    assert.equal(dueClaim.result.deliveryAttemptCount, 2);
    assert.equal(dueClaim.result.leaseFence, 2);
    assert.equal(dueClaim.result.leaseOwner, "worker-b");
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("non-retryable failure atomically dead-letters the outbox and fails the action", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway, {
      actionId: "action-permanent-686",
      outboxId: "outbox-permanent-686",
    });

    const result = await environment.gateway.execute(
      workerContext(),
      {
        type: "record_delivery_failure",
        actionId: "action-permanent-686",
        outboxId: "outbox-permanent-686",
        workerId: "worker-a",
        leaseFence: 1,
        outcomeToken: "permanent-outcome-686",
        failureCode: "INVALID_DESTINATION",
        retryable: false,
        retryDelayMs: 0,
        auditId: "permanent-failure-audit-686",
        now: "2026-07-10T19:04:00.000Z",
      },
    );

    assert.equal(result.result.disposition, "dead_lettered");
    assert.equal(result.result.action.status, "failed");
    assert.equal(
      result.result.action.terminalReasonCode,
      "INVALID_DESTINATION",
    );

    assert.equal(
      result.result.action.terminalCommitToken,
      "permanent-outcome-686",
    );

    assert.equal(
      result.result.outbox.status,
      "dead_letter",
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.audit.at(-1).eventType,
      "DISPATCH_OUTBOX_DEAD_LETTERED",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("maximum delivery attempts cause durable dead-letter even for retryable errors", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway, {
      actionId: "action-exhausted-686",
      outboxId: "outbox-exhausted-686",
      maxDeliveryAttempts: 1,
    });

    const result = await environment.gateway.execute(
      workerContext(),
      {
        type: "record_delivery_failure",
        actionId: "action-exhausted-686",
        outboxId: "outbox-exhausted-686",
        workerId: "worker-a",
        leaseFence: 1,
        outcomeToken: "exhausted-outcome-686",
        failureCode: "PROVIDER_TIMEOUT",
        retryable: true,
        retryDelayMs: 60_000,
        auditId: "exhausted-failure-audit-686",
        now: "2026-07-10T19:04:00.000Z",
      },
    );

    assert.equal(result.result.disposition, "dead_lettered");
    assert.equal(result.result.action.status, "failed");
    assert.equal(
      result.result.outbox.status,
      "dead_letter",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("exact failure replay does not duplicate revision or audit evidence", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    const command = {
      type: "record_delivery_failure",
      actionId: "action-686",
      outboxId: "outbox-686",
      workerId: "worker-a",
      leaseFence: 1,
      outcomeToken: "replay-outcome-686",
      failureCode: "PROVIDER_TIMEOUT",
      retryable: true,
      retryDelayMs: 60_000,
      auditId: "replay-failure-audit-686",
      now: "2026-07-10T19:04:00.000Z",
    };

    await environment.gateway.execute(
      workerContext(),
      command,
    );

    const beforeReplay =
      await environment.engine.readSnapshot();

    await environment.gateway.execute(
      workerContext(),
      command,
    );

    const afterReplay =
      await environment.engine.readSnapshot();

    assert.equal(
      afterReplay.revision,
      beforeReplay.revision,
    );

    assert.equal(
      afterReplay.audit.length,
      beforeReplay.audit.length,
    );

    assert.equal(
      afterReplay.outbox["outbox-686"]
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

test("stale workers and obsolete lease fences cannot record delivery outcomes", async () => {
  const environment = await createEnvironment();

  try {
    await createClaimedAction(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext("worker-b"),
          {
            type: "record_delivery_failure",
            actionId: "action-686",
            outboxId: "outbox-686",
            workerId: "worker-b",
            leaseFence: 1,
            outcomeToken: "stale-worker-outcome-686",
            failureCode: "PROVIDER_TIMEOUT",
            retryable: true,
            retryDelayMs: 60_000,
            auditId: "stale-worker-audit-686",
            now: "2026-07-10T19:04:00.000Z",
          },
        ),
      /does not own the active lease/,
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "record_delivery_failure",
            actionId: "action-686",
            outboxId: "outbox-686",
            workerId: "worker-a",
            leaseFence: 99,
            outcomeToken: "stale-fence-outcome-686",
            failureCode: "PROVIDER_TIMEOUT",
            retryable: true,
            retryDelayMs: 60_000,
            auditId: "stale-fence-audit-686",
            now: "2026-07-10T19:04:00.000Z",
          },
        ),
      /lease fence mismatch/,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.outbox["outbox-686"].status,
      "delivering",
    );

    assert.equal(
      snapshot.outbox["outbox-686"]
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

test("delivery failure path remains persistence-only with no provider execution", () => {
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
    gatewaySource,
    /record_delivery_failure/,
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
