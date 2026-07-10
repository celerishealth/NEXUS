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
  DurableSignedGatewayOutcomeJournal,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/durableSignedGatewayOutcomeJournal.ts",
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
  calculateGatewayReplayExpiry,
  PersistentControlledActionGatewayReplayGuard,
  signControlledActionGatewayEnvelope,
  verifySignedControlledActionGatewayEnvelope,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/signedControlledActionGatewayEnvelope.ts",
  ),
);

const signingSecret =
  "day-691-test-secret-with-sufficient-entropy";

function createUnsignedEnvelope(overrides = {}) {
  return {
    version: 1,
    keyId: "primary",
    issuedAt: "2026-07-10T23:30:00.000Z",
    nonce: "nonce-691",
    context: {
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
      requestId: "request-691",
    },
    command: {
      type: "create_action",
      actionId: "action-691",
      idempotencyKey: "idempotency-691",
      effectType:
        "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest:
        "sha256:payload-691",
      auditId: "audit-691",
      now: "2026-07-10T23:30:00.000Z",
    },
    ...overrides,
  };
}

async function createEnvironment() {
  const directory = await fsp.mkdtemp(
    path.join(
      os.tmpdir(),
      "nexus-day691-",
    ),
  );

  const actionStatePath = path.join(
    directory,
    "actions.json",
  );

  const replayStatePath = path.join(
    directory,
    "replay.json",
  );

  const journalStatePath = path.join(
    directory,
    "outcomes.json",
  );

  const engine =
    new PersistentControlledActionVerticalSlice(
      actionStatePath,
    );

  return {
    directory,
    actionStatePath,
    replayStatePath,
    journalStatePath,
    engine,
    gateway:
      new ControlledActionCommandGateway(
        engine,
      ),
    replayGuard:
      new PersistentControlledActionGatewayReplayGuard(
        replayStatePath,
      ),
    journal:
      new DurableSignedGatewayOutcomeJournal(
        journalStatePath,
      ),
  };
}

function signAndVerify(unsignedEnvelope) {
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
      now: "2026-07-10T23:31:00.000Z",
      maxClockSkewMs: 300_000,
    },
  );
}

