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
        fileName:
          filename,
        reportDiagnostics:
          true,
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
        .map(
          (diagnostic) =>
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
  revokeAuthenticatedTenantSession,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/authenticatedTenantSessionRevocation.ts",
  ),
);

const {
  signAuthenticatedTenantSessionToken,
  SQLiteAuthenticatedTenantSessionStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteAuthenticatedTenantSessionStore.ts",
  ),
);

const sessionSecret =
  "day-701-authenticated-session-secret";

function createClaims(
  overrides = {},
) {
  return {
    version: 1,
    keyId:
      "primary",
    sessionId:
      "session-701",
    tenantId:
      "tenant-a",
    actorId:
      "owner-a",
    role:
      "owner",
    issuedAt:
      "2026-07-11T13:00:00.000Z",
    expiresAt:
      "2026-07-11T21:00:00.000Z",
    ...overrides,
  };
}

async function createEnvironment(
  claimsOverrides = {},
) {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day701-",
      ),
    );

  const databasePath =
    path.join(
      directory,
      "runtime.sqlite",
    );

  const store =
    new SQLiteAuthenticatedTenantSessionStore(
      databasePath,
    );

  const claims =
    createClaims(
      claimsOverrides,
    );

  await store.createSession({
    ...claims,
    createdAt:
      claims.issuedAt,
  });

  const token =
    signAuthenticatedTenantSessionToken(
      claims,
      sessionSecret,
    );

  return {
    directory,
    databasePath,
    store,
    claims,
    token,
  };
}

async function cleanup(
  environment,
) {
  environment.store.close();

  await fsp.rm(
    environment.directory,
    {
      recursive: true,
      force: true,
    },
  );
}

