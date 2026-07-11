const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day772-compiled",
);

const {
  createPostgresInternalPilotSessionLifecycle,
  PostgresInternalPilotSessionLifecycleError,
} = require(
  path.join(
    compiledDirectory,
    "postgresInternalPilotSessionLifecycle.js",
  ),
);

const {
  createPostgresInternalPilotSessionResolver,
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
  "2026-07-11T16:00:00.000Z",
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function issueInput(overrides = {}) {
  return {
    actorId: "owner-772",
    ownerApprovalGranted: true,
    ttlSeconds: 3600,
    ...overrides,
  };
}

function revokeInput(
  sessionId,
  overrides = {},
) {
  return {
    sessionId,
    actorId: "owner-772",
    ...overrides,
  };
}

function createDeterministicRandom() {
  let counter = 1;

  return (size) => {
    const value = Buffer.alloc(
      size,
      counter,
    );

    counter += 1;
    return value;
  };
}

function createMemoryDatabase(options = {}) {
  const records = new Map();
  const queries = [];
  let transactionCount = 0;

  function keyOf(tenantId, sessionId) {
    return `${tenantId}::${sessionId}`;
  }

  const client = {
    async query(text, values = []) {
      queries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day772:([a-z-]+)/,
        ) || []
      )[1];

      if (
        options.failQueryMarker &&
        marker === options.failQueryMarker
      ) {
        throw new Error(
          "postgres password=raw-secret connection failed",
        );
      }

      if (marker === "session-insert") {
        if (options.insertResult) {
          return options.insertResult(
            text,
            values,
          );
        }

        const [
          tenantId,
          sessionId,
          sessionDigest,
          actorId,
          csrfTokenDigest,
          expiresAt,
          issuedAt,
        ] = values;

        const key = keyOf(
          tenantId,
          sessionId,
        );

        if (records.has(key)) {
          throw new Error(
            "duplicate session",
          );
        }

        const row = {
          tenant_id: tenantId,
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

        records.set(key, row);

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
        if (options.revokeResult) {
          return options.revokeResult(
            text,
            values,
          );
        }

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
        `Unknown lifecycle query marker: ${marker}`,
      );
    },
  };

  const withTransaction = async (work) => {
    transactionCount += 1;

    if (options.failTransaction) {
      throw new Error(
        "database password=raw-secret transaction failed",
      );
    }

    return work(client);
  };

  return {
    records,
    queries,
    keyOf,
    withTransaction,
    getTransactionCount:
      () => transactionCount,
  };
}

function makeHarness(options = {}) {
  const database =
    createMemoryDatabase(
      options.databaseOptions || {},
    );

  const lifecycle =
    createPostgresInternalPilotSessionLifecycle({
      tenantId:
        options.tenantId || "tenant-a",
      withTransaction:
        database.withTransaction,
      cookieName:
        options.cookieName,
      now:
        options.now ||
        (() => new Date(fixedNow)),
      randomBytes:
        options.randomBytes ||
        createDeterministicRandom(),
    });

  return {
    lifecycle,
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
          PostgresInternalPilotSessionLifecycleError,
      );

      assert.equal(
        error.code,
        expectedCode,
      );

      return true;
    },
  );
}

check("invalid lifecycle configuration is rejected", async () => {
  assert.throws(
    () =>
      createPostgresInternalPilotSessionLifecycle({
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

check("valid owner approval issues secure pilot session", async () => {
  const harness = makeHarness();

  const result =
    await harness.lifecycle.issue(
      issueInput(),
    );

  assert.equal(
    result.tenantId,
    "tenant-a",
  );

  assert.equal(
    result.actorId,
    "owner-772",
  );

  assert.equal(
    result.role,
    "owner",
  );

  assert.equal(
    result.ownerApprovalGranted,
    true,
  );
});

check("session issue request requires exact contract", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.lifecycle.issue({
      ...issueInput(),
      liveProviderExecution:
        "allowed",
    }),
    "INVALID_INPUT",
  );

  assert.equal(
    harness.queries.length,
    0,
  );
});

check("owner approval is mandatory for session issue", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.lifecycle.issue(
      issueInput({
        ownerApprovalGranted: false,
      }),
    ),
    "OWNER_APPROVAL_REQUIRED",
  );

  assert.equal(
    harness.queries.length,
    0,
  );
});

check("invalid owner actor identifier is blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.lifecycle.issue(
      issueInput({
        actorId: "bad actor",
      }),
    ),
    "INVALID_INPUT",
  );
});

