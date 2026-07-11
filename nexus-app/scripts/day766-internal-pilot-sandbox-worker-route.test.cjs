const assert = require("node:assert/strict");
const path = require("node:path");

const compiledPath = path.join(
  process.cwd(),
  ".day766-compiled",
  "internalPilotSandboxWorkerRoute.js",
);

const {
  createInternalPilotCsrfDigest,
  createInternalPilotSandboxWorkerRoute,
} = require(compiledPath);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T10:00:00.000Z",
);

const csrfToken =
  "csrf-token-766-abcdefghijklmnopqrstuvwxyz";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseSession(overrides = {}) {
  return {
    sessionId: "session-766-0001",
    actorId: "owner-766",
    tenantId: "tenant-a",
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
    csrfTokenDigest:
      createInternalPilotCsrfDigest(csrfToken),
    expiresAt: "2026-07-11T11:00:00.000Z",
    ...overrides,
  };
}

function baseRequest(overrides = {}) {
  return {
    method: "POST",
    headers: {
      origin: "https://pilot.nexus.test",
      "content-type": "application/json",
      "x-nexus-internal-pilot": "sandbox-v1",
      "x-nexus-idempotency-key":
        "idem-766-0001",
      "x-nexus-csrf-token": csrfToken,
    },
    bodyText: JSON.stringify({
      tenantId: "tenant-a",
      requestId: "request-766-0001",
      idempotencyKey: "idem-766-0001",
      batchSize: 2,
      requestedAt:
        "2026-07-11T10:00:00.000Z",
      executionMode: "sandbox",
    }),
    ...overrides,
  };
}

function baseEndpointResponse(overrides = {}) {
  return {
    status: 200,
    headers: {
      "content-type":
        "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
    body: {
      ok: true,
      tenantId: "tenant-a",
      requestId: "request-766-0001",
      requestDigest: "a".repeat(64),
      cycle: {
        tenantId: "tenant-a",
        recoveredLeaseCount: 0,
        claimedCount: 1,
        completedCount: 1,
        retryScheduledCount: 0,
        terminalFailedCount: 0,
        outcomes: [],
        ownerApprovalRequired: true,
        liveProviderExecution: "blocked",
        externalDelivery: "blocked",
        paymentExecution: "blocked",
        publicLaunch: "blocked",
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

function baseEndpointErrorResponse(
  overrides = {},
) {
  return {
    status: 409,
    headers: {
      "content-type":
        "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
    body: {
      ok: false,
      error: {
        code: "REQUEST_IN_PROGRESS",
        message:
          "The sandbox command request is already in progress.",
      },
    },
    ...overrides,
  };
}

function makeHarness(options = {}) {
  const sessionCalls = [];
  const endpointCalls = [];

  const resolveSession =
    options.resolveSession ||
    (async (request) => {
      sessionCalls.push(clone(request));
      return baseSession();
    });

  const endpoint =
    options.endpoint ||
    (async (session, request) => {
      endpointCalls.push({
        session: clone(session),
        request: clone(request),
      });

      return baseEndpointResponse();
    });

  const route =
    createInternalPilotSandboxWorkerRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
        "http://localhost:3000",
      ],
      resolveSession,
      endpoint,
      now: options.now || (() => new Date(fixedNow)),
    });

  return {
    route,
    sessionCalls,
    endpointCalls,
  };
}

check("valid route request executes protected endpoint", async () => {
  const harness = makeHarness();

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(harness.endpointCalls.length, 1);
});

check("route uses only trusted server session identity", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.deepEqual(
    harness.endpointCalls[0].session,
    {
      sessionId: "session-766-0001",
      actorId: "owner-766",
      tenantId: "tenant-a",
      authenticated: true,
      role: "owner",
      ownerApprovalGranted: true,
    },
  );
});

check("route preserves request body and idempotency headers", async () => {
  const harness = makeHarness();
  const request = baseRequest();

  await harness.route(request);

  assert.equal(
    harness.endpointCalls[0].request.bodyText,
    request.bodyText,
  );

  assert.equal(
    harness.endpointCalls[0].request.headers[
      "x-nexus-idempotency-key"
    ],
    "idem-766-0001",
  );
});

check("route adds strict response security headers", async () => {
  const harness = makeHarness();

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(
    result.headers["cache-control"],
    "no-store",
  );

  assert.equal(
    result.headers["content-security-policy"],
    "default-src 'none'; frame-ancestors 'none'",
  );

  assert.equal(
    result.headers["referrer-policy"],
    "no-referrer",
  );
});

check("lowercase post method is accepted", async () => {
  const harness = makeHarness();

  const result = await harness.route(
    baseRequest({ method: "post" }),
  );

  assert.equal(result.status, 200);
});

check("non-POST request is blocked before authentication", async () => {
  const harness = makeHarness();

  const result = await harness.route(
    baseRequest({ method: "GET" }),
  );

  assert.equal(result.status, 405);
  assert.equal(
    result.body.error.code,
    "METHOD_NOT_ALLOWED",
  );
  assert.equal(harness.sessionCalls.length, 0);
});

check("missing origin is blocked before authentication", async () => {
  const request = baseRequest();
  delete request.headers.origin;

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "ORIGIN_REQUIRED",
  );
  assert.equal(harness.sessionCalls.length, 0);
});

check("untrusted origin is blocked before authentication", async () => {
  const request = baseRequest();
  request.headers.origin =
    "https://attacker.example";

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "ORIGIN_NOT_ALLOWED",
  );
  assert.equal(harness.sessionCalls.length, 0);
});

