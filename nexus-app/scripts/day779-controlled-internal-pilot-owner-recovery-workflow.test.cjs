const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day779-compiled",
);

const {
  createControlledInternalPilotOwnerRecoveryWorkflow,
  ControlledInternalPilotRecoveryError,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotOwnerRecoveryWorkflow.js",
  ),
);

const {
  createControlledInternalPilotOwnerConsole,
  ControlledInternalPilotOwnerConsoleError,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotOwnerConsole.js",
  ),
);

const {
  INTERNAL_PILOT_SESSION_ROUTE_PATH,
  INTERNAL_PILOT_WORKER_ROUTE_PATH,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotProductionApiRouter.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const authorityCsrfToken =
  "authority-csrf-token-779-abcdefghijklmnopqrstuvwxyz";

const issuedCsrfToken =
  "issued-csrf-token-779-abcdefghijklmnopqrstuvwxyz";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseConsoleSnapshot(overrides = {}) {
  return {
    tenantId: "tenant-a",
    phase: "authority-ready",
    statusMessage:
      "Trusted owner authority is ready.",
    busy: false,
    activeSessionId: null,
    lastRun: null,
    lastError: null,
    canIssueSession: true,
    canRunSandbox: false,
    canReplayLastRun: false,
    canRevokeSession: false,
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...overrides,
  };
}

function completedRun(
  overrides = {},
) {
  return {
    requestId:
      "request-779-success",
    idempotencyKey:
      "idem-779-success",
    requestedAt:
      "2026-07-11T23:00:00.000Z",
    requestDigest:
      "a".repeat(64),
    replay: false,
    result: {
      completedCount: 1,
    },
    ...overrides,
  };
}

function makeFakeConsole(options = {}) {
  let snapshot =
    baseConsoleSnapshot(
      options.initialSnapshot || {},
    );

  const calls = {
    issue: [],
    run: [],
    replay: 0,
    revoke: 0,
  };

  const ownerConsole = {
    getSnapshot() {
      return clone(snapshot);
    },

    async issueSession(input) {
      calls.issue.push(clone(input));

      if (options.issue) {
        const result =
          await options.issue(
            input,
            snapshot,
          );

        if (result) {
          snapshot = clone(result);
        }

        return clone(snapshot);
      }

      snapshot =
        baseConsoleSnapshot({
          phase: "session-ready",
          statusMessage:
            "Secure controlled pilot session is ready.",
          activeSessionId:
            "session-779-active",
          canIssueSession: false,
          canRunSandbox: true,
          canRevokeSession: true,
        });

      return clone(snapshot);
    },

    async runSandboxCycle(input) {
      calls.run.push(clone(input));

      if (options.run) {
        const result =
          await options.run(
            input,
            calls.run.length,
            snapshot,
          );

        if (result) {
          snapshot = clone(result);
        }

        return clone(snapshot);
      }

      snapshot =
        baseConsoleSnapshot({
          phase: "completed",
          statusMessage:
            "Sandbox worker cycle completed safely.",
          activeSessionId:
            "session-779-active",
          lastRun:
            completedRun(),
          canIssueSession: false,
          canRunSandbox: true,
          canReplayLastRun: true,
          canRevokeSession: true,
        });

      return clone(snapshot);
    },

    async replayLastRun() {
      calls.replay += 1;

      if (options.replay) {
        const result =
          await options.replay(
            snapshot,
          );

        if (result) {
          snapshot = clone(result);
        }

        return clone(snapshot);
      }

      snapshot = {
        ...snapshot,
        lastRun: {
          ...snapshot.lastRun,
          replay: true,
        },
      };

      return clone(snapshot);
    },

    async revokeSession() {
      calls.revoke += 1;

      if (options.revoke) {
        const result =
          await options.revoke(
            snapshot,
          );

        if (result) {
          snapshot = clone(result);
        }

        return clone(snapshot);
      }

      snapshot =
        baseConsoleSnapshot({
          phase: "revoked",
          statusMessage:
            "Controlled pilot session revoked.",
          canIssueSession: false,
        });

      return clone(snapshot);
    },
  };

  return {
    ownerConsole,
    calls,
    setSnapshot(value) {
      snapshot = clone(value);
    },
  };
}

function makeWorkflow(options = {}) {
  const fake =
    options.fake ||
    makeFakeConsole(
      options.consoleOptions || {},
    );

  const workflow =
    createControlledInternalPilotOwnerRecoveryWorkflow({
      tenantId: "tenant-a",
      ownerConsole:
        fake.ownerConsole,
      maxRecoveryAttempts:
        options.maxRecoveryAttempts || 2,
    });

  return {
    workflow,
    ...fake,
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
          ControlledInternalPilotRecoveryError,
      );

      assert.equal(
        error.code,
        expectedCode,
      );

      return true;
    },
  );
}

