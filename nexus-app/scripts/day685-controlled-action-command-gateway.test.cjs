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
    path.join(os.tmpdir(), "nexus-day685-"),
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

function ownerContext(overrides = {}) {
  return {
    tenantId: "tenant-a",
    actorId: "owner-a",
    role: "owner",
    requestId: "request-owner-685",
    ...overrides,
  };
}

function workerContext(overrides = {}) {
  return {
    tenantId: "tenant-a",
    actorId: "worker-a",
    role: "worker",
    requestId: "request-worker-685",
    ...overrides,
  };
}

async function createQueuedAction(gateway) {
  await gateway.execute(ownerContext(), {
    type: "create_action",
    actionId: "action-685",
    idempotencyKey: "idempotency-685",
    effectType: "CUSTOMER_MESSAGE_DELIVERY",
    payloadDigest: "sha256:payload-685",
    auditId: "audit-create-685",
    now: "2026-07-10T18:00:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "authorize_action",
    actionId: "action-685",
    ownerAuthorizationId: "owner-approval-685",
    auditId: "audit-authorize-685",
    now: "2026-07-10T18:01:00.000Z",
  });

  await gateway.execute(ownerContext(), {
    type: "enqueue_action",
    actionId: "action-685",
    outboxId: "outbox-685",
    dispatchToken: "dispatch-685",
    maxDeliveryAttempts: 3,
    auditId: "audit-enqueue-685",
    now: "2026-07-10T18:02:00.000Z",
  });
}

