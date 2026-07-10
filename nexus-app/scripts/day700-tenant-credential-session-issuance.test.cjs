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
  DatabaseSync,
} = require("node:sqlite");

const {
  AuthenticatedPrincipalAuthenticationError,
  AuthenticatedPrincipalLockedError,
  SQLiteAuthenticatedPrincipalStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteAuthenticatedPrincipalStore.ts",
  ),
);

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

const password =
  "Day700-Strong-Password!";

const sessionSecret =
  "day-700-session-signing-secret";

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day700-",
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
    principalStore:
      new SQLiteAuthenticatedPrincipalStore(
        databasePath,
      ),
    sessionStore:
      new SQLiteAuthenticatedTenantSessionStore(
        databasePath,
      ),
  };
}

function principalRequest(
  overrides = {},
) {
  return {
    principalId:
      "principal-700",
    tenantId:
      "tenant-a",
    actorId:
      "owner-a",
    role:
      "owner",
    email:
      "owner@example.com",
    password,
    createdAt:
      "2026-07-11T12:00:00.000Z",
    ...overrides,
  };
}

async function createPrincipal(
  store,
  overrides = {},
) {
  return store.createPrincipal(
    principalRequest(
      overrides,
    ),
  );
}

test("password credential is stored as salted scrypt evidence and never as plaintext", async () => {
  const environment =
    await createEnvironment();

  try {
    const principal =
      await createPrincipal(
        environment.principalStore,
      );

    assert.equal(
      principal.emailNormalized,
      "owner@example.com",
    );

    assert.equal(
      principal.status,
      "active",
    );

    assert.equal(
      principal.credentialVersion,
      1,
    );

    assert.equal(
      Object.prototype.hasOwnProperty.call(
        principal,
        "passwordHashHex",
      ),
      false,
    );

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      const row =
        database
          .prepare(`
            SELECT
              password_salt_hex,
              password_hash_hex
            FROM nexus_authenticated_principals
            WHERE principal_id = ?
          `)
          .get(
            "principal-700",
          );

      assert.match(
        row.password_salt_hex,
        /^[a-f0-9]{32}$/,
      );

      assert.match(
        row.password_hash_hex,
        /^[a-f0-9]{64}$/,
      );

      assert.notEqual(
        row.password_hash_hex,
        password,
      );

      assert.notEqual(
        row.password_salt_hex,
        password,
      );
    } finally {
      database.close();
    }
  } finally {
    environment.sessionStore.close();
    environment.principalStore.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("successful tenant login creates one durable signed session bound to the authenticated principal", async () => {
  const environment =
    await createEnvironment();

  try {
    await createPrincipal(
      environment.principalStore,
    );

    const authenticated =
      await environment
        .principalStore
        .authenticate({
          tenantId:
            "tenant-a",
          email:
            "OWNER@EXAMPLE.COM",
          password,
          authenticatedAt:
            "2026-07-11T12:05:00.000Z",
        });

    const claims = {
      version: 1,
      keyId:
        "primary",
      sessionId:
        "session-700",
      tenantId:
        authenticated.tenantId,
      actorId:
        authenticated.actorId,
      role:
        authenticated.role,
      issuedAt:
        "2026-07-11T12:05:00.000Z",
      expiresAt:
        "2026-07-11T20:05:00.000Z",
    };

    await environment
      .sessionStore
      .createSession({
        ...claims,
        createdAt:
          claims.issuedAt,
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
            "2026-07-11T12:10:00.000Z",
          maxClockSkewMs:
            300000,
        },
      );

    const durableSession =
      await environment
        .sessionStore
        .assertActiveSession(
          verified,
          "2026-07-11T12:10:00.000Z",
        );

    assert.equal(
      durableSession.tenantId,
      "tenant-a",
    );

    assert.equal(
      durableSession.actorId,
      "owner-a",
    );

    assert.equal(
      durableSession.role,
      "owner",
    );

    assertAuthenticatedSessionMatchesGatewayContext(
      verified,
      {
        tenantId:
          "tenant-a",
        actorId:
          "owner-a",
        role:
          "owner",
      },
    );
  } finally {
    environment.sessionStore.close();
    environment.principalStore.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("wrong passwords increment durable failures and trigger bounded lockout", async () => {
  const environment =
    await createEnvironment();

  try {
    await createPrincipal(
      environment.principalStore,
    );

    for (
      let attempt = 1;
      attempt <= 4;
      attempt += 1
    ) {
      await assert.rejects(
        () =>
          environment
            .principalStore
            .authenticate({
              tenantId:
                "tenant-a",
              email:
                "owner@example.com",
              password:
                "Incorrect-Password-700!",
              authenticatedAt:
                `2026-07-11T12:0${attempt}:00.000Z`,
            }),
        (error) => {
          assert.ok(
            error instanceof
              AuthenticatedPrincipalAuthenticationError,
          );

          return true;
        },
      );
    }

    await assert.rejects(
      () =>
        environment
          .principalStore
          .authenticate({
            tenantId:
              "tenant-a",
            email:
              "owner@example.com",
            password:
              "Incorrect-Password-700!",
            authenticatedAt:
              "2026-07-11T12:05:00.000Z",
          }),
      (error) => {
        assert.ok(
          error instanceof
            AuthenticatedPrincipalLockedError,
        );

        assert.equal(
          error.lockedUntil,
          "2026-07-11T12:20:00.000Z",
        );

        return true;
      },
    );

    const snapshot =
      await environment
        .principalStore
        .readSnapshot();

    assert.equal(
      snapshot[0].failedAttemptCount,
      5,
    );

    assert.equal(
      snapshot[0].lockedUntil,
      "2026-07-11T12:20:00.000Z",
    );

    await assert.rejects(
      () =>
        environment
          .principalStore
          .authenticate({
            tenantId:
              "tenant-a",
            email:
              "owner@example.com",
            password,
            authenticatedAt:
              "2026-07-11T12:10:00.000Z",
          }),
      AuthenticatedPrincipalLockedError,
    );

    const recovered =
      await environment
        .principalStore
        .authenticate({
          tenantId:
            "tenant-a",
          email:
            "owner@example.com",
          password,
          authenticatedAt:
            "2026-07-11T12:21:00.000Z",
        });

    assert.equal(
      recovered.failedAttemptCount,
      0,
    );

    assert.equal(
      recovered.lockedUntil,
      null,
    );
  } finally {
    environment.sessionStore.close();
    environment.principalStore.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("disabled principal cannot authenticate with a correct password", async () => {
  const environment =
    await createEnvironment();

  try {
    await createPrincipal(
      environment.principalStore,
    );

    const disabled =
      await environment
        .principalStore
        .disablePrincipal({
          principalId:
            "principal-700",
          reason:
            "OWNER_DISABLED_ACCOUNT",
          disabledAt:
            "2026-07-11T12:10:00.000Z",
        });

    assert.equal(
      disabled.status,
      "disabled",
    );

    await assert.rejects(
      () =>
        environment
          .principalStore
          .authenticate({
            tenantId:
              "tenant-a",
            email:
              "owner@example.com",
            password,
            authenticatedAt:
              "2026-07-11T12:11:00.000Z",
          }),
      AuthenticatedPrincipalAuthenticationError,
    );
  } finally {
    environment.sessionStore.close();
    environment.principalStore.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("tenant identity is mandatory during credential lookup", async () => {
  const environment =
    await createEnvironment();

  try {
    await createPrincipal(
      environment.principalStore,
      {
        principalId:
          "tenant-a-principal-700",
        tenantId:
          "tenant-a",
        actorId:
          "tenant-a-owner",
      },
    );

    await createPrincipal(
      environment.principalStore,
      {
        principalId:
          "tenant-b-principal-700",
        tenantId:
          "tenant-b",
        actorId:
          "tenant-b-owner",
        password:
          "Tenant-B-Password-700!",
      },
    );

    const tenantA =
      await environment
        .principalStore
        .authenticate({
          tenantId:
            "tenant-a",
          email:
            "owner@example.com",
          password,
          authenticatedAt:
            "2026-07-11T12:10:00.000Z",
        });

    const tenantB =
      await environment
        .principalStore
        .authenticate({
          tenantId:
            "tenant-b",
          email:
            "owner@example.com",
          password:
            "Tenant-B-Password-700!",
          authenticatedAt:
            "2026-07-11T12:10:00.000Z",
        });

    assert.equal(
      tenantA.actorId,
      "tenant-a-owner",
    );

    assert.equal(
      tenantB.actorId,
      "tenant-b-owner",
    );

    await assert.rejects(
      () =>
        environment
          .principalStore
          .authenticate({
            tenantId:
              "tenant-b",
            email:
              "owner@example.com",
            password,
            authenticatedAt:
              "2026-07-11T12:11:00.000Z",
          }),
      AuthenticatedPrincipalAuthenticationError,
    );
  } finally {
    environment.sessionStore.close();
    environment.principalStore.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("principal identities and tenant emails cannot be reused ambiguously", async () => {
  const environment =
    await createEnvironment();

  try {
    await createPrincipal(
      environment.principalStore,
    );

    await assert.rejects(
      () =>
        createPrincipal(
          environment.principalStore,
          {
            principalId:
              "different-principal-700",
            actorId:
              "different-owner-700",
          },
        ),
      /email conflicts/i,
    );

    await assert.rejects(
      () =>
        createPrincipal(
          environment.principalStore,
          {
            principalId:
              "different-principal-700",
            email:
              "different@example.com",
          },
        ),
      /actor.*conflicts|identity.*conflicts/i,
    );
  } finally {
    environment.sessionStore.close();
    environment.principalStore.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("login route is disabled by default and issues sessions only from authenticated SQLite principals", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/auth/session/route.ts",
      ),
      "utf8",
    );

  const authenticationIndex =
    source.indexOf(
      "principalStore.authenticate",
    );

  const sessionCreationIndex =
    source.indexOf(
      "sessionStore.createSession",
    );

  const signingIndex =
    source.indexOf(
      "signAuthenticatedTenantSessionToken",
    );

  assert.match(
    source,
    /NEXUS_AUTH_SESSION_ISSUANCE_ENABLED/,
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
    /NEXUS_AUTH_SESSION_DURATION_MS/,
  );

  assert.ok(
    authenticationIndex >= 0,
  );

  assert.ok(
    sessionCreationIndex >
      authenticationIndex,
  );

  assert.ok(
    signingIndex >
      sessionCreationIndex,
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
    /\bfetch\s*\(/,
  );
});

test("credential store uses scrypt, timing-safe comparison, transactions and no provider execution", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/sqliteAuthenticatedPrincipalStore.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /scryptSync/,
  );

  assert.match(
    source,
    /randomBytes/,
  );

  assert.match(
    source,
    /timingSafeEqual/,
  );

  assert.match(
    source,
    /BEGIN IMMEDIATE/,
  );

  assert.match(
    source,
    /failed_attempt_count/,
  );

  assert.match(
    source,
    /locked_until/,
  );

  assert.match(
    source,
    /nexus_authenticated_principals/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
