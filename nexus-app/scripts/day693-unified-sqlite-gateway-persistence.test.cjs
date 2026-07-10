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
    const source =
      fs.readFileSync(
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
  signControlledActionGatewayEnvelope,
  verifySignedControlledActionGatewayEnvelope,
  calculateGatewayReplayExpiry,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/signedControlledActionGatewayEnvelope.ts",
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

const {
  SQLiteSignedGatewayRequestStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteSignedGatewayRequestStore.ts",
  ),
);

const signingSecret =
  "day-693-unified-sqlite-secret";

function createUnsignedEnvelope(
  overrides = {},
) {
  return {
    version: 1,
    keyId: "primary",
    issuedAt:
      "2026-07-11T04:00:00.000Z",
    nonce: "nonce-693",
    context: {
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
      requestId: "request-693",
    },
    command: {
      type: "create_action",
      actionId: "action-693",
      idempotencyKey:
        "idempotency-693",
      effectType:
        "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest:
        "sha256:payload-693",
      auditId: "audit-693",
      now:
        "2026-07-11T04:00:00.000Z",
    },
    ...overrides,
  };
}

function signAndVerify(
  unsignedEnvelope,
) {
  const signed =
    signControlledActionGatewayEnvelope(
      unsignedEnvelope,
      signingSecret,
    );

  return verifySignedControlledActionGatewayEnvelope(
    signed,
    {
      primary: signingSecret,
    },
    {
      now:
        "2026-07-11T04:01:00.000Z",
      maxClockSkewMs: 300_000,
    },
  );
}

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day693-",
      ),
    );

  const databasePath = path.join(
    directory,
    "nexus-runtime.sqlite",
  );

  const actionRepository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  const signedGatewayStore =
    new SQLiteSignedGatewayRequestStore(
      databasePath,
    );

  const engine =
    new PersistentControlledActionVerticalSlice(
      actionRepository,
    );

  return {
    directory,
    databasePath,
    actionRepository,
    signedGatewayStore,
    engine,
    gateway:
      new ControlledActionCommandGateway(
        engine,
      ),
  };
}

