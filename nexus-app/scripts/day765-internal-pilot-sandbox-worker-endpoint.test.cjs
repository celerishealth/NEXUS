const assert = require("node:assert/strict");
const path = require("node:path");

const compiledPath = path.join(
  process.cwd(),
  ".day765-compiled",
  "internalPilotSandboxWorkerEndpoint.js",
);

const {
  createInternalPilotSandboxWorkerEndpoint,
} = require(compiledPath);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseSession(overrides = {}) {
  return {
    sessionId: "session-765-0001",
    actorId: "owner-765",
    tenantId: "tenant-a",
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
    ...overrides,
  };
}

function baseCommand(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-765-0001",
    idempotencyKey: "idem-765-0001",
    batchSize: 2,
    requestedAt: "2026-07-11T09:00:00.000Z",
    executionMode: "sandbox",
    ...overrides,
  };
}

function baseHttpRequest(
  command = baseCommand(),
  overrides = {},
) {
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-nexus-internal-pilot": "sandbox-v1",
      "x-nexus-idempotency-key":
        command.idempotencyKey,
    },
    bodyText: JSON.stringify(command),
    ...overrides,
  };
}

function baseResult(
  command = baseCommand(),
  overrides = {},
) {
  return {
    tenantId: command.tenantId,
    requestId: command.requestId,
    requestDigest: "a".repeat(64),
    cycle: {
      tenantId: command.tenantId,
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
    ...overrides,
  };
}

function makeHarness(options = {}) {
  const calls = [];

  const service = {
    async execute(actor, request) {
      calls.push({
        actor: clone(actor),
        request: clone(request),
      });

      if (options.error) {
        throw options.error;
      }

      if (options.execute) {
        return options.execute(actor, request);
      }

      return baseResult(request);
    },
  };

  const endpoint =
    createInternalPilotSandboxWorkerEndpoint({
      tenantId: "tenant-a",
      service,
      maxBodyBytes:
        options.maxBodyBytes ?? 16_384,
    });

  return {
    endpoint,
    calls,
  };
}

function codedError(code, rawMessage = "raw secret") {
  return Object.assign(
    new Error(rawMessage),
    { code },
  );
}

check("valid internal pilot request executes service", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(harness.calls.length, 1);
});

check("trusted session is converted to protected owner actor", async () => {
  const harness = makeHarness();

  await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.deepEqual(
    harness.calls[0].actor,
    {
      actorId: "owner-765",
      tenantId: "tenant-a",
      authenticated: true,
      role: "owner",
      ownerApprovalGranted: true,
    },
  );
});

check("successful response is no-store JSON", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(
    result.headers["cache-control"],
    "no-store",
  );
  assert.equal(
    result.headers["content-type"],
    "application/json; charset=utf-8",
  );
  assert.equal(
    result.headers["x-content-type-options"],
    "nosniff",
  );
});

check("successful response preserves protected boundaries", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.body.ownerApprovalRequired, true);
  assert.equal(
    result.body.liveProviderExecution,
    "blocked",
  );
  assert.equal(
    result.body.externalDelivery,
    "blocked",
  );
  assert.equal(
    result.body.paymentExecution,
    "blocked",
  );
  assert.equal(
    result.body.publicLaunch,
    "blocked",
  );
});

check("case-insensitive HTTP headers are accepted", async () => {
  const command = baseCommand();
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession(),
    {
      method: "post",
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "X-Nexus-Internal-Pilot": "sandbox-v1",
        "X-Nexus-Idempotency-Key":
          command.idempotencyKey,
      },
      bodyText: JSON.stringify(command),
    },
  );

  assert.equal(result.status, 200);
});

check("non-POST request is blocked", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(
      baseCommand(),
      { method: "GET" },
    ),
  );

  assert.equal(result.status, 405);
  assert.equal(
    result.body.error.code,
    "METHOD_NOT_ALLOWED",
  );
  assert.equal(harness.calls.length, 0);
});

check("non-JSON content type is blocked", async () => {
  const request = baseHttpRequest();

  request.headers["content-type"] = "text/plain";

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    request,
  );

  assert.equal(result.status, 415);
  assert.equal(
    result.body.error.code,
    "UNSUPPORTED_MEDIA_TYPE",
  );
  assert.equal(harness.calls.length, 0);
});

