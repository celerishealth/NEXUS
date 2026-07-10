const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

require.extensions[".ts"] =
  function compileTypeScript(
    module,
    filename,
  ) {
    const source = fs.readFileSync(
      filename,
      "utf8",
    );

    const output =
      ts.transpileModule(source, {
        compilerOptions: {
          target:
            ts.ScriptTarget.ES2022,
          module:
            ts.ModuleKind.CommonJS,
          strict: true,
          esModuleInterop: true,
          moduleResolution:
            ts.ModuleResolutionKind.NodeJs,
        },
        fileName: filename,
        reportDiagnostics: true,
      });

    const errors = (
      output.diagnostics || []
    ).filter(
      (diagnostic) =>
        diagnostic.category ===
        ts.DiagnosticCategory.Error,
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

    module._compile(
      output.outputText,
      filename,
    );
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

const {
  SQLiteControlledActionStateRepository,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteControlledActionStateRepository.ts",
  ),
);

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day694-",
      ),
    );

  const databasePath = path.join(
    directory,
    "nexus-runtime.sqlite",
  );

  const repository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  const engine =
    new PersistentControlledActionVerticalSlice(
      repository,
    );

  return {
    directory,
    databasePath,
    repository,
    engine,
    gateway:
      new ControlledActionCommandGateway(
        engine,
      ),
  };
}

function ownerContext(
  tenantId = "tenant-a",
) {
  return {
    tenantId,
    actorId: `owner-${tenantId}`,
    role: "owner",
    requestId:
      `owner-request-${tenantId}-694`,
  };
}

function workerContext(
  tenantId = "tenant-a",
) {
  return {
    tenantId,
    actorId: `worker-${tenantId}`,
    role: "worker",
    requestId:
      `worker-request-${tenantId}-694`,
  };
}

async function createAndEnqueue(
  gateway,
  suffix,
  tenantId = "tenant-a",
) {
  const actionId =
    `action-${suffix}`;
  const outboxId =
    `outbox-${suffix}`;

  await gateway.execute(
    ownerContext(tenantId),
    {
      type: "create_action",
      actionId,
      idempotencyKey:
        `idempotency-${suffix}`,
      effectType:
        "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest:
        `sha256:payload-${suffix}`,
      auditId:
        `create-audit-${suffix}`,
      now:
        "2026-07-11T05:00:00.000Z",
    },
  );

  await gateway.execute(
    ownerContext(tenantId),
    {
      type: "authorize_action",
      actionId,
      ownerAuthorizationId:
        `owner-approval-${suffix}`,
      auditId:
        `authorize-audit-${suffix}`,
      now:
        "2026-07-11T05:01:00.000Z",
    },
  );

  await gateway.execute(
    ownerContext(tenantId),
    {
      type: "enqueue_action",
      actionId,
      outboxId,
      dispatchToken:
        `dispatch-${suffix}`,
      maxDeliveryAttempts: 3,
      auditId:
        `enqueue-audit-${suffix}`,
      now:
        "2026-07-11T05:02:00.000Z",
    },
  );

  return {
    actionId,
    outboxId,
  };
}