check("session TTL below minimum is blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.lifecycle.issue(
      issueInput({
        ttlSeconds: 299,
      }),
    ),
    "INVALID_INPUT",
  );
});

check("session TTL above maximum is blocked", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.lifecycle.issue(
      issueInput({
        ttlSeconds: 86_401,
      }),
    ),
    "INVALID_INPUT",
  );
});

check("issued session uses secure random opaque credentials", async () => {
  const harness = makeHarness();

  const result =
    await harness.lifecycle.issue(
      issueInput(),
    );

  assert.match(
    result.sessionId,
    /^session-[a-f0-9]{32}$/,
  );

  assert.match(
    result.sessionToken,
    /^[A-Za-z0-9_-]{40,}$/,
  );

  assert.match(
    result.csrfToken,
    /^[A-Za-z0-9_-]{40,}$/,
  );

  assert.notEqual(
    result.sessionToken,
    result.csrfToken,
  );
});

check("issued credentials are stored only as digests", async () => {
  const harness = makeHarness();

  const result =
    await harness.lifecycle.issue(
      issueInput(),
    );

  const insert =
    harness.queries.find(
      (query) =>
        query.text.includes(
          "nexus-day772:session-insert",
        ),
    );

  const serialized =
    JSON.stringify(insert.values);

  assert.doesNotMatch(
    serialized,
    new RegExp(result.sessionToken),
  );

  assert.doesNotMatch(
    serialized,
    new RegExp(result.csrfToken),
  );

  assert.match(
    serialized,
    new RegExp(
      result.sessionTokenDigest,
    ),
  );

  assert.match(
    serialized,
    new RegExp(
      result.csrfTokenDigest,
    ),
  );
});

check("session insert remains tenant scoped", async () => {
  const harness = makeHarness();

  await harness.lifecycle.issue(
    issueInput(),
  );

  const insert =
    harness.queries[0];

  assert.equal(
    insert.values[0],
    "tenant-a",
  );

  assert.match(
    insert.text,
    /tenant_id/i,
  );
});

check("issued session expiry matches approved TTL", async () => {
  const harness = makeHarness();

  const result =
    await harness.lifecycle.issue(
      issueInput({
        ttlSeconds: 3600,
      }),
    );

  assert.equal(
    result.issuedAt,
    "2026-07-11T16:00:00.000Z",
  );

  assert.equal(
    result.expiresAt,
    "2026-07-11T17:00:00.000Z",
  );
});

check("issued cookie is HttpOnly Secure and SameSite Strict", async () => {
  const harness = makeHarness();

  const result =
    await harness.lifecycle.issue(
      issueInput(),
    );

  assert.match(
    result.setCookieHeader,
    /HttpOnly/,
  );

  assert.match(
    result.setCookieHeader,
    /Secure/,
  );

  assert.match(
    result.setCookieHeader,
    /SameSite=Strict/,
  );

  assert.match(
    result.setCookieHeader,
    /Max-Age=3600/,
  );
});

check("custom internal pilot cookie name is supported", async () => {
  const harness = makeHarness({
    cookieName:
      "nexus_custom_pilot",
  });

  const result =
    await harness.lifecycle.issue(
      issueInput(),
    );

  assert.equal(
    result.cookieName,
    "nexus_custom_pilot",
  );

  assert.match(
    result.setCookieHeader,
    /^nexus_custom_pilot=/,
  );
});

check("separate session issues produce separate credentials", async () => {
  const harness = makeHarness();

  const first =
    await harness.lifecycle.issue(
      issueInput(),
    );

  const second =
    await harness.lifecycle.issue(
      issueInput(),
    );

  assert.notEqual(
    first.sessionId,
    second.sessionId,
  );

  assert.notEqual(
    first.sessionToken,
    second.sessionToken,
  );

  assert.notEqual(
    first.csrfToken,
    second.csrfToken,
  );
});

check("unavailable secure randomness fails closed", async () => {
  const harness = makeHarness({
    randomBytes: () => {
      throw new Error(
        "random device unavailable",
      );
    },
  });

  await expectCode(
    harness.lifecycle.issue(
      issueInput(),
    ),
    "RANDOMNESS_UNAVAILABLE",
  );

  assert.equal(
    harness.queries.length,
    0,
  );
});

