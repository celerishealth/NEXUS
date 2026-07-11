const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day780-compiled",
);

const {
  createControlledInternalPilotReadinessProbe,
  ControlledInternalPilotReadinessProbeError,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotReadinessProbe.js",
  ),
);

const {
  createControlledInternalPilotOwnerRecoveryWorkflow,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotOwnerRecoveryWorkflow.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function consoleSnapshot(
  phase,
  options = {},
) {
  const active =
    phase !== "authority-ready" &&
    phase !== "revoked";

  const completed =
    phase === "completed";

  return {
    tenantId: "tenant-a",
    phase,
    statusMessage:
      options.statusMessage ||
      `Console phase ${phase}`,
    busy: false,
    activeSessionId:
      active
        ? "session-780-active"
        : null,
    lastRun:
      completed
        ? {
            requestId:
              "request-780-0001",
            idempotencyKey:
              "idem-780-0001",
            requestedAt:
              "2026-07-12T00:00:00.000Z",
            requestDigest:
              "a".repeat(64),
            replay:
              options.replay === true,
            result: {
              completedCount: 1,
            },
          }
        : null,
    lastError: null,
    canIssueSession:
      phase === "authority-ready",
    canRunSandbox:
      active,
    canReplayLastRun:
      completed,
    canRevokeSession:
      active,
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...options.overrides,
  };
}

function recoverySnapshot(
  phase,
  consolePhase,
  options = {},
) {
  return {
    tenantId: "tenant-a",
    phase,
    statusMessage:
      options.statusMessage ||
      `Recovery phase ${phase}`,
    busy: false,
    recoveryAttempt: 0,
    maxRecoveryAttempts: 2,
    pendingBatchSize: null,
    lastFailure: null,
    console:
      consoleSnapshot(
        consolePhase,
        {
          replay:
            options.replay,
          overrides:
            options.consoleOverrides,
        },
      ),
    canRetryFailedRun: false,
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...options.overrides,
  };
}

function makeWorkflow(options = {}) {
  let state =
    recoverySnapshot(
      "ready",
      "authority-ready",
    );

  const calls = [];

  const workflow = {
    getSnapshot() {
      calls.push("getSnapshot");

      if (options.initialState) {
        return clone(
          options.initialState,
        );
      }

      return clone(state);
    },

    async issueSession(ttlSeconds) {
      calls.push([
        "issueSession",
        ttlSeconds,
      ]);

      if (options.issue) {
        return options.issue(
          ttlSeconds,
          state,
        );
      }

      state =
        recoverySnapshot(
          "session-ready",
          "session-ready",
        );

      return clone(state);
    },

    async runSandboxCycle(input) {
      calls.push([
        "runSandboxCycle",
        clone(input),
      ]);

      if (options.run) {
        return options.run(
          input,
          state,
        );
      }

      state =
        recoverySnapshot(
          "completed",
          "completed",
          {
            replay: false,
          },
        );

      return clone(state);
    },

    async retryFailedRun() {
      calls.push(
        "retryFailedRun",
      );

      return clone(state);
    },

    async replayLastRun() {
      calls.push(
        "replayLastRun",
      );

      if (options.replay) {
        return options.replay(
          state,
        );
      }

      state =
        recoverySnapshot(
          "completed",
          "completed",
          {
            replay: true,
          },
        );

      return clone(state);
    },

    async revokeSession() {
      calls.push(
        "revokeSession",
      );

      if (options.revoke) {
        return options.revoke(
          state,
        );
      }

      state =
        recoverySnapshot(
          "revoked",
          "revoked",
        );

      return clone(state);
    },
  };

  return {
    workflow,
    calls,
  };
}

function makeProbe(options = {}) {
  const workflowHarness =
    options.workflowHarness ||
    makeWorkflow(
      options.workflowOptions || {},
    );

  let clockIndex = 0;

  const times =
    options.times || [
      "2026-07-12T00:00:00.000Z",
      "2026-07-12T00:00:01.000Z",
    ];

  const probe =
    createControlledInternalPilotReadinessProbe({
      tenantId:
        options.tenantId ||
        "tenant-a",
      workflow:
        workflowHarness.workflow,
      now: () =>
        new Date(
          times[
            Math.min(
              clockIndex++,
              times.length - 1,
            )
          ],
        ),
      createProbeId:
        () =>
          options.probeId ||
          "probe-780-0001",
    });

  return {
    probe,
    ...workflowHarness,
  };
}

async function expectCode(
  operation,
  expectedCode,
) {
  await assert.rejects(
    operation,
    (error) => {
      assert.ok(
        error instanceof
          ControlledInternalPilotReadinessProbeError,
      );

      assert.equal(
        error.code,
        expectedCode,
      );

      return true;
    },
  );
}

async function runProbe(
  harness,
) {
  return harness.probe.run({
    ttlSeconds: 3600,
    batchSize: 2,
  });
}

check("invalid readiness probe configuration is rejected", async () => {
  assert.throws(
    () =>
      createControlledInternalPilotReadinessProbe({
        tenantId: "tenant-a",
        workflow: {},
      }),
    (error) => {
      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("initial readiness probe snapshot is safe and runnable", async () => {
  const harness = makeProbe();

  const snapshot =
    harness.probe.getSnapshot();

  assert.equal(
    snapshot.phase,
    "idle",
  );

  assert.equal(
    snapshot.canRun,
    true,
  );

  assert.equal(
    snapshot.report,
    null,
  );
});

check("readiness probe exposes no live execution control", async () => {
  const harness = makeProbe();

  assert.deepEqual(
    Object.keys(
      harness.probe,
    ).sort(),
    [
      "getSnapshot",
      "run",
    ],
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      harness.probe,
      "runLive",
    ),
    false,
  );
});

check("readiness probe sends exact TTL and batch size", async () => {
  const harness = makeProbe();

  await runProbe(harness);

  assert.deepEqual(
    harness.calls.filter(
      (call) =>
        Array.isArray(call),
    ),
    [
      [
        "issueSession",
        3600,
      ],
      [
        "runSandboxCycle",
        {
          batchSize: 2,
        },
      ],
    ],
  );
});

check("readiness probe executes exact owner workflow order", async () => {
  const harness = makeProbe();

  await runProbe(harness);

  const ordered =
    harness.calls.filter(
      (call) =>
        call !== "getSnapshot",
    );

  assert.deepEqual(
    ordered,
    [
      [
        "issueSession",
        3600,
      ],
      [
        "runSandboxCycle",
        {
          batchSize: 2,
        },
      ],
      "replayLastRun",
      "revokeSession",
    ],
  );
});

check("successful readiness probe returns ready status", async () => {
  const harness = makeProbe();

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.phase,
    "ready",
  );

  assert.equal(
    snapshot.report.status,
    "ready",
  );

  assert.equal(
    snapshot.report.failure,
    null,
  );
});

check("successful readiness probe records six passed checks", async () => {
  const harness = makeProbe();

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.checks.length,
    6,
  );

  assert.equal(
    snapshot.report.checks.every(
      (item) =>
        item.passed === true,
    ),
    true,
  );
});

check("successful readiness probe verifies exact check sequence", async () => {
  const harness = makeProbe();

  const snapshot =
    await runProbe(harness);

  assert.deepEqual(
    snapshot.report.checks.map(
      (item) => item.name,
    ),
    [
      "initial-safety-boundaries",
      "secure-session-issue",
      "sandbox-execution",
      "idempotent-replay",
      "secure-session-revocation",
      "final-safety-boundaries",
    ],
  );
});

check("readiness report has deterministic evidence digest", async () => {
  const first = makeProbe();
  const second = makeProbe();

  const firstResult =
    await runProbe(first);

  const secondResult =
    await runProbe(second);

  assert.equal(
    firstResult.report.evidenceDigest,
    secondResult.report.evidenceDigest,
  );

  assert.match(
    firstResult.report.evidenceDigest,
    /^[a-f0-9]{64}$/,
  );
});

check("evidence digest changes when probe identity changes", async () => {
  const first =
    makeProbe({
      probeId:
        "probe-780-0001",
    });

  const second =
    makeProbe({
      probeId:
        "probe-780-0002",
    });

  const firstResult =
    await runProbe(first);

  const secondResult =
    await runProbe(second);

  assert.notEqual(
    firstResult.report.evidenceDigest,
    secondResult.report.evidenceDigest,
  );
});

check("readiness report and checks are immutable", async () => {
  const harness = makeProbe();

  const snapshot =
    await runProbe(harness);

  assert.equal(
    Object.isFrozen(snapshot),
    true,
  );

  assert.equal(
    Object.isFrozen(
      snapshot.report,
    ),
    true,
  );

  assert.equal(
    Object.isFrozen(
      snapshot.report.checks,
    ),
    true,
  );
});

check("readiness report contains no session or CSRF credentials", async () => {
  const harness = makeProbe();

  const snapshot =
    await runProbe(harness);

  const text =
    JSON.stringify(snapshot.report);

  assert.doesNotMatch(
    text,
    /session-780-active/,
  );

  assert.doesNotMatch(
    text,
    /csrf|cookie|authorization/i,
  );
});

check("invalid additional probe input field is blocked", async () => {
  const harness = makeProbe();

  await expectCode(
    harness.probe.run({
      ttlSeconds: 3600,
      batchSize: 2,
      liveProviderExecution:
        "allowed",
    }),
    "INVALID_INPUT",
  );
});

check("invalid readiness TTL is blocked", async () => {
  const harness = makeProbe();

  await expectCode(
    harness.probe.run({
      ttlSeconds: 299,
      batchSize: 2,
    }),
    "INVALID_INPUT",
  );
});

check("invalid readiness batch size is blocked", async () => {
  const harness = makeProbe();

  await expectCode(
    harness.probe.run({
      ttlSeconds: 3600,
      batchSize: 0,
    }),
    "INVALID_INPUT",
  );
});

check("concurrent readiness probes are blocked", async () => {
  let resolveIssue;

  const deferred =
    new Promise((resolve) => {
      resolveIssue = resolve;
    });

  const harness =
    makeProbe({
      workflowOptions: {
        issue:
          async () => deferred,
      },
    });

  const first =
    runProbe(harness);

  await Promise.resolve();

  await expectCode(
    runProbe(harness),
    "OPERATION_IN_PROGRESS",
  );

  resolveIssue(
    recoverySnapshot(
      "session-ready",
      "session-ready",
    ),
  );

  await first;
});

check("completed readiness probe cannot be rerun", async () => {
  const harness = makeProbe();

  await runProbe(harness);

  await expectCode(
    runProbe(harness),
    "PROBE_ALREADY_COMPLETED",
  );
});

check("cross-tenant initial workflow state returns not-ready", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        initialState:
          recoverySnapshot(
            "ready",
            "authority-ready",
            {
              overrides: {
                tenantId:
                  "tenant-b",
              },
            },
          ),
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );

  assert.equal(
    snapshot.report.failure.code,
    "WORKFLOW_STATE_INVALID",
  );
});