test("normalized projections match the authoritative SQLite state revision", async () => {
  const environment =
    await createEnvironment();

  try {
    const identifiers =
      await createAndEnqueue(
        environment.gateway,
        "694",
      );

    const authoritative =
      await environment.engine
        .readSnapshot();

    const projection =
      environment.repository
        .readProjectionSnapshot();

    assert.equal(
      projection.revision,
      authoritative.revision,
    );

    assert.equal(
      projection.actions.length,
      1,
    );

    assert.equal(
      projection.outbox.length,
      1,
    );

    assert.equal(
      projection.audit.length,
      3,
    );

    assert.equal(
      projection.actions[0].actionId,
      identifiers.actionId,
    );

    assert.equal(
      projection.actions[0].tenantId,
      "tenant-a",
    );

    assert.equal(
      projection.actions[0].status,
      "dispatch_pending",
    );

    assert.equal(
      projection.outbox[0].outboxId,
      identifiers.outboxId,
    );

    assert.equal(
      projection.outbox[0].status,
      "pending",
    );

    assert.deepEqual(
      projection.killSwitch,
      authoritative.killSwitch,
    );
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("worker claim atomically updates action, outbox and audit projections", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAndEnqueue(
      environment.gateway,
      "claim-694",
    );

    await environment.gateway.execute(
      workerContext(),
      {
        type: "claim_next_outbox",
        workerId: "worker-tenant-a",
        claimToken:
          "claim-token-694",
        leaseDurationMs: 120000,
        auditId:
          "claim-audit-694",
        now:
          "2026-07-11T05:03:00.000Z",
      },
    );

    const authoritative =
      await environment.engine
        .readSnapshot();

    const projection =
      environment.repository
        .readProjectionSnapshot();

    assert.equal(
      projection.revision,
      authoritative.revision,
    );

    assert.equal(
      projection.actions[0].status,
      "executing",
    );

    assert.equal(
      projection.outbox[0].status,
      "delivering",
    );

    assert.equal(
      projection.outbox[0]
        .deliveryAttemptCount,
      1,
    );

    assert.equal(
      projection.outbox[0].leaseFence,
      1,
    );

    assert.equal(
      projection.audit.at(-1)
        .eventType,
      "DISPATCH_OUTBOX_CLAIMED",
    );
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("failed command rolls back authoritative and normalized state together", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAndEnqueue(
      environment.gateway,
      "rollback-694",
    );

    const authoritativeBefore =
      await environment.engine
        .readSnapshot();

    const projectionBefore =
      environment.repository
        .readProjectionSnapshot();

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext("tenant-b"),
          {
            type: "claim_outbox",
            outboxId:
              "outbox-rollback-694",
            workerId:
              "worker-tenant-b",
            claimToken:
              "invalid-claim-694",
            leaseDurationMs: 120000,
            auditId:
              "invalid-claim-audit-694",
            now:
              "2026-07-11T05:03:00.000Z",
          },
        ),
      /tenant mismatch/,
    );

    const authoritativeAfter =
      await environment.engine
        .readSnapshot();

    const projectionAfter =
      environment.repository
        .readProjectionSnapshot();

    assert.equal(
      authoritativeAfter.revision,
      authoritativeBefore.revision,
    );

    assert.equal(
      projectionAfter.revision,
      projectionBefore.revision,
    );

    assert.deepEqual(
      projectionAfter,
      projectionBefore,
    );
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("exact replay does not duplicate projection rows or advance revision", async () => {
  const environment =
    await createEnvironment();

  try {
    const command = {
      type: "create_action",
      actionId:
        "replay-action-694",
      idempotencyKey:
        "replay-idempotency-694",
      effectType:
        "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest:
        "sha256:replay-payload-694",
      auditId:
        "replay-audit-694",
      now:
        "2026-07-11T06:00:00.000Z",
    };

    await environment.gateway.execute(
      ownerContext(),
      command,
    );

    const before =
      environment.repository
        .readProjectionSnapshot();

    await environment.gateway.execute(
      ownerContext(),
      command,
    );

    const after =
      environment.repository
        .readProjectionSnapshot();

    assert.equal(
      after.revision,
      before.revision,
    );

    assert.equal(
      after.actions.length,
      1,
    );

    assert.equal(
      after.audit.length,
      1,
    );

    assert.deepEqual(after, before);
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("normalized projections survive repository restart and remain synchronized", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAndEnqueue(
      environment.gateway,
      "restart-694",
    );

    environment.repository.close();

    const restartedRepository =
      new SQLiteControlledActionStateRepository(
        environment.databasePath,
      );

    try {
      const restartedEngine =
        new PersistentControlledActionVerticalSlice(
          restartedRepository,
        );

      const authoritative =
        await restartedEngine.readSnapshot();

      const projection =
        restartedRepository
          .readProjectionSnapshot();

      assert.equal(
        projection.revision,
        authoritative.revision,
      );

      assert.equal(
        projection.actions.length,
        1,
      );

      assert.equal(
        projection.outbox.length,
        1,
      );

      assert.equal(
        projection.audit.length,
        3,
      );

      assert.equal(
        projection.actions[0].actionId,
        "action-restart-694",
      );
    } finally {
      restartedRepository.close();
    }
  } finally {
    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("multiple tenants remain separated inside normalized projections", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAndEnqueue(
      environment.gateway,
      "tenant-a-694",
      "tenant-a",
    );

    await createAndEnqueue(
      environment.gateway,
      "tenant-b-694",
      "tenant-b",
    );

    const projection =
      environment.repository
        .readProjectionSnapshot();

    assert.equal(
      projection.actions.length,
      2,
    );

    assert.equal(
      projection.outbox.length,
      2,
    );

    assert.deepEqual(
      projection.actions.map(
        (action) => action.tenantId,
      ),
      [
        "tenant-a",
        "tenant-b",
      ],
    );
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("SQLite projection source contains constraints, indexes and no provider execution", () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "lib/nexus/sqliteControlledActionStateRepository.ts",
    ),
    "utf8",
  );

  assert.match(
    source,
    /nexus_controlled_actions_projection/,
  );

  assert.match(
    source,
    /nexus_dispatch_outbox_projection/,
  );

  assert.match(
    source,
    /nexus_audit_projection/,
  );

  assert.match(
    source,
    /nexus_kill_switch_projection/,
  );

  assert.match(
    source,
    /FOREIGN KEY \(action_id\)/,
  );

  assert.match(
    source,
    /UNIQUE \(tenant_id, idempotency_key\)/,
  );

  assert.match(
    source,
    /nexus_dispatch_outbox_due_idx/,
  );

  assert.match(
    source,
    /this\.syncProjections\(workingState\)/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
