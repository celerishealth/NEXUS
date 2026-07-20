const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day768-compiled",
);

const {
  createInternalPilotSessionTokenDigest,
  createPostgresInternalPilotSessionResolver,
  PostgresInternalPilotSessionResolverError,
} = require(
  path.join(
    compiledDirectory,
    "postgresInternalPilotSessionResolver.js",
  ),
);

const {
  createInternalPilotCsrfDigest,
  createInternalPilotSandboxWorkerRoute,
} = require(
  path.join(
    compiledDirectory,
    "internalPilotSandboxWorkerRoute.js",
  ),
);

const migrationPath = path.join(
  process.cwd(),
  "db",
  "migrations",
  "0768_internal_pilot_owner_sessions.sql",
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T12:00:00.000Z",
);

const sessionToken =
  "session-token-768-abcdefghijklmnopqrstuvwxyz";

const csrfToken =
  "csrf-token-768-abcdefghijklmnopqrstuvwxyz";

const sessionDigest =
  createInternalPilotSessionTokenDigest(
    sessionToken,
  );

const csrfDigest =
  createInternalPilotCsrfDigest(
    csrfToken,
  );

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseRequest(overrides = {}) {
  return {
    method: "POST",
    headers: {
      origin: "https://pilot.nexus.test",
      cookie:
        `theme=dark; nexus_internal_pilot_session=${sessionToken}; locale=en`,
      "content-type": "application/json",
      "x-nexus-internal-pilot": "sandbox-v1",
      "x-nexus-idempotency-key":
        "idem-768-0001",
      "x-nexus-csrf-token": csrfToken,
    },
    bodyText: JSON.stringify({
      tenantId: "tenant-a",
      requestId: "request-768-0001",
      idempotencyKey: "idem-768-0001",
      batchSize: 2,
      requestedAt:
        "2026-07-11T12:00:00.000Z",
      executionMode: "sandbox",
    }),
    ...overrides,
  };
}

function baseRow(overrides = {}) {
  return {
    tenant_id: "tenant-a",
    session_id: "session-768-0001",
    session_digest: sessionDigest,
    actor_id: "owner-768",
    role: "owner",
    owner_approval_granted: true,
    csrf_token_digest: csrfDigest,
    expires_at:
      "2026-07-11T13:00:00.000Z",
    ...overrides,
  };
}

function createDatabase(options = {}) {
  const queries = [];

  const query = async (text, values = []) => {
    queries.push({
      text,
      values: clone(values),
    });

    if (options.failQuery) {
      throw new Error(
        "postgres password=raw-secret connection failed",
      );
    }

    if (options.result) {
      return options.result(text, values);
    }

    return {
      rows: [baseRow()],
      rowCount: 1,
    };
  };

  return {
    query,
    queries,
  };
}

function makeResolver(options = {}) {
  const database = createDatabase(
    options.databaseOptions || {},
  );

  const resolver =
    createPostgresInternalPilotSessionResolver({
      tenantId:
        options.tenantId || "tenant-a",
      query: database.query,
      now:
        options.now ||
        (() => new Date(fixedNow)),
      cookieName:
        options.cookieName,
      maxCookieHeaderBytes:
        options.maxCookieHeaderBytes,
    });

  return {
    resolver,
    ...database,
  };
}

async function expectCode(
  promise,
  expectedCode,
) {
  await assert.rejects(
    promise,
    (error) => {
      assert.ok(
        error instanceof
          PostgresInternalPilotSessionResolverError,
      );
      assert.equal(error.code, expectedCode);
      return true;
    },
  );
}

check("migration defines tenant-bound session primary key", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /PRIMARY KEY\s*\(\s*tenant_id\s*,\s*session_digest\s*\)/i,
  );
});

check("migration stores only session digest credential", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /session_digest CHAR\(64\) NOT NULL/i,
  );

  assert.doesNotMatch(
    sql,
    /\bsession_token\b/i,
  );
});

check("migration enforces tenant-scoped session identity", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /UNIQUE\s*\(\s*tenant_id\s*,\s*session_id\s*\)/i,
  );
});

check("migration supports revocation and expiry lookup", async () => {
  const sql = fs.readFileSync(
    migrationPath,
    "utf8",
  );

  assert.match(
    sql,
    /revoked_at TIMESTAMPTZ/i,
  );

  assert.match(
    sql,
    /WHERE revoked_at IS NULL/i,
  );

  assert.match(
    sql,
    /expires_at/i,
  );
});

