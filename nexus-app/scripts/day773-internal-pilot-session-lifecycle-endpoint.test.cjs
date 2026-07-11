const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day773-compiled",
);

const {
  createInternalPilotSessionLifecycleEndpoint,
} = require(
  path.join(
    compiledDirectory,
    "internalPilotSessionLifecycleEndpoint.js",
  ),
);

const {
  createInternalPilotCsrfDigest,
} = require(
  path.join(
    compiledDirectory,
    "internalPilotSandboxWorkerRoute.js",
  ),
);

const {
  PostgresInternalPilotSessionLifecycleError,
} = require(
  path.join(
    compiledDirectory,
    "postgresInternalPilotSessionLifecycle.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T17:00:00.000Z",
);

const trustedCsrfToken =
  "trusted-csrf-token-773-abcdefghijklmnopqrstuvwxyz";

const issuedSessionToken =
  "issued-session-token-773-abcdefghijklmnopqrstuvwxyz";

const issuedCsrfToken =
  "issued-csrf-token-773-abcdefghijklmnopqrstuvwxyz";

function baseSession(overrides = {}) {
  return {
    sessionId: "session-773-authority",
    actorId: "owner-773",
    tenantId: "tenant-a",
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
    csrfTokenDigest:
      createInternalPilotCsrfDigest(
        trustedCsrfToken,
      ),
    expiresAt:
      "2026-07-11T18:00:00.000Z",
    ...overrides,
  };
}

function issueBody(overrides = {}) {
  return {
    operation: "issue",
    tenantId: "tenant-a",
    ownerApprovalGranted: true,
    ttlSeconds: 3600,
    ...overrides,
  };
}

function revokeBody(overrides = {}) {
  return {
    operation: "revoke",
    tenantId: "tenant-a",
    sessionId:
      "session-773-target",
    ...overrides,
  };
}

function request(body, overrides = {}) {
  return {
    method: "POST",
    headers: {
      "content-type":
        "application/json",
      "x-nexus-internal-pilot":
        "sandbox-v1",
      "x-nexus-csrf-token":
        trustedCsrfToken,
    },
    bodyText: JSON.stringify(body),
    ...overrides,
  };
}

function issueResult(overrides = {}) {
  const {
    createInternalPilotSessionTokenDigest,
  } = require(
    path.join(
      compiledDirectory,
      "postgresInternalPilotSessionResolver.js",
    ),
  );

  return {
    tenantId: "tenant-a",
    sessionId:
      "session-773-created",
    actorId: "owner-773",
    role: "owner",
    ownerApprovalGranted: true,
    sessionToken:
      issuedSessionToken,
    csrfToken:
      issuedCsrfToken,
    sessionTokenDigest:
      createInternalPilotSessionTokenDigest(
        issuedSessionToken,
      ),
    csrfTokenDigest:
      createInternalPilotCsrfDigest(
        issuedCsrfToken,
      ),
    cookieName:
      "nexus_internal_pilot_session",
    setCookieHeader:
      "nexus_internal_pilot_session=" +
      `${issuedSessionToken}; ` +
      "Path=/; HttpOnly; Secure; " +
      "SameSite=Strict; Max-Age=3600",
    issuedAt:
      "2026-07-11T17:00:00.000Z",
    expiresAt:
      "2026-07-11T18:00:00.000Z",
    ...overrides,
  };
}

function revokeResult(overrides = {}) {
  return {
    tenantId: "tenant-a",
    sessionId:
      "session-773-target",
    actorId: "owner-773",
    revoked: true,
    replay: false,
    revokedAt:
      "2026-07-11T17:00:00.000Z",
    ...overrides,
  };
}

function makeHarness(options = {}) {
  const issueCalls = [];
  const revokeCalls = [];

  const lifecycle = {
    async issue(input) {
      issueCalls.push(
        JSON.parse(JSON.stringify(input)),
      );

      if (options.issueError) {
        throw options.issueError;
      }

      return options.issueResult ||
        issueResult();
    },

    async revoke(input) {
      revokeCalls.push(
        JSON.parse(JSON.stringify(input)),
      );

      if (options.revokeError) {
        throw options.revokeError;
      }

      return options.revokeResult ||
        revokeResult();
    },
  };

  const endpoint =
    createInternalPilotSessionLifecycleEndpoint({
      tenantId: "tenant-a",
      lifecycle,
      maxBodyBytes:
        options.maxBodyBytes || 8192,
      now: () => new Date(fixedNow),
    });

  return {
    endpoint,
    issueCalls,
    revokeCalls,
  };
}

check("invalid endpoint configuration is rejected", async () => {
  assert.throws(() =>
    createInternalPilotSessionLifecycleEndpoint({
      tenantId: "tenant-a",
      lifecycle: {},
    }),
  );
});

check("valid owner can issue pilot session", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(response.status, 201);
  assert.equal(response.body.ok, true);
  assert.equal(
    response.body.operation,
    "issue",
  );
});

