const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");
const { DatabaseSync } = require("node:sqlite");

require.extensions[".ts"] = function compileTypeScript(
  module,
  filename,
) {
  const source = fs.readFileSync(filename, "utf8");

  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
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
  ControlledActionCommandGateway,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/controlledActionCommandGateway.ts",
  ),
);

const {
  PersistentControlledActionVerticalSlice,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/persistentControlledActionVerticalSlice.ts",
  ),
);

const {
  SQLiteControlledActionStateRepository,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteControlledActionStateRepository.ts",
  ),
);

function ownerContext(requestId) {
  return {
    tenantId: "tenant-zero-version",
    actorId: "owner-zero-version",
    role: "owner",
    requestId,
  };
}

async function createPendingAction(
  gateway,
  suffix,
) {
  return gateway.execute(
    ownerContext(`request-${suffix}`),
    {
      type: "create_action",
      actionId: `action-${suffix}`,
      idempotencyKey:
        `idempotency-${suffix}`,
      effectType:
        "SYNTHETIC_OWNER_REVIEW_DRAFT_ONLY",
      payloadDigest:
        `sha256:payload-${suffix}`,
      auditId: `audit-${suffix}`,
      now:
        "2026-07-28T00:01:00.000Z",
    },
  );
}

function convertFreshDatabaseToLegacy(
  databasePath,
) {
  const database =
    new DatabaseSync(databasePath);

  try {
    database.exec(`
      DELETE FROM nexus_schema_migrations
      WHERE version = 8;

      DROP TABLE nexus_dispatch_outbox_projection;
      DROP TABLE nexus_controlled_actions_projection;

      CREATE TABLE nexus_controlled_actions_projection (
        action_id TEXT PRIMARY KEY
          CHECK (length(action_id) > 0),
        tenant_id TEXT NOT NULL
          CHECK (length(tenant_id) > 0),
        idempotency_key TEXT NOT NULL
          CHECK (length(idempotency_key) > 0),
        status TEXT NOT NULL
          CHECK (length(status) > 0),
        version INTEGER NOT NULL
          CHECK (version >= 1),
        outbox_id TEXT,
        lease_owner TEXT,
        lease_expires_at TEXT,
        lease_fence INTEGER NOT NULL
          CHECK (lease_fence >= 0),
        recovery_count INTEGER NOT NULL
          CHECK (recovery_count >= 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        record_json TEXT NOT NULL,
        UNIQUE (tenant_id, idempotency_key),
        UNIQUE (tenant_id, action_id)
      );

      CREATE INDEX
        nexus_controlled_actions_tenant_status_idx
      ON nexus_controlled_actions_projection (
        tenant_id,
        status,
        updated_at
      );

      CREATE TABLE nexus_dispatch_outbox_projection (
        outbox_id TEXT PRIMARY KEY
          CHECK (length(outbox_id) > 0),
        action_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL
          CHECK (length(tenant_id) > 0),
        status TEXT NOT NULL
          CHECK (length(status) > 0),
        version INTEGER NOT NULL
          CHECK (version >= 1),
        delivery_attempt_count INTEGER NOT NULL
          CHECK (delivery_attempt_count >= 0),
        max_delivery_attempts INTEGER NOT NULL
          CHECK (max_delivery_attempts >= 1),
        next_attempt_at TEXT NOT NULL,
        lease_owner TEXT,
        lease_expires_at TEXT,
        lease_fence INTEGER NOT NULL
          CHECK (lease_fence >= 0),
        recovery_count INTEGER NOT NULL
          CHECK (recovery_count >= 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        record_json TEXT NOT NULL,
        FOREIGN KEY (action_id)
          REFERENCES nexus_controlled_actions_projection (
            action_id
          )
          ON DELETE CASCADE,
        UNIQUE (tenant_id, outbox_id)
      );

      CREATE INDEX
        nexus_dispatch_outbox_due_idx
      ON nexus_dispatch_outbox_projection (
        tenant_id,
        status,
        next_attempt_at,
        created_at,
        outbox_id
      );
    `);
  } finally {
    database.close();
  }
}

