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
  signControlledActionGatewayEnvelope,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/signedControlledActionGatewayEnvelope.ts",
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

const {
  SQLiteSignedGatewayRequestStore,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteSignedGatewayRequestStore.ts",
  ),
);

const {
  SQLiteOperationalBackupManager,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/sqliteOperationalBackupManager.ts",
  ),
);

async function createEnvironment() {
  const directory =
    await fsp.mkdtemp(
      path.join(
        os.tmpdir(),
        "nexus-day696-",
      ),
    );

  return {
    directory,
    sourceDatabasePath:
      path.join(
        directory,
        "source.sqlite",
      ),
    backupDatabasePath:
      path.join(
        directory,
        "backup",
        "nexus-backup.sqlite",
      ),
    manifestPath:
      path.join(
        directory,
        "backup",
        "nexus-backup.manifest.json",
      ),
    restoredDatabasePath:
      path.join(
        directory,
        "restore",
        "restored.sqlite",
      ),
  };
}

async function seedDatabase(
  databasePath,
) {
  const actionRepository =
    new SQLiteControlledActionStateRepository(
      databasePath,
    );

  const gatewayStore =
    new SQLiteSignedGatewayRequestStore(
      databasePath,
    );

  const engine =
    new PersistentControlledActionVerticalSlice(
      actionRepository,
    );

  const gateway =
    new ControlledActionCommandGateway(
      engine,
    );

  try {
    await gateway.execute(
      {
        tenantId: "tenant-a",
        actorId: "owner-a",
        role: "owner",
        requestId:
          "backup-owner-request-696",
      },
      {
        type: "create_action",
        actionId: "action-696",
        idempotencyKey:
          "idempotency-696",
        effectType:
          "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest:
          "sha256:payload-696",
        auditId:
          "create-audit-696",
        now:
          "2026-07-11T08:00:00.000Z",
      },
    );

    const envelope =
      signControlledActionGatewayEnvelope(
        {
          version: 1,
          keyId: "primary",
          issuedAt:
            "2026-07-11T08:00:00.000Z",
          nonce:
            "backup-nonce-696",
          context: {
            tenantId: "tenant-a",
            actorId: "owner-a",
            role: "owner",
            requestId:
              "signed-request-696",
          },
          command: {
            type: "create_action",
            actionId:
              "signed-action-696",
            idempotencyKey:
              "signed-idempotency-696",
            effectType:
              "CUSTOMER_MESSAGE_DELIVERY",
            payloadDigest:
              "sha256:signed-payload-696",
            auditId:
              "signed-audit-696",
            now:
              "2026-07-11T08:00:00.000Z",
          },
        },
        "day-696-backup-signing-secret",
      );

    await gatewayStore.begin(
      envelope,
      "2026-07-11T08:01:00.000Z",
      "2026-07-11T08:05:00.000Z",
    );

    await gatewayStore.reserve(
      envelope.keyId,
      envelope.nonce,
      "2026-07-11T08:01:00.000Z",
      "2026-07-11T08:05:00.000Z",
    );

    await gatewayStore.finish(
      envelope.keyId,
      envelope.nonce,
      envelope.signature,
      "completed",
      "2026-07-11T08:01:01.000Z",
      200,
      {
        accepted: true,
        actionId: "action-696",
        liveProviderExecutionAuthorized:
          false,
      },
    );
  } finally {
    gatewayStore.close();
    actionRepository.close();
  }
}

function backupRequest(
  environment,
) {
  return {
    sourceDatabasePath:
      environment.sourceDatabasePath,
    backupDatabasePath:
      environment.backupDatabasePath,
    manifestPath:
      environment.manifestPath,
    backupId:
      "backup-696",
    reason:
      "OWNER_APPROVED_DISASTER_RECOVERY_BACKUP",
    createdAt:
      "2026-07-11T08:10:00.000Z",
  };
}

