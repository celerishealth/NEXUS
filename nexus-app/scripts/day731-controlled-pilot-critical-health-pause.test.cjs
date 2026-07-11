const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledServicePath = process.argv[2];
const compiledStorePath = process.argv[3];
const migrationPath = process.argv[4];

if (
  !compiledServicePath ||
  !compiledStorePath ||
  !migrationPath
) {
  throw new Error(
    "Compiled Day 731 module paths or migration path were not provided.",
  );
}

const {
  pauseControlledPilotForCriticalHealth,
} = require(path.resolve(compiledServicePath));

const {
  SupabaseControlledPilotAtomicHealthPauseStore,
} = require(path.resolve(compiledStorePath));

function signal(overrides = {}) {
  return {
    tenantId: "tenant-731",
    signalId: "signal-731",
    signalSource: "pilot-health-monitor",
    severity: "critical",
    observedAt: 90_000,
    expectedStateVersion: 9,
    ...overrides,
  };
}

class FakePauseStore {
  constructor(status = "committed") {
    this.status = status;
    this.calls = [];
  }

  async commitCriticalPause(record) {
    this.calls.push({
      ...record,
    });

    if (this.status === "throw") {
      throw new Error(
        "simulated atomic pause failure",
      );
    }

    if (
      this.status === "committed" ||
      this.status === "already-committed"
    ) {
      return {
        status: this.status,
        operationStatus: "paused",
        blockingSignalId:
          record.signalId,
        stateVersion:
          record.expectedStateVersion + 1,
      };
    }

    return {
      status: this.status,
      currentOperationStatus: "paused",
      currentBlockingSignalId:
        "existing-signal",
      currentStateVersion:
        record.expectedStateVersion + 1,
    };
  }
}

