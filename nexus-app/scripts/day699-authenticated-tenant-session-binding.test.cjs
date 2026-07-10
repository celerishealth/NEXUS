const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

require.extensions[".ts"] =
  function compileTypeScript(
    module,
    filename,
  ) {
    const source =
      fs.readFileSync(
        filename,
        "utf8",
      );

    const output =
      ts.transpileModule(source, {
        compilerOptions: {
          target:
            ts.ScriptTarget.ES2022,
          module:
            ts.ModuleKind.CommonJS,
          strict: true,
          esModuleInterop: true,
          moduleResolution:
            ts.ModuleResolutionKind.NodeJs,
        },
        fileName: filename,
        reportDiagnostics: true,
      });

    const errors = (
      output.diagnostics || []
    ).filter(
      (diagnostic) =>
        diagnostic.category ===
        ts.DiagnosticCategory.Error,
    );

    assert.equal(
      errors.length,
      0,
      errors
        .map((diagnostic) =>
          ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            "\n",
          ),
        )
        .join("\n"),
    );

    module._compile(
      output.outputText,
      filename,
    );
  };

const {
  assertAuthenticatedSessionMatchesGatewayContext,
  signAuthenticatedTenantSessionToken,
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteAuthenticatedTenantSessionStore.ts",
  ),
);

const sessionSecret =
  "day-699-authenticated-session-secret";

function createClaims(
  overrides = {},
) {
  return {
    version: 1,
    keyId: "primary",
    sessionId: "session-699",
    tenantId: "tenant-a",
    actorId: "owner-a",
    role: "owner",
    issuedAt:
      "2026-07-11T11:00:00.000Z",
    expiresAt:
      "2026-07-11T12:00:00.000Z",
    ...overrides,
  };
}

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day699-",
      ),
    );

  const databasePath =
    path.join(
      directory,
      "runtime.sqlite",
    );

  return {
    directory,
    databasePath,
    store:
      new SQLiteAuthenticatedTenantSessionStore(
        databasePath,
      ),
  };
}

async function persistClaims(
  store,
  claims,
) {
  return store.createSession({
    ...claims,
    createdAt:
      "2026-07-11T11:00:00.000Z",
  });
}

