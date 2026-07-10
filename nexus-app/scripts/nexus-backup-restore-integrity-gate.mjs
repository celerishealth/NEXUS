import {
  existsSync,
  readFileSync,
} from "node:fs";

const requiredFiles = [
  "docker-compose.nexus-postgres.yml",
  "scripts/nexus-local-postgres-backup-restore.ps1",
  "scripts/nexus-local-postgres-backup-restore-gate.mjs",
];

const missingFiles =
  requiredFiles.filter(
    (file) =>
      !existsSync(file),
  );

const findings = [];

if (missingFiles.length === 0) {
  const orchestrator =
    readFileSync(
      "scripts/nexus-local-postgres-backup-restore.ps1",
      "utf8",
    );

  const verifier =
    readFileSync(
      "scripts/nexus-local-postgres-backup-restore-gate.mjs",
      "utf8",
    );

  const requiredOrchestratorControls = [
    "pg_dump",
    "--format=custom",
    "Get-FileHash",
    "SHA256",
    "createdb",
    "pg_restore",
    "--exit-on-error",
    "nexus_security_restore",
    "down -v --remove-orphans",
  ];

  for (
    const control
    of requiredOrchestratorControls
  ) {
    if (
      !orchestrator.includes(
        control,
      )
    ) {
      findings.push({
        file:
          "scripts/nexus-local-postgres-backup-restore.ps1",
        missingControl:
          control,
      });
    }
  }

  const requiredVerificationControls = [
    "MIGRATIONS_CURRENT",
    "RESTORED_NONCE_REPLAY_BLOCKED",
    "RESTORED_TENANT_OWNER_AUTHORIZED",
    "replayAttempt.consumed ===",
    "migration_count === 4",
    "productionDatabaseModified:",
    "executionAuthorized:",
  ];

  for (
    const control
    of requiredVerificationControls
  ) {
    if (
      !verifier.includes(
        control,
      )
    ) {
      findings.push({
        file:
          "scripts/nexus-local-postgres-backup-restore-gate.mjs",
        missingControl:
          control,
      });
    }
  }

  const forbiddenIndicators = [
    /supabase/gi,
    /vercel/gi,
    /production database/gi,
    /DROP\s+DATABASE/gi,
  ];

  for (
    const pattern
    of forbiddenIndicators
  ) {
    if (
      pattern.test(
        orchestrator,
      )
    ) {
      findings.push({
        file:
          "scripts/nexus-local-postgres-backup-restore.ps1",
        forbiddenIndicator:
          pattern.source,
      });
    }
  }
}

const passed =
  missingFiles.length === 0 &&
  findings.length === 0;

const report = {
  schemaVersion:
    "nexus.backup-restore-integrity-gate.v1",
  passed,
  missingFiles,
  findings,
  realBackupCommandPresent:
    passed,
  isolatedRestoreCommandPresent:
    passed,
  replayContinuityVerificationPresent:
    passed,
  tenantAuthorizationRecoveryVerificationPresent:
    passed,
  productionDatabaseModified:
    false,
};

console.log(
  JSON.stringify(
    report,
    null,
    2,
  ),
);

if (!passed) {
  process.exit(1);
}