check("configured localhost origin is accepted", async () => {
  const request = baseRequest();
  request.headers.origin =
    "http://localhost:3000";

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 200);
});

check("client actor identity header is forbidden", async () => {
  const request = baseRequest();
  request.headers["x-nexus-actor-id"] =
    "attacker-owner";

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 400);
  assert.equal(
    result.body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );
  assert.equal(harness.sessionCalls.length, 0);
});

check("client tenant identity header is forbidden", async () => {
  const request = baseRequest();
  request.headers["x-nexus-tenant-id"] =
    "tenant-b";

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 400);
  assert.equal(
    result.body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );
  assert.equal(harness.sessionCalls.length, 0);
});

check("missing trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () => null,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
  assert.equal(harness.endpointCalls.length, 0);
});

check("authentication infrastructure failure is hidden", async () => {
  const harness = makeHarness({
    resolveSession: async () => {
      throw new Error(
        "identity database password=raw-secret",
      );
    },
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "AUTHENTICATION_UNAVAILABLE",
  );
  assert.doesNotMatch(
    result.body.error.message,
    /database|password|raw-secret/i,
  );
});

check("unauthenticated trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({ authenticated: false }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
  assert.equal(harness.endpointCalls.length, 0);
});

check("non-owner trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({ role: "operator" }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );
});

check("unapproved trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({
        ownerApprovalGranted: false,
      }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );
});

check("cross-tenant trusted session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({ tenantId: "tenant-b" }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "TENANT_MISMATCH",
  );
});

check("additional trusted session fields are blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () => ({
      ...baseSession(),
      liveProviderExecution: "allowed",
    }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "SESSION_INVALID",
  );
});

check("invalid trusted session identifier is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({ sessionId: "bad id" }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "SESSION_INVALID",
  );
});

check("invalid trusted CSRF digest is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({
        csrfTokenDigest: "invalid",
      }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "SESSION_INVALID",
  );
});

check("malformed session expiry is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({
        expiresAt: "not-a-date",
      }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "SESSION_INVALID",
  );
});

