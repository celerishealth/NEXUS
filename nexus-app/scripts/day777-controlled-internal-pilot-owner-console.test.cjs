const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day777-compiled",
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
  "authority-csrf-token-777-abcdefghijklmnopqrstuvwxyz";

const issuedCsrfToken =
  "issued-csrf-token-777-abcdefghijklmnopqrstuvwxyz";

const securityHeaders = {
  "content-type":
    "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function jsonResponse(
  status,
  body,
  headers = {},
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...securityHeaders,
        ...headers,
      },
    },
  );
}

function issueResponse(overrides = {}) {
  return {
    ok: true,
    operation: "issue",
    tenantId: "tenant-a",
    sessionId:
      "session-777-created",
    actorId: "owner-777",
    csrfToken: issuedCsrfToken,
    issuedAt:
      "2026-07-11T21:00:00.000Z",
    expiresAt:
      "2026-07-11T22:00:00.000Z",
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...overrides,
  };
}

function revokeResponse(overrides = {}) {
  return {
    ok: true,
    operation: "revoke",
    tenantId: "tenant-a",
    sessionId:
      "session-777-created",
    actorId: "owner-777",
    revoked: true,
    replay: false,
    revokedAt:
      "2026-07-11T21:00:00.000Z",
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...overrides,
  };
}

function workerResponse(
  command,
  replay = false,
  overrides = {},
) {
  return {
    ok: true,
    tenantId: "tenant-a",
    requestId:
      command.requestId,
    requestDigest:
      "a".repeat(64),
    replay,
    result: {
      completedCount: 1,
      retryScheduledCount: 0,
    },
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...overrides,
  };
}

function safeError(
  code = "OWNER_APPROVAL_REQUIRED",
  message =
    "Explicit owner approval is required.",
) {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

function cloneInit(init) {
  return {
    method: init.method,
    credentials: init.credentials,
    cache: init.cache,
    redirect: init.redirect,
    headers: {
      ...init.headers,
    },
    body: init.body,
  };
}

function makeHarness(options = {}) {
  const calls = [];
  let workerCallCount = 0;

  const fetchImpl = async (
    input,
    init,
  ) => {
    calls.push({
      input,
      init: cloneInit(init),
    });

    if (options.fetchHandler) {
      return options.fetchHandler(
        input,
        init,
        calls,
      );
    }

    if (
      input ===
      INTERNAL_PILOT_SESSION_ROUTE_PATH
    ) {
      const body =
        JSON.parse(init.body);

      if (body.operation === "issue") {
        return jsonResponse(
          201,
          issueResponse(),
        );
      }

      return jsonResponse(
        200,
        revokeResponse(),
      );
    }

    if (
      input ===
      INTERNAL_PILOT_WORKER_ROUTE_PATH
    ) {
      workerCallCount += 1;

      const command =
        JSON.parse(init.body);

      return jsonResponse(
        200,
        workerResponse(
          command,
          workerCallCount > 1,
        ),
      );
    }

    throw new Error(
      "unexpected route",
    );
  };

  const ownerConsole =
    createControlledInternalPilotOwnerConsole({
      tenantId: "tenant-a",
      authorityCsrfToken,
      fetch: fetchImpl,
      now: () =>
        new Date(
          "2026-07-11T21:00:00.000Z",
        ),
      createRequestId: () =>
        "request-777-0001",
      createIdempotencyKey: () =>
        "idem-777-0001",
      maxBatchSize: 5,
      maxResponseBodyBytes:
        options.maxResponseBodyBytes ||
        65_536,
    });

  return {
    ownerConsole,
    calls,
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
          ControlledInternalPilotOwnerConsoleError,
      );

      assert.equal(
        error.code,
        expectedCode,
      );

      return true;
    },
  );
}

async function issueSession(
  harness,
) {
  return harness.ownerConsole.issueSession({
    ttlSeconds: 3600,
  });
}

