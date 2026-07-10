$ErrorActionPreference = "Stop"

$composeFile =
    "docker-compose.nexus-postgres.yml"

$projectName =
    "nexus-day-674"

$fixtureId =
    [Guid]::NewGuid().
        ToString("N").
        Substring(0, 16).
        ToLowerInvariant()

$tempDirectory =
    Join-Path `
        ([System.IO.Path]::GetTempPath()) `
        "nexus-day-674-$fixtureId"

$backupPath =
    Join-Path `
        $tempDirectory `
        "nexus-security.backup"

$previousDatabaseUrl =
    $env:DATABASE_URL

$previousDatabaseSslMode =
    $env:NEXUS_DATABASE_SSL_MODE

$previousMigrationAuthorization =
    $env:NEXUS_MIGRATION_AUTHORIZATION

$previousFixtureId =
    $env:NEXUS_BACKUP_FIXTURE_ID

$previousBackupSha =
    $env:NEXUS_BACKUP_SHA256

$composeStarted = $false

try {
    New-Item `
        -ItemType Directory `
        -Force `
        -Path $tempDirectory |
        Out-Null

    $env:DATABASE_URL =
        "postgresql://nexus:nexus_local_security@127.0.0.1:55432/nexus_security"

    $env:NEXUS_DATABASE_SSL_MODE =
        "disable"

    $env:NEXUS_MIGRATION_AUTHORIZATION =
        "APPLY_NEXUS_SECURITY_MIGRATIONS"

    $env:NEXUS_BACKUP_FIXTURE_ID =
        $fixtureId

    docker compose `
        -f $composeFile `
        -p $projectName `
        up -d

    if ($LASTEXITCODE -ne 0) {
        throw "Disposable PostgreSQL startup failed."
    }

    $composeStarted = $true
    $databaseReady = $false

    for (
        $attempt = 1;
        $attempt -le 45;
        $attempt++
    ) {
        docker compose `
            -f $composeFile `
            -p $projectName `
            exec -T postgres `
            pg_isready `
            -U nexus `
            -d nexus_security *> $null

        if ($LASTEXITCODE -eq 0) {
            $databaseReady = $true
            break
        }

        Start-Sleep -Seconds 2
    }

    if (!$databaseReady) {
        throw "Disposable PostgreSQL did not become healthy."
    }

    node `
        "scripts\nexus-postgres-migrate.mjs" `
        --apply

    if ($LASTEXITCODE -ne 0) {
        throw "Local migration application failed."
    }

    node `
        "scripts\nexus-local-postgres-backup-restore-gate.mjs" `
        --seed

    if ($LASTEXITCODE -ne 0) {
        throw "Backup fixture seeding failed."
    }

    docker compose `
        -f $composeFile `
        -p $projectName `
        exec -T postgres `
        pg_dump `
        -U nexus `
        -d nexus_security `
        --format=custom `
        --no-owner `
        --no-privileges `
        --file=/tmp/nexus-day-674.backup

    if ($LASTEXITCODE -ne 0) {
        throw "Real PostgreSQL backup creation failed."
    }

    $containerId = (
        docker compose `
            -f $composeFile `
            -p $projectName `
            ps -q postgres
    ).Trim()

    if (!$containerId) {
        throw "PostgreSQL container ID could not be resolved."
    }

    docker cp `
        "${containerId}:/tmp/nexus-day-674.backup" `
        $backupPath

    if ($LASTEXITCODE -ne 0) {
        throw "Backup extraction from the disposable container failed."
    }

    if (!(Test-Path $backupPath)) {
        throw "Backup file was not created."
    }

    $backupFile =
        Get-Item $backupPath

    if ($backupFile.Length -le 0) {
        throw "Backup file is empty."
    }

    $backupHash = (
        Get-FileHash `
            -Algorithm SHA256 `
            -Path $backupPath
    ).Hash.ToLowerInvariant()

    if (
        $backupHash -notmatch
        "^[a-f0-9]{64}$"
    ) {
        throw "Backup SHA-256 checksum is invalid."
    }

    $env:NEXUS_BACKUP_SHA256 =
        $backupHash

    docker compose `
        -f $composeFile `
        -p $projectName `
        exec -T postgres `
        dropdb `
        -U nexus `
        --if-exists `
        nexus_security_restore

    if ($LASTEXITCODE -ne 0) {
        throw "Existing restore database cleanup failed."
    }

    docker compose `
        -f $composeFile `
        -p $projectName `
        exec -T postgres `
        createdb `
        -U nexus `
        nexus_security_restore

    if ($LASTEXITCODE -ne 0) {
        throw "Isolated restore database creation failed."
    }

    docker compose `
        -f $composeFile `
        -p $projectName `
        exec -T postgres `
        pg_restore `
        -U nexus `
        -d nexus_security_restore `
        --no-owner `
        --no-privileges `
        --exit-on-error `
        /tmp/nexus-day-674.backup

    if ($LASTEXITCODE -ne 0) {
        throw "Real PostgreSQL restore failed."
    }

    $env:DATABASE_URL =
        "postgresql://nexus:nexus_local_security@127.0.0.1:55432/nexus_security_restore"

    node `
        "scripts\nexus-postgres-migrate.mjs" `
        --status

    if ($LASTEXITCODE -ne 0) {
        throw "Restored migration status verification failed."
    }

    node `
        "scripts\nexus-local-postgres-backup-restore-gate.mjs" `
        --verify

    if ($LASTEXITCODE -ne 0) {
        throw "Restored security-state verification failed."
    }

    Write-Output ""
    Write-Output "DAY 674 REAL BACKUP SHA256"
    Write-Output $backupHash
}
finally {
    if ($composeStarted) {
        docker compose `
            -f $composeFile `
            -p $projectName `
            down -v --remove-orphans |
            Out-Host
    }

    if (Test-Path $tempDirectory) {
        Remove-Item `
            -Recurse `
            -Force `
            $tempDirectory
    }

    if ($null -eq $previousDatabaseUrl) {
        Remove-Item `
            "Env:DATABASE_URL" `
            -ErrorAction SilentlyContinue
    }
    else {
        $env:DATABASE_URL =
            $previousDatabaseUrl
    }

    if ($null -eq $previousDatabaseSslMode) {
        Remove-Item `
            "Env:NEXUS_DATABASE_SSL_MODE" `
            -ErrorAction SilentlyContinue
    }
    else {
        $env:NEXUS_DATABASE_SSL_MODE =
            $previousDatabaseSslMode
    }

    if ($null -eq $previousMigrationAuthorization) {
        Remove-Item `
            "Env:NEXUS_MIGRATION_AUTHORIZATION" `
            -ErrorAction SilentlyContinue
    }
    else {
        $env:NEXUS_MIGRATION_AUTHORIZATION =
            $previousMigrationAuthorization
    }

    if ($null -eq $previousFixtureId) {
        Remove-Item `
            "Env:NEXUS_BACKUP_FIXTURE_ID" `
            -ErrorAction SilentlyContinue
    }
    else {
        $env:NEXUS_BACKUP_FIXTURE_ID =
            $previousFixtureId
    }

    if ($null -eq $previousBackupSha) {
        Remove-Item `
            "Env:NEXUS_BACKUP_SHA256" `
            -ErrorAction SilentlyContinue
    }
    else {
        $env:NEXUS_BACKUP_SHA256 =
            $previousBackupSha
    }
}
