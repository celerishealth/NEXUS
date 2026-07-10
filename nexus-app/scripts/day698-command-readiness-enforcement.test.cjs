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
  ControlledActionCommandReadinessGate,
  ControlledActionReadinessGateClosedError,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/controlledActionCommandReadinessGate.ts",
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
        "nexus-day698-",
      ),
    );

  return {
    directory,
    databasePath:
      path.join(
        directory,
        "runtime.sqlite",
      ),
    backupDatabasePath:
      path.join(
        directory,
        "backup",
        "runtime-backup.sqlite",
      ),
    backupManifestPath:
      path.join(
        directory,
        "backup",
        "runtime-backup.manifest.json",
      ),
  };
}

async function seedDatabase(
  databasePath,
) {
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

    await gateway.execute(
      {
        tenantId: "tenant-a",
        actorId: "owner-a",
        role: "owner",
        requestId:
          "owner-request-698",
      },
      {
        type: "create_action",
        actionId: "action-698",
        idempotencyKey:
          "idempotency-698",
        effectType:
          "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest:
          "sha256:payload-698",
        auditId:
          "create-audit-698",
        now:
          "2026-07-11T10:00:00.000Z",
      },
    );
  } finally {
    repository.close();
  }
}

async function createBackup(
  environment,
) {
  const manager =
    new SQLiteOperationalBackupManager();

  return manager.createBackup({
    sourceDatabasePath:
      environment.databasePath,
    backupDatabasePath:
      environment.backupDatabasePath,
    manifestPath:
      environment.backupManifestPath,
    backupId:
      "command-gate-backup-698",
    reason:
      "COMMAND_GATE_RECOVERY_POINT",
    createdAt:
      "2026-07-11T10:05:00.000Z",
  });
}

function createGate(
  environment,
  overrides = {},
) {
  return new ControlledActionCommandReadinessGate({
    storageMode: "sqlite",
    databasePath:
      environment.databasePath,
    requireVerifiedBackup: true,
    backupDatabasePath:
      environment.backupDatabasePath,
    backupManifestPath:
      environment.backupManifestPath,
    maxBackupAgeMs:
      24 * 60 * 60 * 1000,
    ...overrides,
  });
}

test("healthy SQLite runtime opens the command gate only for persistence operations", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.databasePath,
    );

    await createBackup(
      environment,
    );

    const result =
      await createGate(
        environment,
      ).assertOpen({
        now:
          "2026-07-11T10:10:00.000Z",
      });

    assert.equal(
      result.ready,
      true,
    );

    assert.equal(
      result.executionGate,
      "OPEN_FOR_PERSISTENCE_ONLY_COMMANDS",
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
      false,
    );

    assert.equal(
      result.verifiedBackupId,
      "command-gate-backup-698",
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

test("missing required backup blocks command execution before any command mutation", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.databasePath,
    );

    const gate =
      createGate(environment);

    await assert.rejects(
      () =>
        gate.assertOpen({
          now:
            "2026-07-11T10:10:00.000Z",
        }),
      (error) => {
        assert.ok(
          error instanceof
            ControlledActionReadinessGateClosedError,
        );

        assert.equal(
          error.readiness.ready,
          false,
        );

        assert.equal(
          error.readiness.executionGate,
          "CLOSED",
        );

        assert.match(
          error.message,
          /verified_backup_available/i,
        );

        return true;
      },
    );

    const repository =
      new SQLiteControlledActionStateRepository(
        environment.databasePath,
      );

    try {
      const engine =
        new PersistentControlledActionVerticalSlice(
          repository,
        );

      const snapshot =
        await engine.readSnapshot();

      assert.equal(
        snapshot.revision,
        1,
      );

      assert.equal(
        snapshot.audit.length,
        1,
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

test("engaged kill switch closes the command gate", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.databasePath,
    );

    const repository =
      new SQLiteControlledActionStateRepository(
        environment.databasePath,
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

      await gateway.execute(
        {
          tenantId: "__system__",
          actorId: "system-owner",
          role: "system_owner",
          requestId:
            "kill-switch-request-698",
        },
        {
          type:
            "set_operational_kill_switch",
          engaged: true,
          reason:
            "OWNER_EMERGENCY_STOP",
          auditId:
            "kill-switch-audit-698",
          now:
            "2026-07-11T10:02:00.000Z",
        },
      );
    } finally {
      repository.close();
    }

    await createBackup(
      environment,
    );

    await assert.rejects(
      () =>
        createGate(
          environment,
        ).assertOpen({
          now:
            "2026-07-11T10:10:00.000Z",
        }),
      /kill_switch_disengaged.*kill switch is engaged/i,
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

test("projection drift closes the command gate even with a valid older backup", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.databasePath,
    );

    await createBackup(
      environment,
    );

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

    await assert.rejects(
      () =>
        createGate(
          environment,
        ).assertOpen({
          now:
            "2026-07-11T10:10:00.000Z",
        }),
      /sqlite_database_integrity|projection integrity|authoritative revision/i,
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

test("file mode cannot open the operational command gate", async () => {
  const environment =
    await createEnvironment();

  try {
    const gate =
      createGate(
        environment,
        {
          storageMode: "file",
          requireVerifiedBackup:
            false,
        },
      );

    await assert.rejects(
      () =>
        gate.assertOpen({
          now:
            "2026-07-11T10:10:00.000Z",
        }),
      /sqlite_storage_mode/i,
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

test("command route checks readiness after signature verification and before journal reservation", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/internal/controlled-actions/route.ts",
      ),
      "utf8",
    );

  const signatureIndex =
    source.indexOf(
      "verifySignedControlledActionGatewayEnvelope",
    );

  const readinessIndex =
    source.indexOf(
      "readinessGate.assertOpen",
    );

  const journalIndex =
    source.indexOf(
      "outcomeJournal.begin",
    );

  const replayIndex =
    source.indexOf(
      "replayGuard.reserve",
    );

  assert.ok(signatureIndex >= 0);
  assert.ok(readinessIndex >= 0);
  assert.ok(journalIndex >= 0);
  assert.ok(replayIndex >= 0);

  assert.ok(
    signatureIndex <
      readinessIndex,
  );

  assert.ok(
    readinessIndex <
      journalIndex,
  );

  assert.ok(
    readinessIndex <
      replayIndex,
  );

  assert.match(
    source,
    /NEXUS_CONTROLLED_ACTION_ENFORCE_READINESS/,
  );

  assert.match(
    source,
    /NEXUS_CONTROLLED_ACTION_REQUIRE_VERIFIED_BACKUP/,
  );

  assert.match(
    source,
    /operational readiness gate is closed/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});

test("command readiness gate remains persistence-only and provider-free", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/controlledActionCommandReadinessGate.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /OPEN_FOR_PERSISTENCE_ONLY_COMMANDS/,
  );

  assert.match(
    source,
    /liveProviderExecutionAuthorized/,
  );

  assert.match(
    source,
    /ControlledActionReadinessGateClosedError/,
  );

  assert.doesNotMatch(
    source,
    /\bfetch\s*\(/,
  );
});