check("unlocked initial safety boundary returns not-ready", async () => {
  const unsafe =
    recoverySnapshot(
      "ready",
      "authority-ready",
      {
        overrides: {
          publicLaunch:
            "allowed",
        },
      },
    );

  const harness =
    makeProbe({
      workflowOptions: {
        initialState: unsafe,
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );

  assert.equal(
    snapshot.report.checks[0].passed,
    false,
  );
});

check("session issue failure returns safe not-ready report", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        issue:
          async () => {
            const error =
              new Error(
                "Session service unavailable.",
              );

            error.code =
              "SESSION_SERVICE_UNAVAILABLE";

            throw error;
          },
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );

  assert.equal(
    snapshot.report.failure.code,
    "SESSION_SERVICE_UNAVAILABLE",
  );
});

check("issue failure does not attempt unnecessary revocation", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        issue:
          async () => {
            const error =
              new Error(
                "Issue failed safely.",
              );

            error.code =
              "SESSION_SERVICE_UNAVAILABLE";

            throw error;
          },
      },
    });

  await runProbe(harness);

  assert.equal(
    harness.calls.includes(
      "revokeSession",
    ),
    false,
  );
});

check("sandbox failure triggers secure session cleanup", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        run:
          async () => {
            const error =
              new Error(
                "Sandbox execution failed safely.",
              );

            error.code =
              "CYCLE_EXECUTION_FAILED";

            throw error;
          },
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    harness.calls.includes(
      "revokeSession",
    ),
    true,
  );

  assert.equal(
    snapshot.report.checks.some(
      (item) =>
        item.name ===
          "failure-cleanup-revocation" &&
        item.passed === true,
    ),
    true,
  );
});