test("creates a verified compact SQLite backup with cryptographic manifest", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.sourceDatabasePath,
    );

    const manager =
      new SQLiteOperationalBackupManager();

    const manifest =
      await manager.createBackup(
        backupRequest(environment),
      );

    assert.equal(
      manifest.manifestVersion,
      1,
    );

    assert.equal(
      manifest.actionRevision,
      1,
    );

    assert.equal(
      manifest.projectionRevision,
      1,
    );

    assert.equal(
      manifest.gatewayOutcomeCount,
      1,
    );

    assert.equal(
      manifest.gatewayReplayCount,
      1,
    );

    assert.match(
      manifest.databaseSha256,
      /^[a-f0-9]{64}$/,
    );

    assert.ok(
      manifest.databaseBytes > 0,
    );

    assert.equal(
      manifest.integrityCheck
        .toLowerCase(),
      "ok",
    );

    const verified =
      await manager.verifyBackup({
        backupDatabasePath:
          environment.backupDatabasePath,
        manifestPath:
          environment.manifestPath,
      });

    assert.deepEqual(
      verified,
      manifest,
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

test("atomically restores action state, projections, audit and gateway safety records", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.sourceDatabasePath,
    );

    const manager =
      new SQLiteOperationalBackupManager();

    await manager.createBackup(
      backupRequest(environment),
    );

    await manager.restoreBackup({
      backupDatabasePath:
        environment.backupDatabasePath,
      manifestPath:
        environment.manifestPath,
      targetDatabasePath:
        environment.restoredDatabasePath,
    });

    const actionRepository =
      new SQLiteControlledActionStateRepository(
        environment.restoredDatabasePath,
      );

    const gatewayStore =
      new SQLiteSignedGatewayRequestStore(
        environment.restoredDatabasePath,
      );

    try {
      const engine =
        new PersistentControlledActionVerticalSlice(
          actionRepository,
        );

      const actionSnapshot =
        await engine.readSnapshot();

      const projectionSnapshot =
        actionRepository
          .readProjectionSnapshot();

      const gatewaySnapshot =
        await gatewayStore
          .readSnapshot();

      assert.equal(
        actionSnapshot.revision,
        1,
      );

      assert.equal(
        actionSnapshot.actions[
          "action-696"
        ].status,
        "pending",
      );

      assert.equal(
        projectionSnapshot.revision,
        1,
      );

      assert.equal(
        projectionSnapshot.actions.length,
        1,
      );

      assert.equal(
        projectionSnapshot.audit.length,
        1,
      );

      assert.equal(
        gatewaySnapshot.outcomes.length,
        1,
      );

      assert.equal(
        gatewaySnapshot.outcomes[0].status,
        "completed",
      );

      assert.equal(
        gatewaySnapshot.replayEntries.length,
        1,
      );

      assert.equal(
        actionRepository
          .verifyProjectionIntegrity()
          .valid,
        true,
      );
    } finally {
      gatewayStore.close();
      actionRepository.close();
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

test("backup tampering is rejected before restore", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.sourceDatabasePath,
    );

    const manager =
      new SQLiteOperationalBackupManager();

    await manager.createBackup(
      backupRequest(environment),
    );

    await fsp.appendFile(
      environment.backupDatabasePath,
      "tampered",
      "utf8",
    );

    await assert.rejects(
      () =>
        manager.verifyBackup({
          backupDatabasePath:
            environment.backupDatabasePath,
          manifestPath:
            environment.manifestPath,
        }),
      /byte size does not match|SHA-256 verification failed/i,
    );

    await assert.rejects(
      () =>
        manager.restoreBackup({
          backupDatabasePath:
            environment.backupDatabasePath,
          manifestPath:
            environment.manifestPath,
          targetDatabasePath:
            environment.restoredDatabasePath,
        }),
      /byte size does not match|SHA-256 verification failed/i,
    );

    assert.equal(
      fs.existsSync(
        environment.restoredDatabasePath,
      ),
      false,
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

test("source projection drift blocks backup instead of silently copying corruption", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.sourceDatabasePath,
    );

    const database =
      new DatabaseSync(
        environment.sourceDatabasePath,
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

    const manager =
      new SQLiteOperationalBackupManager();

    await assert.rejects(
      () =>
        manager.createBackup(
          backupRequest(environment),
        ),
      /projection integrity verification failed|does not match authoritative revision/i,
    );

    assert.equal(
      fs.existsSync(
        environment.backupDatabasePath,
      ),
      false,
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

test("restore refuses to overwrite an existing database without explicit authorization", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.sourceDatabasePath,
    );

    const manager =
      new SQLiteOperationalBackupManager();

    await manager.createBackup(
      backupRequest(environment),
    );

    await fsp.mkdir(
      path.dirname(
        environment.restoredDatabasePath,
      ),
      {
        recursive: true,
      },
    );

    await fsp.writeFile(
      environment.restoredDatabasePath,
      "existing-database",
      "utf8",
    );

    await assert.rejects(
      () =>
        manager.restoreBackup({
          backupDatabasePath:
            environment.backupDatabasePath,
          manifestPath:
            environment.manifestPath,
          targetDatabasePath:
            environment.restoredDatabasePath,
        }),
      /restore target already exists/i,
    );

    assert.equal(
      await fsp.readFile(
        environment.restoredDatabasePath,
        "utf8",
      ),
      "existing-database",
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

test("explicit overwrite performs verified replacement of an existing closed database", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.sourceDatabasePath,
    );

    const manager =
      new SQLiteOperationalBackupManager();

    await manager.createBackup(
      backupRequest(environment),
    );

    await fsp.mkdir(
      path.dirname(
        environment.restoredDatabasePath,
      ),
      {
        recursive: true,
      },
    );

    await fsp.writeFile(
      environment.restoredDatabasePath,
      "obsolete-database",
      "utf8",
    );

    await manager.restoreBackup({
      backupDatabasePath:
        environment.backupDatabasePath,
      manifestPath:
        environment.manifestPath,
      targetDatabasePath:
        environment.restoredDatabasePath,
      allowOverwrite: true,
    });

    const repository =
      new SQLiteControlledActionStateRepository(
        environment.restoredDatabasePath,
      );

    try {
      const engine =
        new PersistentControlledActionVerticalSlice(
          repository,
        );

      const snapshot =
        await engine.readSnapshot();

      assert.equal(
        snapshot.actions[
          "action-696"
        ].status,
        "pending",
      );

      assert.equal(
        repository
          .verifyProjectionIntegrity()
          .valid,
        true,
      );
    } finally {
      repository.close();
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

test("backup and restore implementation remains local and contains no provider execution", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/sqliteOperationalBackupManager.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /VACUUM INTO/,
  );

  assert.match(
    source,
    /wal_checkpoint\(TRUNCATE\)/,
  );

  assert.match(
    source,
    /databaseSha256/,
  );

  assert.match(
    source,
    /verifyProjectionIntegrity/,
  );

  assert.match(
    source,
    /allowOverwrite/,
  );

  assert.match(
    source,
    /rollback-/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