check("invalid random byte output fails closed", async () => {
  const harness = makeHarness({
    randomBytes: () =>
      Buffer.alloc(1),
  });

  await expectCode(
    harness.lifecycle.issue(
      issueInput(),
    ),
    "RANDOMNESS_UNAVAILABLE",
  );
});

check("session insert failure hides database details", async () => {
  const harness = makeHarness({
    databaseOptions: {
      failQueryMarker:
        "session-insert",
    },
  });

  await assert.rejects(
    harness.lifecycle.issue(
      issueInput(),
    ),
    (error) => {
      assert.equal(
        error.code,
        "SESSION_INSERT_FAILED",
      );

      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );

      return true;
    },
  );
});

check("malformed issued database row is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      insertResult:
        async () => ({
          rows: [
            {
              tenant_id:
                "tenant-a",
            },
          ],
          rowCount: 1,
        }),
    },
  });

  await expectCode(
    harness.lifecycle.issue(
      issueInput(),
    ),
    "SESSION_ROW_INVALID",
  );
});

check("cross-tenant issued row is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      insertResult:
        async (text, values) => ({
          rows: [
            {
              tenant_id:
                "tenant-b",
              session_id:
                values[1],
              actor_id:
                values[3],
              role: "owner",
              owner_approval_granted:
                true,
              expires_at:
                values[5],
              revoked_at: null,
            },
          ],
          rowCount: 1,
        }),
    },
  });

  await expectCode(
    harness.lifecycle.issue(
      issueInput(),
    ),
    "SESSION_ROW_INVALID",
  );
});

check("issued row owner approval mutation is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      insertResult:
        async (text, values) => ({
          rows: [
            {
              tenant_id:
                values[0],
              session_id:
                values[1],
              actor_id:
                values[3],
              role: "owner",
              owner_approval_granted:
                false,
              expires_at:
                values[5],
              revoked_at: null,
            },
          ],
          rowCount: 1,
        }),
    },
  });

  await expectCode(
    harness.lifecycle.issue(
      issueInput(),
    ),
    "SESSION_ROW_INVALID",
  );
});

check("issued session can be revoked by bound owner", async () => {
  const harness = makeHarness();

  const issued =
    await harness.lifecycle.issue(
      issueInput(),
    );

  const revoked =
    await harness.lifecycle.revoke(
      revokeInput(
        issued.sessionId,
      ),
    );

  assert.equal(
    revoked.revoked,
    true,
  );

  assert.equal(
    revoked.replay,
    false,
  );

  assert.equal(
    revoked.revokedAt,
    "2026-07-11T16:00:00.000Z",
  );
});

check("session revocation is tenant and actor scoped", async () => {
  const harness = makeHarness();

  const issued =
    await harness.lifecycle.issue(
      issueInput(),
    );

  await harness.lifecycle.revoke(
    revokeInput(
      issued.sessionId,
    ),
  );

  const revokeQuery =
    harness.queries.find(
      (query) =>
        query.text.includes(
          "nexus-day772:session-revoke",
        ),
    );

  assert.equal(
    revokeQuery.values[0],
    "tenant-a",
  );

  assert.equal(
    revokeQuery.values[1],
    issued.sessionId,
  );

  assert.equal(
    revokeQuery.values[2],
    "owner-772",
  );
});

check("repeated session revocation is idempotent", async () => {
  const harness = makeHarness();

  const issued =
    await harness.lifecycle.issue(
      issueInput(),
    );

  const first =
    await harness.lifecycle.revoke(
      revokeInput(
        issued.sessionId,
      ),
    );

  const second =
    await harness.lifecycle.revoke(
      revokeInput(
        issued.sessionId,
      ),
    );

  assert.equal(
    first.replay,
    false,
  );

  assert.equal(
    second.replay,
    true,
  );

  assert.equal(
    second.revokedAt,
    first.revokedAt,
  );
});

check("unknown session revocation is safely rejected", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.lifecycle.revoke(
      revokeInput(
        "session-00000000000000000000000000000000",
      ),
    ),
    "SESSION_NOT_FOUND",
  );
});