check("cleanup revocation failure remains visible and fail-closed", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        run:
          async () => {
            const error =
              new Error(
                "Sandbox execution failed safely.",
              );

            error.code =
              "CYCLE_EXECUTION_FAILED";

            throw error;
          },

        revoke:
          async () => {
            const error =
              new Error(
                "Cleanup failed safely.",
              );

            error.code =
              "SESSION_SERVICE_UNAVAILABLE";

            throw error;
          },
      },
    });

  const snapshot =
    await runProbe(harness);

  const cleanup =
    snapshot.report.checks.find(
      (item) =>
        item.name ===
        "failure-cleanup-revocation",
    );

  assert.equal(
    cleanup.passed,
    false,
  );

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );
});

check("replay request identity mismatch returns not-ready", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        replay:
          async () =>
            recoverySnapshot(
              "completed",
              "completed",
              {
                replay: true,
                consoleOverrides: {
                  lastRun: {
                    requestId:
                      "request-780-other",
                    idempotencyKey:
                      "idem-780-0001",
                    requestedAt:
                      "2026-07-12T00:00:00.000Z",
                    requestDigest:
                      "a".repeat(64),
                    replay: true,
                    result: {
                      completedCount: 1,
                    },
                  },
                },
              },
            ),
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );

  assert.equal(
    snapshot.report.failure.code,
    "WORKFLOW_STATE_INVALID",
  );
});