check("missing internal pilot header is blocked", async () => {
  const request = baseHttpRequest();

  delete request.headers["x-nexus-internal-pilot"];

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    request,
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "INTERNAL_PILOT_HEADER_REQUIRED",
  );
  assert.equal(harness.calls.length, 0);
});

check("incorrect internal pilot header is blocked", async () => {
  const request = baseHttpRequest();

  request.headers["x-nexus-internal-pilot"] =
    "production-v1";

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    request,
  );

  assert.equal(result.status, 403);
  assert.equal(harness.calls.length, 0);
});

check("oversized request body is blocked", async () => {
  const harness = makeHarness({
    maxBodyBytes: 1024,
  });

  const command = baseCommand({
    requestId: `request-${"x".repeat(1100)}`,
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(command),
  );

  assert.equal(result.status, 413);
  assert.equal(
    result.body.error.code,
    "REQUEST_TOO_LARGE",
  );
  assert.equal(harness.calls.length, 0);
});

check("malformed JSON is blocked", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession(),
    {
      ...baseHttpRequest(),
      bodyText: "{invalid-json",
    },
  );

  assert.equal(result.status, 400);
  assert.equal(
    result.body.error.code,
    "INVALID_JSON",
  );
  assert.equal(harness.calls.length, 0);
});

check("non-object JSON body is blocked", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession(),
    {
      ...baseHttpRequest(),
      bodyText: JSON.stringify([]),
    },
  );

  assert.equal(result.status, 400);
  assert.equal(
    result.body.error.code,
    "INVALID_REQUEST",
  );
});

check("additional untrusted request fields are blocked", async () => {
  const command = baseCommand({
    externalDelivery: "allowed",
  });

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(command),
  );

  assert.equal(result.status, 400);
  assert.equal(
    result.body.error.code,
    "INVALID_REQUEST",
  );
  assert.equal(harness.calls.length, 0);
});

check("missing required request fields are blocked", async () => {
  const command = baseCommand();

  delete command.requestId;

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(command),
  );

  assert.equal(result.status, 400);
  assert.equal(harness.calls.length, 0);
});

check("unauthenticated session is blocked before service", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession({ authenticated: false }),
    baseHttpRequest(),
  );

  assert.equal(result.status, 401);
  assert.equal(
    result.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
  assert.equal(harness.calls.length, 0);
});

check("non-owner session is blocked before service", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession({ role: "operator" }),
    baseHttpRequest(),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );
  assert.equal(harness.calls.length, 0);
});

check("missing owner approval is blocked before service", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession({
      ownerApprovalGranted: false,
    }),
    baseHttpRequest(),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );
  assert.equal(harness.calls.length, 0);
});

check("cross-tenant session is blocked before service", async () => {
  const harness = makeHarness();

  const result = await harness.endpoint(
    baseSession({ tenantId: "tenant-b" }),
    baseHttpRequest(),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "TENANT_MISMATCH",
  );
  assert.equal(harness.calls.length, 0);
});

check("cross-tenant request is blocked before service", async () => {
  const command = baseCommand({
    tenantId: "tenant-b",
  });

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(command),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "TENANT_MISMATCH",
  );
  assert.equal(harness.calls.length, 0);
});

check("live execution request is blocked before service", async () => {
  const command = baseCommand({
    executionMode: "live",
  });

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(command),
  );

  assert.equal(result.status, 403);
  assert.equal(
    result.body.error.code,
    "SANDBOX_EXECUTION_REQUIRED",
  );
  assert.equal(harness.calls.length, 0);
});

check("missing idempotency header is blocked", async () => {
  const request = baseHttpRequest();

  delete request.headers["x-nexus-idempotency-key"];

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    request,
  );

  assert.equal(result.status, 400);
  assert.equal(
    result.body.error.code,
    "IDEMPOTENCY_HEADER_REQUIRED",
  );
  assert.equal(harness.calls.length, 0);
});

