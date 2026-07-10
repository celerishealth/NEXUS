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
  SQLiteAuthenticatedPrincipalStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteAuthenticatedPrincipalStore.ts",
  ),
);

const {
  signAuthenticatedTenantSessionToken,
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteAuthenticatedTenantSessionStore.ts",
  ),
);

const {
  SQLiteTenantOwnerBootstrapStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteTenantOwnerBootstrap.ts",
  ),
);

const password =
  "Day703-Owner-Password!";

const sessionSecret =
  "day-703-session-secret";

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day703-",
      ),
    );

  const databasePath =
    path.join(
      directory,
      "runtime.sqlite",
    );

  const principalSchema =
    new SQLiteAuthenticatedPrincipalStore(
      databasePath,
    );

  principalSchema.close();

  const sessionSchema =
    new SQLiteAuthenticatedTenantSessionStore(
      databasePath,
    );

  sessionSchema.close();

  return {
    directory,
    databasePath,
    store:
      new SQLiteTenantOwnerBootstrapStore(
        databasePath,
      ),
  };
}

function bootstrapRequest(
  overrides = {},
) {
  const tenantId =
    overrides.tenantId ??
    "tenant-703";

  const actorId =
    overrides.actorId ??
    "owner-703";

  return {
    tenantId,
    tenantSlug:
      "acme-703",
    tenantDisplayName:
      "Acme Business",
    principalId:
      "principal-703",
    actorId,
    ownerEmail:
      "owner@example.com",
    ownerPassword:
      password,
    sessionClaims: {
      version: 1,
      keyId:
        "primary",
      sessionId:
        "session-703",
      tenantId,
      actorId,
      role:
        "owner",
      issuedAt:
        "2026-07-11T15:00:00.000Z",
      expiresAt:
        "2026-07-11T23:00:00.000Z",
    },
    createdAt:
      "2026-07-11T15:00:00.000Z",
    ...overrides,
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

test("one atomic onboarding creates tenant, owner credential and active session", async () => {
  const environment =
    await createEnvironment();

  try {
    const request =
      bootstrapRequest();

    const result =
      await environment.store
        .bootstrapTenantOwner(
          request,
        );

    assert.equal(
      result.tenant.tenantId,
      "tenant-703",
    );

    assert.equal(
      result.tenant.tenantSlug,
      "acme-703",
    );

    assert.equal(
      result.tenant.status,
      "active",
    );

    assert.equal(
      result.tenant.onboardingState,
      "OWNER_SESSION_READY",
    );

    assert.equal(
      result.owner.actorId,
      "owner-703",
    );

    assert.equal(
      result.owner.role,
      "owner",
    );

    assert.equal(
      result.owner.credentialVersion,
      1,
    );

    assert.equal(
      result.session.sessionId,
      "session-703",
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      const tenantCount =
        database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_tenants
          `)
          .get().count;

      const principalCount =
        database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_authenticated_principals
          `)
          .get().count;

      const sessionCount =
        database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_authenticated_sessions
          `)
          .get().count;

      assert.equal(
        tenantCount,
        1,
      );

      assert.equal(
        principalCount,
        1,
      );

      assert.equal(
        sessionCount,
        1,
      );

      const credential =
        database
          .prepare(`
            SELECT
              password_salt_hex,
              password_hash_hex
            FROM nexus_authenticated_principals
          `)
          .get();

      assert.match(
        credential.password_salt_hex,
        /^[a-f0-9]{32}$/,
      );

      assert.match(
        credential.password_hash_hex,
        /^[a-f0-9]{64}$/,
      );

      assert.notEqual(
        credential.password_hash_hex,
        password,
      );
    } finally {
      database.close();
    }
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("onboarding session token authenticates only the created tenant owner", async () => {
  const environment =
    await createEnvironment();

  try {
    const request =
      bootstrapRequest();

    await environment.store
      .bootstrapTenantOwner(
        request,
      );

    const token =
      signAuthenticatedTenantSessionToken(
        request.sessionClaims,
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
            "2026-07-11T15:10:00.000Z",
          maxClockSkewMs:
            300000,
        },
      );

    assert.equal(
      verified.tenantId,
      "tenant-703",
    );

    assert.equal(
      verified.actorId,
      "owner-703",
    );

    assert.equal(
      verified.role,
      "owner",
    );

    const sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        environment.databasePath,
      );

    try {
      const durable =
        await sessionStore
          .assertActiveSession(
            verified,
            "2026-07-11T15:10:00.000Z",
          );

      assert.equal(
        durable.sessionId,
        "session-703",
      );
    } finally {
      sessionStore.close();
    }
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("duplicate tenant slug fails without creating partial owner or session state", async () => {
  const environment =
    await createEnvironment();

  try {
    await environment.store
      .bootstrapTenantOwner(
        bootstrapRequest(),
      );

    await assert.rejects(
      () =>
        environment.store
          .bootstrapTenantOwner(
            bootstrapRequest({
              tenantId:
                "tenant-703-b",
              principalId:
                "principal-703-b",
              actorId:
                "owner-703-b",
              ownerEmail:
                "owner-b@example.com",
              sessionClaims: {
                version: 1,
                keyId:
                  "primary",
                sessionId:
                  "session-703-b",
                tenantId:
                  "tenant-703-b",
                actorId:
                  "owner-703-b",
                role:
                  "owner",
                issuedAt:
                  "2026-07-11T15:01:00.000Z",
                expiresAt:
                  "2026-07-11T23:01:00.000Z",
              },
            }),
          ),
      /tenant.*already exists/i,
    );

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      assert.equal(
        database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_tenants
          `)
          .get().count,
        1,
      );

      assert.equal(
        database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_authenticated_principals
          `)
          .get().count,
        1,
      );

      assert.equal(
        database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_authenticated_sessions
          `)
          .get().count,
        1,
      );
    } finally {
      database.close();
    }
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("mismatched session identity fails before any onboarding mutation", async () => {
  const environment =
    await createEnvironment();

  try {
    await assert.rejects(
      () =>
        environment.store
          .bootstrapTenantOwner(
            bootstrapRequest({
              sessionClaims: {
                version: 1,
                keyId:
                  "primary",
                sessionId:
                  "session-703",
                tenantId:
                  "another-tenant",
                actorId:
                  "owner-703",
                role:
                  "owner",
                issuedAt:
                  "2026-07-11T15:00:00.000Z",
                expiresAt:
                  "2026-07-11T23:00:00.000Z",
              },
            }),
          ),
      /must match the new tenant owner exactly/i,
    );

    const tenants =
      await environment.store
        .readTenantSnapshot();

    assert.equal(
      tenants.length,
      0,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("tenant, owner and session survive SQLite restart together", async () => {
  const environment =
    await createEnvironment();

  try {
    await environment.store
      .bootstrapTenantOwner(
        bootstrapRequest(),
      );

    environment.store.close();

    environment.store =
      new SQLiteTenantOwnerBootstrapStore(
        environment.databasePath,
      );

    const tenants =
      await environment.store
        .readTenantSnapshot();

    assert.equal(
      tenants.length,
      1,
    );

    assert.equal(
      tenants[0].tenantId,
      "tenant-703",
    );

    const principalStore =
      new SQLiteAuthenticatedPrincipalStore(
        environment.databasePath,
      );

    const sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        environment.databasePath,
      );

    try {
      const principals =
        await principalStore
          .readSnapshot();

      const sessions =
        await sessionStore
          .readSnapshot();

      assert.equal(
        principals.length,
        1,
      );

      assert.equal(
        principals[0].tenantId,
        "tenant-703",
      );

      assert.equal(
        sessions.length,
        1,
      );

      assert.equal(
        sessions[0].tenantId,
        "tenant-703",
      );
    } finally {
      principalStore.close();
      sessionStore.close();
    }
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("onboarding route is secret-controlled, disabled by default and issues session only after atomic creation", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/onboarding/tenant/route.ts",
      ),
      "utf8",
    );

  const postIndex =
    source.indexOf(
      "export async function POST",
    );

  const authorizationIndex =
    source.indexOf(
      "assertOnboardingAuthorization",
      postIndex,
    );

  const bootstrapIndex =
    source.indexOf(
      "bootstrapTenantOwner",
      postIndex,
    );

  const signingIndex =
    source.indexOf(
      "signAuthenticatedTenantSessionToken",
      postIndex,
    );

  assert.match(
    source,
    /NEXUS_TENANT_ONBOARDING_ENABLED/,
  );

  assert.match(
    source,
    /NEXUS_TENANT_ONBOARDING_SECRET/,
  );

  assert.match(
    source,
    /x-nexus-onboarding-secret/,
  );

  assert.match(
    source,
    /timingSafeEqual/,
  );

  assert.match(
    source,
    /requires SQLite storage mode/,
  );

  assert.ok(
    authorizationIndex >
      postIndex,
  );

  assert.ok(
    bootstrapIndex >
      authorizationIndex,
  );

  assert.ok(
    signingIndex >
      bootstrapIndex,
  );

  assert.match(
    source,
    /publicSignupAuthorized/,
  );

  assert.match(
    source,
    /liveProviderExecutionAuthorized/,
  );

  assert.match(
    source,
    /cache-control/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});

test("tenant bootstrap uses one transaction and stores no plaintext password", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/sqliteTenantOwnerBootstrap.ts",
      ),
      "utf8",
    );

  const methodIndex =
    source.indexOf(
      "async bootstrapTenantOwner",
    );

  const beginIndex =
    source.indexOf(
      "BEGIN IMMEDIATE",
      methodIndex,
    );

  const tenantInsertIndex =
    source.indexOf(
      "INSERT INTO nexus_tenants",
      methodIndex,
    );

  const principalInsertIndex =
    source.indexOf(
      "INSERT INTO nexus_authenticated_principals",
      methodIndex,
    );

  const sessionInsertIndex =
    source.indexOf(
      "INSERT INTO nexus_authenticated_sessions",
      methodIndex,
    );

  const commitIndex =
    source.indexOf(
      '"COMMIT"',
      sessionInsertIndex,
    );

  assert.ok(
    beginIndex >
      methodIndex,
  );

  assert.ok(
    tenantInsertIndex >
      beginIndex,
  );

  assert.ok(
    principalInsertIndex >
      tenantInsertIndex,
  );

  assert.ok(
    sessionInsertIndex >
      principalInsertIndex,
  );

  assert.ok(
    commitIndex >
      sessionInsertIndex,
  );

  assert.match(
    source,
    /scryptSync/,
  );

  assert.match(
    source,
    /randomBytes/,
  );

  assert.doesNotMatch(
    source,
    /owner_password\s+TEXT|password_plaintext/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