check("invalid owner console configuration is rejected", async () => {
  assert.throws(
    () =>
      createControlledInternalPilotOwnerConsole({
        tenantId: "tenant-a",
        authorityCsrfToken:
          "short",
        fetch: async () =>
          jsonResponse(
            200,
            {},
          ),
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

check("initial console exposes only safe owner operations", async () => {
  const harness = makeHarness();

  assert.deepEqual(
    Object.keys(
      harness.ownerConsole,
    ).sort(),
    [
      "getSnapshot",
      "issueSession",
      "replayLastRun",
      "revokeSession",
      "runSandboxCycle",
    ].sort(),
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      harness.ownerConsole,
      "runLive",
    ),
    false,
  );
});

check("initial snapshot hides authority CSRF credential", async () => {
  const harness = makeHarness();

  const snapshot =
    harness.ownerConsole.getSnapshot();

  assert.doesNotMatch(
    JSON.stringify(snapshot),
    new RegExp(
      authorityCsrfToken,
    ),
  );

  assert.equal(
    snapshot.phase,
    "authority-ready",
  );
});

check("initial snapshot locks all unsafe boundaries", async () => {
  const harness = makeHarness();

  const snapshot =
    harness.ownerConsole.getSnapshot();

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

check("session issue uses exact controlled API request", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  const call = harness.calls[0];

  assert.equal(
    call.input,
    INTERNAL_PILOT_SESSION_ROUTE_PATH,
  );

  assert.deepEqual(
    JSON.parse(call.init.body),
    {
      operation: "issue",
      tenantId: "tenant-a",
      ownerApprovalGranted: true,
      ttlSeconds: 3600,
    },
  );
});

check("session issue sends secure Fetch options", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  const init =
    harness.calls[0].init;

  assert.equal(
    init.method,
    "POST",
  );
  assert.equal(
    init.credentials,
    "include",
  );
  assert.equal(
    init.cache,
    "no-store",
  );
  assert.equal(
    init.redirect,
    "error",
  );
});

check("session issue uses trusted authority CSRF token", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  assert.equal(
    harness.calls[0].init.headers[
      "x-nexus-csrf-token"
    ],
    authorityCsrfToken,
  );
});

check("successful issue enables sandbox execution", async () => {
  const harness = makeHarness();

  const snapshot =
    await issueSession(harness);

  assert.equal(
    snapshot.phase,
    "session-ready",
  );
  assert.equal(
    snapshot.activeSessionId,
    "session-777-created",
  );
  assert.equal(
    snapshot.canRunSandbox,
    true,
  );
  assert.equal(
    snapshot.canRevokeSession,
    true,
  );
});

check("issued CSRF credential remains hidden from snapshot", async () => {
  const harness = makeHarness();

  const snapshot =
    await issueSession(harness);

  assert.doesNotMatch(
    JSON.stringify(snapshot),
    new RegExp(
      issuedCsrfToken,
    ),
  );
});

check("second active session issue is blocked", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await expectCode(
    harness.ownerConsole.issueSession({
      ttlSeconds: 3600,
    }),
    "SESSION_ALREADY_ACTIVE",
  );

  assert.equal(
    harness.calls.length,
    1,
  );
});

check("additional issue input fields are blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.ownerConsole.issueSession({
      ttlSeconds: 3600,
      publicLaunch: "allowed",
    }),
    "INVALID_INPUT",
  );

  assert.equal(
    harness.calls.length,
    0,
  );
});

check("cross-tenant issue response is blocked", async () => {
  const harness = makeHarness({
    fetchHandler:
      async () =>
        jsonResponse(
          201,
          issueResponse({
            tenantId: "tenant-b",
          }),
        ),
  });

  await expectCode(
    issueSession(harness),
    "RESPONSE_INVALID",
  );
});

check("unsafe session token response field is blocked", async () => {
  const harness = makeHarness({
    fetchHandler:
      async () =>
        jsonResponse(
          201,
          {
            ...issueResponse(),
            sessionToken:
              "raw-session-secret",
          },
        ),
  });

  await expectCode(
    issueSession(harness),
    "RESPONSE_INVALID",
  );
});

check("safe service error is preserved for owner clarity", async () => {
  const harness = makeHarness({
    fetchHandler:
      async () =>
        jsonResponse(
          403,
          safeError(
            "OWNER_APPROVAL_REQUIRED",
            "Explicit owner approval is required.",
          ),
        ),
  });

  await expectCode(
    issueSession(harness),
    "OWNER_APPROVAL_REQUIRED",
  );

  const snapshot =
    harness.ownerConsole.getSnapshot();

  assert.equal(
    snapshot.lastError.code,
    "OWNER_APPROVAL_REQUIRED",
  );
});

check("raw Fetch failure is safely classified", async () => {
  const harness = makeHarness({
    fetchHandler:
      async () => {
        throw new Error(
          "network password=raw-secret",
        );
      },
  });

  await expectCode(
    issueSession(harness),
    "FETCH_FAILED",
  );

  assert.doesNotMatch(
    harness.ownerConsole
      .getSnapshot()
      .lastError.message,
    /password|raw-secret|network/i,
  );
});

check("oversized service response is blocked", async () => {
  const harness = makeHarness({
    maxResponseBodyBytes: 1024,
    fetchHandler:
      async () =>
        jsonResponse(
          201,
          {
            ...issueResponse(),
            output:
              "x".repeat(3000),
          },
        ),
  });

  await expectCode(
    issueSession(harness),
    "RESPONSE_TOO_LARGE",
  );
});