check("invalid recovery configuration is rejected", async () => {
  assert.throws(
    () =>
      createControlledInternalPilotOwnerRecoveryWorkflow({
        tenantId: "tenant-a",
        ownerConsole: {},
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

check("recovery workflow exposes no live execution control", async () => {
  const harness = makeWorkflow();

  assert.deepEqual(
    Object.keys(
      harness.workflow,
    ).sort(),
    [
      "getSnapshot",
      "issueSession",
      "replayLastRun",
      "retryFailedRun",
      "revokeSession",
      "runSandboxCycle",
    ].sort(),
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      harness.workflow,
      "runLive",
    ),
    false,
  );
});

check("initial recovery snapshot keeps all safety boundaries locked", async () => {
  const harness = makeWorkflow();

  const snapshot =
    harness.workflow.getSnapshot();

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

check("session issue delegates exact approved TTL", async () => {
  const harness = makeWorkflow();

  const snapshot =
    await harness.workflow.issueSession(
      3600,
    );

  assert.deepEqual(
    harness.calls.issue,
    [
      {
        ttlSeconds: 3600,
      },
    ],
  );

  assert.equal(
    snapshot.phase,
    "session-ready",
  );
});

check("invalid session TTL is blocked before console access", async () => {
  const harness = makeWorkflow();

  await expectCode(
    harness.workflow.issueSession(
      299,
    ),
    "INVALID_INPUT",
  );

  assert.equal(
    harness.calls.issue.length,
    0,
  );
});

check("cross-tenant issue state is blocked", async () => {
  const harness = makeWorkflow({
    consoleOptions: {
      issue: async () =>
        baseConsoleSnapshot({
          tenantId: "tenant-b",
          phase: "session-ready",
          activeSessionId:
            "session-779-active",
          canRunSandbox: true,
        }),
    },
  });

  await expectCode(
    harness.workflow.issueSession(
      3600,
    ),
    "CONSOLE_STATE_INVALID",
  );
});

check("successful sandbox run completes normally", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  const snapshot =
    await harness.workflow.runSandboxCycle({
      batchSize: 2,
    });

  assert.equal(
    snapshot.phase,
    "completed",
  );

  assert.equal(
    snapshot.console.lastRun.replay,
    false,
  );
});

check("sandbox run preserves requested batch size", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  await harness.workflow.runSandboxCycle({
    batchSize: 3,
  });

  assert.deepEqual(
    harness.calls.run,
    [
      {
        batchSize: 3,
      },
    ],
  );
});

check("additional sandbox input fields are blocked", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  await expectCode(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
      executionMode: "live",
    }),
    "INVALID_INPUT",
  );

  assert.equal(
    harness.calls.run.length,
    0,
  );
});

check("retryable worker failure is classified safely", async () => {
  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        throw new ControlledInternalPilotOwnerConsoleError(
          "CYCLE_EXECUTION_FAILED",
          "The sandbox worker cycle failed safely.",
        );
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await expectCode(
    harness.workflow.runSandboxCycle({
      batchSize: 2,
    }),
    "CYCLE_EXECUTION_FAILED",
  );

  const snapshot =
    harness.workflow.getSnapshot();

  assert.equal(
    snapshot.phase,
    "failed-retryable",
  );

  assert.equal(
    snapshot.lastFailure.retryable,
    true,
  );

  assert.equal(
    snapshot.pendingBatchSize,
    2,
  );
});

check("terminal owner approval failure cannot be retried", async () => {
  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        throw new ControlledInternalPilotOwnerConsoleError(
          "OWNER_APPROVAL_REQUIRED",
          "Explicit owner approval is required.",
        );
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await expectCode(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
    "OWNER_APPROVAL_REQUIRED",
  );

  assert.equal(
    harness.workflow.getSnapshot().phase,
    "failed-terminal",
  );

  await expectCode(
    harness.workflow.retryFailedRun(),
    "TERMINAL_FAILURE",
  );
});

check("generic raw failure is safely classified without leakage", async () => {
  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        throw new Error(
          "postgres password=raw-secret",
        );
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await expectCode(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
    "RECOVERY_OPERATION_FAILED",
  );

  assert.doesNotMatch(
    harness.workflow
      .getSnapshot()
      .lastFailure.message,
    /postgres|password|raw-secret/i,
  );
});

check("retry before a failed run is blocked", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  await expectCode(
    harness.workflow.retryFailedRun(),
    "RETRY_NOT_AVAILABLE",
  );
});

