const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day776-compiled",
);

const {
  createControlledInternalPilotFetchApiAdapter,
  ControlledInternalPilotFetchApiAdapterError,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotFetchApiAdapter.js",
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

const securityHeaders = {
  "content-type":
    "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy":
    "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
};

function sessionResponse(overrides = {}) {
  return {
    status: 201,
    headers: {
      ...securityHeaders,
      "set-cookie":
        "nexus_internal_pilot_session=" +
        "session-token-776-abcdefghijklmnopqrstuvwxyz; " +
        "Path=/; HttpOnly; Secure; " +
        "SameSite=Strict; Max-Age=3600",
    },
    body: {
      ok: true,
      operation: "issue",
      tenantId: "tenant-a",
      sessionId:
        "session-776-created",
      actorId: "owner-776",
      csrfToken:
        "csrf-token-776-abcdefghijklmnopqrstuvwxyz",
      issuedAt:
        "2026-07-11T20:00:00.000Z",
      expiresAt:
        "2026-07-11T21:00:00.000Z",
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
        "request-776-0001",
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

function safeErrorResponse(overrides = {}) {
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

function createRequest(
  pathName,
  options = {},
) {
  const headers = {
    origin:
      "https://pilot.nexus.test",
    "content-type":
      "application/json",
    "x-nexus-internal-pilot":
      "sandbox-v1",
    ...options.headers,
  };

  return new Request(
    options.url ||
      `https://pilot.nexus.test${pathName}`,
    {
      method:
        options.method || "POST",
      headers,
      body:
        options.method === "GET"
          ? undefined
          : (
              options.body === undefined
                ? "{}"
                : options.body
            ),
    },
  );
}

async function readJson(response) {
  return JSON.parse(
    await response.text(),
  );
}

function makeHarness(options = {}) {
  const calls = [];

  const router = async (request) => {
    calls.push(
      JSON.parse(JSON.stringify(request)),
    );

    if (options.throwRouter) {
      throw new Error(
        "router password=raw-secret failed",
      );
    }

    return options.response ||
      (
        request.path ===
        INTERNAL_PILOT_SESSION_ROUTE_PATH
          ? sessionResponse()
          : workerResponse()
      );
  };

  const handler =
    createControlledInternalPilotFetchApiAdapter({
      router,
      allowedHosts:
        options.allowedHosts || [
          "pilot.nexus.test",
          "localhost:3000",
        ],
      maxRequestBodyBytes:
        options.maxRequestBodyBytes ||
        65_536,
      maxResponseBodyBytes:
        options.maxResponseBodyBytes ||
        65_536,
    });

  return {
    handler,
    calls,
  };
}

check("invalid Fetch adapter configuration is rejected", async () => {
  assert.throws(
    () =>
      createControlledInternalPilotFetchApiAdapter({
        router: async () => ({}),
        allowedHosts: [],
      }),
    (error) => {
      assert.ok(
        error instanceof
          ControlledInternalPilotFetchApiAdapterError,
      );

      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("exact session URL reaches production router", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 201);
  assert.equal(
    harness.calls.length,
    1,
  );
  assert.equal(
    harness.calls[0].path,
    INTERNAL_PILOT_SESSION_ROUTE_PATH,
  );
});

check("exact worker URL reaches production router", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 200);
  assert.equal(
    harness.calls[0].path,
    INTERNAL_PILOT_WORKER_ROUTE_PATH,
  );
});

check("query strings are blocked before router execution", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          url:
            "https://pilot.nexus.test" +
            INTERNAL_PILOT_WORKER_ROUTE_PATH +
            "?mode=live",
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "QUERY_NOT_ALLOWED",
  );
  assert.equal(
    harness.calls.length,
    0,
  );
});

check("URL fragments are blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          url:
            "https://pilot.nexus.test" +
            INTERNAL_PILOT_WORKER_ROUTE_PATH +
            "#unsafe",
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "QUERY_NOT_ALLOWED",
  );
});

check("untrusted host is blocked before router execution", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          url:
            "https://attacker.example" +
            INTERNAL_PILOT_WORKER_ROUTE_PATH,
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 403);
  assert.equal(
    body.error.code,
    "HOST_NOT_ALLOWED",
  );
  assert.equal(
    harness.calls.length,
    0,
  );
});