check("concurrent session issue is blocked", async () => {
  let resolveFetch;

  const deferred =
    new Promise((resolve) => {
      resolveFetch = resolve;
    });

  const harness = makeHarness({
    fetchHandler:
      async () => deferred,
  });

  const first =
    issueSession(harness);

  await Promise.resolve();

  await expectCode(
    harness.ownerConsole.issueSession({
      ttlSeconds: 3600,
    }),
    "OPERATION_IN_PROGRESS",
  );

  resolveFetch(
    jsonResponse(
      201,
      issueResponse(),
    ),
  );

  await first;
});

check("sandbox run before session issue is blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.ownerConsole.runSandboxCycle({
      batchSize: 1,
    }),
    "SESSION_REQUIRED",
  );

  assert.equal(
    harness.calls.length,
    0,
  );
});

check("sandbox run sends exact sandbox-only command", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await harness.ownerConsole.runSandboxCycle({
    batchSize: 2,
  });

  const call = harness.calls[1];
  const body =
    JSON.parse(call.init.body);

  assert.deepEqual(
    body,
    {
      tenantId: "tenant-a",
      requestId:
        "request-777-0001",
      idempotencyKey:
        "idem-777-0001",
      batchSize: 2,
      requestedAt:
        "2026-07-11T21:00:00.000Z",
      executionMode: "sandbox",
    },
  );
});

check("sandbox run uses issued CSRF and idempotency headers", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await harness.ownerConsole.runSandboxCycle({
    batchSize: 1,
  });

  const headers =
    harness.calls[1].init.headers;

  assert.equal(
    headers[
      "x-nexus-csrf-token"
    ],
    issuedCsrfToken,
  );

  assert.equal(
    headers[
      "x-nexus-idempotency-key"
    ],
    "idem-777-0001",
  );
});

check("sandbox result is visible without unsafe controls", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  const snapshot =
    await harness.ownerConsole.runSandboxCycle({
      batchSize: 1,
    });

  assert.equal(
    snapshot.phase,
    "completed",
  );

  assert.equal(
    snapshot.lastRun.requestId,
    "request-777-0001",
  );

  assert.equal(
    snapshot.lastRun.replay,
    false,
  );

  assert.equal(
    snapshot.lastRun.result.completedCount,
    1,
  );
});

check("cross-tenant worker result is blocked", async () => {
  const harness = makeHarness({
    fetchHandler:
      async (
        input,
        init,
      ) => {
        if (
          input ===
          INTERNAL_PILOT_SESSION_ROUTE_PATH
        ) {
          return jsonResponse(
            201,
            issueResponse(),
          );
        }

        const command =
          JSON.parse(init.body);

        return jsonResponse(
          200,
          workerResponse(
            command,
            false,
            {
              tenantId:
                "tenant-b",
            },
          ),
        );
      },
  });

  await issueSession(harness);

  await expectCode(
    harness.ownerConsole.runSandboxCycle({
      batchSize: 1,
    }),
    "RESPONSE_INVALID",
  );
});

check("mismatched worker request identity is blocked", async () => {
  const harness = makeHarness({
    fetchHandler:
      async (
        input,
        init,
      ) => {
        if (
          input ===
          INTERNAL_PILOT_SESSION_ROUTE_PATH
        ) {
          return jsonResponse(
            201,
            issueResponse(),
          );
        }

        const command =
          JSON.parse(init.body);

        return jsonResponse(
          200,
          workerResponse(
            command,
            false,
            {
              requestId:
                "request-other",
            },
          ),
        );
      },
  });

  await issueSession(harness);

  await expectCode(
    harness.ownerConsole.runSandboxCycle({
      batchSize: 1,
    }),
    "RESPONSE_INVALID",
  );
});

check("raw worker infrastructure fields are blocked", async () => {
  const harness = makeHarness({
    fetchHandler:
      async (
        input,
        init,
      ) => {
        if (
          input ===
          INTERNAL_PILOT_SESSION_ROUTE_PATH
        ) {
          return jsonResponse(
            201,
            issueResponse(),
          );
        }

        const command =
          JSON.parse(init.body);

        return jsonResponse(
          200,
          workerResponse(
            command,
            false,
            {
              result: {
                rawError:
                  "postgres password=secret",
              },
            },
          ),
        );
      },
  });

  await issueSession(harness);

  await expectCode(
    harness.ownerConsole.runSandboxCycle({
      batchSize: 1,
    }),
    "RESPONSE_INVALID",
  );
});