check("expired session is blocked", async () => {
  const harness = makeHarness({
    resolveSession: async () =>
      baseSession({
        expiresAt:
          "2026-07-11T10:00:00.000Z",
      }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "SESSION_EXPIRED",
  );
});

check("missing CSRF token is blocked", async () => {
  const request = baseRequest();
  delete request.headers[
    "x-nexus-csrf-token"
  ];

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "CSRF_TOKEN_REQUIRED",
  );
  assert.equal(harness.endpointCalls.length, 0);
});

check("malformed CSRF token is blocked", async () => {
  const request = baseRequest();
  request.headers["x-nexus-csrf-token"] =
    "short";

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "CSRF_TOKEN_INVALID",
  );
});

check("mismatched CSRF token is blocked", async () => {
  const request = baseRequest();
  request.headers["x-nexus-csrf-token"] =
    "csrf-token-766-different-abcdefghijklmnop";

  const harness = makeHarness();
  const result = await harness.route(request);

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "CSRF_TOKEN_INVALID",
  );
  assert.equal(harness.endpointCalls.length, 0);
});

check("valid CSRF token executes endpoint", async () => {
  const harness = makeHarness();

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 200);
  assert.equal(harness.endpointCalls.length, 1);
});

check("endpoint infrastructure failure is hidden", async () => {
  const harness = makeHarness({
    endpoint: async () => {
      throw new Error(
        "provider network secret=raw-secret",
      );
    },
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 500);
  assert.equal(
    result.body.error.code,
    "INTERNAL_ERROR",
  );
  assert.doesNotMatch(
    result.body.error.message,
    /provider|network|secret|raw-secret/i,
  );
});

check("malformed endpoint response is blocked", async () => {
  const harness = makeHarness({
    endpoint: async () => ({
      status: 200,
      headers: {},
      body: null,
    }),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "ENDPOINT_RESPONSE_INVALID",
  );
});

check("endpoint response without no-store is blocked", async () => {
  const response = baseEndpointResponse();
  delete response.headers["cache-control"];

  const harness = makeHarness({
    endpoint: async () => response,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "ENDPOINT_RESPONSE_INVALID",
  );
});

check("endpoint success tenant tampering is blocked", async () => {
  const response = baseEndpointResponse();
  response.body.tenantId = "tenant-b";

  const harness = makeHarness({
    endpoint: async () => response,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "ENDPOINT_RESPONSE_INVALID",
  );
});

check("endpoint cycle tenant tampering is blocked", async () => {
  const response = baseEndpointResponse();
  response.body.cycle.tenantId = "tenant-b";

  const harness = makeHarness({
    endpoint: async () => response,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
});

check("endpoint owner approval tampering is blocked", async () => {
  const response = baseEndpointResponse();
  response.body.ownerApprovalRequired = false;

  const harness = makeHarness({
    endpoint: async () => response,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
});

check("endpoint live execution authorization is blocked", async () => {
  const response = baseEndpointResponse();
  response.body.liveProviderExecution =
    "allowed";

  const harness = makeHarness({
    endpoint: async () => response,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
});

check("endpoint delivery payment and launch authorization is blocked", async () => {
  const response = baseEndpointResponse();
  response.body.externalDelivery = "allowed";
  response.body.paymentExecution = "allowed";
  response.body.publicLaunch = "allowed";

  const harness = makeHarness({
    endpoint: async () => response,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
});

check("safe endpoint error response passes through", async () => {
  const harness = makeHarness({
    endpoint: async () =>
      baseEndpointErrorResponse(),
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 409);
  assert.equal(result.body.ok, false);
  assert.equal(
    result.body.error.code,
    "REQUEST_IN_PROGRESS",
  );
});

check("unsafe endpoint error message is blocked", async () => {
  const response = baseEndpointErrorResponse();
  response.body.error.message =
    "raw password=secret\ninternal stack";

  const harness = makeHarness({
    endpoint: async () => response,
  });

  const result = await harness.route(
    baseRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "ENDPOINT_RESPONSE_INVALID",
  );
});

(async () => {
  assert.equal(
    checks.length,
    36,
    `Expected 36 targeted checks, found ${checks.length}`,
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