check("insecure non-local HTTP request is blocked", async () => {
  const harness = makeHarness({
    allowedHosts: [
      "pilot.nexus.test",
    ],
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          url:
            "http://pilot.nexus.test" +
            INTERNAL_PILOT_WORKER_ROUTE_PATH,
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "INVALID_REQUEST_URL",
  );
});

check("local development HTTP host is supported", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          url:
            "http://localhost:3000" +
            INTERNAL_PILOT_WORKER_ROUTE_PATH,
        },
      ),
    );

  assert.equal(response.status, 200);
});

check("non-POST request is blocked before body read and router execution", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          method: "GET",
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 405);
  assert.equal(
    body.error.code,
    "METHOD_NOT_ALLOWED",
  );
  assert.equal(
    harness.calls.length,
    0,
  );
});

check("invalid declared content length is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          headers: {
            "content-length": "abc",
          },
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "CONTENT_LENGTH_INVALID",
  );
});

check("oversized declared request body is blocked before router", async () => {
  const harness = makeHarness({
    maxRequestBodyBytes: 1024,
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          headers: {
            "content-length": "2000",
          },
          body: "{}",
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 413);
  assert.equal(
    body.error.code,
    "REQUEST_BODY_TOO_LARGE",
  );
  assert.equal(
    harness.calls.length,
    0,
  );
});

check("actual oversized request body is blocked", async () => {
  const harness = makeHarness({
    maxRequestBodyBytes: 1024,
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          body: "x".repeat(2000),
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 413);
  assert.equal(
    body.error.code,
    "REQUEST_BODY_TOO_LARGE",
  );
});

check("declared and actual body length mismatch is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          headers: {
            "content-length": "10",
          },
          body: "{}",
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "REQUEST_BODY_LENGTH_MISMATCH",
  );
});

check("compressed request body is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          headers: {
            "content-encoding": "gzip",
          },
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 415);
  assert.equal(
    body.error.code,
    "CONTENT_ENCODING_FORBIDDEN",
  );
});

check("body read failure is fail-closed", async () => {
  const harness = makeHarness();

  const fakeRequest = {
    url:
      "https://pilot.nexus.test" +
      INTERNAL_PILOT_WORKER_ROUTE_PATH,
    method: "POST",
    headers: new Headers({
      origin:
        "https://pilot.nexus.test",
      "content-type":
        "application/json",
    }),
    async arrayBuffer() {
      throw new Error(
        "stream secret failure",
      );
    },
  };

  const response =
    await harness.handler(
      fakeRequest,
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "BODY_READ_FAILED",
  );

  assert.doesNotMatch(
    body.error.message,
    /stream|secret/i,
  );
});

check("required internal headers are forwarded exactly", async () => {
  const harness = makeHarness();

  const request =
    createRequest(
      INTERNAL_PILOT_WORKER_ROUTE_PATH,
      {
        headers: {
          cookie:
            "nexus_internal_pilot_session=test-session",
          "x-nexus-csrf-token":
            "csrf-776",
          "x-nexus-idempotency-key":
            "idem-776",
        },
        body:
          '{"requestId":"request-776"}',
      },
    );

  await harness.handler(request);

  assert.deepEqual(
    harness.calls[0].headers,
    {
      origin:
        "https://pilot.nexus.test",
      cookie:
        "nexus_internal_pilot_session=test-session",
      "content-type":
        "application/json",
      "x-nexus-internal-pilot":
        "sandbox-v1",
      "x-nexus-csrf-token":
        "csrf-776",
      "x-nexus-idempotency-key":
        "idem-776",
    },
  );
});

check("unknown request headers are not forwarded", async () => {
  const harness = makeHarness();

  await harness.handler(
    createRequest(
      INTERNAL_PILOT_WORKER_ROUTE_PATH,
      {
        headers: {
          "x-debug-secret":
            "must-not-forward",
        },
      },
    ),
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      harness.calls[0].headers,
      "x-debug-secret",
    ),
    false,
  );
});