check("sandbox replay reuses exact command and idempotency key", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await harness.ownerConsole.runSandboxCycle({
    batchSize: 1,
  });

  await harness.ownerConsole.replayLastRun();

  assert.equal(
    harness.calls[1].init.body,
    harness.calls[2].init.body,
  );

  assert.equal(
    harness.calls[1].init.headers[
      "x-nexus-idempotency-key"
    ],
    harness.calls[2].init.headers[
      "x-nexus-idempotency-key"
    ],
  );
});

check("sandbox replay is clearly shown to owner", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await harness.ownerConsole.runSandboxCycle({
    batchSize: 1,
  });

  const snapshot =
    await harness.ownerConsole.replayLastRun();

  assert.equal(
    snapshot.lastRun.replay,
    true,
  );

  assert.match(
    snapshot.statusMessage,
    /replay verified/i,
  );
});

check("replay before completed run is blocked", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await expectCode(
    harness.ownerConsole.replayLastRun(),
    "REPLAY_NOT_AVAILABLE",
  );
});

check("invalid batch size is blocked before request", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await expectCode(
    harness.ownerConsole.runSandboxCycle({
      batchSize: 6,
    }),
    "INVALID_INPUT",
  );

  assert.equal(
    harness.calls.length,
    1,
  );
});

check("invalid generated request identifier is blocked", async () => {
  const calls = [];

  const ownerConsole =
    createControlledInternalPilotOwnerConsole({
      tenantId: "tenant-a",
      authorityCsrfToken,
      fetch: async (
        input,
        init,
      ) => {
        calls.push({ input, init });

        return jsonResponse(
          201,
          issueResponse(),
        );
      },
      createRequestId:
        () => "bad id",
      createIdempotencyKey:
        () => "idem-777-valid",
      now: () =>
        new Date(
          "2026-07-11T21:00:00.000Z",
        ),
    });

  await ownerConsole.issueSession({
    ttlSeconds: 3600,
  });

  await expectCode(
    ownerConsole.runSandboxCycle({
      batchSize: 1,
    }),
    "IDENTIFIER_GENERATION_FAILED",
  );

  assert.equal(calls.length, 1);
});

check("session revoke uses exact active session identity", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await harness.ownerConsole.revokeSession();

  const call = harness.calls[1];

  assert.deepEqual(
    JSON.parse(call.init.body),
    {
      operation: "revoke",
      tenantId: "tenant-a",
      sessionId:
        "session-777-created",
    },
  );

  assert.equal(
    call.init.headers[
      "x-nexus-csrf-token"
    ],
    issuedCsrfToken,
  );
});

check("successful revocation clears all active pilot state", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  await harness.ownerConsole.runSandboxCycle({
    batchSize: 1,
  });

  const snapshot =
    await harness.ownerConsole.revokeSession();

  assert.equal(
    snapshot.phase,
    "revoked",
  );

  assert.equal(
    snapshot.activeSessionId,
    null,
  );

  assert.equal(
    snapshot.lastRun,
    null,
  );

  assert.equal(
    snapshot.canRunSandbox,
    false,
  );
});

check("sandbox execution after revocation is blocked", async () => {
  const harness = makeHarness();

  await issueSession(harness);
  await harness.ownerConsole.revokeSession();

  await expectCode(
    harness.ownerConsole.runSandboxCycle({
      batchSize: 1,
    }),
    "CONSOLE_REVOKED",
  );
});

check("new session issue after revocation is blocked", async () => {
  const harness = makeHarness();

  await issueSession(harness);
  await harness.ownerConsole.revokeSession();

  await expectCode(
    harness.ownerConsole.issueSession({
      ttlSeconds: 3600,
    }),
    "CONSOLE_REVOKED",
  );
});

check("tampered revoke response is blocked", async () => {
  const harness = makeHarness({
    fetchHandler:
      async (
        input,
        init,
      ) => {
        const body =
          JSON.parse(init.body);

        if (body.operation === "issue") {
          return jsonResponse(
            201,
            issueResponse(),
          );
        }

        return jsonResponse(
          200,
          revokeResponse({
            sessionId:
              "session-other",
          }),
        );
      },
  });

  await issueSession(harness);

  await expectCode(
    harness.ownerConsole.revokeSession(),
    "RESPONSE_INVALID",
  );
});

check("returned snapshots and results are immutable", async () => {
  const harness = makeHarness();

  await issueSession(harness);

  const snapshot =
    await harness.ownerConsole.runSandboxCycle({
      batchSize: 1,
    });

  assert.equal(
    Object.isFrozen(snapshot),
    true,
  );

  assert.equal(
    Object.isFrozen(
      snapshot.lastRun,
    ),
    true,
  );

  assert.equal(
    Object.isFrozen(
      snapshot.lastRun.result,
    ),
    true,
  );
});

(async () => {
  assert.equal(
    checks.length,
    34,
    `Expected 34 targeted checks, found ${checks.length}`,
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
