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
  const directory = await fsp.mkdtemp(
    path.join(
      os.tmpdir(),
      "nexus-day692-",
    ),
  );

  const databasePath = path.join(
    directory,
    "controlled-actions.sqlite",
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

function ownerContext() {
  return {
    tenantId: "tenant-a",
    actorId: "owner-a",
    role: "owner",
    requestId: "owner-request-692",
  };
}

function workerContext() {
  return {
    tenantId: "tenant-a",
    actorId: "worker-a",
    role: "worker",
    requestId: "worker-request-692",
  };
}

async function runCompleteLifecycle(gateway) {
  await gateway.execute(ownerContext(), {
    type: "create_action",
    actionId: "action-692",
    idempotencyKey: "idempotency-692",
    effectType:
      "CUSTOMER_MESSAGE_DELIVERY",
    payloadDigest:
      "sha256:payload-692",
    auditId: "create-audit-692",
    now: "2026-07-11T00:00:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "authorize_action",
    actionId: "action-692",
    ownerAuthorizationId:
      "owner-approval-692",
    auditId: "authorize-audit-692",
    now: "2026-07-11T00:01:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "enqueue_action",
    actionId: "action-692",
    outboxId: "outbox-692",
    dispatchToken: "dispatch-692",
    maxDeliveryAttempts: 3,
    auditId: "enqueue-audit-692",
    now: "2026-07-11T00:02:00.000Z",
  });

  await gateway.execute(workerContext(), {
    type: "claim_next_outbox",
    workerId: "worker-a",
    claimToken: "claim-692",
    leaseDurationMs: 120_000,
    auditId: "claim-audit-692",
    now: "2026-07-11T00:03:00.000Z",
  });

  return gateway.execute(workerContext(), {
    type: "finalize_action",
    actionId: "action-692",
    workerId: "worker-a",
    leaseFence: 1,
    terminalCommitToken:
      "terminal-692",
    finalStatus: "succeeded",
    resultDigest:
      "sha256:result-692",
    terminalReasonCode: null,
    auditId: "finalize-audit-692",
    now: "2026-07-11T00:04:00.000Z",
  });
}

test("runs the complete controlled-action lifecycle through relational SQLite transactions", async () => {
  const environment =
    await createEnvironment();

  try {
    const result =
      await runCompleteLifecycle(
        environment.gateway,
      );

    assert.equal(
      result.result.status,
      "succeeded",
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(snapshot.revision, 5);
    assert.equal(snapshot.audit.length, 5);

    assert.equal(
      snapshot.actions["action-692"].status,
      "succeeded",
    );

    assert.equal(
      snapshot.outbox["outbox-692"].status,
      "delivered",
    );

    const metadata =
      environment.repository.readMetadata();

    assert.equal(metadata.schemaVersion, 1);
    assert.equal(metadata.revision, 5);
    assert.equal(
      metadata.journalMode.toLowerCase(),
      "wal",
    );
    assert.equal(
      metadata.integrityCheck.toLowerCase(),
      "ok",
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

test("SQLite state survives repository and engine restart", async () => {
  const environment =
    await createEnvironment();

  try {
    await runCompleteLifecycle(
      environment.gateway,
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

      const snapshot =
        await restartedEngine.readSnapshot();

      assert.equal(snapshot.revision, 5);

      assert.equal(
        snapshot.actions["action-692"].status,
        "succeeded",
      );

      assert.equal(
        snapshot.outbox["outbox-692"].status,
        "delivered",
      );

      assert.equal(
        snapshot.audit.at(-1).eventType,
        "CONTROLLED_ACTION_FINALIZED",
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

test("failed commands roll back without partial relational state changes", async () => {
  const environment =
    await createEnvironment();

  try {
    await environment.gateway.execute(
      ownerContext(),
      {
        type: "create_action",
        actionId: "rollback-action-692",
        idempotencyKey:
          "rollback-idempotency-692",
        effectType:
          "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest:
          "sha256:rollback-payload-692",
        auditId: "rollback-create-692",
        now: "2026-07-11T01:00:00.000Z",
      },
    );

    const before =
      await environment.engine.readSnapshot();

    await assert.rejects(
      () =>
        environment.gateway.execute(
          {
            tenantId: "tenant-b",
            actorId: "owner-b",
            role: "owner",
            requestId:
              "rollback-invalid-request-692",
          },
          {
            type: "authorize_action",
            actionId:
              "rollback-action-692",
            ownerAuthorizationId:
              "invalid-approval-692",
            auditId:
              "rollback-invalid-audit-692",
            now:
              "2026-07-11T01:01:00.000Z",
          },
        ),
      /tenant mismatch/,
    );

    const after =
      await environment.engine.readSnapshot();

    assert.equal(
      after.revision,
      before.revision,
    );

    assert.equal(
      after.audit.length,
      before.audit.length,
    );

    assert.equal(
      after.actions[
        "rollback-action-692"
      ].status,
      "pending",
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

test("tenant-scoped idempotency conflicts cannot partially commit", async () => {
  const environment =
    await createEnvironment();

  try {
    await environment.gateway.execute(
      ownerContext(),
      {
        type: "create_action",
        actionId:
          "idempotency-first-692",
        idempotencyKey:
          "shared-idempotency-692",
        effectType:
          "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest:
          "sha256:first-692",
        auditId:
          "idempotency-first-audit-692",
        now:
          "2026-07-11T02:00:00.000Z",
      },
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          ownerContext(),
          {
            type: "create_action",
            actionId:
              "idempotency-second-692",
            idempotencyKey:
              "shared-idempotency-692",
            effectType:
              "CUSTOMER_MESSAGE_DELIVERY",
            payloadDigest:
              "sha256:second-692",
            auditId:
              "idempotency-second-audit-692",
            now:
              "2026-07-11T02:01:00.000Z",
          },
        ),
      /identity or idempotency conflict/,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(snapshot.revision, 1);
    assert.equal(snapshot.audit.length, 1);

    assert.equal(
      snapshot.actions[
        "idempotency-second-692"
      ],
      undefined,
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

test("two engines using the same SQLite database observe one durable state", async () => {
  const environment =
    await createEnvironment();

  let secondRepository;

  try {
    secondRepository =
      new SQLiteControlledActionStateRepository(
        environment.databasePath,
      );

    const secondEngine =
      new PersistentControlledActionVerticalSlice(
        secondRepository,
      );

    await environment.gateway.execute(
      ownerContext(),
      {
        type: "create_action",
        actionId:
          "shared-database-action-692",
        idempotencyKey:
          "shared-database-idempotency-692",
        effectType:
          "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest:
          "sha256:shared-database-692",
        auditId:
          "shared-database-audit-692",
        now:
          "2026-07-11T03:00:00.000Z",
      },
    );

    const secondSnapshot =
      await secondEngine.readSnapshot();

    assert.equal(
      secondSnapshot.actions[
        "shared-database-action-692"
      ].status,
      "pending",
    );

    assert.equal(
      secondSnapshot.revision,
      1,
    );
  } finally {
    if (secondRepository) {
      secondRepository.close();
    }

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

test("route supports explicit SQLite storage while remaining file-backed by default", () => {
  const routeSource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "app/api/nexus/internal/controlled-actions/route.ts",
    ),
    "utf8",
  );

  assert.match(
    routeSource,
    /SQLiteControlledActionStateRepository/,
  );

  assert.match(
    routeSource,
    /NEXUS_CONTROLLED_ACTION_STORAGE/,
  );

  assert.match(
    routeSource,
    /NEXUS_CONTROLLED_ACTION_SQLITE_PATH/,
  );

  assert.match(
    routeSource,
    /storageMode === "sqlite"/,
  );

  assert.match(
    routeSource,
    /storageMode === "file"/,
  );

  assert.doesNotMatch(
    routeSource,
    /\bfetch\s*\(/,
  );
});

test("SQLite repository contains no live provider execution path", () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "lib/nexus/sqliteControlledActionStateRepository.ts",
    ),
    "utf8",
  );

  assert.match(
    source,
    /BEGIN IMMEDIATE/,
  );

  assert.match(
    source,
    /PRAGMA journal_mode = WAL/,
  );

  assert.match(
    source,
    /optimistic revision conflict/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
