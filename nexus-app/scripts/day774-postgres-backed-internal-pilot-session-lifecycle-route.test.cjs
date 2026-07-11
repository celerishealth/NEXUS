const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day774-compiled",
);

const {
  createPostgresBackedInternalPilotSessionLifecycleRoute,
  PostgresBackedLifecycleRouteError,
} = require(
  path.join(
    compiledDirectory,
    "postgresBackedInternalPilotSessionLifecycleRoute.js",
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
  createInternalPilotSessionTokenDigest,
} = require(
  path.join(
    compiledDirectory,
    "postgresInternalPilotSessionResolver.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T18:00:00.000Z",
);

const authoritySessionToken =
  "authority-session-token-774-abcdefghijklmnopqrstuvwxyz";

const authorityCsrfToken =
  "authority-csrf-token-774-abcdefghijklmnopqrstuvwxyz";

const authoritySessionDigest =
  createInternalPilotSessionTokenDigest(
    authoritySessionToken,
  );

const authorityCsrfDigest =
  createInternalPilotCsrfDigest(
    authorityCsrfToken,
  );

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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
    sessionId: "session-774-target",
    ...overrides,
  };
}

function request(body, overrides = {}) {
  return {
    method: "POST",
    headers: {
      origin: "https://pilot.nexus.test",
      cookie:
        `nexus_internal_pilot_session=${authoritySessionToken}`,
      "content-type": "application/json",
      "x-nexus-internal-pilot": "sandbox-v1",
      "x-nexus-csrf-token":
        authorityCsrfToken,
    },
    bodyText: JSON.stringify(body),
    ...overrides,
  };
}

function createDeterministicRandom() {
  let counter = 7;

  return (size) => {
    const value = Buffer.alloc(
      size,
      counter,
    );

    counter += 1;
    return value;
  };
}

