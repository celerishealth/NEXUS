const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day775-compiled",
);

const {
  createControlledInternalPilotProductionApiRouter,
  ControlledInternalPilotApiRouterError,
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

const securityHeaders = {
  "content-type":
    "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy":
    "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
};

const csrfToken =
  "csrf-token-775-abcdefghijklmnopqrstuvwxyz";

function sessionIssueResponse(
  overrides = {},
) {
  return {
    status: 201,
    headers: {
      ...securityHeaders,
      "set-cookie":
        "nexus_internal_pilot_session=" +
        "issued-session-token-775-abcdefghijklmnopqrstuvwxyz; " +
        "Path=/; HttpOnly; Secure; " +
        "SameSite=Strict; Max-Age=3600",
    },
    body: {
      ok: true,
      operation: "issue",
      tenantId: "tenant-a",
      sessionId:
        "session-775-created",
      actorId: "owner-775",
      csrfToken,
      issuedAt:
        "2026-07-11T19:00:00.000Z",
      expiresAt:
        "2026-07-11T20:00:00.000Z",
      ownerApprovalRequired: true,
      liveProviderExecution: "blocked",
      externalDelivery: "blocked",
      paymentExecution: "blocked",
      publicLaunch: "blocked",
    },
    ...overrides,
  };
}

function sessionRevokeResponse(
  overrides = {},
) {
  return {
    status: 200,
    headers: {
      ...securityHeaders,
      "set-cookie":
        "nexus_internal_pilot_session=; " +
        "Path=/; HttpOnly; Secure; " +
        "SameSite=Strict; Max-Age=0",
    },
    body: {
      ok: true,
      operation: "revoke",
      tenantId: "tenant-a",
      sessionId:
        "session-775-target",
      actorId: "owner-775",
      revoked: true,
      replay: false,
      revokedAt:
        "2026-07-11T19:00:00.000Z",
      ownerApprovalRequired: true,
      liveProviderExecution: "blocked",
      externalDelivery: "blocked",
      paymentExecution: "blocked",
      publicLaunch: "blocked",
    },
    ...overrides,
  };
}

function workerResponse(overrides = {}) {
  return {
    status: 200,
    headers: {
      ...securityHeaders,
    },
    body: {
      ok: true,
      tenantId: "tenant-a",
      requestId:
        "request-775-0001",
      requestDigest:
        "a".repeat(64),
      replay: false,
      result: {
        completedCount: 1,
      },
      ownerApprovalRequired: true,
      liveProviderExecution: "blocked",
      externalDelivery: "blocked",
      paymentExecution: "blocked",
      publicLaunch: "blocked",
    },
    ...overrides,
  };
}

function errorResponse(overrides = {}) {
  return {
    status: 403,
    headers: {
      ...securityHeaders,
    },
    body: {
      ok: false,
      error: {
        code:
          "OWNER_APPROVAL_REQUIRED",
        message:
          "Explicit owner approval is required.",
      },
    },
    ...overrides,
  };
}

function apiRequest(
  pathName,
  overrides = {},
) {
  return {
    path: pathName,
    method: "POST",
    headers: {
      origin:
        "https://pilot.nexus.test",
      "content-type":
        "application/json",
      "x-nexus-internal-pilot":
        "sandbox-v1",
    },
    bodyText: "{}",
    ...overrides,
  };
}

function makeHarness(options = {}) {
  const sessionCalls = [];
  const workerCalls = [];

  const sessionLifecycleRoute =
    async (request) => {
      sessionCalls.push(
        JSON.parse(JSON.stringify(request)),
      );

      if (options.sessionThrow) {
        throw new Error(
          "session route secret failure",
        );
      }

      return options.sessionResponse ??
        sessionIssueResponse();
    };

  const sandboxWorkerRoute =
    async (request) => {
      workerCalls.push(
        JSON.parse(JSON.stringify(request)),
      );

      if (options.workerThrow) {
        throw new Error(
          "worker route secret failure",
        );
      }

      return options.workerResponse ??
        workerResponse();
    };

  const router =
    createControlledInternalPilotProductionApiRouter({
      sessionLifecycleRoute,
      sandboxWorkerRoute,
      maxResponseBodyBytes:
        options.maxResponseBodyBytes ??
        65_536,
    });

  return {
    router,
    sessionCalls,
    workerCalls,
  };
}

check("invalid router configuration is rejected", async () => {
  assert.throws(
    () =>
      createControlledInternalPilotProductionApiRouter({
        sessionLifecycleRoute:
          async () => ({}),
      }),
    (error) => {
      assert.ok(
        error instanceof
          ControlledInternalPilotApiRouterError,
      );

      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("exact session lifecycle path dispatches session route", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 201);
  assert.equal(
    harness.sessionCalls.length,
    1,
  );
  assert.equal(
    harness.workerCalls.length,
    0,
  );
});

check("exact worker path dispatches worker route", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 200);
  assert.equal(
    harness.workerCalls.length,
    1,
  );
  assert.equal(
    harness.sessionCalls.length,
    0,
  );
});

check("router forwards method headers and body without path", async () => {
  const harness = makeHarness();

  const request =
    apiRequest(
      INTERNAL_PILOT_SESSION_ROUTE_PATH,
      {
        bodyText:
          '{"operation":"issue"}',
      },
    );

  await harness.router(request);

  assert.deepEqual(
    harness.sessionCalls[0],
    {
      method: request.method,
      headers: request.headers,
      bodyText: request.bodyText,
    },
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      harness.sessionCalls[0],
      "path",
    ),
    false,
  );
});

