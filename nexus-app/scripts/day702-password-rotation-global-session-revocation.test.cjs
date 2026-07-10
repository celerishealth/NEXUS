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
  AuthenticatedCredentialRotationError,
  rotateAuthenticatedPrincipalCredentialAndRevokeSessions,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/authenticatedPrincipalCredentialRotation.ts",
  ),
);

const {
  AuthenticatedPrincipalAuthenticationError,
  SQLiteAuthenticatedPrincipalStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteAuthenticatedPrincipalStore.ts",
  ),
);

const {
  SQLiteAuthenticatedTenantSessionStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteAuthenticatedTenantSessionStore.ts",
  ),
);

const currentPassword =
  "Day702-Current-Password!";

const newPassword =
  "Day702-New-Password-Secure!";

function createClaims(
  sessionId,
  overrides = {},
) {
  return {
    version: 1,
    keyId:
      "primary",
    sessionId,
    tenantId:
      "tenant-a",
    actorId:
      "owner-a",
    role:
      "owner",
    issuedAt:
      "2026-07-11T14:00:00.000Z",
    expiresAt:
      "2026-07-11T22:00:00.000Z",
    ...overrides,
  };
}

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day702-",
      ),
    );

  const databasePath =
    path.join(
      directory,
      "runtime.sqlite",
    );

  const principalStore =
    new SQLiteAuthenticatedPrincipalStore(
      databasePath,
    );

  const sessionStore =
    new SQLiteAuthenticatedTenantSessionStore(
      databasePath,
    );

  await principalStore.createPrincipal({
    principalId:
      "principal-702",
    tenantId:
      "tenant-a",
    actorId:
      "owner-a",
    role:
      "owner",
    email:
      "owner@example.com",
    password:
      currentPassword,
    createdAt:
      "2026-07-11T14:00:00.000Z",
  });

  const sessionA =
    createClaims(
      "session-a-702",
    );

  const sessionB =
    createClaims(
      "session-b-702",
      {
        issuedAt:
          "2026-07-11T14:01:00.000Z",
      },
    );

  await sessionStore.createSession({
    ...sessionA,
    createdAt:
      sessionA.issuedAt,
  });

  await sessionStore.createSession({
    ...sessionB,
    createdAt:
      sessionB.issuedAt,
  });

  return {
    directory,
    databasePath,
    principalStore,
    sessionStore,
    sessionA,
    sessionB,
  };
}