function createDatabase(options = {}) {
  const records = new Map();
  const sessionQueries = [];
  const lifecycleQueries = [];
  let lifecycleTransactionCount = 0;

  function keyOf(tenantId, sessionId) {
    return `${tenantId}::${sessionId}`;
  }

  records.set(
    keyOf(
      "tenant-a",
      "session-774-authority",
    ),
    {
      tenant_id: "tenant-a",
      session_id:
        "session-774-authority",
      session_digest:
        authoritySessionDigest,
      actor_id: "owner-774",
      role:
        options.authorityRole ||
        "owner",
      owner_approval_granted:
        options.ownerApprovalGranted ??
        true,
      csrf_token_digest:
        authorityCsrfDigest,
      expires_at:
        options.authorityExpiresAt ||
        "2026-07-11T19:00:00.000Z",
      revoked_at: null,
      created_at:
        "2026-07-11T17:00:00.000Z",
      updated_at:
        "2026-07-11T17:00:00.000Z",
    },
  );

  records.set(
    keyOf(
      "tenant-a",
      "session-774-target",
    ),
    {
      tenant_id: "tenant-a",
      session_id:
        "session-774-target",
      session_digest:
        "d".repeat(64),
      actor_id: "owner-774",
      role: "owner",
      owner_approval_granted: true,
      csrf_token_digest:
        "e".repeat(64),
      expires_at:
        "2026-07-11T20:00:00.000Z",
      revoked_at: null,
      created_at:
        "2026-07-11T17:00:00.000Z",
      updated_at:
        "2026-07-11T17:00:00.000Z",
    },
  );

  const sessionQuery = async (
    text,
    values = [],
  ) => {
    sessionQueries.push({
      text,
      values: clone(values),
    });

    if (options.failSessionQuery) {
      throw new Error(
        "session postgres password=raw-secret failed",
      );
    }

    const [
      tenantId,
      sessionDigest,
      currentTime,
    ] = values;

    const row = [
      ...records.values(),
    ].find(
      (candidate) =>
        candidate.tenant_id ===
          tenantId &&
        candidate.session_digest ===
          sessionDigest &&
        candidate.revoked_at ===
          null &&
        new Date(
          candidate.expires_at,
        ).getTime() >
          new Date(
            currentTime,
          ).getTime(),
    );

    return {
      rows: row
        ? [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              session_digest:
                row.session_digest,
              actor_id:
                row.actor_id,
              role: row.role,
              owner_approval_granted:
                row.owner_approval_granted,
              csrf_token_digest:
                row.csrf_token_digest,
              expires_at:
                row.expires_at,
            },
          ]
        : [],
      rowCount: row ? 1 : 0,
    };
  };

  const client = {
    async query(text, values = []) {
      lifecycleQueries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day772:([a-z-]+)/,
        ) || []
      )[1];

      if (
        options.failLifecycleMarker &&
        marker === options.failLifecycleMarker
      ) {
        throw new Error(
          "lifecycle postgres password=raw-secret failed",
        );
      }

      if (marker === "session-insert") {
        const [
          tenantId,
          sessionId,
          sessionDigest,
          actorId,
          csrfTokenDigest,
          expiresAt,
          issuedAt,
        ] = values;

        const storedTenantId =
          options.tamperInsertTenant
            ? "tenant-b"
            : tenantId;

        const row = {
          tenant_id:
            storedTenantId,
          session_id: sessionId,
          session_digest:
            sessionDigest,
          actor_id: actorId,
          role: "owner",
          owner_approval_granted:
            true,
          csrf_token_digest:
            csrfTokenDigest,
          expires_at: expiresAt,
          revoked_at: null,
          created_at: issuedAt,
          updated_at: issuedAt,
        };

        if (!options.tamperInsertTenant) {
          records.set(
            keyOf(
              tenantId,
              sessionId,
            ),
            row,
          );
        }

        return {
          rows: [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              actor_id:
                row.actor_id,
              role: row.role,
              owner_approval_granted:
                row.owner_approval_granted,
              expires_at:
                row.expires_at,
              revoked_at:
                row.revoked_at,
            },
          ],
          rowCount: 1,
        };
      }

      if (marker === "session-revoke") {
        const [
          tenantId,
          sessionId,
          actorId,
          revokedAt,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            sessionId,
          ),
        );

        if (
          !row ||
          row.actor_id !== actorId ||
          row.revoked_at !== null
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.revoked_at = revokedAt;
        row.updated_at = revokedAt;

        return {
          rows: [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              actor_id:
                row.actor_id,
              revoked_at:
                row.revoked_at,
            },
          ],
          rowCount: 1,
        };
      }

      if (marker === "session-read") {
        const [
          tenantId,
          sessionId,
          actorId,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            sessionId,
          ),
        );

        if (
          !row ||
          row.actor_id !== actorId
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        return {
          rows: [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              actor_id:
                row.actor_id,
              revoked_at:
                row.revoked_at,
            },
          ],
          rowCount: 1,
        };
      }

      throw new Error(
        `Unknown lifecycle marker: ${marker}`,
      );
    },
  };

  const withLifecycleTransaction =
    async (work) => {
      lifecycleTransactionCount += 1;
      return work(client);
    };

  return {
    records,
    keyOf,
    sessionQuery,
    sessionQueries,
    lifecycleQueries,
    withLifecycleTransaction,
    getLifecycleTransactionCount:
      () => lifecycleTransactionCount,
  };
}

function makeHarness(options = {}) {
  const database = createDatabase(
    options.databaseOptions || {},
  );

  const route =
    createPostgresBackedInternalPilotSessionLifecycleRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
        "http://localhost:3000",
      ],
      sessionQuery:
        database.sessionQuery,
      withLifecycleTransaction:
        database.withLifecycleTransaction,
      maxBodyBytes:
        options.maxBodyBytes ||
        8192,
      maxCookieHeaderBytes: 4096,
      now: () => new Date(fixedNow),
      randomBytes:
        createDeterministicRandom(),
    });

  return {
    route,
    ...database,
  };
}