check("session token digest is deterministic", async () => {
  assert.equal(
    createInternalPilotSessionTokenDigest(
      sessionToken,
    ),
    createInternalPilotSessionTokenDigest(
      sessionToken,
    ),
  );
});

check("different session tokens produce different digests", async () => {
  assert.notEqual(
    createInternalPilotSessionTokenDigest(
      sessionToken,
    ),
    createInternalPilotSessionTokenDigest(
      "session-token-768-different-abcdefghijklmnopqrstuvwxyz",
    ),
  );
});

check("invalid resolver configuration is rejected", async () => {
  assert.throws(
    () =>
      createPostgresInternalPilotSessionResolver({
        tenantId: "tenant-a",
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

check("valid secure cookie resolves trusted owner session", async () => {
  const harness = makeResolver();

  const session = await harness.resolver(
    baseRequest(),
  );

  assert.deepEqual(session, {
    sessionId: "session-768-0001",
    actorId: "owner-768",
    tenantId: "tenant-a",
    authenticated: true,
    role: "owner",
    ownerApprovalGranted: true,
    csrfTokenDigest: csrfDigest,
    expiresAt:
      "2026-07-11T13:00:00.000Z",
  });
});

check("cookie header name is case-insensitive", async () => {
  const request = baseRequest();

  request.headers.Cookie =
    request.headers.cookie;

  delete request.headers.cookie;

  const harness = makeResolver();
  const session = await harness.resolver(
    request,
  );

  assert.equal(
    session.sessionId,
    "session-768-0001",
  );
});

check("unrelated cookies do not affect session resolution", async () => {
  const request = baseRequest();

  request.headers.cookie =
    `first=value; nexus_internal_pilot_session=${sessionToken}; second=value`;

  const harness = makeResolver();
  const session = await harness.resolver(
    request,
  );

  assert.equal(session.actorId, "owner-768");
});

check("missing session cookie returns unauthenticated result", async () => {
  const request = baseRequest();

  request.headers.cookie =
    "theme=dark; locale=en";

  const harness = makeResolver();
  const session = await harness.resolver(
    request,
  );

  assert.equal(session, null);
  assert.equal(harness.queries.length, 0);
});

check("missing cookie header returns unauthenticated result", async () => {
  const request = baseRequest();

  delete request.headers.cookie;

  const harness = makeResolver();
  const session = await harness.resolver(
    request,
  );

  assert.equal(session, null);
  assert.equal(harness.queries.length, 0);
});

check("malformed session credential returns unauthenticated result", async () => {
  const request = baseRequest();

  request.headers.cookie =
    "nexus_internal_pilot_session=short";

  const harness = makeResolver();
  const session = await harness.resolver(
    request,
  );

  assert.equal(session, null);
  assert.equal(harness.queries.length, 0);
});

check("oversized cookie header returns unauthenticated result", async () => {
  const request = baseRequest();

  request.headers.cookie =
    `padding=${"x".repeat(600)}; nexus_internal_pilot_session=${sessionToken}`;

  const harness = makeResolver({
    maxCookieHeaderBytes: 512,
  });

  const session = await harness.resolver(
    request,
  );

  assert.equal(session, null);
  assert.equal(harness.queries.length, 0);
});

check("duplicate session cookies are blocked", async () => {
  const request = baseRequest();

  request.headers.cookie =
    `nexus_internal_pilot_session=${sessionToken}; nexus_internal_pilot_session=${sessionToken}`;

  const harness = makeResolver();

  await expectCode(
    harness.resolver(request),
    "INVALID_REQUEST",
  );

  assert.equal(harness.queries.length, 0);
});

check("duplicate cookie headers are blocked", async () => {
  const request = baseRequest();

  request.headers.Cookie =
    request.headers.cookie;

  const harness = makeResolver();

  await expectCode(
    harness.resolver(request),
    "INVALID_REQUEST",
  );

  assert.equal(harness.queries.length, 0);
});

check("database receives digest instead of raw session token", async () => {
  const harness = makeResolver();

  await harness.resolver(baseRequest());

  assert.equal(
    harness.queries[0].values[1],
    sessionDigest,
  );

  assert.notEqual(
    harness.queries[0].values[1],
    sessionToken,
  );

  assert.doesNotMatch(
    JSON.stringify(harness.queries[0].values),
    new RegExp(sessionToken),
  );
});

check("session query is tenant-scoped", async () => {
  const harness = makeResolver();

  await harness.resolver(baseRequest());

  assert.match(
    harness.queries[0].text,
    /WHERE tenant_id = \$1/i,
  );

  assert.equal(
    harness.queries[0].values[0],
    "tenant-a",
  );
});

check("session query enforces revocation and expiry", async () => {
  const harness = makeResolver();

  await harness.resolver(baseRequest());

  assert.match(
    harness.queries[0].text,
    /revoked_at IS NULL/i,
  );

  assert.match(
    harness.queries[0].text,
    /expires_at > \$3::timestamptz/i,
  );
});

check("unknown session returns unauthenticated result", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [],
        rowCount: 0,
      }),
    },
  });

  const session = await harness.resolver(
    baseRequest(),
  );

  assert.equal(session, null);
});