check("unknown route is blocked without downstream execution", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        "/api/nexus/internal-pilot/unknown",
      ),
    );

  assert.equal(response.status, 404);
  assert.equal(
    response.body.error.code,
    "ROUTE_NOT_FOUND",
  );
  assert.equal(
    harness.sessionCalls.length,
    0,
  );
  assert.equal(
    harness.workerCalls.length,
    0,
  );
});

check("trailing slash route is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH +
          "/",
      ),
    );

  assert.equal(response.status, 404);
});

check("query-string route confusion is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH +
          "?operation=issue",
      ),
    );

  assert.equal(response.status, 404);
});

check("encoded path confusion is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        "/api/nexus/internal-pilot/%73ession-lifecycle",
      ),
    );

  assert.equal(response.status, 404);
});

check("non-POST method is blocked before route dispatch", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
        {
          method: "GET",
        },
      ),
    );

  assert.equal(response.status, 405);
  assert.equal(
    response.body.error.code,
    "METHOD_NOT_ALLOWED",
  );
  assert.equal(
    harness.sessionCalls.length,
    0,
  );
});

check("malformed API request is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.router({
      path:
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      method: "POST",
      headers: null,
      bodyText: "{}",
    });

  assert.equal(response.status, 400);
  assert.equal(
    response.body.error.code,
    "INVALID_REQUEST",
  );
});