check("invalid production route configuration is rejected", async () => {
  assert.throws(
    () =>
      createPostgresBackedInternalPilotSessionLifecycleRoute({
        tenantId: "tenant-a",
        allowedOrigins: [
          "https://pilot.nexus.test",
        ],
      }),
    (error) => {
      assert.ok(
        error instanceof
          PostgresBackedLifecycleRouteError,
      );

      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("valid owner completes full session issue route", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(response.status, 201);
  assert.equal(response.body.ok, true);
  assert.equal(
    response.body.operation,
    "issue",
  );
});

check("session authentication lookup uses tenant and digest", async () => {
  const harness = makeHarness();

  await harness.route(
    request(issueBody()),
  );

  assert.equal(
    harness.sessionQueries[0].values[0],
    "tenant-a",
  );

  assert.equal(
    harness.sessionQueries[0].values[1],
    authoritySessionDigest,
  );
});

check("session issue executes durable lifecycle transaction", async () => {
  const harness = makeHarness();

  await harness.route(
    request(issueBody()),
  );

  assert.equal(
    harness.getLifecycleTransactionCount(),
    1,
  );

  assert.match(
    harness.lifecycleQueries[0].text,
    /nexus-day772:session-insert/,
  );
});

check("issued session is bound to trusted database actor", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(
    response.body.actorId,
    "owner-774",
  );

  assert.equal(
    harness.lifecycleQueries[0].values[3],
    "owner-774",
  );
});

check("raw issued session token is excluded from response body", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      response.body,
      "sessionToken",
    ),
    false,
  );

  assert.doesNotMatch(
    JSON.stringify(response.body),
    /BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc/,
  );
});

check("issued session uses protected secure cookie", async () => {
  const harness = makeHarness();

  const response = await harness.route(
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

check("valid owner completes full session revoke route", async () => {
  const harness = makeHarness();

  const response = await harness.route(
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

check("session revocation clears protected cookie", async () => {
  const harness = makeHarness();

  const response = await harness.route(
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

check("session revocation replay remains idempotent", async () => {
  const harness = makeHarness();

  const first = await harness.route(
    request(revokeBody()),
  );

  const second = await harness.route(
    request(revokeBody()),
  );

  assert.equal(
    first.body.replay,
    false,
  );

  assert.equal(
    second.body.replay,
    true,
  );

  assert.equal(
    second.body.revokedAt,
    first.body.revokedAt,
  );
});

check("revoked authority session cannot authenticate again", async () => {
  const harness = makeHarness();

  const revokeAuthority =
    revokeBody({
      sessionId:
        "session-774-authority",
    });

  const first = await harness.route(
    request(revokeAuthority),
  );

  assert.equal(first.status, 200);

  const second = await harness.route(
    request(issueBody()),
  );

  assert.equal(second.status, 401);
  assert.equal(
    second.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
});

check("missing origin is blocked before session database access", async () => {
  const badRequest = request(
    issueBody(),
  );

  delete badRequest.headers.origin;

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "ORIGIN_REQUIRED",
  );
  assert.equal(
    harness.sessionQueries.length,
    0,
  );
});

check("untrusted origin is blocked before authentication", async () => {
  const badRequest = request(
    issueBody(),
  );

  badRequest.headers.origin =
    "https://attacker.example";

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "ORIGIN_NOT_ALLOWED",
  );
  assert.equal(
    harness.sessionQueries.length,
    0,
  );
});

check("client-forged tenant identity is blocked", async () => {
  const badRequest = request(
    issueBody(),
  );

  badRequest.headers[
    "x-nexus-tenant-id"
  ] = "tenant-b";

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 400);
  assert.equal(
    response.body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );
  assert.equal(
    harness.sessionQueries.length,
    0,
  );
});

check("missing session cookie is blocked", async () => {
  const badRequest = request(
    issueBody(),
  );

  delete badRequest.headers.cookie;

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 401);
  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
  assert.equal(
    harness.getLifecycleTransactionCount(),
    0,
  );
});

check("malformed session credential is blocked", async () => {
  const badRequest = request(
    issueBody(),
  );

  badRequest.headers.cookie =
    "nexus_internal_pilot_session=short";

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 401);
  assert.equal(
    harness.sessionQueries.length,
    0,
  );
});

check("unknown session credential is blocked", async () => {
  const badRequest = request(
    issueBody(),
  );

  badRequest.headers.cookie =
    "nexus_internal_pilot_session=unknown-session-token-774-abcdefghijklmnopqrstuvwxyz";

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 401);
  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
});

check("session database failure is safely classified", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failSessionQuery: true,
    },
  });

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_UNAVAILABLE",
  );

  assert.doesNotMatch(
    response.body.error.message,
    /postgres|password|raw-secret/i,
  );
});