check("safe retry preserves original batch size", async () => {
  let attempt = 0;

  const harness = makeWorkflow({
    consoleOptions: {
      run: async (
        input,
      ) => {
        attempt += 1;

        if (attempt === 1) {
          throw new ControlledInternalPilotOwnerConsoleError(
            "CYCLE_EXECUTION_FAILED",
            "The sandbox worker cycle failed safely.",
          );
        }

        return baseConsoleSnapshot({
          phase: "completed",
          activeSessionId:
            "session-779-active",
          lastRun:
            completedRun(),
          canRunSandbox: true,
          canReplayLastRun: true,
          canRevokeSession: true,
        });
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 4,
    }),
  );

  await harness.workflow.retryFailedRun();

  assert.deepEqual(
    harness.calls.run,
    [
      {
        batchSize: 4,
      },
      {
        batchSize: 4,
      },
    ],
  );
});

check("successful recovery clears pending failure state", async () => {
  let attempt = 0;

  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        attempt += 1;

        if (attempt === 1) {
          throw new ControlledInternalPilotOwnerConsoleError(
            "AUDIT_UNAVAILABLE",
            "The command audit service is unavailable.",
          );
        }

        return baseConsoleSnapshot({
          phase: "completed",
          activeSessionId:
            "session-779-active",
          lastRun:
            completedRun(),
          canRunSandbox: true,
          canReplayLastRun: true,
          canRevokeSession: true,
        });
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
  );

  const recovered =
    await harness.workflow.retryFailedRun();

  assert.equal(
    recovered.phase,
    "completed",
  );

  assert.equal(
    recovered.pendingBatchSize,
    null,
  );

  assert.equal(
    recovered.lastFailure,
    null,
  );
});