check("issue uses trusted server actor identity", async () => {
  const harness = makeHarness();

  await harness.endpoint(
    baseSession(),
    request(issueBody()),
  );

  assert.deepEqual(
    harness.issueCalls[0],
    {
      actorId: "owner-773",
      ownerApprovalGranted: true,
      ttlSeconds: 3600,
    },
  );
});

check("issued session token is excluded from response body", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.doesNotMatch(
    JSON.stringify(response.body),
    new RegExp(issuedSessionToken),
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      response.body,
      "sessionToken",
    ),
    false,
  );
});

check("issued CSRF token is returned to authenticated owner", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(
    response.body.csrfToken,
    issuedCsrfToken,
  );
});

check("issued cookie remains HttpOnly Secure and Strict", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.match(
    response.headers["set-cookie"],
    /HttpOnly/,
  );

  assert.match(
    response.headers["set-cookie"],
    /Secure/,
  );

  assert.match(
    response.headers["set-cookie"],
    /SameSite=Strict/,
  );
});

check("non-POST request is blocked", async () => {
  const harness = makeHarness();

  const badRequest = request(
    issueBody(),
  );

  badRequest.method = "GET";

  const response =
    await harness.endpoint(
      baseSession(),
      badRequest,
    );

  assert.equal(response.status, 405);
  assert.equal(
    response.body.error.code,
    "METHOD_NOT_ALLOWED",
  );
});

check("missing JSON content type is blocked", async () => {
  const harness = makeHarness();
  const badRequest = request(issueBody());

  delete badRequest.headers[
    "content-type"
  ];

  const response =
    await harness.endpoint(
      baseSession(),
      badRequest,
    );

  assert.equal(response.status, 415);
});

check("missing internal pilot header is blocked", async () => {
  const harness = makeHarness();
  const badRequest = request(issueBody());

  delete badRequest.headers[
    "x-nexus-internal-pilot"
  ];

  const response =
    await harness.endpoint(
      baseSession(),
      badRequest,
    );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "PILOT_HEADER_REQUIRED",
  );
});

check("oversized lifecycle request is blocked", async () => {
  const harness = makeHarness({
    maxBodyBytes: 1024,
  });

  const body = issueBody({
    extra: "x".repeat(2000),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(body),
    );

  assert.equal(response.status, 413);
});

check("invalid JSON is blocked", async () => {
  const harness = makeHarness();
  const badRequest = request(issueBody());

  badRequest.bodyText = "{invalid";

  const response =
    await harness.endpoint(
      baseSession(),
      badRequest,
    );

  assert.equal(response.status, 400);
  assert.equal(
    response.body.error.code,
    "INVALID_JSON",
  );
});

check("additional issue fields are blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(
        issueBody({
          liveProviderExecution:
            "allowed",
        }),
      ),
    );

  assert.equal(response.status, 400);
  assert.equal(
    harness.issueCalls.length,
    0,
  );
});

check("cross-tenant issue request is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(
        issueBody({
          tenantId: "tenant-b",
        }),
      ),
    );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "TENANT_MISMATCH",
  );
});

check("unauthenticated authority is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession({
        authenticated: false,
      }),
      request(issueBody()),
    );

  assert.equal(response.status, 401);
});

check("non-owner authority is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession({
        role: "operator",
      }),
      request(issueBody()),
    );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );
});

check("unapproved owner authority is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession({
        ownerApprovalGranted: false,
      }),
      request(issueBody()),
    );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );
});

check("cross-tenant authority is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession({
        tenantId: "tenant-b",
      }),
      request(issueBody()),
    );

  assert.equal(response.status, 403);
});

