const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledGatePath = process.argv[2];
const compiledReaderPath = process.argv[3];
const migrationPath = process.argv[4];

if (
  !compiledGatePath ||
  !compiledReaderPath ||
  !migrationPath
) {
  throw new Error(
    "Compiled Day 730 module paths or migration path were not provided.",
  );
}

const {
  authorizeControlledPilotOperation,
} = require(path.resolve(compiledGatePath));

const {
  SupabaseControlledPilotOperationStateReader,
} = require(path.resolve(compiledReaderPath));

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "operator-730",
    tenantId: "tenant-730",
    roles: ["operator"],
    sessionId: "session-730",
    ...overrides,
  };
}

class FakeStateReader {
  constructor(result) {
    this.result = result;
    this.calls = [];
  }

  async readTenantState(tenantId) {
    this.calls.push(tenantId);

    if (this.result === "throw") {
      throw new Error(
        "simulated state read failure",
      );
    }

    return this.result;
  }
}

async function run() {
  const unauthenticatedReader =
    new FakeStateReader({
      status: "found",
      state: {
        tenantId: "tenant-730",
        operationStatus: "active",
        blockingSignalId: null,
        stateVersion: 8,
        lastTransitionAt: 80_000,
      },
    });

  const unauthenticated =
    await authorizeControlledPilotOperation({
      identity: identity({
        authenticated: false,
      }),
      expectedStateVersion: 8,
      stateReader:
        unauthenticatedReader,
    });

  assert.equal(
    unauthenticated.permitted,
    false,
  );

  assert.equal(
    unauthenticated.code,
    "AUTHENTICATION_REQUIRED",
  );

  assert.equal(
    unauthenticatedReader.calls.length,
    0,
  );

  const wrongRoleReader =
    new FakeStateReader({
      status: "not-found",
    });

  const wrongRole =
    await authorizeControlledPilotOperation({
      identity: identity({
        roles: ["viewer"],
      }),
      expectedStateVersion: 8,
      stateReader: wrongRoleReader,
    });

  assert.equal(wrongRole.permitted, false);

  assert.equal(
    wrongRole.code,
    "PILOT_OPERATOR_ROLE_REQUIRED",
  );

  assert.equal(
    wrongRoleReader.calls.length,
    0,
  );

  const missing =
    await authorizeControlledPilotOperation({
      identity: identity(),
      expectedStateVersion: 8,
      stateReader:
        new FakeStateReader({
          status: "not-found",
        }),
    });

  assert.equal(missing.permitted, false);

  assert.equal(
    missing.code,
    "PILOT_STATE_NOT_FOUND",
  );

  const paused =
    await authorizeControlledPilotOperation({
      identity: identity(),
      expectedStateVersion: 8,
      stateReader:
        new FakeStateReader({
          status: "found",
          state: {
            tenantId: "tenant-730",
            operationStatus: "paused",
            blockingSignalId:
              "signal-730",
            stateVersion: 8,
            lastTransitionAt: 80_000,
          },
        }),
    });

  assert.equal(paused.permitted, false);

  assert.equal(
    paused.code,
    "PILOT_OPERATION_PAUSED",
  );

  assert.equal(
    paused.blockingSignalId,
    "signal-730",
  );

  const wrongTenant =
    await authorizeControlledPilotOperation({
      identity: identity(),
      expectedStateVersion: 8,
      stateReader:
        new FakeStateReader({
          status: "found",
          state: {
            tenantId: "tenant-other",
            operationStatus: "active",
            blockingSignalId: null,
            stateVersion: 8,
            lastTransitionAt: 80_000,
          },
        }),
    });

  assert.equal(
    wrongTenant.permitted,
    false,
  );

  assert.equal(
    wrongTenant.code,
    "PILOT_STATE_TENANT_MISMATCH",
  );

  const stale =
    await authorizeControlledPilotOperation({
      identity: identity(),
      expectedStateVersion: 7,
      stateReader:
        new FakeStateReader({
          status: "found",
          state: {
            tenantId: "tenant-730",
            operationStatus: "active",
            blockingSignalId: null,
            stateVersion: 8,
            lastTransitionAt: 80_000,
          },
        }),
    });

  assert.equal(stale.permitted, false);

  assert.equal(
    stale.code,
    "PILOT_STATE_VERSION_CONFLICT",
  );

  assert.equal(
    stale.currentStateVersion,
    8,
  );

  const unavailable =
    await authorizeControlledPilotOperation({
      identity: identity(),
      expectedStateVersion: 8,
      stateReader:
        new FakeStateReader({
          status: "reader-unavailable",
        }),
    });

  assert.equal(
    unavailable.permitted,
    false,
  );

  assert.equal(
    unavailable.code,
    "PILOT_STATE_READER_UNAVAILABLE",
  );

  const thrown =
    await authorizeControlledPilotOperation({
      identity: identity(),
      expectedStateVersion: 8,
      stateReader:
        new FakeStateReader("throw"),
    });

  assert.equal(thrown.permitted, false);

  assert.equal(
    thrown.code,
    "PILOT_STATE_READER_UNAVAILABLE",
  );

  const allowedReader =
    new FakeStateReader({
      status: "found",
      state: {
        tenantId: "tenant-730",
        operationStatus: "active",
        blockingSignalId: null,
        stateVersion: 8,
        lastTransitionAt: 80_000,
      },
    });

  const allowed =
    await authorizeControlledPilotOperation({
      identity: identity(),
      expectedStateVersion: 8,
      stateReader: allowedReader,
    });

  assert.equal(allowed.permitted, true);

  assert.equal(
    allowed.code,
    "CONTROLLED_PILOT_OPERATION_PERMITTED",
  );

  assert.equal(
    allowed.tenantId,
    "tenant-730",
  );

  assert.equal(
    allowed.stateVersion,
    8,
  );

  assert.equal(
    allowed.pilotOperationPermitted,
    true,
  );

  assert.equal(
    allowed.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    allowed.publicLaunchAuthorized,
    false,
  );

  assert.deepEqual(
    allowedReader.calls,
    ["tenant-730"],
  );

  const requests = [];

  const serviceRoleKey =
    "day-730-server-only-service-role-key-long-enough";

  const supabaseReader =
    new SupabaseControlledPilotOperationStateReader({
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
                  tenant_id:
                    "tenant-730",
                  operation_status:
                    "active",
                  blocking_signal_id:
                    null,
                  state_version: "8",
                  last_transition_at_epoch:
                    "80000",
                },
              ];
            },
          };
        },
    });

  const persistedState =
    await supabaseReader.readTenantState(
      "tenant-730",
    );

  assert.deepEqual(persistedState, {
    status: "found",
    state: {
      tenantId: "tenant-730",
      operationStatus: "active",
      blockingSignalId: null,
      stateVersion: 8,
      lastTransitionAt: 80_000,
    },
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_read_controlled_pilot_operation_state$/,
  );

  assert.equal(
    requests[0].options.headers.apikey,
    serviceRoleKey,
  );

  assert.equal(
    requests[0].options.cache,
    "no-store",
  );

  const body = JSON.parse(
    requests[0].options.body,
  );

  assert.deepEqual(body, {
    p_tenant_id: "tenant-730",
  });

  const crossTenantReader =
    new SupabaseControlledPilotOperationStateReader({
      supabaseUrl:
        "https://example.supabase.co",
      serviceRoleKey,
      fetchFunction: async () => ({
        ok: true,
        async json() {
          return [
            {
              tenant_id:
                "attacker-tenant",
              operation_status:
                "active",
              blocking_signal_id:
                null,
              state_version: 8,
              last_transition_at_epoch:
                80_000,
            },
          ];
        },
      }),
    });

  assert.deepEqual(
    await crossTenantReader.readTenantState(
      "tenant-730",
    ),
    {
      status: "reader-unavailable",
    },
  );

  const invalidActiveStateReader =
    new SupabaseControlledPilotOperationStateReader({
      supabaseUrl:
        "https://example.supabase.co",
      serviceRoleKey,
      fetchFunction: async () => ({
        ok: true,
        async json() {
          return [
            {
              tenant_id:
                "tenant-730",
              operation_status:
                "active",
              blocking_signal_id:
                "signal-should-not-exist",
              state_version: 8,
              last_transition_at_epoch:
                80_000,
            },
          ];
        },
      }),
    });

  assert.deepEqual(
    await invalidActiveStateReader.readTenantState(
      "tenant-730",
    ),
    {
      status: "reader-unavailable",
    },
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /nexus_read_controlled_pilot_operation_state/i,
  );

  assert.match(
    migration,
    /where state\.tenant_id = trim\(p_tenant_id\)/i,
  );

  assert.match(
    migration,
    /security definer/i,
  );

  assert.match(
    migration,
    /stable/i,
  );

  assert.match(
    migration,
    /revoke all[\s\S]*from public/i,
  );

  assert.match(
    migration,
    /from authenticated/i,
  );

  assert.match(
    migration,
    /grant execute[\s\S]*to service_role/i,
  );

  console.log(
    "DAY 730 TARGETED TEST PASS: persistent tenant-state enforcement, paused-operation blocking, stale-version blocking, cross-tenant rejection, trusted-role enforcement and fail-closed state reads verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