async function run() {
  const nonCriticalStore =
    new FakePauseStore();

  const nonCritical =
    await pauseControlledPilotForCriticalHealth({
      signal: signal({
        severity: "degraded",
      }),
      store: nonCriticalStore,
    });

  assert.equal(nonCritical.applied, false);

  assert.equal(
    nonCritical.code,
    "CRITICAL_HEALTH_SIGNAL_REQUIRED",
  );

  assert.equal(
    nonCriticalStore.calls.length,
    0,
  );

  const successStore =
    new FakePauseStore();

  const success =
    await pauseControlledPilotForCriticalHealth({
      signal: signal(),
      store: successStore,
    });

  assert.equal(success.applied, true);

  assert.equal(
    success.code,
    "CRITICAL_HEALTH_PAUSE_COMMITTED",
  );

  assert.equal(
    success.operationStatus,
    "paused",
  );

  assert.equal(
    success.blockingSignalId,
    "signal-731",
  );

  assert.equal(success.stateVersion, 10);

  assert.equal(
    success.pilotOperationPermitted,
    false,
  );

  assert.equal(
    success.automaticResumeAuthorized,
    false,
  );

  assert.equal(
    success.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    success.publicLaunchAuthorized,
    false,
  );

  assert.equal(successStore.calls.length, 1);

  assert.equal(
    successStore.calls[0].tenantId,
    "tenant-731",
  );

  assert.equal(
    successStore.calls[0].severity,
    "critical",
  );

  const idempotent =
    await pauseControlledPilotForCriticalHealth({
      signal: signal(),
      store:
        new FakePauseStore(
          "already-committed",
        ),
    });

  assert.equal(idempotent.applied, true);

  assert.equal(
    idempotent.code,
    "CRITICAL_HEALTH_PAUSE_ALREADY_COMMITTED",
  );

  assert.equal(
    idempotent.pilotOperationPermitted,
    false,
  );

  const conflict =
    await pauseControlledPilotForCriticalHealth({
      signal: signal(),
      store:
        new FakePauseStore(
          "state-version-conflict",
        ),
    });

  assert.equal(conflict.applied, false);

  assert.equal(
    conflict.code,
    "PILOT_STATE_VERSION_CONFLICT",
  );

  assert.equal(
    conflict.currentStateVersion,
    10,
  );

  const alreadyPaused =
    await pauseControlledPilotForCriticalHealth({
      signal: signal(),
      store:
        new FakePauseStore(
          "already-paused",
        ),
    });

  assert.equal(
    alreadyPaused.applied,
    false,
  );

  assert.equal(
    alreadyPaused.code,
    "PILOT_ALREADY_PAUSED",
  );

  assert.equal(
    alreadyPaused.pilotOperationPermitted,
    false,
  );

  const bindingConflict =
    await pauseControlledPilotForCriticalHealth({
      signal: signal(),
      store:
        new FakePauseStore(
          "binding-conflict",
        ),
    });

  assert.equal(
    bindingConflict.applied,
    false,
  );

  assert.equal(
    bindingConflict.code,
    "HEALTH_PAUSE_BINDING_CONFLICT",
  );

  const unavailable =
    await pauseControlledPilotForCriticalHealth({
      signal: signal(),
      store:
        new FakePauseStore(
          "commit-unavailable",
        ),
    });

  assert.equal(unavailable.applied, false);

  assert.equal(
    unavailable.code,
    "ATOMIC_HEALTH_PAUSE_REQUIRED",
  );

  const serviceRoleKey =
    "day-731-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseStore =
    new SupabaseControlledPilotAtomicHealthPauseStore({
      supabaseUrl:
        "https://example.supabase.co/",
      serviceRoleKey,
      fetchFunction:
        async (url, options) => {
          requests.push({
            url,
            options,
          });

          return {
            ok: true,
            async json() {
              return [
                {
                  status: "committed",
                  operation_status:
                    "paused",
                  blocking_signal_id:
                    "signal-731",
                  state_version: "10",
                },
              ];
            },
          };
        },
    });

  const persisted =
    await supabaseStore.commitCriticalPause({
      tenantId: "tenant-731",
      signalId: "signal-731",
      signalSource:
        "pilot-health-monitor",
      severity: "critical",
      observedAt: 90_000,
      expectedStateVersion: 9,
    });

  assert.deepEqual(persisted, {
    status: "committed",
    operationStatus: "paused",
    blockingSignalId: "signal-731",
    stateVersion: 10,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_commit_controlled_pilot_health_pause$/,
  );

  assert.equal(
    requests[0].options.headers.apikey,
    serviceRoleKey,
  );

  assert.equal(
    requests[0].options.cache,
    "no-store",
  );

  const requestBody =
    JSON.parse(
      requests[0].options.body,
    );

  assert.deepEqual(requestBody, {
    p_tenant_id: "tenant-731",
    p_signal_id: "signal-731",
    p_signal_source:
      "pilot-health-monitor",
    p_severity: "critical",
    p_observed_at_epoch: 90_000,
    p_expected_state_version: 9,
  });

  const crossSignalStore =
    new SupabaseControlledPilotAtomicHealthPauseStore({
      supabaseUrl:
        "https://example.supabase.co",
      serviceRoleKey,
      fetchFunction: async () => ({
        ok: true,
        async json() {
          return [
            {
              status: "committed",
              operation_status:
                "paused",
              blocking_signal_id:
                "different-signal",
              state_version: 10,
            },
          ];
        },
      }),
    });

  assert.deepEqual(
    await crossSignalStore.commitCriticalPause({
      tenantId: "tenant-731",
      signalId: "signal-731",
      signalSource:
        "pilot-health-monitor",
      severity: "critical",
      observedAt: 90_000,
      expectedStateVersion: 9,
    }),
    {
      status: "commit-unavailable",
    },
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /nexus_controlled_pilot_health_pause_events/i,
  );

  assert.match(
    migration,
    /primary key\s*\(\s*tenant_id,\s*signal_id\s*\)/i,
  );

  assert.match(
    migration,
    /severity = 'critical'/i,
  );

  assert.match(
    migration,
    /for update/i,
  );

  assert.match(
    migration,
    /operation_status = 'paused'/i,
  );

  assert.match(
    migration,
    /blocking_signal_id = trim\(p_signal_id\)/i,
  );

  assert.match(
    migration,
    /state_version = new_state_version/i,
  );

  assert.match(
    migration,
    /enable row level security/i,
  );

  assert.match(
    migration,
    /force row level security/i,
  );

  assert.match(
    migration,
    /security definer/i,
  );

  assert.match(
    migration,
    /grant execute[\s\S]*to service_role/i,
  );

  assert.match(
    migration,
    /from authenticated/i,
  );

  console.log(
    "DAY 731 TARGETED TEST PASS: critical-only health pause, exact-tenant locking, active-to-paused transition, blocking-signal binding, optimistic state versioning, idempotent retries and fail-closed database handling verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
