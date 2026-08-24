param(
  [ValidateSet("Resume","Status")]
  [string]$Mode = "Resume"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $repo

$utf8 = [Text.UTF8Encoding]::new($false,$true)
$utf8NoBom = [Text.UTF8Encoding]::new($false)

$policyPath = Join-Path $PSScriptRoot "tara-policy-v1.json"
$roadmapPath = Join-Path $PSScriptRoot "tara-roadmap-v1.json"
$checkpointPath = Join-Path $repo "artifacts\tara\section7b-latest.json"
$evidencePackagePath = Join-Path $repo "artifacts\tara\section7b-evidence-package-v1.json"
$designPath = Join-Path $repo "docs\nexus\phase-0-constitutional-evidence-admission-design-v1.md"

function Read-StrictJson([string]$Path) {
  if (-not (Test-Path $Path)) {
    throw "TARA_STOP: REQUIRED_JSON_MISSING: $Path"
  }

  $text = [IO.File]::ReadAllText(
    (Resolve-Path $Path),
    $utf8
  )

  return $text | ConvertFrom-Json
}

function Save-Json(
  [string]$Path,
  [object]$Value
) {
  [IO.File]::WriteAllText(
    $Path,
    ($Value | ConvertTo-Json -Depth 12),
    $utf8NoBom
  )
}

$policy = Read-StrictJson $policyPath
$roadmap = Read-StrictJson $roadmapPath

$branch = (git branch --show-current).Trim()

if ($branch -ne $policy.requiredBranch) {
  throw "TARA_STOP: WRONG_BRANCH"
}

if (
  $policy.productionDatabaseAccess -ne $false -or
  $policy.supabaseAccess -ne $false -or
  $policy.postgresAccess -ne $false -or
  $policy.databaseUrlAccess -ne $false
) {
  throw "TARA_STOP: POLICY_DATABASE_BOUNDARY_INVALID"
}

if ($Mode -eq "Status") {
  if (Test-Path $checkpointPath) {
    Get-Content $checkpointPath -Raw
  } else {
    "TARA_STATUS=NO_CHECKPOINT"
  }

  exit 0
}

$checkpoint =
  if (Test-Path $checkpointPath) {
    Read-StrictJson $checkpointPath
  } else {
    $null
  }

if (
  $checkpoint -and
  $checkpoint.status -eq "EXTERNAL_OWNER_EVIDENCE_REQUIRED_SAFE_PARK"
) {
  Write-Host ""
  Write-Host "=== NEXUS TARA RESUME ==="
  Write-Host "CHECKPOINT=EXTERNAL_OWNER_EVIDENCE_REQUIRED_SAFE_PARK"
  Write-Host "LOCAL_SAFE_PHASE0_GATES_REMAINING=0"
  Write-Host "PRODUCTION_DB_TOUCHED=NO"
  Write-Host "RUNTIME_INTEGRATION=BLOCKED"
  Write-Host "NEXT=EXTERNAL_OWNER_BOOTSTRAP_EVIDENCE"
  Write-Host "TARA_EXTERNAL_GATE_SAFE_PARK"
  exit 0
}

if (
  $checkpoint -and
  $checkpoint.status -eq "OWNER_REVIEW_REQUIRED"
) {
  Write-Host ""
  Write-Host "=== NEXUS TARA RESUME ==="
  Write-Host "CHECKPOINT=OWNER_REVIEW_REQUIRED"
  Write-Host "NO_COMPLETED_WORK_REPEATED=YES"
  Write-Host "PRODUCTION_DB_TOUCHED=NO"
  Write-Host "NEXT=OWNER_REVIEW_NEXT_GATE"
  Write-Host "TARA_RESUME_SAFE_STOP"
  exit 0
}

# ---------------------------------------------------------
# JOB 1 — SECTION 7B EVIDENCE REVERIFY
# ---------------------------------------------------------

$package = Read-StrictJson $evidencePackagePath

if (
  $package.productionDatabaseTouched -ne $false -or
  $package.postgresTouched -ne $false -or
  $package.supabaseTouched -ne $false
) {
  throw "TARA_STOP: HISTORICAL_EVIDENCE_DATABASE_BOUNDARY_INVALID"
}

if ($package.productionRuntimeIntegration -ne "BLOCKED") {
  throw "TARA_STOP: RUNTIME_BOUNDARY_NOT_BLOCKED"
}

$storePath = Join-Path $repo "lib\nexus\sqliteConstitutionalEvidenceReplayStore.ts"

if (-not (Test-Path $storePath)) {
  throw "TARA_STOP: REPLAY_STORE_MISSING"
}

$currentStoreHash =
  (Get-FileHash $storePath -Algorithm SHA256).Hash

if ($currentStoreHash -ne $package.storeSha256) {
  throw "TARA_STOP: REPLAY_STORE_HASH_DRIFT"
}

$currentDesignHash =
  (Get-FileHash $designPath -Algorithm SHA256).Hash

if ($currentDesignHash -ne $package.designSha256) {
  throw "TARA_STOP: DESIGN_HASH_DRIFT"
}

foreach ($property in $package.testsSha256.PSObject.Properties) {
  $relative = $property.Name
  $expectedHash = [string]$property.Value
  $testPath = Join-Path $repo $relative.TrimStart(".","\")

  if (-not (Test-Path $testPath)) {
    throw "TARA_STOP: EVIDENCE_TEST_MISSING: $relative"
  }

  $actualHash =
    (Get-FileHash $testPath -Algorithm SHA256).Hash

  if ($actualHash -ne $expectedHash) {
    throw "TARA_STOP: EVIDENCE_TEST_HASH_DRIFT: $relative"
  }
}

# ---------------------------------------------------------
# JOB 2 — READ-ONLY NEXT SAFE GATE DISCOVERY
# ---------------------------------------------------------

$design =
  [IO.File]::ReadAllText(
    (Resolve-Path $designPath),
    $utf8
  )

$headingMatches =
  [regex]::Matches(
    $design,
    '(?m)^##+\s+.+$'
  )

$headings = @(
  foreach ($match in $headingMatches) {
    $match.Value.Trim()
  }
)

$section7bIndex = -1

for ($i = 0; $i -lt $headings.Count; $i++) {
  if (
    $headings[$i] -match '^##\s+7B\.'
  ) {
    $section7bIndex = $i
    break
  }
}

if ($section7bIndex -lt 0) {
  throw "TARA_STOP: SECTION7B_HEADING_NOT_FOUND"
}

$nextHeadings = @()

for (
  $i = $section7bIndex + 1;
  $i -lt [Math]::Min(
    $headings.Count,
    $section7bIndex + 7
  );
  $i++
) {
  $nextHeadings += $headings[$i]
}

$blockedLines = @(
  $design -split "`r?`n" |
    Where-Object {
      $_ -match '(?i)\bBLOCKED\b|\bNOT PROVEN\b|\bUNRESOLVED\b|\bREMAINS BLOCKED\b'
    } |
    Select-Object -First 40
)

$discovery = [ordered]@{
  schemaVersion = 1
  tara = "NEXUS TARA AUTOPILOT V1"
  job = "PHASE0_NEXT_SAFE_GATE_DISCOVERY"
  mode = "READ_ONLY"
  section7bEvidenceReverified = $true
  storeSha256 = $currentStoreHash
  designSha256 = $currentDesignHash
  headingsImmediatelyAfterSection7B = $nextHeadings
  blockedOrUnprovenDesignSignals = $blockedLines
  productionDatabaseTouched = $false
  postgresTouched = $false
  supabaseTouched = $false
  runtimeIntegrationAuthorized = $false
  result = "OWNER_REVIEW_REQUIRED"
  createdAt = (Get-Date).ToUniversalTime().ToString("o")
}

$artifactRoot =
  Join-Path $repo "artifacts\tara"

New-Item `
  -ItemType Directory `
  -Force `
  -Path $artifactRoot |
  Out-Null

$discoveryPath =
  Join-Path $artifactRoot "phase0-next-safe-gate-discovery-v1.json"

Save-Json $discoveryPath $discovery

$newCheckpoint = [ordered]@{
  schemaVersion = 1
  tara = "NEXUS TARA AUTOPILOT V1"
  controller = "RESUMABLE_ROADMAP_V1"
  status = "OWNER_REVIEW_REQUIRED"
  completed = @(
    "SECTION7B_EVIDENCE_REVERIFY",
    "PHASE0_NEXT_SAFE_GATE_DISCOVERY"
  )
  next = "OWNER_REVIEW_NEXT_GATE"
  noCompletedWorkRepeated = $true
  productionDatabaseTouched = $false
  postgresTouched = $false
  supabaseTouched = $false
  runtimeIntegrationAuthorized = $false
  discoveryArtifact = $discoveryPath
  updatedAt = (Get-Date).ToUniversalTime().ToString("o")
}

Save-Json $checkpointPath $newCheckpoint

Write-Host ""
Write-Host "=== NEXUS TARA RESUMABLE ROADMAP V1 ==="
Write-Host "SECTION7B_EVIDENCE_REVERIFY=PASS"
Write-Host "NEXT_SAFE_GATE_DISCOVERY=PASS"
Write-Host "COMPLETED_WORK_SKIPPABLE=YES"
Write-Host "PRODUCTION_DB_TOUCHED=NO"
Write-Host "RUNTIME_INTEGRATION=BLOCKED"
Write-Host "RESULT=OWNER_REVIEW_REQUIRED"
Write-Host "NEXT=OWNER_REVIEW_NEXT_GATE"
Write-Host "DISCOVERY_SHA256=$((Get-FileHash $discoveryPath -Algorithm SHA256).Hash)"
Write-Host "TARA_A3_RESUMABLE_CONTROLLER_PASS"