check("identical credential cannot cross tenant boundary", async () => {
  const harness = makeResolver({
    tenantId: "tenant-b",
    databaseOptions: {
      result: async () => ({
        rows: [],
        rowCount: 0,
      }),
    },
  });

  const session = await harness.resolver(
    baseRequest(),
  );

  assert.equal(session, null);

  assert.equal(
    harness.queries[0].values[0],
    "tenant-b",
  );
});

check("operator role is preserved for route authorization", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({ role: "operator" }),
        ],
        rowCount: 1,
      }),
    },
  });

  const session = await harness.resolver(
    baseRequest(),
  );

  assert.equal(session.role, "operator");
});

check("missing owner approval is preserved for route authorization", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({
            owner_approval_granted: false,
          }),
        ],
        rowCount: 1,
      }),
    },
  });

  const session = await harness.resolver(
    baseRequest(),
  );

  assert.equal(
    session.ownerApprovalGranted,
    false,
  );
});

check("expired returned row fails closed", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({
            expires_at:
              "2026-07-11T12:00:00.000Z",
          }),
        ],
        rowCount: 1,
      }),
    },
  });

  const session = await harness.resolver(
    baseRequest(),
  );

  assert.equal(session, null);
});

check("database Date expiry is normalized", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({
            expires_at: new Date(
              "2026-07-11T13:00:00.000Z",
            ),
          }),
        ],
        rowCount: 1,
      }),
    },
  });

  const session = await harness.resolver(
    baseRequest(),
  );

  assert.equal(
    session.expiresAt,
    "2026-07-11T13:00:00.000Z",
  );
});

check("wrong tenant row is blocked", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({
            tenant_id: "tenant-b",
          }),
        ],
        rowCount: 1,
      }),
    },
  });

  await expectCode(
    harness.resolver(baseRequest()),
    "SESSION_ROW_INVALID",
  );
});

check("wrong session digest row is blocked", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({
            session_digest:
              "b".repeat(64),
          }),
        ],
        rowCount: 1,
      }),
    },
  });

  await expectCode(
    harness.resolver(baseRequest()),
    "SESSION_ROW_INVALID",
  );
});

check("malformed CSRF digest row is blocked", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({
            csrf_token_digest: "invalid",
          }),
        ],
        rowCount: 1,
      }),
    },
  });

  await expectCode(
    harness.resolver(baseRequest()),
    "SESSION_ROW_INVALID",
  );
});

check("malformed session identifier row is blocked", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow({
            session_id: "bad id",
          }),
        ],
        rowCount: 1,
      }),
    },
  });

  await expectCode(
    harness.resolver(baseRequest()),
    "SESSION_ROW_INVALID",
  );
});

check("additional database row fields are blocked", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          {
            ...baseRow(),
            raw_session_token:
              "secret-should-never-exist",
          },
        ],
        rowCount: 1,
      }),
    },
  });

  await expectCode(
    harness.resolver(baseRequest()),
    "SESSION_ROW_INVALID",
  );
});

check("duplicate database rows are blocked", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [
          baseRow(),
          baseRow(),
        ],
        rowCount: 2,
      }),
    },
  });

  await expectCode(
    harness.resolver(baseRequest()),
    "SESSION_ROW_INVALID",
  );
});