test("action state, replay nonce and signed outcome share one durable SQLite database", async () => {
  const environment =
    await createEnvironment();

  try {
    const envelope =
      signAndVerify(
        createUnsignedEnvelope(),
      );

    const expiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        300_000,
      );

    const begin =
      await environment
        .signedGatewayStore
        .begin(
          envelope,
          "2026-07-11T04:01:00.000Z",
          expiresAt,
        );

    assert.equal(
      begin.disposition,
      "started",
    );

    const reserved =
      await environment
        .signedGatewayStore
        .reserve(
          envelope.keyId,
          envelope.nonce,
          "2026-07-11T04:01:00.000Z",
          expiresAt,
        );

    assert.equal(reserved, true);

    const response =
      await environment.gateway.execute(
        envelope.context,
        envelope.command,
      );

    await environment
      .signedGatewayStore
      .finish(
        envelope.keyId,
        envelope.nonce,
        envelope.signature,
        "completed",
        "2026-07-11T04:01:01.000Z",
        200,
        response,
      );

    const actionSnapshot =
      await environment.engine.readSnapshot();

    const gatewaySnapshot =
      await environment
        .signedGatewayStore
        .readSnapshot();

    assert.equal(
      actionSnapshot.revision,
      1,
    );

    assert.equal(
      actionSnapshot.actions[
        "action-693"
      ].tenantId,
      "tenant-a",
    );

    assert.equal(
      gatewaySnapshot.outcomes.length,
      1,
    );

    assert.equal(
      gatewaySnapshot.outcomes[0].status,
      "completed",
    );

    assert.equal(
      gatewaySnapshot.replayEntries.length,
      1,
    );

    assert.equal(
      response
        .liveProviderExecutionAuthorized,
      false,
    );

    const actionMetadata =
      environment.actionRepository
        .readMetadata();

    const gatewayMetadata =
      environment.signedGatewayStore
        .readMetadata();

    assert.equal(
      actionMetadata.integrityCheck
        .toLowerCase(),
      "ok",
    );

    assert.equal(
      gatewayMetadata.integrityCheck
        .toLowerCase(),
      "ok",
    );

    assert.equal(
      gatewayMetadata.journalMode
        .toLowerCase(),
      "wal",
    );
  } finally {
    environment
      .signedGatewayStore
      .close();

    environment
      .actionRepository
      .close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("signed outcome and replay protection survive full SQLite restart", async () => {
  const environment =
    await createEnvironment();

  try {
    const envelope =
      signAndVerify(
        createUnsignedEnvelope({
          nonce:
            "restart-nonce-693",
          command: {
            ...createUnsignedEnvelope()
              .command,
            actionId:
              "restart-action-693",
            idempotencyKey:
              "restart-idempotency-693",
            auditId:
              "restart-audit-693",
          },
        }),
      );

    const expiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        300_000,
      );

    await environment
      .signedGatewayStore
      .begin(
        envelope,
        "2026-07-11T04:01:00.000Z",
        expiresAt,
      );

    await environment
      .signedGatewayStore
      .reserve(
        envelope.keyId,
        envelope.nonce,
        "2026-07-11T04:01:00.000Z",
        expiresAt,
      );

    const response =
      await environment.gateway.execute(
        envelope.context,
        envelope.command,
      );

    await environment
      .signedGatewayStore
      .finish(
        envelope.keyId,
        envelope.nonce,
        envelope.signature,
        "completed",
        "2026-07-11T04:01:01.000Z",
        200,
        response,
      );

    environment
      .signedGatewayStore
      .close();

    environment
      .actionRepository
      .close();

    const restartedActionRepository =
      new SQLiteControlledActionStateRepository(
        environment.databasePath,
      );

    const restartedGatewayStore =
      new SQLiteSignedGatewayRequestStore(
        environment.databasePath,
      );

    try {
      const replay =
        await restartedGatewayStore.begin(
          envelope,
          "2026-07-11T04:02:00.000Z",
          expiresAt,
        );

      assert.equal(
        replay.disposition,
        "replay",
      );

      assert.equal(
        replay.entry.httpStatus,
        200,
      );

      assert.equal(
        replay.entry.responseBody
          .result.actionId,
        "restart-action-693",
      );

      const secondReservation =
        await restartedGatewayStore
          .reserve(
            envelope.keyId,
            envelope.nonce,
            "2026-07-11T04:02:00.000Z",
            expiresAt,
          );

      assert.equal(
        secondReservation,
        false,
      );

      const restartedEngine =
        new PersistentControlledActionVerticalSlice(
          restartedActionRepository,
        );

      const snapshot =
        await restartedEngine
          .readSnapshot();

      assert.equal(
        snapshot.actions[
          "restart-action-693"
        ].status,
        "pending",
      );

      assert.equal(
        snapshot.revision,
        1,
      );
    } finally {
      restartedGatewayStore.close();
      restartedActionRepository.close();
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

test("same nonce with a different signed request fails closed in SQLite", async () => {
  const environment =
    await createEnvironment();

  try {
    const original =
      signAndVerify(
        createUnsignedEnvelope({
          nonce:
            "conflict-nonce-693",
        }),
      );

    const conflicting =
      signAndVerify(
        createUnsignedEnvelope({
          nonce:
            "conflict-nonce-693",
          context: {
            ...createUnsignedEnvelope()
              .context,
            requestId:
              "different-request-693",
          },
          command: {
            ...createUnsignedEnvelope()
              .command,
            actionId:
              "different-action-693",
            idempotencyKey:
              "different-idempotency-693",
            auditId:
              "different-audit-693",
          },
        }),
      );

    const expiresAt =
      calculateGatewayReplayExpiry(
        original.issuedAt,
        300_000,
      );

    await environment
      .signedGatewayStore
      .begin(
        original,
        "2026-07-11T04:01:00.000Z",
        expiresAt,
      );

    await assert.rejects(
      () =>
        environment
          .signedGatewayStore
          .begin(
            conflicting,
            "2026-07-11T04:01:30.000Z",
            expiresAt,
          ),
      /nonce conflicts with another durable request/,
    );

    const snapshot =
      await environment
        .signedGatewayStore
        .readSnapshot();

    assert.equal(
      snapshot.outcomes.length,
      1,
    );
  } finally {
    environment
      .signedGatewayStore
      .close();

    environment
      .actionRepository
      .close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("failed signed command outcomes remain exactly replayable", async () => {
  const environment =
    await createEnvironment();

  try {
    const envelope =
      signAndVerify(
        createUnsignedEnvelope({
          nonce:
            "failed-outcome-693",
        }),
      );

    const expiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        300_000,
      );

    await environment
      .signedGatewayStore
      .begin(
        envelope,
        "2026-07-11T04:01:00.000Z",
        expiresAt,
      );

    const failureBody = {
      error:
        "Owner authorization denied.",
      liveProviderExecutionAuthorized:
        false,
    };

    await environment
      .signedGatewayStore
      .finish(
        envelope.keyId,
        envelope.nonce,
        envelope.signature,
        "failed",
        "2026-07-11T04:01:01.000Z",
        403,
        failureBody,
      );

    const replay =
      await environment
        .signedGatewayStore
        .begin(
          envelope,
          "2026-07-11T04:02:00.000Z",
          expiresAt,
        );

    assert.equal(
      replay.disposition,
      "replay",
    );

    assert.equal(
      replay.entry.httpStatus,
      403,
    );

    assert.deepEqual(
      replay.entry.responseBody,
      failureBody,
    );
  } finally {
    environment
      .signedGatewayStore
      .close();

    environment
      .actionRepository
      .close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("expired relational nonce and outcome records are removed before new work", async () => {
  const environment =
    await createEnvironment();

  try {
    const expiredEnvelope =
      signAndVerify(
        createUnsignedEnvelope({
          nonce:
            "expired-nonce-693",
        }),
      );

    await environment
      .signedGatewayStore
      .begin(
        expiredEnvelope,
        "2026-07-11T04:01:00.000Z",
        "2026-07-11T04:02:00.000Z",
      );

    await environment
      .signedGatewayStore
      .reserve(
        expiredEnvelope.keyId,
        expiredEnvelope.nonce,
        "2026-07-11T04:01:00.000Z",
        "2026-07-11T04:02:00.000Z",
      );

    const newEnvelope =
      signAndVerify(
        createUnsignedEnvelope({
          nonce:
            "new-nonce-693",
          context: {
            ...createUnsignedEnvelope()
              .context,
            requestId:
              "new-request-693",
          },
          command: {
            ...createUnsignedEnvelope()
              .command,
            actionId:
              "new-action-693",
            idempotencyKey:
              "new-idempotency-693",
            auditId:
              "new-audit-693",
          },
        }),
      );

    await environment
      .signedGatewayStore
      .begin(
        newEnvelope,
        "2026-07-11T04:03:00.000Z",
        "2026-07-11T04:05:00.000Z",
      );

    await environment
      .signedGatewayStore
      .reserve(
        newEnvelope.keyId,
        newEnvelope.nonce,
        "2026-07-11T04:03:00.000Z",
        "2026-07-11T04:05:00.000Z",
      );

    const snapshot =
      await environment
        .signedGatewayStore
        .readSnapshot();

    assert.equal(
      snapshot.outcomes.length,
      1,
    );

    assert.equal(
      snapshot.outcomes[0].nonce,
      "new-nonce-693",
    );

    assert.equal(
      snapshot.replayEntries.length,
      1,
    );

    assert.equal(
      snapshot.replayEntries[0].nonce,
      "new-nonce-693",
    );
  } finally {
    environment
      .signedGatewayStore
      .close();

    environment
      .actionRepository
      .close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("internal route uses unified SQLite gateway storage only when SQLite mode is selected", () => {
  const routeSource =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/internal/controlled-actions/route.ts",
      ),
      "utf8",
    );

  assert.match(
    routeSource,
    /SQLiteSignedGatewayRequestStore/,
  );

  assert.match(
    routeSource,
    /controlledActionStorageMode === "sqlite"/,
  );

  assert.match(
    routeSource,
    /sqliteSignedGatewayStore \?\?/,
  );

  assert.match(
    routeSource,
    /new PersistentControlledActionGatewayReplayGuard/,
  );

  assert.match(
    routeSource,
    /new DurableSignedGatewayOutcomeJournal/,
  );

  assert.doesNotMatch(
    routeSource,
    /\bfetch\s*\(/,
  );
});

test("SQLite signed-gateway store contains transactional constraints and no provider execution", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/sqliteSignedGatewayRequestStore.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /BEGIN IMMEDIATE/,
  );

  assert.match(
    source,
    /PRIMARY KEY \(key_id, nonce\)/,
  );

  assert.match(
    source,
    /status IN/,
  );

  assert.match(
    source,
    /PRAGMA journal_mode = WAL/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