check("different actor cannot revoke owner session", async () => {
  const harness = makeHarness();

  const issued =
    await harness.lifecycle.issue(
      issueInput(),
    );

  await expectCode(
    harness.lifecycle.revoke(
      revokeInput(
        issued.sessionId,
        {
          actorId:
            "owner-different",
        },
      ),
    ),
    "SESSION_NOT_FOUND",
  );
});

check("session revoke request requires exact contract", async () => {
  const harness = makeHarness();

  await expectCode(
    harness.lifecycle.revoke({
      sessionId:
        "session-00000000000000000000000000000000",
      actorId: "owner-772",
      publicLaunch: "allowed",
    }),
    "INVALID_INPUT",
  );
});

check("session revoke database failure hides infrastructure details", async () => {
  const harness = makeHarness();

  const issued =
    await harness.lifecycle.issue(
      issueInput(),
    );

  const failingHarness =
    makeHarness({
      databaseOptions: {
        failQueryMarker:
          "session-revoke",
      },
    });

  failingHarness.records.set(
    failingHarness.keyOf(
      "tenant-a",
      issued.sessionId,
    ),
    harness.records.get(
      harness.keyOf(
        "tenant-a",
        issued.sessionId,
      ),
    ),
  );

  await assert.rejects(
    failingHarness.lifecycle.revoke(
      revokeInput(
        issued.sessionId,
      ),
    ),
    (error) => {
      assert.equal(
        error.code,
        "SESSION_REVOKE_FAILED",
      );

      assert.doesNotMatch(
        error.message,
        /postgres|password|raw-secret|connection/i,
      );

      return true;
    },
  );
});

check("malformed revoked database row is blocked", async () => {
  const harness = makeHarness({
    databaseOptions: {
      revokeResult:
        async () => ({
          rows: [
            {
              tenant_id:
                "tenant-a",
              session_id:
                "bad-session",
              actor_id:
                "owner-772",
              revoked_at:
                "2026-07-11T16:00:00.000Z",
            },
          ],
          rowCount: 1,
        }),
    },
  });

  await expectCode(
    harness.lifecycle.revoke(
      revokeInput(
        "session-00000000000000000000000000000000",
      ),
    ),
    "SESSION_ROW_INVALID",
  );
});

check("issued session integrates with Postgres session resolver", async () => {
  const harness = makeHarness();

  const issued =
    await harness.lifecycle.issue(
      issueInput(),
    );

  const resolver =
    createPostgresInternalPilotSessionResolver({
      tenantId: "tenant-a",
      now: () => new Date(fixedNow),
      query: async (
        text,
        values,
      ) => {
        const [
          tenantId,
          digest,
        ] = values;

        const row = [
          ...harness.records.values(),
        ].find(
          (candidate) =>
            candidate.tenant_id ===
              tenantId &&
            candidate.session_digest ===
              digest &&
            candidate.revoked_at ===
              null,
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
      },
    });

  const resolved = await resolver({
    method: "POST",
    headers: {
      cookie:
        `${issued.cookieName}=${issued.sessionToken}`,
    },
    bodyText: "{}",
  });

  assert.equal(
    resolved.sessionId,
    issued.sessionId,
  );

  assert.equal(
    resolved.actorId,
    "owner-772",
  );

  assert.equal(
    resolved.csrfTokenDigest,
    issued.csrfTokenDigest,
  );
});

check("revoked session is rejected by Postgres session resolver", async () => {
  const harness = makeHarness();

  const issued =
    await harness.lifecycle.issue(
      issueInput(),
    );

  await harness.lifecycle.revoke(
    revokeInput(
      issued.sessionId,
    ),
  );

  const resolver =
    createPostgresInternalPilotSessionResolver({
      tenantId: "tenant-a",
      now: () => new Date(fixedNow),
      query: async (
        text,
        values,
      ) => {
        const [
          tenantId,
          digest,
        ] = values;

        const row = [
          ...harness.records.values(),
        ].find(
          (candidate) =>
            candidate.tenant_id ===
              tenantId &&
            candidate.session_digest ===
              digest &&
            candidate.revoked_at ===
              null,
        );

        return {
          rows: row ? [row] : [],
          rowCount: row ? 1 : 0,
        };
      },
    });

  const resolved = await resolver({
    method: "POST",
    headers: {
      cookie:
        `${issued.cookieName}=${issued.sessionToken}`,
    },
    bodyText: "{}",
  });

  assert.equal(resolved, null);
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