check("inconsistent database row count is blocked", async () => {
  const harness = makeResolver({
    databaseOptions: {
      result: async () => ({
        rows: [baseRow()],
        rowCount: 0,
      }),
    },
  });

  await expectCode(
    harness.resolver(baseRequest()),
    "SESSION_ROW_INVALID",
  );
});

check("database failure is safely classified", async () => {
  const harness = makeResolver({
    databaseOptions: {
      failQuery: true,
    },
  });

  await assert.rejects(
    harness.resolver(baseRequest()),
    (error) => {
      assert.equal(
        error.code,
        "SESSION_QUERY_FAILED",
      );

      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );

      return true;
    },
  );
});

check("valid database session integrates with trusted route", async () => {
  const database = createDatabase();
  const endpointCalls = [];

  const resolver =
    createPostgresInternalPilotSessionResolver({
      tenantId: "tenant-a",
      query: database.query,
      now: () => new Date(fixedNow),
    });

  const route =
    createInternalPilotSandboxWorkerRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
      ],
      resolveSession: resolver,
      now: () => new Date(fixedNow),
      endpoint: async (session, request) => {
        endpointCalls.push({
          session: clone(session),
          request: clone(request),
        });

        return {
          status: 200,
          headers: {
            "content-type":
              "application/json; charset=utf-8",
            "cache-control": "no-store",
            "x-content-type-options":
              "nosniff",
          },
          body: {
            ok: true,
            tenantId: "tenant-a",
            requestId:
              "request-768-0001",
            requestDigest:
              "a".repeat(64),
            cycle: {
              tenantId: "tenant-a",
              ownerApprovalRequired: true,
              liveProviderExecution:
                "blocked",
              externalDelivery:
                "blocked",
              paymentExecution:
                "blocked",
              publicLaunch:
                "blocked",
            },
            ownerApprovalRequired: true,
            liveProviderExecution:
              "blocked",
            externalDelivery: "blocked",
            paymentExecution: "blocked",
            publicLaunch: "blocked",
          },
        };
      },
    });

  const response = await route(
    baseRequest(),
  );

  assert.equal(response.status, 200);
  assert.equal(endpointCalls.length, 1);
  assert.equal(
    endpointCalls[0].session.actorId,
    "owner-768",
  );
});

check("missing database session is blocked by trusted route", async () => {
  const database = createDatabase({
    result: async () => ({
      rows: [],
      rowCount: 0,
    }),
  });

  const resolver =
    createPostgresInternalPilotSessionResolver({
      tenantId: "tenant-a",
      query: database.query,
      now: () => new Date(fixedNow),
    });

  const route =
    createInternalPilotSandboxWorkerRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
      ],
      resolveSession: resolver,
      now: () => new Date(fixedNow),
      endpoint: async () => {
        throw new Error(
          "Endpoint must not execute.",
        );
      },
    });

  const response = await route(
    baseRequest(),
  );

  assert.equal(response.status, 401);
  assert.equal(
    response.body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
});

check("operator database session is blocked by trusted route", async () => {
  const database = createDatabase({
    result: async () => ({
      rows: [
        baseRow({ role: "operator" }),
      ],
      rowCount: 1,
    }),
  });

  const resolver =
    createPostgresInternalPilotSessionResolver({
      tenantId: "tenant-a",
      query: database.query,
      now: () => new Date(fixedNow),
    });

  const route =
    createInternalPilotSandboxWorkerRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
      ],
      resolveSession: resolver,
      now: () => new Date(fixedNow),
      endpoint: async () => {
        throw new Error(
          "Endpoint must not execute.",
        );
      },
    });

  const response = await route(
    baseRequest(),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );
});

check("unapproved database session is blocked by trusted route", async () => {
  const database = createDatabase({
    result: async () => ({
      rows: [
        baseRow({
          owner_approval_granted: false,
        }),
      ],
      rowCount: 1,
    }),
  });

  const resolver =
    createPostgresInternalPilotSessionResolver({
      tenantId: "tenant-a",
      query: database.query,
      now: () => new Date(fixedNow),
    });

  const route =
    createInternalPilotSandboxWorkerRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
      ],
      resolveSession: resolver,
      now: () => new Date(fixedNow),
      endpoint: async () => {
        throw new Error(
          "Endpoint must not execute.",
        );
      },
    });

  const response = await route(
    baseRequest(),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );
});

(async () => {
  assert.equal(
    checks.length,
    37,
    `Expected 37 targeted checks, found ${checks.length}`,
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