check("operator database session is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      authorityRole: "operator",
    },
  });

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );
  assert.equal(
    harness.getLifecycleTransactionCount(),
    0,
  );
});

check("unapproved owner database session is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      ownerApprovalGranted: false,
    },
  });

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );
});

check("expired database session is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      authorityExpiresAt:
        "2026-07-11T18:00:00.000Z",
    },
  });

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(response.status, 401);
  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
});

check("missing CSRF token is blocked before lifecycle write", async () => {
  const badRequest = request(
    issueBody(),
  );

  delete badRequest.headers[
    "x-nexus-csrf-token"
  ];

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_REQUIRED",
  );
  assert.equal(
    harness.getLifecycleTransactionCount(),
    0,
  );
});

check("mismatched CSRF token is blocked before lifecycle write", async () => {
  const badRequest = request(
    issueBody(),
  );

  badRequest.headers[
    "x-nexus-csrf-token"
  ] =
    "different-csrf-token-774-abcdefghijklmnopqrstuvwxyz";

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_INVALID",
  );
  assert.equal(
    harness.getLifecycleTransactionCount(),
    0,
  );
});

check("cross-tenant issue request is blocked", async () => {
  const harness = makeHarness();

  const response = await harness.route(
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
  assert.equal(
    harness.getLifecycleTransactionCount(),
    0,
  );
});

check("cross-tenant revoke request is blocked", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    request(
      revokeBody({
        tenantId: "tenant-b",
      }),
    ),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "TENANT_MISMATCH",
  );
  assert.equal(
    harness.getLifecycleTransactionCount(),
    0,
  );
});

check("session insert failure is fail-closed", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failLifecycleMarker:
        "session-insert",
    },
  });

  const response = await harness.route(
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

check("session revoke failure is fail-closed", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failLifecycleMarker:
        "session-revoke",
    },
  });

  const response = await harness.route(
    request(revokeBody()),
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

check("malformed lifecycle database result is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      tamperInsertTenant: true,
    },
  });

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "SESSION_SERVICE_UNAVAILABLE",
  );
});

check("successful route returns strict security headers", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    request(issueBody()),
  );

  assert.equal(
    response.headers["cache-control"],
    "no-store",
  );

  assert.equal(
    response.headers[
      "x-content-type-options"
    ],
    "nosniff",
  );

  assert.equal(
    response.headers[
      "content-security-policy"
    ],
    "default-src 'none'; frame-ancestors 'none'",
  );

  assert.equal(
    response.headers[
      "referrer-policy"
    ],
    "no-referrer",
  );
});

check("error route returns strict security headers", async () => {
  const badRequest = request(
    issueBody(),
  );

  delete badRequest.headers.origin;

  const harness = makeHarness();
  const response = await harness.route(
    badRequest,
  );

  assert.equal(
    response.headers["cache-control"],
    "no-store",
  );

  assert.equal(
    response.headers[
      "x-content-type-options"
    ],
    "nosniff",
  );
});

check("session issue preserves every sandbox safety boundary", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    request(issueBody()),
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
    31,
    `Expected 31 targeted checks, found ${checks.length}`,
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