check("repeated retryable failures respect recovery limit", async () => {
  const harness = makeWorkflow({
    maxRecoveryAttempts: 1,
    consoleOptions: {
      run: async () => {
        throw new ControlledInternalPilotOwnerConsoleError(
          "RECEIPT_UNAVAILABLE",
          "The command receipt service is unavailable.",
        );
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
  );

  await assert.rejects(
    harness.workflow.retryFailedRun(),
  );

  await expectCode(
    harness.workflow.retryFailedRun(),
    "RECOVERY_ATTEMPTS_EXHAUSTED",
  );
});

check("retryable failure remains visible after failed recovery", async () => {
  const harness = makeWorkflow({
    maxRecoveryAttempts: 2,
    consoleOptions: {
      run: async () => {
        throw new ControlledInternalPilotOwnerConsoleError(
          "FETCH_FAILED",
          "The controlled service could not be reached safely.",
        );
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 2,
    }),
  );

  await assert.rejects(
    harness.workflow.retryFailedRun(),
  );

  const snapshot =
    harness.workflow.getSnapshot();

  assert.equal(
    snapshot.phase,
    "failed-retryable",
  );

  assert.equal(
    snapshot.recoveryAttempt,
    1,
  );

  assert.equal(
    snapshot.canRetryFailedRun,
    true,
  );
});

check("actual owner console recovery creates new command identities", async () => {
  const requestIds = [
    "request-779-first",
    "request-779-recovery",
  ];

  const idempotencyKeys = [
    "idem-779-first",
    "idem-779-recovery",
  ];

  const workerCommands = [];
  let workerAttempt = 0;

  const ownerConsole =
    createControlledInternalPilotOwnerConsole({
      tenantId: "tenant-a",
      authorityCsrfToken,
      now: () =>
        new Date(
          "2026-07-11T23:00:00.000Z",
        ),
      createRequestId:
        () => requestIds.shift(),
      createIdempotencyKey:
        () => idempotencyKeys.shift(),
      fetch: async (
        input,
        init,
      ) => {
        const body =
          JSON.parse(init.body);

        if (
          input ===
          INTERNAL_PILOT_SESSION_ROUTE_PATH
        ) {
          return new Response(
            JSON.stringify({
              ok: true,
              operation: "issue",
              tenantId: "tenant-a",
              sessionId:
                "session-779-actual",
              actorId: "owner-779",
              csrfToken:
                issuedCsrfToken,
              issuedAt:
                "2026-07-11T23:00:00.000Z",
              expiresAt:
                "2026-07-12T00:00:00.000Z",
              ownerApprovalRequired:
                true,
              liveProviderExecution:
                "blocked",
              externalDelivery:
                "blocked",
              paymentExecution:
                "blocked",
              publicLaunch:
                "blocked",
            }),
            {
              status: 201,
              headers: {
                "content-type":
                  "application/json; charset=utf-8",
                "cache-control":
                  "no-store",
              },
            },
          );
        }

        workerAttempt += 1;
        workerCommands.push(
          clone(body),
        );

        if (workerAttempt === 1) {
          return new Response(
            JSON.stringify({
              ok: false,
              error: {
                code:
                  "CYCLE_EXECUTION_FAILED",
                message:
                  "The sandbox worker cycle failed safely.",
              },
            }),
            {
              status: 503,
              headers: {
                "content-type":
                  "application/json; charset=utf-8",
                "cache-control":
                  "no-store",
              },
            },
          );
        }

        return new Response(
          JSON.stringify({
            ok: true,
            tenantId: "tenant-a",
            requestId:
              body.requestId,
            requestDigest:
              "b".repeat(64),
            replay: false,
            result: {
              completedCount: 1,
            },
            ownerApprovalRequired:
              true,
            liveProviderExecution:
              "blocked",
            externalDelivery:
              "blocked",
            paymentExecution:
              "blocked",
            publicLaunch:
              "blocked",
          }),
          {
            status: 200,
            headers: {
              "content-type":
                "application/json; charset=utf-8",
              "cache-control":
                "no-store",
            },
          },
        );
      },
    });

  const workflow =
    createControlledInternalPilotOwnerRecoveryWorkflow({
      tenantId: "tenant-a",
      ownerConsole,
    });

  await workflow.issueSession(3600);

  await assert.rejects(
    workflow.runSandboxCycle({
      batchSize: 1,
    }),
  );

  await workflow.retryFailedRun();

  assert.notEqual(
    workerCommands[0].requestId,
    workerCommands[1].requestId,
  );

  assert.notEqual(
    workerCommands[0].idempotencyKey,
    workerCommands[1].idempotencyKey,
  );

  assert.equal(
    workerCommands[0].executionMode,
    "sandbox",
  );

  assert.equal(
    workerCommands[1].executionMode,
    "sandbox",
  );
});

check("successful result replay preserves completed command identity", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  await harness.workflow.runSandboxCycle({
    batchSize: 1,
  });

  const replay =
    await harness.workflow.replayLastRun();

  assert.equal(
    replay.console.lastRun.replay,
    true,
  );

  assert.equal(
    replay.console.lastRun.requestId,
    "request-779-success",
  );

  assert.equal(
    replay.console.lastRun.idempotencyKey,
    "idem-779-success",
  );
});

check("mismatched replay identity is blocked", async () => {
  const harness = makeWorkflow({
    consoleOptions: {
      replay: async (
        snapshot,
      ) => ({
        ...snapshot,
        lastRun: {
          ...snapshot.lastRun,
          requestId:
            "request-779-other",
          replay: true,
        },
      }),
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await harness.workflow.runSandboxCycle({
    batchSize: 1,
  });

  await expectCode(
    harness.workflow.replayLastRun(),
    "REPLAY_IDENTITY_MISMATCH",
  );
});

check("replay before a completed run is blocked", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  await expectCode(
    harness.workflow.replayLastRun(),
    "RETRY_NOT_AVAILABLE",
  );
});

check("concurrent recovery operations are blocked", async () => {
  let resolveRun;

  const deferred =
    new Promise((resolve) => {
      resolveRun = resolve;
    });

  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => deferred,
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  const first =
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    });

  await Promise.resolve();

  await expectCode(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
    "OPERATION_IN_PROGRESS",
  );

  resolveRun(
    baseConsoleSnapshot({
      phase: "completed",
      activeSessionId:
        "session-779-active",
      lastRun:
        completedRun(),
      canRunSandbox: true,
      canReplayLastRun: true,
      canRevokeSession: true,
    }),
  );

  await first;
});

check("session revocation delegates safely", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  const snapshot =
    await harness.workflow.revokeSession();

  assert.equal(
    harness.calls.revoke,
    1,
  );

  assert.equal(
    snapshot.phase,
    "revoked",
  );
});

check("revocation clears pending recovery state", async () => {
  let attempt = 0;

  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        attempt += 1;

        throw new ControlledInternalPilotOwnerConsoleError(
          "FETCH_FAILED",
          "The controlled service could not be reached safely.",
        );
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 2,
    }),
  );

  const snapshot =
    await harness.workflow.revokeSession();

  assert.equal(
    snapshot.pendingBatchSize,
    null,
  );

  assert.equal(
    snapshot.lastFailure,
    null,
  );
});

