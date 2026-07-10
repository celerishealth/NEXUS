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
  "day-690-test-secret-with-sufficient-entropy";

function createUnsignedEnvelope(overrides = {}) {
  return {
    version: 1,
    keyId: "primary",
    issuedAt: "2026-07-10T23:00:00.000Z",
    nonce: "nonce-690",
    context: {
      tenantId: "tenant-a",
      actorId: "owner-a",
      role: "owner",
      requestId: "request-690",
    },
    command: {
      type: "create_action",
      actionId: "action-690",
      idempotencyKey: "idempotency-690",
      effectType: "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest: "sha256:payload-690",
      auditId: "audit-690",
      now: "2026-07-10T23:00:00.000Z",
    },
    ...overrides,
  };
}

async function createEnvironment() {
  const directory = await fsp.mkdtemp(
    path.join(os.tmpdir(), "nexus-day690-"),
  );

  const actionStatePath = path.join(
    directory,
    "actions.json",
  );

  const replayStatePath = path.join(
    directory,
    "replay.json",
  );

  const engine =
    new PersistentControlledActionVerticalSlice(
      actionStatePath,
    );

  return {
    directory,
    actionStatePath,
    replayStatePath,
    engine,
    gateway:
      new ControlledActionCommandGateway(engine),
    replayGuard:
      new PersistentControlledActionGatewayReplayGuard(
        replayStatePath,
      ),
  };
}

test("signed envelope cryptographically binds tenant, actor, role and command", async () => {
  const environment = await createEnvironment();

  try {
    const signed =
      signControlledActionGatewayEnvelope(
        createUnsignedEnvelope(),
        signingSecret,
      );

    const verified =
      verifySignedControlledActionGatewayEnvelope(
        signed,
        {
          primary: signingSecret,
        },
        {
          now: "2026-07-10T23:01:00.000Z",
          maxClockSkewMs: 300_000,
        },
      );

    const reserved =
      await environment.replayGuard.reserve(
        verified.keyId,
        verified.nonce,
        "2026-07-10T23:01:00.000Z",
        calculateGatewayReplayExpiry(
          verified.issuedAt,
          300_000,
        ),
      );

    assert.equal(reserved, true);

    const result = await environment.gateway.execute(
      verified.context,
      verified.command,
    );

    assert.equal(
      result.result.tenantId,
      "tenant-a",
    );

    assert.equal(result.actorId, "owner-a");
    assert.equal(result.tenantId, "tenant-a");
    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.actions["action-690"].tenantId,
      "tenant-a",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("tampering with tenant identity invalidates the signature", () => {
  const signed =
    signControlledActionGatewayEnvelope(
      createUnsignedEnvelope(),
      signingSecret,
    );

  const tampered = {
    ...signed,
    context: {
      ...signed.context,
      tenantId: "tenant-b",
    },
  };

  assert.throws(
    () =>
      verifySignedControlledActionGatewayEnvelope(
        tampered,
        {
          primary: signingSecret,
        },
        {
          now: "2026-07-10T23:01:00.000Z",
          maxClockSkewMs: 300_000,
        },
      ),
    /signature verification failed/,
  );
});

test("tampering with the command payload invalidates the signature", () => {
  const signed =
    signControlledActionGatewayEnvelope(
      createUnsignedEnvelope(),
      signingSecret,
    );

  const tampered = {
    ...signed,
    command: {
      ...signed.command,
      payloadDigest:
        "sha256:attacker-replacement",
    },
  };

  assert.throws(
    () =>
      verifySignedControlledActionGatewayEnvelope(
        tampered,
        {
          primary: signingSecret,
        },
        {
          now: "2026-07-10T23:01:00.000Z",
          maxClockSkewMs: 300_000,
        },
      ),
    /signature verification failed/,
  );
});

test("stale signed requests are rejected before gateway execution", () => {
  const signed =
    signControlledActionGatewayEnvelope(
      createUnsignedEnvelope(),
      signingSecret,
    );

  assert.throws(
    () =>
      verifySignedControlledActionGatewayEnvelope(
        signed,
        {
          primary: signingSecret,
        },
        {
          now: "2026-07-10T23:10:00.000Z",
          maxClockSkewMs: 300_000,
        },
      ),
    /stale or issued too far/,
  );
});

test("unknown or disabled signing keys fail closed", () => {
  const signed =
    signControlledActionGatewayEnvelope(
      createUnsignedEnvelope(),
      signingSecret,
    );

  assert.throws(
    () =>
      verifySignedControlledActionGatewayEnvelope(
        signed,
        {
          replacement: signingSecret,
        },
        {
          now: "2026-07-10T23:01:00.000Z",
          maxClockSkewMs: 300_000,
        },
      ),
    /key is unknown or disabled/,
  );
});

test("durable replay guard rejects the same signed nonce after restart", async () => {
  const environment = await createEnvironment();

  try {
    const firstReservation =
      await environment.replayGuard.reserve(
        "primary",
        "durable-nonce-690",
        "2026-07-10T23:01:00.000Z",
        "2026-07-10T23:05:00.000Z",
      );

    assert.equal(firstReservation, true);

    const restartedGuard =
      new PersistentControlledActionGatewayReplayGuard(
        environment.replayStatePath,
      );

    const replayReservation =
      await restartedGuard.reserve(
        "primary",
        "durable-nonce-690",
        "2026-07-10T23:02:00.000Z",
        "2026-07-10T23:05:00.000Z",
      );

    assert.equal(replayReservation, false);

    const snapshot =
      await restartedGuard.readSnapshot();

    assert.equal(snapshot.revision, 1);
    assert.equal(
      Object.keys(snapshot.entries).length,
      1,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("expired nonce entries are removed before a new reservation", async () => {
  const environment = await createEnvironment();

  try {
    await environment.replayGuard.reserve(
      "primary",
      "expired-nonce-690",
      "2026-07-10T23:00:00.000Z",
      "2026-07-10T23:01:00.000Z",
    );

    const reserved =
      await environment.replayGuard.reserve(
        "primary",
        "new-nonce-690",
        "2026-07-10T23:02:00.000Z",
        "2026-07-10T23:07:00.000Z",
      );

    assert.equal(reserved, true);

    const snapshot =
      await environment.replayGuard.readSnapshot();

    assert.equal(
      snapshot.entries[
        "primary:expired-nonce-690"
      ],
      undefined,
    );

    assert.ok(
      snapshot.entries["primary:new-nonce-690"],
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("internal route no longer trusts unsigned identity headers", () => {
  const routeSource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "app/api/nexus/internal/controlled-actions/route.ts",
    ),
    "utf8",
  );

  assert.match(
    routeSource,
    /verifySignedControlledActionGatewayEnvelope/,
  );

  assert.match(
    routeSource,
    /PersistentControlledActionGatewayReplayGuard/,
  );

  assert.match(
    routeSource,
    /NEXUS_INTERNAL_GATEWAY_SIGNING_SECRET/,
  );

  assert.doesNotMatch(
    routeSource,
    /x-nexus-tenant-id/,
  );

  assert.doesNotMatch(
    routeSource,
    /x-nexus-actor-id/,
  );

  assert.doesNotMatch(
    routeSource,
    /x-nexus-role/,
  );

  assert.doesNotMatch(
    routeSource,
    /x-nexus-gateway-secret/,
  );

  assert.doesNotMatch(
    routeSource,
    /\bfetch\s*\(/,
  );
});