check("client-forged actor identity is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          headers: {
            "x-nexus-actor-id":
              "attacker",
          },
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );
  assert.equal(
    harness.calls.length,
    0,
  );
});

check("authorization identity injection is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
        {
          headers: {
            authorization:
              "Bearer attacker-token",
          },
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );
});

check("ambiguous comma-separated origin is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          headers: {
            origin:
              "https://pilot.nexus.test, https://attacker.example",
          },
        },
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(
    body.error.code,
    "REQUEST_HEADER_INVALID",
  );
});

check("router exception is safely classified", async () => {
  const harness = makeHarness({
    throwRouter: true,
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 500);
  assert.equal(
    body.error.code,
    "ROUTER_EXECUTION_FAILED",
  );

  assert.doesNotMatch(
    body.error.message,
    /password|raw-secret/i,
  );
});

check("malformed router response is blocked", async () => {
  const harness = makeHarness({
    response: null,
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 503);
  assert.equal(
    body.error.code,
    "ROUTER_RESPONSE_INVALID",
  );
});

check("invalid router response status is blocked", async () => {
  const harness = makeHarness({
    response:
      workerResponse({
        status: 700,
      }),
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("unexpected router response header is blocked", async () => {
  const harness = makeHarness({
    response:
      workerResponse({
        headers: {
          ...securityHeaders,
          "x-debug-secret": "enabled",
        },
      }),
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("response header injection is blocked", async () => {
  const harness = makeHarness({
    response:
      workerResponse({
        headers: {
          ...securityHeaders,
          "cache-control":
            "no-store\r\nx-secret: value",
        },
      }),
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("oversized router response is blocked", async () => {
  const harness = makeHarness({
    maxResponseBodyBytes: 1024,
    response:
      workerResponse({
        body: {
          ...workerResponse().body,
          output:
            "x".repeat(3000),
        },
      }),
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("raw infrastructure response field is blocked", async () => {
  const harness = makeHarness({
    response:
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
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("raw session token response field is blocked", async () => {
  const harness = makeHarness({
    response:
      sessionResponse({
        body: {
          ...sessionResponse().body,
          sessionToken:
            "raw-session-secret",
        },
      }),
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("valid downstream error response is preserved", async () => {
  const harness = makeHarness({
    response:
      safeErrorResponse(),
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  const body = await readJson(response);

  assert.equal(response.status, 403);
  assert.deepEqual(
    body,
    safeErrorResponse().body,
  );
});

check("session Set-Cookie header survives Fetch boundary", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_SESSION_ROUTE_PATH,
      ),
    );

  assert.match(
    response.headers.get(
      "set-cookie",
    ),
    /HttpOnly/,
  );

  assert.match(
    response.headers.get(
      "set-cookie",
    ),
    /SameSite=Strict/,
  );
});

check("worker response cannot set a cookie", async () => {
  const harness = makeHarness({
    response:
      workerResponse({
        headers: {
          ...securityHeaders,
          "set-cookie":
            "nexus_internal_pilot_session=unsafe",
        },
      }),
  });

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(response.status, 503);
});

check("Fetch response keeps strict security headers", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  assert.equal(
    response.headers.get(
      "cache-control",
    ),
    "no-store",
  );

  assert.equal(
    response.headers.get(
      "x-content-type-options",
    ),
    "nosniff",
  );

  assert.equal(
    response.headers.get(
      "content-security-policy",
    ),
    "default-src 'none'; frame-ancestors 'none'",
  );
});

check("successful Fetch response preserves all sandbox boundaries", async () => {
  const harness = makeHarness();

  const response =
    await harness.handler(
      createRequest(
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
      ),
    );

  const body = await readJson(response);

  assert.equal(
    body.ownerApprovalRequired,
    true,
  );

  assert.equal(
    body.liveProviderExecution,
    "blocked",
  );

  assert.equal(
    body.externalDelivery,
    "blocked",
  );

  assert.equal(
    body.paymentExecution,
    "blocked",
  );

  assert.equal(
    body.publicLaunch,
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