function verifyZeroBasedSchema(
  databasePath,
) {
  const database =
    new DatabaseSync(databasePath);

  try {
    const actionSql = database
      .prepare(`
        SELECT sql
        FROM sqlite_master
        WHERE
          type = 'table' AND
          name = 'nexus_controlled_actions_projection'
      `)
      .get().sql;

    const outboxSql = database
      .prepare(`
        SELECT sql
        FROM sqlite_master
        WHERE
          type = 'table' AND
          name = 'nexus_dispatch_outbox_projection'
      `)
      .get().sql;

    const migration = database
      .prepare(`
        SELECT migration_name
        FROM nexus_schema_migrations
        WHERE version = 8
      `)
      .get();

    assert.match(
      actionSql,
      /CHECK\s*\(\s*version\s*>=\s*0\s*\)/i,
    );

    assert.match(
      outboxSql,
      /CHECK\s*\(\s*version\s*>=\s*0\s*\)/i,
    );

    assert.equal(
      migration.migration_name,
      "controlled_action_zero_based_projection_versions_v1",
    );
  } finally {
    database.close();
  }
}

test("fresh SQLite projections persist zero-based action and outbox versions", async () => {
  const directory = await fsp.mkdtemp(
    path.join(
      os.tmpdir(),
      "nexus-zero-version-fresh-",
    ),
  );

  const databasePath = path.join(
    directory,
    "fresh.sqlite",
  );

  const repository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  try {
    const engine =
      new PersistentControlledActionVerticalSlice(
        repository,
      );

    const gateway =
      new ControlledActionCommandGateway(
        engine,
      );

    const created =
      await createPendingAction(
        gateway,
        "fresh",
      );

    assert.equal(
      created.result.status,
      "pending",
    );

    assert.equal(
      created.result.version,
      0,
    );

    assert.equal(
      created.liveProviderExecutionAuthorized,
      false,
    );

    await gateway.execute(
      ownerContext("authorize-fresh"),
      {
        type: "authorize_action",
        actionId: "action-fresh",
        ownerAuthorizationId:
          "owner-authorization-fresh",
        auditId:
          "authorize-audit-fresh",
        now:
          "2026-07-28T00:02:00.000Z",
      },
    );

    await gateway.execute(
      ownerContext("enqueue-fresh"),
      {
        type: "enqueue_action",
        actionId: "action-fresh",
        outboxId: "outbox-fresh",
        dispatchToken:
          "dispatch-token-fresh",
        maxDeliveryAttempts: 3,
        auditId:
          "enqueue-audit-fresh",
        now:
          "2026-07-28T00:03:00.000Z",
      },
    );

    const snapshot =
      await engine.readSnapshot();

    assert.equal(
      snapshot.outbox["outbox-fresh"].version,
      0,
    );

    assert.equal(
      snapshot.outbox["outbox-fresh"].status,
      "pending",
    );
  } finally {
    repository.close();
  }

  verifyZeroBasedSchema(databasePath);

  await fsp.rm(
    directory,
    {
      recursive: true,
      force: true,
    },
  );
});

test("legacy projection constraints migrate before zero-based creation", async () => {
  const directory = await fsp.mkdtemp(
    path.join(
      os.tmpdir(),
      "nexus-zero-version-legacy-",
    ),
  );

  const databasePath = path.join(
    directory,
    "legacy.sqlite",
  );

  const initialRepository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  initialRepository.close();

  convertFreshDatabaseToLegacy(
    databasePath,
  );

  const migratedRepository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  try {
    const engine =
      new PersistentControlledActionVerticalSlice(
        migratedRepository,
      );

    const gateway =
      new ControlledActionCommandGateway(
        engine,
      );

    const created =
      await createPendingAction(
        gateway,
        "legacy",
      );

    assert.equal(
      created.result.version,
      0,
    );

    assert.equal(
      created.result.status,
      "pending",
    );

    const snapshot =
      await engine.readSnapshot();

    assert.equal(snapshot.revision, 1);
    assert.equal(snapshot.audit.length, 1);
    assert.equal(
      Object.keys(snapshot.outbox).length,
      0,
    );
  } finally {
    migratedRepository.close();
  }

  verifyZeroBasedSchema(databasePath);

  await fsp.rm(
    directory,
    {
      recursive: true,
      force: true,
    },
  );
});

test("repository remains persistence-only with no provider execution path", () => {
  const source = fs.readFileSync(
    path.resolve(
      process.cwd(),
      "lib/nexus/sqliteControlledActionStateRepository.ts",
    ),
    "utf8",
  );

  assert.match(
    source,
    /controlled_action_zero_based_projection_versions_v1/,
  );

  assert.doesNotMatch(
    source,
    /CHECK \(version >= 1\)/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