test("runs the persistent lifecycle through one tenant-bound command gateway", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway);

    const claim = await environment.gateway.execute(
      workerContext(),
      {
        type: "claim_outbox",
        outboxId: "outbox-685",
        workerId: "worker-a",
        claimToken: "claim-685",
        leaseDurationMs: 120_000,
        auditId: "audit-claim-685",
        now: "2026-07-10T18:03:00.000Z",
      },
    );

    assert.equal(claim.result.status, "delivering");
    assert.equal(claim.result.leaseFence, 1);
    assert.equal(
      claim.executionBoundary,
      "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
    );
    assert.equal(claim.liveProviderExecutionAuthorized, false);

    const finalization =
      await environment.gateway.execute(
        workerContext(),
        {
          type: "finalize_action",
          actionId: "action-685",
          workerId: "worker-a",
          leaseFence: 1,
          terminalCommitToken: "terminal-685",
          finalStatus: "succeeded",
          resultDigest: "sha256:result-685",
          terminalReasonCode: null,
          auditId: "audit-finalize-685",
          now: "2026-07-10T18:04:00.000Z",
        },
      );

    assert.equal(finalization.result.status, "succeeded");
    assert.equal(
      finalization.liveProviderExecutionAuthorized,
      false,
    );

    const snapshot = await environment.gateway.execute(
      ownerContext(),
      {
        type: "read_tenant_snapshot",
      },
    );

    assert.equal(
      snapshot.result.actions["action-685"].status,
      "succeeded",
    );
    assert.equal(
      snapshot.result.outbox["outbox-685"].status,
      "delivered",
    );
    assert.equal(snapshot.result.audit.length, 5);
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("only an owner can authorize or enqueue a controlled action", async () => {
  const environment = await createEnvironment();

  try {
    await environment.gateway.execute(
      {
        tenantId: "tenant-a",
        actorId: "operator-a",
        role: "operator",
        requestId: "operator-create-685",
      },
      {
        type: "create_action",
        actionId: "action-role-685",
        idempotencyKey: "idempotency-role-685",
        effectType: "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest: "sha256:role-payload-685",
        auditId: "audit-role-create-685",
        now: "2026-07-10T19:00:00.000Z",
      },
    );

    await assert.rejects(
      () =>
        environment.gateway.execute(
          {
            tenantId: "tenant-a",
            actorId: "operator-a",
            role: "operator",
            requestId: "operator-authorize-685",
          },
          {
            type: "authorize_action",
            actionId: "action-role-685",
            ownerAuthorizationId: "forged-owner-approval",
            auditId: "audit-role-authorize-685",
            now: "2026-07-10T19:01:00.000Z",
          },
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

test("worker identity must match the authenticated gateway actor", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext(),
          {
            type: "claim_outbox",
            outboxId: "outbox-685",
            workerId: "different-worker",
            claimToken: "forged-worker-claim",
            leaseDurationMs: 60_000,
            auditId: "audit-forged-worker-685",
            now: "2026-07-10T20:00:00.000Z",
          },
        ),
      /does not match the authenticated actor/,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(
      snapshot.outbox["outbox-685"].status,
      "pending",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("cross-tenant workers cannot claim another tenant's outbox record", async () => {
  const environment = await createEnvironment();

  try {
    await createQueuedAction(environment.gateway);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          workerContext({
            tenantId: "tenant-b",
            actorId: "worker-b",
          }),
          {
            type: "claim_outbox",
            outboxId: "outbox-685",
            workerId: "worker-b",
            claimToken: "cross-tenant-claim",
            leaseDurationMs: 60_000,
            auditId: "audit-cross-tenant-685",
            now: "2026-07-10T20:30:00.000Z",
          },
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

test("tenant snapshots never expose another tenant's actions or audit events", async () => {
  const environment = await createEnvironment();

  try {
    await environment.gateway.execute(ownerContext(), {
      type: "create_action",
      actionId: "tenant-a-action-685",
      idempotencyKey: "tenant-a-idempotency-685",
      effectType: "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest: "sha256:tenant-a-685",
      auditId: "tenant-a-audit-685",
      now: "2026-07-10T21:00:00.000Z",
    });

    await environment.gateway.execute(
      ownerContext({
        tenantId: "tenant-b",
        actorId: "owner-b",
        requestId: "tenant-b-request-685",
      }),
      {
        type: "create_action",
        actionId: "tenant-b-action-685",
        idempotencyKey: "tenant-b-idempotency-685",
        effectType: "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest: "sha256:tenant-b-685",
        auditId: "tenant-b-audit-685",
        now: "2026-07-10T21:01:00.000Z",
      },
    );

    const tenantASnapshot =
      await environment.gateway.execute(
        ownerContext(),
        {
          type: "read_tenant_snapshot",
        },
      );

    assert.deepEqual(
      Object.keys(tenantASnapshot.result.actions),
      ["tenant-a-action-685"],
    );

    assert.equal(tenantASnapshot.result.audit.length, 1);
    assert.equal(
      tenantASnapshot.result.audit[0].tenantId,
      "tenant-a",
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("only the system owner can change the operational kill switch", async () => {
  const environment = await createEnvironment();

  try {
    await assert.rejects(
      () =>
        environment.gateway.execute(
          ownerContext(),
          {
            type: "set_operational_kill_switch",
            engaged: true,
            reason: "UNAUTHORIZED_STOP",
            auditId: "unauthorized-kill-685",
            now: "2026-07-10T22:00:00.000Z",
          },
        ),
      /not permitted/,
    );

    const result = await environment.gateway.execute(
      {
        tenantId: "__system__",
        actorId: "system-owner",
        role: "system_owner",
        requestId: "system-kill-685",
      },
      {
        type: "set_operational_kill_switch",
        engaged: true,
        reason: "OWNER_EMERGENCY_STOP",
        auditId: "authorized-kill-685",
        now: "2026-07-10T22:01:00.000Z",
      },
    );

    assert.equal(result.result.engaged, true);

    await assert.rejects(
      () =>
        environment.gateway.execute(
          ownerContext(),
          {
            type: "create_action",
            actionId: "blocked-action-685",
            idempotencyKey: "blocked-idempotency-685",
            effectType: "CUSTOMER_MESSAGE_DELIVERY",
            payloadDigest: "sha256:blocked-685",
            auditId: "blocked-create-685",
            now: "2026-07-10T22:02:00.000Z",
          },
        ),
      /kill switch is engaged/,
    );

    const snapshot =
      await environment.engine.readSnapshot();

    assert.equal(snapshot.killSwitch.engaged, true);
    assert.equal(
      snapshot.actions["blocked-action-685"],
      undefined,
    );
  } finally {
    await fsp.rm(environment.directory, {
      recursive: true,
      force: true,
    });
  }
});

test("gateway remains persistence-only and contains no provider execution path", () => {
  const gatewaySource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "lib/nexus/controlledActionCommandGateway.ts",
    ),
    "utf8",
  );

  const routeSource = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "app/api/nexus/internal/controlled-actions/route.ts",
    ),
    "utf8",
  );

  assert.match(
    gatewaySource,
    /PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION/,
  );

  assert.match(
    routeSource,
    /NEXUS_CONTROLLED_ACTION_GATEWAY_ENABLED/,
  );

  assert.doesNotMatch(
    `${gatewaySource}\n${routeSource}`,
    /\bfetch\s*\(/,
  );
});