check("non-replay response is blocked", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        replay:
          async () =>
            recoverySnapshot(
              "completed",
              "completed",
              {
                replay: false,
              },
            ),
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );
});

check("invalid revoked state returns not-ready", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        revoke:
          async () =>
            recoverySnapshot(
              "session-ready",
              "session-ready",
            ),
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );

  assert.equal(
    snapshot.report.failure.code,
    "WORKFLOW_STATE_INVALID",
  );
});

check("raw infrastructure failure details are not exposed", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        run:
          async () => {
            throw new Error(
              "postgres password=raw-secret",
            );
          },
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.failure.code,
    "READINESS_PROBE_FAILED",
  );

  assert.doesNotMatch(
    snapshot.report.failure.message,
    /postgres|password|raw-secret/i,
  );
});

check("secret-bearing workflow snapshot is blocked", async () => {
  const unsafe =
    recoverySnapshot(
      "ready",
      "authority-ready",
    );

  unsafe.console.sessionToken =
    "raw-session-token-secret";

  const harness =
    makeProbe({
      workflowOptions: {
        initialState: unsafe,
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );

  assert.doesNotMatch(
    JSON.stringify(
      snapshot.report,
    ),
    /raw-session-token-secret/,
  );
});

check("malformed sandbox digest is blocked", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        run:
          async () =>
            recoverySnapshot(
              "completed",
              "completed",
              {
                consoleOverrides: {
                  lastRun: {
                    requestId:
                      "request-780-0001",
                    idempotencyKey:
                      "idem-780-0001",
                    requestedAt:
                      "2026-07-12T00:00:00.000Z",
                    requestDigest:
                      "not-a-digest",
                    replay: false,
                    result: {
                      completedCount: 1,
                    },
                  },
                },
              },
            ),
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );
});

check("successful probe finishes with revoked workflow state", async () => {
  const harness = makeProbe();

  await runProbe(harness);

  const revokeCalls =
    harness.calls.filter(
      (item) =>
        item ===
        "revokeSession",
    );

  assert.equal(
    revokeCalls.length,
    1,
  );
});

check("not-ready report keeps every unsafe boundary blocked", async () => {
  const harness =
    makeProbe({
      workflowOptions: {
        issue:
          async () => {
            throw new Error(
              "unknown raw failure",
            );
          },
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.ownerApprovalRequired,
    true,
  );

  assert.equal(
    snapshot.liveProviderExecution,
    "blocked",
  );

  assert.equal(
    snapshot.externalDelivery,
    "blocked",
  );

  assert.equal(
    snapshot.paymentExecution,
    "blocked",
  );

  assert.equal(
    snapshot.publicLaunch,
    "blocked",
  );
});

check("backward-moving clock fails closed", async () => {
  const harness =
    makeProbe({
      times: [
        "2026-07-12T00:00:01.000Z",
        "2026-07-12T00:00:00.000Z",
      ],
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "not-ready",
  );

  assert.equal(
    snapshot.report.completedAt,
    snapshot.report.startedAt,
  );
});

check("real recovery workflow integrates with readiness probe", async () => {
  let consoleState =
    consoleSnapshot(
      "authority-ready",
    );

  const fakeConsole = {
    getSnapshot() {
      return clone(
        consoleState,
      );
    },

    async issueSession() {
      consoleState =
        consoleSnapshot(
          "session-ready",
        );

      return clone(
        consoleState,
      );
    },

    async runSandboxCycle() {
      consoleState =
        consoleSnapshot(
          "completed",
          {
            replay: false,
          },
        );

      return clone(
        consoleState,
      );
    },

    async replayLastRun() {
      consoleState =
        consoleSnapshot(
          "completed",
          {
            replay: true,
          },
        );

      return clone(
        consoleState,
      );
    },

    async revokeSession() {
      consoleState =
        consoleSnapshot(
          "revoked",
        );

      return clone(
        consoleState,
      );
    },
  };

  const recoveryWorkflow =
    createControlledInternalPilotOwnerRecoveryWorkflow({
      tenantId: "tenant-a",
      ownerConsole:
        fakeConsole,
    });

  const harness =
    makeProbe({
      workflowHarness: {
        workflow:
          recoveryWorkflow,
        calls: [],
      },
    });

  const snapshot =
    await runProbe(harness);

  assert.equal(
    snapshot.report.status,
    "ready",
  );
});

(async () => {
  assert.equal(
    checks.length,
    32,
    `Expected 32 targeted checks, found ${checks.length}`,
  );

  let passed = 0;

  for (const item of checks) {
    try {
      await item.run();
      passed += 1;
    } catch (error) {
      console.error(
        `FAIL: ${item.name}`,
      );
      console.error(error);
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    `TARGETED TESTS: PASS (${passed}/${checks.length})`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