test("durably stores a successful signed command response for exact replay", async () => {
  const environment =
    await createEnvironment();

  try {
    const envelope = signAndVerify(
      createUnsignedEnvelope(),
    );

    const expiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        300_000,
      );

    const begin =
      await environment.journal.begin(
        envelope,
        "2026-07-10T23:31:00.000Z",
        expiresAt,
      );

    assert.equal(
      begin.disposition,
      "started",
    );

    const reserved =
      await environment.replayGuard.reserve(
        envelope.keyId,
        envelope.nonce,
        "2026-07-10T23:31:00.000Z",
        expiresAt,
      );

    assert.equal(reserved, true);

    const response =
      await environment.gateway.execute(
        envelope.context,
        envelope.command,
      );

    await environment.journal.finish(
      envelope.keyId,
      envelope.nonce,
      envelope.signature,
      "completed",
      "2026-07-10T23:31:01.000Z",
      200,
      response,
    );

    const restartedJournal =
      new DurableSignedGatewayOutcomeJournal(
        environment.journalStatePath,
      );

    const replay =
      await restartedJournal.begin(
        envelope,
        "2026-07-10T23:31:30.000Z",
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
      replay.entry.responseBody.result.actionId,
      "action-691",
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(snapshot.revision, 1);
    assert.equal(snapshot.audit.length, 1);
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

test("exact replay never executes the controlled-action command twice", async () => {
  const environment =
    await createEnvironment();

  try {
    const envelope = signAndVerify(
      createUnsignedEnvelope({
        nonce: "no-double-execution-691",
        command: {
          ...createUnsignedEnvelope().command,
          actionId:
            "no-double-execution-action-691",
          idempotencyKey:
            "no-double-execution-idempotency-691",
          auditId:
            "no-double-execution-audit-691",
        },
      }),
    );

    const expiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        300_000,
      );

    await environment.journal.begin(
      envelope,
      "2026-07-10T23:31:00.000Z",
      expiresAt,
    );

    const firstResponse =
      await environment.gateway.execute(
        envelope.context,
        envelope.command,
      );

    await environment.journal.finish(
      envelope.keyId,
      envelope.nonce,
      envelope.signature,
      "completed",
      "2026-07-10T23:31:01.000Z",
      200,
      firstResponse,
    );

    const beforeReplay =
      await environment.engine.readSnapshot();

    const replay =
      await environment.journal.begin(
        envelope,
        "2026-07-10T23:31:30.000Z",
        expiresAt,
      );

    assert.equal(
      replay.disposition,
      "replay",
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

test("an unfinished signed request is reported as in progress instead of re-executed", async () => {
  const environment =
    await createEnvironment();

  try {
    const envelope = signAndVerify(
      createUnsignedEnvelope({
        nonce: "in-progress-nonce-691",
      }),
    );

    const expiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        300_000,
      );

    const first =
      await environment.journal.begin(
        envelope,
        "2026-07-10T23:31:00.000Z",
        expiresAt,
      );

    const second =
      await environment.journal.begin(
        envelope,
        "2026-07-10T23:31:30.000Z",
        expiresAt,
      );

    assert.equal(
      first.disposition,
      "started",
    );

    assert.equal(
      second.disposition,
      "in_progress",
    );

    const snapshot =
      await environment.journal.readSnapshot();

    assert.equal(snapshot.revision, 1);
    assert.equal(
      Object.keys(snapshot.entries).length,
      1,
    );
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

test("same nonce with a different valid signed command is rejected as a conflict", async () => {
  const environment =
    await createEnvironment();

  try {
    const original = signAndVerify(
      createUnsignedEnvelope({
        nonce: "conflict-nonce-691",
      }),
    );

    const conflicting = signAndVerify(
      createUnsignedEnvelope({
        nonce: "conflict-nonce-691",
        context: {
          ...createUnsignedEnvelope().context,
          requestId:
            "different-request-691",
        },
        command: {
          ...createUnsignedEnvelope().command,
          actionId:
            "different-action-691",
          idempotencyKey:
            "different-idempotency-691",
          auditId:
            "different-audit-691",
        },
      }),
    );

    const expiresAt =
      calculateGatewayReplayExpiry(
        original.issuedAt,
        300_000,
      );

    await environment.journal.begin(
      original,
      "2026-07-10T23:31:00.000Z",
      expiresAt,
    );

    await assert.rejects(
      () =>
        environment.journal.begin(
          conflicting,
          "2026-07-10T23:31:30.000Z",
          expiresAt,
        ),
      /nonce conflicts with another durable request/,
    );
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

test("failed gateway outcomes are replayed with their original status and body", async () => {
  const environment =
    await createEnvironment();

  try {
    const envelope = signAndVerify(
      createUnsignedEnvelope({
        nonce: "failed-outcome-691",
      }),
    );

    const expiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        300_000,
      );

    await environment.journal.begin(
      envelope,
      "2026-07-10T23:31:00.000Z",
      expiresAt,
    );

    const failureBody = {
      error:
        "Owner authorization denied.",
      liveProviderExecutionAuthorized:
        false,
    };

    await environment.journal.finish(
      envelope.keyId,
      envelope.nonce,
      envelope.signature,
      "failed",
      "2026-07-10T23:31:01.000Z",
      403,
      failureBody,
    );

    const replay =
      await environment.journal.begin(
        envelope,
        "2026-07-10T23:31:30.000Z",
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
    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("internal route checks the durable journal before replay rejection", () => {
  const routeSource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "app/api/nexus/internal/controlled-actions/route.ts",
    ),
    "utf8",
  );

  assert.match(
    routeSource,
    /DurableSignedGatewayOutcomeJournal/,
  );

  assert.match(
    routeSource,
    /NEXUS_GATEWAY_OUTCOME_JOURNAL_PATH/,
  );

  assert.match(
    routeSource,
    /x-nexus-replayed-response/,
  );

  assert.match(
    routeSource,
    /PersistentControlledActionGatewayReplayGuard/,
  );

  const journalIndex = routeSource.indexOf(
    "outcomeJournal.begin",
  );

  const replayGuardIndex = routeSource.indexOf(
    "replayGuard.reserve",
  );

  assert.ok(journalIndex >= 0);
  assert.ok(replayGuardIndex >= 0);
  assert.ok(journalIndex < replayGuardIndex);

  assert.doesNotMatch(
    routeSource,
    /\bfetch\s*\(/,
  );
});
