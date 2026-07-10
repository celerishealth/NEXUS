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
    const source = fs.readFileSync(
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
  DatabaseSync,
} = require("node:sqlite");

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

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day695-",
      ),
    );

  const databasePath = path.join(
    directory,
    "nexus-runtime.sqlite",
  );

  const repository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  const engine =
    new PersistentControlledActionVerticalSlice(
      repository,
    );

  return {
    directory,
    databasePath,
    repository,
    engine,
    gateway:
      new ControlledActionCommandGateway(
        engine,
      ),
  };
}

function ownerContext() {
  return {
    tenantId: "tenant-a",
    actorId: "owner-a",
    role: "owner",
    requestId: "request-695",
  };
}

async function createAction(
  gateway,
  suffix = "695",
) {
  return gateway.execute(
    ownerContext(),
    {
      type: "create_action",
      actionId:
        `action-${suffix}`,
      idempotencyKey:
        `idempotency-${suffix}`,
      effectType:
        "CUSTOMER_MESSAGE_DELIVERY",
      payloadDigest:
        `sha256:payload-${suffix}`,
      auditId:
        `audit-${suffix}`,
      now:
        "2026-07-11T07:00:00.000Z",
    },
  );
}

test("fresh SQLite repository initializes verified normalized projections", async () => {
  const environment =
    await createEnvironment();

  try {
    const verification =
      environment.repository
        .verifyProjectionIntegrity();

    assert.equal(
      verification.valid,
      true,
    );

    assert.equal(
      verification.authoritativeRevision,
      0,
    );

    assert.equal(
      verification.projectionRevision,
      0,
    );

    assert.deepEqual(
      verification.issues,
      [],
    );
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("valid action transaction keeps authoritative and normalized state verified", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAction(
      environment.gateway,
    );

    const verification =
      environment.repository
        .verifyProjectionIntegrity();

    assert.equal(
      verification.valid,
      true,
    );

    assert.equal(
      verification.authoritativeRevision,
      1,
    );

    assert.equal(
      verification.projectionRevision,
      1,
    );
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("projection record tampering causes fail-closed repository restart", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAction(
      environment.gateway,
      "tamper-695",
    );

    environment.repository.close();

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      const row = database
        .prepare(`
          SELECT record_json
          FROM nexus_controlled_actions_projection
          WHERE action_id = ?
        `)
        .get(
          "action-tamper-695",
        );

      const record =
        JSON.parse(
          row.record_json,
        );

      record.status = "succeeded";

      database
        .prepare(`
          UPDATE nexus_controlled_actions_projection
          SET record_json = ?
          WHERE action_id = ?
        `)
        .run(
          JSON.stringify(record),
          "action-tamper-695",
        );
    } finally {
      database.close();
    }

    assert.throws(
      () =>
        new SQLiteControlledActionStateRepository(
          environment.databasePath,
        ),
      /projection integrity verification failed/i,
    );
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

test("relational column tampering is detected even when projection JSON remains unchanged", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAction(
      environment.gateway,
      "column-695",
    );

    environment.repository.close();

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      database
        .prepare(`
          UPDATE nexus_controlled_actions_projection
          SET status = ?
          WHERE action_id = ?
        `)
        .run(
          "succeeded",
          "action-column-695",
        );
    } finally {
      database.close();
    }

    assert.throws(
      () =>
        new SQLiteControlledActionStateRepository(
          environment.databasePath,
        ),
      /relational columns are inconsistent/i,
    );
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

test("projection revision drift causes fail-closed startup", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAction(
      environment.gateway,
      "revision-695",
    );

    environment.repository.close();

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      database.exec(`
        UPDATE nexus_projection_metadata
        SET source_revision = 0
        WHERE singleton_id = 1
      `);
    } finally {
      database.close();
    }

    assert.throws(
      () =>
        new SQLiteControlledActionStateRepository(
          environment.databasePath,
        ),
      /does not match authoritative revision/i,
    );
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

test("explicit recovery mode rebuilds projections without mutating authoritative state", async () => {
  const environment =
    await createEnvironment();

  try {
    await createAction(
      environment.gateway,
      "rebuild-695",
    );

    const authoritativeBefore =
      await environment.engine
        .readSnapshot();

    environment.repository.close();

    const database =
      new DatabaseSync(
        environment.databasePath,
      );

    try {
      database.exec(`
        DELETE FROM nexus_audit_projection;
      `);
    } finally {
      database.close();
    }

    const recoveryRepository =
      new SQLiteControlledActionStateRepository(
        environment.databasePath,
        {
          allowProjectionRecovery: true,
        },
      );

    try {
      const beforeRecovery =
        recoveryRepository
          .verifyProjectionIntegrity();

      assert.equal(
        beforeRecovery.valid,
        false,
      );

      assert.match(
        beforeRecovery.issues.join(" "),
        /Audit projection does not match/i,
      );

      const rebuilt =
        recoveryRepository
          .rebuildProjectionsFromAuthoritativeState(
            "OWNER_APPROVED_PROJECTION_REPAIR",
            "2026-07-11T07:10:00.000Z",
          );

      assert.equal(
        rebuilt.valid,
        true,
      );

      const restartedEngine =
        new PersistentControlledActionVerticalSlice(
          recoveryRepository,
        );

      const authoritativeAfter =
        await restartedEngine
          .readSnapshot();

      assert.deepEqual(
        authoritativeAfter,
        authoritativeBefore,
      );

      const proofDatabase =
        new DatabaseSync(
          environment.databasePath,
        );

      try {
        const rebuildLog =
          proofDatabase
            .prepare(`
              SELECT
                reason,
                authoritative_revision
              FROM nexus_projection_rebuild_log
              ORDER BY rebuild_id DESC
              LIMIT 1
            `)
            .get();

        assert.equal(
          rebuildLog.reason,
          "OWNER_APPROVED_PROJECTION_REPAIR",
        );

        assert.equal(
          rebuildLog.authoritative_revision,
          authoritativeBefore.revision,
        );
      } finally {
        proofDatabase.close();
      }
    } finally {
      recoveryRepository.close();
    }

    const normalRestart =
      new SQLiteControlledActionStateRepository(
        environment.databasePath,
      );

    try {
      assert.equal(
        normalRestart
          .verifyProjectionIntegrity()
          .valid,
        true,
      );
    } finally {
      normalRestart.close();
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

test("projection rebuild is blocked without explicit recovery authorization", async () => {
  const environment =
    await createEnvironment();

  try {
    assert.throws(
      () =>
        environment.repository
          .rebuildProjectionsFromAuthoritativeState(
            "UNAUTHORIZED_REBUILD",
            "2026-07-11T07:10:00.000Z",
          ),
      /rebuild is disabled/i,
    );
  } finally {
    environment.repository.close();

    await fsp.rm(
      environment.directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
});

test("integrity implementation remains local, transactional and provider-free", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/sqliteControlledActionStateRepository.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /verifyProjectionIntegrity/,
  );

  assert.match(
    source,
    /allowProjectionRecovery/,
  );

  assert.match(
    source,
    /nexus_projection_rebuild_log/,
  );

  assert.match(
    source,
    /SQLite projection integrity verification failed/,
  );

  assert.match(
    source,
    /BEGIN IMMEDIATE/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