check("session route exception is safely classified", async () => {
  const harness = makeHarness({
    sessionThrow: true,
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 500);
  assert.equal(
    response.body.error.code,
    "ROUTE_EXECUTION_FAILED",
  );

  assert.doesNotMatch(
    response.body.error.message,
    /secret|failure/i,
  );
});

check("worker route exception is safely classified", async () => {
  const harness = makeHarness({
    workerThrow: true,
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 500);
  assert.equal(
    response.body.error.code,
    "ROUTE_EXECUTION_FAILED",
  );
});

check("malformed route response object is blocked", async () => {
  const harness = makeHarness({
    sessionResponse: null,
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "ROUTE_RESPONSE_INVALID",
  );
});

check("invalid route response status is blocked", async () => {
  const harness = makeHarness({
    workerResponse:
      workerResponse({
        status: 700,
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("missing response security header is blocked", async () => {
  const badHeaders = {
    ...securityHeaders,
  };

  delete badHeaders[
    "cache-control"
  ];

  const harness = makeHarness({
    workerResponse:
      workerResponse({
        headers: badHeaders,
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("unexpected response header is blocked", async () => {
  const harness = makeHarness({
    workerResponse:
      workerResponse({
        headers: {
          ...securityHeaders,
          "x-debug-secret": "enabled",
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("duplicate case-insensitive response headers are blocked", async () => {
  const harness = makeHarness({
    workerResponse:
      workerResponse({
        headers: {
          ...securityHeaders,
          "Cache-Control": "no-store",
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("non-record response body is blocked", async () => {
  const harness = makeHarness({
    workerResponse:
      workerResponse({
        body: [],
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("successful response missing safety boundaries is blocked", async () => {
  const body = {
    ...workerResponse().body,
  };

  delete body.publicLaunch;

  const harness = makeHarness({
    workerResponse:
      workerResponse({ body }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("unsafe error response contract is blocked", async () => {
  const harness = makeHarness({
    workerResponse:
      errorResponse({
        body: {
          ok: false,
          error: {
            code: "bad-code",
            message: "Unsafe",
          },
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("multiline error message is blocked", async () => {
  const harness = makeHarness({
    workerResponse:
      errorResponse({
        body: {
          ok: false,
          error: {
            code:
              "AUTHENTICATION_REQUIRED",
            message:
              "Authentication failed\nstack trace",
          },
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("oversized response body is blocked", async () => {
  const harness = makeHarness({
    maxResponseBodyBytes: 1024,
    workerResponse:
      workerResponse({
        body: {
          ...workerResponse().body,
          output: "x".repeat(3000),
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("worker response cannot set a session cookie", async () => {
  const harness = makeHarness({
    workerResponse:
      workerResponse({
        headers: {
          ...securityHeaders,
          "set-cookie":
            "nexus_internal_pilot_session=unsafe",
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("secure session issue cookie is accepted", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 201);
  assert.match(
    response.headers["set-cookie"],
    /HttpOnly/,
  );
  assert.match(
    response.headers["set-cookie"],
    /Secure/,
  );
});

check("session issue cookie without HttpOnly is blocked", async () => {
  const bad =
    sessionIssueResponse();

  bad.headers["set-cookie"] =
    bad.headers["set-cookie"].replace(
      "HttpOnly; ",
      "",
    );

  const harness = makeHarness({
    sessionResponse: bad,
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("session revocation secure cookie clearing is accepted", async () => {
  const harness = makeHarness({
    sessionResponse:
      sessionRevokeResponse(),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 200);
  assert.equal(
    response.body.revoked,
    true,
  );
  assert.match(
    response.headers["set-cookie"],
    /Max-Age=0/,
  );
});

check("raw session token body field is blocked", async () => {
  const harness = makeHarness({
    sessionResponse:
      sessionIssueResponse({
        body: {
          ...sessionIssueResponse().body,
          sessionToken:
            "raw-session-token-secret",
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("nested raw infrastructure error field is blocked", async () => {
  const harness = makeHarness({
    workerResponse:
      workerResponse({
        body: {
          ...workerResponse().body,
          metadata: {
            rawError:
              "postgres password=secret",
          },
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("stack field is blocked from successful response", async () => {
  const harness = makeHarness({
    workerResponse:
      workerResponse({
        body: {
          ...workerResponse().body,
          stack:
            "internal implementation stack",
        },
      }),
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("safe downstream error response is preserved", async () => {
  const safe =
    errorResponse();

  const harness = makeHarness({
    workerResponse: safe,
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.deepEqual(response, safe);
});

check("valid worker response is preserved without mutation", async () => {
  const safe =
    workerResponse();

  const harness = makeHarness({
    workerResponse: safe,
  });

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.deepEqual(response, safe);
});

check("session route safety boundaries remain locked", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(
    response.body.ownerApprovalRequired,
    true,
  );
  assert.equal(
    response.body.liveProviderExecution,
    "blocked",
  );
  assert.equal(
    response.body.externalDelivery,
    "blocked",
  );
  assert.equal(
    response.body.paymentExecution,
    "blocked",
  );
  assert.equal(
    response.body.publicLaunch,
    "blocked",
  );
});

check("worker route safety boundaries remain locked", async () => {
  const harness = makeHarness();

  const response =
    await harness.router(
      apiRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(
    response.body.ownerApprovalRequired,
    true,
  );
  assert.equal(
    response.body.liveProviderExecution,
    "blocked",
  );
  assert.equal(
    response.body.externalDelivery,
    "blocked",
  );
  assert.equal(
    response.body.paymentExecution,
    "blocked",
  );
  assert.equal(
    response.body.publicLaunch,
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
      console.log(`PASS: ${item.name}`);
    } catch (error) {
      console.error(`FAIL: ${item.name}`);
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