async function cleanup(
  environment,
) {
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

test("password rotation increments credential version and revokes every active principal session", async () => {
  const environment =
    await createEnvironment();

  try {
    const result =
      await rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
        databasePath:
          environment.databasePath,
        claims:
          environment.sessionA,
        currentPassword,
        newPassword,
        changedAt:
          "2026-07-11T14:10:00.000Z",
      });

    assert.equal(
      result.passwordChanged,
      true,
    );

    assert.equal(
      result.credentialVersion,
      2,
    );

    assert.equal(
      result.sessionsRevoked,
      2,
    );

    assert.equal(
      result.reauthenticationRequired,
      true,
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    const sessions =
      await environment.sessionStore
        .readSnapshot();

    assert.equal(
      sessions.length,
      2,
    );

    for (
      const session
      of sessions
    ) {
      assert.equal(
        session.revokedAt,
        "2026-07-11T14:10:00.000Z",
      );

      assert.equal(
        session.revocationReason,
        "CREDENTIAL_ROTATED",
      );
    }

    await assert.rejects(
      () =>
        environment.principalStore
          .authenticate({
            tenantId:
              "tenant-a",
            email:
              "owner@example.com",
            password:
              currentPassword,
            authenticatedAt:
              "2026-07-11T14:11:00.000Z",
          }),
      AuthenticatedPrincipalAuthenticationError,
    );

    const authenticated =
      await environment.principalStore
        .authenticate({
          tenantId:
            "tenant-a",
          email:
            "owner@example.com",
          password:
            newPassword,
          authenticatedAt:
            "2026-07-11T14:12:00.000Z",
        });

    assert.equal(
      authenticated.credentialVersion,
      2,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("incorrect current password rolls back principal and session mutations", async () => {
  const environment =
    await createEnvironment();

  try {
    await assert.rejects(
      () =>
        rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
          databasePath:
            environment.databasePath,
          claims:
            environment.sessionA,
          currentPassword:
            "Day702-Incorrect-Password!",
          newPassword,
          changedAt:
            "2026-07-11T14:10:00.000Z",
        }),
      AuthenticatedCredentialRotationError,
    );

    const sessions =
      await environment.sessionStore
        .readSnapshot();

    assert.equal(
      sessions.every(
        (session) =>
          session.revokedAt === null,
      ),
      true,
    );

    const authenticated =
      await environment.principalStore
        .authenticate({
          tenantId:
            "tenant-a",
          email:
            "owner@example.com",
          password:
            currentPassword,
          authenticatedAt:
            "2026-07-11T14:11:00.000Z",
        });

    assert.equal(
      authenticated.credentialVersion,
      1,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("new password cannot equal the current password", async () => {
  const environment =
    await createEnvironment();

  try {
    await assert.rejects(
      () =>
        rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
          databasePath:
            environment.databasePath,
          claims:
            environment.sessionA,
          currentPassword,
          newPassword:
            currentPassword,
          changedAt:
            "2026-07-11T14:10:00.000Z",
        }),
      /must be different/i,
    );

    const sessions =
      await environment.sessionStore
        .readSnapshot();

    assert.equal(
      sessions.every(
        (session) =>
          session.revokedAt === null,
      ),
      true,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("revoked current session cannot rotate credentials even when another session remains active", async () => {
  const environment =
    await createEnvironment();

  try {
    await environment.sessionStore
      .revokeSession({
        sessionId:
          environment.sessionA.sessionId,
        reason:
          "SELF_LOGOUT",
        revokedAt:
          "2026-07-11T14:05:00.000Z",
      });

    await assert.rejects(
      () =>
        rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
          databasePath:
            environment.databasePath,
          claims:
            environment.sessionA,
          currentPassword,
          newPassword,
          changedAt:
            "2026-07-11T14:10:00.000Z",
        }),
      AuthenticatedCredentialRotationError,
    );

    const sessions =
      await environment.sessionStore
        .readSnapshot();

    const sessionB =
      sessions.find(
        (session) =>
          session.sessionId ===
          environment.sessionB.sessionId,
      );

    assert.equal(
      sessionB.revokedAt,
      null,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("credential rotation cannot cross tenant or actor boundaries", async () => {
  const environment =
    await createEnvironment();

  try {
    await assert.rejects(
      () =>
        rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
          databasePath:
            environment.databasePath,
          claims: {
            ...environment.sessionA,
            tenantId:
              "tenant-b",
          },
          currentPassword,
          newPassword,
          changedAt:
            "2026-07-11T14:10:00.000Z",
        }),
      AuthenticatedCredentialRotationError,
    );

    await assert.rejects(
      () =>
        rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
          databasePath:
            environment.databasePath,
          claims: {
            ...environment.sessionA,
            actorId:
              "owner-b",
          },
          currentPassword,
          newPassword,
          changedAt:
            "2026-07-11T14:10:00.000Z",
        }),
      AuthenticatedCredentialRotationError,
    );

    const sessions =
      await environment.sessionStore
        .readSnapshot();

    assert.equal(
      sessions.every(
        (session) =>
          session.revokedAt === null,
      ),
      true,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("disabled principal cannot rotate credentials", async () => {
  const environment =
    await createEnvironment();

  try {
    await environment.principalStore
      .disablePrincipal({
        principalId:
          "principal-702",
        reason:
          "OWNER_DISABLED_ACCOUNT",
        disabledAt:
          "2026-07-11T14:05:00.000Z",
      });

    await assert.rejects(
      () =>
        rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
          databasePath:
            environment.databasePath,
          claims:
            environment.sessionA,
          currentPassword,
          newPassword,
          changedAt:
            "2026-07-11T14:10:00.000Z",
        }),
      AuthenticatedCredentialRotationError,
    );

    const sessions =
      await environment.sessionStore
        .readSnapshot();

    assert.equal(
      sessions.every(
        (session) =>
          session.revokedAt === null,
      ),
      true,
    );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("credential and session changes are committed inside one SQLite transaction", async () => {
  const environment =
    await createEnvironment();

  try {
    await rotateAuthenticatedPrincipalCredentialAndRevokeSessions({
      databasePath:
        environment.databasePath,
      claims:
        environment.sessionA,
      currentPassword,
      newPassword,
      changedAt:
        "2026-07-11T14:10:00.000Z",
    });

    environment.sessionStore.close();
    environment.principalStore.close();

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      const principal =
        database
          .prepare(`
            SELECT credential_version
            FROM nexus_authenticated_principals
            WHERE principal_id = ?
          `)
          .get(
            "principal-702",
          );

      const activeSessions =
        database
          .prepare(`
            SELECT COUNT(*) AS count
            FROM nexus_authenticated_sessions
            WHERE
              tenant_id = ?
              AND actor_id = ?
              AND role = ?
              AND revoked_at IS NULL
          `)
          .get(
            "tenant-a",
            "owner-a",
            "owner",
          );

      assert.equal(
        principal.credential_version,
        2,
      );

      assert.equal(
        activeSessions.count,
        0,
      );
    } finally {
      database.close();
    }

    environment.principalStore =
      new SQLiteAuthenticatedPrincipalStore(
        environment.databasePath,
      );

    environment.sessionStore =
      new SQLiteAuthenticatedTenantSessionStore(
        environment.databasePath,
      );
  } finally {
    await cleanup(
      environment,
    );
  }
});

test("password-change route verifies active bearer session before transactional rotation", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/auth/password/change/route.ts",
      ),
      "utf8",
    );

  const tokenVerificationIndex =
    source.indexOf(
      "verifyAuthenticatedTenantSessionToken",
      source.indexOf(
        "export async function POST",
      ),
    );

  const contextIndex =
    source.indexOf(
      "assertAuthenticatedSessionMatchesGatewayContext",
      source.indexOf(
        "export async function POST",
      ),
    );

  const activeSessionIndex =
    source.indexOf(
      "sessionStore.assertActiveSession",
    );

  const rotationIndex =
    source.indexOf(
      "rotateAuthenticatedPrincipalCredentialAndRevokeSessions",
      source.indexOf(
        "export async function POST",
      ),
    );

  assert.match(
    source,
    /NEXUS_AUTH_PASSWORD_CHANGE_ENABLED/,
  );

  assert.match(
    source,
    /requires SQLite storage mode/,
  );

  assert.match(
    source,
    /NEXUS_AUTH_SESSION_SIGNING_SECRET/,
  );

  assert.ok(
    tokenVerificationIndex >= 0,
  );

  assert.ok(
    contextIndex >
      tokenVerificationIndex,
  );

  assert.ok(
    activeSessionIndex >
      contextIndex,
  );

  assert.ok(
    rotationIndex >
      activeSessionIndex,
  );

  assert.match(
    source,
    /reauthenticationRequired/,
  );

  assert.match(
    source,
    /cache-control/,
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

test("rotation service uses scrypt, timing-safe comparison and one immediate transaction", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/authenticatedPrincipalCredentialRotation.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /scryptSync/,
  );

  assert.match(
    source,
    /timingSafeEqual/,
  );

  assert.match(
    source,
    /randomBytes/,
  );

  assert.match(
    source,
    /BEGIN IMMEDIATE/,
  );

  assert.match(
    source,
    /credential_version/,
  );

  assert.match(
    source,
    /CREDENTIAL_ROTATED/,
  );

  assert.match(
    source,
    /nexus_authenticated_principals/,
  );

  assert.match(
    source,
    /nexus_authenticated_sessions/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