check("retry after session revocation is blocked", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  await harness.workflow.revokeSession();

  await expectCode(
    harness.workflow.retryFailedRun(),
    "CONSOLE_REVOKED",
  );
});

check("cross-tenant completed recovery state is blocked", async () => {
  let attempt = 0;

  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        attempt += 1;

        if (attempt === 1) {
          throw new ControlledInternalPilotOwnerConsoleError(
            "CYCLE_EXECUTION_FAILED",
            "The sandbox worker cycle failed safely.",
          );
        }

        return baseConsoleSnapshot({
          tenantId: "tenant-b",
          phase: "completed",
          activeSessionId:
            "session-779-active",
          lastRun:
            completedRun(),
          canRunSandbox: true,
          canReplayLastRun: true,
          canRevokeSession: true,
        });
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
  );

  await expectCode(
    harness.workflow.retryFailedRun(),
    "CONSOLE_STATE_INVALID",
  );
});

check("malformed console state is blocked", async () => {
  const harness = makeWorkflow({
    consoleOptions: {
      issue: async () => ({
        tenantId: "tenant-a",
        phase: "session-ready",
      }),
    },
  });

  await expectCode(
    harness.workflow.issueSession(
      3600,
    ),
    "CONSOLE_STATE_INVALID",
  );
});

check("secret-bearing console snapshot is blocked", async () => {
  const fake = makeFakeConsole({
    initialSnapshot: {
      sessionToken:
        "raw-session-token-secret",
    },
  });

  assert.throws(
    () =>
      createControlledInternalPilotOwnerRecoveryWorkflow({
        tenantId: "tenant-a",
        ownerConsole:
          fake.ownerConsole,
      }),
    (error) => {
      assert.equal(
        error.code,
        "CONSOLE_STATE_INVALID",
      );

      return true;
    },
  );
});

check("recovery snapshots are deeply immutable", async () => {
  const harness = makeWorkflow();

  await harness.workflow.issueSession(
    3600,
  );

  const snapshot =
    await harness.workflow.runSandboxCycle({
      batchSize: 1,
    });

  assert.equal(
    Object.isFrozen(snapshot),
    true,
  );

  assert.equal(
    Object.isFrozen(
      snapshot.console,
    ),
    true,
  );

  assert.equal(
    Object.isFrozen(
      snapshot.console.lastRun,
    ),
    true,
  );
});

check("owner-visible recovery status explains new command identity", async () => {
  let attempt = 0;

  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        attempt += 1;

        if (attempt === 1) {
          throw new ControlledInternalPilotOwnerConsoleError(
            "AUDIT_UNAVAILABLE",
            "The command audit service is unavailable.",
          );
        }

        return baseConsoleSnapshot({
          phase: "completed",
          activeSessionId:
            "session-779-active",
          lastRun:
            completedRun(),
          canRunSandbox: true,
          canReplayLastRun: true,
          canRevokeSession: true,
        });
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
  );

  const failed =
    harness.workflow.getSnapshot();

  assert.match(
    failed.statusMessage,
    /new command identity/i,
  );

  const recovered =
    await harness.workflow.retryFailedRun();

  assert.match(
    recovered.statusMessage,
    /recovered safely/i,
  );
});

check("all recovery states preserve sandbox safety boundaries", async () => {
  const harness = makeWorkflow({
    consoleOptions: {
      run: async () => {
        throw new ControlledInternalPilotOwnerConsoleError(
          "FETCH_FAILED",
          "The controlled service could not be reached safely.",
        );
      },
    },
  });

  await harness.workflow.issueSession(
    3600,
  );

  await assert.rejects(
    harness.workflow.runSandboxCycle({
      batchSize: 1,
    }),
  );

  const snapshot =
    harness.workflow.getSnapshot();

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