check("idempotency header mismatch is blocked", async () => {
  const request = baseHttpRequest();

  request.headers["x-nexus-idempotency-key"] =
    "idem-765-different";

  const harness = makeHarness();
  const result = await harness.endpoint(
    baseSession(),
    request,
  );

  assert.equal(result.status, 409);
  assert.equal(
    result.body.error.code,
    "IDEMPOTENCY_BINDING_MISMATCH",
  );
  assert.equal(harness.calls.length, 0);
});

check("idempotency conflict maps to HTTP 409", async () => {
  const harness = makeHarness({
    error: codedError(
      "IDEMPOTENCY_CONFLICT",
      "database raw-secret",
    ),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 409);
  assert.equal(
    result.body.error.code,
    "IDEMPOTENCY_CONFLICT",
  );
  assert.doesNotMatch(
    result.body.error.message,
    /database|raw-secret/i,
  );
});

check("in-progress request maps to HTTP 409", async () => {
  const harness = makeHarness({
    error: codedError("REQUEST_IN_PROGRESS"),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 409);
  assert.equal(
    result.body.error.code,
    "REQUEST_IN_PROGRESS",
  );
});

check("expired request maps to HTTP 410", async () => {
  const harness = makeHarness({
    error: codedError("REQUEST_EXPIRED"),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 410);
  assert.equal(
    result.body.error.code,
    "REQUEST_EXPIRED",
  );
});

check("batch limit failure maps to HTTP 400", async () => {
  const harness = makeHarness({
    error: codedError("BATCH_LIMIT_EXCEEDED"),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 400);
  assert.equal(
    result.body.error.code,
    "BATCH_LIMIT_EXCEEDED",
  );
});

check("audit failure maps safely to HTTP 503", async () => {
  const harness = makeHarness({
    error: codedError(
      "AUDIT_UNAVAILABLE",
      "audit password=raw-secret",
    ),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "AUDIT_UNAVAILABLE",
  );
  assert.doesNotMatch(
    result.body.error.message,
    /audit password|raw-secret/i,
  );
});

check("receipt failure maps safely to HTTP 503", async () => {
  const harness = makeHarness({
    error: codedError(
      "RECEIPT_UNAVAILABLE",
      "postgres password=raw-secret",
    ),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "RECEIPT_UNAVAILABLE",
  );
  assert.doesNotMatch(
    result.body.error.message,
    /postgres|password|raw-secret/i,
  );
});

check("unknown infrastructure failure is hidden", async () => {
  const harness = makeHarness({
    error: new Error(
      "provider network secret=raw-secret",
    ),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
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

check("result tenant tampering is blocked", async () => {
  const harness = makeHarness({
    execute: async (_, request) =>
      baseResult(request, {
        tenantId: "tenant-b",
      }),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "CYCLE_RESULT_INVALID",
  );
});

check("result owner approval tampering is blocked", async () => {
  const harness = makeHarness({
    execute: async (_, request) =>
      baseResult(request, {
        ownerApprovalRequired: false,
      }),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "CYCLE_RESULT_INVALID",
  );
});

check("result live provider authorization is blocked", async () => {
  const harness = makeHarness({
    execute: async (_, request) =>
      baseResult(request, {
        liveProviderExecution: "allowed",
      }),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "CYCLE_RESULT_INVALID",
  );
});

check("result external delivery authorization is blocked", async () => {
  const harness = makeHarness({
    execute: async (_, request) =>
      baseResult(request, {
        externalDelivery: "allowed",
      }),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "CYCLE_RESULT_INVALID",
  );
});

check("result payment authorization is blocked", async () => {
  const harness = makeHarness({
    execute: async (_, request) =>
      baseResult(request, {
        paymentExecution: "allowed",
      }),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "CYCLE_RESULT_INVALID",
  );
});

check("result public launch authorization is blocked", async () => {
  const harness = makeHarness({
    execute: async (_, request) =>
      baseResult(request, {
        publicLaunch: "allowed",
      }),
  });

  const result = await harness.endpoint(
    baseSession(),
    baseHttpRequest(),
  );

  assert.equal(result.status, 503);
  assert.equal(
    result.body.error.code,
    "CYCLE_RESULT_INVALID",
  );
});

(async () => {
  assert.equal(
    checks.length,
    35,
    `Expected 35 targeted checks, found ${checks.length}`,
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