test("signed token and durable SQLite session authenticate one exact tenant principal", async () => {
  const environment =
    await createEnvironment();

  try {
    const claims =
      createClaims();

    await persistClaims(
      environment.store,
      claims,
    );

    const token =
      signAuthenticatedTenantSessionToken(
        claims,
        sessionSecret,
      );

    const verified =
      verifyAuthenticatedTenantSessionToken(
        token,
        {
          primary:
            sessionSecret,
        },
        {
          now:
            "2026-07-11T11:10:00.000Z",
          maxClockSkewMs:
            300000,
        },
      );

    const durable =
      await environment.store
        .assertActiveSession(
          verified,
          "2026-07-11T11:10:00.000Z",
        );

    assert.equal(
      durable.sessionId,
      "session-699",
    );

    assert.equal(
      durable.tenantId,
      "tenant-a",
    );

    assert.equal(
      durable.actorId,
      "owner-a",
    );

    assert.equal(
      durable.role,
      "owner",
    );

    assertAuthenticatedSessionMatchesGatewayContext(
      verified,
      {
        tenantId: "tenant-a",
        actorId: "owner-a",
        role: "owner",
      },
    );
  } finally {
    environment.store.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("token tampering invalidates the authenticated session signature", () => {
  const claims =
    createClaims();

  const token =
    signAuthenticatedTenantSessionToken(
      claims,
      sessionSecret,
    );

  const [
    encodedPayload,
    signature,
  ] = token.split(".");

  const payload =
    JSON.parse(
      Buffer.from(
        encodedPayload,
        "base64url",
      ).toString("utf8"),
    );

  payload.tenantId =
    "tenant-b";

  const tamperedToken =
    `${Buffer.from(
      JSON.stringify(payload),
      "utf8",
    ).toString("base64url")}.${signature}`;

  assert.throws(
    () =>
      verifyAuthenticatedTenantSessionToken(
        tamperedToken,
        {
          primary:
            sessionSecret,
        },
        {
          now:
            "2026-07-11T11:10:00.000Z",
          maxClockSkewMs:
            300000,
        },
      ),
    /signature verification failed/i,
  );
});

test("expired session token fails before durable command execution", () => {
  const token =
    signAuthenticatedTenantSessionToken(
      createClaims(),
      sessionSecret,
    );

  assert.throws(
    () =>
      verifyAuthenticatedTenantSessionToken(
        token,
        {
          primary:
            sessionSecret,
        },
        {
          now:
            "2026-07-11T12:00:00.000Z",
          maxClockSkewMs:
            300000,
        },
      ),
    /token has expired/i,
  );
});

test("validly signed token without a durable session record fails closed", async () => {
  const environment =
    await createEnvironment();

  try {
    const claims =
      createClaims({
        sessionId:
          "missing-session-699",
      });

    const token =
      signAuthenticatedTenantSessionToken(
        claims,
        sessionSecret,
      );

    const verified =
      verifyAuthenticatedTenantSessionToken(
        token,
        {
          primary:
            sessionSecret,
        },
        {
          now:
            "2026-07-11T11:10:00.000Z",
          maxClockSkewMs:
            300000,
        },
      );

    await assert.rejects(
      () =>
        environment.store
          .assertActiveSession(
            verified,
            "2026-07-11T11:10:00.000Z",
          ),
      /not found in durable storage/i,
    );
  } finally {
    environment.store.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("revocation survives restart and blocks an otherwise valid signed token", async () => {
  const environment =
    await createEnvironment();

  try {
    const claims =
      createClaims({
        sessionId:
          "revoked-session-699",
      });

    await persistClaims(
      environment.store,
      claims,
    );

    await environment.store
      .revokeSession({
        sessionId:
          claims.sessionId,
        reason:
          "OWNER_REVOKED_ACCESS",
        revokedAt:
          "2026-07-11T11:20:00.000Z",
      });

    environment.store.close();

    const restartedStore =
      new SQLiteAuthenticatedTenantSessionStore(
        environment.databasePath,
      );

    try {
      await assert.rejects(
        () =>
          restartedStore
            .assertActiveSession(
              claims,
              "2026-07-11T11:30:00.000Z",
            ),
        /session has been revoked/i,
      );
    } finally {
      restartedStore.close();
    }
  } finally {
    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("authenticated principal cannot cross tenant, actor or role boundaries", () => {
  const claims =
    createClaims();

  assert.throws(
    () =>
      assertAuthenticatedSessionMatchesGatewayContext(
        claims,
        {
          tenantId: "tenant-b",
          actorId: "owner-a",
          role: "owner",
        },
      ),
    /tenant does not match/i,
  );

  assert.throws(
    () =>
      assertAuthenticatedSessionMatchesGatewayContext(
        claims,
        {
          tenantId: "tenant-a",
          actorId: "owner-b",
          role: "owner",
        },
      ),
    /actor does not match/i,
  );

  assert.throws(
    () =>
      assertAuthenticatedSessionMatchesGatewayContext(
        claims,
        {
          tenantId: "tenant-a",
          actorId: "owner-a",
          role: "worker",
        },
      ),
    /role does not match/i,
  );
});

test("exact session creation replay is idempotent and conflicting reuse fails", async () => {
  const environment =
    await createEnvironment();

  try {
    const claims =
      createClaims();

    const first =
      await persistClaims(
        environment.store,
        claims,
      );

    const replay =
      await persistClaims(
        environment.store,
        claims,
      );

    assert.deepEqual(
      replay,
      first,
    );

    const snapshot =
      await environment.store
        .readSnapshot();

    assert.equal(
      snapshot.length,
      1,
    );

    await assert.rejects(
      () =>
        persistClaims(
          environment.store,
          {
            ...claims,
            tenantId:
              "tenant-b",
          },
        ),
      /conflicts with another durable session/i,
    );
  } finally {
    environment.store.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("system-owner session is restricted to the system tenant", () => {
  assert.throws(
    () =>
      assertAuthenticatedSessionMatchesGatewayContext(
        createClaims({
          tenantId:
            "tenant-a",
          actorId:
            "system-owner",
          role:
            "system_owner",
        }),
        {
          tenantId:
            "tenant-a",
          actorId:
            "system-owner",
          role:
            "system_owner",
        },
      ),
    /require system tenant context/i,
  );

  assert.doesNotThrow(
    () =>
      assertAuthenticatedSessionMatchesGatewayContext(
        createClaims({
          tenantId:
            "__system__",
          actorId:
            "system-owner",
          role:
            "system_owner",
        }),
        {
          tenantId:
            "__system__",
          actorId:
            "system-owner",
          role:
            "system_owner",
        },
      ),
  );
});

test("command route authenticates durable principal before readiness and journal execution", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/internal/controlled-actions/route.ts",
      ),
      "utf8",
    );

  const envelopeIndex =
    source.indexOf(
      "verifySignedControlledActionGatewayEnvelope",
    );

  const tokenIndex =
    source.indexOf(
      "verifyAuthenticatedTenantSessionToken",
    );

  const durableSessionIndex =
    source.indexOf(
      "sessionStore.assertActiveSession",
    );

  const identityBindingIndex =
    source.indexOf(
      "assertAuthenticatedSessionMatchesGatewayContext",
    );

  const readinessIndex =
    source.indexOf(
      "readinessGate.assertOpen",
    );

  const journalIndex =
    source.indexOf(
      "outcomeJournal.begin",
    );

  assert.ok(
    envelopeIndex >= 0,
  );

  assert.ok(
    tokenIndex >
      envelopeIndex,
  );

  assert.ok(
    durableSessionIndex >
      tokenIndex,
  );

  assert.ok(
    identityBindingIndex >
      durableSessionIndex,
  );

  assert.ok(
    readinessIndex >
      identityBindingIndex,
  );

  assert.ok(
    journalIndex >
      readinessIndex,
  );

  assert.match(
    source,
    /NEXUS_AUTH_SESSION_SIGNING_SECRET/,
  );

  assert.match(
    source,
    /authorization/,
  );

  assert.match(
    source,
    /requires SQLite storage mode/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});

test("session store is transactional, revocable and provider-free", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/sqliteAuthenticatedTenantSessionStore.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /BEGIN IMMEDIATE/,
  );

  assert.match(
    source,
    /nexus_authenticated_sessions/,
  );

  assert.match(
    source,
    /revoked_at/,
  );

  assert.match(
    source,
    /timingSafeEqual/,
  );

  assert.match(
    source,
    /assertAuthenticatedSessionMatchesGatewayContext/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