check("expired authority session is blocked", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession({
        expiresAt:
          "2026-07-11T17:00:00.000Z",
      }),
      request(issueBody()),
    );

  assert.equal(response.status, 401);
  assert.equal(
    response.body.error.code,
    "SESSION_EXPIRED",
  );
});

check("missing CSRF token is blocked", async () => {
  const harness = makeHarness();
  const badRequest = request(issueBody());

  delete badRequest.headers[
    "x-nexus-csrf-token"
  ];

  const response =
    await harness.endpoint(
      baseSession(),
      badRequest,
    );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_REQUIRED",
  );
});

check("mismatched CSRF token is blocked", async () => {
  const harness = makeHarness();
  const badRequest = request(issueBody());

  badRequest.headers[
    "x-nexus-csrf-token"
  ] =
    "different-csrf-token-773-abcdefghijklmnopqrstuvwxyz";

  const response =
    await harness.endpoint(
      baseSession(),
      badRequest,
    );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_INVALID",
  );
});

check("valid owner can revoke pilot session", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(revokeBody()),
    );

  assert.equal(response.status, 200);
  assert.equal(
    response.body.operation,
    "revoke",
  );
  assert.equal(
    response.body.revoked,
    true,
  );
});

check("revoke uses trusted server actor identity", async () => {
  const harness = makeHarness();

  await harness.endpoint(
    baseSession(),
    request(revokeBody()),
  );

  assert.deepEqual(
    harness.revokeCalls[0],
    {
      sessionId:
        "session-773-target",
      actorId: "owner-773",
    },
  );
});

check("revocation clears secure pilot cookie", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(revokeBody()),
    );

  assert.match(
    response.headers["set-cookie"],
    /Max-Age=0/,
  );

  assert.match(
    response.headers["set-cookie"],
    /HttpOnly; Secure/,
  );
});

check("unknown session maps to safe not-found response", async () => {
  const harness = makeHarness({
    revokeError:
      new PostgresInternalPilotSessionLifecycleError(
        "SESSION_NOT_FOUND",
        "raw database details",
      ),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(revokeBody()),
    );

  assert.equal(response.status, 404);
  assert.equal(
    response.body.error.code,
    "SESSION_NOT_FOUND",
  );

  assert.doesNotMatch(
    response.body.error.message,
    /database|raw/i,
  );
});

check("session insert failure is safely classified", async () => {
  const harness = makeHarness({
    issueError:
      new PostgresInternalPilotSessionLifecycleError(
        "SESSION_INSERT_FAILED",
        "postgres password=raw-secret",
      ),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "SESSION_SERVICE_UNAVAILABLE",
  );

  assert.doesNotMatch(
    response.body.error.message,
    /postgres|password|raw-secret/i,
  );
});

check("secure randomness failure is fail-closed", async () => {
  const harness = makeHarness({
    issueError:
      new PostgresInternalPilotSessionLifecycleError(
        "RANDOMNESS_UNAVAILABLE",
        "random device details",
      ),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(response.status, 503);
});

check("tampered issue tenant result is blocked", async () => {
  const harness = makeHarness({
    issueResult: issueResult({
      tenantId: "tenant-b",
    }),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "SESSION_RESULT_INVALID",
  );
});

check("tampered issue actor result is blocked", async () => {
  const harness = makeHarness({
    issueResult: issueResult({
      actorId: "owner-other",
    }),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(response.status, 503);
});

check("tampered credential digest is blocked", async () => {
  const harness = makeHarness({
    issueResult: issueResult({
      sessionTokenDigest:
        "f".repeat(64),
    }),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(response.status, 503);
});

check("tampered revoke result is blocked", async () => {
  const harness = makeHarness({
    revokeResult: revokeResult({
      tenantId: "tenant-b",
    }),
  });

  const response =
    await harness.endpoint(
      baseSession(),
      request(revokeBody()),
    );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "SESSION_RESULT_INVALID",
  );
});

check("responses preserve security and sandbox boundaries", async () => {
  const harness = makeHarness();

  const response =
    await harness.endpoint(
      baseSession(),
      request(issueBody()),
    );

  assert.equal(
    response.headers["cache-control"],
    "no-store",
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
    30,
    `Expected 30 targeted checks, found ${checks.length}`,
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