test("valid bearer token revokes exactly one active durable session", async () => {
  const environment =
    await createEnvironment();

  try {
    const result =
      await revokeAuthenticatedTenantSession(
        environment.store,
        {
          token:
            environment.token,
          signingSecrets: {
            primary:
              sessionSecret,
          },
          now:
            "2026-07-11T13:10:00.000Z",
          maxClockSkewMs:
            300000,
        },
      );

    assert.equal(
      result.revoked,
      true,
    );

    assert.equal(
      result.sessionId,
      "session-701",
    );

    assert.equal(
      result.tenantId,
      "tenant-a",
    );

    assert.equal(
      result.actorId,
      "owner-a",
    );

    assert.equal(
      result.role,
      "owner",
    );

    assert.equal(
      result.revokedAt,
      "2026-07-11T13:10:00.000Z",
    );

    assert.equal(
      result.revocationReason,
      "SELF_LOGOUT",
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    const snapshot =
      await environment.store
        .readSnapshot();

    assert.equal(
      snapshot.length,
      1,
    );

    assert.equal(
      snapshot[0].revokedAt,
      "2026-07-11T13:10:00.000Z",
    );

    assert.equal(
      snapshot[0].revocationReason,
      "SELF_LOGOUT",
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("revoked session token cannot be used again", async () => {
  const environment =
    await createEnvironment();

  try {
    await revokeAuthenticatedTenantSession(
      environment.store,
      {
        token:
          environment.token,
        signingSecrets: {
          primary:
            sessionSecret,
        },
        now:
          "2026-07-11T13:10:00.000Z",
        maxClockSkewMs:
          300000,
      },
    );

    await assert.rejects(
      () =>
        environment.store
          .assertActiveSession(
            environment.claims,
            "2026-07-11T13:11:00.000Z",
          ),
      /session has been revoked/i,
    );

    await assert.rejects(
      () =>
        revokeAuthenticatedTenantSession(
          environment.store,
          {
            token:
              environment.token,
            signingSecrets: {
              primary:
                sessionSecret,
            },
            now:
              "2026-07-11T13:12:00.000Z",
            maxClockSkewMs:
              300000,
          },
        ),
      /session has been revoked/i,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("tampered token is rejected without mutating durable session state", async () => {
  const environment =
    await createEnvironment();

  try {
    const [
      encodedPayload,
      signature,
    ] = environment.token.split(".");

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

    await assert.rejects(
      () =>
        revokeAuthenticatedTenantSession(
          environment.store,
          {
            token:
              tamperedToken,
            signingSecrets: {
              primary:
                sessionSecret,
            },
            now:
              "2026-07-11T13:10:00.000Z",
            maxClockSkewMs:
              300000,
          },
        ),
      /signature verification failed/i,
    );

    const snapshot =
      await environment.store
        .readSnapshot();

    assert.equal(
      snapshot[0].revokedAt,
      null,
    );

    assert.equal(
      snapshot[0].revocationReason,
      null,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("expired token is rejected before durable revocation", async () => {
  const environment =
    await createEnvironment({
      expiresAt:
        "2026-07-11T13:05:00.000Z",
    });

  try {
    await assert.rejects(
      () =>
        revokeAuthenticatedTenantSession(
          environment.store,
          {
            token:
              environment.token,
            signingSecrets: {
              primary:
                sessionSecret,
            },
            now:
              "2026-07-11T13:10:00.000Z",
            maxClockSkewMs:
              300000,
          },
        ),
      /token has expired/i,
    );

    const snapshot =
      await environment.store
        .readSnapshot();

    assert.equal(
      snapshot[0].revokedAt,
      null,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("unknown signing key is rejected without session mutation", async () => {
  const environment =
    await createEnvironment();

  try {
    await assert.rejects(
      () =>
        revokeAuthenticatedTenantSession(
          environment.store,
          {
            token:
              environment.token,
            signingSecrets: {
              secondary:
                sessionSecret,
            },
            now:
              "2026-07-11T13:10:00.000Z",
            maxClockSkewMs:
              300000,
          },
        ),
      /signing key is unknown or disabled/i,
    );

    const snapshot =
      await environment.store
        .readSnapshot();

    assert.equal(
      snapshot[0].revokedAt,
      null,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("revocation survives SQLite store restart", async () => {
  const environment =
    await createEnvironment();

  try {
    await revokeAuthenticatedTenantSession(
      environment.store,
      {
        token:
          environment.token,
        signingSecrets: {
          primary:
            sessionSecret,
        },
        now:
          "2026-07-11T13:10:00.000Z",
        maxClockSkewMs:
          300000,
      },
    );

    environment.store.close();

    const restartedStore =
      new SQLiteAuthenticatedTenantSessionStore(
        environment.databasePath,
      );

    environment.store =
      restartedStore;

    await assert.rejects(
      () =>
        restartedStore
          .assertActiveSession(
            environment.claims,
            "2026-07-11T13:20:00.000Z",
          ),
      /session has been revoked/i,
    );

    const snapshot =
      await restartedStore
        .readSnapshot();

    assert.equal(
      snapshot[0].revokedAt,
      "2026-07-11T13:10:00.000Z",
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("invalid system-owner tenant context fails before durable revocation", async () => {
  const environment =
    await createEnvironment({
      sessionId:
        "system-session-701",
      tenantId:
        "tenant-a",
      actorId:
        "system-owner",
      role:
        "system_owner",
    });

  try {
    await assert.rejects(
      () =>
        revokeAuthenticatedTenantSession(
          environment.store,
          {
            token:
              environment.token,
            signingSecrets: {
              primary:
                sessionSecret,
            },
            now:
              "2026-07-11T13:10:00.000Z",
            maxClockSkewMs:
              300000,
          },
        ),
      /require system tenant context/i,
    );

    const snapshot =
      await environment.store
        .readSnapshot();

    assert.equal(
      snapshot[0].revokedAt,
      null,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("logout route is disabled by default, SQLite-only and never returns bearer token material", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/auth/session/revoke/route.ts",
      ),
      "utf8",
    );

  const bearerIndex =
    source.indexOf(
      "readBearerToken",
    );

  const storeIndex =
    source.indexOf(
      "new SQLiteAuthenticatedTenantSessionStore",
    );

  const revocationIndex =
    source.indexOf(
      "revokeAuthenticatedTenantSession",
      source.indexOf(
        "export async function POST",
      ),
    );

  assert.match(
    source,
    /NEXUS_AUTH_SESSION_REVOCATION_ENABLED/,
  );

  assert.match(
    source,
    /requires SQLite storage mode/,
  );

  assert.match(
    source,
    /NEXUS_AUTH_SESSION_SIGNING_SECRET/,
  );

  assert.match(
    source,
    /NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS/,
  );

  assert.ok(
    bearerIndex >= 0,
  );

  assert.ok(
    storeIndex >
      bearerIndex,
  );

  assert.ok(
    revocationIndex >
      storeIndex,
  );

  assert.match(
    source,
    /cache-control/,
  );

  assert.match(
    source,
    /pragma/,
  );

  assert.match(
    source,
    /liveProviderExecutionAuthorized/,
  );

  assert.doesNotMatch(
    source,
    /accessToken\s*:/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});

test("revocation service verifies token before active lookup and durable mutation", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/authenticatedTenantSessionRevocation.ts",
      ),
      "utf8",
    );

  const verificationIndex =
    source.indexOf(
      "verifyAuthenticatedTenantSessionToken",
      source.indexOf(
        "export async function revokeAuthenticatedTenantSession",
      ),
    );

  const contextIndex =
    source.indexOf(
      "assertAuthenticatedSessionMatchesGatewayContext",
      source.indexOf(
        "export async function revokeAuthenticatedTenantSession",
      ),
    );

  const activeLookupIndex =
    source.indexOf(
      "store.assertActiveSession",
    );

  const durableRevocationIndex =
    source.indexOf(
      "store.revokeSession",
    );

  assert.ok(
    verificationIndex >= 0,
  );

  assert.ok(
    contextIndex >
      verificationIndex,
  );

  assert.ok(
    activeLookupIndex >
      contextIndex,
  );

  assert.ok(
    durableRevocationIndex >
      activeLookupIndex,
  );

  assert.match(
    source,
    /SELF_LOGOUT/,
  );

  assert.match(
    source,
    /liveProviderExecutionAuthorized/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
