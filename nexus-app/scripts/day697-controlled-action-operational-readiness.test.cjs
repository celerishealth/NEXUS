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
  ControlledActionOperationalReadinessService,
} = require(
  path.resolve(
    process.cwd(),
    "lib/nexus/controlledActionOperationalReadiness.ts",
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
        "nexus-day697-",
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
          "readiness-owner-request-697",
      },
      {
        type: "create_action",
        actionId: "action-697",
        idempotencyKey:
          "idempotency-697",
        effectType:
          "CUSTOMER_MESSAGE_DELIVERY",
        payloadDigest:
          "sha256:payload-697",
        auditId:
          "create-audit-697",
        now:
          "2026-07-11T09:00:00.000Z",
      },
    );
  } finally {
    repository.close();
  }
}

async function createBackup(
  environment,
  createdAt =
    "2026-07-11T09:05:00.000Z",
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
      "readiness-backup-697",
    reason:
      "OPERATIONAL_READINESS_RECOVERY_POINT",
    createdAt,
  });
}

function createService(
  environment,
  overrides = {},
) {
  return new ControlledActionOperationalReadinessService({
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

test("healthy SQLite state and verified backup open the persistence-only readiness gate", async () => {
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
      await createService(
        environment,
      ).evaluate({
        now:
          "2026-07-11T09:10:00.000Z",
      });

    assert.equal(
      result.ready,
      true,
    );

    assert.equal(
      result.status,
      "ready",
    );

    assert.equal(
      result.executionGate,
      "OPEN_FOR_PERSISTENCE_ONLY_COMMANDS",
    );

    assert.equal(
      result.databaseRevision,
      1,
    );

    assert.equal(
      result.projectionRevision,
      1,
    );

    assert.equal(
      result.killSwitchEngaged,
      false,
    );

    assert.equal(
      result.verifiedBackupId,
      "readiness-backup-697",
    );

    assert.equal(
      result.checks.every(
        (check) =>
          !check.required ||
          check.passed,
      ),
      true,
    );

    assert.equal(
      result.liveProviderExecutionAuthorized,
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

test("operational kill switch closes readiness even when database integrity passes", async () => {
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
            "kill-switch-request-697",
        },
        {
          type:
            "set_operational_kill_switch",
          engaged: true,
          reason:
            "OWNER_EMERGENCY_STOP",
          auditId:
            "kill-switch-audit-697",
          now:
            "2026-07-11T09:02:00.000Z",
        },
      );
    } finally {
      repository.close();
    }

    await createBackup(
      environment,
    );

    const result =
      await createService(
        environment,
      ).evaluate({
        now:
          "2026-07-11T09:10:00.000Z",
      });

    assert.equal(
      result.ready,
      false,
    );

    assert.equal(
      result.status,
      "blocked",
    );

    assert.equal(
      result.killSwitchEngaged,
      true,
    );

    assert.equal(
      result.executionGate,
      "CLOSED",
    );

    const killSwitchCheck =
      result.checks.find(
        (check) =>
          check.name ===
          "kill_switch_disengaged",
      );

    assert.equal(
      killSwitchCheck.passed,
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

test("projection corruption causes a fail-closed readiness result", async () => {
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

    const result =
      await createService(
        environment,
      ).evaluate({
        now:
          "2026-07-11T09:10:00.000Z",
      });

    assert.equal(
      result.ready,
      false,
    );

    assert.equal(
      result.executionGate,
      "CLOSED",
    );

    const integrityCheck =
      result.checks.find(
        (check) =>
          check.name ===
          "sqlite_database_integrity",
      );

    assert.equal(
      integrityCheck.passed,
      false,
    );

    assert.match(
      integrityCheck.detail,
      /projection integrity|authoritative revision/i,
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

test("stale verified backup closes readiness when backup is required", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.databasePath,
    );

    await createBackup(
      environment,
      "2026-07-09T09:00:00.000Z",
    );

    const result =
      await createService(
        environment,
      ).evaluate({
        now:
          "2026-07-11T09:10:00.000Z",
      });

    assert.equal(
      result.ready,
      false,
    );

    const backupCheck =
      result.checks.find(
        (check) =>
          check.name ===
          "verified_backup_available",
      );

    assert.equal(
      backupCheck.required,
      true,
    );

    assert.equal(
      backupCheck.passed,
      false,
    );

    assert.match(
      backupCheck.detail,
      /older than the permitted recovery window/i,
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

test("backup can be optional for controlled development environments", async () => {
  const environment =
    await createEnvironment();

  try {
    await seedDatabase(
      environment.databasePath,
    );

    const service =
      new ControlledActionOperationalReadinessService({
        storageMode: "sqlite",
        databasePath:
          environment.databasePath,
        requireVerifiedBackup: false,
        maxBackupAgeMs:
          24 * 60 * 60 * 1000,
      });

    const result =
      await service.evaluate({
        now:
          "2026-07-11T09:10:00.000Z",
      });

    assert.equal(
      result.ready,
      true,
    );

    const backupCheck =
      result.checks.find(
        (check) =>
          check.name ===
          "verified_backup_available",
      );

    assert.equal(
      backupCheck.required,
      false,
    );

    assert.equal(
      backupCheck.passed,
      true,
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

test("file storage mode is rejected by the operational readiness boundary", async () => {
  const environment =
    await createEnvironment();

  try {
    const service =
      new ControlledActionOperationalReadinessService({
        storageMode: "file",
        databasePath:
          environment.databasePath,
        requireVerifiedBackup: false,
        maxBackupAgeMs:
          24 * 60 * 60 * 1000,
      });

    const result =
      await service.evaluate({
        now:
          "2026-07-11T09:10:00.000Z",
      });

    assert.equal(
      result.ready,
      false,
    );

    assert.equal(
      result.executionGate,
      "CLOSED",
    );

    const storageCheck =
      result.checks.find(
        (check) =>
          check.name ===
          "sqlite_storage_mode",
      );

    assert.equal(
      storageCheck.passed,
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

test("internal readiness route is disabled by default, authenticated and non-executing", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "app/api/nexus/internal/controlled-actions/readiness/route.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /NEXUS_CONTROLLED_ACTION_READINESS_ENABLED/,
  );

  assert.match(
    source,
    /NEXUS_CONTROLLED_ACTION_READINESS_SECRET/,
  );

  assert.match(
    source,
    /timingSafeEqual/,
  );

  assert.match(
    source,
    /authorization/,
  );

  assert.match(
    source,
    /result\.ready\s*\?\s*200\s*:\s*503/,
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

test("readiness implementation verifies all durable safety boundaries without provider execution", () => {
  const source =
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "lib/nexus/controlledActionOperationalReadiness.ts",
      ),
      "utf8",
    );

  assert.match(
    source,
    /verifyProjectionIntegrity/,
  );

  assert.match(
    source,
    /SQLiteSignedGatewayRequestStore/,
  );

  assert.match(
    source,
    /verifyBackup/,
  );

  assert.match(
    source,
    /kill_switch_disengaged/,
  );

  assert.match(
    source,
    /OPEN_FOR_PERSISTENCE_ONLY_COMMANDS/,
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
